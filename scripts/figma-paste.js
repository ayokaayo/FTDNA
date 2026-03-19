#!/usr/bin/env node
// figma-paste.js — Copy a screenshot to macOS clipboard for pasting into Figma
//
// Usage:
//   node scripts/figma-paste.js <image-path>
//
// Copies the image to the macOS clipboard as PNG data.
// Then paste (Cmd+V) in Figma to place it.

import { execSync } from 'child_process';
import { resolve } from 'path';

const imgPath = process.argv[2];

if (!imgPath) {
  console.error('Usage: node scripts/figma-paste.js <image.png>');
  process.exit(1);
}

const absPath = resolve(imgPath);

execSync(`osascript -e '
set imgPath to POSIX file "${absPath}"
set the clipboard to (read imgPath as «class PNGf»)
'`);

console.log(`Copied to clipboard: ${absPath}`);
console.log('Paste in Figma with Cmd+V');
