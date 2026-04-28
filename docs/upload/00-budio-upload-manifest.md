# DO NOT EDIT - GENERATED FILE

# Budio Upload Manifest

Build Timestamp (UTC): 2026-04-28T23:46:55.838Z
Source Commit: 6a2a8ce

## Beheerde uploadset (maximaal 10 bestanden)

| Bestand | Type | Flow |
| --- | --- | --- |
| `docs/upload/00-budio-upload-manifest.md` | generated manifest | Local reference, use-case routing and completeness check |
| `docs/upload/chatgpt-project-context.md` | primary bootstrap bundle | ChatGPT Projects bootstrap/startcontext (upload-only) |
| `docs/upload/10-budio-core-product-and-planning.md` | generated domain bundle | Core product truth and active planning |
| `docs/upload/20-budio-strategy-research-and-ideas.md` | generated domain bundle | Strategy, research and idea context |
| `docs/upload/30-budio-build-ai-governance-and-operations.md` | generated domain bundle | Build truth, AI governance and operations |
| `docs/upload/40-budio-design-handoff-and-truth.md` | generated domain bundle | Design handoff and design truth |
| `docs/upload/50-budio-roadmap-planning-pack.md` | generated roadmap planning bundle | Roadmap, month-block planning and review templates |
| `docs/upload/60-budio-tasks-current.md` | generated current task bundle | Current open task context |
| `docs/upload/70-budio-tasks-archive.md` | generated task archive bundle | Done task archive context |
| `docs/upload/80-budio-agent-workflow-and-docs-tooling.md` | generated workflow and tooling bundle | Agent workflow, docs tooling and developer environment |

## Regels
- `docs/upload/chatgpt-project-context.md` is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects.
- Gebruik in ChatGPT Projects na de bootstrap alleen de kleinste relevante subset uit dit manifest.
- Upload niet standaard de volledige set.
- Beheer handmatig nooit meer dan deze 10 uploadbestanden; oude legacy-output wordt bij bundlen opgeschoond.
- De bundelscript zet uploadbestanden klaar voor handmatige upload; upload naar ChatGPT gebeurt nu nog niet automatisch.
- `docs/upload/**` is geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- Bij spanning tussen uploadartefacten en canonieke docs zijn canonieke docs leidend.
- Budgetpolicy in ChatGPT Projects blijft licht; token/cost/runtime-discipline hoort in repo en AI-governance.
- Session/multi-user/OpenAI-contextbeleid is nu alleen als later idee vastgelegd.

## Use-case matrix (aanbevolen subsets)

| Use-case | Aanbevolen bestanden |
| --- | --- |
| Strategie-review | `docs/upload/chatgpt-project-context.md`, `docs/upload/10-budio-core-product-and-planning.md`, `docs/upload/20-budio-strategy-research-and-ideas.md` |
| Planherziening / opportunity review | `docs/upload/chatgpt-project-context.md`, `docs/upload/20-budio-strategy-research-and-ideas.md` |
| Epic/project planning review | `docs/upload/chatgpt-project-context.md`, `docs/upload/10-budio-core-product-and-planning.md`, `docs/upload/60-budio-tasks-current.md` |
| Roadmapplanning / maandblokken | `docs/upload/chatgpt-project-context.md`, `docs/upload/50-budio-roadmap-planning-pack.md` |
| Current task review | `docs/upload/chatgpt-project-context.md`, `docs/upload/60-budio-tasks-current.md` |
| Task archive review | `docs/upload/chatgpt-project-context.md`, `docs/upload/70-budio-tasks-archive.md` |
| Agent/docs workflow review | `docs/upload/chatgpt-project-context.md`, `docs/upload/80-budio-agent-workflow-and-docs-tooling.md` |
| Code/build review | `docs/upload/chatgpt-project-context.md`, `docs/upload/10-budio-core-product-and-planning.md`, `docs/upload/30-budio-build-ai-governance-and-operations.md` |
| Design/Stitch handoff | `docs/upload/chatgpt-project-context.md`, `docs/upload/40-budio-design-handoff-and-truth.md` |
| Volledige beheerde context | `docs/upload/00-budio-upload-manifest.md`, `docs/upload/chatgpt-project-context.md`, `docs/upload/10-budio-core-product-and-planning.md`, `docs/upload/20-budio-strategy-research-and-ideas.md`, `docs/upload/30-budio-build-ai-governance-and-operations.md`, `docs/upload/40-budio-design-handoff-and-truth.md`, `docs/upload/50-budio-roadmap-planning-pack.md`, `docs/upload/60-budio-tasks-current.md`, `docs/upload/70-budio-tasks-archive.md`, `docs/upload/80-budio-agent-workflow-and-docs-tooling.md` |

## Leesregel
- Het manifest is lokale uploadrouting, geen extra canonieke bron.
- Complete uploads zijn alleen nodig voor brede audit, strategieherziening of overdracht.
