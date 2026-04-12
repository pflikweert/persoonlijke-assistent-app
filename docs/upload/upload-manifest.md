# DO NOT EDIT - GENERATED FILE

# Upload Manifest

Build Timestamp (UTC): 2026-04-12T19:55:46.646Z
Source Commit: 75fbf4f

## Standaard Uploadset

| Bestand | Type | Flow |
| --- | --- | --- |
| `docs/upload/chatgpt-project-context.md` | generated upload copy | ChatGPT Project |
| `docs/upload/ai-quality-studio.md` | canonical upload copy | ChatGPT Project |
| `docs/upload/mvp-design-spec-1.2.1.md` | canonical upload copy | ChatGPT Project + Stitch/design handoff |
| `docs/upload/stitch-design-context.md` | generated upload copy | Stitch/design handoff |
| `docs/upload/upload-manifest.md` | generated manifest | Upload completeness check |

## Regels
- Upload naar ChatGPT Project standaard de vier contextbestanden uit `docs/upload/**` plus dit manifest indien completeness-check gewenst is.
- Gebruik `docs/upload/**` niet als canonieke bron voor agents; lees de handmatige bronbestanden en draai de bundle opnieuw.
- Voor Stitch/design-handoff hoort `docs/upload/stitch-design-context.md` bij de uploadset.
- Draai `npm run docs:bundle` en daarna `npm run docs:bundle:verify` na canonieke docs- of design-handoff wijzigingen.
