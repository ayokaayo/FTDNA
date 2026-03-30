# Page Brief: All Activities

> Layout: LIST-FULL
> Tier: T3 (cold test)

## Shell

| Element | Value |
|---|---|
| Side Menu section | CRM |
| Breadcrumb L1 | All Activities |
| Breadcrumb style | Single level (Nav/1) |
| Page title | All Activities |
| Main CTA | Create Activity |

## Content

**Tabs (outside panel):**
1. Overview (Default)
2. Projects (Default)
3. **All Activities** (Selected)

**Icon toolbar:** 5 icons — `sliders`, `table-columns`, `arrow-down-to-bracket`, `chart-simple`, `ellipsis`

**Panel title:** All Activities
**Panel subtitle:** —
**Search:** Yes (panel header built-in)
**Filter tags:** ACTIVE (green), ENDED (gray), DISABLED (gray), SCHEDULED (gray)

**Columns:**

| # | Header | Width | Cell Type | Sample Data |
|---|---|---|---|---|
| 1 | Name | 760px | Text+leading icon | "Welcome Bonus Campaign" (icon: circle-play) |
| 2 | Status | 200px | Status circle | Green/Gray/Blue dots |
| 3 | Trigger | 240px | Text | "Player Registration" |
| 4 | Players | 200px | Text | "1,247" |
| 5 | Origins | 184px | Image | Avatar circles |
| 6 | — | 52px | Ellipsis | Kebab menu |

**Sample rows (8):**

| Name | Status | Trigger | Players | Origins |
|---|---|---|---|---|
| Welcome Bonus Campaign | 🟢 | Player Registration | 1,247 | — |
| VIP Retention Flow | 🟢 | Deposit Threshold | 892 | — |
| Weekend Promotion | 🔵 | Scheduled Date | 3,450 | — |
| Churn Prevention | 🟢 | Inactivity Timer | 567 | — |
| First Deposit Bonus | ⚫ | First Deposit | 2,100 | — |
| Loyalty Points Reward | 🟢 | Points Milestone | 1,890 | — |
| Re-engagement SMS | ⚫ | Dormancy Flag | 445 | — |
| Seasonal Welcome | 🔵 | Manual Trigger | 780 | — |

**Pagination:** Yes — "1-8 of 42 | 6 items per page"

## Construction Notes

- Toolbar sits between tabs and main panel (separate Standard Panel, no Panel Header)
- Filter tags are Tag instances (Small, Icon-solid) inside Panel Header
- Status circle colors: green = active, gray = disabled, blue = scheduled
