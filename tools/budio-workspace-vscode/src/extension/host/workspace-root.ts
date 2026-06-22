import fs from 'node:fs';
import path from 'node:path';

export function resolveBudioWorkspaceRoot(workspaceRoots: string[]): string | null {
  const candidates = uniquePaths(
    workspaceRoots.flatMap((root) => [path.resolve(root), ...discoverChildRepoCandidates(root)]),
  );
  const scored = candidates
    .map((candidate, index) => ({
      path: candidate,
      index,
      score: scoreBudioWorkspaceRoot(candidate),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score;
      }
      return left.index - right.index;
    });

  return scored[0]?.path ?? null;
}

function discoverChildRepoCandidates(root: string): string[] {
  const resolvedRoot = path.resolve(root);
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(resolvedRoot, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((entry) => entry.isDirectory() && !shouldSkipDirectory(entry.name))
    .map((entry) => path.join(resolvedRoot, entry.name));
}

function shouldSkipDirectory(name: string) {
  return name === 'node_modules' || name === '.git' || name === 'dist' || name === 'build';
}

function scoreBudioWorkspaceRoot(candidate: string) {
  let score = 0;
  if (exists(candidate, 'docs/project/25-tasks')) {
    score += 100;
  }
  if (exists(candidate, 'tools/budio-workspace-vscode')) {
    score += 80;
  }
  if (exists(candidate, 'assets/jarvis')) {
    score += 40;
  }
  if (exists(candidate, '.env.local')) {
    score += 30;
  }
  if (path.basename(candidate) === 'persoonlijke-assistent-app') {
    score += 10;
  }
  return score >= 100 ? score : 0;
}

function exists(root: string, relativePath: string) {
  return fs.existsSync(path.join(root, relativePath));
}

function uniquePaths(paths: string[]) {
  return [...new Set(paths.map((candidate) => path.resolve(candidate)))];
}
