import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { loginUser, registerUser, signOut } from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await loginUser(email, password);
      // El listener de onAuthStateChanged actualizará el estado automáticamente
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 useAuth: Iniciando registro...');
      await registerUser(email, password, displayName);
      console.log('✅ useAuth: Registro completado');
      // El listener de onAuthStateChanged actualizará el estado automáticamente
    } catch (err: any) {
      console.error('❌ useAuth: Error en registro:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };
};
