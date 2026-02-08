<template>
  <label class="ft-radio" :class="{ 'ft-radio--disabled': disabled, 'ft-radio--flipped': flipped }">
    <input
      type="radio"
      class="ft-radio__input"
      :value="value"
      :disabled="disabled"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
      aria-role="radio"
      :aria-checked="modelValue === value"
    />
    <div class="ft-radio__box"></div>
    <div class="ft-radio__label">
      <slot></slot>
    </div>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  value: string
  disabled?: boolean
  flipped?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style>
:root {
  --ft-radio-checked-color: var(--ft-color-brand-pink-400, #E96092);
  --ft-radio-border-color: var(--ft-color-neutral-gray-500, #959595);
  --ft-radio-disabled-opacity: 0.5;
  --ft-radio-size: 20px;
  --ft-radio-dot-size: 10px;
  --ft-radio-gap: 5px;
  --ft-radio-border-width: 2px;
}
</style>

<style scoped>
.ft-radio {
  display: flex;
  align-items: center;
  gap: var(--ft-radio-gap);
  cursor: pointer;
  user-select: none;
}

.ft-radio--disabled {
  opacity: var(--ft-radio-disabled-opacity);
  cursor: not-allowed;
}

.ft-radio--flipped {
  flex-direction: row-reverse;
}

.ft-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.ft-radio__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-radio-size);
  height: var(--ft-radio-size);
  flex-shrink: 0;
  border: var(--ft-radio-border-width) solid var(--ft-radio-border-color);
  border-radius: 50%;
  transition: border-color 0.2s ease;
}

.ft-radio__input:checked + .ft-radio__box {
  border-color: var(--ft-radio-checked-color);
}

.ft-radio__input:checked + .ft-radio__box::after {
  content: '';
  display: block;
  width: var(--ft-radio-dot-size);
  height: var(--ft-radio-dot-size);
  background-color: var(--ft-radio-checked-color);
  border-radius: 50%;
}

.ft-radio__label {
  display: flex;
  align-items: center;
}
</style>
