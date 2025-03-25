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

// Add this function after your other imports
function calculateDistance(start: Coordinates, end: Coordinates): number {
  // Implementation of the Haversine formula to calculate distance
  const R = 6371; // Earth's radius in km
  const dLat = (end.lat - start.lat) * Math.PI / 180;
  const dLon = (end.lng - start.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

interface RouteItem {
  startMarker: mapboxgl.Marker;
  endMarker: mapboxgl.Marker;
  popup: mapboxgl.Popup | null;
  sourceId: string;
  layerId: string;
  outlineLayerId: string;
}

const MapSection: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const startMarker = useRef<mapboxgl.Marker | null>(null);
  const endMarker = useRef<mapboxgl.Marker | null>(null);
  const routePopup = useRef<mapboxgl.Popup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calcTime, setCalcTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'idle' | 'start' | 'end'>('idle');
  const [markerCount, setMarkerCount] = useState(0);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(-1);
  const tempStartMarker = useRef<mapboxgl.Marker | null>(null);

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
    // Remove current markers and popup
    if (startMarker.current) {
      startMarker.current.remove();
      startMarker.current = null;
    }
    
    if (endMarker.current) {
      endMarker.current.remove();
      endMarker.current = null;
    }
    
    if (routePopup.current) {
      routePopup.current.remove();
      routePopup.current = null;
    }
    
    // Remove ALL stored routes, markers, and popups
    routes.forEach(route => {
      // Remove markers
      route.startMarker.remove();
      route.endMarker.remove();
      
      // Remove popup
      if (route.popup) {
        route.popup.remove();
      }
      
      // Remove route layers and sources
      if (map.current) {
        try {
          if (map.current.getLayer(route.layerId)) {
            map.current.removeLayer(route.layerId);
          }
          if (map.current.getLayer(route.outlineLayerId)) {
            map.current.removeLayer(route.outlineLayerId);
          }
          if (map.current.getSource(route.sourceId)) {
            map.current.removeSource(route.sourceId);
          }
        } catch (err) {
          console.error('Error removing route layers/sources:', err);
        }
      }
    });
    
    // Clear the routes array
    setRoutes([]);
    
    // Clear current route
    clearRoute();
    
    setCalcTime(null);
    setError(null);
    setMode('idle');
    setMarkerCount(0);
    console.log('Map completely reset');
  }, [clearRoute, routes]);

  // Draw route on map
  const drawRoute = useCallback((path: Coordinates[]) => {
    if (!map.current || path.length === 0) return;
    
    // Generate unique IDs for this route
    const routeId = `route-${Date.now()}`;  // Use timestamp for truly unique IDs
    const sourceId = `source-${routeId}`;
    const layerId = routeId;
    const outlineLayerId = `${routeId}-outline`;
    
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
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: geojson as any
      });
      
      // Add outline and route layers with unique IDs
      map.current.addLayer({
        id: outlineLayerId,
        type: 'line',
        source: sourceId,
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
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#4338ca',
          'line-width': 4
        }
      });
      
      // Calculate the midpoint of the path for popup positioning
      if (path.length > 1 && startMarker.current && endMarker.current) {
        const start = path[0];
        const end = path[path.length - 1];
        const midIndex = Math.floor(path.length / 2);
        const midpoint = path[midIndex];
        
        // Calculate distance
        const distance = calculateDistance(start, end);
        const distanceStr = distance < 1 
          ? `${(distance * 1000).toFixed(0)} m` 
          : `${distance.toFixed(2)} km`;
        
        // Remove any existing popup
        if (routePopup.current) {
          routePopup.current.remove();
        }
        
        // Create and add popup
        routePopup.current = new mapboxgl.Popup({ 
          closeButton: false, 
          className: 'route-popup',
          closeOnClick: false, 
          closeOnMove: false 
        })
          .setLngLat([midpoint.lng, midpoint.lat])
          .setHTML(`
            <div class="p-2 text-center">
              <div class="font-bold text-gray-900">Distance</div>
              <div class="text-lg text-indigo-600">${distanceStr}</div>
              <div class="text-sm text-gray-600">Calculation time: ${calcTime?.toFixed(2) || 0} ms</div>
            </div>
          `)
          .addTo(map.current);
        
        // Store the completed route once it's actually drawn
        if (startMarker.current && endMarker.current) {
          // Now that we have all components, store the route
          const newRouteItem: RouteItem = {
            startMarker: startMarker.current,
            endMarker: endMarker.current,
            popup: routePopup.current,
            sourceId: sourceId,
            layerId: layerId,
            outlineLayerId: outlineLayerId,
          };
          
          setRoutes(prev => [...prev, newRouteItem]);
        }
      }
      
      console.log('Route drawn successfully with', path.length, 'points');
      return { sourceId, layerId, outlineLayerId }; // Return IDs for reference
    } catch (err) {
      console.error('Error drawing route:', err);
      setError('Failed to display route');
      return null;
    }
  }, [calcTime]);

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
  
  // Handle map clicks - Fix the duplicate lngLat declarations
  const handleMapClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!map.current) return;
    
    const lngLat = e.lngLat;
    console.log(`Map clicked at ${lngLat.lng}, ${lngLat.lat}`);
    
    // If we have both markers already, start a new route sequence
    if (startMarker.current && endMarker.current) {
      // Don't store the route here - it will be stored in drawRoute after path is calculated
      
      // Reset markers to start a new route
      startMarker.current = null;
      endMarker.current = null;
      routePopup.current = null; // Don't remove it from map yet
      setMarkerCount(0);
    }
    
    // Rest of function remains the same
    // Determine if this is the first or second marker
    const isFirstMarker = !startMarker.current;
    
    // Create marker element
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '25px';
    el.style.height = '25px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = isFirstMarker ? '#8B5CF6' : '#EC4899';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    
    // Create the marker
    const marker = new mapboxgl.Marker({ 
      element: el,
      draggable: true,
    })
      .setLngLat(lngLat)
      .addTo(map.current);
    
    // Add dragend event handler
    marker.on('dragend', () => {
      if (startMarker.current && endMarker.current) {
        calculateRoute();
      }
    });
    
    // Update marker reference
    if (isFirstMarker) {
      startMarker.current = marker;
      setMarkerCount(1);
      console.log('Start marker placed');
    } else {
      endMarker.current = marker;
      setMarkerCount(2);
      console.log('End marker placed');
      
      // Calculate route automatically
      calculateRoute();
    }
  }, [calculateRoute]);

  // Initialize map - Fix the mapClickHandler reference
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
    
    // Add this inside the useEffect for map initialization, before the return statement
    const style = document.createElement('style');
    style.textContent = `
      .mapboxgl-popup-content {
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
      }
      .route-popup .mapboxgl-popup-content {
        background-color: rgba(255, 255, 255, 0.95);
        border: 1px solid #e2e8f0;
      }
      .marker {
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    // Set up click handler only after map is fully loaded
    mapInstance.once('load', () => {
      console.log('Map loaded successfully');
      
      // Direct map click handler - no mode needed
      mapInstance.on('click', handleMapClick);
      
      return () => {
        mapInstance.off('click', handleMapClick);
        document.head.removeChild(style);
        mapInstance.remove();
        map.current = null;
      };
    });
  }, [handleMapClick]);

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
            Click directly on the map to place your starting point, then click again to set your destination.
            Click anywhere to start a new route calculation.
          </motion.p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200 h-[600px] mb-6"
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
          </motion.div>
          
          {/* Status text and button UNDER the map */}
          <div className="flex flex-col items-center gap-3 justify-center mt-4">
            <div className="text-center mb-2">
              <span className="text-gray-600 font-medium">
                {markerCount === 0 ? 'Click to place starting point' : 
                 markerCount === 1 ? 'Click to place destination point' : 
                 'Route calculated - click anywhere to start a new route'}
              </span>
            </div>
            
            <button
              onClick={resetMap}
              className="px-6 py-2 rounded-lg font-medium shadow-sm border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
            >
              Reset Map
            </button>
            
            {routes.length > 0 && (
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-500">{routes.length} route{routes.length !== 1 ? 's' : ''} on map</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MapSection;