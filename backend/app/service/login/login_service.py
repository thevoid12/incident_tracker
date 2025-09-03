"""
Login service layer.
Contains business logic for authentication operations with proper logging and error handling.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from core import LOGGER, ValidationError, ConflictError, NotFoundError, DatabaseError
from .data.data import UserDataAccess
from .model import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse
from service.auth.auth import AuthService


class LoginService:
    """Service class for login/Register operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_data = UserDataAccess(db)
        self.auth_service = AuthService()

    async def register_user(self, request: RegisterRequest) -> RegisterResponse:
        """Register a new user with validation"""
        LOGGER.info(f"Processing user registration for email: {request.email}")

        try:
            # Business logic validation
            if request.password != request.confirm_password:
                LOGGER.error(f"Password mismatch for email: {request.email}")
                raise ValidationError("Passwords do not match", field="confirm_password")

            # Check if user already exists
            existing_user = await self.user_data.get_user_by_email(request.email)
            if existing_user:
                LOGGER.warning(f"Attempted registration with existing email: {request.email}")
                raise ConflictError("Email already registered", resource="user")

            # Create user through data layer (password is now hashed in create_user)
            user = await self.user_data.create_user(request.email, request.password)
            LOGGER.info(f"User registered successfully with ID: {user.id}")

            # Generate JWT token
            token = self.auth_service.generate_jwt(user.id, user.email)
            LOGGER.debug(f"JWT token generated for user: {user.id}")

            # Return response with token
            return RegisterResponse(
                message="User registered successfully",
                user_id=user.id,
                email=user.email,
                token=token
            )

        except Exception as e:
            LOGGER.error(f"Registration failed for email {request.email}: {str(e)}")
            if isinstance(e, (ValidationError, ConflictError)):
                raise
            raise DatabaseError(f"Registration failed: {str(e)}", operation="user_registration")

    async def login_user(self, request: LoginRequest) -> LoginResponse:
        """Authenticate a user"""
        LOGGER.info(f"Processing login attempt for email: {request.email}")

        try:
            # Get user from database
            user = await self.user_data.get_user_by_email(request.email)
            if not user:
                LOGGER.error(f"Login attempt for non-existent email: {request.email}")
                raise NotFoundError("User not found", "user")

            # Verify the password hash
            if not self.auth_service.verify_password(request.password, user.password):
                LOGGER.error(f"Invalid password attempt for email: {request.email}")
                raise ValidationError("Invalid email or password")

             # Generate JWT token
            token = self.auth_service.generate_jwt(user.id, user.email)
            LOGGER.debug(f"JWT token generated for user: {user.id}")

            LOGGER.info(f"Login successful for user ID: {user.id}")
            return LoginResponse(
                message="Login successful",
                user_id=user.id,
                email=user.email,
                token=token
            )

        except Exception as e:
            LOGGER.error(f"Login failed for email {request.email}: {str(e)}")
            if isinstance(e, (NotFoundError, ValidationError)):
                raise
            raise DatabaseError(f"Login failed: {str(e)}", operation="user_login")