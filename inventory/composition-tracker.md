# Composition Progress Tracker

> Tracks page generation progress: which pages are built, which patterns are codified, reproduction test results.
> Updated after every page build session.
> Last updated: 2026-03-30

---

## Summary

| Metric | Value |
|---|---|
| Pages composed | 24 / 48 (+ 3 blocked) |
| Layout types verified | 8 / 8 (all PASS) |
| Code patterns proven | 19 / 23 |
| Reproduction tests passed | 8 / 8 |

---

## Layout Type Coverage

| Layout | Code | Pages in platform | Pages composed | Verified? | Patterns codified? |
|---|---|---|---|---|---|
| Simple List | `LIST-SIMPLE` | ~14 | 4 | **PASS** (2026-03-30) | Yes |
| List + Tabs | `LIST-TAB` | 3 | 3 | **PASS** (2026-03-30) | Yes |
| List + Tabs + Toolbar | `LIST-FULL` | 2 | 1 | **PASS** (2026-03-30) | Yes |
| Settings Form | `FORM` | ~4 | 3 | **PASS** (2026-03-30) | Yes |
| Dashboard | `DASH` | 5 | 1 | **PASS** (2026-03-30) | Yes |
| Detail Page | `DETAIL` | ~5 | 0 (1 mapped) | No | Partial |
| Slide-In | `SLIDEIN` | ~8 | 2 | **PASS** (2026-03-30) | Yes |
| Hub | `HUB` | ~1 | 1 | **PASS** (2026-03-30) | Yes |
| Grid / Nested | `GRID` / `LIST-NESTED` | ~2 | 1 | **PASS** (2026-03-30) | Yes |

**Verified** = a fresh Claude session can reproduce the page cold from a brief.
**Patterns codified** = composition rules written back into page-patterns.md + code-patterns.md.

---

## Page Composition Log

| # | Page | Layout | Tier | Status | Brief? | Repro? | Notes |
|---|---|---|---|---|---|---|---|
| — | Activity Settings (V1) | FORM | pre-T0 | Built (primitives) | No | No | First attempt, manual frames |
| — | Broadcast Settings (V2) | FORM | pre-T0 | Built (hybrid) | No | No | Real components, proved bootstrap pattern |
| 1 | Communication Profiles | LIST-SIMPLE | T1 | Done | Yes | PASS | Figma `134:78852`. Repro `238:100183`. Flags solo + green status circles + blue hyperlink URLs. Fixed: single flags, hyperlink color, left-aligned header. |
| 2 | Triggers | LIST-SIMPLE | T1 | Done | Yes | PASS | Figma `134:89784`. Repro `238:101632`. Nav/1, "Add Trigger" CTA, search, sort on Id, red xmarks, 13 rows. Fixed: header alignment + CTA. |
| 3 | Manage Action Types | LIST-SIMPLE | T1 | Done | Yes | PASS | Figma `134:92934`. Repro `238:102764`. Nav/1, "Add Action Type" CTA, search, action icons solo (colored circles), green/red enabled. Fixed: solo icons + header + CTA. |
| 4 | CRM Segments | LIST-TAB | T2 | Done | No | — | Figma Sandbox. Tabs, no-subtitle panel, search, alert banner (instance), red "x" indicators, zebra. |
| 5 | Settings Localisation | FORM | T2 | Done | No | — | Figma Sandbox. Multi-panel (3), dropdowns half-width + info icon, blue "SYSTEM DEFAULT" tags, radio buttons, toggles. |
| 6 | Lifecycle Automation | LIST-TAB | T2 | Done | No | — | Figma Sandbox. 8 tabs, filter tags (IN DEV/QA/READY/PROD), leading icon overrides (arrows-spin, circle, bolt, clock, users), status circle+text pattern. |
| 7 | Activities & Projects | LIST-TAB | T2 | Done | No | — | Figma Sandbox. Overview tab, 3 panels with empty state Placeholder components (Size=M). |
| 8 | All Activities | LIST-FULL | T3 | Done | No | — | Figma Pastebin `181:77359`. Tabs (3), icon toolbar (5 icons), panel header with search+filter tags (ACTIVE/ENDED/DISABLED/SCHEDULED)+action icons, 8-row table (Name 760/Status 200/Trigger 240/Players 200/Origins 184/Ellipsis 52), image cells for origins, status circle colors (gray/green/blue), pagination. Built from reference `92:55380`. |
| 9 | Integration Settings | HUB | T3 | Done | No | — | Figma Pastebin `190:37671`. Hub/navigation page with 3 white panels (Tools & Guides 3 cards, Migrations Wizard 2 cards + info icons, Greco 1 card). Cards: mono-100, 8px radius, 24px padding, centered icon+title+desc. Proved HUB pattern. |
| 7 | Activity Create/Edit LVL1 | SLIDEIN | T3 | Done | No | — | Figma Pastebin `181:79166`. Full page composite: All Activities bg + blur overlay + 1250px slide-in. 4 sections: Activity Name (input), Type of Activity (SDT/Recurring tabs + trigger/feature inputs), Segment (alert + origin cards + market cards + additional rules), Add Actions (option cards + action block components). Built from reference `92:56151`. |
| 8 | Activity Nested Edit LVL2 (Send Email) | SLIDEIN | T3 | Done | No | — | Figma Pastebin `193:51713`. Full nested composite: All Activities bg + overlay + LVL1 Activity Builder + overlay + LVL2 1125px slide-in. "Send Email" form: template dropdown (required), sender name, email subject (required), checkbox, bordered provider sub-panel (Sendgrid/sender email/IP pool), action scheduling toggle. Content FILL height, top-aligned. |
| 10 | Player Origins | LIST-SIMPLE | Test | Done | No | — | Figma Pastebin `194:60902`. Validation test: new page from screenshot. Nav/1 breadcrumb, search, 2-row table (image cell + text + Id + Origin Key + status circle green + trash icon), simple count. |
| 11 | Exclusion Groups (DEV-14482) | SLIDEIN | Test | Done | No | — | Figma Pastebin `193:59163`. Feature design from ClickUp brief. 3-state component (collapsed/dropdown/selected) integrated into Activity Builder Segment section. Red tags, categorised dropdown, "479 excluded" count. |
| 12 | CRM Dashboard | DASH | T4 | Done | No | — | Figma Pastebin `201:64415`. Multi-section compound page: top-level tabs (Active Dashboard/Operations Planning), date filter bar in header (DASHBOARD/TODAY badges + Last month + date range), 3 panels stacked. Panel 1: Planned Send-Outs (title+subtitle+search+empty state). Panel 2: Lifecycles (8 sub-tabs inside panel + table: Name/Status/Trigger/Players/Origins, 2 rows + display count). Panel 3: Ongoing Activities (title+subtitle+empty state). Proved DASH is actually multi-section LIST-TAB variant, not metric cards. |
| 13 | Performance Dashboard | DASH | T4 | Skipped | — | — | Empty state only ("Haven't setup your personal dashboard yet"). No useful content for composition. |
| 11 | Project Detail | DETAIL | T5 | Not started | — | — | Split panel |
| 14 | Email Templates | LIST-NESTED | T5 | Done | No | — | Figma Pastebin `216:91149`. Cloned from Miguel's reference `180:69323`. 3 tabs (Standard/Content Blocks/Brand Templates), search row, dashed CTA banner ("Add Standard Template"), 4 template sections (Easter/Christmas/Standard/Fast Track AI) each with: title + action icons (+/copy/trash/clock) + count badge + "Used by X" tag, inline table (Status code icon + ACTIVE tag + Version name + Player Origins + dates + eye/copy actions), "Add new version" button, section count. Global count "1-4 of 4". Old bad attempt `204:66515` removed. |
| 15 | Oracle / Fast Track AI | CHAT | T5 | Blocked | — | — | Rough build at `207:69893`. Needs Chat Input Box, Suggestion Pill, AI Disclaimer Banner components — see `component-gap-map.md` #13-14, #18. Cannot be accurately composed until components exist. |
| 16 | Media Library | FILE-BROWSER | T5 | Blocked | — | — | Rough build at `208:70958`. Needs Folder Tree Sidebar, Split Panel Layout, View Toggle components — see `component-gap-map.md` #15-17. Cannot be accurately composed until components exist. |
| 18 | Content Features | LIST-SIMPLE | T5 | Done | Yes | PASS | Figma Pastebin `216:78050`. Breadcrumb/2 (Singularity Model > Content Features), "New Content Feature" CTA. Panel: title+subtitle, table 4 cols (Id 60px/Name FILL/Description FILL/Feature Type 220px), 10 data rows, pagination "10/13, 20 items per page". Clean LIST-SIMPLE built from brief. |
| 19 | Test Users | LIST-SIMPLE | T5 | Done | No | — | Figma Pastebin `216:74917`. Single breadcrumb, "New Test User" CTA. Panel: title+subtitle, table 5 cols (Display Name/Name with Player Id subtitle/Email/Phone/Origin image), 4 rows, pagination. Proves 2-line text cells + image cells. |
| 20 | QA Portal | LIST-FULL | T5 | Done | No | — | Figma Pastebin `216:75956`. No CTA. Two stacked panels: Section 1 "Activities to be Quality Assured" (search, table 5 cols with pen icon in Name cells, 7 rows, pagination), Section 2 "Activities that have been Quality Assured" (empty state). Multi-section LIST-FULL variant. |
| 21 | Player Profile | DETAIL | T5 | Blocked | — | — | Screenshot from other environment (not in scan manifest). Split layout: icon tab cards (4 sections), left Favourites panel (drop zone), right Player info panel (warning alert, collapsible section, 2-col attribute grid). Needs Icon Tab Card (#19), Channel Action Icons (#20), User ID Badge (#21), Collapsible Section Header (#22), Key-Value Attribute Grid (#23), Favourites Drop Zone (#24). |
| 22 | Feature Types | LIST-SIMPLE | T5 | Done | Yes | PASS | Figma Pastebin `216:79179`. Breadcrumb/2 (Singularity Model > Feature Types), "New Feature Type" CTA. Panel: title+subtitle+search, table 3 cols (Id 60px/Name FILL/Classes FILL), 10 rows, pagination "10/19". |
| 23 | Trigger Events | LIST-SIMPLE | T5 | Done | Yes | PASS | Figma Pastebin `216:80023`. Breadcrumb/1 "Trigger Events", "Create Event" CTA. Panel: title+search (no subtitle), table 6 cols (Id/Name/Notification Type/Description/Triggers Count/Enabled), 10 rows, no pagination. |
| 24 | Player Features | LIST-SIMPLE (multi) | T5 | Done | Yes | PASS | Figma Pastebin `216:81175`. Breadcrumb/2 (Singularity Model > Player Features), "New Player Feature" CTA. 2 panels: Panel 1 "Features to Install" (2 cols, 1 row), Panel 2 "Player Features" (4 cols, 7 rows, pagination "7/8"). Proves multi-panel LIST-SIMPLE. |
| 25 | Segment Fields | LIST-TAB | T5 | Done | Yes | PASS | Figma Pastebin `216:83645`. Breadcrumb/1 "Segment Fields", "New Smart Segment" CTA. 3 tabs (Smart Segments/Segment Fields/Calculated). Panel: search, table 5 cols (Status dot/Name/Label/Description/Segments Count), 13 rows. |
| — | **Cold Verification: Content Features** | LIST-SIMPLE | Cold | PASS | Yes | PASS | Cold test of LIST-SIMPLE layout. Fresh session, brief only. Breadcrumb swap to Nav/1 fixed mid-test (all "Level 1" nodes set to same value). |
| — | **Cold Verification: Segment Fields** | LIST-TAB | Cold | PASS | Yes | PASS | Cold test of LIST-TAB layout. Fresh session, brief only. Nav/1 breadcrumb fix validated. |
| — | **Cold Verification: Broadcast Settings** | FORM | Cold | PASS | Yes | PASS | Cold test of FORM layout. New brief written. 3 sections, 2-col layout, toggles. Zero issues on first build. |
| — | **Cold Verification: All Activities** | LIST-FULL | Cold | PASS | Yes | PASS | Cold test of LIST-FULL layout. Figma `367:1085`. New brief written. Tabs + toolbar + search + filter tags + 8 rows + pagination. FA icons placeholder (cloud MCP limitation). All structural elements correct. |
| — | **Cold Verification: Integration Settings** | HUB | Cold | PASS | Yes | PASS | Cold test of HUB layout. Figma `396:544`. 3 panels with nav card rows using Placeholder Size=M (extras disabled). Full-detach bootstrap with children[] index access. Clean: icon + title + desc, no flags/counts. |
| — | **Cold Verification: Content Variables** | GRID | Cold | PASS | Yes | PASS | Cold test of GRID layout. Figma `371:1781`. Wrapping grid (4+2), card text overrides, search, Nav/2 breadcrumb all correct. Same card-markets cosmetic limitation. |
| — | **Cold Verification: CRM Dashboard** | DASH | Cold | PASS | Yes | PASS | Cold test of DASH layout. Figma `372:2097`. Top-level tabs + 3 stacked panels + sub-tabs inside Panel 2 + table + empty states + display count. Predicted high-risk, passed clean. |
| — | **Cold Verification: New Segment** | SLIDEIN | Cold | PASS | Yes | PASS | Cold test of SLIDEIN layout. Figma `404:484`. From-scratch recipe: header `92:46212` + `buildPanel()` + `addInput()`. 4 panels (General, Conditions, Player Origins, Markets). Block Selectors 360px fixed width (3/row), single icon type per panel. Mono-200 bg, white panel cards. |

---

## Code Pattern Coverage

| Pattern | In code-patterns.md? | Proven in page? | Added in Tier |
|---|---|---|---|
| Bootstrap | Yes | Yes (Broadcast Settings) | pre-T0 |
| Shell text override | Yes | Yes | pre-T0 |
| Tabs | Yes | Yes (Segments, Lifecycle) | T2 |
| Table composition | Yes | Yes (Comm. Profiles) | T1 |
| Status tag cells | Yes | Yes (Comm. Profiles) | T1 |
| Form fields | Yes | Yes (Broadcast Settings) | pre-T0 |
| Pagination | Yes | Yes (Comm. Profiles) | T1 |
| Search in Panel Header | Yes | Yes (Comm. Profiles) | T1 |
| Leading icon override | Yes | Yes (Lifecycle) | T2 |
| Status circle + text | Yes | Yes (Lifecycle) | T2 |
| Filter tags row | Yes | Yes (Lifecycle) | T2 |
| Multi-panel stacking | Yes | Yes (Localisation, Activities) | T2 |
| Empty state placeholder | Yes | Yes (Activities) | T2 |
| Dropdown with info icon | Yes | Yes (Localisation) | T2 |
| Radio buttons | Yes | Yes (Localisation) | T2 |
| Toggle switches | Yes | Yes (Localisation) | T2 |
| Alert banner (instance) | Yes | Yes (Segments) | T2 |
| Red text indicators | Yes | Yes (Triggers) | T1 |
| Icon toolbar strip | Yes (`addToolbar`) | Yes (All Activities) | T3 |
| Multi-panel stacking | Yes (`clonePanel`) | Yes (Localisation, Dashboard) | T2 |
| Slide-in overlay | Yes (from-scratch recipe) | Yes (Activity Create, New Segment) | T3 |
| Block Selector grid | No | Yes (Activity Create) | T3 |
| Metric card row | No | — | — (planned) |
| Split-panel layout | No | — | — (planned) |
| Card grid | No | — | — (planned) |

---

## Feedback Loop Checklist (per page)

Use this after every page build:

- [ ] Screenshot completed page
- [ ] Compare against live platform
- [ ] Fix visual issues
- [ ] New code pattern discovered? → Update `code-patterns.md`
- [ ] New composition rule discovered? → Update `page-patterns.md`
- [ ] New component gotcha? → Update `component-ids.md`
- [ ] Write minimal brief → `skills/prototype-generator/briefs/`
- [ ] Reproduction test: fresh session, brief only
- [ ] Update this tracker
