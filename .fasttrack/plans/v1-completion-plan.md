# FTDNA v1 Completion Plan

> Goal: Make the system usable by teams — designers can generate prototypes, developers get accurate Vue code, critique catches real issues. All without Miguel in the loop for every request.
> Created: 2026-03-19
> Updated: 2026-03-19 — reordered priorities. Figma accuracy first, Vue second.
> Status: Active

---

## Dependency Chain

```
Platform Scanner (screenshots + structure)
    ↓
Page Composition (accurate Figma pages from real refs)
    ↓  ← THIS IS THE CORE DELIVERABLE. Everything below is downstream.
    ↓
Component Audit (verify Vue matches Figma — uses existing meta.json + prop interfaces)
    ↓
Code Connect (Figma→Vue automatic mapping)
    ↓
End-to-End Pipeline (designer says "build this" → PR with Vue code)
```

If Figma pages aren't accurate, nothing downstream matters. Get the pages right first, then wire them to Vue.

**Key insight (2026-03-19):** The component audit is faster than estimated — vue-components-lib already has 13 meta.json files with Figma mappings and typed prop interfaces. We're cross-referencing, not building from scratch. Likely 3-4 sessions, not 6-8.

---

## Track A: Platform Scanner & Reference Archive

**Why first:** Without real screenshots, every page we build requires manual screenshot sharing. The scanner makes the system self-sufficient.

**What it does:**
- Authenticates into the CRM environment
- Navigates to every page in the inventory (48 pages)
- Takes full-page screenshots at 1920×1080
- Extracts DOM structure (table columns, form fields, nav state)
- Saves to `references/screenshots/` as indexed archive
- Can be re-run on command to refresh

**Deliverables:**
1. Scanner script (Playwright-based) with auth support
2. Screenshot archive (48+ images, organized by inventory number)
3. Structured data per page (columns, field types, component usage)
4. Updated page inventory with screenshot paths

**Depends on:** Miguel sharing the new environment with working auth
**Unblocks:** All page composition work (T1-T5), brief accuracy, reproduction tests
**Effort:** ~2-3 sessions to build + 1 session to run full scan

---

## Track B: Page Composition (continue T1-T5)

**Current state:** 5/48 pages done. T1 (LIST-SIMPLE) complete. T2-T5 not started.

**What changes with scanner:** Each page build starts by loading the reference screenshot instead of manual sharing. Briefs get auto-populated from DOM structure. Verification compares against archived screenshot.

**Remaining work:**

| Tier | Pages | Sessions | Depends on |
|---|---|---|---|
| T2: LIST-TAB + LIST-FULL | 2 | 2 | Scanner (screenshots of Lifecycle Automation, All Activities) |
| T3: FORM + SLIDEIN | 3 | 3 | Scanner + T2 patterns |
| T4: DASH | 2 | 2 | Scanner + T3 patterns |
| T5: DETAIL + GRID + one-offs | 3 | 3 | Scanner + T4 patterns |

**Deliverables per tier:** Figma pages, updated briefs, new code patterns, reproduction tests
**Total remaining:** ~10 sessions

---

## Track C: Component Audit ✅ COMPLETE (2026-03-26)

**Approach:** Populated all 22 Figma-mapped `meta.json` files in vue-components-lib with variant axes, boolean props, propMap rules, and unmapped gap lists. Created `component-meta.schema.json` as the validation schema. Built `scripts/parity-report.js` for on-demand drift reporting.

**Deliverables:**
- 22 populated `meta.json` files (variants, propMap, unmapped) in vue-components-lib
- `tokens/component-meta.schema.json` — JSON Schema for meta.json validation
- `scripts/parity-report.js` — parity report script (`npm run audit:parity`)
- `inventory/parity-report.json` — machine-readable report output

**Results (first run):**
- 22 Figma-mapped, 9 code-only, 20 populated, 2 empty stubs
- 50 Figma-only gaps, 133 Vue-only gaps across all components
- Top coverage: FTCheckbox, FTRadio, FTToggle, FTTooltip (100%)
- Lowest coverage: FTSideMenu (0%), FTBreadcrumb/FTModal/FTSpinner (17%)

**Effort:** ~2 sessions (down from estimated 3-4)
**Unblocks:** Code Connect (Track D), Vue-lib cleanup (Track F)

---

## Track D: Code Connect Setup

**Why:** Currently `get_design_context` returns generic HTML. After Code Connect, it returns `<FTButton primary>` — making Figma→Vue translation automatic.

**Process:**
1. For each of the 13 mapped components (in CLAUDE.md):
   - Get the Figma node ID
   - Get the Vue component source path
   - Call `add_code_connect_map` to register the mapping
2. Test with `get_design_context` — verify it returns real component code
3. Test with `get_code_connect_suggestions` for unmapped components

**Deliverables:**
- 13 Code Connect mappings registered
- Verified with test calls
- Updated CLAUDE.md with mapping status

**Effort:** 1-2 sessions
**Depends on:** Component audit (at least critical components audited first)
**Unblocks:** End-to-end pipeline

---

## Track E: Design Critique Refresh

**Why:** The design-system.md reference is stale (says 7 colors, 0 text styles, 0 components). Critique can't catch real issues with wrong reference data.

**What to update:**
- Colors: 67 (13 families, not 7)
- Typography: 17 text styles (not 0)
- Components: 52 local in FT DNA (not 0, not DSP-Master)
- Spacing: 8 values (didn't exist before)
- File reference: FT DNA `7J3dSTuOSRlsHBqQ4ohtxI` (not DSP-Master)

**Effort:** 1 session
**Depends on:** Nothing (can run in parallel)
**Unblocks:** Reliable design critiques

---

## Track F: Vue-Components-Lib Cleanup

**Why:** 50+ uncommitted files, 7 components without tests/docs, branch is `docs/design-system-pages` not main.

**What to do:**
1. Review and commit the 50+ untracked files (or discard if stale)
2. Add tests for 7 untested components (Breadcrumb, Header, Logo, PageLayout, SideMenu, Tag, Toggle)
3. Add VitePress docs for same 7 components
4. Merge design-system-pages branch to main
5. Version bump and publish

**Effort:** 3-4 sessions
**Depends on:** Component audit (to know what's correct before writing tests)
**Unblocks:** Clean starting point for any new component work

---

## Track G: Documentation Consolidation

**Why:** Info is scattered across CLAUDE.md, rules.md, component-catalog.md, gap-analysis.md, session memory. No single "how to use this system" guide.

**What to create:**
1. Fix broken internal links (SKILL.md → reference files)
2. Update stale references (CLAUDE.md node IDs vs catalog IDs)
3. Write "Getting Started" guide: how to invoke each skill, what each produces
4. Write "Adding a Component" guide: end-to-end from Figma → Vue → PR

**Effort:** 2 sessions
**Depends on:** Tracks C+D complete (so docs reflect reality)
**Unblocks:** Team onboarding

---

## Execution Sequence

### Phase 1: Get Real References (weeks 1-2)
- **Track A:** Build platform scanner (when Miguel shares new environment)
- **Track E:** Refresh design-critique refs (1 session, quick win, parallel)
- Continue manual page composition with pasted screenshots until scanner is ready

### Phase 2: Figma Page Velocity (weeks 2-5) ← CORE PRIORITY
- **Track B:** Page composition T2-T5 (using scanner screenshots)
- Goal: all 8 layout types verified, 13+ representative pages composed
- Each page feeds patterns back into the skill, making the next one faster

### Phase 3: Vue Bridge (weeks 5-7)
- **Track C:** Component audit (cross-reference meta.json + Vue props vs Figma variants, ~3-4 sessions)
- **Track D:** Code Connect setup (1-2 sessions, after audit)
- **Track F:** Vue-lib cleanup (tests, docs, merge)

### Phase 4: Polish (week 7-8)
- **Track G:** Documentation consolidation
- End-to-end pipeline test: Figma URL → Vue PR
- Reproduction tests for all page types

---

## Total Effort Estimate

| Track | Sessions | Priority |
|---|---|---|
| A: Platform Scanner | 3-4 | P1 (unblocks B) |
| B: Page Composition (remaining) | 10 | P1 (core deliverable) |
| C: Component Audit | ~~3-4~~ 2 ✅ | P2 — COMPLETE (2026-03-26) |
| D: Code Connect | 1-2 | P2 (after C) |
| E: Design Critique Refresh | 1 | P1 (quick win) |
| F: Vue-Lib Cleanup | 3-4 | P2 (after C) |
| G: Documentation | 2 | P3 (after D, F) |
| **Total** | **~21-25 sessions** | |

---

## v1 Definition of Done

- [ ] Platform scanner captures all 48 pages with screenshots
- [ ] All 8 core layout types have verified Figma compositions
- [ ] 13 pages composed (representative set covering all types)
- [ ] Top 10 components audited with variant matrices
- [ ] Code Connect maps 13 components to Vue source
- [ ] Design critique uses current token/component data
- [ ] Vue-components-lib: all components have tests + docs
- [ ] "Getting Started" and "Adding a Component" guides written
- [ ] 1 successful end-to-end pipeline test (Figma URL → Vue PR)
