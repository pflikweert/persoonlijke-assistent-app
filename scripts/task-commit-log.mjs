import fs from 'node:fs/promises';
import path from 'node:path';
import fsSync from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const TASK_COMMIT_LOG_GUARD_ENV = 'BUDIO_TASK_COMMIT_LOG_AMENDING';
const TASKFILE_PATTERN = /^docs\/project\/25-tasks\/(open|done)\/.*\.md$/;
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function runTaskCommitLog({
  repoRootPath = repoRoot,
  env = process.env,
  fsModule = fs,
  execGit,
  parseTaskFile,
  appendSectionListEntry,
} = {}) {
  if (env[TASK_COMMIT_LOG_GUARD_ENV] === '1') {
    return { status: 'guarded', taskfilePaths: [], modifiedTaskfilePaths: [], entry: null };
  }

  const git = execGit ?? (await createExecGit(repoRootPath));
  const parser = parseTaskFile ?? (await loadParser(repoRootPath));
  const writer = appendSectionListEntry ?? (await loadWriter(repoRootPath));

  const taskfilePaths = collectTaskfilePaths(
    git(['diff-tree', '--no-commit-id', '--name-status', '--diff-filter=ACMR', '-r', 'HEAD']),
  );

  if (taskfilePaths.length === 0) {
    return { status: 'noop', reason: 'no-taskfiles', taskfilePaths: [], modifiedTaskfilePaths: [], entry: null };
  }

  const entry = buildCommitLogEntry({
    authorDate: git(['show', '-s', '--format=%aI', 'HEAD']),
    subject: git(['show', '-s', '--format=%s', 'HEAD']),
  });

  const modifiedTaskfilePaths = [];

  for (const relativeTaskfilePath of taskfilePaths) {
    const absoluteTaskfilePath = path.resolve(repoRootPath, relativeTaskfilePath);
    const content = await fsModule.readFile(absoluteTaskfilePath, 'utf8');
    const stat = await fsModule.stat(absoluteTaskfilePath);
    const parsed = parser({
      absolutePath: absoluteTaskfilePath,
      relativePath: relativeTaskfilePath,
      content,
      version: {
        mtimeMs: stat.mtimeMs,
        hash: `${stat.size}:${Math.round(stat.mtimeMs)}`,
      },
    });

    const commitsSection = parsed.sections.get('commits');
    if (commitsSection?.lines.some((line) => line.trim() === entry)) {
      continue;
    }

    const nextContent = writer(parsed, 'Commits', entry);
    if (nextContent === content) {
      continue;
    }

    await fsModule.writeFile(absoluteTaskfilePath, nextContent, 'utf8');
    modifiedTaskfilePaths.push(relativeTaskfilePath);
  }

  if (modifiedTaskfilePaths.length === 0) {
    return { status: 'noop', reason: 'entries-exist', taskfilePaths, modifiedTaskfilePaths, entry };
  }

  git(['add', '--', ...modifiedTaskfilePaths]);
  git(['commit', '--amend', '--no-edit'], {
    env: {
      ...env,
      [TASK_COMMIT_LOG_GUARD_ENV]: '1',
    },
  });

  return { status: 'amended', taskfilePaths, modifiedTaskfilePaths, entry };
}

export function buildCommitLogEntry({ authorDate, subject }) {
  return `- ${authorDate.trim()} — ${subject.trim()}`;
}

export function collectTaskfilePaths(changedFilesOutput) {
  const paths = [];

  for (const line of String(changedFilesOutput).split('\n')) {
    const columns = line.trim().split('\t').filter(Boolean);
    if (columns.length === 0) {
      continue;
    }

    const status = columns[0];
    if (status.startsWith('D')) {
      continue;
    }

    const filePath = status.startsWith('R') || status.startsWith('C') ? columns[2] : columns[1] ?? columns[0];
    if (filePath && TASKFILE_PATTERN.test(filePath) && !paths.includes(filePath)) {
      paths.push(filePath);
    }
  }

  return paths;
}

async function createExecGit(repoRootPath) {
  const { execFileSync } = await import('node:child_process');
  return (args, options = {}) =>
    execFileSync('git', args, {
      cwd: repoRootPath,
      encoding: 'utf8',
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
}

async function loadParser(repoRootPath) {
  const { parseTaskFile } = await import(pathToFile('tools/budio-workspace-vscode/src/tasks/parser.ts', repoRootPath));
  return parseTaskFile;
}

async function loadWriter(repoRootPath) {
  const { appendSectionListEntry } = await import(pathToFile('tools/budio-workspace-vscode/src/tasks/writer.ts', repoRootPath));
  return appendSectionListEntry;
}

function pathToFile(relativePath, repoRootPath) {
  return pathToFileURL(path.resolve(repoRootPath, relativePath)).href;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return fsSync.realpathSync(path.resolve(entry)) === fsSync.realpathSync(fileURLToPath(import.meta.url));
}

if (isDirectRun()) {
  runTaskCommitLog().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
