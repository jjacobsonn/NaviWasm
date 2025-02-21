import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './sentry'; // Initialize Sentry for error tracking

// Load the WASM module dynamically
async function loadWasm() {
  // Adjust the path based on your wasm-pack output
  return await import('../../wasm/pkg');
}

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';

function App() {
  const [wasmModule, setWasmModule] = useState(null);
  const [path, setPath] = useState("");

  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });
    // Dynamically load the WASM module
    loadWasm().then(module => {
      setWasmModule(module);
      // Example: call find_path with dummy data
      const computedPath = module.find_path("start", "end");
      setPath(computedPath);
    }).catch(err => console.error(err));
    return () => map.remove();
  }, []);

  return (
    <div>
      <div id="map" data-testid="map-container" style={{ width: '100%', height: '100vh' }} />
      <div>
        {/* Display the computed path from the WASM module */}
        {path && <p>Computed Path: {path}</p>}
      </div>
    </div>
  );
}

export default App;
