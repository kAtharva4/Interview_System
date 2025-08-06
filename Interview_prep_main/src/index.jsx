// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './hooks/useLanguage';
import './style.css';// import 'font-awesome/css/font-awesome.min.css';
import { CookiesProvider } from "react-cookie";

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <CookiesProvider>
       <LanguageProvider>
      <App />
    </LanguageProvider>
      </CookiesProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}