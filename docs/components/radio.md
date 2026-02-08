# Radio

The `FTRadio` component replaces the standard HTML radio button with the FastTrack design theme. It supports v-model binding for group selection, disabled states, and a flipped layout option.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { FTRadio } from '@fasttrack-solutions/vue-components-lib';
  const weather = ref('rain');
</script>

<template>
  <FTRadio value="rain" v-model="weather">Rain</FTRadio>
  <FTRadio value="sun" v-model="weather">Sun</FTRadio>
</template>
```

### Options API

```vue
<script>
  import { FTRadio } from '@fasttrack-solutions/vue-components-lib';
  export default {
    components: { FTRadio }
  }
</script>
```

## Checks

### Radio group

Radio buttons share a v-model. Only one can be selected at a time.

<div class="demo demo--col">
  <div class="demo-label">Radio group</div>
  <div class="demo-row">
    <FTRadio value="rain" checked>Rain (selected)</FTRadio>
    <FTRadio value="sun">Sun</FTRadio>
  </div>
</div>

```vue
<script lang="ts" setup>
const weather = ref('rain');
</script>

<template>
  <FTRadio value="rain" v-model="weather">Rain</FTRadio>
  <FTRadio value="sun" v-model="weather">Sun</FTRadio>
</template>
```

## Disabled

Disabled radios are visually faded and non-interactive.

<div class="demo demo--col">
  <div class="demo-label">Disabled</div>
  <div class="demo-row">
    <FTRadio value="rain" checked disabled>Rain (selected)</FTRadio>
    <FTRadio value="sun" disabled>Sun</FTRadio>
  </div>
</div>

```vue
<FTRadio value="rain" disabled v-model="weather">Rain</FTRadio>
<FTRadio value="sun" disabled v-model="weather">Sun</FTRadio>
```

## Flipped

The flipped variant places the label before the radio button.

<div class="demo demo--col">
  <div class="demo-label">Flipped</div>
  <div class="demo-row">
    <FTRadio value="rain" checked flipped>Rain (selected)</FTRadio>
    <FTRadio value="sun" flipped>Sun</FTRadio>
  </div>
</div>

```vue
<FTRadio value="rain" flipped v-model="weather">Rain</FTRadio>
<FTRadio value="sun" flipped v-model="weather">Sun</FTRadio>
```

## Without labels

Radio buttons can be used without labels for compact layouts.

<div class="demo demo--col">
  <div class="demo-label">No labels</div>
  <div class="demo-row">
    <FTRadio value="a" checked></FTRadio>
    <FTRadio value="b"></FTRadio>
  </div>
</div>

```vue
<FTRadio value="a" v-model="selected"></FTRadio>
<FTRadio value="b" v-model="selected"></FTRadio>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `undefined` | v-model binding for the selected value |
| `value` | `string` | *required* | The value this radio represents |
| `disabled` | `boolean` | `false` | Disables interaction and fades the component |
| `flipped` | `boolean` | `false` | Places the label before the radio button |
| `ariaLabel` | `string` | `undefined` | Custom accessible label |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the radio is selected |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-radio-checked-color` | `var(--ft-color-brand-pink-400)` | Selected state border and dot colour |
| `--ft-radio-border-color` | `var(--ft-color-neutral-gray-500)` | Unselected border colour |
| `--ft-radio-size` | `20px` | Circle dimensions |
| `--ft-radio-dot-size` | `10px` | Inner dot size when selected |
| `--ft-radio-gap` | `5px` | Gap between circle and label |
| `--ft-radio-border-width` | `2px` | Border thickness |
| `--ft-radio-disabled-opacity` | `0.5` | Opacity when disabled |
