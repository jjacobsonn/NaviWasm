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

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    // Add click handler for map
    map.current.on('click', handleMapClick);

    return () => {
      map.current?.remove();
      clearMarkers();
    };
  }, []);

  const clearMarkers = () => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);
    if (route) {
      map.current?.removeLayer('route');
      map.current?.removeSource('route');
      setRoute(null);
    }
  };

  const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
    if (!map.current) return;

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
      // Calculate route
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

        const data = await response.json();
        drawRoute(data.path);
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    }

    if (newMarkers.length > 2) {
      clearMarkers();
    }
  };

  const drawRoute = (path: Coordinates[]) => {
    if (!map.current) return;

    if (route) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: path.map(point => [point.lng, point.lat])
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
            Click to set start and end points. The route will be calculated automatically.
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-[600px]"
        >
          <div ref={mapContainer} className="w-full h-full" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MapSection;