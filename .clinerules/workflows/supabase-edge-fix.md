# Workflow — Supabase edge fix

## Doel
Los bugs of regressies in Supabase Edge Functions snel op zonder scope-uitbreiding of security-lek.

## Scopegrens
- Alleen de geraakte function(s) en directe shared modules.
- Geen schema/migration- of clientfeature-uitbreiding zonder expliciete vraag.

## Wat waarschijnlijk geraakt wordt
- `supabase/functions/**` voor de relevante edge function.
- Eventueel `supabase/functions/_shared/**` bij gedeelde contract- of util-fix.
- Kleine client/service aanpassing alleen als call-contract anders breekt.

## Wat niet geraakt moet worden
- Secrets of interne tokens naar clientcode verplaatsen.
- Brede refactors over meerdere domeinen.
- Onnodige wijzigingen in niet-gerelateerde functions.

## Aanbevolen volgorde
1. Bevestig foutpad en relevante function.
2. Check Deno importregels (`.ts` extensies + `// @ts-ignore` direct boven elke lokale importregel).
3. Pas de kleinste server-side fix toe en update alleen directe callsites indien nodig.
4. Run relevante verify (`lint`, `typecheck`) en function-specifieke checks waar beschikbaar.
5. Meld expliciet dat lokaal `npm run supabase:functions:restart` nodig is na function-wijzigingen.

## Verify
- Minimaal: `npm run lint` en `npm run typecheck` bij codewijzigingen.
- Bevestig dat secrets server-side blijven en dat restart-stap is gemeld.

Refs: `AGENTS.md`, `docs/dev/cline-workflow.md`, `supabase/README.md`.