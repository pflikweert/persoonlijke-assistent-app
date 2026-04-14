# Projectdocs — Waarheidshiërarchie

Deze map bevat de actieve projectwaarheid voor scope, richting en status.

## 1) Canonieke handmatige documenten (leidend)
1. `docs/project/master-project.md`
2. `docs/project/product-vision-mvp.md`
3. `docs/project/current-status.md`
4. `docs/project/open-points.md`
5. `docs/project/content-processing-rules.md`
6. `docs/project/copy-instructions.md`
7. `docs/project/ai-quality-studio.md`

Aanvulling:
- `docs/project/ai-quality-studio.md` is de centrale AI governance-laag voor AI-gedrag, promptbeheer en evaluatie.

## 2) Generated documenten (afgeleid, niet leidend)
- `docs/project/generated/chatgpt-project-context.md`
- `docs/design/generated/stitch-design-context.md`
- `docs/upload/**`

Regel:
- handmatige docs zijn de bron
- generated docs zijn afgeleide output
- `docs/upload/**` is alleen bedoeld als kant-en-klare uploadset voor de gebruiker; agents gebruiken deze map niet als canonieke bron

## 3) Archive-only (niet leidend)
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/archive/**`

## 4) Standaard upload naar ChatGPT Project / Stitch
Upload standaard de bestanden uit `docs/upload/`:
1. `docs/upload/chatgpt-project-context.md`
2. `docs/upload/ai-quality-studio.md`
3. `docs/upload/cline-workflow.md`
4. `docs/upload/stitch-workflow.md`
5. `docs/upload/mvp-design-spec-1.2.1.md`
6. `docs/upload/stitch-design-context.md`
7. `docs/upload/upload-manifest.md`

Reden:
- de bundle bevat compacte projectcontext
- AI Quality Studio governance wordt als canonieke upload-copy apart meegenomen
- Cline workflow-afspraken staan als aparte upload-copy klaar voor uitvoeringscontext
- Stitch-workflow-afspraken staan als aparte upload-copy klaar voor Stitch/ChatGPT handoff
- de design spec blijft apart leidend voor MVP-designbesluiten
- de Stitch design context bevat compacte design-handoff zonder alle docs te dupliceren
- het manifest maakt de uploadset controleerbaar

## 5) Wat je normaal niet hoeft te uploaden
- `docs/project/archive/**`
- `docs/design/archive/**`
- `docs/dev/**`
- setup/run-notities zonder canonieke productwaarheid

## 6) Onderhoudsflow
1. Werk eerst de handmatige canonieke docs bij.
2. Draai `npm run docs:bundle`.
3. Controleer met `npm run docs:bundle:verify`.
4. Commit canonieke docs + generated output samen.

## 7) Werken met ChatGPT Projects + Cline
- **ChatGPT Projects**: strategie, review en promptontwerp buiten repo-uitvoering.
- **Cline in VS Code**: repo-analyse, plan, wijzigingen, verify en commit.
- Leidende waarheid voor product/scope/status staat in `docs/project/**`.
- `AGENTS.md` + `.clinerules` zijn leidend voor werkwijze tijdens uitvoering.
- Skills gebruik je alleen wanneer een taak duidelijk in een bestaande skillflow valt.
- `docs/upload/**` blijft uploadartefact (generated), geen canonieke agentbron.
- Bij wijzigingen aan canonieke docs: altijd bundlen + verify (`npm run docs:bundle` en `npm run docs:bundle:verify`).
- Sessielearnings horen in:
  - `AGENTS.md` voor always-on repo-regels
  - `docs/dev/**` voor operationele workflowafspraken
  - `docs/project/current-status.md` alleen voor bewijsbare statusrealiteit
  - niet in productdocs als toolingsruis

## 8) Repo-eigen Memory Bank (workflow, geen extra waarheid)
Deze repo gebruikt een lichte memory-bank workflow als uitvoerhulp, zonder tweede waarheidshiërarchie.

Relatie tussen lagen:
- `docs/project/**` = canonieke waarheid (product/scope/status)
- `AGENTS.md` = always-on uitvoerregels
- `.agents/skills/**` = taak-/domeinspecifieke herhaalpatronen
- `docs/dev/cline-workflow.md` = operationele Cline-werkwijze
- `docs/dev/memory-bank.md` = memory-bank principes en update-regels
- `docs/dev/active-context.md` = tijdelijke sessiecontext (niet-canoniek)

Regels:
- geen generieke memory-bank boom toevoegen
- geen duplicatie van canonieke docs
- `current-status.md` blijft de enige statuswaarheid
