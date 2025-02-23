import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-screen flex items-center justify-center text-center"
    >
      <div className="z-10 px-4">
        <h1 className="text-5xl font-bold mb-4">Real-Time Navigation System</h1>
        <p className="text-xl">Innovative navigation redefined with WebAssembly</p>
      </div>
    </motion.section>
  );
};

export default HeroSection;
