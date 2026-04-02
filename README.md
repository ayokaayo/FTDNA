# FT DNA

The FastTrack design system workspace — design tokens, component inventory, AI-powered prototyping, and reference documentation. This repo is the operating environment for the design team, powered by Claude Code.

**This repo does NOT contain Vue components.** Production components live in `vue-components-lib`. This repo provides the context, tokens, skills, and automation that Claude uses to generate outputs.

## What You Can Do

| Capability | What happens | How to trigger |
|---|---|---|
| **Figma prototyping** | Generate production-quality Figma pages from a brief or verbal description. Uses real component instances, design tokens, and 8 proven layout patterns. | "Build a segments list page" |
| **Coded prototypes** | Generate interactive Vue prototypes deployed to Cloudflare Pages. Clone existing pages or build new ones with mock data. | "Code this page as a prototype" |
| **Design critique** | Structured review of any Figma frame or screenshot for usability, compliance, and design system adherence. | "Review this screen" |
| **Platform screenshots** | Capture any live CRM page via headless browser. Compare before/after. Paste into Figma. | `npm run snap /v2/segments` |
| **Platform scanning** | Discover all routed pages, extract components, layout types, table columns, breadcrumbs, CTAs from Vue source. | `npm run scan:source` |
| **Component audit** | Compare Figma components vs Vue components. Identify gaps in both directions. | `npm run audit:parity` |
| **KB search** | Search the FastTrack GitBook knowledgebase and get sourced answers about platform features. | "How do triggers work?" |
| **CRM tutoring** | Adaptive tutoring on FT CRM concepts with quizzes, scenarios, and source citations. | "Teach me about lifecycles" |
| **PRD writing** | Generate or review Product Requirements Documents, scaled to task complexity. | "Write a PRD for X" |
| **Vue component generation** | Convert Figma components to Vue SFCs with tokens, a11y, tests, and docs. PRs to vue-components-lib. | "Convert FTButton to code" |

## Prerequisites

- **Claude Code** (or Cowork) installed and running
- **Node.js 18+** (`node --version`)
- **Figma account** with edit access to the FT DNA file (not dev seat)
- **Figma Personal Access Token** (starts with `figd_`) — [how to generate](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)
- **Figma Desktop app** (optional — needed for screenshots and Desktop Bridge tools)
- **backoffice-v2 repo** (optional — needed for coded prototype generation, clone as sibling: `../backoffice-v2`)

## Quick Start

```bash
git clone https://github.com/ayokaayo/FTDNA.git
cd FTDNA
claude
```

Claude detects first run and walks you through setup automatically — dependencies, environment config, Figma MCP connection. The only thing you need ready is your Figma Personal Access Token.

See [SETUP.md](SETUP.md) for manual setup steps and troubleshooting.

## Figma File

All design assets live in the FT DNA Figma file (Brand project):

[Open FT DNA in Figma](https://www.figma.com/design/7J3dSTuOSRlsHBqQ4ohtxI/%F0%9F%A7%AC-FT-DNA?m=auto&t=vFxIpgCjzDr1rSQB-6)

## Commands

```bash
# Tokens
npm run build:tokens        # Rebuild CSS/SCSS/TS from token JSON

# Screenshots & scanning
npm run snap -- <path>       # Screenshot a platform page (e.g. /v2/segments)
npm run snap:login           # Open browser for CRM authentication
npm run snap -- --start      # Launch persistent headless browser
npm run snap -- --stop       # Stop persistent browser
npm run snap:proto           # Screenshot prototype pages
npm run snap:compare         # Compare current vs previous screenshot
npm run snap:paste <img>     # Copy screenshot to clipboard + paste into Figma

# Source analysis
npm run scan:source          # Analyze 284 Vue source files → page-manifest.json
node scripts/scan.js         # Discover all platform pages → scan-manifest.json
node scripts/clone-batch.js  # Batch-clone Vue pages for coded prototypes

# Inventory & audit
npm run gen:tracker          # Auto-generate composition-tracker.md from manifest
npm run audit:parity         # Compare Figma vs Vue component specs

# MCP connectivity
npm run mcp:health           # Kill zombie MCP processes + connection report
npm run mcp:status           # Connection status only (no cleanup)
```

## Repo Structure

```
FTDNA/
├── tokens/          → W3C design tokens (colors, typography, spacing, semantic)
├── dist/            → Generated CSS, SCSS, TypeScript from tokens
├── inventory/       → Component audit, gap analysis, Figma-to-Vue tracking
├── skills/          → Claude AI skills + registry.json
├── references/      → Shared context (component catalog, page patterns, MCP guide)
├── templates/       → Vue component, test, and docs scaffolds
├── assets/logos/    → FastTrack brand SVGs
├── scripts/         → Token builder, scanner, screenshot tools, batch cloner
├── .fasttrack/      → Vue-lib rules, regression reports, plans
└── .workspace/      → Scratch space (gitignored)
```

## Skills

Skills are Claude instruction packages in `skills/`. They activate automatically when you describe what you need.

| Skill | What it does |
|-------|-------------|
| `prototype-generator` | Generate branded Figma prototypes from briefs or manifest |
| `coded-prototype-generator` | Generate interactive Vue prototypes on Cloudflare Pages |
| `design-critique` | Review designs for compliance and quality |
| `prd-writer` | Write, review, or refactor PRDs |
| `kb` | Search the GitBook knowledgebase for platform answers |
| `tutor` | Adaptive FT CRM tutoring with quizzes and scenarios |
| `skill-architect` | Create new production-ready skills |

Registry: `skills/registry.json`

## Token System

67 colors, 17 text styles, semantic aliases, and a spacing scale — all in W3C format.

| File | Purpose |
|------|---------|
| `tokens/colors.tokens.json` | Color primitives |
| `tokens/typography.tokens.json` | Text styles |
| `tokens/semantic.tokens.json` | Functional aliases (primary, error, etc.) |
| `tokens/spacing.tokens.json` | Spacing scale |
| `dist/tokens.css` | Generated CSS custom properties |
| `dist/tokens.scss` | Generated SCSS variables + maps |
| `dist/useTokens.ts` | Vue 3 composable + TypeScript types |

## MCP Connectivity

Two Figma MCP servers power the Figma integration:

| Server | What it does |
|---|---|
| **figma-remote-mcp** | Figma's official cloud server — read + write designs, search components |
| **figma-console-mcp** | Desktop Bridge plugin — screenshots, console monitoring, granular inspection |

Setup guide: [references/mcp-setup-guide.md](references/mcp-setup-guide.md)

## Current Status

**Version:** 0.7.0 (April 2026)

- 8 layout patterns proven and cold-tested (LIST-SIMPLE, LIST-TAB, LIST-FULL, FORM, DASH, GRID, SLIDEIN, HUB)
- Figma page composition in progress (tracked in FT DNA Figma file)
- Coded prototypes deployed to Cloudflare Pages via `feature/DEV-0000-FTDNA-prototypes` branch
- 284 Vue source files analysed with layout classification (`npm run scan:source`)
- Component parity audit: `npm run audit:parity` (50 Figma-only gaps, 133 Vue-only gaps)
- Build engine v2.0 with 97% render test pass rate (73/75)

Full status and technical detail: see `CLAUDE.md` (loaded automatically by Claude Code).
