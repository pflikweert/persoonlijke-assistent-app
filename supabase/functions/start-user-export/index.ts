import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime remote module import.
import JSZip from 'https://esm.sh/jszip@3.10.1';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';

const FLOW = 'start-user-export' as const;
const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

type DateScope =
  | { kind: 'all' }
  | { kind: 'day'; date: string }
  | { kind: 'week' | 'month' | 'range'; startDate: string; endDate: string; label?: string };

type ExportInput = {
  mode?: unknown;
  scope?: unknown;
  includeMoments?: unknown;
  includeDays?: unknown;
  includeWeeks?: unknown;
  includeMonths?: unknown;
  includeAudio?: unknown;
};

type EntryRow = {
  id: string;
  captured_at: string;
  journal_date: string | null;
  source_type: string;
  audio_storage_path: string | null;
  audio_mime_type: string | null;
};

type NormalizedRow = {
  raw_entry_id: string;
  body: string;
};

type DayRow = {
  journal_date: string;
  summary: string;
  narrative_text: string;
};

type ReflectionRow = {
  period_type: string;
  period_start: string;
  period_end: string;
  summary_text: string;
  narrative_text: string;
};

type MappedEntry = {
  id: string;
  capturedAt: string;
  journalDate: string | null;
  sourceType: 'text' | 'audio';
  body: string;
  audioStoragePath: string | null;
  audioMimeType: string | null;
};

type MarkdownFile = {
  path: string;
  body: string;
};

type AudioFile = {
  path: string;
  bucketPath: string;
  mimeType: string | null;
};

type DayPaths = {
  year: string;
  monthFolder: string;
  monthKey: string;
  monthPath: string;
  dayFolder: string;
  dayPath: string;
  dayFileName: string;
  dayFilePath: string;
  momentDirPath: string;
  audioDirPath: string;
};

function readEnv(name: string): string {
  return Deno.env.get(name)?.trim() ?? '';
}

function getRuntimeSupabaseEnv(): { supabaseUrl: string; supabaseAnonKey: string } {
  const target = (readEnv('EXPO_PUBLIC_SUPABASE_TARGET') || 'cloud').toLowerCase();
  const selectedUrl =
    target === 'local'
      ? readEnv('EXPO_PUBLIC_SUPABASE_LOCAL_URL') || readEnv('EXPO_PUBLIC_SUPABASE_URL')
      : readEnv('EXPO_PUBLIC_SUPABASE_CLOUD_URL') || readEnv('EXPO_PUBLIC_SUPABASE_URL');
  const selectedKey =
    target === 'local'
      ? readEnv('EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY') || readEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
      : readEnv('EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY') || readEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

  const supabaseUrl = readEnv('SUPABASE_URL') || selectedUrl;
  const supabaseAnonKey = readEnv('SUPABASE_ANON_KEY') || selectedKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase runtime env.');
  }

  return { supabaseUrl, supabaseAnonKey };
}

function buildCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') ?? '*';
  return {
    ...CORS_BASE_HEADERS,
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
  };
}

function jsonResponse(request: Request, status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...buildCorsHeaders(request),
      'Content-Type': 'application/json',
    },
  });
}

function errorResponse(input: {
  request: Request;
  httpStatus: number;
  requestId: string;
  flowId: string;
  step: string;
  code: FlowErrorCode;
  message: string;
  details?: Record<string, unknown>;
}) {
  return jsonResponse(
    input.request,
    input.httpStatus,
    createFlowError({
      flow: FLOW,
      requestId: input.requestId,
      flowId: input.flowId,
      step: input.step,
      code: input.code,
      message: input.message,
      ...(input.details ? { details: input.details } : {}),
    }),
  );
}

function parseFlowId(request: Request, requestId: string): string {
  const flowId = request.headers.get('x-flow-id')?.trim() ?? '';
  return flowId.length > 0 ? flowId : requestId;
}

function parseBool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function parseDate(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

function parseScope(value: unknown): DateScope {
  if (!value || typeof value !== 'object') {
    return { kind: 'all' };
  }
  const candidate = value as Record<string, unknown>;
  const kind = candidate.kind;
  if (kind === 'all') {
    return { kind: 'all' };
  }
  if (kind === 'day') {
    const date = parseDate(candidate.date);
    if (!date) {
      throw new Error('Ongeldige dagscope.');
    }
    return { kind: 'day', date };
  }
  if (kind === 'week' || kind === 'month' || kind === 'range') {
    const startDate = parseDate(candidate.startDate);
    const endDate = parseDate(candidate.endDate);
    if (!startDate || !endDate) {
      throw new Error('Ongeldige periodescope.');
    }
    return {
      kind,
      startDate,
      endDate,
      ...(typeof candidate.label === 'string' ? { label: candidate.label } : {}),
    };
  }
  return { kind: 'all' };
}

function normalizeBounds(startDate: string, endDate: string): { startDate: string; endDate: string } {
  return startDate <= endDate ? { startDate, endDate } : { startDate: endDate, endDate: startDate };
}

function scopeBounds(scope: DateScope): { startDate: string | null; endDate: string | null } {
  if (scope.kind === 'all') {
    return { startDate: null, endDate: null };
  }
  if (scope.kind === 'day') {
    return { startDate: scope.date, endDate: scope.date };
  }
  return normalizeBounds(scope.startDate, scope.endDate);
}

function inBounds(date: string | null | undefined, bounds: { startDate: string | null; endDate: string | null }) {
  if (!date) {
    return false;
  }
  if (!bounds.startDate || !bounds.endDate) {
    return true;
  }
  return date >= bounds.startDate && date <= bounds.endDate;
}

function overlapsBounds(start: string, end: string, bounds: { startDate: string | null; endDate: string | null }) {
  if (!bounds.startDate || !bounds.endDate) {
    return true;
  }
  return start <= bounds.endDate && end >= bounds.startDate;
}

function toSlug(value: string, fallback: string): string {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized.slice(0, 48) || fallback;
}

function weekdayLabel(date: string): string {
  const parsed = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return 'dag';
  }
  return parsed
    .toLocaleDateString('nl-NL', { weekday: 'long', timeZone: 'UTC' })
    .toLowerCase();
}

function monthLabel(date: string): string {
  const parsed = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return 'maand';
  }
  return parsed
    .toLocaleDateString('nl-NL', { month: 'long', timeZone: 'UTC' })
    .toLowerCase();
}

function isoWeek(dateValue: string): { year: number; week: number } {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return { year: 1970, week: 1 };
  }
  const target = new Date(date.valueOf());
  const dayNr = (date.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);
  const weekNo = 1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000);
  return { year: target.getUTCFullYear(), week: weekNo };
}

function toTimeLabel(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return '0000';
  }
  const hh = String(parsed.getHours()).padStart(2, '0');
  const mm = String(parsed.getMinutes()).padStart(2, '0');
  return `${hh}${mm}`;
}

function nowStamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${mi}`;
}

function monthFolderName(date: string): string {
  const parsed = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return `${date.slice(0, 7)}-maand`;
  }
  const year = String(parsed.getUTCFullYear());
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}-${monthLabel(date)}`;
}

function buildDayPaths(rootName: string, dayDate: string): DayPaths {
  const year = dayDate.slice(0, 4);
  const monthFolder = monthFolderName(dayDate);
  const monthPath = `${rootName}/${year}/${monthFolder}`;
  const dayFolder = `${dayDate}-${weekdayLabel(dayDate)}`;
  const dayPath = `${monthPath}/dagen/${dayFolder}`;
  const dayFileName = `${dayDate.replace(/-/g, '')}-dag.md`;
  return {
    year,
    monthFolder,
    monthKey: `${year}/${monthFolder}`,
    monthPath,
    dayFolder,
    dayPath,
    dayFileName,
    dayFilePath: `${dayPath}/${dayFileName}`,
    momentDirPath: `${dayPath}/momenten`,
    audioDirPath: `${dayPath}/audio`,
  };
}

function relativePath(fromFilePath: string, toPath: string): string {
  const fromParts = fromFilePath.split('/').slice(0, -1);
  const toParts = toPath.split('/');
  let shared = 0;
  while (shared < fromParts.length && shared < toParts.length && fromParts[shared] === toParts[shared]) {
    shared += 1;
  }
  const up = fromParts.slice(shared).map(() => '..');
  const down = toParts.slice(shared);
  const combined = [...up, ...down];
  return combined.length > 0 ? combined.join('/') : '.';
}

function mimeToExtension(mime: string | null): string {
  const normalized = (mime ?? '').toLowerCase();
  if (normalized.includes('mpeg') || normalized.includes('mp3')) return 'mp3';
  if (normalized.includes('wav')) return 'wav';
  if (normalized.includes('m4a') || normalized.includes('mp4')) return 'm4a';
  if (normalized.includes('ogg')) return 'ogg';
  return 'bin';
}

function parseInput(body: ExportInput): {
  scope: DateScope;
  includeMoments: boolean;
  includeDays: boolean;
  includeWeeks: boolean;
  includeMonths: boolean;
  includeAudio: boolean;
} {
  const mode = typeof body.mode === 'string' ? body.mode.trim() : 'structured';
  if (mode !== 'structured') {
    throw new Error('Alleen structured mode wordt ondersteund.');
  }

  const scope = parseScope(body.scope);
  const includeMoments = parseBool(body.includeMoments, true);
  const includeDays = parseBool(body.includeDays, true);
  const includeWeeks = parseBool(body.includeWeeks, true);
  const includeMonths = parseBool(body.includeMonths, true);
  const includeAudio = parseBool(body.includeAudio, false);

  if (!includeMoments && !includeDays && !includeWeeks && !includeMonths) {
    throw new Error('Kies minimaal één exportonderdeel.');
  }

  return { scope, includeMoments, includeDays, includeWeeks, includeMonths, includeAudio };
}

async function updateTask(input: {
  supabase: ReturnType<typeof createClient>;
  taskId: string;
  userId: string;
  patch: Record<string, unknown>;
}) {
  const timestamp = new Date().toISOString();
  const { error } = await input.supabase
    .from('user_background_tasks')
    .update({
      ...input.patch,
      updated_at: timestamp,
      last_update_at: timestamp,
    })
    .eq('id', input.taskId)
    .eq('user_id', input.userId);

  if (error) {
    throw new Error('Kon taskstatus niet bijwerken.');
  }
}

async function runExport(input: {
  supabase: ReturnType<typeof createClient>;
  taskId: string;
  userId: string;
  options: ReturnType<typeof parseInput>;
}) {
  await updateTask({
    supabase: input.supabase,
    taskId: input.taskId,
    userId: input.userId,
    patch: {
      status: 'running',
      phase: 'snapshot',
      progress_current: 1,
      progress_total: 4,
      detail_label: 'Brondata laden',
      started_at: new Date().toISOString(),
      error_message: null,
      warning_count: 0,
    },
  });

  const bounds = scopeBounds(input.options.scope);

  const [entriesRawResult, normalizedResult, daysResult, reflectionsResult] = await Promise.all([
    input.supabase
      .from('entries_raw')
      .select('id, captured_at, journal_date, source_type, audio_storage_path, audio_mime_type')
      .order('captured_at', { ascending: true }),
    input.supabase.from('entries_normalized').select('raw_entry_id, body'),
    input.supabase
      .from('day_journals')
      .select('journal_date, summary, narrative_text')
      .order('journal_date', { ascending: true }),
    input.supabase
      .from('period_reflections')
      .select('period_type, period_start, period_end, summary_text, narrative_text')
      .order('period_start', { ascending: true }),
  ]);

  if (entriesRawResult.error || normalizedResult.error || daysResult.error || reflectionsResult.error) {
    throw new Error('Kon exportbrondata niet laden.');
  }

  const normalizedByRaw = new Map<string, string>(
    ((normalizedResult.data ?? []) as NormalizedRow[]).map((row) => [row.raw_entry_id, row.body]),
  );

  const entries: MappedEntry[] = ((entriesRawResult.data ?? []) as EntryRow[])
    .map((row) => {
      const body = normalizedByRaw.get(row.id)?.trim();
      if (!body) {
        return null;
      }
      const fallbackDate = row.captured_at.slice(0, 10);
      const targetDate = row.journal_date ?? fallbackDate;
      if (!inBounds(targetDate, bounds)) {
        return null;
      }
      return {
        id: row.id,
        capturedAt: row.captured_at,
        journalDate: row.journal_date,
        sourceType: row.source_type === 'audio' ? 'audio' : 'text',
        body,
        audioStoragePath: row.audio_storage_path,
        audioMimeType: row.audio_mime_type,
      } satisfies MappedEntry;
    })
    .filter((row): row is MappedEntry => row !== null);

  const days = ((daysResult.data ?? []) as DayRow[]).filter((row) => inBounds(row.journal_date, bounds));
  const weekReflections = ((reflectionsResult.data ?? []) as ReflectionRow[]).filter(
    (row) => row.period_type === 'week' && overlapsBounds(row.period_start, row.period_end, bounds),
  );
  const monthReflections = ((reflectionsResult.data ?? []) as ReflectionRow[]).filter(
    (row) => row.period_type === 'month' && overlapsBounds(row.period_start, row.period_end, bounds),
  );

  await updateTask({
    supabase: input.supabase,
    taskId: input.taskId,
    userId: input.userId,
    patch: {
      phase: 'build',
      progress_current: 2,
      progress_total: 4,
      detail_label: 'Markdownstructuur bouwen',
    },
  });

  const stamp = nowStamp();
  const rootName = `budio-export-${stamp}`;
  const markdownFiles: MarkdownFile[] = [];
  const audioFiles: AudioFile[] = [];
  const warnings: string[] = [];
  let missingAudioPathCount = 0;

  const entriesByDay = new Map<string, MappedEntry[]>();
  for (const entry of entries) {
    const date = entry.journalDate ?? entry.capturedAt.slice(0, 10);
    const bucket = entriesByDay.get(date) ?? [];
    bucket.push(entry);
    entriesByDay.set(date, bucket);
  }

  const dayByDate = new Map<string, DayRow>(days.map((day) => [day.journal_date, day]));
  const allDayDates = Array.from(
    new Set<string>([
      ...days.map((day) => day.journal_date),
      ...entries.map((entry) => entry.journalDate ?? entry.capturedAt.slice(0, 10)),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  const dayPathsByDate = new Map<string, DayPaths>();
  const monthPathByKey = new Map<string, string>();
  const monthDaysByKey = new Map<string, string[]>();
  for (const dayDate of allDayDates) {
    const dayPaths = buildDayPaths(rootName, dayDate);
    dayPathsByDate.set(dayDate, dayPaths);
    monthPathByKey.set(dayPaths.monthKey, dayPaths.monthPath);
    const monthDates = monthDaysByKey.get(dayPaths.monthKey) ?? [];
    monthDates.push(dayDate);
    monthDaysByKey.set(dayPaths.monthKey, monthDates);
  }

  const weekFilePaths: string[] = [];
  const monthFilePaths: string[] = [];

  if (input.options.includeMoments) {
    for (const dayDate of allDayDates) {
      const dayPaths = dayPathsByDate.get(dayDate);
      if (!dayPaths) {
        continue;
      }
      const dayEntries = entriesByDay.get(dayDate) ?? [];
      for (const entry of dayEntries) {
        const typeLabel = entry.sourceType === 'audio' ? 'spraak' : 'tekst';
        const slug = toSlug(entry.body.split('\n')[0] || entry.body, 'moment');
        const basename = `${dayDate.replace(/-/g, '')}-${toTimeLabel(entry.capturedAt)}-${typeLabel}-${slug}`;
        const momentPath = `${dayPaths.momentDirPath}/${basename}.md`;
        const dayLink = relativePath(momentPath, dayPaths.dayFilePath);
        const audioExt = mimeToExtension(entry.audioMimeType);
        const audioPath = `${dayPaths.audioDirPath}/${basename}.${audioExt}`;

        markdownFiles.push({
          path: momentPath,
          body: [
            `# Moment ${dayDate} ${toTimeLabel(entry.capturedAt).slice(0, 2)}:${toTimeLabel(entry.capturedAt).slice(2, 4)}`,
            '',
            `- [Dag](${dayLink})`,
            ...(input.options.includeAudio && entry.sourceType === 'audio' && entry.audioStoragePath
              ? [`- [Audio](${relativePath(momentPath, audioPath)})`, '']
              : ['']),
            '',
            entry.body,
            '',
          ].join('\n'),
        });

        if (input.options.includeAudio && entry.sourceType === 'audio') {
          if (!entry.audioStoragePath) {
            warnings.push(`Audio ontbreekt voor moment ${basename}.`);
            missingAudioPathCount += 1;
          } else {
            audioFiles.push({
              path: audioPath,
              bucketPath: entry.audioStoragePath,
              mimeType: entry.audioMimeType,
            });
          }
        }
      }
    }
  }

  if (input.options.includeDays) {
    for (const dayDate of allDayDates) {
      const dayPaths = dayPathsByDate.get(dayDate);
      if (!dayPaths) {
        continue;
      }
      const day = dayByDate.get(dayDate);
      const dayPath = dayPaths.dayFilePath;
      const dayEntries = entriesByDay.get(dayDate) ?? [];
      const entriesList = input.options.includeMoments ? dayEntries : [];
      const audioEntries = input.options.includeMoments && input.options.includeAudio
        ? dayEntries.filter((entry) => entry.sourceType === 'audio' && Boolean(entry.audioStoragePath))
        : [];

      markdownFiles.push({
        path: dayPath,
        body: [
          `# Dag ${dayDate}`,
          '',
          day?.summary || '-',
          '',
          day?.narrative_text || '-',
          '',
          '## Momenten',
          '',
          ...(entriesList.length === 0
            ? ['Geen momenten in deze selectie.']
            : entriesList.map((entry) => {
                const typeLabel = entry.sourceType === 'audio' ? 'spraak' : 'tekst';
                const slug = toSlug(entry.body.split('\n')[0] || entry.body, 'moment');
                const basename = `${dayDate.replace(/-/g, '')}-${toTimeLabel(entry.capturedAt)}-${typeLabel}-${slug}`;
                const momentPath = `${dayPaths.momentDirPath}/${basename}.md`;
                return `- [${basename}](${relativePath(dayPath, momentPath)})`;
              })),
          '',
          '## Audio',
          '',
          ...(audioEntries.length === 0
            ? ['Geen audio in deze selectie.']
            : audioEntries.map((entry) => {
                const slug = toSlug(entry.body.split('\n')[0] || entry.body, 'moment');
                const basename = `${dayDate.replace(/-/g, '')}-${toTimeLabel(entry.capturedAt)}-spraak-${slug}`;
                const audioPath = `${dayPaths.audioDirPath}/${basename}.${mimeToExtension(entry.audioMimeType)}`;
                return `- [${basename}](${relativePath(dayPath, audioPath)})`;
              })),
          '',
        ].join('\n'),
      });

      markdownFiles.push({
        path: `${dayPaths.dayPath}/README.md`,
        body: [
          `# ${dayPaths.dayFolder}`,
          '',
          `- [Dagoverzicht](${dayPaths.dayFileName})`,
          ...(input.options.includeMoments ? ['- [Momenten](momenten/)', ''] : ['']),
          ...(input.options.includeAudio ? ['- [Audio](audio/)', ''] : ['']),
        ].join('\n'),
      });
    }
  }

  if (input.options.includeWeeks) {
    for (const reflection of weekReflections) {
      const { year, week } = isoWeek(reflection.period_start);
      const weekName = `${year}-W${String(week).padStart(2, '0')}-${reflection.period_start.replace(/-/g, '')}-tm-${reflection.period_end.replace(/-/g, '')}-weekoverzicht.md`;
      const weekPath = `${rootName}/weken/${weekName}`;
      weekFilePaths.push(weekPath);

      const weekDays = allDayDates
        .filter((date) => date >= reflection.period_start && date <= reflection.period_end)
        .map((date) => {
          const dayPaths = dayPathsByDate.get(date);
          if (!dayPaths) {
            return null;
          }
          return { date, path: dayPaths.dayFilePath };
        })
        .filter((row): row is { date: string; path: string } => row !== null);

      markdownFiles.push({
        path: weekPath,
        body: [
          `# Week ${year}-W${String(week).padStart(2, '0')}`,
          '',
          reflection.summary_text || '-',
          '',
          reflection.narrative_text || '-',
          '',
          '## Dagen',
          '',
          ...(weekDays.length === 0
            ? ['Geen dagen in deze selectie.']
            : weekDays.map((day) => `- [${day.date}](${relativePath(weekPath, day.path)})`)),
          '',
        ].join('\n'),
      });
    }
  }

  if (input.options.includeMonths) {
    for (const reflection of monthReflections) {
      const monthName = `${reflection.period_start.slice(0, 7)}-${monthLabel(reflection.period_start)}-maandoverzicht.md`;
      const monthFolder = monthFolderName(reflection.period_start);
      const monthYear = reflection.period_start.slice(0, 4);
      const monthPath = `${rootName}/${monthYear}/${monthFolder}`;
      const monthOverviewPath = `${monthPath}/maanden/${monthName}`;
      monthFilePaths.push(monthOverviewPath);

      const monthDays = allDayDates
        .filter((date) => date >= reflection.period_start && date <= reflection.period_end)
        .map((date) => {
          const dayPaths = dayPathsByDate.get(date);
          if (!dayPaths) {
            return null;
          }
          return { date, path: dayPaths.dayFilePath };
        })
        .filter((row): row is { date: string; path: string } => row !== null);

      markdownFiles.push({
        path: monthOverviewPath,
        body: [
          `# Maand ${reflection.period_start.slice(0, 7)}`,
          '',
          reflection.summary_text || '-',
          '',
          reflection.narrative_text || '-',
          '',
          '## Dagen',
          '',
          ...(monthDays.length === 0
            ? ['Geen dagen in deze selectie.']
            : monthDays.map((day) => `- [${day.date}](${relativePath(monthOverviewPath, day.path)})`)),
          '',
        ].join('\n'),
      });
    }
  }

  const contentFiles = markdownFiles.filter((file) => !file.path.endsWith('/README.md'));
  const shouldWriteSingleMd = contentFiles.length === 1 && audioFiles.length === 0;

  await updateTask({
    supabase: input.supabase,
    taskId: input.taskId,
    userId: input.userId,
    patch: {
      phase: 'package',
      progress_current: 3,
      progress_total: 4,
      detail_label: 'Exportbestand maken',
    },
  });

  let artifactBytes: Uint8Array;
  let artifactMimeType = 'text/markdown';
  let artifactFileName = `budio-export-${stamp}.md`;

  if (shouldWriteSingleMd) {
    artifactBytes = new TextEncoder().encode((contentFiles[0]?.body ?? '# Export\n') + '\n');
  } else {
    const zip = new JSZip();

    const yearFolders = Array.from(new Set(allDayDates.map((date) => date.slice(0, 4)))).sort((a, b) => a.localeCompare(b));
    const monthKeysSorted = Array.from(monthPathByKey.keys()).sort((a, b) => a.localeCompare(b));

    markdownFiles.push({
      path: `${rootName}/README.md`,
      body: [
        `# ${rootName}`,
        '',
        ...(yearFolders.length > 0 ? ['## Jaren', '', ...yearFolders.map((year) => `- [${year}](${`./${year}/README.md`})`), ''] : []),
        ...(input.options.includeWeeks ? ['## Globale overzichten', '', '- [Weken](weken/README.md)', ''] : []),
        `- Dagen: ${days.length}`,
        `- Momenten: ${entries.length}`,
        `- Weken: ${weekReflections.length}`,
        `- Maanden: ${monthReflections.length}`,
        `- Audio (gevonden paden): ${audioFiles.length}`,
        '',
        ...(warnings.length > 0 ? ['## Waarschuwingen', '', ...warnings.map((warning) => `- ${warning}`), ''] : []),
      ].join('\n'),
    });

    for (const year of yearFolders) {
      const yearMonthKeys = monthKeysSorted.filter((key) => key.startsWith(`${year}/`));
      markdownFiles.push({
        path: `${rootName}/${year}/README.md`,
        body: [
          `# ${year}`,
          '',
          ...yearMonthKeys.map((monthKey) => {
            const monthPath = monthPathByKey.get(monthKey) ?? `${rootName}/${monthKey}`;
            const monthReadmePath = `${monthPath}/README.md`;
            return `- [${monthKey.split('/')[1]}](${relativePath(`${rootName}/${year}/README.md`, monthReadmePath)})`;
          }),
          '',
        ].join('\n'),
      });
    }

    for (const monthKey of monthKeysSorted) {
      const monthPath = monthPathByKey.get(monthKey);
      if (!monthPath) {
        continue;
      }
      const monthDates = (monthDaysByKey.get(monthKey) ?? []).slice().sort((a, b) => a.localeCompare(b));
      const monthReadmePath = `${monthPath}/README.md`;
      const monthOverviews = monthFilePaths.filter((filePath) => filePath.startsWith(`${monthPath}/maanden/`));

      markdownFiles.push({
        path: monthReadmePath,
        body: [
          `# ${monthKey.split('/')[1]}`,
          '',
          ...(monthOverviews.length > 0
            ? ['## Maandoverzicht', '', ...monthOverviews.map((overviewPath) => {
                const fileName = overviewPath.split('/').pop() ?? overviewPath;
                return `- [${fileName}](${relativePath(monthReadmePath, overviewPath)})`;
              }), '']
            : []),
          ...(input.options.includeDays && monthDates.length > 0
            ? ['## Dagen', '', ...monthDates.map((date) => {
                const dayPaths = dayPathsByDate.get(date);
                if (!dayPaths) {
                  return null;
                }
                return `- [${dayPaths.dayFolder}](${relativePath(monthReadmePath, `${dayPaths.dayPath}/README.md`)})`;
              }).filter((line): line is string => Boolean(line)), '']
            : []),
        ].join('\n'),
      });
    }

    if (input.options.includeWeeks) {
      markdownFiles.push({
        path: `${rootName}/weken/README.md`,
        body: ['# Weken', '', ...weekFilePaths.map((weekPath) => {
          const fileName = weekPath.split('/').pop() ?? weekPath;
          return `- [${fileName}](${relativePath(`${rootName}/weken/README.md`, weekPath)})`;
        }), ''].join('\n'),
      });
    }

    if (input.options.includeMonths) {
      markdownFiles.push({
        path: `${rootName}/maanden/README.md`,
        body: ['# Maanden', '', ...monthFilePaths.map((monthPath) => {
          const fileName = monthPath.split('/').pop() ?? monthPath;
          return `- [${fileName}](${relativePath(`${rootName}/maanden/README.md`, monthPath)})`;
        }), ''].join('\n'),
      });
    }

    for (const file of markdownFiles) {
      zip.file(file.path, file.body);
    }

    let skippedAudioFiles = 0;
    let downloadedAudioFiles = 0;
    for (const audio of audioFiles) {
      const download = await input.supabase.storage.from('entry-audio').download(audio.bucketPath);
      if (download.error || !download.data) {
        skippedAudioFiles += 1;
        warnings.push(`Audiobestand ontbreekt in opslag: ${audio.bucketPath}`);
        continue;
      }
      const bytes = new Uint8Array(await download.data.arrayBuffer());
      zip.file(audio.path, bytes);
      downloadedAudioFiles += 1;
    }

    const totalSkippedAudioFiles = skippedAudioFiles + missingAudioPathCount;
    if (totalSkippedAudioFiles > 0) {
      warnings.push(`${totalSkippedAudioFiles} audiobestanden zijn overgeslagen.`);
    }

    artifactBytes = await zip.generateAsync({ type: 'uint8array' });
    artifactMimeType = 'application/zip';
    artifactFileName = `budio-export-${stamp}.zip`;

    await updateTask({
      supabase: input.supabase,
      taskId: input.taskId,
      userId: input.userId,
      patch: {
        result_payload: {
          format: 'zip',
          rootFolder: rootName,
          counts: {
            moments: entries.length,
            days: allDayDates.length,
            weeks: weekReflections.length,
            months: monthReflections.length,
            audioFiles: downloadedAudioFiles,
            skippedAudioFiles: totalSkippedAudioFiles,
          },
          warnings,
        },
      },
    });
  }

  await updateTask({
    supabase: input.supabase,
    taskId: input.taskId,
    userId: input.userId,
    patch: {
      phase: 'upload',
      progress_current: 4,
      progress_total: 4,
      detail_label: 'Export opslaan',
    },
  });

  const storagePath = `${input.userId}/exports/${input.taskId}/${artifactFileName}`;
  const upload = await input.supabase.storage
    .from('user-exports')
    .upload(storagePath, artifactBytes, { upsert: true, contentType: artifactMimeType });

  if (upload.error) {
    throw new Error('Kon exportartifact niet opslaan.');
  }

  await updateTask({
    supabase: input.supabase,
    taskId: input.taskId,
    userId: input.userId,
    patch: {
      status: 'completed',
      phase: 'completed',
      detail_label: 'Export klaar',
      completed_at: new Date().toISOString(),
      result_storage_path: storagePath,
      result_file_name: artifactFileName,
      result_mime_type: artifactMimeType,
      result_size_bytes: artifactBytes.byteLength,
      result_payload: {
        format: artifactMimeType === 'application/zip' ? 'zip' : 'md',
        rootFolder: rootName,
        counts: {
          moments: entries.length,
          days: allDayDates.length,
          weeks: weekReflections.length,
          months: monthReflections.length,
          audioFiles: audioFiles.length,
          skippedAudioFiles: missingAudioPathCount,
        },
        warnings,
      },
      warning_count: warnings.length,
      error_message: null,
      notice_seen_at: null,
      notice_dismissed_at: null,
    },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: buildCorsHeaders(request) });
  }

  const requestId = crypto.randomUUID();
  const flowId = parseFlowId(request, requestId);
  let step = 'received';

  if (request.method !== 'POST') {
    return errorResponse({
      request,
      httpStatus: 405,
      requestId,
      flowId,
      step,
      code: 'INPUT_INVALID',
      message: 'Method not allowed',
    });
  }

  try {
    const runtimeEnv = getRuntimeSupabaseEnv();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse({
        request,
        httpStatus: 401,
        requestId,
        flowId,
        step: 'authenticated',
        code: 'AUTH_MISSING',
        message: 'Missing Authorization header',
      });
    }

    const supabase = createClient(runtimeEnv.supabaseUrl, runtimeEnv.supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    step = 'authenticated';
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return errorResponse({
        request,
        httpStatus: 401,
        requestId,
        flowId,
        step,
        code: 'AUTH_UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    step = 'validated';
    const body = (await request.json()) as ExportInput;
    const options = parseInput(body);

    const { data: taskRow, error: taskError } = await supabase
      .from('user_background_tasks')
      .insert({
        user_id: authData.user.id,
        task_type: 'archive_export',
        status: 'queued',
        phase: 'queued',
        progress_current: 0,
        progress_total: 4,
        input_payload: options,
        warning_count: 0,
        notice_seen_at: null,
        notice_dismissed_at: null,
      })
      .select(
        'id, task_type, status, phase, progress_current, progress_total, detail_current, detail_total, detail_label, warning_count, error_message, notice_dismissed_at, started_at, completed_at, created_at, updated_at',
      )
      .single();

    if (taskError || !taskRow) {
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step: 'task_created',
        code: 'DB_WRITE_FAILED',
        message: 'Kon exporttaak niet aanmaken.',
      });
    }

    const taskId = taskRow.id as string;

    const backgroundRun = runExport({
      supabase,
      taskId,
      userId: authData.user.id,
      options,
    }).catch(async (error) => {
      try {
        await updateTask({
          supabase,
          taskId,
          userId: authData.user.id,
          patch: {
            status: 'failed',
            phase: 'failed',
            completed_at: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : 'Export gestopt door onverwachte fout.',
          },
        });
      } catch {
        // noop
      }
    });

    // @ts-ignore -- EdgeRuntime is available in Supabase Edge Functions.
    if (typeof EdgeRuntime !== 'undefined' && typeof EdgeRuntime.waitUntil === 'function') {
      // @ts-ignore -- EdgeRuntime is available in Supabase Edge Functions.
      EdgeRuntime.waitUntil(backgroundRun);
    } else {
      await backgroundRun;
    }

    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step: 'completed',
      event: 'queued',
      details: {
        userId: authData.user.id,
        taskId,
      },
    });

    return jsonResponse(request, 200, {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      backgroundTask: {
        id: taskRow.id,
        taskType: 'archive_export',
        status: taskRow.status,
        phase: taskRow.phase,
        progressCurrent: taskRow.progress_current,
        progressTotal: taskRow.progress_total,
        detailCurrent: taskRow.detail_current,
        detailTotal: taskRow.detail_total,
        detailLabel: taskRow.detail_label,
        warningCount: taskRow.warning_count,
        errorMessage: taskRow.error_message,
        noticeDismissedAt: taskRow.notice_dismissed_at,
        startedAt: taskRow.started_at,
        completedAt: taskRow.completed_at,
        createdAt: taskRow.created_at,
        updatedAt: taskRow.updated_at,
      },
    });
  } catch (error) {
    logFlow('error', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'fatal',
      details: { error: error instanceof Error ? error.message : String(error) },
    });
    return errorResponse({
      request,
      httpStatus: 500,
      requestId,
      flowId,
      step,
      code: 'INTERNAL_UNEXPECTED',
      message: error instanceof Error ? error.message : 'Unexpected error',
    });
  }
});
