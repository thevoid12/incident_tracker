"""
Data access layer for login service.
Handles all database operations for user management.
"""

import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Simplified import for Makefile compatibility
from service.db.models.user_model import User


class UserDataAccess:
    """Data access class for user operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, email: str, password: str) -> User:
        """Create a new user in the database"""
        # Generate a unique ID for the user
        user_id = str(uuid.uuid4())

        # Create user instance
        user = User(
            id=user_id,
            email=email,
            password=password,  # In real app, this should be hashed
            created_by=user_id,  # Self-created
            updated_by=user_id   # Self-updated
        )

        # Add to database
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def get_user_by_email(self, email: str) -> User | None:
        """Get user by email address"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: str) -> User | None:
        """Get user by ID"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()