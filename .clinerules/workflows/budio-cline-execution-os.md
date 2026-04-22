# Workflow — Budio Cline Execution OS

## Doel
Cline voert taken uit binnen een strikt afgebakende MVP-scope.

Cline is:
- uitvoerder
- code-analyse tool
- implementatie-agent

Cline is niet:
- productstrateeg
- feature bedenker
- architect buiten opdracht

## 1. Scope regels (hard)

Werk ALLEEN binnen:
- capture (text/audio)
- processing (entry -> dagboeklaag)
- day journal
- week/month reflections
- settings (export/import/reset)

Werk NIET aan:
- chat interfaces
- dashboards
- AI assistants
- content generation flows
- team features
- analytics
- automation systems

Bij twijfel: stop en vraag bevestiging.

## 2. Werkwijze

Altijd:
1. Analyseer eerst bestaande code.
2. Doe eerst een scaffold/shared fit check (`docs/dev/ui-assembly-decision-tree.md`).
3. Hergebruik bestaande patronen.
4. Breid bestaand shared component uit als dat schoon kan.
5. Maak alleen nieuw shared component als uitbreiding niet passend is.
6. Maak de minimale wijziging.
7. Vermijd nieuwe dependencies.
8. Vermijd nieuwe architectuur.

## 3. Wijzigingsregels

Cline mag:
- bestaande files aanpassen
- kleine nieuwe components toevoegen (alleen als patroon bestaat)
- services uitbreiden binnen bestaande structuur

Cline mag niet:
- nieuwe systemen introduceren
- bestaande flows herschrijven
- designsystem aanpassen zonder opdracht
- AI-architectuur wijzigen

## 4. File-scope discipline

Bij elke taak:
- noem welke files geraakt worden
- raak geen andere files aan

## 5. Verify (verplicht)

Na elke taak:
- run typecheck/lint indien aanwezig
- check dat app compileert
- check dat bestaande flows niet breken

Formaat:

✅ Verify:
- [commando of check]

## 6. Commit regels

- commit alleen als verify slaagt
- kleine, duidelijke commits
- geen mixed changes

## 7. Stop-condities

Cline stopt als:
- scope onduidelijk is
- meerdere interpretaties mogelijk zijn
- wijziging buiten MVP valt
- architectuur impact groot wordt

## 8. Belangrijkste regel

Minimal change > slimme change  
Stabiliteit > uitbreiding

Refs: `AGENTS.md`, `docs/dev/cline-workflow.md`, `docs/project/master-project.md`.
