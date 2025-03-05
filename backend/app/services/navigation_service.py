from app.models.navigation import Coordinates, RouteResponse
import time
import os
import sys
from typing import List

class NavigationService:
    def __init__(self):
        try:
            from wasmer import Store, Module, Instance, ImportObject
            store = Store()
            current_dir = os.path.dirname(os.path.abspath(__file__))
            wasm_path = os.path.join(current_dir, "../../wasm/pkg/wasm_bg.wasm")
            
            if not os.path.exists(wasm_path):
                raise FileNotFoundError(f"WASM file not found at {wasm_path}")
            
            print(f"Loading WASM from: {wasm_path}")
            
            with open(wasm_path, "rb") as wasm_file:
                wasm_bytes = wasm_file.read()
            
            self.module = Module(store, wasm_bytes)
            import_object = ImportObject()
            self.instance = Instance(self.module, import_object)
            self.use_wasm = True
            print("WASM module loaded successfully")
            
        except ImportError as e:
            print(f"Warning: Wasmer not available, falling back to Python implementation: {str(e)}")
            self.use_wasm = False
        except Exception as e:
            print(f"Error initializing WASM: {str(e)}", file=sys.stderr)
            self.use_wasm = False

    def _calculate_path_python(self, start: Coordinates, end: Coordinates) -> List[Coordinates]:
        """Fallback Python implementation when WASM is not available"""
        path = []
        steps = 50
        for i in range(steps + 1):
            t = i / steps
            lat = start.lat + (end.lat - start.lat) * t
            lng = start.lng + (end.lng - start.lng) * t
            path.append(Coordinates(lat=lat, lng=lng))
        return path

    async def calculate_route(
        self,
        start: Coordinates,
        end: Coordinates
    ) -> RouteResponse:
        start_time = time.perf_counter()
        
        # Simple linear interpolation for testing
        steps = 10
        path: List[Coordinates] = []
        
        for i in range(steps + 1):
            t = i / steps
            lat = start.lat + (end.lat - start.lat) * t
            lng = start.lng + (end.lng - start.lng) * t
            path.append(Coordinates(lat=lat, lng=lng))
        
        calculation_time = (time.perf_counter() - start_time) * 1000
        
        return RouteResponse(
            path=path,
            calculation_time_ms=calculation_time
        ) 