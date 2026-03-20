# FT DNA — Design System Reference

> Source of truth for design-critique compliance checks.
> All values below come from Figma variables (FT DNA file). When sources conflict, Figma wins.
> Last synced: 2026-03-20

## Source Hierarchy

1. **Figma (FT DNA file)** — Primary source of truth for tokens (colors, typography, spacing). All token values below are from here.
2. **Playbook (components.fasttrack.dev)** — Official component documentation. Downstream of Figma. Used for component behavior and API details.
3. **Repo (vue-components-lib)** — Implementation. Downstream of playbook. Used for prop specs and CSS variable names.

When sources conflict, Figma wins.

---

## Color Tokens
_Source: Figma Variables → Colours collection (53 variables, Light + Dark modes)_

### Brand Palette (6 families × 5 shades)

Variable pattern: `color-brand-{family}-{shade}`

| Family | 200 (lightest) | 300 | 400 | 500 | 600 (darkest) |
|--------|-------|-----|-----|-----|-------|
| Pink | #FAD7E4 | #F4B0C8 | #E96092 | #D52454 | #C21030 |
| Purple | #E0C6E0 | #C18EC0 | #831F82 | #440743 | #230123 |
| Blue | #D8EDF9 | #B0DAF2 | #63B6E6 | #2782CF | #105DBA |
| Yellow | #FFF6C9 | #FEED93 | #FFDB14 | #FDBC25 | #FCA122 |
| Red | #F9D3CC | #F2A699 | #E54F35 | #CD1913 | #B80E11 |
| Orange | #FCE8C7 | #F9D18F | #F4A321 | #E9681A | #DF4317 |

### Alt Palette (1 family × 5 shades)

Variable pattern: `color-alt-{family}-{shade}`

| Family | 200 (lightest) | 300 | 400 | 500 | 600 (darkest) |
|--------|-------|-----|-----|-----|-------|
| Green | #CDEACC | #9CD499 | #3AAA35 | #0D710B | #034B02 |

### Neutral / Mono Palette

Variable pattern: `color-mono-{shade}`

| Token | Value |
|-------|-------|
| White | #FFFFFF |
| 100 | #FAFAFA |
| 200 | #F5F5F5 |
| 300 | #E5E5E5 |
| 400 | #CACACA |
| 500 | #959595 |
| 600 | #666666 |
| 700 | #2C2C2C |
| Black | #000000 |

### Wireframe Palette

Variable pattern: `color-wire-{shade}` — blue-gray tones for wireframing and low-fidelity work.

| Token | Value |
|-------|-------|
| White | #FFFFFF |
| 100 | #F5F9FC |
| 200 | #E9EFF6 |
| 300 | #D5DBE3 |
| 400 | #C2CAD6 |
| 500 | #AEBBC8 |
| 600 | #7D90A6 |
| 700 | #313F55 |
| Black | #101A2F |

### Semantic Aliases

Functional color mappings referencing the palettes above.

| Role | Base color | Shades used |
|------|-----------|-------------|
| Primary | Pink | base=400, dark=500, darker=600, light=300, lighter/lightest=200 |
| Secondary | Blue | base=600, dark=600, light=500, lightest=200 |
| Tertiary | Purple | base=400, dark=500, light=300 |
| Success | Green (alt) | base=400, dark=500, light=300, lightest=200 |
| Warning | Yellow | base=400, dark=500, light=300, lightest=200 |
| Error | Red | base=500, dark=600, light=400, lightest=200 |
| Info | Blue | base=400, dark=500, light=300, lightest=200 |
| Neutral | Mono | base=600, dark=700, light=500, lighter=400, lightest=200 |

### Surface, Text & Border

| Token | Value | Usage |
|-------|-------|-------|
| `surface.base` | White | Default background |
| `surface.secondary` | Mono 100 (#FAFAFA) | Secondary surfaces |
| `surface.tertiary` | Mono 200 (#F5F5F5) | Tertiary surfaces |
| `surface.inverse` | Black | Dark surfaces |
| `on-surface.base` | Mono 700 (#2C2C2C) | Primary text |
| `on-surface.secondary` | Mono 600 (#666666) | Secondary text |
| `on-surface.tertiary` | Mono 500 (#959595) | Tertiary text / placeholders |
| `on-surface.disabled` | Mono 400 (#CACACA) | Disabled text |
| `on-surface.inverse` | White | Text on dark surfaces |
| `on-primary.base` | White | Text on primary backgrounds |
| `on-secondary.base` | White | Text on secondary backgrounds |
| `on-success.base` | White | Text on success backgrounds |
| `on-error.base` | White | Text on error backgrounds |
| `border.base` | Mono 300 (#E5E5E5) | Default borders |
| `border.subtle` | Mono 200 (#F5F5F5) | Subtle dividers |
| `border.strong` | Mono 500 (#959595) | Emphasized borders |
| `border.focus` / `focus-ring.base` | Blue 600 (#105DBA) | Focus indicators |
| `link.base` | Blue 600 (#105DBA) | Default link color |
| `link.hover` | Blue 500 (#2782CF) | Link hover state |
| `link.visited` | Purple 300 (#C18EC0) | Visited links |
| `accent.primary` | Orange 500 (#E9681A) | Primary accent |
| `accent.secondary` | Purple 400 (#831F82) | Secondary accent |
| `overlay.base` | rgba(0,0,0,0.5) | Modal/overlay backdrop |
| `overlay.light` | rgba(0,0,0,0.3) | Subtle dimming |
| `overlay.dark` | rgba(0,0,0,0.7) | Strong dimming |

---

## Typography
_Source: Figma text styles — 17 styles across 5 groups_

### Font Families

| Role | Font |
|------|------|
| UI / Content | Inter |
| Code / Monospace | Noto Sans Mono |

### Font Weights

Only two weights used across the entire system:

| Weight | Value |
|--------|-------|
| Regular | 400 |
| Bold | 700 |

### Type Scale

| Level | Token name | Size | Line Height | Weight | Letter Spacing |
|-------|-----------|------|-------------|--------|----------------|
| Display Large | `display.l` | 72px | 72px | 700 | -4px |
| Display Medium | `display.m` | 38px | 38px | 700 | -2px |
| Heading Medium Bold | `heading.m-bold` | 20px | 24px | 700 | 0 |
| Heading Small | `heading.s` | 16px | 20px | 400 | 0 |
| Heading Small Bold | `heading.s-bold` | 16px | 20px | 700 | 0 |
| Body Large | `body.l` | 15px | 24px | 400 | 0 |
| Body Large Bold | `body.l-bold` | 15px | 24px | 700 | 0 |
| Body Medium | `body.m` | 14px | 20px | 400 | 0 |
| Body Bold | `body.bold` | 14px | 20px | 700 | 0 |
| Body Small | `body.s` | 12px | 16px | 400 | 0 |
| Body Small Bold | `body.s-bold` | 12px | 16px | 700 | 0 |
| Caption Medium | `caption.m` | 12px | 16px | 400 | 0 |
| Caption Medium Bold | `caption.m-bold` | 12px | 16px | 700 | 0 |
| Caption Small | `caption.s` | 10px | 12px | 400 | 0.2px |
| Caption Small Bold | `caption.s-bold` | 10px | 12px | 700 | 0.2px |
| Link | `variant.link` | inherit | inherit | 400 | — (underline) |
| CTA | `variant.cta` | 12px | — | 700 | 0 |

---

## Spacing & Sizing
_Source: Figma Variables → Sizes collection (10 variables)_

| Token | Value | Purpose |
|-------|-------|---------|
| `sizing.0` | 0px | Reset / flush |
| `sizing.2xs` | 2px | Icon padding, tight elements |
| `sizing.xs` | 4px | Compact gaps, tag padding |
| `sizing.sm` | 8px | Default inline gaps, form spacing |
| `sizing.s` | 12px | Intermediary compact layouts |
| `sizing.md` | 16px | Default content gaps, card padding |
| `sizing.lg` | 24px | Section spacing |
| `sizing.xl` | 32px | Page margins |
| `sizing.2xl` | 48px | Major section divisions |
| `sizing.3xl` | 64px | Page-level vertical spacing |

### Border Radius

| Token | Value |
|-------|-------|
| `--border-radius-xxs` | 2px |
| `--border-radius-xs` | 4px |
| `--border-radius-s` | 8px |
| `--border-radius-m` | 16px |
| `--border-radius-l` | 32px |
| `--border-radius-xl` | 64px |

---

## Icons

- **Library:** FontAwesome Pro
- **Styles:** Solid (`fas`), Regular (`far`), Duotone (`fad`), Light (`fal`)
- **Component:** `<FTIcon icon="fas user" />` or `<Fa>`
- **Naming:** `[prefix] [icon-name]` (e.g., `fas user`, `far calendar`)

---

## Component Library

### Available Components (FT-prefixed)

**Form:** FTButton, FTCheckbox, FTRadio, FTRadioGroup, FTInput, FTSelect, FTDatepicker, FTFloatingLabel, FTOptionsSelector

**Layout:** FTModal, FTPanel, FTSlidingPanel, FTSplitView, FTNavbar, FTTabs

**Data:** FTTable, FTPaging, FTTooltip, FTAlert

**Utility:** FTConfirm, FTRichText, FTSpinner

**Composables:** useNotification

For full component specs see `references/component-catalog.md`.

### Key Component Rules

**FTButton:**
- Style variants: primary, secondary (default), tertiary, action
- Status variants: info, warning, success, error
- States: disabled, loading, active, inactive
- Icon-only sizes: big, medium (default), small
- Height: 32px (`--ft-btn-height`)
- Font: 12px / 700 weight, uppercase
- Primary background: #E96092 (Pink 400)
- Includes ripple effect on click

### Standard Page Layout

```
side menu (56px) | Header (50px tall, full width minus side menu)
                 | Content area (Standard Panel, inset 82px left, 32px top)
```

---

## Compliance Check Rules

When reviewing a design against this system, flag:

1. **Color violations** — Any color not in the palette. Hardcoded hex values that should use semantic tokens.
2. **Typography violations** — Font sizes, weights, or line heights not in the type scale. Non-Inter fonts for UI text.
3. **Spacing violations** — Values not on the scale (0, 2, 4, 8, 12, 16, 24, 32, 48, 64). Irregular gaps between similar elements.
4. **Component violations** — Custom implementations of components that exist in the library (buttons, inputs, modals, etc.).
5. **Icon violations** — Icons not from FontAwesome Pro. Inconsistent icon styles (mixing solid and regular without purpose).
6. **Layout violations** — Content areas that break the standard page layout pattern without justification.

When a deviation exists, note whether it appears intentional (a design decision) or accidental (likely a miss). Intentional deviations should be flagged for documentation; accidental ones should be flagged for correction.

---

## Sources

- **Figma:** [FT DNA](https://www.figma.com/design/7J3dSTuOSRlsHBqQ4ohtxI/%F0%9F%A7%AC-FT-DNA) — single source of truth for all components, tokens, and prototypes
- **Playbook:** [components.fasttrack.dev](https://components.fasttrack.dev/guide/getting-started.html)
- **Repo:** [vue-components-lib](https://github.com/fasttrack-solutions/vue-components-lib)
