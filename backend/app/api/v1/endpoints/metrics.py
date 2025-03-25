from fastapi import APIRouter
import psutil
import time
from app.services.navigation_service import NavigationService

router = APIRouter()
start_time = time.time()

# Get a singleton instance of the navigation service
navigation_service = NavigationService()

@router.get("")
async def get_metrics():
    """Return basic metrics about the API"""
    return {
        "uptime_seconds": time.time() - start_time,
        "cpu_usage_percent": psutil.cpu_percent(),
        "memory_usage_percent": psutil.virtual_memory().percent,
        "active_threads": len(psutil.Process().threads()),
        # Use getattr to safely access the attribute
        "route_calculation_count": getattr(navigation_service, 'calculation_count', 0)
    }

# Update router.py to include metrics
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])