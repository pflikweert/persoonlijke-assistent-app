---
id: task-aiqs-draft-live-promotie-en-rollback-flow
title: AIQS draft-live promotie en rollback flow
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-03
summary: "AI Quality Studio krijgt een complete lifecycle-flow: draft testen, reviewen, promoten naar live en oudere live-versies terugzetten."
tags: [aiqs, admin, prompt-governance, lifecycle, supabase]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: [admin-aiqs-linear-interface-kit-refresh, task-aiqs-runtime-db-binding-voor-live-prompts]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 2
---



## Probleem / context

AIQS kan drafts maken, bewerken, testen, vergelijken en reviews opslaan, maar de lifecycle stopt nog vóór productiebeheer: er is geen gecontroleerde promotie van draft naar live en geen rollback naar een oudere live-versie. Runtime DB-binding gebruikt precies één live versie per task, dus deze statuswissel moet veilig en transactioneel zijn.

## Gewenste uitkomst

Een AIQS-admin kan vanuit de bestaande admin-console zien welke versie live is, welke draft nog bewijs mist, welke draft klaar is voor livegang en welke oudere versies rollbackbaar zijn. Promotie en rollback zijn één duidelijke actie met confirmatie, waarna de runtime direct de nieuwe live versie gebruikt.

## User outcome

Een admin kan zonder handmatige SQL of codewijziging een promptwijziging van draft naar live brengen, en bij regressie een eerder-live versie terugzetten.

## Functional slice

Lifecycle-complete AIQS versiebeheer voor één taskfamilie/variant per keer: draft -> test/review -> live, plus rollback van eerder live geweest archived versies.

## Entry / exit

- Entry: admin opent een AIQS task detail of validate screen.
- Exit: geselecteerde versie is live, vorige live is archived, UI is ververst en toont de actuele live status.

## Happy flow

1. Admin maakt of opent een draft.
2. Admin draait een test en slaat review `beter` of `gelijk` op.
3. UI toont `Zet live`.
4. Admin bevestigt promotie.
5. Backend archiveert vorige live versie en zet de draft live.
6. Task detail toont nieuwe live versie en oude live versie als rollbackbaar.
7. Admin kan een rollbackbare archived versie bevestigen en opnieuw live zetten.

## Non-happy flows

- Empty state: geen draft/live toont duidelijke eerstvolgende actie.
- Permission denied / unavailable: directe function call zonder AIQS capability blijft denied.
- Validation / unsupported state: draft zonder completed positive review blokkeert promotie; archived versie zonder eerdere `became_live_at` blokkeert rollback.
- Failure / retry / cancel: confirmatie kan worden geannuleerd; backendfout blijft zichtbaar en verandert geen versie-status.

## UX / copy

- Gebruik bestaande admin-console primitives en shared confirm/sheet patronen.
- Labels:
  - `Zet live`
  - `Rollback naar deze versie`
  - `Test nodig`
  - `Review nodig`
  - `Klaar voor live`
  - `Deze versie wordt direct runtime-live.`
  - `Huidige live versie wordt gearchiveerd en vX wordt opnieuw live.`
- Geen nieuwe modalstijl, geen flow-redesign buiten lifecycle-acties.

## Data / IO

- Input: `taskKey`, `versionId`.
- Output: `promotedVersion`, `archivedVersionId`, `previousLiveVersionNumber`, `mode`.
- Opslag/API/service/file-impact: Supabase migration met transactionele RPC, `admin-ai-quality-studio` action, clienttypes/service, AIQS UI.
- Statussen: `draft`, `live`, `archived`; `testing` blijft bestaande enumwaarde maar wordt niet nieuw gebruikt.

## Waarom nu

AIQS is runtime-bron voor prompts geworden. Zonder live-promotie en rollback is promptbeheer nog niet production-complete en blijft beheer afhankelijk van handmatige reparaties.

## In scope

- Transactionele DB/RPC voor live-promotie en rollback.
- Edge Function action `promote_version_live`.
- Clienttypes/service wrapper.
- Derived lifecycle helper en unit-tests.
- Task detail lifecycle-workbench en validate primary action.
- Confirmatie voor promotie en rollback.
- Gerichte static, unit, local DB/function en browser-smoke verify.

## Buiten scope

- Nieuwe AI promptfamilies.
- Nieuwe OpenAI calls.
- Runtime output/parsingwijzigingen.
- Nieuwe datatabellen voor auditlog of analytics.
- Founder-only rollback.
- Consumer UI.

## Oorspronkelijk plan / afgesproken scope

# AIQS Lifecycle Compleet: Draft → Review → Live + Rollback

We maken AI Quality Studio lifecycle-compleet: een admin kan een draft testen, beoordelen, promoten naar live, en een oudere live-versie terugzetten. De runtime blijft fail-closed en leest altijd de ene live AIQS-versie. Gekozen beleid: promotie van drafts vereist bewijs en rollback gebeurt door een oudere versie opnieuw live te maken, zonder kopie.

## Expliciete user requirements / detailbehoud

- Voeg lifecycle-action `promote_version_live` toe aan `admin-ai-quality-studio`.
- Draft -> live mag alleen met minimaal één completed test run met reviewer label `better` of `equal`.
- Huidige live versie wordt automatisch `archived`.
- Nieuwe live versie krijgt `status = live`, `became_live_at = now`, `locked_at = now`.
- Archived rollback mag alleen voor versies die eerder live waren (`became_live_at` aanwezig).
- Statuswissel moet transactioneel via Supabase migration/Postgres RPC.
- Bestaande unique partial index op één live versie per task blijft harde guardrail.
- Task detail krijgt lifecycle-workbench.
- Validate toont na positief oordeel `Zet live`.
- Confirmaties gebruiken bestaande shared primitives.
- Nieuwe servicefunctie `promoteAdminAiQualityStudioVersionLive({ taskKey, versionId })`.
- Nieuwe derived UI helper `getAiQualityVersionLifecycleState(detail, version)`.

## Status per requirement

- [x] Lifecycle action `promote_version_live` — status: gebouwd
- [x] Transactionele RPC + DB guardrails — status: gebouwd en lokaal toegepast
- [x] Draft promotie met positive-review gate — status: gebouwd en RPC-smoke bewezen
- [x] Rollback van eerder-live archived versie — status: gebouwd en RPC-smoke bewezen
- [x] Clienttypes/service wrapper — status: gebouwd
- [x] Lifecycle helper + unit-tests — status: gebouwd en getest
- [x] Task detail lifecycle-workbench — status: gebouwd
- [x] Validate `Zet live` actie — status: gebouwd
- [x] Confirmatie en denial/error states — status: gebouwd; no-auth Edge Function-call lokaal geweigerd
- [x] Verify en browser smoke — status: grotendeels bewezen; volledige klik-E2E blijft user-review omdat de beschikbare browserfallback geen interactie-API bood

## Toegevoegde verbeteringen tijdens uitvoering

- RPC-response parsing in de Edge Function robuuster gemaakt voor array- en objectvormige Supabase RPC responses.
- Versielijst-acties expliciet gemaakt als `Open draft`, `Valideren`, `Zet live` en `Rollback naar deze versie`.
- Web-hydration regressie opgelost door nested `<button>` in de versielijst te vermijden.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow, schema/function/UI state bevestigen.
- [x] Blok 2: Supabase migration/RPC en lokale DB toepassen.
- [x] Blok 3: Edge Function action + service/types toevoegen.
- [x] Blok 4: lifecycle helper + unit-tests toevoegen.
- [x] Blok 5: AIQS detail/validate UI aansluiten.
- [x] Blok 6: verify, local function restart, browser-smoke en task reconciliation.

## Concrete checklist

- [x] Taskfile aanmaken en bovenaan `in_progress` lane zetten.
- [x] Supabase migration maken via CLI.
- [x] RPC implementeren en lokaal toepassen.
- [x] Edge Function action `promote_version_live` implementeren.
- [x] Clienttypes/service/index exports toevoegen.
- [x] Lifecycle helper met tests toevoegen.
- [x] Task detail UI uitbreiden.
- [x] Validate UI uitbreiden.
- [x] Static/unit/local/browser verifies draaien.

## Acceptance criteria

- [x] Draft zonder positive review kan niet live.
- [x] Draft met completed `beter` of `gelijk` review kan live.
- [x] Vorige live versie wordt archived.
- [x] Eerder-live archived versie kan rollback-live worden.
- [x] Archived versie zonder `becameLiveAt` kan niet rollback-live worden.
- [x] Directe function call zonder AIQS access blijft denied.
- [x] Runtime heeft na promotie/rollback exact één live versie per task.
- [x] UI toont duidelijke next action en blokkerende reden.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- Supabase changelog gecontroleerd voor relevante breaking changes; Data API-exposure change is niet van toepassing omdat deze slice geen nieuwe exposed table toevoegt en de RPC via service-role Edge Function wordt gebruikt.
- `npx supabase db push --local` — groen; migration `20260603161816_aiqs_promote_version_live_rpc.sql` lokaal toegepast.
- Lokale Postgres/RPC-smoke via `docker exec ... psql` — groen:
  - draft zonder positive review faalt;
  - draft met completed `better` review wordt live;
  - vorige live wordt archived;
  - archived zonder `became_live_at` faalt;
  - eerder-live archived versie kan rollback-live worden;
  - na promotie en rollback blijft live-count per task exact `1`.
- `curl` zonder auth naar `admin-ai-quality-studio` met `promote_version_live` — geweigerd met `Missing authorization header`.
- `npm run test:unit -- ai-quality` — groen, 3 testfiles / 11 tests.
- `npm run typecheck` — groen.
- `npm run lint` — groen.
- `npm run taskflow:verify` — groen.
- `npm run supabase:functions:restart` — groen; lokale functions runtime draait op pid `97158`.
- Browserfallback smoke op `http://localhost:8081/settings-ai-quality-studio/day_narrative`:
  - vóór polish: nested `<button>` hydration error gevonden in versielijst;
  - na fix: route opent zonder console-errors; alleen bestaande React Native Web dev-warning over `shadow*` blijft zichtbaar;
  - volledige klik-E2E kon niet worden afgerond omdat de beschikbare browserfallback alleen tab/resize exposeerde en de route in deze context op loading bleef.

## Reconciliation voor afronding

- Oorspronkelijk plan: draft -> review -> live + rollback lifecycle compleet maken.
- Expliciete user requirements: alle gevraagde lifecycle-, RPC-, service-, UI- en confirmatiepunten zijn gebouwd.
- Toegevoegde verbeteringen: robuustere RPC-response parsing en web-hydration fix voor de versielijst.
- Afgerond: implementatie, lokale migration, RPC-smoke, no-auth denial-smoke, unit/type/lint/taskflow en lokale function restart.
- Open / blocked: volledige handmatige UI-klikreview van draft maken -> testen -> review opslaan -> live zetten -> rollback blijft nog user-review/runtime-smoke omdat de browserfallback in deze sessie onvoldoende interactie-API bood.

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/25-tasks/open/admin-aiqs-linear-interface-kit-refresh.md`
- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`


## Commits

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function