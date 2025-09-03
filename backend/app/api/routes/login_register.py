from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# Simplified imports for Makefile compatibility
from service.login.login_service import LoginService
from service.login.model import RegisterRequest, LoginRequest
from service.db import get_db

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
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/reg")
async def register_user(
    request: RegisterRequest = Depends(RegisterRequest.as_form),  # Supports form data
    db: AsyncSession = Depends(get_db)
):
    """Register a new user - accepts both JSON and Form data"""
    service = LoginService(db)
    try:
        result = await service.register_user(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))