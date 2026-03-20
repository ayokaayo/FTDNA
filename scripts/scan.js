#!/usr/bin/env node
// scan.js — Discover all platform pages by navigating the side menu
//
// Prerequisites: node scripts/snap.js --start  (browser must be running + authenticated)
//
// Usage:
//   node scripts/scan.js                  Discover pages → update page-inventory.md
//   node scripts/scan.js --dry-run        Print discovered pages, don't write files
//   node scripts/scan.js --json           Output raw JSON to stdout

import puppeteer from 'puppeteer-core';
import { join, dirname } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE = 'https://ux.ft-crm.com/v2/';
const WS_FILE = join(ROOT, '.browser-ws');
const MANIFEST = join(ROOT, 'references', 'scan-manifest.json');
const INVENTORY = join(ROOT, 'inventory', 'page-inventory.md');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const jsonOut = args.includes('--json');

// ─── Browser connection (reuses snap.js persistent browser) ─────────────────

async function connect() {
  if (!existsSync(WS_FILE)) {
    throw new Error('No running browser. Start one with: node scripts/snap.js --start');
  }
  const ws = readFileSync(WS_FILE, 'utf8').trim();
  try {
    return await puppeteer.connect({ browserWSEndpoint: ws });
  } catch {
    throw new Error('Browser connection failed. Restart with: node scripts/snap.js --stop && node scripts/snap.js --start');
  }
}

function slugify(s) {
  return s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

// ─── Discovery ──────────────────────────────────────────────────────────────
//
// Sidebar DOM structure:
//   <nav class="side-bar">
//     <div class="side-bar-body">
//       <section class="group-1">
//         <div class="menu-icon-item" data-balloon="Search [.]">...</div>
//         <div class="menu-icon-item" data-balloon="CRM">...</div>
//         ...
//       </section>
//     </div>
//     <div class="side-bar-footer">
//       <section class="group-3">
//         <div class="menu-icon-item" data-balloon="Knowledge Base">...</div>
//         ...
//       </section>
//     </div>
//   </nav>
//
// Clicking a menu-icon-item opens a sub-side-bar panel:
//   <div class="side-bar expand sub-side-bar">
//     <div class="header">
//       <span>CRM</span>
//       <span class="section-title">Planning</span>
//       <ul><li><a href="/v2/">Dashboard</a></li>...</ul>
//       <span class="section-title">Build</span>
//       <ul>...</ul>
//     </div>
//   </div>
//
// Some items (like "Fast Track AI") have a direct <a> instead of a flyout.

async function discover(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });

  // Check auth
  const landed = page.url();
  if (landed.includes('login') || landed.includes('auth') || landed.includes('signin')) {
    throw new Error('Not authenticated. Run: node scripts/snap.js --login');
  }

  // Get all menu-icon-items with their labels (from data-balloon attribute)
  const menuItems = await page.evaluate(() => {
    const items = [...document.querySelectorAll('nav.side-bar .menu-icon-item')];
    return items.map((el, i) => ({
      index: i,
      label: (el.getAttribute('data-balloon') || '').replace(/\s*\[.*\]/, ''), // strip keyboard shortcut hints
      hasDirectLink: !!el.querySelector('a[href]'),
      directHref: el.querySelector('a[href]')?.getAttribute('href') || null,
    }));
  });

  console.log(`Found ${menuItems.length} sidebar items: ${menuItems.map(m => m.label).join(', ')}`);

  const sections = [];

  for (const item of menuItems) {
    // Skip Search — it's a global overlay, not a page section
    if (item.label.toLowerCase().startsWith('search')) {
      console.log(`  [${item.label}] — skipping (overlay)`);
      continue;
    }

    console.log(`  [${item.label}]`);

    // Items with a direct link (e.g. Fast Track AI → /v2/oracle)
    if (item.hasDirectLink && item.directHref) {
      sections.push({
        name: item.label,
        subsections: [{
          name: null,
          pages: [{
            label: item.label,
            path: item.directHref,
            folder: slugify(item.label),
          }],
        }],
      });
      console.log(`    Direct link → ${item.directHref}`);
      continue;
    }

    // Click to open the sub-side-bar flyout
    const trigger = (await page.$$('nav.side-bar .menu-icon-item'))[item.index];
    if (!trigger) continue;

    try {
      await trigger.click();
      // Wait for the sub-side-bar to appear
      await page.waitForSelector('.sub-side-bar', { timeout: 3000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 500));
    } catch {
      console.log(`    ⚠ Click failed, skipping`);
      continue;
    }

    // Extract pages from the sub-side-bar, grouped by sub-section
    const subsections = await page.evaluate(() => {
      const panel = document.querySelector('.sub-side-bar');
      if (!panel) return [];

      const results = [];
      let currentSection = null;
      let currentPages = [];

      // Walk through the header content which contains section-titles and <ul> lists
      const header = panel.querySelector('.header');
      if (!header) return [];

      const elements = header.querySelectorAll('.section-title, ul li a[href]');
      for (const el of elements) {
        if (el.classList.contains('section-title')) {
          // Save previous section
          if (currentPages.length > 0) {
            results.push({ name: currentSection, pages: currentPages });
          }
          currentSection = el.textContent.trim();
          currentPages = [];
        } else if (el.tagName === 'A') {
          const href = el.getAttribute('href');
          if (href && href.startsWith('/')) {
            currentPages.push({
              label: el.textContent.trim(),
              path: href,
            });
          }
        }
      }
      // Save last section
      if (currentPages.length > 0) {
        results.push({ name: currentSection, pages: currentPages });
      }

      return results;
    });

    if (subsections.length > 0) {
      const totalPages = subsections.reduce((sum, s) => sum + s.pages.length, 0);
      sections.push({
        name: item.label,
        subsections: subsections.map(sub => ({
          ...sub,
          pages: sub.pages.map(p => ({
            ...p,
            folder: slugify(p.label || p.path.split('/').pop()),
          })),
        })),
      });
      console.log(`    ${totalPages} pages in ${subsections.length} sub-sections`);
    } else {
      // Flyout might not have the expected structure — try broader link scan
      const links = await page.evaluate(() => {
        const panel = document.querySelector('.sub-side-bar');
        if (!panel) return [];
        return [...panel.querySelectorAll('a[href]')].map(a => ({
          label: a.textContent.trim(),
          path: a.getAttribute('href'),
        })).filter(l => l.path && l.path.startsWith('/'));
      });

      if (links.length > 0) {
        sections.push({
          name: item.label,
          subsections: [{
            name: null,
            pages: links.map(l => ({ ...l, folder: slugify(l.label || l.path.split('/').pop()) })),
          }],
        });
        console.log(`    ${links.length} pages (flat)`);
      } else {
        console.log(`    No pages found`);
      }
    }

    // Close the flyout — click the main content area or press Escape
    await page.click('.menu-backdrop').catch(() =>
      page.keyboard.press('Escape').catch(() => {})
    );
    await new Promise(r => setTimeout(r, 300));
  }

  // Deduplicate pages across all sections
  const seenPaths = new Set();
  for (const section of sections) {
    for (const sub of section.subsections) {
      sub.pages = sub.pages.filter(p => {
        if (seenPaths.has(p.path)) return false;
        seenPaths.add(p.path);
        return true;
      });
    }
    // Remove empty subsections
    section.subsections = section.subsections.filter(s => s.pages.length > 0);
  }
  // Remove empty sections
  const filtered = sections.filter(s => s.subsections.length > 0);

  await page.close();
  return filtered;
}

// ─── Output ─────────────────────────────────────────────────────────────────

function generateInventory(sections) {
  const date = new Date().toISOString().split('T')[0];
  let totalPages = 0;
  for (const s of sections) for (const sub of s.subsections) totalPages += sub.pages.length;

  let md = `# Platform Page Inventory

> Auto-generated by \`scan.js\` from live navigation at ${BASE}
> Scanned: ${date}
> Total pages discovered: ${totalPages}

---

`;

  let pageNum = 0;
  for (const section of sections) {
    md += `## ${section.name}\n\n`;

    for (const sub of section.subsections) {
      if (sub.name) {
        md += `### ${sub.name}\n\n`;
      }
      md += `| # | Page | URL | Folder |\n`;
      md += `|---|------|-----|--------|\n`;
      for (const p of sub.pages) {
        pageNum++;
        md += `| ${pageNum} | ${p.label || '—'} | \`${p.path}\` | \`${p.folder}/\` |\n`;
      }
      md += `\n`;
    }
  }

  md += `---

## Usage

Screenshot a page on-demand:
\`\`\`bash
node scripts/snap.js <path>            # e.g. node scripts/snap.js /v2/activity-manager/triggers
node scripts/snap.js <path> --full     # full-page screenshot
\`\`\`

Re-scan navigation:
\`\`\`bash
node scripts/scan.js                   # regenerate this inventory
\`\`\`
`;

  return md;
}

function printSections(sections) {
  for (const s of sections) {
    console.log(`\n[${s.name}]`);
    for (const sub of s.subsections) {
      if (sub.name) console.log(`  ${sub.name}:`);
      for (const p of sub.pages) {
        const indent = sub.name ? '    ' : '  ';
        console.log(`${indent}${p.label || '—'} → ${p.path}`);
      }
    }
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('Connecting to browser...');
  const browser = await connect();

  console.log('Discovering pages from side menu...');
  const sections = await discover(browser);

  let totalPages = 0;
  for (const s of sections) for (const sub of s.subsections) totalPages += sub.pages.length;
  console.log(`\nDiscovered ${totalPages} pages across ${sections.length} sections`);

  if (jsonOut) {
    console.log(JSON.stringify({ scannedAt: new Date().toISOString(), base: BASE, sections }, null, 2));
    browser.disconnect();
    return;
  }

  if (dryRun) {
    printSections(sections);
    browser.disconnect();
    return;
  }

  // Save manifest (machine-readable, for other scripts to consume)
  mkdirSync(dirname(MANIFEST), { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify({
    scannedAt: new Date().toISOString(),
    base: BASE,
    sections,
  }, null, 2));
  console.log(`Manifest saved: ${MANIFEST}`);

  // Generate page inventory
  const inventory = generateInventory(sections);
  writeFileSync(INVENTORY, inventory);
  console.log(`Inventory saved: ${INVENTORY}`);

  browser.disconnect();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
