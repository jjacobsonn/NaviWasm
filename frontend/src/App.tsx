import React, { useState } from "react";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import MapSection from "./components/MapSection";

const App: React.FC = () => {
  const [darkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <Navigation />
      </header>
      <main className="pt-16"> {/* Add padding-top to account for fixed header */}
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