import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2830')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-purple-900/80 to-pink-800/70" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                Empowering Navigation
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-purple-100">
                with WebAssembly
              </span>
            </h1>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-blue-100/90 leading-relaxed"
            >
              Experience lightning-fast pathfinding powered by Rust and WebAssembly, 
              delivering enterprise-grade navigation solutions.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transform transition-all hover:scale-105 hover:shadow-lg shadow-blue-500/25">
              Get Started
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transform transition-all hover:scale-105">
              View Demo
            </button>
          </motion.div>

          {/* Tech Stack Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {['Rust', 'WebAssembly', 'React', 'FastAPI'].map((tech, index) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm text-blue-100 bg-white/5 rounded-full backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
