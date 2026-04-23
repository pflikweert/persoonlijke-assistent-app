import type { TaskStatus } from './types';

export type DropPlacement = 'before' | 'after' | 'end';

export interface MovePlanInput {
  dragTaskId: string;
  sourceStatus: TaskStatus;
  targetStatus: TaskStatus;
  sourceIdsInManualOrder: string[];
  targetIdsInManualOrder: string[];
  anchorTaskId: string | null;
  placement: DropPlacement;
}

export interface MovePlan {
  destinationIds: string[];
  sourceIds: string[];
  targetIndex: number;
}

export function getDropPlacementFromPointer(pointerOffsetY: number, elementHeight: number): 'before' | 'after' {
  if (pointerOffsetY <= elementHeight / 2) {
    return 'before';
  }
  return 'after';
}

export function computeInsertIndex(input: {
  destinationIdsWithoutDragged: string[];
  anchorTaskId: string | null;
  placement: DropPlacement;
}): number {
  if (input.placement === 'end' || !input.anchorTaskId) {
    return input.destinationIdsWithoutDragged.length;
  }

  const anchorIndex = input.destinationIdsWithoutDragged.indexOf(input.anchorTaskId);
  if (anchorIndex < 0) {
    return input.destinationIdsWithoutDragged.length;
  }

  return input.placement === 'before' ? anchorIndex : anchorIndex + 1;
}

export function buildMovePlan(input: MovePlanInput): MovePlan {
  const sourceIds = input.sourceIdsInManualOrder.filter((id) => id !== input.dragTaskId);
  const destinationIdsWithoutDragged = input.targetIdsInManualOrder.filter((id) => id !== input.dragTaskId);
  const targetIndex = computeInsertIndex({
    destinationIdsWithoutDragged,
    anchorTaskId: input.anchorTaskId,
    placement: input.placement,
  });

  const destinationIds = [...destinationIdsWithoutDragged];
  const clampedIndex = Math.max(0, Math.min(targetIndex, destinationIds.length));
  destinationIds.splice(clampedIndex, 0, input.dragTaskId);

  return {
    destinationIds,
    sourceIds: input.sourceStatus === input.targetStatus ? [] : sourceIds,
    targetIndex: clampedIndex,
  };
}
