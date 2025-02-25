import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

const MapSection: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.006, 40.7128],
      zoom: 12,
    });

    return () => map.remove();
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
            Navigate in real-time with our advanced WebAssembly-powered mapping system, built for precision and performance.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl overflow-hidden shadow-xl border border-gray-200"
        >
          <div ref={mapContainerRef} className="h-[600px] w-full" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MapSection;