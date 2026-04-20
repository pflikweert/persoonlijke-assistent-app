# Idea lifecycle workflow (operationeel)

## Doel

Een expliciete, goedkope en herhaalbare agent-workflow voor idee-capture en promotie,
zonder canonieke productwaarheid te vervuilen.

## Plaats in de hiërarchie

- Canonieke productwaarheid: `docs/project/**`
- Workflowafspraken: `docs/dev/**`
- Always-on regels: `AGENTS.md`

Dit document is operationeel en niet-canoniek voor productscope/status.

## Kernregels

1. **Cheap-first**: vang ideeën eerst lichtgewicht op (inbox), werk pas uit bij duidelijke waarde.
2. **Eén idee per file** na promotie.
3. **Geen automatische waarheidspromotie**: idea-docs zijn voorstelruimte.
4. **Planning alleen bij focusimpact**: update `20-planning/30-now-next-later.md` alleen als het idee echt werkvolgorde raakt.
5. **Statusclaims alleen op bewijs**: `current-status.md` pas bij bewezen runtime/code-realiteit.
6. **Epic-candidate eerst**: ideeën op epic/projectniveau blijven idea-files tot expliciete promotie naar concrete bouwtaak.
7. **Context-first routing**: default-context is Budio app + AIQS; routeer alleen naar Jarvis/plugin-sporen als intentie daar logisch op wijst.
8. **Twijfelprotocol**: hoge-impact twijfel eerst afstemmen; lage-impact twijfel expliciet als aanname labelen.

## Standaardflow

1. **Capture**
   - Voeg ruwe inval toe aan `docs/project/40-ideas/00-ideas-inbox.md`.
2. **Triage**
   - Bestaat dit idee al? Zo ja: verrijk bestaand idee-file i.p.v. dupliceren.
   - Anders: promoveer naar één idee-file in juiste categorie.
3. **Promotie**
   - Gebruik template uit `docs/project/40-ideas/README.md`.
   - Kies expliciet: `Status`, `Type`, `Horizon`, `Open vragen`, `Volgende stap`.
4. **Optionele doorstroom**
   - Alleen bij duidelijke impact: voeg korte verwijzing toe in `20-planning/30-now-next-later.md`.
5. **Niet doen zonder expliciet besluit**
   - Geen wijziging in `master-project.md`, `product-vision-mvp.md` of `current-status.md` enkel op basis van idee-drafts.

## Kosten- en scope-guardrails voor agents

- Lees alleen taakrelevante bronnen; geen brede repo-scan voor simpele ideecapture.
- Houd prompts klein: doel + scope + files.
- Doe per batch één duidelijke idee-promotie als dat voldoende is.
- Vermijd direct architectuur-/codewerk bij puur strategische ideevorming.

## Obsidian en markdown-werklaag (belangrijk)

- Obsidian (of VS Code Obsidian plugin) mag gebruikt worden als **editor/werklaag** op repo-markdown.
- Repo-bestanden blijven de waarheid; Obsidian is geen tweede waarheidshiërarchie.
- Losse Obsidian-notes buiten de repo zijn niet automatisch projectwaarheid.
- Alleen na expliciete promotie naar `docs/project/**` of `docs/dev/**` tellen notities als repo-artefact.

## Repo versus productie-deploy

- "In repo" betekent niet automatisch "naar productie deploy".
- Idea/docs/workflowbestanden mogen versioned in git staan zonder runtime-deployrol.
- Houd runtime/deploygrenzen expliciet in `open-points.md` en/of planning als dit onduidelijk wordt.

## Verify

- Bij wijzigingen in `docs/project/**`: `npm run docs:bundle` + `npm run docs:bundle:verify`.
- Commit pas na geslaagde verify.
