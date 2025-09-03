from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from api.api_handler import api_router
from core import setup_logging, LOGGER, AppException

# Setup logging
setup_logging()

app = FastAPI(title="Incident Tracker", version="1.0.0")

# Global exception handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    LOGGER.error(
        f"Application error: {exc.message}",
        extra={
            "status_code": exc.status_code,
            "details": exc.details,
            "path": str(request.url),
            "method": request.method
        }
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "details": exc.details
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    LOGGER.info("Application startup initiated")
    # Add any startup tasks here (database initialization, etc.)
    LOGGER.info("Application startup completed")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    LOGGER.info("Application shutdown initiated")
    # Add any cleanup tasks here
    LOGGER.info("Application shutdown completed")

# Mount static files for React app
# creating clear distinction,
# Static files handles "frontend routes" (like /, /login, /register etc.
# FastAPI should handle "API routes" (like /api/* ).

# Include API routes first because Order of route mounting matters.
# if static files are called first it wont know what to do with the post req
# all it knows is to parse relative static files which not post req
app.include_router(api_router, tags=["api"])

static_path = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
if os.path.exists(static_path):
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")
    LOGGER.info(f"Static files mounted from: {static_path}")
else:
    LOGGER.warning(f"Static files directory not found: {static_path}")


