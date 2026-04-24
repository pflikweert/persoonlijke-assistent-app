import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { withDocsBundleLock } from './doc-bundle-lock.mjs';

async function makeTempLockPath() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-bundle-lock-'));
  return path.join(directory, 'bundle.lock');
}

test('blocks concurrent docs bundle runs with a clear error', async () => {
  const lockPath = await makeTempLockPath();
  let release;
  const blocker = new Promise((resolve) => {
    release = resolve;
  });

  const firstRun = withDocsBundleLock(lockPath, 'bundle', async () => {
    await blocker;
  });

  await new Promise((resolve) => setTimeout(resolve, 25));

  await assert.rejects(
    () => withDocsBundleLock(lockPath, 'verify', async () => {}),
    /docs bundle lock actief/,
  );

  release();
  await firstRun;
});

test('removes stale lock file and continues', async () => {
  const lockPath = await makeTempLockPath();
  const stalePid = 999999;
  await fs.writeFile(
    lockPath,
    JSON.stringify({
      pid: stalePid,
      mode: 'bundle',
      startedAt: '2026-04-23T00:00:00.000Z',
    }),
    'utf8',
  );

  let executed = false;
  await withDocsBundleLock(lockPath, 'verify', async () => {
    executed = true;
  });

  assert.equal(executed, true);
  await assert.rejects(() => fs.access(lockPath));
});
