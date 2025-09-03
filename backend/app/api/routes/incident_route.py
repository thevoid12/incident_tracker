from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import RedirectResponse

# Simplified imports for Makefile compatibility
from service.incident.incident_service import IncidentService
from service.incident.model import (
    CreateIncidentRequest, UpdateIncidentRequest, IncidentResponse,
    IncidentListResponse
)
from service.db import get_db
from service.auth.auth import get_current_user

router = APIRouter(tags=["incidents"])

@router.post("/incidents", response_model=IncidentResponse)
async def create_incident(
    request: CreateIncidentRequest = Depends(CreateIncidentRequest.as_form),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new incident"""
    service = IncidentService(db)
    try:
        await service.create_incident(request, current_user["email"])
        # Create HTML redirect response with 303 See Other
        response = RedirectResponse(url="/home", status_code=303)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/incidents", response_model=IncidentListResponse)
async def list_incidents(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List incidents with pagination only (no filtering)"""
    service = IncidentService(db)
    try:
        return await service.list_incidents(limit=limit, offset=offset)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/incidents/{id}", response_model=IncidentResponse)
async def get_incident(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get a single incident by ID"""
    service = IncidentService(db)
    try:
        return await service.get_incident(id)
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/incidents/{id}", response_model=IncidentResponse)
async def update_incident(
    id: str,
    request: UpdateIncidentRequest = Depends(UpdateIncidentRequest.as_form),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing incident"""
    service = IncidentService(db)
    try:
        return await service.update_incident(id, request, current_user["email"])
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
    """Soft delete an incident"""
    service = IncidentService(db)
    try:
        success = await service.delete_incident(id, current_user["email"])
        if success:
            return {"message": "Incident deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Incident not found")
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))