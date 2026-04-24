# DO NOT EDIT - GENERATED FILE

# Budio AI Governance and Operations

Build Timestamp (UTC): 2026-04-24T18:42:06.530Z
Source Commit: c32c098

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

De eerstvolgende studiofase draait **niet** primair om brede rollout of live runtime-integratie.

De eerstvolgende studiofase draait om één kernvraag:

**Is een nieuwe promptversie aantoonbaar beter dan de huidige basis?**

Vanaf de strategische splitsing (20 april 2026) geldt aanvullend:

- AIQS prioriteert `Knowledge Hub`-fundering (source ingest, grounding, citations).
- AIQS ondersteunt publieke wedge-validatie op builders/podcasters.
- `Jarvis` blijft internal-only founderplatform en is geen publieke AIQS-productbelofte.

Daarom is de bindende prioriteit nu:

1. testen binnen de studio
2. vergelijkbaar valideren van kandidaat-output vs runtime-basis
3. source-aware evaluatie op grounding en citation-fidelity toevoegen
4. evaluatie-uitkomsten opslaan als bewijs
5. editor-ervaring en task-consistentie gelijktrekken
6. admin UX op desktop/fullscreen verbeteren zonder mobiel te breken
7. lifecycle, rollout, runtime-koppeling en live monitoring pas daarna verder uitbouwen

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

## 6. Huidige code-realiteit (status april

[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]

## Cline Workflow (excerpt)
# Cline workflow (operationeel)

## Doel

Operationele werkwijze voor werken met ChatGPT Projects + Cline, zonder productwaarheid te vervuilen.

## Execution OS (compact)

- Voor harde MVP-scope en uitvoerdiscipline: gebruik `.clinerules/workflows/budio-cline-execution-os.md`.
- Deze workflow blijft aanvullend en vervangt `AGENTS.md` of `docs/project/**` niet.

## Rolverdeling

- **ChatGPT Projects**: strategie, review en promptontwerp buiten repo-uitvoering.
- **Cline in VS Code**: repo-analyse, plan, wijzigingen, verify en commit.

## Bronnenvolgorde

1. `docs/project/README.md`
2. `AGENTS.md`
3. taakrelevante canonieke handmatige docs in `docs/project/**` (excl. `docs/project/generated/**` en `docs/project/archive/**`)
4. bij niet-triviale uitvoertaken: `docs/project/open-points.md` + relevante taskfile in `docs/project/25-tasks/**`
5. relevante skill(s) in `.agents/skills/**` wanneer de taak daar expliciet onder valt
6. `docs/dev/active-context.md` alleen wanneer recente sessiecontext of WIP relevant is

Regels:

- `docs/project/**` = canonieke projectwaarheid.
- `docs/project/25-tasks/**` = operationele taaklaag voor de huidige fase.
- `docs/dev/**` = workflowafspraken.
- `docs/project/generated/**` en `docs/design/generated/**` = generated output; geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- `docs/upload/chatgpt-project-context.md` is uitsluitend bedoeld als uploadbare bootstrap/startcontext voor ChatGPT Projects.
- `docs/upload/**` = generated uploadartefacten; geen repo-bron, geen agentbron, geen uitvoerbron voor Cline/Codex.
- Bij spanning tussen generated docs en canonieke docs zijn canonieke docs leidend.
- Bij spanning tussen `docs/upload/**` en canonieke docs zijn canonieke docs leidend.
- Geen "lees alles altijd"-regel; lees alleen taakrelevante bronnen.
- Scope-routing is context-first:
  - default-context: Budio app + AIQS
  - bepaal scope via intentie/formulering (doel, doelgroep, omgeving, planningimpact), niet alleen op keyword-match
  - routeer naar Jarvis/plugin-spoor zodra de intentie daar logisch op wijst, ook zonder expliciete termen
- Twijfelprotocol:
  - hoge-impact twijfel (planning, roadmap, idea/task-classificatie): eerst korte afstemming met de gebruiker
  - lage-impact twijfel: redelijke aanname doen en die expliciet labelen in plan/doc
- Strategie/planning wijzig je nooit stilzwijgend:
  - geen mutaties in `docs/project/10-strategy/**` of `docs/project/20-planning/**` zonder expliciete user-approval of expliciet overlegbesluit in dezelfde sessie
  - bij koerswijziging altijd eerst voorstel + impact + advies, daarna pas mutatie
- Voor Stitch-werk: gebruik `docs/dev/stitch-workflow.md` als operationele workflowbron.
- Voor idee-capture/promotie: gebruik `docs/dev/idea-lifecycle-workflow.md`.
- Voor taakaanmaak en statusflow: gebruik `docs/dev/task-lifecycle-workflow.md`.

## Design-implementatie guardrails (operationeel)

- `theme/tokens.ts` is de enige tokenbron; afgeleide configbestanden zijn niet leidend.
- Gebruik eerst bestaande shared primitives/patronen; voeg alleen een nieuw shared component toe bij een echt herhaalbaar patroon over meerdere schermen.
- UI assembly is scaffold-firs

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
- Gold is in principe voor **primaire C

[Excerpt truncated for compact generated handoff; use the source markdown for full screen-specific detail.]
