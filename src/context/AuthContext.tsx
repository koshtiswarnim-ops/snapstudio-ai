import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured, getInitialMockUser } from '../services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Seller',
            avatar_url: session.user.user_metadata?.avatar_url,
            plan: 'pro',
            created_at: session.user.created_at,
          });
        }
      } else {
        // Mock Auth fallback
        setUser(getInitialMockUser());
      }
      setLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'Seller',
            avatar_url: session.user.user_metadata?.avatar_url,
            plan: 'pro',
            created_at: session.user.created_at,
          });
        } else {
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    } else {
      const mock = getInitialMockUser();
      const updated: UserProfile = {
        id: mock?.id || `usr_${Date.now()}`,
        email,
        name: mock?.name || email.split('@')[0],
        avatar_url: mock?.avatar_url,
        plan: mock?.plan || 'pro',
        created_at: mock?.created_at || new Date().toISOString(),
      };
      setUser(updated);
      localStorage.setItem('snapstudio_user_session', JSON.stringify(updated));
    }
  };

  const signup = async (email: string, name: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password: 'TemporaryPassword123!',
        options: { data: { name } },
      });
      if (error) throw error;
    } else {
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        name,
        plan: 'free',
        created_at: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('snapstudio_user_session', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('snapstudio_user_session');
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('snapstudio_user_session', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
