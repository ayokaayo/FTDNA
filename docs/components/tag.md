# Tag

The `FTTag` component is a versatile tag/chip element used for categorization, filtering, and status indicators. The component supports three distinct usage patterns: Status Tags (text-only status indicators), Normal Tags (interactive chips with icons), and Selection Tags (neutral/solid toggles).

## Usage

### Composition API (script setup)

```vue
<script setup lang="ts">
  import { FTTag } from '@fasttrack-solutions/vue-components-lib';
</script>

<template>
  <FTTag solid>Status Tag</FTTag>
  <FTTag solid color="pink" leadingIcon="circle" removable>Normal Tag</FTTag>
  <FTTag>Selection Tag</FTTag>
</template>
```

### Options API

```vue
<script>
  import { FTTag } from '@fasttrack-solutions/vue-components-lib';
  export default {
    components: { FTTag }
  }
</script>

<template>
  <FTTag solid>ACTIVE</FTTag>
</template>
```

## Status Tags

Status tags are text-only indicators used in tables and lists to show the status of entities. No icons. Medium size (24px). Text is displayed in UPPERCASE. Each status category has a specific set of semantic colors.

### Activities

<div class="demo demo--col">
  <div class="demo-label">Activities</div>
  <div class="demo-row">
    <FTTag solid>DISABLED</FTTag>
    <FTTag solid color="blue">SCHEDULED</FTTag>
    <FTTag solid color="green">ACTIVE</FTTag>
    <FTTag solid color="red">ENDED</FTTag>
  </div>
</div>

### Lifecycles

<div class="demo demo--col">
  <div class="demo-label">Lifecycles</div>
  <div class="demo-row">
    <FTTag solid>IN DEV</FTTag>
    <FTTag solid color="blue">QA</FTTag>
    <FTTag solid color="orange">READY</FTTag>
    <FTTag solid color="green">PROD</FTTag>
  </div>
</div>

### Action Groups

<div class="demo demo--col">
  <div class="demo-label">Action Groups</div>
  <div class="demo-row">
    <FTTag solid>IN DEV</FTTag>
    <FTTag solid color="green">ACTIVE</FTTag>
    <FTTag solid color="gray">OLD VERSION</FTTag>
  </div>
</div>

### Collections

<div class="demo demo--col">
  <div class="demo-label">Collections</div>
  <div class="demo-row">
    <FTTag solid>IN DEV</FTTag>
    <FTTag solid color="red">PUBLISHED</FTTag>
    <FTTag solid color="green">ACTIVE</FTTag>
    <FTTag solid color="gray">OLD VERSION</FTTag>
  </div>
</div>

```vue
<FTTag solid>DISABLED</FTTag>
<FTTag solid color="blue">SCHEDULED</FTTag>
<FTTag solid color="green">ACTIVE</FTTag>
```

## Normal Tag

Normal tags are interactive chips with a leading circle icon and trailing xmark (removable). Colors progress through shade stepping on interaction, not opacity. States include default, hover, disabled, and locked variants.

### States

The color system uses shade stepping for state changes:
- **Default**: Medium shade (e.g., pink-400 #E96092)
- **Hover**: One shade darker (e.g., pink-500 #D52454)
- **Disabled**: One shade lighter (e.g., pink-300 #F4B0C8)
- **Locked (default)**: Same as hover shade, gray text
- **Locked (disabled)**: Lightest shade (e.g., pink-200 #FAD7E4)

<div class="demo demo--col">
  <div class="demo-label">Default State</div>
  <div class="demo-row">
    <FTTag solid color="pink" leadingIcon="circle" removable>Pink</FTTag>
    <FTTag solid color="blue" leadingIcon="circle" removable>Blue</FTTag>
    <FTTag solid color="green" leadingIcon="circle" removable>Green</FTTag>
  </div>
  <div class="demo-label">Disabled State</div>
  <div class="demo-row">
    <FTTag solid color="pink" leadingIcon="circle" removable disabled>Pink</FTTag>
    <FTTag solid color="blue" leadingIcon="circle" removable disabled>Blue</FTTag>
    <FTTag solid color="green" leadingIcon="circle" removable disabled>Green</FTTag>
  </div>
  <div class="demo-label">Locked State</div>
  <div class="demo-row">
    <FTTag solid color="pink" leadingIcon="circle" locked>Pink</FTTag>
    <FTTag solid color="blue" leadingIcon="circle" locked>Blue</FTTag>
    <FTTag solid color="green" leadingIcon="circle" locked>Green</FTTag>
  </div>
</div>

```vue
<FTTag solid color="pink" leadingIcon="circle" removable>Pink</FTTag>
<FTTag solid color="pink" leadingIcon="circle" removable disabled>Pink Disabled</FTTag>
<FTTag solid color="pink" leadingIcon="circle" locked>Pink Locked</FTTag>
```

## Selection Tag

Selection tags are neutral/solid toggles used as selectable chips. The neutral state (unselected) uses a light background with dark text. The solid state (selected) uses a dark/black background with white text. Icons include a leading circle and trailing xmark.

### States

- **Default (unselected)**: Light neutral background (#F5F5F5), dark text
- **Hover (unselected)**: Slightly darker (#E5E5E5), dark text
- **Focused (selected)**: Black background (#000000), white text
- **Disabled (unselected)**: Neutral background, faded text (#CACACA)
- **Locked (unselected)**: Neutral background, gray text (#959595)
- **Locked (selected)**: Dark background, gray text

<div class="demo demo--col">
  <div class="demo-label">Unselected (Default)</div>
  <div class="demo-row">
    <FTTag leadingIcon="circle" removable>Option A</FTTag>
    <FTTag leadingIcon="circle" removable>Option B</FTTag>
    <FTTag leadingIcon="circle" removable>Option C</FTTag>
  </div>
  <div class="demo-label">Selected (Solid)</div>
  <div class="demo-row">
    <FTTag solid leadingIcon="circle" removable>Option A</FTTag>
    <FTTag solid leadingIcon="circle" removable>Option B</FTTag>
    <FTTag solid leadingIcon="circle" removable>Option C</FTTag>
  </div>
  <div class="demo-label">Disabled (Unselected)</div>
  <div class="demo-row">
    <FTTag leadingIcon="circle" removable disabled>Option A</FTTag>
    <FTTag leadingIcon="circle" removable disabled>Option B</FTTag>
  </div>
  <div class="demo-label">Locked (Unselected)</div>
  <div class="demo-row">
    <FTTag leadingIcon="circle" removable locked>Option A</FTTag>
    <FTTag leadingIcon="circle" removable locked>Option B</FTTag>
  </div>
  <div class="demo-label">Locked (Selected)</div>
  <div class="demo-row">
    <FTTag solid leadingIcon="circle" removable locked>Option A</FTTag>
    <FTTag solid leadingIcon="circle" removable locked>Option B</FTTag>
  </div>
</div>

```vue
<!-- Unselected -->
<FTTag leadingIcon="circle" removable>Option</FTTag>

<!-- Selected -->
<FTTag solid leadingIcon="circle" removable>Option</FTTag>

<!-- Disabled -->
<FTTag leadingIcon="circle" removable disabled>Option</FTTag>

<!-- Locked -->
<FTTag leadingIcon="circle" removable locked>Option</FTTag>
```

## Colors

Tags support 8 color variants available in both solid and light (neutral) styles.

### Solid

<div class="demo">
  <FTTag solid>Default</FTTag>
  <FTTag solid color="pink">Pink</FTTag>
  <FTTag solid color="blue">Blue</FTTag>
  <FTTag solid color="green">Green</FTTag>
  <FTTag solid color="red">Red</FTTag>
  <FTTag solid color="orange">Orange</FTTag>
  <FTTag solid color="purple">Purple</FTTag>
  <FTTag solid color="gray">Gray</FTTag>
</div>

### Light

<div class="demo">
  <FTTag>Default</FTTag>
  <FTTag color="pink">Pink</FTTag>
  <FTTag color="blue">Blue</FTTag>
  <FTTag color="green">Green</FTTag>
  <FTTag color="red">Red</FTTag>
  <FTTag color="orange">Orange</FTTag>
  <FTTag color="purple">Purple</FTTag>
  <FTTag color="gray">Gray</FTTag>
</div>

```vue
<FTTag solid color="pink">Pink Solid</FTTag>
<FTTag color="blue">Blue Light</FTTag>
```

## Sizes

Tags support three size variations: large (32px), medium (24px), and small (20px).

<div class="demo">
  <FTTag solid size="lg">Large (32px)</FTTag>
  <FTTag solid size="md">Medium (24px)</FTTag>
  <FTTag solid size="sm">Small (20px)</FTTag>
</div>

```vue
<FTTag size="lg">Large</FTTag>
<FTTag size="md">Medium</FTTag>
<FTTag size="sm">Small</FTTag>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `solid` | `boolean` | `false` | Solid/filled background variant (selected state for Selection Tags) |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Tag size: lg (32px), md (24px), sm (20px) |
| `color` | `string` | `'default'` | Color variant: pink, blue, green, red, orange, purple, gray |
| `leadingIcon` | `string` | `undefined` | Font Awesome icon name for leading position |
| `trailingIcon` | `string` | `undefined` | Font Awesome icon name for trailing position |
| `removable` | `boolean` | `false` | Shows xmark icon and emits remove event |
| `disabled` | `boolean` | `false` | Disables interaction (lighter shade for Normal Tags, faded text for Selection Tags) |
| `locked` | `boolean` | `false` | Shows lock icon, prevents removal |
| `ariaLabel` | `string` | `undefined` | Custom accessible label |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted on tag click (not emitted when disabled or locked) |
| `remove` | `void` | Emitted when remove icon clicked or Delete/Backspace key pressed |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-tag-height-sm` | `20px` | Small tag height |
| `--ft-tag-height-md` | `24px` | Medium tag height |
| `--ft-tag-height-lg` | `32px` | Large tag height |
| `--ft-tag-font-size` | `12px` | Tag text size |
| `--ft-tag-font-weight` | `var(--ft-font-weight-bold)` | Tag text weight |
| `--ft-tag-icon-size` | `14px` | Icon size |
| `--ft-tag-padding-x` | `8px` | Horizontal padding |
| `--ft-tag-gap` | `4px` | Gap between icon and text |
| `--ft-tag-border-radius` | `4px` | Corner radius |
