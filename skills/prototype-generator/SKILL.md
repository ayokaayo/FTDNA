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

### Fast Path (brief exists)
If a brief file exists in `briefs/` for this page → **read the brief first.** It has layout type, columns, data, and construction notes. Then go straight to `code-patterns.md` for implementation snippets and `component-ids.md` for ID lookups. Skip the catalog and patterns files.

### Full Path (no brief, new page type)
Read references in this priority order — stop when you have enough:

1. **`./references/component-ids.md`** — IDs, variant names, text overrides, gotchas (102 lines, always read)
2. **`./references/code-patterns.md`** — Proven code snippets for each composition pattern (always read)
3. **`FTDNA/references/page-patterns.md`** — Jump to the specific layout type section you need (only read the relevant pattern, not the whole file)
4. **`FTDNA/references/component-catalog.md`** — Deep reference. Only read when you encounter a component NOT covered in component-ids.md

## Process

### Step 0: Generate Brief (if none exists)

When no brief exists in `briefs/` for the requested page, generate one before building:

1. **Identify the page** — from prompt, screenshot, or task reference
2. **Gather data** — read `scan-manifest.json` for DOM structure; take screenshot with `npm run snap <path>` if needed
3. **Match layout type** — using `page-patterns.md` selection logic:
   - Single table, no tabs → LIST-SIMPLE
   - Top tabs + table → LIST-TAB or LIST-FULL
   - Form fields / settings → FORM
   - Slide-in panel → SLIDEIN
   - Navigation cards → HUB
   - Multiple metric panels → DASH
   - Card grid → GRID
   - Nested template sections with inline tables → LIST-NESTED
4. **Fill brief template** — following `briefs/_TEMPLATE.md`:
   - Shell: side menu section, breadcrumb levels, CTA text
   - Content: search, tabs, toolbar, columns (name + width + cell type), sample rows, pagination
   - Cell types: pick from the 15 types in `code-patterns.md` Quick Reference
5. **Present brief for approval** — show to user, let them adjust
6. **Save** to `briefs/{page-name}.md` and proceed to Step 1

**From screenshot:** Analyse layout, count columns, identify cell types (icons, tags, flags, status dots), read text content, map to components.

**From prompt:** Match keywords to layout type, ask for specifics (column names, data examples, CTA text).

**From ClickUp task:** Fetch task, extract requirements, map to layout + columns.

### Step 1: Understand the Brief

Extract from the input:
- **What screens** are needed
- **What layout type** each matches → `page-patterns.md` (LIST-SIMPLE, LIST-TAB, LIST-FULL, FORM, DETAIL, SLIDEIN, DASH, GRID)
- **What components** each needs → `component-catalog.md`
- **What states** matter (default, empty, error, success)
- **What data** to show (realistic FT iGaming content)

Present the plan before building:
```
Screen plan:
1. [Screen name] — Layout: [LIST-SIMPLE/LIST-TAB/LIST-FULL/FORM/DETAIL/SLIDEIN/DASH/GRID]
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

**Priority order — read top-down, stop when you have enough:**

| Priority | File | Location | When to read |
|----------|------|----------|-------------|
| P0 | `briefs/*.md` | Skill-local | **FIRST** — if a brief exists for this page, it has everything |
| P1 | `references/component-ids.md` | Skill-local | **ALWAYS** — IDs, variants, text overrides, gotchas (compact) |
| P1 | `references/code-patterns.md` | Skill-local | **ALWAYS** — proven code snippets for each composition pattern |
| P2 | `references/page-patterns.md` | Repo root | **WHEN NEEDED** — jump to the specific layout type section only |
| P3 | `references/component-catalog.md` | Repo root | **DEEP REFERENCE** — only when component-ids.md doesn't cover it |
| P3 | `references/base-template.md` | Skill-local | **IF STUCK** — full Base Template node tree for debugging |
| P3 | `references/ft-dna-variables.json` | Skill-local | **IF NEEDED** — variable ID map for color/sizing overrides |
