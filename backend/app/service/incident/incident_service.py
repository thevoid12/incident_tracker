"""
Incident service layer.
Contains business logic for incident operations with proper logging and error handling.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from core import LOGGER, ValidationError, NotFoundError, DatabaseError
from .data.data import IncidentDataAccess
from .model import (
    CreateIncidentRequest, UpdateIncidentRequest, IncidentResponse,
    IncidentListResponse
)


class IncidentService:
    """Service class for incident operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.incident_data = IncidentDataAccess(db)

    async def create_incident(self, request: CreateIncidentRequest, reported_by: str) -> IncidentResponse:
        """Create a new incident with validation"""
        LOGGER.info(f"Processing incident creation for title: {request.title}")

        try:
            # Create incident through data layer
            incident = await self.incident_data.create_incident(
                title=request.title.strip(),
                description=request.description,
                status=request.status.value,
                priority=request.priority.value,
                created_by=reported_by
            )

            LOGGER.info(f"Incident created successfully with ID: {incident.id}")

            # Return response
            return IncidentResponse(
                id=str(incident.id),  # Convert to string for consistency
                title=incident.title,
                description=incident.description,
                status=incident.status,
                priority=incident.priority,
                created_on=incident.created_on,
                created_by=incident.created_by,
                updated_on=incident.updated_on,
                updated_by=incident.updated_by,
                is_deleted=incident.is_deleted
            )

        except Exception as e:
            LOGGER.error(f"Incident creation failed for title {request.title}: {str(e)}")
            if isinstance(e, (ValidationError, DatabaseError)):
                raise
            raise DatabaseError(f"Incident creation failed: {str(e)}", operation="create_incident")

    async def get_incident(self, incident_id: str, created_by: str) -> IncidentResponse:
        """Get a single incident by ID - only if created by the same user"""
        LOGGER.info(f"Processing incident retrieval for ID: {incident_id} by user: {created_by}")

        try:
            incident = await self.incident_data.get_incident_by_id(incident_id, created_by)
            if not incident:
                LOGGER.warning(f"Incident not found: {incident_id} for user: {created_by}")
                raise NotFoundError("Incident not found", resource="incident")

            LOGGER.debug(f"Incident retrieved successfully: {incident_id}")

            return IncidentResponse(
                id=str(incident.id),
                title=incident.title,
                description=incident.description,
                status=incident.status,
                priority=incident.priority,
                created_on=incident.created_on,
                created_by=incident.created_by,
                updated_on=incident.updated_on,
                updated_by=incident.updated_by,
                is_deleted=incident.is_deleted
            )

        except Exception as e:
            LOGGER.error(f"Incident retrieval failed for ID {incident_id}: {str(e)}")
            if isinstance(e, (NotFoundError, DatabaseError)):
                raise
            raise DatabaseError(f"Incident retrieval failed: {str(e)}", operation="get_incident")

    async def list_incidents(self, created_by: str, limit: int = 10, offset: int = 0) -> IncidentListResponse:
        """List incidents with pagination filtered by created_by"""
        LOGGER.info(f"Processing incident list request with pagination: limit={limit}, offset={offset} for user: {created_by}")

        try:
            incidents, total_count = await self.incident_data.get_incidents_paginated(limit, offset, created_by)

            # Calculate total pages
            total_pages = (total_count + limit - 1) // limit

            # Convert to response models
            incident_responses = []
            for incident in incidents:
                incident_responses.append(IncidentResponse(
                    id=str(incident.id),
                    title=incident.title,
                    description=incident.description,
                    status=incident.status,
                    priority=incident.priority,
                    created_on=incident.created_on,
                    created_by=incident.created_by,
                    updated_on=incident.updated_on,
                    updated_by=incident.updated_by,
                    is_deleted=incident.is_deleted
                ))

            LOGGER.debug(f"Incident list retrieved successfully: {len(incident_responses)} incidents for user: {created_by}")

            return IncidentListResponse(
                incidents=incident_responses,
                total_count=total_count,
                page=(offset // limit) + 1,  # Calculate page from offset
                page_size=limit,
                total_pages=total_pages
            )

        except Exception as e:
            LOGGER.error(f"Incident list retrieval failed: {str(e)}")
            if isinstance(e, DatabaseError):
                raise
            raise DatabaseError(f"Incident list retrieval failed: {str(e)}", operation="list_incidents")

    async def update_incident(self, incident_id: str, request: UpdateIncidentRequest, updated_by: str) -> IncidentResponse:
        """Update an existing incident"""
        LOGGER.info(f"Processing incident update for ID: {incident_id}")

        try:
            # Check if incident exists
            existing_incident = await self.incident_data.get_incident_by_id(incident_id)
            if not existing_incident:
                LOGGER.warning(f"Incident not found for update: {incident_id}")
                raise NotFoundError("Incident not found", resource="incident")

            # Business logic validation
            if request.title is not None and not request.title.strip():
                LOGGER.error("Empty title provided for incident update")
                raise ValidationError("Title cannot be empty", field="title")

            # Prepare update data (only fields that exist in existing schema)
            update_data = {}
            if request.title is not None:
                update_data['title'] = request.title.strip()
            if request.description is not None:
                update_data['description'] = request.description
            if request.status is not None:
                update_data['status'] = request.status.value
            if request.priority is not None:
                update_data['priority'] = request.priority.value

            if not update_data:
                LOGGER.warning("No fields to update for incident")
                raise ValidationError("No fields provided for update")

            # Update incident through data layer
            updated_incident = await self.incident_data.update_incident(
                incident_id=incident_id,
                update_data=update_data,
                updated_by=updated_by
            )

            LOGGER.info(f"Incident updated successfully: {incident_id}")

            return IncidentResponse(
                id=str(updated_incident.id),
                title=updated_incident.title,
                description=updated_incident.description,
                status=updated_incident.status,
                priority=updated_incident.priority,
                created_on=updated_incident.created_on,
                created_by=updated_incident.created_by,
                updated_on=updated_incident.updated_on,
                updated_by=updated_incident.updated_by,
                is_deleted=updated_incident.is_deleted
            )

        except Exception as e:
            LOGGER.error(f"Incident update failed for ID {incident_id}: {str(e)}")
            if isinstance(e, (ValidationError, NotFoundError, DatabaseError)):
                raise
            raise DatabaseError(f"Incident update failed: {str(e)}", operation="update_incident")

    async def delete_incident(self, incident_id: str, deleted_by: str, created_by: str) -> bool:
        """Soft delete an incident - only if created by the same user"""
        LOGGER.info(f"Processing incident deletion for ID: {incident_id} by user: {created_by}")

        try:
            # Check if incident exists and belongs to the user
            existing_incident = await self.incident_data.get_incident_by_id(incident_id, created_by)
            if not existing_incident:
                LOGGER.warning(f"Incident not found for deletion: {incident_id} for user: {created_by}")
                raise NotFoundError("Incident not found", resource="incident")

            # Soft delete through data layer
            success = await self.incident_data.soft_delete_incident(
                incident_id=incident_id,
                deleted_by=deleted_by,
                created_by=created_by
            )

            if success:
                LOGGER.info(f"Incident deleted successfully: {incident_id}")
            else:
                LOGGER.warning(f"Incident deletion failed: {incident_id}")

            return success

        except Exception as e:
            LOGGER.error(f"Incident deletion failed for ID {incident_id}: {str(e)}")
            if isinstance(e, (NotFoundError, DatabaseError)):
                raise
            raise DatabaseError(f"Incident deletion failed: {str(e)}", operation="delete_incident")