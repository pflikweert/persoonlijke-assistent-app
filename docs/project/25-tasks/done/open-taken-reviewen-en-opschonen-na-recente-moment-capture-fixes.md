---
id: task-open-taken-reviewen-en-opschonen-na-recente-moment-capture-fixes
title: Open taken reviewen en opschonen na recente moment/capture fixes
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Review alle open tasks op overlap met de recent afgeronde oude-dag-capture, momentdetail- en foto-state fixes, sluit of versmal ingehaalde taken, en commit/push daarna de opgeschoonde tasklaag samen met de recente featurewijzigingen."
tags: [tasks, review, docs, capture, moment-detail]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 70
---




## Probleem / context

Er staan nog meerdere open tasks in `docs/project/25-tasks/open/` die inhoudelijk kunnen overlappen met het recent afgeronde werk rond oude-dag capture, momentdetail-polish, foto-state UX en with-photos runtime-validatie. Zonder review blijft de tasklaag ruis bevatten en lijkt werk nog open te staan dat feitelijk al opgelost of deels ingehaald is.

De gebruiker wil daarom eerst een gerichte taskreview en pas daarna een commit/push van de actuele change-set.

## Gewenste uitkomst

De open tasklaag is opgeschoond: taken die volledig door recent werk zijn opgelost worden gesloten of verplaatst naar `done/`, taken die deels zijn ingehaald worden versmald of krijgen een expliciete notitie, en niet-gerelateerde open taken blijven ongemoeid.

Daarna wordt de huidige change-set gecontroleerd, gecommit en gepusht met een duidelijke scope.

## User outcome

De gebruiker ziet weer een geloofwaardige open backlog zonder schijn-open werk, en heeft een gepushte branch waarin zowel de featurefixes als de task-opschoning zijn vastgelegd.

## Functional slice

Eén review-slice over de huidige open tasklaag, beperkt tot overlap met de recent afgeronde moment/capture/foto flows, plus gecontroleerde repository-closeout via commit en push.

## Entry / exit

- Entry: huidige open tasklaag en recente afgeronde tasks/diffs rond oude-dag capture en momentdetail/foto-state.
- Exit: relevante open tasks zijn opgeschoond, verify is groen, commit is gemaakt en branch is gepusht.

## Happy flow

1. Agent reviewt alle open tasktitels/samenvattingen en leest overlap-kandidaten volledig.
2. Agent beslist per kandidaat: sluiten, versmallen/noteren, of open laten, met taskfile-bewijs.
3. Agent draait verify, commit de opgeschoonde tasklaag samen met de bestaande change-set en pusht de branch.

## Non-happy flows

- Geen overlap gevonden: alle open taken blijven staan, maar de reviewconclusie wordt wel vastgelegd.
- Dubieuze overlap: taak blijft open en krijgt een expliciete notitie waarom recent werk hem niet volledig afdekt.
- Verify faalt: eerst task/docs of code herstellen, daarna pas commit/push.
- Push faalt: commit blijft lokaal bestaan en de fout wordt expliciet teruggekoppeld.

## UX / copy

- Geen product-UI scope; dit is een task/docs- en repo-cleanup flow.
- Reviewcopy in taskfiles blijft kort, feitelijk en bewijsgebonden.

## Data / IO

- Input: open taskfiles, recente done taskfiles, actuele git diff en runtime-/testbewijzen.
- Output: opgeschoonde taskstatussen, eventuele verplaatste taskfiles en een gepushte git-commit.
- Opslag/API/service/file-impact: alleen task/docs-metadata en git-history.
- Statussen: `open -> done` alleen wanneer recent werk de taak volledig dekt; anders expliciete open notitie.

## Waarom nu

- De gebruiker wil pas afronden en pushen nadat de open tasklaag weer klopt met de werkelijkheid.
- Dit voorkomt dat recent opgelost werk onnodig als open backlog blijft terugkomen.

## In scope

- Alle huidige open tasktitels/samenvattingen reviewen op overlap.
- Kandidaten inhoudelijk lezen en beoordelen op recente moment/capture/foto-fixes.
- Relevante open tasks sluiten, verplaatsen of verduidelijken.
- Verify draaien voor task/docs-wijzigingen.
- Commit en push van de actuele change-set.

## Buiten scope

- Nieuwe productfeatures bouwen.
- Niet-gerelateerde backlog herprioriteren.
- Grote roadmap- of strategieaanpassingen.
- PR-tekst of release notes schrijven tenzij later expliciet gevraagd.

## Oorspronkelijk plan / afgesproken scope

- Review alle open taken op overlap met recente fixes.
- Ruim alleen ingehaalde of dubbel geworden open tasks op.
- Commit en push pas na deze review.

## Expliciete user requirements / detailbehoud

1. Review alle open taken, niet alleen de meest voor de hand liggende.
2. Als iets nu opgelost is en niet meer gedaan hoeft te worden, werk de tasklaag daarop bij.
3. Doe pas daarna commit en push.

## Status per requirement

- [x] Alle open taken zijn op overlap gereviewd — status: gebouwd
- [x] Ingehaalde open taken zijn opgeschoond — status: gebouwd
- [x] De actuele change-set is gecommit en gepusht — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De review bevestigde dat geen enkele open task volledig kon sluiten op basis van het recente moment/capture/foto-werk.
- De gallery E2E-task is wel inhoudelijk versmald: reorder, viewer-open en delete-cancel zijn inmiddels deels bewezen, waardoor de restscope nu explicieter op add/max/echte delete/error flows ligt.
- Andere overlap-kandidaten bleven bewust open:
  - Android photo-upload regressie: nog steeds afhankelijk van echte Android toestel-smoke
  - moments-overzicht foto/viewer: blijft blocked door aparte web drag-swipe/viewer-issues
  - web runtime warnings: volledig losstaande hardening-scope, nog onopgelost

## Uitvoerblokken / fasering

- [x] Blok 1: task aanmaken, open tasklaag breed scannen en overlap-kandidaten selecteren.
- [x] Blok 2: kandidaten inhoudelijk beoordelen en taskfiles opschonen.
- [x] Blok 3: verify, commit en push afronden.

## Concrete checklist

- [x] Frontmatter-overzicht van alle open tasks langslopen.
- [x] Overlap-kandidaten inhoudelijk lezen.
- [x] Relevante taskstatussen en/of summaries updaten.
- [x] `npm run taskflow:verify` draaien.
- [x] `npm run docs:bundle` draaien.
- [x] `npm run docs:bundle:verify` draaien.
- [x] Commit maken.
- [x] Branch pushen.

## Acceptance criteria

- [x] Er blijft geen open task staan die volledig door recent bewezen werk is opgelost.
- [x] Open taken die slechts deels geraakt zijn blijven open met correcte scope.
- [x] De branch met de actuele changes en task-opschoning staat op remote.

## Blockers / afhankelijkheden

- Geen, zolang git push en lokale verify beschikbaar blijven.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Reviewnotities in relevante taskfiles
- `git push` output

## Reconciliation voor afronding

- Oorspronkelijk plan: review open tasks op overlap met recent moment/capture/foto werk, ruim de tasklaag op, commit en push.
- Toegevoegde verbeteringen: expliciete restscope-notitie voor de gallery E2E-task zodat recente viewer/reorder-validatie niet meer als onzichtbare overlap blijft hangen.
- Afgerond: alle open tasks zijn op titel/summary gereviewd; inhoudelijke overlap-kandidaten zijn verdiept gelezen; geen task kon volledig sluiten; één task is inhoudelijk versmald/notitie bijgewerkt; verify is groen; change-set is gecommit en gepusht.
- Open / blocked: geen binnen deze task.

## Relevante links

- `docs/project/25-tasks/open/`
- `docs/project/25-tasks/done/oude-dag-moment-toevoegen-via-bestaande-captureflow.md`
- `docs/project/25-tasks/done/momentdetail-with-photos-runtime-validatie.md`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state