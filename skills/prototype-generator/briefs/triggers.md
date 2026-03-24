# Page Brief: Triggers

> Layout: LIST-SIMPLE
> Inventory #: 8
> Tier: T1
> Figma node: `134:89784`
> Last verified against live: 2026-03-18

## Shell

| Element | Value |
|---|---|
| Side Menu section | CRM |
| Breadcrumb | Single-level (Nav/1): "Triggers" |
| Page title | Triggers |
| Main CTA | Add Trigger |
| Right-side icons | Hidden |

## Content

**Search:** Yes (in Panel Header, right-aligned)
**Tabs:** None
**Toolbar:** None
**Filter tags:** None
**Pagination:** None visible

**Panel Header:**
- Title: "Triggers"
- Subtitle: "Create and manage your triggers"
- Search: enabled (icon button variant)

**Columns (from live page — differs from original draft):**

| # | Header | Width | Cell Type | Notes |
|---|---|---|---|---|
| 1 | Id | 80px FIXED | Text | Sort icon active (down arrow) |
| 2 | Name | FILL | Text | Primary identifier |
| 3 | Event | FILL | Text | Event type name |
| 4 | Activities | 120px FIXED | Text | Number or red "x" for zero |

**Row styling:**
- Zebra striping — alternating EVEN (white) / ODD (#FAFAFA gray) rows
- Activities "x" values colored red (rgb 0.87, 0.25, 0.25)

**Sample rows (from live data):**

| Id | Name | Event | Activities |
|---|---|---|---|
| 4805 | IT Ping Trigger | Enriched IT Ping Event | x |
| 4692 | Send @ 20:00 | Time Event | x |
| 4691 | Send @ 18:00 | Time Event | 1 |
| 4690 | Send @ 16:00 | Time Event | x |
| 4689 | Send @ 14:00 | Time Event | x |
| 4688 | Send @ 12:00 | Time Event | x |
| 4543 | Deposit of €100+ | Payment | x |
| 4542 | Deposit of €50+ | Payment | 1 |
| 4541 | Deposit of €30+ | Payment | x |
| 4540 | Deposit of €20+ | Payment | x |
| 4539 | Deposit of €10+ | Payment | 16 |
| 5 | Successful Registration | Registration | x |
| 2 | Successful Deposit | Payment | x |

## Construction Learnings

- **Zebra striping**: Always use EVEN/ODD alternation — this is the platform default for all list pages.
- **Red text for "no data" indicators**: Activities column uses red "x" instead of a tag or empty cell. Override fill on text node: `{ r: 0.87, g: 0.25, b: 0.25 }`.
- **Minimal header**: No CTA buttons, no right-side icons — just breadcrumb. Set `primaryAxisAlignItems = 'MIN'` on Page Header for left-alignment. Hide `Right - CTA and icons` entirely.
- **Search input HUG**: Set Input Fields search instance to `layoutSizingHorizontal = 'HUG'` so it doesn't overflow the panel boundary. Don't use FIXED width on the search.
- **Panel 1700px**: Standard Panel is 1700px FIXED — this is the max canvas width for FT pages. Don't use FILL on the panel.
- **Content area padding**: Frame 1317 gets 32px padding all sides + gray fill (#F5F5F5) to match the real platform's gray margin around the panel.
