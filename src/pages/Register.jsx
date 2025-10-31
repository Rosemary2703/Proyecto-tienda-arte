import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Llama a la función de Supabase para registrar un nuevo usuario
    const { error } = await supabase.auth.signUp({
      email,
      password,
      // Opcional: puedes añadir opciones para metadata
      // options: { data: { role: 'user' } } 
    });

    setIsLoading(false);

    if (error) {
      console.error("Error de registro:", error.message);
      setMessage(`Error: ${error.message}`);
    } else {
      // Supabase requiere confirmación por email por defecto
      setMessage("¡Registro exitoso! Por favor, verifica tu email para confirmar tu cuenta.");
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="registerContainer">
      <h2 className="registerTitle">Crear Cuenta</h2>
      
      <form onSubmit={handleRegister} className="registerForm">
        
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        {message && <p className={message.startsWith('Error') ? 'errorMessage' : 'successMessage'}>{message}</p>}

        <button type="submit" disabled={isLoading || !email || !password}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
        
        <p className="loginLink">
            ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </form>
    </div>
  );
}