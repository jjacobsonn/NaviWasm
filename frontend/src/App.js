import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// Consider moving the access token to an environment variable for production
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';

function App() {
  useEffect(() => {
    // Initialize map
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });
    // ...additional map features...
    return () => map.remove();
  }, []);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '100vh' }} />
    </div>
  );
}

export default App;
