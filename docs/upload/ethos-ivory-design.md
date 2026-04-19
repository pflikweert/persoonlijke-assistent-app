# Budio Vandaag — Design System Handoff (MVP)

## 1. Purpose

This document is a standalone design-system handoff for Budio Vandaag.

It exists to keep Stitch output consistent without relying on hidden context.

Use this document as explicit design truth for screen generation, refinement, and brand alignment.

---

## 2. Product Position

Budio Vandaag is a capture-first journaling product.

It is:

- a fast, calm personal thinking tool

- focused on capturing today

- designed for quiet continuity and readable reflection

It is not:

- a dashboard

- a coach

- a chat interface

- an AI-branded product

- an analytics product

Core rule:

the product must help the user start quickly, not admire the interface.

---

## 3. Brand Rules

Parent brand:

- Budio

Product brand:

- Budio Vandaag

In-app shorthand:

- Vandaag

Rules:

- use **Budio Vandaag** for explicit product branding

- use **Vandaag** only as an in-app shorthand or screen context

- do not invent alternative product names

- do not introduce sub-brands

- do not use “Quiet Curator” as a visible brand or system name

- do not invent a new logo or symbol unless explicitly requested

Brand feeling:

- calm

- warm

- editorial

- premium but simple

- understated, never loud

---

## 4. Today Screen Hierarchy

Today is an entry point, not a reading-first screen and not a dashboard.

Rules:

- one dominant primary CTA per screen or state

- primary CTA gets most of the visual attention

- no competing primary action

- reflection is always secondary on Today

- recent context stays lightweight and scannable

Priority model:

1. hero + primary action

2. recent context

3. reflection preview

User feeling:

“I can start immediately.”

---

## 5. Capture Rules

Capture is a core system, not a decorative surface.

Capture must feel:

- obvious

- fast

- calm

- low-friction

### Idle state

- mic is the primary action

- typing is clearly available

- the user understands immediately what to do

### Voice state

- clear recording feedback

- primary action: stop / klaar

- secondary action: annuleer

- no pause

- no live transcript

- no editing tools

### Typing state

- large text area

- keyboard-first

- clear save or complete action

- no formatting toolbar

- no visual noise

- no multiple competing actions

---

## 6. Navigation and Shell Rules

Top navigation is navigation-only.

Rules:

- page titles do not dominate the top bar

- supporting copy belongs below the top navigation

- title and supporting copy usually live in a hero below the nav

- use two header modes:

- main screen header

- detail screen header

- header, page, and footer must feel like one coherent system

Avoid:

- oversized branded mastheads

- title jammed next to a back button unless truly necessary

- decorative nav gradients

- heavy shell chrome

---

## 7. Background Modes

Background treatment is selective, not global.

Use these three modes:

### Ambient

Use for:

- auth

- splash

- loaders

- processing states

- Today

- hero-first screens

- empty states

Characteristics:

- warm atmosphere

- subtle depth

- calm, not flashy

- editorial and premium through restraint, not decoration

Implementation recipe:

Light mode:

- Base: `#FAF9F4`

- Layer 1 (radial): `radial-gradient(120% 90% at 20% 0%, #FFFFFF 0%, #FAF9F4 52%, #F1EEE6 100%)`

- Layer 2 (vertical glow): `linear-gradient(180deg, rgba(230, 184, 0, 0.12) 0%, rgba(230, 184, 0, 0) 42%, rgba(214, 194, 152, 0.18) 100%)`

- Optional atmosphere grain: `rgba(255, 255, 255, 0.14)` at very low opacity

Dark mode:

- Base: `#171714`

- Layer 1 (radial): `radial-gradient(130% 95% at 20% -10%, #2A2823 0%, #1C1B18 48%, #171714 100%)`

- Layer 2 (vertical glow): `linear-gradient(180deg, rgba(243, 197, 58, 0.14) 0%, rgba(243, 197, 58, 0) 46%, rgba(92, 85, 72, 0.24) 100%)`

- Optional vignette: `rgba(0, 0, 0, 0.16)` from bottom edge only

Rules:

- Keep the visible atmosphere to a soft upper light pool and a restrained vertical veil.

- Do not add diagonal spotlight effects, loud multi-color glows, or decorative shell drama.

- Today and auth can share this ambient recipe; detail, capture, and settings-like flows should not inherit it by default.

### Subtle

Use for:

- overlays

- light support screens

- places that need warmth without obvious atmosphere

Characteristics:

- restrained

- quiet

- nearly flat, but not cold

- warmer and richer than flat, but clearly less atmospheric than ambient

Implementation recipe:

Light mode:

- Base: `#FAF9F4`

- Soft blend: `linear-gradient(180deg, #FAF9F4 0%, #F4F3F0 100%)`

- Accent veil (optional): `rgba(230, 184, 0, 0.05)` at top 20-30%

Dark mode:

- Base: `#171714`

- Soft blend: `linear-gradient(180deg, #171714 0%, #1D1B18 100%)`

- Accent veil (optional): `rgba(243, 197, 58, 0.055)` at top 20-30%

Rules:

- Subtle is not a weaker ambient spotlight.

- Avoid visible radial light-pool behavior in subtle mode.

- Use subtle when the screen needs warmth and refinement without page-level atmosphere.

### Flat

Use for:

- capture

- content-heavy screens

- utility and detail screens

- day detail

- week or month detail

- settings-like screens

Characteristics:

- clear

- quiet

- minimal visual interference

- paper-soft rather than clinically flat

Implementation recipe:

Light mode:

- Primary flat base: `#FAF9F4`

- Paper-soft blend target: `#F7F5EE`

- Allow only an ultra-soft tonal blend when needed for calmness.

- Never let flat read as atmospheric or visibly gradient-led.

Rules:

- Flat should stay the quietest background mode in the system.

- Detail, capture, settings and content-heavy routes should prefer this mode by default.

- Full-page routes should use the shared background foundation unless they are special shell or overlay wrappers.

Dark mode:

- Primary flat base: `#171714`

- Paper-soft blend target: `#1A1916`

- No background gradients

Rules:

- dark mode must not become heavier than light mode

- never reuse a dark ambient treatment unchanged in light mode

- capture prioritizes clarity over atmosphere

- content-heavy screens stay flatter than entry screens

- use one background mode per screen state; avoid mixing ambient and flat on the same page

---

## 8. Color System

The palette is warm, neutral, soft, and paper-like.

### Core surfaces — Light

- Background: `#FAF9F4`

- Surface low: `#F4F3F0`

- Surface: `#EFEEEB`

- Surface lowest: `#FFFFFF`

- Surface high: `#E9E8E5`

### Core surfaces — Dark

- Background: `#171714`

- Surface: `#201F1C`

- Surface low: `#2B2925`

- Surface lowest: `#34322D`

- Surface high: `#262521`

### Text and supporting tones

Light:

- Text: `#1B1C1A`

- Muted: `#4E4633`

- Muted soft: `#736A56`

Dark:

- Text: `#F4F1E8`

- Muted: `#D4CCBB`

- Muted soft: `#B5AD9B`

### Primary accent

Light:

- Primary: `#E6B800`

- Primary strong: `#E6B800`

- Primary on: `#241A00`

Dark:

- Primary: `#F3C53A`

- Primary strong: `#E9B91F`

- Primary on: `#241A00`

### Primary CTA gradient

Light:

- `#F0C115` → `#E6B800`

Dark:

- `#F3C53A` → `#D7A91B`

### Borders and separators

Light:

- Border: `#D1C5AC`

- Separator: `#DED6C4`

Dark:

- Border: `#4F493E`

- Separator: `#5C5548`

### Tabs

Light:

- Tab bar background: `#FAF9F6EE`

- Active: `#745B00`

- Inactive: `#736A56`

Dark:

- Tab bar background: `#171714EE`

- Active: `#F3C53A`

- Inactive: `#B5AD9B`

### Status colors

Light:

- Info: `#395F94`

- Success: `#1B6D24`

- Error: `#BA1A1A`

Dark:

- Info: `#A7C8FF`

- Success: `#A3F69C`

- Error: `#FFB4AB`

### Destructive soft colors

Light:

- Background: `#F6E8E5`

- Text: `#C62929`

- Border: `#ECC1BF`

Dark:

- Background: `#4B2D2B`

- Text: `#FFB4AB`

- Border: `#7E5A56`

Rules:

- use **primary accent** as the reserved highlight color

- primary accent is mainly for the primary CTA and small emphasis moments

- do not flood screens with the primary accent

- tonal hierarchy matters more than saturation

- surfaces stay calm; emphasis stays deliberate

---

## 9. Typography

Typography should feel calm, readable, and functional.

Families:

- Sans: Inter on web, system-based sans on native

- Serif: reserved, not default

- Rounded: not a visual theme

- Mono: utility only

Style:

- editorial in tone

- practical in use

- never techy

- never loud

### Type roles

- Display title: `38 / 44`, weight `700`, letter spacing `-0.9`

- Screen title: `34 / 40`, weight `700`, letter spacing `-0.5`

- Section title: `20 / 26`, weight `600`, letter spacing `-0.2`

- Body: `16 / 26`, weight `400`, letter spacing `-0.1`

- Body secondary: `15 / 24`, weight `400`, letter spacing `-0.1`

- Caption: `12 / 18`, weight `500`, letter spacing `0.2`

- Meta: `11 / 16`, weight `600`, letter spacing `1.1`

- CTA label: `16 / 20`, weight `700`, letter spacing `0.2`

Rules:

- readability over visual cleverness

- labels are used sparingly

- avoid UI-heavy label noise

- on capture and entry screens, clarity wins over editorial flourish

- long text belongs in reading contexts, not in entry-first screens

- use the display title role only for hero-first screens such as Today and auth

- do not imitate Spotify branding, licensed fonts or Spotify-specific type behavior

---

## 10. Spacing

Spacing supports hierarchy, not decoration.

### Core spacing

- xxs: `2`

- xs: `4`

- sm: `8`

- md: `12`

- lg: `16`

- xl: `24`

- xxl: `32`

- xxxl: `40`

### Layout spacing

- Page: `24`

- Content: `32`

- Section: `32`

- Cluster: `12`

- Inline: `8`

Rules:

- use spacing to clarify importance

- do not add empty space without purpose

- do not solve hierarchy with boxes first

- section labels usually sit on the page background

- keep scanability high

---

## 11. Radius, Borders, and Depth

### Radius

- Small: `8`

- Medium: `12`

- Large: `16`

- Extra large: `24`

- Pill: `999`

### Borders

- Hairline: platform hairline

- Subtle: `1`

Rules:

- borders are allowed, but not default

- strokes, outlines, fills, and nested surfaces are opt-in

- plain text wrappers stay transparent by default

- rows and cards stay light

- avoid stacked heavy surfaces

- avoid decorative borders as a default pattern

### Depth

Default depth is subtle.

Surface shadow:

- soft depth only

- used sparingly

- supports hierarchy, not decoration

CTA shadow:

- stronger than normal surfaces

- reserved for primary CTA emphasis

- still calm, never flashy

Auth:

- auth atmosphere may come from page background and spacing

- avoid heavy enclosing auth cards unless truly necessary

---

## 12. Sizing and Touch Targets

Use consistent sizing for interaction clarity.

### Core sizing

- CTA height: `56`

- Compact CTA height: `44`

- Input minimum height: `48`

- Text area minimum height: `140`

- Icon small: `16`

- Icon medium: `20`

- Icon large: `24`

- Touch target minimum: `44`

Rules:

- primary actions should feel comfortably pressable

- compact controls still respect touch target rules

- icons support clarity, not decoration

---

## 13. Component Rules

### Primary CTA

This is the most important component in the product.

It must feel:

- pressable

- warm

- premium

- inviting

- clear

Rules:

- only one primary CTA per screen or state

- use the primary CTA gradient for the main action

- it should dominate without becoming loud

- include icon support only if it improves clarity

- do not create multiple equally loud actions

- preferred shape is pill or strongly rounded

### Secondary actions

Rules:

- visually quieter than the primary CTA

- never compete with the primary action

- kept compact and clear

### Cards

Rules:

- cards are not the default layout system

- use cards only when containment or grouping is truly needed

- do not stack multiple similar cards as the main page pattern

### Lists

Rules:

- prefer lightweight lists over card stacks

- optimize for scanability

- keep previews short

### Reflection preview

Rules:

- compact

- secondary

- calm

- never the hero on Today

### Modals and sheets

Rules:

- one calm shared behavior

- no ad-hoc popup styling

- destructive confirmations stay calm and controlled

---

## 14. Motion

Motion supports hierarchy and feedback.

### Duration

- Fast: `140ms`

- Normal: `220ms`

- Slow: `320ms`

### Easing

- Standard: `[0.2, 0, 0, 1]`

- Entrance: `[0.16, 1, 0.3, 1]`

- Exit: `[0.4, 0, 1, 1]`

Allowed:

- subtle transitions

- CTA feedback

- gentle completion feeling

- quiet state changes

Not allowed:

- flashy animation

- decorative motion that distracts from action

- movement of interactive controls as part of decorative motion

Rule:

buttons, inputs, and other interactive elements must not visually move around because of decorative motion.

---

## 15. Content and Copy Direction

Copy should feel:

- short

- human

- direct

- calm

Do:

- make the next action obvious

- keep copy compact

- use concrete language

- keep reflection language quiet and secondary

Do not:

- use AI buzzwords

- use coach language

- use productivity language

- over-explain

- repeat the same instruction multiple times

Preferred direction:

- action first

- today is central

- reflection supports, but does not lead

Useful default copy:

- “Leg iets vast”

- “Spreek of schrijf iets”

- “Je hebt vandaag nog niets vastgelegd.”

- “Dit is je dag tot nu toe.”

- “Vandaag bijgewerkt”

---

## 16. Do / Don’t

### Do

- keep the product capture-first

- make the primary action obvious

- keep the shell calm

- use clean-first composition

- keep the primary accent reserved and hierarchical

- make lists lightweight

- keep reflection secondary on entry screens

- make dark mode as calm as light mode

### Don’t

- do not design dashboards

- do not create chat-like UI

- do not make reflection the hero on Today

- do not overuse the primary accent

- do not default to stacked cards

- do not add visual mass to solve hierarchy

- do not invent extra brand symbols

- do not make auth feel heavy

- do not let decorative motion move interactive controls

---

## 17. Definition of Done

A screen direction is only ready when:

- the product hierarchy is obvious

- the primary action is clear

- the brand is consistent

- the screen feels buildable

- the composition is calm in light and dark mode

- the design does not add complexity without improving clarity, speed, or calm

Final rule:

if something adds complexity without improving clarity, speed, or calm, it does not belong.
