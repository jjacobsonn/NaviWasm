import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapSection: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.006, 40.7128],
      zoom: 12,
    });

    return () => map.remove();
  }, []);

  return (
    <section id="map" className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Live Map</h2>
      <div ref={mapContainerRef} className="h-96 rounded shadow-lg" />
    </section>
  );
};

export default MapSection;
