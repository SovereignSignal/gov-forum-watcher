'use client';

import { useState, useCallback, useEffect } from 'react';

type Theme = 'dark' | 'light';

// Use consistent key across app and landing page
const THEME_KEY = 'gov-watch-theme';

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return (stored as Theme) || 'dark';
  } catch {
    return 'dark';
  }
}

export function useTheme() {
  // Use lazy initialization - this runs only on client after hydration
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());

  // Apply theme class to document whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, newTheme);
      // Dispatch custom event so AuthProvider can update Privy theme
      window.dispatchEvent(new Event('themechange'));
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
