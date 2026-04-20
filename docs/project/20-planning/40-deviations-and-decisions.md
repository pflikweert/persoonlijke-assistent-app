# Deviations and decisions

## Doel

Logboek van bewuste afwijkingen op actieve fase/planning, zodat flexibiliteit traceerbaar blijft.

## Obsidian links

- [[README|Planning hub]]
- [[20-active-phase|Active phase]]
- [[30-now-next-later|Now / Next / Later]]
- [[../current-status|Current status]]
- [[../open-points|Open points]]
- [[../10-strategy/README|Strategy hub]]

## Gebruik

- Elke structurele koerswijziging krijgt hier een korte entry.
- Kleine lage-impact afwijkingen mogen direct, maar worden alsnog achteraf gelogd.

## Template

### [YYYY-MM-DD] Titel

- **Type**: deviation | decision
- **Van plan/document**: (bijv. `planning/20-active-phase.md`)
- **Wijziging**: wat verandert er
- **Waarom**: context/redenering
- **Impact**: product | ui | services | supabase | docs
- **Vervolgactie**: welke docs/code moeten worden aangepast

## Entries

### 2026-04-19 — Actieve maandfocus herijkt naar transitiemaand

- **Type**: decision
- **Van plan/document**: `planning/20-active-phase.md` en `planning/30-now-next-later.md`
- **Wijziging**: eerdere maandfocus op generieke hardening + docs/operating-system werk wordt formeel vervangen door een transitiemaand met consumer beta bewijs, expliciete 1.2B/1.2E en een afgebakende review-first brugpilot
- **Waarom**: runtime-realiteit en researchrichting lopen uit fase met de oude planning; de codebasis is al sterk in capture/hardening, terwijl outputkwaliteit, beta-readiness en commerciële brug nog expliciete planning missen
- **Impact**: docs
- **Vervolgactie**: active phase en now/next/later alignen; strategy-horizon alleen licht aanscherpen zodat de eerstvolgende maand geen brede Pro-activatie suggereert

### 2026-04-19 — Lean operating system expliciet toegevoegd aan projectdocs

- **Type**: decision
- **Van plan/document**: impliciete root-structuur in `docs/project/`
- **Wijziging**: introductie van `strategy/`, `planning/` en `ideas/` als vaste operating system lagen
- **Waarom**: focus en traceerbaarheid verbeteren; ideeën, planning en canonieke waarheid scheiden
- **Impact**: docs
- **Vervolgactie**: bundelstrategie in volgende stap herschrijven op nieuwe structuur
