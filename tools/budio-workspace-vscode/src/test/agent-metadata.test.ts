import test from 'node:test';
import assert from 'node:assert/strict';
import { buildClaimTaskAgentPatch, buildClearTaskAgentPatch } from '../tasks/agent-metadata';

test('buildClaimTaskAgentPatch writes all active-agent fields from settings', () => {
  const patch = buildClaimTaskAgentPatch(
    {
      agentName: 'Codex',
      agentModel: 'gpt-5',
      agentRuntime: 'codex-cli',
      agentSettings: 'workspace',
    },
    new Date('2026-06-22T09:30:00.000Z'),
  );

  assert.deepEqual(patch, {
    activeAgent: 'Codex',
    activeAgentModel: 'gpt-5',
    activeAgentRuntime: 'codex-cli',
    activeAgentSince: '2026-06-22T09:30:00.000Z',
    activeAgentStatus: 'running',
    activeAgentSettings: 'workspace',
    updatedAt: '2026-06-22',
    agentActivityEntry: '- start 2026-06-22T09:30:00.000Z - Codex / gpt-5 / codex-cli / workspace',
  });
});

test('buildClaimTaskAgentPatch falls back for empty settings', () => {
  const patch = buildClaimTaskAgentPatch(
    {
      agentName: ' ',
      agentModel: '',
      agentRuntime: '   ',
      agentSettings: '',
    },
    new Date('2026-06-22T09:30:00.000Z'),
  );

  assert.equal(patch.activeAgent, 'Codex');
  assert.equal(patch.activeAgentModel, 'gpt-5');
  assert.equal(patch.activeAgentRuntime, 'codex');
  assert.equal(patch.activeAgentSettings, 'default');
});

test('buildClearTaskAgentPatch clears active-agent fields', () => {
  const patch = buildClearTaskAgentPatch(new Date('2026-06-22T09:30:00.000Z'));

  assert.deepEqual(patch, {
    activeAgent: null,
    activeAgentModel: null,
    activeAgentRuntime: null,
    activeAgentSince: null,
    activeAgentStatus: null,
    activeAgentSettings: null,
    updatedAt: '2026-06-22',
    agentActivityEntry: null,
  });
});

test('buildClearTaskAgentPatch writes stop activity when snapshot is provided', () => {
  const patch = buildClearTaskAgentPatch(
    new Date('2026-06-22T09:30:00.000Z'),
    {
      activeAgent: 'Codex',
      activeAgentModel: 'gpt-5',
      activeAgentRuntime: 'codex',
      activeAgentSince: '2026-06-22T09:00:00.000Z',
      activeAgentSettings: 'default',
    },
    'done',
  );

  assert.equal(
    patch.agentActivityEntry,
    '- stop 2026-06-22T09:00:00.000Z -> 2026-06-22T09:30:00.000Z - Codex / gpt-5 / codex / default - reason: done',
  );
});
