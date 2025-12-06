from pyramid.view import view_config


@view_config(route_name="home", request_method="GET", renderer="json")
def hello_world(request):
    return {"message": "Hello World!", "status": 200}
