from pyramid.response import Response
from pyramid.view import view_config
from pydantic import BaseModel


class FromRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str


@view_config(route_name="register", request_method="POST")
def register(request):
    # request validation
    try:
        req_data = FromRequest(**request.json_body)
    except:
        return Response("Body harus berupa JSON valid", status=400)

    user_promt = req_data.name
    print(user_promt)

    return Response(user_promt, status=200)
