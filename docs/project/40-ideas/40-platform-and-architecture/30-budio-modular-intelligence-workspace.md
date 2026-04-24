# Budio modular intelligence workspace

## Status

idea

## Type

platform-architecture

## Horizon

later

## Korte samenvatting

Budio evolueert naar een modulair intelligence workspace-model waarin elke flow een eigen oplossing heeft voor context, AI-calls en evaluatie.

## Probleem

Eén generieke AI-oplossing over alle domeinen leidt tot ruis, contractconflicten en slechte UX-fit.

## Waarom interessant

Flow-specifieke kwaliteit, betere governance en duidelijkere productpositionering per doelgroep.

## Relatie met huidige docs

- Sluit aan op research future-state docs en AIQS-governance.
- Moet buiten huidige MVP-claim blijven totdat expliciet gepland.

## Mogelijke impact

- product
- aiqs
- services
- docs

## Open vragen

- Welke flow-families krijgen als eerste prioriteit?
- Hoe scheid je shared platformlaag vs flow-specifieke laag technisch?

## Nieuwe input (apr 2026): Identifying and scaling AI use cases

Bron: `https://openai.com/business/guides-and-resources/identifying-and-scaling-ai-use-cases/`.

Relevante learnings:

1. **Start met laag-effort/high-impact i.p.v. indrukwekkende complexiteit**
   - De gids benadrukt dat complexe use-cases vaak vertragen; snelle waarde komt uit herhaalbare teamproblemen.
   - Dit past bij onze cheap-first route: eerst kleine flow-modules met meetbare impact.

2. **Gebruik vaste use-case primitives om ontdekking te versnellen**
   - De bron groepeert use-cases in terugkerende primitieve typen (zoals content, research, coding, data-analyse, ideation/strategy, automations).
   - Voor Budio ondersteunt dit een modulair model per flow-familie met een kleine contractset per primitive i.p.v. één generieke AI-laag.

3. **Prioriteren met Impact/Effort als terugkerend ritme**
   - De gids adviseert expliciete quadrant-prioritering en periodieke herijking.
   - Dit sluit aan op onze planning-/taskflowlaag: modules pas opschalen zodra bewijs op impact en uitvoerbaarheid er is.

4. **Cross-functioneel bouwen en itereren versnelt schaalbaarheid**
   - Voorbeeldstructuur in de bron: business owner + domeinexpert + technische lead, met feedbackloops na launch.
   - Voor Budio vertaalt dit naar compacte triads voor nieuwe flow-modules (product/context, domeinkwaliteit, implementatie/agentflow).

### Vertaling naar Budio-scope (cheap-first)

- **Nu (idea):** flow-families expliciet mappen op primitives, met per family een minimale outputcontractset.
- **Next:** 1 pilot-flow kiezen met Impact/Effort-score en een korte evaluateloop (kwaliteit, doorlooptijd, herhaalbaarheid).
- **Later:** alleen bewezen modules promoveren naar bredere workspace-architectuur.

### Bewuste afbakening

- Geen nieuwe roadmapbeslissing zonder aparte planningstap.
- Geen grote platformherbouw op basis van 1 gids; eerst kleine evidence-gedreven pilots.

## Volgende stap

Flow-families definiëren met minimale contractset per module.
