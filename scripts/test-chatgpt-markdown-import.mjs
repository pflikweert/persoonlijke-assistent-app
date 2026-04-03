import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const fixturePath = path.join(rootDir, 'docs/dev/Dagboek voor gemoedstoestand.md');
const parserPath = pathToFileURL(path.join(rootDir, 'services/import/chatgpt-markdown-parser.ts')).href;
const { parseChatGptMarkdownFile } = await import(parserPath);

const markdown = await fs.readFile(fixturePath, 'utf8');
const preview = parseChatGptMarkdownFile({
  fileName: 'Dagboek voor gemoedstoestand.md',
  markdown,
});

const expectedUserBlocks = markdown
  .split(/(?=^>\[!nexus_(?:user|agent)\])/gm)
  .filter((block) => block.startsWith('>[!nexus_user]'))
  .filter((block) =>
    block
      .split('\n')
      .slice(1)
      .some((line) => line.startsWith('>') && line.replace(/^>\s?/, '').trim().length > 0)
  ).length;
const expectedAssistantBlocks = (markdown.match(/^>\[!nexus_agent\]/gm) ?? []).length;

assert.ok(expectedUserBlocks > 0, 'Fixture should contain user blocks.');
assert.ok(expectedAssistantBlocks > 0, 'Fixture should contain assistant blocks.');
assert.equal(preview.messages.length, expectedUserBlocks, 'Only user blocks should be parsed.');
assert.equal(
  preview.messages.filter((message) => message.sourceHeader.includes('nexus_agent')).length,
  0,
  'Assistant blocks should be ignored.'
);
assert.equal(preview.userEntryCount, expectedUserBlocks, 'Preview count should match user block count.');
assert.ok(preview.firstDate, 'First date should be present.');
assert.ok(preview.lastDate, 'Last date should be present.');
assert.equal(preview.firstDate, '2025-10-01T08:12:16.000Z');
assert.equal(preview.messages[0]?.externalMessageId, 'bbb212ba-3e2f-485c-be60-4312b0430c11');

const uniqueDays = new Set(preview.messages.map((message) => message.capturedAt.slice(0, 10)));
assert.equal(preview.uniqueDayCount, uniqueDays.size, 'Unique day count should match parsed messages.');
assert.equal(preview.exampleEntries.length, 3, 'Preview should contain 3 example entries.');
assert.ok(preview.sourceRef.length > 0, 'Source ref should be set.');

console.log(
  `ChatGPT markdown parser tests passed. userEntries=${preview.userEntryCount} uniqueDays=${preview.uniqueDayCount}`
);
