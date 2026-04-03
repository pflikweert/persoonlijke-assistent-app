# Persoonlijke Assistent App
Status: Setup referentie
Zie: docs/project/current-status.md

## Projectdoel
Deze repository is de lokale basis voor een React Native / Expo app met Expo Router.  
De focus ligt op een stabiele ontwikkelomgeving met duidelijke scripts, configuratie en structuur.  
Functionele productfeatures worden pas toegevoegd nadat de projectfundering lokaal op orde is.

## Documentatie
- Leidende projectdocs: `docs/project/README.md`
- Generated uploadbundle voor ChatGPT Project: `docs/project/generated/chatgpt-project-context.md`
- Build bundle: `npm run docs:bundle`
- Verify bundle-sync: `npm run docs:bundle:verify`

## Lokale startcommando's
```bash
npm install
npm run dev
npm run dev:stop
npm run test:reflection-helpers
npm run verify:local-flow
npm run verify:local-audio-flow
npm run verify:local-reflection-flow
npm run verify:local-output-quality
npm run ios
npm run android
npm run web
npm run lint
npm run typecheck
```

`npm run dev` deployt eerst de lokale edge functions en start daarna Expo + lokale Supabase Functions runtime samen. Bij herstart wordt de oude runtime eerst opgeruimd, en bij `Ctrl+C` wordt hij automatisch gestopt.
Los opruimen kan met `npm run dev:stop`. Function logs staan in `/tmp/supabase-functions.log`.

## Env-overzicht
- `.env.example`: template met verwachte variabelen en geen secrets.
- `.env.local`: lokale waarden voor jouw machine, niet committen.
- `.env`: optioneel gedeeld lokaal bestand, niet committen.
- Public app vars:
  - `EXPO_PUBLIC_SUPABASE_TARGET` (`local` of `cloud`)
  - `EXPO_PUBLIC_SUPABASE_LOCAL_URL`, `EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_SUPABASE_CLOUD_URL`, `EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_APP_ENV`
- Server-only app var: `APP_SUPABASE_SERVICE_ROLE_KEY` (alleen voor server utilities, nooit in clientcode).
- Edge Function vars: `OPENAI_API_KEY` (vereist), `OPENAI_MODEL` (optioneel, default `gpt-5.4-mini`), `OPENAI_TRANSCRIPTION_MODEL` (optioneel, default `gpt-4o-mini-transcribe`).
- Feature flags (Vercel-managed env vars, lokaal via `.env.local`):
  - `VERCEL_FLAG_DAY_JOURNAL_SOFT_QUALITY_GUARDS` (default `false`): zet zachte quality-guards voor day-journal post-checks aan/uit.
  - `VERCEL_FLAG_DAY_JOURNAL_STRICT_VALIDATION` (default `false`): zet striktere day-journal validatie aan/uit.
  - `EXPO_PUBLIC_VERCEL_FLAG_DEBUG_FUNCTION_AUTH` (default `0`): toont client-side auth debug logging voor function calls.
- Conventie voor nieuwe flags: gebruik `VERCEL_FLAG_*` (server/function) en `EXPO_PUBLIC_VERCEL_FLAG_*` (client/web). Beheer deze in Vercel envs; lokaal override je ze in `.env.local`.
- `OPENAI_API_KEY` blijft strikt server-side en mag nooit in Expo clientcode of `EXPO_PUBLIC_*` variabelen terechtkomen.
- Voor Edge Functions lokaal geldt: `supabase functions serve --env-file ...` kan custom variabelen met prefix `SUPABASE_` overslaan. Gebruik daarom geen custom `SUPABASE_*` namen in `.env.local`.
- Zet `EXPO_PUBLIC_SUPABASE_TARGET=local` voor lokaal testen en `cloud` voor remote Supabase.
- Sync lokale env vanuit Vercel met: `npm run env:pull`.

## Stap-0 checklist
- [ ] Node `24` actief (via `.nvmrc`)
- [ ] `npm install` uitgevoerd
- [ ] `.env.local` gevuld op basis van `.env.example`
- [ ] `npm run lint` is groen
- [ ] `npm run typecheck` is groen

## Supabase lokale workflow
```bash
npx supabase login
npx supabase init
npx supabase link --project-ref <jouw-project-ref>
npx supabase db push
npx supabase db reset
npx supabase gen types typescript --linked --schema public > src/lib/supabase/database.types.ts
```

## Edge Function auth (prod)
- Private user-bound functions: `process-entry`, `generate-reflection`, `regenerate-day-journal`.
- Deze functies draaien met function-level auth check (`Authorization` header + `auth.getUser()` in function code).
- JWT gateway verify staat expliciet op `false` per functie in `supabase/config.toml` voor compatibiliteit met huidige signing keys.
- GitHub deploy secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`.

## Supabase dashboard en mail
- Lokaal dashboard: `http://127.0.0.1:54323`
- Lokale mail inbox: `http://127.0.0.1:54324`
- Start de lokale Supabase stack met `npx supabase start` als je Studio en Mailpit open wilt hebben.
- Als je lokale database nog geen tabellen heeft, draai dan `npx supabase db reset` nadat de stack draait.
- Lokale magic links worden niet naar Gmail verstuurd. Ze worden vastgehouden in Mailpit.
- Voor Expo web is de lokale redirect-URL nu `http://localhost:8081` of `http://127.0.0.1:8081`.
- Voor een echte e-mail in Gmail moet je de cloud-omgeving gebruiken en SMTP instellen voor dat project.

## Lokaal draaien (app + function)
```bash
# App
npm run dev

# Edge Function runtime (als je alleen de functions wilt serven)
npx supabase functions serve --env-file .env.local
```

Voorbeeld lokale testcall:
```bash
curl -i http://127.0.0.1:54321/functions/v1/process-entry \
  -H "Authorization: Bearer <USER_ACCESS_TOKEN>" \
  -H "apikey: <EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"rawText":"Vandaag een korte notitie."}'
```

Voorbeeld audio testcall:
```bash
curl -i http://127.0.0.1:54321/functions/v1/process-entry \
  -H "Authorization: Bearer <USER_ACCESS_TOKEN>" \
  -H "apikey: <EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"audioBase64":"<BASE64_AUDIO>","audioMimeType":"audio/webm"}'
```

Voorbeeld reflectie testcall:
```bash
curl -i http://127.0.0.1:54321/functions/v1/generate-reflection \
  -H "Authorization: Bearer <USER_ACCESS_TOKEN>" \
  -H "apikey: <EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"periodType":"week","anchorDate":"2026-03-31","forceRegenerate":true}'
```

## Fase 1: Auth + schema bootstrap
- Gebruik Supabase Auth magic links voor minimale login.
- Nieuwe release-1 tabellen: `entries_raw`, `entries_normalized`, `day_journals`.
- RLS staat aan; records zijn alleen toegankelijk voor `auth.uid()` eigenaar.

## Magic link testen
1. Zet `EXPO_PUBLIC_SUPABASE_TARGET=local` in `.env.local`.
2. Start de lokale Supabase stack: `npx supabase start`.
3. Vraag de magic link aan in de app.
4. Open `http://127.0.0.1:54324` om de e-mail te bekijken en de link te openen.
5. Gebruik je echte Gmail inbox alleen als je naar `cloud` schakelt en SMTP voor dat project instelt.

## Lokale E2E verify
Gebruik `npm run verify:local-flow` om de text-only slice automatisch te verifiëren:
- signup
- submit naar `process-entry`
- check op records in `entries_raw`, `entries_normalized` en `day_journals`

Gebruik `npm run verify:local-audio-flow` om het audio pad automatisch te verifiëren:
- signup
- submit audio payload naar `process-entry`
- check op `entries_raw.source_type='audio'` + transcript
- check op records in `entries_normalized` en `day_journals`

Gebruik `npm run verify:local-reflection-flow` om week/maandreflecties automatisch te verifiëren:
- signup
- seed van `day_journals`
- generate voor `week` en `month`
- check op records in `period_reflections`
- check op periodegrenzen en non-empty samenvatting

## Fase 1: intake edge function
- Functiepad: `supabase/functions/process-entry`.
- Input text: `{ "rawText": "..." , "capturedAt"?: "ISO-8601" }`.
- Input audio: `{ "audioBase64": "...", "audioMimeType": "audio/webm|audio/m4a|...", "capturedAt"?: "ISO-8601" }`.
- Output: `rawEntryId`, `normalizedEntryId`, `journalDate`, `dayJournalId`, `status`, `sourceType`.

## Fase 1: reflectie edge function
- Functiepad: `supabase/functions/generate-reflection`.
- Input: `{ "periodType": "week|month", "anchorDate"?: "YYYY-MM-DD", "forceRegenerate"?: boolean }`.
- Output: `reflectionId`, `periodType`, `periodStart`, `periodEnd`, `generatedAt`, `modelVersion`, `status`.

## Fase 1 routes
- `Vandaag`: dagsamenvatting voor UTC-vandaag.
- `Vastleggen`: text + audio ingest naar `process-entry`.
- `Dagen`: recente `day_journals`, recent eerst.
- `Dagdetail`: `/day/[date]` met summary, sections en entries van die dag.
- `Reflecties`: handmatige generatie en overzicht van week/maandreflecties.

## Server-side AI scaffold
- Locatie: `src/server/ai`
- Flows met stubs: transcriptie, entry normalization, day composition, period reflection.
- Alleen contracten + structuur; nog geen productprompts of businessflows.
- Geen Realtime API en geen vector store logica in deze fase.
