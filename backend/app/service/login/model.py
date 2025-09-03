"""
Pydantic models for login service.
Contains request/response models for authentication operations.
Supports both JSON and Form data parsing.
"""

from pydantic import BaseModel, EmailStr
from fastapi import Form
from typing import Optional


class RegisterRequest(BaseModel):
    """Request model for user registration - supports both JSON and Form data"""
    email: EmailStr
    password: str
    confirm_password: str

    @classmethod
    def as_form(
        cls,
        email: EmailStr = Form(...),
        password: str = Form(...),
        confirm_password: str = Form(...)
    ):
        """Create RegisterRequest from form data"""
        return cls(
            email=email,
            password=password,
            confirm_password=confirm_password
        )


class RegisterResponse(BaseModel):
    """Response model for user registration"""
    message: str
    user_id: str
    email: EmailStr


class LoginRequest(BaseModel):
    """Request model for user login - supports both JSON and Form data"""
    email: EmailStr
    password: str

    @classmethod
    def as_form(
        cls,
        email: EmailStr = Form(...),
        password: str = Form(...)
    ):
        """Create LoginRequest from form data"""
        return cls(
            email=email,
            password=password
        )


class LoginResponse(BaseModel):
    """Response model for user login"""
    message: str
    user_id: str
    email: EmailStr