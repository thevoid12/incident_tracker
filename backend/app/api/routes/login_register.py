from fastapi import APIRouter, Form


from typing import Annotated


router = APIRouter(tags=["login-register"])

@router.post("/login")
async def register_user(
    email: Annotated[str, Form()], 
    password: Annotated[str, Form()],
    confirm_password: Annotated[str, Form()], 
):

    return {"message": "User logged in successfully", "email": email}


@router.post("/reg")
async def register_user(
    email: Annotated[str, Form()], 
    password: Annotated[str, Form()],
    confirm_password: Annotated[str, Form()], 
):
    """Register a new user"""

    # Basic validation
    if password != confirm_password:
        return {"error": "Passwords do not match"}

    # TODO: Add actual user registration logic here
    return {"message": "User registered successfully", "email": email}