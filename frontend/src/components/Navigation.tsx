import React, { useEffect, useState } from 'react';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener to change navigation background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`px-8 lg:px-16 py-4 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800 px-4">NaviWasm</div>
        <ul className="flex space-x-12 px-4">
          {[
            { id: 'hero', label: 'Home' },
            { id: 'map', label: 'Map' },
            { id: 'features', label: 'Features' },
            { id: 'contact', label: 'Contact' }
          ].map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className="text-gray-600 hover:text-gray-900 transition-colors px-2"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
