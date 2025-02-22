import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function App() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.006, 40.7128],
      zoom: 12,
    });
    return () => map.remove();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow p-6"
      >
        <h1 className="text-3xl font-bold text-gray-800">Real-Time Navigation System</h1>
        <nav className="mt-4">
          <ul className="flex space-x-6">
            <li>
              <a className="text-blue-600 hover:text-blue-800" href="#overview">Overview</a>
            </li>
            <li>
              <a className="text-blue-600 hover:text-blue-800" href="#map">Live Map</a>
            </li>
            <li>
              <a className="text-blue-600 hover:text-blue-800" href="#features">Features</a>
            </li>
            <li>
              <a className="text-blue-600 hover:text-blue-800" href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </motion.header>

      <main className="p-6">
        <motion.section
          id="overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Overview</h2>
          <p className="text-gray-600">
            Leverage our integrated system with a responsive, modern design and advanced WebAssembly-powered pathfinding.
          </p>
        </motion.section>

        <motion.section
          id="map"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Live Map</h2>
          <div ref={mapContainerRef} className="map-container h-96 rounded shadow-md"></div>
        </motion.section>

        <motion.section
          id="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Interactive, real-time map visualization</li>
            <li>Optimized pathfinding powered by WebAssembly</li>
            <li>Seamless integration with a FastAPI backend</li>
            <li>User-friendly CLI and scalable architecture</li>
          </ul>
        </motion.section>

        <motion.section
          id="contact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Contact</h2>
          <p className="text-gray-600">
            Have questions? Reach out at <a className="text-blue-600 hover:underline" href="mailto:info@naviwasm.com">info@naviwasm.com</a>.
          </p>
        </motion.section>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="bg-gray-800 text-gray-300 text-center p-4"
      >
        <p>&copy; 2025 NaviWasm. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}

export default App;