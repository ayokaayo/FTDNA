# FastTrack Design Tokens - Usage Guide

This directory contains auto-generated design tokens from the W3C token format source files.

## Files

- **tokens.css** - CSS custom properties for use in stylesheets
- **tokens.scss** - SCSS variables and maps for preprocessor usage  
- **useTokens.ts** - Vue 3 composable with TypeScript types and constants
- **USAGE.md** - This file

## Quick Start

### CSS

```html
<link rel="stylesheet" href="dist/tokens.css">
<style>
  button {
    background: var(--ft-color-primary-base);
    color: var(--ft-color-on-primary-base);
  }
</style>
```

### SCSS

```scss
@import 'dist/tokens.scss';

.card {
  background: $ft-color-surface-base;
  border: 1px solid $ft-color-border-base;
  
  &.error {
    background: map-get($ft-semantic-colors, 'error-lightest');
  }
}
```

### Vue 3 (TypeScript)

**Option 1: Using the composable**
```typescript
import { useTokens } from './dist/useTokens';

export default {
  setup() {
    const { tokens, getToken } = useTokens();
    
    return {
      primaryColor: tokens.value.color.brand.blue['700'],
      errorColor: getToken('semantic.color.error.base'),
    };
  },
};
```

**Option 2: Using constants directly**
```typescript
import { 
  FT_COLOR_PRIMARY_BASE,
  FT_COLOR_BRAND_BLUE_700,
  FT_FONT_FAMILY_TEXT
} from './dist/useTokens';

export default {
  setup() {
    return {
      buttonStyle: {
        backgroundColor: FT_COLOR_PRIMARY_BASE,
        fontFamily: FT_FONT_FAMILY_TEXT,
      },
    };
  },
};
```

**Option 3: Full type safety**
```typescript
import type { TokensObject } from './dist/useTokens';
import { useTokens } from './dist/useTokens';

const { tokens } = useTokens();

// This is fully typed - IDE will provide autocomplete
const color: string = tokens.value.color.brand.blue['700'];
const semantic = tokens.value.semantic.color.primary.base;
```

## Token Categories

### Color Tokens
- **Brand colors**: Pink, Purple, Blue, Yellow, Red, Orange
- **Secondary colors**: Magenta, Thunderbird, Lilac, Aqua, Denim, Apple
- **Neutral colors**: Black, Gray scale, White

Each color has multiple shades (100-900 scale where applicable).

### Semantic Colors
Functional color tokens that reference base colors:
- **primary, secondary, tertiary** - UI action colors
- **error, success, warning, info** - Status colors
- **surface** - Background colors
- **on-surface, on-primary** - Text/content colors for contrast
- **border** - Border colors (base, subtle, strong, focus)
- **focus-ring** - Keyboard focus indicators
- **link** - Link states (base, hover, active, visited)
- **overlay** - Overlay/backdrop colors

### Typography Tokens
- **font.family**: Inter (text), Noto Sans Mono (code)
- **font.weight**: Regular (400), Bold (700)
- **Text styles**: Display, Heading, Body, Caption variants
  - Each variant includes: fontSize, lineHeight, letterSpacing, fontWeight

## CSS Variable Naming

All tokens follow the pattern: `--ft-{category}-{subcategory}-{variant}`

Examples:
- `--ft-color-brand-blue-700`
- `--ft-color-primary-base`
- `--ft-font-family-text`

## SCSS Variable Naming

SCSS variables follow: `$ft-{category}-{subcategory}-{variant}`

Maps are provided:
- `$ft-colors` - All color tokens
- `$ft-semantic-colors` - All semantic tokens
- `$ft-typography` - Typography tokens

## TypeScript Constants

All tokens export as constants: `FT_{CATEGORY}_{SUBCATEGORY}_{VARIANT}`

Examples:
- `FT_COLOR_BRAND_BLUE_700`
- `FT_COLOR_PRIMARY_BASE`
- `FT_FONT_FAMILY_TEXT`

## Regenerating Outputs

When source tokens change, regenerate outputs:

```bash
node scripts/build-tokens.js
```

The build script:
1. Reads all three source token files (colors, semantic, typography)
2. Resolves token references (e.g., {color.brand.blue.700})
3. Generates CSS, SCSS, and TypeScript outputs
4. Creates smart variable references where appropriate

## Source Files

Token sources are in `/tokens/`:
- `colors.tokens.json` - Base color palette
- `semantic.tokens.json` - Semantic token aliases
- `typography.tokens.json` - Typography system

Total tokens: **169 resolved**
