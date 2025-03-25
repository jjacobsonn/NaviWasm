from fastapi import APIRouter
import psutil
import time
from app.services.service_locator import navigation_service

router = APIRouter()
start_time = time.time()

@router.get("")
async def get_metrics():
    """Return basic metrics about the API"""
    return {
        "uptime_seconds": time.time() - start_time,
        "cpu_usage_percent": psutil.cpu_percent(),
        "memory_usage_percent": psutil.virtual_memory().percent,
        "active_threads": len(psutil.Process().threads()),
        "route_calculation_count": getattr(navigation_service, 'calculation_count', 0),
        "cache_hits": getattr(navigation_service, 'cache_hits', 0),
        "cache_size": len(getattr(navigation_service, 'cache', {})),
        "using_wasm": getattr(navigation_service, 'use_wasm', False)
    }