# Workflow — AIQS task change

## Doel
Voer wijzigingen in AI Quality Studio uit als admin-only, task-first en contract-first change met evidence als uitgangspunt.

## Scopegrens
- Alleen AIQS-admin flow, taskcontract of directe server-side AIQS-afhandeling.
- Geen verbreding naar end-user features of generieke chat/agentlaag.

## Wat waarschijnlijk geraakt wordt
- `app/settings-ai-quality-studio/**` voor admin UX en taakflows.
- AIQS-gerelateerde services/types en/of Supabase function voor admin-actions.
- Eventueel canonieke AIQS-doc check als gedragskader (geen inhoud kopiëren).

## Wat niet geraakt moet worden
- End-user paden buiten admin-scope.
- Niet-AIQS productflows zonder expliciete vraag.
- Prompt-/contractwijzigingen zonder test/compare-evidence.

## Aanbevolen volgorde
1. Bevestig taak en contractkader via AIQS-doc + huidige taskcontext.
2. Beperk wijziging tot de relevante taskflow (task-first).
3. Houd wijziging server-side/admin-only en bewaak contract-first grenzen.
4. Gebruik test/compare/evaluatie-output als bewijs vóór afronding.
5. Run verify en rapporteer scope- en evidence-uitkomst compact.

## Verify
- Minimaal: `npm run lint` en `npm run typecheck` bij codewijzigingen.
- Bevestig expliciet: admin-only behouden, contract-first behouden, evidence-check uitgevoerd.

Refs: `docs/project/ai-quality-studio.md`, `docs/project/current-status.md`, `AGENTS.md`.