'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseVirtualListOptions {
  itemHeight: number;
  overscan?: number;
  containerRef: React.RefObject<HTMLElement | null>;
}

interface VirtualItem {
  index: number;
  start: number;
}

export function useVirtualList<T>(
  items: T[],
  options: UseVirtualListOptions
): {
  virtualItems: VirtualItem[];
  totalHeight: number;
  containerProps: {
    style: React.CSSProperties;
    onScroll: () => void;
  };
} {
  const { itemHeight, overscan = 3, containerRef } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Update container height on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setContainerHeight(container.clientHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      setScrollTop(container.scrollTop);
    }
  }, [containerRef]);

  // Calculate visible range
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // Generate virtual items
  const virtualItems: VirtualItem[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      start: i * itemHeight,
    });
  }

  return {
    virtualItems,
    totalHeight,
    containerProps: {
      style: { overflow: 'auto' },
      onScroll: handleScroll,
    },
  };
}
