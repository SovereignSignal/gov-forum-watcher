'use client';

import { LayoutGrid, FolderOpen, Settings, Bell, Bookmark, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  activeView: 'feed' | 'projects' | 'saved' | 'settings';
  onViewChange: (view: 'feed' | 'projects' | 'saved' | 'settings') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  savedCount?: number;
}

export function Sidebar({ activeView, onViewChange, theme, onToggleTheme, savedCount = 0 }: SidebarProps) {
  const navItems = [
    { id: 'feed' as const, label: 'Feed', icon: LayoutGrid },
    { id: 'projects' as const, label: 'Projects', icon: FolderOpen },
    { id: 'saved' as const, label: 'Saved', icon: Bookmark, count: savedCount },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 theme-sidebar border-r flex flex-col h-full">
      <div className="p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500" />
            <h1 className="text-lg font-semibold theme-text">Gov Watch</h1>
          </div>
          <button
            onClick={onToggleTheme}
            className="p-2 theme-text-secondary hover:opacity-80 rounded-lg transition-colors"
            style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs theme-text-muted mt-1">Governance Forum Aggregator</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'theme-text-secondary hover:opacity-80'
                  }`}
                  style={!isActive ? { backgroundColor: 'transparent' } : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-white/20' : ''
                    }`}
                    style={!isActive ? { backgroundColor: 'var(--card-border)' } : undefined}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
        <p className="text-xs theme-text-muted">
          Aggregating governance discussions from Discourse forums
        </p>
      </div>
    </aside>
  );
}
