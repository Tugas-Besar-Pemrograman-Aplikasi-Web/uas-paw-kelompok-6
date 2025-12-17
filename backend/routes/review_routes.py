#reviews rooutes
def include_review_routes(config):
    config.add_route("reviews", "/api/reviews")
    config.add_route("review_by_package", "/api/reviews/package/{packageId}")
    config.add_route("review_by_tourist", "/api/reviews/tourist/{touristId}")
