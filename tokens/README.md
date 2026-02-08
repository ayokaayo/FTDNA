# FastTrack Design Tokens

## Overview

This directory contains W3C-compliant design tokens for the FastTrack design system, derived from the Figma "Brand Colour and tokens" library audit (February 6, 2026).

## Files

### 1. `colors.tokens.json`
Complete color palette with all 67 unique color values organized by family and shade level.

**Structure:**
- **Brand Colors** (Primary palette): Pink, Purple, Blue, Yellow, Red, Orange
- **Secondary Colors**: Magenta, Thunderbird, Lilac, Aqua, Denim, Apple
- **Neutral Colors**: Black, Gray variations, White

**Shade Scale:**
The original +/- shade system has been normalized to a numeric scale:
- `900` = Base + 2 darker (-2 shade / darkest)
- `800` = Base + 1 darker (-1 shade / dark)
- `700` = Primary base color
- `600` = Base + 1 lighter (+1 shade / light)
- `500` = Base + 2 lighter (+2 shade / very light)
- `400` = Base + 3 lighter (+3 shade / lightest)
- `300`, `200`, `100`, `50` = Additional variants

**Format:**
All hex values are normalized to uppercase for consistency.

Example:
```json
{
  "color": {
    "brand": {
      "pink": {
        "700": {
          "$type": "color",
          "$value": "#D52454",
          "$description": "Pink primary base color"
        }
      }
    }
  }
}
```

### 2. `semantic.tokens.json`
Semantic token aliases providing functional naming that references the core color tokens.

**Semantic Categories:**
- **Functional Roles**: primary, secondary, tertiary
- **Status Colors**: success, warning, error, info
- **Surfaces**: surface, on-surface
- **Interactive**: focus-ring, link, border
- **Accessibility**: on-primary, on-secondary, on-success, on-error
- **Additional**: accent, overlay

**Example:**
```json
{
  "semantic": {
    "color": {
      "primary": {
        "base": {
          "$type": "color",
          "$value": "{color.brand.blue.700}",
          "$description": "Primary brand color for main actions"
        }
      }
    }
  }
}
```

Semantic tokens use token references (`{color.brand.blue.700}`) to avoid duplication and maintain consistency.

## Color Families

### Brand Colors (Primary)
| Family | Base Hex | Darkest (-2) | Lightest (+3) | Shades |
|--------|----------|-------------|---------------|--------|
| Pink | #D52454 | #91003F | #FAD7E4 | 8 |
| Purple | #783171 | #230123 | #F1E4F0 | 9 |
| Blue | #105DBA | #001261 | #D8EDF9 | 9 |
| Yellow | #FFDB14 | #FCE8C7 | #FFF6C9 | 7 |
| Red | #B61615 | #5D0000 | #EDC4C4 | 8 |
| Orange | #E9681A | #DF4317 | #F9D3CC | 6 |

### Secondary Colors
| Family | Base Hex | Darkest (-2) | Lightest (+3) | Shades |
|--------|----------|-------------|---------------|--------|
| Magenta | #C0087F | #91003F | #EFC4DF | 5 |
| Thunderbird | #B61615 | #6D001F | N/A | 4 |
| Lilac | #C18EC0 | #440743 | N/A | 4 |
| Aqua | #4AA3A0 | #28827F | #E1F2F2 | 6 |
| Denim | #1369B9 | #001261 | N/A | 4 |
| Apple | #3AAA35 | #034B02 | #CDEACC | 5 |

### Neutral Colors
| Family | Values |
|--------|--------|
| Black | #000000 |
| Gray | #2C2C2C, #666666, #959595, #CACACA, #E5E5E5, #F5F5F5 |
| White | #FAFAFA, #FFFFFF |

## Total Colors
- **67 unique hex values** across 13 color families
- **All hex values normalized to uppercase** (fixed inconsistency from audit)
- **Complete shade variations** from darkest (-2) to lightest (+3)

## W3C Compliance

These tokens follow the W3C Design Tokens Community Group format:
- ✓ `$type` and `$value` properties on all tokens
- ✓ `$description` metadata for each token
- ✓ Hierarchical organization (brand, secondary, neutral)
- ✓ Token references for semantic layers
- ✓ Schema reference for validation

## Style Dictionary Compatibility

These tokens are compatible with Style Dictionary and similar tools:

```yaml
# Example Style Dictionary config
source:
  - 'tokens/*.tokens.json'

platforms:
  web:
    transformGroup: web
    buildPath: dist/
    files:
      - destination: css/tokens.css
        format: css/variables
```

## Usage

### Option 1: Direct Token Reference
```css
.button {
  background-color: var(--color-brand-blue-700);
  color: var(--color-neutral-white-50);
}
```

### Option 2: Semantic Token Reference
```css
.primary-button {
  background-color: var(--semantic-color-primary-base);
  color: var(--semantic-color-on-primary-base);
}
```

### Option 3: Via Design Token Tool
Import `colors.tokens.json` and `semantic.tokens.json` into:
- Figma Design Tokens plugin
- Tokens.studio
- Amazon Style Dictionary
- Other W3C-compliant token processors

## Metadata

- **Version**: 1.0.0
- **Last Updated**: 2026-02-06
- **Source**: FastTrack Figma "Brand Colour and tokens" library
- **Audit Reference**: figma-brand-tokens-audit.md
- **Total Tokens**: 102 (67 color values + 35 semantic aliases)
- **Hex Normalization**: All values converted to uppercase
- **Shade Scale**: Custom 50-900 numeric scale mapped from +/- system

## Maintenance

When updating these tokens:
1. Update both `colors.tokens.json` AND `semantic.tokens.json`
2. Keep hex values in uppercase
3. Update the version number in `$metadata`
4. Validate JSON structure: `python3 -m json.tool [filename]`
5. Update this README if structure changes

---

Generated from FastTrack Design System audit, February 6, 2026
