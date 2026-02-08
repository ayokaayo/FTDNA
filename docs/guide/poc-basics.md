# POC Basics

Before we get into components and tokens, it helps to understand why this playbook exists and what it is trying to solve. This page is written for everyone: designers, developers, and stakeholders.

## The problem

Our design system lives in two places that do not talk to each other. Figma holds the colours, spacing, and component designs. The Vue component library (`@fasttrack-solutions/vue-components-lib`) holds the code. Between them sits a gap: colour names do not match, shade numbers differ, and there is no single source of truth that both sides agree on.

This came up in a [discussion on Slack](https://fasttrack-solutions.slack.com/archives/C0A3A9C3VCY/p1770387078633819) where the team identified the need to sync Figma, the Vue component library, and the backoffice. An initial audit found:

- **10 components with no CSS overrides** in the backoffice (FTCheckbox, FTConfirm, FTRadio, FTPaging, and others). These are the cleanest starting points.
- **13 components with CSS overrides** (FTButton, FTInput, FTTable, FTModal, and others). These carry custom styles in the backoffice that would need to be reconciled.

The question was: how do we close this gap?

## What was built

This playbook is a proof of concept that answers that question. It is a clone of the current public playbook. Ideally this work should live in the real one, but for now it serves as a sandbox where we can validate the approach without risking the production site.

Here is what it contains, in plain terms:

### A colour bridge between Figma and code

In Figma, there is a colour called `pink/400`. In the old code, that same colour (`#E96092`) was called `pink-600`. Different number, same colour, confusing for everyone.

We rewrote the entire colour token system so **the numbers match**. Figma says `pink/400`, the code says `--ft-color-brand-pink-400`. No translation needed. This covers all 53 brand colours across pink, blue, red, orange, green, purple, and gray families.

### A "Rosetta Stone" between design and code

The file `.fasttrack/figma-token-map.json` works like a translation guide for our design system. This file lets anyone translate between Figma variable names and CSS token names. Pick any colour in Figma, look it up, and you get the exact CSS variable and hex value. One lookup, no guessing.

### Five wired components

The first component built end-to-end with this system was the [Tag](/components/tag). It pulls its colours directly from the design tokens, so when a token changes the component updates automatically. It supports all the states defined in Figma (default, hover, disabled, locked) with the correct shade stepping.

From there we picked four more components from the "no CSS overrides" group and wired them to the same token pipeline:

- [Checkbox](/components/checkbox) uses Font Awesome icons exactly as Figma specifies (`fa-square-check` / `fa-square`), in mono-700.
- [Radio](/components/radio) renders the selected dot in pink-400, matching the Figma variable directly.
- [Tooltip](/components/tooltip) supports five status colours (default, success, info, warning, error) pulled from semantic tokens, with an optional copy-to-clipboard icon.
- [Paging](/components/paging) shows the active page in a pink-400 circle and uses mono-200 tags for item counts, all from the token layer.

Each one follows the same pattern: Figma defines the visual, the token pipeline converts it, the component consumes it. No hardcoded hex values.

### A living playbook

You are looking at it. This site renders real Vue components with real design tokens. It is not screenshots or mockups. The [Tag page](/components/tag) shows actual `<FTTag>` components running live in the browser with the same CSS variables they would use in production.

### AI scaffolding

The `.fasttrack/` folder contains templates and rules that help AI tools generate new components following the same patterns. This means the work we did for the Tag component does not need to be repeated manually for every other component. The patterns are codified and reusable.

## What this already enables

**For designers**: You can look at any Figma colour variable and know exactly what to tell a developer. `pink/400` in Figma means `--ft-color-brand-pink-400` in code. No guessing, no mismatches.

**For developers**: The design tokens ship as CSS variables, SCSS variables, and a TypeScript helper. Import `tokens.css` and every colour from Figma is available in your styles, with names that match what the designer sees.

**For everyone**: The playbook is a shared reference. Instead of asking "which shade of pink is that?", anyone can open the [Colors page](/tokens/colors) and see every token with its hex value and Figma name side by side.

## What it can enable shortly

**More components wired to tokens.** We have five wired so far (Tag, Checkbox, Radio, Tooltip, Paging) and five more from the "no overrides" list are ready to go (Confirm, FloatingLabel, Navbar, Panel, OptionsSelector). The same pattern (Figma tokens, then CSS variables, then component styles, then playbook docs) applies to each. Components without backoffice overrides are the natural next candidates since they are the simplest to align.

**Backoffice override audit.** For components that do have custom CSS in the backoffice, the token system gives us a structured way to evaluate each override. Take FTButton as an example: it has a dedicated `ft-button.less` file in the backoffice plus overrides scattered across 9 other files. Some of those overrides change colours for the "enteractive" theme. The question becomes: is that a genuine product need that should stay in the backoffice, or is it compensating for a missing colour variant that the component library should provide natively through tokens? The ones compensating for gaps can be absorbed back into the library so the backoffice stops needing custom CSS for them.

**Automated drift detection.** Once a build pipeline watches the token files, we can catch mismatches between Figma and code before they ship. If someone changes a colour in Figma but the tokens do not update, the build flags it.

## The big picture

The end goal is a closed loop:

1. **Figma** is the single source of truth for all visual decisions.
2. **Design tokens** translate those decisions into code-ready values, automatically.
3. **Components** consume the tokens and render correctly without manual colour wiring.
4. **The playbook** documents everything in one place, with live examples.
5. **The backoffice** uses the components as-is, with minimal or zero CSS overrides.

When this loop is fully closed, a colour change in Figma flows through to every component in every product without anyone manually updating hex values in CSS files. Tools like Figma Make can then generate prototypes using our actual design system, because the system is documented and connected.

This POC proves the approach works. The foundation is solid. Now it is about scaling it across the library. We would be happy to discuss this further and hear your thoughts.
