# Code Patterns

> Executable code snippets for the prototype-generator skill. Each pattern is proven and tested.
> Last updated: 2026-03-23

---

## ⛔ Pre-Build Protocol (MANDATORY — execute before ANY Figma work)

> **This is not optional.** Every gate must pass before `figma_execute` is called.
> Each gate produces visible output in the conversation. No silent skipping.

### Gate 0: STOP — Do I Have What I Need?

```
□ Reference screenshot exists?
  → YES: proceed
  → NO: run `npm run snap <path>` or ask user. DO NOT BUILD WITHOUT A REFERENCE.

□ Quick Access has a clonable template for this page?
  → YES: CLONE IT. Do not rebuild from scratch. Customize text/data only.
  → NO: proceed to build from components.
```

**Quick Access Templates (clone first, ask questions later):**

| Pattern | Template | Node ID |
|---------|----------|---------|
| Empty shell | Full page template (base) | `92:54630` |
| LIST-FULL | All Activities | `92:55380` |
| LIST-TAB | Lifecycles | `181:72894` |
| SLIDEIN (full comp, SDT) | New Activity - SDT | `92:56151` |
| SLIDEIN (full comp, Recurring) | New Activity - Recurring | `92:56159` |
| Slide-in LVL 1 shell | Slide-in LVL 1 | `92:54631` |
| Slide-in LVL 2 shell | Slide-in LVL 2 | `92:55549` |
| Activity Builder SDT | Activity Builder/SDT | `92:54684` |
| Activity Builder Recurring | Activity Builder/Recurring | `92:55332` |
| Overlay (small) | Overlay blur-small | `92:55554` |
| Overlay (full page) | Overlay blur-full | `92:55556` |
| LIST-NESTED | Email Templates (Standard) | `180:69323` |

### Gate 1: Load Context — Read ONLY What This Build Needs

**Directed reading paths by pattern type:**

| Building... | Read from page-patterns.md | Read from code-patterns.md | Clone from |
|---|---|---|---|
| `LIST-SIMPLE` | §Shared Shell, §Pattern 2a, §Shared Table Rules | §Bootstrap, §Table Composition, §Pagination | `92:55380` (adapt) |
| `LIST-TAB` | §Shared Shell, §Pattern 2b, §Shared Table Rules | §Bootstrap, §Tabs, §Table Composition | `92:55380` or `181:72894` |
| `LIST-FULL` | §Shared Shell, §Pattern 2c, §Shared Table Rules | §Bootstrap, §Tabs, §Icon Toolbar, §Table Composition | `92:55380` |
| `FORM` | §Shared Shell, §Pattern 1 | §Bootstrap, §Form Fields, §Multi-Panel, §Dropdown, §Radio, §Toggle | — |
| `SLIDEIN` | §Pattern 4 (relevant sub-pattern) | §Bootstrap, §Form Fields, §Multi-Panel | `92:56151` or `92:54631` |
| `HUB` | §Pattern 7 | §Hub Card Grid | — |
| `DASH` | §Shared Shell, §Pattern 5 | §Bootstrap, §Multi-Panel | — |
| `DETAIL` | §Shared Shell, §Pattern 3 | §Bootstrap, §Form Fields | — |
| `GRID` | §Shared Shell, §Pattern 6 | §Bootstrap, §Table Composition (for pagination) | — |

**Always also read:**
- component-ids.md §Component Property Registry (for property keys)
- scan-manifest.json for the target page (icon names, labels, DOM structure)

### Gate 2: Element Map — Write It Out Before Coding

List every element from the reference screenshot. Map each to:
- Component + variant (from component-ids.md)
- Sizing rule (from documented rules — NOT visual estimation)
- Content text (from scan data or screenshot — NOT guesses)

**If any detail is unknown:**
- Icon name not in scan data? → **SAY SO and ask.** Do not guess.
- Component property key unknown? → Check the Property Registry. If not there, probe once and document.
- Page content not visible in screenshot? → **SAY SO and ask.** Do not fabricate.

### Gate 3: Plan Verification — Check Against Rules

Before writing code, verify:

```
□ Panel spacing = 32px? (universal — no exceptions)
□ Panels = 1700px FIXED? (unless split panel or slide-in)
□ All fills/strokes use variable binding? (bindFill/bindStroke with V.xxx)
□ Content frame = FILL height, top-centre aligned? (primaryAxisAlignItems: MIN)
□ Text nodes in cards = HUG / WIDTH_AND_HEIGHT? (never FILL / HEIGHT)
□ Search input = 350px? (when standalone — NOT in Panel Header)
□ Panel Header search = built-in icon button? (not standalone Search input)
□ Icon buttons = Status=default? (never hover/focused)
□ Tabs outside panels, 32px gap between tabs? (when present)
□ Table header sort icons = ALL HIDDEN? (never show sort arrows unless brief explicitly asks)
□ Page Header present? (check screenshot — some pages have NO header at all)
□ Building on Pastebin page? (not Sandbox)
□ Any values not from documented rules? → CHECK or ASK
```

### Gate 4: Build

- Use the Standard Preamble (next section) for boilerplate
- One phase at a time
- Screenshot after each phase

### Gate 5: Post-Build Verification

After building, systematically compare against the reference:

```
□ Header: breadcrumb level, CTA text, visible icons match?
□ Panel count and layout match reference?
□ Spacing between panels = 32px?
□ All text content matches reference exactly?
□ Content alignment correct (top-centre)?
□ No hardcoded RGB — all variable-bound?
□ Side menu section matches product area?
□ Header columns align 1:1 with data row columns? (every data cell needs a matching header cell/spacer)
□ Overall proportions match reference at 1x scale?
```

If any check fails → fix before presenting to user.

---

## Standard Preamble (copy into every build script)

```javascript
// === STANDARD PREAMBLE ===
async function bindFill(node, variableId) {
  const variable = await figma.variables.getVariableByIdAsync(variableId);
  const baseFill = node.fills?.length > 0 ? { ...node.fills[0] } : { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };
  node.fills = [figma.variables.setBoundVariableForPaint(baseFill, 'color', variable)];
}
async function bindStroke(node, variableId) {
  const variable = await figma.variables.getVariableByIdAsync(variableId);
  const base = node.strokes?.length > 0 ? { ...node.strokes[0] } : { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
  node.strokes = [figma.variables.setBoundVariableForPaint(base, 'color', variable)];
}
const V = {
  white:    'VariableID:28:5',
  mono100:  'VariableID:28:6',
  mono200:  'VariableID:28:7',
  mono300:  'VariableID:28:8',
  mono400:  'VariableID:28:9',
  mono500:  'VariableID:28:10',
  mono600:  'VariableID:28:11',
  mono700:  'VariableID:28:12',
  black:    'VariableID:28:13',
  pink500:  'VariableID:28:17',
  green400: 'VariableID:28:46',
  red500:   'VariableID:28:37',
  yellow400:'VariableID:28:31',
  blue600:  'VariableID:28:28',
};
await figma.loadFontAsync({family:'Inter', style:'Regular'});
await figma.loadFontAsync({family:'Inter', style:'Bold'});
await figma.loadFontAsync({family:'Inter', style:'Medium'});
const baseTemplate = await figma.getNodeByIdAsync('94:21370');
// === END PREAMBLE ===
```

---

## Variable Binding Helpers (MANDATORY — never hardcode colours)

Include these helpers at the top of every build script. All fills and strokes MUST use variable binding.

```javascript
// Bind a colour variable to a node's fill
async function bindFill(node, variableId) {
  const variable = await figma.variables.getVariableByIdAsync(variableId);
  const baseFill = node.fills?.length > 0 ? { ...node.fills[0] } : { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };
  const boundFill = figma.variables.setBoundVariableForPaint(baseFill, 'color', variable);
  node.fills = [boundFill];
}

// Bind a colour variable to a node's stroke
async function bindStroke(node, variableId) {
  const variable = await figma.variables.getVariableByIdAsync(variableId);
  const baseStroke = node.strokes?.length > 0 ? { ...node.strokes[0] } : { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
  const boundStroke = figma.variables.setBoundVariableForPaint(baseStroke, 'color', variable);
  node.strokes = [boundStroke];
}

// Common variable IDs — see component-ids.md for full list
const V = {
  white:    'VariableID:28:5',   // #FFFFFF
  mono100:  'VariableID:28:6',   // #FAFAFA — panel bg, secondary surface
  mono200:  'VariableID:28:7',   // #F5F5F5 — card bg, tertiary surface
  mono300:  'VariableID:28:8',   // #E5E5E5 — border base
  mono400:  'VariableID:28:9',   // #CACACA — border subtle
  mono500:  'VariableID:28:10',  // #959595 — text tertiary
  mono600:  'VariableID:28:11',  // #666666 — text secondary
  mono700:  'VariableID:28:12',  // #2C2C2C — text primary
  black:    'VariableID:28:13',  // #000000
  pink500:  'VariableID:28:17',  // #D52454 — primary/CTA
  green400: 'VariableID:28:46',  // #3AAA35 — success/active
  red500:   'VariableID:28:37',  // #CD1913 — error
  yellow400:'VariableID:28:31',  // #FFDB14 — warning
  blue600:  'VariableID:28:28',  // #105DBA — info/link
};

// Usage:
// await bindFill(panel, V.mono100);
// await bindStroke(panel, V.mono300);
// await bindFill(card, V.white);
```

---

## Bootstrap: Instantiate Base Template

```javascript
const baseTemplate = await figma.getNodeByIdAsync('94:21370');
const instance = baseTemplate.createInstance();
const sandbox = figma.root.children.find(p => p.name === '🧪 Sandbox');
await figma.setCurrentPageAsync(sandbox);
sandbox.appendChild(instance);
instance.x = DESIRED_X;
instance.y = 0;

const screen = instance.detachInstance();
screen.name = 'Screen Name — State';

const contentFrame = screen.children.find(c => c.name === 'Frame 1317');
const panelInstance = contentFrame.children.find(c => c.name === 'Standard Panel');

let panel = panelInstance.type === 'INSTANCE' ? panelInstance.detachInstance() : panelInstance;
panel.itemSpacing = 32; // RULE: 32px between Panel Header and content — always
let panelHeader = panel.children.find(c => c.name === 'Panel Header');
if (panelHeader?.type === 'INSTANCE') panelHeader = panelHeader.detachInstance();

const content = panel.children.find(c => c.name === 'content placeholder');

await figma.loadFontAsync({family:'Inter', style:'Regular'});
await figma.loadFontAsync({family:'Inter', style:'Bold'});
await figma.loadFontAsync({family:'Inter', style:'Medium'});
```

## Override Shell Text

```javascript
// Panel Header
const titleNode = panelHeader.findOne(n => n.type === 'TEXT' && n.name === 'Title');
await figma.loadFontAsync(titleNode.fontName);
titleNode.characters = 'Panel Title';

const subtitleNode = panelHeader.findOne(n => n.type === 'TEXT' && n.name === 'Sub-Title');
await figma.loadFontAsync(subtitleNode.fontName);
subtitleNode.characters = 'Description text';

// Page Header breadcrumbs + CTA
// IMPORTANT: Detach the header FIRST if you need to swap breadcrumbs or insert/remove children.
// Without detaching, insertChild fails with "Cannot move node. New parent is an instance."
// CTA text is SENTENCE CASE: "Add Player", "Save Changes", "Create Campaign" — NOT uppercase
let header = screen.children.find(c => c.name === 'Page Header' || c.name === 'Header');
if (header?.type === 'INSTANCE') header = header.detachInstance();
const allTexts = header.findAll(n => n.type === 'TEXT');
for (const t of allTexts) {
  await figma.loadFontAsync(t.fontName);
  if (t.characters === 'Level 1') t.characters = 'Home';
  if (t.characters === 'Level 2') t.characters = 'Page Name';
  if (t.characters === 'Button text') t.characters = 'Add Player'; // Sentence case
  if (t.characters === 'Heading') t.characters = 'Page Name';
}
```

## Tabs (List Pages)

Tabs go at the **content area level**, ABOVE the panel. Width must match the panel.

```javascript
const tabSet = await figma.getNodeByIdAsync('91:19098');
const tabSelected = tabSet.children.find(v => v.name.includes('Type=tab-text') && v.name.includes('Status=Selected'));
const tabDefault = tabSet.children.find(v => v.name.includes('Type=tab-text') && v.name.includes('Status=Default'));

const tabBar = figma.createFrame();
tabBar.name = 'Tab Bar';
tabBar.layoutMode = 'HORIZONTAL';
tabBar.itemSpacing = 32; // RULE: always 32px between tabs
tabBar.fills = [];
contentFrame.insertChild(0, tabBar);
tabBar.layoutSizingHorizontal = 'FIXED';
tabBar.resize(panel.width, 32); // Match panel width exactly
contentFrame.itemSpacing = 16;

const tabs = [['Active', true], ['VIP', false], ['Suspended', false]];
for (const [name, selected] of tabs) {
  const tab = (selected ? tabSelected : tabDefault).createInstance();
  tabBar.appendChild(tab);
  const titleFrame = tab.findOne(n => n.name === 'tab title and alert circle');
  if (titleFrame) {
    const titleText = titleFrame.findOne(n => n.type === 'TEXT');
    if (titleText) { await figma.loadFontAsync(titleText.fontName); titleText.characters = name; }
    const alert = titleFrame.findOne(n => n.name === 'alert circle');
    if (alert) alert.visible = false;
  }
  const badge = tab.findOne(n => n.name === 'Badge');
  if (badge) badge.visible = false;
}
```

## Table Composition

Each table row is a **horizontal Frame** containing multiple **Row cell instances** side by side.

```javascript
content.layoutMode = 'VERTICAL';
content.itemSpacing = 0;
while (content.children.length > 0) content.children[0].remove();

// Get components
const headerComp = await figma.getNodeByIdAsync('91:39176');
const rowSet = await figma.getNodeByIdAsync('91:39179');
const textEven = rowSet.children.find(v => v.name === 'Type=Text, Position=EVEN');
const textOdd = rowSet.children.find(v => v.name === 'Type=Text, Position=ODD');
const textIconEven = rowSet.children.find(v => v.name === 'Type=Text+leading icon, Position=EVEN');
const textIconOdd = rowSet.children.find(v => v.name === 'Type=Text+leading icon, Position=ODD');
const ellipsisEven = rowSet.children.find(v => v.name === 'Type=ellipsis, Position=EVEN');
const ellipsisOdd = rowSet.children.find(v => v.name === 'Type=ellipsis, Position=ODD');

// HEADER ROW — uses Header component instances
const headerRow = figma.createFrame();
headerRow.name = 'Table Header';
headerRow.layoutMode = 'HORIZONTAL';
headerRow.itemSpacing = 0;
headerRow.fills = [];
content.appendChild(headerRow);
headerRow.layoutSizingHorizontal = 'FILL';
headerRow.layoutSizingVertical = 'HUG';

for (const col of columns) {
  const cell = headerComp.createInstance();
  headerRow.appendChild(cell);
  const text = cell.findOne(n => n.type === 'TEXT' && n.name === 'Heading');
  if (text) { await figma.loadFontAsync(text.fontName); text.characters = col; }
  cell.layoutSizingHorizontal = 'FILL';
  // Sort icon OFF by default — only enable when brief explicitly asks for sorting
  const sortIcon = cell.findOne(n => n.name === 'v7-icon' || n.name === 'icon');
  if (sortIcon) sortIcon.visible = false;
  // For fixed-width columns: cell.layoutSizingHorizontal = 'FIXED'; cell.resize(150, cell.height);
}
// Action column spacer
const actionSpacer = figma.createFrame();
actionSpacer.resize(56, 40); actionSpacer.fills = [];
headerRow.appendChild(actionSpacer);

// DATA ROWS
for (let i = 0; i < data.length; i++) {
  const isEven = i % 2 === 0;
  const row = figma.createFrame();
  row.name = data[i].name;
  row.layoutMode = 'HORIZONTAL';
  row.itemSpacing = 0;
  row.fills = [];
  content.appendChild(row);
  row.layoutSizingHorizontal = 'FILL';
  row.layoutSizingVertical = 'HUG';

  // Add cells — match type to column content
  // Name (text+leading icon):
  const nameCell = (isEven ? textIconEven : textIconOdd).createInstance();
  row.appendChild(nameCell);
  nameCell.layoutSizingHorizontal = 'FILL';
  const nameText = nameCell.findOne(n => n.type === 'TEXT' && n.name === 'Row');
  if (nameText) { await figma.loadFontAsync(nameText.fontName); nameText.characters = data[i].name; }

  // Plain text cells:
  const cell = (isEven ? textEven : textOdd).createInstance();
  row.appendChild(cell);
  cell.layoutSizingHorizontal = 'FILL';
  const t = cell.findOne(n => n.type === 'TEXT' && n.name === 'Row');
  if (t) { await figma.loadFontAsync(t.fontName); t.characters = 'value'; }

  // Ellipsis (always last):
  const action = (isEven ? ellipsisEven : ellipsisOdd).createInstance();
  row.appendChild(action);
}

// CRITICAL: Header cell widths MUST match data cell widths
// Fixed-width columns: set BOTH header and data cells to same fixed width
// Fill columns: use layoutSizingHorizontal = 'FILL' on both

// PAGINATION
const paginationSet = await figma.getNodeByIdAsync('92:40394');
const goToPage = paginationSet.children.find(v => v.name.includes('Type=go to page'));
const pagination = goToPage.createInstance();
content.appendChild(pagination);
pagination.layoutSizingHorizontal = 'FILL';

// PAGINATION TEXT OVERRIDES — numbers must match visible rows
// Structure: Tag "N/total" | Tag "N items per page ▼" | ‹ | page 1 | page 2 | ... | › | "Go to page"
const allPagTexts = pagination.findAll(n => n.type === 'TEXT');
for (const t of allPagTexts) {
  await figma.loadFontAsync(t.fontName);
  if (t.characters.includes('/')) t.characters = `${data.length}/${totalItems}`;         // e.g. "10/345"
  if (t.characters.includes('items per page')) t.characters = `${data.length} items per page`; // match row count
}
// Replace last page number with "..." to indicate more pages
const pageNums = allPagTexts.filter(t => /^\d+$/.test(t.characters) && t.parent?.name === 'page number');
if (pageNums.length >= 3) {
  const lastPage = pageNums[pageNums.length - 1];
  await figma.loadFontAsync(lastPage.fontName);
  lastPage.characters = '...';
}
```

## Status Tag Cells

Replace plain text cells with Tag instances for status columns.

```javascript
const tagSet = await figma.getNodeByIdAsync('91:10023');
const tagVariant = tagSet.children.find(v =>
  v.name.includes('Size=Small') && v.name.includes('Type=Icon - solid') && v.name.includes('Status=Default')
);

const tagWrapper = figma.createFrame();
tagWrapper.name = 'Status Cell';
tagWrapper.layoutMode = 'HORIZONTAL';
tagWrapper.counterAxisAlignItems = 'CENTER';
tagWrapper.paddingLeft = 16;
tagWrapper.resize(150, 75); // Match column width and row height
tagWrapper.fills = [];

const tag = tagVariant.createInstance();
tagWrapper.appendChild(tag);

const tagText = tag.findOne(n => n.type === 'TEXT' && n.name === 'I am a tag');
if (tagText) { await figma.loadFontAsync(tagText.fontName); tagText.characters = 'Online'; }

// Hide icons for clean display
const props = tag.componentProperties;
const trailingKey = Object.keys(props).find(k => k.includes('Trailing') || k.includes('trailing'));
if (trailingKey) tag.setProperties({ [trailingKey]: false });
const leadingKey = Object.keys(props).find(k => k.includes('Leading') || k.includes('leading'));
if (leadingKey) tag.setProperties({ [leadingKey]: false });

row.insertChild(STATUS_COLUMN_INDEX, tagWrapper);
```

## Status Circle with Text (Leading Icon Pattern)

For columns showing a colored dot + status text (e.g. "In Dev", "Running"), use `Type=Text+leading icon` cells with `circle` as the icon name and override the icon color.

```javascript
const cell = (isEven ? textIconEven : textIconOdd).createInstance();
row.appendChild(cell);
cell.layoutSizingHorizontal = 'FIXED';
cell.resize(120, cell.height);

// Set status text
const statusText = cell.findOne(n => n.type === 'TEXT' && n.name === 'Row');
if (statusText) { await figma.loadFontAsync(statusText.fontName); statusText.characters = 'In Dev'; }

// Set icon to circle and color it
const icon = cell.findOne(n => n.name === 'v7-icon');
if (icon) {
  const iconText = icon.findOne(n => n.type === 'TEXT' && n.name === 'icon');
  if (iconText) {
    await figma.loadFontAsync(iconText.fontName);
    iconText.characters = 'circle';
    // Use variable binding for standard colours; hardcode only for per-cell dynamic colours
    await bindFill(iconText, V.mono400); // gray dot — swap to green400/red500 etc. per status
  }
}
```

## Leading Icon Override

To change the icon on any `Text+leading icon` cell, find the `v7-icon` instance's text child and set the Font Awesome icon name.

```javascript
const icon = cell.findOne(n => n.name === 'v7-icon');
const iconText = icon.findOne(n => n.type === 'TEXT' && n.name === 'icon');
await figma.loadFontAsync(iconText.fontName);
iconText.characters = 'arrows-spin'; // FA icon name: bolt, clock, users, etc.
```

## Xmark Icon Cells (No-Data Indicators)

Columns that show a red "x" for zero/null values MUST use `Type=Icon` cell variant with the `xmark` FontAwesome icon — never plain red text in a Text cell.

```javascript
const rowSet = await figma.getNodeByIdAsync('91:39179');
const iconEven = rowSet.children.find(v => v.name === 'Type=Icon, Position=EVEN');
const iconOdd = rowSet.children.find(v => v.name === 'Type=Icon, Position=ODD');

// Use variable for red — bindFill(iconText, V.red500) after creating the cell

// Inside row loop — replace text cell with icon cell for "x" values:
const isEven = i % 2 === 0;
const iconCell = (isEven ? iconEven : iconOdd).createInstance();
row.appendChild(iconCell);
iconCell.layoutSizingHorizontal = 'FILL';

const iconInstance = iconCell.findOne(n => n.name === 'v7-icon');
if (iconInstance) {
  const iconText = iconInstance.findOne(n => n.type === 'TEXT' && n.name === 'icon');
  if (iconText) {
    await figma.loadFontAsync(iconText.fontName);
    iconText.characters = 'xmark';
    await bindFill(iconText, V.red500);
  }
}
```

## Solo Cell Variants (Single Image / Flag / Action Icon)

Use the `solo` variants when a column shows **one** image, flag, or action icon per row — NOT the multi variants which show 5+ items with overflow.

```javascript
const rowSet = await figma.getNodeByIdAsync('91:39179');

// --- SINGLE FLAG ---
const flagSoloE = rowSet.children.find(v => v.name === 'Type=flags solo, Position=EVEN');
const flagSoloO = rowSet.children.find(v => v.name === 'Type=flags solo, Position=ODD');

const flagCell = (isEven ? flagSoloE : flagSoloO).createInstance();
row.appendChild(flagCell);
flagCell.layoutSizingHorizontal = 'FIXED';
flagCell.resize(100, flagCell.height);

// Show only the desired flag — hide all, then show one and set its Country
const flags = flagCell.findAll(n => n.name === 'Flag' && n.type === 'INSTANCE');
flags.forEach(f => f.visible = false);
flags[0].visible = true;
flags[0].setProperties({ 'Country': 'united kingdom' }); // lowercase country name

// --- SINGLE ACTION ICON ---
const actionSoloE = rowSet.children.find(v => v.name === 'Type=action icons solo, Position=EVEN');
const actionSoloO = rowSet.children.find(v => v.name === 'Type=action icons solo, Position=ODD');

const actionCell = (isEven ? actionSoloE : actionSoloO).createInstance();
row.appendChild(actionCell);
actionCell.layoutSizingHorizontal = 'FIXED';
actionCell.resize(100, actionCell.height);

// Show only the desired button — hide all, show one, set color + icon
const btns = actionCell.findAll(n => n.name === 'button-btn' && n.type === 'INSTANCE');
btns.forEach(b => b.visible = false);
btns[0].visible = true;
// Override fill color on the button
await bindFill(btns[0], V.green400); // or any color variable
// Override icon name
const iconInst = btns[0].findOne(n => n.name === 'v7-icon');
const iconText = iconInst?.findOne(n => n.type === 'TEXT' && n.name === 'icon');
if (iconText) { await figma.loadFontAsync(iconText.fontName); iconText.characters = 'gift'; }

// --- SINGLE IMAGE ---
const imageSoloE = rowSet.children.find(v => v.name === 'Type=image solo, Position=EVEN');
const imageSoloO = rowSet.children.find(v => v.name === 'Type=image solo, Position=ODD');

const imgCell = (isEven ? imageSoloE : imageSoloO).createInstance();
row.appendChild(imgCell);
imgCell.layoutSizingHorizontal = 'FIXED';
imgCell.resize(100, imgCell.height);
// Single image — no visibility toggling needed, just one image instance
```

**Pre-loaded action icon options (hidden layers):**

| Index | Color | Icon | Use for |
|---|---|---|---|
| 0 | Pink (#E961) | `message` | SMS/chat actions |
| 1 | Orange (#E869) | `gift` | Bonus/promo |
| 2 | Teal (#8ACC) | `mobile` | Mobile/push |
| 3 | Blue (#0F5D) | `envelope` | Email |
| 4 | Yellow (#FFDB) | `bell` | Notifications |

**Pre-loaded flag options:** East Timor, Anguilla, India, Myanmar, Hungary (override `Country` property for any other).

## Form Fields (Settings/Detail Pages)

```javascript
const inputSet = await figma.getNodeByIdAsync('91:6537');
const emptyInput = inputSet.children.find(v =>
  v.name.includes('Type=Text input') && v.name.includes('State=default-empty')
);
const filledInput = inputSet.children.find(v =>
  v.name.includes('Type=Text input') && v.name.includes('State=default-filled')
);
const dropdown = inputSet.children.find(v =>
  v.name.includes('Type=Dropdown - Regular') && v.name.includes('State=default-empty')
);

// 2-column form row
const row = figma.createFrame();
row.name = 'Form Row';
row.layoutMode = 'HORIZONTAL';
row.itemSpacing = 24;
row.fills = [];
content.appendChild(row);
row.layoutSizingHorizontal = 'FILL';
row.layoutSizingVertical = 'HUG';

const input1 = filledInput.createInstance();
row.appendChild(input1);
input1.layoutSizingHorizontal = 'FILL';

// Override label + value
const label = input1.findOne(n => n.type === 'TEXT' && n.name.includes('Label'));
if (label) { await figma.loadFontAsync(label.fontName); label.characters = 'Field Name'; }
const value = input1.findOne(n => n.type === 'TEXT' && n.name === 'Placeholder');
if (value) { await figma.loadFontAsync(value.fontName); value.characters = 'Field value'; }
```

## Multi-Panel Settings Pages

Settings pages use multiple Standard Panel instances stacked vertically. Each panel is FIXED 1700px wide (not FILL).

```javascript
// Content frame holds multiple panels
contentFrame.layoutMode = 'VERTICAL';
contentFrame.itemSpacing = 32;

// Each panel: FIXED 1700px, HUG vertically
// Clone panels from base template (create temp instance, detach, extract panel, remove temp)
const tempInst = baseTemplate.createInstance();
const tempScreen = tempInst.detachInstance();
const tempCF = tempScreen.children.find(c => c.name === 'Frame 1317');
const tempPanel = tempCF.children.find(c => c.name === 'Standard Panel');
let panel = tempPanel.type === 'INSTANCE' ? tempPanel.detachInstance() : tempPanel;
contentFrame.appendChild(panel);
panel.layoutSizingHorizontal = 'FIXED';
panel.resize(1700, panel.height);
tempScreen.remove();

// Detach + set panel header, then HUG
panel.layoutSizingVertical = 'HUG';
```

## Dropdown with Info Icon (Settings Pages)

Dropdowns on settings pages are half-width with the info icon enabled.

```javascript
const inputSet = await figma.getNodeByIdAsync('91:6537');
const dropdownFilled = inputSet.children.find(v =>
  v.name.includes('Type=Dropdown - Regular') && v.name.includes('State=default-filled')
);

const dd = dropdownFilled.createInstance();
content.appendChild(dd);
dd.layoutSizingHorizontal = 'FIXED';
dd.resize(content.width / 2, dd.height); // Half-width

// Enable info icon, disable unnecessary features
dd.setProperties({
  'Info icon#4283:93': true,
  'Tags#4281:31': false,
  'AI+Emoji#4369:0': false,
});

// Override label + value
const label = dd.findOne(n => n.type === 'TEXT' && n.characters.includes('Label'));
if (label) { await figma.loadFontAsync(label.fontName); label.characters = 'Field label'; }
const val = dd.findOne(n => n.type === 'TEXT' && n.name === 'Placeholder');
if (val) { await figma.loadFontAsync(val.fontName); val.characters = 'Selected value'; }
```

## Radio Buttons (Settings Pages)

Use `setProperties` to override text — direct text editing fails on instances.

```javascript
const radioSet = await figma.getNodeByIdAsync('91:8595');
const radioChecked = radioSet.children.find(v => v.name === 'Type=Checked, Status=Default');
const radioUnchecked = radioSet.children.find(v => v.name === 'Type=Unchecked, Status=Default');

const radioRow = figma.createFrame();
radioRow.name = 'Radio Row';
radioRow.layoutMode = 'HORIZONTAL';
radioRow.itemSpacing = 24;
radioRow.fills = [];
content.appendChild(radioRow);
radioRow.layoutSizingHorizontal = 'HUG';
radioRow.layoutSizingVertical = 'HUG';

const r1 = radioChecked.createInstance();
radioRow.appendChild(r1);
r1.setProperties({ 'Text#9:9': 'Option A' });

const r2 = radioUnchecked.createInstance();
radioRow.appendChild(r2);
r2.setProperties({ 'Text#9:9': 'Option B' });
```

## Toggle Switches (Settings Pages)

Use `setProperties` for text — same pattern as radio buttons.

```javascript
const toggleSet = await figma.getNodeByIdAsync('91:8647');
const toggleChecked = toggleSet.children.find(v =>
  v.name === 'Type=Checked, Status=Default, Alignment=Default'
);

const toggle = toggleChecked.createInstance();
content.appendChild(toggle);
toggle.setProperties({ 'Text#9:17': 'Toggle label text here' });
// Toggles are always HUG, never FILL
```

## Panel Header — Enable Search

The Panel Header has a hidden `Search + Action Icons` frame. Replace the search button with a full Search input at **350px width**.

```javascript
const panelHeader = await figma.getNodeByIdAsync(PANEL_HEADER_ID);
const searchFrame = panelHeader.findOne(n => n.name === 'Search + Action Icons');
searchFrame.visible = true;

// Hide toggle and action icons — keep only search input
const toggle = searchFrame.findOne(n => n.name === 'Toggle');
if (toggle) toggle.visible = false;
const actionIcons = searchFrame.findOne(n => n.name === 'Action icons');
if (actionIcons) actionIcons.visible = false;

// Replace search button with full search input (ALWAYS 350px)
const inputSet = await figma.getNodeByIdAsync('91:6537');
const searchVariant = inputSet.children.find(v =>
  v.name.includes('Type=Search') && v.name.includes('State=default-empty')
);
const oldSearch = searchFrame.findOne(n => n.name === 'Input Fields');
const newSearch = searchVariant.createInstance();
searchFrame.insertChild(searchFrame.children.indexOf(oldSearch), newSearch);
oldSearch.remove();
newSearch.layoutSizingHorizontal = 'FIXED';
newSearch.resize(350, newSearch.height);
newSearch.setProperties({ 'Label#4339:0': false, 'AI+Emoji#4369:0': false });
```

## Icon Toolbar Strip (LIST-FULL pages)

Row of icon-only buttons between tabs and panel. **No background fill.** All icons use `Status=default`.

```javascript
const btnSet = await figma.getNodeByIdAsync('91:8299');
const iconBtnDefault = btnSet.children.find(v =>
  v.name === 'Type=icon, Status=default, Size=M, Leading icon=No'
);

const toolbar = figma.createFrame();
toolbar.name = 'Icon Toolbar';
toolbar.layoutMode = 'HORIZONTAL';
toolbar.itemSpacing = 8;
toolbar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // white bg — bind after: await bindFill(toolbar, V.white);
toolbar.paddingTop = 8;
toolbar.paddingBottom = 8;
contentFrame.insertChild(1, toolbar); // after tabs
toolbar.layoutSizingHorizontal = 'FIXED';
toolbar.resize(panel.width, 48);

const icons = ['clock', 'tag', 'users', 'sliders', 'filter'];
for (const iconName of icons) {
  const btn = iconBtnDefault.createInstance();
  toolbar.appendChild(btn);
  const iconNode = btn.findOne(n => n.name === 'v7-icon');
  if (iconNode) {
    const iconText = iconNode.findOne(n => n.type === 'TEXT' && n.name === 'icon');
    if (iconText) {
      await figma.loadFontAsync(iconText.fontName);
      iconText.characters = iconName;
    }
  }
}
```

## Content Frame Rules

The main content frame (`Frame 1317`) must be renamed to **"Main"** and **top-aligned**:

```javascript
const mainFrame = screen.children.find(c => c.name === 'Frame 1317');
mainFrame.name = 'Main';
mainFrame.primaryAxisAlignItems = 'MIN';     // top
mainFrame.counterAxisAlignItems = 'CENTER';  // horizontal center
```

## Tag Cell with Zebra Striping

Tag components don't inherit row backgrounds. Wrap in a frame with manually matched fill.

**GOTCHA:** Row variant naming is counter-intuitive:
- `Position=EVEN` → **no fill** (white/transparent)
- `Position=ODD` → **gray fill** (`#FAFAFA` / `{ r: 0.9804, g: 0.9804, b: 0.9804 }`)

```javascript
// Zebra gray = mono-100. Use bindFill for variable binding where possible.
// For tag wrappers that need inline fill matching, hardcoded is acceptable:
const ZEBRA_GRAY = { type: 'SOLID', color: { r: 0.9804, g: 0.9804, b: 0.9804 } };

const tagWrapper = figma.createFrame();
tagWrapper.name = 'Status Cell';
tagWrapper.layoutMode = 'HORIZONTAL';
tagWrapper.counterAxisAlignItems = 'CENTER';
tagWrapper.paddingLeft = 16;
// EVEN rows (i%2===0) have no fill, ODD rows have gray
tagWrapper.fills = (i % 2 === 0) ? [] : [ZEBRA_GRAY];
row.appendChild(tagWrapper);
tagWrapper.layoutSizingHorizontal = 'FIXED';
tagWrapper.resize(COLUMN_WIDTH, 75);
tagWrapper.layoutSizingVertical = 'FIXED';

const tag = tagVariant.createInstance();
tagWrapper.appendChild(tag);

const tagText = tag.findOne(n => n.type === 'TEXT' && n.name === 'I am a tag');
if (tagText) { await figma.loadFontAsync(tagText.fontName); tagText.characters = 'Active'; }

// Hide trailing/leading icons for clean display
const props = tag.componentProperties;
for (const key of Object.keys(props)) {
  if (key.toLowerCase().includes('trailing') || key.toLowerCase().includes('leading')) {
    try { tag.setProperties({ [key]: false }); } catch(e) {}
  }
}
```

## Hub Card Grid (Navigation Pages)

Hub pages have multiple white panels, each containing a row of action cards. No tables, no forms — purely navigational.

**Key rules:**
- Content area spacing: **32px** (same as all multi-panel layouts)
- Panels: white fill, no stroke, cornerRadius 0, 1700px FIXED
- Content placeholder: **FILL** width, no padding, no fill
- Card Row: separate HORIZONTAL frame with 16px gap + 16px padding all
- Cards: FILL width, HUG height, mono-100 fill, 8px corner radius
- Text: **HUG / WIDTH_AND_HEIGHT** — NOT FILL / HEIGHT
- Card's `counterAxisAlignItems: CENTER` centres the HUG text horizontally
- Description colour: **mono-500** (#959595)
- Icon: 32px FA 6 Pro Solid inside a wrapper FRAME

```javascript
// Main content area — 32px gap (universal rule for all multi-panel layouts)
contentFrame.itemSpacing = 32;

// --- Helper: create hub panel ---
async function createHubPanel(title, subtitle) {
  const tempInst = baseTemplate.createInstance();
  const tempScreen = tempInst.detachInstance();
  const tempCF = tempScreen.children.find(c => c.name === 'Frame 1317');
  const tempPanel = tempCF.children.find(c => c.name === 'Standard Panel');
  let panel = tempPanel.type === 'INSTANCE' ? tempPanel.detachInstance() : tempPanel;
  contentFrame.appendChild(panel);
  panel.layoutSizingHorizontal = 'FIXED';
  panel.resize(1700, panel.height);
  tempScreen.remove();

  // Hub style: white, no stroke, no corners
  await bindFill(panel, V.white);
  panel.strokes = [];
  panel.cornerRadius = 0;

  // Panel Header
  let ph = panel.children.find(c => c.name === 'Panel Header');
  if (ph?.type === 'INSTANCE') ph = ph.detachInstance();
  const titleNode = ph.findOne(n => n.type === 'TEXT' && n.name === 'Title');
  if (titleNode) { await figma.loadFontAsync(titleNode.fontName); titleNode.characters = title; }
  const subNode = ph.findOne(n => n.type === 'TEXT' && n.name === 'Sub-Title');
  if (subNode) { await figma.loadFontAsync(subNode.fontName); subNode.characters = subtitle; }

  // Content placeholder — FILL, no padding, no fill
  const content = panel.children.find(c => c.name === 'content placeholder');
  content.layoutSizingHorizontal = 'FILL';
  content.layoutMode = 'VERTICAL';
  content.itemSpacing = 0;
  content.paddingTop = 0; content.paddingBottom = 0;
  content.paddingLeft = 0; content.paddingRight = 0;
  content.fills = [];
  while (content.children.length > 0) content.children[0].remove();

  // Card Row — wraps the cards
  const cardRow = figma.createFrame();
  cardRow.name = 'Card Row';
  cardRow.layoutMode = 'HORIZONTAL';
  cardRow.itemSpacing = 16;
  cardRow.paddingTop = 16; cardRow.paddingBottom = 16;
  cardRow.paddingLeft = 16; cardRow.paddingRight = 16;
  cardRow.fills = [];
  content.appendChild(cardRow);
  cardRow.layoutSizingHorizontal = 'FILL';
  cardRow.layoutSizingVertical = 'HUG';

  panel.layoutSizingVertical = 'HUG';
  return cardRow;
}

// --- Helper: create hub card ---
// padTop/padBot: use 24/24 for 3-column, 40/32 for 2-column and 1-column
async function createHubCard(cardRow, iconName, title, desc, padTop = 24, padBot = 24) {
  const card = figma.createFrame();
  card.name = title;
  card.layoutMode = 'VERTICAL';
  card.primaryAxisAlignItems = 'CENTER';
  card.counterAxisAlignItems = 'CENTER';
  card.itemSpacing = 8;
  card.paddingTop = padTop;
  card.paddingBottom = padBot;
  card.paddingLeft = 24;
  card.paddingRight = 24;
  card.cornerRadius = 8;
  cardRow.appendChild(card);
  card.layoutSizingHorizontal = 'FILL';
  card.layoutSizingVertical = 'HUG';
  await bindFill(card, V.mono100);

  // Icon — wrapper frame with FA text
  const iconWrap = figma.createFrame();
  iconWrap.name = 'Icon';
  iconWrap.layoutMode = 'HORIZONTAL';
  iconWrap.primaryAxisAlignItems = 'CENTER';
  iconWrap.counterAxisAlignItems = 'CENTER';
  iconWrap.fills = [];
  card.appendChild(iconWrap);
  iconWrap.layoutSizingHorizontal = 'HUG';
  iconWrap.layoutSizingVertical = 'HUG';

  await figma.loadFontAsync({family:'Font Awesome 6 Pro', style:'Solid'});
  const iconText = figma.createText();
  iconText.fontName = {family:'Font Awesome 6 Pro', style:'Solid'};
  iconText.fontSize = 32;
  iconText.characters = iconName;
  iconText.lineHeight = { value: 48, unit: 'PIXELS' };
  iconWrap.appendChild(iconText);
  await bindFill(iconText, V.mono500);

  // Title — HUG, natural size, centred by card
  await figma.loadFontAsync({family:'Inter', style:'Bold'});
  const t = figma.createText();
  t.fontName = {family:'Inter', style:'Bold'};
  t.fontSize = 16;
  t.characters = title;
  t.textAlignHorizontal = 'CENTER';
  card.appendChild(t);
  await bindFill(t, V.mono700);

  // Description — HUG, natural size, centred by card
  await figma.loadFontAsync({family:'Inter', style:'Regular'});
  const d = figma.createText();
  d.fontName = {family:'Inter', style:'Regular'};
  d.fontSize = 14;
  d.characters = desc;
  d.textAlignHorizontal = 'CENTER';
  card.appendChild(d);
  await bindFill(d, V.mono500); // mono-500, NOT mono-600

  return card;
}

// --- Build: Integration Settings ---
const row1 = await createHubPanel('Tools & Guides', 'All you need to help you with the integration of FT CRM');
await createHubCard(row1, 'plug', 'Integration Hub', 'Validate and test your integration');
await createHubCard(row1, 'terminal', 'Live Debug Console', 'Verify all service calls in real time');
await createHubCard(row1, 'book', 'The Integration Manual', 'Learn how to integrate FT CRM');

const row2 = await createHubPanel('Migrations Wizard', '...');
await createHubCard(row2, 'server', 'Data Migration', 'Full migration of historical data via CSV files', 40, 32);
await createHubCard(row2, 'poll-people', 'User Migration', 'Migration of user details, blocks and consents via the Operator API', 40, 32);

const row3 = await createHubPanel('Greco', '...');
await createHubCard(row3, 'chart-bar', 'Batch Data Analysis', '...', 40, 32);
```
