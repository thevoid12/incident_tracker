from fastapi import APIRouter, Form

router = APIRouter()

# @router.get("/")
# async def api_root():
#     """API root endpoint"""
#     return {"message": "Incident Tracker API", "version": "1.0.0"}

@router.get("/incidents")
async def get_incidents():
    """Get all incidents (placeholder)"""
    return {"incidents": [], "message": "No incidents found"}

@router.post("/incidents")
async def create_incident():
    """Create a new incident (placeholder)"""
    return {"message": "Incident created", "id": 1}


@router.post("/reg")
async def register_user(
    email: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...)
):
    """Register a new user"""
    print("Hiiii")
    print(f"Registration attempt:")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print(f"Confirm Password: {confirm_password}")

    # Basic validation
    if password != confirm_password:
        return {"error": "Passwords do not match"}

    # TODO: Add actual user registration logic here
    return {"message": "User registered successfully", "email": email}

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "incident-tracker-backend"}