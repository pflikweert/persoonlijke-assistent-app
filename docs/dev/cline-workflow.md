---
title: Cline workflow
audience: agent
doc_type: workflow
source_role: operational
visual_profile: plain
upload_bundle: 80-budio-agent-workflow-and-docs-tooling.md
---

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
- `docs/project/24-epics/**` = operationele bundellaag voor groter werk boven tasks.
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
- Voor nieuwe uitvoerbare plans/tasks: maak de task spec-ready vóór bouwstart. Minimaal: user outcome, functional slice, entry/exit, happy flow, non-happy flows, UX/copy, data/IO, acceptance en verify.

## Design-implementatie guardrails (operationeel)

- `theme/tokens.ts` is de enige tokenbron; afgeleide configbestanden zijn niet leidend.
- Gebruik eerst bestaande shared primitives/patronen; voeg alleen een nieuw shared component toe bij een echt herhaalbaar patroon over meerdere schermen.
- UI assembly is scaffold-first: check eerst `components/ui/screen-scaffolds.tsx` en daarna pas screen-lokale opbouw.
- Volg bij UI-keuzes de beslisboom in `docs/dev/ui-assembly-decision-tree.md`.
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
  - taakworkflow: `docs/dev/task-lifecycle-workflow.md`
  - tijdelijke sessiecontext: `docs/dev/active-context.md`
  - statuswaarheid: `docs/project/current-status.md`
  - echte gaps/onzekerheden: `docs/project/open-points.md`
  - operationele epics/projectbundels: `docs/project/24-epics/**`
  - operationele taken: `docs/project/25-tasks/**`

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
- operationele uitvoeringstaken → `docs/project/25-tasks/**`

## Wanneer Plan mode

Gebruik Plan mode bij:

- bugs met onduidelijke oorzaak
- multi-file wijzigingen
- migraties
- taken met duidelijke scope-/architectuurrisico’s

Plan mode heft de taskfile-verplichting niet op:

- begin bij inhoudelijke repo-taken altijd met een bestaande of nieuw aangemaakte taskfile
- een inhoudelijk plan zonder concrete taskfile geldt als onvolledig
- noem in elk plan expliciet `Task`, `Task file` en `Status`

Extra repo-regel voor Plan Mode:

- gebruik in Plan Mode eerst een **bestaande** taskfile wanneer daar een duidelijke match voor is
- maak in Plan Mode bij duidelijke nieuwe scope automatisch een nieuwe task aan vanuit `_template.md`
- vraag alleen bij echte twijfel: meerdere plausibele tasks, onduidelijke scope-routing of onduidelijk task-vs-idea
- `Taskflow summary` mag dus ook een nieuw aangemaakte task noemen

## Wanneer Act mode

Gebruik Act mode voor:

- gerichte implementatie
- kleine fixes met duidelijke file-scope
- verify en afronding

## Promptpatronen

### Uitvoerblokken

- Cline/Codex bepaalt bij elke inhoudelijke taak zelf de efficiëntste blokken op basis van huidige agent/model, taaktype, risico, dirty worktree, verificatiekosten en afhankelijkheden.
- Vraag de gebruiker niet om fasering tenzij er een echte product-, planning- of architectuurtradeoff is.
- Default: preflight/context/taskflow -> kleinste bronwijziging -> gerichte verify -> docs/taskstatus/bundel afronden.
- Voor grotere docs/roadmaptaken: research -> template/workflow -> primair artefact -> bundel -> verify.

### Kleine fixes

- Houd input compact: doel + scope + files.
- Werk cheap-first: kleinste werkende wijziging.
- Geen scope-uitbreiding tijdens implementatie.

### Multi-file werk

- Begin met expliciete todo/checklist.
- Maak of vind vóór het plan eerst de taskfile.
- Gebruik bij groter gelinkt werk ook het relevante epic-doc als planningsanker wanneer dat bestaat.
- Splits in: lezen → plan → edits → verify.
- Werk per duidelijke milestone en update checklist tussendoor.
- Behandel het laatst besproken subprobleem nooit automatisch als de nieuwe hoofdscope.
- Leg bij niet-triviale taken het **oorspronkelijke plan / afgesproken scope** expliciet vast in de taskfile en houd die sectie stabiel tijdens uitvoering.
- Leg expliciete user-details met latere uitvoer- of reviewwaarde vast onder een aparte requirement-sectie in de taskfile; alleen een samenvatting is niet genoeg.
- Maak onderscheid tussen review-uitkomst en requirement-uitkomst: de taskfile moet niet alleen de conclusie bevatten, maar ook de concrete requirement-details waarop die conclusie rust.
- Als de gebruiker een bestaand uitgebreid plan of detailblok expliciet in de taskfile wil terugzien, moet dat bronblok als eigen sectie behouden blijven; een statusreview of samenvatting mag dat niet vervangen.
- Nieuwe P1/P2 bouwtaken of subtasks zijn pas bouwbaar wanneer ze zelfstandig uitvoerbaar zijn zonder sessiecontext; zet anders `spec_ready: false` en voeg eerst een hardeningstap toe.
- Leg latere regressies, polish of user-correcties vast als **toegevoegde verbeteringen tijdens uitvoering**, tenzij de gebruiker expliciet de hoofdscope wijzigt.
- Rond een taak pas af na een expliciete **plan reconciliation**: oorspronkelijk plan, later toegevoegd werk en resterende open punten moeten allemaal zichtbaar zijn.

## Verify-regel

- Voor relevante codewijzigingen: `npm run lint` en `npm run typecheck`.
- Voor canonieke docs-wijzigingen: ook `npm run docs:bundle` en `npm run docs:bundle:verify`.
- Draai `npm run docs:bundle` en `npm run docs:bundle:verify` altijd sequentieel, nooit parallel.
- Voor taskstatuswijzigingen of verplaatsing naar `done/`: ook `npm run docs:bundle` en `npm run docs:bundle:verify`.
- Voor inhoudelijke agentuitvoering (plan/research/bug/implementatie): ook `npm run taskflow:verify`.
- Commit alleen na geslaagde verify.

## ChatGPT Projects uploaddiscipline

- Dit is een uploadrichtlijn voor ChatGPT Projects, geen repo-uitvoerregel.
- Gebruik na de bootstrap alleen de kleinste relevante subset uit `docs/upload/00-budio-upload-manifest.md`.
- Upload niet standaard de volledige set.
- Bundelscript zet uploadbestanden klaar voor handmatige upload; upload naar ChatGPT gebeurt nu nog niet automatisch.
- `docs/upload/**` wordt beheerd als maximaal 10 uploadbestanden totaal; upload per ChatGPT Project-context alleen de kleinste relevante subset uit het manifest.
- Audience-metadata en Budio Terminal-regels staan in `docs/project/00-docs-governance/README.md`.
- Developer docs-tooling en Obsidian vault setup staan in `docs/setup/developer-docs-environment.md`.
- Budgetpolicy in ChatGPT Projects blijft licht; token/cost/runtime-discipline hoort in repo en AI-governance-docs.
- Session/multi-user/OpenAI-contextbeleid is nu alleen als later idee vastgelegd.

## VS Code plugin toepassen (verplicht)

- Bij wijzigingen in `tools/budio-workspace-vscode/**` altijd de plugin opnieuw toepassen op de normale VS Code-workspace.
- Standaardcommando in `tools/budio-workspace-vscode/`:
  - `npm run apply:workspace`
- Dit voert build + vsix package + lokale install + VS Code refresh uit in één flow.

## Supabase migratie-uitvoering (verplicht)

- Bij wijzigingen in `supabase/migrations/**` voert Cline/Codex de lokale DB-stap standaard zelf uit: `npx supabase db push --local` (of `npx supabase db reset` wanneer nodig).
- Ook wanneer een taak leunt op een **al bestaande maar lokaal nog niet toegepaste** migratie (bijv. nieuwe tabel/kolom ontbreekt in runtime), voert Cline/Codex alsnog direct `npx supabase db push --local` uit.
- Vraag deze stap niet terug aan de gebruiker als de CLI hem veilig non-interactief kan uitvoeren.

## Dev-server policy

- Start geen langlopende dev servers tenzij expliciet gevraagd.
- Gebruik voor deze repo `http://localhost:8081` als standaard lokale web dev/smoke-test target wanneer geen andere lokale webtarget is opgegeven.
- Gebruik geen `CI=1` prefix voor lokale dev-server commando’s.
- Als live server nodig is: geef alleen het handmatige commando aan de gebruiker.

## Repo-local Codex MCP (local AI development)

Gebruik voor deze repo standaard de lokale MCP-config in `.codex/config.toml`.

Default (veilig):

- `supabase_local` actief
- `supabase_remote_ro` uit

Switchflow:

- local activeren: `node scripts/codex-mcp-target.mjs local`
- remote/prod read-only activeren: `node scripts/codex-mcp-target.mjs remote-ro --project-ref <project_ref>`

Gebruik `supabase_remote_ro` alleen wanneer nodig voor:

- productiegerichte read-only diagnose
- metadata/log/context-checks die lokaal niet beschikbaar zijn

Gebruik `supabase_remote_ro` niet voor:

- schema- of datawrites
- reguliere lokale ontwikkeliteraties
- bulk inspecties als local/dev voldoende is

Agent-default:

- bij twijfel altijd `supabase_local`
- na remote-ro checks altijd terugzetten naar local

Voor productiebug-onderzoek:

- volg `docs/dev/production-bug-investigation-workflow.md`
- gebruik remote/prod alleen read-only voor logs, metadata en diagnosecontext
- leg timestamp, route en deployment/logbron vast zodra je productiebevindingen claimt

## Lessen uit sessies (stabiel, herbruikbaar)

- Bevestig bij onderbroken sessies altijd eerst de actuele file state (small read/diff) vóór nieuwe patches.
- Houd productwaarheid, toolingafspraken en uploadartefacten strikt gescheiden.
- Verhoog status/docs alleen met hard bewijs uit code, runtime of canonieke docs.
- Verwerk workflowlearnings in `AGENTS.md` of `docs/dev/**`, niet in productinhoud.

## Valkuilen om te vermijden

- Verder patchen op oude context na interrupties.
- Te brede patches zonder eerst klein te valideren waar de wijziging exact landt.
- `docs/upload/**` gebruiken als bron van waarheid.
- Productdocs vullen met operationele toolinguitleg.
- “Klaar” melden zonder volledige verify.
