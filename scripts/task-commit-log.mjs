import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

async function main() {
  const [{ execFileSync }, { parseTaskFile }, { appendSectionListEntry }] = await Promise.all([
    import('node:child_process'),
    import(pathToFile('tools/budio-workspace-vscode/src/tasks/parser.ts')),
    import(pathToFile('tools/budio-workspace-vscode/src/tasks/writer.ts')),
  ]);

  const hash = execGit(execFileSync, ['rev-parse', '--short', 'HEAD']);
  const subject = execGit(execFileSync, ['show', '-s', '--format=%s', 'HEAD']);
  const changedFiles = execGit(execFileSync, ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'])
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const taskfilePaths = changedFiles.filter((filePath) => /^docs\/project\/25-tasks\/(open|done)\/.*\.md$/.test(filePath));
  if (taskfilePaths.length === 0) {
    return;
  }

  const entry = `- ${hash} — ${subject}`;

  for (const relativeTaskfilePath of taskfilePaths) {
    const absoluteTaskfilePath = path.resolve(repoRoot, relativeTaskfilePath);
    const content = await fs.readFile(absoluteTaskfilePath, 'utf8');
    const stat = await fs.stat(absoluteTaskfilePath);
    const parsed = parseTaskFile({
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

    const nextContent = appendSectionListEntry(parsed, 'Commits', entry);
    await fs.writeFile(absoluteTaskfilePath, nextContent, 'utf8');
  }
}

function execGit(execFileSync, args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function pathToFile(relativePath) {
  return new URL(relativePath, `${new URL(`file://${repoRoot}/`)}`).href;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});