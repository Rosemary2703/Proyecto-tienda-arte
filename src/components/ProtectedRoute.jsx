import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Mientras se carga la sesión
  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Cargando autenticación...</div>;
  }

  // Si el usuario no está autenticado → redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está en la lista permitida → redirigir al inicio
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Renderiza las rutas hijas protegidas (AdminPanel, ProductCRUD, etc.)
  return <Outlet />;
}
