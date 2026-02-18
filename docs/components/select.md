# Select

The `FTSelect` component is a custom dropdown select with keyboard navigation, search/filter, clearable selection, and validation states. It maps to the **Dropdown-base** section in DSP-Master (54+ variants).

## Usage

### Composition API (script setup)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FTSelect } from '@fasttrack-solutions/vue-components-lib'
import type { SelectOption } from '@fasttrack-solutions/vue-components-lib'

const selected = ref(null)
const options: SelectOption[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
]
</script>

<template>
  <FTSelect v-model="selected" :options="options" label="Choose one" />
</template>
```

## Default

<script setup>
import { ref } from 'vue'

const basic = ref(null)
const basicOptions = [
  { value: 'analytics', label: 'Analytics' },
  { value: 'reports', label: 'Reports' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'settings', label: 'Settings' },
]

const withValue = ref('reports')
const clearableVal = ref('analytics')
const searchVal = ref(null)
const searchOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'pt', label: 'Portugal' },
  { value: 'se', label: 'Sweden' },
  { value: 'mt', label: 'Malta' },
]
const errorVal = ref(null)
const successVal = ref('dashboard')
const disabledVal = ref('analytics')
const disabledOpts = ref(null)
const disabledOptsOptions = [
  { value: 'a', label: 'Available' },
  { value: 'b', label: 'Also available' },
  { value: 'c', label: 'Not available', disabled: true },
]
</script>

A basic select with label and placeholder.

<div class="demo">
  <FTSelect v-model="basic" :options="basicOptions" label="Category" placeholder="Choose a category" />
</div>

```vue
<FTSelect v-model="val" :options="options" label="Category" placeholder="Choose a category" />
```

## Pre-selected Value

<div class="demo">
  <FTSelect v-model="withValue" :options="basicOptions" label="Category" />
</div>

```vue
<FTSelect v-model="val" :options="options" label="Category" />
```

## Clearable

Allow clearing the selected value.

<div class="demo">
  <FTSelect v-model="clearableVal" :options="basicOptions" label="Category" clearable />
</div>

```vue
<FTSelect v-model="val" :options="options" label="Category" clearable />
```

## Searchable

Enable filtering options by typing.

<div class="demo">
  <FTSelect v-model="searchVal" :options="searchOptions" label="Country" placeholder="Select a country" searchable />
</div>

```vue
<FTSelect v-model="val" :options="countries" label="Country" searchable />
```

## Validation States

### Error

<div class="demo">
  <FTSelect v-model="errorVal" :options="basicOptions" label="Category" error-message="Please select a category" />
</div>

```vue
<FTSelect v-model="val" :options="options" label="Category" error-message="Please select a category" />
```

### Success

<div class="demo">
  <FTSelect v-model="successVal" :options="basicOptions" label="Category" success helper-text="Great choice!" />
</div>

```vue
<FTSelect v-model="val" :options="options" label="Category" success helper-text="Great choice!" />
```

## Disabled

### Disabled select

<div class="demo">
  <FTSelect v-model="disabledVal" :options="basicOptions" label="Category" disabled />
</div>

### Disabled options

Individual options can be disabled.

<div class="demo">
  <FTSelect v-model="disabledOpts" :options="disabledOptsOptions" label="Availability" />
</div>

```vue
const options = [
  { value: 'a', label: 'Available' },
  { value: 'b', label: 'Also available' },
  { value: 'c', label: 'Not available', disabled: true },
]
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| null` | `null` | Selected value (v-model) |
| `options` | `SelectOption[]` | `[]` | Available options |
| `label` | `string` | `undefined` | Label text above the select |
| `placeholder` | `string` | `'Select...'` | Placeholder when no value selected |
| `helperText` | `string` | `undefined` | Helper text below the select |
| `errorMessage` | `string` | `undefined` | Error message (triggers error styling) |
| `success` | `boolean` | `false` | Success state styling |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Required field (shows asterisk) |
| `searchable` | `boolean` | `false` | Enable search/filter in dropdown |
| `clearable` | `boolean` | `false` | Show clear button when value selected |
| `ariaLabel` | `string` | `undefined` | Accessible label |

### SelectOption

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `value` | `string \| number` | yes | Unique option value |
| `label` | `string` | yes | Display text |
| `disabled` | `boolean` | no | Disable this option |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number \| null` | Emitted on selection (v-model) |
| `change` | `string \| number \| null` | Emitted when selection changes |
| `open` | — | Emitted when dropdown opens |
| `close` | — | Emitted when dropdown closes |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-select-height` | `36px` | Trigger height |
| `--ft-select-font-size` | `14px` | Text size |
| `--ft-select-border-radius` | `4px` | Corner radius |
| `--ft-select-bg` | `var(--ft-color-neutral-white-50)` | Trigger background |
| `--ft-select-fg` | `var(--ft-color-on-surface-base)` | Text color |
| `--ft-select-border-color` | `var(--ft-color-border-base)` | Default border |
| `--ft-select-border-color-hover` | `var(--ft-color-border-strong)` | Hover border |
| `--ft-select-border-color-focus` | `var(--ft-color-border-focus)` | Focus/open border |
| `--ft-select-border-color-error` | `var(--ft-color-error-base)` | Error border |
| `--ft-select-border-color-success` | `var(--ft-color-success-base)` | Success border |
| `--ft-select-dropdown-bg` | `var(--ft-color-neutral-white-50)` | Dropdown background |
| `--ft-select-dropdown-shadow` | `0 4px 16px rgba(0,0,0,0.12)` | Dropdown shadow |
| `--ft-select-dropdown-max-height` | `240px` | Max dropdown height |
| `--ft-select-option-height` | `36px` | Option row height |
| `--ft-select-option-bg-hover` | `var(--ft-color-neutral-lightest)` | Option hover bg |
| `--ft-select-option-check-color` | `var(--ft-color-primary-base)` | Selected check color |

## Accessibility

- Trigger uses `role="combobox"` with `aria-expanded` and `aria-haspopup="listbox"`
- Options use `role="option"` with `aria-selected` and `aria-disabled`
- Full keyboard navigation: `ArrowDown`/`ArrowUp` to navigate, `Enter`/`Space` to select, `Escape` to close
- Focus ring on `:focus-visible`
- Error state sets `aria-invalid="true"`
- Helper/error text linked via `aria-describedby`

## Figma Reference

- **DSP-Master:** Dropdown-base (54+ variants)
- **Variants:** Type=Default/Search, Status=Default/Open/Hover/Disabled/Error
