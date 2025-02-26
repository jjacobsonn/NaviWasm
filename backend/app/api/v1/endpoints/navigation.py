from fastapi import APIRouter, HTTPException
from app.models.navigation import RouteRequest, RouteResponse
from app.services.navigation_service import NavigationService
import logging

router = APIRouter()
navigation_service = NavigationService()

@router.post("/route", response_model=RouteResponse)
async def calculate_route(request: RouteRequest):
    print(f"Received route request: {request}")  # Add debug logging
    try:
        result = await navigation_service.calculate_route(
            start=request.start,
            end=request.end
        )
        print(f"Calculated route: {result}")  # Add debug logging
        return result
    except Exception as e:
        print(f"Error calculating route: {e}")  # Add debug logging
        raise HTTPException(status_code=400, detail=str(e))