from fastapi import APIRouter

router = APIRouter()

@router.get("/check")
async def health_check():
    return {"status": "healthy"} 