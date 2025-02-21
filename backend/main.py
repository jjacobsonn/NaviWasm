from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
import os
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("navigation-backend")

# Initialize Sentry if DSN is provided via environment variable
sentry_dsn = os.getenv("SENTRY_DSN")
if sentry_dsn:
    sentry_sdk.init(dsn=sentry_dsn, traces_sample_rate=1.0)
    # Attach Sentry ASGI middleware
    app = FastAPI()
    app.add_middleware(SentryAsgiMiddleware)
else:
    app = FastAPI()

class NavigationRequest(BaseModel):
    start: list[float]
    end: list[float]

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/navigate")
async def navigate(req: NavigationRequest):
    try:
        logger.info("Received navigation request: %s", req)
        # ...integration with Rust Wasm for pathfinding...
        path = {"route": [req.start, req.end]}  # Placeholder for computed path
        return path
    except Exception as e:
        logger.error("Error in /navigate: %s", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/wasm-path")
async def wasm_path(req: NavigationRequest):
    try:
        logger.info("Received wasm_path request: %s", req)
        simulated = {"route": [req.start, req.end], "note": "Result from WASM module would appear here."}
        return simulated
    except Exception as e:
        logger.error("Error in /wasm-path: %s", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")