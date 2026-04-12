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

---

## 1. Doel en positie

AI Quality Studio is een **admin-only AI quality en prompting governance tool**.

Doel:
- AI-output betrouwbaar verbeteren
- prompt- en modelwijzigingen beheersbaar maken
- testbaar en reproduceerbaar itereren op echte brondata
- runtime-gedrag later gecontroleerd uit code-baseline naar DB-live binding brengen

De studio is:
- task-first
- contract-first
- result-first
- server-side only

De studio is **geen**:
- end-user feature
- brede assistentlaag
- generieke AI per scherm
- vervanging van productkaders of contentcontracten

---

## 2. Scopekader

### In scope
- Werk per **AI-task**, niet per scherm
- Versioning per task
- Runtime-baseline import uit code
- Drafting en gecontroleerde model/prompt-editing
- Test runs met snapshots
- Vergelijking testoutput vs runtime-basis / live-output
- Handmatige review en rollout-governance
- Traceability per versie en run

### Buiten scope
- Client-side OpenAI calls
- End-user debug- of beheerfeatures
- Brede chat/coach/agent-ervaring
- Auto-optimalisatie als vervanging van menselijke review
- Runtime DB-binding zonder rollout- en rollbackpad

---

## 3. Canonieke ontwerpprincipes

1. **Contract-first**  
   Content contracts zijn leidend boven promptvrijheid.

2. **Task-first**  
   Beheer op AI-taken, niet op UI-schermen.

3. **Result-first**  
   Testresultaat, compare en evaluatie zijn primair; technische metadata is secundair.

4. **Server-side only**  
   API keys, modelcalls en runtime-execution blijven server-side.

5. **Traceability by default**  
   Input/prompt/model/output snapshots + request/flow context zijn standaard.

6. **Eerlijke representatie**  
   Toon expliciet wanneer een studio-task onderdeel is van een gedeelde runtime-family.

7. **Geen dubbele waarheid zonder transitieplan**  
   Als code en DB tijdelijk naast elkaar bestaan, moet de hiërarchie expliciet zijn.

---

## 4. Relatie met contentcontracten (bindend)

Volgt `docs/project/content-processing-rules.md`.

Kernscheiding:
- `entry_cleanup` ≠ samenvatting
- `entry_summary` ≠ volledige bronlaag
- `day_narrative` ≠ `day_summary`
- reflectiepunten ≠ advieslaag
- reflecties ≠ therapeutische interpretatie

Als output deze grenzen schendt, is dat een **kwaliteitsfout**, ongeacht modelscore of “mooier” taalgebruik.

---

## 5. Huidige code-realiteit (status april 2026)

Deze sectie beschrijft wat nu aantoonbaar gebouwd is.

### 5.1 Datamodel (aanwezig)
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
- oplopende versioning per task
- snapshotvelden voor test runs
- seed van 12 canonieke tasks

### 5.2 Edge function (aanwezig)
Function:
- `admin-ai-quality-studio`

Huidige acties:
- `access`
- `list_tasks`
- `get_task_detail`
- `import_runtime_baseline`
- `create_draft_version`
- `update_draft_version`
- `delete_draft_version`
- `list_test_sources`
- `run_test`
- `get_test_run`
- `get_compare_view`

Auth:
- allowlist + internal token patroon, server-side gehandhaafd

### 5.3 App-beheerlagen (aanwezig)
- task hub
- task detail / versions
- draft editor
- test / compare

### 5.5 Entry_cleanup contract-first editor (aanwezig)
- `entry_cleanup` volgt nu expliciet een contract-first editorstructuur:
  - **alleen taakinstructie bewerkbaar**
  - input/system/response/model contractlagen zichtbaar als read-only
- response-contract is object-based en zichtbaar als:
  - `title: string`
  - `body: string`
  - `summary_short: string`
- systemcontract is compact gehouden op niet-vrije grenzen:
  - alleen opgegeven bronvelden gebruiken
  - alleen JSON volgens contract retourneren
  - field-level contractgrenzen blijven technisch afgedwongen
- baseline metadata blijft zichtbaar maar read-only, en geen primaire bewerklaag.

### 5.6 Admin detail-shell polish (aanwezig)
- gedeelde admin topnavigatie is visueel en technisch gecentreerd en navigation-only gebleven.
- gedeelde sticky action footer is nu een compact, herbruikbaar admin pattern met duidelijke hiërarchie:
  - primary
  - secondary
  - tertiary (quiet/destructive)
- patroon is toegepast op AIQS detailschermen zonder runtime- of contractscope uit te breiden.

### 5.4 Runtime-baseline model (aanwezig, transitie)
- Runtime-definities worden nu opgebouwd vanuit code
- Baseline import schrijft deze als `live` naar studio-DB
- Runtime zelf leest nog niet uit studio-DB

**Conclusie:** huidige model is een bruikbare overgangsarchitectuur, geen eindarchitectuur.

---

## 6. Editor abstraction (bindend)

De studio bewerkt **taakinstructies**, niet ruwe request/payload blobs.

### Bindende scheiding
Elke bewerkbare taskversie bestaat conceptueel uit deze lagen:

1. **Taakinstructie**
   - primaire bewerklaag
   - gewone tekst
   - gericht op wat deze task moet doen

2. **Vaste regels / system instructions**
   - stabielere systeemlaag
   - zelden aangepast
   - standaard secundair of advanced

3. **Input template / mapping**
   - technische request assembly
   - placeholders, bronvelden, mappinglogica
   - niet dominant in de hoofd-editor

4. **Output contract / schema**
   - beschrijft verwachte output
   - hoort bij de task of runtime-family

5. **Model- en configlaag**
   - modelkeuze
   - temperature / response_format / andere toegestane parameters

### Bindende UI-regel
De hoofd-editor toont:
- taakinstructie
- taskdoel
- model
- contract notice
- versiecontext

De hoofd-editor toont **niet**:
- volledige request payloads
- raw placeholders als hoofdinhoud
- baseline metadata als primaire bewerklaag

---

## 7. Task composition model

Niet elke studio-task is een volledig losse runtime prompt.

Daarom moet elke task conceptueel deze velden hebben:
- `runtime_family`
- `composition_role`: `standalone | compound_member`
- `managed_output_field`
- `affected_output_fields`

### Voorbeelden
- `entry_cleanup`
  - runtime_family: `entry_normalization`
  - composition_role: `compound_member`
  - managed_output_field: `body`
- `entry_summary`
  - runtime_family: `entry_normalization`
  - composition_role: `compound_member`
  - managed_output_field: `summary_short`
- `day_narrative`
  - runtime_family: `day_journal`
  - composition_role: `compound_member`
  - managed_output_field: `narrativeText`
- `day_summary`
  - runtime_family: `day_journal`
  - composition_role: `compound_member`
  - managed_output_field: `summary`
- week/month tasks
  - runtime_family: `reflection`
  - composition_role: meestal `compound_member`

### Bindende representatieregel
Als een task onderdeel is van een gedeelde runtime-family:
- toon dat expliciet
- toon ook wat die wijziging beïnvloedt
- doe niet alsof het een volledig autonome prompt is als dat niet zo is

---

## 8. Output discipline

### Richting
Waar output gestructureerd moet zijn, is **Structured Outputs / JSON Schema** de voorkeursrichting.

### Regels
- outputtype expliciet vastleggen:
  - `text`
  - `object`
  - `list`
  - `compound`
- schema hoort bij task of runtime-family, niet als los prompthulpstuk
- JSON mode is alleen acceptabel als compat-layer of tijdelijke fallback
- task-scherm, instructie en schema mogen elkaar niet tegenspreken

### Voorbeeld
Als `day_narrative` in studio één output representeert, dan moet:
- het scherm dat eerlijk tonen
- het schema dat ondersteunen
- of expliciet zichtbaar zijn dat het onderdeel is van een compound runtime-family

---

## 9. Model policy

### Productie
- productie gebruikt **pinned model snapshots**
- geen vrije modelkeuze in runtime
- modelupgrade is een rollout-beslissing, geen gewone promptedit

### Studio
- modelkeuze in studio gebeurt via **allowlist**, niet vrije tekst
- alleen goedgekeurde modellen zijn testbaar
- modelwijziging moet zichtbaar meeversien

### Logging
Elke test run en latere runtime write moet minimaal vastleggen:
- model
- versie / snapshot
- relevante config

---

## 10. Runtime-baseline import en tijdelijke dubbele waarheid

### Huidige overgangsregel
De studio gebruikt nu een **runtime baseline import** uit code:
- code blijft runtime source-of-truth
- studio importeert een mirror naar `ai_task_versions`
- drafts starten vanuit deze runtime-basis

### Bindende regels
- runtime-baseline import mag nooit stil bestaande afwijkende live versies overschrijven
- conflicts moeten expliciet worden gerapporteerd
- baseline metadata moet zichtbaar maken:
  - `baseline_source`
  - `runtime_flow`
  - `derived_from_shared_flow`
  - `output_field`

### Doel
De studio moet een geloofwaardige live-basis tonen zonder productie al DB-driven te maken.

---

## 11. Evaluation architecture

Evaluatie gebeurt in 4 lagen, in vaste volgorde.

### Laag 1 — Contract checks
Hard rules, bijvoorbeeld:
- entry_cleanup mag niet samenvatten
- day_summary moet compacter zijn dan day_narrative
- reflectiepunten mogen geen advieslaag worden
- min/max items
- schema validatie
- verboden taal / verboden meta-zinnen

### Laag 2 — Pairwise compare
Standaard menselijke vergelijking tussen:
- live basis / huidige productie-uitkomst
- draft / candidate output

Labels:
- `beter`
- `gelijk`
- `slechter`
- `fout`

### Laag 3 — Curated regression sets
Voor elke belangrijke task geleidelijk opbouwen:
- goldens
- edge cases
- noisy input
- dunne bron
- duplicate-heavy dag
- lange persoonlijke dag
- afwijkende talen / rare input

### Laag 4 — Automated graders
Pas later toevoegen.

Regels:
- nooit de enige bron van waarheid
- pas ná curated regressiesets
- alleen ondersteunend aan contract checks + human review

---

## 12. Human review protocol

### Standaardreview
De default reviewvorm is **pairwise**:
- live / runtime-basis vs draft/candidate

### Labels
- `beter`
- `gelijk`
- `slechter`
- `fout`

### Verplichtingen
- note verplicht bij `slechter` of `fout`
- review gebeurt op compacte rubric, niet op los gevoel

### Rubric
Minimaal beoordelen op:
- contracttrouw
- natuurlijkheid
- helderheid
- volledigheid
- compactheid waar relevant

---

## 13. Source selection rules

Bronselectie is onderdeel van kwaliteit, niet alleen een UI-detail.

### Regels
- testdata moet representatief zijn
- default sortering: recent + bruikbaar
- fallback/lege records mogen niet dominant zijn
- noisy cases mogen zichtbaar zijn, maar duidelijk herkenbaar
- bronselectie moet compacte preview + zoek/filter ondersteunen

### Richting
Latere fase:
- curated saved cases
- goldens
- regressiesets per task

---

## 14. Version lifecycle governance

### Gewenste lifecycle
- `draft`
- `candidate`
- `approved`
- `live`
- `archived`
- optioneel `shadow`

### Governance-regels
- promote naar live alleen na voldoende evidence
- rollbackpad moet bestaan vóór runtime DB-binding
- modelwijzigingen en promptwijzigingen horen in dezelfde lifecycle-governance

### Evidence voor promote (richtlijn)
Minimaal:
- contract checks passeren
- pairwise review uitgevoerd
- relevante curated cases gecontroleerd

---

## 15. Prompt registry readiness

De studio moet compatibel blijven met een centrale prompt registry of prompt object model.

### Regels
Promptstructuur moet logisch opgesplitst blijven in:
- instruction
- system
- input template
- output schema
- config

### Verboden richting
- monolithische request blobs als enige bewerkbare eenheid
- prompttekst waarin payload assembly, placeholders en taakdoel door elkaar lopen

---

## 16. Execution-modi

1. **Single interactive call**
   - 1 task, 1 versie, 1 bron

2. **Curated batch evaluation**
   - 1 task, 1 versie, N cases

3. **Production-derived shadow batch**
   - echte bronnen, geen canonieke write

4. **Live regeneration batch**
   - gecontroleerde herberekening na rollout

---

## 17. Prompt caching (vooruitblik)

Nog niet leidend voor implementatie, wel bindend als technische richting.

### Regels
- vaste delen vroeg in prompt
- variabele input later in prompt
- prefixstabiliteit is gewenst

### Doel
- lagere latency
- lagere kosten
- stabielere uitvoering bij herhaling

---

## 18. Runtime-koppeling en lineage

Elke latere runtime-write moet versie-lineage dragen.

Doel:
- reproduceerbaarheid
- impactanalyse
- rollback
- veilige regeneration

Minimaal te koppelen:
- `task_version`
- `requestId`
- `flowId`
- `source_type / source_record_id`
- `target_table / target_record_id`

`ai_live_generation_log` is hiervoor de structurele richting, niet alleen debug-data.

---

## 19. Bekende beperkingen (huidige fase)

Niet volledig aanwezig:
- promote-to-live workflow
- rollback flow
- reviewer labeling flow in UI
- batch test runs / regressiesets
- volledige compare-ondersteuning voor alle taskkeys
- directe DB-live binding voor productie-runtime

---

## 20. Learnings uit de bouwsessie (gestandaardiseerd)

1. Bewerk op **taakinstructie**, niet op payload/request blob.
2. Modelkeuze moet gecontroleerd zijn, niet vrije tekst.
3. Advanced moet gegroepeerd blijven:
   - Vaste regels
   - Outputvorm
   - Modelinstellingen
   - Technische herkomst
4. Baseline metadata is zichtbaar maar niet bewerkdominant.
5. Compound tasks moeten expliciet tonen wat ze beïnvloeden.
6. Editor, detail en test zijn verschillende modi en horen niet op één scherm gepropt.
7. Bronselectie is onderdeel van kwaliteit; slechte selectie ondermijnt evaluatie.
8. Testscherm moet editor-taal volgen:
   - runtime-basis
   - testresultaat
   - verschil met live

---

## 21. Valkuilen (expliciet)

1. Task/scherm-verwarring
2. Compound-runtime verbergen als single output
3. Dubbele waarheid tussen code en DB zonder transitieplan
4. Promptedits zonder contractguardrails
5. Alleen line-diff gebruiken als kwaliteitsbewijs
6. Te vroege automation zonder curated regressiesets
7. Product-visible debugdrift buiten admincontext
8. Runtimekoppeling zonder rollbackpad
9. Payload-editing vermommen als promptbeheer

---

## 22. Prioriteitenvolgorde (advies)

1. Stabiliseer **editor abstraction + task semantiek**
2. Voltooi **review protocol + version governance**
3. Voeg **curated regression sets + batch evals** toe
4. Verbind **runtime writes met lineage**
5. Schakel gecontroleerd naar **DB-live binding**
6. Open daarna pas verdere model-upgrades en automation

---

## 23. Samenvatting

AI Quality Studio is nu een werkende admin-hardening basis met:
- taskbeheer
- baseline import
- drafting
- single-run testen
- compare

De volgende volwassen stap is niet meer UI-volume, maar:
- bindende editor-abstraction
- expliciete task-compositie
- evaluatie-architectuur
- lifecycle governance
- runtime-lineage
- en daarna pas gecontroleerde DB-live binding

Zo blijft de studio:
- contractvast
- reproduceerbaar
- beheersbaar voor admins
- veilig richting echte runtime-koppeling
