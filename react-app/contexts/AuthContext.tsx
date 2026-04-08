import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '@/services/api';

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
        // Verify session is still valid
        try {
          const res = await authApi.getMe();
          if (res.data) {
            setUser(res.data);
            await AsyncStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch {
          // Session expired
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('authToken');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    const userData = res.data?.user || res.data;
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    if (res.data?.token) {
      await AsyncStorage.setItem('authToken', res.data.token);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
    await AsyncStorage.multiRemove(['user', 'authToken']);
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    const userData = res.data?.user || res.data;
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    if (res.data?.token) {
      await AsyncStorage.setItem('authToken', res.data.token);
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
