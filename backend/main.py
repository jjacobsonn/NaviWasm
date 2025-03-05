from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse, JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
import os
from app.core.config import get_settings
from app.api.v1.router import api_router
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.errors import (
    http_exception_handler,
    validation_exception_handler,
    generic_exception_handler
)

settings = get_settings()

app = FastAPI(
    title="Navigation System API",
    description="A real-time navigation system with Rust WASM pathfinding",
    version="1.0.0"
)

# Mount static files directory
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Favicon endpoint with error handling
@app.get("/favicon.ico")
async def favicon():
    favicon_path = os.path.join(static_dir, "favicon.ico")
    if not os.path.exists(favicon_path):
        return JSONResponse(
            status_code=204,  # No Content
            content={}
        )
    return FileResponse(favicon_path)

# Documentation endpoint
@app.get("/docs")
async def get_docs():
    return get_swagger_ui_html(openapi_url=f"{settings.API_V1_STR}/openapi.json", title=f"{settings.PROJECT_NAME} - API Documentation")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Navigation System API"}

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Add exception handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)