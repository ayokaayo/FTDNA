#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DIST_DIR = path.join(__dirname, '../dist');
const TOKENS_DIR = path.join(__dirname, '../tokens');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Read all token files
const colorsTokens = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, 'colors.tokens.json'), 'utf8'));
const semanticTokens = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, 'semantic.tokens.json'), 'utf8'));
const typographyTokens = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, 'typography.tokens.json'), 'utf8'));
const spacingTokens = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, 'spacing.tokens.json'), 'utf8'));

// ============================================================================
// Token Resolution Engine
// ============================================================================

// Build a flat map of all resolved token values
const tokenMap = new Map();
const maxIterations = 10;

// Extract all raw tokens first
const allTokens = extractTokens(colorsTokens);
const allSemanticTokens = extractTokens(semanticTokens);
const allTypographyTokens = extractTokens(typographyTokens);
const allSpacingTokens = extractTokens(spacingTokens);

function extractTokens(obj, prefix = '') {
  const result = {};

  function traverse(node, path) {
    if (node === null || typeof node !== 'object') return;

    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('$')) {
        if (key === '$value') {
          result[path] = value;
        }
      } else {
        traverse(value, path ? `${path}.${key}` : key);
      }
    }
  }

  traverse(obj);
  return result;
}

// Merge all tokens
Object.assign(allTokens, allSemanticTokens, allTypographyTokens, allSpacingTokens);

// Resolve references with iteration to handle nested references
function resolveReferences(value, iterations = 0) {
  if (typeof value !== 'string') return value;
  if (iterations >= maxIterations) return value;

  // Match patterns like {color.brand.blue.700}
  const refPattern = /\{([^}]+)\}/g;

  return value.replace(refPattern, (match, refPath) => {
    const resolvedValue = allTokens[refPath];
    if (resolvedValue !== undefined) {
      // Recursively resolve if the resolved value also has references
      if (typeof resolvedValue === 'string' && resolvedValue.includes('{')) {
        return resolveReferences(resolvedValue, iterations + 1);
      }
      return resolvedValue;
    }
    return match; // Return original if not found
  });
}

// Resolve all token values
for (const [key, value] of Object.entries(allTokens)) {
  tokenMap.set(key, resolveReferences(value));
}

console.log(`✓ Resolved ${tokenMap.size} tokens`);

// ============================================================================
// Typography Composite Extraction
// ============================================================================

// Extract composite typography styles (objects with fontSize, lineHeight, etc.)
function extractTypographyStyles(obj, prefix = '') {
  const styles = {};

  function traverse(node, path) {
    if (node === null || typeof node !== 'object') return;

    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('$')) {
        if (key === '$value' && typeof value === 'object') {
          // This is a composite typography token
          const resolved = {};
          for (const [prop, val] of Object.entries(value)) {
            resolved[prop] = resolveReferences(String(val));
          }
          styles[path] = resolved;
        }
      } else {
        traverse(value, path ? `${path}.${key}` : key);
      }
    }
  }

  traverse(obj);
  return styles;
}

const typographyStyles = extractTypographyStyles(typographyTokens);
console.log(`✓ Extracted ${Object.keys(typographyStyles).length} typography styles`);

// ============================================================================
// CSS Output Generation
// ============================================================================

function generateCSS() {
  let css = ':root {\n';

  // Collect all tokens by category for organized output
  const cssVars = [];

  // Color tokens
  const colorTokens = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('color.')) {
      const cssKey = `--ft-${key.replace(/\./g, '-')}`;
      colorTokens.push(`  ${cssKey}: ${value};`);
    }
  }

  // Semantic color tokens (prefer variable references where applicable)
  const semanticColorTokens = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('semantic.color.')) {
      const cssKey = `--ft-${key.replace(/^semantic\./, '').replace(/\./g, '-')}`;

      // Check if we can reference another CSS variable
      let cssValue = value;
      if (typeof value === 'string' && !value.startsWith('rgba')) {
        // Try to find if this references another token
        for (const [tokenKey, tokenVal] of tokenMap.entries()) {
          if (tokenKey.startsWith('color.') && tokenVal === value) {
            const referencedKey = `--ft-${tokenKey.replace(/\./g, '-')}`;
            cssValue = `var(${referencedKey})`;
            break;
          }
        }
      }

      semanticColorTokens.push(`  ${cssKey}: ${cssValue};`);
    }
  }

  // Typography tokens - skip complex objects, only output simple values
  const typographyPrimitiveTokens = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('font.') || key.startsWith('text.')) {
      // Skip complex typography objects with multiple properties
      if (typeof value === 'object') {
        continue;
      }

      const cssKey = `--ft-${key.replace(/\./g, '-')}`;

      // Handle font-family with quotes
      let cssValue = value;
      if (key.includes('family') && typeof value === 'string') {
        // Add quotes if not already quoted
        if (!value.startsWith("'") && !value.startsWith('"')) {
          cssValue = `'${value}'`;
        }
      }

      typographyPrimitiveTokens.push(`  ${cssKey}: ${cssValue};`);
    }
  }

  // Spacing tokens
  const spacingCssTokens = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('spacing.')) {
      const cssKey = `--ft-${key.replace(/\./g, '-')}`;
      spacingCssTokens.push(`  ${cssKey}: ${value};`);
    }
  }

  // Sort and combine
  css += '  /* Colors */\n';
  css += colorTokens.sort().join('\n') + '\n\n';

  css += '  /* Semantic Colors */\n';
  css += semanticColorTokens.sort().join('\n') + '\n\n';

  css += '  /* Typography */\n';
  css += typographyPrimitiveTokens.sort().join('\n') + '\n\n';

  css += '  /* Spacing */\n';
  css += spacingCssTokens.sort().join('\n') + '\n';

  css += '}\n';

  // Generate typography utility classes
  css += '\n/* ============================================================================ */\n';
  css += '/* Typography Utility Classes                                                  */\n';
  css += '/* Generated from typography.tokens.json composite styles                      */\n';
  css += '/* ============================================================================ */\n\n';

  for (const [path, style] of Object.entries(typographyStyles)) {
    // Convert path like "text.body.m" to class name "ft-text-body-m"
    const className = `ft-${path.replace(/\./g, '-')}`;
    css += `.${className} {\n`;

    if (style.fontFamily) {
      css += `  font-family: ${style.fontFamily.startsWith("'") ? style.fontFamily : `'${style.fontFamily}'`}, sans-serif;\n`;
    }
    if (style.fontSize) {
      css += `  font-size: ${style.fontSize};\n`;
    }
    if (style.lineHeight) {
      css += `  line-height: ${style.lineHeight};\n`;
    }
    if (style.fontWeight) {
      css += `  font-weight: ${style.fontWeight};\n`;
    }
    if (style.letterSpacing && style.letterSpacing !== '0px') {
      css += `  letter-spacing: ${style.letterSpacing};\n`;
    }
    if (style.textDecoration) {
      css += `  text-decoration: ${style.textDecoration};\n`;
    }

    css += '}\n\n';
  }

  return css;
}

// ============================================================================
// SCSS Output Generation
// ============================================================================

function generateSCSS() {
  let scss = '// FastTrack Design Tokens - SCSS Variables\n\n';

  // Individual variables
  scss += '// Color Tokens\n';
  const colorVars = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('color.')) {
      const scssKey = `$ft-${key.replace(/\./g, '-')}`;
      colorVars.push(`${scssKey}: ${value};`);
    }
  }
  scss += colorVars.sort().join('\n') + '\n\n';

  scss += '// Semantic Color Tokens\n';
  const semanticVars = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('semantic.color.')) {
      const scssKey = `$ft-${key.replace(/^semantic\./, '').replace(/\./g, '-')}`;

      // Check if we can reference another variable
      let scssValue = value;
      if (typeof value === 'string' && !value.startsWith('rgba')) {
        for (const [tokenKey, tokenVal] of tokenMap.entries()) {
          if (tokenKey.startsWith('color.') && tokenVal === value) {
            const referencedKey = `$ft-${tokenKey.replace(/\./g, '-')}`;
            scssValue = referencedKey;
            break;
          }
        }
      }

      semanticVars.push(`${scssKey}: ${scssValue};`);
    }
  }
  scss += semanticVars.sort().join('\n') + '\n\n';

  scss += '// Typography Variables\n';
  const typographyVars = [];
  for (const [key, value] of tokenMap.entries()) {
    if ((key.startsWith('font.') || key.startsWith('text.')) && typeof value === 'string') {
      const scssKey = `$ft-${key.replace(/\./g, '-')}`;

      let scssValue = value;
      if (key.includes('family') && typeof value === 'string') {
        if (!value.startsWith("'") && !value.startsWith('"')) {
          scssValue = `'${value}'`;
        }
      }

      typographyVars.push(`${scssKey}: ${scssValue};`);
    }
  }
  scss += typographyVars.sort().join('\n') + '\n\n';

  // SCSS Maps
  scss += '// Spacing Variables\n';
  const spacingVars = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('spacing.')) {
      const scssKey = `$ft-${key.replace(/\./g, '-')}`;
      spacingVars.push(`${scssKey}: ${value};`);
    }
  }
  scss += spacingVars.sort().join('\n') + '\n\n';

  scss += '// SCSS Maps for programmatic access\n\n';

  // Colors map
  scss += '$ft-colors: (\n';
  const colorMapEntries = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('color.')) {
      const mapKey = key.replace(/^color\./, '').replace(/\./g, '-');
      colorMapEntries.push(`  '${mapKey}': ${value}`);
    }
  }
  scss += colorMapEntries.sort().join(',\n') + '\n);\n\n';

  // Semantic colors map
  scss += '$ft-semantic-colors: (\n';
  const semanticMapEntries = [];
  for (const [key, value] of tokenMap.entries()) {
    if (key.startsWith('semantic.color.')) {
      const mapKey = key.replace(/^semantic\.color\./, '').replace(/\./g, '-');

      // Try to reference the variable
      let mapValue = value;
      if (typeof value === 'string' && !value.startsWith('rgba')) {
        for (const [tokenKey, tokenVal] of tokenMap.entries()) {
          if (tokenKey.startsWith('color.') && tokenVal === value) {
            const referencedKey = `$ft-${tokenKey.replace(/\./g, '-')}`;
            mapValue = referencedKey;
            break;
          }
        }
      }

      semanticMapEntries.push(`  '${mapKey}': ${mapValue}`);
    }
  }
  scss += semanticMapEntries.sort().join(',\n') + '\n);\n\n';

  // Typography map - only include primitive values
  scss += '$ft-typography: (\n';
  const typographyMapEntries = [];
  for (const [key, value] of tokenMap.entries()) {
    if ((key.startsWith('font.') && typeof value === 'string') ||
        (key.startsWith('text.') && typeof value === 'string' && !key.includes('display') && !key.includes('heading') && !key.includes('body') && !key.includes('caption'))) {
      const mapKey = key.replace(/^(text|font)\./, '').replace(/\./g, '-');

      let mapValue = value;
      if (key.includes('family') && typeof value === 'string') {
        if (!value.startsWith("'") && !value.startsWith('"')) {
          mapValue = `'${value}'`;
        }
      }

      typographyMapEntries.push(`  '${mapKey}': ${mapValue}`);
    }
  }
  if (typographyMapEntries.length > 0) {
    scss += typographyMapEntries.sort().join(',\n') + '\n';
  }
  scss += ');\n';

  return scss;
}

// ============================================================================
// TypeScript/Vue 3 Composable Output
// ============================================================================

function generateTypeScriptComposable() {
  let ts = `// This file is auto-generated. Do not edit manually.\n`;
  ts += `import { ref, computed, Ref } from 'vue';\n\n`;

  ts += `// ============================================================================\n`;
  ts += `// Token Type Definitions\n`;
  ts += `// ============================================================================\n\n`;

  ts += `export interface TokensObject {\n`;

  // Build type definitions
  const colorInterface = buildNestedInterface('color');
  const semanticInterface = buildNestedInterface('semantic');
  const fontInterface = buildNestedInterface('font');
  const textInterface = buildNestedInterface('text');

  if (colorInterface) ts += `  color: ${colorInterface};\n`;
  if (semanticInterface) ts += `  semantic: ${semanticInterface};\n`;
  if (fontInterface) ts += `  font: ${fontInterface};\n`;
  if (textInterface) ts += `  text: ${textInterface};\n`;

  ts += `}\n\n`;

  // Individual token constants
  ts += `// ============================================================================\n`;
  ts += `// Token Constants\n`;
  ts += `// ============================================================================\n\n`;

  for (const [key, value] of tokenMap.entries()) {
    const constantName = `FT_${key.toUpperCase().replace(/\./g, '_')}`;
    const stringValue = typeof value === 'string' ? `'${value}'` : value;
    ts += `export const ${constantName} = ${stringValue};\n`;
  }

  ts += `\n// ============================================================================\n`;
  ts += `// Reactive Tokens Object\n`;
  ts += `// ============================================================================\n\n`;

  ts += `const tokensData: TokensObject = {\n`;

  // Build nested object structure
  const tokensByCategory = {};

  for (const [key, value] of tokenMap.entries()) {
    const parts = key.split('.');
    const category = parts[0];

    if (!tokensByCategory[category]) {
      tokensByCategory[category] = {};
    }

    // Build nested structure
    let current = tokensByCategory[category];
    for (let i = 1; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }

  // Output the structure
  for (const [category, content] of Object.entries(tokensByCategory)) {
    ts += `  ${category}: ${JSON.stringify(content, null, 4).split('\n').join('\n  ')},\n`;
  }

  ts += `};\n\n`;

  ts += `// ============================================================================\n`;
  ts += `// useTokens Composable\n`;
  ts += `// ============================================================================\n\n`;

  ts += `export function useTokens() {\n`;
  ts += `  const tokens = ref<TokensObject>(tokensData);\n\n`;

  ts += `  // Get a specific token value by dot-notation path\n`;
  ts += `  const getToken = (path: string): any => {\n`;
  ts += `    return path.split('.').reduce((obj: any, key: string) => obj?.[key], tokens.value);\n`;
  ts += `  };\n\n`;

  ts += `  // Get all tokens\n`;
  ts += `  const getAllTokens = computed(() => tokens.value);\n\n`;

  ts += `  return {\n`;
  ts += `    tokens: getAllTokens,\n`;
  ts += `    getToken,\n`;
  ts += `  };\n`;
  ts += `}\n`;

  return ts;
}

// Helper to build nested interface types
function buildNestedInterface(prefix) {
  const relevant = Array.from(tokenMap.keys()).filter(k => k.startsWith(prefix + '.'));

  if (relevant.length === 0) return null;

  const structure = {};

  for (const key of relevant) {
    const parts = key.split('.').slice(1); // Remove prefix
    let current = structure;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = 'string';
  }

  return buildInterfaceString(structure);
}

function buildInterfaceString(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  const innerSpaces = '  '.repeat(indent + 1);
  const lines = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      lines.push(`${innerSpaces}${key}: string;`);
    } else {
      const nested = buildInterfaceString(value, indent + 1);
      lines.push(`${innerSpaces}${key}: ${nested};`);
    }
  }

  return `{\n${lines.join('\n')}\n${spaces}}`;
}

// ============================================================================
// Write Output Files
// ============================================================================

const cssOutput = generateCSS();
const scssOutput = generateSCSS();
const tsOutput = generateTypeScriptComposable();

fs.writeFileSync(path.join(DIST_DIR, 'tokens.css'), cssOutput);
console.log(`✓ Generated ${path.join(DIST_DIR, 'tokens.css')}`);

fs.writeFileSync(path.join(DIST_DIR, 'tokens.scss'), scssOutput);
console.log(`✓ Generated ${path.join(DIST_DIR, 'tokens.scss')}`);

fs.writeFileSync(path.join(DIST_DIR, 'useTokens.ts'), tsOutput);
console.log(`✓ Generated ${path.join(DIST_DIR, 'useTokens.ts')}`);

console.log('\n✓ All token files generated successfully!');
