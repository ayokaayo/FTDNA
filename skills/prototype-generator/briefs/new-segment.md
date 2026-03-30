# Page Brief: New Segment (Slide-In)

> Layout: SLIDEIN (LVL1)
> Inventory #: —
> Tier: Cold Verification
> Reference: `380:10986` (Activity Builder — gold standard for slide-in quality)
> Verified build: `401:177`

## Shell (Slide-in header `92:46212`)

| Element | Value |
|---|---|
| Close button | X (xmark) |
| ID tag | SEG-001 (green — `V.green200`) |
| Title breadcrumb | New Segment |
| Icon buttons (Frame 1505) | Hidden |
| Alt CTA | Hidden |
| Main CTA | Save |
| Kebab | Hidden |

## Content

### Background: mono-200 (`V.mono200` / #F5F5F5)

Each section is a **Standard Panel** — white fill, 8px radius, mono-300 border, 1px stroke.

**Panel 1: General**
Subtitle: "Enter the basic segment information"

| Field Label | Field Type | Variant | Default Value | Required? |
|---|---|---|---|---|
| Segment Name | Text input | default-filled | Reactivation Q1 2025 | Yes |
| Description | Text Area | default-filled | Target churned players from last 90 days who had deposits > €500 | No |

**Panel 2: Conditions**
Subtitle: "Define the rules for this segment"

| Field Label | Field Type | Variant | Default Value |
|---|---|---|---|
| Condition Type | Dropdown - Regular | default-filled | Player Feature |
| Feature | Dropdown - Regular | default-filled | Days since last deposit |
| Operator | Dropdown - Regular | default-filled | greater than |
| Value | Text input | default-filled | 90 |

Layout: First 3 dropdowns in a HORIZONTAL row (itemSpacing 16). Value input below, full width.

**Panel 3: Player Origins**
Subtitle: "Select which origins this segment applies to"

| Block Selector | Text Override (`"Origin name"` node) |
|---|---|
| 1 | Crazy Slots |
| 2 | Ultra Spins |
| 3 | Slots for Days |
| 4 | Betmania |
| 5 | Cazzzino |

Block Selectors: `91:8712`, variant `Unselected/Default`. Disable: `flag`, `Number`, `xmark`, `Toggle`, `Image`. Enable: `Icon` (smiley). Layout: HORIZONTAL wrap, itemSpacing 12, counterAxisSpacing 12. **Fixed width 360px per selector** (3 per row).

**Panel 4: Markets**
Subtitle: "Select target markets for this segment"

| Block Selector | Text Override (`"Origin name"` node) |
|---|---|
| 1 | Spain |
| 2 | Finland |
| 3 | Germany |
| 4 | New Zealand |
| 5 | Ontario (CA) |
| 6 | MGA |
| 7 | ROW |

Same as Origins but with `flag=true` and `Icon=false` (show flag only, not smiley). **Fixed width 360px per selector** (3 per row).

## Construction Notes

- **DO NOT clone templates** — build from scratch using header component `92:46212`
- Outer frame: `layoutMode='VERTICAL'`, `layoutSizingVertical='FIXED'`, then `resize(1250, 1300)`
- Background fill: `V.mono200` (NOT white — panels provide white)
- Content area (`Frame 1317`): transparent fills, 32px padding, 32px gap, FILL height, top-aligned
- Each panel: `buildPanel()` — white fill, cornerRadius 8, mono-300 stroke
- Panel header: primitive text (Bold 16px title + Regular 14px subtitle), 24px h-padding
- Input Fields: always `setProperties({'AI+Emoji#4369:0': false})`
- Block Selector text node is named `"Origin name"` (not "Block selector")
- Height > 1080px is fine — slide-ins scroll in the platform
