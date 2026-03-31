export type FunctionRuntimeEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  openAiApiKey: string;
  openAiModel: string;
  openAiTranscriptionModel: string;
};

function readEnv(name: string): string {
  return Deno.env.get(name)?.trim() ?? '';
}

function requireValue(name: string, value: string): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

function getSelectedPublicSupabaseValues(): { url: string; publishableKey: string } {
  const target = (readEnv('EXPO_PUBLIC_SUPABASE_TARGET') || 'cloud').toLowerCase();

  if (target === 'local') {
    return {
      url: readEnv('EXPO_PUBLIC_SUPABASE_LOCAL_URL') || readEnv('EXPO_PUBLIC_SUPABASE_URL'),
      publishableKey:
        readEnv('EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY') ||
        readEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    };
  }

  return {
    url: readEnv('EXPO_PUBLIC_SUPABASE_CLOUD_URL') || readEnv('EXPO_PUBLIC_SUPABASE_URL'),
    publishableKey:
      readEnv('EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY') ||
      readEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
  };
}

export function getFunctionRuntimeEnv(): FunctionRuntimeEnv {
  const selectedPublic = getSelectedPublicSupabaseValues();
  const supabaseUrl = readEnv('SUPABASE_URL') || selectedPublic.url;
  const supabaseAnonKey = readEnv('SUPABASE_ANON_KEY') || selectedPublic.publishableKey;
  const openAiApiKey = readEnv('OPENAI_API_KEY');
  const openAiModel = readEnv('OPENAI_MODEL') || 'gpt-4o-mini';
  const openAiTranscriptionModel =
    readEnv('OPENAI_TRANSCRIPTION_MODEL') || 'gpt-4o-mini-transcribe';

  return {
    supabaseUrl: requireValue(
      'SUPABASE_URL or selected EXPO_PUBLIC_SUPABASE_(LOCAL|CLOUD)_URL',
      supabaseUrl
    ),
    supabaseAnonKey: requireValue(
      'SUPABASE_ANON_KEY or selected EXPO_PUBLIC_SUPABASE_(LOCAL|CLOUD)_PUBLISHABLE_KEY',
      supabaseAnonKey
    ),
    openAiApiKey: requireValue('OPENAI_API_KEY', openAiApiKey),
    openAiModel,
    openAiTranscriptionModel,
  };
}
