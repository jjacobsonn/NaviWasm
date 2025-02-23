import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'WebAssembly Performance',
    description: 'Lightning-fast pathfinding algorithms compiled directly from Rust to WebAssembly.',
    icon: '⚡'
  },
  {
    title: 'Real-time Updates',
    description: 'Live route updates and dynamic path recalculation based on changing conditions.',
    icon: '🔄'
  },
  {
    title: 'Advanced Visualization',
    description: 'Interactive 3D mapping powered by MapboxGL with custom layer rendering.',
    icon: '🗺️'
  },
  {
    title: 'Scalable Architecture',
    description: 'Built on FastAPI and React with containerized deployment support.',
    icon: '🏗️'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Discover what makes our navigation system unique</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
