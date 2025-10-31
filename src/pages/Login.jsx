import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import styles from '../styles/Login.module.css'; // ✅ Import correcto

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      console.error('Error de login:', error.message);
      setMessage('Error al iniciar sesión. Verifica tu email y contraseña.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>🎨 Ingresar a la Galería</h2>

      <form onSubmit={handleLogin} className={styles.loginForm}>
        <label htmlFor="email" className={styles.label}>Correo electrónico</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <label htmlFor="password" className={styles.label}>Contraseña</label>
        <input
          id="password"
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        {message && <p className={styles.errorMessage}>{message}</p>}

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Accediendo...' : 'Ingresar'}
        </button>

        <p className={styles.registerLink}>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}
