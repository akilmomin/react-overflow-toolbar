export interface IVisibilityItem {
  id: string;
  width: number;
  priority: number;
  sticky: boolean;
}

export interface IVisibilityResult {
  visibleIds: Set<string>;
  overflowIds: Set<string>;
}

export const computeVisibility = (
  containerWidth: number,
  orderedItems: IVisibilityItem[],
  triggerWidth: number,
  gap: number
): IVisibilityResult => {
  if (orderedItems.length === 0) {
    return { visibleIds: new Set(), overflowIds: new Set() };
  }

  const totalWidth =
    orderedItems.reduce((sum, item) => sum + item.width, 0) +
    gap * (orderedItems.length - 1);

  if (totalWidth <= containerWidth) {
    return {
      visibleIds: new Set(orderedItems.map((item) => item.id)),
      overflowIds: new Set(),
    };
  }

  const availableWidth = containerWidth - triggerWidth - gap;

  const overflowCandidates = orderedItems
    .map((item, index) => ({ ...item, index }))
    .filter((item) => !item.sticky)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.index - a.index;
    });

  const overflowIds = new Set<string>();
  const remaining = new Map(orderedItems.map((item) => [item.id, item.width]));

  const getCurrentVisibleWidth = () => {
    const visibleCount = remaining.size - overflowIds.size;
    let sum = 0;
    for (const [id, width] of remaining) {
      if (!overflowIds.has(id)) sum += width;
    }
    return sum + gap * Math.max(0, visibleCount - 1);
  };

  let candidateIndex = 0;
  while (
    getCurrentVisibleWidth() > availableWidth &&
    candidateIndex < overflowCandidates.length &&
    overflowIds.size < orderedItems.length
  ) {
    overflowIds.add(overflowCandidates[candidateIndex].id);
    candidateIndex++;
  }

  const visibleIds = new Set(
    orderedItems.filter((item) => !overflowIds.has(item.id)).map((item) => item.id)
  );

  return { visibleIds, overflowIds };
};
