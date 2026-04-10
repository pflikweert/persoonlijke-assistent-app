# Design System Strategy: The Quiet Curator

## 1. Creative North Star

This product is a capture-first personal thinking tool.

It treats personal reflections as high-quality content, but it is not a static editorial product, a dashboard, a coach, or a chat interface.

The user should feel: I can start immediately, and the app will keep the rest calm.

## 2. Operational Guardrails

These rules are part of the foundation, not just implementation notes.

- Clean-first is the default: use spacing, hierarchy, typography and tonal contrast before adding containers.
- Borders, strokes, outlines, extra fills and nested surfaces are opt-in only.
- Plain text wrappers stay transparent by default.
- Top navigation is navigation only; title and supporting copy live in the hero below the nav by default.
- Header, page and footer form one coherent theme hierarchy per mode.
- Dark and light mode share the same composition; dark mode must not become the implicit source of truth.
- Background modes are mode-aware and selective: `ambient`, `subtle` and `flat`.
- Auth atmosphere comes from code-based page background and spacing, not heavy enclosing cards.
- Design refs remain binding per screen; if a screen ref folder has a `.md` note, use it next to `code.html` and `screen.png`.

## 3. Product Hierarchy

Today is the main entry point.

- Primary CTA gets the strongest visual priority.
- Recent context is lightweight and scannable.
- Reflection previews are secondary.
- No competing primary actions on one screen/state.
- Capture screens prioritize obvious affordances over atmosphere.

Visual attention model:

- Hero + CTA: about 70%.
- Recent context: about 20%.
- Reflection preview: about 10%.

## 4. Tokens And Tonal Architecture

`theme/tokens.ts` is the only implementation token source.

Core light surfaces:

- `background`: `#FAF9F4`
- `surfaceLow`: `#F4F3F0`
- `surface`: `#EFEEEB`
- `surfaceLowest`: `#FFFFFF`
- `surfaceHigh`: `#E9E8E5`

Core dark surfaces:

- `background`: `#171714`
- `surface`: `#201F1C`
- `surfaceLow`: `#2B2925`
- `surfaceLowest`: `#34322D`
- `surfaceHigh`: `#262521`

Primary action:

- Light CTA gradient: `#F0C115` → `#E6B800`
- Dark CTA gradient: `#F3C53A` → `#D7A91B`
- Primary color is reserved for the main action and key interaction moments.

Destructive soft treatment:

- Light: `#F6E8E5`, text `#C62929`, border `#ECC1BF`
- Dark: `#4B2D2B`, text `#FFB4AB`, border `#7E5A56`

Tab bar:

- Light base token: `#FAF9F6EE`
- Dark base token: `#171714EE`
- Implementation may use slightly tuned translucent surfaces, but must stay mode-aware.

## 5. Background Hierarchy

Page atmosphere is selective, not global.

- `ambient`: auth, splash/loaders, processing states, hero-first and empty states.
- `subtle`: screens that need warmth without visible atmosphere.
- `flat`: capture and content-heavy/utility/detail screens.

Header and footer are structural anchors. They stay calmer than the page background and must not carry decorative ambient gradients.

Dark mode is not the implicit visual truth. Light and dark mode share composition; only tone, contrast and surface values shift.

## 6. Header And Hero System

Top navigation is navigation only.

- Main-screen header: nav row with primary icon/menu, hero below.
- Detail-screen header: back/menu row, compact hero below.
- Page title and supporting copy belong in the hero by default.
- Do not press titles next to back buttons unless the screen ref explicitly shows it.
- Header, page and footer must form one coherent theme hierarchy per mode.

## 7. Layout And Spacing

Use flow, not stacked cards.

- Standard content gap: `32px` (`spacing.content`).
- Section labels sit on the page background unless a screen ref explicitly shows a section surface.
- Whitespace supports hierarchy and clarity, not decoration.
- Avoid equal-weight blocks that make every element feel equally important.

## 8. Component Weight Rules

Cards are not the default layout system.

Use cards only when grouping or interaction containment is required.

- Rows/cards stay compact and light.
- No default decorative borders, strokes or outlines.
- No extra fills behind plain text wrappers.
- No nested surfaces unless the design ref explicitly shows them.
- Separation comes first from spacing, tonal contrast, typography and hierarchy.
- Destructive rows may use accent, but should remain calm and no heavier than needed.

Allowed functional fills include chips, badges, buttons, inputs, textareas, alerts, toasts and tagged status surfaces.

## 9. Auth And Modal Rules

Auth screens may use page-level atmosphere from code-based background layering and spacing.

- Avoid heavy enclosing auth cards unless a design ref explicitly requires one.
- Prefer code-based gradients over image backgrounds when they are calmer and more consistent.
- Copy should be compact: hero + action + small notice is preferred over repeated explanation.

Modals, sheets, dialogs and popups use the shared backdrop standard. Do not create ad hoc backdrop treatments per screen.

## 10. Typography

Use the implementation roles from `theme/tokens.ts`.

Key roles:

- `screenTitle`: 34 / 40, weight 700
- `sectionTitle`: 20 / 26, weight 600
- `body`: 16 / 26, weight 400
- `bodySecondary`: 15 / 24, weight 400
- `caption`: 12 / 18, weight 500
- `meta`: 11 / 16, weight 600
- `ctaLabel`: 16 / 20, weight 700

Typography should feel calm and readable. Labels are used sparingly.

## 11. Motion

Motion guides attention and reinforces hierarchy.

Use:

- soft transitions
- micro feedback on the primary CTA
- subtle completion feedback

Avoid:

- flashy animation
- motion that competes with capture clarity

## Final Principle

Every screen must answer:

- What should the user do now?
- Is that instantly obvious?
- Does it feel calm, coherent and premium in both light and dark mode?

If not: simplify further.
