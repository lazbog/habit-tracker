import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Get the root element
const container = document.getElementById('root');

// Ensure the container exists before rendering
if (!container) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

// Create a React root
const root = createRoot(container);

// Enable strict mode in development for better debugging
// In production, this helps with highlighting potential problems
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot Module Replacement (HMR) for development
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>
    );
  });
}