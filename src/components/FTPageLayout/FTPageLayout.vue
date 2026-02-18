<template>
  <div class="ft-page-layout">
    <aside class="ft-page-layout__sidebar">
      <slot name="sidebar" />
    </aside>
    <header class="ft-page-layout__header">
      <slot name="header" />
    </header>
    <main class="ft-page-layout__content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
:root {
  --ft-page-layout-sidebar-width: 56px;
  --ft-page-layout-header-height: 50px;
  --ft-page-layout-content-bg: var(--ft-color-surface-secondary);
  --ft-page-layout-content-padding: var(--ft-spacing-xl, 32px);
}
</style>

<style scoped>
.ft-page-layout {
  display: grid;
  grid-template-columns: var(--ft-page-layout-sidebar-width) 1fr;
  grid-template-rows: var(--ft-page-layout-header-height) 1fr;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.ft-page-layout__sidebar {
  grid-row: 1 / -1;
  grid-column: 1;
  overflow: hidden;
}

.ft-page-layout__header {
  grid-row: 1;
  grid-column: 2;
  overflow: hidden;
}

.ft-page-layout__content {
  grid-row: 2;
  grid-column: 2;
  background: var(--ft-page-layout-content-bg);
  padding: var(--ft-page-layout-content-padding);
  overflow: auto;
}
</style>
