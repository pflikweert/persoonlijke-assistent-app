---
id: task-aiqs-runtime-db-binding-voor-live-prompts
title: AIQS runtime DB-binding voor live prompts
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-06-04
summary: "Maak AIQS de runtime-bron voor alle huidige promptfamilies, zodat prompt/model/system/config niet langer hardcoded uit codehelpers komen maar uit live AIQS-versies in de database."
tags: [aiqs, runtime, prompts, supabase, openai]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 4
---





# AIQS runtime DB-binding voor live prompts

## Probleem / context

AIQS kan vandaag live promptversies beheren en testen, maar productieflows lezen nog niet uit die live AIQS-versies. `process-entry`, `renormalize-entry`, `generate-reflection` en `admin-regeneration-job` bouwen prompt/model/system prompt nog direct uit codehelpers zoals `prompt-specs.ts` en `day-journal-contract.mjs`.

Daardoor blijft AIQS deels een editor- en evaluatielaag naast de runtime, in plaats van de bron van waarheid voor de huidige AI-taken.

## Gewenste uitkomst

Voor alle huidige AIQS-managed families leest runtime zijn prompt/model/system/config uit live AIQS-versies in de database. De app gebruikt geen hardcoded prompttekst meer voor deze families.

De eerste slice draait fail-closed: als een vereiste live AIQS-binding ontbreekt of ongeldig is, stopt de betreffende AI-call expliciet met een duidelijke serverfout en logspoor.

## User outcome

Een founder of admin kan promptwijzigingen in AIQS beheren en weet dat productieflows dezelfde live AIQS-versies gebruiken als de studio. Er is geen verborgen tweede promptwaarheid in code meer voor deze families.

## Functional slice

Één afgeronde AIQS-runtime slice die:

1. runtime-binding metadata toevoegt aan AIQS-taken
2. alle huidige promptfamilies runtime uit live AIQS-versies laat lezen
3. technische variantprompts (`repair`, `renormalization`) ook beheersbaar maakt via AIQS
4. AIQS admin duidelijk laat zien welke taken runtime-driver zijn en welke compound-member of technische variant

## Entry / exit

- Entry: een productie- of adminflow wil een AIQS-managed OpenAI-call doen voor entry normalization, day journal of reflection.
- Exit: de flow laadt de vereiste live AIQS-binding uit DB en gebruikt die voor prompt/model/system/config, of faalt expliciet als die binding ontbreekt of ongeldig is.

## Happy flow

1. Founder importeert of beheert runtime-baselines in AIQS, inclusief technische varianttasks.
2. Runtimeflow vraagt een binding op via een gedeelde resolver, bijvoorbeeld `entry_normalization.primary`.
3. Resolver vindt exact één geldige live AIQS-versie en levert `model`, `systemInstructions`, `promptTemplate`, `configJson`, `taskKey` en `versionId`.
4. De betreffende edge function assembleert de input payload zoals nu, maar gebruikt prompt/model/system/config uit de live AIQS-binding.
5. AIQS admin toont eerlijk welke taak runtime-driver is en welke taak een technische variant of compound-member is.

## Non-happy flows

- Empty state: geen live versie voor een vereiste runtime binding geeft expliciete serverfout.
- Permission denied / unavailable: niet-admin blijft geblokkeerd voor AIQS admin, zonder runtimeverbreding naar end-user beheer.
- Validation / unsupported state: live versie met ontbrekende prompt, model of ongeldige runtime metadata wordt geweigerd.
- Failure / retry / cancel: DB-resolve of binding-load failure geeft duidelijk logspoor met `runtime_binding_key`, task key en foutreden; geen code fallback.

## UX / copy

- AIQS admin gebruikt bestaande admin-shell en taskdetailpatronen.
- Runtime-bewuste labels moeten expliciet maken:
  - welke taak `runtime-driver` is
  - welke taak `compound-member` is
  - welke variant `primary`, `repair` of `renormalization` is
- Technische varianttasks mogen zichtbaar zijn als advanced/runtime-varianten, niet als gewone end-user taken.

## Data / IO

- Input:
  - runtime binding key zoals `entry_normalization.primary`
  - bestaande flow-inputs zoals `rawText`, `dayJournals`, `entries`
- Output:
  - live AIQS runtime binding met `model`, `systemInstructions`, `promptTemplate`, `configJson`, `taskKey`, `versionId`
  - expliciete runtimefout bij ontbrekende of ongeldige binding
- Opslag/API/service/file-impact:
  - schema-uitbreiding voor runtime metadata op AIQS-taken
  - nieuwe technische AIQS task keys:
    - `entry_cleanup_repair`
    - `entry_renormalization`
    - `day_journal_repair`
  - gedeelde runtime resolver voor live AIQS-bindingen
  - updates aan `admin-ai-quality-studio`, `process-entry`, `renormalize-entry`, `generate-reflection`, `admin-regeneration-job`
  - client/admin types uitbreiden met runtime metadata
- Statussen:
  - live binding found / missing / invalid
  - runtime driver / compound member / technical variant
  - primary / repair / renormalization

## Waarom nu

- AIQS is pas een echte runtime-governance laag wanneer productie dezelfde live promptbron gebruikt.
- Dit verkleint promptdrift tussen testresultaten in AIQS en productiegedrag.
- Het houdt de scope productief: alleen prompt/model/system/config migreren naar DB, zonder direct alle parsing en guardrails te herbouwen.

## In scope

- Runtime metadata toevoegen voor alle huidige families.
- Live AIQS-binding resolver bouwen.
- Runtime-calls migreren voor:
  - `process-entry`
  - `renormalize-entry`
  - `generate-reflection`
  - `admin-regeneration-job`
- Baseline import uitbreiden voor technische varianttasks.
- AIQS admin readmodel/types uitbreiden voor runtime-bewuste taakrepresentatie.
- Hardcoded promptwaarheid voor deze families uit runtimepad verwijderen.

## Buiten scope

- Nieuwe AI-task families buiten de huidige entry/day/reflection set.
- Grote editor-redesigns of AIQS-themawerk.
- Migratie van output cleanup, validators of heuristische guardrails naar DB.
- End-user featurewerk buiten de bestaande AI-flows.

## Oorspronkelijk plan / afgesproken scope

- Maak AIQS de runtime-bron voor alle huidige promptfamilies.
- Eerste slice bindt alle huidige families aan live AIQS-versies.
- Runtime draait fail-closed zonder code fallback.
- Alleen `model`, `system_instructions`, `prompt_template` en toegestane runtime config gaan DB-driven.
- Input assembly, output parsing, cleanup en guardrails blijven voorlopig code-side.

## Expliciete user requirements / detailbehoud

- Prompts moeten van code-driven naar database-driven gaan.
- Alle requests van AIQS moeten die DB-bron gaan gebruiken en niet meer hardcoded in de codebase zitten.
- Migratie geldt voor alle huidige families, niet alleen entry.
- Geen code fallback als live AIQS-binding ontbreekt.
- Technische promptvarianten moeten ook via AIQS beheersbaar zijn.

## Status per requirement

- [x] AIQS wordt runtime-bron voor alle huidige families — status: gebouwd
- [x] Runtime gebruikt geen hardcoded prompttekst meer voor deze families — status: gebouwd
- [x] Fail-closed gedrag zonder code fallback — status: gebouwd
- [x] Technische varianttasks zijn via AIQS beheersbaar — status: gebouwd
- [x] AIQS admin toont runtime-driver en variantmetadata — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale reflection/day/entry runtime-template rendering is als pure helper toegevoegd voor app-readmodel en als edge-safe helper binnen `supabase/functions/_shared/**`.
- Nieuwe lokale unit-tests toegevoegd voor prompt-template rendering, prompt-version fallback, AIQS readmodel-routing en Supabase Edge Function import boundaries.
- Baseline-import is gehard tot een idempotent importresultaat per task/binding met `created`, `updated`, `live_created`, `already_ok` en `error`.
- Clean bootstrap is bewezen via internal-token pad en founder-auth pad; handmatige lokale SQL/tsx repair is niet meer nodig voor de vereiste live bindings.
- Reflection-baseline en reflection-fixture zijn aangescherpt zodat week/maand reflecties weer expliciete patroon-/verschuivingssignalen halen.
- AIQS group screen toont weer alle onderdelen van een gedeelde runtime-family, inclusief read-only compound members; read-only onderdelen routeren naar de gedeelde prompt.
- Live-readiness hardening toegevoegd: AIQS-managed runtime mag geen productinhoud meer reconstrueren via hardcoded fallbacks. Runtime gebruikt live AIQS/OpenAI-output of faalt expliciet met reason-code; retries, cleanup en validators blijven toegestaan.
- Production push hardening toegevoegd: GitHub production deploy configureert `ADMIN_AI_QUALITY_INTERNAL_TOKEN`, deployt `admin-ai-quality-studio` mee en draait daarna een harde `import_runtime_baseline` gate zodat alle AIQS runtime-baselines production-ready en live staan of de deploy faalt.
- Nieuwe verify/deploy helper `npm run aiqs:runtime-baseline:ensure` toegevoegd voor lokaal en CI-gebruik; vereist in production `SUPABASE_PUBLISHABLE_KEY` en `ADMIN_AI_QUALITY_INTERNAL_TOKEN`.
- GitHub secret alias-fix toegevoegd: production deploy accepteert ook bestaande `EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY` en `ADMIN_REGEN_INTERNAL_TOKEN`, zonder secretwaarden in git te zetten.
- Production deploy hoeft geen GitHub AIQS internal-token secret meer te hebben: de workflow genereert per deploy een gemaskeerde tijdelijke token, zet die als Supabase function secret en gebruikt die direct voor de baseline gate.
- Production deploy hoeft ook geen GitHub publishable-key secret meer te hebben: als `SUPABASE_PUBLISHABLE_KEY`/`EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY` ontbreekt, haalt de workflow de anon/publishable key op via `supabase projects api-keys`.
- Reviewbevindingen voor deze hardening:
  - `process-entry` en `renormalize-entry` gebruiken live AIQS bindings, maar bevatten nog zelfgemaakte entry title/body/summary fallbacks.
  - `process-entry` en `regenerate-day-journal` kunnen nog een zelfgemaakt dagjournal teruggeven via `createFallbackDayJournal`.
  - `admin-regeneration-job` gebruikt bij entry-resultaten nog bestaande row/context fallbackvelden als OpenAI JSON incompleet is.
  - `generate-reflection` faalt al hard bij invalid output, maar gebruikt nog fallback-copy in logging.
  - `prompt-specs.ts` blijft alleen baseline/import-bron en mag niet als runtime fallback dienen.
  - `src/server/ai/**` bevat stub-services en moet legacy/test-only blijven, niet live runtime.

## Uitvoerblokken / fasering

- [x] Blok 1: schema en AIQS runtime metadata toevoegen.
- [x] Blok 2: live binding resolver en baseline import uitbreiden.
- [x] Blok 3: runtime-calls migreren naar live AIQS-bindingen.
- [x] Blok 4: admin readmodel/types aanscherpen en gerichte verify uitvoeren.
- [x] Blok 5: hardening-review uitvoeren voor reflectionkwaliteit, clean bootstrap en deploy-import boundaries.
- [x] Blok 6: live-readiness hardening uitvoeren voor no-hardcoded-output-fallback runtimegedrag.
- [x] Blok 7: production push gate toevoegen zodat AIQS runtime-baselines automatisch live en clean zijn na deploy.

## Concrete checklist

- [x] Nieuwe taskfile en taskflow sync vastleggen.
- [x] Runtime metadata en technische taskkeys aan schema/baseline toevoegen.
- [x] Shared runtime resolver bouwen.
- [x] `process-entry`, `renormalize-entry`, `generate-reflection` en `admin-regeneration-job` op resolver aansluiten.
- [x] AIQS admin types/readmodel uitbreiden voor runtime metadata.
- [x] Baseline-import idempotent en clean-bootstrap safe maken.
- [x] Edge runtime losmaken van imports buiten `supabase/functions/**`.
- [x] Reflection smoke weer groen krijgen op patroon-/verschuivingssignalen.
- [x] Contentgenererende fallbacks uit AIQS-managed runtimeflows verwijderen of isoleren.
- [x] Guard-test toevoegen tegen verboden runtime-output fallbacks.
- [x] Production deploy workflow importeert en verifieert AIQS runtime-baselines na function deploy.
- [x] Production deploy workflow accepteert bestaande GitHub secret aliases voor publishable key en internal token.
- [x] Production deploy workflow genereert zelf een tijdelijke AIQS internal token als deploy-secret voor de baseline gate.
- [x] Production deploy workflow kan de Supabase publishable key afleiden via Supabase CLI/API wanneer er geen GitHub secret alias bestaat.
- [~] Docs sync en closeout uitvoeren.

## Acceptance criteria

- [x] `process-entry` gebruikt live `entry_cleanup` voor primary normalization.
- [x] `process-entry` gebruikt live `entry_cleanup_repair` voor repair normalization.
- [x] `renormalize-entry` gebruikt live `entry_renormalization`.
- [x] day journal compose gebruikt live `day_narrative` en repair gebruikt live `day_journal_repair`.
- [x] week reflectie gebruikt live `week_narrative`; maand reflectie gebruikt live `month_narrative`.
- [x] `admin-regeneration-job` gebruikt dezelfde runtime resolver als productieflows.
- [x] Ontbrekende of ongeldige live binding geeft expliciete fout en geen code fallback.
- [x] AIQS admin kan runtime-driver en technische variantstatus tonen.
- [x] Baseline-import werkt via internal-token en founder-auth zonder handmatige repair.
- [x] Reflection smoke haalt de bestaande kwaliteitspoort voor patroon-/verschuivingssignalen.
- [x] Supabase Edge Functions importeren geen lokale runtimehelpers meer buiten `supabase/functions/**`.
- [x] AIQS-managed runtime genereert geen hardcoded fallback title/body/summary/day-journal output meer.
- [x] No-speech/empty transcript geeft expliciete empty/error status en geen fake normalized entry-content.
- [x] Admin regeneration telt incomplete OpenAI-output als failed item en hergebruikt geen oude content.
- [x] Productiepush faalt als AIQS runtime-baselines niet foutloos live gezet of geverifieerd kunnen worden.

## Blockers / afhankelijkheden

- Baseline-import en huidige AI task seeds moeten uitbreidbaar blijven zonder dat bestaande AIQS-data corrupt raakt.
- Runtime-family/composition metadata moet klein blijven en niet uitgroeien tot brede nieuwe control-plane scope.

## Verify / bewijs

- `npx supabase db push --local`
- gerichte unit-tests op runtime resolver
- gerichte unit-tests op AIQS readmodel-routing
- import-boundary unit-test voor Supabase Edge Functions
- `npm run verify:local-aiqs-bootstrap`
- gerichte smoke voor minstens entry + reflection
- `npm run verify:local-flow`
- `npm run verify:local-reflection-flow`
- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

Laatste hardeningbewijs:

- `npm run test:unit -- ai-quality` — groen, 3 files / 13 tests.
- `npm run test:unit -- ai-quality-runtime aiqs-no-hardcoded-output-fallbacks day-journal-contract-strict` — groen, 3 files / 8 tests.
- `npm run lint` — groen.
- `npm run typecheck` — groen.
- `npm run supabase:functions:restart` — uitgevoerd; lokale runtime pid `3310`.
- `npm run verify:local-flow` — groen; entry + day journal runtime via lokale Supabase/OpenAI.
- `npm run verify:local-reflection-flow` — groen; week + month reflection runtime via lokale Supabase/OpenAI.
- `npm run aiqs:runtime-baseline:ensure` — groen met tijdelijke lokale internal token; import summary `{"created":0,"updated":0,"live_created":0,"already_ok":14,"error":0}`.
- `npm run lint` — groen na production push gate.
- `npm run typecheck` — groen na production push gate.
- `npm run taskflow:verify` — groen na production push gate.
- GitHub secret alias-fix: lokaal statisch gevalideerd met `sh -n scripts/ensure-aiqs-runtime-baseline.sh`, `npm run lint`, `npm run typecheck` en `npm run taskflow:verify`.
- GitHub deploy-token fix: AIQS internal token wordt in Actions gegenereerd met `openssl rand -hex 32`, gemaskeerd en via `supabase secrets set` naar production gezet.
- GitHub publishable-key fix: publishable key wordt optioneel uit GitHub Secrets gelezen en anders via `npx supabase projects api-keys --output json` afgeleid en gemaskeerd.

Live-readiness notes:

- Entry-normalisatie gebruikt live AIQS output voor `title`, `body` en `summary_short`; geen body-derived summary of generieke titel meer.
- `summary_short` mag alleen leeg blijven wanneer het veld door OpenAI aanwezig is en de live AIQS `technical_contract.allowEmptySummaryShort` dat toestaat.
- Day journal en reflection runtime-drivers gebruiken compound output-schema's voor hun volledige OpenAI JSON-contract.
- Structured Outputs worden alleen gebruikt voor object-schema's; legacy/non-object member-schema's blijven JSON-transport met runtimevalidatie.
- Productie heeft dezelfde baselinefix nodig via AIQS baseline import of live-versie-update voordat productieclaims worden gemaakt.
- GitHub production deploy voert die baselinefix automatisch uit via `scripts/ensure-aiqs-runtime-baseline.sh`.
- Production secrets voor publishable key zijn optioneel:
  - preferred: `SUPABASE_PUBLISHABLE_KEY` of `EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY`
  - fallback: workflow haalt anon/publishable key op via Supabase CLI met `SUPABASE_ACCESS_TOKEN`
- Er is geen GitHub secret meer nodig voor `ADMIN_AI_QUALITY_INTERNAL_TOKEN`; de workflow genereert die per deploy en zet hem als Supabase function secret.
- De gate overschrijft alleen baseline-managed live versies via de bestaande idempotente import; afwijkende custom live versies geven `error` en blokkeren de deploy in plaats van stil overschrijven.

## Reconciliation voor afronding

- Oorspronkelijk plan: AIQS runtime DB-driven maken voor alle huidige promptfamilies, inclusief fail-closed gedrag en technische variantpromptbeheer.
- Toegevoegde verbeteringen: edge-safe runtime-render helper, idempotente baseline-import, clean-bootstrap verify, reflectionkwaliteit-hardening, import-boundary test en runtime-bewuste adminlabels.
- Afgerond:
  - schema + nieuwe technische tasks
  - live binding resolver
  - runtime-call migratie voor entry/day/reflection/admin regeneration
  - admin readmodel/type-uitbreiding
  - unit-tests + entry/day smoke + reflection smoke + clean bootstrap
- Open / blocked:
  - docs bundle + verify nog afronden

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/open-points.md`
- `docs/project/25-tasks/open/mvp-admin-aiqs-productie-bundel.md`


## Commits

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-04T20:47:24+02:00 — fix: support existing deploy secret aliases

- 2026-06-04T20:49:20+02:00 — fix: generate AIQS deploy token

- 2026-06-04T20:51:08+02:00 — fix: resolve deploy publishable key