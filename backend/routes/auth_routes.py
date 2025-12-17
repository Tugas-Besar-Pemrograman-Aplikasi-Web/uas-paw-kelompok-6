#auth routes
def include_auth_routes(config):
    config.add_route("register", "/api/auth/register")
    config.add_route("login", "/api/auth/login")
    config.add_route("me", "/api/auth/me")
    config.add_route("update_profile", "/api/auth/profile")
    config.add_route("change_password", "/api/auth/change-password")
