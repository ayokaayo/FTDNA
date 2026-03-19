# Platform Page Inventory

> Complete mapping of every page in the FastTrack Back-Office (v2.58), classified by layout type.
> Source: Live scrape of https://ux.ft-crm.com/v2/ on 2026-03-18
> Purpose: Drive pixel-perfect Figma page compositions, then coded preview pages.

---

## Navigation Tree (6 top-level sections + 3 utility)

### 1. CRM (icon: chart-line-up)

| # | Sub-section | Page | URL pattern | Layout Type |
|---|------------|------|-------------|-------------|
| 1 | Planning | Dashboard | `/v2/` | Dashboard |
| 2 | Build | Activities & Projects → Overview | `/v2/activity-manager/activities` (tab: Overview) | Dashboard |
| 3 | Build | Activities & Projects → Projects | `/v2/activity-manager/activities` (tab: Projects) | List + Tabs |
| 4 | Build | Activities & Projects → All Activities | `/v2/activity-manager/activities` (tab: All Activities) | List + Tabs + Toolbar |
| 5 | Build | Lifecycle Automation | `/v2/activity-manager/lifecycles` | List |
| 6 | Resources | Projects | `/v2/activity-manager/projects` | List |
| 7 | Resources | QA Portal | `/v2/activity-manager/qa-portal` | List |
| 8 | Resources | Triggers | `/v2/activity-manager/triggers` | Simple List |
| 9 | Resources | Segments | `/v2/activity-manager/segments` | List |
| 10 | Resources | Email Templates | `/v2/activity-manager/email-templates` | Grid / List |
| 11 | Resources | Media Library | `/v2/activity-manager/media-library` | Grid (media) |
| 12 | Resources | Archive | `/v2/activity-manager/archive` | List |
| 13 | Resources | Failed Actions | `/v2/activity-manager/failed-actions` | List |

**Detail / Edit pages (opened from list rows or CTA):**

| # | Page | Trigger | Layout Type |
|---|------|---------|-------------|
| 14 | Activity Detail / Edit | Click row or "New Activity" | Slide-In (LVL 1) |
| 15 | Activity — Nested Edit (Trigger, Segment, Actions) | Click section inside slide-in | Slide-In (LVL 2) |
| 16 | Lifecycle Detail | Click lifecycle row | Slide-In or Detail Page |
| 17 | Project Detail | Click project | Detail Page (split?) |
| 18 | Email Template Editor | Click template | Custom Editor |

### 2. Insights & Analytics (icon: chart-mixed)

| # | Sub-section | Page | Layout Type |
|---|------------|------|-------------|
| 19 | Data Studio | Dashboards | Dashboard (custom) |
| 20 | Data Studio | Explore | Custom (query builder) |
| 21 | Activity Insights | Performance Dashboard | Dashboard |

### 3. Singularity Model (icon: solar-system)

| # | Sub-section | Page | Layout Type |
|---|------------|------|-------------|
| 22 | Overview | Dashboard | Dashboard |
| 23 | Features | Player Features | List |
| 24 | Features | Content Features | List |
| 25 | Content Library | Action Groups | List |
| 26 | Content Library | Collections | List |
| 27 | Content Library | Archive | List |
| 28 | Settings | Feature Types | Settings List |

**Detail pages:**

| # | Page | Layout Type |
|---|------|-------------|
| 29 | Player Feature Detail | Detail / Settings |
| 30 | Content Feature Detail | Detail / Settings |
| 31 | Action Group Detail | Detail Page |
| 32 | Collection Detail | Detail Page |

### 4. Fast Track AI / Oracle (icon: custom)

| # | Page | Layout Type |
|---|------|-------------|
| 33 | Oracle Chat | Chat (unique) |

### 5. Settings (icon: gear)

| # | Page | Layout Type |
|---|------|-------------|
| 34 | Communication Profiles | Simple List |
| 35 | Manage Action Types | Simple List |
| 36 | Manage Trigger Events | Simple List |
| 37 | Manage Segment Fields | Simple List |
| 38 | Integration | Settings Form |
| 39 | Player Origins | Simple List |
| 40 | Manage Unsubscribe Pages | Simple List |
| 41 | AI Settings | Settings Form |
| 42 | Content Variables | Simple List |

### 6. Tools (icon: wrench)

| # | Page | Layout Type |
|---|------|-------------|
| 43 | Localisation | Settings Form |

### 7. Knowledge Base (icon: book-open-cover)

| # | Page | Layout Type |
|---|------|-------------|
| 44 | Start / Getting Started | Docs (unique) |
| 45 | Tutorials | Docs (unique) |
| 46 | Integration Docs | Docs (unique) |

### 8. Global / Shared

| # | Page | Layout Type |
|---|------|-------------|
| 47 | Search (global overlay) | Modal / Overlay |
| 48 | 404 Error | Error (unique) |

---

## Layout Type Taxonomy

**Your bet was right — approximately a dozen unique layouts, rest are remixes.**

### Core Layout Types (8 unique patterns)

| # | Layout Type | Code | Description | Instance Count |
|---|------------|------|-------------|----------------|
| 1 | **Dashboard** | `DASH` | Multi-panel overview with metrics, tables, date filters. Tabs above panels. | 5 pages |
| 2 | **List + Tabs + Toolbar** | `LIST-FULL` | Tabs → icon toolbar strip → panel with search + filter tags + table + pagination. The most complex list. | 2 pages |
| 3 | **List + Tabs** | `LIST-TAB` | Tabs above a panel with table. No toolbar strip. | 3 pages |
| 4 | **Simple List** | `LIST-SIMPLE` | Panel with header + description + optional search + table. No tabs, no toolbar. Most settings pages. | ~14 pages |
| 5 | **Detail Page** | `DETAIL` | Single or split panel (2/3 + 1/3) showing entity info, editable sections, related data. | ~5 pages |
| 6 | **Slide-In** | `SLIDEIN` | 1250px overlay from right with header bar + stacked panels. LVL1 and LVL2 (nested, narrower). Primary create/edit pattern. | ~8 pages |
| 7 | **Settings Form** | `FORM` | Panel with form fields, toggles, dropdowns. Save in header. Single or multi-panel stacked. | ~4 pages |
| 8 | **Grid** | `GRID` | Card-based layout for visual content (email templates, media). | ~2 pages |

### Special / Unique (4 one-offs)

| # | Layout Type | Code | Description | Instance Count |
|---|------------|------|-------------|----------------|
| 9 | **Chat** | `CHAT` | AI Oracle — centered prompt, suggestion pills, full-bleed. | 1 page |
| 10 | **Custom Editor** | `EDITOR` | Email template builder (likely WYSIWYG/drag-drop). | 1 page |
| 11 | **Docs / KB** | `DOCS` | Knowledge base articles with sidebar nav. | 3 pages |
| 12 | **Query Builder** | `EXPLORE` | Data Studio Explore — custom SQL/visual query interface. | 1 page |

### Shared Shell (present on all pages except 404 and KB)

| Element | Component | Notes |
|---------|-----------|-------|
| Side Menu | `FTSideMenu` (collapsed, 56px) | Icons only, flyout on click |
| Page Header | `FTHeader` | Breadcrumb + CTA area |
| Content Area | Container frame | No padding, no fill |

---

## Priority Matrix for Figma Page Compositions

### Phase 1 — High Impact (covers ~70% of platform)

| Priority | Layout | Pages to compose | Why first |
|----------|--------|-----------------|-----------|
| P1 | `LIST-FULL` | All Activities | Most complex, validates all list components |
| P2 | `SLIDEIN` | Activity Create/Edit (LVL1 + LVL2) | Primary user workflow |
| P3 | `DASH` | CRM Dashboard | Landing page, first impression |
| P4 | `LIST-SIMPLE` | Triggers, Communication Profiles | Reused ~14 times across settings |
| P5 | `FORM` | Integration Settings, AI Settings | Settings form pattern |

### Phase 2 — Medium Impact

| Priority | Layout | Pages to compose |
|----------|--------|-----------------|
| P6 | `DETAIL` | Project Detail, Lifecycle Detail |
| P7 | `LIST-TAB` | Lifecycle Automation, Projects |
| P8 | `GRID` | Email Templates, Media Library |

### Phase 3 — Specialized

| Priority | Layout | Pages to compose |
|----------|--------|-----------------|
| P9 | `CHAT` | Oracle |
| P10 | `EDITOR` | Email Template Editor |
| P11 | `DOCS` | Knowledge Base |
| P12 | `EXPLORE` | Data Studio Explore |

---

## Component Requirements per Layout Type

| Layout | Shell | Tabs | Toolbar | Panel | Table | Pagination | Search | Tags | Form Fields | Slide-In Header |
|--------|-------|------|---------|-------|-------|------------|--------|------|-------------|-----------------|
| `DASH` | ✓ | ✓ | — | ✓ multi | ✓ | — | ✓ | — | — | — |
| `LIST-FULL` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| `LIST-TAB` | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — | — | — |
| `LIST-SIMPLE` | ✓ | — | — | ✓ | ✓ | opt | ✓ | — | — | — |
| `DETAIL` | ✓ | — | — | ✓ split | opt | — | — | ✓ | ✓ | — |
| `SLIDEIN` | — | opt | — | ✓ multi | — | — | — | ✓ | ✓ | ✓ |
| `FORM` | ✓ | — | — | ✓ multi | — | — | — | — | ✓ | — |
| `GRID` | ✓ | opt | ✓ | ✓ | — | ✓ | ✓ | — | — | — |

---

## Coverage vs Existing Figma Components

All 8 core layout types can be assembled from existing FT DNA components:

| Required Component | Exists in FT DNA? | Node ID |
|-------------------|-------------------|---------|
| Base Template (Shell) | ✓ | `94:21370` |
| Side Menu | ✓ | `3057:11430` |
| Header | ✓ | `3054:5706` |
| Standard Panel | ✓ | `3780:6892` |
| Table (Header + Rows) | ✓ | `3057:11643` |
| Tabs | ✓ | `91:19098` |
| Input Fields | ✓ | `91:6537` |
| Toggle | ✓ | `91:8647` |
| Button | ✓ | `2244:3840` |
| Tag | ✓ | `2837:5802` |
| Paging | ✓ | `2838:5840` |
| Tooltip | ✓ | `2838:5860` |
| Alert | ✓ | `92:40484` |
| Modal | ✓ | `92:40595` |
| Slide-In Header | ✓ | custom (exists on Workbench) |
| Breadcrumb | ✓ | `3052:3870` |

**Gaps: None blocking.** All layout types can be composed with existing components.
The only net-new work is the assembly — combining these components into full page frames.

---

## Next Steps

1. **Build 5 Figma page frames** (Phase 1) using real component instances from Workbench
2. **Validate** each composition against live platform screenshots
3. **Extract URL patterns** for remaining pages (click-through audit)
4. **Create coded preview** — Vue page shells importing real vue-lib components
5. **Token cascade test** — change a token, verify visual propagation across all pages
