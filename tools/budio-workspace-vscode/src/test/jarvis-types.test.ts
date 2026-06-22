import test from 'node:test';
import assert from 'node:assert/strict';
import { WORKSPACE_NAVIGATION_ITEMS, WORKSPACE_VIEW_TITLES } from '../navigation';

test('jarvis view is available in workspace navigation', () => {
  assert.equal(WORKSPACE_VIEW_TITLES.jarvis, 'Jarvis');
  const item = WORKSPACE_NAVIGATION_ITEMS.find((candidate) => candidate.kind === 'view' && candidate.id === 'jarvis');
  assert.ok(item);
});
