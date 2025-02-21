from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
import os
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
import wasmtime  # Ensure you have installed wasmtime via `pip install wasmtime`

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("navigation-backend")

# Initialize Sentry if DSN is provided via environment variable
sentry_dsn = os.getenv("SENTRY_DSN")
if sentry_dsn:
    sentry_sdk.init(dsn=sentry_dsn, traces_sample_rate=1.0)
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

# Initialize Wasmtime to load the WASM module once at startup.
wasm_store = wasmtime.Store()
wasm_pkg_path = os.path.join(os.path.dirname(__file__), '../wasm/pkg/module_bg.wasm')
try:
    with open(wasm_pkg_path, 'rb') as f:
        wasm_bytes = f.read()
    wasm_module = wasmtime.Module(wasm_store.engine, wasm_bytes)
    linker = wasmtime.Linker(wasm_store.engine)
    wasm_instance = linker.instantiate(wasm_store, wasm_module)
    # Exported function 'find_path'
    find_path_func = wasm_instance.exports(wasm_store)["find_path"]
except Exception as e:
    logger.error("Failed to load WASM module: %s", e)
    find_path_func = None

@app.post("/navigate")
async def navigate(req: NavigationRequest):
    try:
        logger.info("Received navigation request: %s", req)
        # Check if WASM function is loaded
        if find_path_func:
            # Convert start and end lists to string (e.g., "lat,lon")
            start_str = ",".join(map(str, req.start))
            end_str = ",".join(map(str, req.end))
            # Call the WASM function via wasmtime.
            route = find_path_func(wasm_store, start_str, end_str)
            path = {"route": route}
        else:
            # Fallback dummy path.
            path = {"route": [req.start, req.end], "details": "WASM module unavailable"}
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