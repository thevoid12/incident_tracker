"""
SQLAlchemy ORM models for audit trail.
Uses the audit_trail table schema.
"""

from sqlalchemy import Column, String, Text, TIMESTAMP, Boolean
from .base import Base


class AuditTrail(Base):
    """
    Audit trail model matching the audit_trail table schema.
    """
    __tablename__ = "audit_trail"

    id = Column(String, primary_key=True, nullable=False)
    user_action = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    email = Column(String, nullable=False)
    created_on = Column(TIMESTAMP, nullable=False, server_default='CURRENT_TIMESTAMP')
    created_by = Column(String, nullable=False)
    updated_on = Column(TIMESTAMP, nullable=False, server_default='CURRENT_TIMESTAMP')
    updated_by = Column(String, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    # when I print/debug the object, I dont want memory location rather this info
    def __repr__(self):
        return f"<AuditTrail(id='{self.id}', user_action='{self.user_action}', email='{self.email}')>"