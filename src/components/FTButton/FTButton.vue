<script setup lang="ts">
import { computed } from 'vue'

interface FTButtonProps {
  // Type variants (boolean, one at a time)
  primary?: boolean
  secondary?: boolean
  tertiary?: boolean
  action?: boolean

  // Icon
  leadingIcon?: string
  trailingIcon?: string
  iconOnly?: boolean
  iconSize?: 'sm' | 'md' | 'lg'

  // State
  disabled?: boolean
  loading?: boolean

  // Accessibility
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTButtonProps>(), {
  iconSize: 'md'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Default to primary if no type variant is set
const isPrimary = computed(() =>
  props.primary || (!props.secondary && !props.tertiary && !props.action && !props.iconOnly)
)

const buttonClasses = computed(() => ({
  'ft-button': true,
  'ft-button--primary': isPrimary.value,
  'ft-button--secondary': props.secondary,
  'ft-button--tertiary': props.tertiary,
  'ft-button--action': props.action,
  'ft-button--icon-only': props.iconOnly,
  [`ft-button--icon-${props.iconSize}`]: props.iconOnly,
  'ft-button--disabled': props.disabled,
  'ft-button--loading': props.loading
}))

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading || undefined"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel"
    type="button"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="ft-button__spinner" role="status" aria-label="Loading">
      <i class="fas fa-spinner fa-spin"></i>
    </span>

    <!-- Leading icon (for primary, secondary, tertiary types) -->
    <span
      v-if="leadingIcon && !iconOnly && !action && !loading"
      class="ft-button__icon"
      aria-hidden="true"
    >
      <i :class="`fas fa-${leadingIcon}`"></i>
    </span>

    <!-- Icon only mode -->
    <span v-if="iconOnly && leadingIcon && !loading" class="ft-button__icon" aria-hidden="true">
      <i :class="`fas fa-${leadingIcon}`"></i>
    </span>

    <!-- Text content -->
    <span v-if="!iconOnly" class="ft-button__content">
      <slot>Button text</slot>
    </span>

    <!-- Trailing icon for action type -->
    <span
      v-if="action && !loading"
      class="ft-button__icon ft-button__icon--trailing"
      aria-hidden="true"
    >
      <i :class="`fas fa-${trailingIcon || 'plus'}`"></i>
    </span>
  </button>
</template>

<!-- Unscoped: CSS custom property definitions need :root access -->
<style>
:root {
  /* FTButton — component-level variables */

  /* Dimensions */
  --ft-btn-height: 32px;
  --ft-btn-font-size: 12px;
  --ft-btn-font-weight: var(--ft-font-weight-bold, 700);
  --ft-btn-font-family: var(--ft-font-family-text, 'Inter', sans-serif);
  --ft-btn-line-height: 16px;
  --ft-btn-gap: 4px;
  --ft-btn-padding-icon-side: 8px;
  --ft-btn-padding-text-side: 16px;
  --ft-btn-border-radius-pill: 32px;
  --ft-btn-border-radius-rect: 4px;
  --ft-btn-icon-container: 20px;
  --ft-btn-icon-font-size: 14px;
  --ft-btn-transition-duration: 150ms;
  --ft-btn-transition-timing: ease;

  /* Icon-only sizes */
  --ft-btn-icon-size-sm: 24px;
  --ft-btn-icon-size-md: 32px;
  --ft-btn-icon-size-lg: 40px;
  --ft-btn-icon-padding: 4px;

  /* Primary (main) — pink solid */
  --ft-btn-main-bg-default: var(--ft-color-primary-base);
  --ft-btn-main-bg-hover: var(--ft-color-primary-dark);
  --ft-btn-main-bg-focused: var(--ft-color-primary-darker);
  --ft-btn-main-bg-disabled: var(--ft-color-primary-light);
  --ft-btn-main-fg-default: var(--ft-color-on-primary-base);
  --ft-btn-main-fg-disabled: var(--ft-color-on-primary-base);

  /* Secondary (alt) — pink text, no bg */
  --ft-btn-alt-fg-default: var(--ft-color-primary-base);
  --ft-btn-alt-fg-hover: var(--ft-color-primary-dark);
  --ft-btn-alt-fg-focused: var(--ft-color-primary-darker);
  --ft-btn-alt-fg-disabled: var(--ft-color-primary-light);

  /* Tertiary (sub) — dark solid */
  --ft-btn-sub-bg-default: var(--ft-color-neutral-dark);
  --ft-btn-sub-bg-hover: var(--ft-color-neutral-black-900, #000000);
  --ft-btn-sub-bg-focused: var(--ft-color-neutral-black-900, #000000);
  --ft-btn-sub-bg-disabled: var(--ft-color-neutral-light);
  --ft-btn-sub-fg-default: var(--ft-color-on-surface-inverse);
  --ft-btn-sub-fg-disabled: var(--ft-color-on-surface-inverse);

  /* Action (plus) — outlined */
  --ft-btn-plus-fg-default: var(--ft-color-neutral-dark);
  --ft-btn-plus-outline-default: var(--ft-color-neutral-dark);
  --ft-btn-plus-fg-hover: var(--ft-color-on-surface-inverse);
  --ft-btn-plus-bg-hover: var(--ft-color-neutral-black-900, #000000);
  --ft-btn-plus-outline-hover: var(--ft-color-neutral-black-900, #000000);
  --ft-btn-plus-fg-focused: var(--ft-color-on-surface-inverse);
  --ft-btn-plus-bg-focused: var(--ft-color-neutral-black-900, #000000);
  --ft-btn-plus-outline-focused: var(--ft-color-neutral-black-900, #000000);
  --ft-btn-plus-fg-disabled: var(--ft-color-neutral-light);
  --ft-btn-plus-outline-disabled: var(--ft-color-neutral-light);

  /* Icon only */
  --ft-btn-icon-bg-default: var(--ft-color-neutral-gray-300, #E5E5E5);
  --ft-btn-icon-fg-default: var(--ft-color-neutral-light);
  --ft-btn-icon-fg-hover: var(--ft-color-neutral-light);
  --ft-btn-icon-fg-disabled: var(--ft-color-neutral-gray-300, #E5E5E5);
}
</style>

<!-- Scoped: component styles -->
<style scoped>
.ft-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ft-btn-gap);
  height: var(--ft-btn-height);

  font-size: var(--ft-btn-font-size);
  font-weight: var(--ft-btn-font-weight);
  font-family: var(--ft-btn-font-family);
  line-height: var(--ft-btn-line-height);
  font-feature-settings: 'lnum' 1, 'tnum' 1;

  border: none;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;

  transition: background-color var(--ft-btn-transition-duration) var(--ft-btn-transition-timing),
              color var(--ft-btn-transition-duration) var(--ft-btn-transition-timing),
              border-color var(--ft-btn-transition-duration) var(--ft-btn-transition-timing);
}

/* ========================================
   Primary (main) — pink solid pill
   ======================================== */
.ft-button--primary {
  padding: 0 var(--ft-btn-padding-text-side);
  border-radius: var(--ft-btn-border-radius-pill);
  background-color: var(--ft-btn-main-bg-default);
  color: var(--ft-btn-main-fg-default);
}

.ft-button--primary:hover:not(:disabled) {
  background-color: var(--ft-btn-main-bg-hover);
}

.ft-button--primary:focus-visible {
  background-color: var(--ft-btn-main-bg-focused);
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: 2px;
}

.ft-button--primary:disabled {
  background-color: var(--ft-btn-main-bg-disabled);
  color: var(--ft-btn-main-fg-disabled);
  cursor: not-allowed;
}

/* Primary with leading icon — asymmetric padding */
.ft-button--primary:has(.ft-button__icon) {
  padding-left: var(--ft-btn-padding-icon-side);
  padding-right: var(--ft-btn-padding-text-side);
}

/* ========================================
   Secondary (alt) — pink text, no bg
   ======================================== */
.ft-button--secondary {
  padding: 0 var(--ft-btn-padding-text-side);
  border-radius: var(--ft-btn-border-radius-pill);
  background-color: transparent;
  color: var(--ft-btn-alt-fg-default);
}

.ft-button--secondary:hover:not(:disabled) {
  color: var(--ft-btn-alt-fg-hover);
}

.ft-button--secondary:focus-visible {
  color: var(--ft-btn-alt-fg-focused);
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: 2px;
}

.ft-button--secondary:disabled {
  color: var(--ft-btn-alt-fg-disabled);
  cursor: not-allowed;
}

.ft-button--secondary:has(.ft-button__icon) {
  padding-left: var(--ft-btn-padding-icon-side);
  padding-right: var(--ft-btn-padding-text-side);
}

/* ========================================
   Tertiary (sub) — dark solid pill
   ======================================== */
.ft-button--tertiary {
  padding: 0 var(--ft-btn-padding-text-side);
  border-radius: var(--ft-btn-border-radius-pill);
  background-color: var(--ft-btn-sub-bg-default);
  color: var(--ft-btn-sub-fg-default);
}

.ft-button--tertiary:hover:not(:disabled) {
  background-color: var(--ft-btn-sub-bg-hover);
}

.ft-button--tertiary:focus-visible {
  background-color: var(--ft-btn-sub-bg-focused);
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: 2px;
}

.ft-button--tertiary:disabled {
  background-color: var(--ft-btn-sub-bg-disabled);
  color: var(--ft-btn-sub-fg-disabled);
  cursor: not-allowed;
}

.ft-button--tertiary:has(.ft-button__icon) {
  padding-left: var(--ft-btn-padding-icon-side);
  padding-right: var(--ft-btn-padding-text-side);
}

/* ========================================
   Action (plus) — outlined, trailing icon
   ======================================== */
.ft-button--action {
  padding-left: var(--ft-btn-padding-text-side);
  padding-right: var(--ft-btn-padding-icon-side);
  border-radius: var(--ft-btn-border-radius-rect);
  background-color: transparent;
  border: 1px solid var(--ft-btn-plus-outline-default);
  color: var(--ft-btn-plus-fg-default);
}

.ft-button--action:hover:not(:disabled) {
  background-color: var(--ft-btn-plus-bg-hover);
  border-color: var(--ft-btn-plus-outline-hover);
  color: var(--ft-btn-plus-fg-hover);
}

.ft-button--action:focus-visible {
  background-color: var(--ft-btn-plus-bg-focused);
  border-color: var(--ft-btn-plus-outline-focused);
  color: var(--ft-btn-plus-fg-focused);
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: 2px;
}

.ft-button--action:disabled {
  border-color: var(--ft-btn-plus-outline-disabled);
  color: var(--ft-btn-plus-fg-disabled);
  cursor: not-allowed;
}

/* ========================================
   Icon only — circular
   ======================================== */
.ft-button--icon-only {
  padding: var(--ft-btn-icon-padding);
  border-radius: var(--ft-btn-border-radius-pill);
  background-color: transparent;
  color: var(--ft-btn-icon-fg-default);
}

.ft-button--icon-only:hover:not(:disabled) {
  color: var(--ft-btn-icon-fg-hover);
  background-color: var(--ft-btn-icon-bg-default);
}

.ft-button--icon-only:focus-visible {
  background-color: var(--ft-btn-icon-bg-default);
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: 2px;
}

.ft-button--icon-only:disabled {
  color: var(--ft-btn-icon-fg-disabled);
  cursor: not-allowed;
}

/* Icon-only sizes */
.ft-button--icon-sm {
  width: var(--ft-btn-icon-size-sm);
  height: var(--ft-btn-icon-size-sm);
}

.ft-button--icon-md {
  width: var(--ft-btn-icon-size-md);
  height: var(--ft-btn-icon-size-md);
}

.ft-button--icon-lg {
  width: var(--ft-btn-icon-size-lg);
  height: var(--ft-btn-icon-size-lg);
}

/* ========================================
   Icon element
   ======================================== */
.ft-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-btn-icon-container);
  height: var(--ft-btn-icon-container);
  flex-shrink: 0;
}

.ft-button__icon i {
  font-size: var(--ft-btn-icon-font-size);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ========================================
   Content
   ======================================== */
.ft-button__content {
  display: inline-flex;
  align-items: center;
}

/* ========================================
   Loading spinner
   ======================================== */
.ft-button__spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-btn-icon-container);
  height: var(--ft-btn-icon-container);
  flex-shrink: 0;
}

.ft-button__spinner i {
  font-size: var(--ft-btn-icon-font-size);
}

/* ========================================
   Disabled + loading shared
   ======================================== */
.ft-button--loading {
  cursor: wait;
}
</style>
