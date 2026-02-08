# Tooltip

The `FTTooltip` component displays brief informational text when users hover over or focus on an element. It wraps any trigger element via its default slot and positions a styled balloon above, below, left, or right. In Figma this is the `data-balloon` component.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { FTTooltip } from '@fasttrack-solutions/vue-components-lib';
</script>

<template>
  <FTTooltip text="Tooltip text goes here. Keep it as short as possible">
    <i class="fa-solid fa-circle-info" /> Hover me
  </FTTooltip>
</template>
```

### Options API

```vue
<script>
  import { FTTooltip } from '@fasttrack-solutions/vue-components-lib';
  export default {
    components: { FTTooltip }
  }
</script>
```

## Positions

The tooltip can appear above, below, left, or right of its trigger.

<div class="demo demo--col">
  <div class="demo-label">Positions</div>
  <div class="demo-row" style="gap: 32px; padding: 48px 16px;">
    <FTTooltip text="I am on top" position="top">
      <i class="fa-solid fa-circle-info" style="color:#2c2c2c;" /> Top
    </FTTooltip>
    <FTTooltip text="I am on the bottom" position="bottom">
      <i class="fa-solid fa-circle-info" style="color:#2c2c2c;" /> Bottom
    </FTTooltip>
    <FTTooltip text="Left side" position="left">
      <i class="fa-solid fa-circle-info" style="color:#2c2c2c;" /> Left
    </FTTooltip>
    <FTTooltip text="Right side" position="right">
      <i class="fa-solid fa-circle-info" style="color:#2c2c2c;" /> Right
    </FTTooltip>
  </div>
</div>

```vue
<FTTooltip text="I am on top" position="top">
  <i class="fa-solid fa-circle-info" /> Top
</FTTooltip>
<FTTooltip text="I am on the bottom" position="bottom">
  <i class="fa-solid fa-circle-info" /> Bottom
</FTTooltip>
```

## Status variants

Five colour variants convey different meanings.

<div class="demo demo--col">
  <div class="demo-label">Status colours</div>
  <div class="demo-row" style="gap: 32px; padding: 48px 16px;">
    <FTTooltip text="Default tooltip" status="default">
      <i class="fa-solid fa-circle-info" style="color:#2c2c2c;" /> Default
    </FTTooltip>
    <FTTooltip text="Operation successful" status="success">
      <i class="fa-solid fa-circle-check" style="color:#3aaa35;" /> Success
    </FTTooltip>
    <FTTooltip text="Here is some helpful info" status="info">
      <i class="fa-solid fa-circle-info" style="color:#63b6e6;" /> Info
    </FTTooltip>
    <FTTooltip text="Please pay attention" status="warning">
      <i class="fa-solid fa-triangle-exclamation" style="color:#f4a321;" /> Warning
    </FTTooltip>
    <FTTooltip text="Something went wrong" status="error">
      <i class="fa-solid fa-circle-xmark" style="color:#e54f35;" /> Error
    </FTTooltip>
  </div>
</div>

```vue
<FTTooltip text="Default tooltip" status="default">
  <i class="fa-solid fa-circle-info" /> Default
</FTTooltip>
<FTTooltip text="Operation successful" status="success">
  <i class="fa-solid fa-circle-check" /> Success
</FTTooltip>
```

## With copy icon

An optional copy icon inside the balloon allows users to copy the tooltip text to clipboard.

<div class="demo demo--col">
  <div class="demo-label">Copy icon</div>
  <div class="demo-row" style="gap: 32px; padding: 48px 16px;">
    <FTTooltip text="Tooltip text goes here. Keep it as short as possible" copyIcon>
      <i class="fa-solid fa-circle-info" style="color:#2c2c2c;" /> Icon left
    </FTTooltip>
    <FTTooltip text="Tooltip text goes here. Keep it as short as possible" copyIcon iconPosition="right">
      <i class="fa-solid fa-circle-info" style="color:#2c2c2c;" /> Icon right
    </FTTooltip>
  </div>
</div>

```vue
<FTTooltip text="Tooltip text goes here" copyIcon>
  <i class="fa-solid fa-circle-info" /> Icon left
</FTTooltip>
<FTTooltip text="Tooltip text goes here" copyIcon iconPosition="right">
  <i class="fa-solid fa-circle-info" /> Icon right
</FTTooltip>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | — (required) | Tooltip content. Truncated at 120 characters. |
| `status` | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | Colour variant |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Where the balloon appears |
| `copyIcon` | `boolean` | `false` | Show a copy-to-clipboard icon inside the balloon |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Which side the copy icon sits on |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-tooltip-bg-default` | `var(--ft-color-neutral-mono-700)` | Default background |
| `--ft-tooltip-bg-success` | `#3aaa35` | Success background |
| `--ft-tooltip-bg-info` | `#63b6e6` | Info background |
| `--ft-tooltip-bg-warning` | `#f4a321` | Warning background |
| `--ft-tooltip-bg-error` | `#e54f35` | Error background |
| `--ft-tooltip-fg` | `white` | Text colour (all statuses) |
| `--ft-tooltip-max-width` | `280px` | Maximum balloon width |
| `--ft-tooltip-radius` | `4px` | Border radius |
| `--ft-tooltip-offset` | `6px` | Gap between trigger and balloon |
