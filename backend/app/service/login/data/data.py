"""
Data access layer for login service.
Handles all database operations for user management with proper logging.
"""

import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core import LOGGER, DatabaseError

# Simplified import for Makefile compatibility
from service.db.models.user_model import User
from service.auth.auth import AuthService


class UserDataAccess:
    """Data access class for user operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.auth_service = AuthService()

    async def create_user(self, email: str, password: str) -> User:
        """Create a new user in the database"""
        try:
            # Generate a unique ID for the user
            user_id = str(uuid.uuid4())
            LOGGER.debug(f"Creating user with ID: {user_id}, email: {email}")

            # Hash the password before saving
            hashed_password = self.auth_service.hash_password(password)

            # Create user instance
            user = User(
                id=user_id,
                email=email,
                password=hashed_password,
                created_by=user_id,  # Self-created
                updated_by=user_id   # Self-updated
            )

            # Add to database
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)

            LOGGER.info(f"User created successfully: {user_id}")
            return user

        except Exception as e:
            LOGGER.error(f"Failed to create user {email}: {str(e)}")
            await self.db.rollback()
            raise DatabaseError(f"Failed to create user: {str(e)}", operation="create_user")

    async def get_user_by_email(self, email: str) -> User | None:
        """Get user by email address"""
        try:
            LOGGER.debug(f"Querying user by email: {email}")
            result = await self.db.execute(
                select(User).where(User.email == email)
            )
            user = result.scalar_one_or_none()

            if user:
                LOGGER.debug(f"User found: {user.id}")
            else:
                LOGGER.debug(f"No user found with email: {email}")

            return user

        except Exception as e:
            LOGGER.error(f"Failed to query user by email {email}: {str(e)}")
            raise DatabaseError(f"Failed to query user: {str(e)}", operation="get_user_by_email")

    async def get_user_by_id(self, user_id: str) -> User | None:
        """Get user by ID"""
        try:
            self.logger.debug(f"Querying user by ID: {user_id}")
            result = await self.db.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()

            if user:
                self.logger.debug(f"User found: {user_id}")
            else:
                self.logger.debug(f"No user found with ID: {user_id}")

            return user

        except Exception as e:
            self.logger.error(f"Failed to query user by ID {user_id}: {str(e)}")
            raise DatabaseError(f"Failed to query user: {str(e)}", operation="get_user_by_id")