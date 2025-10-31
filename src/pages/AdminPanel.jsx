import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProductCRUD.module.css"; // Reutilizamos estilos existentes

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Panel de Administración</h1>
      <p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
        Gestiona los recursos de la galería desde aquí.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <button
          className={styles.addButton}
          onClick={() => navigate("/admin/products")}
        >
          🎨 Gestión de Obras
        </button>

        <button
          className={styles.addButton}
          onClick={() => navigate("/admin/users")}
        >
          👤 Gestión de Usuarios
        </button>

        <button
          className={styles.addButton}
          onClick={() => navigate("/admin/orders")}
        >
          🧾 Gestión de Pedidos
        </button>
      </div>
    </div>
  );
}

