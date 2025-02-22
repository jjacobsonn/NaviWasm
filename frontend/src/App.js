import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';

// Set your Mapbox token in an environment variable REACT_APP_MAPBOX_TOKEN
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function App() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize the Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.006, 40.7128], // New York City coordinates as default
      zoom: 12,
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Real-Time Navigation System</h1>
        <nav className="app-nav">
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#map">Live Map</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="app-main">
        <section id="overview" className="overview-section">
          <h2>Overview</h2>
          <p>
            Leverage our integrated frontend with Mapbox, FastAPI backend, and high-performance Rust WebAssembly for cutting-edge pathfinding.
          </p>
        </section>
        <section id="map" className="map-section">
          <h2>Live Map</h2>
          <div ref={mapContainerRef} className="map-container"></div>
        </section>
        <section id="features" className="features-section">
          <h2>Features</h2>
          <ul>
            <li>Interactive, real-time map visualization</li>
            <li>Optimized pathfinding powered by WebAssembly</li>
            <li>Seamless integration with a FastAPI backend</li>
            <li>User-friendly CLI for navigation control</li>
          </ul>
        </section>
        <section id="contact" className="contact-section">
          <h2>Contact</h2>
          <p>Questions? Reach out to our team at <a href="mailto:info@naviwasm.com">info@naviwasm.com</a>.</p>
        </section>
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 NaviWasm. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

/* filepath: /Users/cjacobson/git/NaviWasm/frontend/src/App.css */
body, html {
  margin: 0;
  padding: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #343a40;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.app-header {
  background-color: #4a148c; /* deep purple for a professional vibe */
  padding: 1.5rem;
  color: #ffffff;
  text-align: center;
}

.app-main {
  padding: 2rem;
  line-height: 1.6;
}

.app-footer {
  background-color: #4a148c;
  padding: 1rem;
  text-align: center;
  color: #ffffff;
}