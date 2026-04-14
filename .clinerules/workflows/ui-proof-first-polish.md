# Workflow — UI proof-first polish

## Doel
Voer kleine UI-polish of regressiefixes uit met bewijs tegen design refs en light/dark runtime-gedrag.

## Scopegrens
- Alleen polish/regressiefix; geen volledig redesign.
- Houd wijzigingen klein en liefst bron-first in shared primitives als defaults de oorzaak zijn.

## Wat waarschijnlijk geraakt wordt
- `app/**` (assembly) en/of shared UI-lagen in `components/ui/**` en `components/layout/**`.
- Relevante `design_refs/1.2.1/**` en `docs/design/mvp-design-spec-1.2.1.md` voor validatie.
- Eventueel beperkte copy-afstemming op bestaande canonieke copyregels.

## Wat niet geraakt moet worden
- Nieuwe visuele systemen of ad-hoc screenpatronen.
- Onnodige massa (extra surfaces/borders/fills) zonder design-ref dekking.
- Niet-UI domeinen zoals Supabase schema/functions zonder expliciete vraag.

## Aanbevolen volgorde
1. Pak relevante design refs + guardrails voor het specifieke scherm.
2. Identificeer of oorzaak in screen-assembly of shared primitive-default zit.
3. Pas de kleinste clean-first, mode-aware fix toe.
4. Controleer impact op aangrenzende schermen met dezelfde primitive.
5. Run verify en doe light/dark proof-check.

## Verify
- Verplicht bij codewijzigingen: `npm run lint` en `npm run typecheck`.
- Verplicht voor “klaar”: check tegen relevante design refs + light/dark runtime-beoordeling.

Refs: `AGENTS.md`, `docs/design/mvp-design-spec-1.2.1.md`, `design_refs/1.2.1/ethos_ivory/DESIGN.md`, `docs/project/current-status.md`.