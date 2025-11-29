
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App'; // Apunta al App.tsx en la raíz
import '../index.css';    // Apunta al index.css en la raíz

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No se encontró el elemento root");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
