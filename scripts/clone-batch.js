#!/usr/bin/env node
// clone-batch.js — Automated prototype generation pipeline
//
// Transforms production Vue pages into prototypes by applying deterministic
// regex rules: strip i18n, permissions, InfoLink, API writes. Keep Vuex,
// components, CSS. Add ProtoFab. Wire routes + index.
//
// Usage:
//   node scripts/clone-batch.js                        Dry run — show transform plan
//   node scripts/clone-batch.js --execute              Transform all eligible pages
//   node scripts/clone-batch.js --execute --wave 1     Low complexity only (43 pages)
//   node scripts/clone-batch.js --execute --wave 2     Medium complexity (38 pages)
//   node scripts/clone-batch.js --execute --wave 3     High complexity (24 pages)
//   node scripts/clone-batch.js --execute --id <slug>  Single page (for testing)
//   node scripts/clone-batch.js --report               Generate review report

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BACKOFFICE = join(ROOT, '..', 'backoffice-v2');
const PAGES_DIR = join(BACKOFFICE, 'src', 'components', 'pages');
const PROTO_DIR = join(PAGES_DIR, 'Prototypes');
const ROUTER_FILE = join(BACKOFFICE, 'src', 'router', 'index.js');
const INDEX_FILE = join(PROTO_DIR, 'PrototypeIndex.vue');
const MANIFEST = join(ROOT, 'references', 'page-manifest.json');

// ─── CLI ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const execute = args.includes('--execute');
const report = args.includes('--report');
const waveIdx = args.indexOf('--wave');
const wave = waveIdx !== -1 ? parseInt(args[waveIdx + 1]) : null;
const idIdx = args.indexOf('--id');
const singleId = idIdx !== -1 ? args[idIdx + 1] : null;

// ─── Utilities ──────────────────────────────────────────────────────────────

function slugify(s) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function pascalCase(s) {
  return s.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase());
}

// ─── Transform Rules ────────────────────────────────────────────────────────

function transformVue(source, pageName, manifest) {
  const flags = [];
  let template = '';
  let script = '';
  let style = '';

  // Split SFC sections
  const tmplOpen = source.indexOf('<template>');
  const tmplClose = source.lastIndexOf('</template>');
  if (tmplOpen !== -1 && tmplClose > tmplOpen) {
    template = source.slice(tmplOpen, tmplClose + '</template>'.length);
  }

  // Script: capture tag + content + close
  const scriptTagMatch = source.match(/<script([^>]*)>/);
  const scriptOpen = source.indexOf(scriptTagMatch?.[0] || '<script>');
  const scriptClose = source.lastIndexOf('</script>');
  if (scriptOpen !== -1 && scriptClose > scriptOpen) {
    script = source.slice(scriptOpen, scriptClose + '</script>'.length);
  }

  // Style: everything from <style to end
  const styleMatch = source.match(/<style[\s\S]*$/);
  if (styleMatch) style = styleMatch[0];

  // ─── TEMPLATE TRANSFORMS ───

  // 1. Remove <InfoLink .../> elements (self-closing and regular)
  template = template.replace(/<InfoLink[\s\S]*?\/>/g, '');
  template = template.replace(/<InfoLink[\s\S]*?<\/InfoLink>/g, '');

  // 2. Remove v-if="hasPermission(...)" — keep the element
  template = template.replace(/\s+v-if="hasPermission\([^"]*\)"/g, '');

  // 3. Simplify v-if with hasPermission AND other conditions
  // e.g. v-if="currentTab !== 'projects' && hasPermission('...')" → v-if="currentTab !== 'projects'"
  template = template.replace(
    /v-if="([^"]*?)\s*&&\s*hasPermission\([^)]*\)"/g,
    'v-if="$1"'
  );
  template = template.replace(
    /v-if="hasPermission\([^)]*\)\s*&&\s*([^"]*)"/g,
    'v-if="$1"'
  );

  // 4. Replace :attr="$t('key', 'fallback')" → attr="fallback"
  // Handles: :title, :subTitle, :subtitle, :placeholder, :tooltip, :message, :description, :label
  template = template.replace(
    /:(\w+)="\$t\(\s*'[^']+'\s*,\s*'([^']+)'\s*\)"/g,
    '$1="$2"'
  );
  // Double-quoted fallback
  template = template.replace(
    /:(\w+)="\$t\(\s*'[^']+'\s*,\s*\"([^\"]+)\"\s*\)"/g,
    '$1="$2"'
  );

  // 5. Replace multiline :attr="$t(...)" (e.g. :subTitle with line breaks)
  // Handles multiline $t() spanning multiple lines inside attributes
  template = template.replace(
    /:(\w+)="\s*\$t\(\s*'[^']+'\s*,\s*'([^']+)'[\s\S]*?\)\s*"/g,
    '$1="$2"'
  );

  // 6. Replace {{ $t('key', 'fallback') }} → fallback
  template = template.replace(
    /\{\{\s*\$t\(\s*'[^']+'\s*,\s*'([^']+)'[^)]*\)\s*\}\}/g,
    '$1'
  );

  // 7. Replace $t() inside ternary expressions: condition ? $t('k','v') : $t('k2','v2')
  // These appear in :tooltip, :data-balloon etc.
  template = template.replace(
    /\$t\(\s*'[^']+'\s*,\s*'([^']+)'\s*\)/g,
    "'$1'"
  );

  // 7. Add <ProtoFab /> before closing wrapper
  if (template.includes('</BoardWrapper>')) {
    template = template.replace('</BoardWrapper>', '    <ProtoFab />\n  </BoardWrapper>');
  } else {
    // Find the last </div> before </template> — that's the wrapper close
    const lastDivIdx = template.lastIndexOf('</div>', template.lastIndexOf('</template>'));
    if (lastDivIdx !== -1) {
      template = template.slice(0, lastDivIdx) + '    <ProtoFab />\n  ' + template.slice(lastDivIdx);
    }
  }

  // 8. Clean up empty lines from removals (max 2 consecutive blank lines)
  template = template.replace(/\n{4,}/g, '\n\n');

  // ─── SCRIPT TRANSFORMS ───

  // 0. Fix relative imports — ./Sibling.vue must become @/components/pages/{OriginalDir}/Sibling.vue
  // because the prototype lives in Prototypes/ not the original directory
  const sourceDir = manifest.source?.filePath?.replace(/\/[^/]+$/, '') || '';
  if (sourceDir.includes('/')) {
    script = script.replace(
      /from\s+['"]\.\/([^'"]+)['"]/g,
      (match, file) => {
        if (file === 'ProtoFab.vue') return match; // Keep ProtoFab relative
        return `from '@/${sourceDir}/${file}'`;
      }
    );
  }

  // 1. Remove import InfoLink
  script = script.replace(/import\s+InfoLink\s+from\s+['"][^'"]+['"];?\n?/g, '');

  // 2. Remove import { setCookie, getCookie }
  script = script.replace(/import\s*\{[^}]*setCookie[^}]*\}\s*from\s*['"][^'"]+['"];?\n?/g, '');

  // 3. Remove WRITE-only API imports — keep read APIs (load, get, fetch, find, validate)
  // Write verbs: create, update, delete, send, save, remove, disable, enable, add, edit, set, install, establish
  const apiImportRe = /import\s+(?:(\w+)|\{([^}]+)\})\s+from\s+['"](@\/api\/[^'"]+)['"];?\n?/g;
  for (const m of [...script.matchAll(apiImportRe)]) {
    const fullMatch = m[0];
    const defaultName = m[1];
    const destructured = m[2];
    const readVerbs = /^(load|get|fetch|find|validate|check|search|list|query|retrieve)/i;
    const writeVerbs = /^(create|update|delete|send|save|remove|disable|enable|add|edit|set|install|establish|bulk|import|export|assign|revoke|cancel|reject|approve|dismiss|mark|toggle|reset|sync|push|post|put|patch)/i;

    if (defaultName) {
      // Default import: import sendData from '@/api/...' — strip if write verb
      if (writeVerbs.test(defaultName)) {
        script = script.replace(fullMatch, '');
      }
      // else keep it (might be a read like getAllChats)
    } else if (destructured) {
      // Destructured: split into individual names, keep reads, strip writes
      const names = destructured.split(',').map(n => n.trim()).filter(Boolean);
      const keep = names.filter(n => !writeVerbs.test(n));
      const strip = names.filter(n => writeVerbs.test(n));

      if (keep.length === 0) {
        // All write — remove entire import
        script = script.replace(fullMatch, '');
      } else if (strip.length > 0) {
        // Mixed — rebuild import with only the kept names
        const newImport = `import { ${keep.join(', ')} } from '${m[3]}';\n`;
        script = script.replace(fullMatch, newImport);
      }
      // else all reads — keep as-is
    }
  }

  // 4. Remove import { permissionCodes }
  script = script.replace(/import\s*\{\s*permissionCodes\s*\}\s*from\s*['"][^'"]+['"];?\n?/g, '');

  // 5. Remove import { authenticationAPI }
  script = script.replace(/import\s*\{\s*authenticationAPI\s*\}\s*from\s*['"][^'"]+['"];?\n?/g, '');

  // 6. Remove import { useFlag } or similar feature flag imports
  script = script.replace(/import\s*\{[^}]*useFlag[^}]*\}\s*from\s*['"][^'"]+['"];?\n?/g, '');

  // 7. Remove import { useProductTracking }
  script = script.replace(/import\s*\{[^}]*useProductTracking[^}]*\}\s*from\s*['"][^'"]+['"];?\n?/g, '');

  // 8. Add ProtoFab import (after last existing import)
  const lastImportIdx = script.lastIndexOf('\nimport ');
  if (lastImportIdx !== -1) {
    const lineEnd = script.indexOf('\n', lastImportIdx + 1);
    script = script.slice(0, lineEnd + 1) +
      "import ProtoFab from './ProtoFab.vue';\n" +
      script.slice(lineEnd + 1);
  }

  // 9. Add ProtoFab to components registration
  // Options API: components: { ... }
  const compBlockMatch = script.match(/components:\s*\{([^}]*)\}/);
  if (compBlockMatch) {
    const existing = compBlockMatch[1].trim();
    if (!existing.includes('ProtoFab')) {
      const updated = existing.endsWith(',')
        ? existing + '\n    ProtoFab,'
        : existing + ',\n    ProtoFab,';
      script = script.replace(compBlockMatch[0], `components: {${updated}\n  }`);
    }
  }

  // 10. Replace this.$t('key', 'fallback') → 'fallback' in script
  script = script.replace(
    /this\.\$t\(\s*'[^']+'\s*,\s*'([^']+)'\s*\)/g,
    "'$1'"
  );
  // Without this. (Composition API)
  script = script.replace(
    /(?<!this\.)\$t\(\s*'[^']+'\s*,\s*'([^']+)'\s*\)/g,
    "'$1'"
  );

  // 11. Remove InfoLink from components registration
  script = script.replace(/\s*InfoLink,?\n?/g, (match) => {
    // Only remove from components block, not from other objects
    return '';
  });

  // 12. Change component name to Prototype prefix
  script = script.replace(
    /name:\s*['"](\w+)['"]/,
    `name: 'Prototype${pageName}'`
  );

  // 13. Remove setCookie/getCookie calls (standalone statements)
  script = script.replace(/\s*setCookie\([^)]*\);?\n?/g, '\n');

  // 14. Add permission stubs if permissionCodes was imported or hasPermission is used in script
  // permissionCodes is a deeply nested object — stub it with a Proxy that returns 'true' for any path
  // hasPermission is a global mixin method — override in methods to always return true
  if (script.includes('permissionCodes') || script.includes('hasPermission')) {
    // For Options API: add to data/computed
    if (script.includes('export default')) {
      // Add permissionCodes stub after export default {
      if (script.includes('permissionCodes')) {
        const exportMatch = script.match(/export\s+default\s*\{/);
        if (exportMatch) {
          const pos = script.indexOf(exportMatch[0]) + exportMatch[0].length;
          const stub = `\n  // Permission stub — all permissions granted in prototypes\n  setup() {\n    const handler = { get: (_, p) => typeof p === 'string' ? new Proxy({}, handler) : 'granted' };\n    const permissionCodes = new Proxy({}, handler);\n    return { permissionCodes };\n  },`;
          script = script.slice(0, pos) + stub + script.slice(pos);
        }
      }
    }
    // For Composition API (<script setup>): add permissionCodes const
    if (script.includes('<script setup')) {
      const setupTag = script.match(/<script[^>]*setup[^>]*>/);
      if (setupTag && script.includes('permissionCodes')) {
        const pos = script.indexOf(setupTag[0]) + setupTag[0].length;
        const stub = `\n// Permission stub — all permissions granted in prototypes\nconst _ph = { get: (_, p) => typeof p === 'string' ? new Proxy({}, _ph) : 'granted' };\nconst permissionCodes = new Proxy({}, _ph);\n`;
        script = script.slice(0, pos) + stub + script.slice(pos);
      }
    }
  }

  // 15. Clean up empty lines
  script = script.replace(/\n{3,}/g, '\n\n');

  // ─── FLAG DETECTION ───

  // Check for patterns that might need manual review
  if (script.includes('from \'@/api/')) flags.push('has-remaining-api-import');
  if (script.includes('authenticationAPI')) flags.push('has-auth-api');
  if (script.includes('$t(')) flags.push('has-remaining-i18n');
  if (template.includes('$t(')) flags.push('has-remaining-template-i18n');
  if (script.includes('<script setup') && script.includes('<script>')) flags.push('multiple-script-blocks');

  return {
    output: template + '\n\n' + script + '\n\n' + style,
    flags,
  };
}

// ─── Wiring Helpers ─────────────────────────────────────────────────────────

function wireRoute(routerSource, pageName, kebabName) {
  const importLine = `import Prototype${pageName} from '@/components/pages/Prototypes/${pageName}.vue';`;
  const routeBlock = `      {
        path: \`\${PUBLIC_PATH}prototype/${kebabName}\`,
        name: 'Prototype${pageName}',
        component: Prototype${pageName},
      },`;

  // Add import before the router export
  let result = routerSource;
  const exportIdx = result.indexOf('export default');
  if (exportIdx !== -1 && !result.includes(importLine)) {
    result = result.slice(0, exportIdx) + importLine + '\n' + result.slice(exportIdx);
  }

  // Add route before the closing ], of the Layout children array
  // Find the FIRST ], after the prototype marker — that's the section close
  const protoMarker = '// ─── Prototype routes';
  const markerIdx = result.indexOf(protoMarker);
  if (markerIdx !== -1 && !result.includes(`prototype/${kebabName}`)) {
    const afterMarker = result.slice(markerIdx);
    const closingBracket = afterMarker.indexOf('],');
    if (closingBracket !== -1) {
      const insertPos = markerIdx + closingBracket;
      result = result.slice(0, insertPos) + routeBlock + '\n      ' + result.slice(insertPos);
    }
  }

  return result;
}

function wireIndex(indexSource, pageName, kebabName, manifest) {
  const layoutType = manifest.layout?.type || 'UNKNOWN';
  const signals = manifest.layout?.signals?.join(', ') || '';
  const description = `${layoutType} — ${signals}`;
  const today = new Date().toISOString().split('T')[0];

  const entry = `  {
    name: '${pageName.replace(/([A-Z])/g, ' $1').trim()}',
    layout: '${layoutType}',
    description: '${description.replace(/'/g, "\\'")}',
    status: 'Ready',
    lastEdit: '${today}',
    route: '/prototype/${kebabName}',
  },`;

  // Insert before the Smoke Test entry (last entry)
  if (indexSource.includes(`/prototype/${kebabName}`)) return indexSource;

  const smokeIdx = indexSource.indexOf("name: 'Smoke Test'");
  if (smokeIdx !== -1) {
    // Find the { before Smoke Test
    const blockStart = indexSource.lastIndexOf('{', smokeIdx);
    return indexSource.slice(0, blockStart) + entry + '\n  ' + indexSource.slice(blockStart);
  }

  return indexSource;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  if (!existsSync(MANIFEST)) {
    console.error('Error: page-manifest.json not found. Run npm run scan:source first.');
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));

  // Filter eligible pages
  let eligible = manifest.pages.filter(p =>
    p.source.routePath &&
    p.codedPrototype.strategy === 'clone' &&
    !p.codedPrototype.prototypeFile
  );

  // Apply wave filter
  const waveMap = { 1: 'low', 2: 'medium', 3: 'high' };
  if (wave) {
    const complexity = waveMap[wave];
    eligible = eligible.filter(p => p.codedPrototype.complexity === complexity);
    console.log(`Wave ${wave} (${complexity}): ${eligible.length} pages`);
  }

  // Apply single ID filter
  if (singleId) {
    eligible = eligible.filter(p => p.id === singleId || p.id.includes(singleId));
    if (eligible.length === 0) {
      console.error(`No eligible page found matching "${singleId}"`);
      process.exit(1);
    }
  }

  // Skip pages that already have prototype files in the Prototypes dir
  eligible = eligible.filter(p => {
    const name = pascalCase(p.id);
    const protoPath = join(PROTO_DIR, `${name}.vue`);
    if (existsSync(protoPath)) {
      console.log(`  SKIP ${p.id} — prototype already exists`);
      return false;
    }
    return true;
  });

  console.log(`\n${eligible.length} pages to process\n`);

  if (report) {
    generateReport(manifest);
    return;
  }

  let routerSource = readFileSync(ROUTER_FILE, 'utf8');
  let indexSource = readFileSync(INDEX_FILE, 'utf8');
  const results = [];

  for (const page of eligible) {
    const sourceFile = join(BACKOFFICE, page.source.filePath);
    if (!existsSync(sourceFile)) {
      console.log(`  SKIP ${page.id} — source file not found: ${page.source.filePath}`);
      continue;
    }

    const source = readFileSync(sourceFile, 'utf8');
    const pageName = pascalCase(page.id);
    const kebabName = slugify(page.id);

    console.log(`  ${execute ? 'TRANSFORM' : 'DRY-RUN'} ${page.id} (${page.layout.type}, ${page.codedPrototype.complexity})`);

    const { output, flags } = transformVue(source, pageName, page);

    if (flags.length) {
      console.log(`    ⚠ FLAGS: ${flags.join(', ')}`);
    }

    results.push({
      id: page.id,
      name: pageName,
      kebab: kebabName,
      layout: page.layout.type,
      complexity: page.codedPrototype.complexity,
      section: page.section,
      flags,
      sourceLines: source.split('\n').length,
      outputLines: output.split('\n').length,
    });

    if (execute) {
      // Write prototype file
      const protoPath = join(PROTO_DIR, `${pageName}.vue`);
      writeFileSync(protoPath, output);

      // Wire route
      routerSource = wireRoute(routerSource, pageName, kebabName);

      // Wire index
      indexSource = wireIndex(indexSource, pageName, kebabName, page);
    }
  }

  if (execute && results.length > 0) {
    writeFileSync(ROUTER_FILE, routerSource);
    writeFileSync(INDEX_FILE, indexSource);
    console.log(`\nWrote ${results.length} prototype files`);
    console.log(`Updated router: ${relative(process.cwd(), ROUTER_FILE)}`);
    console.log(`Updated index: ${relative(process.cwd(), INDEX_FILE)}`);
  }

  // Summary
  const flagged = results.filter(r => r.flags.length > 0);
  const clean = results.filter(r => r.flags.length === 0);
  console.log(`\n─── Summary ───`);
  console.log(`Total: ${results.length}`);
  console.log(`Clean: ${clean.length}`);
  console.log(`Flagged: ${flagged.length}`);
  if (flagged.length) {
    console.log('\nFlagged pages:');
    for (const r of flagged) {
      console.log(`  ⚠ ${r.id}: ${r.flags.join(', ')}`);
    }
  }

  if (!execute) {
    console.log('\nDry run complete. Use --execute to write files.');
  }
}

// ─── Report Generator ───────────────────────────────────────────────────────

function generateReport(manifest) {
  const prototyped = manifest.pages.filter(p => p.codedPrototype.prototypeFile);
  const today = new Date().toISOString().split('T')[0];
  const cfBase = 'https://feature-dev-0000-ftdna-proto.backoffice-v2.pages.dev';

  let md = `# Prototype Review Report\n`;
  md += `> Generated: ${today}\n\n`;
  md += `| # | Page | Layout | Complexity | Section | CF Pages |\n`;
  md += `|---|------|--------|------------|---------|----------|\n`;

  let i = 1;
  for (const p of prototyped) {
    const kebab = slugify(p.id);
    const link = `[Open](${cfBase}/prototype/${kebab})`;
    md += `| ${i++} | ${p.name} | ${p.layout.type} | ${p.codedPrototype.complexity} | ${p.section || '—'} | ${link} |\n`;
  }

  const reportPath = join(ROOT, 'references', 'prototype-review.md');
  writeFileSync(reportPath, md);
  console.log(`Report written to ${relative(process.cwd(), reportPath)}`);
}

main();
