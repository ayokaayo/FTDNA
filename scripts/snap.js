#!/usr/bin/env node
// snap.js — Screenshot FT UX pages, save locally, paste to Figma via Claude
//
// Usage:
//   node scripts/snap.js --login              Open browser to authenticate
//   node scripts/snap.js dashboard            Screenshot a page (headless)
//   node scripts/snap.js clients/123 --name clients-detail

import puppeteer from 'puppeteer-core';
import { join, dirname } from 'path';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://ux.ft-crm.com/v2/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PROFILE = join(__dirname, '..', '.browser-profile');
const OUT = join(__dirname, '..', 'references', 'screenshots');

const args = process.argv.slice(2);
const login = args.includes('--login');
const nameIdx = args.indexOf('--name');
const name = nameIdx > -1 ? args[nameIdx + 1] : null;
const target = args.find(a => !a.startsWith('--') && a !== name);

function slugify(s) {
  return s.replace(/^https?:\/\/[^/]+\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'index';
}

async function main() {
  if (!target && !login) {
    console.error('Usage: node scripts/snap.js <path|url> [--name file] [--login]');
    process.exit(1);
  }

  const url = !target ? BASE : target.startsWith('http') ? target : BASE + target;

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: login ? false : 'new',
    userDataDir: PROFILE,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-first-run', '--no-default-browser-check'],
  });

  const page = (await browser.pages())[0] || await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  if (login) {
    console.log('Waiting for login... (closes automatically when done, or after 2 min)');
    // Poll until URL leaves login/auth pages
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { resolve(); }, 120000);
      const check = setInterval(async () => {
        try {
          const u = page.url();
          if (u.startsWith(BASE) && !u.includes('login') && !u.includes('auth')) {
            clearInterval(check);
            clearTimeout(timeout);
            resolve();
          }
        } catch { clearInterval(check); clearTimeout(timeout); resolve(); }
      }, 1000);
    });
    console.log('Session saved.');

    if (target) {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      mkdirSync(OUT, { recursive: true });
      const file = (name || slugify(target)) + '.png';
      const out = join(OUT, file);
      await page.screenshot({ path: out });
      console.log(out);
    }
    await browser.close();
    return;
  }

  // Detect auth redirect
  const landed = page.url();
  if (landed.includes('login') || landed.includes('auth') || landed.includes('signin')) {
    console.error('Session expired. Run with --login first:\n  node scripts/snap.js --login');
    await browser.close();
    process.exit(1);
  }

  mkdirSync(OUT, { recursive: true });
  const file = (name || slugify(target)) + '.png';
  const out = join(OUT, file);
  await page.screenshot({ path: out });
  console.log(out);
  await browser.close();
}

main().catch(e => { console.error(e.message); process.exit(1); });
