# Page Brief: Integration Settings

> Layout: HUB
> Inventory #: 9
> Tier: Cold Verification

## Shell

| Element | Value |
|---|---|
| Side Menu section | SETTINGS |
| Breadcrumb L1 | Integration Settings |
| Page title | Integration Settings |
| Main CTA | — (none) |

## Content

### HUB layout:

**Panels:** 3 panels, white background, no stroke, cornerRadius 0.

**Panel 1: Tools & Guides**
Subtitle: "All you need for integration"

| Card | Title | Description |
|---|---|---|
| 1 | Integration Hub | Validate and test your integration |
| 2 | API Docs | Full reference for all endpoints |
| 3 | Developer Guide | Step-by-step guides and tutorials |

**Panel 2: Migrations**
Subtitle: "Move data from legacy systems"

| Card | Title | Description |
|---|---|---|
| 1 | Migrations Wizard | Import players and history |
| 2 | Data Validator | Verify migration integrity |

**Panel 3: Greco**
Subtitle: "FastTrack Greco integration"

| Card | Title | Description |
|---|---|---|
| 1 | Greco Settings | Configure Greco connection |

## Construction Notes

- No CTA button in header — pure navigation page
- Content placeholder has NO padding, NO fill — Card Row handles padding
- Cards use `card-markets` (`92:46824`) component, type=default, state=default
- Each panel's content placeholder must be FILL width (HUG breaks card layout)
- Card text override: title via Bold node inside `Frame 1388`, description via text node inside card frame
- Hide main Flag on cards if not needed
- Card width: FILL (distributed equally across row)
- Icons not required (card-markets handles its own icon/image area)

## Clone Source

| Template | Node ID | Customization needed |
|---|---|---|
| — | — | Build from components (no clone available) |
