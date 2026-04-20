# Local Supabase Flow

## Doel

Kleine, veilige scheiding tussen lokale development en productie deploy van Supabase Edge Functions.

## Wat gebeurt lokaal

- `npm run dev`:
  - start/checkt lokale Supabase stack (`npx supabase start`)
  - start lokale functions runtime (`supabase functions serve --env-file .env.local`) in background
  - start Expo
- `npm run dev:stop`:
  - stopt alleen de lokale functions runtime
  - lokale Supabase stack blijft draaien

## Na codewijzigingen: wat moet je doen?

- Alleen frontend/app code gewijzigd:
  - meestal niets extra's; anders Expo restart
- `supabase/functions/**` gewijzigd:
  - `npm run supabase:functions:restart`
- `supabase/migrations/**` gewijzigd:
  - pas lokaal schema toe (`npx supabase db push` of `npx supabase db reset`)
  - regenereer waar nodig types

## Productie deploy

- Productie deploy van Supabase Edge Functions gaat alleen via GitHub Actions:
  - `.github/workflows/deploy.yml`
- Vereiste secrets:
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_PROJECT_REF`

## Env-hygiëne

- Gebruik `.env.local` alleen voor lokale development.
- Commit nooit echte secrets.
- Startpunt voor lokaal invullen:
  - `.env.local.example`
  - `.env.example`
- `OPENAI_API_KEY` blijft server-side (nooit client-side).
