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

**Structure:**
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

**Structure:**
```
Standard Panel
├── Panel Header (title + search toggle + action icons)
├── [Alert — if system message needed] ← always first
├── [Tab bar — if multiple views/filters]
├── Table
│   ├── Table Header (column names)
│   ├── Row (EVEN)
│   ├── Row (ODD)
│   ├── Row (EVEN)
│   └── ...
└── Pagination
```

**Key components:**

| Slot | Component | ID | Default Variant |
|------|-----------|----|----------------|
| Table header | Header (standalone) | `91:39176` | — |
| Table rows | Row | `91:39179` | Type=Text, Position=EVEN/ODD alternating |
| Pagination | pagination | `92:40394` | Type=Standard |
| Tabs | tab | `91:19098` | Type=tab-text |
| Search | Built into Panel Header | — | `Search#4635:14: true` |

**Composition rules:**
- Panel Header: enable `Search#4635:14` for filterable lists
- Table rows alternate EVEN/ODD for zebra striping
- Action column (last) uses Row Type=action icons or Type=ellipsis
- Status column uses Row Type=tag
- Pagination always at bottom
- Tabs go between Panel Header and Table when multiple views exist
- "Create new" button is the main CTA in Page Header

**Row type selection:**
| Column content | Row Type |
|---------------|----------|
| Plain text | Text |
| Text with icon prefix | Text+leading icon |
| Status indicator | tag |
| Avatar/thumbnail | image |
| Country flags | flags |
| Checkboxes (multi-select) | checkbox |
| Action menu | ellipsis or action icons |
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

### 4c: Slide-In Panel (most common for FT)
```
Screen (existing page dimmed)
├── Overlay blur (left side)
└── Slide-in panel (right, 1250px)
    ├── Slide-in Header (title + close)
    ├── [Tabs — if multi-section]
    ├── Content sections
    │   ├── Form fields
    │   ├── Tables
    │   └── ...
    └── Footer (Save + Cancel buttons)
```

The slide-in uses:
- `Overlay blur-small` (`92:55554`) for the backdrop
- Custom frame for the panel (1250px wide, white, vertical auto-layout)
- Buttons in the footer, not in header

**Composition rules:**
- Slide-in is the preferred pattern for create/edit flows in FT (not modals)
- Slide-in header has its own breadcrumb trail (LVL 2)
- Content follows same section/form-row patterns as Settings Page
- Footer buttons: main CTA right-aligned, alt (cancel) left of it

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
| Save button inside the panel | Main CTA in Page Header |
| Multiple main (pink) buttons | 1 main max; use alt/sub for others |
| Custom colors on alerts | Use Status variant (success/error/info/warning) |
| Padding on content placeholder | Zero padding, zero fill — content owns spacing |
| `findOne()` for node access | `getNodeByIdAsync()` with known IDs |
| Setting FILL before appendChild | Append first, THEN set sizing |
| Lorem ipsum | Realistic FT domain content |
