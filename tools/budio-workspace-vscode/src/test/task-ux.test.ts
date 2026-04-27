import test from 'node:test';
import assert from 'node:assert/strict';
import {
  activeAgentLabel,
  checklistProgressTone,
  compareActiveAgentsFirst,
  compactChecklistProgressLabel,
  isTaskAgentActive,
} from '../tasks/task-ux';

test('checklist progress helpers return compact labels and capped five-band tones', () => {
  assert.equal(compactChecklistProgressLabel(0, 0), 'Geen checklist');
  assert.equal(compactChecklistProgressLabel(2, 5), '2/5');

  assert.equal(checklistProgressTone(0, 5), 'band-0');
  assert.equal(checklistProgressTone(2, 5), 'band-1');
  assert.equal(checklistProgressTone(3, 5), 'band-2');
  assert.equal(checklistProgressTone(4, 5), 'band-3');
  assert.equal(checklistProgressTone(5, 5), 'band-4');
});

test('agent activity helpers only mark active-like statuses as active labels', () => {
  assert.equal(isTaskAgentActive({ activeAgent: null, activeAgentStatus: null }), false);
  assert.equal(isTaskAgentActive({ activeAgent: 'Cline', activeAgentStatus: null }), false);
  assert.equal(isTaskAgentActive({ activeAgent: 'Cline', activeAgentStatus: 'active' }), true);
  assert.equal(isTaskAgentActive({ activeAgent: 'Cline', activeAgentStatus: 'done' }), false);
  assert.equal(activeAgentLabel({ activeAgent: 'Cline', activeAgentStatus: 'running' }), 'Cline');
  assert.equal(activeAgentLabel({ activeAgent: 'Cline', activeAgentStatus: 'done' }), null);
  assert.equal(activeAgentLabel({ activeAgent: 'Cline', activeAgentStatus: null }), null);
});

test('active agent comparison sorts active tasks before inactive tasks', () => {
  assert.equal(compareActiveAgentsFirst({ activeAgent: 'Cline', activeAgentStatus: 'running' }, { activeAgent: null, activeAgentStatus: null }), -1);
  assert.equal(compareActiveAgentsFirst({ activeAgent: null, activeAgentStatus: null }, { activeAgent: 'Cline', activeAgentStatus: 'running' }), 1);
  assert.equal(compareActiveAgentsFirst({ activeAgent: 'Cline', activeAgentStatus: 'running' }, { activeAgent: 'Codex', activeAgentStatus: 'active' }), 0);
});
