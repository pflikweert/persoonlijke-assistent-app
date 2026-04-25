---
title: Docs hub
audience: both
doc_type: hub
source_role: canonical
visual_profile: budio-terminal
upload_bundle: 80-budio-agent-workflow-and-docs-tooling.md
---

# Docs hub

Dit is de hoofdingang van de docs-vault.

## Snelle start

- [[project/README|Project hub]]
- [[project/00-docs-governance/README|Docs governance]]
- [[design/README|Design hub]]
- [[dev/README|Dev docs hub]]
- [[setup/developer-docs-environment|Developer docs environment]]
- [[design/mvp-design-spec-1.2.1|MVP design spec]]
- [[dev/cline-workflow|Cline workflow]]
- [[upload/00-budio-upload-manifest|Upload manifest]]

```text
╔══════════════════════════════════════════════╗
║ BUDIO DOCS VAULT                            ║
╠══════════════════════════════════════════════╣
║ START    project/README                     ║
║ HUMAN    strategy, planning, research, ideas║
║ AGENT    dev workflows, skills, taskflow    ║
║ BOTH     governance, status, upload context ║
╚══════════════════════════════════════════════╝
```

## Vault-routing

- `docs/project/**` = actieve projectwaarheid
- `docs/design/**` = design authority, specs en design-archief
- `docs/dev/**` = operationele workflow en lokale notities
- `docs/setup/**` = lokale setup/readiness
- `docs/upload/**` = generated uploadset, niet canoniek

Audience-routing staat in frontmatter:

- `audience: human` voor strategie, planning, research en ideeën die mensen meenemen.
- `audience: agent` voor uitvoeringsregels en workflowdocs.
- `audience: both` voor gedeelde waarheid en hubs.

## Obsidian graph hubs

- [[project/10-strategy/README|Strategy hub]]
- [[project/20-planning/README|Planning hub]]
- [[project/30-research/README|Research hub]]
- [[project/40-ideas/README|Ideas hub]]
- [[project/00-docs-governance/README|Docs governance]]
- [[project/current-status|Current status]]
- [[project/open-points|Open points]]

## Generated en archive beleid

- `docs/project/generated/**` en `docs/design/generated/**` zijn afgeleid, niet leidend.
- `docs/project/archive/**`, `docs/design/archive/**`, `docs/dev/archive/**` zijn historisch.
- Voor graph-focus kun je in Obsidian filteren op padprefix `project/`.
