from pydantic import BaseModel
from typing import List, Tuple

class Coordinates(BaseModel):
    lat: float
    lng: float

class RouteRequest(BaseModel):
    start: Coordinates
    end: Coordinates

class RouteResponse(BaseModel):
    path: List[Coordinates]
    distance: float
    duration: float 