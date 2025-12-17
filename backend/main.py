import hupper
import json
from waitress import serve
from pyramid.config import Configurator
from pyramid.request import Request
from pyramid.response import Response
from pyramid.renderers import JSON
from db import Session
from routes import include_routes


class DBRequest(Request):
    """Custom Request class that includes dbsession"""
    @property
    def dbsession(self):
        session = Session()
        def cleanup(request):
            session.close()
        self.add_finished_callback(cleanup)
        return session


def cors_tween_factory(handler, registry):
    """
    CORS Tween Factory - handles preflight OPTIONS and adds CORS headers to all responses
    """
    def cors_tween(request):
        # Handle preflight OPTIONS request
        if request.method == 'OPTIONS':
            response = Response(status=200)
        else:
            response = handler(request)
        
        # Add CORS headers to ALL responses
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Requested-With'
        response.headers['Access-Control-Max-Age'] = '3600'
        
        return response
    
    return cors_tween


def main():
    with Configurator() as config:
        # Add CORS tween (must be added first to intercept all requests)
        config.add_tween('main.cors_tween_factory')
        
        # Set custom request factory
        config.set_request_factory(DBRequest)
        
        # Setup pretty JSON renderer
        json_renderer = JSON()
        json_renderer.serializer = lambda obj, **kwargs: json.dumps(
            obj, 
            indent=2, 
            ensure_ascii=False,
            default=str
        )
        config.add_renderer('json', json_renderer)
        
        #all route
        include_routes(config)
        # Static file serving untuk QRIS storage dan payment proofs
        config.add_static_view(name='qris', path='storage/qris', cache_max_age=3600)
        config.add_static_view(name='payment_proofs', path='storage/payment_proofs', cache_max_age=3600)
        config.add_static_view(name='destinations', path='storage/destinations', cache_max_age=3600)
        config.add_static_view(name='packages', path='storage/packages', cache_max_age=3600)

        config.scan("views")
        app = config.make_wsgi_app()

    print("Server running on http://0.0.0.0:6543 (Hot Reload Active)")
    serve(app, host="0.0.0.0", port=6543)


if __name__ == "__main__":
    hupper.start_reloader("main.main")
    main()
