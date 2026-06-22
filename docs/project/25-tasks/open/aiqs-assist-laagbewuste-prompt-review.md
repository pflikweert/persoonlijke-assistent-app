---
id: aiqs-assist-laagbewuste-prompt-review
title: AIQS Assist laagbewuste prompt review
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: "AIQS Assist wordt een laagbewuste Prompt Reviewer + Prompt Architect voor draft promptvelden, met diagnose, laagdiscipline, veilige single-layer acties en een expliciete all-fields correctieactie."
tags: [aiqs, prompt-assist, prompt-governance, admin, openai]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: [aiqs-runtime-db-binding-voor-live-prompts, aiqs-admin-console-uiux-linear-richting]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
active_agent: Codex
active_agent_model: GPT-5
active_agent_runtime: codex
active_agent_since: "2026-06-22T15:26:26Z"
active_agent_status: running
active_agent_settings: default
---


## Probleem / context

AIQS Assist bestaat al in de draft editor, maar voelt nog te veel als algemene herschrijfhulp. Per promptveld moet Assist begrijpen welke laag wordt bewerkt, wat die laag wel/niet mag bevatten, welke sibling-lagen al regels bevatten en of de huidige tekst eigenlijk in een andere laag thuishoort.

Voorbeeld: een Algemene instructie met vooral promptarchitectuur en laagdiscipline beschrijft niet het taakdoel voor het model. Assist moet dit herkennen en een concrete taakdoel-instructie kunnen voorstellen.

## Gewenste uitkomst

AIQS Assist functioneert als Prompt Reviewer + Prompt Architect. Elke Assist-click geeft een laagbewuste diagnose, problemen, voorstel, uitleg en risico-inschatting.

Default apply blijft veilig: gewone acties vervangen alleen het huidige veld. De expliciete actie `verdeel_over_velden` / `Controleer alle lagen` mag meerdere bewerkbare velden voorstellen en na expliciete `Alle lagen toepassen` bijwerken, met per veld reden en risico.

## User outcome

Een AIQS-admin kan promptlagen sneller en veiliger verbeteren: systemregels blijven harde grenzen, general bevat het taakdoel en field-lagen blijven veldspecifiek. Prompt drift en dubbele/tegenstrijdige instructies worden eerder zichtbaar.

## Functional slice

Eén afgeronde hardening-slice voor AIQS draft Assist:

1. nieuwe laagbewuste Assist-acties
2. rijkere editorcontext naar `prompt_assist_preview`
3. reviewer-gerichte outputvorm
4. lokale waarschuwingen voor laagdiscipline
5. UI-panel dat diagnose/problemen/voorstel/waarom/risico toont

## Entry / exit

- Entry: admin opent een AIQS draft editor en klikt `Assist` bij een system-, general- of field-laag.
- Exit: admin ziet laagbewuste diagnose en kan het voorstel toepassen op alleen die laag, kopiëren of sluiten.

## Happy flow

1. Admin opent `day_narrative` draft en klikt Assist bij `Algemene instructie`.
2. Assist ziet sibling-lagen, tokens, outputcontract, taskmetadata en current layer.
3. Assist herkent architectuurtaal en ontbrekend taakdoel.
4. Assist toont diagnose, issues, voorstel, waarom en laagfit.
5. Admin klikt `Toepassen`; alleen `generalInstruction` wordt vervangen.
6. Bij `Controleer alle lagen` ziet admin voorstellen per laag en klikt expliciet `Alle lagen toepassen`.

## Non-happy flows

- Empty state: lege laag krijgt uitleg wat hier hoort en een voorstel voor deze laag.
- Permission denied / unavailable: bestaande AIQS capability/server-side denial blijft leidend.
- Validation / unsupported state: stale/ongeldige Assist-action valt terug op alias of duidelijke inputfout.
- Failure / retry / cancel: Assist-fout blijft in het panel zichtbaar; bestaande drafttekst wijzigt niet.

## UX / copy

- Assist-knop blijft compact.
- Tooltip/label per laag:
  - System: `Review harde grenzen`
  - General: `Review taakdoel`
  - Field: `Review veldregels`
- Panel toont:
  - `Diagnose`
  - `Problemen`
  - `Voorstel`
  - `Waarom`
  - `Laagfit / risico`
  - acties `Toepassen`, `Kopiëren`, `Sluiten`
- Inline waarschuwingen blijven kort en operationeel.

## Data / IO

- Input:
  - `taskKey`, `versionId`, prompt family/type/runtime group
  - current layer key/type/label/content
  - sibling layer contents
  - token catalog met input/output tokens
  - output schema/config
  - live baseline metadata indien beschikbaar
- Output:
  - `diagnosis`
  - `issues`
  - `suggested_text`
  - `why`
  - `layer_fit`
  - `risk_level`
  - bestaande diff/apply-compatible velden
- Opslag/API/service/file-impact:
  - types/service payload/result uitbreiden
  - `admin-ai-quality-studio` action `prompt_assist_preview` aanscherpen
  - draft editor Assist-panel aanpassen
  - pure helper + unit-tests toevoegen
- Statussen:
  - loading/error/stale preview blijven bestaand
  - risk level `low | medium | high`

## Waarom nu

AIQS is runtime-bron en versiebeheer voor prompts geworden. De editor moet admins helpen promptwijzigingen inhoudelijk veilig te maken, niet alleen tekst mooier herschrijven.

## In scope

- AIQS draft editor Assist.
- Existing server-side `prompt_assist_preview` flow.
- Promptfamilies Momenten, Vandaag, Week, Maand en shared/driver prompts die via de structured draft editor lopen.
- Read-only compound members alleen als review/read-only context; geen apply-flow.

## Buiten scope

- Runtime prompt execution wijzigen.
- Modelwijziging.
- Nieuwe OpenAI-flow naast bestaande Assist.
- Consumer UI.
- Nieuwe dependencies.
- Stilzwijgend automatisch verplaatsen tussen lagen buiten de expliciete all-fields actie.
- Prompt editor redesign buiten Assist-panel en laaghints.

## Oorspronkelijk plan / afgesproken scope

# AIQS Assist Laagbewuste Prompt Architect

AIQS Assist in de draft editor wordt omgebouwd van herschrijfhulp naar laagbewuste Prompt Reviewer + Prompt Architect. Scope blijft beperkt tot AIQS draft Assist; geen runtime prompt-execution, modelkeuze, consumer UI, schema of nieuwe dependencies.

Belangrijkste punten:

- nieuwe acties: `Review dit veld`, `Verbeter taakdoel`, `Ontdubbel met andere lagen`, `Maak compacter`, `Maak concreter`, `Check laagdiscipline`, `Schrijf voorstel voor deze laag`, `Leg uit wat hier hoort`
- rijkere context naar `prompt_assist_preview`
- reviewer-gerichte output: `diagnosis`, `issues`, `suggested_text`, `why`, `layer_fit`, `risk_level`
- single-layer apply als default
- `verdeel_over_velden` blijft behouden als generieke all-fields controleactie die meerdere velden mag voorstellen en toepassen na expliciete gebruikersactie
- lokale heuristische waarschuwingen voor laagdiscipline
- server-side Prompt Architect prompt met JSON-only output

## Expliciete user requirements / detailbehoud

- Assist moet laagbewust, prompttype-bewust en doelgericht worden.
- Context per Assist-click bevat prompt key, family, type, runtime group, current layer, current field, field content, sibling layers, tokens, schema/config, live baseline en draft id waar beschikbaar.
- Assist beoordeelt laagdiscipline, overlap, ontbrekend taakdoel, architectuurtaal, verkeerd geplaatste contractregels, veldspecifieke regels op general/system, prompt drift, vaagheid, redundantie en tegenstrijdigheid.
- UI toont Diagnose, Problemen, Voorstel, Waarom en acties Toepassen, Kopiëren, Sluiten.
- System layer is voor harde grenzen, contractregels, brongebruik, output-format, safety/runtime instructies.
- General layer is voor taakdoel, globale manier van werken en prioriteiten.
- Field layer is voor één outputveld: lengte, toon, structuur, inhoud en veldspecifieke kwaliteitscriteria.
- `Toepassen` vervangt alleen huidig veld voor gewone acties.
- `verdeel_over_velden` blijft behouden en wordt generieker: alle velden controleren, goedzetten en na expliciete apply schrijven in meerdere velden.
- Als tekst beter in andere laag hoort: gewone acties adviseren alleen; de expliciete all-fields actie mag een multi-field voorstel doen.
- Geen nieuwe prompt runtime, modelwijziging, dependencies, consumer UI of generated files direct aanpassen.

## Status per requirement

- [x] Assist is laagbewust/prompttype-bewust/doelgericht — status: gebouwd, runtime user-review nog nodig
- [x] Rijkere Assist-context wordt meegegeven — status: gebouwd
- [x] Reviewer-output met diagnose/issues/suggested_text/why/layer_fit/risk_level — status: gebouwd
- [x] Nieuwe Assist-acties en aliasing — status: gebouwd
- [x] Inline laagdisciplinewaarschuwingen — status: gebouwd
- [x] Safe single-layer apply — status: gebouwd als default voor gewone acties
- [x] Generieke all-fields actie `verdeel_over_velden` mag meerdere velden voorstellen/toepassen — status: gebouwd
- [x] UI-panel toont Diagnose/Problemen/Voorstel/Waarom/Laagfit — status: gebouwd
- [x] Server-side OpenAI prompt is Prompt Architect en JSON-only — status: gebouwd
- [x] Entry_cleanup en day_narrative runtime-smoke — status: UI-smoke groen; entry_cleanup all-fields runtime-preview groen

## Toegevoegde verbeteringen tijdens uitvoering

- Gebruikerscorrectie 2026-06-22: oude `verdeel_over_velden`-code niet verwijderen, maar generieker maken als all-fields controle/correctie. Deze actie mag alle bewerkbare promptlagen goedzetten en na expliciete apply schrijven in meerdere velden.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en bestaande Assist-contracten bevestigen.
- [x] Blok 2: pure helper/types/actions/context uitbreiden met unit-tests.
- [x] Blok 3: Edge Function Assist prompt en response-normalisatie aanscherpen.
- [x] Blok 4: draft editor Assist UI, laaghints en warnings aansluiten.
- [x] Blok 5: static, runtime smoke, docs/taskflow afronden.

## Concrete checklist

- [x] Taskfile aanmaken en bovenaan `in_progress` lane zetten.
- [x] `src/lib/aiqs-prompt-assist-review.ts` toevoegen.
- [x] Unit-tests voor action mapping, warnings en response normalizer toevoegen.
- [x] Types uitbreiden voor Assist context/result.
- [x] `_shared.ts` action list, layer hints en warnings aansluiten.
- [x] Draft editor payload en Assist-panel aanpassen.
- [x] Edge Function `prompt_assist_preview` prompt en parsing aanpassen.
- [x] Verifies en task/docs-sync uitvoeren.

## Acceptance criteria

- [x] Assist op Systeemregels geeft system-specifieke review.
- [x] Assist op Algemene instructie herkent ontbrekend taakdoel/architectuurtaal.
- [x] Assist op Dagverhaal geeft veldspecifieke review.
- [x] Assist op Samenvatting bewaakt lengte en concreetheid.
- [x] Assist op Secties bewaakt format/limiet.
- [x] Assist wijzigt alleen huidig veld bij gewone acties.
- [x] `Controleer alle lagen` toont multi-field voorstel en past meerdere velden alleen expliciet toe.
- [x] Assist werkt voor `entry_cleanup` en `day_narrative`.
- [x] Oude Assist-action ids breken stale local clients niet hard.

## Blockers / afhankelijkheden

- Geen bekende blockers.
- Dirty worktree bevat bestaande AIQS/version/docs/plugin WIP; deze task stage't later alleen relevante Assist/task/docs-paden.

## Verify / bewijs

- `npm run test:unit -- aiqs-prompt-assist` — groen, 2026-06-22
- `npm run typecheck` — groen, 2026-06-22
- `npm run lint` — groen, 2026-06-22
- `npm run verify:local-aiqs-smoke`
- Gerichte browser-smoke op draft Assist voor `entry_cleanup` en `day_narrative` — groen, 2026-06-22
- Gerichte runtime-smoke: `entry_cleanup` `Controleer alle lagen` maakt server-side preview met `Diagnose`, `Voorstel per laag` en `Alle lagen toepassen` — groen, 2026-06-22
- `npm run verify:local-aiqs-smoke` — groen, 2026-06-22
- `npm run taskflow:verify` — groen, 2026-06-22
- `npm run docs:bundle` — groen, 2026-06-22
- `npm run docs:bundle:verify` — groen, 2026-06-22
- `npm run docs:lint` — rood door bestaande markdownlint-schuld buiten deze taskfile-set; niet opgelost binnen deze scope.

## Reconciliation voor afronding

- Oorspronkelijk plan: laagbewuste Prompt Reviewer + Prompt Architect binnen AIQS draft Assist.
- Toegevoegde verbeteringen: all-fields `verdeel_over_velden` behouden en generieker gemaakt.
- Afgerond: helper/types, draft editor UI/apply, Edge Function prompt/parsing, unit/type/lint, local functions restart, AIQS smoke, gerichte draft UI-smoke, all-fields runtime-preview, taskflow/docs bundle.
- Open / blocked: task blijft `in_progress` voor user-review/commitbesluit; brede `docs:lint` faalt door bestaande docs-schuld buiten deze scope.

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/25-tasks/open/aiqs-admin-console-uiux-linear-richting.md`
- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`


## Commits

- 2026-06-22T18:04:11+02:00 — Automate active agent metadata