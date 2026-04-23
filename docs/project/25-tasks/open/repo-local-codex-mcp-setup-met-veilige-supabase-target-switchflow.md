---
id: task-repo-local-codex-mcp-setup-switchflow
title: Repo-local Codex MCP setup met veilige Supabase target-switchflow
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Maak een repo-lokale Codex MCP-config met vaste servers voor context7/playwright/stitch en een veilige, eenvoudige Supabase local-vs-remote read-only switchflow zonder secrets in de repo."
tags: [codex, mcp, supabase, tooling, workflow]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

De huidige Codex MCP-config staat globaal in de home-directory en bevat alleen een beperkte set servers. Voor deze repo is een lokale, voorspelbare setup nodig waarmee local development en remote/prod-georiënteerd Supabase-gebruik veilig naast elkaar bestaan, zonder handmatig TOML-werk of secrets in version control.

## Gewenste uitkomst

De repo bevat één begrijpelijke `.codex/config.toml` met vaste MCP-servers voor context7, playwright en stitch, plus een Supabase-opzet waarmee lokaal veilig tussen een local target en een remote/prod read-only target gewisseld kan worden.

De standaardstand is veilig voor dagelijks gebruik. Eventuele switching blijft klein, expliciet en robuust, met een korte lokale gebruiksinstructie voor developer en agent.

## Waarom nu

- Nodig om Codex/Cline lokaal consistenter en veiliger te gebruiken binnen deze repo.
- Voorkomt ad-hoc globale configuratie en handmatig targetwisselen.
- Houdt lokale ontwikkelcapabilities en productiegerichte read-only analyse helder gescheiden.

## In scope

- Inspecteren wat Codex CLI/config native ondersteunt voor project-scoped MCP-config en switching/profiles.
- Ontwerpen en implementeren van de kleinste robuuste repo-local MCP-opzet.
- Vastleggen van een veilige local-vs-remote Supabase flow zonder secrets in de repo.
- Korte workflowdocumentatie voor activeren/switchen/verifiëren.

## Buiten scope

- Wijzigingen aan app-code, UI, services of Supabase runtime-code.
- Nieuwe MCP-servers buiten context7, playwright, stitch en supabase.
- Sentry of bredere architectuurwijzigingen.

## Concrete checklist

- [x] Bevestig via CLI/config-inspectie wat Codex native ondersteunt voor MCP switching of profiles.
- [x] Kies de kleinste veilige repo-local setup voor vaste MCP-servers en Supabase targets.
- [x] Werk de config en eventuele minimale helperflow uit zonder secrets in de repo.
- [x] Documenteer kort hoe local en remote/prod read-only worden geactiveerd.
- [x] Verifieer syntax, bruikbaarheid, read-only default voor remote en repo-local scope.

## Blockers / afhankelijkheden

- Exacte Supabase MCP server-command/env-contracten moeten bevestigd zijn voordat implementatie start.

## Verify / bewijs

- CLI-bewijs voor wat Codex MCP/config native ondersteunt.
- Geldige TOML en werkende repo-local switchflow.
- Controle dat gewijzigde files geen secrets bevatten en geen globale Codex config vervuilen.

## Relevante links

- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
- `AGENTS.md`
- `../../.codex/config.toml`
