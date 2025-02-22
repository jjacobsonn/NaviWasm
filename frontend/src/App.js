import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';  // Import Mapbox CSS
import './App.css';

// Ensure the token environment variable name matches your .env file.
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // Use the same variable name you set in .env

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
    <div style={{ padding: '1rem' }}>
      <h1>Hello, world!</h1>
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
            <div ref={mapContainerRef} className="map-container" style={{ height: '400px' }}></div>
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
    </div>
  );
}

export default App;