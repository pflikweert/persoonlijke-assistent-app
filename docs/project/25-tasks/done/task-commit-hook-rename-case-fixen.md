---
id: task-task-commit-hook-rename-case-fixen
title: Task commit hook rename-case fixen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-29
summary: "Maak de automatische task commit logging robuust voor taskfile-renames en moves, zodat open->done commits niet opnieuw een dirty worktree of ENOENT achterlaten."
tags: [git, hooks, workflow, tasks]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: [task-post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen]
follows_after: [task-hook-fix-publicatie-en-post-push-review]
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


# Task commit hook rename-case fixen

## Probleem / context

De convergente post-commit hook werkt voor normale taskfile-wijzigingen, maar faalde tijdens een live closeout-commit waarin een taskfile van `open/` naar `done/` werd verplaatst. `git diff-tree --name-only` leverde daarbij ook de oude path op, waarna `scripts/task-commit-log.mjs` die niet-bestaande file probeerde te lezen en met `ENOENT` achterbleef.

## Gewenste uitkomst

De hook verwerkt taskfile-renames en moves naar de actuele nieuwe path, voegt daar de stabiele `author date + subject` entry toe, doet hoogstens een guarded amend en eindigt schoon.

## User outcome

Een developer of agent kan een task naar `done/` verplaatsen en normaal committen zonder handmatige cleanup of hook-omzeiling.

## Functional slice

Rename-aware padverzameling voor `scripts/task-commit-log.mjs`, plus testdekking voor `open/ -> done/` taskfile-moves.

## Entry / exit

- Entry: een commit raakt een taskfile via wijziging, rename of move.
- Exit: de bestaande taskfile op de actuele path bevat de commit-entry en `git status --short` blijft schoon.

## Happy flow

1. Een taskfile wordt van `docs/project/25-tasks/open/*.md` naar `docs/project/25-tasks/done/*.md` verplaatst.
2. De commit draait de repo-managed post-commit hook.
3. De hook logt alleen op de nieuwe bestaande path.
4. De guarded amend eindigt zonder nieuwe tracked wijzigingen.

## Non-happy flows

- Deleted taskfile: overslaan, want er is geen actuele taskfile om te loggen.
- Rename met oude en nieuwe taskpath: alleen de bestaande nieuwe taskpath verwerken.
- Onverwachte git-output: veilig filteren naar bestaande `open/` of `done/` taskfiles.

## UX / copy

- Geen runtime-UI of copywijzigingen.

## Data / IO

- Input: `git diff-tree` output voor `HEAD`.
- Output: aangepaste `## Commits` sectie in bestaande taskfiles.
- Opslag/API/service/file-impact: alleen repo-files en git hook-script.
- Statussen: `guarded`, `noop`, `amended` blijven bestaan.

## Waarom nu

De post-push review van de hook-fix vond direct een live rename-regressie. Dit blokkeert het doel dat taskfile-commits zonder cleanup moeten kunnen afronden.

## In scope

- `scripts/task-commit-log.mjs` rename-aware maken.
- Testdekking toevoegen voor rename/move naar `done/`.
- Gerichte taskflow/docs verify draaien.

## Buiten scope

- UI/theme-wijzigingen.
- Plugin layout of task-detail fixes.
- Nieuwe commit-log datastructuur.

## Oorspronkelijk plan / afgesproken scope

- Fix de reviewfinding uit de post-push review: `open/ -> done/` taskfile-renames mogen geen `ENOENT` of dirty worktree achterlaten.

## Expliciete user requirements / detailbehoud

- "Zullen we dit nu gelijk fixen?" verwijst naar de zojuist gevonden hook rename-case.
- De fix moet voorkomen dat dit opnieuw gebeurt bij normale task-closeout commits.
- Houd rekening met meerdere agents die tegelijk in dezelfde repo kunnen werken: de hook mag alleen taskfiles uit `HEAD` verwerken en mag geen unrelated lokale wijzigingen of parallelle agent-wijzigingen meestagen.

## Status per requirement

- [x] Rename-case in hook-script gefixt — status: gebouwd
- [x] Test voor taskfile move/rename toegevoegd — status: gebouwd
- [x] Multi-agent veilige staging/scope bewaakt — status: gebouwd
- [x] Verify gedraaid — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: rename-aware hook-script en test bouwen.
- [x] Blok 3: verify, task/docs afronden en commit/push.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] `diff-tree` padverzameling verwerkt renames zonder oude path te lezen.
- [x] Hook verwerkt alleen taskfiles uit `HEAD` en staged geen unrelated lokale wijzigingen.
- [x] Script-test bewijst `open/ -> done/` move en schone git-status.
- [x] Docs/taskflow bundle geverifieerd.
- [x] Commit en push uitgevoerd.

## Acceptance criteria

- [x] Een commit met taskfile-rename/move veroorzaakt geen `ENOENT`.
- [x] De commit-entry komt in de actuele bestaande taskfile terecht.
- [x] De hook doet hoogstens één guarded amend.
- [x] `git status --short` blijft schoon voor de hook-geraakte files.
- [x] Parallelle unrelated worktree-wijzigingen worden niet gestaged of aangepast.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `node --test scripts/task-commit-log.test.mjs` — geslaagd op 2026-04-29
- `npm run lint` — geslaagd op 2026-04-29
- `npm run typecheck` — geslaagd op 2026-04-29
- `npm run taskflow:verify` — geslaagd op 2026-04-29
- `npm run docs:bundle` — geslaagd op 2026-04-29
- `npm run docs:bundle:verify` — geslaagd op 2026-04-29

## Reconciliation voor afronding

- Oorspronkelijk plan: rename-case in post-commit task logging oplossen.
- Toegevoegde verbeteringen: multi-agent veilige staging expliciet getest met een parallelle lokale wijziging buiten `HEAD`.
- Afgerond: rename-aware padverzameling en testdekking zijn gebouwd; verify, docs-bundle, commit en push zijn afgerond.
- Open / blocked: niets.

## Relevante links

- `scripts/task-commit-log.mjs`
- `scripts/task-commit-log.test.mjs`
- `docs/project/25-tasks/done/hook-fix-publicatie-en-post-push-review.md`


## Commits

- 2026-04-29T00:05:17+02:00 — fix: handle task commit log renames