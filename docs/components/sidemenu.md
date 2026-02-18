# Side Menu

The `FTSideMenu` component is the primary application-level navigation bar. It renders as a narrow vertical strip (56px) with a dark background, housing icon-based navigation items, optional timezone clocks, and a logo. This matches the Figma spec `Level=LVL 1, Section=Default`.

## Usage

### Composition API (script setup)

```vue
<script setup lang="ts">
import { FTSideMenu } from '@fasttrack-solutions/vue-components-lib'
import type { SideMenuItem, TimezoneClock } from '@fasttrack-solutions/vue-components-lib'

const topItems: SideMenuItem[] = [
  { key: 'search', icon: 'fas fa-magnifying-glass', label: 'Search' },
  { key: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics' },
  { key: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' },
  { key: 'universe', icon: 'fas fa-globe', label: 'Universe' }
]

const bottomItems: SideMenuItem[] = [
  { key: 'docs', icon: 'fas fa-book-open', label: 'Documentation' },
  { key: 'settings', icon: 'fas fa-gear', label: 'Settings' },
  { key: 'tools', icon: 'fas fa-wrench', label: 'Tools' }
]

const clocks: TimezoneClock[] = [
  { time: '4:06', zone: 'UTC', icon: 'fas fa-moon' },
  { time: '12:06', zone: 'PHT', icon: 'fas fa-sun' }
]

const handleItemClick = (item: SideMenuItem) => {
  console.log('Navigating to:', item.key)
}
</script>

<template>
  <FTSideMenu
    :top-items="topItems"
    :bottom-items="bottomItems"
    :clocks="clocks"
    @item-click="handleItemClick"
  />
</template>
```

## Default

The full side menu as it appears in the product, matching the Figma `Level=LVL 1, Section=Default` spec.

<div class="demo" style="background: #1a1a1a; padding: 0; height: 540px; display: flex; align-items: stretch;">
  <FTSideMenu
    :top-items="[
      { key: 'search', icon: 'fas fa-magnifying-glass', label: 'Search' },
      { key: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics', active: true },
      { key: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' },
      { key: 'universe', icon: 'fas fa-globe', label: 'Universe' }
    ]"
    :bottom-items="[
      { key: 'docs', icon: 'fas fa-book-open', label: 'Documentation' },
      { key: 'settings', icon: 'fas fa-gear', label: 'Settings' },
      { key: 'tools', icon: 'fas fa-wrench', label: 'Tools' }
    ]"
    :clocks="[
      { time: '4:06', zone: 'UTC', icon: 'fas fa-moon' },
      { time: '12:06', zone: 'PHT', icon: 'fas fa-sun' }
    ]"
  >
    <template #logo>
      <FTLogo variant="colour-white" size="icon" />
    </template>
  </FTSideMenu>
</div>

## Active State

An active item is highlighted in white to indicate the current page.

<div class="demo" style="background: #1a1a1a; padding: 0; height: 320px; display: flex; align-items: stretch;">
  <FTSideMenu
    :show-logo="false"
    :top-items="[
      { key: 'search', icon: 'fas fa-magnifying-glass', label: 'Search' },
      { key: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics', active: true },
      { key: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' }
    ]"
    :bottom-items="[
      { key: 'settings', icon: 'fas fa-gear', label: 'Settings' }
    ]"
  />
</div>

## Without Clocks

The clock section is optional. When no `clocks` are provided, the space is omitted.

<div class="demo" style="background: #1a1a1a; padding: 0; height: 320px; display: flex; align-items: stretch;">
  <FTSideMenu
    :show-logo="false"
    :top-items="[
      { key: 'search', icon: 'fas fa-magnifying-glass', label: 'Search' },
      { key: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics' }
    ]"
    :bottom-items="[
      { key: 'docs', icon: 'fas fa-book-open', label: 'Documentation' },
      { key: 'settings', icon: 'fas fa-gear', label: 'Settings' }
    ]"
  />
</div>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `topItems` | `SideMenuItem[]` | `[]` | Navigation items in the top section |
| `bottomItems` | `SideMenuItem[]` | `[]` | Navigation items in the bottom section |
| `clocks` | `TimezoneClock[]` | `[]` | Timezone clocks shown between sections |
| `showLogo` | `boolean` | `true` | Whether to show the logo area |
| `ariaLabel` | `string` | `'Side navigation'` | Accessible label for the nav landmark |

### SideMenuItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | yes | Unique identifier for the item |
| `icon` | `string` | yes | Font Awesome class (e.g. `'fas fa-gear'`) |
| `label` | `string` | yes | Tooltip text and aria-label |
| `active` | `boolean` | no | Highlights the item as current page |
| `disabled` | `boolean` | no | Grays out and disables interaction |

### TimezoneClock

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `time` | `string` | yes | Display time (e.g. `'4:06'`) |
| `zone` | `string` | yes | Timezone abbreviation (e.g. `'UTC'`) |
| `icon` | `string` | no | Day/night indicator icon |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `item-click` | `SideMenuItem` | Emitted when a non-disabled item is clicked |

## Slots

| Slot | Description |
|------|-------------|
| `logo` | Custom logo content. Replaces the default FT text |
| `top-extra` | Extra content below the top items (e.g. product logos) |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-sidemenu-bg` | `--ft-color-neutral-black-900` | Menu background |
| `--ft-sidemenu-width` | `56px` | Menu width |
| `--ft-sidemenu-icon-color` | `--ft-color-neutral-white-50` | Default icon colour |
| `--ft-sidemenu-icon-color-hover` | `--ft-color-neutral-white-50` | Hover icon colour |
| `--ft-sidemenu-icon-color-active` | `--ft-color-neutral-white-50` | Active icon colour |
| `--ft-sidemenu-icon-color-disabled` | `--ft-color-neutral-gray-600` | Disabled icon colour |
| `--ft-sidemenu-icon-size` | `16px` | Icon font size |
| `--ft-sidemenu-item-gap` | `32px` | Gap between items |
| `--ft-sidemenu-clock-zone-bg` | `--ft-color-brand-blue-500` | First clock zone badge bg |
| `--ft-sidemenu-clock-zone-bg-alt` | `--ft-color-neutral-gray-700` | Alternate clock zone badge bg |
| `--ft-sidemenu-focus-ring` | `--ft-color-focus-ring-base` | Focus outline colour |

## Accessibility

- The component renders as a `<nav>` landmark with a configurable `aria-label`
- Each icon button includes an `aria-label` matching the item's `label` prop
- Active items use `aria-current="page"`
- Keyboard support: `Tab` to focus, `Enter` or `Space` to activate
- Focus ring is visible on `:focus-visible` (2px solid, 4px offset)
- Icons are marked `aria-hidden="true"` — the label is the accessible name
