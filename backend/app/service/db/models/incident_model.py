"""
SQLAlchemy ORM models for incidents.
Uses the existing incident_tracker table schema.
"""

from sqlalchemy import Column, String, Text, TIMESTAMP, Integer, Boolean
from .base import Base


class Incident(Base):
    """
    Incident model matching the existing incident_tracker table schema.
    """
    __tablename__ = "incident_tracker"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="Open", nullable=False)
    priority = Column(String(50), default="Medium", nullable=False)
    created_on = Column(TIMESTAMP, nullable=False, server_default='CURRENT_TIMESTAMP')
    created_by = Column(String, nullable=False)
    updated_on = Column(TIMESTAMP, nullable=False, server_default='CURRENT_TIMESTAMP')
    updated_by = Column(String, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    # when I print/debug the object, I dont want memory location rather this info
    def __repr__(self):
        return f"<Incident(id='{self.id}', title='{self.title}', status='{self.status}', priority='{self.priority}')>"