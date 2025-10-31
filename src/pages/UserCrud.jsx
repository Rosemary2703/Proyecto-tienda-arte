import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import styles from "../styles/ProductCRUD.module.css";

export default function UserCRUD() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "user",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error cargando usuarios:", error);
      setError("No se pudieron cargar los usuarios");
    } else {
      setUsers(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingUser) {
        const { error } = await supabase
          .from("profiles")
          .update(formData)
          .eq("id", editingUser.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("profiles").insert([formData]);
        if (error) throw error;
      }
      await fetchUsers();
      setEditingUser(null);
      setFormData({ email: "", full_name: "", role: "user" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) setError("No se pudo eliminar el usuario");
    else setUsers(users.filter((u) => u.id !== id));
  };

  if (isLoading) return <p className={styles.loading}>Cargando usuarios...</p>;

  return (
    <div className={styles.container}>
      {/*  BOTÓN VOLVER AL PANEL ADMIN CON ESTILO UNIFICADO */}
      <div className={styles.backContainer}>
        <Link to="/admin" className={styles.backButton}>
          ⬅ Volver al Panel Admin
        </Link>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de Usuarios</h1>
      </header>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.formTitle}>
          {editingUser ? "Editar Usuario" : "Añadir Usuario"}
        </h3>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Nombre completo</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
        />

        <label>Rol</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        <div className={styles.formActions}>
          <button type="submit" disabled={isLoading}>
            {editingUser ? "Guardar cambios" : "Crear usuario"}
          </button>
          {editingUser && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setEditingUser(null)}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de usuarios */}
      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id.slice(0, 8)}...</td>
              <td>{u.email}</td>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td>
                <button
                  onClick={() => handleEdit(u)}
                  className={styles.editButton}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
