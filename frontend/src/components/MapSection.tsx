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
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

console.log('API Base URL:', API_BASE_URL);
console.log('Mapbox token:', MAPBOX_TOKEN?.substring(0, 10) + '...');

if (!MAPBOX_TOKEN) {
  throw new Error('Mapbox token is required');
}

mapboxgl.accessToken = MAPBOX_TOKEN;

const MapSection: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const startMarker = useRef<mapboxgl.Marker | null>(null);
  const endMarker = useRef<mapboxgl.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calcTime, setCalcTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'idle' | 'start' | 'end'>('idle');

  // Clear route
  const clearRoute = useCallback(() => {
    if (!map.current) return;
    
    try {
      if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
      }
      if (map.current.getLayer('route-outline')) {
        map.current.removeLayer('route-outline');
      }
      if (map.current.getSource('route')) {
        map.current.removeSource('route');
      }
    } catch (err) {
      console.error('Error clearing route:', err);
    }
  }, []);

  // Reset everything
  const resetMap = useCallback(() => {
    if (startMarker.current) {
      startMarker.current.remove();
      startMarker.current = null;
    }
    
    if (endMarker.current) {
      endMarker.current.remove();
      endMarker.current = null;
    }
    
    clearRoute();
    setCalcTime(null);
    setError(null);
    setMode('idle');
    console.log('Map reset complete');
  }, [clearRoute]);

  // Draw route on map
  const drawRoute = useCallback((path: Coordinates[]) => {
    if (!map.current || path.length === 0) return;
    
    // Clear any existing route
    if (map.current.getLayer('route')) {
      map.current.removeLayer('route');
    }
    if (map.current.getLayer('route-outline')) {
      map.current.removeLayer('route-outline');
    }
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }
    
    try {
      // Create a GeoJSON source for the route
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: path.map(point => [point.lng, point.lat])
        }
      };
      
      // Add the source to the map
      map.current.addSource('route', {
        type: 'geojson',
        data: geojson as any
      });
      
      // Add outline and route layers
      map.current.addLayer({
        id: 'route-outline',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 8
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
          'line-color': '#4338ca',
          'line-width': 4
        }
      });
      
      console.log('Route drawn successfully with', path.length, 'points');
    } catch (err) {
      console.error('Error drawing route:', err);
      setError('Failed to display route');
    }
  }, []);

  // Calculate route
  const calculateRoute = useCallback(async () => {
    if (!map.current || !startMarker.current || !endMarker.current) {
      setError('Cannot calculate route: missing markers');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const startCoords = startMarker.current.getLngLat();
      const endCoords = endMarker.current.getLngLat();
      
      console.log('Calculating route between points:', {
        start: { lat: startCoords.lat, lng: startCoords.lng },
        end: { lat: endCoords.lat, lng: endCoords.lng }
      });
      
      const response = await fetch(`${API_BASE_URL}/api/v1/navigation/route`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': 'development_key'
        },
        body: JSON.stringify({
          start: { lat: startCoords.lat, lng: startCoords.lng },
          end: { lat: endCoords.lat, lng: endCoords.lng }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data: RouteData = await response.json();
      console.log('Route calculated:', data);
      setCalcTime(data.calculation_time_ms);
      
      // Draw the route
      if (data.path.length > 0) {
        drawRoute(data.path);
      } else {
        setError('Could not find a route between these points');
      }
    } catch (err) {
      console.error('Route calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate route');
    } finally {
      setIsLoading(false);
    }
  }, [drawRoute]);
  
  // Handle map clicks
  const handleMapClick = useCallback((e: mapboxgl.MapMouseEvent, clickMode: 'idle' | 'start' | 'end') => {
    if (!map.current || clickMode === 'idle') return;
    
    const lngLat = e.lngLat;
    console.log(`Map clicked at ${lngLat.lng}, ${lngLat.lat} in mode ${clickMode}`);
    
    // Prevent event defaults to stop map from zooming/panning
    if (e.originalEvent) {
      e.originalEvent.stopPropagation();
      e.originalEvent.preventDefault();
    }
    
    const lngLat = e.lngLat;
    console.log(`Map clicked at ${lngLat.lng}, ${lngLat.lat} in mode ${clickMode}`);
    
    // Force immediate mode check for reliability
    const currentMode = clickMode;
    
    // Create marker element
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '25px';
    el.style.height = '25px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = currentMode === 'start' ? '#8B5CF6' : '#EC4899';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    
    // Create the marker with element option
    const marker = new mapboxgl.Marker({ 
      element: el,
      draggable: false, // Ensure it's not draggable to avoid issues
    })
      .setLngLat(lngLat)
      .addTo(map.current);
    
    console.log('Created marker:', marker);
    
    // Store the marker and update state based on mode
    if (currentMode === 'start') {
      console.log('Placing start marker');
      if (startMarker.current) {
        startMarker.current.remove();
      }
      startMarker.current = marker;
    } else if (currentMode === 'end') {
      console.log('Placing end marker');
      if (endMarker.current) {
        endMarker.current.remove();
      }
      endMarker.current = marker;
      
      // If we have both markers, calculate route
      if (startMarker.current) {
        calculateRoute();
      }
    }
    
    // Return to idle mode AFTER marker placement is complete
    setTimeout(() => {
      setMode('idle');
      console.log('Returned to idle mode');
    }, 10);
  }, [calculateRoute]);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    console.log('Initializing map...');
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98, 39], 
      zoom: 3,
      attributionControl: true,
      doubleClickZoom: false, // Disable double click zoom
      dragPan: true,  // Keep drag enabled
    });
    
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.current = mapInstance;
    
    // Set up click handler only after map is fully loaded
    mapInstance.once('load', () => {
      console.log('Map loaded successfully');
      
      // Add a separate handler for the click event to prevent other handlers
      mapInstance.on('click', (e) => {
        console.log('Map clicked at:', e.lngLat);
        
        if (mode !== 'idle') {
          handleMapClick(e, mode);
        }
      });
      
      // Save the handler for cleanup
      return () => {
        mapInstance.off('click', mapClickHandler);
        mapInstance.remove();
        map.current = null;
      };
    });
  }, [handleMapClick, mode]);

  const placeStartMarkerAtCenter = useCallback(() => {
    if (!map.current) return;
    
    const center = map.current.getCenter();
    console.log('Placing start marker at center:', center);
    
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '25px';
    el.style.height = '25px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#8B5CF6';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    
    if (startMarker.current) {
      startMarker.current.remove();
    }
    
    startMarker.current = new mapboxgl.Marker({
      element: el,
      draggable: false
    })
      .setLngLat(center)
      .addTo(map.current);
  }, []);
  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 bg-white"
      id="map-section"
    >
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Calculate Your Route
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Select your starting point and destination to find the optimal route between them.
          </motion.p>
        </div>
        
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent any default button behavior
                console.log('Start button clicked, changing mode from', mode, 'to start');
                setMode('start');
                setError(null);
                console.log('Start mode activated'); // Add logging
              }}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-all ${
                mode === 'start'
                ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              1. Select Start Point
            </button>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent any default button behavior
                console.log('End button clicked, changing mode from', mode, 'to end');
                setMode('end');
                setError(null);
                console.log('End mode activated'); // Add logging
              }}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-all ${
                mode === 'end'
                ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              2. Select End Point
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                resetMap();
                console.log('Map reset triggered');
              }}
              className="px-4 py-2 rounded-lg font-medium shadow-sm border border-red-300 text-red-700 hover:bg-red-50"
            >
              Reset Map
            </button>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200 h-[600px]"
          >
            <div 
              ref={mapContainer} 
              className="absolute inset-0 w-full h-full"
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                <div className="p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
                  <p className="text-gray-700">Calculating route...</p>
                </div>
              </div>
            )}
            
            {mode !== 'idle' && (
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white py-2 px-4 rounded-lg shadow-lg z-10">
                <p className="font-medium text-gray-700">
                  {mode === 'start' ? 'Click to place start marker' : 'Click to place end marker'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
        
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={placeStartMarkerAtCenter}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg"
          >
            Place Start At Center
          </button>
          {/* Add similar function for end marker */}
        </div>
      </div>
    </motion.section>
  );
};

export default MapSection;