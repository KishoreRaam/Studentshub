import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OAuthProvider } from 'appwrite';
import { account, OAUTH_CONFIG, AppwriteID } from '../lib/appwrite.js';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string, state?: string, district?: string, institution?: string) => Promise<void>;
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
      // No active session - this is normal when user is not logged in
      // 401 Unauthorized is expected here
      console.log('No active session found');
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
      console.log('[Auth] Starting Google OAuth...', {
        successUrl: OAUTH_CONFIG.SUCCESS_URL,
        failureUrl: OAUTH_CONFIG.FAILURE_URL,
      });
      account.createOAuth2Session(
        OAuthProvider.Google,
        OAUTH_CONFIG.SUCCESS_URL,
        OAUTH_CONFIG.FAILURE_URL
      );
      // The page will redirect to Google, so no need to update state here
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  };

  // Login with Email & Password
  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error: any) {
      console.error('Email login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Signup with Email & Password
  const signupWithEmail = async (email: string, password: string, name: string, state?: string, district?: string, institution?: string) => {
    try {
      setLoading(true);
      // Create account with Appwrite's unique ID generator
      await account.create(AppwriteID.unique(), email, password, name);

      // Auto-login after signup
      await account.createEmailPasswordSession(email, password);

      // Store additional profile data in preferences
      if (state || district || institution) {
        await account.updatePrefs({
          state: state || '',
          district: district || '',
          institution: institution || ''
        });
      }

      // Send verification email
      const verificationUrl = `${window.location.origin}/verify-email`;
      await account.createVerification(verificationUrl);

      // Get user data
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
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
    loginWithEmail,
    signupWithEmail,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
