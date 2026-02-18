<script setup lang="ts">
import { computed } from 'vue'

/**
 * Represents a single tab item.
 */
export interface TabItem {
  /** Unique key for the tab */
  key: string
  /** Display label */
  label: string
  /** Font Awesome icon name (optional, shown before label) */
  icon?: string
  /** Whether this tab is disabled */
  disabled?: boolean
  /** Badge count shown next to the label */
  badge?: number | string
}

interface FTTabsProps {
  /** Currently active tab key (v-model) */
  modelValue?: string
  /** Tab items */
  items?: TabItem[]
  /** Visual variant */
  variant?: 'default' | 'pills' | 'underline'
  /** Accessible label for the tablist */
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTTabsProps>(), {
  modelValue: '',
  items: () => [],
  variant: 'default',
  ariaLabel: 'Tabs',
})

const emit = defineEmits<{
  'update:modelValue': [key: string]
  'change': [key: string]
}>()

const tabsClasses = computed(() => ({
  'ft-tabs': true,
  [`ft-tabs--${props.variant}`]: true,
}))

const tabClasses = (item: TabItem) => ({
  'ft-tabs__tab': true,
  'ft-tabs__tab--active': item.key === props.modelValue,
  'ft-tabs__tab--disabled': item.disabled,
})

const handleTabClick = (item: TabItem) => {
  if (item.disabled) return
  emit('update:modelValue', item.key)
  emit('change', item.key)
}

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  const enabledItems = props.items.filter(i => !i.disabled)
  const currentEnabledIndex = enabledItems.findIndex(i => i.key === props.items[index]?.key)
  let nextItem: TabItem | undefined

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      nextItem = enabledItems[(currentEnabledIndex + 1) % enabledItems.length]
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      nextItem = enabledItems[(currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length]
      break
    case 'Home':
      event.preventDefault()
      nextItem = enabledItems[0]
      break
    case 'End':
      event.preventDefault()
      nextItem = enabledItems[enabledItems.length - 1]
      break
  }

  if (nextItem) {
    emit('update:modelValue', nextItem.key)
    emit('change', nextItem.key)
    const tabEl = document.querySelector(`[data-tab-key="${nextItem.key}"]`) as HTMLElement
    tabEl?.focus()
  }
}
</script>

<template>
  <div :class="tabsClasses">
    <div class="ft-tabs__list" role="tablist" :aria-label="ariaLabel">
      <button
        v-for="(item, index) in items"
        :key="item.key"
        :class="tabClasses(item)"
        :data-tab-key="item.key"
        role="tab"
        type="button"
        :aria-selected="item.key === modelValue"
        :aria-disabled="item.disabled || undefined"
        :disabled="item.disabled"
        :tabindex="item.key === modelValue ? 0 : -1"
        @click="handleTabClick(item)"
        @keydown="handleKeyDown($event, index)"
      >
        <i
          v-if="item.icon"
          :class="`fas fa-${item.icon}`"
          class="ft-tabs__icon"
          aria-hidden="true"
        ></i>
        <span class="ft-tabs__label">{{ item.label }}</span>
        <span v-if="item.badge !== undefined" class="ft-tabs__badge">
          {{ item.badge }}
        </span>
      </button>
    </div>

    <!-- Tab panels -->
    <div class="ft-tabs__panels">
      <slot></slot>
    </div>
  </div>
</template>

<!-- Unscoped: CSS custom property definitions -->
<style>
:root {
  /* FTTabs — component-level variables */
  --ft-tabs-font-family: var(--ft-font-family-text, 'Inter', sans-serif);
  --ft-tabs-font-size: 14px;
  --ft-tabs-font-weight: var(--ft-font-weight-regular, 400);
  --ft-tabs-font-weight-active: var(--ft-font-weight-bold, 700);
  --ft-tabs-line-height: 20px;
  --ft-tabs-gap: 0;
  --ft-tabs-transition: 150ms ease;

  /* Tab item */
  --ft-tabs-tab-height: 40px;
  --ft-tabs-tab-padding-x: 16px;
  --ft-tabs-tab-gap: 8px;

  /* Default variant colors */
  --ft-tabs-fg: var(--ft-color-on-surface-secondary);
  --ft-tabs-fg-hover: var(--ft-color-on-surface-base);
  --ft-tabs-fg-active: var(--ft-color-primary-base);
  --ft-tabs-fg-disabled: var(--ft-color-on-surface-disabled);
  --ft-tabs-border-color: var(--ft-color-border-base);
  --ft-tabs-indicator-color: var(--ft-color-primary-base);
  --ft-tabs-indicator-height: 2px;

  /* Pills variant */
  --ft-tabs-pill-bg: transparent;
  --ft-tabs-pill-bg-active: var(--ft-color-neutral-lightest);
  --ft-tabs-pill-bg-hover: var(--ft-color-neutral-lightest);
  --ft-tabs-pill-radius: 4px;

  /* Badge */
  --ft-tabs-badge-bg: var(--ft-color-primary-base);
  --ft-tabs-badge-fg: var(--ft-color-on-primary-base);
  --ft-tabs-badge-size: 18px;
  --ft-tabs-badge-font-size: 10px;
  --ft-tabs-badge-radius: 9px;

  /* Icon */
  --ft-tabs-icon-size: 14px;

  /* Focus */
  --ft-tabs-focus-ring: var(--ft-color-focus-ring-base);
}
</style>

<!-- Scoped: component styles -->
<style scoped>
.ft-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* ── Tab list ── */
.ft-tabs__list {
  display: flex;
  gap: var(--ft-tabs-gap);
}

/* ── Default variant — bottom border indicator ── */
.ft-tabs--default .ft-tabs__list {
  border-bottom: 1px solid var(--ft-tabs-border-color);
}

.ft-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: var(--ft-tabs-tab-gap);
  height: var(--ft-tabs-tab-height);
  padding: 0 var(--ft-tabs-tab-padding-x);

  font-family: var(--ft-tabs-font-family);
  font-size: var(--ft-tabs-font-size);
  font-weight: var(--ft-tabs-font-weight);
  line-height: var(--ft-tabs-line-height);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
  color: var(--ft-tabs-fg);

  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  transition: color var(--ft-tabs-transition),
              background-color var(--ft-tabs-transition);
}

.ft-tabs__tab:hover:not(:disabled) {
  color: var(--ft-tabs-fg-hover);
}

.ft-tabs__tab:focus-visible {
  outline: 2px solid var(--ft-tabs-focus-ring);
  outline-offset: -2px;
  border-radius: 4px;
}

.ft-tabs__tab--active {
  color: var(--ft-tabs-fg-active);
  font-weight: var(--ft-tabs-font-weight-active);
}

.ft-tabs__tab--disabled {
  color: var(--ft-tabs-fg-disabled);
  cursor: not-allowed;
}

/* Default indicator */
.ft-tabs--default .ft-tabs__tab {
  position: relative;
  margin-bottom: -1px;
}

.ft-tabs--default .ft-tabs__tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--ft-tabs-indicator-height);
  background: var(--ft-tabs-indicator-color);
}

/* ── Underline variant ── */
.ft-tabs--underline .ft-tabs__list {
  border-bottom: 1px solid var(--ft-tabs-border-color);
}

.ft-tabs--underline .ft-tabs__tab {
  position: relative;
  margin-bottom: -1px;
}

.ft-tabs--underline .ft-tabs__tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--ft-tabs-indicator-height);
  background: var(--ft-tabs-indicator-color);
}

/* ── Pills variant ── */
.ft-tabs--pills .ft-tabs__tab {
  background: var(--ft-tabs-pill-bg);
  border-radius: var(--ft-tabs-pill-radius);
}

.ft-tabs--pills .ft-tabs__tab:hover:not(:disabled) {
  background: var(--ft-tabs-pill-bg-hover);
}

.ft-tabs--pills .ft-tabs__tab--active {
  background: var(--ft-tabs-pill-bg-active);
}

/* ── Icon ── */
.ft-tabs__icon {
  font-size: var(--ft-tabs-icon-size);
  flex-shrink: 0;
}

/* ── Label ── */
.ft-tabs__label {
  display: inline-flex;
  align-items: center;
}

/* ── Badge ── */
.ft-tabs__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--ft-tabs-badge-size);
  height: var(--ft-tabs-badge-size);
  padding: 0 4px;
  border-radius: var(--ft-tabs-badge-radius);
  background: var(--ft-tabs-badge-bg);
  color: var(--ft-tabs-badge-fg);
  font-size: var(--ft-tabs-badge-font-size);
  font-weight: var(--ft-font-weight-bold, 700);
}

/* ── Panels ── */
.ft-tabs__panels {
  margin-top: 16px;
}
</style>
