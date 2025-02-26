import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteData {
  path: Coordinates[];
  calculation_time_ms: number;
}

// Remove token logging for security
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

if (!process.env.REACT_APP_MAPBOX_ACCESS_TOKEN) {
  throw new Error('Mapbox token is missing');
}

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapSection: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [route, setRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calcTime, setCalcTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const movingMarker = useRef<mapboxgl.Marker | null>(null);
  const animationFrame = useRef<number>();

  // Memoize clearRoute to prevent recreation on every render
  const clearRoute = useCallback(() => {
    if (!map.current || !route) return;

    try {
      if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
      }
      if (map.current.getSource('route')) {
        map.current.removeSource('route');
      }
      setRoute(null);
    } catch (err) {
      console.error('Error clearing route:', err);
    }
  }, [route]);

  // Memoize clearMarkers
  const clearMarkers = useCallback(() => {
    markers.forEach(marker => marker.remove());
    if (movingMarker.current) {
      movingMarker.current.remove();
      movingMarker.current = null;
    }
    setMarkers([]);
    clearRoute();
    setCalcTime(null);
    setError(null);
  }, [markers, clearRoute]);

  // Memoize drawRoute
  const drawRoute = useCallback((pathData: Coordinates[]) => {
    if (!map.current || !pathData.length) return;

    try {
      clearRoute();

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: pathData.map(point => [point.lng, point.lat])
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#4a90e2',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      const bounds = new mapboxgl.LngLatBounds();
      pathData.forEach(point => bounds.extend([point.lng, point.lat]));
      
      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000
      });

      setRoute('route');
    } catch (err) {
      console.error('Error drawing route:', err);
      setError('Failed to draw route');
    }
  }, [clearRoute]);

  // Memoize handleMapClick
  const handleMapClick = useCallback(async (e: mapboxgl.MapMouseEvent) => {
    if (!map.current) return;

    const coordinates = {
      lat: e.lngLat.lat,
      lng: e.lngLat.lng
    };

    // Only allow up to 2 markers
    if (markers.length >= 2) {
      clearMarkers();
      return;
    }

    const marker = new mapboxgl.Marker({
      color: markers.length === 0 ? '#00ff00' : '#ff0000'
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    const newMarkers = [...markers, marker];
    setMarkers(newMarkers);

    // Calculate route when we have 2 markers
    if (newMarkers.length === 2) {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/navigation/route`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start: {
              lat: newMarkers[0].getLngLat().lat,
              lng: newMarkers[0].getLngLat().lng
            },
            end: {
              lat: newMarkers[1].getLngLat().lat,
              lng: newMarkers[1].getLngLat().lng
            }
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to calculate route: ${response.statusText}`);
        }

        const data: RouteData = await response.json();
        setCalcTime(data.calculation_time_ms);
        drawRoute(data.path);
      } catch (error) {
        console.error('Route calculation error:', error);
        setError(error instanceof Error ? error.message : 'Failed to calculate route');
        clearMarkers();
      } finally {
        setIsLoading(false);
      }
    }
  }, [markers, clearMarkers, drawRoute]);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    const mapInstance = map.current;
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-left');
    
    // Add click handler after map loads
    mapInstance.once('load', () => {
      mapInstance.on('click', handleMapClick);
    });

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      clearMarkers();
      mapInstance?.remove();
    };
  }, []); // Empty dependency array since we only want to run this once

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative py-24 bg-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Interactive Navigation
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click to set start (green) and end (red) points. Watch the route appear!
          </p>
          {calcTime && (
            <p className="text-sm text-gray-500 mt-2">
              Route calculated in {calcTime.toFixed(2)}ms
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-[600px] relative"
        >
          <div ref={mapContainer} className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
          <button
            onClick={clearMarkers}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-300 z-10"
          >
            Reset
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MapSection;