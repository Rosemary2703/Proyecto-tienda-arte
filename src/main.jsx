// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Contextos globales
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import App from './App.jsx';
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 1️⃣ Router principal */}
    <BrowserRouter>
      {/* 2️⃣ AuthProvider primero (maneja el usuario) */}
      <AuthProvider>
        {/* 3️⃣ CartProvider depende del usuario, por eso va dentro */}
        <CartProvider>
          {/* 4️⃣ Tu aplicación completa */}
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
