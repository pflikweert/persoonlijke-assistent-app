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

## Nieuwe input (apr 2026): OpenAI Codex Automations

Bron: `https://openai.com/academy/codex-automations/` (23 apr 2026).

Relevante learnings:

1. **Automations werken het best voor terugkerende, reviewbare taken**
   - Voorbeelden uit de bron: wekelijkse review, ochtendbriefing, changelog-samenvatting, inconsistentie-checks.
   - Dit past direct bij plugin-werk rond task-overzichten, docs-status en periodieke hygiene-checks.

2. **Thread-continuatie is waardevol voor lopende context**
   - De bron benadrukt dat sommige automations terugkeren naar dezelfde conversatie i.p.v. telkens opnieuw beginnen.
   - Voor Budio-plugin betekent dit: een automation lane moet context-stabiel blijven (zelfde task/flow), met heldere audittrail.

3. **Specifiek + herhaalbaar + makkelijk te reviewen is de kernkwaliteit**
   - Deze quality bar sluit aan op onze taskflow- en bewijsregels.
   - Plugin-automations moeten daarom standaard output geven in vaste templates (wat gecontroleerd is, welke bronnen, welke onzekerheden).

### Vertaling naar Budio-scope (cheap-first)

- **Nu (idea):** plugin positioneren als "automation launcher" voor repo-routines (taskflow-verify reminder, docs status digest, weekreview).
- **Next:** 1-2 beperkte automation templates ontwerpen met human-in-the-loop review als harde stap vóór write-acties.
- **Later:** pas na bewijs uitbreiden naar semi-autonome multi-step automations in de plugin-UX.

### Bewuste afbakening

- Geen impliciete overstap naar full-autonomous repo mutaties.
- Geen bypass van bestaande guardrails (`taskflow`, docs verify, source-first).

## Volgende stap

Scope opdelen in MVP-plugin (read/assist) vs latere automation (write/execute).
