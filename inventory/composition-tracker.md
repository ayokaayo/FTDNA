# Composition Progress Tracker

> Tracks page generation progress: which pages are built, which patterns are codified, reproduction test results.
> Updated after every page build session.
> Last updated: 2026-03-18

---

## Summary

| Metric | Value |
|---|---|
| Pages composed | 9 / 48 |
| Layout types verified | 0 / 8 |
| Code patterns proven | 15 / 18 |
| Reproduction tests passed | 0 |

---

## Layout Type Coverage

| Layout | Code | Pages in platform | Pages composed | Verified? | Patterns codified? |
|---|---|---|---|---|---|
| Simple List | `LIST-SIMPLE` | ~14 | 3 | No | Partial |
| List + Tabs | `LIST-TAB` | 3 | 3 | No | Yes |
| List + Tabs + Toolbar | `LIST-FULL` | 2 | 0 | No | No |
| Settings Form | `FORM` | ~4 | 3 | No | Yes |
| Dashboard | `DASH` | 5 | 0 | No | No |
| Detail Page | `DETAIL` | ~5 | 0 | No | No |
| Slide-In | `SLIDEIN` | ~8 | 0 | No | No |
| Grid | `GRID` | ~2 | 0 | No | No |

**Verified** = a fresh Claude session can reproduce the page cold from a brief.
**Patterns codified** = composition rules written back into page-patterns.md + code-patterns.md.

---

## Page Composition Log

| # | Page | Layout | Tier | Status | Brief? | Repro? | Notes |
|---|---|---|---|---|---|---|---|
| — | Activity Settings (V1) | FORM | pre-T0 | Built (primitives) | No | No | First attempt, manual frames |
| — | Broadcast Settings (V2) | FORM | pre-T0 | Built (hybrid) | No | No | Real components, proved bootstrap pattern |
| 1 | Communication Profiles | LIST-SIMPLE | T1 | Done | Yes | Pending | Figma `134:78852`. Breadcrumb/1, info+CTA header, green dots, flags, hyperlink URL col. Manual polish by Miguel. |
| 2 | Triggers | LIST-SIMPLE | T1 | Done | Yes | Pending | Figma `134:89784`. Breadcrumb/1 left-aligned, no CTA. Search input (HUG) in panel header. Panel 1700px FIXED. Gray content area (32px pad). 4 cols (Id↓/Name/Event/Activities), zebra striping, red "x" for zero activities. Manual polish: Miguel fixed search HUG + panel width. |
| 3 | Manage Action Types | LIST-SIMPLE | T1 | Done | Yes | Pending | Figma `134:92934`. Breadcrumb/1 left-aligned, no CTA. Search (HUG). Panel 1700px. 5 cols (Preview icons/Id/Name/Notification Type/Enabled ✓/x). Colored circle icons in Preview. No subtitle in panel header. |
| 4 | CRM Segments | LIST-TAB | T2 | Done | No | — | Figma Sandbox. Tabs, no-subtitle panel, search, alert banner (instance), red "x" indicators, zebra. |
| 5 | Settings Localisation | FORM | T2 | Done | No | — | Figma Sandbox. Multi-panel (3), dropdowns half-width + info icon, blue "SYSTEM DEFAULT" tags, radio buttons, toggles. |
| 6 | Lifecycle Automation | LIST-TAB | T2 | Done | No | — | Figma Sandbox. 8 tabs, filter tags (IN DEV/QA/READY/PROD), leading icon overrides (arrows-spin, circle, bolt, clock, users), status circle+text pattern. |
| 7 | Activities & Projects | LIST-TAB | T2 | Done | No | — | Figma Sandbox. Overview tab, 3 panels with empty state Placeholder components (Size=M). |
| 8 | All Activities | LIST-FULL | T3 | Not started | — | — | Full complexity list |
| 9 | Integration Settings | FORM | T3 | Not started | — | — | Multi-panel form |
| 7 | Activity Create/Edit LVL1 | SLIDEIN | T3 | Not started | — | — | Slide-in overlay |
| 8 | Activity Nested Edit LVL2 | SLIDEIN | T3 | Not started | — | — | Nested slide-in |
| 9 | CRM Dashboard | DASH | T4 | Not started | — | — | Landing page |
| 10 | Performance Dashboard | DASH | T4 | Not started | — | — | Validates DASH pattern |
| 11 | Project Detail | DETAIL | T5 | Not started | — | — | Split panel |
| 12 | Email Templates | GRID | T5 | Not started | — | — | Card grid |
| 13 | Oracle Chat | CHAT | T5 | Not started | — | — | One-off stress test |

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
| Filter tags row | No | — | T2 (planned) |
| Icon toolbar strip | No | — | T2 (planned) |
| Multi-panel stacking | No | — | T3 (planned) |
| Slide-in overlay | No | — | T3 (planned) |
| Block Selector grid | No | — | T3 (planned) |
| Metric card row | No | — | T4 (planned) |
| Split-panel layout | No | — | T5 (planned) |
| Card grid | No | — | T5 (planned) |

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
