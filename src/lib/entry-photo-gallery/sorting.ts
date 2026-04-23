export function clampGalleryIndex(index: number, length: number): number {
  if (length <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(length - 1, index));
}

export function reorderGalleryItems<T>(
  items: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (fromIndex < 0 || fromIndex >= items.length) {
    return items;
  }

  if (fromIndex === toIndex) {
    return items;
  }

  const targetIndex = clampGalleryIndex(toIndex, items.length);
  const next = items.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(targetIndex, 0, moved as T);
  return next;
}

export function getGalleryDragLeft(input: {
  originLeft: number;
  pointerStartPageX: number;
  pointerPageX: number;
  itemCount: number;
  slotWidth: number;
}): number {
  const maxLeft = Math.max(0, (input.itemCount - 1) * input.slotWidth);
  return Math.max(
    0,
    Math.min(
      maxLeft,
      input.originLeft + input.pointerPageX - input.pointerStartPageX
    )
  );
}

export function getGalleryDragTargetIndex(input: {
  dragLeft: number;
  itemCount: number;
  slotWidth: number;
}): number {
  return clampGalleryIndex(
    Math.round(input.dragLeft / input.slotWidth),
    input.itemCount
  );
}
