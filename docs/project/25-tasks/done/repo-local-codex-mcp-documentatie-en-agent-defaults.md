---
id: task-repo-local-codex-mcp-documentatie-agent-defaults
title: Repo-local Codex MCP documentatie en agent-defaults voor local AI development
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Leg de repo-local Codex MCP local/remote-ro workflow expliciet vast in docs en AGENTS, zodat agents dit standaard veilig toepassen zonder extra gebruikersinstructies."
tags: [codex, mcp, local-development, workflow, docs]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

De repo heeft nu een werkende lokale Codex MCP setup, maar de operationele guidance voor wanneer local versus remote/prod read-only gebruikt moet worden staat nog niet scherp in de standaard agent-routes.

## Gewenste uitkomst

Docs en AGENTS beschrijven compact en eenduidig:

- default gebruik van `supabase_local`
- wanneer `supabase_remote_ro` wel gebruikt mag worden
- wanneer `supabase_remote_ro` juist niet gebruikt mag worden
- dat agents na remote-ro gebruik terugzetten naar local

## Waarom nu

- Verhoogt veiligheid en voorspelbaarheid bij lokaal AI-assisted development.
- Voorkomt dat toekomstige agents onnodig remote/prod-context gebruiken.

## In scope

- Aanvullen van `docs/dev/cline-workflow.md` met compacte MCP-werkwijze.
- Aanvullen van `AGENTS.md` met always-on default gedrag voor agents.
- Korte taskflow-afronding en verify.

## Buiten scope

- App-code wijzigingen.
- Nieuwe MCP servers of bredere architectuurwijzigingen.

## Concrete checklist

- [x] Voeg workflownotitie toe voor local-vs-remote-ro MCP gebruik in `docs/dev/cline-workflow.md`.
- [x] Voeg always-on agent-defaults toe in `AGENTS.md`.
- [x] Verifieer taskflow/docs scripts en commit/push de wijzigingen.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run taskflow:verify`

## Relevante links

- `.codex/config.toml`
- `.codex/README.md`
- `scripts/codex-mcp-target.mjs`
- `docs/dev/cline-workflow.md`
- `AGENTS.md`
