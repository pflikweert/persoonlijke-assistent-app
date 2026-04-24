# Security posture and continuous hardening

## Status

idea

## Type

platform-architecture

## Horizon

next

## Korte samenvatting

Budio verwerkt hoog privacy-gevoelige content (dagboek, audio, conversaties, reflecties).
Daarom moet er een expliciet, herhaalbaar security-posture-spoor komen dat technische hardening, administratieve discipline en periodieke (AI-)pentesting combineert, zonder afhankelijk te zijn van dure enterprise-tools zoals Aikido.

Doel: "Nico-proof" vertrouwen — ook de meest kritische gebruiker durft zijn gedachten aan Budio toe te vertrouwen, omdat de barrières voor misbruik realistisch en aantoonbaar hoog zijn.

## Probleem

- Dagboek + AI + cloud raakt drie angstgebieden tegelijk: data-leak, AI-training met mijn data, cloud-compromise.
- Enterprise-tools (bijv. Aikido AI-pentest per release) zijn niet passend qua budget voor MVP/solo-fase.
- Zonder expliciet vastgelegd security-posture-spoor blijven hardening-acties adhoc en niet herhaalbaar.
- Zonder expliciete trust-communicatie denken (potentiële) gebruikers dat risico onbekend of onbeheerd is, ook als techniek redelijk op orde is.

## Waarom interessant

- Vertrouwen is het *product* voor een dagboek/journal-app, niet alleen een kwaliteitseigenschap.
- Goede baseline is haalbaar met grotendeels gratis/low-cost tooling (Supabase RLS, Vercel envs, Snyk free, GitHub secret scanning, TruffleHog, OWASP Mobile Top 10).
- Sluit direct aan op de research-richting `private/regulated` als premium differentiator.
- Geeft een basis voor latere enterprise-tier met zwaardere garanties zonder alles achteraf te herbouwen.

## Scope van dit idee (3 lagen + communicatie)

### Laag 1 — Technische barrières (code/runtime)

Focus op verifieerbare, reproduceerbare maatregelen:

1. **Row Level Security (RLS) als heilige laag**
   - Policies per tabel expliciet en getest.
   - Handmatig en geautomatiseerd testplan: "probeer data van andere user op te halen met geldige sessie".
   - RLS-test opnemen in verify-scripts of als periodieke smoke-check.

2. **Server-side secrets (geen client exposure)**
   - `OPENAI_API_KEY` en vergelijkbare keys blijven strikt in edge functions.
   - Regel uit `AGENTS.md` ("geen client-side OpenAI calls met geheime sleutels") expliciet onderdeel maken van security charter.
   - Geen admin-tokens in frontend; alle admin-acties via server-checks (`ADMIN_REGEN_ALLOWLIST_USER_IDS`, etc.).

3. **Transport en sessie**
   - HTTPS-only (Vercel default).
   - Sessietoken handling server-side; refresh en revoke-gedrag documenteren.
   - MFA als opt-in feature (email/OTP of TOTP) voor hoog-risico gebruikers.

4. **Client-side end-to-end encryptie (E2EE) — toekomstig spoor**
   - Onderzoek encryptie van ruwe dagboektekst en audio vóór upload.
   - Device-bound of passphrase-derived keys (Argon2id / WebCrypto + SecureStore op native).
   - Consequenties: serverkant kan dan geen AI-normalisatie meer op ruwe tekst — vereist herontwerp van entry-normalization flow (ofwel on-device AI, ofwel expliciete "decrypt-only-for-process" modellen).
   - Expliciet als aparte research-spike plannen, niet mengen met basis-hardening.

5. **Audio en storage**
   - Private storage buckets (al aanwezig voor `entry-audio`) met strakke RLS/ACL policies.
   - Signed URLs met korte TTL (nu 15 min — bevestigd in `services/day-journals.ts`).
   - Retentie-/opslagkeuze expliciet in `user_preferences` (al aanwezig), met duidelijke UX-consequenties.

6. **Supabase hardening baseline**
   - `search_path` fixes (al gedaan) als recurring check.
   - Geen `service_role` key in frontend of mobile build.
   - Migratie-review op RLS impact verplicht bij elke schema-wijziging.

7. **Vercel hardening baseline**
   - Strikte env-variable scoping (Preview vs. Production).
   - Headers: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP (minstens report-only start).
   - Disable preview-deploy public exposure van gevoelige paden.

### Laag 2 — Administratieve beveiliging (secrets & operations)

1. **Secrets hygiëne**
   - `.env.local` + `.env.local.example` als lokale bron (al aanwezig).
   - Geen secrets in git; pre-commit check met TruffleHog of git-secrets.
   - GitHub secret scanning + push protection inschakelen.
2. **Key rotation policy**
   - Kwartaallijkse rotatie voor `OPENAI_API_KEY`, Supabase service-keys, admin tokens.
   - Rotatieprocedure vastleggen als runbook in `docs/dev/**`.
3. **Access control**
   - Allowlists via env-vars blijven canoniek (`ADMIN_REGEN_ALLOWLIST_USER_IDS`, `ADMIN_REGEN_INTERNAL_TOKEN`).
   - Minimale aantal mensen met prod-toegang; 2FA verplicht op GitHub, Supabase, Vercel, Expo, OpenAI.
4. **Backup / recovery**
   - Supabase point-in-time recovery status expliciet documenteren.
   - Handmatige restore-test minstens jaarlijks.

### Laag 3 — Periodieke (AI-)pentest / verification (betaalbaar)

Doel: zonder Aikido AI-pentest-licentie toch consistente, herhaalbare security-verificatie.

1. **Static/dep scanning (CI of lokaal)**
   - `npm audit` als minimale stap.
   - Snyk Open Source (free tier) voor dependency CVEs.
   - GitHub Dependabot actief.
2. **Secret scanning**
   - TruffleHog als pre-push of CI-check.
   - GitHub secret scanning push-protection aan.
3. **Mobile & web app review**
   - OWASP Mobile Top 10 als review-checklist per release-stap.
   - OWASP ASVS L1 als baseline voor web-auth/api.
4. **Supabase RLS test harness**
   - Scripts die als "andere user" proberen te lezen/schrijven; falen = geen regressie.
   - Onderdeel van `scripts/verify-local-*` pad of nieuw `scripts/verify-rls.sh`.
5. **Lightweight AI-pentest**
   - Handmatige LLM-prompt injection tests op AIQS-acties en edge functions die met OpenAI praten.
   - Testcases voor:
     - prompt-injection via entry-input ("ignore previous instructions" patterns)
     - data-exfiltratie via prompt-inclusief gebruikersinhoud
     - context-bleed (krijgt user A ooit user B content terug?)
   - Eerst handmatig vastleggen; pas automatiseren als er duidelijke ROI is.
6. **Bug bounty / security.txt (later)**
   - `security.txt` publiceren met contactpad.
   - Optioneel small bounty via HackerOne/Intigriti wanneer productie-gebruikersbasis groeit.

## Trust communication (expliciet)

Zie ook het productidee `40-ideas/10-product/40-trust-and-security-charter.md` voor de gebruikersgerichte uitwerking.

Kernpunten om later in web en in-app te communiceren:

- **Jouw ogen alleen**: wat is versleuteld, hoe en met welke sleutels.
- **AI zonder oordeel**: OpenAI zero-retention / no-training setting voor API gebruik expliciet maken.
- **Open kaart**: welke providers (Supabase, Vercel, OpenAI) en waarom.
- **Exit/controle**: export + delete-all blijven first-class rechten (al aanwezig in 1.2D).

## Relatie met huidige code-realiteit

- Bestaand sterk punt: admin-only afscherming via allowlist + server-side checks (`app/settings-regeneration.tsx`, functions).
- Bestaand sterk punt: `OPENAI_API_KEY` strikt server-side per `AGENTS.md`.
- Bestaand sterk punt: private `entry-audio` bucket met signed URLs.
- Gap: geen expliciete RLS-test harness, geen documented pentest-ritme, geen security charter voor gebruikers.
- Gap: geen expliciete key-rotation runbook.
- Gap: E2EE nog niet onderzocht; betekent dat Budio-operators technisch dagboek-text kunnen zien.

## Relatie met AIQS

- AIQS-promptpaden zijn admin-only; toch moet AI-pentest expliciet ook hier landen (prompt-injection via runtime invoer).
- Source-aware routing (zie `40-ideas/30-ai-and-aiqs/50-source-aware-routing-and-evaluation.md`) vergroot attack surface (conversatie-input) en vraagt vooraf expliciete guardrails.

## Mogelijke impact

- services
- supabase
- docs
- product (trust-communicatie)
- aiqs (prompt-injection hardening)
- infra / tooling (CI, scanning, secrets)

## Open vragen

- E2EE vs. server-side AI-verwerking: accepteren we dat Budio baseline níet E2EE is, mét expliciete transparantie, en maken we E2EE een later premium spoor?
- Welke minimale RLS-test harness is haalbaar in `scripts/verify-local-*` zonder runtime fragility?
- Welke pentest-cadans is realistisch (elke minor, elke major, kwartaal)?
- Wanneer introduceren we `security.txt` en responsible disclosure pad?
- Welke onderdelen landen in `docs/project/**` (canoniek) vs `docs/dev/**` (runbook/tooling)?

## Nieuwe input (apr 2026): OpenAI Privacy Filter

Bron: `https://openai.com/index/introducing-openai-privacy-filter/` (22 apr 2026).

Relevante learnings voor dit idee:

1. **PII-filtering als aparte infrastructuurlaag werkt in de praktijk**
   - OpenAI positioneert privacy-filtering expliciet als eigen pipeline-component vóór training, indexing, logging en review.
   - Dit sluit direct aan op ons idee om privacy-by-design niet alleen policy-matig maar ook technisch afdwingbaar te maken.

2. **Kleine, lokale modellen kunnen privacy-risico in de keten verlagen**
   - Privacy Filter is ontworpen voor high-throughput en lokaal gebruik, zodat ruwe tekst niet eerst naar een externe de-identification service hoeft.
   - Voor Budio betekent dit een kans op een later "local-first redactiepad" voor gevoelige tekstfragmenten, zonder direct een volledige E2EE-architectuur te eisen.

3. **Context-aware redactie is belangrijker dan regex-only detectie**
   - De release benadrukt dat patroonregels (email/phone regex) onvoldoende zijn voor subtiele PII in ongestructureerde tekst.
   - Dit bevestigt dat onze toekomstige privacylaag context-aware detectie moet ondersteunen, met expliciete trade-offs tussen recall en precision per workflow.

4. **Taxonomie + operating points moeten expliciet policy-koppelbaar zijn**
   - OpenAI werkt met vaste labelcategorieën en instelbare operating points.
   - Voor Budio past dit bij AIQS/policy-routing: per flow definiëren wat verplicht gemaskeerd wordt (bijv. secrets altijd) versus optioneel (bijv. private dates in persoonlijke journalingcontext).

5. **Belangrijke guardrail: geen compliance-claim op model alleen**
   - OpenAI benoemt expliciet dat dit geen volledige anonymization/compliance-vervanger is.
   - Dit ondersteunt onze bestaande lijn: modelmatige redactie is één laag naast runbooks, human review in high-stakes contexten en heldere trust-communicatie.

### Vertaling naar Budio-scope (cheap-first)

- **Nu (idea-niveau, geen productbouw):** security-idee expliciet aanvullen met een "PII redaction gateway" als optionele privacylaag vóór logging/training-achtige interne paden.
- **Next (kleine spike):** beperkte benchmark op eigen voorbeelddata (NL/EN journaling + exports) om te meten waar context-aware redactie meerwaarde heeft t.o.v. regex baseline.
- **Later:** pas na bewijs beslissen over productie-inzet, fine-tuning, en of dit in consumer of alleen private/business lane landt.

### Bewuste afbakening

- Dit update **alleen** de ideevorming en roadmap-input.
- Geen nieuwe claim dat Budio nu al volledige anonymization of compliance-dekking biedt.
- Geen directe runtime-integratie zonder aparte task en bewijsgedreven evaluatie.

## Volgende stap

- Security charter opstellen als product-facing doc (via separate idea doc).
- Runbook/checklist voor hardening in `docs/dev/security-hardening.md` concipiëren (niet nu, pas na akkoord).
- Minimale RLS-smoke-check-spike inschatten (tijd/impact).
- Beslissen of E2EE een Later-spoor wordt of op Next komt als Private-tier-enabler.
