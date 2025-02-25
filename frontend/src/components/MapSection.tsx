import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative py-20"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Interactive Mapping
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience real-time navigation with our powerful WebAssembly-powered mapping system.
          </p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <div ref={mapContainerRef} className="h-[600px] w-full" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MapSection;
