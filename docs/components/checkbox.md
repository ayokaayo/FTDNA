# Checkbox

The `FTCheckbox` component replaces the standard HTML checkbox with the FastTrack design theme. It uses Font Awesome icons (`fa-square-check` / `fa-square`) to match the Figma spec exactly, while keeping a real hidden checkbox for accessibility.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { FTCheckbox } from '@fasttrack-solutions/vue-components-lib';
</script>

<template>
  <FTCheckbox v-model="agreed">I agree to the terms</FTCheckbox>
</template>
```

### Options API

```vue
<script>
  import { FTCheckbox } from '@fasttrack-solutions/vue-components-lib';
  export default {
    components: { FTCheckbox }
  }
</script>
```

## Checks

### Boolean model

A single checkbox bound to a boolean value. Click to toggle.

<div class="demo demo--col">
  <div class="demo-label">Boolean v-model</div>
  <div class="demo-row">
    <FTCheckbox>Default checkbox</FTCheckbox>
    <FTCheckbox checked>Checked checkbox</FTCheckbox>
  </div>
</div>

```vue
<FTCheckbox>Default checkbox</FTCheckbox>
<FTCheckbox checked>Checked checkbox</FTCheckbox>
```

### Array model

Multiple checkboxes can share an array v-model. Each checkbox adds or removes its `value` from the array.

```vue
<script lang="ts" setup>
const checkedGenres = ref(['Drama', 'Horror', 'Comedy']);
</script>

<template>
  <FTCheckbox v-model="checkedGenres" value="Drama">Drama</FTCheckbox>
  <FTCheckbox v-model="checkedGenres" value="Horror">Horror</FTCheckbox>
  <FTCheckbox v-model="checkedGenres" value="Comedy">Comedy</FTCheckbox>
  <FTCheckbox v-model="checkedGenres" value="RomCom">RomCom</FTCheckbox>
</template>
```

## Disabled

Disabled checkboxes are visually faded and non-interactive.

<div class="demo demo--col">
  <div class="demo-label">Disabled</div>
  <div class="demo-row">
    <FTCheckbox disabled>Default checkbox</FTCheckbox>
    <FTCheckbox checked disabled>Checked checkbox</FTCheckbox>
  </div>
</div>

```vue
<FTCheckbox disabled>Default checkbox</FTCheckbox>
<FTCheckbox checked disabled>Checked checkbox</FTCheckbox>
```

## Flipped

The flipped variant places the label before the checkbox, useful for right-aligned form layouts.

<div class="demo demo--col">
  <div class="demo-label">Flipped</div>
  <div class="demo-row">
    <FTCheckbox flipped>Default checkbox</FTCheckbox>
    <FTCheckbox checked flipped>Checked checkbox</FTCheckbox>
  </div>
</div>

```vue
<FTCheckbox flipped>Default checkbox</FTCheckbox>
<FTCheckbox checked flipped>Checked checkbox</FTCheckbox>
```

## Without labels

Checkboxes can be used without labels for compact layouts.

<div class="demo demo--col">
  <div class="demo-label">No labels</div>
  <div class="demo-row">
    <FTCheckbox></FTCheckbox>
    <FTCheckbox checked></FTCheckbox>
  </div>
</div>

```vue
<FTCheckbox></FTCheckbox>
<FTCheckbox checked></FTCheckbox>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean \| any[]` | `undefined` | v-model binding (boolean for single, array for multiple) |
| `value` | `any` | `undefined` | Value when used with array v-model |
| `checked` | `boolean` | `false` | Visual-only checked state (does not affect v-model) |
| `disabled` | `boolean` | `false` | Disables interaction and fades the component |
| `flipped` | `boolean` | `false` | Places the label before the checkbox |
| `ariaLabel` | `string` | `undefined` | Custom accessible label |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean \| any[]` | Emitted when the checkbox state changes |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-checkbox-icon-color` | `var(--ft-color-neutral-mono-700)` | Icon and label colour |
| `--ft-checkbox-disabled-color` | `var(--ft-color-neutral-mono-500)` | Disabled label colour |
| `--ft-checkbox-icon-size` | `20px` | Font Awesome icon size |
| `--ft-checkbox-container-size` | `24px` | Icon container dimensions |
| `--ft-checkbox-gap` | `8px` | Gap between icon and label |
| `--ft-checkbox-disabled-opacity` | `0.5` | Opacity when disabled |
