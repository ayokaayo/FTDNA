# Modal

The `FTModal` component displays content in a centered overlay dialog with header, body, and footer slots. It supports three sizes, animated transitions, keyboard close (Escape), overlay click dismiss, and scroll locking. Maps to the **Modal** section in DSP-Master (3 variants).

## Usage

### Composition API (script setup)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FTModal } from '@fasttrack-solutions/vue-components-lib'
import { FTButton } from '@fasttrack-solutions/vue-components-lib'

const showModal = ref(false)
</script>

<template>
  <FTButton primary @click="showModal = true">Open Modal</FTButton>

  <FTModal v-model="showModal" title="Confirmation">
    <p>Are you sure you want to continue?</p>
    <template #footer>
      <FTButton secondary @click="showModal = false">Cancel</FTButton>
      <FTButton primary @click="showModal = false">Confirm</FTButton>
    </template>
  </FTModal>
</template>
```

## Default

<script setup>
import { ref } from 'vue'
const showDefault = ref(false)
const showSmall = ref(false)
const showLarge = ref(false)
const showNoFooter = ref(false)
const showPersistent = ref(false)
</script>

Click the button to open a modal dialog.

<div class="demo">
  <FTButton primary @click="showDefault = true">Open Modal</FTButton>

  <FTModal v-model="showDefault" title="Modal Title">
    <p>This is the modal body content. You can put any content here — forms, text, images, or other components.</p>
    <template #footer>
      <FTButton secondary @click="showDefault = false">Cancel</FTButton>
      <FTButton primary @click="showDefault = false">Confirm</FTButton>
    </template>
  </FTModal>
</div>

```vue
<FTButton primary @click="show = true">Open Modal</FTButton>

<FTModal v-model="show" title="Modal Title">
  <p>Modal body content here.</p>
  <template #footer>
    <FTButton secondary @click="show = false">Cancel</FTButton>
    <FTButton primary @click="show = false">Confirm</FTButton>
  </template>
</FTModal>
```

## Sizes

Three sizes: `sm` (400px), `md` (560px, default), `lg` (800px).

<div class="demo" style="display: flex; gap: 8px;">
  <FTButton secondary @click="showSmall = true">Small</FTButton>
  <FTButton secondary @click="showDefault = true">Medium</FTButton>
  <FTButton secondary @click="showLarge = true">Large</FTButton>

  <FTModal v-model="showSmall" title="Small Modal" size="sm">
    <p>A compact dialog for simple confirmations.</p>
    <template #footer>
      <FTButton primary @click="showSmall = false">OK</FTButton>
    </template>
  </FTModal>

  <FTModal v-model="showLarge" title="Large Modal" size="lg">
    <p>A wider dialog for complex content like forms or data tables.</p>
    <template #footer>
      <FTButton secondary @click="showLarge = false">Cancel</FTButton>
      <FTButton primary @click="showLarge = false">Save Changes</FTButton>
    </template>
  </FTModal>
</div>

```vue
<FTModal v-model="show" title="Small Modal" size="sm" />
<FTModal v-model="show" title="Large Modal" size="lg" />
```

## Without Footer

The footer is optional — it only renders when the `footer` slot is provided.

<div class="demo">
  <FTButton secondary @click="showNoFooter = true">No Footer</FTButton>

  <FTModal v-model="showNoFooter" title="Information">
    <p>This modal has no footer. Close it with the X button, clicking the overlay, or pressing Escape.</p>
  </FTModal>
</div>

## Persistent

A persistent modal cannot be closed by clicking the overlay or pressing Escape — only by programmatic action.

<div class="demo">
  <FTButton secondary @click="showPersistent = true">Persistent</FTButton>

  <FTModal v-model="showPersistent" title="Terms & Conditions" persistent>
    <p>You must accept the terms before continuing.</p>
    <template #footer>
      <FTButton primary @click="showPersistent = false">I Accept</FTButton>
    </template>
  </FTModal>
</div>

```vue
<FTModal v-model="show" title="Terms" persistent>
  ...
</FTModal>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Whether the modal is visible (v-model) |
| `title` | `string` | `undefined` | Modal title in the header |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dialog width (400/560/800px) |
| `closeOnOverlay` | `boolean` | `true` | Close when clicking overlay |
| `closeOnEscape` | `boolean` | `true` | Close when pressing Escape |
| `showClose` | `boolean` | `true` | Show close (X) button |
| `persistent` | `boolean` | `false` | Prevent closing via overlay/escape |
| `ariaLabel` | `string` | `undefined` | Accessible label (falls back to title) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when visibility changes (v-model) |
| `close` | — | Emitted when modal closes |
| `open` | — | Emitted when modal opens |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Modal body content |
| `header` | Custom header (replaces title) |
| `footer` | Footer area (typically action buttons) |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-modal-overlay-bg` | `var(--ft-color-overlay-base)` | Overlay background |
| `--ft-modal-bg` | `var(--ft-color-neutral-white-50)` | Dialog background |
| `--ft-modal-border-radius` | `8px` | Dialog corner radius |
| `--ft-modal-shadow` | `0 8px 32px rgba(0,0,0,0.2)` | Dialog shadow |
| `--ft-modal-width-sm` | `400px` | Small width |
| `--ft-modal-width-md` | `560px` | Medium width |
| `--ft-modal-width-lg` | `800px` | Large width |
| `--ft-modal-max-height` | `85vh` | Max dialog height |
| `--ft-modal-title-font-size` | `18px` | Title text size |
| `--ft-modal-body-font-size` | `14px` | Body text size |
| `--ft-modal-footer-border-color` | `var(--ft-color-border-base)` | Footer top border |
| `--ft-modal-transition-duration` | `200ms` | Animation duration |

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"`
- Close button has `aria-label="Close modal"`
- Escape key closes the modal (unless `persistent`)
- Body scroll is locked while modal is open
- Animated with CSS transitions (scale + opacity)
- Focus ring on close button `:focus-visible`

## Figma Reference

- **DSP-Master:** Modal (3 variants)
- **Variants:** Size=SM/MD/LG
