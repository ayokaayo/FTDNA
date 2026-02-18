<template>
  <header class="ft-header">
    <div class="ft-header__left">
      <slot name="breadcrumb" />
    </div>
    <div v-if="$slots.actions" class="ft-header__right">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style>
:root {
  --ft-header-height: 50px;
  --ft-header-bg: var(--ft-color-surface-base);
  --ft-header-border-color: var(--ft-color-border-base);
  --ft-header-padding-x: var(--ft-spacing-xl, 32px);
  --ft-header-actions-gap: var(--ft-spacing-sm, 8px);
}
</style>

<style scoped>
.ft-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--ft-header-height);
  padding: 0 var(--ft-header-padding-x);
  background: var(--ft-header-bg);
  border-bottom: 1px solid var(--ft-header-border-color);
  flex-shrink: 0;
}

.ft-header__left {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
}

.ft-header__right {
  display: flex;
  align-items: center;
  gap: var(--ft-header-actions-gap);
  flex-shrink: 0;
}
</style>
