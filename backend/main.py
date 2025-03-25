from fastapi import FastAPI, Request, status, Depends, HTTPException
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
from fastapi.security import APIKeyHeader
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
import time
from datetime import datetime, timedelta
import asyncio
from app.middleware.rate_limiter import rate_limiter

settings = get_settings()

app = FastAPI(
    title="NaviWasm API",
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

# Simple in-memory rate limiter store
rate_limit_store = {}
RATE_LIMIT = 100  # requests per minute

async def rate_limiter(request: Request):
    client_ip = request.client.host
    now = datetime.now()
    
    # Initialize or clean up old entries
    if client_ip not in rate_limit_store:
        rate_limit_store[client_ip] = []
    
    # Remove entries older than 1 minute
    rate_limit_store[client_ip] = [
        timestamp for timestamp in rate_limit_store[client_ip] 
        if timestamp > now - timedelta(minutes=1)
    ]
    
    # Check if rate limit is exceeded
    if len(rate_limit_store[client_ip]) >= RATE_LIMIT:
        raise HTTPException(
            status_code=HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        )
    
    # Add current request timestamp
    rate_limit_store[client_ip].append(now)
    
    # Schedule cleanup for old entries
    asyncio.create_task(cleanup_old_rate_limits())
    
    return True

async def cleanup_old_rate_limits():
    await asyncio.sleep(60)  # Wait 1 minute
    now = datetime.now()
    for ip in list(rate_limit_store.keys()):
        rate_limit_store[ip] = [
            timestamp for timestamp in rate_limit_store[ip] 
            if timestamp > now - timedelta(minutes=1)
        ]
        if not rate_limit_store[ip]:
            del rate_limit_store[ip]

# Include API router with rate limiter
app.include_router(
    api_router, 
    prefix="/api/v1", 
    dependencies=[Depends(rate_limiter.check_rate_limit)]
)

# Add exception handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)