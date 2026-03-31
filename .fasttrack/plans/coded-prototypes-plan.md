# Coded Prototypes — Cloudflare Pages Plan

> Goal: Generate interactive browser-based prototypes using real FT component library, deployed as shareable Cloudflare Pages URLs (login-protected). Figma shifts to component creation only; page composition moves to code.
> Created: 2026-03-31
> Updated: 2026-03-31 — Simplified: prototypes live in backoffice-v2 on a dedicated branch. Existing CF Pages infra handles everything.
> Status: Active

---

## Context

The FastTrack platform frontend (`backoffice-v2`) is a Vue 3 + Vite 5 app that consumes `@fasttrack-solutions/vue-components-lib` (35 globally-registered FT* components). **The team already uses Cloudflare Pages for branch preview deploys** — every branch pushed to GitHub auto-builds and gets a preview URL (`https://{branch}.backoffice-v2.pages.dev`). All previews are behind CRM login (CF Access).

Instead of building a separate prototype app, **we add prototype pages directly to backoffice-v2 on a long-lived branch**. This gives us the full platform shell (sidebar, header, auth, routing, components, styles, tokens) for free.

## Architecture Decision Record

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Repo | backoffice-v2, dedicated `prototype/pages` branch | All infra exists — components, router, auth, CF Pages, CI. Zero setup. |
| CF Pages | Existing backoffice-v2 project | Push branch → auto-build → `https://prototype-pages.backoffice-v2.pages.dev`. No new project needed. |
| Deploy method | `git push` | CF Pages auto-builds from branch. Team-familiar pattern. |
| Auth | CRM login (existing CF Access) | Prototypes behind same auth as all previews. Team has credentials. |
| Page location | `src/components/pages/Prototypes/` | Isolated directory, won't pollute real pages. |
| Routes | `/prototype/*` prefix | No collision with real routes. Easy to identify. |
| Mock data | Static JSON fixtures in `src/mocks/prototypes/` | Import directly — no API calls. Auto-generated from FTDNA scan data. |
| Branch lifecycle | Long-lived, never merges to develop/master | Parallel track. PR stays open as prototype catalog. Rebased periodically. |
| Visual validation | Claude reads own code + Playwright screenshots on demand | Code-first iteration, visual QA when needed. |

## Stress Test Summary (revised)

| # | Risk | Severity | Resolution |
|---|------|----------|------------|
| 1 | FA Pro icons | None | Already working in backoffice-v2 — same build |
| 2 | GitHub Packages auth | None | backoffice-v2 CI already handles this |
| 3 | CF Pages setup | None | Already connected — just push a branch |
| 4 | Route collisions with real app | Low | `/prototype/*` prefix isolates everything |
| 5 | Branch drift from develop | Medium | Periodic rebase from develop to pick up component lib updates |
| 6 | Auth requirement for sharing | Low | Audience is internal team — all have CRM credentials |
| 7 | Mock data realism | Medium | Auto-generate from FTDNA scan-manifest + screenshots |
| 8 | Claude working across repos | Low | Read context from FTDNA, write code to backoffice-v2 |
| 9 | Prototype code leaking to prod | Low | Branch never merges. PR labeled clearly. |
| 10 | Router guard / permission conflicts | Low | Prototype routes skip permission guards or use a catch-all permission |

**No showstoppers. Most risks from the original plan are eliminated by using existing infrastructure.**

---

## Implementation Phases

### Phase 0 — Branch setup + smoke test (gate)

1. Create `prototype/pages` branch from `develop` in backoffice-v2
2. Add `src/components/pages/Prototypes/` directory
3. Create a `Smoke.vue` page with FTButton, FTIcon, FTInput, FTAlert, FTTable
4. Add `/prototype/smoke` route to router (no permission guard)
5. Push branch → CF Pages auto-builds
6. Open `https://prototype-pages.backoffice-v2.pages.dev` → login → navigate to `/prototype/smoke`
7. If all components render: Phase 0 passes

**Gate:** FT components render on a CF Pages preview URL at `/prototype/smoke`.

**PASSED 2026-03-31.** Branch: `feature/DEV-0000-FTDNA-prototypes`. URL: `https://feature-dev-0000-ftdna-proto.backoffice-v2.pages.dev/prototype/smoke`. Key findings:
- `STATIC_PATH` is empty on CF Pages (routes at `/prototype/*`, not `/v2/prototype/*`)
- `_redirects` file needed for SPA fallback (added to `static/`)
- Branch name must match `feature/DEV-*` pattern for CF Pages to build
- CF Pages truncates subdomain names (~30 chars)

### Phase 1 — Prototype infrastructure in backoffice-v2

1. Create router section for `/prototype/*` routes (bypasses permission/feature-flag guards)
2. Set up `src/mocks/prototypes/` directory for fixture data
3. Create a `PrototypeIndex.vue` page at `/prototype/` listing all available prototypes
4. Create a shared `usePrototypeData(pageName)` composable for loading fixtures
5. Create a `PrototypeLayout.vue` wrapper (optional — may reuse existing Layout)
6. Push → verify on CF Pages

**Deliverable:** Prototype routing infrastructure ready for pages.

### Phase 2 — Mock data pipeline

1. In FTDNA: create `scripts/generate-prototype-fixtures.js`
2. Read `inventory/scan-manifest.json` — extract per-page structure (columns, row counts, entity types)
3. Claude analyzes screenshots + scan data → generates realistic fixture JSON
4. Output fixtures to `backoffice-v2/src/mocks/prototypes/<page-name>.json`
5. Test: import fixture in smoke page, render in FTTable

**Deliverable:** Fixture files for 5 pilot pages with realistic data.

### Phase 3 — First 5 prototype pages

Pick 5 representative pages across layout types:
- 1 LIST-SIMPLE (e.g., Segments)
- 1 LIST-TAB (e.g., Activities)
- 1 FORM (e.g., Edit Level System)
- 1 GRID (e.g., Bonuses Index)
- 1 DASH (e.g., Dashboard)

For each:
1. Read FTDNA scan data + screenshot for the page
2. Generate Vue component in `src/components/pages/Prototypes/`
3. Wire route at `/prototype/<page-name>`
4. Import fixture data (no API calls)
5. Push → verify on CF Pages → visual comparison with CRM screenshot

**Deliverable:** 5 interactive prototype pages on a live CF Pages URL.

### Phase 4 — Iteration workflow

1. Test full Claude loop: read FTDNA context → generate page in backoffice-v2 → push → verify URL
2. Add Playwright screenshot script for prototype pages (adapt existing snap.js)
3. Document the cross-repo workflow in FTDNA CLAUDE.md
4. Create PR for the branch (stays open — becomes the prototype catalog)

**Deliverable:** Documented workflow. Claude can iterate end-to-end.

### Phase 5 — Prototype index + team sharing

1. Polish `PrototypeIndex.vue` — list all prototypes with name, layout type, date, comparison links
2. Share the PR + preview URL with the team
3. Add prototype URLs to FTDNA `inventory/composition-tracker.md`

**Deliverable:** Team can browse all prototypes from one URL.

### Phase 6 — FTDNA workflow integration

1. Update FTDNA CLAUDE.md session menu with "Coded prototype" option
2. Update composition skills to generate Vue pages (backoffice-v2) alongside/instead of Figma frames
3. Add memory entries for cross-repo workflow patterns

**Deliverable:** Prototypes integrated into standard FTDNA workflow.

## Phase Dependencies

```
Phase 0 (smoke test) ──→ Phase 1 (infrastructure) ──→ Phase 2 (mock data) ──→ Phase 3 (first pages)
                                                                                      │
                                                                                      ├──→ Phase 4 (iteration workflow)
                                                                                      └──→ Phase 5 (index + sharing)
                                                                                                 │
                                                                                                 └──→ Phase 6 (FTDNA integration)
```

## Key References

- **backoffice-v2:** `/Users/miguelangelo/Code/backoffice-v2`
- **vue-components-lib:** `/Users/miguelangelo/Code/vue-components-lib` (v3.13.0)
- **CF Pages URL pattern:** `https://prototype-pages.backoffice-v2.pages.dev`
- **Boot setup:** `backoffice-v2/src/boot.js` (lines 46-83)
- **Router:** `backoffice-v2/src/router/index.js`
- **Scan manifest:** `FTDNA/inventory/scan-manifest.json`
- **FTDNA plan:** `.fasttrack/plans/coded-prototypes-plan.md` (this file)

## What Changed from v1 Plan

| Aspect | v1 (standalone app) | v2 (backoffice-v2 branch) |
|--------|--------------------|-----------------------------|
| Setup | New Vite app + CF project + wrangler | Branch + push |
| Components | Reinstall lib + peer deps | Already registered |
| Auth | Public (needed CF Access later) | CRM login (existing) |
| Deploy | `wrangler pages deploy` | `git push` |
| Shell/layout | Build from scratch | Existing sidebar + header |
| Blocking on | CF account creation | Nothing |
