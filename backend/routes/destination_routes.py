#detinations routes
def include_destinations_routes(config):
    config.add_route("destinations", "/api/destinations")
    config.add_route("destination_detail", "/api/destinations/{id}")
