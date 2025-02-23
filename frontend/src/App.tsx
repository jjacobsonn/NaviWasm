import React, { useState } from "react";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import MapSection from "./components/MapSection";
import FeaturesSection from "./components/FeaturesSection";
import ContactSection from "./components/ContactSection";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    // Apply the "dark" class conditionally for dark mode styling
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
        <main>
          <HeroSection />
          <MapSection />
          <FeaturesSection />
          <ContactSection />
        </main>
      </div>
    </div>
  );
};

export default App;import React from "react";
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

export default HeroSection;import React from "react";
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