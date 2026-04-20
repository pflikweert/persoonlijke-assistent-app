# Budio Pro markdown workspace en Obsidian export (later)

## Status

idea

## Type

platform-architecture

## Horizon

later

## Korte samenvatting

Leg een later-spoor vast voor Budio Pro waarin developers/IT-teams ideeën en projectoutput als markdown-workspace kunnen beheren, met mogelijke export/koppeling naar Obsidian.

Belangrijk:

- dit is nu **geen** productiesync-feature
- dit is nu **geen** bron van waarheid
- dit is een later integratie-/exportspoor

## Probleem

- Developers/IT-teams willen brainstorms, beslissingen en output soms in markdown-workspaces doorontwikkelen.
- Obsidian wordt vaak gebruikt als denk-/structuurlaag voor kenniswerk.
- Zonder expliciete afbakening ontstaat verwarring tussen:
  - repo-waarheid
  - app-runtime data
  - externe workspace-notes

## Waarom interessant

- Sluit aan op Budio Pro-richting voor krachtigere output- en workflowlagen.
- Biedt potentieel sterke waarde voor technische gebruikers zonder huidige MVP te verstoren.
- Houdt huidige scope clean: eerst repo/docs zichtbaar in Obsidian als lokale workflowlaag; pas later export/integratie.

## Richting (later)

1. **Export-first**
   - Eénrichtings-export vanuit Budio Pro naar markdown-workspace.
   - Geen bidirectionele sync als start.
2. **Workspace target abstraction**
   - Obsidian als één target naast mogelijke andere markdown-workspaces.
3. **Duidelijke waarheidshiërarchie**
   - Repo/docs blijven projectwaarheid.
   - Externe workspace is werk-/consumptielaag.
4. **Admin/operator eerst**
   - Start met admin/dev use-cases, niet direct als eindgebruikersfeature.

## Relatie met huidige situatie

- Huidig Obsidian settingspad is admin-only en lokaal georiënteerd (`app/settings-obsidian.tsx`).
- Dit biedt nu nog geen productie-sync; dat is expliciet buiten scope.
- Voor huidige fase geldt: repo docs direct zichtbaar maken in Obsidian als editorlaag (lokale workflow) is voldoende.

## Mogelijke impact

- product
- services
- docs
- platform

## Open vragen

- Blijft dit export-only, of later selective import?
- Welke markdown-structuur is stabiel genoeg voor Budio-output?
- Hoe voorkomen we truth-drift tussen repo, app en workspace?
- Welke security/privacy eisen gelden bij externe workspace-targets?

## Volgende stap

- Later: conceptspec voor export-only markdown workspace in Budio Pro, met expliciete truth-boundaries en conflictbeleid.
