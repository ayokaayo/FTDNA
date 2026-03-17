# FT DNA

The FastTrack platform's DNA — design tokens, component inventory, AI skills, and reference documentation. This is the team's unified workspace for design system management and AI-assisted development.

## What's Here

| Directory | Contents |
|-----------|----------|
| `tokens/` | W3C design tokens (colors, typography, spacing, semantic) |
| `dist/` | Generated CSS, SCSS, and TypeScript from tokens |
| `inventory/` | Component audit, gap analysis, Figma-to-Vue tracking |
| `skills/` | Claude AI skills (prd-writer, design-critique, prototype-generator, skill-architect) |
| `references/` | Shared context docs (component catalog, page patterns) |
| `templates/` | Vue component, test, and docs templates |
| `assets/logos/` | FastTrack brand SVGs |
| `scripts/` | Token build script |
| `memory/` | AI session memory and progress log |

## Quick Start

```bash
# Build design tokens (CSS, SCSS, TypeScript)
npm install
npm run build:tokens
```

Output lands in `dist/`:
- `tokens.css` — CSS custom properties (`--ft-*`)
- `tokens.scss` — SCSS variables and maps
- `useTokens.ts` — Vue 3 composable with TypeScript types

## How It Works

This repo is the team's AI-assisted workspace. When a designer needs a component converted from Figma to code:

1. Open Claude in this directory
2. Claude reads Figma via MCP
3. Claude reads this repo for context (tokens, catalog, skills, conversion rules)
4. Claude writes the Vue component to `../vue-components-lib/`
5. Claude creates a branch and PR on the vue-lib repo
6. Front-end reviews and merges

## Related Repos

- **[vue-components-lib](https://github.com/fasttrack-solutions/vue-components-lib)** — Production Vue 3 component library (npm package)
- **FT DNA Figma file** — Source of truth for design (file key: `7J3dSTuOSRlsHBqQ4ohtxI`)

## AI Skills

Skills are Claude instruction packages in `skills/`. See `skills/registry.json` for the full index.

| Skill | What it does |
|-------|-------------|
| `prd-writer` | Write or refactor PRDs |
| `skill-architect` | Create new skills |
| `design-critique` | Review designs for compliance and quality |
| `prototype-generator` | Generate Figma prototypes from briefs |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for token naming conventions, component workflow, and review checklist.
