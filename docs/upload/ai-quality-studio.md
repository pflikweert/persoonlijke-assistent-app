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
- oplopende versioning per task
- snapshotvelden voor test runs
- seed van 12 canonieke tasks

### 6.2 Edge function (aanwezig)
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

### 6.3 App-beheerlagen (aanwezig)
- task hub
- task detail / versions
- draft editor
- test / compare

### 6.4 Entry_cleanup contract-first editor (aanwezig, maar voor op generieke editorlaag)
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
- baseline metadata blijft zichtbaar maar read-only, en geen primaire bewerklaag

**Belangrijke conclusie:** `entry_cleanup` is nu inhoudelijk sterker dan de rest van de editors. Dat is goed voor die task, maar nog geen uniforme studio-abstraction.

### 6.5 Admin detail-shell polish (aanwezig, maar desktop-ervaring nog niet goed genoeg)
- gedeelde admin topnavigatie is visueel en technisch gecentreerd en navigation-only gebleven
- gedeelde sticky action footer is nu een compact, herbruikbaar admin pattern met duidelijke hiërarchie:
  - primary
  - secondary
  - tertiary (quiet/destructive)
- patroon is toegepast op AIQS detailschermen zonder runtime- of contractscope uit te breiden

**Belangrijke conclusie:** huidige adminschermen zijn nog te veel als mobiele breedte gefixeerd, ook op desktop. Dat beperkt de studio-waarde op grotere schermen en fullscreen gebruik.

### 6.5b Prompt Assist in draft editor (`entry_cleanup`) (aanwezig, beperkte scope)
- prompt assist draait admin-only binnen de bestaande draft editorlaag
- assist is task-first en contract-first:
  - analyse gebruikt volledige promptcontext (`system rules`, `general instruction`, `field rules`, outputcontract, taskmetadata)
  - rewrite/apply blijft per run beperkt tot één expliciet gekozen targetlaag
- server-side previewactie aanwezig (`prompt_assist_preview`) met typed payload/result
- UI blijft diff/apply-georiënteerd en vermijdt brede chatervaring

**Belangrijke conclusie:** assist is bewust een lokale editor-hardening en geen autonome prompt-optimizer of generieke chatlaag.

### 6.6 Runtime-baseline model (aanwezig, transitie)
- runtime-definities worden nu opgebouwd vanuit code
- baseline import schrijft deze als `live` naar studio-DB
- runtime zelf leest nog niet uit studio-DB

**Conclusie:** huidige model is een bruikbare overgangsarchitectuur, geen eindarchitectuur. Live beoordeling en rollout moeten daarom nog niet de primaire studiofocus zijn.

---

## 7. Eerstvolgende fase: wat het product nú moet oplossen

De studio moet in de volgende bouwstap vooral deze dingen beter maken:

1. ik kan een draftprompt wijzigen
2. ik kan die op goede testbronnen draaien
3. ik zie output naast de runtime-basis
4. ik kan expliciet vastleggen of die beter, gelijk, slechter of fout is
5. ik kan die uitkomst later terugvinden per task, versie en case

Zolang dit niet stevig staat, zijn de volgende zaken **te vroeg als hoofdfocus**:
- live production review
- rollout-gates tot in detail
- runtime DB-binding
- kwaliteitsdashboard als eindlaag

---

## 8. Editor abstraction (bindend)

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

### Aanscherping voor de volgende fase
De `entry_cleanup` editor is de referentie voor de volgende editorronde.

Dat betekent:
- andere edit-schermen moeten hier conceptueel naartoe convergeren
- hardcoded afwijkingen per task moeten worden afgebouwd
- gedeelde editorprimitives moeten task-compatibel worden, niet alleen `entry_cleanup`-specifiek
- waar taakverschillen echt nodig zijn, moeten die via task-metadata of config verklaard worden, niet via verborgen UI-afwijkingen

---

## 9. Task composition model

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
  - managed_output_field: `title/body/summary_short` (compound)
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

## 10. Output discipline

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

## 11. Model policy

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

## 12. Runtime-baseline import en tijdelijke dubbele waarheid

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

### Strategische aanscherping
Zolang runtime nog hardcoded is en niet versiegestuurd uit de studio leest:
- blijft testvalidatie belangrijker dan live-review tooling
- blijft compare tegen runtime-basis voldoende voor de eerstvolgende fase
- blijven live-resultaten, reviewer queues en runtime dashboards een latere laag

---

## 13. Evaluation architecture (aangescherpt)

Evaluatie gebeurt in lagen, in vaste volgorde.

### Laag 1 — Contract checks
Hard rules, bijvoorbeeld:
- `entry_cleanup` mag niet samenvatten
- `day_summary` moet compacter zijn dan `day_narrative`
- reflectiepunten mogen geen advieslaag worden
- min/max items
- schema validatie
- verboden taal / verboden meta-zinnen

### Laag 2 — Pairwise compare
Standaard menselijke vergelijking tussen:
- runtime-basis / huidige productie-uitkomst
- draft / candidate output

Labels:
- `beter`
- `gelijk`
- `slechter`
- `fout`

### Laag 3 — Evaluation result opslag
Pairwise compare en contractuitkomsten mogen niet alleen tijdelijke UI-output zijn.

Per run/case/versie moet de studio evaluatie-uitkomsten structureel kunnen opslaan, zodat zichtbaar wordt:
- welke versie beter scoort
- welke cases regressies tonen
- welke fouten terugkomen
- welke review al gedaan is

**Bindende richting:** evaluatie wordt een first-class objectlaag, niet alleen een schermactie.

### Laag 4 — Curated regression sets
Voor elke belangrijke task geleidelijk opbouwen:
- goldens
- edge cases
- noisy input
- dunne bron
- duplicate-heavy dag
- lange persoonlijke dag
- afwijkende talen / rare input

### Laag 5 — Automated graders
Pas later toevoegen.

Regels:
- nooit de enige bron van waarheid
- pas ná curated regressiesets
- alleen ondersteunend aan contract checks + human review

---

## 14. Evaluation object model (nieuwe bindende richting)

De studio heeft een expliciete evaluatie-objectlaag nodig.

Minimale richting:
- evaluatie hoort bij task
- evaluatie hoort bij taskversion
- evaluatie hoort bij testcase of testbron
- evaluatie hoort bij een specifieke run
- evaluatie kan contractmatig, handmatig en later geautomatiseerd zijn

### Minimale veldenrichting
- `task_id`
- `task_version_id`
- `test_run_id`
- `test_case_id` of bronreferentie
- `evaluator_type` (`contract`, `human`, later optioneel `auto`)
- `result_label` (`beter`, `gelijk`, `slechter`, `fout`, of contractstatus)
- `score` of compacte scorevelden waar zinvol
- `notes`
- `created_at`
- reviewer / actor waar relevant

### Waarom dit bindend is
Zonder evaluatie-objectlaag blijft de studio goed in testen, maar zwak in kwaliteitsbewijs.

---

## 15. Human review protocol

### Standaardreview
De default reviewvorm is **pairwise**:
- runtime-basis vs draft/candidate

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

### Aanscherping
De reviewactie moet opslaan als bewijslaag en niet alleen in de compare-UI blijven hangen.

---

## 16. Source selection rules

Bronselectie is onderdeel van kwaliteit, niet alleen een UI-detail.

### Regels
- testdata moet representatief zijn
- default sortering: recent + bruikbaar
- fallback/lege records mogen niet dominant zijn
- noisy cases mogen zichtbaar zijn, maar duidelijk herkenbaar
- bronselectie moet compacte preview + zoek/filter ondersteunen

### Richting
Volgende fase:
- curated saved cases
- goldens
- regressiesets per task
- snelle herbruikbare testsets per taskversie

---

## 17. Version lifecycle governance

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

### Aanscherping voor huidige fase
Deze lifecycle blijft bindende richting, maar is **niet** de eerstvolgende bouwfocus. Eerst moet test- en validatiebewijs in de studio zelf stevig staan.

---

## 18. Prompt registry readiness

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

## 19. Execution-modi

1. **Single interactive call**
   - 1 task, 1 versie, 1 bron

2. **Curated batch evaluation**
   - 1 task, 1 versie, N cases

3. **Production-derived shadow batch**
   - echte bronnen, geen canonieke write

4. **Live regeneration batch**
   - gecontroleerde herberekening na rollout

### Aanscherping
Voor de volgende fase is de kernvolgorde:
- eerst single interactive goed
- daarna curated batch evaluation
- production-derived en live regeneration pas later zwaarder uitwerken

---

## 20. Prompt caching (vooruitblik)

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

## 21. Runtime-koppeling en lineage

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

### Aanscherping
Dit blijft belangrijk, maar is **niet** de eerstvolgende prioriteit zolang runtime nog niet DB-live uit de studio leest.

---

## 22. Admin UX-principes (nieuw bindend)

AI Quality Studio is een admin-tool en mag daarom anders werken dan de eindgebruikersapp.

### Regels
- mobiel moet goed bruikbaar blijven
- desktop mag niet kunstmatig klein blijven
- fullscreen gebruik op desktop moet actief ondersteund worden
- editor, compare en review zijn productieve werkmodi en verdienen ruimte
- detailschermen mogen op grotere schermen werken met bredere layouts, kolommen of split views waar functioneel zinvol
- behoud duidelijke hiërarchie en focus; geen generieke enterprise-zwaarte

### Concreet betekent dit
- task detail en draft editor mogen op desktop breder openen dan de app-shell
- compare-views mogen naast elkaar staan op grotere schermen
- testresultaten en contractnotices mogen op desktop zichtbaar zijn zonder overmatig scrollen
- sticky action areas moeten goed werken op mobiel én desktop
- fullscreen mag gebruikt worden voor productiviteit, niet alleen voor esthetiek

### Niet doen
- admin 1-op-1 behandelen als consumentenscherm
- alles centreren in een smalle mobile-column op grote schermen
- desktop oplossen met alleen grotere marges zonder informatiearchitectuur aan te passen

---

## 23. Bekende beperkingen (huidige fase)

Niet volledig aanwezig:
- promote-to-live workflow
- rollback flow
- reviewer labeling flow in UI als persistente bewijslaag
- batch test runs / regressiesets als volwaardige productlaag
- volledige compare-ondersteuning voor alle taskkeys
- directe DB-live binding voor productie-runtime
- uniforme editor-abstraction over alle tasks heen
- volwaardige desktop/fullscreen admin-ervaring
- kwaliteitsdashboard met echte aggregatie en trendweergave

---

## 24. Learnings uit de bouwsessie (gestandaardiseerd)

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
9. Goede studio-UX is niet alleen mobiel; adminwerk vraagt ook desktopruimte.
10. Een compare-view zonder opgeslagen oordeel is nog geen volwaardig kwaliteitsbewijs.

---

## 25. Valkuilen (expliciet)

1. Task/scherm-verwarring
2. Compound-runtime verbergen als single output
3. Dubbele waarheid tussen code en DB zonder transitieplan
4. Promptedits zonder contractguardrails
5. Alleen line-diff gebruiken als kwaliteitsbewijs
6. Te vroege automation zonder curated regressiesets
7. Product-visible debugdrift buiten admincontext
8. Runtimekoppeling zonder rollbackpad
9. Payload-editing vermommen als promptbeheer
10. Een dashboard bouwen voordat evaluatie als dataset bestaat
11. Desktop “oplossen” door alleen containerbreedte aan te passen zonder workflowverbetering

---

## 26. Prioriteitenvolgorde (bindend advies)

### Fase A — Nu eerst bouwen
1. **Testen en valideren binnen de tool als primaire lus**
   - draft wijzigen
   - bron kiezen
   - run uitvoeren
   - output vergelijken met runtime-basis
   - expliciet oordeel vastleggen

2. **Evaluation objectlaag toevoegen**
   - contractresultaten + menselijke compare-uitkomst opslaan per run/case/versie
   - vergelijking niet alleen tonen, maar ook bewaren

3. **Editor abstraction gelijktrekken over tasks heen**
   - `entry_cleanup` als referentie
   - hardcoded afwijkingen afbouwen
   - gedeelde edit-patterns en task-compatibele configuratie verstevigen

4. **Admin UX voor desktop/fullscreen verbeteren**
   - bredere detail/editor layouts
   - compare beter naast elkaar op groot scherm
   - mobiel niet breken

### Fase B — Daarna uitbreiden
5. **Curated testsets / regressiesets per task**
   - saved cases
   - goldens
   - edge/noisy cases
   - batch evals

6. **Version governance verder dichtzetten**
   - candidate / approved / live beter afbakenen
   - promote-evidence expliciet tonen

### Fase C — Pas daarna
7. **Runtime lineage en DB-live binding verder uitwerken**
   - pas na sterke test/evidence-lus

8. **Live testen/resultaten/beoordelingen toevoegen**
   - pas wanneer runtime daadwerkelijk zinnig koppelbaar is aan task versions uit de studio

### Fase D — Als laatste
9. **Kwaliteitsdashboard bouwen**
   - pas bouwen wanneer er echte evaluatiedata, trends en aggregaties zijn
   - dashboard is eindlaag, niet startpunt

---

## 27. Concrete next steps om nu te bouwen

### Stap 1 — Compare en validatie echt afmaken
Doel:
- in de studio aantoonbaar kunnen zeggen of een draft beter is dan de basis

Bouwen:
- compare-view afronden als primaire werkmodus
- expliciete reviewactie inbouwen: `beter`, `gelijk`, `slechter`, `fout`
- verplichte notitie bij `slechter` of `fout`
- contract checks zichtbaar in dezelfde evaluatieflow

Nog niet bouwen:
- zware live dashboards
- rollout automation

### Stap 2 — Evaluation results persistent maken
Doel:
- evaluatie wordt bewijslaag

Bouwen:
- opslagmodel voor evaluatie-uitkomsten
- koppeling aan task, versie, run en case
- historisch terugvindbare beoordelingen
- simpele aggregaties per versie: pass/fail, beter/gelijk/slechter/fout

Nog niet bouwen:
- complexe auto graders
- brede analyticslaag

### Stap 3 — Editors gelijktrekken
Doel:
- `entry_cleanup` niet als uitzondering laten bestaan

Bouwen:
- audit van alle bestaande prompt-editschermen
- bepalen wat nog hardcoded of task-specifiek is
- gedeelde editor-secties harmoniseren:
  - taakinstructie
  - system/advanced
  - input mapping
  - output contract
  - model/config
- task-metadata gebruiken waar taakverschillen echt bestaan

Nog niet bouwen:
- vrije payload editors
- raw JSON blob editing als hoofdmodus

### Stap 4 — Admin desktop/fullscreen UX verbeteren
Doel:
- AIQS wordt op desktop daadwerkelijk prettiger en sneller om mee te werken

Bouwen:
- bredere layoutregels voor admin
- detail/editor/test schermen geschikt maken voor grotere schermen
- split of multi-column waar compare dat ondersteunt
- sticky action footer aanpassen waar nodig voor desktop
- fullscreen als ondersteunde werkmodus behandelen

Nog niet bouwen:
- designpolish zonder workflowverbetering

### Stap 5 — Curated testsets en batch evaluatie
Doel:
- minder handmatig dezelfde cases zoeken

Bouwen:
- saved cases
- golden/edge/noisy labels
- N-case batch runs per task/version
- regressie-indicatie op dezelfde set

Nog niet bouwen:
- live beoordelingsqueues op productie-output

### Stap 6 — Pas later runtime/live en dashboard
Doel:
- pas toevoegen wanneer de onderlaag klopt

Later bouwen:
- runtime-koppeling aan echte studio versions
- live result reviews
- reviewer queues op productie-output
- kwaliteitstrends over live verkeer
- dashboard bovenop echte evaluatiedata

---

## 28. Samenvatting

AI Quality Studio is nu een werkende admin-hardening basis met:
- taskbeheer
- baseline import
- drafting
- single-run testen
- compare

De volgende volwassen stap is **niet** meer UI-volume of direct live runtimebeheer.

De volgende volwassen stap is:
- aantoonbaar testen in de tool
- evaluatie-uitkomsten opslaan als bewijs
- editors gelijktrekken
- admin desktop/fullscreen bruikbaar maken
- daarna pas regressiesets, lifecycle-verdieping, runtime-lineage en live-kwaliteit

Zo blijft de studio:
- contractvast
- reproduceerbaar
- beheersbaar voor admins
- eerlijk over wat nu al werkt en wat nog niet
- gericht op echte kwaliteitsverbetering in plaats van tool-uitbreiding

---

## 29. Recente regressie-learnings (bindend)

Doel: voorkomen dat dezelfde regressies terugkomen in AIQS editor- en admin-access flows.

### 29.1 Access-state mag geen netwerkfout als “geen toegang” framen

Regel:
- `adminAccess=false` mag alleen bij expliciete auth-codes (`AUTH_UNAUTHORIZED` of `AUTH_MISSING`).
- Generieke load/invoke/netwerkfouten blijven een laadfout, geen autorisatie-uitkomst.

Waarom:
- anders ontstaat false-negative “Geen toegang” voor echte allowlisted admins.

### 29.2 Allowlist parsing moet robuust zijn voor gequote env-waarden

Regel:
- allowlist parsing in edge functions moet omringende quotes strippen op bron- én itemniveau.

Waarom:
- lokale `.env.local` waarden staan vaak als `"uuid"`; zonder quote-strip faalt user-id match en krijg je onterechte `Forbidden`.

### 29.3 Prompt-editor normalisatie moet editor-overstijgend consistent zijn

Regel:
- newline/paragraph normalisatie moet identiek blijven tussen visual editor en sectieparsering.
- sectiewissels mogen geen “lege regel migratie” veroorzaken.

Waarom:
- inconsistente representatie (lege regels direct toevoegen vs buffered toepassen) veroorzaakt drift: regel weg in editor A, lege regel terug in editor B.

### 29.4 UI-regel voor deze editor

Regel:
- “Gebruikte tokens” hulpblok is verwijderd uit de editor-surface.
- editor-surface blijft licht/thematisch leesbaar in dark mode.

Waarom:
- minder visuele ruis, minder dubbelheid, en stabiel contrast voor tekstbewerking.
