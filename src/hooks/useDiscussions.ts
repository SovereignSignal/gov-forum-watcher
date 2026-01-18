'use client';

import { useState, useCallback, useRef } from 'react';
import { Forum, DiscussionTopic } from '@/types';

export interface ForumLoadingState {
  forumId: string;
  forumName: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  error?: string;
}

interface UseDiscussionsResult {
  discussions: DiscussionTopic[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  forumStates: ForumLoadingState[];
  refresh: () => Promise<void>;
}

export function useDiscussions(forums: Forum[]): UseDiscussionsResult {
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [forumStates, setForumStates] = useState<ForumLoadingState[]>([]);
  const fetchInProgress = useRef(false);

  const fetchDiscussions = useCallback(async () => {
    const enabledForums = forums.filter(f => f.isEnabled);
    if (enabledForums.length === 0) {
      setDiscussions([]);
      setForumStates([]);
      return;
    }

    if (fetchInProgress.current) {
      return;
    }
    fetchInProgress.current = true;

    setIsLoading(true);
    setError(null);
    
    const initialStates: ForumLoadingState[] = enabledForums.map(f => ({
      forumId: f.id,
      forumName: f.name,
      status: 'loading',
    }));
    setForumStates(initialStates);

    try {
      const results = await Promise.allSettled(
        enabledForums.map(async (forum, index) => {
          const params = new URLSearchParams({
            forumUrl: forum.discourseForum.url,
            protocol: forum.cname,
            logoUrl: forum.logoUrl || '',
          });
          if (forum.discourseForum.categoryId) {
            params.set('categoryId', forum.discourseForum.categoryId.toString());
          }

          try {
            const response = await fetch(`/api/discourse?${params.toString()}`);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            
            setForumStates(prev => prev.map((s, i) => 
              i === index ? { ...s, status: 'success' } : s
            ));
            
            return data.topics as DiscussionTopic[];
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            setForumStates(prev => prev.map((s, i) => 
              i === index ? { ...s, status: 'error', error: errorMsg } : s
            ));
            throw new Error(`${forum.name}: ${errorMsg}`);
          }
        })
      );

      const allTopics: DiscussionTopic[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allTopics.push(...result.value);
        } else {
          errors.push(`${enabledForums[index].name}: ${result.reason.message}`);
        }
      });

      allTopics.sort((a, b) => new Date(b.bumpedAt).getTime() - new Date(a.bumpedAt).getTime());
      
      setDiscussions(allTopics);
      setLastUpdated(new Date());
      
      if (errors.length > 0 && errors.length < enabledForums.length) {
        setError(`Some forums failed: ${errors.join(', ')}`);
      } else if (errors.length === enabledForums.length) {
        setError('All forums failed to load. Please check your connections.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discussions');
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [forums]);

  return {
    discussions,
    isLoading,
    error,
    lastUpdated,
    forumStates,
    refresh: fetchDiscussions,
  };
}
