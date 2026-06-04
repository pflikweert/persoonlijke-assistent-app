import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

function collectTsFiles(rootDir: string): string[] {
  const output: string[] = [];
  for (const entry of readdirSync(rootDir)) {
    const fullPath = path.join(rootDir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      output.push(...collectTsFiles(fullPath));
      continue;
    }
    if (stats.isFile() && fullPath.endsWith('.ts')) {
      output.push(fullPath);
    }
  }
  return output;
}

describe('supabase function import boundaries', () => {
  it('keeps local function imports inside supabase/functions', () => {
    const repoRoot = process.cwd();
    const functionsRoot = path.join(repoRoot, 'supabase', 'functions');
    const offendingImports: string[] = [];

    for (const filePath of collectTsFiles(functionsRoot)) {
      const source = readFileSync(filePath, 'utf8');
      const matches = source.matchAll(/from\s+['"]([^'"]+)['"]/g);
      for (const match of matches) {
        const importPath = match[1];
        if (!importPath.startsWith('.')) {
          continue;
        }

        const resolved = path.resolve(path.dirname(filePath), importPath);
        if (!resolved.startsWith(functionsRoot)) {
          offendingImports.push(
            `${path.relative(repoRoot, filePath)} -> ${importPath}`
          );
        }
      }
    }

    expect(offendingImports).toEqual([]);
  });
});
