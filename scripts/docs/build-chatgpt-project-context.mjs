#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const outputPath = path.join(repoRoot, 'docs/project/generated/chatgpt-project-context.md');

const canonicalSources = [
  {
    path: 'docs/project/README.md',
    title: 'Docs-Hiërarchie Samenvatting',
  },
  {
    path: 'docs/project/master-project.md',
    title: 'Hoofd Projectdocument',
  },
  {
    path: 'docs/project/product-vision-mvp.md',
    title: 'Productvisie Aanscherping',
  },
  {
    path: 'docs/project/current-status.md',
    title: 'Actuele Gebouwde Status',
  },
  {
    path: 'docs/project/open-points.md',
    title: 'Open Punten / Resterend Werk',
  },
  {
    path: 'docs/project/content-processing-rules.md',
    title: 'Content / Narrative Processing Regels',
  },
  {
    path: 'docs/project/copy-instructions.md',
    title: 'Copy Instructions',
  },
];

const appendixSource = 'AGENTS.md';

function normalizeLf(input) {
  return String(input ?? '').replace(/\r\n?/g, '\n');
}

function getHeadCommitHash() {
  return execSync('git rev-parse --short HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function extractBuildTimestamp(existingContent) {
  const match = existingContent.match(/^Build Timestamp \(UTC\):\s*(.+)$/m);
  return match?.[1]?.trim() || null;
}

function extractSourceCommit(existingContent) {
  const match = existingContent.match(/^Source Commit:\s*(.+)$/m);
  return match?.[1]?.trim() || null;
}

function extractProjectCriticalAgentsSummary(agentsContent) {
  const allowedHeaders = new Set([
    'Canonieke projectbron',
    'Canonieke projectdocs',
    'Canonieke designbronnen (MVP 1.2.1)',
    'Security',
    'Kwaliteit',
  ]);

  const lines = normalizeLf(agentsContent).split('\n');
  const sections = new Map();
  let currentHeader = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      const header = line.slice(3).trim();
      currentHeader = allowedHeaders.has(header) ? header : null;
      continue;
    }

    if (!currentHeader) {
      continue;
    }

    if (line.startsWith('- ')) {
      const bucket = sections.get(currentHeader) ?? [];
      bucket.push(line);
      sections.set(currentHeader, bucket);
    }
  }

  if (sections.size === 0) {
    return '';
  }

  const orderedHeaders = [
    'Canonieke projectbron',
    'Canonieke projectdocs',
    'Canonieke designbronnen (MVP 1.2.1)',
    'Security',
    'Kwaliteit',
  ];

  const chunks = ['## Korte Appendix — Projectkritische AGENTS-punten'];

  for (const header of orderedHeaders) {
    const bullets = sections.get(header);
    if (!bullets || bullets.length === 0) {
      continue;
    }

    chunks.push(`### ${header}`);
    for (const bullet of bullets) {
      chunks.push(bullet);
    }
    chunks.push('');
  }

  return chunks.join('\n').trim();
}

async function loadSources() {
  const loaded = [];

  for (const source of canonicalSources) {
    const absolutePath = path.join(repoRoot, source.path);
    const content = normalizeLf(await fs.readFile(absolutePath, 'utf8')).trim();
    loaded.push({ ...source, content });
  }

  const appendixAbsolutePath = path.join(repoRoot, appendixSource);
  const appendixRaw = normalizeLf(await fs.readFile(appendixAbsolutePath, 'utf8'));
  const appendixSummary = extractProjectCriticalAgentsSummary(appendixRaw);

  return { loaded, appendixSummary };
}

function renderBundle({ buildTimestamp, commitHash, loadedSources, appendixSummary }) {
  const sourceList = [...canonicalSources.map((item) => item.path), appendixSource];

  const blocks = [];
  blocks.push('# DO NOT EDIT — GENERATED FILE');
  blocks.push('');
  blocks.push(`Build Timestamp (UTC): ${buildTimestamp}`);
  blocks.push(`Source Commit: ${commitHash}`);
  blocks.push('');
  blocks.push('Doel: compacte uploadcontext voor ChatGPT Project, afgeleid van canonieke projectdocs.');
  blocks.push('Upload standaard samen met docs/design/mvp-design-spec-1.2.1.md voor volledige MVP-designwaarheid.');
  blocks.push('Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.');
  blocks.push('');
  blocks.push('## Bronbestanden (vaste volgorde)');
  for (const item of sourceList) {
    blocks.push(`- ${item}`);
  }

  for (const source of loadedSources) {
    blocks.push('');
    blocks.push('---');
    blocks.push('');
    blocks.push(`## ${source.title}`);
    blocks.push('');
    blocks.push(source.content);
  }

  if (appendixSummary) {
    blocks.push('');
    blocks.push('---');
    blocks.push('');
    blocks.push(appendixSummary);
  }

  return `${blocks.join('\n').trim()}\n`;
}

async function main() {
  const isCheckMode = process.argv.includes('--check');
  const { loaded, appendixSummary } = await loadSources();

  let buildTimestamp = new Date().toISOString();
  let commitHash = getHeadCommitHash();

  if (isCheckMode) {
    try {
      const existing = normalizeLf(await fs.readFile(outputPath, 'utf8'));
      const existingTimestamp = extractBuildTimestamp(existing);
      const existingCommit = extractSourceCommit(existing);
      if (existingTimestamp) {
        buildTimestamp = existingTimestamp;
      }
      if (existingCommit) {
        commitHash = existingCommit;
      }
    } catch {
      // Keep current timestamp if file does not exist; check will fail below.
    }
  }

  const expected = renderBundle({
    buildTimestamp,
    commitHash,
    loadedSources: loaded,
    appendixSummary,
  });

  if (isCheckMode) {
    let current = '';
    try {
      current = normalizeLf(await fs.readFile(outputPath, 'utf8'));
    } catch {
      console.error('docs:bundle:verify failed: generated bundle ontbreekt. Draai eerst docs:bundle.');
      process.exit(1);
    }

    if (current !== expected) {
      console.error('docs:bundle:verify failed: generated bundle is niet up-to-date.');
      process.exit(1);
    }

    console.log('docs:bundle:verify ok');
    return;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, expected, 'utf8');
  console.log(`docs:bundle wrote ${path.relative(repoRoot, outputPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
