typescript
import { useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import type { User, AuthState } from '@/types/auth';

// Define the return type for the useAuth hook
export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  
  // Ensure the hook is used within an AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { state, dispatch } = context;
  
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store tokens securely
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  }, [dispatch]);
  
  // Register function
  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      
      // Store tokens securely
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      });
      throw error;
    }
  }, [dispatch]);
  
  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout API to invalidate the token on the server
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.accessToken}`,
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear tokens from local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      
      // Update state
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, [dispatch, state.accessToken]);
  
  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      
      // Update stored tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      }
      
      dispatch({
        type: 'AUTH_REFRESH',
        payload: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log out the user
      logout();
    }
  }, [dispatch, logout]);
  
  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);
  
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken && !state.user) {
          try {
            // Verify token with the server
            const response = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });
            
            if (response.ok) {
              const userData = await response.json();
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                  user: userData,
                  accessToken,
                  refreshToken: localStorage.getItem('refreshToken'),
                },
              });
            } else {
              // Token is invalid, try to refresh
              await refreshToken();
            }
          } catch (error) {
            console.error('Auth check failed:', error);
            // If auth check fails, clear tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        }
      }
    };
    
    checkAuth();
  }, [dispatch, refreshToken, state.user]);
  
  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: !!state.user,
    error: state.error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };
};

export default useAuth;