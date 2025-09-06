from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# Simplified imports for Makefile compatibility
from service.users.users_service import UserService
from service.users.model import EmailListResponse
from service.db import get_db
from service.auth.auth import get_current_user

router = APIRouter(tags=["users"])

@router.get("/users/emails", response_model=EmailListResponse)
async def list_user_emails(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List all user email addresses"""
    service = UserService(db)
    try:
        return await service.list_emails()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))