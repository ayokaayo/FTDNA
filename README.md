# FastTrack Design System

A centralized design system providing tokens, components, and documentation for FastTrack Solutions products.

## Purpose

The FastTrack Design System ensures consistency, accessibility, and efficiency across all product interfaces by establishing a single source of truth for design tokens, components, and patterns.

## Directory Structure

- **tokens/** — Design token definitions
  - `colors.tokens.json` — Color palettes and semantic color assignments
  - `semantic.tokens.json` — Semantic design decisions (spacing, sizing, etc.)
  - `typography.tokens.json` — Type scales and font definitions

- **inventory/** — Component audit and gap analysis
  - Tracks all designed and implemented components
  - Identifies missing or outdated components

- **scripts/** — Build tooling
  - `build-tokens.js` — Compiles tokens into distributable formats

- **dist/** — Generated outputs (created during build)

## Building Tokens

Compile all design tokens from source definitions:

```bash
npm run build:tokens
```

This generates formatted token outputs in the `dist/` directory for use in design tools and code.

## Token Workflow

The design system follows this flow:

1. **Figma** — Design decisions are made in Figma
2. **tokens/*.json** — Exported and structured as JSON token definitions
3. **scripts/build-tokens.js** — Build script processes tokens
4. **dist/** — Compiled outputs ready for consumption

## Component Inventory

See the [inventory/](inventory/) directory for the current component gap analysis. This document tracks:
- Designed components
- Implemented components
- Missing or outdated components
- Priority for next iterations

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Token naming conventions
- Adding new colors and typography
- Component contribution workflow
- Code review checklist

## Quick Start

1. Review the [inventory/](inventory/) to understand current components
2. Check [tokens/](tokens/) for existing design decisions
3. Make changes to token files or add new components
4. Run `npm run build:tokens` to compile changes
5. Submit a pull request with your contributions

---

For questions or contributions, please open an issue or pull request in the repository.
