# Page Brief: Communication Profiles

> Layout: LIST-SIMPLE
> Inventory #: 34
> Tier: T1
> Source: Live platform screenshot 2026-03-18

## Shell

| Element | Value |
|---|---|
| Side Menu section | SETTINGS |
| Breadcrumb | Communication Profiles (single level — use `Left - Breadcrumb Navigation/1` `134:84755`) |
| Page title | Communication Profiles |
| Main CTA | New Communication Profile |
| Header right | Info icon (circle-i) + CTA grouped in `Frame 1513` |

## Content

**Search:** No
**Tabs:** None
**Toolbar:** None
**Filter tags:** None

**Columns:**

| # | Header | Width | Cell Type | Notes |
|---|---|---|---|---|
| 1 | Status | 80px | Custom (green dot, 10px ellipse) | All rows show green active dot |
| 2 | Preview | 100px | Custom (Flag component, 32px) | Country flag from Flag set `97:71963` |
| 3 | Name | FILL | Text | Language name, e.g. "English (UK)" |
| 4 | Language | FILL | Text | Locale code, e.g. "en-GB" |
| 5 | Unsubscribe Base URL | FILL | Text | Shows "STOP" (link text) |

**No ellipsis/action column.**

**Sample rows (from live platform):**

| Status | Flag | Name | Language | URL |
|---|---|---|---|---|
| green | united kingdom | English (UK) | en-GB | STOP |
| green | germany | German (Germany) | de-DE | STOP |
| green | finland | Finnish (Finland) | fi-FI | STOP |
| green | sweden | Swedish (Sweden) | sv-SE | STOP |
| green | japan | Japanese (Japan) | ja-JP | STOP |
| green | italy | Italian (Italy) | it-IT | STOP |
| green | spain | Spanish (Spain) | es-419 | STOP |
| green | romania | Romanian (Romania) | ro-RO | STOP |
| green | norway | Norwegian (Norway) | no-NO | STOP |
| green | france | French (France) | fr-FR | STOP |

**More rows below fold. Pagination at bottom (Type=go to page).**

## Custom Cell Patterns

**Status cell:** Wrapper frame (80x60, centered), 10px green ellipse (`{ r: 0.2, g: 0.78, b: 0.35 }`).
**Preview cell:** Wrapper frame (100x60, centered), Flag instance scaled to 32px width.
**Zebra:** ODD rows = `#FAFAFA`, EVEN rows = no fill.
