---
name: openai-server-flow-workflow
description: Compacte workflow voor server-side OpenAI-verwerking met duidelijke input/output-contracten.
---

# Gebruik
Alleen voor server-side OpenAI-verwerking in bestaande backendflow.

# Werkwijze
1. Houd alle OpenAI-calls server-side.
2. Definieer per flow expliciete input/output-types.
3. Start minimalistisch: kleinste werkende prompt en foutpad.
4. Houd logging en versievelden functioneel en kort.
5. Vermijd extra lagen als een simpele service volstaat.

# Niet doen
- Geen client-side OpenAI-calls met secrets.
- Geen ongevraagde platformuitbreidingen toevoegen.
- Geen scope-uitbreiding buiten de gevraagde flow.
