"""
SQLAlchemy ORM models for incidents.
Uses declarative base with common fields in BaseModel.
"""

from sqlalchemy import Column, String, Text, TIMESTAMP, Integer, Enum
from .base import Base, BaseModel
import enum


class IncidentStatus(str, enum.Enum):
    """Enum for incident status values"""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class IncidentPriority(str, enum.Enum):
    """Enum for incident priority values"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Incident(BaseModel):
    """
    Incident model matching the database schema.
    """
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.OPEN, nullable=False)
    priority = Column(Enum(IncidentPriority), default=IncidentPriority.MEDIUM, nullable=False)
    assigned_to = Column(String, nullable=True)  # User ID
    reported_by = Column(String, nullable=False)  # User ID
    category = Column(String(100), nullable=True)
    tags = Column(String(500), nullable=True)  # Comma-separated tags
    resolution_notes = Column(Text, nullable=True)
    estimated_resolution_time = Column(TIMESTAMP(timezone=True), nullable=True)
    actual_resolution_time = Column(TIMESTAMP(timezone=True), nullable=True)

    # when I print/debug the object, I dont want memory location rather this info
    def __repr__(self):
        return f"<Incident(id='{self.id}', title='{self.title}', status='{self.status}', priority='{self.priority}')>"