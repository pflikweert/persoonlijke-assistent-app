#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';

const VALID_STATUSES = new Set(['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done']);
const TASKFILE_PREFIX = 'docs/project/25-tasks/';
const OPEN_PREFIX = 'docs/project/25-tasks/open/';
const DONE_PREFIX = 'docs/project/25-tasks/done/';
const EPIC_PREFIX = 'docs/project/24-epics/';
const REQUIRED_BUNDLE_PATHS = ['docs/project/25-tasks/README.md', 'docs/project/open-points.md'];
const BUILD_TASK_KINDS = new Set(['task', 'subtask']);
const FULL_SPEC_SECTIONS = [
  'User outcome',
  'Functional slice',
  'Entry / exit',
  'Happy flow',
  'Non-happy flows',
  'UX / copy',
  'Data / IO',
  'Acceptance criteria',
  'Verify / bewijs',
];
const LIGHT_SPEC_SECTIONS = [
  'User outcome',
  'Functional slice',
  'Acceptance criteria',
  'Verify / bewijs',
];
const EPIC_SPEC_SECTIONS = [
  'Doel',
  'Gewenste uitkomst',
  'Scope en grenzen',
  'P1 / P2 scheiding',
  'UX / copy contract',
  'Flow contract',
  'Linked tasks',
  'Volgorde van uitvoeren',
  'Dependencies',
  'Acceptatie',
];

function run(command) {
  return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function safeRun(command) {
  try {
    return run(command);
  } catch {
    return '';
  }
}

function parseNameStatusOutput(output) {
  if (!output) {
    return [];
  }

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('\t');
      const code = parts[0] ?? '';
      const type = code[0] ?? '';
      const oldPath = parts[1] ?? '';
      const newPath = parts[2] ?? null;
      return { type, oldPath, newPath };
    });
}

function isIgnoredPath(filePath) {
  if (!filePath) {
    return true;
  }

  return (
    filePath.startsWith('docs/project/generated/') ||
    filePath.startsWith('docs/design/generated/') ||
    filePath.startsWith('docs/upload/') ||
    filePath === 'tools/budio-workspace-vscode/budio-workspace-vscode.vsix'
  );
}

function isTaskfilePath(filePath) {
  return /^docs\/project\/25-tasks\/(open|done)\/.*\.md$/.test(filePath);
}

function isEpicPath(filePath) {
  return (
    /^docs\/project\/24-epics\/.*\.md$/.test(filePath) &&
    !filePath.endsWith('/README.md') &&
    !filePath.endsWith('/_template.md')
  );
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }

  const lines = match[1].split('\n');
  const values = {};
  for (const line of lines) {
    const index = line.indexOf(':');
    if (index < 0) {
      continue;
    }
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    values[key] = value;
  }

  return values;
}

function parseHeadings(content) {
  return new Set(
    String(content ?? '')
      .split('\n')
      .map((line) => line.match(/^##\s+(.+?)\s*$/)?.[1]?.trim())
      .filter(Boolean),
  );
}

function frontmatterBoolean(value) {
  return String(value ?? '').trim().toLowerCase() === 'true';
}

function missingSections(content, requiredSections) {
  const headings = parseHeadings(content);
  return requiredSections.filter((section) => !headings.has(section));
}

function shouldCheckTaskSpec({ filePath, frontmatter, addedPaths }) {
  if (filePath.endsWith('/_template.md')) {
    return false;
  }

  const priority = frontmatter.priority;
  if (!['p1', 'p2'].includes(priority)) {
    return false;
  }

  return addedPaths.includes(filePath) || frontmatterBoolean(frontmatter.spec_ready);
}

function taskSpecRequiredSections(frontmatter) {
  const taskKind = frontmatter.task_kind || 'task';
  return BUILD_TASK_KINDS.has(taskKind) ? FULL_SPEC_SECTIONS : LIGHT_SPEC_SECTIONS;
}

export function evaluateTaskflow(input) {
  const issues = [];
  const relevantPaths = input.changedPaths.filter((filePath) => !isIgnoredPath(filePath));
  const taskfilePaths = relevantPaths.filter((filePath) => isTaskfilePath(filePath));
  const epicPaths = relevantPaths.filter((filePath) => isEpicPath(filePath));
  const addedPaths = input.addedPaths ?? [];

  if (relevantPaths.length === 0) {
    return { ok: true, issues: [], relevantPaths: [], taskfilePaths: [] };
  }

  if (taskfilePaths.length === 0) {
    issues.push(
      'Geen taskfile-mutatie gevonden. Maak of update eerst een taskfile in docs/project/25-tasks/open/ of done/.',
    );
  }

  for (const taskfilePath of taskfilePaths) {
    const taskfileContent = input.taskfileContents[taskfilePath];
    if (!taskfileContent) {
      continue;
    }

    const frontmatter = parseFrontmatter(taskfileContent);
    if (!frontmatter) {
      issues.push(`Taskfile mist geldige frontmatter: ${taskfilePath}`);
      continue;
    }

    const status = frontmatter.status;
    const updatedAt = frontmatter.updated_at;

    if (!VALID_STATUSES.has(status)) {
      issues.push(
        `Taskfile heeft ongeldige status (${String(status)}): ${taskfilePath}. Gebruik: backlog|ready|in_progress|review|blocked|done.`,
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedAt ?? '')) {
      issues.push(`Taskfile mist geldige updated_at (YYYY-MM-DD): ${taskfilePath}`);
    }

    if (taskfilePath.startsWith(DONE_PREFIX) && status !== 'done') {
      issues.push(`Taskfile in done/ moet status done hebben: ${taskfilePath}`);
    }

    if (taskfilePath.startsWith(OPEN_PREFIX) && status === 'done') {
      issues.push(`Taskfile met status done mag niet in open/ staan: ${taskfilePath}`);
    }

    if (shouldCheckTaskSpec({ filePath: taskfilePath, frontmatter, addedPaths })) {
      const missing = missingSections(taskfileContent, taskSpecRequiredSections(frontmatter));
      for (const section of missing) {
        issues.push(`Task mist verplichte spec-readiness sectie: ## ${section} (${taskfilePath})`);
      }
    }
  }

  for (const epicPath of epicPaths) {
    const epicContent = input.epicContents?.[epicPath];
    if (!epicContent) {
      continue;
    }

    const frontmatter = parseFrontmatter(epicContent);
    if (!frontmatter) {
      issues.push(`Epic mist geldige frontmatter: ${epicPath}`);
      continue;
    }

    if (addedPaths.includes(epicPath) || frontmatterBoolean(frontmatter.spec_ready)) {
      const missing = missingSections(epicContent, EPIC_SPEC_SECTIONS);
      for (const section of missing) {
        issues.push(`Epic mist verplichte spec-readiness sectie: ## ${section} (${epicPath})`);
      }
    }
  }

  if (input.hasDoneTransition) {
    for (const requiredPath of REQUIRED_BUNDLE_PATHS) {
      if (!input.changedPaths.includes(requiredPath)) {
        issues.push(
          `Done-transitie gedetecteerd maar bundelspoor ontbreekt: ${requiredPath}. Draai npm run docs:bundle en npm run docs:bundle:verify.`,
        );
      }
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    relevantPaths,
    taskfilePaths,
  };
}

function collectRepoState() {
  const staged = parseNameStatusOutput(safeRun('git diff --cached --name-status -M'));
  const unstaged = parseNameStatusOutput(safeRun('git diff --name-status -M'));
  const untracked = safeRun('git ls-files --others --exclude-standard')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((filePath) => ({ type: 'A', oldPath: filePath, newPath: null }));

  const allEntries = [...staged, ...unstaged, ...untracked];
  const changedPathsSet = new Set();
  let hasDoneTransition = false;
  const addedPathsSet = new Set();

  for (const entry of allEntries) {
    if (entry.oldPath) {
      changedPathsSet.add(entry.oldPath);
    }
    if (entry.newPath) {
      changedPathsSet.add(entry.newPath);
    }

    if (entry.type === 'A' && entry.oldPath) {
      addedPathsSet.add(entry.oldPath);
    }

    if (
      entry.type === 'R' &&
      entry.oldPath.startsWith(OPEN_PREFIX) &&
      (entry.newPath ?? '').startsWith(DONE_PREFIX)
    ) {
      hasDoneTransition = true;
    }
  }

  return {
    changedPaths: [...changedPathsSet],
    addedPaths: [...addedPathsSet],
    hasDoneTransition,
  };
}

async function readFileContents(filePaths) {
  const contents = {};
  for (const taskfilePath of filePaths) {
    try {
      contents[taskfilePath] = await fs.readFile(taskfilePath, 'utf8');
    } catch {
      // deleted/moved path is fine for this check.
    }
  }
  return contents;
}

async function main() {
  const repoState = collectRepoState();
  const possibleTaskfiles = repoState.changedPaths.filter((filePath) => isTaskfilePath(filePath));
  const possibleEpics = repoState.changedPaths.filter((filePath) => isEpicPath(filePath));
  const taskfileContents = await readFileContents(possibleTaskfiles);
  const epicContents = await readFileContents(possibleEpics);

  const result = evaluateTaskflow({
    changedPaths: repoState.changedPaths,
    addedPaths: repoState.addedPaths,
    taskfileContents,
    epicContents,
    hasDoneTransition: repoState.hasDoneTransition,
  });

  if (!result.ok) {
    console.error('❌ Taskflow verify gefaald.');
    for (const issue of result.issues) {
      console.error(`- ${issue}`);
    }
    console.error('Herstel: maak/update taskfile, zet juiste status/updated_at, en voer docs-bundle verify uit bij done-transitie.');
    process.exit(1);
  }

  if (result.relevantPaths.length === 0) {
    console.log('✅ Taskflow verify: geen relevante wijzigingen gedetecteerd.');
    return;
  }

  console.log(`✅ Taskflow verify geslaagd (${result.taskfilePaths.length} taskfile-mutatie(s), ${result.relevantPaths.length} relevante wijziging(en)).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
