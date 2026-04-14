# Repo-eigen Memory Bank workflow

## Doel
Een lichte werkwijze voor sessiecontinuïteit in Cline, zonder tweede waarheidshiërarchie of docs-duplicatie.

## Waarom
- Cline-sessies wisselen; context kan verloren gaan.
- We willen relevante werkcontext behouden zonder canonieke docs te vervuilen.
- We blijven werken vanuit één waarheidssysteem dat al bestaat in deze repo.

## Wat deze memory bank WEL is
- een docs-router-benadering: lees eerst de juiste ingang en daarna alleen taakrelevante bronnen
- een expliciete scheiding tussen lagen:
  - canonieke waarheid (`docs/project/**`)
  - always-on uitvoerregels (`AGENTS.md`)
  - domeinspecifieke patronen (skills)
  - operationele workflow (`docs/dev/**`)
  - tijdelijke sessiecontext (`docs/dev/active-context.md`)
  - status/open punten (`current-status.md`, `open-points.md`)

## Wat deze memory bank NIET is
- geen aparte root knowledge base
- geen generieke memory-bank boom
- geen duplicatie van canonieke docs
- geen “lees alles altijd”-dogma
- geen dumping ground voor losse notities

## Leesvolgorde per taak
1. `docs/project/README.md`
2. `AGENTS.md`
3. taakrelevante canonieke docs in `docs/project/**`
4. relevante skills in `.agents/skills/**`
5. `docs/dev/active-context.md` alleen als recente sessiecontext/WIP/learnings relevant zijn

## Wanneer active-context verplicht of nuttig is
Gebruik `docs/dev/active-context.md` bij:
- non-triviale taken
- onderbroken sessies
- multi-file werk
- taken waar recente WIP, docs-updates of sessielearnings direct relevant zijn

Meestal niet nodig bij:
- kleine, volledig afgebakende fixes zonder sessieafhankelijkheid

## Update-regels per laag
- `docs/project/current-status.md`: alleen bij harde, bewijsbare repo-realiteit
- `docs/project/open-points.md`: alleen bij echte nieuwe gaps/risico’s/onzekerheden
- `docs/dev/active-context.md`: alleen voor actuele, operationele sessiecontext

## Waar structurele learnings thuishoren
- repo-breed always-on gedrag → `AGENTS.md`
- taak-/domeinspecifiek herhaalpatroon → bestaande skill
- operationeel proces → `docs/dev/cline-workflow.md` of dit document
- tijdelijke WIP/context → `docs/dev/active-context.md`

## Onderhoudsregels
- houd het kort en feitelijk
- verwijs naar canonieke bron in plaats van te kopiëren
- promote alleen stabiele learnings; laat sessieruis tijdelijk

## Opschoning (verplicht)
- `docs/dev/active-context.md` is een **tijdelijke werkfile**, geen backlog.
- Voeg in `active-context.md` altijd een regel toe: `Laatst bijgewerkt op: YYYY-MM-DD`.
- Na afronding van non-triviale of onderbroken taken:
  1. promote stabiele learnings naar `AGENTS.md`, skill of `docs/dev/**` (indien structureel), en
  2. verwijder afgeronde WIP-context uit `active-context.md`.
- Laat alleen context staan die aantoonbaar nodig is voor de eerstvolgende sessie.
- Staat er geen relevante open WIP meer, reset `active-context.md` naar een korte baseline.
- Is `active-context.md` ouder dan 14 dagen en bevat het geen aantoonbaar relevante open WIP, reset naar baseline.

## Toolingverwachting (Cline/Codex)
- Deze memory-bank flow is repo-side en **best effort**: hij helpt alleen wanneer de agent de docs-volgorde volgt.
- Voor Cline is dit doorgaans effectief via `AGENTS.md` + `.clinerules`.
- Voor andere agents (zoals Codex) blijft dit afhankelijk van hoe die sessie repo-instructies inlaadt.
- Daarom blijft de canonieke waarheid altijd in `docs/project/**`; memory-bank content mag nooit leidend worden.
