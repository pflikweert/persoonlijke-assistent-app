# Open Points — Resterend Werk

## Doel
Dit document bevat alleen resterende gaps, risico’s en onzekerheden op basis van code-realiteit.

## Echt open (niet aangetroffen in code als productfeature)
1. Export van dagboeklaag voor eindgebruiker (1.2D).
2. Export van reflecties voor eindgebruiker (1.2D).
3. Eenvoudige gebruikersreset/delete-all flow (1.2D).
4. Self-service beheer van adminrechten in product-UI ontbreekt; huidige toegang loopt via server-side allowlist env.

Toelichting:
- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.

## Deels open (nog niet hard afgerond)
1. 1.2A stabiliteit/foutafhandeling als complete afgeronde subfase.
2. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
3. 1.2C UX-polish over alle kernflows.
4. 1.2E private-beta readiness met expliciete releasechecklist.

## Onzeker
1. Volledige implementatiedekking van designrefs 1.2.1 per scherm.
2. Expliciete aparte post-capture assistentlaag als zelfstandige feature.
3. Import-verify robuustheid door ontbrekende chatgpt-import fixture.

## Prioriteit
1. Sluit 1.2D productgaps (export/reset).
2. Maak completion-criteria voor 1.2A/1.2B/1.2C/1.2E expliciet en toetsbaar.
3. Los onzekerheden op met hard bewijs; anders onzeker laten.

## Risico’s
1. Scope-creep richting brede assistent.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.
