"""
Data access layer for users service.
Handles all database operations for user management with proper logging.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from core import LOGGER, DatabaseError
from service.db.models.user_model import User


class UserDataAccess:
    """Data access class for user operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_emails(self) -> list[str]:
        """Get all email addresses from users table"""
        try:
            LOGGER.debug("Querying all user emails")

            result = await self.db.execute(
                select(User.email)
            )
            emails = result.scalars().all()

            LOGGER.debug(f"Found {len(emails)} user emails")
            return list(emails)

        except Exception as e:
            LOGGER.error(f"Failed to query user emails: {str(e)}")
            raise DatabaseError(f"Failed to query user emails: {str(e)}", operation="get_all_emails")