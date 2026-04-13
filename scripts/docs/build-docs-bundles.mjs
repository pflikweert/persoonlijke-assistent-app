#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const outputPaths = {
  chatgptProjectContext: 'docs/project/generated/chatgpt-project-context.md',
  stitchDesignContext: 'docs/design/generated/stitch-design-context.md',
  uploadChatgptProjectContext: 'docs/upload/chatgpt-project-context.md',
  uploadAiQualityStudio: 'docs/upload/ai-quality-studio.md',
  uploadClineWorkflow: 'docs/upload/cline-workflow.md',
  uploadMvpDesignSpec: 'docs/upload/mvp-design-spec-1.2.1.md',
  uploadStitchDesignContext: 'docs/upload/stitch-design-context.md',
  uploadManifest: 'docs/upload/upload-manifest.md',
};

const projectSources = [
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
    path: outputPaths.uploadChatgptProjectContext,
    type: 'generated upload copy',
    flow: 'ChatGPT Project',
  },
  {
    path: outputPaths.uploadAiQualityStudio,
    type: 'canonical upload copy',
    flow: 'ChatGPT Project',
  },
  {
    path: outputPaths.uploadClineWorkflow,
    type: 'workflow upload copy',
    flow: 'ChatGPT Project (execution context)',
  },
  {
    path: outputPaths.uploadMvpDesignSpec,
    type: 'canonical upload copy',
    flow: 'ChatGPT Project + Stitch/design handoff',
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
    blocks.push('', '---', '', `## ${source.title}`, '', source.content);
  }

  if (appendixSummary) {
    blocks.push('', '---', '', '## Korte Appendix - Projectkritische AGENTS-punten', '', appendixSummary);
  }

  return `${blocks.join('\n').trim()}\n`;
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

  const agents = await readText('AGENTS.md');
  const mvpDesignSpec = await readText('docs/design/mvp-design-spec-1.2.1.md');
  const ethosDesign = await readText('design_refs/1.2.1/ethos_ivory/DESIGN.md');
  const tokens = await readText('theme/tokens.ts');
  const pageMarkdownRefs = await listDesignMarkdownRefs();

  return {
    loadedProjectSources,
    appendixSummary: extractAgentsSummary(agents, [
      'Canonieke projectdocs',
      'Canonieke designbronnen (MVP 1.2.1)',
      'Docs-workflow',
      'Security',
      'Kwaliteit',
    ]),
    mvpDesignSpec,
    ethosDesign,
    tokenSnapshot: extractTokenSnapshot(tokens),
    pageMarkdownRefs,
  };
}

function renderOutputs(inputs, metadata) {
  const chatgptProjectContext = renderProjectBundle({
    ...metadata,
    loadedSources: inputs.loadedProjectSources,
    appendixSummary: inputs.appendixSummary,
  });
  const stitchDesignContext = renderDesignContext({
    ...metadata,
    mvpDesignSpec: inputs.mvpDesignSpec,
    ethosDesign: inputs.ethosDesign,
    tokenSnapshot: inputs.tokenSnapshot,
    pageMarkdownRefs: inputs.pageMarkdownRefs,
  });
  const uploadManifest = renderUploadManifest(metadata);

  return new Map([
    [outputPaths.chatgptProjectContext, chatgptProjectContext],
    [outputPaths.stitchDesignContext, stitchDesignContext],
    [outputPaths.uploadChatgptProjectContext, chatgptProjectContext],
    [outputPaths.uploadAiQualityStudio, `${inputs.loadedProjectSources.find((item) => item.path === 'docs/project/ai-quality-studio.md')?.content?.trim() ?? ''}\n`],
    [outputPaths.uploadClineWorkflow, `${inputs.loadedProjectSources.find((item) => item.path === 'docs/dev/cline-workflow.md')?.content?.trim() ?? ''}\n`],
    [outputPaths.uploadMvpDesignSpec, `${inputs.mvpDesignSpec.trim()}\n`],
    [outputPaths.uploadStitchDesignContext, stitchDesignContext],
    [outputPaths.uploadManifest, uploadManifest],
  ]);
}

async function assertRequiredSourcesExist(pageMarkdownRefs) {
  const requiredSources = [
    ...projectSources.map((item) => item.path),
    ...designSources,
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
}

async function writeOutputs(outputs) {
  for (const [relativePath, content] of outputs) {
    await fs.mkdir(path.dirname(absolute(relativePath)), { recursive: true });
    await fs.writeFile(absolute(relativePath), content, 'utf8');
    console.log(`docs:bundle wrote ${relativePath}`);
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
  const metadata = await resolveBuildMetadata(isCheckMode);
  const inputs = await loadBundleInputs();
  await assertRequiredSourcesExist(inputs.pageMarkdownRefs);
  const outputs = renderOutputs(inputs, metadata);

  if (isCheckMode) {
    await verifyOutputs(outputs);
    return;
  }

  await writeOutputs(outputs);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
