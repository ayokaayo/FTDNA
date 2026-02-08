# Paging

The `FTPaging` component provides pagination controls for navigating through pages of data. It shows the item count, a page-size selector, and numbered page buttons with previous/next navigation.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { FTPaging } from '@fasttrack-solutions/vue-components-lib';
  const currentPage = ref(1);
</script>

<template>
  <FTPaging v-model="currentPage" :total-items="345" :items-per-page="6" />
</template>
```

### Options API

```vue
<script>
  import { FTPaging } from '@fasttrack-solutions/vue-components-lib';
  export default {
    components: { FTPaging }
  }
</script>
```

## Standard pagination

A simple pagination with a few pages.

<div class="demo demo--col">
  <div class="demo-label">Standard (3 pages)</div>
  <FTPaging :total-items="18" :items-per-page="6" :model-value="1" />
</div>

```vue
<FTPaging :total-items="18" :items-per-page="6" v-model="page" />
```

## Many pages

When there are more than five pages, an ellipsis appears to keep the control compact.

<div class="demo demo--col">
  <div class="demo-label">Many pages (58 pages)</div>
  <FTPaging :total-items="345" :items-per-page="6" :model-value="1" />
</div>

```vue
<FTPaging :total-items="345" :items-per-page="6" v-model="page" />
```

## Different page sizes

The items-per-page selector lets users choose how many items to display.

<div class="demo demo--col">
  <div class="demo-label">12 items per page</div>
  <FTPaging :total-items="345" :items-per-page="12" :model-value="1" />
</div>

```vue
<FTPaging :total-items="345" :items-per-page="12" v-model="page" />
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `1` | Current page (v-model) |
| `totalItems` | `number` | — (required) | Total number of items across all pages |
| `itemsPerPage` | `number` | `6` | Items shown per page |
| `pageSizeOptions` | `number[]` | `[6, 12, 24, 48]` | Available page size choices |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Emitted when the active page changes |
| `update:itemsPerPage` | `number` | Emitted when the page size changes |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-paging-active-bg` | `var(--ft-color-brand-pink-400)` | Active page circle background |
| `--ft-paging-active-fg` | `white` | Active page text colour |
| `--ft-paging-inactive-fg` | `var(--ft-color-neutral-mono-500)` | Inactive page text colour |
| `--ft-paging-icon-color` | `var(--ft-color-neutral-mono-700)` | Arrow icon colour |
| `--ft-paging-tag-bg` | `var(--ft-color-neutral-mono-200)` | Info tag background |
| `--ft-paging-tag-fg` | `var(--ft-color-neutral-mono-700)` | Info tag text colour |
| `--ft-paging-height` | `42px` | Component height |
| `--ft-paging-gap` | `8px` | Gap between elements |
