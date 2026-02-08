# Contributing

## How This System Works

```
Figma (design)  →  tokens/*.json (source of truth)  →  dist/ (consumable outputs)
                                                          ├── tokens.css
                                                          ├── tokens.scss
                                                          └── useTokens.ts
```

Designers update Figma. Token changes are extracted into JSON files. The build script generates CSS, SCSS, and TypeScript outputs. Components in the Vue library consume these tokens.

## Adding a New Color

1. Add the color to `tokens/colors.tokens.json` following the W3C format:
```json
{
  "newcolor": {
    "700": {
      "$type": "color",
      "$value": "#HEXVAL",
      "$description": "New color base"
    }
  }
}
```

2. If the color has semantic meaning, add a mapping in `tokens/semantic.tokens.json`:
```json
{
  "newrole": {
    "base": {
      "$type": "color",
      "$value": "{color.brand.newcolor.700}",
      "$description": "What this token is used for"
    }
  }
}
```

3. Run the build: `npm run build:tokens`

## Adding a Typography Style

1. Add to `tokens/typography.tokens.json` following the existing pattern
2. Run the build: `npm run build:tokens`

## Component Contribution Workflow

### For Designers
1. Design the component in the DSP-Master Figma library
2. Follow naming conventions: `Type=value, Status=value, Size=value`
3. Use tokens from the Brand Colour file (not hardcoded values)
4. Update the component status page

### For Engineers
1. Check the [Component Status](/components/status) page for priority gaps
2. Create the Vue component with `FT` prefix (e.g., `FTCard`)
3. Use CSS custom properties from `tokens.css` — no hardcoded colors
4. Add props documentation with TypeScript types
5. Add the component page to this playbook

## Code Review Checklist

- [ ] Uses design tokens (no hardcoded colors or font sizes)
- [ ] Component uses `FT` prefix
- [ ] Props are typed with TypeScript
- [ ] Includes both Composition API and Options API examples
- [ ] CSS custom properties used for theming
- [ ] Tested across supported browsers
- [ ] Figma component updated to match (or vice versa)
- [ ] Component status page updated
