import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseTaskFile } from './parser';
import type { ParsedTaskFile } from './types';

export async function scanTaskDocuments(
  workspaceRoot: string,
  tasksRootRelative: string,
): Promise<ParsedTaskFile[]> {
  const tasksRootAbsolute = path.resolve(workspaceRoot, tasksRootRelative);
  const files = await walkMarkdownFiles(tasksRootAbsolute);
  const tasks: ParsedTaskFile[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    const stats = await fs.stat(filePath);
    const relativePath = path.relative(workspaceRoot, filePath);
    const hash = createHash('sha1').update(content).digest('hex');

    tasks.push(
      parseTaskFile({
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

  tasks.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
  return tasks;
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
