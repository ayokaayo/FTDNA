# Component Gap Map

> Platform UI elements that exist in the live CRM but have NO matching Figma component.
> These need to be created as reusable Figma components to achieve full design parity.
> Last updated: 2026-03-23

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| P1 | Blocks multiple page compositions — create ASAP |
| P2 | Used in 2+ pages or upcoming tier — create when building those pages |
| P3 | Single-use or rare — build as custom frame, componentise later |

---

## Missing Components

| # | Component | Seen On | Current Workaround | Priority | Notes |
|---|-----------|---------|-------------------|----------|-------|
| 1 | **Date Range Filter Bar** | CRM Dashboard header | Not built — skipped | P2 | Inline control: "Last month" dropdown + date range picker. Unique to dashboard pages. Combines dropdown + date picker + label. |
| 2 | **Metric / KPI Card** | DASH pattern (planned) | Custom frame: border + large number + label | P2 | Documented in page-patterns.md Pattern 5 as "custom frames (not a standard component)". Will be needed for Performance Dashboard and any analytics page. |
| 3 | **Icon Toolbar Strip** | All Activities (LIST-FULL) | Dynamic row of `button-btn` icon instances | P1 | Built manually every time: 5+ icon buttons in a horizontal frame. Used in every LIST-FULL page. Should be a component with configurable icon count. |
| 4 | **Filter Tag Bar** | All Activities toolbar | Row of Tag instances in a frame | P2 | Container for active filter tags (ACTIVE/ENDED/DISABLED/SCHEDULED). Tags exist but the bar container with "clear all" isn't a component. |
| 5 | **Hub / Navigation Card** | Integration Settings (HUB) | Custom frame: mono-100, 8px radius, icon + title + desc | P2 | Each card built from scratch. Cards have: centered icon, title, description, 24px padding. Used in HUB pattern pages. |
| 6 | **Bordered Sub-Panel** | Activity Builder SLIDEIN (Send Email) | Custom frame + mono-300 stroke | P2 | Nested section inside slide-ins (e.g. "Sendgrid Provider" panel). White bg, 1px border, internal padding 16-24px. |
| 7 | **Slide-In Header** | All SLIDEIN pages | Custom frame: close X + tag + breadcrumb + action buttons | P1 | Built from scratch on every slide-in. Has: close icon (left), status tag, breadcrumb text, action buttons (right). Consistent pattern across all slide-ins. |
| 8 | **Section Title / Divider** | FORM pages, SLIDEIN forms | Raw text node (16px Inter Bold) | P3 | Simple bold text that separates form sections. Low effort to build inline; componentising adds minimal value. |
| 9 | **Chart Placeholder** | DASH pattern (planned) | Frame + centered label text | P3 | Figma can't render real charts. Placeholder shows chart type label. Only needed for dashboard pages. |
| 10 | **Dropdown Menu (Expanded)** | Any page with dropdowns | Not built — dropdowns shown closed | P3 | The open/expanded state showing the dropdown list. Components exist for list items (`91:10265`, `91:11007`) but not the full overlay container. |
| 11 | **Toast / Notification** | Platform-wide (transient) | Not built | P3 | Success/error toasts after actions. Rarely shown in static compositions. |
| 12 | **Progress Bar / Stepper** | Onboarding flows | Not seen in current pages | P3 | Multi-step progress indicator. May appear in wizard flows. |
| 13 | **Chat Input Box** | Oracle / Fast Track AI (`/v2/oracle`) | Custom frame (attempted `207:69893`) | P2 | Large white rounded input area with: multi-line text area, attachment icon (paperclip), microphone icon, send arrow button. Unlike standard Input Fields — it's a full chat composer, taller and with richer controls. |
| 14 | **Suggestion Pill** | Oracle / Fast Track AI | Custom frame with blue-200 bg + rounded corners | P2 | Horizontal row of clickable suggestion chips below chat input. Each pill: icon + label, blue-200 fill, 20px radius. Used in AI chat landing state. 4 pills: Get started, Data Mining & Analysis, Reporting & Visualisation, Cohorts. |
| 15 | **Folder Tree / File Sidebar** | Media Library (`/v2/media`) | Custom frame (attempted `208:70958`) | P2 | Left sidebar (250px) with: search input, "Recents" selected state (blue-400 bg), Create Folder/Trash actions, folder rows (folder icon + name + count). White bg, separated from content by implicit border. Needs selected/unselected folder states. |
| 16 | **Split Panel Layout** | Media Library | Custom frame | P2 | Horizontal split: fixed-width sidebar (250px) + FILL content area. Not a Standard Panel — no panel header, no padding rules. Content area shows either empty state or image grid depending on selected folder. |
| 17 | **View Toggle (Grid/List)** | Media Library header area | Not built — no component | P3 | Small icon pair (grid dots / list lines) for switching between grid and list views. Seen top-right of Media Library content area. |
| 18 | **AI Disclaimer Banner** | Oracle header | Custom text frame | P3 | Warning banner in header: ⚠ icon + "Review AI Disclaimer" text. Unique to AI/Oracle page. |
| 19 | **Icon Tab Card** | Player Profile (DETAIL) | Partially — Block Selector `91:8712` | P1 | Large tab card with icon above text (e.g. PLAYER INFO, LOGS & TIMELINE, MOVEMENTS, REWARDS). Selected state: pink/purple bg with white icon+text. Unselected: white/transparent, gray. Wider than Block Selector. Also seen in other detail/profile pages. |
| 20 | **Channel Action Icons** | Player Profile header | Not built | P2 | Row of dark-filled circle icon buttons for communication channels (email, SMS, push notification, messenger, phone). Unlike standard `button-btn` Type=icon which has no fill — these are solid dark circles with white icons inside. |
| 21 | **User ID Badge** | Player Profile header | Not built | P2 | Dark pill/badge showing "USER ID 10". Dark bg (#2C2C2C), white text, pill shape. Similar to Tag but inverted colour scheme and no close icon. |
| 22 | **Collapsible Section Header** | Player Profile "Player Features" | Not built | P1 | Expand/collapse control: ▼ arrow icon + bold section title + optional right icon. Controls visibility of content below. Used in attribute grids, form sections, detail views. |
| 23 | **Key-Value Attribute Grid** | Player Profile "Player Features" | Not built | P1 | Two-column definition list: each row has label (left-aligned, regular weight) + value (right-aligned, may be "—" for empty). Rows have subtle dividers. NOT the standard Table component — no header row, no cell types, purely label:value pairs. |
| 24 | **Favourites Drop Zone** | Player Profile left panel | Not built | P3 | Large empty state area (purple/placeholder bg) with "Drop here to add to Favourites" text + checkbox icon. Drag-and-drop target for pinning attributes. |

---

## Missing Variables / Tokens

| # | Variable Type | What's Missing | Current State | Impact |
|---|--------------|----------------|---------------|--------|
| 1 | **Spacing scale** | No Figma spacing variables | Spacing is documented as rules (32px panel gap, 16px content gap, etc.) but not as bound variables | Low — spacing is applied numerically in code, not variable-bound |
| 2 | **Typography styles** | No Figma text style variables | 17 text styles documented in tokens but not created as Figma text styles | Medium — text styles are set manually per text node instead of referencing a shared style |
| 3 | **Border radius tokens** | No radius variables | Hardcoded values (0 for panels, 8px for cards) | Low — only 2-3 values used |
| 4 | **Shadow / Elevation** | No shadow variables | Panels use no shadow; some cards may use subtle elevation | Low — shadows rarely used in FT design |
| 5 | **Opacity values** | No opacity variables | Overlay blur uses fixed opacity | Low — single use case |

---

## Relationship to Existing Components

Components that partially cover gaps but need variants or extensions:

| Existing Component | Gap | What's Needed |
|-------------------|-----|---------------|
| `Date picker with input` (`91:7183`) | Only covers "time span" and "specific date" types | Needs inline/compact variant for dashboard header filters |
| `Tag` (`91:10023`) | Used in filter bars but no "filter bar" container | Need a compound component: horizontal tag row + "Clear all" action |
| `button-btn` (`91:8299`) Type=icon | Used individually in toolbar | Need a toolbar strip component that groups N icon buttons with consistent spacing |
| `Standard Panel` (`92:46583`) | No "bordered sub-panel" variant | Need a lightweight variant: smaller padding, visible border, no panel header |
| `Placeholder` (`92:49611`) | No chart-specific variant | Could add a Size=Chart variant with axis lines placeholder |

---

## Action Plan

**Before accurate CHAT pattern (Oracle):**
- Create Chat Input Box component (#13) — multi-line input with attachment/mic/send
- Create Suggestion Pill component (#14) — or extend Tag component with a "pill" variant

**Before accurate FILE-BROWSER pattern (Media Library):**
- Create Folder Tree Sidebar component (#15) — with selected/unselected folder states
- Create Split Panel Layout variant (#16) — sidebar + content area
- Create View Toggle component (#17)

**Before T4 (DASH pages):**
- Create Metric/KPI Card component (#2) — needed if analytics dashboards are discovered
- Create Date Range Filter Bar (#1) — needed for Dashboard header
- Create Chart Placeholder variant (#9)

**Before T5 (GRID/DETAIL pages):**
- Create Hub/Navigation Card component (#5)
- Create Bordered Sub-Panel variant (#6)

**Ongoing (improve velocity):**
- Create Icon Toolbar Strip component (#3) — saves time on every LIST-FULL page
- Create Slide-In Header component (#7) — saves time on every SLIDEIN page

---

## Blocked Pages

Pages that cannot be accurately composed until their missing components are created:

| Page | Pattern | Blocked By | Attempted? |
|------|---------|------------|-----------|
| Oracle / Fast Track AI | CHAT | Chat Input Box (#13), Suggestion Pill (#14), AI Disclaimer (#18) | Yes — rough build at `207:69893`, needs component rework |
| Media Library | FILE-BROWSER | Folder Tree Sidebar (#15), Split Panel (#16), View Toggle (#17) | Yes — rough build at `208:70958`, needs component rework |
| Player Profile | DETAIL | Icon Tab Card (#19), Channel Action Icons (#20), User ID Badge (#21), Collapsible Section Header (#22), Key-Value Attribute Grid (#23), Favourites Drop Zone (#24) | No — screenshot only (from other environment) |
