---
id: task-audio-instellingen-testadvies-stabiliseren
title: Audio-instellingen testadvies stabiliseren en mic-selectie polish
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: chat
updated_at: 2026-04-23
summary: "Stabiliseer testadvies in audio-instellingen, laat advies staan na stop, voorkom layout-jitter met vaste advieshoogte en verbeter slider/microfoonselectie UX tijdens actieve test."
tags: [audio, settings, ux, web]
workstream: app
due_date: null
sort_order: null
---

## Probleem / context

De nieuwe audio-instellingen werken functioneel, maar het testadvies wisselt nog te snel, verdwijnt bij stop in sommige paden en de adviessectie veroorzaakt layout-verspringing. Daarnaast moet volume-aanpassing via slider-tap betrouwbaar blijven en microfoonwissel tijdens test direct merkbaar blijven.

## Gewenste uitkomst

Op het scherm Audio Instellingen is het advies tijdens testen rustiger en gebaseerd op langere sampleperiodes. Het eerste advies komt pas na voldoende spreektijd. Na stoppen blijft het laatste advies zichtbaar.

De advieszone heeft een vaste hoogte zodat onderliggende UI niet verspringt. Slider-tap en microfoonwissel tijdens actieve test blijven direct bruikbaar.

## Waarom nu

- Directe UX-frictie op een net opgeleverde flow die bedoeld is om microfoonproblemen op te lossen.

## In scope

- Advieslogica timing in `app/settings-audio.tsx` aanscherpen.
- Advies behouden na test-stop.
- Vaste adviescontainerhoogte + subtiele apply-link zonder layout jump.
- Slider tap-interactie en mic-switch tijdens test verifiëren en waar nodig corrigeren.
- Taskstatus en verify-output synchroon houden.

## Buiten scope

- Nieuwe audio processing pipelines buiten settings/test UI.
- Native-specifieke microfoonrouting buiten bestaande web-scope.

## Concrete checklist

- [x] Eerste advies pas tonen na langere initiële spreekperiode.
- [x] Adviesupdates minder frequent en op langer samplevenster.
- [x] Laatste advies behouden bij stop.
- [x] Adviesblok vaste hoogte geven om layout-verspringing te voorkomen.
- [x] Slider tap + mic-switch tijdens test smoke valideren.
- [x] `npm run lint` en `npm run typecheck` draaien en vastleggen.

## Statusnotitie

- Afgerond: code, verify en docs-bundles zijn uitgevoerd; taak is klaar voor archivering in `done/`.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Relevante links

- `app/settings-audio.tsx`
- `services/web-audio-input.ts`
- `docs/project/25-tasks/README.md`
