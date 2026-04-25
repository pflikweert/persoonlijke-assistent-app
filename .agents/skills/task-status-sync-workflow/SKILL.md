---
name: task-status-sync-workflow
description: Houd taskfiles verplicht aanwezig en synchroon met plan-, research- en uitvoerfase, inclusief expliciete taskvermelding in updates en plannen.
---

# Gebruik
Verplicht gebruiken bij elke inhoudelijke repo-uitvoering (plan/research/bug/implementatie) met taakflow in `docs/project/25-tasks/**`.
Uitzondering: pure chat of simpele read-only vraag zonder uitvoertaak.

# Doel
Voorkom dat inhoudelijke repo-taken zonder taskfile starten en voorkom statusdrift tussen uitgevoerde code en taskfile-status.

# Workflow
1. **Start uitvoering**
   - Zorg dat de actieve taak bestaat in `docs/project/25-tasks/open/` (of maak deze eerst vanuit `_template.md`).
   - Plan/research/implementatie zonder taskfile is onvolledig; maak de taskfile eerst aan vóór verdere inhoudelijke output.
   - In **Plan Mode** geldt een strengere preflight: gebruik eerst een **bestaande** taskfile wanneer er een duidelijke match is.
   - Bestaat er in Plan Mode geen passende bestaande taskfile maar is de nieuwe scope duidelijk, maak dan automatisch een nieuwe taskfile aan vanuit `_template.md`.
   - Vraag alleen bij echte twijfel: meerdere plausibele bestaande tasks, onduidelijke scope-routing, of onduidelijk task-vs-idea/epic.
   - Wanneer je automatisch een nieuwe taak aanmaakt: zet die direct bovenaan de doel-lane met `sort_order: 1` en herschrijf de overige taakfiles in die lane doorlopend.
   - Wanneer een open taak actief wordt uitgevoerd en naar `in_progress` gaat: zet die direct bovenaan de `in_progress` lane en herschrijf `sort_order` voor bron- en doellane zodat de sortering opgeslagen blijft.
   - Zet status op `in_progress` zodra inhoudelijke uitvoering start (tenzij al correct).
   - Kies en benoem compacte uitvoerblokken/fases voor de taak; leg die bij voorkeur vast in de taskfile-sectie `Uitvoerblokken / fasering`.
   - Communiceer in de eerste inhoudelijke update en daarna in elke volgende update:
     - `Task: ...`
     - `Task file: ...`
     - `Status: ...`
   - Noem in elk inhoudelijk plan expliciet het concrete taskfile-pad.
   - Voeg in Plan Mode-plannen altijd een korte `Taskflow summary` toe: gebruikte of nieuw aangemaakte taskfile, verwachte statuswijziging, en wanneer extra werk een eigen task krijgt.

2. **Tijdens uitvoering**
   - Houd `updated_at` actueel bij betekenisvolle voortgang.
   - Werk checklist-items alleen bij op echte milestone-completion.
   - Testbevindingen en verbeteringen binnen dezelfde flow blijven in dezelfde task.
   - Nieuw niet-relevant werk krijgt een eigen task.
   - Houd het oorspronkelijke goedgekeurde plan stabiel; vervang die scope nooit stilzwijgend met het laatst gevonden subprobleem.
   - Leg bij niet-triviale taken het oorspronkelijke plan vast onder `## Oorspronkelijk plan / afgesproken scope`.
   - Leg expliciete user-details die later nog relevant zijn vast onder `## Expliciete user requirements / detailbehoud`.
   - Als de gebruiker een bestaand uitgebreid plan, blokstructuur of genummerde requirementlijst expliciet wil behouden, leg die vast als aparte bronsectie en vervang die nooit door alleen een afgeleide samenvatting.
   - Houd onder `## Status per requirement` bij wat gebouwd, gedeeltelijk gebouwd, nog niet gebouwd of nog user-review nodig is.
   - Leg aanvullingen of correcties tijdens uitvoering vast onder `## Toegevoegde verbeteringen tijdens uitvoering`.

3. **Bij blokkade**
   - Zet status op `blocked` met korte blocker in taskfile.
   - Laat taak in `open/` staan.

4. **Bij afronding**
   - Zet status op `done` zodra code + verify klaar zijn en commit/push gereed is.
   - Verplaats taak naar `docs/project/25-tasks/done/` als nog in `open/`.
   - Meld in eindresultaat opnieuw `Task`, `Task file`, `Status`.
   - Voer vóór afronding een expliciete reconciliation uit onder `## Reconciliation voor afronding`:
     - oorspronkelijk plan
     - expliciete user requirements
     - later toegevoegde verbeteringen
     - wat afgerond is
     - wat nog open of blocked blijft
   - Markeer een taak niet als klaar zolang die reconciliation niet expliciet laat zien dat het oorspronkelijke plan is meegenomen.

5. **Bij handmatige user-update**
   - Als status al correct is aangepast door gebruiker: niet overschrijven.
   - Meld expliciet in output dat status al klopte of is bijgewerkt.

# Verify bij statusovergangen
- Taskflow guardrail: `npm run taskflow:verify`.
- Codewijziging: `npm run lint` + `npm run typecheck`.
- Docs/tasklaag gewijzigd: daarna `npm run docs:bundle` en `npm run docs:bundle:verify`.

# Niet doen
- Geen inhoudelijk plan opleveren zonder concrete taskfile.
- Geen inhoudelijk Plan Mode-werk zonder bestaande of nieuw aangemaakte taskfile.
- Geen grote big-bang uitvoering wanneer het werk logisch in veilige blokken kan.
- Geen nieuwe statuswaarden buiten: `backlog`, `ready`, `in_progress`, `review`, `blocked`, `done`.
- Geen taak automatisch op `done` zetten zonder verify-resultaat en afrondingscontext.
