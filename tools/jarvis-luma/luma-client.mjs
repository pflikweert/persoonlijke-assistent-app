const LUMA_AGENTS_API_BASE_URL = 'https://agents.lumalabs.ai/v1';
const LUMA_DREAM_MACHINE_API_BASE_URL = 'https://api.lumalabs.ai/dream-machine/v1';

export class LumaApiError extends Error {
  constructor(message, { status, detail, responseBody } = {}) {
    super(message);
    this.name = 'LumaApiError';
    this.status = status ?? null;
    this.detail = detail ?? null;
    this.responseBody = responseBody ?? null;
  }
}

async function parseResponseBody(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorDetail(body) {
  if (!body || typeof body !== 'object') {
    return body;
  }

  return body.detail ?? body.error ?? body.message ?? body;
}

async function requestJson(apiKey, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new LumaApiError(`Luma API request failed with HTTP ${response.status}`, {
      status: response.status,
      detail: getErrorDetail(body),
      responseBody: body,
    });
  }

  return body;
}

export function getGeneration(apiKey, generationId) {
  return requestJson(apiKey, `${LUMA_AGENTS_API_BASE_URL}/generations/${generationId}`);
}

export function listGenerations(apiKey, { limit = 100, offset = 0 } = {}) {
  return requestJson(
    apiKey,
    `${LUMA_AGENTS_API_BASE_URL}/generations?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
  );
}

export function getDreamMachineGeneration(apiKey, generationId) {
  return requestJson(apiKey, `${LUMA_DREAM_MACHINE_API_BASE_URL}/generations/${generationId}`);
}

export function listDreamMachineGenerations(apiKey, { limit = 100, offset = 0 } = {}) {
  return requestJson(
    apiKey,
    `${LUMA_DREAM_MACHINE_API_BASE_URL}/generations?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
  );
}

export async function downloadOutput(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new LumaApiError(`Failed to download Luma output with HTTP ${response.status}`, {
      status: response.status,
      detail: await response.text(),
    });
  }

  return Buffer.from(await response.arrayBuffer());
}
