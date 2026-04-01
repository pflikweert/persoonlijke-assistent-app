# Open Points And Next Phases

## Doel
Open punten en resterend werk, herijkt op basis van wat in code aantoonbaar aanwezig is.

## Echt nog open
- Export van day journals als productfeature: niet aangetroffen in app/services.
- Export van reflecties als productfeature: niet aangetroffen in app/services.
- Product-reset/delete flows (gebruikersniveau): niet aangetroffen.

Bron:
- `docs/project/docs/project/master-project.md` (Fase 1.2D)
- codevalidatie in `app/**` en `services/**`

## Deels open / afmaken
- Fase 1.2A stabiliteit/foutafhandeling:
  - logging en request tracing aanwezig in edge functions,
  - maar fase is als geheel niet als afgerond aantoonbaar.
- Fase 1.2B outputkwaliteit:
  - quality fixture + verify-script aanwezig,
  - maar afrondingsstatus in code/docs niet hard gemarkeerd.
- Fase 1.2C UX-polish:
  - veel loading/empty/error states aanwezig,
  - maar volledige afronding over alle flows niet hard aantoonbaar.
- Fase 1.2E beta-readiness:
  - verify scripts aanwezig,
  - maar aparte smoke-testsuite/release-checklist als afgeronde set niet hard aantoonbaar.
- Design-doorvoer 1.2.1:
  - foundations en meerdere schermdoorvoeren zichtbaar,
  - maar volledige “klaar”-status voor alle designrefs niet expliciet bewezen.

Bron:
- `docs/project/docs/project/master-project.md`
- `docs/design/mvp-design-spec-1.2.1.md`
- codevalidatie in `app/**`, `components/**`, `scripts/**`

## Onzeker / eerst verifiëren
- Exacte afrondingsgraad per subfase 1.2A t/m 1.2E:
  - docs beschrijven inhoud en volgorde,
  - maar geven geen harde voortgangsregistratie per subfase.
- Mate waarin product-visiepunt “korte assistentreactie direct na capture” al volledig is doorgezet:
  - in huidige UI/flows niet als aparte, expliciete featurelaag aangetroffen.

Bron:
- `docs/project/docs/project/master-project.md`
- `docs/project/product-vision-mvp.md`
- codevalidatie in `app/(tabs)/capture.tsx`, `services/**`

## Nu doen (volgens docs + codegap)
- Open punten uit Fase 1.2D (export/reset) invullen.
- Deels-open punten uit 1.2A/1.2B/1.2C/1.2E afronden met aantoonbare completion-criteria.

## Later
- Fase 2 na afronding van Fase 1.2 (zoals in `docs/project/master-project.md`).

## Post-MVP / buiten scope
- Retrieval/Q&A
- Vector search
- Document uploads/intelligence
- Message help/contactprofielen
- Realtime voice
- Brede agentarchitectuur
- Taken/agenda/reminders

Bron:
- `docs/project/docs/project/master-project.md`

## Risico's (uit bestaande docs)
- Scope-creep richting brede assistent/chatproduct.
- Vervuiling van dagboeklaag met niet-canonieke AI-interactie.
- Kwaliteitsschommeling in output als hardening niet aantoonbaar wordt afgemaakt.

Bron:
- `docs/project/docs/project/master-project.md`
- `docs/project/product-vision-mvp.md`
