<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * Represents an option in the select dropdown.
 */
export interface SelectOption {
  /** Unique value used for v-model binding */
  value: string | number
  /** Display text shown in the dropdown */
  label: string
  /** Whether this option is disabled */
  disabled?: boolean
}

interface FTSelectProps {
  /** Currently selected value (v-model) */
  modelValue?: string | number | null
  /** Available options */
  options?: SelectOption[]
  /** Label text above the select */
  label?: string
  /** Placeholder text when nothing is selected */
  placeholder?: string
  /** Helper text below the select */
  helperText?: string
  /** Error message (overrides helperText, triggers error styling) */
  errorMessage?: string
  /** Success state styling */
  success?: boolean
  /** Disable the select */
  disabled?: boolean
  /** Required field */
  required?: boolean
  /** Show a search/filter input in the dropdown */
  searchable?: boolean
  /** Show a clear button when a value is selected */
  clearable?: boolean
  /** Accessible label */
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTSelectProps>(), {
  modelValue: null,
  options: () => [],
  placeholder: 'Select...',
  disabled: false,
  required: false,
  success: false,
  searchable: false,
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'change': [value: string | number | null]
  'open': []
  'close': []
}>()

const containerRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)

const hasError = computed(() => !!props.errorMessage)

const selectedOption = computed(() =>
  props.options.find(opt => opt.value === props.modelValue)
)

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(opt => opt.label.toLowerCase().includes(q))
})

const containerClasses = computed(() => ({
  'ft-select': true,
  'ft-select--open': isOpen.value,
  'ft-select--error': hasError.value,
  'ft-select--success': props.success && !hasError.value,
  'ft-select--disabled': props.disabled,
  'ft-select--has-value': props.modelValue !== null && props.modelValue !== undefined,
}))

const open = () => {
  if (props.disabled) return
  isOpen.value = true
  highlightedIndex.value = -1
  searchQuery.value = ''
  emit('open')
  nextTick(() => {
    searchRef.value?.focus()
  })
}

const close = () => {
  isOpen.value = false
  searchQuery.value = ''
  emit('close')
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const selectOption = (option: SelectOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  close()
}

const clearSelection = (event: Event) => {
  event.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!isOpen.value) {
        open()
      } else if (highlightedIndex.value >= 0) {
        const opt = filteredOptions.value[highlightedIndex.value]
        if (opt && !opt.disabled) selectOption(opt)
      }
      break
    case 'Escape':
      close()
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!isOpen.value) {
        open()
      } else {
        const len = filteredOptions.value.length
        highlightedIndex.value = (highlightedIndex.value + 1) % len
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        const len = filteredOptions.value.length
        highlightedIndex.value = (highlightedIndex.value - 1 + len) % len
      }
      break
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div ref="containerRef" :class="containerClasses">
    <!-- Label -->
    <label v-if="label" class="ft-select__label">
      {{ label }}
      <span v-if="required" class="ft-select__required" aria-hidden="true">*</span>
    </label>

    <!-- Trigger -->
    <div
      class="ft-select__trigger"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="'listbox'"
      :aria-label="ariaLabel || label"
      :aria-invalid="hasError || undefined"
      :aria-required="required || undefined"
      :aria-describedby="(helperText || errorMessage) ? 'ft-select-helper' : undefined"
      :tabindex="disabled ? -1 : 0"
      @click="toggle"
      @keydown="handleKeyDown"
    >
      <span v-if="selectedOption" class="ft-select__value">
        {{ selectedOption.label }}
      </span>
      <span v-else class="ft-select__placeholder">
        {{ placeholder }}
      </span>

      <span class="ft-select__actions">
        <!-- Clear button -->
        <button
          v-if="clearable && modelValue !== null && modelValue !== undefined && !disabled"
          class="ft-select__clear"
          type="button"
          aria-label="Clear selection"
          tabindex="-1"
          @click="clearSelection"
        >
          <i class="fas fa-xmark" aria-hidden="true"></i>
        </button>

        <!-- Chevron -->
        <i
          class="fas fa-chevron-down ft-select__chevron"
          aria-hidden="true"
        ></i>
      </span>
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen" class="ft-select__dropdown" role="listbox">
      <!-- Search -->
      <div v-if="searchable" class="ft-select__search">
        <input
          ref="searchRef"
          v-model="searchQuery"
          class="ft-select__search-input"
          type="text"
          placeholder="Search..."
          aria-label="Search options"
          @keydown="handleKeyDown"
        />
      </div>

      <!-- Options -->
      <div class="ft-select__options">
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          class="ft-select__option"
          :class="{
            'ft-select__option--selected': option.value === modelValue,
            'ft-select__option--highlighted': index === highlightedIndex,
            'ft-select__option--disabled': option.disabled,
          }"
          role="option"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled"
          @click="selectOption(option)"
          @mouseenter="highlightedIndex = index"
        >
          {{ option.label }}
          <i
            v-if="option.value === modelValue"
            class="fas fa-check ft-select__check"
            aria-hidden="true"
          ></i>
        </div>

        <div v-if="filteredOptions.length === 0" class="ft-select__empty">
          No options found
        </div>
      </div>
    </div>

    <!-- Helper / Error text -->
    <div
      v-if="errorMessage || helperText"
      id="ft-select-helper"
      class="ft-select__helper"
      :class="{ 'ft-select__helper--error': hasError }"
      role="status"
      :aria-live="hasError ? 'assertive' : 'polite'"
    >
      {{ errorMessage || helperText }}
    </div>
  </div>
</template>

<!-- Unscoped: CSS custom property definitions -->
<style>
:root {
  /* FTSelect — component-level variables */

  /* Dimensions */
  --ft-select-height: 36px;
  --ft-select-font-size: 14px;
  --ft-select-font-weight: var(--ft-font-weight-regular, 400);
  --ft-select-font-family: var(--ft-font-family-text, 'Inter', sans-serif);
  --ft-select-line-height: 20px;
  --ft-select-padding-x: 12px;
  --ft-select-border-radius: 4px;
  --ft-select-border-width: 1px;
  --ft-select-transition: 150ms ease;

  /* Label */
  --ft-select-label-font-size: 12px;
  --ft-select-label-font-weight: var(--ft-font-weight-bold, 700);
  --ft-select-label-color: var(--ft-color-on-surface-base);
  --ft-select-label-gap: 4px;

  /* Trigger colors */
  --ft-select-bg: var(--ft-color-neutral-white-50, #ffffff);
  --ft-select-fg: var(--ft-color-on-surface-base);
  --ft-select-border-color: var(--ft-color-border-base);
  --ft-select-placeholder-color: var(--ft-color-on-surface-tertiary);
  --ft-select-border-color-hover: var(--ft-color-border-strong);
  --ft-select-border-color-focus: var(--ft-color-border-focus);
  --ft-select-border-color-error: var(--ft-color-error-base);
  --ft-select-border-color-success: var(--ft-color-success-base);
  --ft-select-bg-disabled: var(--ft-color-neutral-lightest);
  --ft-select-fg-disabled: var(--ft-color-on-surface-disabled);
  --ft-select-border-color-disabled: var(--ft-color-border-subtle);

  /* Chevron */
  --ft-select-chevron-color: var(--ft-color-on-surface-tertiary);
  --ft-select-chevron-size: 10px;

  /* Dropdown */
  --ft-select-dropdown-bg: var(--ft-color-neutral-white-50, #ffffff);
  --ft-select-dropdown-border: var(--ft-color-border-base);
  --ft-select-dropdown-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  --ft-select-dropdown-max-height: 240px;
  --ft-select-dropdown-radius: 4px;

  /* Option */
  --ft-select-option-height: 36px;
  --ft-select-option-padding-x: 12px;
  --ft-select-option-bg-hover: var(--ft-color-neutral-lightest);
  --ft-select-option-bg-selected: var(--ft-color-neutral-lightest);
  --ft-select-option-fg: var(--ft-color-on-surface-base);
  --ft-select-option-fg-disabled: var(--ft-color-on-surface-disabled);
  --ft-select-option-check-color: var(--ft-color-primary-base);

  /* Helper */
  --ft-select-helper-font-size: 12px;
  --ft-select-helper-color: var(--ft-color-on-surface-secondary);
  --ft-select-helper-gap: 4px;
  --ft-select-fg-error: var(--ft-color-error-base);

  /* Required */
  --ft-select-required-color: var(--ft-color-error-base);
}
</style>

<!-- Scoped: component styles -->
<style scoped>
.ft-select {
  display: flex;
  flex-direction: column;
  gap: var(--ft-select-label-gap);
  width: 100%;
  position: relative;
}

/* ── Label ── */
.ft-select__label {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--ft-select-font-family);
  font-size: var(--ft-select-label-font-size);
  font-weight: var(--ft-select-label-font-weight);
  color: var(--ft-select-label-color);
  user-select: none;
}

.ft-select--disabled .ft-select__label {
  color: var(--ft-select-fg-disabled);
}

.ft-select__required {
  color: var(--ft-select-required-color);
}

/* ── Trigger ── */
.ft-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--ft-select-height);
  padding: 0 var(--ft-select-padding-x);

  font-family: var(--ft-select-font-family);
  font-size: var(--ft-select-font-size);
  font-weight: var(--ft-select-font-weight);
  line-height: var(--ft-select-line-height);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
  color: var(--ft-select-fg);

  background: var(--ft-select-bg);
  border: var(--ft-select-border-width) solid var(--ft-select-border-color);
  border-radius: var(--ft-select-border-radius);
  cursor: pointer;
  outline: none;
  transition: border-color var(--ft-select-transition),
              box-shadow var(--ft-select-transition);
}

.ft-select__trigger:hover:not([aria-disabled]) {
  border-color: var(--ft-select-border-color-hover);
}

.ft-select__trigger:focus-visible {
  border-color: var(--ft-select-border-color-focus);
  box-shadow: 0 0 0 1px var(--ft-select-border-color-focus);
}

.ft-select--open .ft-select__trigger {
  border-color: var(--ft-select-border-color-focus);
  box-shadow: 0 0 0 1px var(--ft-select-border-color-focus);
}

.ft-select--error .ft-select__trigger {
  border-color: var(--ft-select-border-color-error);
}

.ft-select--error.ft-select--open .ft-select__trigger {
  box-shadow: 0 0 0 1px var(--ft-select-border-color-error);
}

.ft-select--success .ft-select__trigger {
  border-color: var(--ft-select-border-color-success);
}

.ft-select--disabled .ft-select__trigger {
  background: var(--ft-select-bg-disabled);
  color: var(--ft-select-fg-disabled);
  border-color: var(--ft-select-border-color-disabled);
  cursor: not-allowed;
}

.ft-select__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ft-select__placeholder {
  flex: 1;
  color: var(--ft-select-placeholder-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ft-select__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  margin-left: 8px;
}

.ft-select__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  color: var(--ft-select-chevron-color);
  font-size: 10px;
  cursor: pointer;
  transition: color var(--ft-select-transition);
}

.ft-select__clear:hover {
  color: var(--ft-select-fg);
}

.ft-select__chevron {
  font-size: var(--ft-select-chevron-size);
  color: var(--ft-select-chevron-color);
  transition: transform var(--ft-select-transition);
}

.ft-select--open .ft-select__chevron {
  transform: rotate(180deg);
}

/* ── Dropdown ── */
.ft-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 4px;
  background: var(--ft-select-dropdown-bg);
  border: var(--ft-select-border-width) solid var(--ft-select-dropdown-border);
  border-radius: var(--ft-select-dropdown-radius);
  box-shadow: var(--ft-select-dropdown-shadow);
  overflow: hidden;
}

.ft-select__search {
  padding: 8px;
  border-bottom: 1px solid var(--ft-select-dropdown-border);
}

.ft-select__search-input {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  font-family: var(--ft-select-font-family);
  font-size: var(--ft-select-font-size);
  color: var(--ft-select-fg);
  background: var(--ft-select-bg);
  border: var(--ft-select-border-width) solid var(--ft-select-border-color);
  border-radius: var(--ft-select-border-radius);
  outline: none;
}

.ft-select__search-input:focus {
  border-color: var(--ft-select-border-color-focus);
}

.ft-select__options {
  max-height: var(--ft-select-dropdown-max-height);
  overflow-y: auto;
  padding: 4px 0;
}

/* ── Option ── */
.ft-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--ft-select-option-height);
  padding: 0 var(--ft-select-option-padding-x);

  font-family: var(--ft-select-font-family);
  font-size: var(--ft-select-font-size);
  color: var(--ft-select-option-fg);
  cursor: pointer;
  transition: background-color var(--ft-select-transition);
}

.ft-select__option--highlighted,
.ft-select__option:hover {
  background: var(--ft-select-option-bg-hover);
}

.ft-select__option--selected {
  background: var(--ft-select-option-bg-selected);
  font-weight: var(--ft-font-weight-bold, 700);
}

.ft-select__option--disabled {
  color: var(--ft-select-option-fg-disabled);
  cursor: not-allowed;
}

.ft-select__option--disabled:hover {
  background: transparent;
}

.ft-select__check {
  font-size: 12px;
  color: var(--ft-select-option-check-color);
}

.ft-select__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--ft-select-option-height);
  padding: 0 var(--ft-select-option-padding-x);
  color: var(--ft-select-placeholder-color);
  font-family: var(--ft-select-font-family);
  font-size: var(--ft-select-font-size);
}

/* ── Helper / Error text ── */
.ft-select__helper {
  font-family: var(--ft-select-font-family);
  font-size: var(--ft-select-helper-font-size);
  color: var(--ft-select-helper-color);
  margin-top: var(--ft-select-helper-gap);
}

.ft-select__helper--error {
  color: var(--ft-select-fg-error);
}
</style>
