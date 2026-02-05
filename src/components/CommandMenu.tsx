'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, MessageSquare, Grid3X3, ArrowUpDown, CheckCheck, RefreshCw, Sun, Moon, Command } from 'lucide-react';

interface Forum {
  id: string;
  name: string;
  category: string;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  forums: Forum[];
  onSelectForum: (forumId: string) => void;
  onSelectCategory: (category: string | null) => void;
  onSearch: (query: string) => void;
  onSort: (sort: string) => void;
  onAction: (action: 'markAllRead' | 'refresh' | 'toggleTheme') => void;
  isDark?: boolean;
}

interface CommandItem {
  id: string;
  label: string;
  section: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export function CommandMenu({
  isOpen, onClose, forums, onSelectForum, onSelectCategory,
  onSearch, onSort, onAction, isDark = true,
}: CommandMenuProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Theme
  const overlay = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)';
  const menuBg = isDark ? '#18181b' : '#ffffff';
  const menuBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const textPrimary = isDark ? '#fafafa' : '#09090b';
  const textMuted = isDark ? '#71717a' : '#52525b';
  const textDim = isDark ? '#52525b' : '#a1a1aa';
  const hoverBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const activeBg = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const sectionColor = isDark ? '#52525b' : '#a1a1aa';
  const separatorColor = isDark ? '#1c1c1e' : 'rgba(0,0,0,0.06)';

  // Build command list
  const allItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [];

    // Categories
    items.push(
      { id: 'cat-all', label: 'All Categories', section: 'Categories', icon: <Grid3X3 className="w-4 h-4" />, action: () => onSelectCategory(null), keywords: ['all', 'category', 'filter'] },
      { id: 'cat-crypto', label: 'Crypto', section: 'Categories', icon: <Grid3X3 className="w-4 h-4" />, action: () => onSelectCategory('crypto'), keywords: ['crypto', 'governance', 'dao'] },
      { id: 'cat-ai', label: 'AI', section: 'Categories', icon: <Grid3X3 className="w-4 h-4" />, action: () => onSelectCategory('ai'), keywords: ['ai', 'artificial', 'intelligence', 'ml'] },
      { id: 'cat-oss', label: 'OSS', section: 'Categories', icon: <Grid3X3 className="w-4 h-4" />, action: () => onSelectCategory('oss'), keywords: ['oss', 'open', 'source'] },
    );

    // Sort
    items.push(
      { id: 'sort-recent', label: 'Sort by Recent', section: 'Sort', icon: <ArrowUpDown className="w-4 h-4" />, action: () => onSort('recent'), keywords: ['sort', 'recent', 'latest'] },
      { id: 'sort-created', label: 'Sort by Created', section: 'Sort', icon: <ArrowUpDown className="w-4 h-4" />, action: () => onSort('created'), keywords: ['sort', 'created', 'new'] },
      { id: 'sort-activity', label: 'Sort by Activity', section: 'Sort', icon: <ArrowUpDown className="w-4 h-4" />, action: () => onSort('activity'), keywords: ['sort', 'activity', 'hot'] },
    );

    // Actions
    items.push(
      { id: 'action-read', label: 'Mark All as Read', section: 'Actions', icon: <CheckCheck className="w-4 h-4" />, action: () => onAction('markAllRead'), keywords: ['mark', 'read', 'clear'] },
      { id: 'action-refresh', label: 'Refresh Feed', section: 'Actions', icon: <RefreshCw className="w-4 h-4" />, action: () => onAction('refresh'), keywords: ['refresh', 'reload', 'update'] },
      { id: 'action-theme', label: 'Toggle Theme', section: 'Actions', icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, action: () => onAction('toggleTheme'), keywords: ['theme', 'dark', 'light', 'mode'] },
    );

    // Forums
    forums.forEach(f => {
      items.push({
        id: `forum-${f.id}`,
        label: f.name,
        section: 'Forums',
        icon: <MessageSquare className="w-4 h-4" />,
        action: () => onSelectForum(f.id),
        keywords: [f.name.toLowerCase(), f.category],
      });
    });

    return items;
  }, [forums, isDark, onSelectCategory, onSelectForum, onSort, onAction]);

  // Filter
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.keywords?.some(k => k.includes(q))
    );
  }, [allItems, query]);

  // Group by section
  const grouped = useMemo(() => {
    const groups: { section: string; items: CommandItem[] }[] = [];
    const seen = new Set<string>();
    for (const item of filtered) {
      if (!seen.has(item.section)) {
        seen.add(item.section);
        groups.push({ section: item.section, items: [] });
      }
      groups.find(g => g.section === item.section)!.items.push(item);
    }
    return groups;
  }, [filtered]);

  // Flat list for keyboard nav
  const flatItems = useMemo(() => grouped.flatMap(g => g.items), [grouped]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Toggle is handled by parent
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSelect = useCallback((item: CommandItem) => {
    item.action();
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, flatItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatItems[activeIndex]) {
          handleSelect(flatItems[activeIndex]);
        } else if (query.trim()) {
          onSearch(query.trim());
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatItems, activeIndex, handleSelect, query, onSearch, onClose]);

  // Reset index when filtered results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  let itemIndex = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      style={{ backgroundColor: overlay }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: menuBg,
          border: `1px solid ${menuBorder}`,
          animation: 'cmdkIn 0.15s ease-out',
        }}
      >
        <style>{`
          @keyframes cmdkIn {
            from { opacity: 0; transform: scale(0.96) translateY(-8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: separatorColor }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: textMuted }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search forums, actions..."
            className="flex-1 bg-transparent text-sm outline-none placeholder-current"
            style={{ color: textPrimary, opacity: 1 }}
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono"
            style={{ backgroundColor: inputBg, color: textDim, border: `1px solid ${separatorColor}` }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-72 overflow-y-auto py-2" style={{ overscrollBehavior: 'contain' }}>
          {grouped.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: textMuted }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.section}>
                <div className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: sectionColor }}>
                  {group.section}
                </div>
                {group.items.map((item) => {
                  const idx = itemIndex++;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-left transition-colors"
                      style={{
                        color: textPrimary,
                        backgroundColor: isActive ? activeBg : 'transparent',
                      }}
                    >
                      <span style={{ color: textMuted }}>{item.icon}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && (
                        <span className="text-[10px] font-mono" style={{ color: textDim }}>↵</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t text-[11px]"
          style={{ borderColor: separatorColor, color: textDim }}>
          <span className="flex items-center gap-1">
            <kbd className="px-1 rounded" style={{ backgroundColor: inputBg }}>↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 rounded" style={{ backgroundColor: inputBg }}>↵</kbd> select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 rounded" style={{ backgroundColor: inputBg }}>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
