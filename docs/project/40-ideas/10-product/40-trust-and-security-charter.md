# Trust and security charter (gebruikerscommunicatie)

## Status

idea

## Type

product

## Horizon

next

## Korte samenvatting

Budio moet niet alleen technisch veilig zijn, maar dat ook aantoonbaar, begrijpelijk en prominent communiceren via een product-facing **Trust & Security Charter** in web en app. Doel: de angst rond "dagboek + cloud + AI" expliciet wegnemen voor ook de kritische gebruiker.

Dit is de gebruikers- en communicatiekant van het platform-idee `40-ideas/40-platform-and-architecture/50-security-posture-and-continuous-hardening.md`.

## Probleem

- Gebruikers associëren dagboek + AI + cloud met hoog risico (datalek, AI-training, cloud-compromise).
- Zelfs als techniek goed staat, zonder zichtbare uitleg bouwt Budio geen vertrouwen.
- Generieke "privacybeleid" pagina's lezen niemand; ze creëren geen gevoel van controle.
- Vergelijkbare journaling-apps falen vaak op transparantie rond AI-gebruik en data-retentie.

## Waarom interessant

- Vertrouwen is voor een dagboekapp het belangrijkste product, niet alleen een feature.
- Charter-achtige transparantie is goedkoop te bouwen maar zwaar in conversie-effect en retentie.
- Sluit direct aan op de research-richting `private/regulated` als premium differentiator.
- Biedt een repeteerbaar communicatieframe voor later (landingspages, pricing pages, in-app onboarding, menu).
- Helpt bij acquisitie van de kritische gebruiker ("Nico-proof"): iemand die pas instapt als hij snapt waarom hij het kan vertrouwen.

## Productvisie

### Principes (publiek leesbaar)

Drie korte beloftes:

1. **Jouw ogen alleen**
   - Wat wij zien en wat wij niet zien.
   - Hoe toegang beperkt is (RLS, server-side rollen, allowlist).
   - Waar encryptie zit (in rust, in transit), en wat E2EE wel/niet betekent in de huidige fase.

2. **AI zonder oordeel**
   - AI wordt gebruikt om je te helpen, niet om jou te analyseren of door te verkopen.
   - OpenAI zero-retention / no-training setting expliciet bevestigd.
   - Geen verkoop, geen advertentiegebruik, geen third-party tracking pixels.

3. **Open kaart**
   - Welke providers we gebruiken: Supabase (data), Vercel (hosting), OpenAI (AI).
   - Waarom we die kiezen en welke standaarden zij hanteren.
   - Wat jij altijd zelf kan: export, verwijder alles, wachtwoord wijzigen, sessies beëindigen.

### Charter-opbouw (werkvorm)

- 1 korte landingsvariant (pricing/product pagina, 3 beloftes).
- 1 dieper charter-document (FAQ-stijl: "Wat als Supabase wordt gehackt?", "Traint OpenAI op mijn data?", "Kan Budio mijn teksten lezen?").
- 1 versie in-app: korte hero-kaart + link naar volledige versie.

### Transparantie-elementen

- Versiedatum + changelog van het charter zelf.
- Publieke `security.txt` met contactpad.
- Duidelijke scheiding: wat geldt vandaag, wat is roadmap (bijv. E2EE).
- Expliciete keuze-indicatoren: wat kan de gebruiker zelf aanzetten (MFA, audio-retentie, export, delete-all)?

## UX-plek in product

- **Web**: prominente section op landing + dedicated `/trust` of `/security` route.
- **App**: in onboarding (optioneel kort blokje) en in settings-hub als eigen rij ("Privacy & Security"), aansluitend bij bestaande settings IA (`app/settings.tsx`).
- Geen zware modals, geen dark patterns; clean-first, past binnen bestaande spacing/typografie-guardrails.

## Copy-richting

Volgt `docs/project/copy-instructions.md`:

- Kort, direct, menselijk.
- Geen marketingjargon, geen AI-coach-taal.
- Concreet ("we bewaren geen audio tenzij jij dat aanzet") i.p.v. abstract ("state of the art privacy").
- Vertaalbaar naar Nederlands en Engels zonder betekenisverlies.

## Relatie met huidige code-realiteit

- Past bij bestaande "exit/controle"-features: export, import, delete-all (1.2D aanwezig).
- Past bij bestaande admin-only boundary (geen end-user admin controls).
- Past bij bestaande `user_preferences` voor audio-opslag keuze.
- Nog niet aanwezig: dedicated trust/security UI-pad, copy-set, landing-section, `security.txt`.

## Relatie met AIQS

- AIQS blijft admin-only; charter beschrijft *niet* AIQS als gebruikersfeature.
- Charter bevestigt wel: "de AI-instellingen en prompts worden beheerd volgens interne kwaliteitscontroles" zonder internals te tonen.
- Source-aware routing (conversaties) maakt expliciete charter-zinnen extra waardevol (stem-attributie, geen andermans data gebruikt om gebruiker te profileren).

## Mogelijke impact

- product
- ui
- docs
- copy
- marketing/landing
- infra (security.txt en disclosure pad)

## Open vragen

- Starten we met landing-only charter, of gelijk ook in-app?
- Wie is juridisch eindverantwoordelijk voor de charter-teksten (solo of met externe legal review)?
- Koppelen we de charter aan een publiek changelog (datumgestuurd) of alleen aan releases?
- Hoeveel transparantie over concrete technische keuzes (providers, headers, policies) is nuttig voor gebruikers zonder te veel attack surface te onthullen?
- Willen we een expliciete "roadmap naar E2EE" opnemen, of pas wanneer er commitment is op bouw?

## Volgende stap

- Concept-charter in 1 pager uitwerken op basis van drie beloftes.
- Concept copy-set valideren tegen `copy-instructions.md` en `ui-modals.md` guardrails.
- Plek in web + settings IA visueel schetsen (zonder nu te bouwen).
- Besluiten over scope: landing-only eerste versie vs. landing + app gelijk.
