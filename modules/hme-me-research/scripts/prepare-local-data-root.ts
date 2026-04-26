import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const localRoot = path.join(projectRoot, '.local-data', 'experiments', 'hme-me-research');
const subdirectories = [
  'downloads',
  'studies',
  'logs',
  'exports',
  'analysis',
  'browser-profile',
] as const;

async function writePlaceholderOnce(filePath: string, content: string) {
  try {
    await writeFile(filePath, content, { flag: 'wx' });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

async function main() {
  await mkdir(localRoot, { recursive: true });

  await Promise.all(
    subdirectories.map((subdirectory) => mkdir(path.join(localRoot, subdirectory), { recursive: true })),
  );

  await writePlaceholderOnce(
    path.join(projectRoot, '.local-data', 'README.md'),
    [
      '# Local data',
      '',
      'This directory is intentionally ignored by Git.',
      'Store real medical data, browser profiles, downloads, logs and exports here only.',
      '',
    ].join('\n'),
  );

  await writePlaceholderOnce(
    path.join(localRoot, 'README.md'),
    [
      '# HME-ME local research data',
      '',
      'Local-only workspace for personal HME-ME research data.',
      'Do not commit anything from this directory.',
      '',
    ].join('\n'),
  );

  await writePlaceholderOnce(
    path.join(localRoot, 'manifest.json'),
    `${JSON.stringify(
      {
        project: 'hme-me-research',
        owner: 'local-private',
        source: 'mijnRadboud',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        studies: [],
      },
      null,
      2,
    )}\n`,
  );

  console.log(`Prepared local HME-ME research data root: ${localRoot}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
