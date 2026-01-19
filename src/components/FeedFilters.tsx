'use client';

import { Calendar, Filter } from 'lucide-react';
import { DateRangeFilter } from '@/types';
import { Forum } from '@/types';

interface FeedFiltersProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  selectedForumId: string | null;
  onForumFilterChange: (forumId: string | null) => void;
  forums: Forum[];
}

const DATE_RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export function FeedFilters({
  dateRange,
  onDateRangeChange,
  selectedForumId,
  onForumFilterChange,
  forums,
}: FeedFiltersProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b theme-card" style={{ borderColor: 'var(--card-border)' }}>
      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 theme-text-muted" />
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--card-border)' }}>
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onDateRangeChange(option.value)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                dateRange === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'theme-text-secondary hover:opacity-80'
              }`}
              style={dateRange !== option.value ? { backgroundColor: 'var(--card-bg)' } : undefined}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forum Source Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 theme-text-muted" />
        <select
          value={selectedForumId || ''}
          onChange={(e) => onForumFilterChange(e.target.value || null)}
          className="px-3 py-1 text-xs rounded-lg theme-text-secondary focus:outline-none focus:border-indigo-500"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', border: '1px solid var(--card-border)' }}
        >
          <option value="">All Forums</option>
          {forums.map((forum) => (
            <option key={forum.id} value={forum.id}>
              {forum.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
