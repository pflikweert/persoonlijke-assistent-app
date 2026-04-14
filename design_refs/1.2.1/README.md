# MVP 1.2.1 — Screen Ref Mapping

Deze map bevat bindende screen-level refs voor implementatie.

## Nieuw gekozen branded refs (huidige handoff)
- `auth_branded/` — branded auth referentie.
- `today_branded_header/` — branded Today main-screen header referentie.
- `fullscreen_menu_branded/` — branded fullscreen menu referentie.

## Bestaande refs blijven geldig
- Bestaande `1.2.1` schermmappen blijven bruikbaar zolang ze niet expliciet vervangen zijn.
- `ethos_ivory/DESIGN.md` blijft de foundation-bron.

## Header-modus mapping
- `main-screen header`: Today (`today_branded_header`), fullscreen menu context (`fullscreen_menu_branded`).
- `detail-screen header`: task/detail/subscreens; niet vervangen door de Today-header ref.

## Scopeguard
- Deze refs zijn voor visuele mapping en implementatie-aansturing.
- Geen impliciete uitbreiding naar capture/detail/post-entry/reflectie zonder expliciete opdracht.
