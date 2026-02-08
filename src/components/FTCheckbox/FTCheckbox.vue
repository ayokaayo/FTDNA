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
  --ft-checkbox-icon-color: var(--ft-color-neutral-mono-700, #2c2c2c);
  --ft-checkbox-disabled-color: var(--ft-color-neutral-mono-500, #959595);
  --ft-checkbox-disabled-opacity: 0.5;
  --ft-checkbox-icon-size: 20px;
  --ft-checkbox-container-size: 24px;
  --ft-checkbox-gap: 8px;
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
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: var(--ft-checkbox-icon-color);
  line-height: normal;
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
