# FastTrack Vue Components Library - AI Rules Document

This is the single source of truth for all AI-driven component generation in the FastTrack Vue Components Library. All AI tools (Claude, Cursor, etc.) MUST reference and follow these rules for production-ready output.

---

## IDENTITY & PROJECT SCOPE

### Package Information
- **Package Name**: `@fasttrack-solutions/vue-components-lib`
- **Design System Package**: `@fasttrack-solutions/design-system`
- **Registry**: GitHub Packages (private, `npm.pkg.github.com`)
- **Framework**: Vue 3 + TypeScript
- **Figma Library**: DSP-Master (839 components across 29 sections)
- **Documentation**: VitePress at `docs/` directory

### Component Naming Prefix
- **ALL components MUST use the `FT` prefix**
- Examples: `FTButton`, `FTInput`, `FTCard`, `FTPanel`, `FTModal`, `FTBadge`
- Import source: Always `@fasttrack-solutions/vue-components-lib`

---

## COMPONENT CONVENTIONS

### Script Setup & API Style

**Primary pattern (Composition API with `<script setup>`):**
```typescript
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  primary?: boolean
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

**Supported alternative (Options API for backwards compatibility):**
```typescript
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FTButton',
  props: {
    primary: Boolean,
    disabled: Boolean,
    size: { type: String as const, default: 'medium' }
  },
  emits: ['click']
})
</script>
```

### Props Pattern

**Boolean Shorthand (Preferred):**
- Use boolean props for style variants and states
- In templates: `<FTButton primary>` not `<FTButton variant="primary">`
- In TypeScript interfaces: `primary?: boolean`, `secondary?: boolean`, etc.

**Style Variant Props (Boolean):**
- `primary`, `secondary`, `tertiary`
- `action`, `warning`, `success`, `info`, `error`
- Only ONE variant prop should be `true` at a time (document this clearly)

**State Props (Boolean):**
- `loading` - indicates async operation in progress
- `disabled` - prevents interaction and grays out component
- `active` - indicates selected/active state
- `readonly` - for form elements, allows viewing but not editing

**Icon Props:**
- `icon="fas plus"` (Font Awesome reference with `fad` duotone prefix preferred)
- `iconOnly` - boolean, shows only icon no text
- `iconSmall` - boolean, icon size small
- `iconMedium` - boolean, icon size medium (default)
- `iconBig` - boolean, icon size large

**Tooltip Props:**
- `tooltip="Descriptive tooltip text"`
- `tooltipPosition="top" | "bottom" | "left" | "right"`

**Size Props:**
- Use as string enum when applicable: `size="small" | "medium" | "large"`
- Never create multiple boolean size props (use enum instead)

### Props TypeScript Interface Pattern

```typescript
interface FTButtonProps {
  // Style variants (boolean)
  primary?: boolean
  secondary?: boolean
  tertiary?: boolean

  // State
  loading?: boolean
  disabled?: boolean
  active?: boolean

  // Content & sizing
  icon?: string
  iconOnly?: boolean
  size?: 'small' | 'medium' | 'large'

  // Accessibility & tooltips
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  ariaLabel?: string
}
```

---

## DESIGN TOKENS — ABSOLUTE RULE: NO HARDCODED VALUES

Every single color, spacing, typography, and shadow value MUST come from the design token system. **NEVER hardcode hex colors, pixel values, or other magic numbers.**

### Token File Locations
- **CSS**: `dist/tokens.css` (159 custom properties)
- **SCSS**: `dist/tokens.scss`
- **TypeScript Composable**: `dist/useTokens.ts` (Vue 3 composable)

### Token Naming Convention

**Base format:** `--ft-{category}-{subcategory}-{property}`

### COLOR TOKENS

**Brand Colors (13 families, 67 unique values):**

Primary families:
- pink, purple, blue, yellow, red, orange

Secondary families:
- magenta, thunderbird, lilac, aqua, denim, apple

Neutral families:
- black, gray, white

**Token format:** `--ft-color-brand-{family}-{shade}`

Examples:
```css
--ft-color-brand-pink-100
--ft-color-brand-pink-700  /* base shade */
--ft-color-brand-pink-900
--ft-color-brand-blue-500
--ft-color-brand-purple-300
```

**Semantic Tokens (role-based):**

Format: `--ft-color-{role}-{variant}`

Semantic roles and their base implementations:
- `primary` → implemented with blue family
- `secondary` → implemented with pink family
- `tertiary` → implemented with purple family
- `success` → implemented with apple green family
- `warning` → implemented with yellow family
- `error` → implemented with red family
- `info` → implemented with aqua family

Variants for each role:
- `base` - primary color
- `light` - lighter tint for backgrounds
- `dark` - darker shade for text/borders
- `disabled` - reduced opacity/desaturation

Examples:
```css
--ft-color-primary-base        /* blue-700 */
--ft-color-primary-light       /* blue-100 */
--ft-color-primary-dark        /* blue-900 */
--ft-color-primary-disabled    /* blue-400 with reduced opacity */

--ft-color-error-base          /* red-700 */
--ft-color-success-light       /* apple green-100 */
--ft-color-warning-dark        /* yellow-900 */
```

**Neutral & Special Tokens:**
```css
--ft-color-neutral-white       /* #FFFFFF */
--ft-color-neutral-black       /* #000000 */
--ft-color-neutral-text        /* main text color */
--ft-color-neutral-border      /* border color */
--ft-color-neutral-bg          /* background color */
--ft-color-focus-ring-base     /* 2px outline color */
--ft-color-focus-ring-offset   /* outline-offset */
```

### TYPOGRAPHY TOKENS

**Font Families:**
```css
--ft-font-family-text          /* Inter */
--ft-font-family-code          /* Noto Sans Mono */
```

**Font Weights (2 values only):**
```css
--ft-font-weight-regular       /* 400 */
--ft-font-weight-bold          /* 700 */
```

**Text Styles (17 total):**

Display styles:
- `--ft-text-display-large` (font-size, line-height, letter-spacing)
- `--ft-text-display-medium`

Heading styles:
- `--ft-text-heading-medium-bold`
- `--ft-text-heading-small`
- `--ft-text-heading-small-bold`

Body styles:
- `--ft-text-body-large`
- `--ft-text-body-large-bold`
- `--ft-text-body-medium`
- `--ft-text-body-medium-bold`
- `--ft-text-body-small`
- `--ft-text-body-small-bold`

Caption styles:
- `--ft-text-caption-medium`
- `--ft-text-caption-medium-bold`
- `--ft-text-caption-small`
- `--ft-text-caption-small-bold`

Variant styles:
- `--ft-text-variant-link`
- `--ft-text-variant-cta`

### SPACING TOKENS

Format: `--ft-spacing-{size}`

Examples:
```css
--ft-spacing-xs              /* 4px */
--ft-spacing-small           /* 8px */
--ft-spacing-medium          /* 16px */
--ft-spacing-large           /* 24px */
--ft-spacing-xl              /* 32px */
--ft-spacing-2xl             /* 48px */
```

### COMPONENT-LEVEL CSS VARIABLES

Each component defines its own scoped CSS variables following this pattern:

Format: `--ft-{component-name}-{property}-{optional-state}`

Examples for FTButton:
```css
--ft-btn-height               /* base height */
--ft-btn-height-small         /* small variant height */
--ft-btn-height-large         /* large variant height */

--ft-btn-font-size
--ft-btn-font-weight

--ft-btn-main-bg-default      /* primary variant background */
--ft-btn-main-bg-hover        /* primary variant on hover */
--ft-btn-main-bg-active       /* primary variant on active */
--ft-btn-main-bg-disabled     /* primary variant when disabled */

--ft-btn-secondary-bg-default
--ft-btn-secondary-text-color

--ft-btn-padding-x
--ft-btn-padding-y

--ft-btn-border-radius
--ft-btn-border-width

--ft-btn-transition-duration  /* 150ms */
--ft-btn-transition-timing    /* ease */
```

**Critical rule:** All values in component CSS variables MUST reference semantic tokens:
```css
/* CORRECT */
--ft-btn-main-bg-default: var(--ft-color-primary-base);
--ft-btn-text-color: var(--ft-color-neutral-white);
--ft-btn-height: var(--ft-spacing-large);

/* WRONG - NEVER DO THIS */
--ft-btn-main-bg-default: #0066FF;
--ft-btn-text-color: white;
--ft-btn-height: 24px;
```

---

## CSS ARCHITECTURE

### Scoped Styles with CSS Custom Properties

**File structure:**
```
src/components/
  FTButton/
    FTButton.vue          (single-file component)
    FTButton.css          (separate stylesheet)
    index.ts              (barrel export)
```

**Component CSS approach:**

1. Scoped styles prevent leakage
2. Use CSS custom properties for all values (enabling theming)
3. Reference semantic tokens and component variables
4. Never hardcode color hex values or pixel dimensions

### CSS Pattern Example (FTButton)

```css
/* FTButton.css */

:root {
  /* Component-level variables referencing semantic tokens */
  --ft-btn-height: calc(var(--ft-spacing-medium) * 1.5);
  --ft-btn-height-small: calc(var(--ft-spacing-medium) * 1.25);
  --ft-btn-height-large: calc(var(--ft-spacing-large) * 1.25);

  --ft-btn-font-size: var(--ft-text-body-medium);
  --ft-btn-font-weight: var(--ft-font-weight-bold);

  --ft-btn-main-bg-default: var(--ft-color-primary-base);
  --ft-btn-main-bg-hover: var(--ft-color-primary-dark);
  --ft-btn-main-bg-active: var(--ft-color-primary-dark);
  --ft-btn-main-bg-disabled: var(--ft-color-primary-disabled);

  --ft-btn-main-text-default: var(--ft-color-neutral-white);
  --ft-btn-main-text-disabled: var(--ft-color-neutral-text);

  --ft-btn-secondary-bg-default: var(--ft-color-secondary-light);
  --ft-btn-secondary-bg-hover: var(--ft-color-secondary-base);
  --ft-btn-secondary-text-default: var(--ft-color-secondary-dark);

  --ft-btn-padding-x: var(--ft-spacing-medium);
  --ft-btn-padding-y: var(--ft-spacing-small);

  --ft-btn-border-radius: 6px;
  --ft-btn-border-width: 2px;
  --ft-btn-border-color: var(--ft-color-neutral-border);

  --ft-btn-transition-duration: 150ms;
  --ft-btn-transition-timing: ease;
}

.ft-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ft-spacing-small);

  height: var(--ft-btn-height);
  padding: var(--ft-btn-padding-y) var(--ft-btn-padding-x);

  font-size: var(--ft-btn-font-size);
  font-weight: var(--ft-btn-font-weight);
  font-family: var(--ft-font-family-text);

  background-color: var(--ft-btn-main-bg-default);
  color: var(--ft-btn-main-text-default);
  border: var(--ft-btn-border-width) solid var(--ft-btn-border-color);
  border-radius: var(--ft-btn-border-radius);

  cursor: pointer;
  transition: background-color var(--ft-btn-transition-duration) var(--ft-btn-transition-timing),
              color var(--ft-btn-transition-duration) var(--ft-btn-transition-timing);
}

.ft-button:hover:not(:disabled) {
  background-color: var(--ft-btn-main-bg-hover);
}

.ft-button:active:not(:disabled) {
  background-color: var(--ft-btn-main-bg-active);
}

.ft-button:disabled {
  background-color: var(--ft-btn-main-bg-disabled);
  color: var(--ft-btn-main-text-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

/* BEM-like variant classes */
.ft-button--secondary {
  background-color: var(--ft-btn-secondary-bg-default);
  color: var(--ft-btn-secondary-text-default);
}

.ft-button--secondary:hover:not(:disabled) {
  background-color: var(--ft-btn-secondary-bg-hover);
}

/* Size variants */
.ft-button--small {
  height: var(--ft-btn-height-small);
  font-size: 0.875rem;
}

.ft-button--large {
  height: var(--ft-btn-height-large);
  font-size: 1.125rem;
}

/* Icon element */
.ft-button__icon {
  width: 1em;
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ft-button--icon-only {
  width: var(--ft-btn-height);
  padding: 0;
}
```

### BEM-like Class Naming

- **Block**: `.ft-{component-name}`
- **Element**: `.ft-{component-name}__{element}`
- **Modifier**: `.ft-{component-name}--{modifier}`

Examples:
```css
.ft-button               /* block */
.ft-button__icon        /* element within button */
.ft-button--primary     /* modifier */
.ft-button--small       /* size modifier */

.ft-input               /* block */
.ft-input__label        /* element */
.ft-input--error        /* error state */
```

### Responsive Design

- Components must work at all breakpoints
- Use CSS media queries with mobile-first approach
- Breakpoints (if using SCSS variables):
  ```scss
  $breakpoint-sm: 640px;
  $breakpoint-md: 768px;
  $breakpoint-lg: 1024px;
  $breakpoint-xl: 1280px;
  ```

### Transitions

- Standard transition duration: **150ms**
- Standard timing function: **ease**
- Applied to: color changes, background changes, opacity, transform
- Never use `all` - specify properties explicitly

---

## ACCESSIBILITY REQUIREMENTS

**Every interactive component MUST be fully accessible. Accessibility is not optional.**

### Keyboard Support

Every interactive component must support:
- **Enter** - confirm/activate action
- **Space** - activate button/toggle
- **Escape** - close modals, cancel operations
- **Arrow keys** - navigate list items, select options, adjust sliders
- **Tab** - move focus to next interactive element
- **Shift+Tab** - move focus to previous interactive element

Implement with:
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
  if (event.key === 'Escape') {
    // handle escape
  }
}
```

### Focus States

- **Focus visible**: 2px solid outline using `--ft-color-focus-ring-base`
- **Outline offset**: 2px using `--ft-color-focus-ring-offset`
- **Apply to all interactive elements**: buttons, inputs, links, selects

CSS pattern:
```css
.ft-button:focus-visible {
  outline: 2px solid var(--ft-color-focus-ring-base);
  outline-offset: 2px;
}
```

Or using `:focus-within` for container components:
```css
.ft-input:focus-within {
  border-color: var(--ft-color-focus-ring-base);
  box-shadow: 0 0 0 2px var(--ft-color-focus-ring-base);
}
```

### Form Labels

All form inputs must be associated with labels:

**Option 1: Visible label**
```html
<label for="email-input" class="ft-label">
  Email Address
</label>
<input id="email-input" type="email" class="ft-input" />
```

**Option 2: Hidden label with aria-label**
```html
<input
  type="button"
  class="ft-button"
  aria-label="Close dialog"
/>
```

**Option 3: aria-labelledby**
```html
<h2 id="dialog-title">Delete Item?</h2>
<div role="dialog" aria-labelledby="dialog-title">
  <!-- content -->
</div>
```

### Color Contrast

- **Text**: minimum 4.5:1 ratio (WCAG AA)
- **Large text** (18pt+): minimum 3:1 ratio
- **UI components & borders**: minimum 3:1 ratio
- Test with: WebAIM contrast checker, axe DevTools

### Disabled State

Disabled form elements and buttons:
```html
<button disabled aria-disabled="true" tabindex="-1">
  Disabled Button
</button>

<input disabled aria-disabled="true" />
```

Styling:
```css
.ft-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Loading State

For components with async operations:
```html
<button aria-busy="true" disabled>
  <span class="ft-spinner" role="status" aria-label="Loading">
    <!-- spinner SVG -->
  </span>
  Saving...
</button>
```

TypeScript pattern:
```typescript
interface Props {
  loading?: boolean
}

<button :disabled="loading" :aria-busy="loading">
  <span v-if="loading" class="spinner" role="status" aria-label="Loading">
    <!-- icon -->
  </span>
  {{ loading ? 'Saving...' : 'Save' }}
</button>
```

### Tooltips

Tooltip components must use ARIA attributes:
```html
<button
  aria-describedby="tooltip-1"
  @mouseenter="showTooltip"
  @mouseleave="hideTooltip"
>
  Help
</button>

<div
  v-if="tooltipVisible"
  id="tooltip-1"
  role="tooltip"
  class="ft-tooltip"
>
  This is helpful information
</div>
```

### ARIA Attributes Checklist

- `aria-label` - short accessible name for elements without visible text
- `aria-labelledby` - reference to element that labels this element
- `aria-describedby` - reference to element describing this element
- `aria-busy="true"` - indicates loading state
- `aria-disabled="true"` - indicates disabled state (even on divs acting as buttons)
- `role="status"` - for messages that should be announced to screen readers
- `role="tooltip"` - for tooltip elements
- `role="dialog"` - for modal dialogs
- `aria-modal="true"` - for modal dialogs (with backdrop)
- `aria-hidden="true"` - for decorative elements, icons, visual separators

---

## FIGMA TO VUE TRANSLATION

### Figma Component Structure

Figma components in DSP-Master use **parameterized naming convention**:
```
ComponentName (Type=value, Status=value, Size=value)
```

**94% of 839 components** use this pattern. Examples:
- `Button (Type=Primary, Status=Default, Size=Medium)`
- `Input (Type=Text, Status=Active, Size=Small)`
- `Badge (Type=Success, Status=Default, Size=Large)`

### Mapping Figma Variants to Vue Props

**Step 1: Extract variant property names**
```
Figma variant: Type=Primary → Vue prop name: primary (boolean)
Figma variant: Type=Secondary → Vue prop name: secondary (boolean)
Figma variant: Status=Loading → Vue prop name: loading (boolean)
Figma variant: Size=Small|Medium|Large → Vue prop name: size (string enum)
```

**Step 2: Determine prop type**

- **Boolean props**: If Figma variant has 2 values (on/off, primary/secondary)
  ```typescript
  primary?: boolean
  disabled?: boolean
  loading?: boolean
  ```

- **Enum props**: If Figma variant has 3+ values
  ```typescript
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'outline' | 'text'
  ```

**Step 3: Map colors**

When reading Figma component specs:
1. Identify every color used in fills, strokes, text
2. **NEVER hardcode the hex value** - map to semantic token
3. Create CSS custom property referencing semantic token

Example (from Figma spec):
```
Primary Button background: #0066FF → var(--ft-color-primary-base)
Primary Button text: #FFFFFF → var(--ft-color-neutral-white)
Primary Button border hover: #004099 → var(--ft-color-primary-dark)
```

**Step 4: Map spacing and sizing**

```
Figma spacing: 8px → var(--ft-spacing-small)
Figma spacing: 16px → var(--ft-spacing-medium)
Figma padding: 12px 16px → var(--ft-btn-padding-y) var(--ft-btn-padding-x)
Figma border-radius: 6px → 6px (can be hardcoded, but prefer token if exists)
Figma icon size: 20px → 1.25rem (relative to font-size)
```

### Figma Sections to Component Directories

Figma library is organized into 29 sections. Each section maps to a component directory:

```
Figma section: "Buttons"
  → src/components/FTButton/

Figma section: "Forms"
  → src/components/FTInput/
  → src/components/FTSelect/
  → src/components/FTCheckbox/

Figma section: "Layouts"
  → src/components/FTGrid/
  → src/components/FTPanel/
```

### Complete Figma-to-Vue Translation Checklist

When translating a Figma component to Vue:

- [ ] Extract all variant property names
- [ ] Determine if variant is boolean or enum
- [ ] Create TypeScript interface with correct prop types
- [ ] Map all colors to `--ft-color-*` tokens (never hardcode hex)
- [ ] Map all spacing to `--ft-spacing-*` tokens or component variables
- [ ] Extract typography styles → use `--ft-text-*` tokens
- [ ] Create component-level CSS variables: `--ft-{component}-*`
- [ ] Implement keyboard support (Tab, Enter, Space, Escape, Arrows)
- [ ] Add ARIA attributes for accessibility
- [ ] Create test file with all variant combinations
- [ ] Write VitePress documentation page

---

## DOCUMENTATION PATTERN

All component documentation pages follow this exact structure in VitePress markdown (`docs/components/{component-name}.md`).

### Documentation Template

```markdown
# FTComponentName

The `FTComponentName` component [one-line description of purpose and primary use case].

## Usage

### Composition API (script setup)

\`\`\`vue
<script setup lang="ts">
import { ref } from 'vue'
import { FTComponentName } from '@fasttrack-solutions/vue-components-lib'

const state = ref(false)
</script>

<template>
  <FTComponentName
    :prop-name="propValue"
    @event-name="handleEvent"
  />
</template>
\`\`\`

### Options API

\`\`\`vue
<script lang="ts">
import { defineComponent } from 'vue'
import { FTComponentName } from '@fasttrack-solutions/vue-components-lib'

export default defineComponent({
  name: 'MyComponent',
  components: { FTComponentName },
  data() {
    return {
      state: false
    }
  },
  methods: {
    handleEvent() {
      // handle event
    }
  }
})
</script>

<template>
  <FTComponentName
    :prop-name="propValue"
    @event-name="handleEvent"
  />
</template>
\`\`\`

## Styles

The `FTComponentName` component supports the following style variants:

- **Primary** - Use for main actions and primary calls-to-action
- **Secondary** - Use for secondary actions that don't require immediate attention
- **Tertiary** - Use for less important actions or optional interactions

\`\`\`vue
<FTComponentName primary />
<FTComponentName secondary />
<FTComponentName tertiary />
\`\`\`

## Statuses

The component reflects various interactive states:

- **Default** - Normal, interactive state
- **Hover** - User is hovering over the component
- **Active** - Component is currently active/selected
- **Disabled** - Component is non-interactive

\`\`\`vue
<FTComponentName />
<FTComponentName disabled />
<FTComponentName active />
\`\`\`

## Disabled State

Disable the component with the `disabled` prop. Disabled components are non-interactive and visually distinct.

\`\`\`vue
<FTComponentName disabled />
\`\`\`

## Loading State

Show a loading indicator with the `loading` prop. The component becomes non-interactive while loading.

\`\`\`vue
<FTComponentName loading />
\`\`\`

## Icons

Add icons using the `icon` prop with Font Awesome icon names (duotone `fad` prefix preferred).

\`\`\`vue
<FTComponentName icon="fad plus" />
<FTComponentName icon="fad trash" />
<FTComponentName icon="fad check" />
\`\`\`

## Icon Only

Show only the icon without text using the `iconOnly` prop.

\`\`\`vue
<FTComponentName icon="fad plus" icon-only />
\`\`\`

## Sizes

Control component size with the `size` prop.

\`\`\`vue
<FTComponentName size="small" />
<FTComponentName size="medium" />
<FTComponentName size="large" />
\`\`\`

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `primary` | `boolean` | `false` | Apply primary style variant |
| `secondary` | `boolean` | `false` | Apply secondary style variant |
| `disabled` | `boolean` | `false` | Disable interaction |
| `loading` | `boolean` | `false` | Show loading state |
| `icon` | `string` | `undefined` | Font Awesome icon name |
| `iconOnly` | `boolean` | `false` | Show only icon, hide text |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Component size |
| `tooltip` | `string` | `undefined` | Tooltip text on hover |
| `tooltipPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip position |

## CSS

All component styling uses CSS custom properties for theming and consistency. These properties can be overridden at the component, page, or application level.

| CSS Variable | Default Value | Description |
|--------------|---------------|-------------|
| `--ft-btn-height` | `var(--ft-spacing-large)` | Component height |
| `--ft-btn-font-size` | `var(--ft-text-body-medium)` | Font size |
| `--ft-btn-main-bg-default` | `var(--ft-color-primary-base)` | Primary background |
| `--ft-btn-main-bg-hover` | `var(--ft-color-primary-dark)` | Primary hover background |
| `--ft-btn-main-text-default` | `var(--ft-color-neutral-white)` | Primary text color |
| `--ft-btn-padding-x` | `var(--ft-spacing-medium)` | Horizontal padding |
| `--ft-btn-padding-y` | `var(--ft-spacing-small)` | Vertical padding |
| `--ft-btn-border-radius` | `6px` | Corner radius |

\`\`\`
```

### Documentation Section Guidelines

**Include these sections if applicable:**
- `# ComponentName` - always required
- `## Usage` - always required (both APIs)
- `## Styles` - if component has multiple style variants
- `## Statuses` - if component has interactive states
- `## Disabled State` - if component supports disabled prop
- `## Loading State` - if component supports loading prop
- `## Icons` - if component supports icon prop
- `## Icon Only` - if component supports iconOnly prop
- `## Sizes` - if component supports size variants
- `## Props` - always required (comprehensive table)
- `## CSS` - always required (all CSS variables)

**Skip sections that don't apply** (e.g., Panel might not need Icons section).

---

## TESTING REQUIREMENTS

### Testing Framework
- **Test runner**: Vitest
- **Component testing**: Vue Test Utils
- **Test file naming**: `ComponentName.test.ts`

### Test File Location
```
src/components/
  FTButton/
    FTButton.vue          (component)
    FTButton.test.ts      (test file)
    FTButton.css          (styles)
    index.ts              (export)
```

### Test Structure Template

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FTButton from './FTButton.vue'

describe('FTButton', () => {
  // 1. Snapshot Test
  it('renders correctly', () => {
    const wrapper = mount(FTButton, {
      props: { primary: true }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  // 2. Props Tests
  describe('Props', () => {
    it('applies primary variant', () => {
      const wrapper = mount(FTButton, {
        props: { primary: true }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--primary')
    })

    it('applies secondary variant', () => {
      const wrapper = mount(FTButton, {
        props: { secondary: true }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--secondary')
    })

    it('disables button when disabled prop is true', () => {
      const wrapper = mount(FTButton, {
        props: { disabled: true }
      })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('shows loading state', () => {
      const wrapper = mount(FTButton, {
        props: { loading: true }
      })
      expect(wrapper.find('.ft-spinner').exists()).toBe(true)
      expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
    })

    it('renders icon when provided', () => {
      const wrapper = mount(FTButton, {
        props: { icon: 'fad plus' }
      })
      expect(wrapper.find('.ft-button__icon').exists()).toBe(true)
    })
  })

  // 3. Event Tests
  describe('Events', () => {
    it('emits click event on button click', async () => {
      const wrapper = mount(FTButton)
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  // 4. Keyboard Tests
  describe('Keyboard Interactions', () => {
    it('emits click event on Enter key', async () => {
      const wrapper = mount(FTButton)
      await wrapper.find('button').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('emits click event on Space key', async () => {
      const wrapper = mount(FTButton)
      await wrapper.find('button').trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  // 5. Accessibility Tests
  describe('Accessibility', () => {
    it('has focus-visible outline', async () => {
      const wrapper = mount(FTButton)
      const button = wrapper.find('button')
      await button.trigger('focus')
      expect(button.classes()).toContain('ft-button')
      // CSS handles focus-visible styling
    })

    it('sets aria-disabled when disabled', () => {
      const wrapper = mount(FTButton, {
        props: { disabled: true }
      })
      expect(wrapper.find('button').attributes('aria-disabled')).toBe('true')
    })

    it('has aria-busy when loading', () => {
      const wrapper = mount(FTButton, {
        props: { loading: true }
      })
      expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
    })

    it('accepts aria-label prop', () => {
      const wrapper = mount(FTButton, {
        props: { ariaLabel: 'Close dialog' }
      })
      expect(wrapper.find('button').attributes('aria-label')).toBe('Close dialog')
    })
  })

  // 6. CSS Variable Tests
  describe('CSS Variables', () => {
    it('applies component CSS variables', () => {
      const wrapper = mount(FTButton)
      const button = wrapper.find('button')
      const styles = window.getComputedStyle(button.element)
      expect(styles.getPropertyValue('--ft-btn-height')).toBeTruthy()
    })
  })
})
```

### Testing Checklist

- [ ] Snapshot test passes
- [ ] All props render correctly
- [ ] Props work in combination (e.g., `primary` + `disabled`)
- [ ] Events emit when expected
- [ ] Keyboard interactions work (Enter, Space, Escape, Arrows)
- [ ] Accessibility attributes present (`aria-label`, `aria-disabled`, `aria-busy`, etc.)
- [ ] CSS variables applied correctly
- [ ] Component doesn't break layout
- [ ] Responsive behavior works

---

## FILE STRUCTURE

### Standard Component Directory Layout

```
src/
  components/
    FTButton/
      FTButton.vue              # Single-file component (template + script + style)
      FTButton.css              # Separate stylesheet with CSS variables
      FTButton.test.ts          # Vitest test file
      index.ts                  # Barrel export: export { default as FTButton } from './FTButton.vue'

    FTInput/
      FTInput.vue
      FTInput.css
      FTInput.test.ts
      index.ts

    # ... more components

  composables/
    useNotification.ts          # Shared Vue composable for notifications
    useWindowResize.ts          # Shared Vue composable for window resize
    # ... other composables

  index.ts                       # Main barrel export - exports all components

docs/
  components/
    button.md                   # VitePress documentation page for FTButton
    input.md                    # VitePress documentation page for FTInput
    # ... more docs

  .vitepress/
    config.ts                   # VitePress configuration
    theme.ts                    # Theme configuration
```

### Main Index Export Pattern

```typescript
// src/index.ts
export { default as FTButton } from './components/FTButton'
export { default as FTInput } from './components/FTInput'
export { default as FTCard } from './components/FTCard'
// ... all components

export type { FTButtonProps } from './components/FTButton/FTButton.vue'
export type { FTInputProps } from './components/FTInput/FTInput.vue'
// ... all prop types
```

### Component Barrel Export Pattern

```typescript
// src/components/FTButton/index.ts
export { default } from './FTButton.vue'
export type { FTButtonProps } from './FTButton.vue'
```

---

## CODE GENERATION WORKFLOW

When asked to generate a new FastTrack component, follow these steps in order:

### Step 1: Read the Figma Specification
If provided via MCP (Figma tools) or description:
- Extract component name and section
- Identify all variant properties (Type, Status, Size, etc.)
- Document all color values (map to semantic tokens, never extract hex)
- Document all spacing/sizing values
- Note typography styles used
- Identify any icons used

### Step 2: Create TypeScript Interface
Map Figma variants to Vue props:
```typescript
interface FTComponentProps {
  // Variants
  primary?: boolean
  secondary?: boolean

  // State
  disabled?: boolean
  loading?: boolean

  // Sizing
  size?: 'small' | 'medium' | 'large'

  // Accessibility
  ariaLabel?: string
}
```

### Step 3: Create Component CSS
```css
:root {
  --ft-component-height: var(--ft-spacing-large)
  --ft-component-bg-default: var(--ft-color-primary-base)
  /* ... all variables reference tokens */
}

.ft-component {
  /* all values use CSS variables */
}
```

### Step 4: Generate Vue Single-File Component

```typescript
// FTComponent.vue
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  primary?: boolean
  secondary?: boolean
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Computed styles
const componentClasses = computed(() => ({
  'ft-component': true,
  'ft-component--primary': props.primary,
  'ft-component--secondary': props.secondary,
  'ft-component--disabled': props.disabled,
  'ft-component--loading': props.loading,
  [`ft-component--${props.size}`]: true
}))

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <div
    :class="componentClasses"
    :aria-disabled="disabled"
    :aria-busy="loading"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <!-- template -->
  </div>
</template>

<style scoped>
@import './FTComponent.css';
</style>
```

### Step 5: Create Vitest Test File
Generate test file with:
- Snapshot test
- Props tests (each variant)
- Event emit tests
- Keyboard interaction tests
- Accessibility attribute tests
- CSS variable application tests

### Step 6: Create VitePress Documentation
Generate markdown file at `docs/components/component-name.md`:
- Component name heading
- One-line description
- Usage section (Composition API + Options API)
- Style variants section
- Status/state sections
- Props table
- CSS variables table

### Step 7: Update Component Status Page
Add entry to `docs/components/status.md`:
```markdown
| [FTComponent](/components/component-name.md) | ✅ Production | All variants tested | 15 KB |
```

### Step 8: Export from Main Index
Add to `src/index.ts`:
```typescript
export { default as FTComponent } from './components/FTComponent'
export type { FTComponentProps } from './components/FTComponent/FTComponent.vue'
```

---

## CRITICAL RULES SUMMARY

### Token References - ABSOLUTE
- **NEVER hardcode hex colors**: Always use `var(--ft-color-*)`
- **NEVER hardcode pixel values**: Always use `var(--ft-spacing-*)` or component variables
- **NEVER hardcode fonts**: Always use `var(--ft-font-family-*)`
- Violating this rule results in components that cannot be themed

### Component Naming - ABSOLUTE
- ALL components MUST use `FT` prefix: `FTButton`, not `Button`
- Consistency across entire library depends on this convention

### Figma Mapping - ABSOLUTE
- Boolean shorthand in templates: `<FTButton primary>` not `<FTButton variant="primary">`
- Only ONE style variant prop should be true at a time
- Always map variant values to semantic tokens, never extract hex colors

### Accessibility - ABSOLUTE
- Every interactive component MUST support keyboard interaction
- Every form input MUST have associated label
- Every interactive element MUST have focus state with outline
- Missing accessibility = component is not complete

### Documentation - ABSOLUTE
- Every component MUST have VitePress documentation
- Documentation MUST follow the template structure exactly
- All props MUST be documented in markdown table
- All CSS variables MUST be documented with default values

---

## REFERENCE LINKS

- **Figma Library**: DSP-Master (839 components, 29 sections)
- **Package Registry**: `npm.pkg.github.com/@fasttrack-solutions/`
- **Design System Package**: `@fasttrack-solutions/design-system` (159 token definitions)
- **Documentation**: VitePress in `docs/` directory

---

## VERSION

**Document Version**: 1.0
**Last Updated**: 2026-02-07
**Scope**: FastTrack Vue Components Library v1.0
**Audience**: AI tools, code generators, developers

This document is the single source of truth. All AI tools MUST reference this document when generating FastTrack components.
