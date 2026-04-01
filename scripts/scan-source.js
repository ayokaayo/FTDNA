#!/usr/bin/env node
// scan-source.js — Extract page metadata from backoffice-v2 Vue source files
//
// Produces a unified page-manifest.json consumed by both prototype generators.
//
// Usage:
//   node scripts/scan-source.js                  Full scan → page-manifest.json
//   node scripts/scan-source.js --verbose         Show per-file extraction details
//   node scripts/scan-source.js --filter <name>   Debug single page (partial match)
//   node scripts/scan-source.js --diff            Show what changed since last run
//   node scripts/scan-source.js --stats           Print summary statistics only

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BACKOFFICE = join(ROOT, '..', 'backoffice-v2');
const PAGES_DIR = join(BACKOFFICE, 'src', 'components', 'pages');
const ROUTER_FILE = join(BACKOFFICE, 'src', 'router', 'index.js');
const SCAN_MANIFEST = join(ROOT, 'references', 'scan-manifest.json');
const BRIEFS_DIR = join(ROOT, 'skills', 'prototype-generator', 'briefs');
const PROTOTYPES_DIR = join(BACKOFFICE, 'src', 'components', 'pages', 'Prototypes');
const OUTPUT = join(ROOT, 'references', 'page-manifest.json');

// ─── CLI ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const statsOnly = args.includes('--stats');
const showDiff = args.includes('--diff');
const filterIdx = args.indexOf('--filter');
const filter = filterIdx !== -1 ? args[filterIdx + 1]?.toLowerCase() : null;

// ─── Utilities ──────────────────────────────────────────────────────────────

function slugify(s) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function normalizePath(p) {
  if (!p) return '';
  return p.replace(/\/+$/, '').replace(/\/+/g, '/') || '/';
}

/** Strip route params like :id, :activityId?, :segmentId? for matching */
function stripRouteParams(p) {
  if (!p) return '';
  return normalizePath(
    p.replace(/\/:[^/]+\??/g, '') // remove /:param and /:param?
  );
}

function log(...args) {
  if (verbose) console.log('  ', ...args);
}

// ─── 1. Collect Vue page files ──────────────────────────────────────────────

function collectVueFiles(dir, base = dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // Skip Prototypes directory — those are our outputs, not inputs
      if (entry === 'Prototypes') continue;
      files.push(...collectVueFiles(full, base));
    } else if (entry.endsWith('.vue')) {
      files.push(relative(join(BACKOFFICE), full));
    }
  }
  return files;
}

// ─── 2. Parse router ────────────────────────────────────────────────────────

function parseRouter() {
  const source = readFileSync(ROUTER_FILE, 'utf8');

  // 2a. Parse imports: varName → relative file path
  const importMap = new Map();
  const importRe = /import\s+(\w+)\s+from\s+['"](.+?)['"]/g;
  for (const m of source.matchAll(importRe)) {
    const varName = m[1];
    let filePath = m[2];
    if (filePath.startsWith('@/')) {
      filePath = 'src/' + filePath.slice(2);
    }
    // Ensure .vue extension
    if (!filePath.endsWith('.vue') && !filePath.endsWith('.js') && !filePath.endsWith('.ts')) {
      filePath += '.vue';
    }
    importMap.set(varName, filePath);
  }

  // 2b. Normalize PUBLIC_PATH in source for path extraction
  const normalized = source
    .replace(/`\$\{PUBLIC_PATH\}([^`]*)`/g, (_, inner) => `'/v2/${inner}'`)
    .replace(/`\$\{PUBLIC_PATH\}`/g, "'/v2/'")
    .replace(/PUBLIC_PATH/g, "'/v2/'");

  // 2c. Extract routes by finding component references
  const routes = new Map(); // filePath → route info

  // Skip these wrapper/utility components
  const skipComponents = new Set([
    'Layout', 'ChildLayout', 'SingularityModelIndex', 'RewardsLayout',
    'DataStudioLayout', 'FTGitBookPage',
  ]);

  // Find all component: VarName references
  const compRe = /component:\s*(\w+)/g;
  for (const match of normalized.matchAll(compRe)) {
    const varName = match[1];
    if (skipComponents.has(varName)) continue;
    if (varName.startsWith('Prototype')) continue; // Skip prototype routes

    const filePath = importMap.get(varName);
    if (!filePath) continue;
    if (!filePath.includes('components/pages/')) continue; // Only page components

    // Already have this file? First route wins (some components have multiple routes)
    if (routes.has(filePath)) continue;

    const pos = match.index;

    // Extract enclosing route object
    const routeBlock = extractEnclosingBlock(normalized, pos);
    if (!routeBlock) continue;

    // Extract properties from the block
    const pathMatch = routeBlock.text.match(/path:\s*['"]([^'"]+)['"]/);
    const nameMatch = routeBlock.text.match(/name:\s*['"](\w+)['"]/);

    // Permission: string, permissionCodes ref, or array
    let permission = null;
    const permStr = routeBlock.text.match(/permission:\s*['"]([^'"]+)['"]/);
    const permCode = routeBlock.text.match(/permission:\s*(permissionCodes\.\S+?)[\s,}]/);
    const permArr = routeBlock.text.match(/permission:\s*\[([\s\S]*?)\]/);
    if (permStr) permission = permStr[1];
    else if (permCode) permission = permCode[1];
    else if (permArr) permission = permArr[1].replace(/\s+/g, ' ').trim();

    let routePath = pathMatch ? pathMatch[1] : '';

    // Resolve relative or empty paths: find parent path
    if (!routePath || !routePath.startsWith('/')) {
      const parentPath = findParentPath(normalized, routeBlock.start);
      if (parentPath) {
        routePath = routePath
          ? parentPath.replace(/\/$/, '') + '/' + routePath
          : parentPath; // empty child inherits parent path
      }
    }

    routes.set(filePath, {
      routePath: normalizePath(routePath),
      routeName: nameMatch ? nameMatch[1] : '',
      permission,
    });
  }

  // Also handle lazy imports: component: () => import('...')
  const lazyRe = /component:\s*\(\)\s*=>\s*import\(\s*['"](.+?)['"]\s*\)/g;
  for (const match of normalized.matchAll(lazyRe)) {
    let filePath = match[1];
    if (filePath.startsWith('@/')) filePath = 'src/' + filePath.slice(2);
    if (!filePath.endsWith('.vue')) filePath += '.vue';
    if (routes.has(filePath)) continue;

    const pos = match.index;
    const routeBlock = extractEnclosingBlock(normalized, pos);
    if (!routeBlock) continue;

    const pathMatch = routeBlock.text.match(/path:\s*['"]([^'"]+)['"]/);
    const nameMatch = routeBlock.text.match(/name:\s*['"](\w+)['"]/);
    let routePath = pathMatch ? pathMatch[1] : '';
    if (routePath && !routePath.startsWith('/')) {
      const parentPath = findParentPath(normalized, routeBlock.start);
      if (parentPath) routePath = parentPath.replace(/\/$/, '') + '/' + routePath;
    }

    routes.set(filePath, {
      routePath: normalizePath(routePath),
      routeName: nameMatch ? nameMatch[1] : '',
      permission: null,
    });
  }

  return { importMap, routes };
}

/** Find the enclosing { ... } block around a position */
function extractEnclosingBlock(source, pos) {
  // Walk backward to find opening {
  let braceCount = 0;
  let start = pos;
  for (let i = pos; i >= 0; i--) {
    if (source[i] === '}') braceCount++;
    if (source[i] === '{') {
      if (braceCount === 0) { start = i; break; }
      braceCount--;
    }
  }

  // Walk forward to find closing }
  braceCount = 0;
  let end = pos;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') braceCount++;
    if (source[i] === '}') {
      braceCount--;
      if (braceCount === 0) { end = i + 1; break; }
    }
  }

  return { text: source.slice(start, end), start, end };
}

/** Find the parent route's path for nested children routes */
function findParentPath(source, childStart) {
  // Search backward from childStart for 'children:' or 'children :'
  const before = source.slice(0, childStart);
  const childrenIdx = before.lastIndexOf('children:');
  if (childrenIdx === -1) return null;

  // From childrenIdx, search backward for the parent's path
  const beforeChildren = source.slice(0, childrenIdx);
  const pathMatches = [...beforeChildren.matchAll(/path:\s*['"]([^'"]+)['"]/g)];
  if (pathMatches.length === 0) return null;

  // The last path match before 'children:' is the parent's path
  return pathMatches[pathMatches.length - 1][1];
}

// ─── 3. Scan a single Vue file ─────────────────────────────────────────────

function scanVueFile(filePath) {
  const fullPath = join(BACKOFFICE, filePath);
  const source = readFileSync(fullPath, 'utf8');

  // Split into template and script sections
  // Use indexOf/lastIndexOf to handle nested <template #slot> tags correctly
  const tmplOpen = source.indexOf('<template>');
  const tmplClose = source.lastIndexOf('</template>');
  const template = (tmplOpen !== -1 && tmplClose > tmplOpen)
    ? source.slice(tmplOpen + '<template>'.length, tmplClose)
    : '';

  // Script: may have multiple blocks (<script> + <script setup>), concatenate all
  const scriptBlocks = [];
  const scriptBlockRe = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  let scriptAttrs = '';
  for (const m of source.matchAll(scriptBlockRe)) {
    scriptAttrs += m[1]; // Accumulate attrs (setup, lang="ts")
    scriptBlocks.push(m[2]);
  }
  const script = scriptBlocks.join('\n');

  // API style and language
  const isComposition = scriptAttrs.includes('setup');
  const isTypeScript = scriptAttrs.includes('lang="ts"') || scriptAttrs.includes("lang='ts'");

  // ─── Component imports ───
  const imports = [];
  const importRe = /import\s+(\w+)\s+from\s+['"](.+?)['"]/g;
  for (const m of script.matchAll(importRe)) {
    const name = m[1];
    const path = m[2];
    // Skip non-component imports (utilities, stores, etc.)
    const isComponent = /^[A-Z]/.test(name) && !name.startsWith('use') &&
      !['clone', 'mapGetters', 'mapActions', 'mapState', 'paginateArray',
        'getActivityStatus', 'setCookie', 'getCookie', 'getFlagsCode'].includes(name);
    if (isComponent) {
      imports.push({
        name,
        path,
        isGlobal: name.startsWith('FT') && !path.includes('/'),
      });
    }
  }

  // Also detect destructured imports for utils (these aren't components)
  // We want to know about Vuex helpers
  const hasMapGetters = script.includes('mapGetters');
  const hasMapActions = script.includes('mapActions');

  // ─── Vuex getters ───
  const vuexGetters = [];
  // Pattern: mapGetters({ localName: 'module/getter' })
  const getterBlockRe = /mapGetters\(\{([\s\S]*?)\}\)/g;
  for (const block of script.matchAll(getterBlockRe)) {
    const getterRe = /['"](\w+\/\w+)['"]/g;
    for (const g of block[1].matchAll(getterRe)) {
      vuexGetters.push(g[1]);
    }
  }
  // Pattern: mapGetters('module', ['getter1', 'getter2'])
  const getterNsRe = /mapGetters\(\s*['"](\w+)['"]\s*,\s*\[([\s\S]*?)\]\s*\)/g;
  for (const block of script.matchAll(getterNsRe)) {
    const ns = block[1];
    for (const g of block[2].matchAll(/['"](\w+)['"]/g)) {
      vuexGetters.push(`${ns}/${g[1]}`);
    }
  }
  // Pattern: this.$store.getters['module/getter']
  for (const m of script.matchAll(/\$store\.getters\[['"](.+?)['"]\]/g)) {
    vuexGetters.push(m[1]);
  }

  // ─── Vuex dispatches ───
  const vuexDispatches = [];
  for (const m of script.matchAll(/\$store\.dispatch\(\s*['"](.+?)['"]/g)) {
    vuexDispatches.push(m[1]);
  }

  // ─── Pinia stores ───
  const piniaStores = [];
  for (const m of script.matchAll(/import\s*\{[^}]*(use\w+Store)[^}]*\}\s*from\s*['"](.+?)['"]/g)) {
    piniaStores.push({ name: m[1], path: m[2] });
  }
  // Also standalone: const store = useXStore()
  for (const m of script.matchAll(/(use\w+Store)\s*\(\)/g)) {
    if (!piniaStores.find(s => s.name === m[1])) {
      piniaStores.push({ name: m[1], path: '' });
    }
  }

  // ─── Bus events ───
  const busEvents = [];
  for (const m of source.matchAll(/bus\.\$emit\(\s*['"](.+?)['"]/g)) {
    if (!busEvents.includes(m[1])) busEvents.push(m[1]);
  }

  // ─── Template analysis ───

  // Wrapper
  let wrapper = 'none';
  if (template.includes('<BoardWrapper')) wrapper = 'BoardWrapper';
  else if (template.includes('class="board-wrapper"') || template.includes("class='board-wrapper'")) wrapper = 'div.board-wrapper';

  // Breadcrumbs
  const breadcrumbs = [];
  // Options API: breadcrumbs() { return [{ ... text: '...' }] }
  const bcComputed = script.match(/breadcrumbs\s*\(\)\s*\{[\s\S]*?return\s*\[([\s\S]*?)\]/);
  // Composition API: const breadcrumbs = [{ ... }]
  const bcConst = script.match(/(?:const|let)\s+breadcrumbs\s*=\s*\[([\s\S]*?)\]/);
  const bcSource = bcComputed?.[1] || bcConst?.[1] || '';
  // Match both text: 'literal' and text: this.$t('key', 'Fallback')
  for (const m of bcSource.matchAll(/text:\s*(?:(?:this\.)?\$t\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]\s*\)|['"]([^'"]+)['"])/g)) {
    breadcrumbs.push(m[1] || m[2]);
  }

  // CTA (primary button inside #custom-action slot)
  let cta = null;
  const ctaSlot = template.match(/#custom-action[\s\S]*?<\/template>/);
  if (ctaSlot) {
    const btnMatch = ctaSlot[0].match(/<FTButton\s+([^>]*?)>([\s\S]*?)<\/FTButton>/);
    if (btnMatch) {
      const attrs = btnMatch[1];
      let text = btnMatch[2].trim();
      // Handle $t('key', 'Fallback') — extract the fallback
      const i18nMatch = text.match(/\$t\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);
      if (i18nMatch) text = i18nMatch[1];
      // Handle {{ expr }} wrappers
      text = text.replace(/\{\{.*?\}\}/g, '').trim();
      let variant = 'default';
      if (attrs.includes('primary')) variant = 'primary';
      else if (attrs.includes('alt')) variant = 'alt';
      else if (attrs.includes('danger')) variant = 'danger';
      cta = { text: text || null, variant };
    }
  }

  // Tabs
  const tabs = [];
  // Look for tabs data/computed that returns an array
  const tabsData = script.match(/tabs\s*(?:\(\)\s*\{[\s\S]*?return|[=:])\s*\[([\s\S]*?)\]/);
  if (tabsData) {
    for (const m of tabsData[1].matchAll(/(?:name|text):\s*['"](.+?)['"]/g)) {
      tabs.push(m[1]);
    }
  }
  // Also detect <Tabs or <FTTabs in template
  const hasTabs = template.includes('<Tabs ') || template.includes('<Tabs\n');
  const hasFTTabs = template.includes('<FTTabs');

  // Table detection
  const table = extractTable(template);

  // Panel detection
  const panels = [];
  // Inline Panel component
  if (template.includes('<Panel')) {
    const panelNameMatch = template.match(/<Panel[\s\S]*?id="(\w+)"/);
    panels.push({
      component: 'Panel',
      trigger: 'inline',
      id: panelNameMatch?.[1] || null,
    });
  }
  // Sliding panel
  if (template.includes('<FTSlidingPanel') || template.includes('<SlidingPanel')) {
    panels.push({ component: 'FTSlidingPanel', trigger: 'inline' });
  }
  // Bus-triggered panels (from bus events)
  for (const evt of busEvents) {
    if (evt.includes('Panel') || evt.includes('panel')) {
      panels.push({ component: evt, trigger: 'bus' });
    }
  }
  // Named panel components imported
  for (const imp of imports) {
    if (imp.name.includes('Panel') && imp.name !== 'Panel') {
      if (!panels.find(p => p.component === imp.name)) {
        panels.push({ component: imp.name, trigger: 'inline' });
      }
    }
  }

  return {
    apiStyle: isComposition ? 'composition' : 'options',
    lang: isTypeScript ? 'ts' : 'js',
    imports,
    vuex: { getters: vuexGetters, dispatches: vuexDispatches },
    pinia: { stores: piniaStores },
    bus: busEvents,
    wrapper,
    breadcrumbs,
    cta,
    tabs,
    hasTabs: hasTabs || hasFTTabs,
    tabComponent: hasFTTabs ? 'FTTabs' : hasTabs ? 'Tabs' : null,
    table,
    panels,
    // Raw signals for layout classifier
    _signals: {
      hasBoard: template.includes('<Board ') || template.includes('<Board\n'),
      boardCount: (template.match(/<Board[\s\n ]/g) || []).length,
      hasActivityGroup: template.includes('<ActivityGroup'),
      hasIntegrationCard: template.includes('<IntegrationCard') || template.includes('cta-card'),
      hasCardGrid: template.includes('<CardListItem') || template.includes('card-grid'),
      hasFormControls: (template.match(/<FTInput|<FTSelect|<FTToggle|<FTCheckbox|<FTRadio|<FTFloatingLabel|<FTDatePicker/g) || []).length,
      hasTable: !!table,
      hasTabs: hasTabs || hasFTTabs,
      hasPanelOverlay: panels.some(p => p.trigger === 'inline'),
      hasBusPanel: panels.some(p => p.trigger === 'bus'),
      hasToolbar: template.includes('buttons-bar') || template.includes('toolbar'),
      hasDashWidgets: template.includes('widget') || template.includes('metric') || template.includes('chart'),
      hasPlayerProfile: template.includes('PlayerInfo') || template.includes('PlayerTimeline'),
    },
  };
}

// ─── 4. Extract table structure ─────────────────────────────────────────────

function extractTable(template) {
  // FTTable component
  const ftTableMatch = template.match(/<FTTable[\s\S]*?(?:\/>|<\/FTTable>)/);
  if (ftTableMatch) {
    const columns = [];
    // Try to extract :heads prop inline
    const headsMatch = ftTableMatch[0].match(/:heads="([^"]+)"/);
    // Also look for heads defined as data (captured separately)
    return { type: 'FTTable', columns };
  }

  // Raw HTML table with class="table-list-view" or just <table>
  const tableMatch = template.match(/<table[\s\S]*?<\/table>/);
  if (tableMatch) {
    const columns = [];
    const thRe = /<th([^>]*)>([\s\S]*?)<\/th>/g;
    for (const m of tableMatch[0].matchAll(thRe)) {
      const attrs = m[1];
      const content = m[2].trim().replace(/<[^>]+>/g, '').trim();

      // Width hints from class
      let widthHint = null;
      const classMatch = attrs.match(/class="([^"]+)"/);
      if (classMatch) {
        const cls = classMatch[1];
        const thWidth = cls.match(/th-(\d+)/);
        const colWidth = cls.match(/(?:col-\w+)/);
        if (thWidth) widthHint = `${thWidth[1]}%`;
        else if (colWidth) widthHint = colWidth[0];
        else if (cls.includes('text-center')) widthHint = null; // no explicit width
      }
      // Width from inline style
      const styleWidth = attrs.match(/width:\s*(\d+)px/);
      if (styleWidth) widthHint = `${styleWidth[1]}px`;

      columns.push({
        label: content || '',
        widthHint,
        sortable: false, // Raw tables don't have built-in sort
      });
    }

    const isListView = tableMatch[0].includes('table-list-view');
    return {
      type: isListView ? 'raw-table-list-view' : 'raw-table',
      columns: columns.filter(c => c.label), // Drop empty header columns
    };
  }

  // ActivityGroup or other custom table-like component
  if (template.includes('<ActivityGroup')) {
    return { type: 'ActivityGroup', columns: [] };
  }

  return null;
}

// ─── 5. Layout classifier ───────────────────────────────────────────────────

function classifyLayout(scan) {
  const s = scan._signals;
  const signals = [];
  let type = 'UNKNOWN';
  let confidence = 0.3;

  // ─── Tables and ActivityGroup take priority over panels ───
  // A page with a table/list AND a panel is a list page with a side editor,
  // not a slide-in. The table defines the primary layout type.

  const hasList = s.hasTable || s.hasActivityGroup;

  // LIST-FULL: table/list + tabs + toolbar
  if (hasList && s.hasTabs && s.hasToolbar) {
    type = 'LIST-FULL';
    confidence = 0.9;
    signals.push(s.hasTable ? 'table' : 'ActivityGroup', 'tabs', 'toolbar');
  }

  // LIST-TAB: table/list + tabs (no toolbar)
  else if (hasList && s.hasTabs) {
    type = 'LIST-TAB';
    confidence = 0.85;
    signals.push(s.hasTable ? 'table' : 'ActivityGroup', 'tabs');
  }

  // LIST-SIMPLE: table/list, no tabs
  else if (hasList && !s.hasTabs) {
    type = 'LIST-SIMPLE';
    confidence = 0.85;
    signals.push(s.hasTable ? 'table' : 'ActivityGroup', 'no-tabs');
    if (s.hasPanelOverlay) signals.push('with-panel');
  }

  // DETAIL: player profile or split-panel detail view
  else if (s.hasPlayerProfile) {
    type = 'DETAIL';
    confidence = 0.9;
    signals.push('PlayerProfile');
  }

  // HUB: card-based navigation
  else if (s.hasIntegrationCard) {
    type = 'HUB';
    confidence = 0.9;
    signals.push('IntegrationCard');
  }

  // GRID: card grid layout
  else if (s.hasCardGrid) {
    type = 'GRID';
    confidence = 0.85;
    signals.push('CardListItem');
  }

  // DASH: multiple boards with mixed content, widgets, or dashboards
  else if (s.hasDashWidgets || (s.boardCount >= 3 && !hasList)) {
    type = 'DASH';
    confidence = 0.7;
    signals.push(`${s.boardCount}-boards`);
    if (s.hasDashWidgets) signals.push('widgets');
  }

  // SLIDEIN: has panel overlay but no table/list — primary purpose IS the panel
  else if (s.hasPanelOverlay && !hasList && !s.hasTabs) {
    type = 'SLIDEIN';
    confidence = 0.7;
    signals.push('inline-panel', 'no-table');
    if (s.hasBusPanel) { confidence = 0.85; signals.push('bus-panel'); }
  }

  // FORM: form-heavy, no table
  else if (s.hasFormControls >= 3 && !hasList) {
    type = 'FORM';
    confidence = 0.75;
    signals.push(`${s.hasFormControls}-form-controls`);
  }

  // FORM with fewer controls but Board-based layout
  else if (s.hasFormControls >= 1 && s.boardCount >= 1 && !hasList) {
    type = 'FORM';
    confidence = 0.6;
    signals.push('form-controls', 'board-layout');
  }

  // Fallback: tabs but no table — tabbed form/detail
  else if (s.hasTabs && !hasList) {
    type = 'FORM';
    confidence = 0.5;
    signals.push('tabs-no-table');
  }

  // Add wrapper signal
  if (scan.wrapper !== 'none') signals.push(scan.wrapper);

  return { type, confidence: Math.round(confidence * 100) / 100, signals };
}

// ─── 6. Cross-reference with scan-manifest.json ─────────────────────────────

function loadScanManifest() {
  if (!existsSync(SCAN_MANIFEST)) return { pages: new Map(), raw: null };
  const manifest = JSON.parse(readFileSync(SCAN_MANIFEST, 'utf8'));
  const pages = new Map(); // normalized path → { label, section, subsection, folder }

  for (const section of manifest.sections) {
    for (const sub of section.subsections) {
      for (const page of sub.pages) {
        const key = normalizePath(page.path);
        pages.set(key, {
          label: page.label,
          section: section.name,
          subsection: sub.name,
          folder: page.folder,
        });
      }
    }
  }
  return { pages, raw: manifest };
}

// ─── 7. Check for existing briefs and prototypes ────────────────────────────

// Cache brief files once
let _briefFiles = null;
function getBriefFiles() {
  if (_briefFiles) return _briefFiles;
  if (!existsSync(BRIEFS_DIR)) return (_briefFiles = []);
  _briefFiles = readdirSync(BRIEFS_DIR)
    .filter(f => f.endsWith('.md') && f !== '_TEMPLATE.md')
    .map(f => ({ file: f, name: f.replace('.md', '') }));
  return _briefFiles;
}

function findBrief(pageId, pageName) {
  const briefs = getBriefFiles();
  // Exact match
  const exact = briefs.find(b => b.name === pageId);
  if (exact) return `skills/prototype-generator/briefs/${exact.file}`;

  // Partial match: brief name contained in pageId or vice versa
  const partial = briefs.find(b =>
    pageId.includes(b.name) || b.name.includes(pageId)
  );
  if (partial) return `skills/prototype-generator/briefs/${partial.file}`;

  // Name-based match: compare against human-readable name
  if (pageName) {
    const nameSlug = slugify(pageName);
    const nameMatch = briefs.find(b =>
      nameSlug.includes(b.name) || b.name.includes(nameSlug)
    );
    if (nameMatch) return `skills/prototype-generator/briefs/${nameMatch.file}`;
  }

  return null;
}

function findPrototype(pageName) {
  if (!existsSync(PROTOTYPES_DIR)) return null;
  const files = readdirSync(PROTOTYPES_DIR);
  // Try exact match
  const exact = files.find(f => f === `${pageName}.vue`);
  if (exact) return `src/components/pages/Prototypes/${exact}`;
  // Try partial match
  const partial = files.find(f => {
    const n = f.replace('.vue', '');
    return n.toLowerCase() === pageName.toLowerCase() ||
      slugify(n) === slugify(pageName);
  });
  if (partial) return `src/components/pages/Prototypes/${partial}`;
  return null;
}

// ─── 8. Complexity scoring ──────────────────────────────────────────────────

function scoreComplexity(scan) {
  let score = 0;
  score += scan.imports.length; // Each import adds complexity
  score += scan.vuex.getters.length;
  score += scan.vuex.dispatches.length * 2; // Dispatches are load-bearing
  score += scan.pinia.stores.length * 2;
  score += scan.bus.length * 3; // Bus events need careful matching
  score += scan.panels.length * 2;
  if (scan.hasTabs) score += 3;
  if (scan.table?.type === 'ActivityGroup') score += 5;

  if (score <= 8) return 'low';
  if (score <= 20) return 'medium';
  return 'high';
}

// ─── 9. Build manifest ──────────────────────────────────────────────────────

function buildManifest() {
  console.log('Scanning backoffice-v2 source...');

  // Collect all Vue page files
  const vueFiles = collectVueFiles(PAGES_DIR);
  console.log(`  Found ${vueFiles.length} Vue page files`);

  // Parse router
  const { routes } = parseRouter();
  console.log(`  Parsed ${routes.size} routes from router`);

  // Load scan manifest for section assignment
  const scanManifest = loadScanManifest();
  console.log(`  Loaded ${scanManifest.pages.size} pages from scan-manifest.json`);

  // Get git commit
  let sourceCommit = '';
  try {
    sourceCommit = execSync('git -C ' + BACKOFFICE + ' rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch { /* ignore */ }

  const pages = [];

  for (const filePath of vueFiles) {
    const fileName = basename(filePath, '.vue');

    // Skip non-page components (sub-components, layouts, etc.)
    if (['Layout', 'ChildLayout'].includes(fileName)) continue;

    // Apply filter
    if (filter && !filePath.toLowerCase().includes(filter) && !fileName.toLowerCase().includes(filter)) continue;

    log(`Scanning ${filePath}...`);

    let scan;
    try {
      scan = scanVueFile(filePath);
    } catch (err) {
      console.warn(`  WARN: Failed to scan ${filePath}: ${err.message}`);
      continue;
    }

    // Get route info
    const route = routes.get(filePath);

    // Get scan-manifest section (try exact path first, then stripped params)
    let manifestPage = route ? scanManifest.pages.get(normalizePath(route.routePath)) : null;
    if (!manifestPage && route?.routePath) {
      manifestPage = scanManifest.pages.get(stripRouteParams(route.routePath));
    }

    // Derive page ID and name
    const pageId = slugify(fileName);
    const pageName = manifestPage?.label || fileName.replace(/([A-Z])/g, ' $1').trim();

    // Layout classification
    const layout = classifyLayout(scan);

    // Find brief and prototype
    const briefFile = findBrief(pageId, pageName);
    const protoFile = findPrototype(fileName);

    // Determine prototype strategy
    let strategy = 'clone'; // Default: production page exists, clone it
    if (protoFile) strategy = 'exists';
    // Skip utility pages
    if (['Login', 'ErrorPage', 'PageNotFound', 'NoPermission'].includes(fileName)) strategy = 'skip';

    const complexity = scoreComplexity(scan);

    const entry = {
      id: pageId,
      name: pageName,
      source: {
        filePath,
        routePath: route?.routePath || null,
        routeName: route?.routeName || null,
        permission: route?.permission || null,
        apiStyle: scan.apiStyle,
        lang: scan.lang,
      },
      section: manifestPage?.section || null,
      subsection: manifestPage?.subsection || null,
      layout,
      shell: {
        wrapper: scan.wrapper,
        breadcrumbs: scan.breadcrumbs.map(text => ({ text })),
        cta: scan.cta,
      },
      components: {
        imports: scan.imports.map(i => ({ name: i.name, path: i.path })),
      },
      state: {
        vuex: {
          getters: [...new Set(scan.vuex.getters)],
          dispatches: [...new Set(scan.vuex.dispatches)],
        },
        pinia: {
          stores: scan.pinia.stores,
        },
        bus: scan.bus,
      },
      table: scan.table,
      tabs: scan.tabs.length > 0 ? scan.tabs : null,
      tabComponent: scan.tabComponent,
      panels: scan.panels.length > 0 ? scan.panels : null,
      codedPrototype: {
        strategy,
        prototypeFile: protoFile,
        complexity,
      },
      figmaPrototype: {
        briefFile,
        status: briefFile ? 'has-brief' : 'not-started',
      },
      overrides: {},
    };

    pages.push(entry);
    log(`  → ${layout.type} (${layout.confidence}) [${complexity}] ${route?.routePath || 'no route'}`);
  }

  // Sort pages: routed pages first (by section), then unrouted
  pages.sort((a, b) => {
    const aHasRoute = a.source.routePath ? 0 : 1;
    const bHasRoute = b.source.routePath ? 0 : 1;
    if (aHasRoute !== bHasRoute) return aHasRoute - bHasRoute;
    if (a.section !== b.section) return (a.section || 'zzz').localeCompare(b.section || 'zzz');
    return a.name.localeCompare(b.name);
  });

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    sourceCommit,
    backofficeRoot: relative(ROOT, BACKOFFICE),
    totalPages: pages.length,
    pages,
  };
}

// ─── 10. Statistics ─────────────────────────────────────────────────────────

function printStats(manifest) {
  const pages = manifest.pages;

  // Layout type distribution
  const layoutCounts = {};
  const confidenceBuckets = { high: 0, medium: 0, low: 0 };
  const complexityCounts = { low: 0, medium: 0, high: 0 };
  const strategyCounts = { clone: 0, build: 0, exists: 0, skip: 0 };
  let withRoute = 0;
  let withSection = 0;
  let withBrief = 0;
  let withPrototype = 0;

  for (const p of pages) {
    layoutCounts[p.layout.type] = (layoutCounts[p.layout.type] || 0) + 1;
    if (p.layout.confidence >= 0.8) confidenceBuckets.high++;
    else if (p.layout.confidence >= 0.5) confidenceBuckets.medium++;
    else confidenceBuckets.low++;
    complexityCounts[p.codedPrototype.complexity]++;
    strategyCounts[p.codedPrototype.strategy]++;
    if (p.source.routePath) withRoute++;
    if (p.section) withSection++;
    if (p.figmaPrototype.briefFile) withBrief++;
    if (p.codedPrototype.prototypeFile) withPrototype++;
  }

  console.log('\n─── Page Manifest Statistics ───\n');
  console.log(`Total pages scanned: ${pages.length}`);
  console.log(`With route:          ${withRoute}`);
  console.log(`With section:        ${withSection} (from scan-manifest.json)`);
  console.log(`With brief:          ${withBrief}`);
  console.log(`With prototype:      ${withPrototype}`);

  console.log('\nLayout types:');
  for (const [type, count] of Object.entries(layoutCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type.padEnd(15)} ${count}`);
  }

  console.log('\nConfidence distribution:');
  console.log(`  High (≥0.8):   ${confidenceBuckets.high}`);
  console.log(`  Medium (≥0.5): ${confidenceBuckets.medium}`);
  console.log(`  Low (<0.5):    ${confidenceBuckets.low}`);

  console.log('\nComplexity:');
  for (const [level, count] of Object.entries(complexityCounts)) {
    console.log(`  ${level.padEnd(8)} ${count}`);
  }

  console.log('\nPrototype strategy:');
  for (const [strat, count] of Object.entries(strategyCounts)) {
    console.log(`  ${strat.padEnd(8)} ${count}`);
  }

  // API style distribution
  const apiStyles = {};
  for (const p of pages) {
    const key = `${p.source.apiStyle}/${p.source.lang}`;
    apiStyles[key] = (apiStyles[key] || 0) + 1;
  }
  console.log('\nAPI style:');
  for (const [style, count] of Object.entries(apiStyles).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${style.padEnd(18)} ${count}`);
  }
}

// ─── 11. Diff against previous manifest ─────────────────────────────────────

function showDiffReport(manifest) {
  if (!existsSync(OUTPUT)) {
    console.log('\nNo previous manifest found — this is the first run.');
    return;
  }
  const prev = JSON.parse(readFileSync(OUTPUT, 'utf8'));
  const prevIds = new Set(prev.pages.map(p => p.id));
  const newIds = new Set(manifest.pages.map(p => p.id));

  const added = manifest.pages.filter(p => !prevIds.has(p.id));
  const removed = prev.pages.filter(p => !newIds.has(p.id));

  // Check for layout type changes
  const prevMap = new Map(prev.pages.map(p => [p.id, p]));
  const changed = manifest.pages.filter(p => {
    const old = prevMap.get(p.id);
    return old && old.layout.type !== p.layout.type;
  });

  console.log('\n─── Diff Report ───');
  if (added.length) {
    console.log(`\nAdded (${added.length}):`);
    for (const p of added) console.log(`  + ${p.id} (${p.layout.type})`);
  }
  if (removed.length) {
    console.log(`\nRemoved (${removed.length}):`);
    for (const p of removed) console.log(`  - ${p.id} (${p.layout.type})`);
  }
  if (changed.length) {
    console.log(`\nLayout type changed (${changed.length}):`);
    for (const p of changed) {
      const old = prevMap.get(p.id);
      console.log(`  ~ ${p.id}: ${old.layout.type} → ${p.layout.type}`);
    }
  }
  if (!added.length && !removed.length && !changed.length) {
    console.log('\n  No changes detected.');
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  // Validate backoffice-v2 exists
  if (!existsSync(PAGES_DIR)) {
    console.error(`Error: backoffice-v2 not found at ${BACKOFFICE}`);
    console.error('Expected pages directory: ' + PAGES_DIR);
    process.exit(1);
  }

  const manifest = buildManifest();

  // Print stats
  printStats(manifest);

  // Show diff if requested
  if (showDiff) showDiffReport(manifest);

  // Write output (unless stats-only or filter mode)
  if (!statsOnly && !filter) {
    writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`\nManifest written to ${relative(process.cwd(), OUTPUT)}`);
    console.log(`  ${manifest.totalPages} pages, ${(JSON.stringify(manifest).length / 1024).toFixed(0)}KB`);
  } else if (filter) {
    // In filter mode, print the matching entries
    console.log('\n─── Filtered Results ───\n');
    console.log(JSON.stringify(manifest.pages, null, 2));
  }
}

main();
