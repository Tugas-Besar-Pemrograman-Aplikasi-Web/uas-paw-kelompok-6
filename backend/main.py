import hupper
from waitress import serve
from pyramid.config import Configurator
from pyramid.request import Request
from db import Session


class DBRequest(Request):
    """Custom Request class that includes dbsession"""
    @property
    def dbsession(self):
        session = Session()
        def cleanup(request):
            session.close()
        self.add_finished_callback(cleanup)
        return session


def main():
    with Configurator() as config:
        # Set custom request factory
        config.set_request_factory(DBRequest)
        
        # route
        ## auth
        config.add_route("register", "/api/auth/register")
        config.add_route("login", "/api/auth/login")
        config.add_route("me", "/api/auth/me")

        ## packages
        config.add_route("packages", "/api/packages")
        config.add_route("package_search", "/api/packages/search")
        config.add_route("package_detail", "/api/packages/{id}")
        config.add_route("package_agent", "/api/packages/agent/{agentId}")

        ## destinations
        config.add_route("destinations", "/api/destinations")
        config.add_route("destination_detail", "/api/destinations/{id}")

        ## qris
        config.add_route("qris", "/api/qris")
        config.add_route("qris_detail", "/api/qris/{id}")
        
        ## payment
        config.add_route("payment_generate", "/api/payment/generate")
        
        # Static file serving untuk QRIS storage
        config.add_static_view(name='qris', path='storage/qris', cache_max_age=3600)

        config.scan("views")
        app = config.make_wsgi_app()

    print("Server running on http://0.0.0.0:6543 (Hot Reload Active)")
    serve(app, host="0.0.0.0", port=6543)


if __name__ == "__main__":
    hupper.start_reloader("main.main")
    main()
