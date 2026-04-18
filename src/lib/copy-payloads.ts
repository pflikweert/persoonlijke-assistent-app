import type { ClipboardCopyPayload } from './clipboard';

type DayJournalCopyInput = {
  dateLabel: string;
  summary: string | null;
  narrativeText: string | null;
  insight: string | null;
  keyPoints: string[];
};

type ReflectionCopyInput = {
  periodRange: string;
  summaryText: string;
  narrativeText?: string | null;
  highlights: string[];
  reflectionPoints: string[];
};

type EntryCopyInput = {
  title: string;
  capturedAtLabel: string;
  summaryText?: string | null;
  bodyText: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function asParagraphs(value: string): string[] {
  return value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function pushPlainBlock(lines: string[], ...blockLines: string[]) {
  if (blockLines.length === 0) {
    return;
  }
  if (lines.length > 0) {
    lines.push('');
  }
  lines.push(...blockLines);
}

function pushHtmlSection(html: string[], ...blockLines: string[]) {
  if (blockLines.length === 0) {
    return;
  }
  html.push(`<section>${blockLines.join('')}</section>`);
}

export function buildDayJournalCopyPayload(input: DayJournalCopyInput): ClipboardCopyPayload | null {
  const dateLabel = input.dateLabel.trim();
  const summary = (input.summary ?? '').trim();
  const narrative = (input.narrativeText ?? '').trim();
  const insight = (input.insight ?? '').trim();
  const keyPoints = input.keyPoints.map((item) => item.trim()).filter((item) => item.length > 0);

  if (!dateLabel && !summary && !narrative && !insight && keyPoints.length === 0) {
    return null;
  }

  const plain: string[] = [];
  if (dateLabel) {
    pushPlainBlock(plain, dateLabel);
  }
  if (summary) {
    pushPlainBlock(plain, summary);
  }
  if (narrative) {
    pushPlainBlock(plain, narrative);
  }
  if (insight) {
    pushPlainBlock(plain, 'Inzicht', '', insight);
  }
  if (keyPoints.length > 0) {
    const pointLines = keyPoints.map((item) => `- ${item}`);
    pushPlainBlock(plain, 'Kernpunten', '', ...pointLines);
  }

  const html: string[] = [];
  if (dateLabel) {
    pushHtmlSection(html, `<h3>${escapeHtml(dateLabel)}</h3>`);
  }
  if (summary) {
    pushHtmlSection(
      html,
      ...asParagraphs(summary).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    );
  }
  if (narrative) {
    pushHtmlSection(
      html,
      ...asParagraphs(narrative).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    );
  }
  if (insight) {
    pushHtmlSection(html, '<h4>Inzicht</h4>', `<p>${escapeHtml(insight)}</p>`);
  }
  if (keyPoints.length > 0) {
    pushHtmlSection(
      html,
      '<h4>Kernpunten</h4>',
      '<ul>',
      ...keyPoints.map((item) => `<li>${escapeHtml(item)}</li>`),
      '</ul>'
    );
  }

  return {
    plainText: plain.join('\n').trim(),
    htmlText: html.join(''),
  };
}

export function buildReflectionCopyPayload(input: ReflectionCopyInput): ClipboardCopyPayload {
  const periodRange = input.periodRange.trim();
  const summary = input.summaryText.trim();
  const narrative = (input.narrativeText ?? '').trim();
  const highlights = input.highlights.map((item) => item.trim()).filter((item) => item.length > 0);
  const points = input.reflectionPoints.map((item) => item.trim()).filter((item) => item.length > 0);

  const plain: string[] = [];
  if (periodRange) {
    pushPlainBlock(plain, periodRange);
  }
  if (summary) {
    pushPlainBlock(plain, summary);
  }
  if (narrative) {
    pushPlainBlock(plain, narrative);
  }
  if (highlights.length > 0) {
    pushPlainBlock(
      plain,
      'Belangrijkste gebeurtenissen',
      '',
      ...highlights.map((item) => `- ${item}`)
    );
  }
  if (points.length > 0) {
    pushPlainBlock(plain, 'Reflectiepunten', '', ...points.map((item) => `- ${item}`));
  }

  const html: string[] = [];
  if (periodRange) {
    pushHtmlSection(html, `<h3>${escapeHtml(periodRange)}</h3>`);
  }
  if (summary) {
    pushHtmlSection(
      html,
      ...asParagraphs(summary).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    );
  }
  if (narrative) {
    pushHtmlSection(
      html,
      ...asParagraphs(narrative).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    );
  }
  if (highlights.length > 0) {
    pushHtmlSection(
      html,
      '<h4>Belangrijkste gebeurtenissen</h4>',
      '<ul>',
      ...highlights.map((item) => `<li>${escapeHtml(item)}</li>`),
      '</ul>'
    );
  }
  if (points.length > 0) {
    pushHtmlSection(
      html,
      '<h4>Reflectiepunten</h4>',
      '<ul>',
      ...points.map((item) => `<li>${escapeHtml(item)}</li>`),
      '</ul>'
    );
  }

  return {
    plainText: plain.join('\n').trim(),
    htmlText: html.join(''),
  };
}

export function buildEntryCopyPayload(
  input: EntryCopyInput,
): ClipboardCopyPayload | null {
  const title = input.title.trim();
  const capturedAtLabel = input.capturedAtLabel.trim();
  const summary = (input.summaryText ?? '').trim();
  const body = input.bodyText.trim();

  if (!title && !capturedAtLabel && !summary && !body) {
    return null;
  }

  const plain: string[] = [];
  if (title) {
    pushPlainBlock(plain, title);
  }
  if (capturedAtLabel) {
    pushPlainBlock(plain, capturedAtLabel);
  }
  if (summary) {
    pushPlainBlock(plain, summary);
  }
  if (body) {
    pushPlainBlock(plain, body);
  }

  const html: string[] = [];
  if (title) {
    pushHtmlSection(html, `<h3>${escapeHtml(title)}</h3>`);
  }
  if (capturedAtLabel) {
    pushHtmlSection(html, `<p>${escapeHtml(capturedAtLabel)}</p>`);
  }
  if (summary) {
    pushHtmlSection(
      html,
      ...asParagraphs(summary).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    );
  }
  if (body) {
    pushHtmlSection(
      html,
      ...asParagraphs(body).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    );
  }

  return {
    plainText: plain.join('\n').trim(),
    htmlText: html.join(''),
  };
}
