# Tabs

The `FTTabs` component organizes content into tabbed sections with three visual variants: default (bottom indicator), underline, and pills. It supports icons, badges, disabled tabs, and full keyboard navigation. Maps to the **Tabs** section in DSP-Master (32 variants).

## Usage

### Composition API (script setup)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FTTabs } from '@fasttrack-solutions/vue-components-lib'
import type { TabItem } from '@fasttrack-solutions/vue-components-lib'

const activeTab = ref('overview')
const tabs: TabItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'reports', label: 'Reports' },
]
</script>

<template>
  <FTTabs v-model="activeTab" :items="tabs">
    <div v-if="activeTab === 'overview'">Overview content</div>
    <div v-if="activeTab === 'analytics'">Analytics content</div>
    <div v-if="activeTab === 'reports'">Reports content</div>
  </FTTabs>
</template>
```

## Default

<script setup>
import { ref } from 'vue'

const active1 = ref('overview')
const tabs1 = [
  { key: 'overview', label: 'Overview' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
]

const active2 = ref('players')
const tabsIcons = [
  { key: 'players', label: 'Players', icon: 'users' },
  { key: 'games', label: 'Games', icon: 'gamepad' },
  { key: 'revenue', label: 'Revenue', icon: 'chart-line' },
]

const active3 = ref('all')
const tabsBadge = [
  { key: 'all', label: 'All', badge: 142 },
  { key: 'active', label: 'Active', badge: 89 },
  { key: 'inactive', label: 'Inactive', badge: 53 },
]

const active4 = ref('tab1')
const tabsPills = [
  { key: 'tab1', label: 'First' },
  { key: 'tab2', label: 'Second' },
  { key: 'tab3', label: 'Third' },
]

const active5 = ref('enabled')
const tabsDisabled = [
  { key: 'enabled', label: 'Enabled' },
  { key: 'also-enabled', label: 'Also enabled' },
  { key: 'disabled', label: 'Disabled', disabled: true },
]
</script>

Bottom indicator on the active tab.

<div class="demo">
  <FTTabs v-model="active1" :items="tabs1">
    <p>Content for: <strong>{{ active1 }}</strong></p>
  </FTTabs>
</div>

```vue
<FTTabs v-model="activeTab" :items="tabs">
  <p>Content for: <strong>{{ activeTab }}</strong></p>
</FTTabs>
```

## With Icons

Tabs with leading icons.

<div class="demo">
  <FTTabs v-model="active2" :items="tabsIcons">
    <p>Viewing: <strong>{{ active2 }}</strong></p>
  </FTTabs>
</div>

```vue
const tabs = [
  { key: 'players', label: 'Players', icon: 'users' },
  { key: 'games', label: 'Games', icon: 'gamepad' },
  { key: 'revenue', label: 'Revenue', icon: 'chart-line' },
]
```

## With Badges

Tabs with count badges.

<div class="demo">
  <FTTabs v-model="active3" :items="tabsBadge">
    <p>Showing: <strong>{{ active3 }}</strong></p>
  </FTTabs>
</div>

```vue
const tabs = [
  { key: 'all', label: 'All', badge: 142 },
  { key: 'active', label: 'Active', badge: 89 },
  { key: 'inactive', label: 'Inactive', badge: 53 },
]
```

## Pills Variant

Tabs styled as pill buttons.

<div class="demo">
  <FTTabs v-model="active4" :items="tabsPills" variant="pills">
    <p>Active pill: <strong>{{ active4 }}</strong></p>
  </FTTabs>
</div>

```vue
<FTTabs v-model="activeTab" :items="tabs" variant="pills" />
```

## Disabled Tabs

Individual tabs can be disabled.

<div class="demo">
  <FTTabs v-model="active5" :items="tabsDisabled">
    <p>Selected: <strong>{{ active5 }}</strong></p>
  </FTTabs>
</div>

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Active tab key (v-model) |
| `items` | `TabItem[]` | `[]` | Tab items |
| `variant` | `'default' \| 'pills' \| 'underline'` | `'default'` | Visual variant |
| `ariaLabel` | `string` | `'Tabs'` | Accessible label for the tablist |

### TabItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | yes | Unique tab identifier |
| `label` | `string` | yes | Display text |
| `icon` | `string` | no | Font Awesome icon name |
| `disabled` | `boolean` | no | Disable this tab |
| `badge` | `number \| string` | no | Badge count/text |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when active tab changes (v-model) |
| `change` | `string` | Emitted when tab selection changes |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Tab panel content (use `v-if` on `modelValue` to show/hide) |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-tabs-font-size` | `14px` | Tab label font size |
| `--ft-tabs-tab-height` | `40px` | Tab button height |
| `--ft-tabs-tab-padding-x` | `16px` | Tab horizontal padding |
| `--ft-tabs-fg` | `var(--ft-color-on-surface-secondary)` | Default text color |
| `--ft-tabs-fg-active` | `var(--ft-color-primary-base)` | Active tab color |
| `--ft-tabs-fg-disabled` | `var(--ft-color-on-surface-disabled)` | Disabled tab color |
| `--ft-tabs-border-color` | `var(--ft-color-border-base)` | Bottom border color |
| `--ft-tabs-indicator-color` | `var(--ft-color-primary-base)` | Active indicator color |
| `--ft-tabs-indicator-height` | `2px` | Indicator bar height |
| `--ft-tabs-pill-bg-active` | `var(--ft-color-neutral-lightest)` | Pills active background |
| `--ft-tabs-badge-bg` | `var(--ft-color-primary-base)` | Badge background |
| `--ft-tabs-badge-fg` | `var(--ft-color-on-primary-base)` | Badge text color |

## Accessibility

- Tab list uses `role="tablist"` with `aria-label`
- Each tab button uses `role="tab"` with `aria-selected`
- Roving tabindex: only the active tab is in the tab order
- Arrow keys navigate between tabs (`ArrowLeft`/`ArrowRight`)
- `Home`/`End` keys jump to first/last enabled tab
- Focus ring on `:focus-visible`
- Disabled tabs use `aria-disabled` and `disabled`

## Figma Reference

- **DSP-Master:** Tabs (32 variants)
- **Variants:** Type=Default/Pills/Underline, Status=Default/Active/Hover/Disabled
