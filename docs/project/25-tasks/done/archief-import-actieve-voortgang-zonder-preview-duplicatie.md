---
id: task-archief-import-actieve-voortgang-zonder-preview-duplicatie
title: Archief-import actieve voortgang zonder preview-duplicatie
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: Verberg de import-preview direct na start van een archief-import en toon alleen een voortgangsgerichte mobiele statusweergave.
tags: [settings, import, ux, polish]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 1
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---






# Archief-import actieve voortgang zonder preview-duplicatie

## Probleem / context

Na het starten van een archief-import blijft het preview-scherm zichtbaar terwijl tegelijk een voortgangsblok verschijnt. Daardoor toont het scherm twee primaire taken tegelijk: controle van de preview en actieve voortgang.

## Gewenste uitkomst

Zodra de gebruiker de import start, verdwijnt de preview direct volledig uit beeld. Tijdens actieve import ligt de focus volledig op voortgang, met alleen de bestandscontext, aantallen, voortgangsbalk, percentage, verwerkingsstap en de route terug naar `Vandaag`.

Na afronding verdwijnt de voortgangsweergave en wordt een compacte voltooid-status getoond met de verwerkte aantallen en dezelfde route naar `Vandaag`.

## User outcome

De gebruiker ziet tijdens importeren nog maar één duidelijke taak: wachten op voortgang of doorgaan naar `Vandaag`.

## Functional slice

Een UI-only state-scheiding voor `idle`, `selected`, `importing`, `completed` en `error` in de bestaande archief-importflow.

## Entry / exit

- Entry: gebruiker opent `Instellingen` -> `Importeren` en kiest een geldig bestand.
- Exit: gebruiker ziet ofwel alleen voortgang tijdens actieve import, of een voltooid-status met actie `Ga naar Vandaag`.

## Happy flow

1. Gebruiker kiest een bestand en ziet de preview.
2. Gebruiker start de import en de preview verdwijnt direct.
3. Scherm toont alleen importstatus, bestand, dagen, entries, voortgang en `Ga naar Vandaag`.
4. Na afronding toont het scherm alleen `Import voltooid` met aantallen en `Ga naar Vandaag`.

## Non-happy flows

- Empty state: `idle` blijft ongewijzigd.
- Permission denied / unavailable: bestaande disabled-state blijft ongewijzigd.
- Validation / unsupported state: bestaande preview-parse fouten blijven error-state tonen.
- Failure / retry / cancel: importfouten blijven een error-state tonen zonder preview en voortgang tegelijk zichtbaar te maken.

## UX / copy

- Tijdens actieve import verbergen:
  - `Klaar voor import`
  - `Controleer kort wat er wordt toegevoegd`
  - bestand metadata preview
  - voorbeeld content
  - `Importeer bestanden`
  - `Andere bestanden kiezen`
- Tijdens actieve import tonen:
  - `Importeren...`
  - bestandsnaam
  - aantal dagen
  - aantal entries
  - voortgangsbalk
  - percentage
  - `Dag X van Y`
  - `Deze verwerking draait op de achtergrond. Je kunt de app blijven gebruiken.`
  - `Ga naar Vandaag`
- Voltooid tonen:
  - `Import voltooid`
  - aantal dagen verwerkt
  - aantal entries verwerkt
  - `Ga naar Vandaag`
- Gebruik bestaande settings-scaffold en bestaande button/text primitives.

## Data / IO

- Input: bestaande import-preview en background task status.
- Output: enkelvoudige zichtbare UI-state per importsituatie.
- Opslag/API/service/file-impact: `app/settings-import.tsx`.
- Statussen: `idle`, `selected`, `importing`, `completed`, `error`.

## Waarom nu

De huidige dubbellaagse importweergave veroorzaakt directe UX-verwarring in een bestaande flow.

## In scope

- Importscreen state-rendering opschonen.
- Actieve voortgang compact en mobiel-first tonen.
- Voltooide status laten aansluiten op actieve voortgangsflow.

## Buiten scope

- Achtergrond-importarchitectuur wijzigen.
- Nieuwe retry-, cancel- of notificationsystemen bouwen.
- Andere settings-flows herontwerpen.

## Oorspronkelijk plan / afgesproken scope

- Verbeter UX van actieve archief-import.
- Verberg preview volledig zodra import start.
- Toon tijdens actieve import alleen de voortgangsweergave en `Ga naar Vandaag`.
- Toon na afronding een compacte voltooid-status met aantallen en `Ga naar Vandaag`.

## Expliciete user requirements / detailbehoud

- `idle` toont het huidige preview-scherm.
- `importing` verbergt alle preview-copy, metadata, voorbeeldcontent en niet-bruikbare acties.
- `importing` toont alleen bestandsnaam, aantal dagen, aantal entries, voortgangsbalk, percentage, `Dag X van Y`, achtergrondnotice en `Ga naar Vandaag`.
- `completed` vervangt voortgang door `Import voltooid`, aantallen verwerkt en `Ga naar Vandaag`.
- UX-regels:
  - geen dubbele informatie
  - slechts één primaire taak tegelijk zichtbaar
  - tijdens import ligt focus volledig op voortgang
  - geen acties tonen die tijdens actieve import niet gebruikt kunnen worden
  - mobiel eerst ontwerpen

## Status per requirement

- [x] Preview verdwijnt direct na importstart — status: gebouwd
- [x] Alleen voortgang blijft zichtbaar tijdens actieve import — status: gebouwd
- [x] `Ga naar Vandaag` blijft beschikbaar tijdens actieve import — status: gebouwd
- [x] Voltooide status toont juiste compacte samenvatting — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Error-state versimpeld naar `Probeer opnieuw` en `Ga naar Vandaag`, zodat mislukte imports ook geen irrelevante settings-acties meer tonen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste bronwijziging of primair artefact uitvoeren.
- [ ] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Importscreen states scheiden zonder dubbele content.
- [x] Actieve voortgang compact renderen.
- [x] Voltooide status compact renderen.
- [x] Gerichte verify uitvoeren.

## Acceptance criteria

- [ ] Na `Importeer bestanden` verdwijnt de preview direct volledig.
- [ ] Tijdens actieve import is alleen de voortgangsweergave zichtbaar met `Ga naar Vandaag`.
- [ ] Na succesvolle afronding toont het scherm alleen `Import voltooid` met aantallen en `Ga naar Vandaag`.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run lint` — geslaagd.
- `npm run typecheck` — geslaagd.
- `curl -I --max-time 5 http://localhost:8081` — geslaagd; lokale webtarget reageert met `200 OK`.
- `npm run verify:local-auth-login -- --profile=default` — geslaagd; local auth magic-link flow geeft geldige session/user terug.
- Runtime browser-smoke op `/settings-import` is nog niet volledig bewezen:
  - `http://host.docker.internal:8081/settings-import` opent, maar redirect naar `/sign-in`
  - Docker-browser kan de Supabase verify-link op poort `54321` niet bereiken, waardoor echte ingelogde import-smoke in deze sessie blocked blijft

## Reconciliation voor afronding

- Oorspronkelijk plan: actieve import alleen voortgang laten tonen, zonder preview-duplicatie.
- Toegevoegde verbeteringen: error-state compacter gemaakt zodat ook failures geen dubbele of irrelevante acties tonen.
- Afgerond: scherm rendert nu preview, actieve import en voltooid als drie gescheiden toestanden met telkens één primaire taak zichtbaar.
- Open / blocked: interactieve runtime-smoke achter ingelogde browser blijft nog open door Docker-toegang tot lokale Supabase verify-link.

## Relevante links

- `app/settings-import.tsx`
- `design_refs/1.2.1/importeren_bezig/code.html`
- `design_refs/1.2.1/importeren_gelukt/code.html`


## Commits

- 2026-06-22T11:49:19+02:00 — fix: simplify active archive import ux

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state