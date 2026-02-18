<template>
  <label
    class="ft-toggle"
    :class="{
      'ft-toggle--disabled': disabled,
      'ft-toggle--justified': justified,
    }"
  >
    <input
      type="checkbox"
      class="ft-toggle__input"
      :checked="modelValue"
      :disabled="disabled"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="ariaLabel || label"
      @change="handleChange"
    />
    <i
      class="ft-toggle__icon fa-solid"
      :class="[
        modelValue ? 'fa-toggle-on ft-toggle__icon--on' : 'fa-toggle-off ft-toggle__icon--off',
      ]"
      aria-hidden="true"
    />
    <span v-if="label" class="ft-toggle__label">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
interface FTToggleProps {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  justified?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTToggleProps>(), {
  modelValue: false,
  disabled: false,
  justified: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleChange = (event: Event) => {
  if (!props.disabled) {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.checked)
  }
}
</script>

<style>
:root {
  --ft-toggle-icon-size: 20px;
  --ft-toggle-container-size: 24px;
  --ft-toggle-gap: 8px;
  --ft-toggle-icon-color-on: var(--ft-color-success-base);
  --ft-toggle-icon-color-off: var(--ft-color-on-surface-base);
  --ft-toggle-label-color: var(--ft-color-on-surface-base);
  --ft-toggle-label-font-size: 14px;
  --ft-toggle-label-line-height: 20px;
  --ft-toggle-label-font-family: var(--ft-font-family-text, 'Inter', sans-serif);
  --ft-toggle-disabled-opacity: 0.5;
  --ft-toggle-focus-ring: var(--ft-color-focus-ring-base);
}
</style>

<style scoped>
.ft-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--ft-toggle-gap);
  cursor: pointer;
  user-select: none;
}

.ft-toggle--justified {
  display: flex;
  justify-content: space-between;
}

.ft-toggle__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.ft-toggle__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-toggle-container-size);
  height: var(--ft-toggle-container-size);
  flex-shrink: 0;
  font-size: var(--ft-toggle-icon-size);
  transition: color 150ms ease;
}

.ft-toggle__icon--on {
  color: var(--ft-toggle-icon-color-on);
}

.ft-toggle__icon--off {
  color: var(--ft-toggle-icon-color-off);
}

.ft-toggle__label {
  font-family: var(--ft-toggle-label-font-family);
  font-size: var(--ft-toggle-label-font-size);
  line-height: var(--ft-toggle-label-line-height);
  font-weight: var(--ft-font-weight-regular, 400);
  color: var(--ft-toggle-label-color);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

/* Disabled state */
.ft-toggle--disabled {
  opacity: var(--ft-toggle-disabled-opacity);
  cursor: not-allowed;
}

/* Focus ring */
.ft-toggle__input:focus-visible + .ft-toggle__icon {
  outline: 2px solid var(--ft-toggle-focus-ring);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
