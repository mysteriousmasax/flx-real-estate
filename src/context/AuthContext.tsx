import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AuthUser } from '../types';

interface LoginResult {
  success: boolean;
  message: string;
  role?: AuthUser['role'];
}

interface SignInInput {
  email: string;
  password: string;
}

interface RegisterInput extends SignInInput {
  name: string;
  role: AuthUser['role'];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signIn: (input: SignInInput) => Promise<LoginResult>;
  signUp: (input: RegisterInput) => Promise<LoginResult>;
  signInWithEmail: (input: SignInInput) => Promise<LoginResult>;
  registerAccount: (input: RegisterInput) => Promise<LoginResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'flx_local_users';
const SESSION_KEY = 'flx_local_session';

function safeReadUsers(): Record<string, { name: string; email: string; password: string; role: AuthUser['role']; picture?: string; }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistUsers(data: Record<string, { name: string; email: string; password: string; role: AuthUser['role']; picture?: string; }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const persistSession = useCallback((nextUser: AuthUser | null) => {
    if (!nextUser) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
  }, []);

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const signInWithEmail = useCallback(async ({ email, password }: SignInInput): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const accounts = safeReadUsers();
      const normalizedEmail = email.trim().toLowerCase();
      const account = accounts[normalizedEmail];

      if (!account) {
        return { success: false, message: 'No account found with that email. Create one first.' };
      }

      if (account.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      const resolvedRole = account.role || 'Client';

      const nextUser: AuthUser = {
        id: `local-${normalizedEmail}`,
        name: account.name,
        email: account.email,
        picture: account.picture,
        role: resolvedRole,
        isVerified: true,
        provider: 'local',
        lastLogin: new Date().toISOString(),
      };

      setUser(nextUser);
      persistSession(nextUser);
      setIsAuthModalOpen(false);
      return { success: true, message: 'Signed in successfully.', role: resolvedRole };
    } catch {
      return { success: false, message: 'Unable to sign in. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, [persistSession]);

  const registerAccount = useCallback(async ({ name, email, password, role }: RegisterInput): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const accounts = safeReadUsers();

      if (accounts[normalizedEmail]) {
        return { success: false, message: 'An account with this email already exists.' };
      }

      const nextRole = role || 'Client';
      const account = {
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: nextRole,
      };

      accounts[normalizedEmail] = account;
      persistUsers(accounts);

      const nextUser: AuthUser = {
        id: `local-${normalizedEmail}`,
        name: account.name,
        email: account.email,
        role: nextRole,
        isVerified: true,
        provider: 'local',
        lastLogin: new Date().toISOString(),
      };

      setUser(nextUser);
      persistSession(nextUser);
      setIsAuthModalOpen(false);
      return { success: true, message: 'Account created successfully.', role: nextRole };
    } catch {
      return { success: false, message: 'Unable to create account. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, [persistSession]);

  const signOut = useCallback(() => {
    setUser(null);
    persistSession(null);
  }, [persistSession]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signIn: signInWithEmail,
    signUp: registerAccount,
    signInWithEmail,
    registerAccount,
    signOut,
  }), [user, isLoading, isAuthModalOpen, openAuthModal, closeAuthModal, signInWithEmail, registerAccount, signOut]);

  return (
    <AuthContext.Provider value={value}>
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
