# Code Patterns

> Build engine for the prototype-generator skill. Helper library + pattern recipes.
> Last updated: 2026-03-24

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
| `LIST-SIMPLE` | §Shared Shell, §Pattern 2a, §Shared Table Rules | §Helper Library, §LIST-SIMPLE recipe | `92:55380` (adapt) |
| `LIST-TAB` | §Shared Shell, §Pattern 2b, §Shared Table Rules | §Helper Library, §LIST-TAB recipe | `92:55380` or `181:72894` |
| `LIST-FULL` | §Shared Shell, §Pattern 2c, §Shared Table Rules | §Helper Library, §LIST-FULL recipe | `92:55380` |
| `FORM` | §Shared Shell, §Pattern 1 | §Helper Library, §FORM recipe | — |
| `SLIDEIN` | §Pattern 4 (relevant sub-pattern) | §Helper Library, §SLIDEIN recipe | `92:56151` or `92:54631` |
| `HUB` | §Pattern 7 | §Helper Library, §HUB recipe | — |
| `DASH` | §Shared Shell, §Pattern 5 | §Helper Library, §DASH recipe | — |
| `DETAIL` | §Shared Shell, §Pattern 3 | §Helper Library, §FORM recipe | — |
| `GRID` | §Shared Shell, §Pattern 6 | §Helper Library | — |

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

Before writing code, verify against the Rules Reference (§R1-R15) at the bottom of this file.

### Gate 4: Build

- Prepend the Helper Library to every `figma_execute` call
- Call `await init()` first, then use helpers
- Screenshot after each phase

### Gate 5: Post-Build Verification

```
□ Header: breadcrumb level, CTA text, visible icons match?
□ Panel count and layout match reference?
□ All text content matches reference exactly?
□ Content alignment correct (top-centre)?
□ No hardcoded RGB — all variable-bound?
□ Header columns align 1:1 with data row columns?
□ Overall proportions match reference at 1x scale?
```

If any check fails → fix before presenting to user.

---

## Helper Library (INJECTABLE PREAMBLE)

> Copy this entire block as the prefix of every `figma_execute` call.
> Call `await init()` once at the top of your build code.

```javascript
// ═══════════════════════════════════════════════════
// FT DNA Build Helpers v1.0
// Prepend to every figma_execute call
// ═══════════════════════════════════════════════════

// --- Layer 1: Variables & Binding ---
const V = {
  white:'VariableID:28:5', mono100:'VariableID:28:6', mono200:'VariableID:28:7',
  mono300:'VariableID:28:8', mono400:'VariableID:28:9', mono500:'VariableID:28:10',
  mono600:'VariableID:28:11', mono700:'VariableID:28:12', black:'VariableID:28:13',
  pink500:'VariableID:28:17', green400:'VariableID:28:46', red500:'VariableID:28:37',
  yellow400:'VariableID:28:31', blue600:'VariableID:28:28',
};
async function bindFill(node, vid) {
  const v = await figma.variables.getVariableByIdAsync(vid);
  const bf = node.fills?.length > 0 ? {...node.fills[0]} : {type:'SOLID',color:{r:1,g:1,b:1}};
  node.fills = [figma.variables.setBoundVariableForPaint(bf, 'color', v)];
}
async function bindStroke(node, vid) {
  const v = await figma.variables.getVariableByIdAsync(vid);
  const bs = node.strokes?.length > 0 ? {...node.strokes[0]} : {type:'SOLID',color:{r:0,g:0,b:0}};
  node.strokes = [figma.variables.setBoundVariableForPaint(bs, 'color', v)];
}

// --- Layer 2: Initialization (call once per execution) ---
let _base, _hdr, _row, ROW = {}, _tag, _tab, _input, _btn, _pag;
async function init() {
  // Fonts — load all upfront, never again per-cell
  await Promise.all([
    figma.loadFontAsync({family:'Inter',style:'Regular'}),
    figma.loadFontAsync({family:'Inter',style:'Bold'}),
    figma.loadFontAsync({family:'Inter',style:'Medium'}),
    figma.loadFontAsync({family:'Font Awesome 6 Pro',style:'Solid'}).catch(()=>{}),
  ]);
  // Components — parallel fetch
  const ids = {
    base:'94:21370', hdr:'91:39176', row:'91:39179', tag:'91:10023',
    tab:'91:19098', input:'91:6537', btn:'91:8299', pag:'92:40394',
  };
  const [base,hdr,row,tag,tab,input,btn,pag] = await Promise.all(
    Object.values(ids).map(id => figma.getNodeByIdAsync(id))
  );
  _base=base; _hdr=hdr; _row=row; _tag=tag; _tab=tab; _input=input; _btn=btn; _pag=pag;
  // Pre-resolve row variants into lookup map
  const typeMap = {
    'Text':'text','Text+leading icon':'texticon','Text+trailing icon':'texttrailing',
    'Icon':'icon','ellipsis':'ellipsis','checkbox':'checkbox','status circle':'status',
    'tag':'tag','image':'image','image solo':'image-solo','action icons':'action',
    'action icons solo':'action-solo','number/version':'number','flags':'flags','flags solo':'flags-solo',
  };
  for (const v of _row.children) {
    const m = v.name.match(/Type=(.+), Position=(EVEN|ODD)/);
    if (m) ROW[typeMap[m[1]] + '-' + m[2].toLowerCase()] = v;
  }
}

// --- Layer 3: Build Helpers ---
function detach(node) { return node?.type === 'INSTANCE' ? node.detachInstance() : node; }

function setText(parent, name, text, style) {
  const node = parent.findOne(n => n.type === 'TEXT' && n.name === name);
  if (!node) return null;
  node.fontName = {family:'Inter', style: style || 'Regular'};
  node.characters = String(text);
  return node;
}

function setIcon(parent, iconName) {
  const icon = parent.findOne(n => n.name === 'v7-icon');
  if (!icon) return;
  const t = icon.findOne(n => n.type === 'TEXT' && n.name === 'icon');
  if (t) { t.fontName = {family:'Font Awesome 6 Pro', style:'Solid'}; t.characters = iconName; }
  return t;
}

function createRow(name, parent) {
  const row = figma.createFrame();
  row.name = name; row.layoutMode = 'HORIZONTAL'; row.itemSpacing = 0; row.fills = [];
  parent.appendChild(row);
  row.layoutSizingHorizontal = 'FILL'; row.layoutSizingVertical = 'HUG';
  return row;
}

function cell(type, isEven) {
  const key = type + '-' + (isEven ? 'even' : 'odd');
  return ROW[key];
}

async function bootstrapScreen(name, x, y) {
  const pb = figma.root.children.find(p => p.name.includes('Pastebin'));
  await figma.setCurrentPageAsync(pb);
  const inst = _base.createInstance();
  pb.appendChild(inst); inst.x = x || 0; inst.y = y || 0;
  const screen = inst.detachInstance();
  screen.name = name;
  const main = screen.children.find(c => c.name === 'Frame 1317');
  main.name = 'Main'; main.primaryAxisAlignItems = 'MIN'; main.counterAxisAlignItems = 'CENTER';
  const panel = detach(main.children.find(c => c.name === 'Standard Panel'));
  panel.layoutSizingHorizontal = 'FIXED'; panel.resize(1700, panel.height);
  const panelHeader = detach(panel.children.find(c => c.name === 'Panel Header'));
  const content = panel.children.find(c => c.name === 'content placeholder');
  content.layoutMode = 'VERTICAL'; content.itemSpacing = 0;
  while (content.children.length > 0) content.children[0].remove();
  const header = detach(screen.children.find(c => c.name === 'Page Header' || c.name === 'Header'));
  return { screen, main, panel, panelHeader, content, header };
}

async function setShell(refs, cfg) {
  // Panel header
  if (cfg.title) setText(refs.panelHeader, 'Title', cfg.title, 'Bold');
  if (cfg.subtitle) setText(refs.panelHeader, 'Sub-Title', cfg.subtitle);
  if (cfg.subtitle === false) { const sn = refs.panelHeader.findOne(n => n.name === 'Sub-Title'); if (sn) sn.visible = false; }
  // Page header texts
  const texts = refs.header.findAll(n => n.type === 'TEXT');
  for (const t of texts) {
    try { await figma.loadFontAsync(t.fontName); } catch(e) { continue; }
    if (cfg.breadcrumb) {
      if (cfg.breadcrumb.length === 1) {
        if (t.characters === 'Level 1') t.characters = cfg.breadcrumb[0];
        if (t.characters === 'Level 2') t.characters = '';
      } else if (cfg.breadcrumb.length >= 2) {
        if (t.characters === 'Level 1') t.characters = cfg.breadcrumb[0];
        if (t.characters === 'Level 2') t.characters = cfg.breadcrumb[1];
      }
    }
    if (cfg.cta && t.characters === 'Button text') t.characters = cfg.cta;
    if (t.characters === 'Heading') t.characters = cfg.breadcrumb?.[cfg.breadcrumb.length - 1] || cfg.title || '';
  }
  // No CTA — hide right area buttons but keep frame visible for alignment
  if (cfg.cta === false) {
    const btns = refs.header.findAll(n => n.name === 'button-btn' && n.type === 'INSTANCE');
    btns.forEach(b => b.visible = false);
  }
  // Search in panel header
  if (cfg.search) {
    const sf = refs.panelHeader.findOne(n => n.name === 'Search + Action Icons');
    if (sf) {
      sf.visible = true;
      const tg = sf.findOne(n => n.name === 'Toggle'); if (tg) tg.visible = false;
      const ai = sf.findOne(n => n.name === 'Action icons'); if (ai) ai.visible = false;
      const sv = _input.children.find(v => v.name.includes('Type=Search') && v.name.includes('default-empty'));
      const old = sf.findOne(n => n.name === 'Input Fields');
      if (old && sv) {
        const ns = sv.createInstance();
        sf.insertChild(sf.children.indexOf(old), ns); old.remove();
        ns.layoutSizingHorizontal = 'FIXED'; ns.resize(350, ns.height);
        ns.setProperties({'Label#4339:0': false, 'AI+Emoji#4369:0': false});
      }
    }
  }
}

function buildHeaderRow(columns, parent) {
  const row = createRow('Table Header', parent);
  for (const col of columns) {
    const c = _hdr.createInstance(); row.appendChild(c);
    setText(c, 'Heading', col.name, 'Bold');
    const si = c.findOne(n => n.name === 'v7-icon'); if (si) si.visible = !!col.sortable;
    if (col.width) { c.layoutSizingHorizontal = 'FIXED'; c.resize(col.width, c.height); }
    else c.layoutSizingHorizontal = 'FILL';
  }
  return row;
}

function buildDataRow(columns, data, index, parent) {
  const isEven = index % 2 === 0;
  const row = createRow('Row ' + (data[0] || index), parent);
  for (let c = 0; c < columns.length; c++) {
    const col = columns[c];
    const type = col.type || 'text';
    const variant = cell(type, isEven);
    if (!variant) continue;
    const inst = variant.createInstance(); row.appendChild(inst);
    if (col.width) { inst.layoutSizingHorizontal = 'FIXED'; inst.resize(col.width, inst.height); }
    else inst.layoutSizingHorizontal = 'FILL';
    // Set text for text-based cells
    if (['text','texticon','texttrailing','number'].includes(type)) {
      setText(inst, 'Row', data[c] || '');
    }
  }
  return row;
}

async function buildTable(columns, data, parent) {
  const headerRow = buildHeaderRow(columns, parent);
  const dataRows = [];
  for (let i = 0; i < data.length; i++) {
    dataRows.push(buildDataRow(columns, data[i], i, parent));
  }
  return { headerRow, dataRows };
}

async function addPagination(parent, showing, total) {
  const gtp = _pag.children.find(v => v.name.includes('Type=go to page'));
  const pag = gtp.createInstance();
  parent.appendChild(pag); pag.layoutSizingHorizontal = 'FILL';
  const tags = pag.findAll(n => n.name === 'Tag' && n.type === 'INSTANCE');
  for (const tag of tags) {
    const tn = tag.findOne(n => n.type === 'TEXT' && n.name === 'I am a tag');
    if (tn && tn.characters.includes('/')) tag.setProperties({'Tag text#26:8': showing + '/' + total});
  }
  return pag;
}

async function addTabs(contentFrame, tabs, panel) {
  const tabSel = _tab.children.find(v => v.name.includes('tab-text') && v.name.includes('Selected'));
  const tabDef = _tab.children.find(v => v.name.includes('tab-text') && v.name.includes('Default'));
  const bar = figma.createFrame();
  bar.name = 'Tab Bar'; bar.layoutMode = 'HORIZONTAL'; bar.itemSpacing = 32; bar.fills = [];
  contentFrame.insertChild(0, bar);
  bar.layoutSizingHorizontal = 'FIXED'; bar.resize(panel.width, 32);
  contentFrame.itemSpacing = 16;
  for (const [name, selected] of tabs) {
    const tab = (selected ? tabSel : tabDef).createInstance(); bar.appendChild(tab);
    const tf = tab.findOne(n => n.name === 'tab title and alert circle');
    if (tf) { const tt = tf.findOne(n => n.type === 'TEXT');
      if (tt) { tt.fontName = {family:'Inter',style:'Bold'}; tt.characters = name; }
      const ac = tf.findOne(n => n.name === 'alert circle'); if (ac) ac.visible = false; }
    const badge = tab.findOne(n => n.name === 'Badge'); if (badge) badge.visible = false;
  }
  return bar;
}

async function addToolbar(contentFrame, icons, panel) {
  const iconBtn = _btn.children.find(v => v.name === 'Type=icon, Status=default, Size=M, Leading icon=No');
  const toolbar = figma.createFrame();
  toolbar.name = 'Icon Toolbar'; toolbar.layoutMode = 'HORIZONTAL'; toolbar.itemSpacing = 8;
  toolbar.paddingTop = 8; toolbar.paddingBottom = 8;
  await bindFill(toolbar, V.white);
  contentFrame.insertChild(1, toolbar);
  toolbar.layoutSizingHorizontal = 'FIXED'; toolbar.resize(panel.width, 48);
  for (const name of icons) {
    const btn = iconBtn.createInstance(); toolbar.appendChild(btn); setIcon(btn, name);
  }
  return toolbar;
}

async function clonePanel(contentFrame, title, subtitle) {
  const tempInst = _base.createInstance();
  const tempScreen = tempInst.detachInstance();
  const tempCF = tempScreen.children.find(c => c.name === 'Frame 1317');
  const tempPanel = detach(tempCF.children.find(c => c.name === 'Standard Panel'));
  contentFrame.appendChild(tempPanel);
  tempPanel.layoutSizingHorizontal = 'FIXED'; tempPanel.resize(1700, tempPanel.height);
  tempScreen.remove();
  const ph = detach(tempPanel.children.find(c => c.name === 'Panel Header'));
  if (title) setText(ph, 'Title', title, 'Bold');
  if (subtitle) setText(ph, 'Sub-Title', subtitle);
  const content = tempPanel.children.find(c => c.name === 'content placeholder');
  content.layoutMode = 'VERTICAL'; content.itemSpacing = 0;
  while (content.children.length > 0) content.children[0].remove();
  tempPanel.layoutSizingVertical = 'HUG';
  return { panel: tempPanel, panelHeader: ph, content };
}

// Reattach to existing screen by IDs (for multi-phase builds)
async function reattach(ids) {
  const [screen, main, panel, content] = await Promise.all([
    figma.getNodeByIdAsync(ids.screen), figma.getNodeByIdAsync(ids.main),
    figma.getNodeByIdAsync(ids.panel), figma.getNodeByIdAsync(ids.content),
  ]);
  return { screen, main, panel, content };
}
```

---

## Quick Reference

| Helper | Signature | Purpose |
|---|---|---|
| `init()` | `await init()` | Load fonts, cache components, build ROW map. **Call once per execution.** |
| `bootstrapScreen` | `(name, x, y)` → `{screen, main, panel, panelHeader, content, header}` | Instantiate base template, detach, return all refs |
| `setShell` | `(refs, {breadcrumb, cta, title, subtitle, search})` | Override header + panel texts. `cta:false` hides buttons. `search:true` enables panel search. |
| `buildTable` | `(columns, data, parent)` → `{headerRow, dataRows}` | Build complete table. `columns`: `[{name, type, width?}]`. `data`: `[['val','val',...], ...]` |
| `addPagination` | `(parent, showing, total)` | Append pagination row |
| `addTabs` | `(contentFrame, tabs, panel)` | Add tab bar. `tabs`: `[['Name', true/false], ...]` |
| `addToolbar` | `(contentFrame, icons, panel)` | Add icon toolbar. `icons`: `['clock','tag',...]` |
| `clonePanel` | `(contentFrame, title, subtitle)` → `{panel, panelHeader, content}` | Add extra panel (multi-panel pages) |
| `reattach` | `(ids)` → `{screen, main, panel, content}` | Reconnect to existing nodes in Phase 2 |
| `cell` | `(type, isEven)` → component variant | Get cached row variant. Types: `text`, `texticon`, `texttrailing`, `icon`, `ellipsis`, `checkbox`, `status`, `tag`, `image`, `image-solo`, `action`, `action-solo`, `number`, `flags`, `flags-solo` |
| `setText` | `(parent, nodeName, text, style?)` | Find text node + set. Style defaults to 'Regular'. |
| `setIcon` | `(parent, iconName)` | Set FA icon name on v7-icon child |
| `createRow` | `(name, parent)` → frame | Create horizontal auto-layout row |
| `bindFill` | `(node, V.xxx)` | Bind colour variable to fill |
| `detach` | `(node)` → frame | Safe detach (no-op if already frame) |

---

## Pattern Recipes

### LIST-SIMPLE

```javascript
await init();
const refs = await bootstrapScreen('Page Name — LIST-SIMPLE', 0, 0);
await setShell(refs, {
  breadcrumb: ['Section', 'Page Name'], // or single: ['Page Name']
  cta: 'Add Item',                      // or false for no CTA
  title: 'Panel Title',
  subtitle: 'Panel subtitle text',
  search: true,                          // or false
});

const columns = [
  { name: 'Id', type: 'text', width: 60 },
  { name: 'Name', type: 'text' },         // omit width → FILL
  { name: 'Description', type: 'text' },
  { name: 'Type', type: 'text', width: 220 },
];

const data = [
  ['1', 'Item Name', 'Item description text', 'Category'],
  ['2', 'Another Item', 'Another description', 'Category'],
  // ... 8-10 rows
];

await buildTable(columns, data, refs.content);
await addPagination(refs.content, data.length, 100);
refs.panel.layoutSizingVertical = 'HUG';
figma.viewport.scrollAndZoomIntoView([refs.screen]);
return { screenId: refs.screen.id };
```

### LIST-TAB

```javascript
await init();
const refs = await bootstrapScreen('Page Name — LIST-TAB', 0, 0);
await setShell(refs, {
  breadcrumb: ['Page Name'], cta: 'Add Item',
  title: false, subtitle: false, search: true, // title hidden, search enabled
});

await addTabs(refs.main, [
  ['Tab One', false], ['Tab Two', true], ['Tab Three', false]
], refs.panel);

// Table same as LIST-SIMPLE
await buildTable(columns, data, refs.content);
await addPagination(refs.content, data.length, 100);
refs.panel.layoutSizingVertical = 'HUG';
```

### LIST-FULL (tabs + toolbar + table)

```javascript
await init();
const refs = await bootstrapScreen('Page Name — LIST-FULL', 0, 0);
await setShell(refs, { breadcrumb: ['Section', 'Page'], cta: 'Create Item', search: true });

await addTabs(refs.main, [['All', true], ['Active', false], ['Archived', false]], refs.panel);
await addToolbar(refs.main, ['clock', 'tag', 'users', 'sliders', 'filter'], refs.panel);

await buildTable(columns, data, refs.content);
await addPagination(refs.content, data.length, 345);
refs.panel.layoutSizingVertical = 'HUG';
```

### FORM (multi-panel settings)

```javascript
await init();
const refs = await bootstrapScreen('Settings — FORM', 0, 0);
await setShell(refs, { breadcrumb: ['Settings', 'Page'], cta: false, title: 'General Settings' });
refs.main.itemSpacing = 32; // multi-panel spacing

// Panel 1: form fields
const filledInput = _input.children.find(v => v.name.includes('Type=Text input') && v.name.includes('default-filled'));
const dropdown = _input.children.find(v => v.name.includes('Type=Dropdown - Regular') && v.name.includes('default-filled'));

const formRow = createRow('Form Row', refs.content);
formRow.itemSpacing = 24;
const input1 = filledInput.createInstance(); formRow.appendChild(input1); input1.layoutSizingHorizontal = 'FILL';
const input2 = filledInput.createInstance(); formRow.appendChild(input2); input2.layoutSizingHorizontal = 'FILL';
refs.panel.layoutSizingVertical = 'HUG';

// Panel 2: additional section
const p2 = await clonePanel(refs.main, 'Section Title', 'Section subtitle');
// Add fields to p2.content...
```

### SLIDEIN

Use Quick Access templates for slide-ins — clone `92:54631` (LVL1) or `92:55549` (LVL2), then customize.

### HUB (Navigation Cards)

```javascript
await init();
const refs = await bootstrapScreen('Integration Settings — HUB', 0, 0);
await setShell(refs, { breadcrumb: ['Integration Settings'], cta: false });
refs.main.itemSpacing = 32;
// Remove default panel — HUB builds panels via createHubPanel
refs.panel.remove();

// Hub panels use custom factory (defined inline — not in preamble due to size)
async function createHubPanel(title, subtitle) {
  const tempInst = _base.createInstance();
  const tempScreen = tempInst.detachInstance();
  const tempCF = tempScreen.children.find(c => c.name === 'Frame 1317');
  let panel = detach(tempCF.children.find(c => c.name === 'Standard Panel'));
  refs.main.appendChild(panel);
  panel.layoutSizingHorizontal = 'FIXED'; panel.resize(1700, panel.height);
  tempScreen.remove();
  await bindFill(panel, V.white); panel.strokes = []; panel.cornerRadius = 0;
  const ph = detach(panel.children.find(c => c.name === 'Panel Header'));
  setText(ph, 'Title', title, 'Bold');
  setText(ph, 'Sub-Title', subtitle);
  const content = panel.children.find(c => c.name === 'content placeholder');
  content.layoutSizingHorizontal = 'FILL'; content.layoutMode = 'VERTICAL';
  content.itemSpacing = 0; content.paddingTop = 0; content.paddingBottom = 0;
  content.paddingLeft = 0; content.paddingRight = 0; content.fills = [];
  while (content.children.length > 0) content.children[0].remove();
  const cardRow = figma.createFrame();
  cardRow.name = 'Card Row'; cardRow.layoutMode = 'HORIZONTAL'; cardRow.itemSpacing = 16;
  cardRow.paddingTop = 16; cardRow.paddingBottom = 16; cardRow.paddingLeft = 16; cardRow.paddingRight = 16;
  cardRow.fills = []; content.appendChild(cardRow);
  cardRow.layoutSizingHorizontal = 'FILL'; cardRow.layoutSizingVertical = 'HUG';
  panel.layoutSizingVertical = 'HUG';
  return cardRow;
}

async function createHubCard(cardRow, iconName, title, desc, padTop, padBot) {
  const card = figma.createFrame();
  card.name = title; card.layoutMode = 'VERTICAL';
  card.primaryAxisAlignItems = 'CENTER'; card.counterAxisAlignItems = 'CENTER';
  card.itemSpacing = 8; card.paddingTop = padTop||24; card.paddingBottom = padBot||24;
  card.paddingLeft = 24; card.paddingRight = 24; card.cornerRadius = 8;
  cardRow.appendChild(card);
  card.layoutSizingHorizontal = 'FILL'; card.layoutSizingVertical = 'HUG';
  await bindFill(card, V.mono100);
  // Icon
  const iw = figma.createFrame(); iw.name = 'Icon'; iw.layoutMode = 'HORIZONTAL';
  iw.primaryAxisAlignItems = 'CENTER'; iw.counterAxisAlignItems = 'CENTER'; iw.fills = [];
  card.appendChild(iw); iw.layoutSizingHorizontal = 'HUG'; iw.layoutSizingVertical = 'HUG';
  const it = figma.createText();
  it.fontName = {family:'Font Awesome 6 Pro',style:'Solid'}; it.fontSize = 32;
  it.characters = iconName; it.lineHeight = {value:48,unit:'PIXELS'};
  iw.appendChild(it); await bindFill(it, V.mono500);
  // Title
  const t = figma.createText(); t.fontName = {family:'Inter',style:'Bold'};
  t.fontSize = 16; t.characters = title; t.textAlignHorizontal = 'CENTER';
  card.appendChild(t); await bindFill(t, V.mono700);
  // Description
  const d = figma.createText(); d.fontName = {family:'Inter',style:'Regular'};
  d.fontSize = 14; d.characters = desc; d.textAlignHorizontal = 'CENTER';
  card.appendChild(d); await bindFill(d, V.mono500);
  return card;
}

// Usage:
const row1 = await createHubPanel('Tools & Guides', 'All you need for integration');
await createHubCard(row1, 'plug', 'Integration Hub', 'Validate and test your integration');
await createHubCard(row1, 'terminal', 'Debug Console', 'Verify service calls in real time');
```

### DASH (Multi-panel dashboard)

```javascript
await init();
const refs = await bootstrapScreen('Dashboard — DASH', 0, 0);
await setShell(refs, { breadcrumb: ['Dashboard'], cta: false, title: 'Overview' });
refs.main.itemSpacing = 32;

// Panel 1 already exists (refs.panel/content)
// Add more panels:
const p2 = await clonePanel(refs.main, 'Section 2', 'Details');
const p3 = await clonePanel(refs.main, 'Section 3', 'More details');
```

---

## Cell-Specific Patterns

### Status Tag Cell (zebra-aware wrapper)

Tags don't inherit row backgrounds. Wrap in a frame with matched fill.

```javascript
const ZEBRA_GRAY = {type:'SOLID',color:{r:0.9804,g:0.9804,b:0.9804}};
const tagVariant = _tag.children.find(v =>
  v.name.includes('Size=Small') && v.name.includes('Type=Icon - solid') && v.name.includes('Status=Default')
);

function addTagCell(row, text, index, width) {
  const wrapper = figma.createFrame();
  wrapper.name = 'Status Cell'; wrapper.layoutMode = 'HORIZONTAL';
  wrapper.counterAxisAlignItems = 'CENTER'; wrapper.paddingLeft = 16;
  wrapper.fills = (index % 2 === 0) ? [] : [ZEBRA_GRAY];
  row.appendChild(wrapper);
  wrapper.layoutSizingHorizontal = 'FIXED'; wrapper.resize(width, 75);
  wrapper.layoutSizingVertical = 'FIXED';
  const tag = tagVariant.createInstance(); wrapper.appendChild(tag);
  setText(tag, 'I am a tag', text);
  // Hide icons
  const props = tag.componentProperties;
  for (const key of Object.keys(props)) {
    if (key.toLowerCase().includes('trailing') || key.toLowerCase().includes('leading'))
      try { tag.setProperties({[key]: false}); } catch(e) {}
  }
  return wrapper;
}
```

### Solo Variants (single flag / action icon / image)

```javascript
// SINGLE FLAG
const flagCell = cell('flags-solo', isEven).createInstance();
row.appendChild(flagCell); flagCell.layoutSizingHorizontal = 'FIXED'; flagCell.resize(100, flagCell.height);
const flags = flagCell.findAll(n => n.name === 'Flag' && n.type === 'INSTANCE');
flags.forEach(f => f.visible = false);
flags[0].visible = true;
flags[0].setProperties({'Country': 'united kingdom'});

// SINGLE ACTION ICON
const actionCell = cell('action-solo', isEven).createInstance();
row.appendChild(actionCell); actionCell.layoutSizingHorizontal = 'FIXED'; actionCell.resize(100, actionCell.height);
const btns = actionCell.findAll(n => n.name === 'button-btn' && n.type === 'INSTANCE');
btns.forEach(b => b.visible = false);
btns[0].visible = true;
await bindFill(btns[0], V.green400);
setIcon(btns[0], 'gift');

// SINGLE IMAGE
const imgCell = cell('image-solo', isEven).createInstance();
row.appendChild(imgCell); imgCell.layoutSizingHorizontal = 'FIXED'; imgCell.resize(100, imgCell.height);
```

### Xmark Icon (red "x" for no-data)

```javascript
const iconCell = cell('icon', isEven).createInstance();
row.appendChild(iconCell); iconCell.layoutSizingHorizontal = 'FIXED'; iconCell.resize(120, iconCell.height);
const iconText = setIcon(iconCell, 'xmark');
if (iconText) await bindFill(iconText, V.red500);
```

### Form Fields

```javascript
const filledInput = _input.children.find(v => v.name.includes('Type=Text input') && v.name.includes('default-filled'));
const dropdown = _input.children.find(v => v.name.includes('Type=Dropdown - Regular') && v.name.includes('default-filled'));

// 2-column form row
const formRow = createRow('Form Row', content);
formRow.itemSpacing = 24;
const f1 = filledInput.createInstance(); formRow.appendChild(f1); f1.layoutSizingHorizontal = 'FILL';
const f2 = dropdown.createInstance(); formRow.appendChild(f2); f2.layoutSizingHorizontal = 'FILL';
// Override via setProperties or setText
```

---

## Rules Reference

| Code | Rule |
|---|---|
| R1 | Panel spacing = **32px** between panels (always) |
| R2 | Panel width = **1700px FIXED** (unless slide-in or split panel) |
| R3 | Panel corner radius = **0** (never rounded) |
| R4 | Content frame = **FILL height, top-centre aligned** (`primaryAxisAlignItems: MIN`) |
| R5 | Sort icons = **HIDDEN by default** (only show when brief explicitly asks) |
| R6 | Search input = **350px** when standalone |
| R7 | Icon buttons = **Status=default** (never hover/focused) |
| R8 | Tabs = **outside panels**, 32px gap between tabs |
| R9 | CTA text = **sentence case** ("Add Player", not "ADD PLAYER") |
| R10 | All fills/strokes = **variable-bound** (bindFill/bindStroke, never hardcode RGB) |
| R11 | Build on **Pastebin page** (not Sandbox) |
| R12 | Append to parent **before** setting `layoutSizingHorizontal = 'FILL'` |
| R13 | Detach top-level instance **first**, then children (reverse order crashes) |
| R14 | Header cell widths **must match** data cell widths (FILL↔FILL, FIXED↔FIXED) |
| R15 | Realistic data from **FT iGaming context** (player names, triggers, segments) |
