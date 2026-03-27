# FT DNA

Design tokens, component inventory, AI skills, and reference documentation for the FastTrack platform.

## Quick Start

```bash
git clone https://github.com/ayokaayo/FTDNA.git
cd FTDNA
claude
```

Claude Code detects first run and walks you through setup automatically — dependencies, Figma connection, environment config. No manual steps required beyond having your [Figma Personal Access Token](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens) ready.

See [SETUP.md](SETUP.md) for prerequisites and details.

## What's Inside

| Directory | Purpose |
|-----------|---------|
| `tokens/` | W3C design tokens (colors, typography, spacing, semantic) |
| `dist/` | Generated CSS, SCSS, TypeScript from tokens |
| `inventory/` | Component audit, gap analysis, Figma-to-Vue tracking |
| `skills/` | Claude AI skills (prototyping, critique, tutoring, PRDs, KB search) |
| `references/` | Shared context — component catalog, page patterns, MCP setup guide |
| `templates/` | Vue component, test, and docs scaffolds |
| `scripts/` | Token builder, platform scanner, screenshot tools |

## Figma File

All design assets live in the FT DNA Figma file (Brand project):

[Open FT DNA in Figma](https://www.figma.com/design/7J3dSTuOSRlsHBqQ4ohtxI/%F0%9F%A7%AC-FT-DNA?m=auto&t=vFxIpgCjzDr1rSQB-6)

## Commands

```bash
npm run build:tokens   # Rebuild CSS/SCSS/TS from token JSON
npm run snap <path>    # Screenshot a platform page
npm run mcp:health     # Check Figma MCP connection
npm run audit:parity   # Compare Figma vs Vue component specs
```
