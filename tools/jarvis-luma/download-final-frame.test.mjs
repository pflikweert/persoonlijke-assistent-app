import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeApiKeyFamily,
  parseArgs,
  resolveApiMode,
} from './download-final-frame.mjs';

test('normalizeApiKeyFamily validates supported key families', () => {
  assert.deepEqual(normalizeApiKeyFamily('luma-api-123').family, 'agents');
  assert.deepEqual(normalizeApiKeyFamily('luma-123').family, 'dream-machine');
  assert.equal(normalizeApiKeyFamily('Bearer luma-api-123').valid, false);
  assert.equal(normalizeApiKeyFamily('').family, 'missing');
});

test('resolveApiMode prefers explicit mode and otherwise infers from key', () => {
  assert.equal(resolveApiMode('agents', 'luma-123'), 'agents');
  assert.equal(resolveApiMode('auto', 'luma-api-123'), 'agents');
  assert.equal(resolveApiMode('auto', 'luma-123'), 'dream-machine');
  assert.equal(resolveApiMode('auto', ''), 'agents');
});

test('parseArgs reads common CLI flags', () => {
  const options = parseArgs([
    '--dry-run',
    '--api',
    'dream-machine',
    '--only',
    'jarvis-core',
    '--refresh',
  ]);

  assert.equal(options.dryRun, true);
  assert.equal(options.api, 'dream-machine');
  assert.equal(options.only, 'jarvis-core');
  assert.equal(options.refresh, true);
});
