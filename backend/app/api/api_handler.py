from fastapi import APIRouter
from .routes.login_register import router as loginrouter

from typing import Annotated

api_router = APIRouter(prefix="/api")

api_router.include_router(loginrouter)