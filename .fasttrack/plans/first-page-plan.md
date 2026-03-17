# Plan: First Page from Design System — Strategy & Execution

> **Created:** 2026-02-18
> **Status:** In Progress
> **Goal:** Build a full page using only design system elements, then scale into a repeatable Figma-to-Vue pipeline.

## Context

We have 7 components built (FTButton, FTCheckbox, FTRadio, FTTag, FTPaging, FTTooltip, FTSideMenu), 839 in Figma (2.4% coverage). The goal is to build a full page using **only** design system elements, then scale that into a repeatable Figma-to-Vue pipeline where Claude generates pixel-perfect composites from rules + components alone.

---

## 1. Your Plan — Honest Assessment

**The plan is sound.** The workflow (Figma template -> analyze -> identify components -> map -> build page) is the right sequence. Three blindspots will block you if not addressed:

### Blindspots

**A. No layout system.** Every component is an island. Nothing describes the 16px gap between two buttons, the sidebar-to-content margin, or the grid that gives a page its skeleton. Designers handle this with Figma auto-layout. The codebase has zero spacing tokens — the ones mentioned in `rules.md` (`--ft-spacing-xs` through `--ft-spacing-2xl`) **don't actually exist** in the token files or generated CSS.

**B. Typography tokens are dead data.** The 17 text styles exist in `typography.tokens.json` but the build script skips complex objects. Only `font-family` and `font-weight` make it to `dist/tokens.css`. Every component hardcodes font sizes: FTButton `12px`, FTCheckbox `14px`, FTPaging `10px/12px`. This violates the "no hardcoded values" rule and means there's no way to compose text consistently across a page.

**C. Existing components have token inconsistencies.**
- FTCheckbox references `--ft-color-neutral-mono-700` — a token that doesn't exist (should be `neutral-gray-700`)
- FTRadio uses raw `--ft-color-brand-pink-400` instead of semantic `--ft-color-primary-base`
- FTTooltip has hardcoded hex values: `#3aaa35`, `#63b6e6`
- FTPaging redefines base tokens inside its own `:root` block

When these components appear together on a page, inconsistent token references produce visual bugs that look like pixel-imperfection but are actually architectural rot.

**D. Code Connect is not set up.** Without it, `get_design_context` returns generic HTML, not `<FTButton primary>`. Code Connect is the key that transforms the Figma MCP from "gives me a screenshot" into "gives me Vue code using my actual components."

### Opportunities

- **Code Connect** is the automation multiplier — once mapped, every future page gets free component recognition
- **Layout primitives** (FTStack, FTContainer) are tiny components (<50 lines each) that unlock page composition
- **Demand-driven building** — we don't need 839 components. ~15-20 unlocks a credible first page. Build what the page needs, not the full inventory

---

## 2. What We Should Create

### Tier 0: Infrastructure Fixes (before any new components)

| Item | What | Why |
|------|------|-----|
| Spacing tokens | Create `tokens/spacing.tokens.json`, update build script | Pages need `--ft-spacing-*` variables |
| Typography utilities | Extend build script to generate `.ft-text-*` CSS classes from the 17 text styles | Consistent text rendering across components |
| Component token audit | Fix FTCheckbox, FTRadio, FTTooltip, FTPaging token references | Prevents visual bugs when composing pages |

### Tier 1: Layout Primitives (the missing layer)

| Component | Purpose | Complexity |
|-----------|---------|------------|
| **FTStack** | Flex container with direction + gap props | ~40 lines |
| **FTContainer** | Max-width wrapper with auto margins | ~30 lines |
| **FTGrid** | CSS Grid layout with columns + gap | ~40 lines |
| **FTDivider** | Horizontal/vertical rule | ~25 lines |

### Tier 2: Content Primitives

| Component | Purpose | Complexity |
|-----------|---------|------------|
| **FTText** | Typography component — `<FTText variant="body-m">` replaces hardcoded font sizes | ~60 lines |
| **FTCard** | Surface container with header/body/footer slots (17 Figma variants exist) | ~80 lines |
| **FTIcon** | Standardized Font Awesome wrapper with size/color props | ~40 lines |

### Tier 3: Page Shell

| Component | Purpose | Complexity |
|-----------|---------|------------|
| **FTSideMenu** (rebuilt) | Scrape current version, rebuild from Figma spec | ~350 lines |
| **FTPageLayout** | Master grid: `56px sidebar \| 1fr content` with slots | ~80 lines |

### Tier 4: Code Connect Mapping

Map every built component to its Figma counterpart using `add_code_connect_map`. This makes the MCP return real component code instead of generic markup.

### After First Page — Next Priority Components

Based on Figma gap analysis, highest-impact additions after the page ships:
1. FTInput (38 variants) — core to every form
2. FTSelect/FTDropdown (71 variants) — core to every form
3. FTTable (25 variants) — most common data display
4. FTModal (3 variants) — any interactive workflow
5. FTTabs (32 variants) — content organization

---

## 3. Execution Plan

### Phase 1: User Shares the Page Template
- User provides the Figma link for the target page
- I pull screenshot + design context via MCP
- Produce a **component dependency tree** — every element on the page mapped to either an existing FT component or a "needs building" gap
- We agree on the final component list before writing code

### Phase 2: Fix the Foundation
- Create spacing tokens + extend build script
- Generate typography utility classes
- Audit and fix the 4 components with token issues
- Verify: `npm run build:tokens && npm run dev`, check each component doc page

**Files touched:**
- `tokens/spacing.tokens.json` (new)
- `scripts/build-tokens.js` (extend)
- `src/components/FTCheckbox/FTCheckbox.vue` (fix tokens)
- `src/components/FTRadio/FTRadio.vue` (fix tokens)
- `src/components/FTTooltip/FTTooltip.vue` (fix tokens)
- `src/components/FTPaging/FTPaging.vue` (fix tokens)

### Phase 3: Build Missing Components
For each component the page needs (from the dependency tree):
1. Pull Figma design context for the component
2. Create Vue SFC following FTButton pattern
3. Create VitePress doc page
4. Register in `docs/.vitepress/theme/index.ts`

Order: Layout primitives first -> content primitives -> page shell -> page-specific components

### Phase 4: Code Connect Mapping
For every built component:
- Call `add_code_connect_map` with Figma node ID + Vue source path
- Verify with `get_code_connect_map` that it returns correct references

### Phase 5: Compose the Page
- Build the page as a VitePress doc page using **only** FT components + tokens
- No hardcoded values, no inline styles, no raw HTML
- Screenshot comparison against Figma — target <4px deviation on any element

### Phase 6: Codify the Pipeline
- Document the Figma-to-Page workflow in `docs/guide/figma-to-page.md`
- Update `CLAUDE.md` with page-level composition rules
- Create page template in `.fasttrack/templates/`

---

## Key Decisions

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| Layout primitives as components or CSS utilities? | **Components** | AI composes from components with typed props, not invisible CSS classes |
| Build all 839 components first? | **No** | ~15-20 components unlocks the first page. Demand-driven, not inventory-driven |
| Port old playbook components? | **No** | Build fresh following the FTButton pattern. Old code follows different conventions |
| FTPageLayout as a component? | **Yes** | Without it, every page re-implements the grid differently. The AI needs a structural component to produce consistent pages |

---

## Verification Strategy

1. **Per-component:** Each new component verified in its VitePress doc page
2. **Composition:** "Layout Playground" doc page composing all primitives together
3. **Page-level:** Side-by-side screenshot comparison against Figma export
4. **Automation:** After Code Connect, verify `get_design_context` returns real FT component code
