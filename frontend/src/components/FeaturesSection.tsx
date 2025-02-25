import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

const features = [
  {
    title: 'WebAssembly Performance',
    description: 'Lightning-fast pathfinding with Rust-compiled WebAssembly for unparalleled speed.',
    icon: CheckIcon,
  },
  {
    title: 'Real-time Updates',
    description: 'Dynamic route adjustments with live data for the most efficient navigation.',
    icon: CheckIcon,
  },
  {
    title: 'Advanced Visualization',
    description: 'Stunning 3D maps powered by MapboxGL with custom, interactive layers.',
    icon: CheckIcon,
  },
  {
    title: 'Scalable Architecture',
    description: 'Robust deployment with FastAPI, React, and Docker for enterprise-grade scalability.',
    icon: CheckIcon,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold font-poppins mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Cutting-Edge Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
            Discover why developers and businesses love our navigation system
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 h-full flex flex-col"
            >
              <div className="flex-1 flex items-center justify-center mb-4">
                <feature.icon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold font-poppins mb-2 text-gray-900 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 font-inter text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;