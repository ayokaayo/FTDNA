# First Page Build — Progress Tracker

> **Last updated:** 2026-02-18
> **Plan:** `.fasttrack/plans/first-page-plan.md`
> **Overall status:** Phase 5 IN PROGRESS — Page composed, awaiting visual verification

---

## Phase 1: Page Template Analysis ✅
- [x] User shares Figma page template link
- [x] Screenshot + design context pulled
- [x] Component dependency tree produced
- [x] Final component list agreed

## Phase 2: Fix the Foundation ✅
- [x] Create `tokens/spacing.tokens.json` — 8 spacing values (2xs through 3xl)
- [x] Extend `scripts/build-tokens.js` for spacing tokens — generates `--ft-spacing-*` CSS vars
- [x] Extend `scripts/build-tokens.js` for typography CSS utility classes — 17 `.ft-text-*` classes
- [x] Fix FTCheckbox — `neutral-mono-700` → `neutral-gray-700`, font-family → token reference
- [x] Fix FTRadio — `brand-pink-400` → `primary-base`, `neutral-gray-500` → `border-strong`
- [x] Fix FTTooltip — all 5 hex values → semantic/brand token refs, font-family → token reference
- [x] Fix FTPaging — removed 5 redefined base tokens, all refs → semantic tokens
- [x] Verify: `npm run build:tokens` succeeds (176 tokens, up from 158)
- [x] Verify: `npm run build:docs` succeeds — clean build, no regressions

## Phase 3: Build Missing Components ✅

### Page-Specific Components (demand-driven from template)
- [x] FTToggle (Vue SFC + docs + theme registration + sidebar nav)
- [x] FTBreadcrumb (Vue SFC + docs + theme registration + sidebar nav)
- [x] FTPanel (Vue SFC + docs + theme registration + sidebar nav)
- [x] FTHeader (Vue SFC + docs + theme registration + sidebar nav)
- [x] FTSideMenu (existing component registered in VitePress theme + sidebar nav)
- [x] FTPageLayout (Vue SFC + docs + theme registration + sidebar nav)

### Tier 1-2 Layout/Content Primitives (deferred — not needed for first page)
- [ ] FTStack, FTContainer, FTGrid, FTDivider, FTText, FTCard, FTIcon

## Phase 4: Code Connect Mapping (deferred — post first page)
- [ ] Map all built components to Figma counterparts

## Phase 5: Compose the Page
- [x] Page built using only FT components + tokens — `docs/pages/template.md`
- [ ] Screenshot comparison against Figma
- [ ] Deviation < 4px confirmed

## Phase 6: Codify the Pipeline
- [ ] `docs/guide/figma-to-page.md` written
- [ ] `CLAUDE.md` updated with page-level rules
- [ ] `.fasttrack/templates/page.vue.template` created

---

## Session Notes

### Session 1 — 2026-02-18
- Explored full codebase: 7 components, 839 in Figma, 2.4% coverage
- Identified 4 blindspots: no layout system, dead typography tokens, token inconsistencies, no Code Connect
- Created strategic plan with 6 phases
- Figma sandbox page (0:1 in file `7J3dSTuOSRlsHBqQ4ohtxI`) confirmed empty and ready as workbench
- Dev server running at http://localhost:5173/FTDNA/
- Figma MCP connected

### Session 1 (continued) — 2026-02-18
- **Phase 2 completed:**
  - Created `tokens/spacing.tokens.json` with 8 spacing values (2px–64px)
  - Extended build script: now generates `--ft-spacing-*` CSS vars + 17 `.ft-text-*` utility classes
  - Fixed 4 components (FTCheckbox, FTRadio, FTTooltip, FTPaging) — all now use semantic tokens
  - Token count: 158 → 176 (+18 spacing + typography)

### Session 2 — 2026-02-18
- **Phase 3 completed — all 6 page components built:**
  - FTToggle ✅ — FA toggle icons, v-model, disabled, justified
  - FTBreadcrumb ✅ — smart ellipsis, tags, dropdown indicators
  - FTPanel ✅ — white surface with header (title/description/info) + actions slot + content
  - FTHeader ✅ — 50px bar, breadcrumb slot (left) + actions slot (right)
  - FTSideMenu ✅ — already existed, registered in VitePress
  - FTPageLayout ✅ — CSS Grid: sidebar 56px + header 50px + content area
- All 6 components registered in VitePress theme + sidebar nav
- All builds pass clean: `build:docs` ✅
- **13 components now registered in VitePress** (FTButton, FTTag, FTCheckbox, FTRadio, FTTooltip, FTPaging, FTToggle, FTBreadcrumb, FTPanel, FTHeader, FTSideMenu, FTPageLayout)
- **Next step:** Phase 5 — compose the full page using all FT components
