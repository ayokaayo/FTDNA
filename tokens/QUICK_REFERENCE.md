# FastTrack Design Tokens - Quick Reference

## Token Access Patterns

### Brand Color Tokens
```
color.brand.{family}.{shade}

Examples:
- color.brand.pink.700        → #D52454 (primary pink)
- color.brand.blue.900        → #001261 (darkest blue)
- color.brand.orange.400      → #F9D3CC (lightest orange)
```

### Secondary Color Tokens
```
color.secondary.{family}.{shade}

Examples:
- color.secondary.aqua.700    → #4AA3A0 (primary aqua)
- color.secondary.apple.900   → #034B02 (darkest apple green)
- color.secondary.denim.600   → #88B3DC (light denim)
```

### Neutral Color Tokens
```
color.neutral.{family}.{shade}

Examples:
- color.neutral.black.900     → #000000 (pure black)
- color.neutral.gray.700      → #666666 (medium gray)
- color.neutral.white.50      → #FFFFFF (pure white)
```

## Semantic Token Access

### Functional Role Tokens
```
semantic.color.{role}.{variant}

Examples:
- semantic.color.primary.base       → {color.brand.blue.700}
- semantic.color.error.dark         → {color.brand.red.800}
- semantic.color.success.lightest   → {color.secondary.apple.500}
- semantic.color.warning.base       → {color.brand.yellow.500}
```

### Surface & Text Tokens
```
semantic.color.surface.{variant}
semantic.color.on-surface.{variant}

Examples:
- semantic.color.surface.base           → {color.neutral.white.50}
- semantic.color.on-surface.base        → {color.neutral.gray.900}
- semantic.color.on-surface.secondary   → {color.neutral.gray.700}
```

### Interactive Tokens
```
semantic.color.{element}.{state}

Examples:
- semantic.color.link.base       → {color.brand.blue.700}
- semantic.color.link.hover      → {color.brand.blue.800}
- semantic.color.border.base     → {color.neutral.gray.200}
- semantic.color.focus-ring.base → {color.brand.blue.700}
```

## Shade Mapping Reference

### Numeric Scale Conversion
| Scale | Original | Meaning |
|-------|----------|---------|
| 900 | -2 | Darkest |
| 800 | -1 | Dark |
| 700 | base | Primary |
| 600 | +1 | Light |
| 500 | +2 | Very Light |
| 400 | +3 | Lightest |
| 300-100 | variants | Additional tints/shades |
| 50 | - | Lightest (white only) |

## Color Family Quick Lookup

### Primary Brand Colors
- **Pink**: Accents, highlights (warm)
- **Purple**: Secondary focus (cool)
- **Blue**: Primary actions (neutral cool)
- **Yellow**: Warnings, alerts (warm)
- **Red**: Errors, destructive actions (warm)
- **Orange**: Accents, secondary actions (warm)

### Secondary Colors
- **Magenta**: Hot accent color (hot pink)
- **Thunderbird**: Deep red alternative
- **Lilac**: Soft purple alternative
- **Aqua**: Cyan/teal alternative
- **Denim**: Deep blue alternative (navy)
- **Apple**: Green for success states

### Neutral Colors
- **Black**: Pure black (#000000)
- **Gray**: 6 shades for text, borders, backgrounds
- **White**: Light backgrounds and text on dark surfaces

## CSS Variable Examples

### Using Brand Tokens
```css
.button-primary {
  background-color: var(--color-brand-blue-700);
  color: var(--color-neutral-white-50);
}

.button-primary:hover {
  background-color: var(--color-brand-blue-800);
}

.button-primary:active {
  background-color: var(--color-brand-blue-900);
}
```

### Using Semantic Tokens
```css
.button-primary {
  background-color: var(--semantic-color-primary-base);
  color: var(--semantic-color-on-primary-base);
}

.button-secondary {
  background-color: var(--semantic-color-secondary-base);
  color: var(--semantic-color-on-secondary-base);
}

.alert-error {
  background-color: var(--semantic-color-error-lightest);
  color: var(--semantic-color-error-base);
  border-color: var(--semantic-color-error-dark);
}
```

## JSON Reference Patterns

### Direct Value Access
```json
{
  "color": {
    "brand": {
      "blue": {
        "700": {
          "$value": "#105DBA"
        }
      }
    }
  }
}
```

### Token Reference (Semantic)
```json
{
  "semantic": {
    "color": {
      "primary": {
        "base": {
          "$value": "{color.brand.blue.700}"
        }
      }
    }
  }
}
```

## Common Use Cases

### Button States
| State | Token | Value |
|-------|-------|-------|
| Default | semantic.color.primary.base | #105DBA |
| Hover | semantic.color.primary.dark | #012B86 |
| Active | semantic.color.primary.darker | #001261 |
| Disabled | semantic.color.neutral.lighter | #CACACA |

### Status Colors
| Status | Token | Value |
|--------|-------|-------|
| Success | semantic.color.success.base | #3AAA35 |
| Warning | semantic.color.warning.base | #FFDB14 |
| Error | semantic.color.error.base | #B61615 |
| Info | semantic.color.info.base | #4AA3A0 |

### Text Hierarchy
| Level | Token | Value |
|-------|-------|-------|
| Primary | semantic.color.on-surface.base | #2C2C2C |
| Secondary | semantic.color.on-surface.secondary | #666666 |
| Tertiary | semantic.color.on-surface.tertiary | #959595 |
| Disabled | semantic.color.on-surface.disabled | #CACACA |

## Tools Compatibility

These tokens work with:
- ✓ **CSS Variables** (via build process)
- ✓ **Tokens.studio** (import .tokens.json files)
- ✓ **Amazon Style Dictionary** (native support)
- ✓ **Figma Design Tokens Plugin** (native support)
- ✓ **PostCSS** (with token processors)
- ✓ **Sass/SCSS** (with token maps)
- ✓ **Tailwind CSS** (with custom config)

## File Structure
```
/tokens/
├── colors.tokens.json        (Core color definitions)
├── semantic.tokens.json      (Semantic aliases)
├── README.md                 (Full documentation)
├── QUICK_REFERENCE.md        (This file)
└── CHANGELOG.md             (Version history)
```

## Version Info
- **Format**: W3C Design Tokens Community Group (2023-07-20)
- **Version**: 1.0.0
- **Created**: 2026-02-06
- **Total Colors**: 67 unique hex values
- **Total Tokens**: 102 (colors + semantics)

---

For detailed documentation, see README.md
For token definitions, see colors.tokens.json and semantic.tokens.json
