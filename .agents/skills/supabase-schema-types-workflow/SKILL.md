---
name: supabase-schema-types-workflow
description: Compacte workflow voor expliciet gevraagde Supabase schemawijzigingen, migrations en types.
---

# Gebruik
Alleen bij expliciete schema- of migrationopdrachten.

# Werkwijze
1. Bevestig expliciete schema-impact; anders geen schemawijziging.
2. Maak kleine, duidelijke migrations.
3. Stem appcode pas af na schemawijziging.
4. Werk types bij waar nodig.
5. Beschrijf impact kort en concreet.

# Niet doen
- Geen UI/routing-werk.
- Geen prompt- of OpenAI-orchestratie.
- Geen prematuur datamodel voor niet-gevraagde uitbreidingen.
