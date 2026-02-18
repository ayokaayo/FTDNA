<script setup lang="ts">
import { computed } from 'vue'

/**
 * Represents a single navigation item in the side menu.
 */
export interface SideMenuItem {
  /** Unique key used for active-item matching and keyboard focus */
  key: string
  /** Font Awesome icon class (e.g. "fas fa-magnifying-glass") */
  icon: string
  /** Accessible label shown as tooltip and aria-label */
  label: string
  /** Whether the item is currently active/selected */
  active?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
}

/**
 * Represents a timezone clock entry displayed in the bottom section.
 */
export interface TimezoneClock {
  /** Time string to display (e.g. "4:06") */
  time: string
  /** Timezone abbreviation (e.g. "UTC", "PHT") */
  zone: string
  /** Font Awesome icon for day/night indicator (e.g. "fas fa-moon", "fas fa-sun") */
  icon?: string
}

interface FTSideMenuProps {
  /** Navigation items rendered in the top section, below the logo */
  topItems?: SideMenuItem[]
  /** Navigation items rendered in the bottom section */
  bottomItems?: SideMenuItem[]
  /** Timezone clocks displayed between top and bottom sections */
  clocks?: TimezoneClock[]
  /** Whether to show the FT logo at the top */
  showLogo?: boolean
  /** Accessible label for the nav landmark */
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTSideMenuProps>(), {
  topItems: () => [],
  bottomItems: () => [],
  clocks: () => [],
  showLogo: true,
  ariaLabel: 'Side navigation'
})

const emit = defineEmits<{
  'item-click': [item: SideMenuItem]
}>()

const handleItemClick = (item: SideMenuItem) => {
  if (!item.disabled) {
    emit('item-click', item)
  }
}

const handleItemKeyDown = (event: KeyboardEvent, item: SideMenuItem) => {
  if (item.disabled) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('item-click', item)
  }
}

const itemClasses = (item: SideMenuItem) => ({
  'ft-sidemenu__item': true,
  'ft-sidemenu__item--active': item.active,
  'ft-sidemenu__item--disabled': item.disabled
})
</script>

<template>
  <nav
    :class="'ft-sidemenu'"
    :aria-label="ariaLabel"
  >
    <!-- Top section: logo + top items -->
    <div class="ft-sidemenu__top">
      <!-- Logo -->
      <div v-if="showLogo" class="ft-sidemenu__logo">
        <slot name="logo">
          <div class="ft-sidemenu__logo-default" aria-hidden="true">
            <span class="ft-sidemenu__logo-text">FT</span>
          </div>
        </slot>
      </div>

      <!-- Top navigation items -->
      <div v-if="topItems.length" class="ft-sidemenu__items" role="list">
        <div
          v-for="item in topItems"
          :key="item.key"
          :class="itemClasses(item)"
          role="listitem"
        >
          <button
            class="ft-sidemenu__button"
            :aria-label="item.label"
            :aria-current="item.active ? 'page' : undefined"
            :disabled="item.disabled"
            :title="item.label"
            @click="handleItemClick(item)"
            @keydown="handleItemKeyDown($event, item)"
          >
            <i :class="item.icon" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <!-- Extra top content (rewards logo, AI icon, etc.) -->
      <slot name="top-extra"></slot>
    </div>

    <!-- Bottom section: clocks + bottom items -->
    <div class="ft-sidemenu__bottom">
      <!-- Timezone clocks -->
      <div v-if="clocks.length" class="ft-sidemenu__clocks">
        <div
          v-for="(clock, index) in clocks"
          :key="index"
          class="ft-sidemenu__clock"
        >
          <div class="ft-sidemenu__clock-time">
            <span class="ft-sidemenu__clock-value">{{ clock.time }}</span>
            <i
              v-if="clock.icon"
              :class="clock.icon"
              class="ft-sidemenu__clock-indicator"
              aria-hidden="true"
            ></i>
          </div>
          <div class="ft-sidemenu__clock-zone">
            {{ clock.zone }}
          </div>
        </div>
      </div>

      <!-- Bottom navigation items -->
      <div v-if="bottomItems.length" class="ft-sidemenu__items" role="list">
        <div
          v-for="item in bottomItems"
          :key="item.key"
          :class="itemClasses(item)"
          role="listitem"
        >
          <button
            class="ft-sidemenu__button"
            :aria-label="item.label"
            :aria-current="item.active ? 'page' : undefined"
            :disabled="item.disabled"
            :title="item.label"
            @click="handleItemClick(item)"
            @keydown="handleItemKeyDown($event, item)"
          >
            <i :class="item.icon" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
:root {
  /* FTSideMenu token-backed variables */
  --ft-sidemenu-bg: var(--ft-color-neutral-black-900, #000000);
  --ft-sidemenu-width: 56px;
  --ft-sidemenu-icon-color: var(--ft-color-neutral-white-50, #ffffff);
  --ft-sidemenu-icon-color-hover: var(--ft-color-neutral-white-50, #ffffff);
  --ft-sidemenu-icon-color-active: var(--ft-color-neutral-white-50, #ffffff);
  --ft-sidemenu-icon-color-disabled: var(--ft-color-neutral-gray-600, #666666);
  --ft-sidemenu-icon-size: 16px;
  --ft-sidemenu-item-size: 20px;
  --ft-sidemenu-item-gap: 32px;
  --ft-sidemenu-padding-y: 16px;
  --ft-sidemenu-clock-text-color: var(--ft-color-neutral-white-50, #ffffff);
  --ft-sidemenu-clock-zone-bg: var(--ft-color-brand-blue-500, #2782cf);
  --ft-sidemenu-clock-zone-bg-alt: var(--ft-color-neutral-gray-700, #2c2c2c);
  --ft-sidemenu-clock-font-size: 10px;
  --ft-sidemenu-focus-ring: var(--ft-color-focus-ring-base, #63B6E6);
  --ft-sidemenu-logo-text-color: var(--ft-color-neutral-white-50, #ffffff);
  --ft-sidemenu-transition: 150ms ease;
}
</style>

<style scoped>
.ft-sidemenu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: var(--ft-sidemenu-width);
  height: 100%;
  background: var(--ft-sidemenu-bg);
  overflow: hidden;
}

/* ── Top section ── */
.ft-sidemenu__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* ── Logo ── */
.ft-sidemenu__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 66px;
  overflow: hidden;
}

.ft-sidemenu__logo-default {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.ft-sidemenu__logo-text {
  font-family: var(--ft-font-family-text, Inter), sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--ft-sidemenu-logo-text-color);
  letter-spacing: 0.05em;
}

/* ── Navigation items ── */
.ft-sidemenu__items {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ft-sidemenu-item-gap);
  padding: var(--ft-sidemenu-padding-y) 0;
  width: 100%;
}

.ft-sidemenu__item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-sidemenu-item-size);
  height: var(--ft-sidemenu-item-size);
}

/* ── Button (clickable icon) ── */
.ft-sidemenu__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  color: var(--ft-sidemenu-icon-color, #ffffff) !important;
  font-size: var(--ft-sidemenu-icon-size);
  cursor: pointer;
  transition: color var(--ft-sidemenu-transition);
  outline: none;
  border-radius: 4px;
}

.ft-sidemenu__button:hover {
  color: var(--ft-sidemenu-icon-color-hover, #ffffff) !important;
}

.ft-sidemenu__button:focus-visible {
  outline: 2px solid var(--ft-sidemenu-focus-ring);
  outline-offset: 4px;
}

.ft-sidemenu__item--active .ft-sidemenu__button {
  color: var(--ft-sidemenu-icon-color-active, #ffffff) !important;
}

.ft-sidemenu__item--disabled .ft-sidemenu__button {
  color: var(--ft-sidemenu-icon-color-disabled, #666666) !important;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Bottom section ── */
.ft-sidemenu__bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: var(--ft-sidemenu-padding-y);
  width: 100%;
}

/* ── Clocks ── */
.ft-sidemenu__clocks {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--ft-sidemenu-padding-y) 0;
  width: var(--ft-sidemenu-width);
}

.ft-sidemenu__clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ft-sidemenu__clock + .ft-sidemenu__clock {
  margin-top: 8px;
}

.ft-sidemenu__clock-time {
  display: flex;
  align-items: center;
  gap: 2px;
}

.ft-sidemenu__clock-value {
  font-family: var(--ft-font-family-text, Inter), sans-serif;
  font-weight: 700;
  font-size: var(--ft-sidemenu-clock-font-size);
  line-height: 20px;
  color: var(--ft-sidemenu-clock-text-color);
  letter-spacing: 0.28px;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.ft-sidemenu__clock-indicator {
  font-size: var(--ft-sidemenu-clock-font-size);
  color: var(--ft-sidemenu-clock-text-color);
}

.ft-sidemenu__clock-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 4px;
  background: var(--ft-sidemenu-clock-zone-bg);
  font-family: var(--ft-font-family-text, Inter), sans-serif;
  font-weight: 700;
  font-size: var(--ft-sidemenu-clock-font-size);
  color: var(--ft-sidemenu-clock-text-color);
  white-space: nowrap;
}

.ft-sidemenu__clock:nth-child(2) .ft-sidemenu__clock-zone {
  background: var(--ft-sidemenu-clock-zone-bg-alt);
}
</style>
