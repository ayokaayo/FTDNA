# Designers Guide

This page is for product designers who work in Figma and want to understand how the design system POC affects their workflow. It covers what has been connected, what is still missing, and where designer input is needed most.

## What changed for you

Before this POC, a colour called `pink/400` in Figma had no reliable counterpart in code. Developers would eyedrop the hex, hard-code it somewhere, and hope it stayed in sync. It never did.

Now there is a direct bridge. Every colour variable in Figma maps to a CSS token with the same shade number. When you spec `pink/400`, the developer types `--ft-color-brand-pink-400` and gets exactly that colour. No translation, no guessing.

This also means your Figma file is no longer just a reference — it is the **source of truth** that feeds the entire token pipeline. Changes you make to colour variables in Figma are what should drive updates to the token JSON files, which then automatically regenerate the CSS, SCSS, and TypeScript outputs that components consume.

## How the token bridge works (the short version)

The flow is straightforward:

1. **You define a colour in Figma** using the DSP-Master variable set (e.g., `blue/500`).
2. **That variable is exported** into `tokens/colors.tokens.json` with the matching shade number.
3. **A build script runs** and generates CSS custom properties like `--ft-color-brand-blue-500`.
4. **Components reference the token**, never a raw hex value.

The key file that ties it all together is `.fasttrack/figma-token-map.json`. Think of it as a dictionary: look up any Figma variable name and it gives you the exact CSS token name and hex value. This is also the file a developer checks when they are implementing one of your specs.

## What is done

### Colour tokens — fully aligned

All 53 brand colours are mapped with matching shade numbers between Figma and code. This covers 13 colour families: pink, purple, blue, yellow, red, orange, magenta, thunderbird, lilac, aqua, denim, green, and the neutral grays.

The shade stepping is consistent across the system:

| Shade | Role |
|-------|------|
| 200 | Lightest — locked or disabled backgrounds |
| 300 | Light — disabled state |
| 400 | Default / idle state |
| 500 | Hover state |
| 600 | Darkest accent, active state |

If you design a component with `pink/400` as its default fill and `pink/500` as its hover fill, a developer can implement that with zero ambiguity.

### Semantic tokens — functional colour roles

Beyond raw brand colours, there is a semantic layer that assigns functional meaning. These are the tokens designers should reach for most often:

- **Primary** (blue family) — main actions, links, selected states
- **Secondary** (pink family) — brand accent, CTAs
- **Tertiary** (purple family) — supporting actions
- **Success** (green) / **Warning** (yellow) / **Error** (red) / **Info** (aqua) — status and feedback

Each semantic role has a base, dark, light, and lightest variant. When you spec "use the primary colour", the developer has `--ft-color-primary-base` and does not need to look up which shade of blue that is.

### Typography — two families, two weights

The type system is defined and tokenised:

- **Inter** for all UI text (display, heading, body, caption)
- **Noto Sans Mono** for code snippets
- Two weights: Regular (400) and Bold (700)
- Sizes range from 10px captions up to 72px display text

### Five components wired end-to-end

These components are fully connected to the token pipeline and render live in the playbook:

| Component | What it demonstrates |
|-----------|---------------------|
| [Tag](/components/tag) | 8 colour variants, 3 sizes, solid/light, lock, remove, icons |
| [Checkbox](/components/checkbox) | Font Awesome icons, flipped layout, array binding |
| [Radio](/components/radio) | Custom dot in pink-400, flipped layout |
| [Tooltip](/components/tooltip) | 5 status colours from semantic tokens, copy icon |
| [Paging](/components/paging) | Active page in pink-400, mono-200 item count tags |

Each one proves the same pattern: your Figma spec flows through tokens into the component with no manual colour wiring.

## What is not done

Here is the honest picture of what is still open.

### Most components are documented but not wired

The playbook lists 20 components in the sidebar, but only 5 are actually connected to the token pipeline and rendering live. The other 15 have documentation pages describing what they should do, but the Vue code is not yet wired to tokens. This means the playbook pages for components like Button, Input, Modal, and Table show specs and intended behaviour, but they are not yet running as live demos.

### 229 Figma variants have no Vue counterpart

Out of 839 component variants in Figma, 610 (72.7%) are mapped to Vue components. The remaining 229 fall into two groups:

**Figma sections with no Vue component at all (9 sections):**

| Figma section | Variants | Notes |
|---------------|----------|-------|
| Flags | 261 | Country flag assets — may not need Vue components |
| Tag (Figma-native) | 49 | Figma has a richer Tag spec than the current Vue `FTTag` |
| Image Picker | 40 | No Vue equivalent exists |
| Card | 17 | Could potentially be built as a Panel composition |
| Toggle | 12 | No dedicated switch component |
| Placeholder | 6 | Skeleton/loading states — not implemented |
| Filter by Tags | — | Composition of Tag + filtering logic |
| Dynamic Variables | — | Config-driven, domain-specific |
| Activity Conversion | — | Domain-specific module |

**Mapped components that are missing variants:**

Even for the 20 components that do have Vue counterparts, many are missing specific variant combinations that Figma defines. For example, Button in Figma has 40 variants covering different type/status/size/icon combinations. The Vue `FTButton` exists but has not been audited against all 40 of those variants.

### Three critical components need attention first

The gap analysis flags these as the highest priority because they are used everywhere:

1. **Button** — 40 Figma variants. Needs full Type (primary, secondary, tertiary, action, success, warning, error), Status (default, hover, disabled, loading), Size (S, M, L), and icon combinations.
2. **Dropdown** — 71 Figma variants across two sections. Multiple dropdown types that need to be reconciled.
3. **Input** — 38 Figma variants. Full input type coverage (text, email, number, password, select) with all states.

### Backoffice overrides are not yet reconciled

13 of the 20 Vue components carry custom CSS overrides in the backoffice product. These overrides change colours, spacing, or behaviour in ways that may or may not be intentional product decisions. Until each override is audited, we cannot know which ones should become proper token variants and which should be removed.

## What still needs work from designers

This section lists the areas where designer input is essential to keep things moving.

### Variant audit for each component

Every one of the 20 mapped components needs a side-by-side check: does the Figma spec match what the Vue component actually supports? For each component, the questions are:

- Are all Figma variants (type, status, size, icon, layout) documented clearly?
- Are there variants in the Vue code that do not exist in Figma, or vice versa?
- Are colour values consistent with the token system, or do some variants use values outside the defined palette?

The dev team needs your sign-off on which variants are canonical before they wire them to tokens.

### Naming alignment

Figma's parameterised naming convention (`Type=value, Status=value, Size=value`) is followed by 94% of components, which is good. The remaining 6% use inconsistent patterns. Standardising these makes the Figma-to-code translation mechanical rather than interpretive.

When naming variants, stick to the convention:

```
ComponentName (Type=value, Status=value, Size=value)
```

For boolean states (disabled, loading, active), use `Status=disabled` rather than creating separate frames.

### Missing component specs

Nine Figma sections have no Vue counterpart at all. Some of these (like Flags) may not need one. Others (like Toggle, Card, Image Picker, and Placeholder) probably do. The design team needs to prioritise which of these should be specced and added to the component library.

### Token coverage for states

The shade stepping pattern (200–600) is defined and works well for the five POC components. But as more complex components come online (Button, Input, Dropdown), there may be states that need additional shades or semantic tokens. If you find yourself reaching for a colour that does not exist in the token set, that is a signal that a new token is needed — not that a hex should be hardcoded.

## How to use the playbook

The playbook is live at the GitHub Pages URL and runs locally with `npx vitepress dev docs`. Here is what is most useful for designers:

- **[Colors page](/tokens/colors)** — Every brand token with its hex, shade number, and visual swatch. Use this to verify your Figma variables match code.
- **[Semantic tokens page](/tokens/semantic)** — The functional colour roles (primary, error, surface, etc.) and which brand colours they map to.
- **[Typography page](/tokens/typography)** — The full type scale with sizes, weights, and line heights.
- **[Component pages](/components/tag)** — Live rendered components. The five with the POC badge are real; the others show intended specs.
- **[Component Status page](/components/status)** — A snapshot of what is coded, what is Figma-only, and what needs work.

## Key takeaway

The bridge between Figma and code now exists. Colour names match, tokens are generated automatically, and five components prove the pattern works. But the majority of the component library still needs to be audited, specced, and wired. That work is roughly split: designers define the variants and validate the specs, developers wire them to tokens and build the code. The playbook is where both sides meet.
