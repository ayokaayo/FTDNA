# FT DNA — AI Context

> This file is loaded automatically by Claude Code. It is the single entry point for any AI session working in this repo.
> **Update the status section below after every working session.**

## Session Start

**Always** greet the user by name on the very first message of every conversation — regardless of what they typed. Check memory for their name (or ask if unknown).

**If the user sends a greeting** (hi, hello, hey, etc.) **without a specific task**, show the full menu:

Hey {name}! Welcome back. What are we working on today?

1. **Page composition** — build or continue a Figma page
2. **Coded prototype** — generate an interactive Vue prototype on CF Pages
3. **Design critique** — review a frame for compliance
4. **Screenshot & scan** — capture platform pages
5. **KB search** — search the FastTrack knowledgebase
6. **Tutor** — learn FT CRM concepts
7. **Component work** — generate or audit Vue components
8. **PRD** — write or review a product requirements doc
9. **Status check** — show current project progress
10. **Create a Task in ClickUp** — log a new task to the board (requires ClickUp MCP — see Cowork connector setup)

Or just ask anything — if none of these fit, go ahead and type your question directly.

**If the user gives a concrete instruction or question**, skip the menu — just greet briefly ("Hey {name}!") and go straight to work on their request.

## First-Run Setup

> Claude: run these checks silently at the start of every session. Do NOT show the greeting or menu until setup is confirmed.
> For the human-readable version of these steps, see `SETUP.md`.

### Detection

Check for these files in the repo root:
- `.mcp.json` — exists?
- `.env` — exists?
- `node_modules/` — exists?

**If ALL three exist:** skip this section entirely. Proceed to the normal Session Start greeting.

**If `.env` is missing (full first-run):**

1. Greet the user: "Welcome to FT DNA! I'll get you set up — takes about 5 minutes."
2. Ask their name and save it to memory.
3. Run `npm install` (silent unless errors).
4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Tell the user: "Environment configured. The GitBook token is shared org-wide, already set."
6. Proceed to MCP setup below.

**If `.mcp.json` is missing (MCP setup needed):**

1. Ask the user for their Figma Personal Access Token:
   > "I need your Figma Personal Access Token to connect to Figma. You can generate one in Figma Desktop: Avatar → Settings → Personal access tokens. It starts with `figd_`."
2. Wait for the token. Validate it starts with `figd_`.
3. Read `.mcp.json.example`, replace `YOUR_TOKEN_HERE` with the provided token, and write it to `.mcp.json`.
4. Tell the user:
   > "Figma connected. One thing to know:
   > - **Figma Remote MCP** (read + write) — a browser window will pop up the first time you use a Figma tool. Just log in and authorize. This only happens once.
   >
   > **Optional** (for screenshots and console debugging):
   > - **Desktop Bridge plugin** — install `figma-console-mcp` globally, then import the plugin in Figma Desktop. See `SETUP.md` for steps.
   >
   > Here's the FT DNA Figma file — it's in the **Brand** project, you already have access:
   > https://www.figma.com/design/7J3dSTuOSRlsHBqQ4ohtxI/%F0%9F%A7%AC-FT-DNA?m=auto&t=vFxIpgCjzDr1rSQB-6"
5. Run `npm run mcp:health` to verify connectivity.
6. Show results. Note: the user may need to restart Claude Code (`/quit` then `claude`) for MCP servers to activate.
7. Mention optional extras:
   > "Two optional things depending on what you'll be working on:
   > - **Coded prototypes** need the `backoffice-v2` repo cloned as a sibling directory (`../backoffice-v2`).
   > - **ClickUp integration** needs the ClickUp MCP connector (set up via Cowork connectors).
   >
   > Full setup reference: `SETUP.md`. All available commands: `README.md`."
8. Proceed to the normal greeting/menu.

**If only `node_modules/` is missing (dependencies stale):**

1. Run `npm install` silently.
2. Proceed to normal greeting.

## Project Status

**Version:** 0.7.0
**Last updated:** 2026-04-02

| Track | Status | Detail |
|---|---|---|
| Platform scanner | Done | `scan.js` discovers 34 pages, saves DOM structure to `scan-manifest.json`. Screenshots on demand via `snap.js`. |
| Source scanner | **Done** | `scan-source.js` reads 284 Vue page files from backoffice-v2, extracts components, Vuex/Pinia deps, bus events, layout type, table columns, breadcrumbs, CTAs. Outputs `references/page-manifest.json` (325KB). 80% layout classification for routed pages. |
| Coded prototypes | **Active** | 9 prototypes on CF Pages (`feature/DEV-0000-FTDNA-prototypes`). `coded-prototype-generator` skill proven with cold test. Clone path (Vuex) and build path (mock data) both working. |
| Page composition | 36/48 pages (8 repro-tested) | All 9 LIST-SIMPLE done. 9/10 LIST-TAB done. LIST-FULL, FORM, HUB, GRID/LIST-NESTED all complete. DASH 2/3. SLIDEIN proven. 3 blocked (missing components). 3/5 custom done (Users & Permissions, Query Editor, AI Settings). |
| Build engine | v2.0 regression-tested | Minimal detach (Page Header INSTANCE always, Panel Header INSTANCE unless search). `swapComponent()` for breadcrumb levels. `buildDataRow()` auto-handles 6 non-text cell types. `setShell()` supports `secondaryCta`. GRID recipe uses `card-markets` component. Panel Header (`92:46640`) and Radio (`91:8595`) added to `init()` pre-cache. Rules R17–R24 codified. Full regression: 14 doc issues fixed, 7 render tests passed (73/75). |
| Cold verification | **8/8 tested (all PASS)** | LIST-SIMPLE, LIST-TAB, FORM, LIST-FULL, DASH, GRID, SLIDEIN, HUB all pass cold. |
| Component audit | Done | Parity report: `npm run audit:parity`. Component data tracked in `inventory/component-map.json` and `inventory/parity-report.json`. 50 Figma-only gaps, 133 Vue-only gaps identified. |
| Code Connect | N/A (Enterprise only) | Replaced by component-catalog.md + components.fasttrack.dev doc site + parity audit. |
| Design critique | Done | Compact summary output as default. Colour variables documented in `component-ids.md`. |

**What's next:** Unified manifest powers both generators. Brief migration (thin 17 briefs to override-only). Expand coded prototype coverage. Component creation sprint to unblock DETAIL + remaining custom pages.
**Known constraint:** Cloud MCP (`use_figma`) cannot render Font Awesome 6 Pro icons — builds degrade to placeholder glyphs. Desktop Bridge has full font support.
**Regression report:** `.fasttrack/regression-report.md`
**Full plan:** `.fasttrack/plans/v1-completion-plan.md`
**Page progress:** `inventory/composition-tracker.md`
**Coded prototypes plan:** `.fasttrack/plans/coded-prototypes-plan.md`

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
├── references/      → Shared context (component-catalog.md, page-patterns.md, vue-pattern-reference.md)
├── templates/       → Vue component, test, and docs templates
├── assets/logos/    → FastTrack brand SVGs
├── scripts/         → build-tokens.js, snap.js, scan.js, scan-source.js, clone-batch.js, gen-tracker.js, parity-report.js, figma-paste.js, mcp-health.sh
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
> The FT DNA file is in the **Brand** project. All team members have access: [FT DNA on Figma](https://www.figma.com/design/7J3dSTuOSRlsHBqQ4ohtxI/%F0%9F%A7%AC-FT-DNA?m=auto&t=vFxIpgCjzDr1rSQB-6)

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
| `prototype-generator` | prototyping | Generate branded Figma prototypes from briefs or manifest |
| `coded-prototype-generator` | prototyping | Generate interactive Vue prototypes on CF Pages |
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
| Unified manifest | `page-manifest.json` | Single source for both generators; `scan-source.js` auto-generates from Vue source |
| Prototype approach | V2 Hybrid (clone + instances) | `importComponentByKeyAsync()` times out; clone from seed is instant |
| Base Template | Component `94:21370` on Workbench | Use `createInstance()` for new prototypes |
| Component source | All local in FT DNA Workbench | Single source — no external library dependency |
| Skills registry | `skills/registry.json` | Machine-readable, auto-populated by skill-architect |
| Ship-ready default | Skills work without human review | Review happens after, not as a gate |

## Commands

```bash
npm run build:tokens          # Rebuild CSS/SCSS/TS from token JSON
npm run snap -- <path>        # Screenshot a page (e.g. /v2/segments)
npm run snap:login            # Open browser for CRM authentication
npm run snap -- --start       # Launch persistent headless browser
npm run snap -- --stop        # Stop persistent browser
npm run snap:proto            # Screenshot prototype pages
npm run snap:compare          # Compare current vs previous screenshot
npm run snap:paste <img>      # Copy screenshot to clipboard + paste into Figma
node scripts/scan.js          # Discover all platform pages → scan-manifest.json
npm run scan:source           # Analyze Vue source files → page-manifest.json (284 pages)
npm run gen:tracker           # Auto-generate composition-tracker.md from manifest
npm run audit:parity          # Compare Figma vs Vue component specs
npm run mcp:health            # Kill zombie MCP processes + connection report
npm run mcp:status            # Connection status only (no cleanup)
node scripts/clone-batch.js   # Batch-clone Vue pages for coded prototypes
```

## MCP Connectivity

Two Figma MCP servers are configured in `.mcp.json`:
- **figma-remote-mcp** — Figma's official cloud server (read + write via `use_figma`, cloud-hosted)
- **figma-console-mcp** — Desktop Bridge plugin (90+ tools, screenshots, console monitoring, local WebSocket)

### Which tool to use

| Task | Tool | Server |
|------|------|--------|
| **Build / create / bulk write** | `use_figma` | figma-remote-mcp |
| **Read designs / Code Connect** | `get_design_context` | figma-remote-mcp |
| **Search components** | `search_design_system` | figma-remote-mcp |
| **Screenshot / visual verify** | `figma_take_screenshot` | figma-console-mcp |
| **Console monitoring / debug** | `figma_watch_console` | figma-console-mcp |
| **Surgical single-node edits** | `figma_move_node`, `figma_set_fills`, etc. | figma-console-mcp |

**Default to `use_figma`** for all write operations. It runs in the cloud (no Desktop Bridge needed), supports batch operations in a single call, and uses the same Plugin API as `figma_execute`. The Helper Library preamble works identically in both — just pass the `fileKey` parameter.

**Fall back to `figma_execute`** (via figma-console-mcp) only when you need screenshot verification mid-build, console log access, or the Desktop Bridge's granular inspection tools.

A `SessionStart` hook runs `mcp-health.sh --quiet` automatically to clean zombie processes.

If connection drops during a session, run `npm run mcp:health` or use the `figma_reconnect` MCP tool.

Team setup guide: `references/mcp-setup-guide.md`
