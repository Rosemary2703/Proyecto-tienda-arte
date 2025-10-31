import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Deseas cerrar sesión?");
    if (confirmLogout) {
      await logout();
      navigate("/login"); // redirige al login después del logout
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>🖼️ Artemisa</h1>
      <nav className={styles.nav}>
        <Link to="/">Inicio</Link>
        <Link to="/cart">Carrito</Link>

        {isAuthenticated ? (
          <>
            <Link to="/profile">Mi Perfil</Link>

            {/* ✅ Si el usuario es admin, mostrar acceso al panel */}
            {role === "admin" && (
              <Link to="/admin" className={styles.adminLink}>
                🛠️ Panel Admin
              </Link>
            )}

            {/* 🔒 Botón de cerrar sesión con confirmación */}
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login">Ingresar</Link>
        )}
      </nav>
    </header>
  );
}

