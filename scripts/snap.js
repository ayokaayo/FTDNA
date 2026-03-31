#!/usr/bin/env node
// snap.js — Screenshot FT pages from any environment (UX, CF Pages, prototype)
//
// Usage:
//   node scripts/snap.js --login              Open browser to authenticate
//   node scripts/snap.js --start              Start persistent browser (run once per session)
//   node scripts/snap.js --stop               Stop persistent browser
//   node scripts/snap.js <url|path>           Screenshot a page (connects to running browser)
//   node scripts/snap.js <url> --full         Full-page screenshot
//   node scripts/snap.js <url> --name foo     Custom filename
//   node scripts/snap.js <path> --proto       Screenshot from CF Pages prototype environment
//   node scripts/snap.js <path> --compare     Screenshot both real + prototype, side by side

import puppeteer from 'puppeteer-core';
import { join, dirname } from 'path';
import { mkdirSync, existsSync, writeFileSync, readFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_UX = 'https://ux.ft-crm.com/v2/';
const BASE_PROTO = 'https://feature-dev-0000-ftdna-proto.backoffice-v2.pages.dev/';
const BASE = BASE_UX; // default
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PROFILE = join(__dirname, '..', '.browser-profile');
const OUT = join(__dirname, '..', 'references', 'screenshots');
const WS_FILE = join(__dirname, '..', '.browser-ws');
const DEBUG_PORT = 9222;

const args = process.argv.slice(2);
const login = args.includes('--login');
const start = args.includes('--start');
const stop = args.includes('--stop');
const proto = args.includes('--proto');
const compare = args.includes('--compare');
const nameIdx = args.indexOf('--name');
const name = nameIdx > -1 ? args[nameIdx + 1] : null;
const target = args.find(a => !a.startsWith('--') && a !== name);

function slugify(s) {
  // Extract the last meaningful path segment as the page name
  const path = s.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '');
  const last = path.split('/').filter(Boolean).pop() || 'index';
  return last.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

// Try to connect to a running browser instance
async function connectToRunning() {
  if (!existsSync(WS_FILE)) return null;
  const wsEndpoint = readFileSync(WS_FILE, 'utf8').trim();
  try {
    const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
    return browser;
  } catch {
    // Stale endpoint — clean up
    try { unlinkSync(WS_FILE); } catch {}
    return null;
  }
}

// Launch a persistent browser with remote debugging
async function launchPersistent(headless = false) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    userDataDir: PROFILE,
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      '--no-first-run',
      '--no-default-browser-check',
      `--remote-debugging-port=${DEBUG_PORT}`,
      '--window-position=0,0',
    ],
  });
  // Save the WebSocket endpoint so future calls can connect
  writeFileSync(WS_FILE, browser.wsEndpoint());
  return browser;
}

async function waitForLogin(page) {
  console.log('Waiting for login... (closes automatically when done, or after 2 min)');
  await new Promise((resolve) => {
    const timeout = setTimeout(() => { resolve(); }, 120000);
    const check = setInterval(async () => {
      try {
        const u = page.url();
        const isLoggedIn = !u.includes('login') && !u.includes('auth') && !u.includes('signin') && !u.includes('oldlogin');
        const isOnApp = u.startsWith(BASE_UX) || u.includes('backoffice-v2.pages.dev');
        if (isOnApp && isLoggedIn) {
          clearInterval(check);
          clearTimeout(timeout);
          resolve();
        }
      } catch { clearInterval(check); clearTimeout(timeout); resolve(); }
    }, 1000);
  });
  console.log('Session saved.');
}

async function main() {
  // --stop: kill running browser
  if (stop) {
    const browser = await connectToRunning();
    if (browser) {
      await browser.close();
      try { unlinkSync(WS_FILE); } catch {}
      console.log('Browser stopped.');
    } else {
      console.log('No running browser found.');
    }
    return;
  }

  // --start: launch persistent browser
  if (start) {
    const existing = await connectToRunning();
    if (existing) {
      console.log('Browser already running.');
      existing.disconnect();
      return;
    }
    const browser = await launchPersistent();
    console.log(`Persistent browser started (port ${DEBUG_PORT}). WS saved to .browser-ws`);
    console.log('Keep this terminal open, or the browser stays running independently.');
    // Navigate to base to keep session warm
    const page = (await browser.pages())[0] || await browser.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    const landed = page.url();
    if (landed.includes('login') || landed.includes('auth')) {
      await waitForLogin(page);
    }
    browser.disconnect(); // disconnect puppeteer but keep Chrome alive
    return;
  }

  // --login: open browser for auth
  if (login && !target) {
    const existing = await connectToRunning();
    if (existing) {
      // Use the running browser
      const page = (await existing.pages())[0] || await existing.newPage();
      await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
      await waitForLogin(page);
      existing.disconnect();
      return;
    }
    // No running browser — launch one, login, save, keep running
    const browser = await launchPersistent();
    const page = (await browser.pages())[0] || await browser.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await waitForLogin(page);
    browser.disconnect(); // keep Chrome alive
    return;
  }

  if (!target) {
    console.error('Usage: node scripts/snap.js <path|url> [--name file] [--full] [--proto] [--compare] [--login] [--start] [--stop]');
    process.exit(1);
  }

  // Try to connect to running browser first
  let browser = await connectToRunning();
  let launched = false;

  if (!browser) {
    // No running browser — launch one (headed, stays alive)
    browser = await launchPersistent();
    launched = true;
  }

  const fullPage = args.includes('--full');

  async function takeScreenshot(pageUrl, slug, suffix = '') {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Check if session expired
    const landed = page.url();
    if (landed.includes('login') || landed.includes('auth') || landed.includes('signin') || landed.includes('oldlogin')) {
      console.error(`Session expired on ${pageUrl} — please login in the browser window...`);
      await waitForLogin(page);
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    }

    const filename = suffix ? `${slug}${suffix}` : slug;
    const out = join(OUT, slug, filename + '.png');
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, fullPage });
    console.log(out);
    await page.close();
    return out;
  }

  const slug = name || slugify(target);

  if (compare) {
    // --compare: screenshot both the real page and the prototype
    const path = target.startsWith('/') ? target.slice(1) : target;
    const realUrl = BASE_UX + path;
    const protoUrl = BASE_PROTO + 'prototype/' + path;
    console.log(`Comparing: ${realUrl} vs ${protoUrl}`);
    await takeScreenshot(realUrl, slug, '-real');
    await takeScreenshot(protoUrl, slug, '-proto');
  } else {
    // Single screenshot
    const base = proto ? BASE_PROTO : BASE;
    const url = target.startsWith('http') ? target : base + target;
    await takeScreenshot(url, slug);
  }

  browser.disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
