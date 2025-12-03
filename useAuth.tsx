
import React, { useState, useEffect, useContext, createContext, PropsWithChildren, useCallback } from 'react';
import { TEACHER_CODES } from './constants';
import type { Teacher } from './types';

interface AuthContextType {
  user: Teacher | null;
  loading: boolean;
  login: (code: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = '5s-ks-user';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem(USER_SESSION_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((code: string): boolean => {
    const normalizedCode = code.trim().toUpperCase();
    const foundTeacher = TEACHER_CODES.find(t => t.code.toUpperCase() === normalizedCode);
    
    if (foundTeacher) {
      setUser(foundTeacher);
      sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(foundTeacher));
      return true;
    }
    
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(USER_SESSION_KEY);
  }, []);

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
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
