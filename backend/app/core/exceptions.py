"""
Custom exception classes for the application.
Provides structured error handling with appropriate HTTP status codes.
"""

from typing import Optional, Dict, Any


class AppException(Exception):
    """Base exception class for application errors"""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(AppException):
    """Validation error for invalid input data"""
    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=400,
            details={"field": field} if field else {}
        )


class AuthenticationError(AppException):
    """Authentication related errors"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message=message, status_code=401)


class AuthorizationError(AppException):
    """Authorization related errors"""
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message=message, status_code=403)


class NotFoundError(AppException):
    """Resource not found errors"""
    def __init__(self, resource: str, resource_id: Optional[str] = None):
        message = f"{resource} not found"
        if resource_id:
            message += f" with id: {resource_id}"
        super().__init__(
            message=message,
            status_code=404,
            details={"resource": resource, "resource_id": resource_id}
        )


class ConflictError(AppException):
    """Resource conflict errors (e.g., duplicate data)"""
    def __init__(self, message: str, resource: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=409,
            details={"resource": resource} if resource else {}
        )


class DatabaseError(AppException):
    """Database related errors"""
    def __init__(self, message: str, operation: Optional[str] = None):
        super().__init__(
            message=f"Database error: {message}",
            status_code=500,
            details={"operation": operation} if operation else {}
        )


class ExternalServiceError(AppException):
    """External service/API errors"""
    def __init__(self, service: str, message: str):
        super().__init__(
            message=f"{service} service error: {message}",
            status_code=502,
            details={"service": service}
        )