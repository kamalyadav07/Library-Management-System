// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded.user);
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    // ... login function is the same
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      return true;
    } catch (err) {
      console.error('Login failed:', err.response.data);
      return false;
    }
  };

  const logout = () => {
    // ... logout function is the same
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};