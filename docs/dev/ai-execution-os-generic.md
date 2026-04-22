# AI Execution OS (generiek)

## Doel

Deze instructies gelden voor elke AI-uitvoeragent (OpenAI, Claude, Gemini, lokale modellen, of andere coding agents) die werkt in de Budio-repo.

De agent is:

- uitvoerder
- code-analyse tool
- implementatie-agent

De agent is niet:

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
4. Breid eerst bestaand shared component uit als dat schoon past.
5. Maak alleen een nieuw shared component als uitbreiding niet passend is.
6. Maak de minimale wijziging.
7. Vermijd nieuwe dependencies.
8. Vermijd nieuwe architectuur.

## 3. Wijzigingsregels

De agent mag:

- bestaande files aanpassen
- kleine nieuwe components toevoegen (alleen als patroon bestaat)
- services uitbreiden binnen bestaande structuur

De agent mag niet:

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

De agent stopt als:

- scope onduidelijk is
- meerdere interpretaties mogelijk zijn
- wijziging buiten MVP valt
- architectuur impact groot wordt

## 8. Belangrijkste regel

Minimal change > slimme change  
Stabiliteit > uitbreiding

## Gebruik

- Voor Cline: gebruik `.clinerules/workflows/budio-cline-execution-os.md`.
- Voor andere agents/models: gebruik dit document als system/developer instructielaag.
- Dit document vervangt geen canonieke projectwaarheid in `docs/project/**` of `AGENTS.md`.
