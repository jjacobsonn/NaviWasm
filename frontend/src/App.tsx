import React from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import MapSection from './components/MapSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer'; // Assuming you'll create this

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