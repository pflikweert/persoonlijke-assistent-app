export type AppEnvironment = 'development' | 'staging' | 'production';

const fallbackEnvironment: AppEnvironment = __DEV__ ? 'development' : 'production';
const rawEnvironment = process.env.EXPO_PUBLIC_APP_ENV;

const normalizedEnvironment =
  rawEnvironment === 'development' || rawEnvironment === 'staging' || rawEnvironment === 'production'
    ? rawEnvironment
    : fallbackEnvironment;

export const APP_CONFIG = {
  name: 'Persoonlijke Assistent',
  environment: normalizedEnvironment,
  flags: {
    isDevelopment: normalizedEnvironment === 'development',
    isStaging: normalizedEnvironment === 'staging',
    isProduction: normalizedEnvironment === 'production',
  },
} as const;
