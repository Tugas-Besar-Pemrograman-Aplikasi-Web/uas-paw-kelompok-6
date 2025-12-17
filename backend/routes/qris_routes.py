#qris routes
def include_qris_routes(config):
    config.add_route("qris", "/api/qris")
    config.add_route("qris_detail", "/api/qris/{id}")
    config.add_route("qris_preview", "/api/qris/preview")
