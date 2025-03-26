import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set up axios interceptor for adding token to requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');

      if (storedToken) {
        try {
          const verifiedUser = await verifyToken(storedToken);
          
          if (verifiedUser) {
            setUser(verifiedUser);
          } else if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            logout();
          }
        } catch (error) {
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/login');
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { 
        email, 
        password 
      });

      if (!response.data.token) {
        throw new Error('No authentication token received');
      }

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      navigate('/');
      
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please try again.'
      );
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', userData);

      if (!response.data.token) {
        throw new Error('No authentication token received');
      }

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      navigate('/');
      
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      );
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    setUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

