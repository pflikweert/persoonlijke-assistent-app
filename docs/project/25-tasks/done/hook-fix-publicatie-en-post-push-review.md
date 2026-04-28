---
id: task-hook-fix-publicatie-en-post-push-review
title: Hook-fix publicatie en post-push review
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-28
summary: "Publiceer alleen de convergente task-commit-hook fix plus verplichte bundeloutput/VSIX, push naar main en review daarna exact die gepushte diff."
tags: [git, review, hooks, workflow, plugin]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: [task-post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


# Hook-fix publicatie en post-push review

## Probleem / context

De hook-fix is lokaal klaar en geverifieerd, maar nog niet gepubliceerd. Tegelijk bevat de worktree inmiddels extra ongerelateerde lokale wijzigingen in app/theme-bestanden en een andere open task. Deze ronde moet daarom strikt alleen de hook/taskflow/plugin-test changeset publiceren en daarna precies die gepushte diff reviewen.

## Gewenste uitkomst

Er staat één gerichte commit op `main` met alleen de convergente task-commit-hook fix, de bijbehorende workflowdocs/tests, de verplichte bundeloutput en de opnieuw gebouwde VSIX.

Direct daarna ligt er een findings-first review van precies die gepushte diff, zonder dat de review zelf de zojuist gepushte commit nog wijzigt.

## User outcome

De gebruiker heeft de hook-fix veilig gepubliceerd, met een directe nabeoordeling van wat er echt op remote staat.

## Functional slice

Een publicatie- en review-slice voor bestaand lokaal werk:

1. commit scope hard afbakenen
2. publiceren
3. gepushte diff reviewen

## Entry / exit

- Entry: hook-fix changeset staat lokaal klaar, worktree bevat daarnaast extra ongerelateerde wijzigingen.
- Exit: hook-fix changeset is gepusht en gereviewd; ongerelateerde lokale wijzigingen blijven onaangeraakt lokaal staan.

## Happy flow

1. Bevestig AGENTS/instructies en de actuele worktree.
2. Maak een aparte publicatie-task en zet die bovenaan `in_progress`.
3. Herverifieer de hook-fix changeset.
4. Stage alleen de bedoelde hook/taskflow/plugin-test files plus bundeloutput en VSIX.
5. Commit en push naar `main`.
6. Review de gepushte diff findings-first.

## Non-happy flows

- Verify faalt: publicatie stopt totdat de hook-fix changeset weer groen is.
- Onbedoelde files staged: reset de stage en stage opnieuw alleen de bedoelde set.
- Push faalt: lokale commit blijft staan; review op gepushte diff vervalt dan.
- Review vindt issues: leg die vast als follow-up task, niet als amend op de net gepushte commit in dezelfde ronde.

## UX / copy

- Geen product-UX scope; alleen repo-publicatie, docs en review-output.

## Data / IO

- Input:
  - lokale hook-fix changeset
  - verplichte generated docs
  - rebuilt VSIX
- Output:
  - nieuwe commit op `main`
  - review van de gepushte diff
- Opslag/API/service/file-impact:
  - `.githooks/post-commit`
  - `scripts/task-commit-log.mjs`
  - `scripts/task-commit-log.test.mjs`
  - `tools/budio-workspace-vscode/src/test/task-writer.test.ts`
  - `AGENTS.md`
  - `docs/dev/task-lifecycle-workflow.md`
  - `.agents/skills/task-status-sync-workflow/SKILL.md`
  - `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`
  - `docs/project/25-tasks/done/post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen.md`
  - bundeloutput onder `docs/project/generated/**`, `docs/upload/**`, `docs/design/generated/**`
  - `tools/budio-workspace-vscode/budio-workspace-vscode.vsix`
- Statussen:
  - unstaged local
  - staged selected-only
  - committed
  - pushed
  - reviewed

## Waarom nu

- De hook-fix hoort niet lokaal te blijven hangen.
- De worktree is inmiddels gemengd; zonder expliciete publicatieronde wordt de kans op scope-lek groot.

## In scope

- Nieuwe publicatie-task.
- AGENTS/instructies opnieuw lezen.
- Hook-fix verify opnieuw draaien.
- Alleen de bedoelde publicatieset stage/commit/pushen.
- Gepushte diff reviewen.

## Buiten scope

- `theme/tokens.ts`
- `app/_layout.tsx`
- `components/journal/day-journal-summary-inset.tsx`
- `components/ui/detail-screen-primitives.tsx`
- `constants/theme.ts`
- `docs/project/25-tasks/open/dark-light-mode-theming-zonder-refresh-fix.md`
- andere lokale wijzigingen buiten de hook-fix publication set

## Oorspronkelijk plan / afgesproken scope

- Commit, push en review alleen de hook/taskflow/plugin-test changeset.
- VSIX gaat mee.
- Review gebeurt post-push op de gepushte diff.

## Expliciete user requirements / detailbehoud

- Lees eerst opnieuw AGENTS en instructies.
- Commit en push nu.
- Review daarna of het goed werkt.
- Sluit deze publicatieronde niet stilzwijgend uit met extra UI/theme-wijzigingen.

## Status per requirement

- [x] Nieuwe aparte publicatie-task — status: gebouwd
- [x] Alleen hook-fix changeset publiceren — status: gebouwd
- [x] `theme/tokens.ts` en andere ongerelateerde lokale wijzigingen uitsluiten — status: gebouwd
- [x] Push naar `main` — status: gebouwd
- [x] Post-push review van gepushte diff — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Scope is verder aangescherpt omdat er sinds het vorige plan extra ongerelateerde lokale wijzigingen zijn bijgekomen.

## Uitvoerblokken / fasering

- [x] Blok 1: AGENTS/instructies en actuele worktree opnieuw bevestigen.
- [x] Blok 2: verify voor de hook-fix publication set draaien.
- [x] Blok 3: geselecteerde files stage/commit/push.
- [x] Blok 4: gepushte diff reviewen en task afronden.

## Concrete checklist

- [x] Nieuwe taskfile aangemaakt.
- [x] Hook-fix verify opnieuw geslaagd.
- [x] Alleen bedoelde files gestaged.
- [x] Commit gemaakt.
- [x] Push geslaagd.
- [x] Gepushte diff gereviewd.

## Acceptance criteria

- [x] Nieuwe commit bevat alleen de hook-fix publication set.
- [x] `theme/tokens.ts` en andere ongerelateerde lokale wijzigingen zitten niet in de commit.
- [x] Commit staat op `main`.
- [x] Review van de gepushte diff is opgeleverd in findings-first vorm.

## Blockers / afhankelijkheden

- Afhankelijk van een schone selectie van staged files uit een verder dirty worktree.

## Verify / bewijs

- `node --test scripts/task-commit-log.test.mjs`
- `npm --prefix tools/budio-workspace-vscode run test`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `git status --short`
- `git show --stat -1`
- `git push origin main`
- review op `git show <nieuwe-commit>`

## Reconciliation voor afronding

- Oorspronkelijk plan: hook-fix changeset publiceren en daarna reviewen.
- Toegevoegde verbeteringen: uitsluiten van extra later opgedoken UI/theme-wijzigingen.
- Afgerond: hook-fix changeset is als `4bfc187` naar `main` gepusht, uitsluitingen zijn gerespecteerd en de gepushte diff is daarna findings-first gereviewd.
- Open / blocked: geen.

## Reviewresultaat

- Geen findings op de gepushte hook-fix diff.
- Residueel risico: de review heeft de echte commit met actieve hook en de script-level amend-smoke bevestigd, maar geen extra handmatige tweede live-commit in deze hoofdrepo na de push uitgevoerd buiten de bestaande test- en commitflow.

## Relevante links

- `AGENTS.md`
- `docs/project/README.md`
- `docs/project/25-tasks/done/post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen.md`


## Commits

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge
