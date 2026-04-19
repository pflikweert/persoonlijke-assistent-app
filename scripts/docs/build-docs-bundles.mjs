#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const outputPaths = {
  uploadManifestV2: 'docs/upload/00-budio-upload-manifest.md',
  uploadProductTruth: 'docs/upload/10-budio-product-truth.md',
  uploadStrategyResearch: 'docs/upload/20-budio-strategy-and-research.md',
  uploadIdeasOpportunity: 'docs/upload/25-budio-ideas-and-opportunity-map.md',
  uploadBuildTruth: 'docs/upload/30-budio-build-truth.md',
  uploadUiDesignTruth: 'docs/upload/40-budio-ui-system-and-design-truth.md',
  uploadAiGovernanceOps: 'docs/upload/50-budio-ai-governance-and-operations.md',
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
  uploadBudioResearch: 'docs/upload/budio-research.md',
  uploadAiQualityStudio: 'docs/upload/ai-quality-studio.md',
  uploadClineWorkflow: 'docs/upload/cline-workflow.md',
  uploadStitchWorkflow: 'docs/upload/stitch-workflow.md',
  uploadMvpDesignSpec: 'docs/upload/mvp-design-spec-1.2.1.md',
  uploadEthosIvoryDesign: 'docs/upload/ethos-ivory-design.md',
  uploadStitchDesignContext: 'docs/upload/stitch-design-context.md',
  uploadManifest: 'docs/upload/upload-manifest.md',
};

const projectCoreSources = [
  { path: 'docs/project/README.md', title: 'Docs-Hiërarchie Samenvatting' },
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
let ideaSources = [];

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
    flow: 'Primary upload guidance',
  },
  {
    path: outputPaths.uploadProductTruth,
    type: 'generated primary bundle',
    flow: 'Product/scope/status truth',
  },
  {
    path: outputPaths.uploadStrategyResearch,
    type: 'generated primary bundle',
    flow: 'Strategy and research',
  },
  {
    path: outputPaths.uploadIdeasOpportunity,
    type: 'generated primary bundle',
    flow: 'Ideas and opportunity map',
  },
  {
    path: outputPaths.uploadBuildTruth,
    type: 'generated primary bundle',
    flow: 'Build/code architecture truth',
  },
  {
    path: outputPaths.uploadUiDesignTruth,
    type: 'generated primary bundle',
    flow: 'UI system and design truth',
  },
  {
    path: outputPaths.uploadAiGovernanceOps,
    type: 'generated primary bundle',
    flow: 'AI governance and operations',
  },
  {
    path: outputPaths.uploadChatgptProjectContext,
    type: 'legacy generated upload copy',
    flow: 'Legacy compatibility',
  },
  {
    path: outputPaths.uploadAiQualityStudio,
    type: 'legacy canonical upload copy',
    flow: 'Legacy compatibility',
  },
  {
    path: outputPaths.uploadBudioResearch,
    type: 'legacy generated upload copy',
    flow: 'Legacy compatibility',
  },
  {
    path: outputPaths.uploadClineWorkflow,
    type: 'workflow upload copy',
    flow: 'ChatGPT Project (execution context)',
  },
  {
    path: outputPaths.uploadStitchWorkflow,
    type: 'workflow upload copy',
    flow: 'ChatGPT Project + Stitch handoff (workflow context)',
  },
  {
    path: outputPaths.uploadMvpDesignSpec,
    type: 'canonical upload copy',
    flow: 'ChatGPT Project + Stitch/design handoff',
  },
  {
    path: outputPaths.uploadEthosIvoryDesign,
    type: 'canonical upload copy',
    flow: 'Stitch/design handoff foundations',
  },
  {
    path: outputPaths.uploadStitchDesignContext,
    type: 'generated upload copy',
    flow: 'Stitch/design handoff',
  },
  {
    path: outputPaths.uploadManifest,
    type: 'generated manifest',
    flow: 'Upload completeness check',
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
  const [strategyFiles, planningFiles, researchFiles, ideaFiles] = await Promise.all([
    listMarkdownFiles('docs/project/10-strategy'),
    listMarkdownFiles('docs/project/20-planning'),
    listMarkdownFiles('docs/project/30-research'),
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
    ideas: prioritizeReadme(ideaFiles).map((sourcePath) => ({
      path: sourcePath,
      title: sourceTitleFromPath(sourcePath),
    })),
  };
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
        'Doel: compacte uploadcontext voor ChatGPT Project, afgeleid van canonieke projectdocs. Upload via docs/upload samen met de MVP design spec en Stitch design context.',
    }),
    '',
    '## Bronbestanden (vaste volgorde)',
    ...sourceList.map((item) => `- ${item}`),
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

function renderPrimaryUploadManifest({ buildTimestamp, commitHash }) {
  const primaryRows = uploadSet.filter((item) => item.path.startsWith('docs/upload/0') || item.path.startsWith('docs/upload/1') || item.path.startsWith('docs/upload/2') || item.path.startsWith('docs/upload/3') || item.path.startsWith('docs/upload/4') || item.path.startsWith('docs/upload/5'));

  return `${[
    '# DO NOT EDIT - GENERATED FILE',
    '',
    '# Budio Upload Manifest',
    '',
    `Build Timestamp (UTC): ${buildTimestamp}`,
    `Source Commit: ${commitHash}`,
    '',
    '## Primaire uploadset (aanbevolen)',
    '',
    '| Bestand | Type | Flow |',
    '| --- | --- | --- |',
    ...primaryRows.map((item) => `| \`${item.path}\` | ${item.type} | ${item.flow} |`),
    '',
    '## Use-case matrix (aanbevolen subsets)',
    '',
    '| Use-case | Aanbevolen bestanden |',
    '| --- | --- |',
    `| Strategie-review | \`${outputPaths.uploadManifestV2}\`, \`${outputPaths.uploadProductTruth}\`, \`${outputPaths.uploadStrategyResearch}\`, \`${outputPaths.uploadAiGovernanceOps}\` |`,
    `| Planherziening / opportunity review | \`${outputPaths.uploadManifestV2}\`, \`${outputPaths.uploadStrategyResearch}\`, \`${outputPaths.uploadIdeasOpportunity}\` |`,
    `| Code/build review | \`${outputPaths.uploadManifestV2}\`, \`${outputPaths.uploadProductTruth}\`, \`${outputPaths.uploadBuildTruth}\` |`,
    `| Design/Stitch handoff | \`${outputPaths.uploadManifestV2}\`, \`${outputPaths.uploadUiDesignTruth}\`, \`${outputPaths.uploadMvpDesignSpec}\`, \`${outputPaths.uploadEthosIvoryDesign}\`, \`${outputPaths.uploadStitchDesignContext}\` |`,
    `| Volledige primaire context | \`${outputPaths.uploadManifestV2}\`, \`${outputPaths.uploadProductTruth}\`, \`${outputPaths.uploadStrategyResearch}\`, \`${outputPaths.uploadIdeasOpportunity}\`, \`${outputPaths.uploadBuildTruth}\`, \`${outputPaths.uploadUiDesignTruth}\`, \`${outputPaths.uploadAiGovernanceOps}\` |`,
    '',
    '## Legacy uploadset',
    '- Legacy bestanden blijven aanwezig voor compatibiliteit maar zijn niet de primaire set.',
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

function renderUploadManifest({ buildTimestamp, commitHash }) {
  return `${[
    '# DO NOT EDIT - GENERATED FILE',
    '',
    '# Upload Manifest',
    '',
    `Build Timestamp (UTC): ${buildTimestamp}`,
    `Source Commit: ${commitHash}`,
    '',
    '## Standaard Uploadset',
    '',
    '| Bestand | Type | Flow |',
    '| --- | --- | --- |',
    ...uploadSet.map((item) => `| \`${item.path}\` | ${item.type} | ${item.flow} |`),
    '',
    '## Regels',
    '- Upload naar ChatGPT Project standaard de contextbestanden uit `docs/upload/**` plus dit manifest indien completeness-check gewenst is.',
    '- Gebruik `docs/upload/**` niet als canonieke bron voor agents; lees de handmatige bronbestanden en draai de bundle opnieuw.',
    '- Voor Stitch/design-handoff hoort `docs/upload/stitch-design-context.md` bij de uploadset.',
    '- Draai `npm run docs:bundle` en daarna `npm run docs:bundle:verify` na canonieke docs- of design-handoff wijzigingen.',
  ]
    .join('\n')
    .trim()}\n`;
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

  const agents = await readText('AGENTS.md');
  const mvpDesignSpec = await readText('docs/design/mvp-design-spec-1.2.1.md');
  const ethosDesign = await readText('design_refs/1.2.1/ethos_ivory/DESIGN.md');
  const stitchWorkflow = await readText('docs/dev/stitch-workflow.md');
  const tokens = await readText('theme/tokens.ts');
  const pageMarkdownRefs = await listDesignMarkdownRefs();

  return {
    loadedProjectSources,
    loadedResearchSources,
    loadedStrategySources,
    loadedPlanningSources,
    loadedIdeaSources,
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
    tokenSnapshot: extractTokenSnapshot(tokens),
    pageMarkdownRefs,
  };
}

function assertDiscoveredSources() {
  const checks = [
    ['strategy', strategySources],
    ['planning', planningSources],
    ['research', researchSources],
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
  const chatgptProjectContext = renderProjectBundle({
    ...metadata,
    loadedSources: inputs.loadedProjectSources,
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
  const uploadManifest = renderUploadManifest(metadata);
  const primaryProductTruth = renderProductTruthBundle({
    ...metadata,
    loadedProjectSources: inputs.loadedProjectSources,
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
  const primaryManifest = renderPrimaryUploadManifest(metadata);

  return new Map([
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
    [outputPaths.uploadProductTruth, primaryProductTruth],
    [outputPaths.uploadStrategyResearch, primaryStrategyResearch],
    [outputPaths.uploadIdeasOpportunity, primaryIdeasOpportunity],
    [outputPaths.uploadBuildTruth, primaryBuildTruth],
    [outputPaths.uploadUiDesignTruth, primaryUiDesignTruth],
    [outputPaths.uploadAiGovernanceOps, primaryAiGovernanceOps],
    [outputPaths.uploadBudioResearch, budioResearch],
    [outputPaths.uploadAiQualityStudio, `${inputs.loadedProjectSources.find((item) => item.path === 'docs/project/ai-quality-studio.md')?.content?.trim() ?? ''}\n`],
    [outputPaths.uploadClineWorkflow, `${inputs.loadedProjectSources.find((item) => item.path === 'docs/dev/cline-workflow.md')?.content?.trim() ?? ''}\n`],
    [outputPaths.uploadStitchWorkflow, `${inputs.stitchWorkflow.trim()}\n`],
    [outputPaths.uploadMvpDesignSpec, `${inputs.mvpDesignSpec.trim()}\n`],
    [outputPaths.uploadEthosIvoryDesign, `${inputs.ethosDesign.trim()}\n`],
    [outputPaths.uploadStitchDesignContext, stitchDesignContext],
    [outputPaths.uploadManifest, uploadManifest],
  ]);
}

async function assertRequiredSourcesExist(pageMarkdownRefs) {
  const requiredSources = [
    ...projectSources.map((item) => item.path),
    ...researchSources.map((item) => item.path),
    ...strategySources.map((item) => item.path),
    ...planningSources.map((item) => item.path),
    ...ideaSources.map((item) => item.path),
    ...designSources,
    'docs/dev/stitch-workflow.md',
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
  const discovered = await discoverProjectLayerSources();
  strategySources = discovered.strategy;
  planningSources = discovered.planning;
  researchSources = discovered.research;
  ideaSources = discovered.ideas;
  projectSources = [...projectCoreSources];
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
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
