import test from 'node:test';
import assert from 'node:assert/strict';
import {
  activeAgentLabel,
  activeAgentUiState,
  checklistProgressTone,
  compareActiveAgentsFirst,
  compactChecklistProgressLabel,
  formatActiveAgentSince,
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

test('agent activity UI state returns compact live labels only for active metadata', () => {
  assert.deepEqual(
    activeAgentUiState({
      activeAgent: null,
      activeAgentStatus: null,
      activeAgentModel: null,
      activeAgentRuntime: null,
      activeAgentSince: null,
    }),
    {
      isActive: false,
      label: null,
      chipLabel: null,
      runtimeLabel: null,
      sinceLabel: null,
      statusTone: 'inactive',
    },
  );

  const active = activeAgentUiState({
    activeAgent: 'Codex',
    activeAgentStatus: 'running',
    activeAgentModel: 'gpt-5',
    activeAgentRuntime: 'codex',
    activeAgentSince: '2026-06-22T14:53:03Z',
  });

  assert.equal(active.isActive, true);
  assert.equal(active.label, 'Codex');
  assert.equal(active.chipLabel, 'Codex actief');
  assert.equal(active.runtimeLabel, 'codex · gpt-5');
  assert.match(active.sinceLabel ?? '', /^sinds \d{2}:\d{2}$/);
  assert.equal(active.statusTone, 'active');
});

test('active agent since formatter preserves malformed values', () => {
  assert.equal(formatActiveAgentSince(null), null);
  assert.equal(formatActiveAgentSince('not-a-date'), 'not-a-date');
  assert.match(formatActiveAgentSince('2026-06-22T14:53:03Z') ?? '', /^sinds \d{2}:\d{2}$/);
});

test('active agent comparison sorts active tasks before inactive tasks', () => {
  assert.equal(compareActiveAgentsFirst({ activeAgent: 'Cline', activeAgentStatus: 'running' }, { activeAgent: null, activeAgentStatus: null }), -1);
  assert.equal(compareActiveAgentsFirst({ activeAgent: null, activeAgentStatus: null }, { activeAgent: 'Cline', activeAgentStatus: 'running' }), 1);
  assert.equal(compareActiveAgentsFirst({ activeAgent: 'Cline', activeAgentStatus: 'running' }, { activeAgent: 'Codex', activeAgentStatus: 'active' }), 0);
});
