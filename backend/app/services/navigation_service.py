from app.models.navigation import Coordinates, RouteResponse
import time
import os
import sys
from typing import List
import json
from functools import lru_cache
import hashlib

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

        self.calculation_count = 0
        self.cache = {}

    def _get_cache_key(self, start: Coordinates, end: Coordinates) -> str:
        """Generate a cache key based on start and end coordinates"""
        data = f"{start.lat}:{start.lng}:{end.lat}:{end.lng}"
        return hashlib.md5(data.encode()).hexdigest()

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
        # Increment the calculation counter
        self.calculation_count += 1

        start_time = time.perf_counter()
        
        # Check cache first
        cache_key = self._get_cache_key(start, end)
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        try:
            # Fix WASM integration - properly check if WASM is available
            if self.use_wasm and hasattr(self, 'instance'):
                try:
                    # Properly call the WASM module using wasmer
                    find_path = self.instance.exports.find_path
                    result = find_path(start.lat, start.lng, end.lat, end.lng)
                    # Parse the result into path coordinates
                    path = [Coordinates(lat=point["lat"], lng=point["lng"]) 
                           for point in json.loads(result)]
                except Exception as e:
                    print(f"WASM execution error: {e}")
                    path = self._calculate_path_python(start, end)
            else:
                # Fallback to Python implementation
                path = self._calculate_path_python(start, end)
            
            calculation_time = (time.perf_counter() - start_time) * 1000
            
            result = RouteResponse(
                path=path,
                calculation_time_ms=calculation_time
            )
            
            # Cache the result
            self.cache[cache_key] = result
            return result
        except Exception as e:
            print(f"Error calculating route: {e}")
            # Fallback to simple interpolation
            return self._calculate_simple_route(start, end, start_time)

    def _calculate_simple_route(self, start: Coordinates, end: Coordinates, start_time: float) -> RouteResponse:
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