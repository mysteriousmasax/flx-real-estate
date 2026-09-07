import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthUser } from '../types';
import { auth, googleProvider, db } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: (customAccount?: Partial<AuthUser>) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode standard Google ID JWT without external libraries
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding Google JWT:', e);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }
      const profileRef = doc(db, 'users', firebaseUser.uid);
      const profileSnapshot = await getDoc(profileRef);
      const profile = profileSnapshot.exists() ? profileSnapshot.data() : {};
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'FLX User',
        email: firebaseUser.email || '',
        picture: firebaseUser.photoURL || undefined,
        role: profile.role || 'Client',
        isVerified: firebaseUser.emailVerified,
        provider: 'google',
        lastLogin: new Date().toISOString(),
      });
    });
  }, []);

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const signInWithGoogle = useCallback(async (customAccount?: Partial<AuthUser>) => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const role = customAccount?.role || 'Client';
      await setDoc(doc(db, 'users', result.user.uid), {
        name: result.user.displayName || result.user.email?.split('@')[0] || 'FLX User',
        email: result.user.email || '',
        role,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Google Sign-In error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    void firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signOut,
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
