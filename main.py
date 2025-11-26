from waitress import serve
from pyramid.config import Configurator

from pyramid.view import view_config
from pyramid.response import Response

@view_config(route_name='home')
def home_view(request):
    return Response('<p>Visit <a href="/howdy?name=lisa">hello</a></p>')

if __name__ == '__main__':
    with Configurator() as config:
        #config.include('.views')
        config.add_route('home', '/')
        config.scan()
        app = config.make_wsgi_app()
    serve(app, host='0.0.0.0', port=8080)
