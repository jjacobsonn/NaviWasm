from fastapi import APIRouter, Body
from app.models.navigation import RouteRequest, RouteResponse
from app.services.service_locator import navigation_service

router = APIRouter()

@router.post("/route", response_model=RouteResponse)
async def calculate_route(request: RouteRequest = Body(...)):
    """Calculate a route between two points"""
    return await navigation_service.calculate_route(request.start, request.end)