---
name: prototype-generator
description: Generate branded Figma prototypes from a brief, PRD, or verbal description. Use this skill when someone asks to "build a screen", "create a prototype", "design a page in Figma", "mock up a feature", "generate UI", or any task involving creating Figma designs programmatically. Also triggers for "build a layout", "create a form", "design a modal", "make a dashboard". Outputs production-quality Figma frames using FT DNA design tokens — not wireframes, not screenshots, not code.
---

# Prototype Generator

Build branded Figma prototypes using FT DNA design tokens, directly in Figma via the Desktop Bridge plugin.

## What This Produces

Figma frames with:
- Color variables bound (not hardcoded hex values)
- Typography following the FT DNA type scale (Inter, 400/700)
- Spacing from the sizing scale (0–64px)
- Auto-layout for responsive behavior
- Named layers for clean handoff

## Prerequisites

Before generating anything, verify:
1. **Figma Desktop Bridge** is running and connected (use `figma_list_open_files`)
2. **Target file** is open — generate INTO a sandbox/project file, never into FT DNA itself
3. **FT DNA file** is open — needed if using published library variables (optional for V1)

## Decision Engine

Before writing any Figma code, the generator reasons through three reference files:

1. **`references/page-patterns.md`** — Pattern selection. Maps user intent ("settings page", "list page", "modal") to a structural template with slot definitions, required components, and composition rules.
2. **`references/component-catalog.md`** — Component selection. For each slot in the pattern, maps natural language ("dropdown", "toggle", "status tag") to exact Figma component set IDs, variant properties, and default prop values.
3. **`references/base-template.md`** — Shell instantiation. How to create the page frame from the Base Template component.

**Read these files before generating.** They contain the variant selection logic, property keys, and anti-patterns that make output correct.

## Process

### Step 1: Understand the Brief

Read the input. It could be:
- A PRD or feature spec (from prd-writer or ClickUp)
- A verbal description ("build me a settings page with a form")
- A reference screenshot or existing design to recreate
- A ClickUp task with requirements

**Extract:**
- **What screens** are needed
- **What page pattern** each screen matches (settings, list, detail, modal, dashboard — see page-patterns.md)
- **What components** each screen needs — map to component-catalog.md entries
- **What states** matter (default, empty, error, loading, success)
- **What data** to show (realistic FT domain content, not "Lorem ipsum")

**Resolve components:** For each UI element mentioned in the brief, look up the component-catalog.md variant selection logic table. Example: "a form with dropdowns and toggles" → Input Fields (Type=Dropdown - Regular) + Toggle (Type=Unchecked, Alignment=Default).

Present the screen plan to the user before building:
```
Screen plan:
1. [Screen name] — Pattern: [settings/list/detail/modal]
   Components: [list with specific variants]
   Data: [what realistic content to show]
2. ...
States: [which screens need variants]
```

### Step 2: Bootstrap the Figma Session

Switch to the target file and set up helpers. Run this ONCE per session:

```javascript
// Load fonts
for (const f of [
  {family:'Inter', style:'Regular'},
  {family:'Inter', style:'Medium'},
  {family:'Inter', style:'Bold'},
  {family:'Noto Sans Mono', style:'Regular'}
]) { try { await figma.loadFontAsync(f); } catch(e) {} }

// Load FT DNA color variables
const allVars = await figma.variables.getLocalVariablesAsync('COLOR');
const V = {};
for (const v of allVars) {
  // Create shorthand: "mono.white", "pink.400", etc.
  const parts = v.name.split('/');
  const family = parts[0].toLowerCase();
  const token = parts[1]?.replace(/^color-(mono|brand|alt|wire)-/, '') || '';
  if (!V[family]) V[family] = {};
  V[family][token] = v;
}

// Load sizing variables
const sizeVars = await figma.variables.getLocalVariablesAsync('FLOAT');
const S = {};
for (const v of sizeVars) {
  S[v.name] = v;
}

// Helper: bind fill color to variable
function bf(node, variable) {
  if (!variable) return;
  let f = JSON.parse(JSON.stringify(node.fills));
  if (!f.length) f.push({type:'SOLID', color:{r:1,g:1,b:1}, opacity:1});
  f[0] = figma.variables.setBoundVariableForPaint(f[0], 'color', variable);
  node.fills = f;
}

// Helper: bind stroke color to variable
function bs(node, variable) {
  if (!variable) return;
  let s = JSON.parse(JSON.stringify(node.strokes));
  if (!s.length) s.push({type:'SOLID', color:{r:0,g:0,b:0}, opacity:1});
  s[0] = figma.variables.setBoundVariableForPaint(s[0], 'color', variable);
  node.strokes = s;
}

return JSON.stringify({
  colors: Object.keys(V).map(k => `${k}: ${Object.keys(V[k]).join(', ')}`),
  sizes: Object.keys(S)
}, null, 2);
```

> **Important:** If variables are empty (file has no published library), fall back to the variable IDs in `references/ft-dna-variables.json` and load them by ID:
> ```javascript
> const v = await figma.variables.getVariableByIdAsync('VariableID:28:16');
> ```

### Step 3: Build Screens

Build ONE screen per `figma_execute` call for complex screens, or batch simple elements.

#### Standard Page Layout (FT Back-Office)

The standard FT page layout is:
```
┌─────────────────────────────────────────┐
│ Side Menu (56px) │ Header (50px tall)    │
│                  │───────────────────────│
│                  │ Content area          │
│                  │  ┌─────────────────┐  │
│                  │  │ Standard Panel  │  │
│                  │  │ (32px inset)    │  │
│                  │  └─────────────────┘  │
└─────────────────────────────────────────┘
```

Screen frame: 1920×1080, white background.

```javascript
// Create screen frame
const screen = figma.createFrame();
screen.name = 'Screen Name';
screen.resize(1920, 1080);
screen.layoutMode = 'HORIZONTAL';
screen.counterAxisSizingMode = 'FIXED';
screen.primaryAxisSizingMode = 'FIXED';
bf(screen, V.monochrome?.white || V.mono?.white);
screen.clipsContent = true;
```

#### Side Menu (56px)
```javascript
const sideMenu = figma.createFrame();
sideMenu.name = 'Side Menu';
sideMenu.resize(56, 1080);
sideMenu.layoutMode = 'VERTICAL';
sideMenu.primaryAxisAlignItems = 'CENTER';
sideMenu.paddingTop = 16;
sideMenu.itemSpacing = 24;
bf(sideMenu, V.monochrome?.['700'] || V.mono?.['700']);
screen.appendChild(sideMenu);
sideMenu.layoutSizingVertical = 'FILL';
```

#### Content Column
```javascript
const contentCol = figma.createFrame();
contentCol.name = 'Content Column';
contentCol.layoutMode = 'VERTICAL';
contentCol.fills = [];
screen.appendChild(contentCol);
contentCol.layoutSizingHorizontal = 'FILL';
contentCol.layoutSizingVertical = 'FILL';
```

#### Header (50px)
```javascript
const header = figma.createFrame();
header.name = 'Header';
header.layoutMode = 'HORIZONTAL';
header.counterAxisAlignItems = 'CENTER';
header.paddingLeft = 32; header.paddingRight = 32;
header.itemSpacing = 16;
header.resize(1864, 50);
bf(header, V.monochrome?.white || V.mono?.white);
bs(header, V.monochrome?.['300'] || V.mono?.['300']);
header.strokeBottomWeight = 1;
header.strokeTopWeight = 0;
header.strokeLeftWeight = 0;
header.strokeRightWeight = 0;
contentCol.appendChild(header);
header.layoutSizingHorizontal = 'FILL';
```

#### Standard Panel
```javascript
const panelArea = figma.createFrame();
panelArea.name = 'Panel Area';
panelArea.layoutMode = 'VERTICAL';
panelArea.paddingTop = 32; panelArea.paddingBottom = 32;
panelArea.paddingLeft = 32; panelArea.paddingRight = 32;
panelArea.itemSpacing = 24;
bf(panelArea, V.monochrome?.['100'] || V.mono?.['100']);
contentCol.appendChild(panelArea);
panelArea.layoutSizingHorizontal = 'FILL';
panelArea.layoutSizingVertical = 'FILL';

const panel = figma.createFrame();
panel.name = 'Standard Panel';
panel.layoutMode = 'VERTICAL';
panel.paddingTop = 32; panel.paddingBottom = 32;
panel.paddingLeft = 32; panel.paddingRight = 32;
panel.itemSpacing = 24;
panel.cornerRadius = 8;
bf(panel, V.monochrome?.white || V.mono?.white);
bs(panel, V.monochrome?.['300'] || V.mono?.['300']);
panel.strokeWeight = 1;
panelArea.appendChild(panel);
panel.layoutSizingHorizontal = 'FILL';
panel.layoutSizingVertical = 'HUG';
```

### Step 4: Typography (Manual Until Text Styles Exist)

FT DNA type scale — apply these manually since text styles aren't published yet:

| Level | Size | Line Height | Weight | Use for |
|-------|------|-------------|--------|---------|
| Title | 20px | 25px | 700 | Panel headers, page titles |
| Sub-title | 16px | 23px | 400 | Section descriptions |
| Sub-title Bold | 16px | 23px | 700 | Section headers |
| Body | 14px | 17px | 400 | Default text, table cells |
| Body Bold | 14px | 17px | 700 | Labels, emphasis |
| CTA | 12px | auto | 700 | Buttons (uppercase) |
| Note | 12px | auto | 400 | Secondary info, timestamps |
| Caption | 10px | 12px | 700 | Tags, badges (uppercase, +0.4px tracking) |

```javascript
// Helper: create styled text
function createText(parent, content, level) {
  const t = figma.createText();
  t.characters = content;

  const styles = {
    'title':     { size: 20, lineHeight: {value: 25, unit: 'PIXELS'}, weight: 'Bold' },
    'subtitle':  { size: 16, lineHeight: {value: 23, unit: 'PIXELS'}, weight: 'Regular' },
    'subtitleBold': { size: 16, lineHeight: {value: 23, unit: 'PIXELS'}, weight: 'Bold' },
    'body':      { size: 14, lineHeight: {value: 17, unit: 'PIXELS'}, weight: 'Regular' },
    'bodyBold':  { size: 14, lineHeight: {value: 17, unit: 'PIXELS'}, weight: 'Bold' },
    'cta':       { size: 12, lineHeight: {unit: 'AUTO'}, weight: 'Bold', uppercase: true },
    'note':      { size: 12, lineHeight: {unit: 'AUTO'}, weight: 'Regular' },
    'caption':   { size: 10, lineHeight: {value: 12, unit: 'PIXELS'}, weight: 'Bold', uppercase: true, letterSpacing: 0.4 }
  };

  const s = styles[level] || styles.body;
  t.fontSize = s.size;
  t.lineHeight = s.lineHeight;
  t.fontName = { family: 'Inter', style: s.weight };
  if (s.uppercase) t.textCase = 'UPPER';
  if (s.letterSpacing) t.letterSpacing = { value: s.letterSpacing, unit: 'PIXELS' };

  parent.appendChild(t);
  t.layoutSizingHorizontal = 'FILL';
  return t;
}
```

### Step 5: Common UI Patterns

Build these from primitives. Each pattern should be a separate `figma_execute` call.

**Button (Primary):**
```javascript
const btn = figma.createFrame();
btn.name = 'Button';
btn.layoutMode = 'HORIZONTAL';
btn.counterAxisAlignItems = 'CENTER';
btn.primaryAxisAlignItems = 'CENTER';
btn.paddingLeft = 16; btn.paddingRight = 16;
btn.resize(100, 32);
btn.cornerRadius = 4;
bf(btn, V.pink?.['400']);
parent.appendChild(btn);
btn.layoutSizingHorizontal = 'HUG';

const btnText = figma.createText();
btnText.characters = 'BUTTON';
btnText.fontSize = 12;
btnText.fontName = {family:'Inter', style:'Bold'};
btnText.textCase = 'UPPER';
btnText.fills = [{type:'SOLID', color:{r:1,g:1,b:1}}];
btn.appendChild(btnText);
```

**Input Field:**
```javascript
const inputGroup = figma.createFrame();
inputGroup.name = 'Input Group';
inputGroup.layoutMode = 'VERTICAL';
inputGroup.itemSpacing = 4;
inputGroup.fills = [];
parent.appendChild(inputGroup);
inputGroup.layoutSizingHorizontal = 'FILL';
inputGroup.layoutSizingVertical = 'HUG';

// Label
const label = figma.createText();
label.characters = 'Label';
label.fontSize = 12; label.fontName = {family:'Inter', style:'Bold'};
bf(label, V.monochrome?.['600'] || V.mono?.['600']);
inputGroup.appendChild(label);

// Input
const input = figma.createFrame();
input.name = 'Input';
input.layoutMode = 'HORIZONTAL';
input.counterAxisAlignItems = 'CENTER';
input.paddingLeft = 12; input.paddingRight = 12;
input.resize(300, 36);
input.cornerRadius = 4;
bf(input, V.monochrome?.white || V.mono?.white);
bs(input, V.monochrome?.['300'] || V.mono?.['300']);
input.strokeWeight = 1;
inputGroup.appendChild(input);
input.layoutSizingHorizontal = 'FILL';

const placeholder = figma.createText();
placeholder.characters = 'Placeholder';
placeholder.fontSize = 14; placeholder.fontName = {family:'Inter', style:'Regular'};
bf(placeholder, V.monochrome?.['400'] || V.mono?.['400']);
input.appendChild(placeholder);
placeholder.layoutSizingHorizontal = 'FILL';
```

**Table Row:**
```javascript
const row = figma.createFrame();
row.name = 'Table Row';
row.layoutMode = 'HORIZONTAL';
row.counterAxisAlignItems = 'CENTER';
row.paddingLeft = 16; row.paddingRight = 16;
row.resize(1000, 48);
row.fills = [];
bs(row, V.monochrome?.['200'] || V.mono?.['200']);
row.strokeWeight = 1;
row.strokeTopWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0;
parent.appendChild(row);
row.layoutSizingHorizontal = 'FILL';
```

**Tag / Badge:**
```javascript
const tag = figma.createFrame();
tag.name = 'Tag';
tag.layoutMode = 'HORIZONTAL';
tag.counterAxisAlignItems = 'CENTER';
tag.paddingTop = 2; tag.paddingBottom = 2;
tag.paddingLeft = 8; tag.paddingRight = 8;
tag.cornerRadius = 4;
bf(tag, V.green?.['200']);
parent.appendChild(tag);
tag.layoutSizingHorizontal = 'HUG';
tag.layoutSizingVertical = 'HUG';

const tagText = figma.createText();
tagText.characters = 'Active';
tagText.fontSize = 10; tagText.fontName = {family:'Inter', style:'Bold'};
tagText.textCase = 'UPPER';
tagText.letterSpacing = {value: 0.4, unit: 'PIXELS'};
bf(tagText, V.green?.['500']);
tag.appendChild(tagText);
```

**Alert / Info Banner:**
```javascript
const alert = figma.createFrame();
alert.name = 'Alert';
alert.layoutMode = 'HORIZONTAL';
alert.counterAxisAlignItems = 'CENTER';
alert.paddingTop = 12; alert.paddingBottom = 12;
alert.paddingLeft = 16; alert.paddingRight = 16;
alert.itemSpacing = 12;
alert.cornerRadius = 4;
bf(alert, V.blue?.['200']);
parent.appendChild(alert);
alert.layoutSizingHorizontal = 'FILL';
alert.layoutSizingVertical = 'HUG';
```

### Step 6: Slide-In Panel (Modal Pattern)

Many FT features use a slide-in panel from the right (1250px wide):

```javascript
const slideIn = figma.createFrame();
slideIn.name = 'Slide In Panel';
slideIn.layoutMode = 'HORIZONTAL';
slideIn.fills = [];
screen.appendChild(slideIn);
slideIn.layoutSizingHorizontal = 'FILL';
slideIn.layoutSizingVertical = 'FILL';

// Scrim (left side)
const scrim = figma.createFrame();
scrim.name = 'Scrim';
scrim.fills = [{type:'SOLID', color:{r:0,g:0,b:0}, opacity:0.5}];
slideIn.appendChild(scrim);
scrim.layoutSizingHorizontal = 'FILL';
scrim.layoutSizingVertical = 'FILL';

// Panel (right side, fixed 1250px)
const slidePanel = figma.createFrame();
slidePanel.name = 'Panel';
slidePanel.resize(1250, 1080);
slidePanel.layoutMode = 'VERTICAL';
bf(slidePanel, V.monochrome?.white || V.mono?.white);
slideIn.appendChild(slidePanel);
slidePanel.layoutSizingVertical = 'FILL';
```

### Step 7: Verify

After building each screen:
1. **Take a screenshot** using `figma_take_screenshot` or `figma_capture_screenshot`
2. **Check** the output visually — are colors correct? Is spacing consistent? Are labels readable?
3. **Fix** any issues before moving to the next screen

### Step 8: Organize Canvas

Position screens in a grid:
- X spacing: 100px between screens
- Row 1: Default states
- Row 2: Alternate states (empty, error, success)
- Naming: `[Feature] — [Screen] — [State]`

## Critical Rules

1. **NEVER hardcode hex colors** — always bind to FT DNA variables using `bf()` / `bs()`
2. **ALWAYS append to parent BEFORE setting layoutSizing** — Figma silently ignores sizing on unparented nodes
3. **Load fonts BEFORE changing text** — `figma.loadFontAsync({family:'Inter', style:'Regular'})`
4. **One complex component per figma_execute call** — avoids timeout (default 5000ms, max 30000ms)
5. **Use realistic content** — "Premier League 2025 Campaign" not "Lorem ipsum". "john.smith@casino.com" not "email@example.com"
6. **Screenshot after every major addition** — catch layout issues early
7. **Build in the Playground file, never in FT DNA** — FT DNA is source of truth, not a canvas

## Base Template (V2 — Component Instances)

The standard FT page layout has been reverse-engineered from FT DNA node `64:934`. All components are **remote library instances** from DSP-Master. Use `importComponentByKeyAsync()` to instantiate them directly — this produces pixel-perfect output with all internal variable bindings intact.

See `references/base-template.md` for the full structure, component keys, and variable bindings.

### Quick-Start: Create Instance from Base Template

The FT DNA file (`7J3dSTuOSRlsHBqQ4ohtxI`) has a **Base Template** component (`94:21370`) on the 🧫 Workbench page. All its children (side menu, Page Header, Standard Panel) are local components — no DSP-Master dependency.

To start a new prototype, create an instance of this component on the 🧪 Sandbox page:

```javascript
// 1. Get the Base Template component from Workbench
const baseTemplate = await figma.getNodeByIdAsync('94:21370'); // COMPONENT on Workbench

// 2. Switch to Sandbox page for prototyping
const sandbox = figma.root.children.find(p => p.name.includes('Sandbox'));
await figma.setCurrentPageAsync(sandbox);

// 3. Create an instance
const screen = baseTemplate.createInstance();
screen.name = 'My New Screen';
// Position relative to existing content
screen.x = 0;
screen.y = 0;
```

> **Note:** Use `getNodeByIdAsync('94:21370')` — NOT `findOne()`. The `findOne` method can return null in dynamic-page mode. Direct ID lookup is reliable.
>
> **Key difference from old approach:** We now use `createInstance()` on the Base Template COMPONENT instead of cloning a seed instance. This is cleaner — every prototype is a proper instance of the template.

### Navigating the Instance

After creating the instance, access sub-components by index:

```javascript
// Side menu (first child)
const sideMenu = screen.children[0]; // INSTANCE "side menu" (local: 92:46353)

// Page Header (second child)
const header = screen.children[1]; // INSTANCE "Page Header" (local: 97:90645)

// Content area > Standard Panel (third child > first child)
const contentFrame = screen.children[2]; // FRAME "Frame 1317"
const panel = contentFrame.children[0]; // INSTANCE "Standard Panel" (local: 92:46584)

// Panel header (first child of panel)
// Content placeholder (second child of panel)
```

### Default Template Rules

Apply these immediately after cloning. They represent the standard "clean" starting state. Features can be turned on per-brief.

#### Content Placeholder — No padding, no fill

The content placeholder (`panel.children[1]` after detach) must have **zero padding and no fill color**. This is a hard rule with very few exceptions. Content inside the panel owns its own spacing.

```javascript
const contentPlaceholder = detachedPanel.children[1];
contentPlaceholder.paddingTop = 0;
contentPlaceholder.paddingBottom = 0;
contentPlaceholder.paddingLeft = 0;
contentPlaceholder.paddingRight = 0;
contentPlaceholder.fills = [];
```

#### Page Composition Rules

These apply to every generated page:

1. **Alerts always go at the top** of the panel content area (first child), unless the brief explicitly says otherwise.
2. **Alert defaults: description + close icon only.** After instantiating an alert, immediately set these defaults:
   ```javascript
   alertInstance.setProperties({
     'Close icon#2821:40': true,
     'Description#2821:5': true,
     'Buttons#2821:35': false,
     'Show more text#2821:30': false,
     'Timer bar#2821:25': false,
     'Secondary Button#2821:20': false,
     'Show more#2821:10': false,
     'Primary button#2821:15': false,
   });
   ```
   Only enable additional elements (buttons, show more, timer) when the brief calls for them.
3. **No dividers.** We don't have a divider component. Do not create separator frames between sections. Use spacing (auto-layout `itemSpacing`) to separate content sections instead.
4. **Toggles hug content.** Toggle instances must use `layoutSizingHorizontal = 'HUG'`, never `'FILL'`. The label text hugs the toggle control — they don't stretch across the row.

#### Header — Structure (Local Page Header)

The local Page Header has NO boolean toggle props (unlike the old DSP-Master header). It contains:
- `Left - Breadcrumb Navigation` — INSTANCE with `LVL no. and rename` prop
- `Right - CTA and icons` — FRAME with button instances

To configure, hide extra buttons and set breadcrumb text directly:

```javascript
// Set breadcrumb to 1 level
const breadNav = header.findOne(n => n.name === 'Left - Breadcrumb Navigation');
breadNav.setProperties({ 'LVL no. and rename': '5' });
for (let i = 1; i < breadNav.children.length; i++) breadNav.children[i].visible = false;
breadNav.children[0].setProperties({ 'Select state': 'Selected' });
const bcText = breadNav.children[0].findOne(n => n.type === 'TEXT');
await figma.loadFontAsync(bcText.fontName);
bcText.characters = 'Page Title';

// Hide extra CTA buttons, keep only main
const rightCTA = header.findOne(n => n.name === 'Right - CTA and icons');
const buttons = rightCTA.children;
for (let i = 0; i < buttons.length - 1; i++) buttons[i].visible = false;
const mainBtn = buttons[buttons.length - 1];
const btnText = mainBtn.findOne(n => n.type === 'TEXT');
await figma.loadFontAsync(btnText.fontName);
btnText.characters = 'SAVE CHANGES';
```

#### Breadcrumbs — 1 level by default

The breadcrumb component's minimum variant is "5". To show only 1 level: switch to "5" variant, hide all children except the first, and set that first breadcrumb to `Selected` state.

```javascript
const breadNav = header.findOne(n => n.name === 'Left - Breadcrumb Navigation');
breadNav.setProperties({ 'LVL no. and rename': '5' });
const bcChildren = breadNav.children;
// Hide all except first
for (let i = 1; i < bcChildren.length; i++) bcChildren[i].visible = false;
// Set first to Selected (bold, current page)
bcChildren[0].setProperties({ 'Select state': 'Selected' });
// Set text
const textNode = bcChildren[0].findOne(n => n.type === 'TEXT' && n.name.includes('Level'));
await figma.loadFontAsync(textNode.fontName);
textNode.characters = 'Page Title';
```

To add more breadcrumb levels later, unhide the next chevron + level pair and set their text.

### Modifying Instance Properties

For INSTANCE nodes, **never edit text directly** — use `figma_set_instance_properties` or `setProperties()`:

```javascript
// Set header button visibility
header.setProperties({
  'Primary Button#3781:26': true,
  'Secondary Button#3781:22': false,
  'Lock#3781:25': false,
});

// Set panel header options
const panelHeader = panel.children[0]; // First child is Panel Header instance
panelHeader.setProperties({
  'Search#4635:14': true,
  'Toggle#4635:15': false,
  'Description#4635:13': true,
});
```

### Button Keys (button-btn component set)

| Variant | Key | Use |
|---------|-----|-----|
| Type=main | `2e8d3dd7c848a34638be9b5f4ff09fc65c3c6748` | Primary CTA (pink) |
| Type=alt | `e2fb234f1d160ba6003fd038e41c353c1d6f1747` | Secondary CTA (outline) |
| Type=icon | `df2b2911e0d77392d1aab55f556b432693fd3d78` | Icon-only (kebab, etc.) |

### Populating Content with Local Components

After detaching the Standard Panel, build content using **local components from the Workbench page**. Components are accessible cross-page via `getNodeByIdAsync`.

```javascript
// Get a component variant by ID (from component-catalog.md)
const textInputFilled = await figma.getNodeByIdAsync('91:6590');
const instance = textInputFilled.createInstance();

// Add to a parent FIRST, then set FILL sizing
parentFrame.appendChild(instance);
instance.layoutSizingHorizontal = 'FILL'; // Must be child of auto-layout frame first!
```

#### Overriding Text in Instances

Instance text overrides work by finding nested TEXT nodes and writing to them directly:

```javascript
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });

// Find text node inside an Input Fields instance
const labelNode = inputInstance.findOne(n => n.name === 'Label text here' && n.type === 'TEXT');
if (labelNode) {
  await figma.loadFontAsync(labelNode.fontName); // Always load the actual font
  labelNode.characters = 'Broadcast Name';
}
const placeholder = inputInstance.findOne(n => n.name === 'Placeholder' && n.type === 'TEXT');
if (placeholder) {
  await figma.loadFontAsync(placeholder.fontName);
  placeholder.characters = 'Welcome Back Campaign';
}
```

#### Key Component IDs (Workbench page)

| Component | ID | Recommended Variant |
|-----------|----|-------------------|
| Input Fields | `91:6537` | See variants: Text input, Dropdown, Search, Text Area × states |
| button-btn | `91:8299` | Type=main (pink), Type=alt (outline), Type=icon |
| Toggle | `91:8647` | Checked/Unchecked × Justified (with label) |
| alert | `92:40484` | Status=info/success/warning/error × Large/Centered |
| Dropdown list | `91:11007` | Specific Dropdown list item variants |

For the full catalog, see `references/component-catalog.md`.

#### Form Layout Pattern (proven)

```javascript
// Create a form section
const section = figma.createFrame();
section.name = 'Section Name';
section.layoutMode = 'VERTICAL';
section.itemSpacing = 16;
section.primaryAxisSizingMode = 'AUTO';
section.counterAxisSizingMode = 'AUTO';
section.fills = [];
contentPlaceholder.appendChild(section);
section.layoutSizingHorizontal = 'FILL';

// Two-column row
const row = figma.createFrame();
row.name = 'Form Row';
row.layoutMode = 'HORIZONTAL';
row.itemSpacing = 24;
row.primaryAxisSizingMode = 'AUTO';
row.counterAxisSizingMode = 'AUTO';
row.fills = [];
section.appendChild(row);
row.layoutSizingHorizontal = 'FILL';

// Add inputs (append first, THEN set FILL)
const input = comp.createInstance();
row.appendChild(input);
input.layoutSizingHorizontal = 'FILL';
```

## Choosing V1 vs V2

| Approach | When to use |
|----------|-------------|
| **V1 (primitives)** | Custom layouts, components not in library, rapid wireframes |
| **V2 (instances)** | Standard pages, forms, tables — anything the library covers |
| **Hybrid** | Use V2 for shell (side menu, header, panel) + V1 for custom content inside the panel |

Default: **Hybrid.** Create instance from Base Template, detach the whole screen (`detachInstance()` returns the new FRAME node), then detach the panel, and populate content with local component instances from Workbench.

### Critical: detachInstance() Pattern

`detachInstance()` returns the new FRAME node. Always capture the return value:

```javascript
// CORRECT — capture the returned frame
const baseTemplate = await figma.getNodeByIdAsync('94:21370');
const inst = baseTemplate.createInstance();
inst.name = 'My Screen';
inst.x = 0; inst.y = 0;
const screen = inst.detachInstance(); // Returns the new FRAME

// Now detach the panel inside
const contentFrame = screen.children[2]; // Frame 1317
const panel = contentFrame.children[0]; // Standard Panel instance
const detachedPanel = panel.detachInstance(); // Returns the panel FRAME
const panelHeader = detachedPanel.children[0]; // Panel Header instance
const contentPlaceholder = detachedPanel.children[1]; // content placeholder FRAME
```

**Why detach the top-level instance?** Detaching a nested instance inside a parent instance breaks sublayer ID references and causes crashes. Always detach from the top level first.

**Why detach at all?** Instances are read-only structures. To add custom children (form fields, sections, etc.), the panel must be a plain FRAME.

## Verified Variant Names (from test 2026-03-17)

These are the EXACT variant names. Using wrong names causes silent failures.

| Component | Variant Name (exact) |
|-----------|---------------------|
| Input (text) | `Type=Text input, State=default-empty` |
| Input (dropdown) | `Type=Dropdown - Regular, State=default-empty` |
| Toggle (on) | `Type=Checked, Status=Default, Alignment=Justified` |
| Toggle (off) | `Type=Unchecked, Status=Default, Alignment=Justified` |
| Alert (info) | `Status=info, Type=Large - Left aligned` |
| Alert (success) | `Status=success, Type=Large - Left aligned` |
| Alert (warning) | `Status=warning, Type=Large - Left aligned` |
| Alert (error) | `Status=error, Type=Centered` |

### Text Override Gotchas

1. **Toggle labels:** The text node is named `"Enter option text here"` — NOT "Label". Search by that name or by `node.characters === 'Enter option text here'`.
2. **Alert text:** `setProperties` controls visibility of title/description, but text overrides require deep traversal. Title node name = the default title string. Use `findAll` to scan all TEXT nodes in the alert, then match by content:
   ```javascript
   const texts = [];
   const scan = (node) => {
     if (node.type === 'TEXT') texts.push(node);
     if (node.children) for (const c of node.children) scan(c);
   };
   scan(alertInstance);
   // Title is the bold 16px text, Description is the regular 14px text
   ```
3. **Panel header Sub-Title:** Node is named `"Sub-Title"`, accessible via deep scan on the Panel Header instance.
4. **Input labels:** Text node named `"Label text here"` (with space), placeholder node named `"Placeholder"`.

## Limitations

- Text styles: not published yet — apply typography manually using the type scale table
- Icons: use SVG via `figma.createNodeFromSvg()` or FontAwesome unicode characters
- `layoutSizingHorizontal = 'FILL'` can only be set AFTER appending to an auto-layout parent
- `findOne()` can return null in dynamic-page mode — prefer `getNodeByIdAsync()` with known IDs
- Always `loadFontAsync()` before any text editing, using the node's actual `fontName`
- Instance children traversal can fail in dynamic-page mode — use recursive `node.children` scan instead of `findAll()`

## Reference Files

**Read BEFORE generating:**
- `references/page-patterns.md` — Page pattern templates: settings, list, detail, modal, dashboard. Slot definitions, composition rules, anti-patterns.
- `references/component-catalog.md` — Full component intelligence: 52 Figma items, all prop keys, variant selection logic, default values, compliance rules. Vue cross-reference.

**Structural reference:**
- `references/base-template.md` — Base Template node structure, children navigation, clone workflow
- `references/ft-dna-variables.json` — Complete variable ID map (FT DNA color + sizing variables)
