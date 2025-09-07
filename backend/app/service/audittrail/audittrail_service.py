"""
Audit trail service layer.
Contains business logic for audit trail operations with proper logging and error handling.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from core import LOGGER, ValidationError, NotFoundError, DatabaseError
from .data.data import AuditTrailDataAccess
from .audittrail_model import (
    CreateAuditTrailRequest, AuditTrailEntry,
    AuditTrailListResponse
)
from service.rbac import has_permission, Permission
from core.settings import config


class AuditTrailService:
    """Service class for audit trail operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit_data = AuditTrailDataAccess(db)

    async def create_audittrail_entry(self, request: CreateAuditTrailRequest, created_by: str) -> AuditTrailEntry:
        """Create a new audit trail entry"""
        LOGGER.info(f"Processing audit entry creation for action: {request.user_action}")

        try:
            # Create audit entry through data layer
            audit_entry = await self.audit_data.create_audit_entry(
                user_action=request.user_action.value,
                description=request.description,
                email=request.email,
                created_by=created_by
            )

            LOGGER.info(f"Audit entry created successfully with ID: {audit_entry.id}")

            # Return response
            return AuditTrailEntry(
                id=str(audit_entry.id),
                user_action=audit_entry.user_action,
                description=audit_entry.description,
                email=audit_entry.email,
                created_on=audit_entry.created_on,
                created_by=audit_entry.created_by,
                updated_on=audit_entry.updated_on,
                updated_by=audit_entry.updated_by,
                is_deleted=audit_entry.is_deleted
            )

        except Exception as e:
            LOGGER.error(f"Audit entry creation failed for action {request.user_action}: {str(e)}")
            if isinstance(e, (ValidationError, DatabaseError)):
                raise
            raise DatabaseError(f"Audit entry creation failed: {str(e)}", operation="create_audit_entry")

    async def list_audit_entries(self, created_by: str, limit: int = config.PAGINATION.AUDIT_TRAIL_DEFAULT_LIMIT, offset: int = 0, user_permissions: bytes = None) -> AuditTrailListResponse:
        """List audit entries with pagination based on permissions"""
        LOGGER.info(f"Processing audit entries list request with pagination: limit={limit}, offset={offset}")

        # Check permissions and choose appropriate data method
        if has_permission(user_permissions, Permission.PermViewAllAuditTrail):
            # User can view all audit entries
            entries, total_count = await self.audit_data.list_all_audit_entries_paginated(limit, offset, created_by)
            LOGGER.debug("Listing all audit entries (PermViewAllAuditTrail)")
        elif has_permission(user_permissions, Permission.PermViewAuditTrail):
            # User can only view their own audit entries
            entries, total_count = await self.audit_data.list_user_audit_entries_paginated(limit, offset, created_by)
            LOGGER.debug("Listing user audit entries (PermViewAuditTrail)")
        else:
            # User has no permission to view audit entries
            LOGGER.warning(f"User {created_by} does not have permission to view audit entries")
            raise ValidationError("You do not have permission to view audit entries")

        try:
            # Calculate total pages
            total_pages = (total_count + limit - 1) // limit

            # Convert to response models
            audit_responses = []
            for entry in entries:
                audit_responses.append(AuditTrailEntry(
                    id=str(entry.id),
                    user_action=entry.user_action,
                    description=entry.description,
                    email=entry.email,
                    created_on=entry.created_on,
                    created_by=entry.created_by,
                    updated_on=entry.updated_on,
                    updated_by=entry.updated_by,
                    is_deleted=entry.is_deleted
                ))

            LOGGER.debug(f"Audit entries retrieved successfully: {len(audit_responses)} entries")

            return AuditTrailListResponse(
                entries=audit_responses,
                total_count=total_count,
                page=(offset // limit) + 1,
                page_size=limit,
                total_pages=total_pages
            )

        except Exception as e:
            LOGGER.error(f"Audit entries list retrieval failed: {str(e)}")
            if isinstance(e, DatabaseError):
                raise
            raise DatabaseError(f"Audit entries list retrieval failed: {str(e)}", operation="list_audit_entries")