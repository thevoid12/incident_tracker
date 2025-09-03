"""
SQLAlchemy ORM models for the application.
Uses declarative base with common fields in BaseModel.
"""

from sqlalchemy import Column, String, Boolean, TIMESTAMP, func, LargeBinary
from sqlalchemy.ext.declarative import declarative_base

# Base is used as the parent for all ORM models 
# so SQLAlchemy can collect metadata.
Base = declarative_base()

class BaseModel(Base):
    """
    Abstract base model with common audit fields.
    All models should inherit from this.
    """
    __abstract__ = True # BaseModel does not create its own table. Its columns are inherited by subclasses.

    created_on = Column(TIMESTAMP(timezone=True), default=func.now(), nullable=False)
    created_by = Column(String, nullable=False)
    updated_on = Column(TIMESTAMP(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)
    updated_by = Column(String, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

class User(BaseModel):
    """
    User model matching the database schema.
    """
    __tablename__ = "users"

    id = Column(String, primary_key=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(LargeBinary, nullable=True)  # BYTEA in PostgreSQL

    # when I print the object, I dont want memory location rather this info
    def __repr__(self):
        return f"<User(id='{self.id}', email='{self.email}')>"