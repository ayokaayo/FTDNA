# Page Patterns

> Composable templates for standard FT back-office pages. Each pattern defines the layout structure, required components, slot definitions, and composition rules.
> Consumed by: prototype-generator
> Last updated: 2026-03-17

## Pattern Selection Logic

| User says... | Pattern |
|-------------|---------|
| "settings page", "configuration", "form page", "edit page" | Settings Page |
| "list page", "table page", "index page", "browse", "overview" | List Page |
| "detail page", "view page", "profile", "single item" | Detail Page |
| "modal", "dialog", "slide-in", "overlay" | Modal / Slide-In |
| "dashboard", "overview with stats" | Dashboard (compose from panels) |
| "empty state", "first time", "no data" | Use any pattern + Placeholder component |

---

## Shared Shell

Every FT back-office page starts with the Base Template (`94:21370`). This gives you:

```
┌──────────────────────────────────────────┐
│ Side Menu (56px) │ Page Header            │
│                  │  [breadcrumbs] [CTAs]  │
│                  │───────────────────────-│
│                  │ Content Area (mono-100) │
│                  │  ┌──────────────────┐  │
│                  │  │ Standard Panel   │  │
│                  │  │  [panel header]  │  │
│                  │  │  [content]       │  │
│                  │  └──────────────────┘  │
│                  │                        │
└──────────────────────────────────────────┘
```

**Shell defaults (apply to ALL patterns):**
1. Side menu → match `Section` to product area
2. Page Header → 1 breadcrumb level, 1 main CTA only, all other header toggles OFF
3. Content placeholder → NO padding, NO fill (hard rule)
4. Standard Panel → Full width unless brief says split

---

## Pattern 1: Settings Page

**Purpose:** Configuration forms with labeled fields, toggles, and a save action.

**Structure (single panel for simple forms):**
```
Standard Panel
├── Panel Header (title + optional description)
├── [Alert — info/warning, if needed] ← always first
├── Section 1
│   ├── Section Title (subtitleBold, 16px)
│   ├── Form Row (horizontal, 2 cols)
│   │   ├── Input Field
│   │   └── Input Field
│   ├── Form Row
│   │   ├── Input Field
│   │   └── Dropdown
│   └── Toggle Row
│       └── Toggle (HUG, never FILL)
├── Section 2
│   ├── Section Title
│   ├── Form Row
│   └── ...
└── [Footer area — buttons are in Page Header, not here]
```

**Structure (multi-panel for complex forms — e.g. Activity Builder):**
```
Content Area (gap: 32)
├── Standard Panel 1 — Activity Name
│   ├── Panel Header
│   └── Input Field (filled)
├── Standard Panel 2 — Type of Activity
│   ├── Panel Header (with description)
│   ├── Tab switch (Specific Date / Recurring)
│   └── Form Row (date picker + dropdown + optional widget)
├── Standard Panel 3 — Segment
│   ├── Panel Header
│   ├── Alert (info banner with CTAs)
│   ├── Sub-section: Player Origin
│   │   ├── Sub-Panel Header (section label)
│   │   └── Block Selector grid (wrap, gap: 8)
│   ├── Sub-section: Market
│   │   ├── Sub-Panel Header
│   │   └── Block Selector grid
│   └── Sub-section: Additional Rules
│       └── Plus button + link
└── Actions Panel (custom component)
    ├── Panel Header
    └── Action buttons grid
```

**Key insight from real pages:** Complex create/edit flows use **multiple Standard Panels stacked** (gap: 32), each owning one logical section. Each panel has its own Panel Header. Sub-sections within a panel use a nested Panel Header for the label and a horizontal `Frame` (gap: 8) for Block Selector grids.

**Key components:**

| Slot | Component | ID | Default Variant |
|------|-----------|----|----------------|
| Form fields | Input Fields | `91:6537` | Type=Text input, State=default-empty |
| Dropdowns | Input Fields | `91:6537` | Type=Dropdown - Regular, State=default-empty |
| Toggles | Toggle | `91:8647` | Type=Unchecked, Alignment=Default |
| Alerts | alert | `92:40484` | Status=info, Description+Close only |
| Section title | Text node | — | 16px, Inter Bold, mono-700 |

**Composition rules:**
- Sections separated by `itemSpacing: 32` on the content frame
- Form rows: `layoutMode: 'HORIZONTAL'`, `itemSpacing: 24`, children FILL
- Toggles: `layoutSizingHorizontal: 'HUG'` — never stretch
- No dividers between sections — spacing only
- Save button lives in Page Header (main CTA), not in form
- Alert at top of content area if present

**Layout code pattern:**
```javascript
// Section
const section = figma.createFrame();
section.name = 'General Settings';
section.layoutMode = 'VERTICAL';
section.itemSpacing = 16;
section.fills = [];
contentArea.appendChild(section);
section.layoutSizingHorizontal = 'FILL';

// Section title
const title = figma.createText();
title.characters = 'General Settings';
title.fontSize = 16;
title.fontName = { family: 'Inter', style: 'Bold' };
section.appendChild(title);

// 2-column row
const row = figma.createFrame();
row.name = 'Form Row';
row.layoutMode = 'HORIZONTAL';
row.itemSpacing = 24;
row.fills = [];
section.appendChild(row);
row.layoutSizingHorizontal = 'FILL';

// Add inputs to row
const input1 = variant.createInstance();
row.appendChild(input1);
input1.layoutSizingHorizontal = 'FILL';
```

---

## Pattern 2: List Page

**Purpose:** Browsable data with search, filters, and table.

**Structure (observed from All Activities page):**
```
Content Area
├── Tab bar (OUTSIDE the panel — at content area level)
│   ├── tab (tab-text, Default)      "Overview"
│   ├── tab (tab-text, Default)      "Projects"
│   └── tab (tab-text, Selected)     "All Activities"
├── Icon toolbar strip (Standard Panel, no Panel Header, icons only — filter/view toggles)
└── Standard Panel (main table)
    ├── Panel Header (title + search + filter tags)
    │   └── Filter tags row: Tag instances (Active, Ended, Disabled, Scheduled)
    ├── Table frame (VERTICAL, no gap)
    │   ├── Header row (HORIZONTAL, gap: 0)
    │   │   ├── Header cell instance (w: flexible)
    │   │   ├── Header cell instance
    │   │   └── ...
    │   ├── Data row (HORIZONTAL, gap: 0, h: 75)
    │   │   ├── Row cell instance (Type=Text+leading icon, Position=ODD)
    │   │   ├── Row cell instance
    │   │   └── Row cell (Type=ellipsis) ← last column
    │   ├── Data row (Position=EVEN)
    │   └── ...
    └── Pagination instance (Type=go to page)
```

**Key components:**

| Slot | Component | ID | Default Variant |
|------|-----------|----|----------------|
| Table header cells | Header (standalone) | `91:39176` | Heading text + sort icon |
| Table row cells | Row | `91:39179` | Type=Text, Position=EVEN/ODD alternating |
| Pagination | pagination | `92:40394` | Type=go to page |
| Tabs | tab | `91:19098` | Type=tab-text |
| Filter tags | Tag | `91:10023` | Type=Icon-solid, Size=Small |
| Search | Built into Panel Header | — | `Search#4635:14: true` |

**Table composition (critical — learned from real pages):**
- Each table row is a **horizontal Frame** (gap: 0) containing **multiple Row cell instances** side by side
- Header row uses **Header** component instances (not Row), each with Heading text + sort icon
- Cell widths are set explicitly per column (e.g., Name: 760, Status: 200, Trigger: 240)
- Data rows alternate Position=EVEN/ODD for zebra striping
- Row height is 75px for data rows, 40px for header
- Last column typically uses `Type=ellipsis` for action menu
- The `table` frame wrapping all rows has `layoutMode: VERTICAL`, no gap, no padding

**Composition rules:**
- **Tabs live OUTSIDE panels** — at the content area level, above all panels
- Icon toolbar strip is a separate slim panel (32px padding, icons only)
- Panel Header for table: enable search, add filter Tag instances in the header row
- "Create new" button is the main CTA in Page Header
- Pagination sits inside the panel, after the table frame

**Row type selection:**
| Column content | Row Type |
|---------------|----------|
| Plain text | Text |
| Text with icon prefix | Text+leading icon |
| Status indicator | tag |
| Avatar/thumbnail | image |
| Country flags | flags |
| Checkboxes (multi-select) | checkbox |
| Action menu | ellipsis (always last column) |
| Numeric/version | number/version |

---

## Pattern 3: Detail Page

**Purpose:** View/edit a single entity with multiple sections of information.

**Structure — Single Panel:**
```
Standard Panel (Full)
├── Panel Header (entity name + description)
├── [Alert — status/info message]
├── Info Section
│   ├── Section Title
│   ├── Key-Value Rows (label: value pairs)
│   └── Tags (status indicators)
├── Configuration Section
│   ├── Section Title
│   ├── Form fields (editable)
│   └── Toggles
└── Related Data Section
    ├── Section Title
    └── Mini table or card list
```

**Structure — Split Panel (common for player profiles, activity details):**
```
Content Area
├── Standard Panel (2/3)
│   ├── Panel Header
│   ├── Main content sections
│   └── ...
└── Standard Panel (1/3)
    ├── Panel Header (sidebar title)
    ├── Summary info
    └── Quick actions
```

**Key components:**

| Slot | Component | ID |
|------|-----------|----|
| Main panel | Standard Panel | `92:46583` — Side-Width=Full or 2/3 |
| Sidebar panel | Standard Panel | `92:46583` — Side-Width=1/3 |
| Status tags | Tag | `91:10023` |
| Info fields | Text nodes (label + value) | — |
| Edit fields | Input Fields | `91:6537` |

**Composition rules:**
- Split layout: wrap two Standard Panel instances in a horizontal auto-layout frame
- Key-value display: horizontal frame with label (12px bold, mono-500) and value (14px regular, mono-700)
- Related data: mini table (3-5 rows) or horizontal card scroll
- Edit mode: swap text values for Input Field instances

---

## Pattern 4: Modal / Slide-In

**Purpose:** Focused task overlay — create, edit, confirm, or review without leaving the page.

### 4a: Confirmation Modal
```
Modal (S — 420px)
├── Title text
├── Description text
├── [Alert box — if warning needed]
└── Button row (Cancel alt + Confirm main)
```

Use `Modal` set (`92:40595`), Size=S.

### 4b: Form Modal
```
Modal (M — 640px)
├── Title text
├── [Alert box]
├── Input fields
├── [Toggle options]
└── Button row
```

Use `Modal` set, Size=M. Enable `Input field#2828:8`, disable `Select all option#3089:0`.

### 4c: Slide-In Panel — LVL 1 (most common for FT)
```
Slide-in (1250px × 1080, VERTICAL)
├── Header - slide in modal (HORIZONTAL, pad: 0 32)
│   ├── Left: X close icon + Tag (ACT-ID) + Breadcrumb (title)
│   └── Right: icon buttons (Frame 1505) + alt button + main button + kebab
├── Content Area (Frame 1317, VERTICAL, gap: 32, pad: 32 all)
│   ├── Standard Panel 1 (section)
│   │   ├── Panel Header
│   │   └── Form content
│   ├── Standard Panel 2
│   ├── Standard Panel 3
│   └── Actions Panel (if applicable)
```

### 4d: Slide-In Panel — LVL 2 (nested, narrower)
```
Slide-in (1125px × 1080)
└── Same structure as LVL 1, just narrower
```

### 4e: Full Page + Slide-In Overlay
```
Root frame (1920 × 1080, NONE layout)
├── Full page (underlying, dimmed via Overlay)
├── Slide-in (1250px, positioned right)
├── [Actions Panel — can be pulled outside slide-in]
└── Overlay blur-small (614px, positioned between page and slide-in)
```

**Key components:**

| Slot | Component | Notes |
|------|-----------|-------|
| Slide-in header | `Header - slide in modal` | Has own component — NOT the page Header |
| Close | X icon (xmark) | Left side of header |
| ID tag | Tag (Medium, Solid) | Next to close, shows entity ID |
| Title | Breadcrumb (Selected) | Entity name as breadcrumb |
| Save | button-btn (main) | Right side of header — NOT in footer |
| Backdrop | Overlay blur-small (`92:55554`) | 614px wide, placed left of slide-in |

**Composition rules (updated from real pages):**
- Slide-in is the preferred pattern for create/edit flows in FT
- **Buttons live in the slide-in header** — NOT in a footer. Main CTA (Save) right-aligned.
- Content area uses **multiple Standard Panels stacked** (gap: 32) — same as Settings multi-panel
- Each panel has its own Panel Header
- Slide-in header shows: X close → ID tag → entity name breadcrumb → icon buttons → alt CTA → main CTA → kebab
- Block Selectors for multi-option grids (Player Origin, Market) — wrap in horizontal Frame (gap: 8)
- Tab-switch components for mode selection (Specific Date / Recurring)

---

## Pattern 5: Dashboard / Overview

**Purpose:** High-level summary with metrics, charts, and quick-access actions.

**Structure:**
```
Content Area
├── [Alert — system-wide notification]
├── Metric Cards Row (horizontal)
│   ├── Card (1/3)
│   ├── Card (1/3)
│   └── Card (1/3)
├── Standard Panel (Full) — main chart/table
│   ├── Panel Header
│   └── Content (table or chart area)
└── Standard Panel Row (horizontal)
    ├── Standard Panel (1/2) — secondary data
    └── Standard Panel (1/2) — secondary data
```

**Composition rules:**
- Metric cards: custom frames (not a standard component), use border + large number + label
- Multiple panels: wrap in horizontal auto-layout frame, use width variants
- Charts: placeholder frame with label (Figma can't render real charts)

---

## Anti-Patterns

| Don't do this | Do this instead |
|--------------|-----------------|
| Divider lines between sections | Use `itemSpacing` (24-32px) |
| Toggle with `layoutSizing = 'FILL'` | `layoutSizing = 'HUG'` always |
| Save button inside the panel | Main CTA in Page Header (or slide-in header) |
| Multiple main (pink) buttons | 1 main max; use alt/sub for others |
| Custom colors on alerts | Use Status variant (success/error/info/warning) |
| Padding on content placeholder | Zero padding, zero fill — content owns spacing |
| `findOne()` for node access | `getNodeByIdAsync()` with known IDs |
| Setting FILL before appendChild | Append first, THEN set sizing |
| Lorem ipsum | Realistic FT domain content |
| Tabs inside a panel | Tabs go at content area level, ABOVE panels |
| Building pages from primitives | Always instantiate Base Template `94:21370` first |
| Table rows as single Row instances | Each row is a horizontal Frame with multiple Row CELL instances |
| One panel for everything | Complex forms use multiple Standard Panels stacked (gap: 32) |
| Footer buttons in slide-ins | Buttons live in the slide-in header |
| Building table header from text | Use Header component instances with sort icon |
