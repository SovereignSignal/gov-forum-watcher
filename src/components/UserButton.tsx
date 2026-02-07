'use client';

import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useTheme } from '@/hooks/useTheme';
import { c } from '@/lib/theme';

export function UserButton() {
  const { user, isAuthenticated, isLoading, isConfigured, login, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const t = c(isDark);

  if (!isConfigured) return null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2" style={{ color: t.fgMuted }}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={login}
        className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-colors text-left"
        style={{ color: t.fgMuted }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.bgCardHover; e.currentTarget.style.color = t.fg; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = t.fgMuted; }}
      >
        <LogIn className="w-4 h-4" />
        <span className="text-sm font-medium">Sign In</span>
      </button>
    );
  }

  const displayName = user.email || truncateAddress(user.walletAddress) || 'User';

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: isDark ? 'linear-gradient(135deg, #3f3f46, #52525b)' : 'linear-gradient(135deg, #a1a1aa, #71717a)' }}>
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: t.fg }}>{displayName}</p>
          <p className="text-xs" style={{ color: t.fgDim }}>Signed in</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-1.5 w-full rounded-lg transition-colors text-left text-sm"
        style={{ color: t.fgMuted }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.bgCardHover; e.currentTarget.style.color = t.fg; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = t.fgMuted; }}
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}

function truncateAddress(address: string | undefined): string | undefined {
  if (!address) return undefined;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
