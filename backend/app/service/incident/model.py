"""
Pydantic models for incident service.
Contains request/response models for incident operations.
Supports both JSON and Form data parsing.
"""

from pydantic import BaseModel, Field,field_validator
from fastapi import Form
from typing import Optional, List
from datetime import datetime
from enum import Enum


class IncidentStatus(str, Enum):
    """Enum for incident status values matching existing schema"""
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"


class IncidentPriority(str, Enum):
    """Enum for incident priority values matching existing schema"""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class CreateIncidentRequest(BaseModel):
    """Request model for creating a new incident - supports both JSON and Form data"""
    title: str = Field(..., min_length=1, max_length=200)  # VARCHAR(200)
    description: Optional[str] = None
    status: IncidentStatus = IncidentStatus.OPEN
    priority: IncidentPriority = IncidentPriority.MEDIUM
    assigned_to: str = Field(..., min_length=1)  # Required field for assignment

    @field_validator("title")
    def title_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title cannot be empty or just whitespace")
        return v

    @classmethod
    def as_form(
        cls,
        title: str = Form(..., min_length=1, max_length=200),
        description: str = Form(None),
        status: IncidentStatus = Form(IncidentStatus.OPEN),
        priority: IncidentPriority = Form(IncidentPriority.MEDIUM),
        assigned_to: str = Form(..., min_length=1)
    ):
        """Create CreateIncidentRequest from form data"""
        return cls(
            title=title,
            description=description,
            status=status,
            priority=priority,
            assigned_to=assigned_to
        )


class UpdateIncidentRequest(BaseModel):
    """Request model for updating an incident - supports both JSON and Form data"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)  # Match schema VARCHAR(200)
    description: Optional[str] = None
    status: Optional[IncidentStatus] = None
    priority: Optional[IncidentPriority] = None
    assigned_to: Optional[str] = Field(None, min_length=1)

    @field_validator("title")
    def title_not_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Title cannot be empty or just whitespace")
        return v

    @classmethod
    def as_form(
        cls,
        title: str = Form(None),
        description: str = Form(None),
        status: IncidentStatus = Form(None),
        priority: IncidentPriority = Form(None),
        assigned_to: str = Form(None)
    ):
        """Create UpdateIncidentRequest from form data"""
        return cls(
            title=title if title else None,
            description=description if description else None,
            status=status,
            priority=priority,
            assigned_to=assigned_to if assigned_to else None
        )


class IncidentResponse(BaseModel):
    """Response model for incident data"""
    id: str
    title: str
    description: Optional[str]
    status: IncidentStatus
    priority: IncidentPriority
    assigned_to: str
    created_on: datetime
    created_by: str
    updated_on: datetime
    updated_by: str
    chat: List[dict] = Field(default_factory=list)
    is_deleted: bool


class IncidentListResponse(BaseModel):
    """Response model for incident list with pagination"""
    incidents: List[IncidentResponse]
    total_count: int
    page: int
    page_size: int
    total_pages: int


class IncidentFilterRequest(BaseModel):
    """Request model for filtering incidents"""
    status: Optional[IncidentStatus] = None
    priority: Optional[IncidentPriority] = None
    search: Optional[str] = None  # Search in title and description
    limit: int = Field(5, ge=1, le=100)
    offset: int = Field(0, ge=0)


class AddChatMessageRequest(BaseModel):
    """Request model for adding a chat message"""
    content: str = Field(..., min_length=1, max_length=1000)  # Message content