---
id: task-budio-workspace-vscode-screenshot-capture-fallback
title: Budio Workspace VS Code screenshot capture fallback
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: Maak screenshotbewijs voor de VS Code workspace-plugin robuuster wanneer macOS `screencapture` door display/screen-recording permissies wordt geblokkeerd.
tags: [plugin, vscode, smoke, screenshots, dev-tooling]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 27
---




## Probleem / context

Na de task-detail fix kon Codex de actuele VS Code plugin niet visueel bewijzen omdat `screencapture` faalde met `could not create image from display`. Dat is meestal een macOS Screen Recording/TCC-permissieprobleem voor de host-app die Codex/terminal uitvoert. De sessie eindigde daardoor met een blokkade zonder goede automatische diagnose of herstelpad.

## Gewenste uitkomst

Er is een kleine lokale helper waarmee VS Code plugin-screenshots reproduceerbaar geprobeerd worden. Als macOS capture blokkeert, geeft de helper een duidelijke diagnose, opent optioneel de juiste Screen Recording instellingen en faalt met bruikbare vervolgstap in plaats van een vage fout.

## User outcome

Bij plugin UI-fixes kunnen we snel een screenshot proberen en direct zien of de blokkade permissie-, target- of runtime-gerelateerd is.

## Functional slice

Een dev-tooling helper en documentatie voor VS Code screenshot capture rond de Budio Workspace plugin.

## Entry / exit

- Entry: agent/developer wil na plugin apply een screenshot van VS Code maken.
- Exit: screenshotbestand bestaat, of er is een concrete permission-diagnose met herstelactie.

## Happy flow

1. Developer draait de screenshot helper.
2. Helper activeert VS Code en schrijft een screenshot naar een opgegeven pad.
3. Helper meldt het outputpad.

## Non-happy flows

- Empty state: VS Code draait niet of is niet zichtbaar; helper meldt dat VS Code eerst geopend/geactiveerd moet worden.
- Permission denied / unavailable: macOS blokkeert capture; helper meldt Screen Recording permissies en kan de juiste instellingen openen.
- Validation / unsupported state: niet-macOS platform geeft nette unsupported melding.
- Failure / retry / cancel: helper bewaart geen half resultaat en meldt het command/stage dat faalde.

## UX / copy

- Copy blijft dev-facing en compact.
- Geen runtime plugin UI-wijzigingen.

## Data / IO

- Input: optionele outputpad en `--open-settings`.
- Output: lokaal PNG-bestand of duidelijke CLI-fout.
- Opslag/API/service/file-impact: nieuwe lokale scripts/docs; geen appdata.
- Statussen: `ok`, `permission_blocked`, `unsupported`, `failed`.

## Waarom nu

De plugin-UI wordt actief aangepast en de vorige fix miste visueel bewijs door een lokale macOS-permissieblokkade.

## In scope

- Screenshot helper toevoegen.
- macOS Screen Recording blokkade detecteren.
- Optioneel juiste System Settings-pane openen.
- README/dev-doc kort aanvullen met gebruik.
- Gerichte verify.

## Buiten scope

- macOS TCC permissie stilzwijgend forceren; dat kan en mag niet veilig.
- Nieuwe browser/E2E setup voor VS Code webviews.
- Plugin UI of appfunctionaliteit wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Fix de eerdere blokkade: `Screenshot capture via screencapture werd door macOS/display-permissies geblokkeerd`.

## Expliciete user requirements / detailbehoud

- "ik wil dit ook fixen"
- De specifieke foutmelding/ervaring rond `screencapture` mag niet opnieuw als losse blokkade blijven staan.

## Status per requirement

- [x] Screenshot helper aanwezig — status: gebouwd
- [x] Permission blocked geeft bruikbare diagnose — status: gebouwd
- [x] Herstelroute naar macOS instellingen aanwezig — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale probe draaide opnieuw succesvol; de eerdere blokkade lijkt dus permissie/transient display-state, niet structurele plugin-code.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: screenshot helper en docs toevoegen.
- [x] Blok 3: gerichte verify en task afronden.

## Concrete checklist

- [x] Bestaande screenshot/smoke tooling inspecteren.
- [x] Helper script toevoegen.
- [x] Package/dev docs aanvullen.
- [x] Helper lokaal testen op huidige macOS-blokkade.
- [x] Taskflow/docs verify uitvoeren.

## Acceptance criteria

- [x] `npm` script of gedocumenteerd command probeert VS Code screenshot capture.
- [x] Bij Screen Recording blokkade wordt een duidelijke fout + volgende stap getoond.
- [x] Helper kan de macOS Screen Recording instellingen openen met een vlag.
- [x] Geen secrets of screenshots worden automatisch gecommit.

## Blockers / afhankelijkheden

- macOS Screen Recording toestemming moet uiteindelijk door de gebruiker in System Settings gegeven worden; code kan die permissie niet veilig automatisch toekennen.

## Verify / bewijs

- `npm run plugin:vscode:screenshot -- --out /tmp/budio-vscode-screenshot-helper-test.png` — geslaagd; PNG geschreven.
- `file /tmp/budio-vscode-screenshot-helper-test.png` — bevestigt PNG image data, 2704 x 1756.
- `node scripts/capture-vscode-screenshot.mjs --help` — geslaagd.
- `npm run taskflow:verify` — geslaagd.
- `npm run typecheck` — geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: screenshot capture blokkade fixen.
- Toegevoegde verbeteringen: helper detecteert blokkade, valideert PNG-output en kan macOS Screen Recording instellingen openen.
- Afgerond: `plugin:vscode:screenshot` script, README-uitleg en lokale screenshot smoke zijn klaar.
- Open / blocked: geen; macOS permissie blijft een handmatige OS-keuze als die opnieuw ingetrokken wordt.

## Relevante links

- `tools/budio-workspace-vscode/README.md`
- `scripts/`


## Commits

- 2026-06-22T12:38:07+02:00 — chore(plugin): add vscode screenshot capture helper

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state