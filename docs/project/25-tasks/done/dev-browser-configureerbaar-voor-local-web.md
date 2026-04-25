---
id: dev-browser-configureerbaar-voor-local-web
title: Dev-browser configureerbaar voor local web
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "Local web development kan optioneel een specifieke browser openen via `.env.local`, met behoud van het bestaande standaardbrowsergedrag als de env ontbreekt."
tags: [local-dev, tooling, expo]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

Op de nieuwe Mac opent Expo web nu via de standaardbrowser. De gebruiker wil ChatGPT Atlas kunnen gebruiken voor lokale webontwikkeling, maar zonder dit hard te coderen voor alle machines.

## Gewenste uitkomst

`npm run dev` blijft standaard hetzelfde werken wanneer er geen browser-env is gezet. Als `BUDIO_DEV_BROWSER` lokaal is gezet, gebruikt de dev-flow die browser voor Expo web-open acties.

## Waarom nu

- De lokale MacBook setup is net afgerond.
- Browserkeuze is machine-specifieke dev tooling en hoort configureerbaar te zijn zonder productruntime te raken.

## In scope

- `scripts/dev.sh` uitbreiden met optionele local browser-config.
- `.env.local` op deze machine aanvullen met ChatGPT Atlas als browser.
- Verify zonder langlopende devserver.

## Buiten scope

- Productruntime-config of `EXPO_PUBLIC_*` toevoegen voor browserkeuze.
- Langlopende devserver starten.
- Browserkeuze afdwingen op andere machines.

## Concrete checklist

- [x] Browser-env veilig laden uit `.env.local`.
- [x] Expo web-open laten terugvallen op standaardgedrag als env ontbreekt.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- ✅ `sh -n scripts/dev.sh`
- ✅ `.env.local` parser-check voor `BUDIO_DEV_BROWSER`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `scripts/dev.sh`
- `.env.local`
