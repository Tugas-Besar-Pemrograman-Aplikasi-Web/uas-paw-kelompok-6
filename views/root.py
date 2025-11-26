from pyramid.response import Response
from pyramid.view import view_config

@view_config(route_name='hello', request_method='GET')
def hello_world(request):
    return Response('Hello World!')
