---
id: task-caren-zorgdossier-kopie-structureren
title: Caren-zorgdossier kopie structureren in uploadbestand
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user request 2026-05-15
updated_at: 2026-05-15
summary: "Ruwe Care-app/Caren-zorgkopie omzetten naar een nette, gestructureerde markdownfile zonder broninhoud te verliezen, inclusief vervolgtoevoegingen van dezelfde dag."
tags: ""
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: null
---


## Probleem / context

In `docs/upload/thuiszorg-15-mei-2026-kopie-info.md` staat een ruwe handmatige kopie uit de Caren-zorgapp met door elkaar heen lopende chatberichten, replies, dossieritems, plan-items en rapportages. De inhoud is bruikbaar, maar nu slecht scanbaar.

Na de eerste structuurpatch bleek bovendien dat `docs:bundle` losse handmatige bestanden in `docs/upload/` niet bewaart. Daardoor moet deze vervolgwijziging het uploadbestand ook expliciet herstellen.

## Gewenste uitkomst

De file wordt omgezet naar een nette, gestructureerde markdownopzet waarin duidelijk zichtbaar is welke delen persoonlijke chat/thread-inhoud zijn en welke delen dossier-/rapportage-items uit het zorgdossier zijn.

Bestaande inhoud blijft behouden. Nieuwe structuur mag samenvatten, labelen en rubriceren, maar mag geen broninhoud verwijderen.

## User outcome

De gebruiker kan de gekopieerde zorgapp-inhoud sneller terugvinden, onderscheiden en delen, zonder angst dat ruwe broninformatie verloren is gegaan.

## Functional slice

Eén uploadbestand met:
- een korte structuuranalyse
- heldere secties voor chat/thread, dossier en zorgplanitems
- behoud van de onbewerkte broninhoud
- aanvullende berichten en notities van 15 mei 2026

## Entry / exit

- Entry: ruwe tekstkopie in `docs/upload/thuiszorg-15-mei-2026-kopie-info.md`
- Exit: dezelfde file, maar scanbaar en logisch gelabeld

## Happy flow

1. De ruwe kopie wordt gelezen en globaal geclassificeerd.
2. Er wordt een markdownstructuur toegevoegd die de inhoud in duidelijke blokken verdeelt.
3. De broninhoud blijft aanwezig en leesbaar binnen de nieuwe structuur.
4. Nieuwe vervolgberichten worden chronologisch toegevoegd.

## Non-happy flows

- Empty state: als de file door bundling is verdwenen, wordt deze hersteld.
- Permission denied / unavailable: niet van toepassing voor lokale file-edit.
- Validation / unsupported state: als de kopie incompleet blijkt, blijft die expliciet als bronkopie gelabeld.
- Failure / retry / cancel: bij twijfel geen inhoud herschrijven, alleen structureren en labelen.

## UX / copy

- Titel en sectielabels in helder Nederlands.
- Expliciet benoemen dat de file een handmatige kopie en structuur-analyse bevat.
- Onderscheid maken tussen `chat/thread`, `dossieritems` en `plan/rapportage`.

## Data / IO

- Input: bestaande markdownfile met ruwe gekopieerde tekst
- Output: dezelfde markdownfile met extra structuur en behoud van broninhoud
- Opslag/API/service/file-impact: `docs/upload/thuiszorg-15-mei-2026-kopie-info.md` en deze taskfile
- Statussen: `in_progress` tijdens uitwerking

## Waarom nu

- De gebruiker wil deze inhoud nu direct bruikbaar en overzichtelijk hebben.

## In scope

- Structuuranalyse van de bestaande tekst
- Markdownsecties toevoegen
- Behoud van alle bestaande inhoud
- Vervolgberichten en notitie van 15 mei 2026 toevoegen

## Buiten scope

- Inhoudelijk juridisch of medisch oordeel over de dossierinhoud
- Volledige redactieslag van alle losse zinnen naar formele notulen

## Oorspronkelijk plan / afgesproken scope

- Maak van de bestaande tekst in `docs/upload/thuiszorg-15-mei-2026-kopie-info.md` een nette gestructureerde markdownfile.
- Analyseer de structuur van de bronkopie.
- Maak expliciet zichtbaar dat er dossiers, interne threads en chats met het wijkteam in staan.
- Verlies geen bestaande content.

## Expliciete user requirements / detailbehoud

- De file blijft in `docs/upload/`.
- De bestaande content blijft behouden.
- De output moet netjes gestructureerde markdown zijn.
- De analyse moet benoemen dat de bronkopie dossieritems, interne threads en chats met het wijkteam bevat.
- De nieuwe berichten van 15 mei 2026 moeten worden toegevoegd.
- De notitie over Zilveren Kruis, huisarts en hoofdkantoor moet worden toegevoegd.

## Status per requirement

- [x] File blijft in `docs/upload/` — status: gebouwd
- [x] Bestaande content blijft behouden — status: gebouwd
- [x] Nette gestructureerde markdown toevoegen — status: gebouwd
- [x] Structuuranalyse met dossier/thread/chat-onderscheid opnemen — status: gebouwd
- [x] Vervolgberichten van 15 mei 2026 toevoegen — status: gebouwd
- [x] Notitie over bemiddeling/klacht toevoegen — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Taskflow-compliance toegevoegd door een aparte taskfile aan te maken.
- Herstelpatch toegevoegd omdat `docs:bundle` losse handmatige uploadbestanden niet bewaart.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste bronwijziging of primair artefact uitvoeren.
- [x] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Huidige file state en taskstate bevestigd
- [x] Uploadfile hersteld of opnieuw aangemaakt
- [x] Nieuwe berichten toegevoegd
- [x] Gerichte verify uitvoeren

## Acceptance criteria

- [x] De file heeft duidelijke markdownkoppen en secties.
- [x] De file maakt onderscheid tussen chat/thread-inhoud en dossier-/rapportage-inhoud.
- [x] De oorspronkelijke en nieuwe broninhoud is aanwezig voor zover beschikbaar in deze sessie.

## Blockers / afhankelijkheden

- `docs:bundle` verwijdert dit type losse uploadbestand; daarom is die stap in deze specifieke herstelpatch bewust niet opnieuw gedraaid om het gevraagde bestand te behouden.

## Verify / bewijs

- Visuele controle van `docs/upload/thuiszorg-15-mei-2026-kopie-info.md`
- `npm run taskflow:verify`
- `docs:bundle` bewust niet opnieuw uitgevoerd, omdat die run dit losse uploadbestand verwijdert

## Reconciliation voor afronding

- Oorspronkelijk plan: ruwe Caren/Care-app kopie structureren zonder inhoudsverlies.
- Toegevoegde verbeteringen: taskflow-compliance, expliciete inhoudsclassificatie, herstel na bundelverlies en vervolgtoevoegingen van 15 mei 2026.
- Afgerond: uploadbestand hersteld, gestructureerd en aangevuld; nieuwe berichten en notitie toegevoegd; taskflow verify uitgevoerd.
- Open / blocked: geen, met uitzondering dat `docs:bundle` voor dit losse uploadbestand destructief blijkt.

## Relevante links

- `docs/upload/thuiszorg-15-mei-2026-kopie-info.md`


## Commits

- 2026-05-16T06:54:00+02:00 — docs: add Caren zorgdossier structuring task