import pytest
from fastapi.testclient import TestClient
from app.models.navigation import Coordinates
from main import app
from app.services.navigation_service import NavigationService

client = TestClient(app)

def test_calculate_route():
    # Test the API endpoint
    response = client.post(
        "/api/v1/navigation/route",
        json={
            "start": {"lat": 40.7128, "lng": -74.0060},
            "end": {"lat": 37.7749, "lng": -122.4194}
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "path" in data
    assert "calculation_time_ms" in data
    assert len(data["path"]) > 0

def test_navigation_service():
    # Test the service directly
    nav_service = NavigationService()
    start = Coordinates(lat=40.7128, lng=-74.0060)
    end = Coordinates(lat=37.7749, lng=-122.4194)
    
    result = await nav_service.calculate_route(start, end)
    assert result.path is not None
    assert len(result.path) > 0
    assert result.calculation_time_ms > 0