import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="mt-4">
      <ul className="flex space-x-6">
        <li><a className="text-blue-600 hover:text-blue-800" href="#overview">Overview</a></li>
        <li><a className="text-blue-600 hover:text-blue-800" href="#map">Live Map</a></li>
        <li><a className="text-blue-600 hover:text-blue-800" href="#features">Features</a></li>
        <li><a className="text-blue-600 hover:text-blue-800" href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navigation;
