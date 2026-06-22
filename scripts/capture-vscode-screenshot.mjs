#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const MACOS_SCREEN_CAPTURE_SETTINGS_URL =
  'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture';

const args = parseArgs(process.argv.slice(2));

if (process.platform !== 'darwin') {
  fail('unsupported', 'VS Code screenshot capture is momenteel alleen voor macOS ingericht.');
}

if (args.openSettings) {
  const opened = run('open', [MACOS_SCREEN_CAPTURE_SETTINGS_URL]);
  if (opened.status !== 0) {
    fail('failed', `Kon macOS Screen Recording instellingen niet openen: ${formatResult(opened)}`);
  }
  console.log('macOS Screen Recording instellingen geopend.');
  if (!args.captureAfterSettings) {
    process.exit(0);
  }
}

const outputPath = resolve(args.out ?? defaultOutputPath());
mkdirSync(dirname(outputPath), { recursive: true });

if (!args.noActivate) {
  const activated = run('osascript', [
    '-e',
    'tell application "Visual Studio Code" to activate',
  ]);
  if (activated.status !== 0) {
    console.warn(`Waarschuwing: VS Code activeren lukte niet: ${formatResult(activated)}`);
  }
}

const captured = run('screencapture', ['-x', outputPath]);
if (captured.status !== 0 || !isUsablePng(outputPath)) {
  const detail = formatResult(captured);
  if (isLikelyScreenRecordingBlocked(detail)) {
    fail(
      'permission_blocked',
      [
        'macOS blokkeert screenshot capture waarschijnlijk via Screen Recording permissies.',
        'Geef de host-app die Codex/terminal draait toegang via System Settings > Privacy & Security > Screen & System Audio Recording.',
        'Run eventueel: npm run plugin:vscode:screenshot -- --open-settings',
        'Herstart daarna de terminal/Codex-host en probeer opnieuw.',
        `Originele fout: ${detail || 'screencapture leverde geen bruikbare PNG op.'}`,
      ].join('\n'),
    );
  }

  fail('failed', `Screenshot capture mislukt: ${detail || 'geen bruikbare PNG geschreven.'}`);
}

const size = statSync(outputPath).size;
console.log(`VS Code screenshot geschreven: ${outputPath} (${formatBytes(size)})`);

function parseArgs(argv) {
  const parsed = {
    out: null,
    openSettings: false,
    captureAfterSettings: false,
    noActivate: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--out') {
      parsed.out = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === '--open-settings') {
      parsed.openSettings = true;
      continue;
    }
    if (arg === '--capture-after-settings') {
      parsed.openSettings = true;
      parsed.captureAfterSettings = true;
      continue;
    }
    if (arg === '--no-activate') {
      parsed.noActivate = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
    fail('failed', `Onbekende optie: ${arg}`);
  }

  return parsed;
}

function defaultOutputPath() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `/tmp/budio-vscode-screenshot-${stamp}.png`;
}

function run(command, commandArgs) {
  return spawnSync(command, commandArgs, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function isUsablePng(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }
  const stats = statSync(filePath);
  if (stats.size < 8) {
    return false;
  }
  const header = readFileSync(filePath, { start: 0, end: 7 });
  return (
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a
  );
}

function isLikelyScreenRecordingBlocked(detail) {
  const normalized = detail.toLowerCase();
  return (
    normalized.includes('could not create image from display') ||
    normalized.includes('not authorized') ||
    normalized.includes('screen recording') ||
    normalized.includes('tcc')
  );
}

function formatResult(result) {
  return [result.stderr, result.stdout]
    .filter(Boolean)
    .join('\n')
    .trim();
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fail(code, message) {
  console.error(`VS Code screenshot ${code}:`);
  console.error(message);
  process.exit(1);
}

function printHelp() {
  console.log(`Usage:
  npm run plugin:vscode:screenshot
  npm run plugin:vscode:screenshot -- --out /tmp/budio-vscode.png
  npm run plugin:vscode:screenshot -- --open-settings

Options:
  --out <path>              Schrijf screenshot naar dit PNG-pad.
  --open-settings           Open macOS Screen Recording privacy-instellingen.
  --capture-after-settings  Open instellingen en probeer daarna alsnog capture.
  --no-activate             Activeer VS Code niet vooraf.
`);
}
