---
id: task-upload-bundles-volledige-tasks-en-archive
title: Upload bundles uitbreiden met volledige tasks en apart full archive
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-24
summary: "Voeg in docs/upload een volledige tasks bundle toe (open + done) en een aparte volledige archive bundle (done), allebei directory-gebaseerd en uploadbaar voor ChatGPT."
tags: [docs, upload, tasks, bundle]
workstream: idea
due_date: null
sort_order: 1
---

# Upload bundles uitbreiden met volledige tasks en apart full archive

## Probleem / context

De huidige bundeloutput zet ideas, strategy en build-context klaar in `docs/upload/**`, maar er is nog geen uploadbaar bestand dat alle taskfiles volledig bundelt. Daardoor ontbreekt een compacte manier om complete taakgeschiedenis als context te uploaden.

## Gewenste uitkomst

`docs/upload/**` bevat twee nieuwe generated bestanden:

- één volledige tasks bundle met zowel `open/` als `done/` taskfiles
- één aparte volledige archive bundle met alleen `done/` taskfiles

Beide bundels zijn directory-gebaseerd, worden automatisch via `docs:bundle` gegenereerd en worden meegenomen in het uploadmanifest.

## Waarom nu

- Directe gebruikersvraag voor betere uploadcontext in ChatGPT.
- Sluit aan op bestaande generated uploadflow zonder productscope te verbreden.

## In scope

- Bundlescript uitbreiden met nieuwe task-upload outputs.
- Upload manifest/registratie bijwerken.
- Verify draaien en taskflow afronden.

## Buiten scope

- Nieuwe taskstatuslogica of herstructurering van taskfiles.
- Wijzigen van primaire top-5 uploadset (tenzij expliciet gevraagd).

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Nieuwe full tasks upload bundle toegevoegd (open + done).
- [x] Nieuwe full archive upload bundle toegevoegd (done).
- [x] Upload manifest entries bijgewerkt.
- [x] Verify gedraaid (`taskflow`, `docs:bundle`, `docs:bundle:verify`).

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `scripts/docs/build-docs-bundles.mjs`
- `docs/upload/00-budio-upload-manifest.md`
