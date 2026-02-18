<template>
  <div
    class="ft-logo"
    :class="[
      `ft-logo--${variant}`,
      `ft-logo--${size}`,
    ]"
    role="img"
    :aria-label="ariaLabel"
  >
    <!-- Icon -->
    <img
      v-if="showIcon"
      class="ft-logo__icon"
      :src="iconSrc"
      alt=""
      aria-hidden="true"
    />
    <!-- Text -->
    <img
      v-if="showText"
      class="ft-logo__text"
      :src="textSrc"
      alt=""
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import iconColour from '../../assets/logos/ft-icon-colour.svg'
import iconBlack from '../../assets/logos/ft-icon-black.svg'
import iconWhite from '../../assets/logos/ft-icon-white.svg'
import textBlack from '../../assets/logos/ft-text-black.svg'
import textWhite from '../../assets/logos/ft-text-white.svg'

export type LogoVariant = 'colour-black' | 'colour-white' | 'black' | 'white'
export type LogoSize = 'full' | 'icon' | 'text'

interface FTLogoProps {
  variant?: LogoVariant
  size?: LogoSize
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTLogoProps>(), {
  variant: 'colour-black',
  size: 'full',
  ariaLabel: 'Fast Track',
})

const showIcon = computed(() => props.size !== 'text')
const showText = computed(() => props.size !== 'icon')

const iconSrc = computed(() => {
  switch (props.variant) {
    case 'colour-black':
    case 'colour-white':
      return iconColour
    case 'black':
      return iconBlack
    case 'white':
      return iconWhite
    default:
      return iconColour
  }
})

const textSrc = computed(() => {
  switch (props.variant) {
    case 'colour-black':
    case 'black':
      return textBlack
    case 'colour-white':
    case 'white':
      return textWhite
    default:
      return textBlack
  }
})
</script>

<style>
:root {
  --ft-logo-icon-size: 32px;
  --ft-logo-text-height: 16px;
  --ft-logo-gap: var(--ft-spacing-sm, 8px);
}
</style>

<style scoped>
.ft-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--ft-logo-gap);
  flex-shrink: 0;
}

.ft-logo__icon {
  display: block;
  height: var(--ft-logo-icon-size);
  width: auto;
}

.ft-logo__text {
  display: block;
  height: var(--ft-logo-text-height);
  width: auto;
}

/* Size: icon only */
.ft-logo--icon .ft-logo__icon {
  height: var(--ft-logo-icon-size);
}

/* Size: text only */
.ft-logo--text .ft-logo__text {
  height: var(--ft-logo-text-height);
}
</style>
