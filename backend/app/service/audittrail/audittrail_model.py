"""
Pydantic models for audittrail service.
Contains request/response models for audit trail operations.
"""

from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional, List
from datetime import datetime
from .action_const import UserAction


class AuditTrailEntry(BaseModel):
    """Model for audit trail entry"""
    id: str = Field(..., min_length=1)
    user_action: UserAction
    description: Optional[str] = Field(None, max_length=500)
    email: EmailStr
    created_on: datetime
    created_by: str = Field(..., min_length=1)
    updated_on: datetime
    updated_by: str = Field(..., min_length=1)
    is_deleted: bool


class CreateAuditTrailRequest(BaseModel):
    """Request model for creating an audit trail entry"""
    user_action: UserAction
    description: Optional[str] = None
    email: EmailStr

    @field_validator("description")
    def sanitize_description(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                return None
        return v


class AuditTrailListResponse(BaseModel):
    """Response model for audit trail list with pagination"""
    entries: List[AuditTrailEntry]
    total_count: int
    page: int
    page_size: int
    total_pages: int


class AuditTrailFilterRequest(BaseModel):
    """Request model for filtering audit trail entries"""
    user_action: Optional[UserAction] = None
    email: Optional[EmailStr] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = Field(10, ge=1, le=100)  # TODO: Use config value
    offset: int = Field(0, ge=0)

    @field_validator("end_date")
    def validate_date_range(cls, v: Optional[datetime], values) -> Optional[datetime]:
        if v is not None and values.data.get("start_date") is not None:
            if v < values.data["start_date"]:
                raise ValueError("end_date must be after start_date")
        return v