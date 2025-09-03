from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
import os

from api.api_handler import api_router
from core import setup_logging, LOGGER, AppException

# Setup logging
setup_logging()

app = FastAPI(title="Incident Tracker", version="1.0.0")

# Global exception handler. The exception handler is needed
# here because, when an exception arises we need to safely log
# and make sure app dont crash and runs continuously.
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
assets_path = os.path.join(static_path, "assets")

# Mount static assets directory for serving CSS, JS, etc.
if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="static")
    LOGGER.info(f"Static assets mounted from: {assets_path}")
else:
    LOGGER.warning(f"Static assets directory not found: {assets_path}")


# if FastAPI doesn’t recognize /abc as an API route or static asset, it falls back to index.html.
# That means the browser loads index.html, React initializes, React Router sees /abc
# in the browser URL, and renders the correct page.
@app.get("/{full_path:path}")
async def spa_fallback(request: Request):
    """
    Catch-all route to serve React's index.html
    for any unknown path.
    Lets React Router handle client-side routing.
    """
    index_file = os.path.join(static_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse(status_code=404, content={"error": "Frontend not built"})