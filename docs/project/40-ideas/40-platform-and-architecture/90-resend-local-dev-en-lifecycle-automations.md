# Resend local dev en lifecycle automations

## Status

idea

## Type

platform-architecture

## Horizon

next

## Korte samenvatting

Leg een expliciet idee-spoor vast voor production email via Resend, met twee doelen:

1. een betrouwbare lokale development/testflow voor Resend binnen de huidige local development stack
2. een later uit te werken lifecycle/automation-spoor voor eventgedreven emails, zoals een eerste welkomstmail na aanmelding

Dit idee is nu nog geen bouwtaak en nog geen actieve planning. Het is bedoeld als denk- en uitwerkbasis voor verdere verkenning met ChatGPT.

## Probleem

- Resend wordt gebruikt voor production email, maar er is nog geen duidelijke lokale dev/testaanpak in de repo-workflow.
- Daardoor ontbreekt een veilige en goedkope manier om emailflows lokaal te ontwikkelen, bekijken en valideren zonder meteen op productiegedrag of handmatige workarounds te leunen.
- Er is ook nog geen uitgewerkt plan voor lifecycle emails en eventgedreven triggers, terwijl zulke flows waarschijnlijk relevant worden zodra onboarding en gebruikerscommunicatie volwassener worden.
- Zonder expliciet idee-spoor blijft emailinfrastructuur versnipperd tussen auth-mail, productmail en mogelijke marketing/lifecycle-berichten.

## Waarom interessant

- Lokale email-dev/testing verlaagt frictie en risico bij elke flow die production emails raakt.
- Een duidelijke Resend-strategie voorkomt dat onboarding- of lifecyclemails ad hoc worden toegevoegd zonder goede triggerlogica, copy en testaanpak.
- Het sluit aan op een logische groeilaag voor Budio: eerste ervaring na signup, re-engagement, statusmails en later mogelijk AIQS/admin-signalen.
- Door dit eerst als idee vast te leggen kan het later in ChatGPT verder worden uitgedacht zonder nu al product- of architectuurwaarheid te promoten.

## Richting van dit idee

### 1. Resend in local development

Mogelijke verkenningsrichting:

- definieer een expliciete local-only emailmodus voor development
- kies een testpad dat veilig is en geen echte gebruikers mailt
- maak zichtbaar waar uitgaande mails landen tijdens lokaal testen
- leg vast hoe developers emailtemplates en payloads lokaal kunnen controleren
- bepaal of lokale flows via Resend zelf, een mock/test transport of een hybride previewpad lopen

Belangrijke gedachte:

- lokale email-dev moet cheap-first zijn
- productiekeys en echte ontvangers mogen nooit per ongeluk in lokaal testen terechtkomen
- de dev-flow moet passen binnen bestaande repo- en env-guardrails

### 2. Lifecycle automations en triggers

Mogelijke verkenningsrichting:

- eerste mail na eerste succesvolle aanmelding
- onboarding-/welkomstserie met kleine, rustige productintroductie
- eventgedreven mails op betekenisvolle productmomenten
- expliciete triggerkaart: welk event, welke doelgroep, welke copy, welke cooldown, welke stopvoorwaarden
- onderscheid tussen transactionele mail, lifecycle mail en latere marketingmail

Voorbeelden om later te verkennen:

- welkom na eerste signup
- nudge wanneer account wel bestaat maar eerste kernactie uitblijft
- bevestiging of follow-up na belangrijke account- of importactie
- founder/admin-only signalen voor interne operationele flows

## Relatie met huidige docs

- Past binnen `40-platform-and-architecture/` omdat het zowel local dev stack als production email-infra en triggerarchitectuur raakt.
- Moet nu nog niet doorstromen naar canonieke productdocs of actieve planning.
- Kan later raakvlakken krijgen met auth, onboarding, growth en admin-operations, maar die beslissingen horen pas na verdere uitwerking thuis in planning of tasks.

## Mogelijke impact

- services
- supabase
- docs
- platform
- internal-tooling
- growth

## Open vragen

- Wat is de veiligste en goedkoopste lokale teststrategie voor Resend in deze repo?
- Willen we lokaal een echte Resend testflow, een mock inbox, of beide?
- Welke events zijn in fase 1 logisch genoeg voor lifecycle email, en welke zijn duidelijk nog te vroeg?
- Wat is het onderscheid tussen productkritische transactional mail en latere engagement/lifecycle mail?
- Waar hoort triggerlogica uiteindelijk thuis: app/backend events, database triggers, cron/automationlaag, of Resend-native automation?
- Welke copy/tone-of-voice guardrails gelden voor onboarding- en lifecyclemails binnen Budio?
- Hoe voorkomen we dat email-automation scope creep wordt terwijl de huidige productfase nog compact moet blijven?

## Volgende stap

- Gebruik dit idee als input voor verdere verkenning in ChatGPT Projects.
- Werk daarna pas, indien zinvol, een compacte optieset uit voor:
  - local dev/test aanpak
  - eerste lifecycle-events
  - architectuurkeuze voor triggers/automations
- Promoveer pas daarna eventueel naar planning of één of meer concrete tasks.
