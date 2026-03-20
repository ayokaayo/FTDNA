#!/usr/bin/env node
// figma-paste.js — Copy a screenshot to macOS clipboard and paste into Figma
//
// Usage:
//   node scripts/figma-paste.js <image-path>           Copy to clipboard + auto-paste in Figma
//   node scripts/figma-paste.js <image-path> --copy     Copy to clipboard only (no auto-paste)
//
// Requires: Accessibility permissions for terminal app (System Settings → Privacy & Security)

import { execSync } from 'child_process';
import { resolve } from 'path';

const args = process.argv.slice(2);
const copyOnly = args.includes('--copy');
const imgPath = args.find(a => !a.startsWith('--'));

if (!imgPath) {
  console.error('Usage: node scripts/figma-paste.js <image.png> [--copy]');
  process.exit(1);
}

const absPath = resolve(imgPath);

// Copy image to clipboard
execSync(`osascript -e '
set imgPath to POSIX file "${absPath}"
set the clipboard to (read imgPath as «class PNGf»)
'`);

if (copyOnly) {
  console.log(`Copied to clipboard: ${absPath}`);
  console.log('Paste in Figma with Cmd+V');
} else {
  // Auto-paste into Figma
  execSync(`osascript -e '
tell application "Figma" to activate
delay 1
tell application "System Events"
    tell process "Figma"
        set frontmost to true
        delay 0.5
        -- Press Escape first to dismiss any open panel/dialog and focus canvas
        key code 53
        delay 0.3
        keystroke "v" using command down
    end tell
end tell
'`);
  console.log(`Pasted into Figma: ${absPath}`);
}
