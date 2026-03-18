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
