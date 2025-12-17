from db import Session
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound, IntegrityError
from typing import Optional
from pyramid.view import view_config
from pydantic import BaseModel, ValidationError
from pyramid.response import Response
from models.destination_model import Destination
from . import serialization_data
from helpers.jwt_validate_helper import jwt_validate
import os
import uuid
from pathlib import Path

class DestinationFilterRequest(BaseModel):
    country: Optional[str] = None
    name: Optional[str] = None

class DestinationRequest(BaseModel):
    country: str
    name: str
    description: str
    photo_url: str


@view_config(route_name="destinations", request_method="GET", renderer="json")
def destinations(request):
    country = request.params.get("country")
    name = request.params.get("name")

    # get destination from db
    with Session() as session:
        stmt = select(Destination)
        
        if country:
            stmt = stmt.where(Destination.country == country)
        if name:
            stmt = stmt.where(Destination.name == name)

        try:
            #pakai all, agar kembali semua atau tidak sama sekali
            result = session.execute(stmt).scalars().all()
            return [serialization_data(dest) for dest in result]
        except Exception as e:
            print(e)
            return Response(json_body={"error": "Internal Server Error"}, status=500)


@view_config(route_name="destination_detail", request_method="GET", renderer="json")
def destination_detail(request):
    dest_id = request.matchdict.get("id")
    with Session() as session:
        stmt = select(Destination).where(Destination.id == dest_id)
        try:
            result = session.execute(stmt).scalars().one()  # tampilkan 1 data
            return serialization_data(result)  # serialisasikan
        except NoResultFound:
            return Response(json_body={"error": "Destination not founfd"}, status=404)
        except Exception as e:
            print(e)
            return Response(
                json_body={"error": "Invalid ID or server error"}, status=400
            )


@view_config(route_name="destinations", request_method="POST", renderer="json")
@jwt_validate
def create_destinations(request):
    # Agent forbidden 
    if request.jwt_claims["role"] != "agent":
        return Response(
            json_body={"error": "Forbidden : Only agent can access"}, status=403
        )
    
    try:
        # Check content type
        is_json = request.content_type and 'application/json' in request.content_type
       #json 
        if is_json:
            req_data = DestinationRequest(**request.json_body)
            
        else:
            #form 
            storage_dir = Path("storage/destinations")
            storage_dir.mkdir(parents=True, exist_ok=True)
            
            # Extract values from multidict - iterate to find strings
            name = None
            description = None
            country = None
            photo_file = None
            
            for key in request.POST.keys():
                value = request.POST[key]
                if key == "photo" and hasattr(value, 'filename'):
                    photo_file = value
                elif key == "name":
                    name = value if isinstance(value, str) else str(value)
                elif key == "description":
                    description = value if isinstance(value, str) else str(value)
                elif key == "country":
                    country = value if isinstance(value, str) else str(value)
            
            print(f"DEBUG - Extracted: name={name}, desc={description}, country={country}, photo={photo_file}")
            
            #validasi required 
            if not name or not description or not country:
                return Response(
                    json_body={"error": "Missing required fields: name, description, country"}, 
                    status=400
                )
            
            if photo_file is None:
                return Response(json_body={"error": "Photo file is required"}, status=400)
            
            # Validasi file 
            filename = photo_file.filename
            if not filename:
                return Response(
                    json_body={"error": "Photo file is required"}, 
                    status=400
                )
            
            allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
            file_ext = Path(filename).suffix.lower()
            
            if file_ext not in allowed_extensions:
                return Response(
                    json_body={"error": f"File type not allowed. Allowed: {', '.join(allowed_extensions)}"}, 
                    status=400
                )
            
            # validasi size file 
            file_content = photo_file.file.read()
            if len(file_content) > 5 * 1024 * 1024:
                return Response(json_body={"error": "File size exceeds 5MB limit"}, status=400)
            
            # save foto 
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = storage_dir / unique_filename
            
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            photo_url = f"/destinations/{unique_filename}"
            
            # create request 
            req_data = DestinationRequest(
                name=name,
                description=description,
                country=country,
                photo_url=photo_url
            )

    except ValidationError as err:
        return Response(json_body={"error": str(err.errors())}, status=400)
    except Exception as e:
        print(f"Request error: {e}")
        import traceback
        traceback.print_exc()
        return Response(json_body={"error": f"Invalid request: {str(e)}"}, status=400)

    # Save to database
    with Session() as session:
        new_destination = Destination(
            name=req_data.name,
            description=req_data.description,
            photo_url=req_data.photo_url,
            country=req_data.country,
        )

        try:
            session.add(new_destination)
            session.commit()
            session.refresh(new_destination)
            return serialization_data(new_destination)
        except IntegrityError as err:
            session.rollback()
            return Response(json_body={"error": str(err.orig)}, status=409)
        except Exception as e:
            session.rollback()
            print(f"CRITICAL ERROR: {e}")
            return Response(
                json_body={"error": f"Internal Server Error: {str(e)}"}, status=500
            )
