# Developer Guide

This page is for front-end developers who want to work with the POC, add components, or understand how the pieces fit together. It covers the folder structure, the key files, and the commands you will use daily.

## Quick start

```bash
# Install dependencies
npm install

# Start the playbook locally (live reload)
npx vitepress dev docs

# Rebuild the design tokens (after editing token JSON files)
node scripts/build-tokens.js

# Build the playbook for production
npx vitepress build docs
```

The dev server runs at `http://localhost:5173/`. Any change to a `.md` page, a `.vue` component, or a `.css` file triggers hot reload automatically.

## Project structure

Here is what each folder does, from the top down:

```
.
├── tokens/                  ← Source of truth for design tokens
│   ├── colors.tokens.json       Figma colour definitions (53 brand colours)
│   ├── semantic.tokens.json     Semantic aliases (text, surface, border)
│   └── typography.tokens.json   Font stacks, sizes, weights
│
├── scripts/
│   └── build-tokens.js      ← Reads tokens/*.json → writes dist/
│
├── dist/                    ← Generated output (do not edit by hand)
│   ├── tokens.css               CSS custom properties
│   ├── tokens.scss              SCSS variables
│   └── useTokens.ts             TypeScript helper
│
├── src/components/          ← Vue components wired to tokens
│   ├── FTTag/
│   ├── FTCheckbox/
│   ├── FTRadio/
│   ├── FTTooltip/
│   └── FTPaging/
│
├── docs/                    ← VitePress playbook
│   ├── .vitepress/
│   │   ├── config.ts            Sidebar, nav, Font Awesome CDN link
│   │   └── theme/
│   │       ├── index.ts         Global component registration
│   │       └── custom.css       Brand colours, demo containers, badges
│   ├── guide/                   POC Basics, Getting Started, this page
│   ├── components/              One .md per component (live demos)
│   └── tokens/                  Colour, typography, semantic pages
│
├── .fasttrack/              ← AI scaffolding and Figma bridge
│   ├── figma-token-map.json     Rosetta Stone: Figma var → CSS token → hex
│   ├── rules.md                 Rules for AI-assisted component generation
│   └── templates/               .vue, .test.ts, .md starter templates
│
└── package.json
```

## Key files and what they do

### `tokens/colors.tokens.json`

The single source of truth for brand colours. Each entry maps a family and shade number to a hex value. When you edit this file and run `build-tokens.js`, the new values propagate to CSS, SCSS, and TypeScript automatically.

### `scripts/build-tokens.js`

The token compiler. It reads every `.tokens.json` file under `tokens/` and writes three output files into `dist/`. Run it whenever you add or change a token:

```bash
node scripts/build-tokens.js
```

### `dist/tokens.css`

The generated CSS custom properties. This file is imported at the top of `custom.css` and makes every token available as a `--ft-*` variable. You never edit this file directly.

### `.fasttrack/figma-token-map.json`

The lookup table between Figma and code. If a designer says "use `pink/400`", you open this file, find the entry, and get `--ft-color-brand-pink-400` (#E96092). It also documents the shade stepping pattern (300 = light/disabled, 400 = default, 500 = hover, 600 = darkest).

### `docs/.vitepress/theme/index.ts`

Where components are registered globally so they render live in `.md` pages. If you add a new component, import it here and call `app.component('FTMyComponent', FTMyComponent)`.

### `docs/.vitepress/config.ts`

The VitePress configuration. This controls the sidebar navigation, the top nav, and the Font Awesome CDN link. When you add a new component page, add an entry to the `sidebar` array. Use the `poc-ready` badge span for wired components:

```ts
{ text: 'MyComponent <span class="poc-ready">POC</span>', link: '/components/mycomponent' }
```

## How to add a new component

Follow these steps to wire a new component from Figma into the playbook.

**1. Create the component folder.**

```
src/components/FTMyComponent/
├── FTMyComponent.vue
└── index.ts
```

The `index.ts` is a one-liner: `export { default as FTMyComponent } from './FTMyComponent.vue'`

**2. Wire it to tokens.** In the `<style>` block of your `.vue` file, declare CSS custom properties under `:root` that reference `--ft-*` token variables. Then use those custom properties in your scoped styles. This keeps the component connected to the token layer without hardcoding any hex values.

```vue
<style>
:root {
  --ft-mycomp-bg: var(--ft-color-brand-pink-400, #E96092);
  --ft-mycomp-fg: var(--ft-color-neutral-mono-700, #2c2c2c);
}
</style>

<style scoped>
.ft-mycomp {
  background: var(--ft-mycomp-bg);
  color: var(--ft-mycomp-fg);
}
</style>
```

The fallback hex value after the comma ensures the component still renders if tokens are not loaded.

**3. Register it globally.** Open `docs/.vitepress/theme/index.ts`, import the component, and add `app.component('FTMyComponent', FTMyComponent)`.

**4. Write the doc page.** Create `docs/components/mycomponent.md` with live `<FTMyComponent>` tags inside `<div class="demo">` containers. The component renders live in the browser because VitePress compiles the Markdown as Vue.

**5. Add it to the sidebar.** Open `docs/.vitepress/config.ts` and add the entry to the Components section with the POC badge.

**6. Rebuild and preview.**

```bash
npx vitepress dev docs    # live preview
npx vitepress build docs  # production build check
```

## Naming conventions

We follow BEM for CSS class names:

- **Block**: `.ft-mycomp` (the component root)
- **Element**: `.ft-mycomp__label`, `.ft-mycomp__icon`
- **Modifier**: `.ft-mycomp--disabled`, `.ft-mycomp--active`

CSS custom properties use the prefix `--ft-mycomp-` and reference the global `--ft-*` tokens wherever possible.

## Token naming pattern

All brand colour tokens follow this structure:

```
--ft-color-brand-{family}-{shade}
```

For example: `--ft-color-brand-pink-400`, `--ft-color-brand-blue-500`.

Neutral grays follow: `--ft-color-neutral-mono-{shade}` or `--ft-color-neutral-gray-{shade}`.

The shade stepping pattern across the system:

| Shade | Typical use |
|-------|-------------|
| 200 | Lightest, locked-disabled backgrounds |
| 300 | Light, disabled state |
| 400 | Default / idle state |
| 500 | Hover state |
| 600 | Darkest accent, active state |

## Where to look for help

- **Figma to CSS lookup**: `.fasttrack/figma-token-map.json`
- **Component templates**: `.fasttrack/templates/` has starter `.vue`, `.test.ts`, and `.md` files
- **AI generation rules**: `.fasttrack/rules.md` describes the patterns AI tools should follow
- **Live examples**: Every component page in this playbook has working code you can copy
