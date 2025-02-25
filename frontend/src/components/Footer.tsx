import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-12 bg-gray-900 text-gray-400"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-lg font-inter">
          © 2025 NaviWasm. All rights reserved.{' '}
          <a href="#contact" className="text-purple-500 hover:text-purple-400 transition-colors">
            Contact Us
          </a>
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;