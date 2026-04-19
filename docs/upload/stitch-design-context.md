# DO NOT EDIT - GENERATED FILE

# Stitch Design Context

Build Timestamp (UTC): 2026-04-19T21:55:17.808Z
Source Commit: 361182d

Doel: compacte Stitch/implementation handoff om design drift te beperken zonder alle projectdocs te dupliceren.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Bronbestanden (vaste volgorde)
- docs/design/mvp-design-spec-1.2.1.md
- design_refs/1.2.1/ethos_ivory/DESIGN.md
- theme/tokens.ts
- AGENTS.md
- .agents/skills/ui-implementation-guardrails/SKILL.md
- .agents/skills/stitch-redesign-execution/SKILL.md
- design_refs/1.2.1/auth_branded/DESIGN.md
- design_refs/1.2.1/entry_voltooid/DESIGN.md
- design_refs/1.2.1/fullscreen_menu overlay/DESIGN.md
- design_refs/1.2.1/fullscreen_menu_branded/DESIGN.md
- design_refs/1.2.1/journal_entry_iconic_result/DESIGN2.md
- design_refs/1.2.1/README.md
- design_refs/1.2.1/today_branded_header/DESIGN.md

## Handoff Samenvatting
- Capture-first blijft leidend: de app is een snelle, rustige persoonlijke thinking tool, geen dashboard of chatinterface.
- Today is een entry point: de primaire CTA krijgt de meeste visuele aandacht; reflectie en recente context blijven secundair.
- Clean-first UI: spacing, typografie, hiërarchie en tonal contrast gaan vóór extra containers.
- Borders, fills, nested surfaces en text-wrapper fills zijn opt-in en alleen functioneel of design-ref-gedekt.
- Topnav is navigation-only; paginatitel en supporting copy staan standaard in een hero onder de nav.
- Dark en light mode delen dezelfde compositie; dark mode is niet de impliciete visuele waarheid.
- Background modes zijn mode-aware: ambient, subtle en flat worden selectief ingezet per schermtype.
- Auth sfeer komt uit page-level background + spacing; vermijd zware enclosing auth cards.
- Header, page en footer vormen per mode één coherent geheel; header/footer blijven rustiger dan de page.

## Current Token Snapshot
Afgeleid uit `theme/tokens.ts`; die file blijft de enige tokenbron.

- Light core surfaces: background #FAF9F4, surfaceLow #F4F3F0, surface #EFEEEB, surfaceLowest #FFFFFF, surfaceHigh #E9E8E5.
- Dark core surfaces: background #171714, surface #201F1C, surfaceLow #2B2925, surfaceLowest #34322D, surfaceHigh #262521.
- Primary / CTA gradient: light #F0C115 -> #E6B800; dark #F3C53A -> #D7A91B.
- Tab bar background tokens: light #FAF9F6EE; dark #171714EE.
- Destructive soft colors: light #F6E8E5 / #C62929 / #ECC1BF; dark #4B2D2B / #FFB4AB / #7E5A56.
- Key spacing: page 24, content 32, section 32, cluster 12, inline 8.
- Key type roles: screenTitle 34/40, weight 700; sectionTitle 20/26, weight 600; body 16/27, weight 400; bodySecondary 15/24, weight 400; meta 11/16, weight 600; ctaLabel 16/20, weight 700.

## Per-page Markdown Refs
Deze markdown refs onder `design_refs/1.2.1/**` zijn meegenomen als aanvullende design input wanneer aanwezig.

- design_refs/1.2.1/auth_branded/DESIGN.md
- design_refs/1.2.1/entry_voltooid/DESIGN.md
- design_refs/1.2.1/fullscreen_menu overlay/DESIGN.md
- design_refs/1.2.1/fullscreen_menu_branded/DESIGN.md
- design_refs/1.2.1/journal_entry_iconic_result/DESIGN2.md
- design_refs/1.2.1/README.md
- design_refs/1.2.1/today_branded_header/DESIGN.md

Gebruik de bronbestanden zelf voor volledige screen-specifieke details; deze generated handoff houdt alleen de verwijzingen compact bij.

## Design Guardrails
### Clean-first
- Default UI is clean-first.
- Use spacing, hierarchy, typography and tonal contrast before extra containers.
- Section labels sit on the page background unless a design ref explicitly shows a surface.
- Rows and cards stay light; avoid excessive height, padding and visual mass.
- Decorative borders, extra inner fills and nested surfaces are opt-in, not default.

### Dark Mode
- Dark mode preserves the structure and calm of the light design ref.
- Do not solve dark mode by adding extra mass, extra panels or heavier containers.
- Shift tone and contrast; keep composition lightweight.

### Background Modes
- Page atmosphere is selective, not global.
- Background modes are mode-aware; never apply a dark ambient treatment unchanged in light mode.
- Use three background modes:
  - `ambient`: auth, splash/loaders, processing states, Today, hero-first and empty states.
  - `subtle`: supporting overlays and screens that need light warmth without visible atmosphere.
  - `flat`: capture screens and content-heavy/utility/detail screens.
- Ambient uses a warm base, a soft upper light pool and a restrained vertical veil.
- Ambient should feel calm and premium, not decorative or brand-loud.
- Today is ambient by default because it is a hero-first entry screen.
- Auth may share the same ambient recipe; utility/detail/settings-like screens stay flatter.
- `subtle` is a warm support layer, not a weaker ambient spotlight.
- `subtle` may use a restrained tonal blend and faint top warmth, but should avoid visible radial atmosphere.
- `flat` may use paper-soft tonal blending, but must still read as visually the quietest mode.
- `flat` must never feel decorative, atmospheric or visibly gradient-first.
- Capture screens (`idle`, `voice`, `typing`) prioritize clarity; avoid visible ambient gradients.
- Content-heavy screens (day detail, week/month detail, settings-like utility flows) stay flatter.
- Header and footer remain calmer than page content and never carry decorative ambient gradients.
- Header, page and footer must form one coherent theme hierarchy in both light and dark mode.
- Full-page routes should use the shared background-mode foundation consistently unless they are a special modal, overlay or shell wrapper.

### Header + Hero
- Top navigation is navigation only.
- Page titles and supporting copy belong in a hero below the topnav by default.
- Use two header modes: main-screen header and detail-screen header.
- Do not press titles next to back buttons unless a design ref explicitly shows it.

### Surfaces + Auth
- Destructive treatments may use accent, but stay calm and no heavier than needed.
- Destructieve bevestigingen gebruiken altijd dezelfde modal/sheet component
- Shared primitives must not introduce default borders, fills or heavy surfaces.
- Auth atmosphere may come from background layering and spacing.
- Avoid heavy enclosing auth cards unless a design ref explicitly requires them.
- Prefer code-based gradients over image backgrounds when they are calmer and more consistent.

### Proof-first
- A design implementation is not “done” on code shape alone.
- Verify against relevant `design_refs/1.2.1/**` plus light and dark runtime behavior before calling it finished.
- If a `design_refs/1.2.1/**` screen folder contains a `.md` note, treat it as additional screen-level design input next to `code.html` and `screen.png`.

---

## Foundation Guardrails
- Zie `design_refs/1.2.1/ethos_ivory/DESIGN.md` voor foundation guardrails.

## Agent Workflow Notes
- `AGENTS.md` blijft de always-on workflowbron voor agents.
- Gebruik `docs/project/README.md` als docs-ingang voordat je generated output leest.
- Gebruik `docs/upload/**` alleen als uploadartefact, niet als canonieke bron.
- Check stylingwerk tegen `design_refs/1.2.1/**`, inclusief `.md` notes als die aanwezig zijn.

## Skill References
- `.agents/skills/ui-implementation-guardrails/SKILL.md` voor clean-first UI polish en regressiefixes.
- `.agents/skills/stitch-redesign-execution/SKILL.md` voor scherm-redesigns op basis van Stitch refs.
