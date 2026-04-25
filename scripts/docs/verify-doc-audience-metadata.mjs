#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

const requiredFields = [
  'title',
  'audience',
  'doc_type',
  'source_role',
  'visual_profile',
  'upload_bundle',
];

const allowed = {
  audience: new Set(['human', 'agent', 'both']),
  source_role: new Set(['canonical', 'operational', 'reference', 'generated', 'archive']),
  visual_profile: new Set(['plain', 'budio-terminal', 'diagram-first']),
  upload_bundle: new Set([
    'none',
    'chatgpt-project-context.md',
    '10-budio-core-product-and-planning.md',
    '20-budio-strategy-research-and-ideas.md',
    '30-budio-build-ai-governance-and-operations.md',
    '40-budio-design-handoff-and-truth.md',
    '50-budio-roadmap-planning-pack.md',
    '60-budio-tasks-current.md',
    '70-budio-tasks-archive.md',
    '80-budio-agent-workflow-and-docs-tooling.md',
  ]),
};

const requiredMetadataPaths = [
  'docs/README.md',
  'docs/project/README.md',
  'docs/project/00-docs-governance/README.md',
  'docs/project/master-project.md',
  'docs/project/product-vision-mvp.md',
  'docs/project/current-status.md',
  'docs/project/open-points.md',
  'docs/project/content-processing-rules.md',
  'docs/project/copy-instructions.md',
  'docs/project/ui-modals.md',
  'docs/project/ai-quality-studio.md',
  'docs/project/10-strategy/README.md',
  'docs/project/10-strategy/10-long-term-strategy.md',
  'docs/project/20-planning/README.md',
  'docs/project/20-planning/30-now-next-later.md',
  'docs/project/20-planning/70-post-basis-6-month-roadmap.md',
  'docs/project/20-planning/_templates/month-block-roadmap-template.md',
  'docs/project/20-planning/_templates/epic-roadmap-item-template.md',
  'docs/project/30-research/README.md',
  'docs/project/30-research/30-budio-podcaster-solo-expert-wedge-plan.md',
  'docs/project/40-ideas/README.md',
  'docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md',
  'docs/dev/README.md',
  'docs/dev/cline-workflow.md',
  'docs/dev/ai-execution-os-generic.md',
  'docs/dev/task-lifecycle-workflow.md',
  'docs/dev/roadmap-planning-workflow.md',
  'docs/setup/step-0-readiness.md',
  'docs/setup/developer-docs-environment.md',
];

function parseFrontmatter(content) {
  const match = String(content).match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return null;
  }

  const metadata = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf(':');
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/, '$1');
    metadata[key] = value;
  }

  return metadata;
}

async function main() {
  const issues = [];

  for (const relativePath of requiredMetadataPaths) {
    const absolutePath = path.join(repoRoot, relativePath);
    let content;
    try {
      content = await fs.readFile(absolutePath, 'utf8');
    } catch {
      issues.push(`${relativePath}: ontbreekt`);
      continue;
    }

    const metadata = parseFrontmatter(content);
    if (!metadata) {
      issues.push(`${relativePath}: mist frontmatter`);
      continue;
    }

    for (const field of requiredFields) {
      if (!metadata[field]) {
        issues.push(`${relativePath}: mist metadata veld '${field}'`);
      }
    }

    for (const [field, allowedValues] of Object.entries(allowed)) {
      const value = metadata[field];
      if (value && !allowedValues.has(value)) {
        issues.push(`${relativePath}: ongeldig ${field} '${value}'`);
      }
    }

    if (metadata.audience === 'agent' && metadata.visual_profile !== 'plain') {
      issues.push(`${relativePath}: agent-only docs gebruiken visual_profile plain`);
    }
  }

  if (issues.length > 0) {
    console.error(`docs:audience:verify failed:\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
    process.exit(1);
  }

  console.log(`docs:audience:verify ok (${requiredMetadataPaths.length} docs checked)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
