#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { withDocsBundleLock } from './doc-bundle-lock.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const gitDir = execSync('git rev-parse --git-dir', { cwd: repoRoot, encoding: 'utf8' }).trim();
const docsBundleLockPath = path.resolve(repoRoot, gitDir, 'docs-bundle.lock');

const outputPaths = {
  canonicalOpenPoints: 'docs/project/open-points.md',
  canonicalTaskHub: 'docs/project/25-tasks/README.md',
  uploadManifestV2: 'docs/upload/00-budio-upload-manifest.md',
  uploadCoreProductPlanning: 'docs/upload/10-budio-core-product-and-planning.md',
  uploadStrategyResearchIdeas: 'docs/upload/20-budio-strategy-research-and-ideas.md',
  uploadBuildAiGovernanceOps: 'docs/upload/30-budio-build-ai-governance-and-operations.md',
  uploadDesignHandoffTruth: 'docs/upload/40-budio-design-handoff-and-truth.md',
  uploadRoadmapPlanningPack: 'docs/upload/50-budio-roadmap-planning-pack.md',
  uploadTasksCurrent: 'docs/upload/60-budio-tasks-current.md',
  uploadTasksArchive: 'docs/upload/70-budio-tasks-archive.md',
  uploadAgentWorkflowDocsTooling: 'docs/upload/80-budio-agent-workflow-and-docs-tooling.md',
  generatedProductTruth: 'docs/project/generated/10-budio-product-truth.md',
  generatedStrategyResearch: 'docs/project/generated/20-budio-strategy-and-research.md',
  generatedIdeasOpportunity: 'docs/project/generated/25-budio-ideas-and-opportunity-map.md',
  generatedBuildTruth: 'docs/project/generated/30-budio-build-truth.md',
  generatedUiDesignTruth: 'docs/project/generated/40-budio-ui-system-and-design-truth.md',
  generatedAiGovernanceOps: 'docs/project/generated/50-budio-ai-governance-and-operations.md',
  chatgptProjectContext: 'docs/project/generated/chatgpt-project-context.md',
  budioResearch: 'docs/project/generated/budio-research.md',
  stitchDesignContext: 'docs/design/generated/stitch-design-context.md',
  uploadChatgptProjectContext: 'docs/upload/chatgpt-project-context.md',
};

const budioAiOperatingSystemSourcePath =
  'docs/Budio AI Operating System/Budio AI Operating System.md';

const roadmapPlanningPackSources = [
  {
    path: 'docs/project/20-planning/70-post-basis-6-month-roadmap.md',
    title: 'Post-Basis 6-Maandenroadmap',
  },
  {
    path: 'docs/dev/roadmap-planning-workflow.md',
    title: 'Roadmap Planning Workflow',
  },
  {
    path: 'docs/project/20-planning/_templates/month-block-roadmap-template.md',
    title: 'Maandblok Roadmap Template',
  },
  {
    path: 'docs/project/20-planning/_templates/epic-roadmap-item-template.md',
    title: 'Epic Roadmap Item Template',
  },
  {
    path: 'docs/project/20-planning/10-roadmap-phases.md',
    title: 'Roadmap Fases',
  },
  {
    path: 'docs/project/20-planning/30-now-next-later.md',
    title: 'Now Next Later',
  },
];

const agentWorkflowDocsToolingSources = [
  { path: 'docs/README.md', title: 'Docs Hub' },
  { path: 'docs/project/00-docs-governance/README.md', title: 'Docs Governance' },
  { path: 'docs/setup/developer-docs-environment.md', title: 'Developer Docs Environment' },
  { path: 'docs/setup/step-0-readiness.md', title: 'Step 0 Readiness' },
  { path: 'docs/dev/README.md', title: 'Dev Docs Hub' },
  { path: 'docs/dev/cline-workflow.md', title: 'Cline Workflow' },
  { path: 'docs/dev/ai-execution-os-generic.md', title: 'AI Execution OS Generic' },
  { path: 'docs/dev/task-lifecycle-workflow.md', title: 'Task Lifecycle Workflow' },
  { path: 'docs/dev/roadmap-planning-workflow.md', title: 'Roadmap Planning Workflow' },
  { path: 'AGENTS.md', title: 'AGENTS Rules' },
  { path: '.agents/skills/task-status-sync-workflow/SKILL.md', title: 'Task Status Sync Skill' },
  { path: '.agents/skills/scope-guard/SKILL.md', title: 'Scope Guard Skill' },
];

const projectCoreSources = [
  { path: 'docs/project/README.md', title: 'Docs-Hiërarchie Samenvatting' },
  { path: 'docs/project/00-docs-governance/README.md', title: 'Docs Governance' },
  { path: 'docs/project/master-project.md', title: 'Hoofd Projectdocument' },
  { path: 'docs/project/product-vision-mvp.md', title: 'Productvisie Aanscherping' },
  { path: 'docs/project/current-status.md', title: 'Actuele Gebouwde Status' },
  { path: 'docs/project/open-points.md', title: 'Open Punten / Resterend Werk' },
  { path: 'docs/project/content-processing-rules.md', title: 'Content / Narrative Processing Regels' },
  { path: 'docs/project/copy-instructions.md', title: 'Copy Instructions' },
  { path: 'docs/project/ai-quality-studio.md', title: 'AI Quality Studio Governance' },
  { path: 'docs/dev/cline-workflow.md', title: 'Cline Workflow Afspraken' },
];

let projectSources = [...projectCoreSources];
let researchSources = [];
let strategySources = [];
let planningSources = [];
let epicSources = [];
let ideaSources = [];
let taskSources = [];

const taskStatusOrder = ['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done'];
const taskPriorityOrder = ['p1', 'p2', 'p3'];
const taskRequiredFields = ['id', 'title', 'status', 'phase', 'priority', 'source', 'updated_at'];
const taskOverviewMarkers = {
  start: '<!-- TASK_OVERVIEW:START -->',
  end: '<!-- TASK_OVERVIEW:END -->',
};
const taskIndexMarkers = {
  start: '<!-- TASK_INDEX:START -->',
  end: '<!-- TASK_INDEX:END -->',
};

const buildTruth = {
  // NOTE: this build-truth index is intentionally hand-curated for high-signal upload context.
  // Keep this list focused; add/remove entries deliberately when architecture changes.
  routes: [
    'app/_layout.tsx',
    'app/sign-in.tsx',
    'app/(tabs)/index.tsx',
    'app/(tabs)/days.tsx',
    'app/(tabs)/reflections.tsx',
    'app/capture/index.tsx',
    'app/capture/record.tsx',
    'app/capture/type.tsx',
    'app/day/[date].tsx',
    'app/entry/[id].tsx',
    'app/settings.tsx',
    'app/settings-export.tsx',
    'app/settings-import.tsx',
    'app/settings-audio.tsx',
    'app/settings-regeneration.tsx',
    'app/settings-ai-quality-studio.tsx',
    'app/settings-ai-quality-studio/[taskKey].tsx',
  ],
  components: [
    'components/ui/screen-primitives.tsx',
    'components/ui/settings-screen-primitives.tsx',
    'components/ui/auth-screen-primitives.tsx',
    'components/ui/capture-screen-primitives.tsx',
    'components/ui/detail-screen-primitives.tsx',
    'components/ui/home-screen-primitives.tsx',
    'components/ui/modal-backdrop.tsx',
    'components/navigation/BottomTabBar.tsx',
    'components/navigation/fullscreen-menu-overlay.tsx',
    'components/feedback/background-task-notice.tsx',
    'components/feedback/background-task-status-card.tsx',
    'components/journal/archive-grouped-list.tsx',
  ],
  services: [
    'services/auth.ts',
    'services/entries.ts',
    'services/day-journals.ts',
    'services/reflections.ts',
    'services/export.ts',
    'services/import/chatgpt-markdown.ts',
    'services/user-preferences.ts',
    'services/admin-regeneration.ts',
    'services/ai-quality-studio.ts',
    'services/reset.ts',
  ],
  functions: [
    'supabase/functions/process-entry/index.ts',
    'supabase/functions/renormalize-entry/index.ts',
    'supabase/functions/regenerate-day-journal/index.ts',
    'supabase/functions/generate-reflection/index.ts',
    'supabase/functions/import-chatgpt-markdown/index.ts',
    'supabase/functions/admin-regeneration-job/index.ts',
    'supabase/functions/admin-ai-quality-studio/index.ts',
  ],
  contracts: [
    'server-contracts/index.ts',
    'server-contracts/ai/index.ts',
    'supabase/migrations/20260416125000_user_background_tasks.sql',
    'supabase/migrations/20260418101500_entry_audio_storage_and_user_preferences.sql',
  ],
};

const designSources = [
  'docs/design/mvp-design-spec-1.2.1.md',
  'design_refs/1.2.1/ethos_ivory/DESIGN.md',
  'theme/tokens.ts',
  'AGENTS.md',
  '.agents/skills/ui-implementation-guardrails/SKILL.md',
  '.agents/skills/stitch-redesign-execution/SKILL.md',
];

const uploadSet = [
  {
    path: outputPaths.uploadManifestV2,
    type: 'generated manifest',
    flow: 'Local reference, use-case routing and completeness check',
  },
  {
    path: outputPaths.uploadChatgptProjectContext,
    type: 'primary bootstrap bundle',
    flow: 'ChatGPT Projects bootstrap/startcontext (upload-only)',
  },
  {
    path: outputPaths.uploadCoreProductPlanning,
    type: 'generated domain bundle',
    flow: 'Core product truth and active planning',
  },
  {
    path: outputPaths.uploadStrategyResearchIdeas,
    type: 'generated domain bundle',
    flow: 'Strategy, research and idea context',
  },
  {
    path: outputPaths.uploadBuildAiGovernanceOps,
    type: 'generated domain bundle',
    flow: 'Build truth, AI governance and operations',
  },
  {
    path: outputPaths.uploadDesignHandoffTruth,
    type: 'generated domain bundle',
    flow: 'Design handoff and design truth',
  },
  {
    path: outputPaths.uploadRoadmapPlanningPack,
    type: 'generated roadmap planning bundle',
    flow: 'Roadmap, month-block planning and review templates',
  },
  {
    path: outputPaths.uploadTasksCurrent,
    type: 'generated current task bundle',
    flow: 'Current open task context',
  },
  {
    path: outputPaths.uploadTasksArchive,
    type: 'generated task archive bundle',
    flow: 'Done task archive context',
  },
  {
    path: outputPaths.uploadAgentWorkflowDocsTooling,
    type: 'generated workflow and tooling bundle',
    flow: 'Agent workflow, docs tooling and developer environment',
  },
];

function normalizeLf(input) {
  return String(input ?? '').replace(/\r\n?/g, '\n');
}

function getHeadCommitHash() {
  return execSync('git rev-parse --short HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function absolute(relativePath) {
  return path.join(repoRoot, relativePath);
}

async function readText(relativePath) {
  return normalizeLf(await fs.readFile(absolute(relativePath), 'utf8')).trim();
}

async function pathExists(relativePath) {
  try {
    await fs.access(absolute(relativePath));
    return true;
  } catch {
    return false;
  }
}

function extractBuildTimestamp(existingContent) {
  const match = existingContent.match(/^Build Timestamp \(UTC\):\s*(.+)$/m);
  return match?.[1]?.trim() || null;
}

function extractSourceCommit(existingContent) {
  const match = existingContent.match(/^Source Commit:\s*(.+)$/m);
  return match?.[1]?.trim() || null;
}

async function resolveBuildMetadata(isCheckMode) {
  let buildTimestamp = new Date().toISOString();
  let commitHash = getHeadCommitHash();

  if (!isCheckMode) {
    return { buildTimestamp, commitHash };
  }

  try {
    const existing = normalizeLf(
      await fs.readFile(absolute(outputPaths.chatgptProjectContext), 'utf8'),
    );
    buildTimestamp = extractBuildTimestamp(existing) || buildTimestamp;
    commitHash = extractSourceCommit(existing) || commitHash;
  } catch {
    // Keep current metadata; the missing output check will fail below.
  }

  return { buildTimestamp, commitHash };
}

async function listDesignMarkdownRefs() {
  const root = absolute('design_refs/1.2.1');
  const discovered = [];

  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) {
        continue;
      }

      const relativePath = path.relative(repoRoot, fullPath);
      if (relativePath === 'design_refs/1.2.1/ethos_ivory/DESIGN.md') {
        continue;
      }

      discovered.push(relativePath);
    }
  }

  await walk(root);
  return discovered;
}

function toTitleCase(input) {
  return input
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function sourceTitleFromPath(relativePath) {
  const baseName = path.basename(relativePath, '.md');
  const cleaned = baseName
    .replace(/^\d+[-_]?/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  return toTitleCase(cleaned || baseName);
}

async function listMarkdownFiles(relativeRoot, options = {}) {
  const {
    recursive = false,
    excludeDirs = ['archive', 'generated', '.obsidian'],
  } = options;

  const rootAbsolute = absolute(relativeRoot);
  const results = [];

  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      const relativePath = path.relative(repoRoot, fullPath);

      if (entry.isDirectory()) {
        if (excludeDirs.includes(entry.name)) {
          continue;
        }
        if (recursive) {
          await walk(fullPath);
        }
        continue;
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        results.push(relativePath);
      }
    }
  }

  await walk(rootAbsolute);
  return results;
}

function prioritizeReadme(paths) {
  return [...paths].sort((a, b) => {
    const aIsReadme = path.basename(a).toLowerCase() === 'readme.md';
    const bIsReadme = path.basename(b).toLowerCase() === 'readme.md';
    if (aIsReadme && !bIsReadme) return -1;
    if (!aIsReadme && bIsReadme) return 1;
    return a.localeCompare(b);
  });
}

async function discoverProjectLayerSources() {
  const [strategyFiles, planningFiles, researchFiles, epicFiles, ideaFiles] = await Promise.all([
    listMarkdownFiles('docs/project/10-strategy'),
    listMarkdownFiles('docs/project/20-planning'),
    listMarkdownFiles('docs/project/30-research'),
    listMarkdownFiles('docs/project/24-epics'),
    listMarkdownFiles('docs/project/40-ideas', { recursive: true }),
  ]);

  return {
    strategy: prioritizeReadme(strategyFiles).map((sourcePath) => ({
      path: sourcePath,
      title: sourceTitleFromPath(sourcePath),
    })),
    planning: prioritizeReadme(planningFiles).map((sourcePath) => ({
      path: sourcePath,
      title: sourceTitleFromPath(sourcePath),
    })),
    research: prioritizeReadme(researchFiles).map((sourcePath) => ({
      path: sourcePath,
      title: sourceTitleFromPath(sourcePath),
    })),
    epics: prioritizeReadme(epicFiles).map((sourcePath) => ({
      path: sourcePath,
      title: sourceTitleFromPath(sourcePath),
    })),
    ideas: prioritizeReadme(ideaFiles).map((sourcePath) => ({
      path: sourcePath,
      title: sourceTitleFromPath(sourcePath),
    })),
  };
}

async function discoverTaskSources() {
  const groups = [
    ['open', 'docs/project/25-tasks/open'],
    ['done', 'docs/project/25-tasks/done'],
  ];
  const results = [];

  for (const [bucket, root] of groups) {
    const files = await listMarkdownFiles(root, { recursive: true, excludeDirs: ['.obsidian'] });
    for (const sourcePath of files.sort((a, b) => a.localeCompare(b))) {
      results.push({
        path: sourcePath,
        bucket,
      });
    }
  }

  return results;
}

function parseFrontmatter(content) {
  const normalized = normalizeLf(content);
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { metadata: null, body: normalized.trim() };
  }

  const metadata = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    metadata[key] = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }

  return {
    metadata,
    body: normalized.slice(match[0].length).trim(),
  };
}

function extractMarkdownSection(content, heading) {
  const normalized = normalizeLf(content);
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^## ${escapedHeading}\\n([\\s\\S]*?)(?=^## |\\Z)`, 'm');
  const match = normalized.match(pattern);
  return match?.[1]?.trim() ?? '';
}

function collapseInline(text) {
  return normalizeLf(text).replace(/\s+/g, ' ').trim();
}

function summarizeTaskBody(body) {
  const preferred = extractMarkdownSection(body, 'Gewenste uitkomst');
  const fallback = extractMarkdownSection(body, 'Probleem / context');
  const source = collapseInline(preferred || fallback);
  if (!source) {
    return 'Nog geen samenvatting beschikbaar.';
  }
  return source.length > 140 ? `${source.slice(0, 137).trim()}...` : source;
}

function statusLabel(status) {
  const labels = {
    backlog: 'Backlog',
    ready: 'Ready',
    in_progress: 'In Progress',
    review: 'Review',
    blocked: 'Blocked',
    done: 'Done',
  };
  return labels[status] ?? status;
}

function priorityRank(priority) {
  const index = taskPriorityOrder.indexOf(priority);
  return index === -1 ? taskPriorityOrder.length : index;
}

function statusRank(status) {
  const index = taskStatusOrder.indexOf(status);
  return index === -1 ? taskStatusOrder.length : index;
}

function escapeTableCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|');
}

function replaceMarkedSection(content, markers, replacement) {
  const normalized = normalizeLf(content);
  const startIndex = normalized.indexOf(markers.start);
  const endIndex = normalized.indexOf(markers.end);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`docs:bundle failed: markers ontbreken of zijn ongeldig: ${markers.start} / ${markers.end}`);
  }

  const before = normalized.slice(0, startIndex + markers.start.length);
  const after = normalized.slice(endIndex);
  return `${before}\n${replacement.trim()}\n${after}`.trimEnd() + '\n';
}

function parseTaskSource(source) {
  const { metadata, body } = parseFrontmatter(source.content);
  const issues = [];

  if (!metadata) {
    issues.push('mist frontmatter');
  }

  for (const field of taskRequiredFields) {
    if (!metadata?.[field]) {
      issues.push(`mist veld '${field}'`);
    }
  }

  const status = metadata?.status ?? '';
  const priority = metadata?.priority ?? '';
  if (status && !taskStatusOrder.includes(status)) {
    issues.push(`onbekende status '${status}'`);
  }
  if (priority && !taskPriorityOrder.includes(priority)) {
    issues.push(`onbekende prioriteit '${priority}'`);
  }

  if (metadata?.updated_at && !/^\d{4}-\d{2}-\d{2}$/.test(metadata.updated_at)) {
    issues.push(`ongeldige updated_at '${metadata.updated_at}'`);
  }

  const inDoneFolder = source.path.startsWith('docs/project/25-tasks/done/');
  if (status === 'done' && !inDoneFolder) {
    issues.push("status 'done' mag alleen in done/");
  }
  if (status && status !== 'done' && inDoneFolder) {
    issues.push(`status '${status}' mag niet in done/`);
  }

  return {
    path: source.path,
    bucket: source.bucket,
    metadata: metadata ?? {},
    body,
    issues,
    summary: summarizeTaskBody(body),
  };
}

function validateTasks(tasks) {
  const errors = [];
  const ids = new Map();
  const titles = new Map();

  for (const task of tasks) {
    if (task.issues.length > 0) {
      errors.push(`${task.path}: ${task.issues.join('; ')}`);
    }

    const id = task.metadata.id;
    if (id) {
      const duplicate = ids.get(id);
      if (duplicate) {
        errors.push(`duplicate task id '${id}' in ${duplicate} en ${task.path}`);
      } else {
        ids.set(id, task.path);
      }
    }

    const title = task.metadata.title;
    if (title) {
      const duplicate = titles.get(title);
      if (duplicate) {
        errors.push(`duplicate task title '${title}' in ${duplicate} en ${task.path}`);
      } else {
        titles.set(title, task.path);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`docs:bundle failed: taakvalidatie mislukt:\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }
}

function stripObsidianLinks(content) {
  return normalizeLf(content)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1');
}

function extractAgentsSummary(agentsContent, allowedHeaders) {
  const lines = normalizeLf(agentsContent).split('\n');
  const sections = new Map();
  let currentHeader = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      const header = line.slice(3).trim();
      currentHeader = allowedHeaders.includes(header) ? header : null;
      continue;
    }

    if (!currentHeader || !line.startsWith('- ')) {
      continue;
    }

    const bucket = sections.get(currentHeader) ?? [];
    bucket.push(line);
    sections.set(currentHeader, bucket);
  }

  return allowedHeaders
    .filter((header) => sections.has(header))
    .map((header) => {
      const bullets = sections.get(header) ?? [];
      return [`### ${header}`, ...bullets].join('\n');
    })
    .join('\n\n')
    .trim();
}

function extractTokenSnapshot(tokensContent) {
  const content = normalizeLf(tokensContent);
  const lightBlock = content.match(/light:\s*\{([\s\S]*?)\n\s{2}\},/)?.[1] ?? '';
  const darkBlock = content.match(/dark:\s*\{([\s\S]*?)\n\s{2}\},/)?.[1] ?? '';

  function getString(block, key) {
    return block.match(new RegExp(`${key}:\\s*"([^"]+)"`))?.[1] ?? 'missing';
  }

  function getNumber(key) {
    return content.match(new RegExp(`${key}:\\s*(\\d+)`))?.[1] ?? 'missing';
  }

  function getTypeRole(role) {
    const match = content.match(
      new RegExp(`${role}:\\s*\\{\\s*size:\\s*(\\d+),\\s*lineHeight:\\s*(\\d+),\\s*weight:\\s*"([^"]+)"`, 'm'),
    );
    return match ? `${match[1]}/${match[2]}, weight ${match[3]}` : 'missing';
  }

  return [
    `- Light core surfaces: background ${getString(lightBlock, 'background')}, surfaceLow ${getString(lightBlock, 'surfaceLow')}, surface ${getString(lightBlock, 'surface')}, surfaceLowest ${getString(lightBlock, 'surfaceLowest')}, surfaceHigh ${getString(lightBlock, 'surfaceHigh')}.`,
    `- Dark core surfaces: background ${getString(darkBlock, 'background')}, surface ${getString(darkBlock, 'surface')}, surfaceLow ${getString(darkBlock, 'surfaceLow')}, surfaceLowest ${getString(darkBlock, 'surfaceLowest')}, surfaceHigh ${getString(darkBlock, 'surfaceHigh')}.`,
    `- Primary / CTA gradient: light ${getString(lightBlock, 'ctaGradientStart')} -> ${getString(lightBlock, 'ctaGradientEnd')}; dark ${getString(darkBlock, 'ctaGradientStart')} -> ${getString(darkBlock, 'ctaGradientEnd')}.`,
    `- Tab bar background tokens: light ${getString(lightBlock, 'tabBarBackground')}; dark ${getString(darkBlock, 'tabBarBackground')}.`,
    `- Destructive soft colors: light ${getString(lightBlock, 'destructiveSoftBackground')} / ${getString(lightBlock, 'destructiveSoftText')} / ${getString(lightBlock, 'destructiveSoftBorder')}; dark ${getString(darkBlock, 'destructiveSoftBackground')} / ${getString(darkBlock, 'destructiveSoftText')} / ${getString(darkBlock, 'destructiveSoftBorder')}.`,
    `- Key spacing: page ${getNumber('page')}, content ${getNumber('content')}, section ${getNumber('section')}, cluster ${getNumber('cluster')}, inline ${getNumber('inline')}.`,
    `- Key type roles: screenTitle ${getTypeRole('screenTitle')}; sectionTitle ${getTypeRole('sectionTitle')}; body ${getTypeRole('body')}; bodySecondary ${getTypeRole('bodySecondary')}; meta ${getTypeRole('meta')}; ctaLabel ${getTypeRole('ctaLabel')}.`,
  ].join('\n');
}

function compactExcerpt(content, maxLength = 1600) {
  const trimmed = normalizeLf(content).trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength).trim()}\n\n[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]`;
}

function extractSection(content, header, maxLength = 2200) {
  const normalized = normalizeLf(content);
  const lines = normalized.split('\n');
  const startIndex = lines.findIndex((line) => line.trim() === `## ${header}`);
  if (startIndex === -1) {
    return '';
  }

  let endIndex = lines.length;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    if (lines[index].startsWith('## ')) {
      endIndex = index;
      break;
    }
  }

  return compactExcerpt(lines.slice(startIndex, endIndex).join('\n'), maxLength);
}

function stripFirstMarkdownHeader(content) {
  return normalizeLf(content).replace(/^## [^\n]+\n+/, '').trim();
}

function renderGeneratedHeader({ title, buildTimestamp, commitHash, purpose }) {
  return [
    '# DO NOT EDIT - GENERATED FILE',
    '',
    `# ${title}`,
    '',
    `Build Timestamp (UTC): ${buildTimestamp}`,
    `Source Commit: ${commitHash}`,
    '',
    purpose,
    'Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.',
  ].join('\n');
}

function renderProjectBundle({ buildTimestamp, commitHash, loadedSources, appendixSummary }) {
  const sourceList = [...projectSources.map((item) => item.path), 'AGENTS.md'];
  const blocks = [
    renderGeneratedHeader({
      title: 'ChatGPT Project Context',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects, afgeleid van canonieke projectdocs.',
    }),
    '',
    '## Bronbestanden (vaste volgorde)',
    ...sourceList.map((item) => `- ${item}`),
    '',
    '## Uploadbeleid (ChatGPT Projects)',
    '- Dit bestand is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects.',
    '- Dit bestand is geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.',
    '- Gebruik na de bootstrap alleen de kleinste relevante subset uit het uploadmanifest; upload niet standaard de volledige set.',
    '- `docs/upload/**` blijft generated uploadoutput; bij spanning zijn canonieke docs leidend.',
    '- De bundelscript zet uploadbestanden klaar voor handmatige upload; upload naar ChatGPT gebeurt nu nog niet automatisch.',
    '- Budgetpolicy in ChatGPT Projects blijft licht; token/cost/runtime-discipline hoort in repo- en AI-governance-docs.',
    '- Session/multi-user/OpenAI-contextbeleid is nu alleen als later idee vastgelegd.',
  ];

  for (const source of loadedSources) {
    blocks.push('', '---', '', `## ${source.title}`, '', stripObsidianLinks(source.content));
  }

  if (appendixSummary) {
    blocks.push('', '---', '', '## Korte Appendix - Projectkritische AGENTS-punten', '', appendixSummary);
  }

  return `${blocks.join('\n').trim()}\n`;
}

function renderSectionedSources(loadedSources) {
  const blocks = [];
  for (const source of loadedSources) {
    blocks.push('', '---', '', `## ${source.title}`, '', stripObsidianLinks(source.content));
  }
  return blocks;
}

function renderResearchBundle({ buildTimestamp, commitHash, loadedResearchSources }) {
  const sourceList = researchSources.map((item) => item.path);
  const blocks = [
    renderGeneratedHeader({
      title: 'Budio Research',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: geordende researchbundle als strategische input voor planherijking, zonder canonieke MVP-docs te overschrijven.',
    }),
    '',
    '## Bronbestanden (vaste volgorde)',
    ...sourceList.map((item) => `- ${item}`),
    '',
    '## Interpretatieregel',
    '- Dit is een researchbundle en geen vervanging van canonieke MVP-waarheid in `docs/project/**`.',
    '- Gebruik dit document voor richting, kansen, sequencing en commerciële hypotheses.',
  ];

  for (const source of loadedResearchSources) {
    blocks.push('', '---', '', `## ${source.title}`, '', source.content);
  }

  return `${blocks.join('\n').trim()}\n`;
}

function renderProductTruthBundle({
  buildTimestamp,
  commitHash,
  loadedProjectSources,
  loadedPlanningSources,
}) {
  const sourceList = [
    ...projectSources.map((item) => item.path),
    ...planningSources.map((item) => item.path),
  ];

  const blocks = [
    renderGeneratedHeader({
      title: 'Budio Product Truth',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire uploadbundle met productkaders, statusrealiteit en actieve planningsfocus.',
    }),
    '',
    '## Bronbestanden (vaste volgorde)',
    ...sourceList.map((item) => `- ${item}`),
    '',
    '## Leesregel',
    '- Dit is de primaire bron voor scope, status en uitvoering binnen de huidige fase.',
    '- Strategische verdieping staat in de strategy/research bundle.',
    ...renderSectionedSources(loadedProjectSources),
    ...renderSectionedSources(loadedPlanningSources),
  ];

  return `${blocks.join('\n').trim()}\n`;
}

function renderStrategyResearchBundle({
  buildTimestamp,
  commitHash,
  loadedStrategySources,
  loadedResearchSources,
}) {
  const sourceList = [
    ...strategySources.map((item) => item.path),
    ...researchSources.map((item) => item.path),
  ];

  const blocks = [
    renderGeneratedHeader({
      title: 'Budio Strategy and Research',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire strategiebundle met horizon en researchvolgorde voor planherijking.',
    }),
    '',
    '## Bronbestanden (vaste volgorde)',
    ...sourceList.map((item) => `- ${item}`),
    '',
    '## Leesregel',
    '- Strategie/research zijn richtinggevend, maar wijzigen niet automatisch actieve MVP-scope.',
    '- Doorvertaling naar uitvoering loopt via planning-docs en decision-log.',
    ...renderSectionedSources(loadedStrategySources),
    ...renderSectionedSources(loadedResearchSources),
  ];

  return `${blocks.join('\n').trim()}\n`;
}

function renderIdeasOpportunityBundle({ buildTimestamp, commitHash, loadedIdeaSources }) {
  const sourceList = [...ideaSources.map((item) => item.path)];

  const blocks = [
    renderGeneratedHeader({
      title: 'Budio Ideas and Opportunity Map',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire ideebundle met opportunity-map voor triage, sequencing en planherijking.',
    }),
    '',
    '## Bronbestanden (vaste volgorde)',
    ...sourceList.map((item) => `- ${item}`),
    '',
    '## Leesregel',
    '- Ideas zijn voorstelruimte en niet automatisch actieve planning of canonieke productwaarheid.',
    '- Promotie naar actieve uitvoering loopt via `docs/project/20-planning/**` en expliciete decisions.',
    ...renderSectionedSources(loadedIdeaSources),
  ];

  return `${blocks.join('\n').trim()}\n`;
}

function renderBuildTruthBundle({ buildTimestamp, commitHash }) {
  const blocks = [
    renderGeneratedHeader({
      title: 'Budio Build Truth',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire buildbundle met routes, componentarchitectuur, services, runtime functions en contracts.',
    }),
    '',
    '## App Routes (kern)',
    ...buildTruth.routes.map((item) => `- ${item}`),
    '',
    '## Shared Components (kern)',
    ...buildTruth.components.map((item) => `- ${item}`),
    '',
    '## Services (kern)',
    ...buildTruth.services.map((item) => `- ${item}`),
    '',
    '## Supabase Functions (kern)',
    ...buildTruth.functions.map((item) => `- ${item}`),
    '',
    '## Contracts en Datagrondslag (kern)',
    ...buildTruth.contracts.map((item) => `- ${item}`),
    '',
    '## Gebruik',
    '- Gebruik deze bundle voor codewijzigingsplanning, impactanalyse en repo-aligned implementatieprompts.',
  ];

  return `${blocks.join('\n').trim()}\n`;
}

function renderUiDesignTruthBundle({
  buildTimestamp,
  commitHash,
  stitchDesignContext,
  mvpDesignSpec,
  ethosDesign,
  tokenSnapshot,
}) {
  const blocks = [
    renderGeneratedHeader({
      title: 'Budio UI System and Design Truth',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire UI/designbundle met designregels, tokens en implementatieguardrails.',
    }),
    '',
    '## Token Snapshot',
    tokenSnapshot,
    '',
    '## MVP Design Spec (excerpt)',
    compactExcerpt(mvpDesignSpec, 3500),
    '',
    '## Ethos Foundation (excerpt)',
    compactExcerpt(ethosDesign, 2600),
    '',
    '## Compact Design Context',
    compactExcerpt(stitchDesignContext, 4200),
  ];

  return `${blocks.join('\n').trim()}\n`;
}

function renderAiGovernanceOpsBundle({
  buildTimestamp,
  commitHash,
  aiQualityStudio,
  clineWorkflow,
  stitchWorkflow,
}) {
  const blocks = [
    renderGeneratedHeader({
      title: 'Budio AI Governance and Operations',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire bundle voor AI-governance, AIQS-uitvoering en operationele workflowregels.',
    }),
    '',
    '## AI Quality Studio Governance (excerpt)',
    compactExcerpt(aiQualityStudio, 5200),
    '',
    '## Cline Workflow (excerpt)',
    compactExcerpt(clineWorkflow, 3200),
    '',
    '## Stitch Workflow (excerpt)',
    compactExcerpt(stitchWorkflow, 3200),
  ];

  return `${blocks.join('\n').trim()}\n`;
}

function renderCoreProductPlanningBundle({ buildTimestamp, commitHash, productTruth }) {
  return `${[
    renderGeneratedHeader({
      title: 'Budio Core Product and Planning',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire domeinbundle voor core productwaarheid en actieve planning.',
    }),
    '',
    '## Domein',
    '- Core product / planning.',
    '',
    compactExcerpt(productTruth, 180000),
  ]
    .join('\n')
    .trim()}\n`;
}

function renderStrategyResearchIdeasBundle({
  buildTimestamp,
  commitHash,
  strategyResearch,
  ideasOpportunity,
}) {
  return `${[
    renderGeneratedHeader({
      title: 'Budio Strategy Research and Ideas',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire domeinbundle voor strategy/research/ideas.',
    }),
    '',
    '## Domein',
    '- Strategy / research / ideas.',
    '',
    '## Strategy and Research',
    compactExcerpt(strategyResearch, 140000),
    '',
    '## Ideas and Opportunity Map',
    compactExcerpt(ideasOpportunity, 140000),
  ]
    .join('\n')
    .trim()}\n`;
}

function renderBuildAiGovernanceOpsBundle({
  buildTimestamp,
  commitHash,
  buildTruth,
  aiGovernanceOps,
}) {
  return `${[
    renderGeneratedHeader({
      title: 'Budio Build AI Governance and Operations',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire domeinbundle voor build-truth, AI-governance en operations.',
    }),
    '',
    '## Domein',
    '- Build / AI governance / operations.',
    '',
    '## Build Truth',
    compactExcerpt(buildTruth, 140000),
    '',
    '## AI Governance and Operations',
    compactExcerpt(aiGovernanceOps, 140000),
  ]
    .join('\n')
    .trim()}\n`;
}

function renderDesignHandoffTruthBundle({
  buildTimestamp,
  commitHash,
  uiDesignTruth,
  stitchDesignContext,
}) {
  return `${[
    renderGeneratedHeader({
      title: 'Budio Design Handoff and Truth',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: primaire domeinbundle voor design handoff en design truth.',
    }),
    '',
    '## Domein',
    '- Design handoff / design truth.',
    '',
    '## UI System and Design Truth',
    compactExcerpt(uiDesignTruth, 140000),
    '',
    '## Stitch Design Context',
    compactExcerpt(stitchDesignContext, 140000),
  ]
    .join('\n')
    .trim()}\n`;
}

function renderPrimaryUploadManifest({ buildTimestamp, commitHash }) {
  return `${[
    '# DO NOT EDIT - GENERATED FILE',
    '',
    '# Budio Upload Manifest',
    '',
    `Build Timestamp (UTC): ${buildTimestamp}`,
    `Source Commit: ${commitHash}`,
    '',
    '## Beheerde uploadset (maximaal 10 bestanden)',
    '',
    '| Bestand | Type | Flow |',
    '| --- | --- | --- |',
    ...uploadSet.map((item) => `| \`${item.path}\` | ${item.type} | ${item.flow} |`),
    '',
    '## Regels',
    '- `docs/upload/chatgpt-project-context.md` is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects.',
    '- Gebruik in ChatGPT Projects na de bootstrap alleen de kleinste relevante subset uit dit manifest.',
    '- Upload niet standaard de volledige set.',
    '- Beheer handmatig nooit meer dan deze 10 uploadbestanden; oude legacy-output wordt bij bundlen opgeschoond.',
    '- De bundelscript zet uploadbestanden klaar voor handmatige upload; upload naar ChatGPT gebeurt nu nog niet automatisch.',
    '- `docs/upload/**` is geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.',
    '- Bij spanning tussen uploadartefacten en canonieke docs zijn canonieke docs leidend.',
    '- Budgetpolicy in ChatGPT Projects blijft licht; token/cost/runtime-discipline hoort in repo en AI-governance.',
    '- Session/multi-user/OpenAI-contextbeleid is nu alleen als later idee vastgelegd.',
    '',
    '## Use-case matrix (aanbevolen subsets)',
    '',
    '| Use-case | Aanbevolen bestanden |',
    '| --- | --- |',
    `| Strategie-review | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadCoreProductPlanning}\`, \`${outputPaths.uploadStrategyResearchIdeas}\` |`,
    `| Planherziening / opportunity review | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadStrategyResearchIdeas}\` |`,
    `| Epic/project planning review | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadCoreProductPlanning}\`, \`${outputPaths.uploadTasksCurrent}\` |`,
    `| Roadmapplanning / maandblokken | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadRoadmapPlanningPack}\` |`,
    `| Current task review | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadTasksCurrent}\` |`,
    `| Task archive review | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadTasksArchive}\` |`,
    `| Agent/docs workflow review | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadAgentWorkflowDocsTooling}\` |`,
    `| Code/build review | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadCoreProductPlanning}\`, \`${outputPaths.uploadBuildAiGovernanceOps}\` |`,
    `| Design/Stitch handoff | \`${outputPaths.uploadChatgptProjectContext}\`, \`${outputPaths.uploadDesignHandoffTruth}\` |`,
    `| Volledige beheerde context | ${uploadSet.map((item) => `\`${item.path}\``).join(', ')} |`,
    '',
    '## Leesregel',
    '- Het manifest is lokale uploadrouting, geen extra canonieke bron.',
    '- Complete uploads zijn alleen nodig voor brede audit, strategieherziening of overdracht.',
  ].join('\n')}\n`;
}

async function assertBuildTruthPathsExist() {
  const groups = [
    ['routes', buildTruth.routes],
    ['components', buildTruth.components],
    ['services', buildTruth.services],
    ['functions', buildTruth.functions],
    ['contracts', buildTruth.contracts],
  ];

  const missing = [];
  for (const [groupName, paths] of groups) {
    for (const source of paths) {
      if (!(await pathExists(source))) {
        missing.push(`${groupName}: ${source}`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `docs:bundle failed: ontbrekende build-truth paden (curated lijst):\n${missing
        .map((item) => `- ${item}`)
        .join('\n')}`,
    );
  }
}

function renderDesignContext({
  buildTimestamp,
  commitHash,
  mvpDesignSpec,
  ethosDesign,
  tokenSnapshot,
  pageMarkdownRefs,
}) {
  const sourceList = [...designSources, ...pageMarkdownRefs];
  const pageRefsSummary =
    pageMarkdownRefs.length > 0
      ? pageMarkdownRefs.map((item) => `- ${item}`).join('\n')
      : '- Geen extra per-page markdown refs gevonden.';
  const implementationGuardrails =
    stripFirstMarkdownHeader(extractSection(mvpDesignSpec, '10. Implementation Guardrails', 5000)) ||
    '- Zie `docs/design/mvp-design-spec-1.2.1.md` voor implementation guardrails.';
  const foundationGuardrails =
    stripFirstMarkdownHeader(extractSection(ethosDesign, '2. Operational Guardrails')) ||
    '- Zie `design_refs/1.2.1/ethos_ivory/DESIGN.md` voor foundation guardrails.';

  return `${[
    renderGeneratedHeader({
      title: 'Stitch Design Context',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: compacte Stitch/implementation handoff om design drift te beperken zonder alle projectdocs te dupliceren.',
    }),
    '',
    '## Bronbestanden (vaste volgorde)',
    ...sourceList.map((item) => `- ${item}`),
    '',
    '## Handoff Samenvatting',
    '- Capture-first blijft leidend: de app is een snelle, rustige persoonlijke thinking tool, geen dashboard of chatinterface.',
    '- Today is een entry point: de primaire CTA krijgt de meeste visuele aandacht; reflectie en recente context blijven secundair.',
    '- Clean-first UI: spacing, typografie, hiërarchie en tonal contrast gaan vóór extra containers.',
    '- Borders, fills, nested surfaces en text-wrapper fills zijn opt-in en alleen functioneel of design-ref-gedekt.',
    '- Topnav is navigation-only; paginatitel en supporting copy staan standaard in een hero onder de nav.',
    '- Dark en light mode delen dezelfde compositie; dark mode is niet de impliciete visuele waarheid.',
    '- Background modes zijn mode-aware: ambient, subtle en flat worden selectief ingezet per schermtype.',
    '- Auth sfeer komt uit page-level background + spacing; vermijd zware enclosing auth cards.',
    '- Header, page en footer vormen per mode één coherent geheel; header/footer blijven rustiger dan de page.',
    '',
    '## Current Token Snapshot',
    'Afgeleid uit `theme/tokens.ts`; die file blijft de enige tokenbron.',
    '',
    tokenSnapshot,
    '',
    '## Per-page Markdown Refs',
    'Deze markdown refs onder `design_refs/1.2.1/**` zijn meegenomen als aanvullende design input wanneer aanwezig.',
    '',
    pageRefsSummary,
    '',
    'Gebruik de bronbestanden zelf voor volledige screen-specifieke details; deze generated handoff houdt alleen de verwijzingen compact bij.',
    '',
    '## Design Guardrails',
    implementationGuardrails,
    '',
    '## Foundation Guardrails',
    foundationGuardrails,
    '',
    '## Agent Workflow Notes',
    '- `AGENTS.md` blijft de always-on workflowbron voor agents.',
    '- Gebruik `docs/project/README.md` als docs-ingang voordat je generated output leest.',
    '- Gebruik `docs/upload/**` alleen als uploadartefact, niet als canonieke bron.',
    '- Check stylingwerk tegen `design_refs/1.2.1/**`, inclusief `.md` notes als die aanwezig zijn.',
    '',
    '## Skill References',
    '- `.agents/skills/ui-implementation-guardrails/SKILL.md` voor clean-first UI polish en regressiefixes.',
    '- `.agents/skills/stitch-redesign-execution/SKILL.md` voor scherm-redesigns op basis van Stitch refs.',
  ]
    .join('\n')
    .trim()}\n`;
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const priorityDiff = priorityRank(a.metadata.priority) - priorityRank(b.metadata.priority);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const statusDiff = statusRank(a.metadata.status) - statusRank(b.metadata.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    return String(a.metadata.title).localeCompare(String(b.metadata.title));
  });
}

function renderTaskTable(tasks, { linkPrefix = '', includeDone = true } = {}) {
  const filtered = includeDone ? tasks : tasks.filter((task) => task.metadata.status !== 'done');
  const ordered = sortTasks(filtered);

  if (ordered.length === 0) {
    return '_Geen taken gevonden._';
  }

  return [
    '| Taak | Status | Prioriteit | Fase | Korte omschrijving |',
    '| --- | --- | --- | --- | --- |',
    ...ordered.map((task) => {
      const taskRelativePath = task.path.replace('docs/project/25-tasks/', '');
      const linkTarget = `${linkPrefix}${taskRelativePath}`;
      return `| [${escapeTableCell(task.metadata.title)}](${linkTarget}) | ${statusLabel(task.metadata.status)} | ${escapeTableCell(task.metadata.priority)} | ${escapeTableCell(task.metadata.phase)} | ${escapeTableCell(task.summary)} |`;
    }),
  ].join('\n');
}

function renderTaskIndex(tasks) {
  const groups = taskStatusOrder.map((status) => ({
    status,
    title: statusLabel(status),
    tasks: sortTasks(tasks.filter((task) => task.metadata.status === status)),
  }));

  const blocks = ['_Deze index wordt automatisch bijgewerkt door `npm run docs:bundle`._'];

  for (const group of groups) {
    blocks.push('', `### ${group.title}`);
    if (group.tasks.length === 0) {
      blocks.push('', '_Geen taken._');
      continue;
    }

    blocks.push(
      '',
      '| Taak | Prioriteit | Fase | Korte omschrijving |',
      '| --- | --- | --- | --- |',
      ...group.tasks.map((task) => {
        const linkTarget = task.path.replace('docs/project/25-tasks/', '');
        return `| [${escapeTableCell(task.metadata.title)}](${linkTarget}) | ${escapeTableCell(task.metadata.priority)} | ${escapeTableCell(task.metadata.phase)} | ${escapeTableCell(task.summary)} |`;
      }),
    );
  }

  return blocks.join('\n').trim();
}

function renderOpenPointsWithTaskOverview(openPointsSource, tasks) {
  const openTasks = tasks.filter((task) => task.metadata.status !== 'done');
  const replacement = [
    '_Open taken voor de huidige fase; de detailbeschrijving leeft in `docs/project/25-tasks/**`._',
    '',
    renderTaskTable(openTasks, { linkPrefix: '25-tasks/', includeDone: false }),
  ].join('\n');

  return replaceMarkedSection(openPointsSource, taskOverviewMarkers, replacement);
}

function renderTaskHub(taskHubSource, tasks) {
  return replaceMarkedSection(taskHubSource, taskIndexMarkers, renderTaskIndex(tasks));
}

function renderTasksUploadBundle({ buildTimestamp, commitHash, loadedTaskSources, mode }) {
  const normalized = [...loadedTaskSources]
    .filter((item) => {
      if (mode === 'archive') {
        return item.bucket === 'done';
      }
      return item.task.metadata.status !== 'done';
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  const archiveMode = mode === 'archive';
  const title = archiveMode ? 'Budio Tasks Archive' : 'Budio Current Tasks';
  const purpose = archiveMode
    ? 'Doel: uploadbundle met gearchiveerde done-tasks uit `docs/project/25-tasks/done/**`.'
    : 'Doel: uploadbundle met huidige niet-done tasks uit `docs/project/25-tasks/open/**`.';

  const sourceList = archiveMode
    ? ['docs/project/25-tasks/done/**']
    : ['docs/project/25-tasks/open/**'];

  const blocks = [
    renderGeneratedHeader({ title, buildTimestamp, commitHash, purpose }),
    '',
    '## Brondirectories',
    ...sourceList.map((item) => `- ${item}`),
    '',
    `## Telling`,
    `- Totaal tasks opgenomen: ${normalized.length}`,
    '',
    '## Leesregel',
    '- Dit is een uploadartefact en geen canonieke bron voor repo-uitvoering.',
    '- Canonieke taskfiles blijven de bron in `docs/project/25-tasks/**`.',
  ];

  for (const item of normalized) {
    blocks.push(
      '',
      '---',
      '',
      `## ${item.task.metadata.title ?? path.basename(item.path)}`,
      '',
      `- Path: \`${item.path}\``,
      `- Bucket: ${item.bucket}`,
      `- Status: ${item.task.metadata.status ?? 'unknown'}`,
      `- Priority: ${item.task.metadata.priority ?? 'unknown'}`,
      `- Phase: ${item.task.metadata.phase ?? 'unknown'}`,
      `- Updated_at: ${item.task.metadata.updated_at ?? 'unknown'}`,
      '',
      '```md',
      normalizeLf(item.content).trim(),
      '```',
    );
  }

  return `${blocks.join('\n').trim()}\n`;
}

function renderRoadmapPlanningPack({ buildTimestamp, commitHash, loadedRoadmapPlanningPackSources }) {
  const blocks = [
    renderGeneratedHeader({
      title: 'Budio Roadmap Planning Pack',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: uploadklare roadmapbundle voor maandblokken, epicniveau planning en post-basis roadmap review.',
    }),
    '',
    '## Bronbestanden',
    ...roadmapPlanningPackSources.map((item) => `- ${item.path}`),
    '',
    '## Leesregel',
    '- Dit is een uploadartefact en geen canonieke bron voor repo-uitvoering.',
    '- Canonieke roadmap- en workflowbronnen blijven de handmatige files in `docs/project/20-planning/**` en `docs/dev/**`.',
    '- Gebruik dit pack wanneer iemand zonder projectcontext de roadmap, maandvolgorde, ROI en templates snel moet begrijpen.',
    '',
    '## Gebruik',
    '- Voor post-basis roadmapreview: upload dit bestand samen met `docs/upload/chatgpt-project-context.md`.',
    '- Voor nieuwe of herziene maandroadmaps: gebruik de templates uit dit pack en werk de canonieke bronfiles bij.',
  ];

  for (const source of loadedRoadmapPlanningPackSources) {
    blocks.push('', '---', '', `## ${source.title}`, '', stripObsidianLinks(source.content));
  }

  return `${blocks.join('\n').trim()}\n`;
}

function renderAgentWorkflowDocsToolingPack({
  buildTimestamp,
  commitHash,
  loadedAgentWorkflowDocsToolingSources,
  budioAiOperatingSystem,
}) {
  const blocks = [
    renderGeneratedHeader({
      title: 'Budio Agent Workflow and Docs Tooling',
      buildTimestamp,
      commitHash,
      purpose:
        'Doel: uploadklare bundel voor agentwerkwijze, docs-tooling, audience-metadata en developer setup.',
    }),
    '',
    '## Bronbestanden',
    ...agentWorkflowDocsToolingSources.map((item) => `- ${item.path}`),
    `- ${budioAiOperatingSystemSourcePath} (excerpt)`,
    '',
    '## Leesregel',
    '- Dit is een uploadartefact en geen canonieke bron voor repo-uitvoering.',
    '- Gebruik canonieke handmatige docs, `AGENTS.md`, `.agents/skills/**` en `docs/dev/**` als bron.',
    '- Gebruik deze bundel alleen voor externe review of ChatGPT Project-context rond agent/docs-workflow.',
    '',
    '## Upload- en docs-policy kern',
    '- `docs/upload/**` is generated, upload-only en nooit leidend.',
    '- Human-facing docs mogen Budio Terminal-visueel zijn zolang plain Markdown blijft werken.',
    '- Agent-only docs blijven sober en operationeel.',
    '- De Obsidian vault is `docs/`; de vault-config staat in `docs/.obsidian/`.',
  ];

  for (const source of loadedAgentWorkflowDocsToolingSources) {
    blocks.push('', '---', '', `## ${source.title}`, '', stripObsidianLinks(source.content));
  }

  blocks.push(
    '',
    '---',
    '',
    '## Budio AI Operating System (excerpt)',
    '',
    compactExcerpt(budioAiOperatingSystem, 12000),
  );

  return `${blocks.join('\n').trim()}\n`;
}

async function loadBundleInputs() {
  const loadedProjectSources = [];
  for (const source of projectSources) {
    loadedProjectSources.push({ ...source, content: await readText(source.path) });
  }

  const loadedResearchSources = [];
  for (const source of researchSources) {
    loadedResearchSources.push({ ...source, content: await readText(source.path) });
  }

  const loadedStrategySources = [];
  for (const source of strategySources) {
    loadedStrategySources.push({ ...source, content: await readText(source.path) });
  }

  const loadedPlanningSources = [];
  for (const source of planningSources) {
    loadedPlanningSources.push({ ...source, content: await readText(source.path) });
  }

  const loadedIdeaSources = [];
  for (const source of ideaSources) {
    loadedIdeaSources.push({ ...source, content: await readText(source.path) });
  }

  const loadedTaskSources = [];
  for (const source of taskSources) {
    const content = await readText(source.path);
    loadedTaskSources.push({
      ...source,
      content,
      task: parseTaskSource({ ...source, content }),
    });
  }
  validateTasks(loadedTaskSources.map((item) => item.task));

  const loadedRoadmapPlanningPackSources = [];
  for (const source of roadmapPlanningPackSources) {
    loadedRoadmapPlanningPackSources.push({ ...source, content: await readText(source.path) });
  }

  const loadedAgentWorkflowDocsToolingSources = [];
  for (const source of agentWorkflowDocsToolingSources) {
    loadedAgentWorkflowDocsToolingSources.push({ ...source, content: await readText(source.path) });
  }

  const agents = await readText('AGENTS.md');
  const openPointsSource = await readText('docs/project/open-points.md');
  const taskHubSource = await readText('docs/project/25-tasks/README.md');
  const mvpDesignSpec = await readText('docs/design/mvp-design-spec-1.2.1.md');
  const ethosDesign = await readText('design_refs/1.2.1/ethos_ivory/DESIGN.md');
  const stitchWorkflow = await readText('docs/dev/stitch-workflow.md');
  const budioAiOperatingSystem = await readText(
    budioAiOperatingSystemSourcePath,
  );
  const tokens = await readText('theme/tokens.ts');
  const pageMarkdownRefs = await listDesignMarkdownRefs();

  return {
    loadedProjectSources,
    loadedResearchSources,
    loadedStrategySources,
    loadedPlanningSources,
    loadedIdeaSources,
    loadedTaskSources,
    loadedRoadmapPlanningPackSources,
    loadedAgentWorkflowDocsToolingSources,
    openPointsSource,
    taskHubSource,
    appendixSummary: extractAgentsSummary(agents, [
      'Canonieke projectdocs',
      'Canonieke designbronnen (MVP 1.2.1)',
      'Docs-workflow',
      'Security',
      'Kwaliteit',
    ]),
    mvpDesignSpec,
    ethosDesign,
    stitchWorkflow,
    budioAiOperatingSystem,
    tokenSnapshot: extractTokenSnapshot(tokens),
    pageMarkdownRefs,
  };
}

function assertDiscoveredSources() {
  const checks = [
    ['strategy', strategySources],
    ['planning', planningSources],
    ['research', researchSources],
    ['epics', epicSources],
    ['ideas', ideaSources],
  ];

  const missing = checks
    .filter(([, list]) => !Array.isArray(list) || list.length === 0)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`docs:bundle failed: geen markdown gevonden in projectlagen: ${missing.join(', ')}`);
  }
}

function renderOutputs(inputs, metadata) {
  const taskEntries = inputs.loadedTaskSources.map((item) => item.task);
  const canonicalOpenPoints = renderOpenPointsWithTaskOverview(
    inputs.openPointsSource,
    taskEntries,
  );
  const canonicalTaskHub = renderTaskHub(
    inputs.taskHubSource,
    taskEntries,
  );
  const uploadTasksCurrent = renderTasksUploadBundle({
    ...metadata,
    loadedTaskSources: inputs.loadedTaskSources,
    mode: 'current',
  });
  const uploadTasksArchive = renderTasksUploadBundle({
    ...metadata,
    loadedTaskSources: inputs.loadedTaskSources,
    mode: 'archive',
  });
  const uploadRoadmapPlanningPack = renderRoadmapPlanningPack({
    ...metadata,
    loadedRoadmapPlanningPackSources: inputs.loadedRoadmapPlanningPackSources,
  });
  const uploadAgentWorkflowDocsTooling = renderAgentWorkflowDocsToolingPack({
    ...metadata,
    loadedAgentWorkflowDocsToolingSources: inputs.loadedAgentWorkflowDocsToolingSources,
    budioAiOperatingSystem: inputs.budioAiOperatingSystem,
  });
  const loadedProjectSources = inputs.loadedProjectSources.map((source) =>
    source.path === 'docs/project/open-points.md'
      ? { ...source, content: canonicalOpenPoints.trim() }
      : source,
  );
  const chatgptProjectContext = renderProjectBundle({
    ...metadata,
    loadedSources: loadedProjectSources,
    appendixSummary: inputs.appendixSummary,
  });
  const budioResearch = renderResearchBundle({
    ...metadata,
    loadedResearchSources: inputs.loadedResearchSources,
  });
  const stitchDesignContext = renderDesignContext({
    ...metadata,
    mvpDesignSpec: inputs.mvpDesignSpec,
    ethosDesign: inputs.ethosDesign,
    tokenSnapshot: inputs.tokenSnapshot,
    pageMarkdownRefs: inputs.pageMarkdownRefs,
  });
  const primaryProductTruth = renderProductTruthBundle({
    ...metadata,
    loadedProjectSources,
    loadedPlanningSources: inputs.loadedPlanningSources,
  });
  const primaryStrategyResearch = renderStrategyResearchBundle({
    ...metadata,
    loadedStrategySources: inputs.loadedStrategySources,
    loadedResearchSources: inputs.loadedResearchSources,
  });
  const primaryIdeasOpportunity = renderIdeasOpportunityBundle({
    ...metadata,
    loadedIdeaSources: inputs.loadedIdeaSources,
  });
  const primaryBuildTruth = renderBuildTruthBundle(metadata);
  const primaryUiDesignTruth = renderUiDesignTruthBundle({
    ...metadata,
    stitchDesignContext,
    mvpDesignSpec: inputs.mvpDesignSpec,
    ethosDesign: inputs.ethosDesign,
    tokenSnapshot: inputs.tokenSnapshot,
  });
  const primaryAiGovernanceOps = renderAiGovernanceOpsBundle({
    ...metadata,
    aiQualityStudio:
      inputs.loadedProjectSources.find((item) => item.path === 'docs/project/ai-quality-studio.md')?.content ?? '',
    clineWorkflow:
      inputs.loadedProjectSources.find((item) => item.path === 'docs/dev/cline-workflow.md')?.content ?? '',
    stitchWorkflow: inputs.stitchWorkflow,
  });
  const primaryCoreProductPlanning = renderCoreProductPlanningBundle({
    ...metadata,
    productTruth: primaryProductTruth,
  });
  const primaryStrategyResearchIdeas = renderStrategyResearchIdeasBundle({
    ...metadata,
    strategyResearch: primaryStrategyResearch,
    ideasOpportunity: primaryIdeasOpportunity,
  });
  const primaryBuildAiGovernanceOps = renderBuildAiGovernanceOpsBundle({
    ...metadata,
    buildTruth: primaryBuildTruth,
    aiGovernanceOps: primaryAiGovernanceOps,
  });
  const primaryDesignHandoffTruth = renderDesignHandoffTruthBundle({
    ...metadata,
    uiDesignTruth: primaryUiDesignTruth,
    stitchDesignContext,
  });
  const primaryManifest = renderPrimaryUploadManifest(metadata);

  return new Map([
    [outputPaths.canonicalOpenPoints, canonicalOpenPoints],
    [outputPaths.canonicalTaskHub, canonicalTaskHub],
    [outputPaths.chatgptProjectContext, chatgptProjectContext],
    [outputPaths.generatedProductTruth, primaryProductTruth],
    [outputPaths.generatedStrategyResearch, primaryStrategyResearch],
    [outputPaths.generatedIdeasOpportunity, primaryIdeasOpportunity],
    [outputPaths.generatedBuildTruth, primaryBuildTruth],
    [outputPaths.generatedUiDesignTruth, primaryUiDesignTruth],
    [outputPaths.generatedAiGovernanceOps, primaryAiGovernanceOps],
    [outputPaths.budioResearch, budioResearch],
    [outputPaths.stitchDesignContext, stitchDesignContext],
    [outputPaths.uploadChatgptProjectContext, chatgptProjectContext],
    [outputPaths.uploadManifestV2, primaryManifest],
    [outputPaths.uploadCoreProductPlanning, primaryCoreProductPlanning],
    [outputPaths.uploadStrategyResearchIdeas, primaryStrategyResearchIdeas],
    [outputPaths.uploadBuildAiGovernanceOps, primaryBuildAiGovernanceOps],
    [outputPaths.uploadDesignHandoffTruth, primaryDesignHandoffTruth],
    [outputPaths.uploadRoadmapPlanningPack, uploadRoadmapPlanningPack],
    [outputPaths.uploadTasksCurrent, uploadTasksCurrent],
    [outputPaths.uploadTasksArchive, uploadTasksArchive],
    [outputPaths.uploadAgentWorkflowDocsTooling, uploadAgentWorkflowDocsTooling],
  ]);
}

async function assertRequiredSourcesExist(pageMarkdownRefs) {
  const requiredSources = [
    ...projectSources.map((item) => item.path),
    ...researchSources.map((item) => item.path),
    ...strategySources.map((item) => item.path),
    ...planningSources.map((item) => item.path),
    ...epicSources.map((item) => item.path),
    ...ideaSources.map((item) => item.path),
    ...taskSources.map((item) => item.path),
    ...roadmapPlanningPackSources.map((item) => item.path),
    ...agentWorkflowDocsToolingSources.map((item) => item.path),
    ...designSources,
    'docs/project/25-tasks/README.md',
    'docs/project/25-tasks/_template.md',
    'docs/dev/stitch-workflow.md',
    budioAiOperatingSystemSourcePath,
    'docs/dev/task-lifecycle-workflow.md',
    ...pageMarkdownRefs,
  ];

  const missing = [];
  for (const source of requiredSources) {
    if (!(await pathExists(source))) {
      missing.push(source);
    }
  }

  if (missing.length > 0) {
    throw new Error(`docs:bundle failed: ontbrekende bronfiles:\n${missing.map((item) => `- ${item}`).join('\n')}`);
  }

  await assertBuildTruthPathsExist();
}

async function writeOutputs(outputs) {
  for (const [relativePath, content] of outputs) {
    await fs.mkdir(path.dirname(absolute(relativePath)), { recursive: true });
    await fs.writeFile(absolute(relativePath), content, 'utf8');
    console.log(`docs:bundle wrote ${relativePath}`);
  }
}

async function cleanUploadDirectory(outputs) {
  const uploadRoot = absolute('docs/upload');
  await fs.mkdir(uploadRoot, { recursive: true });

  // Start from a clean upload directory so stale files from older bundle layouts
  // cannot survive between runs.
  const entries = await fs.readdir(uploadRoot, { withFileTypes: true });
  for (const entry of entries) {
    await fs.rm(path.join(uploadRoot, entry.name), { recursive: true, force: true });
  }

  // Recreate nested directories required by current outputs (if any).
  for (const relativePath of outputs.keys()) {
    if (!relativePath.startsWith('docs/upload/')) {
      continue;
    }
    await fs.mkdir(path.dirname(absolute(relativePath)), { recursive: true });
  }
}

async function verifyOutputs(outputs) {
  const errors = [];

  for (const [relativePath, expected] of outputs) {
    try {
      const current = normalizeLf(await fs.readFile(absolute(relativePath), 'utf8'));
      if (current !== expected) {
        errors.push(`${relativePath} is niet up-to-date`);
      }
    } catch {
      errors.push(`${relativePath} ontbreekt`);
    }
  }

  for (const item of uploadSet) {
    if (!outputs.has(item.path)) {
      errors.push(`${item.path} ontbreekt in uploadset configuratie`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`docs:bundle:verify failed:\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }

  console.log('docs:bundle:verify ok');
}

async function main() {
  const isCheckMode = process.argv.includes('--check');
  const mode = isCheckMode ? 'verify' : 'bundle';

  await withDocsBundleLock(docsBundleLockPath, mode, async () => {
    const discovered = await discoverProjectLayerSources();
    taskSources = await discoverTaskSources();
    strategySources = discovered.strategy;
    planningSources = discovered.planning;
    researchSources = discovered.research;
    epicSources = discovered.epics;
    ideaSources = discovered.ideas;
    projectSources = [...projectCoreSources, ...epicSources];
    assertDiscoveredSources();
    const metadata = await resolveBuildMetadata(isCheckMode);
    const inputs = await loadBundleInputs();
    await assertRequiredSourcesExist(inputs.pageMarkdownRefs);
    const outputs = renderOutputs(inputs, metadata);

    if (isCheckMode) {
      await verifyOutputs(outputs);
      return;
    }

    await cleanUploadDirectory(outputs);
    await writeOutputs(outputs);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
