"""
Users service layer.
Contains business logic for user operations with proper logging and error handling.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from core import LOGGER, DatabaseError
from .data.data import UserDataAccess
from .model import EmailListResponse


class UserService:
    """Service class for user operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_data = UserDataAccess(db)

    async def list_emails(self) -> EmailListResponse:
        """List all email addresses from users table"""
        LOGGER.info("Processing request to list all user emails")

        try:
            emails = await self.user_data.get_all_emails()

            LOGGER.info(f"Successfully retrieved {len(emails)} user emails")

            return EmailListResponse(
                emails=emails,
                total_count=len(emails)
            )

        except Exception as e:
            LOGGER.error(f"Failed to list user emails: {str(e)}")
            if isinstance(e, DatabaseError):
                raise
            raise DatabaseError(f"Failed to list user emails: {str(e)}", operation="list_emails")