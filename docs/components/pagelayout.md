# Page Layout

The `FTPageLayout` component is the master grid for full-page composition. It provides a CSS Grid with three zones: a sidebar column (56px), a header row (50px), and a scrollable content area — matching the Figma page template.

## Usage

### Composition API (script setup)

```vue
<script lang="ts" setup>
  import { FTPageLayout } from '@fasttrack-solutions/vue-components-lib';
  import { FTSideMenu } from '@fasttrack-solutions/vue-components-lib';
  import { FTHeader } from '@fasttrack-solutions/vue-components-lib';
  import { FTBreadcrumb } from '@fasttrack-solutions/vue-components-lib';
  import { FTPanel } from '@fasttrack-solutions/vue-components-lib';
</script>

<template>
  <FTPageLayout>
    <template #sidebar>
      <FTSideMenu :top-items="navItems" />
    </template>
    <template #header>
      <FTHeader>
        <template #breadcrumb>
          <FTBreadcrumb :items="breadcrumbItems" />
        </template>
      </FTHeader>
    </template>
    <FTPanel title="Content">
      <p>Page content here</p>
    </FTPanel>
  </FTPageLayout>
</template>
```

## Full Page Demo

<div class="demo" style="padding: 0; height: 500px; overflow: hidden; border-radius: 8px; border: 1px solid var(--ft-color-border-base);">
  <FTPageLayout style="height: 500px;">
    <template #sidebar>
      <FTSideMenu
        :top-items="[
          { key: 'search', icon: 'fas fa-magnifying-glass', label: 'Search' },
          { key: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics', active: true },
          { key: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' },
          { key: 'universe', icon: 'fas fa-globe', label: 'Universe' }
        ]"
        :bottom-items="[
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
    </template>
    <template #header>
      <FTHeader>
        <template #breadcrumb>
          <FTBreadcrumb :items="[
            { key: '1', label: 'Level 1' },
            { key: '2', label: 'Level 2' },
            { key: '3', label: 'Level 3' },
            { key: '10', label: 'Level 10' },
            { key: '11', label: 'Level 11' },
            { key: '12', label: 'Level 12' }
          ]" />
        </template>
        <template #actions>
          <FTButton>Button text</FTButton>
          <FTButton primary>Button text</FTButton>
        </template>
      </FTHeader>
    </template>
    <FTPanel title="Title" info-icon description="Sub-Title">
      <template #actions>
        <FTToggle :model-value="true" label="Toggle" />
      </template>
      <div style="background: var(--ft-color-surface-secondary); padding: 32px; display: flex; align-items: center; justify-content: center; min-height: 300px;">
        <span style="font-weight: bold; color: var(--ft-color-on-surface-base); font-size: 20px;">To delete and add content</span>
      </div>
    </FTPanel>
  </FTPageLayout>
</div>

## Slots

| Slot | Description |
|------|-------------|
| `sidebar` | Left column — typically an `FTSideMenu` |
| `header` | Top row — typically an `FTHeader` with `FTBreadcrumb` |
| `default` | Content area — panels, forms, tables, etc. |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-page-layout-sidebar-width` | `56px` | Sidebar column width |
| `--ft-page-layout-header-height` | `50px` | Header row height |
| `--ft-page-layout-content-bg` | `var(--ft-color-surface-secondary)` | Content area background |
| `--ft-page-layout-content-padding` | `var(--ft-spacing-xl, 32px)` | Content area padding |

## Figma Reference

- **Sandbox:** Page Template (1920x1080)
- **Node ID:** `3:5535` (full page composite)
