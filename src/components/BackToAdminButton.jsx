// src/components/BackToAdminButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/BackToAdminButton.module.css";

export default function BackToAdminButton() {
  return (
    <div className={styles.backContainer}>
      <Link to="/admin" className={styles.backButton}>
        ⬅️ Volver al Panel Admin
      </Link>
    </div>
  );
}
