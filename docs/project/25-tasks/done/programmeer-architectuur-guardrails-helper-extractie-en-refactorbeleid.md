---
id: task-programmeer-architectuur-guardrails-helper-extractie
title: Programmeer-architectuur guardrails, helper-extractie en refactorbeleid
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Leg een compacte programmeer-architectuur skill en workflow vast zodat complexe code niet verder groeit in één component/file, en pas dit als eerste voorbeeld toe op de entry photo gallery helpers."
tags: [architecture, skills, refactor, qa, gallery]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

Complexe UI- en interactiecode groeit nu nog te makkelijk door in één componentfile.
Daardoor wordt testen, wijzigen en reviewen zwaarder dan nodig.

De gewenste les is niet “meer architectuur”, maar gerichter structureren:
pure logica naar helpers, stateful interactie naar hooks waar nuttig, IO naar services, en simpele glue/render-code gewoon inline laten.

## Gewenste uitkomst

Er is een compacte programmeer-architectuur skill die agents helpt om bij complexe code vaker goede helperfiles/hooks te maken, zonder scope creep of big-bang refactors.

De entry photo gallery dient als eerste voorbeeld: sorteerberekeningen en reorder helpers staan los van de component, zodat fase 1 QA-tests dezelfde helpers kunnen gebruiken.

## Waarom nu

- De thumbnail reorder-bug liet zien dat complexe interactielogica in een grote component lastig hard te bewijzen is.
- De komende QA-basis heeft testbare helperlogica nodig.
- Nieuwe en bestaande complexe code moet structureel beter worden wanneer we die aanraken.

## In scope

- Nieuwe skill `.agents/skills/programming-architecture-guardrails/SKILL.md`.
- `AGENTS.md`, `scope-guard` en `ui-implementation-guardrails` uitbreiden met compacte architectuurregels.
- Entry photo gallery sorteerhelpers extraheren naar `src/lib/entry-photo-gallery/**`.
- Component functioneel gelijk houden, zonder brede gallery- of app-refactor.

## Buiten scope

- Repo-brede cleanup.
- Refactors buiten entry photo gallery.
- Nieuwe QA-runner of coverage-infra; dat hoort bij de aparte QA-basis.
- Native iOS/Android E2E.

## Concrete checklist

- [x] Nieuwe programmeer-architectuur skill toevoegen.
- [x] `AGENTS.md` uitbreiden met helper/hook/refactor-while-touching regels.
- [x] `scope-guard` uitbreiden met refactor-scope regels.
- [x] `ui-implementation-guardrails` uitbreiden met complexe interactie helper/hook regels.
- [x] Entry photo gallery sorteerhelpers extraheren naar `src/lib/entry-photo-gallery/**`.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen functionele blockers. De volledige QA-runner wordt in een aparte fase/task opgezet.

## Verify / bewijs

- ✅ `npm run lint` (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` (geslaagd op 2026-04-23)
- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-23)
- Niet gedraaid: relevante unit-tests uit fase 1, omdat de QA-testinfra nog niet bestaat in deze repo.

## Relevante links

- `AGENTS.md`
- `.agents/skills/scope-guard/SKILL.md`
- `.agents/skills/ui-implementation-guardrails/SKILL.md`
- `components/journal/entry-photo-gallery.tsx`
- `src/lib/entry-photo-gallery/**`
