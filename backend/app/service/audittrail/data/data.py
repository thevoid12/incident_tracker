"""
Data access layer for audittrail service.
Handles all database operations for audit trail management with proper logging.
"""

import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from core import LOGGER, DatabaseError
from service.db.models.audittrail_model import AuditTrail
from datetime import datetime

class AuditTrailDataAccess:
    """Data access class for audit trail operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_audit_entry(self, user_action: str, description: str, email: str, created_by: str) -> AuditTrail:
        """Create a new audit trail entry in the database"""
        try:
            LOGGER.debug(f"Creating audit entry for action: {user_action}")

            # Generate UUID for id
            entry_id = str(uuid.uuid4())

            # Create audit entry instance with explicit timestamps
           
            current_time = datetime.now()

            audit_entry = AuditTrail(
                id=entry_id,
                user_action=user_action,
                description=description,
                email=email,
                created_on=current_time,
                created_by=created_by,
                updated_on=current_time,
                updated_by=created_by,
                is_deleted=False
            )

            # Add to database session
            self.db.add(audit_entry)
            # Note: Transaction commit and refresh moved to service layer
            # This prevents "not persistent" errors when refresh is called before commit

            LOGGER.info(f"Audit entry added to session with ID: {audit_entry.id}")
            return audit_entry

        except Exception as e:
            LOGGER.error(f"Failed to create audit entry {user_action}: {str(e)}")
            # Note: Transaction rollback handled by service layer
            raise DatabaseError(f"Failed to create audit entry: {str(e)}", operation="create_audit_entry")

    async def list_all_audit_entries_paginated(self, limit: int, offset: int, created_by: str) -> tuple[list[AuditTrail], int]:
        """List all audit entries with pagination"""
        try:
            LOGGER.debug(f"Querying all audit entries with pagination: limit={limit}, offset={offset}")

            # Build base query - exclude deleted entries
            query = select(AuditTrail).where(AuditTrail.is_deleted == False)

            # Get total count
            count_query = select(func.count()).select_from(query.subquery())
            total_count_result = await self.db.execute(count_query)
            total_count = total_count_result.scalar()

            # Apply ordering (latest first) and pagination
            query = query.order_by(desc(AuditTrail.created_on)).offset(offset).limit(limit)

            # Execute query
            result = await self.db.execute(query)
            entries = result.scalars().all()

            LOGGER.debug(f"Found {len(entries)} audit entries out of {total_count} total")
            return entries, total_count

        except Exception as e:
            LOGGER.error(f"Failed to query audit entries with pagination: {str(e)}")
            raise DatabaseError(f"Failed to query audit entries: {str(e)}", operation="list_audit_entries_paginated")

    async def list_user_audit_entries_paginated(self, limit: int, offset: int, created_by: str) -> tuple[list[AuditTrail], int]:
        """List audit entries created by the user with pagination"""
        try:
            LOGGER.debug(f"Querying user audit entries with pagination: limit={limit}, offset={offset}, user={created_by}")

            # Build base query - exclude deleted entries and filter by created_by
            query = select(AuditTrail).where(
                AuditTrail.is_deleted == False,
                AuditTrail.created_by == created_by
            )

            # Get total count
            count_query = select(func.count()).select_from(query.subquery())
            total_count_result = await self.db.execute(count_query)
            total_count = total_count_result.scalar()

            # Apply ordering (latest first) and pagination
            query = query.order_by(desc(AuditTrail.created_on)).offset(offset).limit(limit)

            # Execute query
            result = await self.db.execute(query)
            entries = result.scalars().all()

            LOGGER.debug(f"Found {len(entries)} user audit entries out of {total_count} total")
            return entries, total_count

        except Exception as e:
            LOGGER.error(f"Failed to query user audit entries with pagination: {str(e)}")
            raise DatabaseError(f"Failed to query user audit entries: {str(e)}", operation="list_user_audit_entries_paginated")