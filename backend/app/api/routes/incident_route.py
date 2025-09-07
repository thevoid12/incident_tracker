from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import RedirectResponse

# Simplified imports for Makefile compatibility
from service.incident.incident_service import IncidentService
from service.incident.model import (
    CreateIncidentRequest, UpdateIncidentRequest, IncidentResponse,
    IncidentListResponse, AddChatMessageRequest, IncidentConfigResponse,
    IncidentUploadResponse
)
from service.db import get_db
from service.auth.auth import get_current_user
from core.settings import config

router = APIRouter(tags=["incidents"])

@router.get("/incidents/config", response_model=IncidentConfigResponse)
async def get_incident_config():
    """Get incident configuration for CSV upload/download"""
    return IncidentConfigResponse(
        fields=config.INCIDENT.FIELDS,
        status_options=config.INCIDENT.STATUS_OPTIONS,
        priority_options=config.INCIDENT.PRIORITY_OPTIONS,
        upload_max_size_mb=config.INCIDENT.UPLOAD_MAX_SIZE_MB
    )

@router.post("/incidents/upload", response_model=IncidentUploadResponse)
async def upload_incidents(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Upload incidents from CSV/Excel file"""
    service = IncidentService(db)
    try:
        # Read file content
        file_content = await file.read()

        # Process the upload
        result = await service.bulk_upload_incidents(
            file_content=file_content,
            filename=file.filename,
            uploaded_by=current_user["email"],
            user_permissions=current_user.get("role")
        )

        return IncidentUploadResponse(
            uploaded_count=result["uploaded_count"],
            errors=result["errors"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/incidents", response_model=IncidentResponse)
async def create_incident(
    request: CreateIncidentRequest = Depends(CreateIncidentRequest.as_form),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new incident"""
    service = IncidentService(db)
    try:
        await service.create_incident(request, current_user["email"], current_user.get("role"))
        # Create HTML redirect response with 303 See Other
        response = RedirectResponse(url="/home", status_code=303)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/incidents", response_model=IncidentListResponse)
async def list_incidents(
    limit: int = Query(config.PAGINATION.INCIDENT_DEFAULT_LIMIT, ge=1, le=config.PAGINATION.MAX_LIMIT),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List incidents with pagination filtered by created_by"""
    service = IncidentService(db)
    try:
        return await service.list_incidents(current_user["email"], limit=limit, offset=offset, user_permissions=current_user.get("role"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/incidents/{id}/chat", response_model=IncidentResponse)
async def add_chat_message(
    id: str,
    request: AddChatMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Add a chat message to an incident"""
    service = IncidentService(db)
    try:
        return await service.add_chat_message(id, request.content, current_user["email"], current_user["email"], current_user.get("role"))
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/incidents/{id}", response_model=IncidentResponse)
async def get_incident(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get a single incident by ID - only if created by the same user"""
    service = IncidentService(db)
    try:
        return await service.get_incident(id, current_user["email"], current_user.get("role"))
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/incidents/{id}")
async def update_incident(
    id: str,
    request: UpdateIncidentRequest = Depends(UpdateIncidentRequest.as_form),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing incident - only if created by the same user"""
    service = IncidentService(db)
    try:
        await service.update_incident(id, request, current_user["email"], current_user["email"], current_user.get("role"))
        # Create HTML redirect response with 303 See Other
        response = RedirectResponse(url="/home", status_code=303)
        return response
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/incidents/{id}")
async def delete_incident(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Soft delete an incident - only if created by the same user"""
    service = IncidentService(db)
    try:
        success = await service.delete_incident(id, current_user["email"], current_user["email"], current_user.get("role"))
        if success:
            return {"message": "Incident deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Incident not found")
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))