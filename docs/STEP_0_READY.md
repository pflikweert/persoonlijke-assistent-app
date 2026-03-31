# STEP 0 Readiness Check

## Wat al klaar staat
- Basisproject voor Expo + TypeScript staat op orde (`.nvmrc`, `.editorconfig`, `.gitignore`, scripts in `package.json`).
- Expo Router app-shell en minimale tabs werken als bootstrap zonder productfeatures.
- Centrale themelaag en app-config/constants zijn aanwezig.
- Supabase developerlaag is gescaffold (`src/lib/supabase`) met typed client/server placeholders en env-validatie.
- Server-side AI scaffold staat klaar (`src/server/ai`) met contracts, flow stubs, prompt versioning placeholders en logging placeholders.
- Securitygrens is gedocumenteerd: `OPENAI_API_KEY` is server-only.

## Wat je nog handmatig moet doen
- Activeer Node 24: `nvm use`.
- Vul lokale env in op basis van `.env.example` (gebruik echte waarden, geen placeholders).
- Login en link Supabase project lokaal:
  - `npx supabase login`
  - `npx supabase init`
  - `npx supabase link --project-ref <jouw-project-ref>`
- Regenerate DB types wanneer schema wijzigt:
  - `npx supabase gen types typescript --linked --schema public > src/lib/supabase/database.types.ts`

## Smoke test commando's
```bash
npm install
npm run lint
npm run typecheck
npm run dev
```

Optioneel per platform:
```bash
npm run web
npm run ios
npm run android
```

## Blokkades voordat stap 1 mag starten
- `OPENAI_API_KEY`, `SUPABASE_SECRET_KEY` en andere server-only secrets moeten alleen server-side gebruikt blijven.
- `.env.local` moet volledig en correct zijn ingevuld; anders blijven server stubs in fallback-modus.
- Supabase CLI moet gelinkt zijn aan het juiste project-ref voordat je schema/types betrouwbaar kunt synchroniseren.
- `lint` en `typecheck` moeten groen blijven op de branch waar stap 1 start.
