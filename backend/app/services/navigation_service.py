from app.models.navigation import Coordinates, RouteResponse
import time
from wasmer import Store, Module, Instance
import os

class NavigationService:
    def __init__(self):
        # Initialize WASM module
        store = Store()
        wasm_path = os.path.join(os.path.dirname(__file__), "../../wasm/pkg/wasm_bg.wasm")
        wasm_bytes = open(wasm_path, "rb").read()
        self.module = Module(store, wasm_bytes)
        self.instance = Instance(self.module)

    async def calculate_route(
        self,
        start: Coordinates,
        end: Coordinates
    ) -> RouteResponse:
        start_time = time.perf_counter()
        
        # Call Rust pathfinding function
        path = self.instance.exports.find_path(
            start.lat, start.lng,
            end.lat, end.lng
        )
        
        calculation_time = (time.perf_counter() - start_time) * 1000  # Convert to milliseconds
        
        return RouteResponse(
            path=path,
            calculation_time_ms=calculation_time
        ) 