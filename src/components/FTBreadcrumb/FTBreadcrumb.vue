<template>
  <nav
    class="ft-breadcrumb"
    :aria-label="ariaLabel"
  >
    <ol class="ft-breadcrumb__list">
      <template v-for="(item, index) in visibleItems" :key="item.key || index">
        <!-- Separator (chevron) before all items except the first -->
        <li
          v-if="index > 0"
          class="ft-breadcrumb__separator"
          aria-hidden="true"
        >
          <i class="fa-solid fa-chevron-right" />
        </li>

        <!-- Ellipsis item -->
        <li
          v-if="item._ellipsis"
          class="ft-breadcrumb__ellipsis"
          aria-hidden="true"
        >
          <i class="fa-solid fa-ellipsis" />
        </li>

        <!-- Regular breadcrumb item -->
        <li
          v-else
          class="ft-breadcrumb__item"
          :class="{
            'ft-breadcrumb__item--current': index === visibleItems.length - 1,
          }"
        >
          <button
            v-if="index < visibleItems.length - 1"
            class="ft-breadcrumb__link"
            type="button"
            @click="handleClick(item, index)"
          >
            <span class="ft-breadcrumb__label">{{ item.label }}</span>
            <span v-if="item.tag" class="ft-breadcrumb__tag">{{ item.tag }}</span>
            <i v-if="item.dropdown" class="ft-breadcrumb__dropdown fa-solid fa-chevron-down" />
          </button>
          <span
            v-else
            class="ft-breadcrumb__current"
            :aria-current="'page'"
          >
            {{ item.label }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BreadcrumbItem {
  key: string
  label: string
  tag?: string
  dropdown?: boolean
}

interface FTBreadcrumbProps {
  items: BreadcrumbItem[]
  maxVisible?: number
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTBreadcrumbProps>(), {
  maxVisible: 6,
  ariaLabel: 'Breadcrumb navigation',
})

const emit = defineEmits<{
  'item-click': [item: BreadcrumbItem, index: number]
}>()

interface VisibleItem extends BreadcrumbItem {
  _ellipsis?: boolean
}

const visibleItems = computed<VisibleItem[]>(() => {
  const all = props.items

  if (all.length <= props.maxVisible) {
    return all
  }

  // Show first 3, ellipsis, then last 3
  const headCount = 3
  const tailCount = 3
  const head = all.slice(0, headCount)
  const tail = all.slice(-tailCount)

  return [
    ...head,
    { key: '__ellipsis', label: '', _ellipsis: true },
    ...tail,
  ]
})

const handleClick = (item: BreadcrumbItem, index: number) => {
  emit('item-click', item, index)
}
</script>

<style>
:root {
  --ft-breadcrumb-height: 50px;
  --ft-breadcrumb-item-padding: 8px;
  --ft-breadcrumb-item-gap: 8px;
  --ft-breadcrumb-font-size: 12px;
  --ft-breadcrumb-font-weight: var(--ft-font-weight-bold);
  --ft-breadcrumb-color: var(--ft-color-neutral-light);
  --ft-breadcrumb-color-current: var(--ft-color-on-surface-base);
  --ft-breadcrumb-separator-color: var(--ft-color-on-surface-base);
  --ft-breadcrumb-separator-size: 14px;
  --ft-breadcrumb-icon-size: 20px;
  --ft-breadcrumb-tag-bg: var(--ft-color-on-surface-base);
  --ft-breadcrumb-tag-fg: var(--ft-color-on-surface-inverse);
  --ft-breadcrumb-tag-height: 20px;
  --ft-breadcrumb-tag-radius: 4px;
  --ft-breadcrumb-tag-font-size: 10px;
  --ft-breadcrumb-focus-ring: var(--ft-color-focus-ring-base);
}
</style>

<style scoped>
.ft-breadcrumb {
  display: flex;
  align-items: center;
  height: var(--ft-breadcrumb-height);
}

.ft-breadcrumb__list {
  display: flex;
  align-items: center;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.ft-breadcrumb__separator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-breadcrumb-icon-size);
  height: var(--ft-breadcrumb-icon-size);
  padding: var(--ft-breadcrumb-item-padding);
  flex-shrink: 0;
}

.ft-breadcrumb__separator i {
  font-size: var(--ft-breadcrumb-separator-size);
  color: var(--ft-breadcrumb-separator-color);
}

.ft-breadcrumb__ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-breadcrumb-icon-size);
  height: var(--ft-breadcrumb-icon-size);
  padding: var(--ft-breadcrumb-item-padding);
  flex-shrink: 0;
}

.ft-breadcrumb__ellipsis i {
  font-size: var(--ft-breadcrumb-separator-size);
  color: var(--ft-breadcrumb-separator-color);
}

.ft-breadcrumb__item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.ft-breadcrumb__link {
  display: flex;
  align-items: center;
  gap: var(--ft-breadcrumb-item-gap);
  padding: var(--ft-breadcrumb-item-padding);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--ft-font-family-text), sans-serif;
  font-size: var(--ft-breadcrumb-font-size);
  font-weight: var(--ft-breadcrumb-font-weight);
  color: var(--ft-breadcrumb-color);
  white-space: nowrap;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
  transition: color 150ms ease;
}

.ft-breadcrumb__link:hover {
  color: var(--ft-breadcrumb-color-current);
}

.ft-breadcrumb__link:focus-visible {
  outline: 2px solid var(--ft-breadcrumb-focus-ring);
  outline-offset: 2px;
  border-radius: 4px;
}

.ft-breadcrumb__current {
  display: flex;
  align-items: center;
  padding: var(--ft-breadcrumb-item-padding);
  font-family: var(--ft-font-family-text), sans-serif;
  font-size: var(--ft-breadcrumb-font-size);
  font-weight: var(--ft-breadcrumb-font-weight);
  color: var(--ft-breadcrumb-color-current);
  white-space: nowrap;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.ft-breadcrumb__tag {
  display: flex;
  align-items: center;
  height: var(--ft-breadcrumb-tag-height);
  padding: 0 4px;
  background: var(--ft-breadcrumb-tag-bg);
  color: var(--ft-breadcrumb-tag-fg);
  border-radius: var(--ft-breadcrumb-tag-radius);
  font-size: var(--ft-breadcrumb-tag-font-size);
  font-weight: var(--ft-font-weight-bold);
  letter-spacing: 0.2px;
  line-height: 10px;
  white-space: nowrap;
}

.ft-breadcrumb__dropdown {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-breadcrumb-icon-size);
  height: var(--ft-breadcrumb-icon-size);
  font-size: var(--ft-breadcrumb-separator-size);
  color: var(--ft-breadcrumb-separator-color);
}
</style>
