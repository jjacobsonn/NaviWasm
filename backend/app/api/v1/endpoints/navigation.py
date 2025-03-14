from fastapi import APIRouter, HTTPException
from app.models.navigation import RouteRequest, RouteResponse
from app.services.navigation_service import NavigationService

router = APIRouter()
navigation_service = NavigationService()

@router.post("/route", response_model=RouteResponse)
async def calculate_route(request: RouteRequest):
    try:
        return await navigation_service.calculate_route(request.start, request.end)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))