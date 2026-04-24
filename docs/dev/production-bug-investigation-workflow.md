# Production bug investigation workflow

## Doel

Een compacte, herhaalbare workflow voor productiebug-onderzoek zonder improvisatie, met vaste task-koppeling, vaste diagnosevolgorde en minimale productierisico's.

## Altijd eerst

1. Koppel het onderzoek aan een **bestaande** task in `docs/project/25-tasks/**`.
2. Noteer de repro-context:
   - datum/tijd
   - route/scherm
   - platform of device
   - accountsoort
   - exacte handeling
3. Formuleer een expliciete hypothese.

## Diagnosevolgorde

1. Inspecteer Vercel runtime/deployment context.
2. Inspecteer Supabase logs voor:
   - `api`
   - `auth`
   - `storage`
   - `postgres`
3. Gebruik productie alleen read-only voor diagnose, metadata en logs.
4. Zet na remote/prod diagnosecontext direct terug naar `supabase_local`.
5. Reproduceer pas daarna in productie met de dedicated agent-testaccount.
6. Koppel bevindingen aan timestamp, route en request/flow-id waar beschikbaar.
7. Label iedere conclusie als:
   - `bevestigd`
   - `onbevestigd`
   - `blocked`

## Vercel-regel

- Gebruik de gekoppelde Vercel-capability als die in de sessie beschikbaar is.
- Als die niet beschikbaar is, gebruik de bestaande Vercel CLI/API-route.
- Leg altijd vast:
  - deployment-id of deployment-context
  - route
  - relevante logregels
  - timestamp van de observatie

## Supabase-regel

- Default blijft `supabase_local`.
- `supabase_remote_ro` is alleen toegestaan voor productiegerichte read-only diagnose.
- Gebruik remote/prod nooit voor writes of normale ontwikkeliteraties.
- Activeer target-switches via:
  - `node scripts/codex-mcp-target.mjs remote-ro --project-ref <project_ref>`
  - `node scripts/codex-mcp-target.mjs local`

## Dedicated agent-testaccount

- Gebruik een dedicated productie test-user voor agent-repro.
- Deze account is:
  - magic-link-only
  - zonder adminrechten
  - uitsluitend voor reproduceerbaar onderzoek
- Concrete accountdetails horen **niet** in de repo.
- Gebruik alleen het ops secret contract:
  - `PROD_AGENT_TEST_EMAIL`
  - `PROD_AGENT_TEST_INBOX_ACCESS`

## Datastrategie in productie

- Houd exact één vaste baseline-entry aan voor snelle sanity-checks.
- Maak per onderzoek een nieuwe gemarkeerde sessie-entry met prefix:
  - `[AGENT_PROD_REPRO] <ISO-timestamp> gallery`
- Baseline-entry blijft staan.
- Sessie-entries zijn disposable en krijgen na onderzoek een expliciete cleanup-stap.

## Vastleggen van learnings

- Schrijf bevestigde learnings terug naar:
  - de actieve taskfile
  - dit runbook als het een stabiele herhaalregel is
- Zet geen onbevestigde aannames weg als structurele learning.
