# FastTrack Design System — AI Rules

> These rules are automatically loaded by Claude Code / Cowork. For the complete reference, see `.fasttrack/rules.md`.

## Project

- **Package**: `@fasttrack-solutions/vue-components-lib` (Vue 3 + TypeScript)
- **Design tokens**: `@fasttrack-solutions/design-system`
- **Registry**: GitHub Packages (private)
- **Docs**: VitePress in `docs/`

## Critical Rules

1. **FT prefix on everything**: `FTButton`, `FTCard`, `FTInput` — no exceptions
2. **No hardcoded values**: Always use `--ft-*` CSS custom properties. Never write a hex color or pixel value directly.
3. **Semantic tokens first**: Use `var(--ft-color-primary-base)` not `var(--ft-color-brand-blue-700)`
4. **Composition API primary**: Use `<script setup lang="ts">` as the default pattern
5. **Boolean prop shorthand**: `<FTButton primary>` not `<FTButton variant="primary">`

## Token Files

| File | Purpose |
|------|---------|
| `tokens/colors.tokens.json` | 67 colors in W3C format |
| `tokens/typography.tokens.json` | 17 text styles |
| `tokens/semantic.tokens.json` | Functional aliases (primary, error, etc.) |
| `dist/tokens.css` | Generated CSS custom properties |
| `dist/tokens.scss` | Generated SCSS variables + maps |
| `dist/useTokens.ts` | Vue 3 composable + TypeScript types |

## Component Generation

When creating a new FT component:

1. **Vue SFC**: `<script setup lang="ts">` with typed props interface
2. **CSS**: Scoped, using `--ft-{component}-*` custom properties that reference semantic tokens
3. **A11y**: keyboard support, focus ring (`--ft-color-focus-ring-base`), ARIA attributes
4. **Docs**: VitePress page at `docs/components/{name}.md` following the pattern in Button
5. **Tests**: Vitest file testing renders, props, events, keyboard, a11y

Templates are in `.fasttrack/templates/`.

## CSS Variable Pattern

Component CSS variables follow: `--ft-{component}-{property}-{state}`

```css
.ft-button {
  --ft-btn-bg: var(--ft-color-primary-base);
  --ft-btn-fg: var(--ft-color-on-primary-base);
  --ft-btn-height: 32px;
  background: var(--ft-btn-bg);
  color: var(--ft-btn-fg);
}
```

## Style Variants

Boolean props: `primary`, `secondary`, `tertiary`, `action`, `warning`, `success`, `info`, `error`
State props: `loading`, `disabled`, `active`
Icons: `icon="fas name"`, `iconOnly`, `iconSmall`, `iconMedium`, `iconBig`

## Documentation Structure

Each component doc: Usage → Styles → States → Props table → CSS variables table
See `docs/components/button.md` as the reference implementation.

## Figma Translation

Figma uses parameterized naming: `Type=value, Status=value, Size=value`
- Variant properties → Vue props
- Color values → map to `--ft-color-*` semantic tokens
- Spacing → map to CSS variables

### Figma → Component Map

**DSP-Master file:** `tyhDN8pjR0WM048BYhEa1Q`

| Vue Component | Figma Node ID | Figma Name | Source |
|---------------|---------------|------------|--------|
| `FTButton` | `2244:3840` | Buttons (Type=main/alt/sub/plus/icon) | `src/components/FTButton/FTButton.vue` |
| `FTCheckbox` | `2824:5763` | Checkbox (Type=Checked/Unchecked) | `src/components/FTCheckbox/FTCheckbox.vue` |
| `FTRadio` | `2824:5780` | Radio (Type=Selected/Unselected) | `src/components/FTRadio/FTRadio.vue` |
| `FTTag` | `2837:5802` | Tags | `src/components/FTTag/FTTag.vue` |
| `FTPaging` | `2838:5840` | Paging | `src/components/FTPaging/FTPaging.vue` |
| `FTTooltip` | `2838:5860` | Tooltip | `src/components/FTTooltip/FTTooltip.vue` |
| `FTToggle` | `2824:5730` | Toggle (Type=On/Off) | `src/components/FTToggle/FTToggle.vue` |
| `FTBreadcrumb` | `3052:3870` | Breadcrumb (Short/Ellipses/Level break) | `src/components/FTBreadcrumb/FTBreadcrumb.vue` |
| `FTPanel` | `3780:6892` | Standard Panel (Width=Full/2-3/1-2/1-3) | `src/components/FTPanel/FTPanel.vue` |
| `FTHeader` | `3054:5706` | Header | `src/components/FTHeader/FTHeader.vue` |
| `FTSideMenu` | `3057:11430` | Side Menu (Level=LVL 1) | `src/components/FTSideMenu/FTSideMenu.vue` |
| `FTInput` | — | Input (38 variants) | `src/components/FTInput/FTInput.vue` |
| `FTSelect` | — | Dropdown-base (54+ variants) | `src/components/FTSelect/FTSelect.vue` |
| `FTTabs` | — | Tabs (32 variants) | `src/components/FTTabs/FTTabs.vue` |
| `FTModal` | — | Modal (3 variants) | `src/components/FTModal/FTModal.vue` |
| `FTTable` | `3057:11643` | Table (25 variants) | `src/components/FTTable/FTTable.vue` |
| `FTPageLayout` | — | Page Template (composite, not a Figma component) | `src/components/FTPageLayout/FTPageLayout.vue` |

**Fast Track Logo file:** `Ahohkx0sfMS7oHU1V3j3DO`

| Vue Component | Figma Node ID | Figma Name | Source |
|---------------|---------------|------------|--------|
| `FTLogo` | `14:398` | Logo (Size × Colour variants) | `src/components/FTLogo/FTLogo.vue` |

When pulling Figma design context for a known component, use `get_design_context` with the file key and node ID above. This replaces Code Connect (which requires an Organization/Enterprise plan).

## Commands

```bash
npm run build:tokens   # Rebuild CSS/SCSS/TS from token JSON
npm run dev            # VitePress dev server
npm run build:docs     # Build static docs
```
