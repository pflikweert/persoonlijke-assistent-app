# Supabase Client Layer

Deze map bevat alleen de lokale developer-scaffold voor Supabase:

- `client.ts`: typed client-factory voor Expo client-side gebruik.
- `server.ts`: placeholder voor server-only gebruik met secret key.
- `env.ts`: env-validatie met duidelijk onderscheid tussen public en server-only variabelen.
- `database.types.ts`: gegenereerde databasetypes via Supabase CLI.

Env-conventie:
- App/public:
  - `EXPO_PUBLIC_SUPABASE_TARGET` (`local` of `cloud`)
  - `EXPO_PUBLIC_SUPABASE_LOCAL_URL`, `EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_SUPABASE_CLOUD_URL`, `EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY`
- Server utility key: `APP_SUPABASE_SERVICE_ROLE_KEY`.
