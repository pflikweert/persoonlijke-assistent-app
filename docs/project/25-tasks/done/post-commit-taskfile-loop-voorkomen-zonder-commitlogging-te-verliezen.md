---
id: task-post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen
title: Post-commit taskfile-loop voorkomen zonder commitlogging te verliezen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-28
summary: "Maak de repo-managed task commitlogging convergent: behoud automatische `## Commits` updates, maar zonder dirty-worktree-loop na commits die taskfiles raken."
tags: [workflow, git, hooks, tasks, plugin]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


# Post-commit taskfile-loop voorkomen zonder commitlogging te verliezen

## Probleem / context

De repo gebruikt een repo-managed `post-commit` hook om `## Commits` in taskfiles automatisch aan te vullen. De huidige implementatie schrijft na iedere commit opnieuw naar dezelfde taskfiles in de worktree. Daardoor ontstaat direct een nieuwe set ongestagede wijzigingen, en commit-closeout kan in een lokale lus eindigen.

De huidige workaround `git -c core.hooksPath=/dev/null commit ...` is niet geschikt als standaardworkflow. De hook moet zelf convergent worden, zodat een commit die taskfiles raakt zonder extra handmatige cleanup schoon eindigt.

## Gewenste uitkomst

Automatische taskfile commitlogging blijft bestaan, maar gebruikt voortaan een stabiele entry zonder commit-hash. De hook mag taskfiles aanpassen en exact één amend doen, waarna de repo schoon blijft.

Workflowdocs, AGENTS en skills beschrijven daarna expliciet dat hook-omzeiling alleen nog break-glass is bij een bevestigd hook-defect.

## User outcome

Een developer of agent kan weer normaal committen wanneer taskfiles geraakt zijn, zonder handmatige hook-omzeiling of extra cleanup-commit.

## Functional slice

Een repo-brede workflow-hardening-slice:

1. convergente `post-commit` tasklogging
2. testdekking voor het amend-pad
3. docs/skill-guardrails tegen herhaling

## Entry / exit

- Entry: een commit raakt één of meer taskfiles in `docs/project/25-tasks/**`.
- Exit: `## Commits` krijgt automatisch een stabiele entry, de hook doet hoogstens één amend, en `git status` blijft schoon.

## Happy flow

1. Een commit raakt taskfiles.
2. `post-commit` start `scripts/task-commit-log.mjs`.
3. Het script bouwt een stabiele entry uit `author date + subject`.
4. Alleen ontbrekende entries worden naar de relevante taskfiles geschreven.
5. Het script staged die wijzigingen en doet exact één `git commit --amend --no-edit` met guard-env.
6. De guard voorkomt re-entrancy op de amend-commit.
7. De worktree eindigt schoon zonder nieuwe tracked wijzigingen.

## Non-happy flows

- Geen taskfiles in `HEAD`: script doet niets.
- Entry bestaat al: script doet niets.
- Guard-env staat al aan: script doet niets.
- Amend faalt: commit blijft bestaan en de fout wordt zichtbaar, niet stil genegeerd.

## UX / copy

- `## Commits` gebruikt voortaan stabiele auto-managed entries zonder hash, bijvoorbeeld:
  - `- 2026-04-28T09:41:12+02:00 — docs: sync local workspace state`
- Bestaande historische hashregels blijven ongemoeid.

## Data / IO

- Input:
  - `git diff-tree` van `HEAD`
  - `git show` metadata van `HEAD`
  - taskfiles onder `docs/project/25-tasks/**`
- Output:
  - bijgewerkte `## Commits` secties
  - optioneel één amend van `HEAD`
- Opslag/API/service/file-impact:
  - `.githooks/post-commit`
  - `scripts/task-commit-log.mjs`
  - `scripts/task-commit-log.test.mjs`
  - `tools/budio-workspace-vscode/src/test/task-writer.test.ts`
  - `AGENTS.md`
  - `docs/dev/task-lifecycle-workflow.md`
  - `.agents/skills/task-status-sync-workflow/SKILL.md`
  - open requirementtekst in `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`
- Statussen:
  - hook no-op
  - entry appended
  - amend executed once

## Waarom nu

- De loop is net in de praktijk bevestigd.
- De huidige workaround hoort geen normale repo-werkwijze te worden.
- De repo heeft al expliciete open requirements voor automatische commitlogging; nu moet dat pad ook echt veilig worden.

## In scope

- Hook/script convergent maken met guard-env.
- `## Commits` formaat wijzigen naar stabiele auto-entry zonder hash.
- Script-level tests voor no-op, guard, append en amend-clean-state.
- Writer-test voor placeholder-vervanging in `## Commits`.
- Workflowdocs, AGENTS en skill aanscherpen.
- Open requirementtekst actualiseren van hash+subject naar stabiele auto-entry.

## Buiten scope

- Historische migratie van bestaande `## Commits` entries.
- Nieuwe plugin-UI rond commithistorie.
- Grote herbouw van task-md datamodel.

## Oorspronkelijk plan / afgesproken scope

- Behoud automatische commitlogging.
- Maak `## Commits` stabiel zonder hash.
- Gebruik `author date` (`%aI`) + subject als entrybron.
- Voeg een expliciete re-entrancy guard toe voor amend-flow.
- Behandel `core.hooksPath=/dev/null` daarna als break-glass only.

## Expliciete user requirements / detailbehoud

- Nieuwe taak, niet onderbrengen in `plugin-activitybar-opent-list-view-zonder-workspace-menu.md`.
- `## Commits` moet auto-managed blijven.
- De hook mag geen normale dirty-worktree-loop meer veroorzaken.
- `core.hooksPath=/dev/null` mag in docs/skills niet meer als normale closeout-route staan.
- Bestaande historische hashentries hoeven niet gemigreerd te worden.

## Status per requirement

- [x] Nieuwe losse workflow/task-tooling-task — status: gebouwd
- [x] Convergente post-commit hook met guard-env — status: gebouwd
- [x] Stabiel `## Commits` formaat zonder hash — status: gebouwd
- [x] Script-level tests voor amend-pad — status: gebouwd
- [x] Workflowdocs/AGENTS/skill aangepast — status: gebouwd
- [x] Open plugin-requirementtekst aangescherpt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en relevante code/docs bevestigen.
- [x] Blok 2: hook-script en testdekking implementeren.
- [x] Blok 3: workflowdocs en requirementteksten aanscherpen.
- [x] Blok 4: verify, git-smoke en reconciliation afronden.

## Concrete checklist

- [x] Nieuwe taskfile aangemaakt en bovenaan `in_progress` geplaatst.
- [x] `scripts/task-commit-log.mjs` convergent gemaakt.
- [x] Script-level tests toegevoegd.
- [x] `task-writer` test uitgebreid voor `## Commits`.
- [x] AGENTS/workflow/skill bijgewerkt.
- [x] Open plugin-task geüpdatet voor stabiele auto-entry zonder hash.
- [x] Verify en git-smoke geslaagd.

## Acceptance criteria

- [x] Een commit die taskfiles raakt eindigt zonder resterende tracked wijzigingen.
- [x] `## Commits` krijgt automatisch een entry met `author date + subject`.
- [x] Guard voorkomt re-entrancy op de amend-commit.
- [x] `core.hooksPath=/dev/null` staat alleen nog als break-glass beschreven.
- [x] Bestaande hashentries blijven ongemoeid.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `node --test scripts/task-commit-log.test.mjs`
- `cd tools/budio-workspace-vscode && npm run test`
- `cd tools/budio-workspace-vscode && npm run apply:workspace`
- script-level git-smoke in `scripts/task-commit-log.test.mjs`: amend-pad voegt entry toe en eindigt met schone `git status`

## Reconciliation voor afronding

- Oorspronkelijk plan: convergente hook zonder hashgebaseerde self-loop.
- Toegevoegde verbeteringen: shell-level guard in `.githooks/post-commit` toegevoegd naast scriptguard, plus expliciete writer-test voor placeholder-vervanging.
- Afgerond: hook gebruikt stabiele `author date + subject` entries, doet hoogstens één amend met guard-env, heeft script-testdekking voor guard/no-op/amend-clean-state, en workflowdocs behandelen hook-omzeiling nu als break-glass only.
- Open / blocked: geen.

## Relevante links

- `AGENTS.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `scripts/task-commit-log.mjs`
- `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`


## Commits

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge