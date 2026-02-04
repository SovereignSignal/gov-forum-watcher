'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'discuss-watch-onboarding-completed';

// Use useSyncExternalStore for SSR-safe localStorage access
function getSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

function getServerSnapshot(): boolean {
  return true; // Default to completed on server to avoid flash
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useOnboarding() {
  const hasCompletedOnboarding = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [localCompleted, setLocalCompleted] = useState(hasCompletedOnboarding);

  const completeOnboarding = useCallback(() => {
    setLocalCompleted(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
      // Dispatch storage event to trigger sync
      window.dispatchEvent(new Event('storage'));
    }
  }, []);

  const resetOnboarding = useCallback(() => {
    setLocalCompleted(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('storage'));
    }
  }, []);

  // Use local state for immediate updates, external store for initial value
  const effectiveCompleted = localCompleted || hasCompletedOnboarding;

  return {
    hasCompletedOnboarding: effectiveCompleted,
    completeOnboarding,
    resetOnboarding,
    shouldShowOnboarding: !effectiveCompleted,
  };
}
