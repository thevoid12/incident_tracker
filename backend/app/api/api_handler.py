from fastapi import APIRouter
from .routes.login_route import router as loginrouter
from .routes.incident_route import router as incident_router
from .routes.users_route import router as users_router

from typing import Annotated

api_router = APIRouter(prefix="/api")

api_router.include_router(loginrouter)
api_router.include_router(incident_router)
api_router.include_router(users_router)