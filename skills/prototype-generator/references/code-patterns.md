# Code Patterns

> Executable code snippets for the prototype-generator skill. Each pattern is proven and tested.
> Last updated: 2026-03-18

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
// CTA text is SENTENCE CASE: "Add Player", "Save Changes", "Create Campaign" — NOT uppercase
const header = screen.children.find(c => c.name === 'Page Header' || c.name === 'Header');
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
tabBar.itemSpacing = 16;
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
    iconText.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }]; // gray
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

const RED = { type: 'SOLID', color: { r: 0.87, g: 0.25, b: 0.25 } };

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
    iconText.fills = [RED];
  }
}
```

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

## Panel Header — Enable Search (LIST-SIMPLE)

The Panel Header has a hidden `Search + Action Icons` frame. To show just the search icon:

```javascript
// Panel Header structure: top → "Search + Action Icons" (hidden by default)
// Inside: Input Fields (search), Toggle, Action icons
const panelHeader = await figma.getNodeByIdAsync(PANEL_HEADER_ID);

const searchFrame = panelHeader.findOne(n => n.name === 'Search + Action Icons');
searchFrame.visible = true;

// Hide toggle and action icons — keep only search input
const toggle = searchFrame.findOne(n => n.name === 'Toggle');
if (toggle) toggle.visible = false;
const actionIcons = searchFrame.findOne(n => n.name === 'Action icons');
if (actionIcons) actionIcons.visible = false;
```

## Tag Cell with Zebra Striping

Tag components don't inherit row backgrounds. Wrap in a frame with manually matched fill.

**GOTCHA:** Row variant naming is counter-intuitive:
- `Position=EVEN` → **no fill** (white/transparent)
- `Position=ODD` → **gray fill** (`#FAFAFA` / `{ r: 0.9804, g: 0.9804, b: 0.9804 }`)

```javascript
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
