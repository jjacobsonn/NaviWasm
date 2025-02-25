from fastapi import APIRouter
from app.api.v1.endpoints import health, navigation

api_router = APIRouter()

# Include routers with specific prefixes and tags
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(navigation.router, prefix="/navigation", tags=["navigation"]) 