import { useState, useEffect, useCallback, useRef } from "react";

interface UseVirtualScrollingProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside visible area
}

interface UseVirtualScrollingReturn {
  visibleItems: any[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export function useVirtualScrolling({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualScrollingProps): UseVirtualScrollingReturn {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleCount + overscan * 2
  );

  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index: number) => {
      const targetScrollTop = index * itemHeight;
      setScrollTop(targetScrollTop);
      containerRef.current?.scrollTo(0, targetScrollTop);
    },
    [itemHeight]
  );

  // Scroll to top
  const scrollToTop = useCallback(() => {
    setScrollTop(0);
    containerRef.current?.scrollTo(0, 0);
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    const maxScrollTop = totalHeight - containerHeight;
    setScrollTop(maxScrollTop);
    containerRef.current?.scrollTo(0, maxScrollTop);
  }, [totalHeight, containerHeight]);

  // Handle scroll events
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
  };
}
