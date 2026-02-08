# Component Status

This tracks design-to-code parity across the FastTrack design system. The Figma library has **839 components** across 29 sections. The Vue playbook has **20 coded components**. That's a **97.6% gap** we're systematically closing.

## Coded Components <span class="status-badge coded">In Playbook</span>

These components exist in both Figma and the Vue component library (`@fasttrack-solutions/vue-components-lib`).

| Component | Figma | Vue | Prefix | Notes |
|-----------|:-----:|:---:|--------|-------|
| Alert | 7 variants | `FTAlert` | `FT` | Matches |
| Button | 40 variants | `FTButton` | `FT` | Primary, secondary, tertiary, action styles |
| Checkbox | part of Selection (53) | `FTCheckbox` | `FT` | |
| Confirm | - | `FTConfirm` | `FT` | No dedicated Figma section |
| Datepicker | - | `FTDatepicker` | `FT` | No dedicated Figma section |
| Floating Label | part of Input (38) | `FTFloatingLabel` | `FT` | |
| Input | 38 variants | `FTInput` | `FT` | Text, email, password, number types |
| Select | part of Dropdown (54+) | `FTSelect` | `FT` | Maps to Dropdown-base |
| Modal | 3 variants | `FTModal` | `FT` | |
| Navbar | 39 variants | `FTNavbar` | `FT` | |
| Options Selector | - | `FTOptionsSelector` | `FT` | |
| Paging | 6 variants | `FTPaging` | `FT` | Maps to Pagination |
| Panel | 13 variants | `FTPanel` | `FT` | |
| Radio | part of Selection (53) | `FTRadio` | `FT` | |
| Sliding Panel | part of Panel | `FTSlidingPanel` | `FT` | |
| Split View | - | `FTSplitView` | `FT` | |
| Spinner | - | `FTSpinner` | `FT` | No dedicated Figma section |
| Table | 25 variants | `FTTable` | `FT` | |
| Tabs | 32 variants | `FTTabs` | `FT` | |
| Tooltip | 41 variants | `FTTooltip` | `FT` | Maps to Tooltips + Data Balloons |

**Composable:** `useNotification` (Notification composable)

## Figma Only <span class="status-badge figma-only">Not Coded</span>

These Figma sections have **no Vue component counterpart**. They represent the biggest opportunities for closing the gap.

| Figma Section | Variants | Priority | Notes |
|--------------|:--------:|:--------:|-------|
| Flags | 261 | Low | Country flag icons — may not need components |
| Quick Access Items | 76 | High | Frequently used action patterns |
| Tags and Statuses | 49 | **High** | Status indicators, tags, badges |
| Dropdown-base | 54 | Medium | Partially covered by FTSelect |
| Specific Dropdown | 17 | Medium | Specialized dropdown variants |
| Image Picker | 40 | Medium | Image selection component |
| Cards | 17 | **High** | Common layout pattern, missing from lib |
| Toggles for Modal | 12 | Medium | Toggle switches |
| Placeholders | 6 | Low | Skeleton/loading states |
| Smaller Components | 10 | Low | Miscellaneous utilities |

## Priority Backlog

Based on usage frequency and design-code drift impact:

### P0 — Close immediately
1. **Tags & Statuses** (49 Figma variants) — Used everywhere, no coded equivalent
2. **Cards** (17 Figma variants) — Core layout primitive
3. **Quick Access Items** (76 variants) — High-usage action patterns

### P1 — Next sprint
4. **Image Picker** (40 variants) — Product-specific but important
5. **Toggles** (12 variants) — Common interactive pattern
6. **Dropdown specializations** (17 variants) — Extend existing FTSelect

### P2 — Backlog
7. **Placeholders/Skeletons** (6 variants) — Nice to have for loading states
8. **Flags** (261 variants) — Consider icon approach instead of components
9. **Smaller Components** (10 variants) — Audit individually

## Gap Metrics

| Metric | Value |
|--------|-------|
| Total Figma components | 839 |
| Total coded components | 20 |
| Coverage | 2.4% |
| Figma sections with no code | 10+ |
| Highest-priority gaps | Tags, Cards, Quick Access |
