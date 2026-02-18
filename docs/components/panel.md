# Panel

The `FTPanel` component is a white surface container with an optional header (title, description, info icon) and a right-side actions slot. It matches the Standard Panel in the Figma DSP-Master spec.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { FTPanel } from '@fasttrack-solutions/vue-components-lib';
</script>

<template>
  <FTPanel title="My Panel" description="Some description">
    <p>Panel content goes here</p>
  </FTPanel>
</template>
```

## Variants

### Default (title only)

<div class="demo">
  <FTPanel title="Activities">
    <div style="background: var(--ft-color-surface-secondary); padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 80px;">
      <span style="font-weight: bold; color: var(--ft-color-on-surface-base);">Content area</span>
    </div>
  </FTPanel>
</div>

### With Description

<div class="demo">
  <FTPanel title="Lifecycle Projects" description="Manage your active lifecycle projects">
    <div style="background: var(--ft-color-surface-secondary); padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 80px;">
      <span style="font-weight: bold; color: var(--ft-color-on-surface-base);">Content area</span>
    </div>
  </FTPanel>
</div>

### With Info Icon

<div class="demo">
  <FTPanel title="Statistics" info-icon description="Click the info icon for details">
    <div style="background: var(--ft-color-surface-secondary); padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 80px;">
      <span style="font-weight: bold; color: var(--ft-color-on-surface-base);">Content area</span>
    </div>
  </FTPanel>
</div>

### With Actions Slot

<div class="demo">
  <FTPanel title="All Activities" description="Overview of activities">
    <template #actions>
      <FTToggle :model-value="true" label="Toggle" />
    </template>
    <div style="background: var(--ft-color-surface-secondary); padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 80px;">
      <span style="font-weight: bold; color: var(--ft-color-on-surface-base);">Content area</span>
    </div>
  </FTPanel>
</div>

### Bordered

<div class="demo">
  <FTPanel title="Bordered Panel" bordered>
    <div style="background: var(--ft-color-surface-secondary); padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 80px;">
      <span style="font-weight: bold; color: var(--ft-color-on-surface-base);">Content area</span>
    </div>
  </FTPanel>
</div>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Panel heading text |
| `description` | `string` | — | Subtitle below the title |
| `infoIcon` | `boolean` | `false` | Shows an info circle icon next to the title |
| `bordered` | `boolean` | `false` | Adds a border around the panel |
| `infoAriaLabel` | `string` | `'More information'` | Accessible label for the info button |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Panel content |
| `actions` | Right-side header actions (search, toggles, icon buttons) |
| `header` | Replaces the entire default header (only if `title` is not set) |

## Events

| Event | Description |
|-------|-------------|
| `info-click` | Emitted when the info icon button is clicked |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-panel-bg` | `var(--ft-color-surface-base)` | Panel background |
| `--ft-panel-padding` | `var(--ft-spacing-xl, 32px)` | Inner padding |
| `--ft-panel-gap` | `var(--ft-spacing-md, 16px)` | Gap between header and content |
| `--ft-panel-border-color` | `var(--ft-color-border-base)` | Border color (when bordered) |
| `--ft-panel-border-radius` | `0` | Border radius |
| `--ft-panel-title-size` | `20px` | Title font size |
| `--ft-panel-title-weight` | `var(--ft-font-weight-bold)` | Title font weight |
| `--ft-panel-title-color` | `var(--ft-color-on-surface-base)` | Title color |
| `--ft-panel-description-size` | `14px` | Description font size |
| `--ft-panel-description-color` | `var(--ft-color-on-surface-base)` | Description color |
| `--ft-panel-title-gap` | `var(--ft-spacing-xs, 4px)` | Gap between title and description |
| `--ft-panel-info-icon-size` | `16px` | Info icon font size |
| `--ft-panel-info-icon-container` | `20px` | Info icon container size |
| `--ft-panel-info-icon-color` | `var(--ft-color-on-surface-base)` | Info icon color |
| `--ft-panel-actions-gap` | `var(--ft-spacing-sm, 8px)` | Gap between action items |
| `--ft-panel-content-bg` | `var(--ft-color-surface-secondary)` | Content area background (for reference) |
| `--ft-panel-focus-ring` | `var(--ft-color-focus-ring-base)` | Focus ring color |

## Figma Reference

- **DSP-Master:** Standard Panel (Side - Width=Full, 2/3, 1/2, 1/3)
- **Node IDs:** `3780:6892` (Full), `3780:6918` (1/2), `3780:6905` (2/3), `3780:6931` (1/3)
- **Panel Header:** `3643:7053` (Default variant)
