from fastapi import APIRouter, Body, Depends
from app.models.navigation import RouteRequest, RouteResponse
from app.services.service_locator import navigation_service
from app.auth.auth import verify_api_key

router = APIRouter()

@router.post("/route", response_model=RouteResponse)
async def calculate_route(
    request: RouteRequest = Body(...),
    api_key: str = Depends(verify_api_key)
):
    """Calculate a route between two points"""
    return await navigation_service.calculate_route(request.start, request.end)