<template>
  <label
    class="ft-checkbox"
    :class="{
      'ft-checkbox--disabled': disabled,
      'ft-checkbox--flipped': flipped,
    }"
  >
    <input
      type="checkbox"
      class="ft-checkbox__input"
      :checked="isChecked"
      :disabled="disabled"
      :value="value"
      :aria-label="ariaLabel"
      @change="handleChange"
    />
    <!-- Font Awesome icon: solid square-check when checked, regular square when unchecked -->
    <i
      class="ft-checkbox__icon"
      :class="isChecked ? 'fa-solid fa-square-check' : 'fa-regular fa-square'"
    />
    <span v-if="$slots.default" class="ft-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean | string | number | (string | number)[]
  value?: string | number
  checked?: boolean
  disabled?: boolean
  flipped?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  flipped: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | (string | number)[]]
}>()

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.value !== undefined && props.modelValue.includes(props.value)
  }
  if (props.checked !== undefined) {
    return props.checked
  }
  return !!props.modelValue
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newValue = target.checked

  if (Array.isArray(props.modelValue)) {
    const updatedArray = newValue
      ? [...props.modelValue, props.value]
      : props.modelValue.filter((v) => v !== props.value)
    emit('update:modelValue', updatedArray)
  } else {
    emit('update:modelValue', newValue)
  }
}
</script>

<style>
:root {
  --ft-checkbox-icon-color: var(--ft-color-on-surface-base);
  --ft-checkbox-disabled-color: var(--ft-color-on-surface-disabled);
  --ft-checkbox-disabled-opacity: 0.5;
  --ft-checkbox-icon-size: 20px;
  --ft-checkbox-container-size: 24px;
  --ft-checkbox-gap: 8px;
  --ft-checkbox-label-font-size: 14px;
  --ft-checkbox-label-line-height: 20px;
  --ft-checkbox-label-font-family: var(--ft-font-family-text, 'Inter', sans-serif);
  --ft-checkbox-focus-ring: var(--ft-color-focus-ring-base);
}
</style>

<style scoped>
.ft-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--ft-checkbox-gap);
  cursor: pointer;
  user-select: none;
}

.ft-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.ft-checkbox__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-checkbox-container-size);
  height: var(--ft-checkbox-container-size);
  flex-shrink: 0;
  font-size: var(--ft-checkbox-icon-size);
  color: var(--ft-checkbox-icon-color);
  transition: color 150ms ease;
}

.ft-checkbox__label {
  font-family: var(--ft-checkbox-label-font-family);
  font-size: var(--ft-checkbox-label-font-size);
  line-height: var(--ft-checkbox-label-line-height);
  font-weight: var(--ft-font-weight-regular, 400);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
  color: var(--ft-checkbox-icon-color);
}

/* Focus ring */
.ft-checkbox__input:focus-visible + .ft-checkbox__icon {
  outline: 2px solid var(--ft-checkbox-focus-ring);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Disabled state */
.ft-checkbox--disabled {
  opacity: var(--ft-checkbox-disabled-opacity);
  cursor: not-allowed;
}

.ft-checkbox--disabled .ft-checkbox__label {
  color: var(--ft-checkbox-disabled-color);
}

.ft-checkbox--disabled .ft-checkbox__input {
  cursor: not-allowed;
}

/* Flipped layout (label before checkbox) */
.ft-checkbox--flipped {
  flex-direction: row-reverse;
}
</style>
