---
name: ui-implementation-guardrails
description: Compacte workflow voor UI-implementatie, polish en regressiefixes volgens clean-first design-, copy- en shared primitive guardrails.
---

# Gebruik
Gebruik bij UI-implementatie, visual polish en regressiefixes die geen volledige Stitch-redesignscope zijn.

# Bronnen
Lees alleen wat nodig is:
- `docs/project/README.md` (sectie `2b` source-of-truth matrix); gebruik `docs/project/generated/**`, `docs/design/generated/**` en `docs/upload/**` niet als canonieke bron.
- `AGENTS.md` voor always-on UI-regels.
- `docs/design/mvp-design-spec-1.2.1.md` voor design guardrails.
- `docs/project/copy-instructions.md` voor copy en microcopy.
- Relevante `design_refs/1.2.1/**` bij styling- of schermwerk.

# Werkwijze
1. Doe eerst een scaffold/shared fit check via `docs/dev/ui-assembly-decision-tree.md`.
2. Check of de regressie uit een shared primitive komt.
3. Kies clean-first: spacing, typografie, hiërarchie en tonal contrast vóór extra containers.
4. Houd plain text wrappers transparant; borders, fills en nested surfaces zijn opt-in.
5. Houd dark mode structureel even licht als de design ref.
6. Houd topnav navigation-only; titel en ondersteunende copy horen in de hero.
7. Houd copy compact: liever hero + action + notice dan dubbele uitleg.
8. Maak background-modi en surfaces mode-aware; dark mode is nooit de impliciete default voor light mode.
9. Verifieer met relevante design refs en een gerichte dark + light runtime/smoke-check voordat je “klaar” zegt.

# Niet doen
- Geen redesign zonder expliciete opdracht.
- Geen nieuwe visuele defaults in screens introduceren.
- Geen zware auth-cards, image backgrounds, borders of fills als shortcut.
- Geen dark-only gradients, surfaces of scrims in shared primitives.
- Geen productstatus ophogen zonder hard bewijs.
