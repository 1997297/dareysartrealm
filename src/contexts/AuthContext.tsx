'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CollectorUser, AuthState, profileRowToCollectorUser } from '@/types/auth';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ProfileRow } from '@/types/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<CollectorUser>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CollectorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  const fetchProfile = useCallback(async (userId: string, userEmail: string): Promise<CollectorUser> => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        return profileRowToCollectorUser(data as ProfileRow);
      }
    } catch {
      // Fallback if profile is being created by database trigger
    }

    // Default fallback representation if profile trigger is still resolving
    return {
      id: userId,
      firstName: userEmail.split('@')[0],
      lastName: 'Collector',
      displayName: userEmail.split('@')[0],
      email: userEmail,
      role: 'collector',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }, []);

  // Initialize and listen to Supabase auth events
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsConfigured(false);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    // 1. Check existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const collectorProfile = await fetchProfile(session.user.id, session.user.email || '');
        setUser(collectorProfile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // 2. Subscribe to auth state updates (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const collectorProfile = await fetchProfile(session.user.id, session.user.email || '');
        setUser(collectorProfile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
      };
    }

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // Map Supabase error codes to friendly curatorial language
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          return { success: false, error: 'Incorrect email or password. Please verify your credentials.' };
        }
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            error: 'Please verify your email address via the confirmation link sent to your inbox before signing in.',
          };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id, data.user.email || '');
        setUser(profile);
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error connecting to authentication services.' };
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
      };
    }

    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (!data.password || data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const supabase = createClient();
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
            phone: data.phone?.trim() || null,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required by Supabase project configuration
      const requiresEmailConfirmation = Boolean(authData.user && !authData.session);

      if (authData.user && authData.session) {
        const profile = await fetchProfile(authData.user.id, authData.user.email || '');
        setUser(profile);
      }

      return { success: true, requiresEmailConfirmation };
    } catch {
      return { success: false, error: 'Network failure during registration.' };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase is not configured yet. Please configure credentials in .env.local.',
      };
    }

    const supabase = createClient();
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      const redirectTo = `${appUrl}/auth/callback?type=recovery`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network failure initiating password recovery.' };
    }
  };

  const updateProfile = async (updates: Partial<CollectorUser>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    if (!isSupabaseConfigured()) {
      // Local state update when offline
      setUser({ ...user, ...updates });
      return { success: true };
    }

    const supabase = createClient();
    try {
      const payload: Partial<ProfileRow> = {};

      if (updates.firstName !== undefined) payload.first_name = updates.firstName;
      if (updates.lastName !== undefined) payload.last_name = updates.lastName;
      if (updates.displayName !== undefined) {
        payload.display_name = updates.displayName;
      } else if (updates.firstName || updates.lastName) {
        payload.display_name = `${updates.firstName || user.firstName} ${updates.lastName || user.lastName}`.trim();
      }
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.country !== undefined) payload.country = updates.country;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.preferredContactMethod !== undefined) {
        payload.preferred_contact_method = updates.preferredContactMethod;
      }
      if (updates.defaultAddress) {
        if (updates.defaultAddress.addressLine1 !== undefined) {
          payload.address_line1 = updates.defaultAddress.addressLine1;
        }
        if (updates.defaultAddress.city !== undefined) {
          payload.city = updates.defaultAddress.city;
        }
        if (updates.defaultAddress.stateRegion !== undefined) {
          payload.state_region = updates.defaultAddress.stateRegion;
        }
        if (updates.defaultAddress.postalCode !== undefined) {
          payload.postal_code = updates.defaultAddress.postalCode;
        }
        if (updates.defaultAddress.country !== undefined) {
          payload.country = updates.defaultAddress.country;
        }
        if (updates.defaultAddress.deliveryNotes !== undefined) {
          payload.delivery_notes = updates.defaultAddress.deliveryNotes;
        }
      }

      // CRITICAL SECURITY ENFORCEMENT:
      // Client is NEVER permitted to send role or status modifications.
      delete (payload as Record<string, unknown>).role;
      delete (payload as Record<string, unknown>).status;

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        setUser(profileRowToCollectorUser(data as ProfileRow));
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error updating profile.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' && user?.status === 'active',
        isLoading,
        isConfigured,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
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
