import { useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";

export const useResizeObserver = (
  ref: RefObject<Element>,
  onResize: (width: number) => void
): void => {
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    let rafId: number | null = null;

    const handleResizeEntries = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        onResizeRef.current(entry.contentRect.width);
      });
    };

    const observer = new ResizeObserver(handleResizeEntries);

    observer.observe(node);
    onResizeRef.current(node.getBoundingClientRect().width);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [ref]);
};
