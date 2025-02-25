import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import MapSection from './components/MapSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

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