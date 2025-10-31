// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar sesión inicial y rol
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const sessionData = data?.session ?? null;
      setSession(sessionData);
      setUser(sessionData?.user ?? null);

      if (sessionData?.user) {
        const email = sessionData.user.email;
        if (email === "admin@tiendaarte.com") {
          setRole("admin");
        } else {
          setRole("user");
        }
      }

      setIsLoading(false);
    })();

    // Suscribirse a cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const email = session.user.email;
          if (email === "admin@tiendaarte.com") {
            setRole("admin");
          } else {
            setRole("user");
          }
        } else {
          setRole(null);
        }

        if (_event === "SIGNED_IN") navigate("/");
        if (_event === "SIGNED_OUT") navigate("/login");
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, [navigate]);

  // Iniciar sesión
  const login = async (email, password) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) throw error;
    return data;
  };

  // Registro de nuevos usuarios normales
  const signUp = async (email, password) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setIsLoading(false);
    if (error) throw error;
    return data;
  };

  // Cerrar sesión
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
    navigate("/login");
  };

  const contextValue = {
    session,
    user,
    role,
    isAuthenticated: !!session,
    isLoading,
    login,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
