import fs from 'node:fs/promises';

function normalizePayload(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const pid = Number(parsed.pid);
    const mode = typeof parsed.mode === 'string' ? parsed.mode : 'unknown';
    const startedAt = typeof parsed.startedAt === 'string' ? parsed.startedAt : 'unknown';

    if (!Number.isInteger(pid) || pid <= 0) {
      return null;
    }

    return { pid, mode, startedAt };
  } catch {
    return null;
  }
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EPERM') {
      return true;
    }
    return false;
  }
}

async function readLockPayload(lockPath) {
  try {
    return await fs.readFile(lockPath, 'utf8');
  } catch {
    return null;
  }
}

function createBusyError(lockPath, payload) {
  const owner = payload
    ? `pid ${payload.pid} (${payload.mode}, gestart ${payload.startedAt})`
    : 'onbekende owner';
  return new Error(
    `docs bundle lock actief op ${lockPath}. Een andere docs:bundle/docs:bundle:verify run gebruikt deze flow al (${owner}). Draai deze commando's sequentieel.`,
  );
}

export async function withDocsBundleLock(lockPath, mode, action) {
  const payload = JSON.stringify({
    pid: process.pid,
    mode,
    startedAt: new Date().toISOString(),
  });

  while (true) {
    try {
      const handle = await fs.open(lockPath, 'wx');
      try {
        await handle.writeFile(payload, 'utf8');
      } finally {
        await handle.close();
      }

      try {
        return await action();
      } finally {
        await fs.rm(lockPath, { force: true });
      }
    } catch (error) {
      if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 'EEXIST') {
        throw error;
      }

      const raw = await readLockPayload(lockPath);
      const existing = raw ? normalizePayload(raw) : null;
      if (existing && isProcessRunning(existing.pid)) {
        throw createBusyError(lockPath, existing);
      }

      await fs.rm(lockPath, { force: true });
    }
  }
}
