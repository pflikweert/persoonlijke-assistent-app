---
id: lokale-developmentomgeving-nieuwe-macbook-opzetten
title: Lokale developmentomgeving nieuwe MacBook opzetten
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "De nieuwe MacBook heeft een werkende lokale Budio developmentomgeving met dependencies, lokale services, env-config en basisverificatie."
tags: [local-dev, onboarding, setup]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

De nieuwe MacBook is nog niet ingericht voor lokale Budio development. Docker Desktop en Codex in VS Code zijn aanwezig, maar Node/npm, repo-dependencies, Supabase local, env-vars, lokale MCP/Codex-config en smoke/verify-stappen moeten nog gecontroleerd en werkend gemaakt worden.

## Gewenste uitkomst

De lokale omgeving kan betrouwbaar worden gebruikt voor Budio app-ontwikkeling zonder productie-secrets in clientcode of remote mutaties. De gebruiker weet welke env-vars vanaf de oude laptop moeten worden overgezet en welke lokale verificatiecommando's succesvol zijn.

## Waarom nu

- Nieuwe machine moet klaar zijn voor de transitiemaand-werkzaamheden.
- Lokale setup voorkomt frictie bij app-, AIQS- en verify-taken.
- De repo heeft expliciete local-first MCP- en Supabase-afspraken die op de nieuwe laptop juist moeten staan.

## In scope

- Lokale toolchain en repo-dependencies controleren en installeren waar nodig.
- Lokale env-bestanden en benodigde variabelen inventariseren zonder secrets te loggen.
- Supabase local en Docker-afhankelijkheden controleren.
- Codex/VS Code local workflow en standaard smoke-target bevestigen.
- Basisverify draaien met een passende set one-shot commando's.

## Buiten scope

- Productie-deploys of remote Supabase-writes.
- Nieuwe productfeatures of UI-redesigns.
- Secrets in docs, commits of chat opnemen.
- Langlopende devservers starten zonder expliciete opdracht.

## Concrete checklist

- [x] Toolchain en repo-setup inventariseren.
- [x] Dependencies en lokale services werkend krijgen.
- [x] Env-var overdracht veilig begeleiden.
- [x] Basisverify en smoke-pad vastleggen.
- [x] `npm run dev` startflow op macOS herstellen en opnieuw verifiëren.
- [x] Local development onboarding documenteren, committen en pushen.

## Blockers / afhankelijkheden

- Geen open blockers binnen deze setup-task.

## Verify / bewijs

- ✅ `npm run check:node-version`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run verify:local-auth-mail`
- ✅ `gh auth status`
- ✅ `npx supabase --version` (`2.90.0`)
- ✅ `npx supabase status -o env`
- ✅ `npm run dev` smoke: startflow loopt door zonder `awk`-fout; Supabase local env, functions runtime en Expo starten
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:lint`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`
- ✅ Local development onboarding vastgelegd in `docs/dev/local-development-environment.md`

## Relevante links

- `docs/project/README.md`
- `docs/dev/active-context.md`
- `.codex/config.toml`
