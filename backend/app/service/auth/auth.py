"""
Authentication service for JWT token management and password hashing.
"""

import os
import bcrypt
import jwt
from datetime import datetime, timezone,timedelta
from typing import Dict, Any
from fastapi import Response

from core import LOGGER


class AuthService:
    """Service class for authentication operations"""

    def __init__(self):
        self.jwt_secret = os.getenv("JWT_SECRET", "default-secret-change-in-production")
        self.cookie_name = os.getenv("COOKIE_NAME", "auth_token")
        self.cookie_age = int(os.getenv("COOKIE_AGE", "600"))  # 24 hours in seconds
        self.cookie_secure = bool(os.getenv("COOKIE_SECURE","true")) #https

    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        try:
            salt = bcrypt.gensalt()
            # i am using Blowfish cipher algo because i like it:)
            hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
            return hashed.decode('utf-8')
        except Exception as e:
            LOGGER.error(f"Failed to hash password: {str(e)}")
            raise

    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        try:
            # I didnt store the salt because,
            # bcrypt automatically extracts the salt from the stored hash string.
            # It then rehashes the input password with that salt.
            return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception as e:
            LOGGER.error(f"Failed to verify password: {str(e)}")
            return False

    def generate_jwt(self, user_id: str, email: str) -> str:
        """Generate a JWT token for the user"""
        try:
            payload = {
                # "user_id": user_id,
                "email": email,
                "exp": datetime.now(timezone.utc) + timedelta(seconds=self.cookie_age),
                "iat":  datetime.now(timezone.utc) # issued at
                # TODO: we need to store rback role byte array also in here.
            }
            token = jwt.encode(payload, self.jwt_secret, algorithm="HS256")
            return token
        except Exception as e:
            LOGGER.error(f"Failed to generate JWT: {str(e)}")
            raise

    def set_auth_cookie(self, response: Response, token: str) -> None:
        """Set the authentication cookie in the response"""
        try:
            response.set_cookie(
                key=self.cookie_name,
                value=token,
                httponly=True,  # Prevent JavaScript access
                secure=self.cookie_secure,   # Set to True in production with HTTPS
                samesite="lax",
                max_age=self.cookie_age
            )
            LOGGER.debug("Auth cookie set successfully")
        except Exception as e:
            LOGGER.error(f"Failed to set auth cookie: {str(e)}")
            raise

    def verify_jwt(self, token: str) -> Dict[str, Any]:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            LOGGER.error("JWT token has expired")
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError as e:
            LOGGER.error(f"Invalid JWT token: {str(e)}")
            raise ValueError("Invalid token")
        except Exception as e:
            LOGGER.error(f"Failed to verify JWT: {str(e)}")
            raise