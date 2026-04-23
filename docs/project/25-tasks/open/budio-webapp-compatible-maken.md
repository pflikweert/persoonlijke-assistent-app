---
id: task-budio-webapp-compatible-maken
title: Budio webapp compatible maken
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "Implementeer PWA-installatieprompt voor webgebruikers om de app als desktop-app te installeren, met modal, cookie-onthouding en instellingenoptie."
tags: [pwa, webapp, installatie, modal, cookie]
workstream: app
due_date: null
sort_order: 5
---

## Probleem / context

Gebruikers van de webversie kunnen de app momenteel niet eenvoudig installeren als Progressive Web App (PWA) op hun desktop. Dit beperkt de gebruikerservaring, vooral voor Android-gebruikers die geen native app beschikbaar hebben. Een installatieprompt zou de toegankelijkheid verbeteren en de app meer app-achtig maken.

## Gewenste uitkomst

Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een modal met de vraag om de app op de desktop te installeren. Als de gebruiker weigert, onthoud dit met een cookie zodat de prompt niet herhaald wordt. De gebruiker kan de installatieoptie altijd heractiveren via instellingen. Gebruik juiste iconen, naam en manifestinstellingen voor een professionele installatie-ervaring.

## Waarom nu

- We hebben nog geen Android en iOS apps beschikbaar, dus voor Android-gebruikers (zoals ikzelf) is dit een handige tussenoplossing.
- Verbetert de gebruikerservaring op web zonder afhankelijk te zijn van app stores.
- Voorbereiding op bredere PWA-adoptie.

## In scope

- Bijwerken of aanmaken van web app manifest (manifest.json) met juiste iconen, naam en instellingen.
- Implementeren van PWA-installatie logica in de app (detectie van 'beforeinstallprompt' event).
- Creëren van een installatiemodal component met duidelijke call-to-action.
- Toevoegen van local storage om gebruikerskeuze te onthouden (niet tonen als geweigerd), wel altijd via menu -> instellingen alsnog weer activeren.
- Integreren van een toggle in instellingen scherm om installatieprompt te heractiveren.
- Testen op verschillende browsers (Chrome, Firefox, Safari) voor compatibiliteit.

## Buiten scope

- Ontwikkeling van native Android/iOS apps.
- Uitbreiding naar andere PWA-features zoals offline caching of push notifications (tenzij direct gerelateerd aan installatie).
- Browser-specifieke aanpassingen buiten standaard PWA-ondersteuning.

## Concrete checklist

- [ ] Onderzoek huidige PWA-compatibiliteit en manifest.json controleren/bijwerken.
- [ ] Implementeer 'beforeinstallprompt' event listener in app root (\_layout.tsx).
- [ ] Creëer PwaInstallModal component met installatieknop en 'later' optie.
- [ ] Voeg cookie-logica toe voor onthouden van gebruikerskeuze (gebruik js-cookie of native cookies).
- [ ] Integreer modal in hoofdapp flow (toon alleen voor ingelogde webgebruikers).
- [ ] Voeg toggle toe in instellingen scherm voor heractiveren van prompt.
- [ ] Test installatie op desktop browsers en controleer cookie-functionaliteit.
- [ ] Update documentatie indien nodig.

## Blockers / afhankelijkheden

- Geen blockers; kan parallel lopen met andere features.
- Afhankelijk van Expo/React Native Web voor PWA-ondersteuning (al aanwezig).

## Verify / bewijs

- Runtime-test: Open app in browser, controleer of installatieprompt verschijnt voor nieuwe gebruikers.
- Installatie-test: Klik op installeren en verificeer dat app als desktop-app wordt geïnstalleerd met juiste iconen.
- Cookie-test: Weiger installatie, refresh pagina en controleer dat prompt niet meer verschijnt; activeer via instellingen en test opnieuw.
- Browser-compatibiliteit: Test op Chrome, Firefox en Safari desktop.
- Code-review: Controleer manifest.json en installatielogica in repo.

## Relevante links

- `docs/project/open-points.md`
- [PWA Install Prompt Guide](https://web.dev/customize-install/)
- [Expo PWA documentation](https://docs.expo.dev/guides/progressive-web-apps/)
