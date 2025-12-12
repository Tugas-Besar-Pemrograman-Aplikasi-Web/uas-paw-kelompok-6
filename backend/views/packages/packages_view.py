from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy import select, or_
from sqlalchemy.exc import NoResultFound, IntegrityError
from db import Session
from models.package_model import Package
from models.user_model import User
from models.destination_model import Destination
from helpers.jwt_validate_helper import jwt_validate
from pydantic import BaseModel, Field, ValidationError
from typing import Optional, List
import uuid

#class pkg for pkg create 
class PackageRequest(BaseModel):
    destinationId: str
    name: str
    duration: int = Field(gt=0)
    price: float = Field(gt=0)
    itinerary: str
    maxTravelers: int = Field(gt=0)
    contactPhone: str
    images: List[str]

#class pkg for update 
class PackageUpdateRequest(BaseModel):
    name: Optional[str] = None
    duration: Optional[int] = None
    price: Optional[float] = None
    itinerary: Optional[str] = None
    maxTravelers: Optional[int] = None
    contactPhone: Optional[str] = None
    images: Optional[List[str]] = None

#to return json style
def serialization_data(pkg):
    return {
        "id": str(pkg.id),
        "agentId": str(pkg.agent_id),
        "destinationId": str(pkg.destination_id),
        "name": pkg.name,
        "duration": pkg.duration,
        "price": float(pkg.price),
        "itinerary": pkg.itinerary,
        "maxTravelers": pkg.max_travelers,
        "contactPhone": pkg.contact_phone,
        "images": pkg.images,
        "rating": 0, 
        "reviewsCount": 0,
        "destinationName": pkg.destination.name if pkg.destination else None,
        "country": pkg.destination.country if pkg.destination else None
    }

#public 
#get api for pkg /api/packages (list and search by)
@view_config(route_name="packages", request_method="GET", renderer="json")
def get_packages(request):
    #get params
    destination_id=request.params.get("destination")
    search_query=request.params.get("q") or request.params.get("search")
    min_price = request.params.get("minPrice")
    max_price = request.params.get("maxPrice")

    sort_by = request.params.get("sortBy") # price, duration, date
    order = request.params.get("order", "asc") # asc, desc

    with Session() as session :
        stmt = select(Package)

        #ketika id true dan id tidak sama dengan id lainnya
        if destination_id and destination_id != 'all':
            try :
                uuid.UUID(destination_id)
                stmt = stmt.where(Package.destination_id == destination_id)
            except ValueError :
                pass 
        
        if search_query:
            #list berdasarkan nama 
            stmt=stmt.where(Package.name.ilike(f"%{search_query}%"))

        if min_price :
            #list berdasarkan harga lebih besar dari 
            stmt=stmt.where(Package.price>=float(min_price))

        if max_price :
            #list berdasarkan harga lebih kecil dari 
            stmt=stmt.where(Package.price<=float(max_price))

        if sort_by == 'price':
            sort_column=Package.price
        elif sort_by=='duration':
            sort_column=Package.duration
        else:
            sort_column=Package.create_at

        if order_by == 'desc':
            stmt = stmt.order_by(desc(sort_column))
        else :
            stmt = stmt.order_by(asc(sort_column))

        try :
            #hasilnya bisa 1 atau lebih atau 0 
            results = session.execute(stmt).scalars().all()
            return [serialization_data(pkg) for pkg in results]
        except Exception as e :
            print (f"Error fetching packages : {e}")
            return Response(json_body={"error":"Internal server error"}, status=500)

#get for 1 items /api/packages/{id}
@view_config(route_name="package_detail", request_method="GET", renderer="json")
def package_detail(request):
    #get params
    pkg_id = request.matchdict.get("id")

    with Session() as session:
        try :
            #cari oackage yang sesuai dengan id 
            stmt = select(Package).where(Package.id == pkg_id)
            pkg = session.execute(stmt).scalars().one()
            
            #jangan pake for, karena cuma 1 data 
            return serialization_data(pkg)
        except NoResultFound :
            return Response(json_body={"message":"Package not found"}, status=404)
        except Exception as e :
            print (f"Error detail package: {e}")
            return Response(json_body={"error":"Invalid ID or Server Error"}, status=400)

#Get /api/packages/agent/{agent_id}
@view_config(route_name="package_agent", request_method="GET", renderer="json")
def get_package_by_agent(request):
    agent_id=request.matchdict.get("agentId")

    with Session() as session:
        try:
            uuid.UUID(agent_id)
        except ValueError:
             return Response(json_body={"error": "Invalid Agent ID format"}, status=400)

        stmt = stmt.select(Package).where(Package.agent_id==agent_id).order_by(desc(Package.create_at))

        try:
            results = session.execute(stmt).scalars().all()
            return [serialization_data(pkg) for pkg in results]
        except Exception as e:
            print(f"Error fetching agent packages: {e}")
            return Response(json_body={"error": "Internal Server Error"}, status=500)

#agent utilities
#post /api/packages create package 
@view_config(route_name="packages", request_method="POST", renderer="json")
@jwt_validate
def create_package(request):
    #user validation
    if request.jwt_claims.get("role") != "agent":
        return Response(json_body={"error":"Forbidden : Only agent can access"}, status=403)

    #input validation 
    try :
        req_data = PackageRequest(**request.json_body)
    except ValidationError as err :
        return Response(json_body={"error": str(err.errors())}, status=400)

    #new package to db 
    with Session() as session:
        #destinasi harus valid 
        dest_stmt = select(Destination).where(Destination.id == req_data.destinationId)
        try : 
            session.execute(dest_stmt).scalars().one()
        except NoResultFound:
            return Response(json_body={"error":"Destination id not found"}, status=400)

        try:
            # Convert string UUID to objek UUID Python
            agent_uuid = uuid.UUID(request.jwt_claims["sub"])
            dest_uuid = uuid.UUID(req_data.destinationId)
        except ValueError:
            return Response(json_body={"error": "Invalid UUID format"}, status=400)

        new_package = Package(
            agent_id=agent_uuid,
            destination_id=dest_uuid,
            name=req_data.name,
            duration=req_data.duration,
            price=req_data.price,
            itinerary=req_data.itinerary,
            max_travelers=req_data.maxTravelers,
            contact_phone=req_data.contactPhone,
            images=req_data.images
        )

        try : 
            session.add(new_package)
            session.commit()
            session.refresh(new_package)
            return serialization_data(new_package)
        except IntegrityError as err:
            session.rollback()
            return Response(json_body={"error": str(err.orig)}, status=409)
        except Exception as e:
            session.rollback() # Selalu rollback jika error
            print(f"CRITICAL ERROR: {e}") # Print error ke terminal agar bisa didebug
            return Response(json_body={"error": f"Internal Server Error: {str(e)}"}, status=500)

#put /api/packages/{id} update  
@view_config(route_name="package_detail", request_method="PUT", renderer="json")
@jwt_validate
def update_package(request):
    #user validation
    if request.jwt_claims.get("role") != "agent":
        return Response(json_body={"error":"Forbidden : Only agent can access"}, status=403)
    
    #id package_detail
    pkg_id = request.matchdict.get("id")
    
    try : 
        req_data = PackageUpdateRequest(**request.json_body)
    except ValidationError as err :
        return Response(json_body={"error": str(err.errors())}, status=400)

    with Session() as session :
        stmt = stmt.select(Package).where(Package.id == pkg_id)
        try :
            pkg = session.execute(stmt).scalars().one()
        except NoResultFound :
            return Response(json_body={"message": "Package not found"}, status=404)
        
        #hanya agent yang memiliki package dapat update package_detail
        if str(pkg.agent_id) != request.jwt_claims["sub"]:
            return Response(json_body={"error": "Forbidden: You do not own this package"}, status=403)

        update_data = req_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key == "maxTravelers": key = "max_travelers"
            if key == "contactPhone": key = "contact_phone"
            setattr(pkg, key, value)

        try :
            session.commit()
            session.refresh(pkg)
            return serialization_data(pkg)
        except Exception as e:
            session.rollback()
            print(e)
            return Response(json_body={"error": "Update failed"}, status=500)


#delete /api/packages/{id}
@view_config(route_name="package_detail", request_method="DELETE", renderer="json")
@jwt_validate
def delete_package(request):
    #user validation
    if request.jwt_claims.get("role") != "agent":
        return Response(json_body={"error":"Forbidden : Only agent can access"}, status=403)

    pkg_id=request.matchdict.get("id")
    
    with Session() as session :
        stmt = stmt.select(Package).where(Package.id==pkg_id)
        try :
            pkg = session.execute(stmt).scalars().one()
        except NoResultFound:
            return Response(json_body={"error":"Package not found"},status=404)

    if str(pkg.agent_id) != request.jwt_claims["sub"]:
        return Response(json_body={"error":"Forbidden: You dont own this package"}, status = 403)

    try :
        session.delete(pkg)
        session.commit()
        return{"message":"Package Successfully Deleted"}
    except Exception as e :
        session.rollback()
        print(f"failed delete packged: {e}")
        return Response(json_body={"error":"Cannot delete package, it might have booking sesssion"}, status=409)

