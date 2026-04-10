---
name: ui-implementation-guardrails
description: Compacte workflow voor UI-implementatie, polish en regressiefixes volgens clean-first design-, copy- en shared primitive guardrails.
---

# Gebruik
Gebruik bij UI-implementatie, visual polish en regressiefixes die geen volledige Stitch-redesignscope zijn.

# Bronnen
Lees alleen wat nodig is:
- `AGENTS.md` voor always-on UI-regels.
- `docs/design/mvp-design-spec-1.2.1.md` voor design guardrails.
- `docs/project/copy-instructions.md` voor copy en microcopy.
- Relevante `design_refs/1.2.1/**` bij styling- of schermwerk.

# Werkwijze
1. Check eerst of de regressie uit een shared primitive komt.
2. Kies clean-first: spacing, typografie, hiërarchie en tonal contrast vóór extra containers.
3. Houd plain text wrappers transparant; borders, fills en nested surfaces zijn opt-in.
4. Houd dark mode structureel even licht als de design ref.
5. Houd topnav navigation-only; titel en ondersteunende copy horen in de hero.
6. Houd copy compact: liever hero + action + notice dan dubbele uitleg.
7. Maak background-modi en surfaces mode-aware; dark mode is nooit de impliciete default voor light mode.
8. Verifieer met relevante design refs en een gerichte dark + light runtime/smoke-check voordat je “klaar” zegt.

# Niet doen
- Geen redesign zonder expliciete opdracht.
- Geen nieuwe visuele defaults in screens introduceren.
- Geen zware auth-cards, image backgrounds, borders of fills als shortcut.
- Geen dark-only gradients, surfaces of scrims in shared primitives.
- Geen productstatus ophogen zonder hard bewijs.
