import React, { useState } from "react";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import MapSection from "./components/MapSection";
import FeaturesSection from "./components/FeaturesSection";

const App: React.FC = () => {
  const [darkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg z-50">
        <Navigation />
      </header>
      
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4">
          <MapSection />
        </div>
        <FeaturesSection />
        
        <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
            <p className="text-xl text-gray-600 mb-8">
              Ready to revolutionize your navigation system? Let's discuss how our solution can help.
            </p>
            <a 
              href="mailto:info@naviwasm.com"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NaviWasm</h3>
              <p className="text-gray-400">Next-generation navigation powered by WebAssembly</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2025 NaviWasm. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;