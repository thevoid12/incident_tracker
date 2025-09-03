"""
Login service layer.
Contains business logic for authentication operations.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from .data.data import UserDataAccess
from .model import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse


class LoginService:
    """Service class for login/Register operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_data = UserDataAccess(db)

    async def register_user(self, request: RegisterRequest) -> RegisterResponse:
        """Register a new user with validation"""
        # Business logic validation
        if request.password != request.confirm_password:
            raise ValueError("Passwords do not match")

        # Check if user already exists
        existing_user = await self.user_data.get_user_by_email(request.email)
        if existing_user:
            raise ValueError("Email already registered")

        # Create user through data layer
        user = await self.user_data.create_user(request.email, request.password)

        # Return response
        return RegisterResponse(
            message="User registered successfully",
            user_id=user.id,
            email=user.email
        )

    async def login_user(self, request: LoginRequest) -> LoginResponse:
        """Authenticate a user"""
        # Get user from database
        user = await self.user_data.get_user_by_email(request.email)
        if not user:
            raise ValueError("User not found")

        # In a real app, you'd verify the password hash
        # For now, just check if password matches (not secure!)
        if user.password != request.password:
            raise ValueError("Invalid password")

        return LoginResponse(
            message="Login successful",
            user_id=user.id,
            email=user.email
        )