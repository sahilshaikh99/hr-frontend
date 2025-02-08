'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { User, AuthContextType } from '@/types';

type AuthProviderProps = {
  children: ReactNode;
};

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      email: string;
      role: string;
    }
  }
}

interface AuthData {
  token: string;
  email: string;
  role: string;
  expiresAt: number;
}

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('authData');
      if (authData) {
        const parsedData = JSON.parse(authData);
        // Check if token is expired
        if (parsedData.expiresAt && parsedData.expiresAt < Date.now()) {
          localStorage.removeItem('authData');
          return null;
        }
        const { email, role } = parsedData;
        return {
          id: email,
          email,
          role,
          name: email.split('@')[0]
        };
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Login failed');

      const { success, data }: AuthResponse = await response.json();

      if (success) {
        const authData: AuthData = {
          token: data.token,
          email: data.user.email,
          role: data.user.role,
          expiresAt: Date.now() + EXPIRATION_TIME
        };

        localStorage.setItem('authData', JSON.stringify(authData));
        
        const userData = {
          id: data.user.email,
          email: data.user.email,
          role: data.user.role as 'ADMIN' | 'EMPLOYEE',
          name: data.user.email.split('@')[0]
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const authData = localStorage.getItem('authData');
      const { token } = authData ? JSON.parse(authData) : { token: '' };

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      localStorage.removeItem('authData');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 