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
   - Wanneer je automatisch een nieuwe taak aanmaakt: zet die direct bovenaan de doel-lane met `sort_order: 1` en herschrijf de overige taakfiles in die lane doorlopend.
   - Wanneer een open taak actief wordt uitgevoerd en naar `in_progress` gaat: zet die direct bovenaan de `in_progress` lane en herschrijf `sort_order` voor bron- en doellane zodat de sortering opgeslagen blijft.
   - Zet status op `in_progress` zodra inhoudelijke uitvoering start (tenzij al correct).
   - Communiceer in de eerste inhoudelijke update en daarna in elke volgende update:
     - `Task: ...`
     - `Task file: ...`
     - `Status: ...`
   - Noem in elk inhoudelijk plan expliciet het concrete taskfile-pad.
   - Voeg in Plan Mode-plannen altijd een korte `Taskflow summary` toe: bestaande/nieuwe taskfile, verwachte statuswijziging, en wanneer extra werk een eigen task krijgt.

2. **Tijdens uitvoering**
   - Houd `updated_at` actueel bij betekenisvolle voortgang.
   - Werk checklist-items alleen bij op echte milestone-completion.
   - Testbevindingen en verbeteringen binnen dezelfde flow blijven in dezelfde task.
   - Nieuw niet-relevant werk krijgt een eigen task.

3. **Bij blokkade**
   - Zet status op `blocked` met korte blocker in taskfile.
   - Laat taak in `open/` staan.

4. **Bij afronding**
   - Zet status op `done` zodra code + verify klaar zijn en commit/push gereed is.
   - Verplaats taak naar `docs/project/25-tasks/done/` als nog in `open/`.
   - Meld in eindresultaat opnieuw `Task`, `Task file`, `Status`.

5. **Bij handmatige user-update**
   - Als status al correct is aangepast door gebruiker: niet overschrijven.
   - Meld expliciet in output dat status al klopte of is bijgewerkt.

# Verify bij statusovergangen
- Taskflow guardrail: `npm run taskflow:verify`.
- Codewijziging: `npm run lint` + `npm run typecheck`.
- Docs/tasklaag gewijzigd: daarna `npm run docs:bundle` en `npm run docs:bundle:verify`.

# Niet doen
- Geen inhoudelijk plan opleveren zonder concrete taskfile.
- Geen nieuwe statuswaarden buiten: `backlog`, `ready`, `in_progress`, `blocked`, `done`.
- Geen taak automatisch op `done` zetten zonder verify-resultaat en afrondingscontext.
