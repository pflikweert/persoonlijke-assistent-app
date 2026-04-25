---
id: stitch-api-key-voor-mcp-activeren
title: STITCH_API_KEY voor MCP activeren
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "De lokale `.env.local` krijgt de ontbrekende `STITCH_API_KEY`, zodat de Stitch MCP-config echt bruikbaar is wanneer Stitch nodig is."
tags: [mcp, stitch, local-dev, env]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

De repo heeft al een geconfigureerde Stitch MCP-server in `.codex/config.toml`, maar `STITCH_API_KEY` ontbreekt nog lokaal in `.env.local`. Daardoor blijft Stitch beschikbaar als setup, maar niet volledig bruikbaar.

## Gewenste uitkomst

De lokale setup bevat een actieve `STITCH_API_KEY` in `.env.local`, zodat Stitch MCP later zonder extra handelingen gebruikt kan worden. De sleutel blijft buiten de repo en wordt niet in docs of output gelekt.

## Waarom nu

- Stitch is al onderdeel van de repo-local MCP-config.
- De nieuwe MacBook setup is bijna compleet; dit is één van de laatste ontbrekende local-dev variabelen.
- De key staat nog op de oude laptop en moet bewust overgezet worden.

## In scope

- `STITCH_API_KEY` veilig overnemen naar `.env.local`.
- Controleren dat de key niet in git of docs terechtkomt.
- Verifiëren dat de lokale env-parser en tooling de key zien.

## Buiten scope

- Andere MCP-servers toevoegen.
- Stitch workflow-inhoud wijzigen.
- Globale CLI-installaties.

## Concrete checklist

- [ ] `STITCH_API_KEY` veilig toevoegen aan `.env.local`.
- [ ] Bevestigen dat de key alleen lokaal aanwezig is.
- [ ] Relevante verify draaien.

## Blockers / afhankelijkheden

- De sleutel staat nog op de oude laptop en moet door de gebruiker worden overgenomen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Lokale env-check op aanwezigheid van `STITCH_API_KEY`

## Relevante links

- `.codex/config.toml`
- `docs/dev/stitch-workflow.md`
