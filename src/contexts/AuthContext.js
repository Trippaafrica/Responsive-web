import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      const fetchUser = async () => {
        try {
          const response = await axios.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(user);
      
      return { success: true, data: { token, user } };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(user);
      
      return { success: true, data: { token, user } };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 