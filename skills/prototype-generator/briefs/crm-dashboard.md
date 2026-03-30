# Page Brief: CRM Dashboard

> Layout: DASH
> Inventory #: 12
> Tier: Cold Verification

## Shell

| Element | Value |
|---|---|
| Side Menu section | CRM |
| Breadcrumb L1 | Dashboard |
| Page title | Dashboard |
| Main CTA | New Activity |

## Content

### DASH layout:

**Tabs:** Active Dashboard (selected), Operations / Planning

**Panel 1: Planned Send-Outs**
- Title: Planned Send-Outs
- Subtitle: Upcoming scheduled communications
- Search: Yes
- Content: Empty state (Placeholder component, Size=M)

**Panel 2: Lifecycles**
- Title: Lifecycles
- Subtitle: — (none)
- Sub-tabs inside panel: All (selected), Deposit, Registration, Login, Inactivity, Custom, Churn, Reactivation
- Table columns:

| # | Header | Width | Cell Type | Sample Data |
|---|---|---|---|---|
| 1 | Name | FILL | Text | "Welcome Journey" |
| 2 | Status | 150px | status circle | green |
| 3 | Trigger | FILL | Text | "Player Registration" |
| 4 | Players | 120px | Text | "1,247" |
| 5 | Origins | 200px | image | — |
| 6 | Actions | 56px | ellipsis | — |

- Sample rows (2):

| Name | Status | Trigger | Players |
|---|---|---|---|
| Welcome Journey | green | Player Registration | 1,247 |
| VIP Retention | green | Deposit Threshold | 892 |

- Display count: "Displaying 1-2 of 2" (simple text, NOT pagination component)

**Panel 3: Ongoing Activities**
- Title: Ongoing Activities
- Subtitle: Currently running campaigns
- Content: Empty state (Placeholder component, Size=M)

## Construction Notes

- DASH is a multi-section compound page — NOT a metrics/chart dashboard
- Top-level tabs same as LIST-TAB pattern: 1700px bar, 32px gap
- 3 panels stacked vertically, 32px spacing
- Panel 2 has sub-tabs INSIDE the panel content (not at page level)
- Display count below table: 12px Regular mono-600 text — NOT pagination component
- Empty states use Placeholder component (`92:49611`)
- No date filter bar in this cold test (complex custom frame, documented but not critical path)

## Clone Source

| Template | Node ID | Customization needed |
|---|---|---|
| — | — | Build from components (no clone available) |
