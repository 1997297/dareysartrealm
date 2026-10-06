'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CollectorUser, AuthState } from '@/types/auth';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { DEMO_COLLECTOR, DEMO_ADMIN } from '@/data/mockCollectorData';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  loginAsAdmin: () => void;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<CollectorUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CollectorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    // Check if user is stored locally
    const storedUser = safeLocalStorage.getItem<CollectorUser | null>(
      STORAGE_KEYS.AUTH_USER,
      null
    );

    if (storedUser) {
      setUser(storedUser);
    } else {
      // By default in dev demo, start with DEMO_COLLECTOR so the collector space is instantly rich,
      // or start logged out if explicitly logged out.
      const hasLoggedOut = safeLocalStorage.getItem<boolean>('darey_explicitly_logged_out', false);
      if (!hasLoggedOut) {
        setUser(DEMO_COLLECTOR);
        safeLocalStorage.setItem(STORAGE_KEYS.AUTH_USER, DEMO_COLLECTOR);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    _password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Mock verification
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    let authenticatedUser: CollectorUser;
    const lowerEmail = email.toLowerCase().trim();

    if (lowerEmail === DEMO_ADMIN.email.toLowerCase()) {
      authenticatedUser = DEMO_ADMIN;
    } else if (lowerEmail === DEMO_COLLECTOR.email.toLowerCase()) {
      authenticatedUser = DEMO_COLLECTOR;
    } else {
      // Create or recover user profile for this email with collector role
      authenticatedUser = {
        id: `usr-${Date.now()}`,
        firstName: email.split('@')[0],
        lastName: 'Collector',
        email: lowerEmail,
        role: 'collector',
        createdAt: new Date().toISOString(),
      };
    }

    setUser(authenticatedUser);
    safeLocalStorage.setItem(STORAGE_KEYS.AUTH_USER, authenticatedUser);
    safeLocalStorage.removeItem('darey_explicitly_logged_out');
    return { success: true };
  };

  const loginAsDemo = () => {
    setUser(DEMO_COLLECTOR);
    safeLocalStorage.setItem(STORAGE_KEYS.AUTH_USER, DEMO_COLLECTOR);
    safeLocalStorage.removeItem('darey_explicitly_logged_out');
  };

  const loginAsAdmin = () => {
    setUser(DEMO_ADMIN);
    safeLocalStorage.setItem(STORAGE_KEYS.AUTH_USER, DEMO_ADMIN);
    safeLocalStorage.removeItem('darey_explicitly_logged_out');
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address' };
    }

    const newUser: CollectorUser = {
      id: `usr-${Date.now()}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      role: 'collector',
      phone: data.phone?.trim(),
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    safeLocalStorage.setItem(STORAGE_KEYS.AUTH_USER, newUser);
    safeLocalStorage.removeItem('darey_explicitly_logged_out');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    safeLocalStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    safeLocalStorage.setItem('darey_explicitly_logged_out', true);
  };

  const updateProfile = async (updates: Partial<CollectorUser>): Promise<void> => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    safeLocalStorage.setItem(STORAGE_KEYS.AUTH_USER, updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        loginAsDemo,
        loginAsAdmin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
