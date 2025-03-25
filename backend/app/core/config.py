import os

# Try to import from pydantic_settings, fall back to pydantic
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
    print("Warning: pydantic_settings not found, falling back to pydantic BaseSettings")

from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Navigation System API"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000"
    ]
    
    # Add any additional configuration items here
    MAPBOX_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()