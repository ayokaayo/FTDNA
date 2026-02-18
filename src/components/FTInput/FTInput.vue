<script setup lang="ts">
import { computed, ref } from 'vue'

interface FTInputProps {
  /** Current input value (v-model) */
  modelValue?: string | number
  /** Input type */
  type?: 'text' | 'password' | 'number' | 'email' | 'search' | 'tel' | 'url'
  /** Label text above the input */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Helper text below the input */
  helperText?: string
  /** Error message (overrides helperText, triggers error styling) */
  errorMessage?: string
  /** Success state styling */
  success?: boolean
  /** Disable the input */
  disabled?: boolean
  /** Read-only input */
  readonly?: boolean
  /** Required field */
  required?: boolean
  /** Font Awesome icon name for leading icon */
  leadingIcon?: string
  /** Font Awesome icon name for trailing icon */
  trailingIcon?: string
  /** Show clear button when input has value */
  clearable?: boolean
  /** Show password visibility toggle (only for type="password") */
  showPasswordToggle?: boolean
  /** Maximum length */
  maxlength?: number
  /** Minimum value (for number type) */
  min?: number
  /** Maximum value (for number type) */
  max?: number
  /** Step value (for number type) */
  step?: number
  /** Accessible label (overrides label for aria-label) */
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTInputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  success: false,
  clearable: false,
  showPasswordToggle: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const passwordVisible = ref(false)

const hasError = computed(() => !!props.errorMessage)
const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== undefined && props.modelValue !== null)

const actualType = computed(() => {
  if (props.type === 'password' && passwordVisible.value) {
    return 'text'
  }
  return props.type
})

const showClear = computed(() =>
  props.clearable && hasValue.value && !props.disabled && !props.readonly
)

const showPasswordToggle = computed(() =>
  props.type === 'password' && props.showPasswordToggle && !props.disabled
)

const containerClasses = computed(() => ({
  'ft-input': true,
  'ft-input--focused': isFocused.value,
  'ft-input--error': hasError.value,
  'ft-input--success': props.success && !hasError.value,
  'ft-input--disabled': props.disabled,
  'ft-input--readonly': props.readonly,
  'ft-input--has-value': hasValue.value,
  'ft-input--has-leading-icon': !!props.leadingIcon,
  'ft-input--has-trailing-icon': !!props.trailingIcon || showClear.value || showPasswordToggle.value,
}))

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? target.valueAsNumber : target.value
  emit('update:modelValue', value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
  inputRef.value?.focus()
}
</script>

<template>
  <div :class="containerClasses">
    <!-- Label -->
    <label
      v-if="label"
      class="ft-input__label"
      @click="inputRef?.focus()"
    >
      {{ label }}
      <span v-if="required" class="ft-input__required" aria-hidden="true">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="ft-input__wrapper">
      <!-- Leading icon -->
      <span
        v-if="leadingIcon"
        class="ft-input__icon ft-input__icon--leading"
        aria-hidden="true"
      >
        <i :class="`fas fa-${leadingIcon}`"></i>
      </span>

      <!-- Native input -->
      <input
        ref="inputRef"
        class="ft-input__field"
        :type="actualType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="ariaLabel || label"
        :aria-invalid="hasError || undefined"
        :aria-describedby="(helperText || errorMessage) ? 'ft-input-helper' : undefined"
        :aria-required="required || undefined"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Clear button -->
      <button
        v-if="showClear"
        class="ft-input__action"
        type="button"
        aria-label="Clear input"
        tabindex="-1"
        @click="handleClear"
      >
        <i class="fas fa-xmark" aria-hidden="true"></i>
      </button>

      <!-- Password toggle -->
      <button
        v-if="showPasswordToggle"
        class="ft-input__action"
        type="button"
        :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
        tabindex="-1"
        @click="togglePasswordVisibility"
      >
        <i :class="`fas fa-${passwordVisible ? 'eye-slash' : 'eye'}`" aria-hidden="true"></i>
      </button>

      <!-- Trailing icon -->
      <span
        v-if="trailingIcon && !showClear && !showPasswordToggle"
        class="ft-input__icon ft-input__icon--trailing"
        aria-hidden="true"
      >
        <i :class="`fas fa-${trailingIcon}`"></i>
      </span>
    </div>

    <!-- Helper / Error text -->
    <div
      v-if="errorMessage || helperText"
      id="ft-input-helper"
      class="ft-input__helper"
      :class="{ 'ft-input__helper--error': hasError }"
      role="status"
      :aria-live="hasError ? 'assertive' : 'polite'"
    >
      {{ errorMessage || helperText }}
    </div>
  </div>
</template>

<!-- Unscoped: CSS custom property definitions need :root access -->
<style>
:root {
  /* FTInput — component-level variables */

  /* Dimensions */
  --ft-input-height: 36px;
  --ft-input-font-size: 14px;
  --ft-input-font-weight: var(--ft-font-weight-regular, 400);
  --ft-input-font-family: var(--ft-font-family-text, 'Inter', sans-serif);
  --ft-input-line-height: 20px;
  --ft-input-padding-x: 12px;
  --ft-input-padding-icon: 36px;
  --ft-input-border-radius: 4px;
  --ft-input-border-width: 1px;
  --ft-input-transition: 150ms ease;

  /* Label */
  --ft-input-label-font-size: 12px;
  --ft-input-label-font-weight: var(--ft-font-weight-bold, 700);
  --ft-input-label-line-height: 16px;
  --ft-input-label-color: var(--ft-color-on-surface-base);
  --ft-input-label-gap: 4px;

  /* Field colors — default */
  --ft-input-bg: var(--ft-color-neutral-white-50, #ffffff);
  --ft-input-fg: var(--ft-color-on-surface-base);
  --ft-input-border-color: var(--ft-color-border-base);
  --ft-input-placeholder-color: var(--ft-color-on-surface-tertiary);

  /* Field colors — hover */
  --ft-input-border-color-hover: var(--ft-color-border-strong);

  /* Field colors — focused */
  --ft-input-border-color-focus: var(--ft-color-border-focus);
  --ft-input-focus-ring: var(--ft-color-focus-ring-base);

  /* Field colors — error */
  --ft-input-border-color-error: var(--ft-color-error-base);
  --ft-input-fg-error: var(--ft-color-error-base);

  /* Field colors — success */
  --ft-input-border-color-success: var(--ft-color-success-base);

  /* Field colors — disabled */
  --ft-input-bg-disabled: var(--ft-color-neutral-lightest);
  --ft-input-fg-disabled: var(--ft-color-on-surface-disabled);
  --ft-input-border-color-disabled: var(--ft-color-border-subtle);

  /* Helper text */
  --ft-input-helper-font-size: 12px;
  --ft-input-helper-line-height: 16px;
  --ft-input-helper-color: var(--ft-color-on-surface-secondary);
  --ft-input-helper-gap: 4px;

  /* Icon */
  --ft-input-icon-size: 14px;
  --ft-input-icon-color: var(--ft-color-on-surface-tertiary);

  /* Action button (clear, password toggle) */
  --ft-input-action-color: var(--ft-color-on-surface-tertiary);
  --ft-input-action-color-hover: var(--ft-color-on-surface-base);

  /* Required asterisk */
  --ft-input-required-color: var(--ft-color-error-base);
}
</style>

<!-- Scoped: component styles -->
<style scoped>
.ft-input {
  display: flex;
  flex-direction: column;
  gap: var(--ft-input-label-gap);
  width: 100%;
}

/* ── Label ── */
.ft-input__label {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--ft-input-font-family);
  font-size: var(--ft-input-label-font-size);
  font-weight: var(--ft-input-label-font-weight);
  line-height: var(--ft-input-label-line-height);
  color: var(--ft-input-label-color);
  cursor: pointer;
  user-select: none;
}

.ft-input--disabled .ft-input__label {
  color: var(--ft-input-fg-disabled);
  cursor: not-allowed;
}

.ft-input__required {
  color: var(--ft-input-required-color);
}

/* ── Input wrapper ── */
.ft-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* ── Native input ── */
.ft-input__field {
  width: 100%;
  height: var(--ft-input-height);
  padding: 0 var(--ft-input-padding-x);

  font-family: var(--ft-input-font-family);
  font-size: var(--ft-input-font-size);
  font-weight: var(--ft-input-font-weight);
  line-height: var(--ft-input-line-height);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
  color: var(--ft-input-fg);

  background: var(--ft-input-bg);
  border: var(--ft-input-border-width) solid var(--ft-input-border-color);
  border-radius: var(--ft-input-border-radius);
  outline: none;
  transition: border-color var(--ft-input-transition),
              box-shadow var(--ft-input-transition);
}

.ft-input__field::placeholder {
  color: var(--ft-input-placeholder-color);
}

/* Padding adjustments for icons */
.ft-input--has-leading-icon .ft-input__field {
  padding-left: var(--ft-input-padding-icon);
}

.ft-input--has-trailing-icon .ft-input__field {
  padding-right: var(--ft-input-padding-icon);
}

/* ── States ── */
.ft-input__field:hover:not(:disabled):not(:read-only) {
  border-color: var(--ft-input-border-color-hover);
}

.ft-input--focused .ft-input__field {
  border-color: var(--ft-input-border-color-focus);
  box-shadow: 0 0 0 1px var(--ft-input-border-color-focus);
}

.ft-input--error .ft-input__field {
  border-color: var(--ft-input-border-color-error);
}

.ft-input--error.ft-input--focused .ft-input__field {
  box-shadow: 0 0 0 1px var(--ft-input-border-color-error);
}

.ft-input--success .ft-input__field {
  border-color: var(--ft-input-border-color-success);
}

.ft-input--success.ft-input--focused .ft-input__field {
  box-shadow: 0 0 0 1px var(--ft-input-border-color-success);
}

.ft-input--disabled .ft-input__field {
  background: var(--ft-input-bg-disabled);
  color: var(--ft-input-fg-disabled);
  border-color: var(--ft-input-border-color-disabled);
  cursor: not-allowed;
}

.ft-input--readonly .ft-input__field {
  cursor: default;
}

/* ── Icons ── */
.ft-input__icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-input-height);
  height: var(--ft-input-height);
  color: var(--ft-input-icon-color);
  font-size: var(--ft-input-icon-size);
  pointer-events: none;
}

.ft-input__icon--leading {
  left: 0;
}

.ft-input__icon--trailing {
  right: 0;
}

/* ── Action buttons (clear, password toggle) ── */
.ft-input__action {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-input-height);
  height: var(--ft-input-height);
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  color: var(--ft-input-action-color);
  font-size: var(--ft-input-icon-size);
  cursor: pointer;
  transition: color var(--ft-input-transition);
}

.ft-input__action:hover {
  color: var(--ft-input-action-color-hover);
}

/* ── Helper / Error text ── */
.ft-input__helper {
  font-family: var(--ft-input-font-family);
  font-size: var(--ft-input-helper-font-size);
  line-height: var(--ft-input-helper-line-height);
  color: var(--ft-input-helper-color);
  margin-top: var(--ft-input-helper-gap);
}

.ft-input__helper--error {
  color: var(--ft-input-fg-error);
}
</style>
