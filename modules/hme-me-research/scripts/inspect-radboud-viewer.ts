import { chromium, type Download, type Page, type Request, type Response } from '@playwright/test';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

type DownloadStatus = 'pending' | 'inventoried' | 'partial' | 'downloaded' | 'failed' | 'skipped';

type NetworkEvent = {
  captured_at: string;
  event_type: 'request' | 'response' | 'download';
  method?: string;
  resource_type?: string;
  status?: number;
  content_type?: string;
  sanitized_url: string;
};

type Manifest = {
  project: 'hme-me-research';
  owner: 'local-private';
  source: 'mijnRadboud';
  created_at: string;
  updated_at: string;
  studies: Array<{
    study_slug: string;
    source_platform: 'mijnRadboud';
    source_system: 'Epic/MyChart';
    title: string;
    download_status: DownloadStatus;
    series: Array<{
      series_index: number;
      series_label: string;
      download_status: DownloadStatus;
      assets: Array<{
        asset_id: string;
        source_kind: 'network' | 'download';
        sanitized_url: string;
        local_path: string;
        download_status: DownloadStatus;
      }>;
    }>;
  }>;
};

const projectRoot = process.cwd();
const localRoot = path.join(projectRoot, '.local-data', 'experiments', 'hme-me-research');
const logsRoot = path.join(localRoot, 'logs');
const downloadsRoot = path.join(localRoot, 'downloads');
const browserProfileRoot = path.join(localRoot, 'browser-profile');
const manifestPath = path.join(localRoot, 'manifest.json');
const networkLogPath = path.join(logsRoot, `network-${timestampForFile()}.jsonl`);
const downloadLogPath = path.join(logsRoot, 'download-log.jsonl');
const shouldDownloadOne = process.argv.includes('--download-one');
const networkEvents: NetworkEvent[] = [];

function timestampForFile() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function sanitizeUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    for (const key of [...url.searchParams.keys()]) {
      url.searchParams.set(key, '[redacted]');
    }
    url.username = '';
    url.password = '';
    url.hash = '';
    return url.toString();
  } catch {
    return '[unparseable-url]';
  }
}

function looksRelevant(url: string) {
  return /image|dicom|series|study|thumbnail|wado|wadors|blob|file|radiolog|viewer|xray|ct|mri/i.test(url);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function ensureLocalRoot() {
  await mkdir(logsRoot, { recursive: true });
  await mkdir(downloadsRoot, { recursive: true });
  await mkdir(browserProfileRoot, { recursive: true });
}

async function readManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8')) as Manifest;
  } catch {
    const now = new Date().toISOString();
    return {
      project: 'hme-me-research',
      owner: 'local-private',
      source: 'mijnRadboud',
      created_at: now,
      updated_at: now,
      studies: [],
    };
  }
}

async function appendJsonl(filePath: string, value: unknown) {
  await appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

async function recordNetworkEvent(event: NetworkEvent) {
  networkEvents.push(event);
  await appendJsonl(networkLogPath, event);
}

async function handleRequest(request: Request) {
  const url = request.url();
  if (!looksRelevant(url)) {
    return;
  }

  await recordNetworkEvent({
    captured_at: new Date().toISOString(),
    event_type: 'request',
    method: request.method(),
    resource_type: request.resourceType(),
    sanitized_url: sanitizeUrl(url),
  });
}

async function handleResponse(response: Response) {
  const url = response.url();
  if (!looksRelevant(url)) {
    return;
  }

  await recordNetworkEvent({
    captured_at: new Date().toISOString(),
    event_type: 'response',
    status: response.status(),
    content_type: response.headers()['content-type'],
    sanitized_url: sanitizeUrl(url),
  });
}

async function extractVisibleInventory(page: Page) {
  const textBlocks = await page
    .locator('body')
    .evaluate((body) =>
      Array.from(body.querySelectorAll('a, button, [role="button"], [role="row"], [data-testid], li, h1, h2, h3'))
        .map((element) => element.textContent?.replace(/\s+/g, ' ').trim())
        .filter((text): text is string => Boolean(text && text.length >= 3))
        .slice(0, 250),
    );

  const studyCandidates = Array.from(
    new Set(
      textBlocks.filter((text) =>
        /\b(CR|CT|MR|MRI|XR|RX|radiolog|röntgen|rontgen|echo|scan|knie|bekken|wervel|bovenbeen|whole body)\b/i.test(text),
      ),
    ),
  ).slice(0, 50);

  const seriesCandidates = Array.from(
    new Set(textBlocks.filter((text) => /\b(series|serie|slice|image|beeld|bone|abdomen|pelvis|default)\b/i.test(text))),
  ).slice(0, 50);

  return { captured_at: new Date().toISOString(), studyCandidates, seriesCandidates };
}

async function saveOptionalDownload(download: Download) {
  const suggestedName = download.suggestedFilename();
  const safeName = suggestedName.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 120) || `download-${timestampForFile()}`;
  const targetPath = path.join(downloadsRoot, safeName);

  if (!shouldDownloadOne) {
    await appendJsonl(downloadLogPath, {
      captured_at: new Date().toISOString(),
      download_status: 'skipped',
      reason: 'Run without --download-one',
      suggested_filename: safeName,
    });
    return;
  }

  await download.saveAs(targetPath);
  await appendJsonl(downloadLogPath, {
    captured_at: new Date().toISOString(),
    download_status: 'downloaded',
    local_path: path.relative(projectRoot, targetPath),
    suggested_filename: safeName,
  });

  await recordNetworkEvent({
    captured_at: new Date().toISOString(),
    event_type: 'download',
    sanitized_url: sanitizeUrl(download.url()),
  });
}

async function updateManifest(page: Page) {
  const manifest = await readManifest();
  const inventory = await extractVisibleInventory(page);
  const now = new Date().toISOString();

  const existingSlugs = new Set(manifest.studies.map((study) => study.study_slug));
  for (const title of inventory.studyCandidates) {
    const slug = slugify(title) || `study-${manifest.studies.length + 1}`;
    if (existingSlugs.has(slug)) {
      continue;
    }

    manifest.studies.push({
      study_slug: slug,
      source_platform: 'mijnRadboud',
      source_system: 'Epic/MyChart',
      title,
      download_status: 'inventoried',
      series: [],
    });
    existingSlugs.add(slug);
  }

  const inventorySeries = inventory.seriesCandidates.map((series_label, index) => ({
    series_index: index + 1,
    series_label,
    download_status: 'inventoried' as DownloadStatus,
    assets: [],
  }));

  if (manifest.studies.length === 0 && inventorySeries.length > 0) {
    manifest.studies.push({
      study_slug: `manual-viewer-inventory-${timestampForFile()}`,
      source_platform: 'mijnRadboud',
      source_system: 'Epic/MyChart',
      title: 'Manual viewer inventory',
      download_status: 'inventoried',
      series: inventorySeries,
    });
  } else if (manifest.studies.length > 0 && inventorySeries.length > 0) {
    const lastStudy = manifest.studies[manifest.studies.length - 1];
    const knownLabels = new Set(lastStudy.series.map((series) => series.series_label));
    for (const series of inventorySeries) {
      if (!knownLabels.has(series.series_label)) {
        lastStudy.series.push(series);
      }
    }
  }

  manifest.updated_at = now;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await writeFile(path.join(logsRoot, `dom-inventory-${timestampForFile()}.json`), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
}

async function main() {
  await ensureLocalRoot();

  console.log('HME-ME mijnRadboud viewer inspectie');
  console.log('Log handmatig in en open de beeldenpagina. Dit script automatiseert DigiD, MFA of login niet.');
  console.log('Netwerklogs worden lokaal gesanitized opgeslagen zonder cookies, auth headers of bodies.');

  const context = await chromium.launchPersistentContext(browserProfileRoot, {
    acceptDownloads: true,
    headless: false,
  });
  const page = context.pages()[0] ?? (await context.newPage());

  page.on('request', (request) => {
    void handleRequest(request);
  });
  page.on('response', (response) => {
    void handleResponse(response);
  });
  page.on('download', (download) => {
    void saveOptionalDownload(download);
  });

  const rl = createInterface({ input, output });
  await rl.question('Log handmatig in en open de beeldenpagina. Druk daarna op Enter om te inventariseren. ');
  await updateManifest(page);
  console.log('Eerste inventaris opgeslagen. Open nu handmatig maximaal 1 study/series in de viewer.');
  await rl.question('Druk op Enter wanneer je klaar bent met openen, dan slaat het script de laatste inventaris op. ');
  await updateManifest(page);
  rl.close();

  await writeFile(
    path.join(logsRoot, `network-summary-${timestampForFile()}.json`),
    `${JSON.stringify({ captured_at: new Date().toISOString(), event_count: networkEvents.length }, null, 2)}\n`,
    'utf8',
  );

  await context.close();
  console.log(`Klaar. Lokale output staat onder: ${localRoot}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
