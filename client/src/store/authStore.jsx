import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api.js';
import { initiateSocketConnection, disconnectSocket } from '../services/socket.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for existing user on load
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Verify session with /api/auth/me
          const { data } = await api.get('/auth/me');
          // Update details from db, retain token
          const fullUser = { ...data, token: parsed.token };
          setUser(fullUser);
          localStorage.setItem('userInfo', JSON.stringify(fullUser));
          
          // Connect Socket
          initiateSocketConnection(fullUser._id, fullUser.role);
        } catch (error) {
          console.error('Session validation failed:', error.message);
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUser();
    
    return () => {
      disconnectSocket();
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      initiateSocketConnection(data._id, data.role);
      setLoading(false);
      return { success: true, role: data.role };
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', userData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      initiateSocketConnection(data._id, data.role);
      setLoading(false);
      return { success: true, role: data.role };
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.log('Logout API call failed, logging out locally');
    }
    localStorage.removeItem('userInfo');
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
