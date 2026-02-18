<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount, ref } from 'vue'

interface FTModalProps {
  /** Whether the modal is visible (v-model) */
  modelValue?: boolean
  /** Modal title */
  title?: string
  /** Modal size */
  size?: 'sm' | 'md' | 'lg'
  /** Whether clicking the overlay closes the modal */
  closeOnOverlay?: boolean
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean
  /** Whether to show the close button in the header */
  showClose?: boolean
  /** Whether the modal is persistent (no close on overlay/escape) */
  persistent?: boolean
  /** Accessible label */
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTModalProps>(), {
  modelValue: false,
  size: 'md',
  closeOnOverlay: true,
  closeOnEscape: true,
  showClose: true,
  persistent: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'open': []
}>()

const modalRef = ref<HTMLElement | null>(null)

const modalClasses = computed(() => ({
  'ft-modal__dialog': true,
  [`ft-modal__dialog--${props.size}`]: true,
}))

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget && props.closeOnOverlay && !props.persistent) {
    close()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && !props.persistent) {
    close()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    emit('open')
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="ft-modal">
      <div
        v-if="modelValue"
        class="ft-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel || title"
        @click="handleOverlayClick"
        @keydown="handleKeyDown"
      >
        <div ref="modalRef" :class="modalClasses">
          <!-- Header -->
          <div v-if="title || showClose || $slots.header" class="ft-modal__header">
            <slot name="header">
              <h2 v-if="title" class="ft-modal__title">{{ title }}</h2>
            </slot>
            <button
              v-if="showClose && !persistent"
              class="ft-modal__close"
              type="button"
              aria-label="Close modal"
              @click="close"
            >
              <i class="fas fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="ft-modal__body">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="ft-modal__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<!-- Unscoped: CSS custom property definitions -->
<style>
:root {
  /* FTModal — component-level variables */

  /* Overlay */
  --ft-modal-overlay-bg: var(--ft-color-overlay-base);

  /* Dialog */
  --ft-modal-bg: var(--ft-color-neutral-white-50, #ffffff);
  --ft-modal-border-radius: 8px;
  --ft-modal-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  --ft-modal-font-family: var(--ft-font-family-text, 'Inter', sans-serif);

  /* Sizes */
  --ft-modal-width-sm: 400px;
  --ft-modal-width-md: 560px;
  --ft-modal-width-lg: 800px;
  --ft-modal-max-height: 85vh;

  /* Header */
  --ft-modal-header-padding: 20px 24px;
  --ft-modal-title-font-size: 18px;
  --ft-modal-title-font-weight: var(--ft-font-weight-bold, 700);
  --ft-modal-title-color: var(--ft-color-on-surface-base);
  --ft-modal-close-color: var(--ft-color-on-surface-tertiary);
  --ft-modal-close-color-hover: var(--ft-color-on-surface-base);
  --ft-modal-close-size: 20px;

  /* Body */
  --ft-modal-body-padding: 0 24px 20px;
  --ft-modal-body-font-size: 14px;
  --ft-modal-body-color: var(--ft-color-on-surface-secondary);

  /* Footer */
  --ft-modal-footer-padding: 16px 24px;
  --ft-modal-footer-border-color: var(--ft-color-border-base);
  --ft-modal-footer-gap: 8px;

  /* Animation */
  --ft-modal-transition-duration: 200ms;
}
</style>

<!-- Scoped: component styles -->
<style scoped>
.ft-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--ft-modal-overlay-bg);
}

/* ── Dialog ── */
.ft-modal__dialog {
  display: flex;
  flex-direction: column;
  max-height: var(--ft-modal-max-height);
  background: var(--ft-modal-bg);
  border-radius: var(--ft-modal-border-radius);
  box-shadow: var(--ft-modal-shadow);
  overflow: hidden;
}

.ft-modal__dialog--sm { width: var(--ft-modal-width-sm); }
.ft-modal__dialog--md { width: var(--ft-modal-width-md); }
.ft-modal__dialog--lg { width: var(--ft-modal-width-lg); }

/* ── Header ── */
.ft-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ft-modal-header-padding);
  flex-shrink: 0;
}

.ft-modal__title {
  margin: 0;
  font-family: var(--ft-modal-font-family);
  font-size: var(--ft-modal-title-font-size);
  font-weight: var(--ft-modal-title-font-weight);
  color: var(--ft-modal-title-color);
  line-height: 1.3;
}

.ft-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  margin-left: 16px;
  border: none;
  background: transparent;
  color: var(--ft-modal-close-color);
  font-size: var(--ft-modal-close-size);
  cursor: pointer;
  border-radius: 4px;
  transition: color var(--ft-modal-transition-duration),
              background-color var(--ft-modal-transition-duration);
}

.ft-modal__close:hover {
  color: var(--ft-modal-close-color-hover);
  background: var(--ft-color-neutral-lightest, #f5f5f5);
}

.ft-modal__close:focus-visible {
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: 2px;
}

/* ── Body ── */
.ft-modal__body {
  padding: var(--ft-modal-body-padding);
  font-family: var(--ft-modal-font-family);
  font-size: var(--ft-modal-body-font-size);
  color: var(--ft-modal-body-color);
  line-height: 1.5;
  overflow-y: auto;
  flex: 1;
}

/* ── Footer ── */
.ft-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ft-modal-footer-gap);
  padding: var(--ft-modal-footer-padding);
  border-top: 1px solid var(--ft-modal-footer-border-color);
  flex-shrink: 0;
}

/* ── Transitions ── */
.ft-modal-enter-active,
.ft-modal-leave-active {
  transition: opacity var(--ft-modal-transition-duration) ease;
}

.ft-modal-enter-active .ft-modal__dialog,
.ft-modal-leave-active .ft-modal__dialog {
  transition: transform var(--ft-modal-transition-duration) ease;
}

.ft-modal-enter-from,
.ft-modal-leave-to {
  opacity: 0;
}

.ft-modal-enter-from .ft-modal__dialog {
  transform: scale(0.95) translateY(8px);
}

.ft-modal-leave-to .ft-modal__dialog {
  transform: scale(0.95) translateY(8px);
}
</style>
