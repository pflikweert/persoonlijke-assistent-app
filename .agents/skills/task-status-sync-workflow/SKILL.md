---
name: task-status-sync-workflow
description: Houd taskfile-statussen automatisch synchroon met de uitvoerfase (in_progress, blocked, done) tijdens implementatie en afronding.
---

# Gebruik
Gebruik wanneer er een taakfile in `docs/project/25-tasks/**` actief is tijdens uitvoering.

# Doel
Voorkom statusdrift tussen uitgevoerde code en taskfile-status.

# Workflow
1. **Start uitvoering**
   - Zorg dat de actieve taak bestaat in `docs/project/25-tasks/open/`.
   - Zet status op `in_progress` zodra implementatie start (tenzij al correct).

2. **Tijdens uitvoering**
   - Houd `updated_at` actueel bij betekenisvolle voortgang.
   - Werk checklist-items alleen bij op echte milestone-completion.

3. **Bij blokkade**
   - Zet status op `blocked` met korte blocker in taskfile.
   - Laat taak in `open/` staan.

4. **Bij afronding**
   - Zet status op `done` zodra code + verify klaar zijn en commit/push gereed is.
   - Verplaats taak naar `docs/project/25-tasks/done/` als nog in `open/`.

5. **Bij handmatige user-update**
   - Als status al correct is aangepast door gebruiker: niet overschrijven.
   - Meld expliciet in output dat status al klopte of is bijgewerkt.

# Verify bij statusovergangen
- Codewijziging: `npm run lint` + `npm run typecheck`.
- Docs/tasklaag gewijzigd: daarna `npm run docs:bundle` en `npm run docs:bundle:verify`.

# Niet doen
- Geen nieuwe statuswaarden buiten: `backlog`, `ready`, `in_progress`, `blocked`, `done`.
- Geen taak automatisch op `done` zetten zonder verify-resultaat en afrondingscontext.