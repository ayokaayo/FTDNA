# FT DNA — AI Context

> This file is loaded automatically by Claude Code. It is the single entry point for any AI session working in this repo.

## What This Repo Is

FT DNA is the FastTrack platform's unified workspace — design tokens, component inventory, AI skills, and reference documentation in one place. It serves the design team as their operating environment for managing the design system and generating outputs via Claude.

**This repo does NOT contain Vue components.** Production components live in `../vue-components-lib/` (`@fasttrack-solutions/vue-components-lib`). This repo provides the context, tokens, and skills that Claude uses to generate and push components there.

## Repo Map

```
FTDNA/
├── tokens/          → W3C design tokens (colors, typography, spacing, semantic)
├── dist/            → Generated CSS, SCSS, TypeScript from tokens
├── inventory/       → Component audit, gap analysis, Figma-to-Vue tracking
├── skills/          → Claude AI skills + registry.json
├── references/      → Shared context (component-catalog.md, page-patterns.md)
├── templates/       → Vue component, test, and docs templates
├── assets/logos/    → FastTrack brand SVGs
├── scripts/         → build-tokens.js
├── memory/          → Session history (claude.md)
├── .fasttrack/      → Vue-lib rules reference, Figma showcase, plans
└── .workspace/      → Scratch space (gitignored)
```

## Critical Rules

1. **FT prefix on everything**: `FTButton`, `FTCard`, `FTInput` — no exceptions
2. **No hardcoded values**: Always use `--ft-*` CSS custom properties. Never write a hex color or pixel value directly.
3. **Semantic tokens first**: Use `var(--ft-color-primary-base)` not `var(--ft-color-brand-blue-700)`
4. **Composition API**: Use `<script setup lang="ts">` as the default pattern
5. **Boolean prop shorthand**: `<FTButton primary>` not `<FTButton variant="primary">`

## Token System

| File | Purpose |
|------|---------|
| `tokens/colors.tokens.json` | 67 colors in W3C format |
| `tokens/typography.tokens.json` | 17 text styles |
| `tokens/semantic.tokens.json` | Functional aliases (primary, error, etc.) |
| `tokens/spacing.tokens.json` | Spacing scale |
| `dist/tokens.css` | Generated CSS custom properties |
| `dist/tokens.scss` | Generated SCSS variables + maps |
| `dist/useTokens.ts` | Vue 3 composable + TypeScript types |

Build: `npm run build:tokens`

## Component Generation

When generating Vue components for `../vue-components-lib/`:

1. **Vue SFC**: `<script setup lang="ts">` with typed props interface
2. **CSS**: Scoped, using `--ft-{component}-*` custom properties that reference semantic tokens
3. **A11y**: keyboard support, focus ring (`--ft-color-focus-ring-base`), ARIA attributes
4. **Docs**: VitePress page following the pattern in vue-lib's `docs/components/button.md`
5. **Tests**: Vitest file testing renders, props, events, keyboard, a11y

Templates: `templates/`
Full conventions: `.fasttrack/rules.md`

### CSS Variable Pattern

Component CSS variables follow: `--ft-{component}-{property}-{state}`

```css
.ft-button {
  --ft-btn-bg: var(--ft-color-primary-base);
  --ft-btn-fg: var(--ft-color-on-primary-base);
  background: var(--ft-btn-bg);
  color: var(--ft-btn-fg);
}
```

## Figma Translation

**FT DNA file:** `7J3dSTuOSRlsHBqQ4ohtxI` — single source of truth for all components, tokens, and prototypes
**Fast Track Logo file:** `Ahohkx0sfMS7oHU1V3j3DO`

### Figma Component Sources

**For prototype generation (Figma API / MCP):** Use Workbench component IDs in `skills/prototype-generator/references/component-ids.md`. These are the live, local component set IDs used by `createInstance()`.

**For Code Connect (Vue ↔ Figma mapping):** Use the published node IDs below with `get_design_context`:

| Vue Component | Published Node ID | Figma Name |
|---------------|-------------------|------------|
| `FTButton` | `2244:3840` | Buttons |
| `FTCheckbox` | `2824:5763` | Checkbox |
| `FTRadio` | `2824:5780` | Radio |
| `FTTag` | `2837:5802` | Tags |
| `FTPaging` | `2838:5840` | Paging |
| `FTTooltip` | `2838:5860` | Tooltip |
| `FTToggle` | `2824:5730` | Toggle |
| `FTBreadcrumb` | `3052:3870` | Breadcrumb |
| `FTPanel` | `3780:6892` | Standard Panel |
| `FTHeader` | `3054:5706` | Header |
| `FTSideMenu` | `3057:11430` | Side Menu |
| `FTTable` | `3057:11643` | Table |
| `FTLogo` | `14:398` | Logo — in Logo file |

**These are NOT the same IDs used by the prototype generator.** The prototype generator uses Workbench set IDs (e.g. `91:8299` for button-btn). See `component-ids.md` for those.

## Skills System

Skills are Claude instruction packages in `skills/`. Registry: `skills/registry.json`.

| Skill | Domain | What it does |
|-------|--------|-------------|
| `prd-writer` | product-management | Write, review, or refactor PRDs |
| `skill-architect` | meta | Create new production-ready skills |
| `design-critique` | product-design | Review designs for compliance and quality |
| `prototype-generator` | prototyping | Generate branded Figma prototypes from briefs |

To create a new skill, use the skill-architect. To discover skills programmatically, read `skills/registry.json`.

## Workflow: Figma → Vue Pipeline

When a designer asks to convert a Figma component to code:

1. **Read Figma** via MCP — get the component's design, variants, and properties
2. **Read context** — tokens (`tokens/`), catalog (`references/component-catalog.md`), conversion rules (this file + `.fasttrack/rules.md`)
3. **Generate Vue code** — write the component to `../vue-components-lib/src/components/FT{Name}/`
4. **Create PR** — branch + push + PR to the vue-components-lib repo
5. **FE reviews** — front-end team reviews and merges

The component is staged locally in the vue-lib checkout before being pushed as a PR.

## Key Decisions

| Decision | Choice | Context |
|----------|--------|---------|
| Prototype approach | V2 Hybrid (clone + instances) | `importComponentByKeyAsync()` times out; clone from seed is instant |
| Seed instance | Node `3:5535` in FT DNA Sandbox page | NEVER delete — source for all prototype clones |
| Base Template | Component `94:21370` on Workbench | Use `createInstance()` for new prototypes |
| Component source | All local in FT DNA Workbench | Single source — no external library dependency |
| Skills registry | `skills/registry.json` | Machine-readable, auto-populated by skill-architect |
| Ship-ready default | Skills work without human review | Review happens after, not as a gate |

## Commands

```bash
npm run build:tokens   # Rebuild CSS/SCSS/TS from token JSON
```
