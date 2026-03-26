# FT DNA — AI Context

> This file is loaded automatically by Claude Code. It is the single entry point for any AI session working in this repo.
> **Update the status section below after every working session.**

## Session Start

**Always** greet the user by name on the very first message of every conversation — regardless of what they typed. Check memory for their name (or ask if unknown).

**If the user sends a greeting** (hi, hello, hey, etc.) **without a specific task**, show the full menu:

Hey Miguel! Welcome back. What are we working on today?

1. **Page composition** — build or continue a Figma page
2. **Design critique** — review a frame for compliance
3. **Screenshot & scan** — capture platform pages
4. **Tutor** — learn FT CRM concepts
5. **Component work** — generate or audit Vue components
6. **Status check** — show current project progress
7. **Create a Task in ClickUp** — log a new task to the board

Or just ask anything — if none of these fit, go ahead and type your question directly.

**If the user gives a concrete instruction or question**, skip the menu — just greet briefly ("Hey Miguel!") and go straight to work on their request.

## Project Status

**Version:** 0.4.7
**Last updated:** 2026-03-26

| Track | Status | Detail |
|---|---|---|
| Platform scanner | Done | `scan.js` discovers 34 pages, saves DOM structure to `scan-manifest.json`. Screenshots on demand via `snap.js`. |
| Page composition | 24/48 pages (8 repro-tested) | LIST-SIMPLE, LIST-TAB, LIST-FULL, FORM, HUB, SLIDEIN, DASH, LIST-NESTED, GRID proven. 3 blocked (missing components). |
| Build engine | v2.0 regression-tested | Minimal detach (Page Header INSTANCE always, Panel Header INSTANCE unless search). `swapComponent()` for breadcrumb levels. `buildDataRow()` auto-handles 6 non-text cell types. `setShell()` supports `secondaryCta`. GRID recipe uses `card-markets` component. Full regression: 14 doc issues fixed, 7 render tests passed (73/75). |
| Component audit | Done | 22 meta.json populated with variants, propMap, unmapped. Parity report: `npm run audit:parity`. 50 Figma-only gaps, 133 Vue-only gaps identified. |
| Code Connect | Not started | Unblocked — depends on populated meta.json (done). |
| Design critique | Done | Compact summary output as default. Colour variables documented in `component-ids.md`. |

**What's next:** Content Variables (GRID), Manage Unsubscribe Pages (LIST-NESTED), remaining page briefs + screenshots. Navigation card component needed for HUB pattern.
**Regression report:** `.fasttrack/regression-report.md`
**Full plan:** `.fasttrack/plans/v1-completion-plan.md`
**Page progress:** `inventory/composition-tracker.md`

---

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
├── scripts/         → build-tokens.js, snap.js (screenshots), scan.js (page discovery), figma-paste.js
├── .fasttrack/      → Vue-lib rules reference, plans
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
| `kb` | knowledge-management | Search the GitBook knowledgebase for platform answers |
| `tutor` | training | Teach FT CRM knowledge — adaptive, source-grounded tutoring with quizzes and scenarios |

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
| Seed instance | **Deprecated** — was `3:5535`, now deleted | Builds use Base Template `94:21370` via `bootstrapScreen()` or Quick Access clones |
| Base Template | Component `94:21370` on Workbench | Use `createInstance()` for new prototypes |
| Component source | All local in FT DNA Workbench | Single source — no external library dependency |
| Skills registry | `skills/registry.json` | Machine-readable, auto-populated by skill-architect |
| Ship-ready default | Skills work without human review | Review happens after, not as a gate |

## Commands

```bash
npm run build:tokens   # Rebuild CSS/SCSS/TS from token JSON
npm run snap --login   # Open browser for CRM authentication
npm run snap --start   # Launch persistent headless browser
npm run snap --stop    # Stop persistent browser
npm run snap <path>    # Screenshot a page (e.g. /v2/segments)
npm run snap:paste <img>  # Copy screenshot to clipboard + paste into Figma
node scripts/scan.js   # Discover all platform pages → scan-manifest.json + page-inventory.md
npm run mcp:health     # Kill zombie MCP processes + connection report
npm run mcp:status     # Connection status only (no cleanup)
```

## MCP Connectivity

Two Figma MCP servers are configured in `.mcp.json`:
- **figma-remote-mcp** — Figma's official cloud server (read-only, 22 tools)
- **figma-console-mcp** — Desktop Bridge plugin (read/write, 90+ tools, local WebSocket)

A `SessionStart` hook runs `mcp-health.sh --quiet` automatically to clean zombie processes.

If connection drops during a session, run `npm run mcp:health` or use the `figma_reconnect` MCP tool.

Team setup guide: `references/mcp-setup-guide.md`
