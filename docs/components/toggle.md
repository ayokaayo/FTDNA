# Toggle

The `FTToggle` component is a switch control that uses Font Awesome `toggle-on` / `toggle-off` icons to match the Figma spec. It wraps a real hidden checkbox with `role="switch"` for accessibility.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { ref } from 'vue';
  import { FTToggle } from '@fasttrack-solutions/vue-components-lib';
  const enabled = ref(true);
</script>

<template>
  <FTToggle v-model="enabled" label="Enable feature" />
</template>
```

## States

### ON / OFF

<div class="demo demo--col">
  <div class="demo-row">
    <FTToggle :model-value="true" label="Toggle ON" />
    <FTToggle :model-value="false" label="Toggle OFF" />
  </div>
</div>

### Disabled

<div class="demo demo--col">
  <div class="demo-row">
    <FTToggle :model-value="true" disabled label="ON disabled" />
    <FTToggle :model-value="false" disabled label="OFF disabled" />
  </div>
</div>

### Justified

The `justified` prop spreads label and toggle across the full container width.

<div class="demo demo--col" style="max-width: 300px;">
  <FTToggle :model-value="true" justified label="Justified toggle" />
</div>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Toggle state (v-model) |
| `label` | `string` | — | Text label next to the toggle |
| `disabled` | `boolean` | `false` | Disables interaction |
| `justified` | `boolean` | `false` | Spreads label and toggle across full width |
| `ariaLabel` | `string` | — | Override the accessible label |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-toggle-icon-size` | `20px` | Font Awesome icon size |
| `--ft-toggle-container-size` | `24px` | Icon container size |
| `--ft-toggle-gap` | `8px` | Gap between icon and label |
| `--ft-toggle-icon-color-on` | `var(--ft-color-success-base)` | ON state icon color (green) |
| `--ft-toggle-icon-color-off` | `var(--ft-color-on-surface-base)` | OFF state icon color (dark gray) |
| `--ft-toggle-label-color` | `var(--ft-color-on-surface-base)` | Label text color |
| `--ft-toggle-disabled-opacity` | `0.5` | Opacity when disabled |
| `--ft-toggle-focus-ring` | `var(--ft-color-focus-ring-base)` | Focus ring color |

## Figma Reference

- **DSP-Master:** Toggle (Type=On/Off, Status=Default/Disabled, Alignment=Default/Justified)
- **Node IDs:** `2824:5730` (ON), `2824:5733` (OFF)
