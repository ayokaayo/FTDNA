# Logo

The `FTLogo` component renders the Fast Track logo in all official Figma variants: colour, black, and white — in full (icon+text), icon-only, or text-only sizes.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { FTLogo } from '@fasttrack-solutions/vue-components-lib';
</script>

<template>
  <FTLogo />
  <FTLogo variant="colour-white" />
  <FTLogo size="icon" />
</template>
```

## Variants

### Primary — Colour + Black (light backgrounds)

<div class="demo demo--col">
  <FTLogo variant="colour-black" />
  <FTLogo variant="colour-black" size="icon" />
  <FTLogo variant="colour-black" size="text" />
</div>

### Primary — Colour + White (dark backgrounds)

<div class="demo demo--col" style="background: #1a1a1a;">
  <FTLogo variant="colour-white" />
  <FTLogo variant="colour-white" size="icon" />
  <FTLogo variant="colour-white" size="text" />
</div>

### Secondary — Black (monochrome, light backgrounds)

<div class="demo demo--col">
  <FTLogo variant="black" />
  <FTLogo variant="black" size="icon" />
  <FTLogo variant="black" size="text" />
</div>

### Secondary — White (monochrome, dark backgrounds)

<div class="demo demo--col" style="background: #1a1a1a;">
  <FTLogo variant="white" />
  <FTLogo variant="white" size="icon" />
  <FTLogo variant="white" size="text" />
</div>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'colour-black' \| 'colour-white' \| 'black' \| 'white'` | `'colour-black'` | Colour scheme |
| `size` | `'full' \| 'icon' \| 'text'` | `'full'` | Which parts to show |
| `ariaLabel` | `string` | `'Fast Track'` | Accessible label |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-logo-icon-size` | `32px` | Icon height |
| `--ft-logo-text-height` | `16px` | Text wordmark height |
| `--ft-logo-gap` | `var(--ft-spacing-sm, 8px)` | Gap between icon and text |

## Figma Reference

- **Fast Track Logo file:** Master component
- **Node IDs:** `14:398` (master variants), `1:1446` (usage guide)
- **Variants:** Size (Default - Icon+Text, Icon, Text) x Colour (Colour+black, Colour+white, Black, White)
