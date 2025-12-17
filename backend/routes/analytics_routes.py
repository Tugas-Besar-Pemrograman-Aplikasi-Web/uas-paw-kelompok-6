#analytics routes
def include_analytics_routes(config):
    config.add_route("analytics_agent_stats", "/api/analytics/agent/stats")
    config.add_route("analytics_agent_package_performance", "/api/analytics/agent/package-performance")
    config.add_route("analytics_tourist_stats", "/api/analytics/tourist/stats")
