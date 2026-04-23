---
id: task-aiqs-admin-interface-thema-herontwerp
title: AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "Geef AIQS admin een helderder en strakker eigen thema, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools, met goede bruikbaarheid op telefoon en desktop."
tags: [aiqs, admin-ui, thema, design]
workstream: aiqs
due_date: null
sort_order: 3
---












# AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)

## Probleem / context

De huidige AIQS admin-interface werkt functioneel, maar voelt nog te complex en mist een heldere, strakke admin-uitstraling.
Voor dagelijkse tuning op mobiel en desktop is een duidelijker en consistenter admin-thema gewenst.

## Gewenste uitkomst

AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.
De interface ondersteunt prettig gebruik op telefoon én desktop/fullscreen, zonder de bestaande AIQS-governance of datastromen functioneel te verbreden.

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

- [ ] Designrichting en referentieprincipes concretiseren voor AIQS admin.
- [ ] Belangrijkste AIQS adminschermen herstijlen met duidelijke hiërarchie.
- [ ] Mobiel + desktop/fullscreen gebruik valideren in light en dark mode.
- [ ] Regressiecheck op bestaande AIQS functionaliteit en admin-guardrails.
- [ ] Final polish + bewijs vastleggen tegen designrefs/acceptatie.

## Blockers / afhankelijkheden

- Bij voorkeur pas uitvoeren nadat loggingvalidatie + productie-livepad stabiel zijn.
- Afstemming met bestaande UI-guardrails en AIQS admin-only principes.

## Verify / bewijs

- Runtime/smoke-check AIQS admin in light en dark mode.
- Desktop/fullscreen + mobiel gebruikscheck met screenshots/bewijs.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/ethos_ivory/DESIGN.md`
