from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

# Simplified imports for Makefile compatibility
from service.audittrail.audittrail_service import AuditTrailService
from service.audittrail.audittrail_model import AuditTrailListResponse
from service.db import get_db
from service.auth.auth import get_current_user

router = APIRouter(tags=["audittrail"])

@router.get("/audittrail", response_model=AuditTrailListResponse)
async def list_audit_entries(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List audit trail entries with pagination"""
    service = AuditTrailService(db)
    try:
        return await service.list_audit_entries(current_user["email"], limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))