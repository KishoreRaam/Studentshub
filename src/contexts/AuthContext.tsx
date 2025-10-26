import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { account, OAUTH_CONFIG } from '../lib/appwrite.js';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  const checkSession = async () => {
    try {
      setLoading(true);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      // No active session
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Login with Google OAuth
  const loginWithGoogle = async () => {
    try {
      account.createOAuth2Session(
        'google',
        OAUTH_CONFIG.successUrl,
        OAUTH_CONFIG.failureUrl
      );
      // The page will redirect to Google, so no need to update state here
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    loginWithGoogle,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
