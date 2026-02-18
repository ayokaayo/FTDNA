# Breadcrumb

The `FTBreadcrumb` component renders a horizontal breadcrumb trail with automatic ellipsis when items exceed the `maxVisible` threshold. Items support optional tags and dropdown indicators.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { ref } from 'vue';
  import { FTBreadcrumb } from '@fasttrack-solutions/vue-components-lib';
  import type { BreadcrumbItem } from '@fasttrack-solutions/vue-components-lib';

  const items = ref<BreadcrumbItem[]>([
    { key: 'home', label: 'Home' },
    { key: 'section', label: 'Section' },
    { key: 'page', label: 'Current Page' },
  ]);
</script>

<template>
  <FTBreadcrumb :items="items" @item-click="handleClick" />
</template>
```

## Variants

### Short (3 items)

<div class="demo">
  <FTBreadcrumb :items="[
    { key: 'home', label: 'Home' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'page', label: 'Current Page' }
  ]" />
</div>

### With Tags

<div class="demo">
  <FTBreadcrumb :items="[
    { key: 'home', label: 'Home' },
    { key: 'section', label: 'Section', tag: 'NEW' },
    { key: 'page', label: 'Current Page' }
  ]" />
</div>

### With Dropdown Indicator

<div class="demo">
  <FTBreadcrumb :items="[
    { key: 'home', label: 'Home', dropdown: true },
    { key: 'section', label: 'Section' },
    { key: 'page', label: 'Current Page' }
  ]" />
</div>

### Long Path (ellipsis)

When items exceed `maxVisible` (default 6), the component shows the first 3, an ellipsis, then the last 3.

<div class="demo">
  <FTBreadcrumb :items="[
    { key: '1', label: 'Home' },
    { key: '2', label: 'Products' },
    { key: '3', label: 'Category' },
    { key: '4', label: 'Subcategory' },
    { key: '5', label: 'Brand' },
    { key: '6', label: 'Model' },
    { key: '7', label: 'Variant' },
    { key: '8', label: 'Current Item' }
  ]" />
</div>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | — | Array of breadcrumb items |
| `maxVisible` | `number` | `6` | Max items before ellipsis collapse |
| `ariaLabel` | `string` | `'Breadcrumb navigation'` | Accessible label for the nav |

### BreadcrumbItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier |
| `label` | `string` | Yes | Display text |
| `tag` | `string` | No | Optional badge text next to the label |
| `dropdown` | `boolean` | No | Shows a chevron-down indicator |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `item-click` | `[item: BreadcrumbItem, index: number]` | Emitted when a non-current item is clicked |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-breadcrumb-height` | `50px` | Component height |
| `--ft-breadcrumb-item-padding` | `8px` | Item padding |
| `--ft-breadcrumb-item-gap` | `8px` | Gap between label, tag, and dropdown icon |
| `--ft-breadcrumb-font-size` | `12px` | Label font size |
| `--ft-breadcrumb-font-weight` | `var(--ft-font-weight-bold)` | Label font weight |
| `--ft-breadcrumb-color` | `var(--ft-color-neutral-light)` | Non-current item color |
| `--ft-breadcrumb-color-current` | `var(--ft-color-on-surface-base)` | Current (last) item color |
| `--ft-breadcrumb-separator-color` | `var(--ft-color-on-surface-base)` | Chevron separator color |
| `--ft-breadcrumb-separator-size` | `14px` | Separator icon size |
| `--ft-breadcrumb-icon-size` | `20px` | Icon container size |
| `--ft-breadcrumb-tag-bg` | `var(--ft-color-on-surface-base)` | Tag background |
| `--ft-breadcrumb-tag-fg` | `var(--ft-color-on-surface-inverse)` | Tag text color |
| `--ft-breadcrumb-tag-height` | `20px` | Tag height |
| `--ft-breadcrumb-tag-radius` | `4px` | Tag border radius |
| `--ft-breadcrumb-tag-font-size` | `10px` | Tag font size |
| `--ft-breadcrumb-focus-ring` | `var(--ft-color-focus-ring-base)` | Focus ring color |

## Figma Reference

- **DSP-Master:** Breadcrumb (Short, Ellipses, Level break)
- **Node IDs:** `3052:3870` (Short), `3054:3882` (Ellipses), `3054:3943` (Level break)
