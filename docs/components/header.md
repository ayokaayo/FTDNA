# Header

The `FTHeader` component is a fixed-height top bar that combines breadcrumb navigation on the left with action buttons and icon buttons on the right. It matches the Header component in the Figma DSP-Master spec.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { FTHeader } from '@fasttrack-solutions/vue-components-lib';
  import { FTBreadcrumb } from '@fasttrack-solutions/vue-components-lib';
  import { FTButton } from '@fasttrack-solutions/vue-components-lib';
</script>

<template>
  <FTHeader>
    <template #breadcrumb>
      <FTBreadcrumb :items="breadcrumbItems" />
    </template>
    <template #actions>
      <FTButton>Save</FTButton>
    </template>
  </FTHeader>
</template>
```

## Variants

### With Breadcrumb

<div class="demo" style="padding: 0;">
  <FTHeader>
    <template #breadcrumb>
      <FTBreadcrumb :items="[
        { key: 'home', label: 'Home' },
        { key: 'section', label: 'Section' },
        { key: 'page', label: 'Current Page' }
      ]" />
    </template>
  </FTHeader>
</div>

### With Actions

<div class="demo" style="padding: 0;">
  <FTHeader>
    <template #breadcrumb>
      <FTBreadcrumb :items="[
        { key: 'home', label: 'Home' },
        { key: 'projects', label: 'Projects' },
        { key: 'detail', label: 'Project Detail' }
      ]" />
    </template>
    <template #actions>
      <FTButton>Button text</FTButton>
      <FTButton primary>Button text</FTButton>
    </template>
  </FTHeader>
</div>

### Full Header (breadcrumb + icons + buttons)

<div class="demo" style="padding: 0;">
  <FTHeader>
    <template #breadcrumb>
      <FTBreadcrumb :items="[
        { key: '1', label: 'Level 1' },
        { key: '2', label: 'Level 2' },
        { key: '3', label: 'Level 3' },
        { key: '4', label: 'Level 4' },
        { key: '5', label: 'Level 5' },
        { key: '6', label: 'Level 6' },
        { key: '7', label: 'Level 7' },
        { key: '8', label: 'Level 8' },
        { key: '9', label: 'Level 9' },
        { key: '10', label: 'Level 10' },
        { key: '11', label: 'Level 11' },
        { key: '12', label: 'Level 12' }
      ]" />
    </template>
    <template #actions>
      <FTButton>Button text</FTButton>
      <FTButton primary>Button text</FTButton>
    </template>
  </FTHeader>
</div>

## Slots

| Slot | Description |
|------|-------------|
| `breadcrumb` | Left side — typically an `FTBreadcrumb` instance |
| `actions` | Right side — icon buttons, toggle, FTButton instances |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-header-height` | `50px` | Header height |
| `--ft-header-bg` | `var(--ft-color-surface-base)` | Background color |
| `--ft-header-border-color` | `var(--ft-color-border-base)` | Bottom border color |
| `--ft-header-padding-x` | `var(--ft-spacing-xl, 32px)` | Horizontal padding |
| `--ft-header-actions-gap` | `var(--ft-spacing-sm, 8px)` | Gap between action items |

## Figma Reference

- **DSP-Master:** Header
- **Node ID:** `3054:5706`
