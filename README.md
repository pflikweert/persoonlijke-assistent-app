# Persoonlijke Assistent App

## Projectdoel
Deze repository is de lokale basis voor een React Native / Expo app met Expo Router.  
De focus ligt op een stabiele ontwikkelomgeving met duidelijke scripts, configuratie en structuur.  
Functionele productfeatures worden pas toegevoegd nadat de projectfundering lokaal op orde is.

## Lokale startcommando's
```bash
npm install
npm run dev
npm run ios
npm run android
npm run web
npm run lint
npm run typecheck
```

## Env-overzicht
- `.env.example`: template met verwachte variabelen en geen secrets.
- `.env.local`: lokale waarden voor jouw machine, niet committen.
- `.env`: optioneel gedeeld lokaal bestand, niet committen.
- Public client vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_APP_ENV`.
- Server-only vars: `SUPABASE_SECRET_KEY`, `SUPABASE_PROJECT_REF`, `OPENAI_API_KEY`.
- `OPENAI_API_KEY` blijft strikt server-side en mag nooit in Expo clientcode of `EXPO_PUBLIC_*` variabelen terechtkomen.

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
npx supabase gen types typescript --linked --schema public > src/lib/supabase/database.types.ts
```

## Server-side AI scaffold
- Locatie: `src/server/ai`
- Flows met stubs: transcriptie, entry normalization, day composition, period reflection.
- Alleen contracten + structuur; nog geen productprompts of businessflows.
- Geen Realtime API en geen vector store logica in deze fase.
