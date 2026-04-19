# DO NOT EDIT - GENERATED FILE

# Budio AI Governance and Operations

Build Timestamp (UTC): 2026-04-19T13:05:23.760Z
Source Commit: b3a523c

Doel: primaire bundle voor AI-governance, AIQS-uitvoering en operationele workflowregels.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## AI Quality Studio Governance (excerpt)
# AI Quality Studio (Canoniek)

## Canonieke status

Dit document is de **leidende bron voor AI-gedrag, promptbeheer, evaluatie en runtime-governance** binnen dit project.

Bij conflict geldt:
- `docs/project/content-processing-rules.md` is leidend voor **inhoudscontracten en grensgedrag van output**
- `docs/project/ai-quality-studio.md` is leidend voor **AI-tooling, prompting, evaluatie, versiebeheer, rollout en runtime-governance**
- andere projectdocs verwijzen hiernaar voor AI-gedrag en promptbeheer

Dit document beschrijft zowel:
- de huidige werkende tussenarchitectuur
- als de gewenste eindrichting voor een volwassen AI quality platform-laag
- en de **bindende bouwvolgorde** voor de volgende studio-fase

---

## 1. Doel en positie

AI Quality Studio is een **admin-only AI quality en prompting governance tool**.

Doel:
- AI-output betrouwbaar verbeteren
- prompt- en modelwijzigingen beheersbaar maken
- testbaar en reproduceerbaar itereren op echte brondata
- zichtbaar kunnen valideren of een nieuwe prompt **daadwerkelijk beter** is dan de huidige runtime-basis
- runtime-gedrag later gecontroleerd uit code-baseline naar DB-live binding brengen

De studio is:
- task-first
- contract-first
- result-first
- evidence-first
- server-side only

De studio is **geen**:
- end-user feature
- brede assistentlaag
- generieke AI per scherm
- vervanging van productkaders of contentcontracten
- mini-Langfuse of mini-Agenta als generiek platformdoel

---

## 2. Scopekader

### In scope
- Werk per **AI-task**, niet per scherm
- Versioning per task
- Runtime-baseline import uit code
- Drafting en gecontroleerde model/prompt-editing
- Test runs met snapshots
- Vergelijking testoutput vs runtime-basis
- Opslaan van evaluatie-uitkomsten per run/case/versie
- Handmatige review en rollout-governance
- Traceability per versie en run
- Admin UX voor mobiel én desktop/fullscreen gebruik

### Buiten scope
- Client-side OpenAI calls
- End-user debug- of beheerfeatures
- Brede chat/coach/agent-ervaring
- Auto-optimalisatie als vervanging van menselijke review
- Runtime DB-binding zonder rollout- en rollbackpad
- Volledige live-observability en productiebeoordeling als eerste volgende fase
- Generieke prompt IDE voor willekeurige toekomstige AI use cases

---

## 3. Strategische aanscherping (april 2026)

De eerstvolgende studiofase draait **niet** primair om rollout of live runtime-integratie.

De eerstvolgende studiofase draait om één kernvraag:

**Is een nieuwe promptversie aantoonbaar beter dan de huidige basis?**

Daarom is de bindende prioriteit nu:
1. testen binnen de studio
2. vergelijkbaar valideren van kandidaat-output vs runtime-basis
3. evaluatie-uitkomsten opslaan als bewijs
4. editor-ervaring en task-consistentie gelijktrekken
5. admin UX op desktop/fullscreen verbeteren zonder mobiel te breken
6. lifecycle, rollout, runtime-koppeling en live monitoring pas daarna verder uitbouwen

Dit betekent expliciet:
- testbaarheid gaat vóór rollout-volume
- evidence gaat vóór dashboard-polish
- editor-consistentie gaat vóór nieuwe promptfeatures
- runtime/live-beoordeling komt **later**, omdat runtime nu nog hardcoded en niet versiegestuurd uit de studio leest

---

## 4. Canonieke ontwerpprincipes

1. **Contract-first**  
   Content contracts zijn leidend boven promptvrijheid.

2. **Task-first**  
   Beheer op AI-taken, niet op UI-schermen.

3. **Result-first**  
   Testresultaat, compare en evaluatie zijn primair; technische metadata is secundair.

4. **Evidence-first**  
   Een promptwijziging is pas waardevol als zichtbaar is of die beter, gelijk, slechter of fout is ten opzichte van de basis.

5. **Server-side only**  
   API keys, modelcalls en runtime-execution blijven server-side.

6. **Traceability by default**  
   Input/prompt/model/output snapshots + request/flow context zijn standaard.

7. **Eerlijke representatie**  
   Toon expliciet wanneer een studio-task onderdeel is van een gedeelde runtime-family.

8. **Geen dubbele waarheid zonder transitieplan**  
   Als code en DB tijdelijk naast elkaar bestaan, moet de hiërarchie expliciet zijn.

9. **Desktop-capable admin**  
   Adminschermen mogen mobiel goed werken, maar mogen niet kunstmatig vastgezet blijven op een mobiele breedte als primaire desktopervaring.

---

## 5. Relatie met contentcontracten (bindend)

Volgt `docs/project/content-processing-rules.md`.

Kernscheiding:
- `entry_cleanup` ≠ samenvatting
- entry-normalization loopt als één compound flow (`entry_cleanup`) voor `title`, `body`, `summary_short`
- `day_narrative` ≠ `day_summary`
- reflectiepunten ≠ advieslaag
- reflecties ≠ therapeutische interpretatie

Als output deze grenzen schendt, is dat een **kwaliteitsfout**, ongeacht modelscore of “mooier” taalgebruik.

---

## 6. Huidige code-realiteit (status april 2026)

Deze sectie beschrijft wat nu aantoonbaar gebouwd is en wat strategisch relevant is voor de volgende fase.

### 6.1 Datamodel (aanwezig)
Tabellen:
- `ai_tasks`
- `ai_task_versions`
- `ai_test_cases`
- `ai_test_runs`
- `ai_live_generation_log`

Aanwezig in schema:
- enums voor input/output/status/review/source
- UUID PK’s, FK’s, timestamps
- 1 live versie per task
- oplopende versionin

[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]

## Cline Workflow (excerpt)
# Cline workflow (operationeel)

## Doel
Operationele werkwijze voor werken met ChatGPT Projects + Cline, zonder productwaarheid te vervuilen.

## Rolverdeling
- **ChatGPT Projects**: strategie, review en promptontwerp buiten repo-uitvoering.
- **Cline in VS Code**: repo-analyse, plan, wijzigingen, verify en commit.

## Bronnenvolgorde
1. `docs/project/README.md`
2. `AGENTS.md`
3. taakrelevante canonieke docs in `docs/project/**`
4. relevante skill(s) in `.agents/skills/**` wanneer de taak daar expliciet onder valt
5. `docs/dev/active-context.md` alleen wanneer recente sessiecontext of WIP relevant is

Regels:
- `docs/project/**` = canonieke projectwaarheid.
- `docs/dev/**` = workflowafspraken.
- `docs/upload/**` = generated uploadartefacten, geen canonieke bron.
- Geen "lees alles altijd"-regel; lees alleen taakrelevante bronnen.
- Voor Stitch-werk: gebruik `docs/dev/stitch-workflow.md` als operationele workflowbron.
- Voor idee-capture/promotie: gebruik `docs/dev/idea-lifecycle-workflow.md`.

## Design-implementatie guardrails (operationeel)
- `theme/tokens.ts` is de enige tokenbron; afgeleide configbestanden zijn niet leidend.
- Gebruik eerst bestaande shared primitives/patronen; voeg alleen een nieuw shared component toe bij een echt herhaalbaar patroon over meerdere schermen.
- Stop geen screen-specifieke designregels in generieke shared primitives.
- `design_refs/1.2.1/**` zijn bindend per scherm; `.md` notes tellen mee naast `code.html` en `screen.png`.
- Verify stylingwerk altijd in light én dark mode tegen relevante design refs voordat het “klaar” is.

## Repo-eigen Memory Bank workflow
- Onze memory bank is een **workflowlaag**, geen extra waarheidshiërarchie.
- Verdeling:
  - canonieke waarheid: `docs/project/**`
  - always-on gedrag: `AGENTS.md`
  - domeinspecifieke herhaalpatronen: `.agents/skills/**`
  - operationele workflow: `docs/dev/cline-workflow.md` + `docs/dev/memory-bank.md`
  - tijdelijke sessiecontext: `docs/dev/active-context.md`
  - statuswaarheid: `docs/project/current-status.md`
  - echte gaps/onzekerheden: `docs/project/open-points.md`

## Active context tussen sessies
- `docs/dev/active-context.md` is een lichte brug tussen Cline-sessies.
- Gebruik actief bij:
  - non-triviale taken
  - onderbroken sessies
  - multi-file werk
  - taken waar recente learnings/WIP of docs-updates relevant zijn
- Meestal niet nodig bij:
  - kleine, volledig afgebakende fixes zonder sessieafhankelijkheid

Regels:
- `active-context.md` is niet canoniek en niet de statuswaarheid.
- Verwijs naar canonieke docs in plaats van inhoud te kopiëren.
- Promoveer alleen stabiele learnings naar `AGENTS.md`, skills of `docs/dev/**`.

## Beslisregels per laag
- canonieke waarheid → `docs/project/**`
- operationele workflow → `docs/dev/**`
- always-on gedrag → `AGENTS.md`
- taak-/domeinspecifieke herhaalpatronen → skills
- tijdelijke sessiecontext → `docs/dev/active-context.md`
- statusrealiteit (bewijsbaar) → `docs/project/current-status.md`
- echte gaps/onzekerheden → `docs/project/open-points.md`

## Wanneer Plan mode
Gebruik Plan mode bij:
- bugs met onduidelijke oorzaak
- multi-file wijzigingen
- migraties
- taken met duidelijke scope-/archite

[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]

## Stitch Workflow (excerpt)
# Stitch workflow (operationeel)

_Status: operationele workflow, niet-canonieke productwaarheid_

## Doel
Deze workflow beschrijft hoe we Stitch gebruiken voor merk- en schermwerk binnen **Budio Vandaag**, zodat:
- designwerk consistent blijft met bestaande product- en designguardrails
- ChatGPT betere Stitch-prompts kan schrijven
- Cline uitkomsten gestructureerd kan opnemen in repo-docs en design refs
- Stitch-output niet direct als waarheid in code of docs belandt zonder selectie en handoff

## Plaats in de docs-hiërarchie
Dit document is een **workflowdoc** en hoort in:

`docs/dev/stitch-workflow.md`

Niet in:
- `docs/project/**` → canonieke productwaarheid
- `docs/upload/**` → generated uploadartefacten

## Relatie met leidende bronnen
Stitch werkt altijd binnen deze kaders:
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/ethos_ivory/DESIGN.md`
- `theme/tokens.ts`
- `docs/project/copy-instructions.md`
- `docs/project/master-project.md`
- `docs/upload/stitch-design-context.md` alleen als compacte upload/handoff, niet als waarheid

## Kernprincipes
1. **Capture-first blijft leidend**
   - Geen dashboardisering
   - Geen chat- of coachgevoel
   - Today blijft entry point met 1 dominante primaire actie

2. **Stitch is exploratie + handoff, geen waarheid**
   - Stitch-output is pas bruikbaar na selectie, review en vertaling naar design refs/docs
   - Geen screen direct als bindende waarheid behandelen zonder expliciete keuze

3. **Eén scherm per prompt**
   - Niet meerdere hoofdschermen tegelijk genereren
   - Eerst foundation/shell, daarna losse schermen

4. **Gebruik exacte merkassets**
   - Gebruik het geüploade Budio Vandaag-logo/icoon als huidige werkbasis
   - Laat Stitch geen nieuwe merknaam, nieuw logo of nieuw symbool verzinnen

5. **Correctierondes zijn verplicht**
   - Eerste prompt = generate
   - Tweede prompt = correction/refinement met harde keep/change/do-not regels

6. **Stitch moet systeem volgen, niet sfeer alleen**
   - Prompt altijd met productregels, shellregels, kleurregels en merkregels
   - Niet alleen woorden als “calm”, “premium” of “editorial” geven

## Officiële merkregels voor Stitch
Gebruik in Stitch altijd deze merkregels, tenzij later expliciet aangepast in canonieke design refs:

- Parent brand: `Budio`
- Product brand: `Budio Vandaag`
- In-app shorthand: `Vandaag`
- Gebruik `Budio Vandaag` voor auth, about, brand boards en documentatie
- Gebruik `Vandaag` alleen als schermtitel of korte in-app context
- Gebruik nooit alternatieve labels zoals:
  - `Vandaag by Budio`
  - `Quiet Curator`
  - nieuwe descriptoren of submerken

## Assetregels
Gebruik altijd een vaste asset-set per Stitch-sessie:
- huidige Budio Vandaag-logo SVG/PNG
- relevante bestaande Stitch-screen of referentiebeeld
- relevante design ref of screenshot uit repo
- vaste promptregels uit dit document

Expliciet verbieden in prompts:
- do not invent a new logo
- do not invent a new symbol
- do not rename the brand
- do not introduce alternative labels
- do not create website concepts unless explicitly requested

## Kleur- en UI-regels voor Stitch
- Warm neutral base blijft leidend
- Gold is in principe voor **primaire CTA** en klei

[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]
