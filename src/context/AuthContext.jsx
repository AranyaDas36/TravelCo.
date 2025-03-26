import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../admin/axiosInstance';
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
  const [loading, setLoading] = useState(true); // Ensure loading logic is clear
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/me');
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
          const verifiedUser = await verifyToken();

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
          setLoading(false); // Loading finished only after auth check
        }
      } else {
        setLoading(false); // Even without a token, finish loading
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
      const response = await axiosInstance.post('/api/auth/login', { email, password });

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
      throw new Error(error.response?.data?.message || error.message || 'Login failed.');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);

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
      throw new Error(error.response?.data?.message || error.message || 'Registration failed.');
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
      {loading ? <div>Loading...</div> : children}  {/* Prevents redirect until checkAuthStatus completes */}
    </AuthContext.Provider>
  );
};
