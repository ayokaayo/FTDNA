# Input

The `FTInput` component is a versatile text input field with support for labels, validation states, icons, clearable inputs, and password visibility toggle. It maps to the **Input** section in DSP-Master with 38 variants covering type, status, and state combinations.

## Usage

### Composition API (script setup)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FTInput } from '@fasttrack-solutions/vue-components-lib'

const name = ref('')
</script>

<template>
  <FTInput v-model="name" label="Name" placeholder="Enter your name" />
</template>
```

## Default

<script setup>
import { ref } from 'vue'
const text = ref('')
const email = ref('')
const password = ref('')
const number = ref('')
const search = ref('')
const withIcon = ref('')
const clearableVal = ref('Clear me')
const errorVal = ref('Invalid input')
const successVal = ref('Looks good')
const disabledVal = ref('Cannot edit')
const readonlyVal = ref('Read only value')
const helperVal = ref('')
const requiredVal = ref('')
</script>

A basic text input with a label and placeholder.

<div class="demo">
  <FTInput v-model="text" label="Name" placeholder="Enter your name" />
</div>

```vue
<FTInput v-model="text" label="Name" placeholder="Enter your name" />
```

## Input Types

Supports common HTML input types: `text`, `email`, `password`, `number`, `search`, `tel`, `url`.

<div class="demo" style="display: flex; flex-direction: column; gap: 16px;">
  <FTInput v-model="email" type="email" label="Email" placeholder="you@example.com" />
  <FTInput v-model="password" type="password" label="Password" placeholder="Enter password" />
  <FTInput v-model="number" type="number" label="Quantity" placeholder="0" :min="0" :max="100" />
  <FTInput v-model="search" type="search" label="Search" placeholder="Search..." leading-icon="magnifying-glass" />
</div>

```vue
<FTInput v-model="email" type="email" label="Email" placeholder="you@example.com" />
<FTInput v-model="password" type="password" label="Password" placeholder="Enter password" />
<FTInput v-model="number" type="number" label="Quantity" placeholder="0" :min="0" :max="100" />
<FTInput v-model="search" type="search" label="Search" placeholder="Search..." leading-icon="magnifying-glass" />
```

## Icons

Leading and trailing icons using Font Awesome icon names.

<div class="demo" style="display: flex; flex-direction: column; gap: 16px;">
  <FTInput v-model="withIcon" label="Search" placeholder="Search..." leading-icon="magnifying-glass" />
  <FTInput v-model="withIcon" label="Website" placeholder="https://..." leading-icon="globe" trailing-icon="arrow-up-right-from-square" />
</div>

```vue
<FTInput v-model="val" label="Search" placeholder="Search..." leading-icon="magnifying-glass" />
<FTInput v-model="val" label="Website" placeholder="https://..." leading-icon="globe" trailing-icon="arrow-up-right-from-square" />
```

## Clearable

Show a clear button when the input has a value.

<div class="demo">
  <FTInput v-model="clearableVal" label="Clearable" clearable />
</div>

```vue
<FTInput v-model="val" label="Clearable" clearable />
```

## Validation States

### Error

Error state with message shown below the input.

<div class="demo">
  <FTInput v-model="errorVal" label="Email" error-message="Please enter a valid email address" />
</div>

```vue
<FTInput v-model="val" label="Email" error-message="Please enter a valid email address" />
```

### Success

Success state styling for validated fields.

<div class="demo">
  <FTInput v-model="successVal" label="Username" success helper-text="Username is available" />
</div>

```vue
<FTInput v-model="val" label="Username" success helper-text="Username is available" />
```

## Helper Text

Informational text below the input.

<div class="demo">
  <FTInput v-model="helperVal" label="Password" type="password" helper-text="Must be at least 8 characters" />
</div>

```vue
<FTInput v-model="val" label="Password" type="password" helper-text="Must be at least 8 characters" />
```

## Required

Mark a field as required with an asterisk.

<div class="demo">
  <FTInput v-model="requiredVal" label="Full Name" placeholder="Required field" required />
</div>

```vue
<FTInput v-model="val" label="Full Name" placeholder="Required field" required />
```

## Disabled & Read-only

<div class="demo" style="display: flex; flex-direction: column; gap: 16px;">
  <FTInput v-model="disabledVal" label="Disabled" disabled />
  <FTInput v-model="readonlyVal" label="Read Only" readonly />
</div>

```vue
<FTInput v-model="val" label="Disabled" disabled />
<FTInput v-model="val" label="Read Only" readonly />
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | `''` | Input value (v-model) |
| `type` | `'text' \| 'password' \| 'number' \| 'email' \| 'search' \| 'tel' \| 'url'` | `'text'` | HTML input type |
| `label` | `string` | `undefined` | Label text above the input |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `helperText` | `string` | `undefined` | Helper text below the input |
| `errorMessage` | `string` | `undefined` | Error message (triggers error styling) |
| `success` | `boolean` | `false` | Success state styling |
| `disabled` | `boolean` | `false` | Disable interaction |
| `readonly` | `boolean` | `false` | Read-only input |
| `required` | `boolean` | `false` | Required field (shows asterisk) |
| `leadingIcon` | `string` | `undefined` | Font Awesome icon name for leading position |
| `trailingIcon` | `string` | `undefined` | Font Awesome icon name for trailing position |
| `clearable` | `boolean` | `false` | Show clear button when input has value |
| `showPasswordToggle` | `boolean` | `true` | Show password visibility toggle for password type |
| `maxlength` | `number` | `undefined` | Maximum character length |
| `min` | `number` | `undefined` | Minimum value (number type) |
| `max` | `number` | `undefined` | Maximum value (number type) |
| `step` | `number` | `undefined` | Step value (number type) |
| `ariaLabel` | `string` | `undefined` | Accessible label (overrides label) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Emitted on input (v-model) |
| `focus` | `FocusEvent` | Emitted when input gains focus |
| `blur` | `FocusEvent` | Emitted when input loses focus |
| `clear` | — | Emitted when clear button is clicked |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-input-height` | `36px` | Input field height |
| `--ft-input-font-size` | `14px` | Text size |
| `--ft-input-font-weight` | `var(--ft-font-weight-regular)` | Text weight |
| `--ft-input-border-radius` | `4px` | Corner radius |
| `--ft-input-border-width` | `1px` | Border width |
| `--ft-input-padding-x` | `12px` | Horizontal padding |
| `--ft-input-label-font-size` | `12px` | Label text size |
| `--ft-input-label-font-weight` | `var(--ft-font-weight-bold)` | Label weight |
| `--ft-input-bg` | `var(--ft-color-neutral-white-50)` | Background |
| `--ft-input-fg` | `var(--ft-color-on-surface-base)` | Text color |
| `--ft-input-border-color` | `var(--ft-color-border-base)` | Default border |
| `--ft-input-border-color-hover` | `var(--ft-color-border-strong)` | Hover border |
| `--ft-input-border-color-focus` | `var(--ft-color-border-focus)` | Focus border |
| `--ft-input-border-color-error` | `var(--ft-color-error-base)` | Error border |
| `--ft-input-border-color-success` | `var(--ft-color-success-base)` | Success border |
| `--ft-input-placeholder-color` | `var(--ft-color-on-surface-tertiary)` | Placeholder color |
| `--ft-input-icon-size` | `14px` | Icon font size |
| `--ft-input-icon-color` | `var(--ft-color-on-surface-tertiary)` | Icon color |
| `--ft-input-helper-font-size` | `12px` | Helper text size |
| `--ft-input-helper-color` | `var(--ft-color-on-surface-secondary)` | Helper text color |
| `--ft-input-fg-error` | `var(--ft-color-error-base)` | Error message color |

## Accessibility

- Label is linked to input via click-to-focus and `aria-label`
- Error state sets `aria-invalid="true"`
- Helper/error text is linked via `aria-describedby`
- Required fields use `aria-required="true"`
- Password toggle and clear buttons use `tabindex="-1"` to stay out of tab order
- Focus ring matches `--ft-color-focus-ring-base` on `:focus-visible`

## Figma Reference

- **DSP-Master:** Input (38 variants)
- **Variants:** Type=Text/Password/Number/Email/Search, Status=Default/Hover/Focused/Disabled/Error/Success
