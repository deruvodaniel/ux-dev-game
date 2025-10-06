import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
} from '@/types/context/auth';

import { auth } from '@/services/firebase';

import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          picture: firebaseUser.photoURL,
        });
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getToken = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const idToken = await currentUser.getIdToken();
      return idToken;
    }
    return null;
  }, []);

  const signIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof Error) {
        notify({ message: `Error de inicio de sesión: ${error.message}`, level: 'danger' });
      }
      console.error("Login failed", error);
    }
  }, [notify]);

  const signOut = useCallback(async () => {
    try {
      await auth.signOut();
    } catch (error) {
       if (error instanceof Error) {
        notify({ message: `Error de cierre de sesión: ${error.message}`, level: 'danger' });
      }
      console.error("Logout failed", error);
    }
  }, [notify]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    token,
    getToken,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
