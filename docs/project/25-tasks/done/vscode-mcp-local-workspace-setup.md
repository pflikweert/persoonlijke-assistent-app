---
id: vscode-mcp-local-workspace-setup
title: VS Code MCP local workspace setup
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "VS Code heeft minimale Budio editor-support, Markdown/taskfile support, de lokale Budio Workspace plugin en repo-local MCP/CLI randvoorwaarden."
tags: [local-dev, vscode, mcp, tooling]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

De nieuwe MacBook heeft de basis lokale developmentomgeving, maar VS Code mist nog minimale projectextensions, de lokale Budio Workspace plugin is nog niet opnieuw toegepast, en MCP/CLI-randvoorwaarden moeten worden bevestigd.

## Gewenste uitkomst

VS Code is ingericht voor Expo, Markdown/taskfiles, NativeWind, Playwright en Budio Workspace. De repo blijft local-first werken met `npx`/repo-local tooling voor MCP en CLI's, zonder onnodige globale installaties.

## Waarom nu

- Editor- en pluginsetup hoort direct bij de nieuwe MacBook onboarding.
- De Budio Workspace plugin is de dagelijkse taaklaag voor `docs/project/25-tasks/**`.
- MCP/CLI-checks voorkomen later verwarring tussen globale tooling en repo-local scripts.

## In scope

- Minimale VS Code extensions installeren.
- Budio Workspace VS Code plugin builden, packagen, installeren en workspace refreshen.
- Repo-aanbevolen VS Code extensions aanvullen.
- MCP- en CLI-randvoorwaarden inventariseren en bevestigen.
- Verify draaien zonder langlopende devserver.

## Buiten scope

- Globale Vercel/Supabase/Expo/EAS installaties zonder dagelijkse noodzaak.
- Productruntime-wijzigingen.
- Remote Supabase target activeren.
- Nieuwe appfeatures of UI-wijzigingen.

## Concrete checklist

- [x] VS Code extensions installeren en aanbevelingen aanvullen.
- [x] Budio Workspace plugin toepassen op de normale workspace.
- [x] MCP/CLI-randvoorwaarden bevestigen.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen harde blocker.
- `STITCH_API_KEY` ontbreekt nog lokaal; Stitch MCP is geconfigureerd maar vereist die key wanneer Stitch actief gebruikt wordt.
- VS Code refresh via AppleScript werd door macOS-keystroke-permissies geblokkeerd; de plugininstallatie is wel geslaagd en de workspace is via `code --reuse-window` geopend.

## Verify / bewijs

- ✅ `code --list-extensions --show-versions`
- ✅ `cd tools/budio-workspace-vscode && npm run typecheck`
- ✅ `cd tools/budio-workspace-vscode && npm run test`
- ✅ `cd tools/budio-workspace-vscode && npm run apply:workspace`
- ✅ `npx supabase status -o env`
- ✅ `npx vercel --version`
- ✅ `npx markdownlint-cli2 --version`
- ✅ `npm run taskflow:verify`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `.vscode/extensions.json`
- `.codex/config.toml`
- `tools/budio-workspace-vscode/README.md`
