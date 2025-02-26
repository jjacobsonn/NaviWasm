import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Coordinates {
  lat: number;
  lng: number;
}

const MapSection: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [route, setRoute] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calcTime, setCalcTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // For real-time movement
  const [currentPositionIndex, setCurrentPositionIndex] = useState<number>(-1);
  const movingMarker = useRef<mapboxgl.Marker | null>(null);
  const path = useRef<Coordinates[]>([]);
  const animationFrame = useRef<number>();

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.on('click', handleMapClick);

    return () => {
      cancelAnimationFrame(animationFrame.current!);
      map.current?.remove();
      clearMarkers();
    };
  }, []);

  const clearMarkers = () => {
    markers.forEach(marker => marker.remove());
    movingMarker.current?.remove();
    movingMarker.current = null;
    setMarkers([]);
    if (route) {
      map.current?.removeLayer('route');
      map.current?.removeSource('route');
      setRoute(null);
    }
    setCurrentPositionIndex(-1);
    setCalcTime(null);
    setError(null);
    path.current = [];
  };

  const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
    if (!map.current) return;
    setError(null);

    const coordinates: Coordinates = {
      lat: e.lngLat.lat,
      lng: e.lngLat.lng
    };

    const marker = new mapboxgl.Marker({
      color: markers.length === 0 ? '#00ff00' : '#ff0000'
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    const newMarkers = [...markers, marker];
    setMarkers(newMarkers);

    if (newMarkers.length === 2) {
      setIsLoading(true);
      const startTime = performance.now();
      
      try {
        const response = await fetch('http://localhost:8000/api/v1/navigation/route', {
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
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to calculate route');
        }

        const data = await response.json();
        setCalcTime(performance.now() - startTime);
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

    if (newMarkers.length > 2) {
      clearMarkers();
    }
  };

  const drawRoute = (pathData: Coordinates[]) => {
    if (!map.current) return;

    if (route) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    path.current = pathData;

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
        'line-color': '#888',
        'line-width': 8
      }
    });

    setRoute('route');
  };

  const startMovingMarker = (pathData: Coordinates[]) => {
    if (!map.current) return;
    
    if (!movingMarker.current) {
      movingMarker.current = new mapboxgl.Marker({
        color: '#0000ff',
        scale: 0.8
      });
    }

    let start: number;
    const duration = 5000; // 5 seconds to traverse the path

    function animate(timestamp: number) {
      if (start === undefined) {
        start = timestamp;
      }

      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      // Calculate current position along the path
      const index = Math.floor(progress * (pathData.length - 1));
      const nextIndex = Math.min(index + 1, pathData.length - 1);
      const pathProgress = (progress * (pathData.length - 1)) % 1;

      // Interpolate between points
      const currentPos = {
        lng: pathData[index].lng + (pathData[nextIndex].lng - pathData[index].lng) * pathProgress,
        lat: pathData[index].lat + (pathData[nextIndex].lat - pathData[index].lat) * pathProgress
      };

      movingMarker.current!
        .setLngLat([currentPos.lng, currentPos.lat])
        .addTo(map.current!);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    }

    animationFrame.current = requestAnimationFrame(animate);
  };

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