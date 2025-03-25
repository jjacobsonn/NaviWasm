import wasmtime
import os
import logging

logger = logging.getLogger(__name__)

class WasmService:
    def __init__(self):
        self.store = None
        self.instance = None
        self.memory = None
        self.find_path_func = None
        self.initialize()
    
    def initialize(self):
        try:
            # Get the path to the WASM file
            wasm_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                                    "wasm", "pkg", "naviwasm_bg.wasm")
            
            if not os.path.exists(wasm_path):
                logger.warning(f"WASM file not found at: {wasm_path}")
                return False
                
            # Initialize the WASM runtime
            engine = wasmtime.Engine()
            module = wasmtime.Module(engine, open(wasm_path, 'rb').read())
            linker = wasmtime.Linker(engine)
            linker.define_wasi()
            wasi = wasmtime.WasiConfig()
            wasi.inherit_stdout()
            wasi.inherit_stderr()
            self.store = wasmtime.Store(engine)
            self.store.set_wasi(wasi)
            
            # Instantiate the module
            self.instance = linker.instantiate(self.store, module)
            
            # Get exports
            self.memory = self.instance.exports(self.store).get("memory")
            self.find_path_func = self.instance.exports(self.store).get("find_path")
            
            logger.info("WASM module initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize WASM: {str(e)}")
            return False
    
    def find_path(self, start_lat, start_lng, end_lat, end_lng):
        if not self.find_path_func:
            return None
            
        try:
            # Call the WASM function
            result_ptr = self.find_path_func(self.store, 
                                           start_lat, start_lng, 
                                           end_lat, end_lng)
            
            # Read the result from WASM memory
            # This part depends on how your WASM module returns data
            # For example, if it returns a pointer to a null-terminated string:
            result = ""
            i = result_ptr
            while True:
                byte = self.memory.read(self.store, i, 1)[0]
                if byte == 0:
                    break
                result += chr(byte)
                i += 1
                
            return result
        except Exception as e:
            logger.error(f"Error calling WASM function: {str(e)}")
            return None