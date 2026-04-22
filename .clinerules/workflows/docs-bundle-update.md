# Workflow — Docs bundle update

## Doel
Werk docs bij met behoud van waarheidshiërarchie en genereer daarna consistente upload/bundle-output.

## Scopegrens
- Alleen docs-gerelateerde wijzigingen en bijbehorende generated output.
- Geen productscope-wijzigingen buiten de expliciete docs-opdracht.

## Wat waarschijnlijk geraakt wordt
- Handmatige bronbestanden in `docs/project/**` of `docs/dev/**`.
- Generated output in `docs/upload/**` en `docs/project/generated/**` via bundler.
- Eventueel docs bundler-script alleen als strikt nodig.

## Wat niet geraakt moet worden
- `docs/project/generated/**` of `docs/design/generated/**` handmatig als bron onderhouden.
- `docs/upload/**` handmatig als bron onderhouden.
- Productcode (`app/**`, `components/**`, `services/**`, `supabase/**`) zonder expliciete vraag.
- Nieuwe waarheidshiërarchie of workflowsprawl.

## Aanbevolen volgorde
1. Bevestig docs-hiërarchie via `docs/project/README.md`.
2. Bewerk eerst handmatige bronbestanden.
3. Draai `npm run docs:bundle`.
4. Draai `npm run docs:bundle:verify`.
5. Controleer dat generated output past bij de handmatige bronwijziging.

## Verify
- Verplicht: `npm run docs:bundle && npm run docs:bundle:verify`.
- Valideer dat geen generated bestand handmatig als canonieke bron is behandeld.
- Draai aanvullend:
  - `rg -n "source-of-truth|canonieke bron|canonical source" AGENTS.md docs/project/README.md docs/dev/cline-workflow.md .clinerules/10-docs.md`
  - `rg -n "docs/project/generated|docs/design/generated|docs/upload" AGENTS.md docs/project/README.md docs/dev/cline-workflow.md .clinerules/10-docs.md`

Refs: `docs/project/README.md`, `AGENTS.md`, `docs/dev/cline-workflow.md`.
