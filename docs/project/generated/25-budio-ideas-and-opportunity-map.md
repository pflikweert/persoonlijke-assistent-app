# DO NOT EDIT - GENERATED FILE

# Budio Ideas and Opportunity Map

Build Timestamp (UTC): 2026-04-19T11:34:36.447Z
Source Commit: d4ac7cd

Doel: primaire ideebundle met opportunity-map voor triage, sequencing en planherijking.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Bronbestanden (vaste volgorde)
- docs/project/40-ideas/README.md
- docs/project/40-ideas/00-ideas-inbox.md
- docs/project/40-ideas/40-platform-and-architecture/10-lean-project-operating-system-for-repo.md
- docs/project/40-ideas/40-platform-and-architecture/20-vscode-project-copilot-plugin.md
- docs/project/40-ideas/40-platform-and-architecture/30-budio-modular-intelligence-workspace.md
- docs/project/40-ideas/40-platform-and-architecture/40-vscode-plugin-with-budio-runtime-bridge.md
- docs/project/40-ideas/30-ai-and-aiqs/40-aiqs-modular-flow-control-plane.md
- docs/project/40-ideas/10-product/20-budio-brainstorm-workspace-for-builders.md

## Leesregel
- Ideas zijn voorstelruimte en niet automatisch actieve planning of canonieke productwaarheid.
- Promotie naar actieve uitvoering loopt via `docs/project/20-planning/**` en expliciete decisions.

---

## Ideas Workspace

# Ideas workspace (gestructureerde ideecapture)

## Doel
Deze map is de voorstelruimte voor nieuwe ideeën.

Belangrijk:
- ideas zijn **niet** automatisch canonieke productwaarheid
- ideas zijn **niet** automatisch actieve planning

## Werkwijze
1. Snelle inval in `00-ideas-inbox.md`.
2. Triage: verwijderen, parkeren of promoveren.
3. Promotie = één idee per file in passende categorie.

## Categorieën
- `10-product/`
- `20-ui-ux/`
- `30-ai-and-aiqs/`
- `40-platform-and-architecture/`
- `50-growth-and-business/`

## Statuswaarden
- `idea`
- `candidate`
- `later`
- `planned`
- `rejected`
- `superseded`

## Relatie met andere docs
- Actieve focus: `docs/project/20-planning/20-active-phase.md`.
- Open gaps/risico’s: `docs/project/open-points.md`.
- Codewaarheid: `docs/project/current-status.md`.

## Template (kopiëren per idee)

```md
# [Idee titel]

## Status
idea

## Type
product | ui-ux | ai-aiqs | platform-architecture | growth-business | internal-tooling

## Horizon
now | next | later | unknown

## Korte samenvatting

## Probleem

## Waarom interessant

## Relatie met huidige docs

## Mogelijke impact
- ui
- services
- supabase
- aiqs
- docs

## Open vragen

## Volgende stap
```

---

## Ideas Inbox

# Ideas inbox (snelle capture)

## Doel
Lage-frictie plek om nieuwe ideeën direct vast te leggen zonder contextverlies.

## Gebruik
- Korte bullets of ruwe notities zijn toegestaan.
- Inbox-items zijn tijdelijk en moeten later worden getriaged.

## Triage-uitkomsten
- promoveren naar één idee-file
- parkeren als `later`
- verwijderen als niet relevant

## Inbox

- [2026-04-19] VS Code plugin die repo + Budio productiecontext combineert via MCP/API.
- [2026-04-19] AIQS opdelen in flow-families met eigen contracts/evals i.p.v. één generieke laag.
- [2026-04-19] Budio brainstorm/workspace module voor builders/kleine teams als mogelijk productspoor.
- [2026-04-19] Conversation-aware ingest en interpretation layer (WhatsApp/iMessage/Telegram/mail/transcript) — gepromoveerd naar `10-product/30-conversation-aware-ingest-and-interpretation.md`.
- [2026-04-19] Source-aware AIQS routing en evaluation (source type als first-class metadata) — gepromoveerd naar `30-ai-and-aiqs/50-source-aware-routing-and-evaluation.md`.

---

## Idea - Lean Project Operating System

# Lean project operating system voor repo-uitvoering

## Status
candidate

## Type
platform-architecture

## Horizon
now

## Korte samenvatting
Structureer `docs/project/**` als lean operating system met expliciete lagen voor strategy, planning, status, productwaarheid en ideeën.

## Probleem
Strategie, planning, status en ideeën stonden verspreid, waardoor focus en traceerbaarheid onder druk staan.

## Waarom interessant
Minder context-switching, betere uitvoerdiscipline, eenvoudiger automatisering (o.a. VS Code plugin).

## Relatie met huidige docs
- Raakt `docs/project/README.md` en alle planning/ideas docs.
- Versterkt bestaande canonieke docs zonder scope-inhoud te herschrijven.

## Mogelijke impact
- docs

## Open vragen
- Welke minimale metadata-standaard is nodig voor plugin-readability?

## Volgende stap
Operating system in docs doorzetten en bundelstrategie hierop refactoren.

---

## Idea - VS Code Project Copilot Plugin

# VS Code project copilot plugin

## Status
idea

## Type
platform-architecture

## Horizon
next

## Korte samenvatting
Een repo-specifieke VS Code plugin die planning, docs, status en codecontext samenbrengt als bouwassistent.

## Probleem
Informatie over scope, status, planning en code zit nu verspreid; dat kost focus tijdens bouwen.

## Waarom interessant
Sneller van idee naar implementatie, minder context-switching, hogere consistentie met projectguardrails.

## Relatie met huidige docs
- Leunt op `docs/project/**`, `docs/dev/**` en later op nieuwe uploadbundels.

## Mogelijke impact
- docs
- tooling

## Open vragen
- Welke functies moeten lokaal-only blijven?
- Welke functies moeten via API/MCP praten met runtime-context?

## Volgende stap
Scope opdelen in MVP-plugin (read/assist) vs latere automation (write/execute).

---

## Idea - Modular Intelligence Workspace

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

## Volgende stap
Flow-families definiëren met minimale contractset per module.

---

## Idea - VS Code Runtime Bridge

# VS Code plugin met Budio runtime bridge (MCP + API)

## Status
idea

## Type
platform-architecture

## Horizon
next

## Korte samenvatting
Ontwerp een bridge waarbij de VS Code plugin repo-context combineert met runtime-context uit Budio via MCP (tool/resources) en API (persistente state).

## Probleem
Losse lokale context is onvoldoende voor structurele samenwerking op ideeën, planning en flowstatus.

## Waarom interessant
Beter samenwerken tussen bouwen in code en denken/plannen in Budio-runtime zonder alles in één kanaal te duwen.

## Relatie met huidige docs
- Sluit aan op planning/ideas operating system.
- Raakt AIQS-governance en latere flow-modularisatie.

## Mogelijke impact
- tooling
- services
- aiqs
- docs

## Open vragen
- Welke data gaat via MCP resources en welke via API endpoints?
- Welke auth/safety grenzen gelden tussen lokale dev en productiecontext?

## Volgende stap
Contractmatrix opstellen: use case -> MCP tool/resource -> API route -> permissies.

---

## Idea - AIQS Modular Flow Control Plane

# AIQS modular flow control plane

## Status
idea

## Type
ai-aiqs

## Horizon
next

## Korte samenvatting
Breid AIQS uit van task-first admin-governance naar flow-family control plane met module-specifieke contracts, evaluatie en routing.

## Probleem
Eén uniforme AI-tasklaag dekt niet goed de verschillende domeinen (dagboek, code/projectflow, podcast/coaches).

## Waarom interessant
Hogere kwaliteitscontrole per domein en minder ruis in prompts, evaluaties en releasebesluiten.

## Relatie met huidige docs
- Bouwt voort op `docs/project/ai-quality-studio.md`.
- Sluit aan op future-state research en modular workspace idee.

## Mogelijke impact
- aiqs
- services
- supabase
- docs

## Open vragen
- Welke flow-families worden canoniek als eerste ondersteund?
- Hoe houd je shared governance zonder flow-specifieke flexibiliteit te verliezen?

## Volgende stap
Pilot op één extra flow-family naast journal-flow met aparte contracts en evaluatiecriteria.

---

## Idea - Budio Brainstorm Workspace

# Budio brainstorm workspace voor builders

## Status
idea

## Type
product

## Horizon
later

## Korte samenvatting
Mogelijke productmodule waarin solo builders/kleine teams ideeën kunnen vastleggen, structureren en vertalen naar uitvoerbare projectflow.

## Probleem
Creatieve ideeën ontstaan snel en raken versnipperd; zonder structuur gaat focus en uitvoering verloren.

## Waarom interessant
Past bij capture-first principe, maar toegepast op product-/bouwcontext in plaats van alleen dagboekcontext.

## Relatie met huidige docs
- Buiten huidige MVP-scope; nu alleen als ideespoor.
- Sluit inhoudelijk aan op modular workspace en plugin-bridge ideeën.

## Mogelijke impact
- product
- ui
- aiqs
- services
- docs

## Open vragen
- Is dit een aparte doelgroepmodule of een extensie op bestaande kern?
- Welke minimale MVP van zo’n brainstormflow is valideerbaar?

## Volgende stap
Value proposition en eerste workflow-hypothese uitwerken zonder huidige MVP-focus te verstoren.
