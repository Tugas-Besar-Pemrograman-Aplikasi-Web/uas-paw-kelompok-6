from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import NoResultFound
from sqlalchemy import select
from db import Session
from models.user_model import User
from helpers.jwt_validate_helper import jwt_validate


@view_config(route_name="me", request_method="GET", renderer="json")
@jwt_validate
def me(request):
    with Session() as session:
        stmt = select(User).where(User.email == request.jwt_claims["email"])
        try:
            result = session.execute(stmt).scalars().one()
        except NoResultFound:
            return Response(json_body={"message": "User tidak ditemukan"}, status=401)
        except Exception as e:
            print(e)
            return Response(json_body={"error": "Internal Server Error"}, status=500)

    return {
        "id": str(result.id),
        "name": result.name,
        "email": result.email,
        "role": result.role,
    }
