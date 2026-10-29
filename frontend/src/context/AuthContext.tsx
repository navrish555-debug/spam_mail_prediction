import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; full_name: string; role?: string }) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mailguard_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mailguard_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If we have token, verify current user
    if (token && !user) {
      authService.getCurrentUser()
        .then((u) => {
          setUser(u);
          localStorage.setItem('mailguard_user', JSON.stringify(u));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (usernameOrEmail: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ username_or_email: usernameOrEmail, password });
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('mailguard_token', res.access_token);
      localStorage.setItem('mailguard_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { username: string; email: string; password: string; full_name: string; role?: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('mailguard_token', res.access_token);
      localStorage.setItem('mailguard_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    await login('analyst', 'Password123!');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mailguard_token');
    localStorage.removeItem('mailguard_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
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

