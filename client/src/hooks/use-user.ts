
import { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accountType: string;
  isActive: boolean;
  phone?: string;
  categoryIds?: string[];
  subcategoryIds?: string[];
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser?.id) localStorage.setItem('userId', parsedUser.id);
        if (parsedUser?.role) localStorage.setItem('userRole', parsedUser.role);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userId', userData?.id || '');
    localStorage.setItem('userRole', userData?.role || '');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (updatedUser?.id) localStorage.setItem('userId', updatedUser.id);
      if (updatedUser?.role) localStorage.setItem('userRole', updatedUser.role);
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };
}
