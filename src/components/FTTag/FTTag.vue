<script setup lang="ts">
import { computed } from 'vue'

interface FTTagProps {
  // Style variants
  solid?: boolean

  // Color variant
  color?: 'default' | 'pink' | 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'aqua' | 'gray'

  // Size
  size?: 'sm' | 'md' | 'lg'

  // State
  disabled?: boolean
  locked?: boolean
  removable?: boolean

  // Icons
  leadingIcon?: string
  trailingIcon?: string

  // Accessibility
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTTagProps>(), {
  solid: true,
  color: 'default',
  size: 'md',
  disabled: false,
  locked: false,
  removable: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  remove: []
}>()

// Computed classes
const tagClasses = computed(() => ({
  'ft-tag': true,
  'ft-tag--solid': props.solid,
  'ft-tag--light': !props.solid,
  [`ft-tag--${props.size}`]: true,
  [`ft-tag--${props.color}`]: true,
  'ft-tag--disabled': props.disabled,
  'ft-tag--locked': props.locked,
  'ft-tag--removable': props.removable
}))

// Handle click
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.locked) {
    emit('click', event)
  }
}

// Handle keyboard interactions
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled || props.locked) return

  // Enter or Space to click/activate
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click', event as any)
  }

  // Backspace or Delete to remove (if removable)
  if (props.removable && (event.key === 'Backspace' || event.key === 'Delete')) {
    event.preventDefault()
    emit('remove')
  }
}

// Handle remove button click
const handleRemoveClick = (event: MouseEvent) => {
  event.stopPropagation()
  emit('remove')
}

// Handle remove button keydown
const handleRemoveKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
    emit('remove')
  }
}
</script>

<template>
  <div
    :class="tagClasses"
    :aria-disabled="disabled"
    :aria-readonly="locked"
    :aria-label="ariaLabel"
    :tabindex="disabled ? -1 : 0"
    role="button"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <!-- Leading icon -->
    <span v-if="leadingIcon" class="ft-tag__icon ft-tag__icon--leading" :aria-hidden="true">
      <i :class="`fas fa-${leadingIcon}`"></i>
    </span>

    <!-- Slot content (text) -->
    <span class="ft-tag__content">
      <slot>Tag</slot>
    </span>

    <!-- Lock icon (if locked) -->
    <span v-if="locked" class="ft-tag__icon ft-tag__icon--trailing" :aria-hidden="true">
      <i class="fas fa-lock"></i>
    </span>

    <!-- Trailing icon (if not locked and no remove button) -->
    <span
      v-else-if="trailingIcon && !removable"
      class="ft-tag__icon ft-tag__icon--trailing"
      :aria-hidden="true"
    >
      <i :class="`fas fa-${trailingIcon}`"></i>
    </span>

    <!-- Remove button (if removable) -->
    <button
      v-if="removable && !locked"
      type="button"
      class="ft-tag__remove"
      :aria-label="`Remove ${ariaLabel || 'tag'}`"
      :tabindex="disabled ? -1 : 0"
      @click="handleRemoveClick"
      @keydown="handleRemoveKeyDown"
    >
      <i class="fas fa-xmark"></i>
    </button>
  </div>
</template>

<!-- Unscoped: CSS custom property definitions need :root access -->
<style>
:root {
  /* Component-level variables for FTTag */
  --ft-tag-height-sm: 20px;
  --ft-tag-height-md: 24px;
  --ft-tag-height-lg: 32px;

  --ft-tag-font-size: 12px;
  --ft-tag-font-weight: var(--ft-font-weight-bold, 700);
  --ft-tag-font-family: var(--ft-font-family-text, 'Inter', sans-serif);

  --ft-tag-icon-size: 14px;
  --ft-tag-icon-container-size: 20px;

  --ft-tag-padding-x: 8px;
  --ft-tag-gap: 4px;
  --ft-tag-border-radius: 4px;

  /* Default solid tag (neutral) */
  --ft-tag-bg-solid: var(--ft-color-neutral-dark, #2C2C2C);
  --ft-tag-fg-solid: var(--ft-color-on-surface-inverse, #FFFFFF);

  /* Default light tag (neutral) */
  --ft-tag-bg-light: var(--ft-color-neutral-lightest, #F5F5F5);
  --ft-tag-fg-light: var(--ft-color-neutral-dark, #2C2C2C);

  /* Color tokens — solid backgrounds */
  --ft-tag-pink-solid-bg: var(--ft-color-brand-pink-400, #E96092);
  --ft-tag-blue-solid-bg: var(--ft-color-brand-blue-400, #63B6E6);
  --ft-tag-green-solid-bg: var(--ft-color-secondary-green-400, #3AAA35);
  --ft-tag-red-solid-bg: var(--ft-color-brand-red-400, #E54F35);
  --ft-tag-orange-solid-bg: var(--ft-color-brand-orange-400, #F4A321);
  --ft-tag-purple-solid-bg: var(--ft-color-tertiary-base, #783171);
  --ft-tag-aqua-solid-bg: var(--ft-color-info-base, #4AA3A0);
  --ft-tag-gray-solid-bg: var(--ft-color-neutral-gray-500, #959595);

  /* Color tokens — light backgrounds */
  --ft-tag-pink-light-bg: var(--ft-color-brand-pink-200, #FAD7E4);
  --ft-tag-pink-light-fg: var(--ft-color-brand-pink-500, #D52454);
  --ft-tag-blue-light-bg: var(--ft-color-brand-blue-100, #D8EDF9);
  --ft-tag-blue-light-fg: var(--ft-color-primary-dark, #012B86);
  --ft-tag-green-light-bg: var(--ft-color-secondary-green-200, #CDEACC);
  --ft-tag-green-light-fg: var(--ft-color-success-base, #3AAA35);
  --ft-tag-red-light-bg: var(--ft-color-brand-red-200, #EDC4C4);
  --ft-tag-red-light-fg: var(--ft-color-error-dark, #820202);
  --ft-tag-orange-light-bg: var(--ft-color-brand-orange-100, #F9D3CC);
  --ft-tag-orange-light-fg: var(--ft-color-accent-primary, #E9681A);
  --ft-tag-purple-light-bg: var(--ft-color-brand-purple-300, #E0C6E0);
  --ft-tag-purple-light-fg: var(--ft-color-tertiary-dark, #440743);
  --ft-tag-aqua-light-bg: var(--ft-color-secondary-aqua-400, #E1F2F2);
  --ft-tag-aqua-light-fg: var(--ft-color-info-dark, #4AA3A0);
  --ft-tag-gray-light-bg: var(--ft-color-neutral-gray-300, #E5E5E5);
  --ft-tag-gray-light-fg: var(--ft-color-neutral-gray-600, #666666);

  --ft-tag-transition-duration: 150ms;
  --ft-tag-transition-timing: ease;
}
</style>

<!-- Scoped: component styles -->
<style scoped>
.ft-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--ft-tag-gap);
  padding: 0 var(--ft-tag-padding-x);
  height: var(--ft-tag-height-md);

  font-size: var(--ft-tag-font-size);
  font-weight: var(--ft-tag-font-weight);
  font-family: var(--ft-tag-font-family);

  background-color: var(--ft-tag-bg-solid);
  color: var(--ft-tag-fg-solid);

  border-radius: var(--ft-tag-border-radius);
  border: none;

  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: background-color var(--ft-tag-transition-duration) var(--ft-tag-transition-timing),
              color var(--ft-tag-transition-duration) var(--ft-tag-transition-timing),
              opacity var(--ft-tag-transition-duration) var(--ft-tag-transition-timing);
}

/* Size variants */
.ft-tag--sm {
  height: var(--ft-tag-height-sm);
}

.ft-tag--md {
  height: var(--ft-tag-height-md);
}

.ft-tag--lg {
  height: var(--ft-tag-height-lg);
}

/* Light variant */
.ft-tag--light {
  background-color: var(--ft-tag-bg-light);
  color: var(--ft-tag-fg-light);
}

/* Color variants - solid */
.ft-tag--pink.ft-tag--solid {
  background-color: var(--ft-tag-pink-solid-bg);
  color: var(--ft-color-on-surface-inverse);
}

.ft-tag--blue.ft-tag--solid {
  background-color: var(--ft-tag-blue-solid-bg);
  color: var(--ft-color-on-primary-base);
}

.ft-tag--green.ft-tag--solid {
  background-color: var(--ft-tag-green-solid-bg);
  color: var(--ft-color-on-success-base);
}

.ft-tag--red.ft-tag--solid {
  background-color: var(--ft-tag-red-solid-bg);
  color: var(--ft-color-on-error-base);
}

.ft-tag--orange.ft-tag--solid {
  background-color: var(--ft-tag-orange-solid-bg);
  color: var(--ft-color-on-surface-inverse);
}

.ft-tag--purple.ft-tag--solid {
  background-color: var(--ft-tag-purple-solid-bg);
  color: var(--ft-color-on-surface-inverse);
}

.ft-tag--aqua.ft-tag--solid {
  background-color: var(--ft-tag-aqua-solid-bg);
  color: var(--ft-color-on-surface-inverse);
}

.ft-tag--gray.ft-tag--solid {
  background-color: var(--ft-tag-gray-solid-bg);
  color: var(--ft-color-on-surface-inverse);
}

/* Color variants - light */
.ft-tag--pink.ft-tag--light {
  background-color: var(--ft-tag-pink-light-bg);
  color: var(--ft-tag-pink-light-fg);
}

.ft-tag--blue.ft-tag--light {
  background-color: var(--ft-tag-blue-light-bg);
  color: var(--ft-tag-blue-light-fg);
}

.ft-tag--green.ft-tag--light {
  background-color: var(--ft-tag-green-light-bg);
  color: var(--ft-tag-green-light-fg);
}

.ft-tag--red.ft-tag--light {
  background-color: var(--ft-tag-red-light-bg);
  color: var(--ft-tag-red-light-fg);
}

.ft-tag--orange.ft-tag--light {
  background-color: var(--ft-tag-orange-light-bg);
  color: var(--ft-tag-orange-light-fg);
}

.ft-tag--purple.ft-tag--light {
  background-color: var(--ft-tag-purple-light-bg);
  color: var(--ft-tag-purple-light-fg);
}

.ft-tag--aqua.ft-tag--light {
  background-color: var(--ft-tag-aqua-light-bg);
  color: var(--ft-tag-aqua-light-fg);
}

.ft-tag--gray.ft-tag--light {
  background-color: var(--ft-tag-gray-light-bg);
  color: var(--ft-tag-gray-light-fg);
}

/* Hover state */
.ft-tag:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-neutral-black-900, #000000);
}

.ft-tag--light:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-neutral-gray-300, #E5E5E5);
}

.ft-tag--pink.ft-tag--solid:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-brand-pink-500, #D52454);
}

.ft-tag--blue.ft-tag--solid:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-brand-blue-800, #012B86);
}

.ft-tag--green.ft-tag--solid:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-secondary-green-500, #0D710B);
}

.ft-tag--red.ft-tag--solid:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-brand-red-800, #820202);
}

.ft-tag--orange.ft-tag--solid:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-brand-orange-500, #E9681A);
}

.ft-tag--purple.ft-tag--solid:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-brand-purple-800, #440743);
}

.ft-tag--aqua.ft-tag--solid:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-secondary-aqua-800, #4AA3A0);
}

.ft-tag--gray.ft-tag--solid:hover:not(.ft-tag--disabled):not(.ft-tag--locked) {
  background-color: var(--ft-color-neutral-gray-600, #666666);
}

/* Disabled state */
.ft-tag--disabled {
  cursor: not-allowed;
  pointer-events: none;
  background-color: var(--ft-color-neutral-gray-400, #CACACA);
  color: var(--ft-color-on-surface-inverse, #FFFFFF);
}

.ft-tag--light.ft-tag--disabled {
  background-color: var(--ft-color-neutral-gray-200, #F5F5F5);
  color: var(--ft-color-neutral-gray-400, #CACACA);
}

.ft-tag--pink.ft-tag--solid.ft-tag--disabled {
  background-color: var(--ft-color-brand-pink-300, #F4B0C8);
}

.ft-tag--blue.ft-tag--solid.ft-tag--disabled {
  background-color: var(--ft-color-brand-blue-300, #C3D9ED);
}

.ft-tag--green.ft-tag--solid.ft-tag--disabled {
  background-color: var(--ft-color-secondary-green-300, #9CD499);
}

.ft-tag--red.ft-tag--solid.ft-tag--disabled {
  background-color: var(--ft-color-brand-red-300, #DA8A89);
}

.ft-tag--orange.ft-tag--solid.ft-tag--disabled {
  background-color: var(--ft-color-brand-orange-300, #FCA122);
}

.ft-tag--purple.ft-tag--solid.ft-tag--disabled {
  background-color: var(--ft-color-brand-purple-500, #C18EC0);
}

.ft-tag--aqua.ft-tag--solid.ft-tag--disabled {
  background-color: var(--ft-color-secondary-aqua-600, #89CCCA);
}

.ft-tag--gray.ft-tag--solid.ft-tag--disabled {
  background-color: var(--ft-color-neutral-gray-400, #CACACA);
}

/* Locked state */
.ft-tag--locked {
  pointer-events: none;
  color: var(--ft-color-neutral-gray-500, #959595);
}

.ft-tag--locked.ft-tag--solid {
  color: var(--ft-color-on-surface-inverse, #FFFFFF);
}

/* Locked-disabled combination */
.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-neutral-gray-300, #E5E5E5);
  color: var(--ft-color-neutral-gray-400, #CACACA);
}

.ft-tag--light.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-neutral-white-100, #FAFAFA);
  color: var(--ft-color-neutral-gray-400, #CACACA);
}

.ft-tag--pink.ft-tag--solid.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-brand-pink-200, #FAD7E4);
}

.ft-tag--blue.ft-tag--solid.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-brand-blue-100, #D8EDF9);
}

.ft-tag--green.ft-tag--solid.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-secondary-green-200, #CDEACC);
}

.ft-tag--red.ft-tag--solid.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-brand-red-200, #EDC4C4);
}

.ft-tag--orange.ft-tag--solid.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-brand-orange-100, #F9D3CC);
}

.ft-tag--purple.ft-tag--solid.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-brand-purple-400, #E2C9E0);
}

.ft-tag--aqua.ft-tag--solid.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-secondary-aqua-400, #E1F2F2);
}

.ft-tag--gray.ft-tag--solid.ft-tag--locked.ft-tag--disabled {
  background-color: var(--ft-color-neutral-gray-300, #E5E5E5);
}

/* Focus visible state */
.ft-tag:focus-visible {
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: 2px;
}

/* Icon styles */
.ft-tag__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-tag-icon-container-size);
  height: var(--ft-tag-icon-container-size);
  flex-shrink: 0;
}

.ft-tag__icon i {
  font-size: var(--ft-tag-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Content area */
.ft-tag__content {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Remove button */
.ft-tag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-tag-icon-container-size);
  height: var(--ft-tag-icon-container-size);
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  color: inherit;
  font-size: var(--ft-tag-icon-size);

  transition: opacity var(--ft-tag-transition-duration) var(--ft-tag-transition-timing);
}

.ft-tag__remove:hover {
  opacity: 0.7;
}

.ft-tag__remove:focus-visible {
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: -2px;
  border-radius: 2px;
}

.ft-tag__remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
