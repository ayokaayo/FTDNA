<template>
  <div class="ft-tooltip" @mouseenter="show = true" @mouseleave="show = false" @focusin="show = true" @focusout="show = false">
    <span class="ft-tooltip__trigger" tabindex="0">
      <slot />
    </span>
    <div
      v-show="show"
      class="ft-tooltip__balloon"
      :class="`ft-tooltip__balloon--${status} ft-tooltip__balloon--${position}`"
      role="tooltip"
    >
      <span class="ft-tooltip__content">
        <i v-if="copyIcon && iconPosition === 'left'" class="ft-tooltip__copy fa-regular fa-copy" @click.stop="handleCopy" />
        <span class="ft-tooltip__text">{{ truncatedText }}</span>
        <i v-if="copyIcon && iconPosition === 'right'" class="ft-tooltip__copy fa-regular fa-copy" @click.stop="handleCopy" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  text: string
  status?: 'default' | 'success' | 'info' | 'warning' | 'error'
  position?: 'top' | 'bottom' | 'left' | 'right'
  copyIcon?: boolean
  iconPosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  status: 'default',
  position: 'top',
  copyIcon: false,
  iconPosition: 'left'
})

const show = ref(false)

const truncatedText = computed(() => {
  const MAX_CHARS = 120
  return props.text.length > MAX_CHARS
    ? props.text.substring(0, MAX_CHARS) + '…'
    : props.text
})

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}
</script>

<style>
:root {
  --ft-tooltip-bg-default: var(--ft-color-neutral-mono-700, #2c2c2c);
  --ft-tooltip-bg-success: #3aaa35;
  --ft-tooltip-bg-info: #63b6e6;
  --ft-tooltip-bg-warning: #f4a321;
  --ft-tooltip-bg-error: #e54f35;
  --ft-tooltip-fg: white;
  --ft-tooltip-radius: var(--ft-corner-radius-tiny, 4px);
  --ft-tooltip-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.12);
  --ft-tooltip-max-width: 280px;
  --ft-tooltip-font-size: 10px;
  --ft-tooltip-font-weight: 700;
  --ft-tooltip-letter-spacing: 0.2px;
  --ft-tooltip-icon-gap: 8px;
  --ft-tooltip-offset: 6px;
  --ft-tooltip-padding-y: 8px;
  --ft-tooltip-padding-x: 12px;
}
</style>

<style scoped>
/* ---- wrapper ---- */
.ft-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.ft-tooltip__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  outline: none;
}

/* ---- balloon ---- */
.ft-tooltip__balloon {
  position: absolute;
  z-index: 1000;
  width: max-content;
  max-width: var(--ft-tooltip-max-width);
  padding: var(--ft-tooltip-padding-y) var(--ft-tooltip-padding-x);
  border-radius: var(--ft-tooltip-radius);
  box-shadow: var(--ft-tooltip-shadow);
  color: var(--ft-tooltip-fg);
  font-family: 'Inter', sans-serif;
  font-size: var(--ft-tooltip-font-size);
  font-weight: var(--ft-tooltip-font-weight);
  letter-spacing: var(--ft-tooltip-letter-spacing);
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;
  pointer-events: none;
}

/* status colours */
.ft-tooltip__balloon--default { background: var(--ft-tooltip-bg-default); }
.ft-tooltip__balloon--success { background: var(--ft-tooltip-bg-success); }
.ft-tooltip__balloon--info    { background: var(--ft-tooltip-bg-info); }
.ft-tooltip__balloon--warning { background: var(--ft-tooltip-bg-warning); }
.ft-tooltip__balloon--error   { background: var(--ft-tooltip-bg-error); }

/* position: top (default) */
.ft-tooltip__balloon--top {
  bottom: calc(100% + var(--ft-tooltip-offset));
  left: 50%;
  transform: translateX(-50%);
}

/* position: bottom */
.ft-tooltip__balloon--bottom {
  top: calc(100% + var(--ft-tooltip-offset));
  left: 50%;
  transform: translateX(-50%);
}

/* position: left */
.ft-tooltip__balloon--left {
  right: calc(100% + var(--ft-tooltip-offset));
  top: 50%;
  transform: translateY(-50%);
}

/* position: right */
.ft-tooltip__balloon--right {
  left: calc(100% + var(--ft-tooltip-offset));
  top: 50%;
  transform: translateY(-50%);
}

/* ---- inner content row ---- */
.ft-tooltip__content {
  display: flex;
  align-items: center;
  gap: var(--ft-tooltip-icon-gap);
}

.ft-tooltip__copy {
  flex-shrink: 0;
  pointer-events: auto;
  cursor: pointer;
  opacity: 0.85;
}
.ft-tooltip__copy:hover { opacity: 1; }

.ft-tooltip__text {
  flex: 1;
}
</style>
