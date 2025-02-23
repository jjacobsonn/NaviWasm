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
      {/* Hero Section */}
      <motion.div 
        className="hero-section relative flex items-center justify-center h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?city,night')" }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            className="text-5xl font-bold"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Welcome to NaviWasm
          </motion.h1>
          <motion.p 
            className="mt-4 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Innovative real-time navigation redefined.
          </motion.p>
        </div>
      </motion.div>

      {/* Existing Content */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full header-gradient"
      >
        <nav className="navbar">
          <div className="logo">Real-Time Navigation</div>
          <ul className="nav-links">
            <li><a href="#overview" className="nav-link">Overview</a></li>
            <li><a href="#map" className="nav-link">Live Map</a></li>
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>
      </motion.header>

      <main className="app-main">
        <section id="overview" className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="section-title">Empowering Navigation</h2>
            <p className="section-description max-w-2xl mx-auto">
              Experience cutting-edge navigation with real-time mapping, optimized pathfinding powered by WebAssembly, and seamless backend integration.
            </p>
          </motion.div>
        </section>

        <section id="map" className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="section-title text-center">Live Map</h2>
            <div ref={mapContainerRef} className="map-container mt-4" data-testid="map-container"></div>
          </motion.div>
        </section>

        <section id="features" className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h2 className="section-title">Features</h2>
            <ul className="features-list max-w-3xl mx-auto mt-4 text-left">
              <li>Interactive, real-time map visualization</li>
              <li>Optimized pathfinding powered by WebAssembly</li>
              <li>Seamless integration with a FastAPI backend</li>
              <li>User-friendly CLI and scalable architecture</li>
            </ul>
          </motion.div>
        </section>

        <section id="contact" className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="section-title">Contact Us</h2>
            <p className="section-description">
              Have questions? Reach out at{' '}
              <a href="mailto:info@naviwasm.com" className="contact-link">
                info@naviwasm.com
              </a>.
            </p>
          </motion.div>
        </section>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        className="footer-bg py-4 text-center"
      >
        <p className="text-white">&copy; 2025 NaviWasm. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}

export default App;