# Dashboard V2 — Iteration 1: Implementation Handout

> **Status:** Work in Progress
> **Figma:** [Dashboard V2 — Iteration 1](https://www.figma.com/design/cfSJSI1WgZrsAKKVwBYk8K/Dashboard-V2?node-id=7560-2662)
> **Repo:** [github.com/ayokaayo/FTDNA](https://github.com/ayokaayo/FTDNA)
> **Scope:** Widget system, custom modules & tag priority management
> **Last updated:** 2026-03-27 (v2 — addresses unmapped component gaps, grid system, resolved decisions)

---

## 0. How to Use This Document

This file is the single source of truth for implementing Dashboard V2 Iteration 1. It is designed to be consumed by Claude (or any AI coding assistant) alongside the Figma file.

**Visual references** are included as screenshots in the `assets/` folder alongside this file. Each section references the relevant image. No Figma access is needed.

**When a library component exists** (listed in Section 5), import it by key and configure its properties as documented.

**When NO library component exists** (sidebar, chart, table, etc.), build it from scratch using the FT DNA token system (Section 4) and follow the structural spec in this document. Never hardcode colours, spacing, or typography — always reference `--ft-*` CSS custom properties.

### Visual References

| Image | Content |
|-------|---------|
| `assets/01-full-prototype.png` | Full dashboard page — overall layout reference |
| `assets/02-sidebar.png` | Sidebar navigation (56px dark bar) |
| `assets/03-module-section.png` | Module section — header, chart, stat cards, alert banner |
| `assets/04-card-variants.png` | Dashboard Card component: Default, Edit Mode, New widget |
| `assets/05-tag-dropdown.png` | Tag selector dropdown with sort pills and drag handles |
| `assets/06-alert-banner.png` | Alert banner ("Tags Awaiting Attention") |
| `assets/07-breakdown-table.png` | Detailed breakdown table with filter toolbar |
| `assets/08-create-module-modal.png` | Create Custom Module modal with Block Selectors |

---

## 1. Overview

The Dashboard V2 is a tag-based analytics dashboard where operators monitor player activity across configurable modules (Exploitable Slots, Cash Stashing, Gameplay, Events). Each module displays a stacked bar chart, stat cards, alert banners, and a detailed breakdown table.

This iteration adds three key capabilities:
1. **Dashboard Card widget system** — add, edit, and remove stat cards via a New Widget empty state with Metrics/Charts selectors
2. **Create Custom Module** — a modal to build custom dashboard sections by selecting tags across modules
3. **Tag sorting/priority** — manual drag-to-reorder and A-Z sort in the tag selector dropdown

### Resolved Decisions (from product review)

| Question | Decision |
|----------|----------|
| Custom module persistence | Per-user (localStorage at early stage) |
| Tag colour palette | No custom colours. Use brand colours assigned automatically. Tags with affinity get variations of the same base hue for visual harmony. Iterate after first implementation. |
| Widget list | Not yet defined — implement the card system and selection UI; the metric/chart list will be provided separately |
| Tag priority dedup | To be confirmed — implement the manual ordering and persist it; dedup algorithm will be specified later |

---

## 2. Full Page Anatomy

This section describes **every element** on the dashboard, top to bottom. For each element, a Figma node ID is provided for visual reference.

### 2.1 Sidebar — `assets/02-sidebar.png`

A 56px-wide dark vertical navigation bar on the far left.

**Structure:**
- Logo icon at top (FT logo, 30x29px)
- 3 navigation icons vertically stacked below: `chart-tree-map` (dashboard), `slot-machine` (game center), `users` (player center) — each 40x40px frame with 24x24 icon centered
- Bottom area: alerts icon + power-off icon
- UTC timezone label (12px text)

**Build notes:** This is a custom frame, no library component. Use `--ft-color-mono-black` for the bg, `--ft-color-mono-white` for icons. Active state icon gets a coloured indicator (brand blue or green). Icons use Font Awesome 6 Pro via the `v7-icon` component.

### 2.2 Header Bar

A horizontal bar spanning the full width above the main content (height ~60px).

**Structure:**
- Left: "Dashboard" breadcrumb text (21px)
- Right: "Migration Portal" CTA button (bordered, 30px height)

**Build notes:** Simple flex row, `justify-content: space-between`. Background is `--ft-color-mono-white`. The CTA is a bordered button using `--ft-color-mono-700` for text and border.

### 2.3 Toggle + Date Range Bar

Below the header, a horizontal bar with two sections:

**Left side — Tab toggle:**
- "Total Tags" / "Unique Users" tab switch (component: `tab-switch-validity`, key: `b268368f7be1b5a64b34a2e9684719feb746b42d`)
- This toggles the data view between total tag counts and unique player counts

**Right side — Date/time controls:**
- Date range selector: "From" and "To" date pickers
- Time granularity tabs: `1H` / date range / `6H` / `3M` / `1Y`
- Calendar icon button
- Uses `Tab` component instances (key: `9ae8ce68b461011968c6c81846ae43210b75c11e`)

### 2.4 Module Section — Repeating Pattern

Each module (Exploitable Slots, Cash Stashing, etc.) follows the same structure:

#### 2.4.1 Module Header Row — see `assets/03-module-section.png`

**Structure:**
- Expand/collapse caret icon (v7-icon: `caret-up` / `caret-down`)
- Module title (e.g. "Exploitable Slots") — 24px Bold
- Tag badge showing count (e.g. "568") — `Tag` component, `Type=Icon - solid, Size=Medium`
- **Right side:** Lock/edit icon button (`button-btn` Type=icon) — toggles edit mode for this module

**Lock/unlock mechanism:**
- Default state: dashboard is locked (view only). Lock icon shown.
- Click lock → unlocks the module into **Edit Mode**: cards show pencil/trash, resize handles appear, "Click to add a widget" area shows
- Click again → relocks, saves current layout

#### 2.4.2 Tag Selector Input — see `assets/03-module-section.png`

**Structure:**
- Label: "Selected Rule" above
- Dropdown input showing "Tags" label + selected tag count badge
- Dropdown arrow icon on the right
- Clicking opens the **Tag Selector Dropdown** (Section 3.3)

**Build notes:** Use the existing input pattern from the prototype — bordered frame (1px `--ft-color-mono-300`), 40px height, 846px width spanning the left panel.

#### 2.4.3 Alert Banner — see `assets/06-alert-banner.png`

**Structure:**
- Yellow/orange background (`--ft-color-brand-yellow-200`)
- Left: Warning icon (v7-icon, 25px) + heading "43 Tags Awaiting Attention" (Bold 14px) + description text (Regular 14px)
- Right: "Take Action" button (`button-btn` Type=sub)
- Full width of the right panel (~878px)

**Build notes:** This is a reusable alert pattern. The icon uses `v7-icon` component (`style=solid, padding=square, scale=1.25x`). The banner sits inside the module, aligned with the stat cards.

#### 2.4.4 Stacked Bar Chart Area — see `assets/03-module-section.png` (left panel)

**Structure:**
- Chart container: ~843px wide, ~344px tall, white background, 1px `--ft-color-mono-300` border, 4px corner radius
- Chart content: stacked bar chart showing tag distribution over time
- X-axis: date labels (monthly)
- Y-axis: count scale
- Legend below chart: coloured squares + tag names (scrollable if many tags)
- Resize handle at bottom-right

**Build notes:** Use a chart library (Chart.js, ECharts, or similar). Tag colours for the stacked segments come from the Greco brand palette (see Section 4.2). The chart frame itself is a simple bordered container — no library component.

#### 2.4.5 Stat Cards Grid — see `assets/03-module-section.png` (right panel)

This is the **Dashboard Card widget system** area. See Section 3.1 for full spec.

**Layout:**
- Container: ~881px wide, sits to the right of the chart
- Grid: 2 columns of cards (432px each) with 16px gap
- Rows stack vertically with 16px gap
- Below the cards: "Click to add a widget" action area

#### 2.4.6 "Click to Add a Widget" 

**Structure:**
- Full-width bordered area (~1740px in full mode, ~881px in stat cards panel)
- Centered: duotone plus icon (`v7-icon (duotone)`, key: `7270a9cbc774b34a1416c9d0fc44962727821d59`) at 32x32
- Below icon: "Click to add a widget" text (12px Regular, `--ft-color-mono-500`)
- Background: subtle `--ft-color-mono-100` or transparent
- Border: 1px dashed or light solid `--ft-color-mono-300`

**Behaviour:** Clicking creates a new `Dashboard Card` in `New widget` variant and inserts it into the grid above this button.

#### 2.4.7 Detailed Breakdown Section 

**Structure:**
- Collapsible section with caret + "Detailed Breakdown" title (24px) + subtitle "All games associated with linked tags" (14px Regular, `--ft-color-mono-500`)
- When expanded, shows the breakdown table

#### 2.4.8 Breakdown Table — see `assets/07-breakdown-table.png`

**Structure:**
- **Filter toolbar** (56px height):
  - Left: "Group by" label + pill toggles (`Origin` / `Tag` / `Game`) using `Tag` component
  - Right: "Show:" label + checkboxes (`Tag Count`, `Players`, `Amount`, `Avg Bet`, `Sessions`) using `Checkbox` component
- **Divider line** (1px `--ft-color-mono-300`)
- **Table header row** (40px): Column headers using `Header` component (key: `741a4d17b1d017e393354c745eaa43d1ed9bf73e`)
- **Table rows**: Alternating even/odd using `Row` component:
  - `Type=status circle` for colour swatch column
  - `Type=Text` for tag name, counts, amounts
  - Even rows: key `70f8be50406c100d46e85f52990b192d55e2e4f7`
  - Odd rows: key `32f7b98a137077db50dc9323781f9b35e0a1901e`
- **Total row** at the bottom with bold aggregated values

**Build notes:** This table uses mapped Row/Header components. Import them by key and configure text overrides for each cell.

### 2.5 Bottom Alert Banner 

Full-width version of the alert banner (spans both panels, ~1740px). Same structure as 2.4.3 but wider. Shows global count: "103 Tags Awaiting Attention".

### 2.6 Collapsible Module Summaries 

When modules are collapsed, they show:
- Caret icon + module title + description text
- e.g. "Exploitable Slots" / "Cool description here"
- "Games Report" / "All games associated with linked tags"

### 2.7 Custom Module Section 

At the bottom of the page, a section for user-created custom modules:
- Module header with editable name input (using `Rename - breadcrumbs` component)
- Cancel (X) and confirm (checkmark) icons next to the name
- Lock/edit icon on the right
- "Click to add a widget" area below

### 2.8 "Click to Create a Custom Module" 

**Structure:**
- Full-width action bar at the very bottom
- Centred: duotone plus icon + "Click to create a custom module" text
- Same pattern as "Click to add a widget" but triggers the Create Custom Module modal (Section 3.2)

---

## 3. Feature Specifications

### 3.1 Dashboard Card — Widget System

**Component:** `Dashboard Card` (local component set in Dashboard V2 file, key: `9f8b190c900de04b97a71f7b19ec8564c26c4d19`)

| Variant | Key | Visual |
|---------|-----|--------|
| `Default` | `b0cfaa4fa4f2498a1bda8f6b491775f95e1416de` | Title + large value (38px Bold) + trend badge (Tag component with arrow icon + %) |
| `Edit Mode` | `71753672c493a0c143dc994f54942de967be1b17` | Same as Default + pencil and trash icon buttons (40px, `button-btn` Type=icon) + resize handle |
| `New widget` | `54ade36689a63e4727fc413432f9c9e13169cdc7` | Dashed border, off-white bg, "Add New widget" Panel Title, subtitle, Metrics/Charts pill buttons, trash button, resize handle |

**Card dimensions:** 432px wide x 163px tall (base size). Border: 1px solid `--ft-color-mono-300`. Border-radius: 4px. Padding: 32px top, 32px sides, 16–32px bottom.

**Trend badge:** Uses `Tag` component (`Type=Icon - light, Size=Large, Solid Colour=Neutral`). Green arrow-up icon for positive, red arrow-down for negative.

#### Grid System — Detailed Spec

**Recommended library:** `vue-grid-layout` (Vue) or `react-grid-layout` (React). These handle drag, resize, and snap out of the box.

**Grid definition:**
```
Columns: 4
Column width: ~210px (within 881px container)
Row height: 163px (matches card height)
Gap: 16px (both horizontal and vertical)
Default card size: 2 columns x 1 row (= 432px x 163px)
Max card size: 4 columns x 2 rows
Min card size: 1 column x 1 row
```

**Drag-and-drop:**
- Only active in **Edit Mode** (lock icon unlocked)
- Cards can be dragged to any open grid position
- Other cards reflow to accommodate
- Drop position snaps to nearest grid cell
- Layout persists per user (localStorage initially)

**Resize:**
- Resize handle at bottom-right corner of each card (small triangle indicator)
- Drag to resize — snaps to grid increments (1 col / 1 row steps)
- Visual feedback: ghost outline shows target size while dragging
- Cards cannot overlap

**Lock/Unlock flow:**
1. Default state: **Locked**. Cards show `Default` variant. No drag, no resize.
2. User clicks lock icon in module header → **Unlocked/Edit Mode**
3. All cards in that module switch to `Edit Mode` variant (pencil + trash visible)
4. "Click to add a widget" area becomes active
5. Cards become draggable and resizable
6. User clicks lock again → **Locked**. Layout saves. Cards revert to `Default`.

#### Interaction: Adding a Widget

1. (Edit Mode active) User clicks "Click to add a widget"
2. New `Dashboard Card` appears in `New widget` variant at the next available grid position
3. User clicks **Metrics** pill → dropdown shows available metrics (Total Tags, Unique Players, Awaiting Attention, Avg Tags/Player, etc.)
4. User clicks **Charts** pill → dropdown shows available chart types
5. Selecting an item populates the card → transitions to `Default` variant with data
6. User can drag/resize the new card to desired position

### 3.2 Create Custom Module — Modal

**Base:** FT DNA `Modal` component (`Size=M [W-640px]`, key: `57f5ef52124667ce38051d31fbaec74dad581b06`). Detach the instance after import, then widen to 820px.

**Figma reference:** — see `assets/08-create-module-modal.png` (the modal on the Iteration 1 page)

**Structure:**
```
Modal (820px, white, 8px corner-radius, drop-shadow 0 4px 24px rgba(0,0,0,0.15))
├── Header (horizontal, space-between)
│   ├── Title: "Create Custom Module" (20px Inter Bold, --ft-color-mono-black)
│   └── Close: v7-icon "xmark" (20px, --ft-color-mono-500)
├── Body (vertical, 24px gap)
│   ├── MODULE NAME label (11px Inter Bold, uppercase, 5% letter-spacing, --ft-color-mono-700)
│   ├── Text input (576px wide, 40px tall, 1px --ft-color-mono-300 border, 4px radius)
│   │   └── Placeholder: "e.g. My Custom View" (14px Inter Regular, --ft-color-mono-500)
│   ├── SELECT TAGS (FROM ANY MODULE) label (same style as MODULE NAME)
│   ├── Module group: "Exploitable Slots" (13px Inter Medium, --ft-color-mono-700)
│   │   └── Block Selector grid (3 per row, 8px gap, horizontal wrap)
│   ├── Module group: "Cash Stashing" → same pattern
│   ├── Module group: "Gameplay Module" → same pattern
│   └── Module group: "Events Module" → same pattern
└── Footer (horizontal, align-right, 12px gap)
    ├── Cancel (button-btn Type=alt)
    └── Create Module (button-btn Type=main)
```

**Block Selector config** (component key: `e06ec12643a402940c71caf1f340c64ac806b263`):
- Import `Type=Unselected, Status=Default` (key: `0c39aeb263e43227c2ddc7eb0bd5fc4c3426db61`)
- Set properties: `Icon=false`, `Image=false`, `flag=false`, `xmark=false`, `Toggle=false`, `Number=true`
- Override text: "Origin name" → tag name, "123,456" → tag count
- Each block is ~246px wide in the 3-column grid
- Clicking toggles to `Type=Selected, Status=Default` (key: `f0f642a84980b1654cac9455ce702bb8b5933bd2`)

**Backdrop:** Semi-transparent overlay — `rgba(0, 0, 0, 0.4)` covering the full viewport. Modal centred horizontally, positioned near the top third.

**Persistence:** Save custom module config to **localStorage** per user. Structure:
```json
{
  "customModules": [
    {
      "id": "uuid",
      "name": "My Custom View",
      "tags": ["ES H 50 EUR S", "CS Warning", ...],
      "createdAt": "2026-03-27T10:00:00Z"
    }
  ]
}
```

### 3.3 Tag Sorting / Priority — Dropdown

**Figma reference for the dropdown:** — see `assets/05-tag-dropdown.png` (original) or the copy on Iteration 1 page

**Dropdown structure:**
```
Tag Selector Dropdown (white, 1px --ft-color-mono-300 border, 4px radius, shadow 0 4px 16px rgba(0,0,0,0.12))
├── Header toolbar (48px, horizontal, space-between, padding 16px)
│   ├── Sort pills (left)
│   │   ├── A-Z pill (inactive: bg --ft-color-mono-200, border --ft-color-mono-300, text --ft-color-mono-500)
│   │   └── Manual pill (active: bg --ft-color-mono-700, border --ft-color-mono-700, text --ft-color-mono-white)
│   └── Select options (right)
│       ├── "Select All" (12px Bold, --ft-color-mono-400 when inactive)
│       └── "Select None" (12px Bold, --ft-color-brand-blue when active)
├── Divider (1px --ft-color-mono-300)
└── Tag List (scrollable)
    └── Tag Row (repeated, 32px height, 16px horizontal padding, 7px vertical padding)
        ├── Drag handle (2x3 dot grid, --ft-color-mono-500) — visible only in Manual mode
        ├── Checkbox (18x18, --ft-color-mono-700 bg when checked, 4px radius)
        ├── Colour swatch (12x12, rounded 2px, tag-specific colour)
        ├── Tag name (13px Inter Regular, --ft-color-mono-black, flex-grow)
        └── Count (13px Inter Medium, --ft-color-mono-500, right-aligned)
```

**Sort pills:** Joined with shared border — left pill: `border-radius: 4px 0 0 4px`, right pill: `0 4px 4px 0`. Clicking a pill toggles active state. All colours bound to Figma variables.

**Manual mode:** Drag handles (6-dot grip) appear on each row. User drags to reorder. Order persists per user in localStorage. This order defines **tag priority** (top = highest).

**A-Z mode:** Rows sort alphabetically. Drag handles hidden. Saved manual order preserved in background.

---

## 4. Design Token System — Build-from-Tokens Guide

When no library component exists, build from these tokens. **Never hardcode values.**

### 4.1 Colour Tokens

Use `--ft-*` CSS custom properties. The full set lives in `tokens/colors.tokens.json`.

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| White | `--ft-color-mono-white` | `#FFFFFF` | Card bg, modal bg, pill text |
| Mono 100 | `--ft-color-mono-100` | `#FAFAFA` | Page bg, subtle backgrounds |
| Mono 200 | `--ft-color-mono-200` | `#F5F5F5` | Inactive pill bg, hover states |
| Mono 300 | `--ft-color-mono-300` | `#E5E5E5` | Borders, dividers, strokes |
| Mono 400 | `--ft-color-mono-400` | `#CACACA` | Disabled text |
| Mono 500 | `--ft-color-mono-500` | `#959595` | Secondary text, grip dots, placeholders |
| Mono 700 | `--ft-color-mono-700` | `#2C2C2C` | Active controls, headings, checkbox fills |
| Black | `--ft-color-mono-black` | `#000000` | Primary text |
| Brand Blue | `--ft-color-brand-blue-400` | `#2782CF` | Links, active tab indicators |
| Brand Pink 400 | `--ft-color-brand-pink-400` | `#E96092` | Primary action buttons (main CTA) |
| Brand Pink 500 | `--ft-color-brand-pink-500` | `#D52454` | Button hover state |
| Yellow 200 | `--ft-color-brand-yellow-200` | `#FFF6C9` | Alert banner backgrounds |
| Green 400 | `--ft-color-support-green-400` | `#3AAA35` | Positive trend indicators |
| Red 400 | `--ft-color-support-red-400` | (see tokens) | Negative trend indicators |

### 4.2 Tag Colour Palette (Greco-based)

Tags are colour-coded with auto-assigned brand colours. The system:
1. Start with the Greco base palette (greens, blues, pinks, purples, yellows from the brand colour tokens)
2. Assign colours to tags in order of creation
3. When tags share affinity (same module), use **variations of the same base hue** (e.g. Exploitable Slots tags get green-family colours)
4. Maintain sufficient contrast between adjacent tags in charts
5. No user-customisable colours at this stage

### 4.3 Spacing Scale

Based on a 4px grid. Full set in `tokens/spacing.tokens.json`.

| Token | Value | Usage |
|-------|-------|-------|
| `--ft-spacing-2xs` | 2px | Micro padding |
| `--ft-spacing-xs` | 4px | Tight gaps, tag padding |
| `--ft-spacing-sm` | 8px | Default inline gaps, grid gutters |
| `--ft-spacing-md` | 16px | Content gaps, card padding, grid gaps |
| `--ft-spacing-lg` | 24px | Section spacing |
| `--ft-spacing-xl` | 32px | Page section margins, card inner padding |
| `--ft-spacing-2xl` | 48px | Major divisions |

### 4.4 Typography

Font: **Inter** (Regular 400, Medium 500, Bold 700). Full set in `tokens/typography.tokens.json`.

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Page title | 24px | Bold | Module titles |
| Card value | 38px | Bold | Stat card main number, letter-spacing: -0.76px |
| Card title | 20px | Regular | Stat card label |
| Body | 14px | Regular | Descriptions, alert text |
| Body bold | 14px | Bold | Alert headings |
| Small | 13px | Regular | Table cells, tag names, dropdown items |
| Small bold | 13px | Medium | Table counts, trend percentages |
| Caption | 12px | Bold | Button text, pill labels, badge text, font-feature: lnum tnum |
| Micro | 11px | Bold | Section labels (MODULE NAME, SELECT TAGS), uppercase, 5% letter-spacing |

### 4.5 Shadows & Borders

| Element | Shadow | Border |
|---------|--------|--------|
| Cards | none | 1px solid `--ft-color-mono-300` |
| Modal | `0 4px 24px rgba(0,0,0,0.15)` | none |
| Dropdown | `0 4px 16px rgba(0,0,0,0.12)` | 1px solid `--ft-color-mono-300` |
| New widget card | none | 1.5px dashed `--ft-color-mono-300` |

Border-radius: 4px for cards, inputs, pills, dropdowns. 8px for modal. 32px for pill buttons.

---

## 5. Components Reference

### Mapped Library Components (import by key)

| Component | Set Key | Usage | Variant Notes |
|-----------|---------|-------|---------------|
| `button-btn` | `9ffa84660f6a68314653f7bb4c616d571b8e079e` | All buttons | Type: main (pink CTA), alt (text-only), sub (dark pill), icon (40px square) |
| `Tag` | `a9d90d6b73ab2570bec9b1a8ac17952454b072a0` | Tag chips, badges | Type: Icon-solid (dark bg) / Icon-light (outline). Sizes: S/M/L |
| `Block Selector` | `e06ec12643a402940c71caf1f340c64ac806b263` | Modal tag rows | Type: Selected/Unselected. Hide: Icon, Image, flag, xmark, Toggle. Show: Number |
| `Modal` | `ccaba7a9d28913dc74d0066de03ae247829f18d7` | Dialog base | Sizes: S (420px), M (640px), L (1200px). Detach in external files. |
| `v7-icon` | `c1da1aabeddb6606cb95428417d1c24e24cf9502` | All icons | Font Awesome 6 Pro. Set icon name via text override. |
| `v7-icon (duotone)` | `7270a9cbc774b34a1416c9d0fc44962727821d59` | Decorative icons | Used for "add widget" / "add module" placeholders |
| `Panel Title` | `d72692e47d78f62c61ff987def5accd87d16d519` | Section headings | Variant: Description (with subtitle) |
| `Checkbox` | `170d48f4e343c5e66a4f8e24511cbe05d2c9733c` | Filter toggles | Type: Checked/Unchecked |
| `tab-switch-validity` | `b268368f7be1b5a64b34a2e9684719feb746b42d` | Total Tags / Unique Users toggle | |
| `Tab` | `9ae8ce68b461011968c6c81846ae43210b75c11e` | Date range tabs | State: Active/Inactive, Type: Compound |
| `Header` (table) | `741a4d17b1d017e393354c745eaa43d1ed9bf73e` | Table column headers | |
| `Row` (table) | `7fd03ab762ae73ff25fba766c77e7a998ed7b9cc` | Table data rows | Type: Text / status circle. Position: EVEN/ODD for zebra striping |
| `Dashboard Card` | `9f8b190c900de04b97a71f7b19ec8564c26c4d19` | Stat cards | Local component. Variants: Default, Edit Mode, New widget |
| `Pointer` | `6e99123f73f4f6c06c465538967788292ca4ac6d` | Resize cursor | Variant: Hover |
| `data-balloon` | `9ff0e244011ee8551a239c3af846554fa984aed1` | Tooltip | Icon position: Left |

### Elements Without Library Components (build from tokens)

| Element | How to Build |
|---------|-------------|
| Sidebar | 56px fixed frame, `--ft-color-mono-black` bg, v7-icon instances for nav items |
| Header bar | Flex row, `--ft-color-mono-white` bg, breadcrumb text left, CTA right |
| Chart area | Use Chart.js / ECharts. Container: white bg, 1px `--ft-color-mono-300` border, 4px radius |
| Tag selector input | Bordered frame (1px `--ft-color-mono-300`), 40px height, dropdown arrow icon right |
| Alert banner | `--ft-color-brand-yellow-200` bg, v7-icon left, text center, button-btn right |
| Sort pills | Two joined frames with toggled bg colours. Active: `--ft-color-mono-700`. See Section 3.3. |
| Drag handle | 2x3 dot grid (2.5px ellipses, 3px spacing), `--ft-color-mono-500` fill |
| "Add widget" area | Centred duotone icon + text, dashed or light border |
| Module section header | Flex row: caret + title + Tag badge + lock icon button |
| Colour swatch | 12x12 rounded rect (2px radius) with tag-specific colour |

---

## 6. Implementation Priorities

| Priority | Feature | Effort | Notes |
|----------|---------|--------|-------|
| P1 | Full page scaffold (sidebar, header, module sections) | Medium | Sets up the layout for everything else |
| P1 | Dashboard Card component (3 variants) | Medium | Core building block |
| P1 | Tag sorting dropdown (A-Z / Manual + drag) | Medium | Needs drag library |
| P2 | Grid system (drag, resize, snap, lock/unlock) | High | vue-grid-layout / react-grid-layout |
| P2 | Create Custom Module modal | Medium | Block Selector + localStorage |
| P2 | Breakdown table | Medium | Uses mapped Row/Header components |
| P3 | Tag colour palette auto-assignment | Low | Brand colour algorithm |
| P3 | Chart integration | Medium | Chart library + tag colour mapping |

---

## 7. Verification Checklist

Run through this before requesting a design review.

### Page Structure
- [ ] Sidebar: 56px, dark bg, logo + 3 nav icons + logout
- [ ] Header: breadcrumb left, CTA right, full width
- [ ] Toggle bar: Total Tags / Unique Users tab + date range controls
- [ ] Module sections: expand/collapse, title + tag badge + lock icon

### Dashboard Card
- [ ] Default: title + 38px value + trend badge (Tag component)
- [ ] Edit Mode: pencil + trash icons appear, resize handle visible
- [ ] New widget: dashed border, off-white bg, "Add New widget" title, Metrics/Charts pills
- [ ] Pills stretch equally, trash at right end of footer row

### Grid System
- [ ] 4-column snap grid within stat cards area
- [ ] Lock icon toggles Edit Mode on/off per module
- [ ] Cards draggable in Edit Mode (reflows other cards)
- [ ] Resize handle: drag to span multiple columns/rows, snaps to grid
- [ ] Layout persists per user (localStorage)
- [ ] "Click to add a widget" creates New widget card at next open position

### Create Custom Module Modal
- [ ] Built on FT DNA Modal base (detached Medium)
- [ ] Header: title + X close
- [ ] Module name input with placeholder
- [ ] Block Selectors in 3-column wrap grid, 8px gaps
- [ ] Block Selectors: name + count only (icons hidden)
- [ ] Toggle Selected/Unselected on click
- [ ] Cancel + Create Module footer buttons
- [ ] Dark backdrop (40% black)
- [ ] Config saves to localStorage

### Tag Sorting
- [ ] Sort pills: A-Z (left) | Manual (right), joined border-radius
- [ ] Active pill: `--ft-color-mono-700` bg, white text
- [ ] Inactive pill: `--ft-color-mono-200` bg, `--ft-color-mono-300` border
- [ ] Drag handles (6-dot grip) visible in Manual mode only
- [ ] Rows draggable, order persists per user
- [ ] A-Z sorts alphabetically, preserves manual order in background

### Alert Banners
- [ ] Yellow bg (`--ft-color-brand-yellow-200`), warning icon, count text, "Take Action" button
- [ ] Per-module version (right panel width) + full-width global version

### Breakdown Table
- [ ] Filter toolbar: Group by pills + Show checkboxes
- [ ] Zebra-striped rows (EVEN/ODD Row variants)
- [ ] Colour swatch + tag name + counts per row
- [ ] Total row at bottom with aggregated values

### Tokens & Quality
- [ ] Zero hardcoded colours — all `--ft-*` variables
- [ ] All text: Inter font (Regular, Medium, Bold)
- [ ] Spacing follows 4px grid scale
- [ ] Focus states: brand green or blue
- [ ] No custom elements where a library component exists

---

## 8. Design Critique Prompt

After implementation, run this prompt with the FT DNA design-critique skill:

```
Review the Dashboard V2 Iteration 1 implementation against the Figma design at:
https://www.figma.com/design/cfSJSI1WgZrsAKKVwBYk8K/Dashboard-V2?node-id=7560-2662

Use get_screenshot with fileKey cfSJSI1WgZrsAKKVwBYk8K on the node IDs referenced in the handout to compare visual output.

Check:
1. Token compliance — are any colours/spacing hardcoded?
2. Component usage — are all mapped components imported by key?
3. Unmapped elements — do sidebar, header, chart, table match the Figma visuals?
4. Grid system — does lock/unlock, drag, resize, and snap work?
5. Modal — Block Selector grid, toggle states, persistence?
6. Tag sorting — pills, drag handles, A-Z/Manual modes?
7. Accessibility — keyboard nav, focus rings, ARIA labels?
```
