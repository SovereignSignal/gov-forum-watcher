'use client';

import { useState } from 'react';
import { RefreshCw, AlertCircle, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { DiscussionTopic, KeywordAlert } from '@/types';
import { DiscussionItem } from './DiscussionItem';
import { ForumLoadingState } from '@/hooks/useDiscussions';
import { format } from 'date-fns';

interface DiscussionFeedProps {
  discussions: DiscussionTopic[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  onRefresh: () => void;
  alerts: KeywordAlert[];
  searchQuery: string;
  filterMode: 'all' | 'your';
  enabledForumIds: string[];
  forumStates: ForumLoadingState[];
}

export function DiscussionFeed({
  discussions,
  isLoading,
  error,
  lastUpdated,
  onRefresh,
  alerts,
  searchQuery,
  filterMode: _filterMode,
  enabledForumIds,
  forumStates,
}: DiscussionFeedProps) {
  void _filterMode;
  const [displayCount, setDisplayCount] = useState(20);

  const filteredDiscussions = discussions.filter(topic => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        topic.title.toLowerCase().includes(query) ||
        topic.protocol.toLowerCase().includes(query) ||
        topic.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }
    return true;
  });

  const displayedDiscussions = filteredDiscussions.slice(0, displayCount);
  const hasMore = displayCount < filteredDiscussions.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Discussions</h2>
          {lastUpdated && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              Updated {format(lastUpdated, 'HH:mm:ss')}
            </span>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border-b border-red-800">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {isLoading && forumStates.length > 0 && (
        <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-800">
          <p className="text-xs text-gray-400 mb-2">Loading forums...</p>
          <div className="flex flex-wrap gap-2">
            {forumStates.map((state) => (
              <span
                key={state.forumId}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                  state.status === 'loading'
                    ? 'bg-indigo-900/30 text-indigo-300'
                    : state.status === 'success'
                    ? 'bg-green-900/30 text-green-300'
                    : state.status === 'error'
                    ? 'bg-red-900/30 text-red-300'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {state.status === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
                {state.status === 'success' && <CheckCircle className="w-3 h-3" />}
                {state.status === 'error' && <XCircle className="w-3 h-3" />}
                {state.forumName}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isLoading && discussions.length === 0 && forumStates.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading discussions...</p>
            </div>
          </div>
        ) : displayedDiscussions.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-400 mb-2">No discussions found</p>
              {enabledForumIds.length === 0 ? (
                <p className="text-gray-500 text-sm">Add some forums to get started</p>
              ) : searchQuery ? (
                <p className="text-gray-500 text-sm">Try a different search term</p>
              ) : (
                <button
                  onClick={onRefresh}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Click to refresh
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {displayedDiscussions.map(topic => (
              <DiscussionItem key={topic.refId} topic={topic} alerts={alerts} />
            ))}
            {hasMore && (
              <div className="p-4 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                >
                  Load more ({filteredDiscussions.length - displayCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
