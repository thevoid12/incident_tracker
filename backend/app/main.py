from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from api.api_handler import router as api_router

app = FastAPI(title="Incident Tracker", version="1.0.0")

# Mount static files for React app
static_path = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
if os.path.exists(static_path):
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")
# else:
#     # TODO: lkog the error and display

# Include API routes
app.include_router(api_router, tags=["api"])
