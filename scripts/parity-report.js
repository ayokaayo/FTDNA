#!/usr/bin/env node

/**
 * Component Parity Report
 *
 * Reads all meta.json files from vue-components-lib and produces a
 * coverage/drift report comparing Figma variants against Vue props.
 *
 * Usage:
 *   node scripts/parity-report.js                   # Full report (console + JSON)
 *   node scripts/parity-report.js --component FTButton  # Single component
 *   node scripts/parity-report.js --json             # JSON output only
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const VUE_LIB_PATH = resolve(import.meta.dirname, '../../vue-components-lib/src/components');
const REPORT_PATH = resolve(import.meta.dirname, '../inventory/parity-report.json');

// --- CLI args ---
const args = process.argv.slice(2);
const jsonOnly = args.includes('--json');
const componentFilter = args.includes('--component')
  ? args[args.indexOf('--component') + 1]
  : null;

// --- Load all meta.json ---
function loadAllMeta() {
  const components = [];
  let dirs;
  try {
    dirs = readdirSync(VUE_LIB_PATH);
  } catch {
    console.error(`Cannot read vue-components-lib at ${VUE_LIB_PATH}`);
    process.exit(1);
  }

  for (const dir of dirs) {
    const dirPath = join(VUE_LIB_PATH, dir);
    if (!statSync(dirPath).isDirectory()) continue;

    const metaPath = join(dirPath, 'meta.json');
    try {
      const raw = readFileSync(metaPath, 'utf8');
      const meta = JSON.parse(raw);
      components.push(meta);
    } catch {
      // No meta.json or invalid — skip
    }
  }
  return components;
}

// --- Analyze a single component ---
function analyzeComponent(meta) {
  const name = meta.name;
  const figma = meta.figma;
  const propMap = meta.propMap || [];
  const unmapped = meta.unmapped || { figmaOnly: [], vueOnly: [] };

  // No Figma mapping — code-only component
  if (!figma) {
    return {
      name,
      type: 'code-only',
      figmaAxes: 0,
      figmaBooleans: 0,
      mappedCount: 0,
      figmaOnlyCount: 0,
      vueOnlyCount: 0,
      coverage: null,
      figmaOnly: [],
      vueOnly: [],
      populated: false,
    };
  }

  const variants = figma.variants || {};
  const booleanProps = figma.booleanProps || {};
  const axisCount = Object.keys(variants).length;
  const boolCount = Object.keys(booleanProps).length;
  const totalFigmaProps = axisCount + boolCount;
  const mappedCount = propMap.length;
  const figmaOnlyList = unmapped.figmaOnly || [];
  const vueOnlyList = unmapped.vueOnly || [];

  // Coverage = mapped entries / (mapped + figmaOnly gaps)
  const denominator = mappedCount + figmaOnlyList.length;
  const coverage = denominator > 0
    ? Math.round((mappedCount / denominator) * 100)
    : 100;

  // Is the meta.json actually populated (vs empty stub)?
  const populated = axisCount > 0 || boolCount > 0 || propMap.length > 0;

  return {
    name,
    type: 'figma-mapped',
    figmaAxes: axisCount,
    figmaBooleans: boolCount,
    mappedCount,
    figmaOnlyCount: figmaOnlyList.length,
    vueOnlyCount: vueOnlyList.length,
    coverage,
    figmaOnly: figmaOnlyList,
    vueOnly: vueOnlyList,
    populated,
  };
}

// --- Console output ---
function printReport(analyses) {
  const date = new Date().toISOString().split('T')[0];
  const mapped = analyses.filter(a => a.type === 'figma-mapped');
  const codeOnly = analyses.filter(a => a.type === 'code-only');
  const populated = mapped.filter(a => a.populated);
  const needsWork = mapped.filter(a => !a.populated);

  console.log(`\nComponent Parity Report — ${date}`);
  console.log('='.repeat(90));
  console.log('');

  // Header
  const header = '| Component'.padEnd(22) +
    '| Figma Props'.padEnd(14) +
    '| Mapped'.padEnd(9) +
    '| Gaps (F→)'.padEnd(12) +
    '| Gaps (←V)'.padEnd(12) +
    '| Coverage'.padEnd(11) + '|';
  const separator = '|' + '-'.repeat(21) +
    '|' + '-'.repeat(13) +
    '|' + '-'.repeat(8) +
    '|' + '-'.repeat(11) +
    '|' + '-'.repeat(11) +
    '|' + '-'.repeat(10) + '|';

  console.log(header);
  console.log(separator);

  for (const a of mapped) {
    const figmaStr = a.figmaBooleans > 0
      ? `${a.figmaAxes}+${a.figmaBooleans}bool`
      : `${a.figmaAxes}`;
    const coverStr = a.coverage !== null ? `${a.coverage}%` : '-';
    const row = `| ${a.name}`.padEnd(22) +
      `| ${figmaStr}`.padEnd(14) +
      `| ${a.mappedCount}`.padEnd(9) +
      `| ${a.figmaOnlyCount}`.padEnd(12) +
      `| ${a.vueOnlyCount}`.padEnd(12) +
      `| ${coverStr}`.padEnd(11) + '|';
    console.log(row);
  }

  console.log('');
  console.log(`Summary: ${mapped.length} Figma-mapped | ${codeOnly.length} code-only | ${populated.length} populated | ${needsWork.length} empty stubs`);

  const totalFigmaOnly = mapped.reduce((s, a) => s + a.figmaOnlyCount, 0);
  const totalVueOnly = mapped.reduce((s, a) => s + a.vueOnlyCount, 0);
  console.log(`Figma-only gaps: ${totalFigmaOnly} total across all components`);
  console.log(`Vue-only gaps: ${totalVueOnly} total across all components`);
  console.log('');
}

// --- Single component detail ---
function printComponentDetail(analysis) {
  console.log(`\n${analysis.name} — Parity Detail`);
  console.log('-'.repeat(50));
  console.log(`Type: ${analysis.type}`);
  console.log(`Figma variant axes: ${analysis.figmaAxes}`);
  console.log(`Figma boolean props: ${analysis.figmaBooleans}`);
  console.log(`Mapped prop rules: ${analysis.mappedCount}`);
  console.log(`Coverage: ${analysis.coverage !== null ? analysis.coverage + '%' : 'N/A'}`);

  if (analysis.figmaOnly.length > 0) {
    console.log(`\nFigma-only (no Vue equivalent):`);
    for (const f of analysis.figmaOnly) console.log(`  - ${f}`);
  }

  if (analysis.vueOnly.length > 0) {
    console.log(`\nVue-only (no Figma variant):`);
    for (const v of analysis.vueOnly) console.log(`  - ${v}`);
  }
  console.log('');
}

// --- Main ---
function main() {
  const allMeta = loadAllMeta();

  if (allMeta.length === 0) {
    console.error('No meta.json files found.');
    process.exit(1);
  }

  let analyses = allMeta.map(analyzeComponent);

  // Filter if --component specified
  if (componentFilter) {
    analyses = analyses.filter(a => a.name === componentFilter);
    if (analyses.length === 0) {
      console.error(`Component "${componentFilter}" not found.`);
      process.exit(1);
    }
  }

  // Sort: figma-mapped first, then alphabetical
  analyses.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'figma-mapped' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  // Console output
  if (!jsonOnly) {
    if (componentFilter) {
      printComponentDetail(analyses[0]);
    } else {
      printReport(analyses);
    }
  }

  // JSON output
  const report = {
    generatedDate: new Date().toISOString().split('T')[0],
    totalComponents: allMeta.length,
    figmaMapped: analyses.filter(a => a.type === 'figma-mapped').length,
    codeOnly: analyses.filter(a => a.type === 'code-only').length,
    populated: analyses.filter(a => a.populated).length,
    components: analyses,
  };

  try {
    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
    if (!jsonOnly) {
      console.log(`JSON report written to: ${REPORT_PATH}`);
    } else {
      console.log(JSON.stringify(report, null, 2));
    }
  } catch (err) {
    console.error(`Failed to write report: ${err.message}`);
    // Still output to console if file write fails
    if (jsonOnly) console.log(JSON.stringify(report, null, 2));
  }
}

main();
