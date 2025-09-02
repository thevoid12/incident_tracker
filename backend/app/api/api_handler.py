from fastapi import APIRouter

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


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "incident-tracker-backend"}