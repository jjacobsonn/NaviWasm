import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { id: 'hero', label: 'Home' },
    { id: 'map', label: 'Live Map' },
    { id: 'features', label: 'Features' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-poppins"
        >
          NaviWasm
        </motion.div>

        <div className="hidden md:block">
          <div className="flex items-center space-x-8">
            {navigation.map(({ id, label }) => (
              <motion.button
                key={id}
                onClick={() => {
                  const element = document.getElementById(id);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05, color: '#9333EA' }}
                className="text-gray-300 hover:text-purple-500 transition-colors duration-200 text-lg font-medium font-inter"
              >
                {label}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 text-lg font-medium font-inter"
            >
              Get Started
            </motion.button>
          </div>
        </div>

        <Disclosure as="div" className="md:hidden">
          <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
            <span className="sr-only">Open main menu</span>
            {isScrolled ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-400" />
            )}
          </Disclosure.Button>
          <Disclosure.Panel className="absolute top-16 left-0 w-full bg-gray-900/95 backdrop-blur-lg p-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              {navigation.map(({ id, label }) => (
                <Disclosure.Button
                  key={id}
                  as="button"
                  onClick={() => {
                    const element = document.getElementById(id);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                    setIsScrolled(false);
                  }}
                  className="block px-4 py-2 rounded-lg text-lg font-medium text-gray-300 hover:text-purple-500 hover:bg-gray-700 transition-colors duration-200 font-inter"
                >
                  {label}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                as="button"
                onClick={() => setIsScrolled(false)}
                className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 text-lg font-medium font-inter"
              >
                Get Started
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </Disclosure>
      </div>
    </motion.nav>
  );
};

export default Navigation;