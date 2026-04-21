# DO NOT EDIT - GENERATED FILE

# Upload Manifest

Build Timestamp (UTC): 2026-04-21T11:29:50.898Z
Source Commit: 8659278

## Standaard Uploadset

| Bestand | Type | Flow |
| --- | --- | --- |
| `docs/upload/00-budio-upload-manifest.md` | generated manifest | Primary upload guidance |
| `docs/upload/10-budio-product-truth.md` | generated primary bundle | Product/scope/status truth |
| `docs/upload/20-budio-strategy-and-research.md` | generated primary bundle | Strategy and research |
| `docs/upload/25-budio-ideas-and-opportunity-map.md` | generated primary bundle | Ideas and opportunity map |
| `docs/upload/30-budio-build-truth.md` | generated primary bundle | Build/code architecture truth |
| `docs/upload/40-budio-ui-system-and-design-truth.md` | generated primary bundle | UI system and design truth |
| `docs/upload/50-budio-ai-governance-and-operations.md` | generated primary bundle | AI governance and operations |
| `docs/upload/55-budio-ai-operating-system.md` | upload reference copy | External AI operating system context (reference-only) |
| `docs/upload/chatgpt-project-context.md` | legacy generated upload copy | Legacy compatibility |
| `docs/upload/ai-quality-studio.md` | legacy canonical upload copy | Legacy compatibility |
| `docs/upload/budio-research.md` | legacy generated upload copy | Legacy compatibility |
| `docs/upload/cline-workflow.md` | workflow upload copy | ChatGPT Project (execution context) |
| `docs/upload/stitch-workflow.md` | workflow upload copy | ChatGPT Project + Stitch handoff (workflow context) |
| `docs/upload/mvp-design-spec-1.2.1.md` | canonical upload copy | ChatGPT Project + Stitch/design handoff |
| `docs/upload/ethos-ivory-design.md` | canonical upload copy | Stitch/design handoff foundations |
| `docs/upload/stitch-design-context.md` | generated upload copy | Stitch/design handoff |
| `docs/upload/upload-manifest.md` | generated manifest | Upload completeness check |

## Regels
- Upload naar ChatGPT Project standaard de contextbestanden uit `docs/upload/**` plus dit manifest indien completeness-check gewenst is.
- Gebruik `docs/upload/**` niet als canonieke bron voor agents; lees de handmatige bronbestanden en draai de bundle opnieuw.
- Voor Stitch/design-handoff hoort `docs/upload/stitch-design-context.md` bij de uploadset.
- Draai `npm run docs:bundle` en daarna `npm run docs:bundle:verify` na canonieke docs- of design-handoff wijzigingen.
