'use client';

import { PrivyProvider, usePrivy, useLogin, useLogout } from '@privy-io/react-auth';
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';

// Auth context types
export interface AuthUser {
  id: string;  // Privy DID
  email?: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Inner provider that uses Privy hooks (only rendered when Privy is configured)
function PrivyAuthInner({ children }: { children: ReactNode }) {
  const { ready, authenticated, user: privyUser } = usePrivy();
  const { login: privyLogin } = useLogin();
  const { logout: privyLogout } = useLogout();

  const user: AuthUser | null = privyUser
    ? {
        id: privyUser.id,
        email: privyUser.email?.address,
        walletAddress: privyUser.wallet?.address,
      }
    : null;

  const login = useCallback(() => {
    privyLogin();
  }, [privyLogin]);

  const logout = useCallback(async () => {
    await privyLogout();
  }, [privyLogout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: authenticated,
    isLoading: !ready,
    isConfigured: true,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Fallback provider when Privy is not configured
function NoAuthProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const value: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isLoading: !isHydrated,
    isConfigured: false,
    login: () => {
      console.warn('Authentication is not configured. Set NEXT_PUBLIC_PRIVY_APP_ID to enable.');
    },
    logout: async () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Main AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // If Privy is not configured, use fallback provider
  if (!appId) {
    return <NoAuthProvider>{children}</NoAuthProvider>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#4f46e5', // Indigo-600 to match app theme
          logo: '/icon.svg',
        },
        loginMethods: ['email', 'google', 'wallet'],
        // Don't auto-create embedded wallets
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'off',
          },
        },
      }}
    >
      <PrivyAuthInner>{children}</PrivyAuthInner>
    </PrivyProvider>
  );
}
