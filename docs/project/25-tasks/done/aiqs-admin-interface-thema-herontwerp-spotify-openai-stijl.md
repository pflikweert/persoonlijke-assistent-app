---
id: task-aiqs-admin-interface-thema-herontwerp
title: AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-07-15
summary: "Geef AIQS admin een helderder en strakker eigen thema, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools, met goede bruikbaarheid op telefoon en desktop."
tags: [aiqs, admin-ui, thema, design]
workstream: aiqs
due_date: null
sort_order: 7
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---














# AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)

## Probleem / context

De huidige AIQS admin-interface werkt functioneel, maar voelt nog te complex en mist een heldere, strakke admin-uitstraling.
Voor dagelijkse tuning op mobiel en desktop is een duidelijker en consistenter admin-thema gewenst.

## Gewenste uitkomst

AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.
De interface ondersteunt prettig gebruik op telefoon én desktop/fullscreen, zonder de bestaande AIQS-governance of datastromen functioneel te verbreden.

## User outcome

Een admin kan AIQS op mobiel en desktop sneller scannen en bedienen via een consistente, compacte tooling-interface.

## Functional slice

Alleen de visuele hiërarchie, responsive presentatie en gedeelde admin-primitives van bestaande AIQS-schermen; geen nieuwe functies, routes of datastromen.

## Entry / exit

- Entry: admin opent een bestaand AIQS-scherm.
- Exit: dezelfde bestaande actie is beschikbaar in een duidelijkere admin-interface.

## Happy flow

1. Admin opent AIQS op mobiel of desktop.
2. Admin herkent status, inhoud en acties in een consistente tooling-hiërarchie.
3. Admin gebruikt de bestaande flow zonder functionele wijziging.

## Non-happy flows

- Empty, fout-, loading- en permission states blijven functioneel gelijk en zichtbaar.
- Responsive beperkingen mogen geen bestaande actie onbereikbaar maken.

## UX / copy

- Compacte, heldere admin-tooling; de latere Linear-richting is de gerealiseerde vertaling.
- Bestaande AIQS-copy en gewone Budio end-user UI blijven buiten functionele wijziging.

## Data / IO

- Input en output blijven de bestaande AIQS readmodels, routes en acties.
- Geen wijzigingen aan backend, schema, API, promptgovernance of opslag.

## Waarom nu

- Deze stap maakt de tool sneller en prettiger inzetbaar na livegang van de huidige AIQS-variant.
- Het verlaagt frictie bij testen, beoordelen en tunen van prompts/calls.

## In scope

- Visuele/thematische herwerking van AIQS admin-gedeelte.
- Strakkere informatiehiërarchie en duidelijkere states/controls in adminschermen.
- Goede mode-aware uitwerking voor mobiel en desktop/fullscreen.
- Doorvertaling via bestaande shared UI-primitives waar passend.

## Buiten scope

- Nieuwe OpenAI-calls of uitbreiding van AIQS functionele scope.
- Nieuwe review- of evaluatieprocessen buiten bestaande flows.
- End-user themawijzigingen buiten admin-context.

## Concrete checklist

- [x] Designrichting en referentieprincipes concretiseren voor AIQS admin — afgedekt door de latere Linear-richting en gedeelde admin UI-principes.
- [x] Belangrijkste AIQS adminschermen herstijlen met duidelijke hiërarchie — afgedekt door de twee uitgevoerde Linear-interface-taken.
- [x] Mobiel + desktop/fullscreen gebruik valideren in light en dark mode — afgedekt door de vastgelegde responsive runtime-smokes.
- [x] Regressiecheck op bestaande AIQS functionaliteit en admin-guardrails — afgedekt door de vastgelegde lint-, typecheck-, unit- en AIQS-smokes.
- [x] Final polish + bewijs vastleggen tegen designrefs/acceptatie — deze oudere richting is administratief afgesloten als ingehaald; verdere polish wordt niet binnen deze taak voortgezet.

## Acceptance criteria

- [x] De relevante AIQS-schermen gebruiken een consistente admin-console hiërarchie.
- [x] Mobiel, desktop, light en dark zijn in de latere Linear-taken gecontroleerd.
- [x] Bestaande functionaliteit, governance en datastromen blijven intact.
- [x] De oudere Spotify/OpenAI-richting staat niet langer als afzonderlijk open werk geregistreerd.

## Oorspronkelijk plan / afgesproken scope

Een zelfstandig Spotify/OpenAI-geïnspireerd AIQS-thema uitwerken voor mobiel en desktop, zonder functionele AIQS-uitbreiding of end-user themawijzigingen.

## Expliciete user requirements / detailbehoud

- Sluit alle bestaande admin-/AIQS-interfaceverbeteringstaken af.
- Leg vast dat de huidige interface-iteratie bewust eindigt, ook al is de gebruiker nog niet tevreden.
- Maak nu geen nieuwe redesign- of polish-taak; die volgt alleen wanneer de gebruiker daar later klaar voor is.

## Status per requirement

- [x] Eigen, heldere AIQS-adminstijl — status: functioneel afgedekt door de latere Linear-interface-implementaties; deze oudere designrichting wordt niet afzonderlijk uitgevoerd.
- [x] Mobiel en desktop/fullscreen — status: afgedekt door responsive checks in de latere interface-taken.
- [x] Bestaande governance en datastromen behouden — status: afgedekt door de UI-only scope en verificatie van de latere interface-taken.
- [x] Huidige iteratie afsluiten zonder nieuwe vervolgtaak — status: op expliciet gebruikersverzoek afgerond op 2026-07-15.

## Toegevoegde verbeteringen tijdens uitvoering

- De oorspronkelijk losse Spotify/OpenAI-richting is ingehaald door `AIQS admin console UI/UX Linear-richting` en `Admin + AIQS Linear interface kit refresh`, die de beoogde admin-hiërarchie, responsive werking en gedeelde primitives concreet hebben gerealiseerd.

## Blockers / afhankelijkheden

- Bij voorkeur pas uitvoeren nadat loggingvalidatie + productie-livepad stabiel zijn.
- Afstemming met bestaande UI-guardrails en AIQS admin-only principes.

## Verify / bewijs

- Runtime/smoke-check AIQS admin in light en dark mode.
- Desktop/fullscreen + mobiel gebruikscheck met screenshots/bewijs.
- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: een aparte Spotify/OpenAI-geïnspireerde AIQS-themaronde uitvoeren.
- Expliciete user requirements: alle bestaande interfaceverbeteringstaken nu afsluiten, geen nieuwe taak aanmaken en resterende ontevredenheid bewaren voor een eventueel later verzoek.
- Toegevoegde verbeteringen: de latere Linear-taken hebben de relevante admin-console primitives, AIQS-schermen, responsive states en verificatie aantoonbaar geleverd.
- Afgerond: deze backlogtaak is als ingehaald en functioneel afgedekt afgesloten; zij wordt niet meer als zelfstandige designrichting uitgevoerd.
- Open / blocked: niets binnen deze taak. Eventuele nieuwe visuele richting of polish valt expliciet buiten deze closeout en krijgt pas later op gebruikersverzoek een eigen taak.

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/ethos_ivory/DESIGN.md`
- `docs/project/25-tasks/done/aiqs-admin-console-uiux-linear-richting.md`
- `docs/project/25-tasks/done/admin-aiqs-linear-interface-kit-refresh.md`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish


- 2026-07-15T11:25:38+02:00 — feat: harden AIQS regeneration and close interface tasks
## Agent activity

- start 2026-07-15T08:42:46.602Z - Codex / gpt-5 / codex / default

- stop 2026-07-15T08:42:46.602Z -> 2026-07-15T08:43:42.322Z - Codex / gpt-5 / codex / default - reason: done
