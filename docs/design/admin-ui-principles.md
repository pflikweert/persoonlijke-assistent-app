---
title: Budio Admin UI Principles
audience: both
doc_type: design-guideline
source_role: canonical
visual_profile: plain
upload_bundle: 40-budio-design-handoff-and-truth.md
---

# Budio Admin UI Principles

Adminschermen zijn werkruimtes. Ze helpen een founder/admin snel beheerwerk doen zonder dashboardruis, dubbele uitleg of onnodige visuele containers.

## Principles

1. Admin is workspace, geen dashboard.
2. Lijsten boven cards.
3. Status alleen prominent bij afwijkingen.
4. Metadata is secundair.
5. Eén primaire actie per rij of sectie.
6. Dividers boven containers.
7. Settings zijn rows, geen cards.
8. Gebruik whitespace en typografie vóór borders/fills.
9. Geen dubbele uitlegteksten.
10. Details pas op detailniveau.

## Button system

Admin-acties gebruiken één gedeeld button-contract:

- `Primary`: live zetten, opslaan, publiceren.
- `Secondary`: openen, valideren, verder bewerken.
- `Danger`: verwijderen of andere destructieve acties.
- `Ghost/Icon`: kleine inline acties en compacte icon-acties.

Regels:

- Geen native/default browser buttons in admin UI.
- Geen zwarte primary-blokken; primary is compact, subtiel en token-gedreven.
- Buttons delen radius, hoogte, padding, font-weight, hover/press en focus states.
- Klikbare lijst- of tabelrijen blijven rows; alleen zichtbare acties worden buttons.

## AIQS referentie

De AI Quality Studio startpagina is de eerste referentie-implementatie voor deze standaard:

- één globale runtimestatus
- promptfamilies als list/table
- debug logging als settings row
- details en runtime-metadata pas wanneer ze nodig zijn
