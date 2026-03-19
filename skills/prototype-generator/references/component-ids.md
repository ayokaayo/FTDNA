# Component IDs & Override Reference

> Quick-lookup for component set IDs, variant names, and text override node names.
> Last updated: 2026-03-18

## Component IDs (Workbench Page)

| Component | Set ID | Common Variants |
|-----------|--------|----------------|
| Base Template | `94:21370` | COMPONENT — always start here |
| Input Fields | `91:6537` | Text input / Dropdown - Regular / Search / Text Area × default-empty / default-filled |
| button-btn | `91:8299` | Type=main (pink) / alt (outline) / icon (kebab) |
| Toggle | `91:8647` | Checked/Unchecked × Default/Justified |
| Tag | `91:10023` | Icon-solid/light × Small/Medium × Black/Neutral |
| alert | `92:40484` | Status=info/success/warning/error × Large/Centered |
| Header (table) | `91:39176` | Column header with sort icon |
| Row (table cell) | `91:39179` | Text / Text+leading icon / ellipsis / image / checkbox × EVEN/ODD |
| tab | `91:19098` | tab-text / tab-switch × Default/Selected |
| Pagination | `92:40394` | Type=go to page |
| Flag | `97:71963` | Country=country name (lowercase, e.g. "united kingdom") |
| Left - Breadcrumb Nav/1 | `134:84755` | Single-level breadcrumb (for pages with no parent) |
| Left - Breadcrumb Nav/2 | `94:21125` | Two-level breadcrumb (default in Base Template) |
| Block Selector | `91:8712` | Selected/Unselected × Default/Hover/Disabled |
| Checkbox | `91:8542` | Checked/Unchecked × Default/Disabled/Hover |
| Radio | `91:8595` | Checked/Unchecked × Default/Disabled/Hover |
| Placeholder (empty state) | `92:49611` | Size=XS/S/M/L/XL icon/XL gif + CTA/Learn more/Description toggles |
| Date picker with input | `91:7183` | Type=time span/specific date × State=default/filled |
| Overlay blur-small | `92:55554` | Standalone — 614px backdrop for slide-ins |
| Lifecycle card | `92:46699` | 8 variants — domain-specific cards |
| Action block | `92:55559` | 14 variants — Email/SMS/Push/Slack/Webhook/Bonus/etc. |
| Actions Panel | `92:56107` | Empty/Fill variants for CRM action grids |

## Row Type Selection (Tables)

| Column content | Row Type variant | Override target | Notes |
|---|---|---|---|
| Plain text | `Type=Text` | `"Row"` text node | Default cell. Override text characters. |
| Text + left icon | `Type=Text+leading icon` | `"Row"` text + `v7-icon` instance | Icon prefix (e.g. status dot + label). |
| Text + right icon | `Type=Text+trailing icon` | `"Row"` text + `v7-icon` instance | Icon suffix (e.g. external link arrow). |
| Standalone icon | `Type=Icon` | `v7-icon` instance | Single icon, no text. Override icon text character. |
| Status dot | `Type=status circle` | `v7-icon` instance | Green/red/yellow dot. Override icon fill color. |
| Tag / status badge | `Type=tag` | `Tag` instance | Uses Tag component. Override text + variant (color/size). |
| Checkbox | `Type=checkbox` | `v7-icon` instance | Check/uncheck. Override icon character + fill. |
| Action menu | `Type=ellipsis` | `button-btn` instance | Kebab menu. Always last column. |
| Action type icons | `Type=action icons` | `button-btn` instances (×6) | Colored circle buttons with FA icon text. Detach, show 1 btn per row, set fill color + icon name. |
| Avatar / thumbnail | `Type=image` | `image` instances (×5) + overflow btn | Multiple avatar circles. Detach, show needed count. |
| Country flags | `Type=flags` | `Flag` instances (×5) + overflow btn | Country flag circles. Detach, show needed count. |
| Number / version | `Type=number/version` | `button-btn` frame | Numeric badge in a pill shape. |

All row types have `Position=EVEN` and `Position=ODD` variants for zebra striping.

**GOTCHA — EVEN/ODD naming is counter-intuitive:**
- `Position=EVEN` → **no fill** (white/transparent background)
- `Position=ODD` → **gray fill** (`#FAFAFA`)
- When building tag/status cells that need to match row backgrounds, use `fills = []` for EVEN rows and `{ r: 0.9804, g: 0.9804, b: 0.9804 }` for ODD rows.

## Text Override Node Names

| Component | What to override | Node name to find | Font |
|-----------|-----------------|-------------------|------|
| Panel Header | Title | `"Title"` | Inter Bold |
| Panel Header | Subtitle | `"Sub-Title"` | Inter Regular |
| Page Header | Breadcrumb levels | `"Level 1"`, `"Level 2"` etc. (match by content) | Inter Regular/Bold |
| Page Header | Single breadcrumb | Use `Left - Breadcrumb Navigation/1` (`134:84755`) for 1-level pages | Inter Bold |
| Page Header | CTA button | `"Button text"` (match by content) | Inter Bold |
| Page Header | Heading | `"Heading"` (match by content) | Inter Regular |
| Tab | Title | `"text goes here"` inside `"tab title and alert circle"` frame | Inter Bold |
| Input Fields | Label | `"Label text here"` | Inter Bold |
| Input Fields | Value/Placeholder | `"Placeholder"` | Inter Regular |
| Toggle | Label | Use `setProperties({ 'Text#9:17': 'label' })` — direct text edit fails | Inter Regular |
| Radio | Label | Use `setProperties({ 'Text#9:9': 'label' })` — direct text edit fails | Inter Regular |
| Tag | Text | `"I am a tag"` | Inter Bold |
| Table Header cell | Column name | `"Heading"` | Inter Bold |
| Table Row cell | Cell value | `"Row"` | Inter Regular |

## Tab Override Gotchas

- Title text lives inside `"tab title and alert circle"` frame — the text node is named `"text goes here"`
- After overriding, ensure the frame's visibility is `true` (it can get hidden accidentally)
- Hide `"alert circle"` and `"Badge"` nodes to clean up the tab appearance
- Tab badges show red notification dots — hide them unless the brief requires them

## Panel Header Structure

After detaching, the Panel Header has this structure:
```
Panel Header
└── top (FRAME)
    ├── Title and description (FRAME)
    │   ├── Title and info (FRAME)
    │   │   ├── [Title] (TEXT) — "Title"
    │   │   └── v7-icon (INSTANCE) — info icon, hidden by default
    │   └── [Sub-Title] (TEXT) — description
    └── Search + Action Icons (FRAME) — HIDDEN by default
        ├── Input Fields (INSTANCE) — search input
        ├── Toggle (INSTANCE) — hide this
        └── Action icons (INSTANCE) — hide this
```

To enable search only: set `Search + Action Icons` visible, then hide Toggle and Action icons individually.

## Input Fields — Component Properties

The Input Fields component (`91:6537`) has boolean properties for toggling features:

| Property Key | Type | Default | Usage |
|---|---|---|---|
| `Info icon#4283:93` | BOOLEAN | false | Show info (ⓘ) icon next to field |
| `Tags#4281:31` | BOOLEAN | false | Show inline tags |
| `AI+Emoji#4369:0` | BOOLEAN | true | AI/Emoji picker — disable on settings fields |
| `Label#4339:0` | BOOLEAN | true | Show label above field |
| `Required#4285:155` | BOOLEAN | false | Show required asterisk |
| `Leading Icon#4276:0` | BOOLEAN | false | Icon inside field (left) |

**Settings dropdowns:** Enable `Info icon` and `Tags` (when needed), disable `AI+Emoji`.

## Tag Component Properties

The Tag component (`91:10023`) is used inline in dropdowns and table cells.

| Property Key | Type | Default | Usage |
|---|---|---|---|
| `Tag text#26:8` | TEXT | "I am a tag" | Tag label text |
| `Trailing icon#26:4` | BOOLEAN | true | X/close button — hide for read-only tags |
| `Leading Icon#26:0` | BOOLEAN | false | Icon before text |

**Variants:** `Size=Small/Medium/Large`, `Solid Colour=Black/Neutral`, `Status=Default/Hover/Focused/Locked-default/Disabled`

### Changing Tag Color via Variables

Tags only have Black and Neutral colour variants. For other colours (e.g. blue "SYSTEM DEFAULT"), override the fill with a variable:

```javascript
const blueVar = await figma.variables.getVariableByIdAsync('VariableID:28:26'); // Blue/color-brand-blue-400
const currentFills = [...tag.fills];
const newFill = figma.variables.setBoundVariableForPaint(currentFills[0], 'color', blueVar);
tag.fills = [newFill];
```

**Key colour variable IDs:**

| Colour | Variable ID | Name |
|---|---|---|
| Blue 400 | `VariableID:28:26` | Blue/color-brand-blue-400 |
| Blue 500 | `VariableID:28:27` | Blue/color-brand-blue-500 |
| Green (use for success/active) | Check Colours collection | Green/color-brand-green-* |
| Yellow 400 | `VariableID:28:31` | Yellow/color-brand-yellow-400 |
| Pink 500 | `VariableID:28:17` | Pink/color-brand-pink-500 |

### Dropdown with "SYSTEM DEFAULT" Tag

```javascript
dd.setProperties({ 'Tags#4281:31': true });
const tags = dd.findAll(n => n.name === 'Tag' && n.type === 'INSTANCE');
tags[0].setProperties({
  'Tag text#26:8': 'SYSTEM DEFAULT',
  'Trailing icon#26:4': false,
  'Leading Icon#26:0': false,
});
// Blue fill
const blueVar = await figma.variables.getVariableByIdAsync('VariableID:28:26');
const newFill = figma.variables.setBoundVariableForPaint([...tags[0].fills][0], 'color', blueVar);
tags[0].fills = [newFill];
// Hide second tag slot if exists
if (tags[1]) tags[1].visible = false;
```

## Alert Component Properties

The Alert component (`92:40484`) has boolean properties for toggling elements:

| Property Key | Type | Default | Usage |
|---|---|---|---|
| `Description#2821:5` | BOOLEAN | true | Show description text |
| `Show more#2821:10` | BOOLEAN | true | Show "show more" link |
| `Show more text#2821:30` | BOOLEAN | true | Show expanded text |
| `Primary button#2821:15` | BOOLEAN | true | Show primary action button |
| `Secondary Button#2821:20` | BOOLEAN | true | Show secondary button |
| `Timer bar#2821:25` | BOOLEAN | true | Show countdown bar |
| `Buttons#2821:35` | BOOLEAN | true | Show button row |
| `Close icon#2821:40` | BOOLEAN | true | Show close X icon |

**Variants:** `Status=success/warning/info/error`, `Type=Large - Left aligned/Centered`

**Simple alert (warning banner):** Use `Status=warning, Type=Large - Left aligned`. Disable all except `Description`.

## Placeholder / Empty State Component Properties

The Placeholder component (`92:49611`) is used for empty states inside panels.

| Property Key | Type | Default | Usage |
|---|---|---|---|
| `Description#3783:7` | BOOLEAN | true | Show description text |
| `Learn more link#3691:6` | BOOLEAN | true | Show "learn more" link |
| `CTA#3691:0` | BOOLEAN | true | Show CTA button |
| `Extras#4325:0` | BOOLEAN | true | Show extra elements |

**Variants:** `Size=XS/S/M/L/XL [icon]/XL [GIF]`

**Simple empty state:** Use `Size=M`, disable all booleans except heading. Override heading text via `findOne(n => n.name.includes('Heading'))`.

```javascript
const placeholderSet = await figma.getNodeByIdAsync('92:49611');
const mediumPH = placeholderSet.children.find(v => v.name === 'Size=M');
const placeholder = mediumPH.createInstance();
content.appendChild(placeholder);
placeholder.setProperties({
  'Description#3783:7': false,
  'Learn more link#3691:6': false,
  'CTA#3691:0': false,
  'Extras#4325:0': false,
});
const heading = placeholder.findOne(n => n.type === 'TEXT' && n.name.includes('Heading'));
if (heading) { await figma.loadFontAsync(heading.fontName); heading.characters = 'NO DATA TO DISPLAY'; }
```

## Figma API Gotchas

- `layoutSizingHorizontal = 'FILL'` only works AFTER appending to an auto-layout parent
- `findOne()` can return null in dynamic-page mode — prefer `getNodeByIdAsync()` with known IDs
- Always detach top-level instance first, then children — reverse order causes crashes
- Always `loadFontAsync(node.fontName)` before any text edit — use the node's actual font
- Instance `componentProperties` keys have `#nodeId` suffixes — check the actual keys before setting
