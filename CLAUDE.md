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

## Commands

```bash
npm run build:tokens   # Rebuild CSS/SCSS/TS from token JSON
npm run dev            # VitePress dev server
npm run build:docs     # Build static docs
```
