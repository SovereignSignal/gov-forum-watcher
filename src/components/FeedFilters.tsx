'use client';

import { Calendar, Filter, ArrowUpDown, Clock, Sparkles } from 'lucide-react';
import { DateRangeFilter, DateFilterMode, SortOption, Forum } from '@/types';

interface FeedFiltersProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (range: DateRangeFilter) => void;
  dateFilterMode: DateFilterMode;
  onDateFilterModeChange: (mode: DateFilterMode) => void;
  selectedForumId: string | null;
  onForumFilterChange: (forumId: string | null) => void;
  forums: Forum[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const DATE_RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'replies', label: 'Most Replies' },
  { value: 'views', label: 'Most Views' },
  { value: 'likes', label: 'Most Likes' },
];

export function FeedFilters({
  dateRange,
  onDateRangeChange,
  dateFilterMode,
  onDateFilterModeChange,
  selectedForumId,
  onForumFilterChange,
  forums,
  sortBy,
  onSortChange,
}: FeedFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
      {/* Date Filter Mode Toggle */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs theme-text-muted hidden sm:inline">Filter by:</span>
        <div
          role="group"
          aria-label="Date filter mode"
          className="flex rounded-lg overflow-hidden border"
          style={{ borderColor: 'var(--card-border)' }}
        >
          <button
            onClick={() => onDateFilterModeChange('created')}
            aria-pressed={dateFilterMode === 'created'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${
              dateFilterMode === 'created'
                ? 'bg-emerald-600 text-white'
                : 'theme-text-secondary hover:opacity-80'
            }`}
            style={dateFilterMode !== 'created' ? { backgroundColor: 'var(--card-bg)' } : undefined}
            title="Filter by when topics were created"
          >
            <Sparkles className="w-3 h-3" />
            <span>Created</span>
          </button>
          <button
            onClick={() => onDateFilterModeChange('activity')}
            aria-pressed={dateFilterMode === 'activity'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${
              dateFilterMode === 'activity'
                ? 'bg-amber-600 text-white'
                : 'theme-text-secondary hover:opacity-80'
            }`}
            style={dateFilterMode !== 'activity' ? { backgroundColor: 'var(--card-bg)' } : undefined}
            title="Filter by last activity/comment"
          >
            <Clock className="w-3 h-3" />
            <span>Activity</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 theme-text-muted" aria-hidden="true" />
        <div
          role="group"
          aria-label="Filter by date range"
          className="flex rounded-lg overflow-hidden border"
          style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}
        >
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onDateRangeChange(option.value)}
              aria-pressed={dateRange === option.value}
              className={`px-3 py-1.5 min-h-[32px] text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${
                dateRange === option.value
                  ? 'bg-indigo-600 text-white shadow-sm'
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
        <Filter className="w-4 h-4 theme-text-muted" aria-hidden="true" />
        <select
          id="forum-filter"
          value={selectedForumId || ''}
          onChange={(e) => onForumFilterChange(e.target.value || null)}
          className="px-3 py-1.5 min-h-[32px] text-xs rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer transition-colors theme-text-secondary"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          aria-label="Filter by forum"
        >
          <option value="">All Forums</option>
          {forums.map((forum) => (
            <option key={forum.id} value={forum.id}>
              {forum.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 ml-auto">
        <ArrowUpDown className="w-4 h-4 theme-text-muted" aria-hidden="true" />
        <label htmlFor="sort-filter" className="text-xs theme-text-muted hidden sm:inline">
          Sort
        </label>
        <select
          id="sort-filter"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-1.5 min-h-[32px] text-xs font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none' }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
