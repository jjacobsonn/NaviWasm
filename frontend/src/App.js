import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import MapSection from './components/MapSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer'; // Assuming you'll create this

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Navigation />
      <HeroSection />
      <MapSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default App;