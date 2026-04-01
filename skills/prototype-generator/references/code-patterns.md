# Code Patterns

> Build engine for the prototype-generator skill. Helper library + pattern recipes.
> Last updated: 2026-03-30

---

## ⛔ Pre-Build Protocol (MANDATORY — execute before ANY Figma work)

> **This is not optional.** Every gate must pass before `use_figma` (or `figma_execute`) is called.
> Each gate produces visible output in the conversation. No silent skipping.
>
> **Tool choice:** Default to `use_figma` (cloud, no Desktop Bridge needed, supports batch operations).
> Use `figma_execute` only when you need mid-build screenshots or console debugging.
> The Helper Library preamble works identically in both tools.

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
| LIST-NESTED | Email Templates (Standard) | **DELETED** — build from components |

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

Before writing code, verify against the Rules Reference (§R1-R24) at the bottom of this file.

### Gate 4: Build

- Prepend the Helper Library to every `use_figma` / `figma_execute` call
- Pass the FT DNA `fileKey` when using `use_figma`
- Call `await init()` first, then use helpers
- Screenshot after each phase (via `figma_take_screenshot` from figma-console-mcp)

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

> Copy this entire block as the prefix of every `use_figma` or `figma_execute` call.
> Call `await init()` once at the top of your build code.
> Both tools execute Plugin API JavaScript — the preamble is identical for either.

```javascript
// ═══════════════════════════════════════════════════
// FT DNA Build Helpers v1.0
// Prepend to every use_figma / figma_execute call
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
let _base, _hdr, _row, ROW = {}, _tag, _tab, _input, _btn, _pag, _panelHdr, _radio;
async function init() {
  // Fonts — load all upfront, never again per-cell
  let faLoaded = false;
  await Promise.all([
    figma.loadFontAsync({family:'Inter',style:'Regular'}),
    figma.loadFontAsync({family:'Inter',style:'Bold'}),
    figma.loadFontAsync({family:'Inter',style:'Medium'}),
    figma.loadFontAsync({family:'Font Awesome 6 Pro',style:'Solid'}).then(()=>{faLoaded=true}).catch(()=>{}),
  ]);
  // Components — parallel fetch
  const ids = {
    base:'94:21370', hdr:'91:39176', row:'91:39179', tag:'91:10023',
    tab:'91:19098', input:'91:6537', btn:'91:8299', pag:'92:40394',
    panelHdr:'92:46640', // Panel Header component set (R22)
    radio:'91:8595',     // Radio button component set (R24)
  };
  const [base,hdr,row,tag,tab,input,btn,pag,panelHdr,radio] = await Promise.all(
    Object.values(ids).map(id => figma.getNodeByIdAsync(id))
  );
  _base=base; _hdr=hdr; _row=row; _tag=tag; _tab=tab; _input=input; _btn=btn; _pag=pag;
  _panelHdr = panelHdr; // Panel Header set — use _panelHdr.children.find(v => v.name.includes('Default'))
  _radio = radio;       // Radio set — Checked: _radio.children.find(v => v.name.includes('Checked') && v.name.includes('Default'))
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
  // Detach Standard Panel (need to add content children)
  const panel = detach(main.children.find(c => c.name === 'Standard Panel'));
  panel.layoutSizingHorizontal = 'FIXED'; panel.resize(1700, panel.height);
  // Panel Header — stays as INSTANCE (text edits work). Detach later in setShell only if search is needed.
  const panelHeader = panel.children.find(c => c.name === 'Panel Header');
  const content = panel.children.find(c => c.name === 'content placeholder');
  content.layoutMode = 'VERTICAL'; content.itemSpacing = 0;
  content.paddingTop = 32; content.paddingBottom = 32; content.paddingLeft = 32; content.paddingRight = 32;
  while (content.children.length > 0) content.children[0].remove();
  // Page Header — INSTANCE (text edits, CTA, breadcrumbs all work without detach)
  const header = screen.children.find(c => c.name === 'Page Header' || c.name === 'Header');
  return { screen, main, panel, panelHeader, content, header };
}

async function setShell(refs, cfg) {
  // Panel header
  if (cfg.title) setText(refs.panelHeader, 'Title', cfg.title, 'Bold');
  if (cfg.subtitle) setText(refs.panelHeader, 'Sub-Title', cfg.subtitle);
  if (cfg.subtitle === false) { const sn = refs.panelHeader.findOne(n => n.name === 'Sub-Title'); if (sn) sn.visible = false; }
  // Breadcrumb — swap to the correct Nav/N component, then set level texts.
  // Nav components: Nav/1 (1 level), Nav/2 (2, default), Nav/3 (3), Nav/4 (4), Nav/5+ exists too.
  // Structure: each has N-1 parent slots (Unselected) + 1 current-page slot (Selected, always last).
  // Text nodes named "Level 1" — parents are indices 0..N-2, current page is last index.
  if (cfg.breadcrumb) {
    const bc = refs.header.findOne(n => n.name && n.name.includes('Breadcrumb Navigation'));
    if (bc && bc.type === 'INSTANCE') {
      const navMap = { 1:'134:84755', 2:'94:21125', 3:'359:2', 4:'359:93' };
      const levels = cfg.breadcrumb.length;
      const targetId = navMap[levels];
      if (targetId && levels !== 2) { // Nav/2 is the default — only swap if different
        const target = await figma.getNodeByIdAsync(targetId);
        if (target) bc.swapComponent(target);
      }
      // Set text: collect "Level 1" nodes, assign parents from front, current page from back.
      // Nav/1 special case: only 1 visible slot but all nodes share same name — set all to same value.
      const levelNodes = bc.findAll(n => n.type === 'TEXT' && n.name === 'Level 1');
      const last = levelNodes.length - 1;
      for (let i = 0; i < levelNodes.length; i++) {
        const t = levelNodes[i];
        try { await figma.loadFontAsync(t.fontName); } catch(e) { continue; }
        if (levels === 1) { t.characters = cfg.breadcrumb[0]; }                   // Nav/1: set all to same
        else if (i === last) { t.characters = cfg.breadcrumb[levels - 1]; }       // current page (last)
        else if (i < levels - 1) { t.characters = cfg.breadcrumb[i]; }            // parent levels
      }
    }
  }
  // Heading text
  const headingNode = refs.header.findOne(n => n.type === 'TEXT' && n.characters === 'Heading');
  if (headingNode) {
    try { await figma.loadFontAsync(headingNode.fontName); } catch(e) {}
    headingNode.characters = cfg.breadcrumb?.[cfg.breadcrumb.length - 1] || cfg.title || '';
  }
  // CTA buttons — find in "Right - CTA and icons" frame
  // Structure: [Frame 1505 (icon btns), alt btn (hidden), main btn (visible), extra (hidden)]
  const rightArea = refs.header.findOne(n => n.name === 'Right - CTA and icons');
  if (rightArea) {
    const directBtns = rightArea.children.filter(n => n.name === 'button-btn');
    if (cfg.cta === false) {
      directBtns.forEach(b => b.visible = false);
    } else {
      // Main CTA — the visible button
      if (cfg.cta) {
        const mainBtn = directBtns.find(b => b.visible);
        if (mainBtn) {
          const mt = mainBtn.findAll(n => n.type === 'TEXT');
          for (const t of mt) {
            try { await figma.loadFontAsync(t.fontName); } catch(e) { continue; }
            if (t.characters === 'Button text') t.characters = cfg.cta;
          }
        }
      }
      // Secondary CTA — first hidden button (alt style)
      if (cfg.secondaryCta) {
        const altBtn = directBtns.find(b => !b.visible);
        if (altBtn) {
          altBtn.visible = true;
          const at = altBtn.findAll(n => n.type === 'TEXT');
          for (const t of at) {
            try { await figma.loadFontAsync(t.fontName); } catch(e) { continue; }
            if (t.characters === 'Button text') t.characters = cfg.secondaryCta;
          }
        }
      }
    }
  }
  // Search in panel header — requires detaching Panel Header (can't insertChild inside instance)
  if (cfg.search) {
    if (refs.panelHeader.type === 'INSTANCE') {
      refs.panelHeader = detach(refs.panelHeader); // Detach only when search is needed
    }
    const sf = refs.panelHeader.findOne(n => n.name === 'Search + Action Icons');
    if (sf) {
      sf.visible = true;
      const tg = sf.findOne(n => n.name === 'Toggle'); if (tg) tg.visible = false;
      const ai = sf.findOne(n => n.name === 'Action icons'); if (ai) ai.visible = false;
      const sv = _input.children.find(v => v.name.includes('Type=Search,') && v.name.includes('default-empty'));
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

async function buildDataRow(columns, data, index, parent) {
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
    const val = data[c] || '';
    // --- Text-based cells ---
    if (['text','texticon','texttrailing','number'].includes(type)) {
      setText(inst, 'Row', val);
      if (type === 'texticon' && col.icon) setIcon(inst, col.icon);
      if (col.color) { const tn = inst.findOne(n => n.type === 'TEXT' && n.name === 'Row'); if (tn) await bindFill(tn, col.color); }
    }
    // --- Status circle ---
    else if (type === 'status') {
      const ic = inst.findOne(n => n.name === 'v7-icon');
      if (ic) { const it = ic.findOne(n => n.type === 'TEXT' && n.name === 'icon'); if (it) await bindFill(it, val || col.color || V.green400); }
    }
    // --- Icon (e.g. xmark/check) ---
    else if (type === 'icon') {
      const it = setIcon(inst, val || col.icon || 'xmark');
      if (it && col.color) await bindFill(it, col.color);
    }
    // --- Tag ---
    else if (type === 'tag') {
      const tag = inst.findOne(n => n.name === 'Tag' && n.type === 'INSTANCE');
      if (tag) tag.setProperties({'Tag text#26:8': val || ''});
    }
    // --- Flags solo ---
    else if (type === 'flags-solo') {
      const flags = inst.findAll(n => n.name === 'Flag' && n.type === 'INSTANCE');
      flags.forEach(f => f.visible = false);
      if (flags[0] && val) { flags[0].visible = true; flags[0].setProperties({'Country': val}); }
    }
    // --- Ellipsis (no content needed) ---
    // else if (type === 'ellipsis') { /* kebab menu, no override */ }
  }
  return row;
}

// NOTE: buildDataRow is now async. buildTable must await each row.

async function buildTable(columns, data, parent) {
  const headerRow = buildHeaderRow(columns, parent);
  const dataRows = [];
  for (let i = 0; i < data.length; i++) {
    dataRows.push(await buildDataRow(columns, data[i], i, parent));
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
  const ph = tempPanel.children.find(c => c.name === 'Panel Header'); // INSTANCE — text edits work
  if (title) setText(ph, 'Title', title, 'Bold');
  if (subtitle) setText(ph, 'Sub-Title', subtitle);
  if (subtitle === false) { const sn = ph.findOne(n => n.name === 'Sub-Title'); if (sn) sn.visible = false; }
  const content = tempPanel.children.find(c => c.name === 'content placeholder');
  content.layoutMode = 'VERTICAL'; content.itemSpacing = 0;
  content.paddingTop = 32; content.paddingBottom = 32; content.paddingLeft = 32; content.paddingRight = 32;
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
| `bootstrapScreen` | `(name, x, y)` → `{screen, main, panel, panelHeader, content, header}` | Instantiate base template, detach, return all refs. Content area gets 32px padding on all sides (R25). |
| `setShell` | `(refs, {breadcrumb, cta, secondaryCta, title, subtitle, search})` | Override header + panel texts. `cta:false` hides buttons. `secondaryCta:'Send Data'` shows the alt button. `search:true` enables panel search. |
| `buildTable` | `async (columns, data, parent)` → `{headerRow, dataRows}` | Build table with auto-populated cells. `columns`: `[{name, type, width?, icon?, color?}]`. `data`: `[['val','val',...], ...]`. Supported auto-types: `text`, `texticon` (set `icon` in col), `texttrailing`, `number`, `status` (data = variable ID for dot color), `icon` (data = FA icon name, set `color` in col), `tag` (data = tag text), `flags-solo` (data = country name), `ellipsis` (no data needed). For `image`, `action`, `flags` (multi) — still needs manual post-processing. |
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
| `_panelHdr` | Component set `92:46640` | Panel Header — 4 variants. Default = `Property 1=Default`. Properties: `Search#4635:14`, `Toggle#4635:15`, `Action Icons#4635:12`, `Info icon#4635:17`, `Right side options#4635:16`, `Description#4635:13`. Text: `Title` (20px bold), `Sub-Title` (14px regular). **Always use this for panel headers — never build from primitives (R22).** |
| `_radio` | Component set `91:8595` | Radio button — 5 variants: `Type=Checked/Unchecked`, `Status=Default/Disabled/Hover`. Text property: `Text#9:9`. Usage: `_radio.children.find(v => v.name.includes('Checked') && v.name.includes('Default')).createInstance()`, then `inst.setProperties({'Text#9:9': 'Label'})`. Place in horizontal row, `itemSpacing = 32`. **Always use component — never build from primitives (R24).** |

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

> **Build from scratch — do NOT clone templates.** Template cloning fails via cloud MCP (compound instance IDs break cross-call references). This recipe builds the slide-in from components.
>
> **Header component:** `92:46212` — "Header - slide in modal". Instantiate directly, no detach needed.
> Text edits work on the instance: title (`Level 1`), tag (`Tag text#26:8`), button text (`Button text`).
>
> **Key gotcha:** After setting `layoutMode = 'VERTICAL'` on the outer frame, the height collapses to HUG.
> You MUST set `screen.layoutSizingVertical = 'FIXED'` and then `screen.resize(width, 1080)`.

```javascript
await init();
const pb = figma.root.children.find(p => p.name.includes('Pastebin'));
await figma.setCurrentPageAsync(pb);

// Step 1: Outer frame — FIXED height, mono-200 bg (f5f5f5)
const screen = figma.createFrame();
pb.appendChild(screen); screen.x = 0; screen.y = 0;
screen.name = 'My Slide-In';
screen.layoutMode = 'VERTICAL'; screen.itemSpacing = 0;
await bindFill(screen, V.mono200);            // ← mono-200 bg, NOT white
screen.layoutSizingVertical = 'FIXED';        // ← MUST be before resize
screen.resize(1250, 1300);                    // LVL1 = 1250, LVL2 = 1125. Extend height for content.

// Step 2: Header — instantiate component (no detach needed)
const headerComp = await figma.getNodeByIdAsync('92:46212');
const header = headerComp.createInstance();
screen.appendChild(header);
header.layoutSizingHorizontal = 'FILL';

// Title
const titleNode = header.findOne(n => n.type === 'TEXT' && n.name === 'Level 1');
if (titleNode) { await figma.loadFontAsync(titleNode.fontName); titleNode.characters = 'Entity Name'; }

// Show tag (hidden by default) — color with variable
const tag = header.findOne(n => n.name === 'Tag' && n.type === 'INSTANCE');
if (tag) { tag.visible = true; tag.setProperties({'Tag text#26:8': 'ID-001'}); await bindFill(tag, V.green200); }

// CTA buttons — hide icon frame + kebab for simple slide-ins
const rightArea = header.findOne(n => n.name === 'Right - CTA and icons');
if (rightArea) {
  const iconFrame = rightArea.findOne(n => n.name === 'Frame 1505');
  if (iconFrame) iconFrame.visible = false;
  const allBtns = rightArea.children.filter(n => n.name === 'button-btn');
  let textBtnIdx = 0;
  for (const btn of allBtns) {
    const bt = btn.findOne(n => n.type === 'TEXT' && n.name === 'Button text');
    if (bt) {
      textBtnIdx++;
      if (textBtnIdx === 1) btn.visible = false;             // hide alt button
      if (textBtnIdx === 2) {
        btn.visible = true;
        await figma.loadFontAsync(bt.fontName);
        bt.characters = 'Save';                               // main CTA
      }
    } else {
      btn.visible = false;                                    // hide kebab
    }
  }
}

// Step 3: Content area (transparent — panels provide white bg)
const contentArea = figma.createFrame();
contentArea.name = 'Frame 1317';              // ← match reference naming
contentArea.layoutMode = 'VERTICAL'; contentArea.itemSpacing = 32;
contentArea.paddingTop = 32; contentArea.paddingBottom = 32;
contentArea.paddingLeft = 32; contentArea.paddingRight = 32;
contentArea.fills = [];
screen.appendChild(contentArea);
contentArea.layoutSizingHorizontal = 'FILL';
contentArea.layoutSizingVertical = 'FILL';    // fills remaining height below header
contentArea.primaryAxisAlignItems = 'MIN';    // top-aligned

// Step 4: Build Standard Panels (white cards with border)
// RULE R22: Always use Panel Header COMPONENT (`92:46640`), never primitive text.
// _panelHdr is already cached by init() — no need to fetch again.
const _phDefault = _panelHdr.children.find(v => v.name.includes('Default'));

async function buildPanel(parent, title, subtitle) {
  const p = figma.createFrame();
  p.name = 'Standard Panel'; p.layoutMode = 'VERTICAL'; p.itemSpacing = 0;
  await bindFill(p, V.white); p.cornerRadius = 8;
  await bindStroke(p, V.mono300); p.strokeWeight = 1;
  parent.appendChild(p);
  p.layoutSizingHorizontal = 'FILL'; p.layoutSizingVertical = 'HUG';

  // Panel Header — COMPONENT INSTANCE (not primitives)
  const ph = _phDefault.createInstance();
  p.appendChild(ph);
  ph.layoutSizingHorizontal = 'FILL';
  ph.setProperties({
    'Search#4635:14': false,
    'Toggle#4635:15': false,
    'Action Icons#4635:12': false,
    'Info icon#4635:17': false,
    'Right side options#4635:16': false,
  });
  if (subtitle !== false) ph.setProperties({ 'Description#4635:13': true });
  else ph.setProperties({ 'Description#4635:13': false });

  const titleNode = ph.findOne(n => n.type === 'TEXT' && n.name === 'Title');
  if (titleNode && title) { await figma.loadFontAsync(titleNode.fontName); titleNode.characters = title; }
  if (subtitle) {
    const subNode = ph.findOne(n => n.type === 'TEXT' && n.name === 'Sub-Title');
    if (subNode) { await figma.loadFontAsync(subNode.fontName); subNode.characters = subtitle; }
  }

  // Content area inside panel
  const c = figma.createFrame();
  c.name = 'content'; c.layoutMode = 'VERTICAL'; c.itemSpacing = 16;
  c.paddingTop = 32; c.paddingBottom = 32; c.paddingLeft = 32; c.paddingRight = 32;
  c.fills = []; p.appendChild(c);
  c.layoutSizingHorizontal = 'FILL'; c.layoutSizingVertical = 'HUG';
  return { panel: p, panelHeader: ph, content: c };
}

// Step 5: Add Input Fields to panels
const inputSet = await figma.getNodeByIdAsync('91:6537');

async function addInput(parent, label, variantStr, value, opts = {}) {
  const filled = !!value;
  const comp = inputSet.children.find(v =>
    v.name.includes(variantStr) && v.name.includes(filled ? 'default-filled' : 'default-empty'));
  if (!comp) return null;
  const inst = comp.createInstance();
  parent.appendChild(inst); inst.layoutSizingHorizontal = 'FILL';
  inst.setProperties({ 'AI+Emoji#4369:0': false });
  const lbl = inst.findOne(n => n.type === 'TEXT' && n.name === 'Label text here');
  if (lbl) { await figma.loadFontAsync(lbl.fontName); lbl.characters = label; }
  if (value) {
    const ph = inst.findOne(n => n.type === 'TEXT' && n.name === 'Placeholder');
    if (ph) { await figma.loadFontAsync(ph.fontName); ph.characters = value; }
  }
  if (opts.required) inst.setProperties({ 'Required#4285:155': true });
  return inst;
}

const p1 = await buildPanel(contentArea, 'General', 'Enter the basic segment information');
await addInput(p1.content, 'Segment Name', 'Text input', 'Reactivation Q1 2025', { required: true });
await addInput(p1.content, 'Description', 'Text Area', 'Target churned players from last 90 days');
// ... more panels
```

**Key differences from v1 recipe:**
- **Background:** `V.mono200` (not white) — panels are white cards ON the gray bg
- **Panels:** `buildPanel()` creates Standard Panel frames with white fill + mono-300 border + 8px radius
- **Panel Header:** Primitive title + subtitle (bold 16px + regular 14px), 24px horizontal padding
- **Content area inside panels:** 24px padding, 16px itemSpacing, HUG height
- **Input Fields:** Use `addInput()` helper — finds filled/empty variant, overrides label + value, disables AI+Emoji
- **Block Selector text override:** Target `"Origin name"` text node (NOT `"Block selector"`)
- **Block Selector sizing:** Set `layoutSizingHorizontal = 'FIXED'` + `resize(360, height)` for 3 per row. Show only ONE icon type per panel: Origins → `Icon=true, flag=false`; Markets → `flag=true, Icon=false`
- **Height:** Extend beyond 1080px if content requires — slide-ins scroll in the platform

**Header component anatomy (`92:46212`):**
```
Header - slide in modal
├── Left - Breadcrumb Navigation
│   ├── v7-icon (xmark — close button)
│   └── Breadcrumb INSTANCE
│       ├── "Level 1" TEXT — entity name / title
│       ├── Tag INSTANCE (hidden by default) — entity ID
│       └── v7-icon (chevron, hidden)
└── Right - CTA and icons
    ├── Frame 1505 (3 icon buttons — info, history, lock)
    ├── button-btn (alt CTA — text button)
    ├── button-btn (main CTA — text button, pink)
    └── button-btn (kebab — icon-only, ellipsis-vertical)
```

**For full-page + slide-in composites** (background page + overlay + slide-in):
```
Root frame (1920 × 1080, layoutMode: 'NONE')
├── Background page (full page, e.g. All Activities)
├── Overlay blur-small (92:55554) — 614px, positioned left of slide-in
└── Slide-in (1250px, positioned right: x=670, y=0)
```

**Reference templates (for visual comparison only — do NOT clone):**
`92:54631` (LVL1), `92:55549` (LVL2), `92:56151` (SDT full), `92:56159` (Recurring full).

### HUB (Navigation Cards)

> Uses **Placeholder Size=M** (`92:49611`, variant `Size=M`) as navigation cards with extras disabled. Each card gets: centered icon + bold title + description, mono-100 bg, **no stroke, no round corners** (cornerRadius 0). No new component needed — Placeholder with `Extras=false` is the nav card.

```javascript
await init();

// Full-detach bootstrap (see §Gotcha: full detach child indices)
const baseComp = await figma.getNodeByIdAsync('94:21370');
const inst = baseComp.createInstance();
pb.appendChild(inst);
const screen = inst.detachInstance();
screen.name = 'Page Name — HUB';

// children[0]=side menu, children[1]=Page Header, children[2]=Frame 1317 (main)
const phInst = screen.children[1];
phInst.detachInstance();
const ph = screen.children[1];

// Breadcrumb → Nav/1
const oldBC = ph.children[0];
const nav1Comp = await figma.getNodeByIdAsync('134:84755');
const nav1 = nav1Comp.createInstance();
ph.insertChild(0, nav1); nav1.layoutSizingHorizontal = 'FILL'; oldBC.remove();
const txts = nav1.findAll(n => n.type === 'TEXT' && n.name === 'Level 1');
for (const t of txts) { await figma.loadFontAsync(t.fontName); t.characters = 'Integration Settings'; }

// Hide CTA area
const rightArea = ph.children[1];
for (const child of rightArea.children) { child.visible = false; }

// Main content area
const mainFrame = screen.children[2];
mainFrame.name = 'main'; mainFrame.itemSpacing = 32;
mainFrame.paddingTop = 24; mainFrame.paddingBottom = 24;
mainFrame.paddingLeft = 24; mainFrame.paddingRight = 24;
mainFrame.children[0].remove(); // remove default Standard Panel

// Placeholder Size=M for nav cards
const phSet = await figma.getNodeByIdAsync('92:49611');
const phM = phSet.children.find(v => v.name === 'Size=M');

// Helper: panel with nav cards
async function navPanel(parent, title, subtitle, cards) {
  const p = figma.createFrame();
  p.name = title; p.layoutMode = 'VERTICAL'; p.itemSpacing = 0;
  await bindFill(p, V.white); p.strokes = []; p.cornerRadius = 0;
  parent.appendChild(p);
  p.layoutSizingHorizontal = 'FILL'; p.layoutSizingVertical = 'HUG';

  // Panel Header — use the REAL component (92:46640), never primitive text
  const phSet = await figma.getNodeByIdAsync('92:46640');
  const phDefault = phSet.children.find(v => v.name.includes('Default'));
  const h = phDefault.createInstance();
  p.appendChild(h); h.layoutSizingHorizontal = 'FILL';
  h.setProperties({
    'Search#4635:14': false, 'Action Icons#4635:12': false,
    'Toggle#4635:15': false, 'Right side options#4635:16': false,
    'Info icon#4635:17': false, 'Description#4635:13': !!subtitle,
  });
  const tN = h.findOne(n => n.type === 'TEXT' && n.name === 'Title');
  if (tN) { await figma.loadFontAsync(tN.fontName); tN.characters = title; }
  if (subtitle) {
    const sN = h.findOne(n => n.type === 'TEXT' && n.name === 'Sub-Title');
    if (sN) { await figma.loadFontAsync(sN.fontName); sN.characters = subtitle; }
  }

  // Card row
  const row = figma.createFrame();
  row.name = 'Card Row'; row.layoutMode = 'HORIZONTAL'; row.itemSpacing = 16;
  row.paddingTop = 16; row.paddingBottom = 32; row.paddingLeft = 32; row.paddingRight = 32;
  row.fills = []; p.appendChild(row);
  row.layoutSizingHorizontal = 'FILL'; row.layoutSizingVertical = 'HUG';

  for (const c of cards) {
    const card = phM.createInstance();
    row.appendChild(card); card.layoutSizingHorizontal = 'FILL';
    card.setProperties({
      'CTA#3691:0': false, 'Learn more link#3691:6': false,
      'Extras#4325:0': false, 'Description#3783:7': true,
    });
    const allT = card.findAll(n => n.type === 'TEXT');
    const hN = allT.find(n => n.characters.includes('Heading'));
    if (hN) { await figma.loadFontAsync(hN.fontName); hN.characters = c.title; }
    const dN = allT.find(n => n.characters.includes('Description text'));
    if (dN) { await figma.loadFontAsync(dN.fontName); dN.characters = c.desc; }
    card.cornerRadius = 0; card.strokes = []; // HUB cards: no round corners, no stroke
  }
}

await navPanel(mainFrame, 'Tools & Guides', 'All you need for integration', [
  { title: 'Integration Hub', desc: 'Validate and test your integration' },
  { title: 'API Docs', desc: 'Full reference for all endpoints' },
  { title: 'Developer Guide', desc: 'Step-by-step guides and tutorials' },
]);
// ... more panels
```

**Gotcha: full-detach child indices.** After `inst.detachInstance()`, the Base Template becomes a plain frame. Children are accessed by index: `[0]` = side menu, `[1]` = Page Header, `[2]` = Frame 1317 (main content). Don't use `findOne('main')` — the frame is named `Frame 1317` internally.

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

### GRID (Card Grid)

Use the `card - markets` component (`92:46824`) as the general-purpose card. Override title, description, and tag text. Hide the main Flag if not needed for your domain.

```javascript
await init();
const refs = await bootstrapScreen('Page Name — GRID', 0, 0);
await setShell(refs, {
  breadcrumb: ['Page Name'], cta: 'New Item',
  title: 'Manage Items', subtitle: 'Description of the items.', search: true,
});

// Fetch card component
const _card = await figma.getNodeByIdAsync('92:46824');
const cardVariant = _card.children.find(v => v.name.includes('type=default') && v.name.includes('state=default'));

// Card grid — wrapping horizontal layout inside content
const grid = figma.createFrame();
grid.name = 'Card Grid'; grid.layoutMode = 'HORIZONTAL';
grid.layoutWrap = 'WRAP'; grid.itemSpacing = 16; grid.counterAxisSpacing = 16;
grid.fills = [];
refs.content.appendChild(grid);
grid.layoutSizingHorizontal = 'FILL'; grid.layoutSizingVertical = 'HUG';

const cards = [
  { title: 'Card Title', desc: 'Card description text.', tag: '24 items' },
  // ... more cards
];

for (const d of cards) {
  const card = cardVariant.createInstance();
  grid.appendChild(card);
  card.layoutSizingHorizontal = 'FIXED'; card.resize(397, card.height);
  // Override title (node named after default country text)
  const titleNode = card.findOne(n => n.type === 'TEXT' && n.parent?.name === 'Frame 1388' && n.fontName?.style === 'Bold');
  if (titleNode) { await figma.loadFontAsync(titleNode.fontName); titleNode.characters = d.title; }
  // Override description
  const descNode = card.findOne(n => n.type === 'TEXT' && n.parent?.name?.includes('card'));
  if (descNode) { await figma.loadFontAsync(descNode.fontName); descNode.characters = d.desc; }
  // Override tag count
  const tag = card.findOne(n => n.name === 'Tag' && n.type === 'INSTANCE');
  if (tag) tag.setProperties({'Tag text#26:8': d.tag});
  // Hide main flag if not needed
  const mainFlag = card.findOne(n => n.name === 'Flag' && n.parent?.name === 'Frame 1388');
  if (mainFlag) mainFlag.visible = false;
}

refs.panel.layoutSizingVertical = 'HUG';
```

---

## Cell-Specific Patterns

### Status Tag Cell (zebra-aware wrapper)

Tags don't inherit row backgrounds. Wrap in a frame with matched fill.

```javascript
const tagVariant = _tag.children.find(v =>
  v.name.includes('Size=Small') && v.name.includes('Type=Icon - solid') && v.name.includes('Status=Default')
);

async function addTagCell(row, text, index, width) {
  const wrapper = figma.createFrame();
  wrapper.name = 'Status Cell'; wrapper.layoutMode = 'HORIZONTAL';
  wrapper.counterAxisAlignItems = 'CENTER'; wrapper.paddingLeft = 16;
  if (index % 2 !== 0) await bindFill(wrapper, V.mono100);
  else wrapper.fills = [];
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
| R3 | Panel corner radius = **0** for bootstrapped pages (standard shell). **8px** for SLIDEIN panels (white cards on mono-200 bg). |
| R4 | Content frame = **FILL height, top-centre aligned** (`primaryAxisAlignItems: MIN`) |
| R5 | Sort icons = **HIDDEN by default** (only show when brief explicitly asks) |
| R6 | Search input = **350px** when standalone |
| R7 | Icon buttons = **Status=default** (never hover/focused) |
| R8 | Tabs = **outside panels**. `itemSpacing = 32` between tab items within the tab bar. Gap between tab bar and panel below = **16px** (standard content column spacing, see R19). |
| R9 | CTA text = **sentence case** ("Add Player", not "ADD PLAYER") |
| R10 | All fills/strokes = **variable-bound** (bindFill/bindStroke, never hardcode RGB) |
| R11 | Build on **Pastebin page** (not Sandbox) |
| R12 | Append to parent **before** setting `layoutSizingHorizontal = 'FILL'` |
| R13 | **Minimal detach** — only detach Screen + Standard Panel. Keep **Page Header as INSTANCE** always. Keep **Panel Header as INSTANCE** unless search is enabled (search requires detach to insert children). Text edits work on all instances with font loading. |
| R14 | Header cell widths **must match** data cell widths (FILL↔FILL, FIXED↔FIXED) |
| R15 | Realistic data from **FT iGaming context** (player names, triggers, segments) |
| R16 | **Use components** — never build from primitives when a library component exists. Cards, panels, inputs, buttons must be component instances. |
| R17 | **GRID cards = 4 per row** — card width formula: `Math.floor((gridWidth - 3 * 16) / 4)`. Standard content width (1636px inside 1700px panel with padding) yields ~397px per card. Always use `layoutWrap = 'WRAP'`, `itemSpacing = 16`, `counterAxisSpacing = 16`. Cards are `FIXED` width, `HUG` height with `minHeight = 220`. |
| R18 | **Button variant names use `Size=default`** — not `Size=M`. Correct lookups: `Type=main, Status=default, Size=default, Leading icon=No` (pink), `Type=sub, Status=default, Size=default, Leading icon=No` (dark/black), `Type=icon, Status=default, Size=M, Leading icon=No` (icon-only — this one uses `Size=M`). |
| R19 | **Tab container** = 1700px wide, `primaryAxisAlignItems = 'MIN'` (left-aligned), `itemSpacing = 32` between tab items. Gap between tab container and panel below = **16px** (standard content column spacing). Tab instances from `tab-box-index` (`91:19098`): `Type=tab-box-index, Status=Selected` for active, `Status=Default` for inactive. |
| R20 | **Block Selector** component (`91:8712`) — 6 variants. Properties: `Image#37:184`, `Icon#37:183`, `xmark#37:181`, `flag#37:182`, `Toggle#37:185`, `Number#37:186`. Override the text node named `"Origin name"` for the label. Use for origin/market selection grids (e.g. Activity Builder Segment section). |
| R21 | **Tab-box-index duotone icons** — Each tab-box-index instance has two icon text layers: `icon-primary#` (main icon glyph) and `icon-secondary##` (secondary/accent glyph). Both are FA text nodes. Override via `setText(tab, 'icon-primary#', '\uf1b0')` or similar. Cloud MCP cannot render FA6 Pro — icons will degrade to placeholder glyphs but structural placement is correct. |
| R22 | **Panel Header = COMPONENT `92:46640`, never primitives.** 4 variants, default = `Property 1=Default`. Boolean properties: `Search#4635:14`, `Toggle#4635:15`, `Action Icons#4635:12`, `Info icon#4635:17`, `Right side options#4635:16`, `Description#4635:13`. Text overrides: `Title` (bold 20px), `Sub-Title` (regular 14px). Always use component instance — never create text frames manually for panel headers. |
| R23 | **Filter tags + action icons = inside Panel Header**, not as separate rows. When a page needs filter tags (ACTIVE/DRAFT/etc.) and/or action icon buttons, they go inside the Panel Header's `Search + Action Icons` area — search on left, filter tags + icon buttons on right. Never create separate stacked rows below the panel header for these elements. Reference: All Activities page pattern. |
| R24 | **Radio Button = COMPONENT (`91:8595`), never primitives.** 5 variants: `Type=Checked/Unchecked`, `Status=Default/Disabled/Hover`. Text property: `Text#9:9` — override via `setProperties({'Text#9:9': 'Option label'})`. Always use component instances for radio buttons. Never build from ellipses + text. Place in a horizontal row with `itemSpacing = 32`. |
| R25 | **Panel content padding = 32px all sides.** Content area inside any Standard Panel uses `paddingTop = 32; paddingBottom = 32; paddingLeft = 32; paddingRight = 32`. This creates 32px distance between the Panel Header component and the first content element, and 32px margins from the panel edges. Applies to `bootstrapScreen`, `clonePanel`, and `buildPanel`. Never use 24px — 32px is the foundation spacing for panel content. |
| R26 | **Action bar layout: info left, actions right, primary CTA rightmost.** Informational elements (tags, counts, status) left-aligned → spacer (FILL) → secondary actions (Reset, Cancel) right-aligned → primary CTA at far right terminal position. Follows F-pattern reading flow. Applies to any panel, widget, or slide-in that has an action bar. Never cluster all buttons on one side with info trailing. |
