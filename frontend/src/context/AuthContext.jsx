import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const AuthProvider = ({ children }) => {
  // Try to load user information from localStorage upon initial application mount
  const [user, setUser] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [loading, setLoading] = useState(false);

  // Sync state changes back to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Sign up handler (automatically logs the user in after registration)
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
