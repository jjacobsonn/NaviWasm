from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Navigation System API"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]  # Add your frontend URL
    
    # Add any additional configuration items here
    MAPBOX_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()