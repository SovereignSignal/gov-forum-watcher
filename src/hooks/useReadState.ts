'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'gov-forum-watcher-read-discussions';
const MAX_STORED_ITEMS = 1000; // Limit storage size

interface ReadState {
  [refId: string]: number; // timestamp when marked as read
}

function getReadState(): ReadState {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveReadState(state: ReadState): void {
  if (typeof window === 'undefined') return;
  try {
    // Prune old entries if we exceed the limit
    const entries = Object.entries(state);
    if (entries.length > MAX_STORED_ITEMS) {
      // Keep only the most recent entries
      const sorted = entries.sort((a, b) => b[1] - a[1]);
      const pruned = Object.fromEntries(sorted.slice(0, MAX_STORED_ITEMS));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Storage full or unavailable
  }
}

export function useReadState() {
  const [readState, setReadState] = useState<ReadState>(() => getReadState());

  const markAsRead = useCallback((refId: string) => {
    setReadState((prev) => {
      const updated = { ...prev, [refId]: Date.now() };
      saveReadState(updated);
      return updated;
    });
  }, []);

  const markMultipleAsRead = useCallback((refIds: string[]) => {
    setReadState((prev) => {
      const now = Date.now();
      const updated = { ...prev };
      refIds.forEach((refId) => {
        updated[refId] = now;
      });
      saveReadState(updated);
      return updated;
    });
  }, []);

  const isRead = useCallback(
    (refId: string): boolean => {
      return refId in readState;
    },
    [readState]
  );

  const getUnreadCount = useCallback(
    (refIds: string[]): number => {
      return refIds.filter((refId) => !readState[refId]).length;
    },
    [readState]
  );

  const clearReadState = useCallback(() => {
    setReadState({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    isRead,
    markAsRead,
    markMultipleAsRead,
    getUnreadCount,
    clearReadState,
    readCount: Object.keys(readState).length,
  };
}
