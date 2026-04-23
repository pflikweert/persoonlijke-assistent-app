---
id: task-moment-detail-foto-reorder-audio-test-auto-stop
title: Moment detail foto reorder + thumbnail-logica en audio test auto-stop
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Long-press reorder voor momentfoto's met duidelijke thumbnail-indicatie en stille background-save, plus veilige auto-stop voor de microfoontest bij stilte en schermverlaten."
tags: [moment-detail, photos, audio-settings, taskflow]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

De moment detail-flow mist nog foto-reordering in de onderste galerij, terwijl de eerste positie functioneel de featured thumbnail bovenin bepaalt.
Daarnaast is de microfoontest in audio-instellingen nu te kwetsbaar: hij stopt niet automatisch bij langere stilte en moet altijd stoppen zodra de gebruiker het scherm verlaat.

## Gewenste uitkomst

Op het moment-detailscherm kan de gebruiker een foto lang indrukken en intuïtief naar een andere positie slepen. Tijdens het slepen is duidelijk zichtbaar waar de foto terechtkomt, en de volgorde wordt stil op de achtergrond opgeslagen zonder extra save-flow. De eerste positie blijft altijd de thumbnailbron en is als zodanig herkenbaar in de UI.

In audio-instellingen stopt de microfoontest automatisch na 10 seconden zonder hoorbaar signaal, en ook direct wanneer het scherm focus verliest of op welke manier dan ook wordt verlaten.

## Waarom nu

- Deze UX-gap blokkeert een logische kernflow in moment detail: bepalen welke foto het moment vertegenwoordigt.
- De audiotest moet veiliger en robuuster worden voordat deze als afgeronde microfooninstelling kan gelden.
- Deze taak is ook de concrete drager voor het plan en de implementatie; hij moet daarom vanaf start expliciet in de tasklaag bestaan.

## In scope

- Long-press drag reorder in de onderste momentfotogalerij.
- Duidelijke placeholder / doelpositie tijdens slepen.
- Eerste positie bepaalt featured thumbnail bovenin.
- Zichtbare thumbnail-indicatie op featured foto en positie 1 in de galerij.
- Volgorde stil opslaan op de achtergrond.
- Microfoontest stopt na 10 seconden stilte.
- Microfoontest stopt altijd bij scherm verlaten of focusverlies.
- Structurele taskflow-hardening zodat inhoudelijke planvorming nooit meer zonder taskfile gebeurt.

## Buiten scope

- Nieuwe foto-editing features zoals captions, albums of bulkbeheer.
- Nieuwe globale productflows buiten dit scherm en audio-instellingen.
- Nieuwe statuswaarden of aparte plan-only taakstructuur.

## Concrete checklist

- [x] Taskfile aangemaakt en status direct op `in_progress` gezet.
- [x] Always-on taskflow aangescherpt in `AGENTS.md`.
- [x] Taskflow-skill uitgebreid naar plan/research-preflight.
- [x] Workflowdocs aangescherpt zodat plan zonder taskfile als onvolledig geldt.
- [x] Verify gedraaid (`npm run taskflow:verify`, relevante docs bundle checks).
- [x] Feature-implementatie voor foto reorder + audio test auto-stop uitgevoerd.
- [x] Code verify gedraaid (`npm run lint`, `npm run typecheck`).

## Blockers / afhankelijkheden

- Bestaande WIP in workflowbestanden was aanwezig; gebruiker heeft expliciet akkoord gegeven om bovenop die wijzigingen door te werken.
- Gerichte runtime-check in light/dark mode is nog niet hard bewezen in deze sessie; lokaal was alleen Metro op `:8081` zichtbaar en geen bruikbare app/web target voor een schermsmoke.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run lint`
- `npm run typecheck`
- Gerichte runtime-checks in light en dark mode voor moment detail en audio-instellingen

## Relevante links

- `docs/project/open-points.md`
- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`
- `app/settings-audio.tsx`
