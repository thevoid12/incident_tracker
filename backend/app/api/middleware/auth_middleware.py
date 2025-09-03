"""
Authentication middleware for JWT token validation.
Redirects to login page if JWT is missing or invalid.
"""

from fastapi import Request
from fastapi.responses import RedirectResponse
from service.auth.auth import AuthService


async def auth_middleware(request: Request, call_next):
    """Middleware to check JWT token for all routes except login/register and static assets"""
    # Skip authentication for static assets
    if request.url.path.startswith("/assets/"):
        response = await call_next(request)
        return response

    # Define public endpoints that don't require authentication
    public_endpoints = ["/login", "/register", "/api/login", "/api/reg"]

    # Check if the current path is a public endpoint
    is_public_endpoint = any(request.url.path == endpoint for endpoint in public_endpoints)

    # If not a public endpoint, require authentication
    if not is_public_endpoint:
        auth_service = AuthService()
        token = request.cookies.get(auth_service.cookie_name)

        if not token:
            # Redirect to login page if no token
            return RedirectResponse(url="/login", status_code=302)

        try:
            # Verify the JWT token
            auth_service.verify_jwt(token)
        except Exception as e:
            # Redirect to login page if token is invalid/expired
            return RedirectResponse(url="/login", status_code=302)

    # Continue with the request
    response = await call_next(request)
    return response