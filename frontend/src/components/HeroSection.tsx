import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Subtle animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 -top-20 -left-20 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute w-64 h-64 -bottom-20 -right-20 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <h1 className="text-6xl font-bold font-poppins leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Real-Time Navigation
            </span>
            <span className="block text-3xl mt-4 text-gray-300 font-inter">
              Redefined with WebAssembly
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
            Experience cutting-edge, lightning-fast pathfinding powered by Rust, WebAssembly, and Mapbox for a seamless navigation experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition-all duration-300 font-inter"
            >
              Get Started Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg border border-gray-700 hover:bg-gray-700 transition-all duration-300 font-inter"
            >
              Watch Demo <span aria-hidden="true">→</span>
            </motion.button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['Rust', 'WebAssembly', 'React', 'Mapbox', 'FastAPI'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-sm font-inter text-gray-300 border border-gray-700 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;