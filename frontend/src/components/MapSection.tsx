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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL);
console.log('Mapbox token:', process.env.REACT_APP_MAPBOX_ACCESS_TOKEN?.substring(0, 10) + '...');

const MapSection: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [route, setRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calcTime, setCalcTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // For real-time movement
  const movingMarker = useRef<mapboxgl.Marker | null>(null);
  const path = useRef<Coordinates[]>([]);
  const animationFrame = useRef<number>();

  const clearRoute = useCallback(() => {
    if (!map.current) return;

    try {
      // Only try to remove if map is loaded
      if (map.current.loaded()) {
        if (map.current.getLayer('route')) {
          map.current.removeLayer('route');
        }
        if (map.current.getSource('route')) {
          map.current.removeSource('route');
        }
      }
      setRoute(null);
    } catch (err) {
      console.error('Error clearing route:', err);
    }
  }, []);

  const clearMarkers = useCallback(() => {
    try {
      // Clear markers
      markers.forEach(marker => {
        if (marker) marker.remove();
      });
      if (movingMarker.current) {
        movingMarker.current.remove();
        movingMarker.current = null;
      }
      setMarkers([]);

      // Clear route
      clearRoute();
      
      // Reset other state
      setCalcTime(null);
      setError(null);
      path.current = [];
    } catch (err) {
      console.error('Error clearing markers:', err);
    }
  }, [markers, clearRoute]);

  const drawRoute = useCallback((pathData: Coordinates[]) => {
    if (!map.current || !map.current.loaded()) return;

    try {
      clearRoute();

      path.current = pathData;

      // Add new route
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
          'line-width': 6,
          'line-opacity': 0.8
        }
      });

      // Fit bounds
      const coordinates = pathData.map(point => [point.lng, point.lat] as [number, number]);
      if (coordinates.length > 0) {
        const bounds = coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );

        map.current.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
      }

      setRoute('route');
    } catch (err) {
      console.error('Error drawing route:', err);
    }
  }, [clearRoute]);

  const startMovingMarker = useCallback((pathData: Coordinates[]) => {
    if (!map.current) return;
    
    if (movingMarker.current) {
      movingMarker.current.remove();
    }
    
    movingMarker.current = new mapboxgl.Marker({
      color: '#0000ff',
      scale: 0.8
    });

    let start: number;
    const duration = 3000;

    function animate(timestamp: number) {
      if (start === undefined) {
        start = timestamp;
      }

      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      const index = Math.floor(progress * (pathData.length - 1));
      const nextIndex = Math.min(index + 1, pathData.length - 1);
      const pathProgress = (progress * (pathData.length - 1)) % 1;

      const currentPos = {
        lng: pathData[index].lng + (pathData[nextIndex].lng - pathData[index].lng) * pathProgress,
        lat: pathData[index].lat + (pathData[nextIndex].lat - pathData[index].lat) * pathProgress
      };

      if (movingMarker.current && map.current) {
        movingMarker.current
          .setLngLat([currentPos.lng, currentPos.lat])
          .addTo(map.current);
      }

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    }

    animationFrame.current = requestAnimationFrame(animate);
  }, []);

  const handleMapClick = useCallback(async (e: mapboxgl.MapMouseEvent) => {
    console.log('handleMapClick called', e.lngLat);
    if (!map.current) {
      console.log('Map not initialized');
      return;
    }

    setError(null);

    const coordinates: Coordinates = {
      lat: e.lngLat.lat,
      lng: e.lngLat.lng
    };

    if (markers.length >= 2) {
      console.log('Clearing existing markers');
      clearMarkers();
      return;
    }

    console.log('Adding marker:', coordinates);
    const marker = new mapboxgl.Marker({
      color: markers.length === 0 ? '#00ff00' : '#ff0000'
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    const newMarkers = [...markers, marker];
    setMarkers(newMarkers);

    if (newMarkers.length === 2) {
      setIsLoading(true);
      const requestData = {
        start: {
          lat: newMarkers[0].getLngLat().lat,
          lng: newMarkers[0].getLngLat().lng
        },
        end: {
          lat: newMarkers[1].getLngLat().lat,
          lng: newMarkers[1].getLngLat().lng
        }
      };
      
      console.log('Sending route request:', requestData);

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/navigation/route`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        console.log('Response status:', response.status);
        const data = await response.json() as RouteData;
        console.log('Route data received:', data);

        if (!response.ok) {
          throw new Error(`Failed to calculate route: ${response.statusText}`);
        }
        
        if (!data.path || !Array.isArray(data.path)) {
          console.error('Invalid route data:', data);
          throw new Error('Invalid route data received');
        }

        setCalcTime(data.calculation_time_ms);
        drawRoute(data.path);
        startMovingMarker(data.path);
      } catch (error) {
        console.error('Error calculating route:', error);
        setError(error instanceof Error ? error.message : 'Failed to calculate route');
        clearMarkers();
      } finally {
        setIsLoading(false);
      }
    }
  }, [markers, clearMarkers, drawRoute, startMovingMarker]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    let mapInstance: mapboxgl.Map | null = null;
    let isMapLoaded = false;

    try {
      mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-74.5, 40],
        zoom: 9,
        attributionControl: true,
        interactive: true,
        dragPan: true,
        dragRotate: true,
        touchZoomRotate: true,
        scrollZoom: true,
        minZoom: 2,
        maxZoom: 20,
        boxZoom: true,
        doubleClickZoom: true
      });

      map.current = mapInstance;

      // Add error handling
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map properly');
      });

      // Add navigation control
      mapInstance.addControl(
        new mapboxgl.NavigationControl(),
        'top-left'
      );

      // Wait for both map and style to be loaded
      mapInstance.on('style.load', () => {
        console.log('Map style loaded');
        isMapLoaded = true;
      });

      mapInstance.on('load', () => {
        console.log('Map loaded');
        if (!mapInstance) return;

        // Add click handler directly to the map
        mapInstance.on('click', (e) => {
          console.log('Map clicked at:', e.lngLat);
          handleMapClick(e);
        });
      });

      return () => {
        // Cleanup
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }

        // Only try to remove markers and layers if map was loaded
        if (isMapLoaded && mapInstance) {
          try {
            clearMarkers();
          } catch (err) {
            console.error('Error clearing markers during cleanup:', err);
          }
        }

        // Remove map instance
        if (mapInstance) {
          try {
            mapInstance.remove();
          } catch (err) {
            console.error('Error removing map during cleanup:', err);
          }
        }
        
        map.current = null;
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, []);

  return (
    <motion.section
      id="map"
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
            className="text-4xl font-bold font-poppins mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
          >
            Interactive Live Map
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
            Click to set start (green) and end (red) points. Watch the blue marker navigate the route!
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
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg shadow transition-all duration-300"
          >
            Reset
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MapSection;