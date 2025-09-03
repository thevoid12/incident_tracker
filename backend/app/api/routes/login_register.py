from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

# Simplified imports for Makefile compatibility
from service.login.login_service import LoginService
from service.login.model import RegisterRequest, LoginRequest
from service.db import get_db
from service.auth.auth import AuthService

router = APIRouter(tags=["login-register"])

@router.post("/login")
async def login_user(
    request: LoginRequest = Depends(LoginRequest.as_form),  # Supports form data
    db: AsyncSession = Depends(get_db)
):
    """Login user endpoint - accepts both JSON and Form data"""
    service = LoginService(db)
    try:
        result = await service.login_user(request)
        return result
    except Exception as e: # TODO: we might need to display it in the ui or error pop up
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/reg")
async def register_user(
    request: RegisterRequest = Depends(RegisterRequest.as_form),  # Supports form data
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    service = LoginService(db)
    auth_service = AuthService()
    try:
        result = await service.register_user(request)

        # Create HTML redirect response with 303 See Other
        response = RedirectResponse(url="/home", status_code=303)
        
        # Set the authentication cookie
        auth_service.set_auth_cookie(response, result.token)
        
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))