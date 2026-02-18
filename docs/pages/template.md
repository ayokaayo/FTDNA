---
layout: page
title: Page Template
---

<script setup>
import { ref } from 'vue'

const breadcrumbItems = [
  { key: '1', label: 'Level 1' },
  { key: '2', label: 'Level 2' },
  { key: '3', label: 'Level 3' },
  { key: '4', label: 'Level 4' },
  { key: '5', label: 'Level 5' },
  { key: '6', label: 'Level 6' },
  { key: '7', label: 'Level 7' },
  { key: '8', label: 'Level 8' },
  { key: '9', label: 'Level 9' },
  { key: '10', label: 'Level 10' },
  { key: '11', label: 'Level 11' },
  { key: '12', label: 'Level 12' },
]

const sideMenuTopItems = [
  { key: 'search', icon: 'fas fa-magnifying-glass', label: 'Search' },
  { key: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics' },
  { key: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' },
  { key: 'universe', icon: 'fas fa-globe', label: 'Universe' },
]

const sideMenuBottomItems = [
  { key: 'docs', icon: 'fas fa-book-open', label: 'Documentation' },
  { key: 'settings', icon: 'fas fa-gear', label: 'Settings' },
  { key: 'tools', icon: 'fas fa-wrench', label: 'Tools' },
]

const clocks = [
  { time: '4:06', zone: 'UTC', icon: 'fas fa-moon' },
  { time: '12:06', zone: 'PHT', icon: 'fas fa-sun' },
]

const toggleOn = ref(true)
</script>

<style scoped>
.page-template-wrapper {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.panel-content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--ft-color-surface-secondary);
  font-family: var(--ft-font-family-text), sans-serif;
  font-weight: var(--ft-font-weight-bold);
  font-size: 20px;
  color: var(--ft-color-on-surface-base);
}

.header-icon-group {
  display: flex;
  align-items: center;
  gap: 0;
}

.panel-action-group {
  display: flex;
  align-items: center;
  gap: var(--ft-spacing-sm, 8px);
}

.panel-icon-group {
  display: flex;
  align-items: center;
  gap: 0;
}
</style>

<div class="page-template-wrapper">
  <FTPageLayout>
    <template #sidebar>
      <FTSideMenu
        :top-items="sideMenuTopItems"
        :bottom-items="sideMenuBottomItems"
        :clocks="clocks"
      >
        <template #logo>
          <FTLogo variant="colour-white" size="icon" aria-label="Fast Track home" />
        </template>
      </FTSideMenu>
    </template>
    <template #header>
      <FTHeader>
        <template #breadcrumb>
          <FTBreadcrumb :items="breadcrumbItems" />
        </template>
        <template #actions>
          <div class="header-icon-group">
            <FTButton icon-only leading-icon="circle-info" aria-label="Info" />
            <FTButton icon-only leading-icon="clock-rotate-left" aria-label="Change log" />
            <FTButton icon-only leading-icon="lock" aria-label="Lock" />
          </div>
          <FTButton secondary>Button text</FTButton>
          <FTButton primary>Button text</FTButton>
          <FTButton icon-only leading-icon="ellipsis-vertical" aria-label="More options" />
        </template>
      </FTHeader>
    </template>
    <FTPanel title="Title" info-icon description="Sub-Title">
      <template #actions>
        <div class="panel-action-group">
          <FTButton icon-only leading-icon="magnifying-glass" icon-size="sm" aria-label="Search" />
          <FTToggle v-model="toggleOn" label="Toggle" />
          <div class="panel-icon-group">
            <FTButton icon-only leading-icon="arrows-rotate" icon-size="sm" aria-label="Refresh" />
            <FTButton icon-only leading-icon="gear" icon-size="sm" aria-label="Settings" />
          </div>
          <FTButton icon-only leading-icon="ellipsis-vertical" icon-size="sm" aria-label="More options" />
        </div>
      </template>
      <div class="panel-content-placeholder">
        To delete and add content
      </div>
    </FTPanel>
  </FTPageLayout>
</div>
