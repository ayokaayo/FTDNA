# Button

The `FTButton` component is a versatile button element with multiple style options, sizes, and states. It supports icons, loading states, disabled states, and various visual styles including primary, secondary, tertiary, and action variants.

## Usage

### Composition api (script setup)

```vue
<script setup lang="ts">
  import { FTButton } from '@fasttrack-solutions/vue-components-lib';
</script>

<template>
  <FTButton primary>Primary Button</FTButton>
  <FTButton secondary>Secondary Button</FTButton>
  <FTButton tertiary>Tertiary Button</FTButton>
</template>
```

### Options api

```vue
<script>
  import { FTButton } from '@fasttrack-solutions/vue-components-lib';
  export default {
    components: { FTButton }
  }
</script>

<template>
  <FTButton primary>Primary Button</FTButton>
</template>
```

## Styles

The button component supports multiple style variants:

- **Primary** - Main action button with brand color
- **Secondary** - Alternative action with secondary styling
- **Tertiary** - Subtle button with minimal styling
- **Action** - Action-specific button styling
- **Warning** - Yellow/warning style for cautious actions
- **Success** - Green style for positive actions
- **Info** - Blue style for informational content
- **Error** - Red style for destructive actions

## Statuses

Buttons support various interactive states:

- **Active** - Visually indicates the button is active
- **Disabled** - Prevents interaction with disabled styling
- **Loading** - Shows loading state with spinner

## Disabled State

Use the `disabled` prop to prevent user interaction:

```vue
<FTButton disabled>Disabled Button</FTButton>
```

## Loading State

Use the `loading` prop to show a loading indicator:

```vue
<FTButton loading>Loading...</FTButton>
```

## Icons

Add icons to buttons using the `icon` prop:

```vue
<FTButton icon="home">Home</FTButton>
<FTButton icon="trash" error>Delete</FTButton>
```

## Icon Only

Create icon-only buttons with the `iconOnly` prop:

```vue
<FTButton icon="home" iconOnly />
<FTButton icon="heart" iconOnly />
```

## Sizes

The button supports different size variations:

```vue
<FTButton iconSmall>Small Icon</FTButton>
<FTButton iconMedium>Medium Icon</FTButton>
<FTButton iconBig>Large Icon</FTButton>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | boolean | false | Shows loading state with spinner |
| `primary` | boolean | false | Applies primary button style |
| `secondary` | boolean | false | Applies secondary button style |
| `tertiary` | boolean | false | Applies tertiary button style |
| `action` | boolean | false | Applies action button style |
| `warning` | boolean | false | Applies warning button style |
| `success` | boolean | false | Applies success button style |
| `info` | boolean | false | Applies info button style |
| `error` | boolean | false | Applies error button style |
| `icon` | string | undefined | Font Awesome icon name |
| `iconOnly` | boolean | false | Display only the icon |
| `iconSmall` | boolean | false | Use small icon size |
| `iconMedium` | boolean | false | Use medium icon size |
| `iconBig` | boolean | false | Use large icon size |
| `active` | boolean | false | Indicates button is active |
| `tooltip` | string | undefined | Tooltip text to display on hover |
| `tooltipPosition` | string | 'top' | Position of tooltip (top, bottom, left, right) |
| `disabled` | boolean | false | Disables the button |

## CSS

The button component uses the following CSS custom properties:

| CSS variable | Default Value |
|-------------|--------------|
| `--ft-btn-height` | 32px |
| `--ft-btn-font-size` | 12px |
| `--ft-btn-font-weight` | 700 |
| `--ft-btn-padding-left` | 16px |
| `--ft-btn-padding-right` | 16px |
| `--ft-btn-main-bg-default` | #E96092 |
| `--ft-btn-main-fg-default` | #FFF |
| `--ft-btn-main-bg-hover` | #D52454 |

## Examples

### Basic Buttons

```vue
<template>
  <div class="button-group">
    <FTButton primary>Primary</FTButton>
    <FTButton secondary>Secondary</FTButton>
    <FTButton tertiary>Tertiary</FTButton>
  </div>
</template>
```

### With Icons

```vue
<template>
  <div class="button-group">
    <FTButton primary icon="save">Save</FTButton>
    <FTButton error icon="trash">Delete</FTButton>
    <FTButton success icon="check">Confirm</FTButton>
  </div>
</template>
```

### Icon Only

```vue
<template>
  <div class="icon-buttons">
    <FTButton icon="home" iconOnly />
    <FTButton icon="search" iconOnly />
    <FTButton icon="settings" iconOnly />
  </div>
</template>
```
