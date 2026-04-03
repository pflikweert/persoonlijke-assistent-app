# Open Points — Resterend Werk

## Doel
Dit document bevat alleen resterende gaps op basis van:
- oorspronkelijke planning in projectdocs
- aantoonbare code-realiteit

## Echt open (niet aangetroffen in code als productfeature)
1. Export van dagboeklaag voor eindgebruiker (1.2D).
2. Export van reflecties voor eindgebruiker (1.2D).
3. Eenvoudige gebruikersreset/delete-all flow (1.2D).

Toelichting:
- bestaande dump/export scripts zijn developer tooling, geen gebruikersfeature.

## Deels open (aanwezig maar niet aantoonbaar afgerond)
1. 1.2A stabiliteit/foutafhandeling.
2. 1.2B outputkwaliteit als complete afgeronde kwaliteitsset.
3. 1.2C UX-polish over alle kernflows.
4. 1.2E private-beta readiness inclusief expliciete releasechecklist.

## Onzeker (bewust niet geüpgraded naar “aanwezig”)
1. Volledige implementatiedekking van designrefs 1.2.1 per scherm.
2. Expliciete, aparte post-capture assistentlaag zoals visieformulering suggereert.
3. Import-verify robuustheid: chatgpt-import tests verwijzen naar ontbrekende fixture (`docs/dev/Dagboek voor gemoedstoestand.md`).

## Prioriteitsvolgorde
1. Sluit 1.2D productgaps (export/reset).
2. Maak completion-criteria voor 1.2A/1.2B/1.2C/1.2E expliciet en toetsbaar.
3. Los onzekerheden op met hard bewijs (code + docs), anders onzeker laten.

## Buiten scope / post-MVP
- brede chat/coach/agent-richting
- retrieval/Q&A en vector search
- document intelligence als brede productlaag
- taken/agenda/reminders

## Risico's
1. Scope-creep richting brede assistent.
2. Verwarring tussen tooling en productfeature.
3. Te snelle status-upgrade van onbewezen claims.
