import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseEpicFile } from './epic-parser';
import { parseTaskFile } from './parser';
import type { ParsedEpicFile, ParsedTaskFile } from './types';

export async function scanTaskDocuments(
  workspaceRoot: string,
  tasksRootRelative: string,
): Promise<ParsedTaskFile[]> {
  return scanMarkdownDocuments(workspaceRoot, tasksRootRelative, parseTaskFile);
}

export async function scanEpicDocuments(
  workspaceRoot: string,
  epicsRootRelative: string,
): Promise<ParsedEpicFile[]> {
  return scanMarkdownDocuments(workspaceRoot, epicsRootRelative, parseEpicFile);
}

async function scanMarkdownDocuments<TDocument>(
  workspaceRoot: string,
  rootRelative: string,
  parse: (input: {
    absolutePath: string;
    relativePath: string;
    content: string;
    version: { mtimeMs: number; hash: string };
  }) => TDocument,
): Promise<TDocument[]> {
  const rootAbsolute = path.resolve(workspaceRoot, rootRelative);
  const files = await walkMarkdownFiles(rootAbsolute);
  const documents: TDocument[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    const stats = await fs.stat(filePath);
    const relativePath = path.relative(workspaceRoot, filePath);
    const hash = createHash('sha1').update(content).digest('hex');

    documents.push(
      parse({
        absolutePath: filePath,
        relativePath,
        content,
        version: {
          mtimeMs: stats.mtimeMs,
          hash,
        },
      }),
    );
  }

  documents.sort((left, right) => {
    const leftPath = (left as { relativePath?: string }).relativePath ?? '';
    const rightPath = (right as { relativePath?: string }).relativePath ?? '';
    return leftPath.localeCompare(rightPath);
  });
  return documents;
}

async function walkMarkdownFiles(root: string): Promise<string[]> {
  const discovered: string[] = [];

  async function walk(directory: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(directory, { withFileTypes: true });
    } catch (error) {
      const normalized = error as NodeJS.ErrnoException;
      if (normalized.code === 'ENOENT') {
        return;
      }
      throw error;
    }

    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        continue;
      }

      if (entry.name === 'README.md' || entry.name === '_template.md') {
        continue;
      }

      discovered.push(fullPath);
    }
  }

  await walk(root);
  return discovered;
}
