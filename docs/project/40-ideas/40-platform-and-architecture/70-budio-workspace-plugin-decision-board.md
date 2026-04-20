# Budio Workspace plugin decision board voor strategische prioritering

## Status

candidate

## Type

internal-tooling

## Horizon

next

## Korte samenvatting

Voeg in de Budio Workspace plugin een PM/strategy decision board toe met één overzichtstabel voor ideeprioritering, categorie, roadmap-impact en beslisstatus.

## Probleem

Strategische ideeselectie leeft nu verspreid over planning-notities, ideas-files en sessie-uitwerking. Daardoor kost prioritering extra context-switching en is besluitvorming minder snel traceerbaar.

## Waarom interessant

- maakt de prioritering uit `20-planning/60-april-2026-ideeen-prioritering-en-learning-loop.md` direct operationeel
- ondersteunt founder-flow (snel beslissen) én teamleesbaarheid (waarom iets nu/later is)
- versterkt evidence-first uitvoering zonder productscope te verbreden

## Relatie met huidige docs

- sluit aan op `docs/project/20-planning/50-budio-workspace-plugin-focus.md`
- gebruikt categorieën uit `docs/project/40-ideas/README.md`
- gebruikt roadmap-status uit `docs/project/20-planning/30-now-next-later.md`

## Voorstel voor minimum kolommen

- idee
- mvp-waarde (1-5)
- strategische fit (1-5)
- categorie (core/learning/later/non-strategic)
- roadmap-impact (now/next/later)
- status (open/in review/besloten)
- eigenaar
- laatste update

## Guardrails

- interne plugin-tooling, geen end-user feature in Budio Vandaag
- geen runtime/deploykoppeling nodig voor MVP
- geen pricing of billing-engine bouwen in plugin; alleen besluitondersteuning

## Mogelijke impact

- tooling
- docs
- planning discipline

## Open vragen

- handmatig ingevulde tabel of gekoppeld aan markdown/frontmatter?
- alleen leesboard of ook inline status-updates?
- minimale audittrail: hoe wordt een besluitmoment vastgelegd?

## Volgende stap

Smal prototype in plugin met read-only tabel op basis van planning/ideas-notities, daarna pas edit-flow bepalen.
