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
- taken met duidelijke scope-/architectuurrisico’s

## Wanneer Act mode
Gebruik Act mode voor:
- gerichte implementatie
- kleine fixes met duidelijke file-scope
- verify en afronding

## Promptpatronen

### Kleine fixes
- Houd input compact: doel + scope + files.
- Werk cheap-first: kleinste werkende wijziging.
- Geen scope-uitbreiding tijdens implementatie.

### Multi-file werk
- Begin met expliciete todo/checklist.
- Splits in: lezen → plan → edits → verify.
- Werk per duidelijke milestone en update checklist tussendoor.

## Verify-regel
- Voor relevante codewijzigingen: `npm run lint` en `npm run typecheck`.
- Voor canonieke docs-wijzigingen: ook `npm run docs:bundle` en `npm run docs:bundle:verify`.
- Commit alleen na geslaagde verify.

## Dev-server policy
- Start geen langlopende dev servers tenzij expliciet gevraagd.
- Gebruik geen `CI=1` prefix voor lokale dev-server commando’s.
- Als live server nodig is: geef alleen het handmatige commando aan de gebruiker.

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
