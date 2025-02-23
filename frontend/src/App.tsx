import React, { useState } from "react";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import MapSection from "./components/MapSection";

const App: React.FC = () => {
  const [darkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <header className="bg-white shadow-lg">
        <Navigation />
      </header>
      <main>
        <HeroSection />
        <MapSection />
        <section id="features" className="py-12 px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          {/* Add your features content here */}
        </section>
        <section id="contact" className="py-12 px-4 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-8">Contact</h2>
          {/* Add your contact content here */}
        </section>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 NaviWasm. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
import React from "react";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <section
      id="overview"
      className="relative h-screen flex items-center justify-center text-center bg-cover"
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?city,night')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-white px-4"
      >
        <h1 className="text-5xl font-bold mb-4">Empowering Navigation</h1>
        <p className="text-xl">
          Experience cutting-edge navigation with real-time mapping and optimized pathfinding.
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;