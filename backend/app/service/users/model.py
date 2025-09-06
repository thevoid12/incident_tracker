"""
Pydantic models for users service.
Contains request/response models for user operations.
"""

from pydantic import BaseModel
from typing import List
from datetime import datetime


class UserResponse(BaseModel):
    """Response model for user data"""
    id: str
    email: str
    role: str
    created_on: datetime
    updated_on: datetime


class EmailListResponse(BaseModel):
    """Response model for list of emails"""
    emails: List[str]
    total_count: int