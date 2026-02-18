<template>
  <section
    class="ft-panel"
    :class="{
      'ft-panel--bordered': bordered,
    }"
  >
    <!-- Panel Header -->
    <header v-if="title || $slots.header" class="ft-panel__header">
      <div class="ft-panel__header-left">
        <div class="ft-panel__title-row">
          <h3 class="ft-panel__title">{{ title }}</h3>
          <button
            v-if="infoIcon"
            class="ft-panel__info-btn"
            type="button"
            :aria-label="infoAriaLabel"
            @click="$emit('info-click')"
          >
            <i class="fa-solid fa-circle-info" />
          </button>
        </div>
        <p v-if="description" class="ft-panel__description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="ft-panel__header-right">
        <slot name="actions" />
      </div>
    </header>

    <!-- Custom header slot (replaces default header entirely) -->
    <slot v-if="$slots.header && !title" name="header" />

    <!-- Panel Content -->
    <div class="ft-panel__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface FTPanelProps {
  title?: string
  description?: string
  infoIcon?: boolean
  bordered?: boolean
  infoAriaLabel?: string
}

withDefaults(defineProps<FTPanelProps>(), {
  title: undefined,
  description: undefined,
  infoIcon: false,
  bordered: false,
  infoAriaLabel: 'More information',
})

defineEmits<{
  'info-click': []
}>()
</script>

<style>
:root {
  --ft-panel-bg: var(--ft-color-surface-base);
  --ft-panel-padding: var(--ft-spacing-xl, 32px);
  --ft-panel-gap: var(--ft-spacing-md, 16px);
  --ft-panel-border-color: var(--ft-color-border-base);
  --ft-panel-border-radius: 0;
  --ft-panel-title-size: 20px;
  --ft-panel-title-weight: var(--ft-font-weight-bold);
  --ft-panel-title-color: var(--ft-color-on-surface-base);
  --ft-panel-description-size: 14px;
  --ft-panel-description-color: var(--ft-color-on-surface-base);
  --ft-panel-title-gap: var(--ft-spacing-xs, 4px);
  --ft-panel-info-icon-size: 16px;
  --ft-panel-info-icon-container: 20px;
  --ft-panel-info-icon-color: var(--ft-color-on-surface-base);
  --ft-panel-actions-gap: var(--ft-spacing-sm, 8px);
  --ft-panel-content-bg: var(--ft-color-surface-secondary);
  --ft-panel-focus-ring: var(--ft-color-focus-ring-base);
}
</style>

<style scoped>
.ft-panel {
  display: flex;
  flex-direction: column;
  gap: var(--ft-panel-gap);
  padding: var(--ft-panel-padding);
  background: var(--ft-panel-bg);
  border-radius: var(--ft-panel-border-radius);
}

.ft-panel--bordered {
  border: 1px solid var(--ft-panel-border-color);
}

.ft-panel__header {
  display: flex;
  align-items: center;
  gap: var(--ft-panel-gap);
  width: 100%;
}

.ft-panel__header-left {
  display: flex;
  flex-direction: column;
  gap: var(--ft-panel-title-gap);
  flex: 1;
  min-width: 0;
}

.ft-panel__title-row {
  display: flex;
  align-items: center;
  gap: var(--ft-panel-actions-gap);
}

.ft-panel__title {
  margin: 0;
  font-family: var(--ft-font-family-text), sans-serif;
  font-size: var(--ft-panel-title-size);
  font-weight: var(--ft-panel-title-weight);
  color: var(--ft-panel-title-color);
  line-height: 1;
  white-space: nowrap;
}

.ft-panel__info-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-panel-info-icon-container);
  height: var(--ft-panel-info-icon-container);
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ft-panel-info-icon-color);
  flex-shrink: 0;
}

.ft-panel__info-btn i {
  font-size: var(--ft-panel-info-icon-size);
}

.ft-panel__info-btn:focus-visible {
  outline: 2px solid var(--ft-panel-focus-ring);
  outline-offset: 2px;
  border-radius: 4px;
}

.ft-panel__description {
  margin: 0;
  font-family: var(--ft-font-family-text), sans-serif;
  font-size: var(--ft-panel-description-size);
  font-weight: normal;
  color: var(--ft-panel-description-color);
  line-height: 1;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.ft-panel__header-right {
  display: flex;
  align-items: center;
  gap: var(--ft-panel-actions-gap);
  flex-shrink: 0;
}

.ft-panel__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
</style>
