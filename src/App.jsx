import React from "react";
import { Routes, Route } from "react-router-dom";

// --- Layout ---
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Páginas ---
import Home from "./pages/Home";
import Artworks from "./pages/Artworks";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";

// --- Administración ---
import AdminPanel from "./pages/AdminPanel";
import ProductCRUD from "./pages/ProductCRUD";
import UserCRUD from "./pages/UserCrud"; // 👈 Gestión de usuarios
import OrderCRUD from "./pages/OrderCrud"; // 👈 Gestión de pedidos

// --- Página 404 ---
const NotFoundPage = () => (
  <div style={{ padding: "80px", textAlign: "center", minHeight: "60vh" }}>
    <h1 style={{ fontSize: "3em", color: "#a80000" }}>404 | Error</h1>
    <p style={{ fontSize: "1.2em", color: "#555" }}>
      Lo sentimos, la obra o página que buscas no existe en esta galería.
    </p>
  </div>
);

function App() {
  return (
    <div className="art-store-app">
      <Header />

      <main
        className="content-area"
        style={{ minHeight: "80vh", padding: "20px 0" }}
      >
        <Routes>
          {/* 🔓 RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/artworks" element={<Artworks />} />
          <Route path="/artworks/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 RUTAS ADMIN (solo para admin) */}
          <Route
            element={<ProtectedRoute requiredRole="admin" />} // 👈 Adaptado a tu versión de ProtectedRoute
          >
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/products" element={<ProductCRUD />} />
            <Route path="/admin/users" element={<UserCRUD />} />
            <Route path="/admin/orders" element={<OrderCRUD />} />
          </Route>

          {/* 🚫 PÁGINA 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
