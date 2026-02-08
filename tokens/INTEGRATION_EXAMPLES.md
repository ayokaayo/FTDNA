# FastTrack Design Tokens - Integration Examples

This guide demonstrates how to integrate FastTrack design tokens with common tools and frameworks.

## Style Dictionary Integration

### Configuration (style-dictionary.config.json)
```json
{
  "source": ["tokens/**/*.tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "dist/css/",
      "files": [
        {
          "destination": "tokens.css",
          "format": "css/variables"
        },
        {
          "destination": "tokens.scss",
          "format": "scss/variables"
        }
      ]
    },
    "json": {
      "transformGroup": "json",
      "buildPath": "dist/json/",
      "files": [
        {
          "destination": "tokens.json",
          "format": "json/flat"
        }
      ]
    },
    "javascript": {
      "transformGroup": "javascript",
      "buildPath": "dist/js/",
      "files": [
        {
          "destination": "tokens.js",
          "format": "javascript/es6"
        }
      ]
    }
  }
}
```

### Generated CSS Output Example
```css
--color-brand-pink-900: #91003f;
--color-brand-pink-800: #c21030;
--color-brand-pink-700: #d52454;
--color-brand-pink-600: #e96092;
--color-brand-pink-500: #f4b0c8;
--color-brand-pink-400: #fad7e4;
--color-brand-pink-300: #efc4df;
--color-brand-pink-200: #df8abe;

--color-brand-blue-900: #001261;
--color-brand-blue-800: #012b86;
--color-brand-blue-700: #105dba;
--color-brand-blue-600: #1369b9;
--color-brand-blue-500: #2782cf;
--color-brand-blue-400: #88b3dc;
--color-brand-blue-300: #c3d9ed;
--color-brand-blue-200: #b0daf2;
--color-brand-blue-100: #d8edf9;

--semantic-color-primary-base: var(--color-brand-blue-700);
--semantic-color-primary-dark: var(--color-brand-blue-800);
--semantic-color-primary-darker: var(--color-brand-blue-900);
--semantic-color-primary-light: var(--color-brand-blue-600);
--semantic-color-primary-lighter: var(--color-brand-blue-400);
--semantic-color-primary-lightest: var(--color-brand-blue-100);

--semantic-color-error-base: var(--color-brand-red-700);
--semantic-color-error-dark: var(--color-brand-red-800);
--semantic-color-error-darker: var(--color-brand-red-900);
--semantic-color-error-light: var(--color-brand-red-600);
--semantic-color-error-lightest: var(--color-brand-red-400);
```

## Tailwind CSS Integration

### tailwind.config.js
```javascript
const tokens = require('./tokens/colors.tokens.json');
const semanticTokens = require('./tokens/semantic.tokens.json');

// Convert tokens to Tailwind format
function convertTokens(tokenObj) {
  const colors = {};
  
  Object.entries(tokenObj.color || {}).forEach(([family, colorFamilyObj]) => {
    Object.entries(colorFamilyObj || {}).forEach(([colorName, shadesObj]) => {
      const familyName = `${family}-${colorName}`;
      colors[familyName] = {};
      
      Object.entries(shadesObj || {}).forEach(([shade, shadeObj]) => {
        if (shadeObj.$value) {
          colors[familyName][shade] = shadeObj.$value;
        }
      });
    });
  });
  
  return colors;
}

module.exports = {
  theme: {
    extend: {
      colors: {
        ...convertTokens(tokens),
        semantic: {
          primary: {
            base: tokens.color.brand.blue['700'],
            dark: tokens.color.brand.blue['800'],
            darker: tokens.color.brand.blue['900'],
            light: tokens.color.brand.blue['600'],
            lighter: tokens.color.brand.blue['400'],
            lightest: tokens.color.brand.blue['100'],
          },
          error: {
            base: tokens.color.brand.red['700'],
            dark: tokens.color.brand.red['800'],
            light: tokens.color.brand.red['600'],
            lightest: tokens.color.brand.red['400'],
          },
          success: {
            base: tokens.color.secondary.apple['700'],
            dark: tokens.color.secondary.apple['800'],
            light: tokens.color.secondary.apple['600'],
          },
          warning: {
            base: tokens.color.brand.yellow['500'],
            dark: tokens.color.brand.yellow['700'],
            light: tokens.color.brand.yellow['600'],
          },
          neutral: {
            base: tokens.color.neutral.gray['700'],
            dark: tokens.color.neutral.gray['900'],
            light: tokens.color.neutral.gray['500'],
          },
        },
      },
    },
  },
};
```

### Tailwind Usage
```html
<!-- Using brand tokens -->
<button class="bg-brand-blue-700 text-neutral-white-50 hover:bg-brand-blue-800">
  Primary Button
</button>

<!-- Using semantic tokens -->
<button class="bg-semantic-primary-base text-neutral-white-50 hover:bg-semantic-primary-dark">
  Primary Button
</button>

<div class="bg-semantic-error-lightest text-semantic-error-base border border-semantic-error-dark">
  Error Message
</div>

<div class="bg-semantic-success-lightest text-semantic-success-base">
  Success Message
</div>
```

## Figma Design Tokens Plugin Integration

### 1. Install Tokens Plugin
- In Figma, go to Assets > Plugins > Browse all plugins
- Search for "Tokens Studio"
- Click "Run"

### 2. Import Tokens
```
1. Click Tokens panel in sidebar
2. Select "Workspace" (top right dropdown)
3. Click "..." menu → "Import"
4. Select tokens/colors.tokens.json
5. Import tokens/semantic.tokens.json separately for semantic layer
```

### 3. Apply to Components
```
1. Select component fill
2. In Design Tokens panel
3. Search: "primary"
4. Click to apply {color.brand.blue.700}
```

## React/TypeScript Integration

### Example Hook (useColorToken.ts)
```typescript
import colorTokens from '../tokens/colors.tokens.json';
import semanticTokens from '../tokens/semantic.tokens.json';

type TokenPath = keyof typeof colorTokens.color;

export function getColorValue(
  family: string,
  color: string,
  shade: string
): string {
  const token = colorTokens.color[family]?.[color]?.[shade];
  if (token?.$value) {
    return token.$value;
  }
  return '#000000'; // fallback
}

export function useSemanticColor(role: 'primary' | 'error' | 'success' | 'warning') {
  const semantic = semanticTokens.semantic.color[role];
  return {
    base: semantic.base.$value,
    dark: semantic.dark?.$value,
    light: semantic.light?.$value,
    lightest: semantic.lightest?.$value,
  };
}
```

### Component Usage
```tsx
import { getColorValue, useSemanticColor } from './hooks/useColorToken';

export function Button({ variant = 'primary' }) {
  const colors = useSemanticColor(variant);
  
  return (
    <button
      style={{
        backgroundColor: colors.base,
        color: getColorValue('neutral', 'white', '50'),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.dark;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.base;
      }}
    >
      Click me
    </button>
  );
}

export function ErrorAlert({ message }) {
  const colors = useSemanticColor('error');
  
  return (
    <div
      style={{
        backgroundColor: colors.lightest,
        color: colors.base,
        borderColor: colors.dark,
        borderWidth: 1,
        padding: 16,
      }}
    >
      {message}
    </div>
  );
}
```

## Vue Integration

### composables/useTokens.ts
```typescript
import colorTokens from '@/tokens/colors.tokens.json';
import semanticTokens from '@/tokens/semantic.tokens.json';

export function useColorToken(family: string, color: string, shade: string) {
  const token = colorTokens.color[family]?.[color]?.[shade];
  return token?.$value || '#000000';
}

export function useSemanticColor(role: string) {
  const tokens = semanticTokens.semantic.color[role];
  return {
    base: tokens.base.$value,
    dark: tokens.dark?.$value,
    light: tokens.light?.$value,
  };
}
```

### Button.vue
```vue
<template>
  <button :style="{ backgroundColor: primaryColor }">
    {{ label }}
  </button>
</template>

<script setup>
import { useSemanticColor } from '@/composables/useTokens';

const props = defineProps({
  label: String,
  variant: { type: String, default: 'primary' },
});

const colors = useSemanticColor(props.variant);
const primaryColor = colors.base;
</script>

<style scoped>
button {
  color: v-bind("useColorToken('neutral', 'white', '50')");
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: v-bind('colors.dark');
}

button:active {
  background-color: v-bind('colors.darker');
}
</style>
```

## CSS-in-JS (Styled Components)

### tokens/colors.ts
```typescript
import colorTokens from './colors.tokens.json';

export const colors = {
  brand: {
    pink: colorTokens.color.brand.pink,
    blue: colorTokens.color.brand.blue,
    // ... other colors
  },
  secondary: colorTokens.color.secondary,
  neutral: colorTokens.color.neutral,
};

export const semantic = {
  primary: colorTokens.semantic.color.primary,
  error: colorTokens.semantic.color.error,
  // ... other semantic colors
};
```

### Button.styled.ts
```typescript
import styled from 'styled-components';
import { colors } from '../tokens/colors';

export const StyledButton = styled.button<{ variant?: 'primary' | 'error' }>`
  background-color: ${(props) =>
    props.variant === 'error'
      ? colors.brand.red['700']
      : colors.brand.blue['700']};
  color: ${colors.neutral.white['50']};
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.variant === 'error'
        ? colors.brand.red['800']
        : colors.brand.blue['800']};
  }

  &:active {
    background-color: ${(props) =>
      props.variant === 'error'
        ? colors.brand.red['900']
        : colors.brand.blue['900']};
  }
`;
```

## SCSS/Sass Integration

### tokens/colors.scss
```scss
// Brand colors
$color-brand-pink-900: #91003f;
$color-brand-pink-800: #c21030;
$color-brand-pink-700: #d52454;
// ... all colors

// Semantic colors
$semantic-primary-base: $color-brand-blue-700;
$semantic-primary-dark: $color-brand-blue-800;
$semantic-primary-darker: $color-brand-blue-900;
$semantic-primary-light: $color-brand-blue-600;
$semantic-primary-lightest: $color-brand-blue-100;

$semantic-error-base: $color-brand-red-700;
$semantic-error-dark: $color-brand-red-800;
$semantic-error-light: $color-brand-red-600;
$semantic-error-lightest: $color-brand-red-400;

// Maps for easier usage
$colors: (
  'brand': (
    'pink': (
      '900': $color-brand-pink-900,
      '800': $color-brand-pink-800,
      '700': $color-brand-pink-700,
    ),
    'blue': (
      '900': #001261,
      '800': #012b86,
      '700': #105dba,
    ),
  ),
);

@function color($family, $name, $shade) {
  @return map-get(map-get(map-get($colors, $family), $name), $shade);
}
```

### Usage in components
```scss
@import 'tokens/colors';

.button {
  background-color: $semantic-primary-base;
  color: $color-neutral-white-50;

  &:hover {
    background-color: $semantic-primary-dark;
  }

  &:active {
    background-color: $semantic-primary-darker;
  }
}

.alert-error {
  background-color: $semantic-error-lightest;
  color: $semantic-error-base;
  border: 1px solid $semantic-error-dark;
}
```

## Android/Kotlin Integration

### res/values/colors.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <!-- Brand Colors - Pink -->
  <color name="color_brand_pink_900">#91003F</color>
  <color name="color_brand_pink_800">#C21030</color>
  <color name="color_brand_pink_700">#D52454</color>
  
  <!-- Brand Colors - Blue -->
  <color name="color_brand_blue_900">#001261</color>
  <color name="color_brand_blue_800">#012B86</color>
  <color name="color_brand_blue_700">#105DBA</color>
  
  <!-- Semantic Colors -->
  <color name="semantic_primary_base">@color/color_brand_blue_700</color>
  <color name="semantic_primary_dark">@color/color_brand_blue_800</color>
  <color name="semantic_error_base">@color/color_brand_red_700</color>
</resources>
```

## iOS/Swift Integration

### Colors.swift (Generated)
```swift
import SwiftUI

struct AppColors {
  // Brand Colors
  static let brandPink900 = Color(red: 0x91/255, green: 0x00/255, blue: 0x3F/255)
  static let brandPink800 = Color(red: 0xC2/255, green: 0x10/255, blue: 0x30/255)
  static let brandPink700 = Color(red: 0xD5/255, green: 0x24/255, blue: 0x54/255)
  
  static let brandBlue900 = Color(red: 0x00/255, green: 0x12/255, blue: 0x61/255)
  static let brandBlue800 = Color(red: 0x01/255, green: 0x2B/255, blue: 0x86/255)
  static let brandBlue700 = Color(red: 0x10/255, green: 0x5D/255, blue: 0xBA/255)
  
  // Semantic Colors
  static let semanticPrimaryBase = brandBlue700
  static let semanticPrimaryDark = brandBlue800
  static let semanticErrorBase = brandRed700
}

// Usage in SwiftUI
struct PrimaryButton: View {
  var body: some View {
    Button("Click") { }
      .foregroundColor(.white)
      .background(AppColors.semanticPrimaryBase)
  }
}
```

---

## Testing Token Integration

### Jest Test Example
```typescript
import colorTokens from '../tokens/colors.tokens.json';

describe('Color Tokens', () => {
  it('should have all 67 colors', () => {
    let colorCount = 0;
    Object.values(colorTokens.color).forEach((family) => {
      Object.values(family).forEach((color) => {
        if (typeof color === 'object') colorCount += Object.keys(color).length;
      });
    });
    expect(colorCount).toBeGreaterThan(60);
  });

  it('should have valid hex values', () => {
    const hexRegex = /^#[0-9A-F]{6}$/i;
    Object.values(colorTokens.color).forEach((family) => {
      Object.values(family).forEach((color) => {
        if (typeof color === 'object') {
          Object.values(color).forEach((shade) => {
            expect(shade.$value).toMatch(hexRegex);
          });
        }
      });
    });
  });
});
```

---

For more integration patterns, see the main documentation files.
