'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';
import { api } from '@/utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        logout();
        return;
      }
      
      const response = await api.post<AuthResponse>('/auth/refresh', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const { user: userData, token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      setUser(userData);
    } catch (err) {
      console.error('Failed to refresh token:', err);
      logout();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        refreshToken();
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};