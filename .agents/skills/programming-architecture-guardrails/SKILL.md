---
name: programming-architecture-guardrails
description: Gebruik bij complexe componenten, bugfixes in grote files, nieuwe interactielogica, services, dataflows of herhaalde helpers om code klein, testbaar en goed gestructureerd te houden zonder scope creep.
---

# Gebruik

Gebruik bij codewerk met risico op groeiende componentfiles, branchy logica, interactiestate, services/dataflows of herhaalde helpercode.

# Kernregels

1. **Helper-first voor pure logica**
   - Zet branchy berekeningen, sortering, validatie, mapping en edge-case-logica in `src/lib/**`.
   - Maak helpers klein en unit-testbaar.
   - Nieuwe complexe helpers krijgen unit-tests; mik op minimaal 80% coverage voor de nieuwe helpermodule.

2. **Hook-first voor stateful interacties**
   - Zet lifecycle/state/event-handler combinaties in een hook wanneer ze de component onleesbaar maken.
   - Voorbeelden: drag, upload, playback, editor state.

3. **Services voor IO**
   - Datafetching, opslag, RPC, auth en externe calls blijven in `services/**` of bestaande service-laag.
   - UI-components orkestreren, maar bezitten geen IO-details.

4. **Refactor while touching**
   - Raak je complexe bestaande code aan, extraheer dan alleen het deel dat nodig is voor de wijziging, testbaarheid of risicoreductie.
   - Geen big-bang refactor binnen een kleine bugfix.

5. **Inline mag bij simpele code**
   - Laat simpele render-layout, glue-code en triviale conditionals inline.
   - Extra files zijn pas winst als ze begrip, testbaarheid, hergebruik of risico verbeteren.

# Beslischeck

Extraheer wanneer minstens één punt geldt:

- logica heeft meerdere branches of edge cases
- regressierisico is hoog
- unit-tests zijn waardevol
- dezelfde berekening kan terugkomen
- de component wordt vooral wiring/rendering na extractie duidelijker

# Niet doen

- Geen architectuur om architectuur.
- Geen brede cleanup buiten de actieve flow.
- Geen nieuwe abstraction layer zonder concreet doel.
- Geen screen-logica naar shared helpers verplaatsen als die uniek en triviaal is.
- Geen complexe helper toevoegen zonder bijbehorende test of expliciete reden waarom testen nog niet kan.
