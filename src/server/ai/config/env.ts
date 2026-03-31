const reportedErrors = new Set<string>();

function reportOnce(message: string) {
  if (reportedErrors.has(message)) {
    return;
  }

  reportedErrors.add(message);
  console.error(message);
}

export interface OpenAiServerEnv {
  apiKey: string;
}

export function getOpenAiServerEnv(): OpenAiServerEnv | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim() ?? '';

  if (!apiKey) {
    reportOnce(
      '[ai:server-env] Missing OPENAI_API_KEY. Keep this key server-side only and never expose it in Expo client code.'
    );
    return null;
  }

  return { apiKey };
}
