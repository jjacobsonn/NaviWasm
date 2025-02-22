import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Welcome to NaviWasm</h1>
        <nav className="app-nav">
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="app-main">
        <section id="overview">
          <h2>Professional & Modern Solutions</h2>
          <p>
            Your project is up and running with a modern, tailored user experience.
          </p>
          <button className="cta-button">Learn More</button>
        </section>
        <section id="features">
          <h2>Features</h2>
          <ul>
            <li>High Performance</li>
            <li>Intuitive Design</li>
            <li>Seamless Integration</li>
          </ul>
        </section>
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 NaviWasm. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

/* filepath: /Users/cjacobson/git/NaviWasm/frontend/src/App.css */
body, html {
  margin: 0;
  padding: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #343a40;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.app-header {
  background-color: #4a148c; /* deep purple for a professional vibe */
  padding: 1.5rem;
  color: #ffffff;
  text-align: center;
}

.app-main {
  padding: 2rem;
  line-height: 1.6;
}

.app-footer {
  background-color: #4a148c;
  padding: 1rem;
  text-align: center;
  color: #ffffff;
}