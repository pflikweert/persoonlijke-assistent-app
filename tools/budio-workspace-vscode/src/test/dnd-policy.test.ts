import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMovePlan, computeInsertIndex, getDropPlacementFromPointer } from '../tasks/dnd-policy';

test('computeInsertIndex resolves before/after/end placements', () => {
  const destinationIdsWithoutDragged = ['task-a', 'task-b', 'task-c'];

  assert.equal(
    computeInsertIndex({
      destinationIdsWithoutDragged,
      anchorTaskId: 'task-b',
      placement: 'before',
    }),
    1,
  );

  assert.equal(
    computeInsertIndex({
      destinationIdsWithoutDragged,
      anchorTaskId: 'task-b',
      placement: 'after',
    }),
    2,
  );

  assert.equal(
    computeInsertIndex({
      destinationIdsWithoutDragged,
      anchorTaskId: null,
      placement: 'end',
    }),
    3,
  );
});

test('buildMovePlan keeps in-lane reorder sourceIds empty and rewrites destination order', () => {
  const movePlan = buildMovePlan({
    dragTaskId: 'task-b',
    sourceStatus: 'ready',
    targetStatus: 'ready',
    sourceIdsInManualOrder: ['task-a', 'task-b', 'task-c'],
    targetIdsInManualOrder: ['task-a', 'task-b', 'task-c'],
    anchorTaskId: 'task-c',
    placement: 'after',
  });

  assert.deepEqual(movePlan.destinationIds, ['task-a', 'task-c', 'task-b']);
  assert.deepEqual(movePlan.sourceIds, []);
  assert.equal(movePlan.targetIndex, 2);
});

test('buildMovePlan supports cross-status move with explicit source and destination updates', () => {
  const movePlan = buildMovePlan({
    dragTaskId: 'task-ready-b',
    sourceStatus: 'ready',
    targetStatus: 'blocked',
    sourceIdsInManualOrder: ['task-ready-a', 'task-ready-b'],
    targetIdsInManualOrder: ['task-blocked-a', 'task-blocked-b'],
    anchorTaskId: 'task-blocked-a',
    placement: 'before',
  });

  assert.deepEqual(movePlan.sourceIds, ['task-ready-a']);
  assert.deepEqual(movePlan.destinationIds, ['task-ready-b', 'task-blocked-a', 'task-blocked-b']);
  assert.equal(movePlan.targetIndex, 0);
});

test('getDropPlacementFromPointer splits target surface in half', () => {
  assert.equal(getDropPlacementFromPointer(4, 20), 'before');
  assert.equal(getDropPlacementFromPointer(16, 20), 'after');
});
