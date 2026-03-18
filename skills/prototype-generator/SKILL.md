---
name: prototype-generator
description: Generate branded Figma prototypes from a brief, PRD, or verbal description. Use this skill when someone asks to "build a screen", "create a prototype", "design a page in Figma", "mock up a feature", "generate UI", or any task involving creating Figma designs programmatically. Also triggers for "build a layout", "create a form", "design a modal", "make a dashboard". Outputs production-quality Figma frames using FT DNA design tokens — not wireframes, not screenshots, not code.
---

# Prototype Generator

Build branded Figma prototypes using FT DNA components, directly in Figma via the Desktop Bridge plugin.

## What This Produces

Production-quality Figma frames built from real component instances — side menu, header, panels, tables, forms, tags — with auto-layout, named layers, and realistic domain data.

## Prerequisites

1. **Figma Desktop Bridge** plugin running and connected
2. **FT DNA file** open in Figma Desktop
3. Read the reference files listed below before generating

## Decision Engine

Before writing any code, reason through these references:

1. **`references/page-patterns.md`** — Select page pattern (settings, list, detail, modal, dashboard)
2. **`references/component-catalog.md`** — Map brief elements to exact component variants
3. **`references/code-patterns.md`** — Get the proven code for each pattern
4. **`references/component-ids.md`** — Look up IDs, variant names, text override nodes

## Process

### Step 1: Understand the Brief

Extract from the input:
- **What screens** are needed
- **What page pattern** each matches → `page-patterns.md`
- **What components** each needs → `component-catalog.md`
- **What states** matter (default, empty, error, success)
- **What data** to show (realistic FT iGaming content)

Present the plan before building:
```
Screen plan:
1. [Screen name] — Pattern: [settings/list/detail/modal]
   Components: [list with specific variants]
   Data: [realistic content]
```

### Step 2: Bootstrap the Page

**Always start from Base Template `94:21370`.** Never build from primitives.

→ See `code-patterns.md` § Bootstrap

This gives you: 1920×1080, real side menu, real header with breadcrumbs + CTAs, Standard Panel with Panel Header, empty content placeholder.

### Step 3: Override Shell Text

Set panel title, subtitle, breadcrumbs, and CTA button text.

→ See `code-patterns.md` § Override Shell Text
→ See `component-ids.md` § Text Override Node Names

### Step 4: Add Pattern-Specific Content

Based on the page pattern selected in Step 1:

**List Page:**
1. Add tabs above the panel → `code-patterns.md` § Tabs
2. Build table with Header + Row cells → `code-patterns.md` § Table Composition
3. Use Tag instances for status columns → `code-patterns.md` § Status Tag Cells
4. Add pagination at bottom

**Settings/Form Page:**
1. Build form sections with 2-column rows → `code-patterns.md` § Form Fields
2. Use Input Field instances (text, dropdown, textarea)
3. Toggle instances for on/off settings (always HUG, never FILL)

**Detail Page:**
1. Info section with filled Input Field instances (read-only display)
2. Status Tag next to panel header title
3. Related data section (mini table or card list)

**Modal / Slide-In:**
1. Multiple Standard Panels stacked (gap: 32) for sections
2. Buttons in the slide-in header, not footer
3. Block Selectors for multi-option grids

→ See `page-patterns.md` for full structure diagrams and composition rules

### Step 5: Verify & Fix

1. Screenshot with `figma_capture_screenshot`
2. Check: column alignment, tab visibility, text overrides, spacing
3. Fix issues — common: tab text not overriding, column widths mismatched, badges visible

### Step 6: Organize Canvas

- X spacing: 100px between screens
- Row 1: Default states, Row 2: Alternate states
- Naming: `[Feature] — [Screen] — [State]`

## Critical Rules

1. **Always Base Template** — instantiate `94:21370`, never build from scratch
2. **Always real components** — from Workbench, never manual frames
3. **Column widths must match** — header cells = data cells
4. **Tabs outside panels** — at content area level, matching panel width
5. **No dividers** — use spacing only
6. **No footer buttons in slide-ins** — buttons in header
7. **Append before FILL** — `appendChild()` first, then `layoutSizingHorizontal = 'FILL'`
8. **Load fonts before text** — `loadFontAsync(node.fontName)`
9. **Realistic data** — FT iGaming context, never lorem ipsum
10. **Screenshot after every major step** — catch issues early
11. **CTA text is sentence case** — "Add Player", "Save Changes", "Create Campaign" — never uppercase
12. **Table sort icons off by default** — hide the sort icon on header cells; only show when the brief explicitly requests sorting

## Reference Files

**Read before generating:**

| File | What it contains |
|------|-----------------|
| `references/page-patterns.md` | Layout patterns, slot definitions, composition rules, anti-patterns |
| `references/component-catalog.md` | 52 components, prop keys, variant selection logic, compliance rules |
| `references/code-patterns.md` | Proven code snippets: bootstrap, tables, tabs, forms, tags, overrides |
| `references/component-ids.md` | Component IDs, variant names, text override node names, API gotchas |
| `references/base-template.md` | Base Template node structure and navigation |
| `references/ft-dna-variables.json` | Variable ID map (colors + sizing) |
