---
title: Roadmap planning workflow
audience: agent
doc_type: workflow
source_role: operational
visual_profile: plain
upload_bundle: 50-budio-roadmap-planning-pack.md
---

# Roadmap planning workflow

## Doel

Een vaste, goedkope workflow voor maandroadmaps op epicniveau.
De workflow helpt om strategie te vertalen naar bouwbare maandblokken zonder direct in taskniveau, sprintceremonies of brede productfantasie te vallen.

## Wanneer gebruiken

Gebruik deze workflow bij:

- nieuwe concept-roadmaps
- bestaande roadmap herzien
- maandblokken of fasering uitleggen aan iemand zonder projectcontext
- uploadklare planningpacks maken voor ChatGPT Projects of externe review

Gebruik deze workflow niet voor:

- losse bugfixes
- concrete implementatietaken
- taskboard-herordening zonder strategische impact

## Bronnenvolgorde

1. `docs/project/README.md`
2. `docs/project/master-project.md`
3. `docs/project/product-vision-mvp.md`
4. `docs/project/current-status.md`
5. `docs/project/open-points.md`
6. `docs/project/20-planning/**`
7. relevante ideas/research uit `docs/project/30-research/**` en `docs/project/40-ideas/**`

Regel:

- gebruik `docs/upload/**` nooit als bron
- gebruik generated docs nooit als canonieke bron
- wijzig actieve strategie/planning alleen met expliciete gebruikersvraag of expliciet overlegbesluit

## Uitvoerblokken

De agent bepaalt zelf de efficiëntste blokken op basis van huidige agent/model, scope, risico en repo-state.

Standaard voor roadmapwerk:

```text
1. Context
   lees alleen relevante canonieke docs en bestaande planning

2. Structuur
   kies maandblokken, template en visualisatievorm

3. Roadmap
   schrijf epicniveau: doel, must-have, nice-to-have, ROI, volgorde

4. Uploadpack
   zorg dat bundler/uploadartefact de roadmap kan meenemen

5. Verify
   docs lint, docs bundle, bundle verify en taskflow verify
```

Vraag de gebruiker alleen om fasering wanneer er een echte product-, planning- of architectuurtradeoff is.
Vraag niet om toestemming voor simpele blokindeling.

## Roadmapvorm

Elke maand moet bevatten:

- duidelijke titel
- strategisch doel
- eindgebruikerswaarde
- Budio-ROI
- must-have epics
- nice-to-have epics
- technische afhankelijkheden
- rolloutvolgorde
- test- of pilotlogica
- waarom deze maand nu komt

Elke epic blijft:

- buildbaar
- high-level
- niet op taskniveau
- gekoppeld aan gebruikerswaarde of Budio-ROI

## Prioriteringsregels

Gebruik een lichte combinatie van:

- doel-naar-feature mapping, geinspireerd door de GO Product Roadmap van Roman Pichler
- thema-roadmaps in plaats van losse featurelijsten, zoals ProductPlan adviseert
- doel/uitkomst/werk-terug redeneren, zoals Atlassian roadmap guidance beschrijft
- RICE-denken van Intercom als sanity-check op impact, confidence en effort
- Opportunity Solution Tree-denken van Product Talk om probleem, kans en oplossing niet te verwarren

Bronnen:

- [Roman Pichler - GO Product Roadmap](https://www.romanpichler.com/tools/the-go-product-roadmap/)
- [Atlassian - Create a project roadmap](https://www.atlassian.com/agile/project-management/create-project-roadmap)
- [ProductPlan - Organize your roadmap by themes](https://www.productplan.com/learn/organize-your-roadmap-by-themes)
- [Intercom - RICE prioritization](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)
- [Product Talk - Opportunity Solution Trees](https://www.producttalk.org/opportunity-solution-trees/)

## Visualisatie

Gebruik eenvoudige ASCII wanneer dat de roadmap sneller scanbaar maakt.

Goede vormen:

- tijdlijn
- dependency flow
- must-have versus nice-to-have matrix
- rolloutfunnel

Geen zware diagramtooling nodig zolang Markdown leesbaar blijft.

## Acceptatiecriteria

Een roadmap is pas goed genoeg wanneer:

- iemand zonder projectcontext begrijpt waarom de maanden zo zijn ingedeeld
- must-have en nice-to-have expliciet gescheiden zijn
- de volgorde technisch en gebruikersmatig logisch is
- niet-bouwen expliciet benoemd is
- Jarvis niet stiekem publieke scope wordt
- de roadmap uploadklaar beschikbaar is via `docs/upload/**`
