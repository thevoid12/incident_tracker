from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

import os

from api.api_handler import router as api_router

app = FastAPI(title="Incident Tracker", version="1.0.0")

# Mount static files for React app
# creating clear distinction,
# Static files handles “frontend routes” (like /, /login, /register etc.
# FastAPI should handle “API routes” (like /api/* ).

# Include API routes first because Order of route mounting matters.
# if static files are called first it wont know what to do with the post req
# all it knows is to parse relative static files which not post req
app.include_router(api_router, tags=["api"])

static_path = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
if os.path.exists(static_path):
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")
# else:
#     # TODO: lkog the error and display


