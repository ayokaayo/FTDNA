# FTButton

The `FTButton` component is the primary interactive element for triggering actions. It maps directly to the **Buttons** section in DSP-Master with 5 type variants, 4 interactive states, and icon support.

## Usage

### Composition API (script setup)

```vue
<script setup lang="ts">
import { FTButton } from '@fasttrack-solutions/vue-components-lib'
</script>

<template>
  <FTButton primary>Primary Button</FTButton>
  <FTButton secondary>Secondary Button</FTButton>
  <FTButton tertiary>Tertiary Button</FTButton>
</template>
```

### Options API

```vue
<script lang="ts">
import { defineComponent } from 'vue'
import { FTButton } from '@fasttrack-solutions/vue-components-lib'

export default defineComponent({
  components: { FTButton }
})
</script>

<template>
  <FTButton primary>Primary Button</FTButton>
</template>
```

## Styles

The `FTButton` component supports five style variants, mapping to the Figma naming convention:

| Vue prop | Figma Type | Visual |
|----------|-----------|--------|
| `primary` (default) | main | Solid pink pill |
| `secondary` | alt | Pink text, no background |
| `tertiary` | sub | Solid dark pill |
| `action` | plus | Outlined, trailing icon |
| `iconOnly` | icon | Circular icon button |

<div class="demo">
  <FTButton primary>Primary</FTButton>
  <FTButton secondary>Secondary</FTButton>
  <FTButton tertiary>Tertiary</FTButton>
  <FTButton action>Action</FTButton>
  <FTButton icon-only leading-icon="refresh" aria-label="Refresh" />
</div>

```vue
<FTButton primary>Primary</FTButton>
<FTButton secondary>Secondary</FTButton>
<FTButton tertiary>Tertiary</FTButton>
<FTButton action>Action</FTButton>
<FTButton icon-only leading-icon="refresh" aria-label="Refresh" />
```

## Statuses

Each button variant supports four interactive states handled by CSS:

- **Default** — Normal resting state
- **Hover** — Mouse over the button
- **Focused** — Keyboard focus (focus-visible)
- **Disabled** — Non-interactive

## Disabled State

Disable the button with the `disabled` prop. Disabled buttons are non-interactive and visually muted.

<div class="demo">
  <FTButton primary disabled>Primary</FTButton>
  <FTButton secondary disabled>Secondary</FTButton>
  <FTButton tertiary disabled>Tertiary</FTButton>
  <FTButton action disabled>Action</FTButton>
</div>

```vue
<FTButton primary disabled>Primary</FTButton>
<FTButton secondary disabled>Secondary</FTButton>
<FTButton tertiary disabled>Tertiary</FTButton>
<FTButton action disabled>Action</FTButton>
```

## Loading State

Show a loading spinner with the `loading` prop. The button becomes non-interactive while loading.

<div class="demo">
  <FTButton primary loading>Saving...</FTButton>
  <FTButton tertiary loading>Loading...</FTButton>
</div>

```vue
<FTButton primary loading>Saving...</FTButton>
<FTButton tertiary loading>Loading...</FTButton>
```

## Icons

### Leading Icon

Add a leading icon using the `leading-icon` prop with a Font Awesome icon name.

<div class="demo">
  <FTButton primary leading-icon="smile">With Icon</FTButton>
  <FTButton secondary leading-icon="star">Favourite</FTButton>
  <FTButton tertiary leading-icon="save">Save</FTButton>
</div>

```vue
<FTButton primary leading-icon="smile">With Icon</FTButton>
<FTButton secondary leading-icon="star">Favourite</FTButton>
<FTButton tertiary leading-icon="save">Save</FTButton>
```

### Trailing Icon (Action type)

The `action` variant shows a trailing icon (defaults to `plus`, customisable via `trailing-icon`).

<div class="demo">
  <FTButton action>Add New</FTButton>
  <FTButton action trailing-icon="language">Translate</FTButton>
</div>

```vue
<FTButton action>Add New</FTButton>
<FTButton action trailing-icon="language">Translate</FTButton>
```

## Icon Only

Circular icon-only buttons with three sizes: `sm` (24px), `md` (32px), `lg` (40px).

<div class="demo">
  <FTButton icon-only leading-icon="refresh" icon-size="sm" aria-label="Refresh small" />
  <FTButton icon-only leading-icon="refresh" icon-size="md" aria-label="Refresh medium" />
  <FTButton icon-only leading-icon="refresh" icon-size="lg" aria-label="Refresh large" />
</div>

```vue
<FTButton icon-only leading-icon="refresh" icon-size="sm" aria-label="Refresh small" />
<FTButton icon-only leading-icon="refresh" icon-size="md" aria-label="Refresh medium" />
<FTButton icon-only leading-icon="refresh" icon-size="lg" aria-label="Refresh large" />
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `primary` | `boolean` | `true`* | Solid pink CTA button (Figma: main) |
| `secondary` | `boolean` | `false` | Pink text, no background (Figma: alt) |
| `tertiary` | `boolean` | `false` | Solid dark button (Figma: sub) |
| `action` | `boolean` | `false` | Outlined with trailing icon (Figma: plus) |
| `iconOnly` | `boolean` | `false` | Circular icon-only button (Figma: icon) |
| `iconSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Icon-only button size (24/32/40px) |
| `leadingIcon` | `string` | `undefined` | Font Awesome icon name for leading position |
| `trailingIcon` | `string` | `undefined` | Font Awesome icon name for trailing position (action type defaults to `plus`) |
| `disabled` | `boolean` | `false` | Disable interaction |
| `loading` | `boolean` | `false` | Show loading spinner |
| `ariaLabel` | `string` | `undefined` | Accessible label (required for icon-only) |

\* Primary is the default when no other type variant is set.

## CSS

All button styling uses CSS custom properties for theming. These can be overridden at any level.

| CSS Variable | Default Value | Description |
|-------------|---------------|-------------|
| `--ft-btn-height` | `32px` | Button height |
| `--ft-btn-font-size` | `12px` | Text size (CTA style) |
| `--ft-btn-font-weight` | `var(--ft-font-weight-bold)` | Font weight |
| `--ft-btn-line-height` | `16px` | Line height |
| `--ft-btn-gap` | `4px` | Gap between icon and text |
| `--ft-btn-padding-icon-side` | `8px` | Padding on the icon side |
| `--ft-btn-padding-text-side` | `16px` | Padding on the text side |
| `--ft-btn-border-radius-pill` | `32px` | Pill shape radius |
| `--ft-btn-border-radius-rect` | `4px` | Rect shape radius (action) |
| `--ft-btn-main-bg-default` | `var(--ft-color-primary-base)` | Primary background |
| `--ft-btn-main-bg-hover` | `var(--ft-color-primary-dark)` | Primary hover bg |
| `--ft-btn-main-bg-focused` | `var(--ft-color-primary-darker)` | Primary focused bg |
| `--ft-btn-main-bg-disabled` | `var(--ft-color-primary-light)` | Primary disabled bg |
| `--ft-btn-alt-fg-default` | `var(--ft-color-primary-base)` | Secondary text color |
| `--ft-btn-sub-bg-default` | `var(--ft-color-neutral-dark)` | Tertiary background |
| `--ft-btn-plus-fg-default` | `var(--ft-color-neutral-dark)` | Action text/border color |
| `--ft-btn-icon-size-sm` | `24px` | Icon-only small |
| `--ft-btn-icon-size-md` | `32px` | Icon-only medium |
| `--ft-btn-icon-size-lg` | `40px` | Icon-only large |

## Figma Reference

- **Section**: Buttons
- **Variants**: 40 total (5 types × 4 states × leading icon toggle)
- **Figma naming**: `Type=main\|alt\|sub\|plus\|icon, Status=default\|hover\|focused\|disabled, Size=default\|S\|M\|L, Leading icon=Yes\|No`
