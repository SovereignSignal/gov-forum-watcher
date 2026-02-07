'use client';

import { c } from '@/lib/theme';

const animationStyle = `
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

export function DiscussionSkeleton({ isDark = true }: { isDark?: boolean }) {
  const t = c(isDark);
  const s: React.CSSProperties = {
    backgroundColor: t.bgCardHover,
    borderRadius: '4px',
    animation: 'skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  return (
    <div
      className="rounded-lg border"
      style={{ borderColor: t.border, padding: '10px 16px' }}
      aria-hidden="true"
    >
      <div className="flex items-start gap-3">
        <div className="hidden sm:block mt-0.5" style={{ ...s, width: 32, height: 32, borderRadius: 6, flexShrink: 0 }} />
        <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="flex items-center gap-2">
            <div style={{ ...s, width: 64, height: 16 }} />
            <div style={{ ...s, width: '55%', height: 16 }} />
          </div>
          <div className="flex items-center gap-4">
            <div style={{ ...s, width: 40, height: 12 }} />
            <div style={{ ...s, width: 48, height: 12 }} />
            <div style={{ ...s, width: 36, height: 12 }} />
            <div style={{ ...s, width: 56, height: 12 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiscussionSkeletonList({ count = 8, isDark = true }: { count?: number; isDark?: boolean }) {
  return (
    <div role="status" aria-label="Loading discussions" className="space-y-1">
      <style>{animationStyle}</style>
      <span className="sr-only">Loading discussions...</span>
      {Array.from({ length: count }, (_, i) => (
        <DiscussionSkeleton key={i} isDark={isDark} />
      ))}
    </div>
  );
}
