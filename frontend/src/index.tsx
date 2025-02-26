import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Ensure this includes font imports
import { validateEnvironment } from './utils/envValidation';

const container = document.getElementById('root');
if (!container) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(container);

validateEnvironment();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);