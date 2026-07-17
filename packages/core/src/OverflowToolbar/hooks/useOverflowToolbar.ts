import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { IUseOverflowToolbarOptions, IUseOverflowToolbarResult } from "../OverflowToolbar.model";
import { computeVisibility } from "./internal/computeVisibility";
import { useResizeObserver } from "./internal/useResizeObserver";

const DEFAULT_TRIGGER_WIDTH = 40;

export const useOverflowToolbar = ({
  items,
  gap = 8,
  overflowTriggerWidth,
}: IUseOverflowToolbarOptions): IUseOverflowToolbarResult => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overflowTriggerRef = useRef<HTMLElement>(null);

  const widthsRef = useRef(new Map<string, number>());
  const containerWidthRef = useRef(0);
  const triggerWidthRef = useRef(overflowTriggerWidth ?? DEFAULT_TRIGGER_WIDTH);

  const [isMeasuring, setIsMeasuring] = useState(true);
  const [visibleIds, setVisibleIds] = useState<Set<string> | null>(null);
  const [overflowIds, setOverflowIds] = useState<Set<string>>(new Set());

  const itemsKey = items.map((item) => item.id).join("|");

  useLayoutEffect(() => {
    const known = widthsRef.current;
    const currentIds = new Set(items.map((item) => item.id));
    for (const id of Array.from(known.keys())) {
      if (!currentIds.has(id)) known.delete(id);
    }
    setIsMeasuring(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  const recompute = useCallback(() => {
    if (items.length === 0) {
      setVisibleIds(new Set());
      setOverflowIds(new Set());
      setIsMeasuring(false);
      return;
    }

    const allMeasured = items.every((item) => widthsRef.current.has(item.id));
    if (!allMeasured || containerWidthRef.current === 0) return;

    const orderedItems = items.map((item, index) => ({
      id: item.id,
      width: widthsRef.current.get(item.id) ?? 0,
      priority: item.priority ?? index,
      sticky: item.sticky ?? false,
    }));

    const result = computeVisibility(
      containerWidthRef.current,
      orderedItems,
      triggerWidthRef.current,
      gap
    );

    setVisibleIds(result.visibleIds);
    setOverflowIds(result.overflowIds);
    setIsMeasuring(false);
  }, [items, gap]);

  const measureRef = useCallback(
    (id: string) => (node: HTMLElement | null) => {
      if (!node) return;
      const width = node.getBoundingClientRect().width;
      if (widthsRef.current.get(id) !== width) {
        widthsRef.current.set(id, width);
        recompute();
      }
    },
    [recompute]
  );

  const handleContainerResize = useCallback(
    (width: number) => {
      containerWidthRef.current = width;
      recompute();
    },
    [recompute]
  );

  useResizeObserver(containerRef, handleContainerResize);

  useLayoutEffect(() => {
    if (overflowTriggerRef.current) {
      triggerWidthRef.current =
        overflowTriggerWidth ??
        overflowTriggerRef.current.getBoundingClientRect().width ??
        DEFAULT_TRIGGER_WIDTH;
    }
  });

  const visibleItems = useMemo(() => {
    if (isMeasuring || !visibleIds) return items;
    return items.filter((item) => visibleIds.has(item.id));
  }, [items, visibleIds, isMeasuring]);

  const overflowItems = useMemo(() => {
    if (isMeasuring || !visibleIds) return [];
    return items.filter((item) => overflowIds.has(item.id));
  }, [items, overflowIds, isMeasuring, visibleIds]);

  return {
    containerRef,
    measureRef,
    overflowTriggerRef,
    visibleItems,
    overflowItems,
    isMeasuring,
  };
};
