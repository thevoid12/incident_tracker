"""
SQLAlchemy ORM models for the application.
Uses declarative base with common fields in BaseModel.
"""

from sqlalchemy import Column, String, LargeBinary
from .base import Base, BaseModel

class User(BaseModel):
    """
    User model matching the database schema.
    """
    __tablename__ = "users"

    id = Column(String, primary_key=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(LargeBinary, nullable=True)  # BYTEA in PostgreSQL

    # when I print/debug the object, I dont want memory location rather this info
    def __repr__(self):
        return f"<User(id='{self.id}', email='{self.email}')>"