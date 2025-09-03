"""
Base SQLAlchemy models and configurations.
Contains the declarative base and common base model for all database entities.
"""

from sqlalchemy import Column, String, Boolean, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base

# Base is used as the parent for all ORM models
# so SQLAlchemy can collect metadata.
Base = declarative_base()

class BaseModel(Base):
    """
    Abstract base model with common audit fields.
    All models should inherit from this.
    """
    __abstract__ = True  # BaseModel does not create its own table. Its columns are inherited by subclasses.

    created_on = Column(TIMESTAMP(timezone=True), default=func.now(), nullable=False)
    created_by = Column(String, nullable=False)
    updated_on = Column(TIMESTAMP(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)
    updated_by = Column(String, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)