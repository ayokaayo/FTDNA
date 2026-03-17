# FT DNA — Design System Reference

> Source of truth for design-critique compliance checks.
> Last synced: 2026-03-13

## Source Hierarchy

1. **Figma (FT DNA file)** — Primary source of truth for tokens (colors, typography, spacing). All token values below are from here.
2. **Playbook (components.fasttrack.dev)** — Official component documentation. Downstream of Figma. Used for component behavior and API details.
3. **Repo (vue-components-lib)** — Implementation. Downstream of playbook. Used for prop specs and CSS variable names.

When sources conflict, Figma wins.

---

## Color Tokens
_Source: Figma + Playbook_

### Brand Palette (7 families × 5 shades)

| Family | 200 (lightest) | 300 | 400 | 500 | 600 (darkest) |
|--------|-------|-----|-----|-----|-------|
| Pink | #FAD7E4 | #F4B0C8 | #E96092 | #D52454 | #C21030 |
| Purple | #E0C6E0 | #C18EC0 | #831F82 | #440743 | #230123 |
| Blue | #D8EDF9 | #B0DAF2 | #63B6E6 | #2782CF | #105DBA |
| Yellow | #FFF6C9 | #FEED93 | #FFDB14 | #FDBC25 | #FCA122 |
| Red | #F9D3CC | #F2A699 | #E54F35 | #CD1913 | #B80E11 |
| Orange | #FCE8C7 | #F9D18F | #F4A321 | #E9681A | #DF4317 |
| Green | #D4E9D4 | #A9D3A9 | #3AAA3F | #2E7D2E | #1A5A1A |

### Neutral / Mono Palette

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

### Semantic Tokens

| Role | Tokens used |
|------|------------|
| Primary | Pink 200–600 |
| Secondary | Blue 200, 500, 600 |
| Tertiary | Purple 300–500 |
| Success | Green 200–500 |
| Warning | Yellow 200–500 |
| Error | Red 200, 400, 500, 600 |
| Info | Blue 200, 400, 500, 600 |
| Neutral | Mono 200–700 |

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

---

## Typography

### Font Families

| Role | Font | CSS Variable |
|------|------|-------------|
| UI / Content | Inter | `--font-primary` |
| Code / Monospace | Noto Sans Mono | `--font-monospaced` |

### Font Weights

| Weight | Value | CSS Variable |
|--------|-------|-------------|
| Regular | 400 | `--font-weight-regular` |
| Bold | 700 | `--font-weight-bold` |

### Type Scale

| Level | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| Headline | 120px | 124px | 700 | -0.2px |
| Section | 72px | 76px | 700 | -0.2px |
| Heading | 38px | 45px | 700 | -0.2px |
| Title | 20px | 25px | 700 | — |
| Sub-title | 16px | 23px | 400 | — |
| Sub-title Bold | 16px | 23px | 700 | — |
| Body | 14px | 17px | 400 | — |
| Body Bold | 14px | 17px | 700 | — |
| CTA | 12px | — | 700 | — |
| Note | 12px | — | 400 | — |
| Note Bold | 12px | — | 700 | — |
| Caption | 10px | 12px | 700 | 0.4px |

---

## Spacing & Sizing

### Modern Scale

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
3. **Spacing violations** — Values not on the scale (2, 4, 8, 12, 16, 24, 32, 48, 64). Irregular gaps between similar elements.
4. **Component violations** — Custom implementations of components that exist in the library (buttons, inputs, modals, etc.).
5. **Icon violations** — Icons not from FontAwesome Pro. Inconsistent icon styles (mixing solid and regular without purpose).
6. **Layout violations** — Content areas that break the standard page layout pattern without justification.

When a deviation exists, note whether it appears intentional (a design decision) or accidental (likely a miss). Intentional deviations should be flagged for documentation; accidental ones should be flagged for correction.

---

## Sources

- **Figma (primary):** [FT DNA](https://www.figma.com/design/7J3dSTuOSRlsHBqQ4ohtxI/%F0%9F%A7%AC-FT-DNA) — new file, components being migrated here
- **Figma (legacy):** DSP-Master (`tyhDN8pjR0WM048BYhEa1Q`) — fall back for components not yet in FT DNA
- **Playbook:** [components.fasttrack.dev](https://components.fasttrack.dev/guide/getting-started.html)
- **Repo:** [vue-components-lib](https://github.com/fasttrack-solutions/vue-components-lib)
