# Component Catalog

> Single source of truth mapping Figma components → Vue components → usage intelligence → instantiation code.
> Consumed by: prototype-generator, design-critique, and future skills.
> Last synced: 2026-03-17

## How to Use This Catalog

Each component entry contains:
- **Figma set** — component set name, ID, variant count
- **Props** — full property keys (exact Figma notation for `setProperties()`)
- **Vue** — corresponding `<FT*>` component
- **When to use / Don't use** — decision rules for prototype generation
- **Default instantiation** — the default variant and props to use when the brief doesn't specify
- **Variant selection logic** — how to map natural language to variant choices
- **Compliance** — rules for design critique

## Source Files

| File | Key | Role |
|------|-----|------|
| FT DNA | `7J3dSTuOSRlsHBqQ4ohtxI` | Component library (local components + variables) |
| vue-components-lib | npm `@fasttrack-solutions/vue-components-lib` | Production Vue components |

## Instantiation Pattern

All components live on the 🧫 Workbench page of FT DNA. Access cross-page via ID:

```javascript
// Get component set
const set = await figma.getNodeByIdAsync('COMPONENT_SET_ID');

// Get specific variant by iterating children
const variant = set.children.find(v => v.name.includes('Type=Text input') && v.name.includes('State=default-empty'));

// Create instance
const instance = variant.createInstance();
parentFrame.appendChild(instance);
instance.layoutSizingHorizontal = 'FILL'; // AFTER appendChild

// Override properties
instance.setProperties({
  'PropertyName#nodeId': value,
});
```

---

## Form Controls

### Input Fields
- **Figma:** `Input Fields` (set: `91:6537`) — 32 variants
- **Vue:** `<FTInput>`, `<FTSelect>`
- **Section:** Input Fields (`91:6523`)

**Variant Properties:**

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | Text input, Dropdown - Regular, Search, Text Area, Dropdown - Special, Search Button | Text input |
| `State` | VARIANT | default-empty, hover, focused, error, default-filled, disabled | default-empty |

**Boolean Properties (toggleable features):**

| Property Key | Default | What it controls |
|-------------|---------|-----------------|
| `Leading Icon#4276:0` | false | Icon left of input text |
| `Underline Caption#4281:0` | false | Helper text below field |
| `Tags#4281:31` | false | Tag chips inside field |
| `Info icon#4283:93` | false | Info tooltip icon |
| `Preview#4284:0` | false | Preview button |
| `Clear text#4284:31` | false | Clear/X button |
| `Refresh#4284:62` | false | Refresh button |
| `Load#4284:93` | false | Load button |
| `Send/Return#4284:124` | false | Send/return action |
| `Required#4285:155` | false | Required asterisk |
| `Label#4339:0` | true | Label above field |
| `AI+Emoji#4369:0` | true | AI assist + emoji picker |

**Variant Selection Logic:**

| User says... | Use variant |
|-------------|-------------|
| "input", "text field", "text input" | Type=Text input |
| "dropdown", "select", "picker" | Type=Dropdown - Regular |
| "search", "search bar" | Type=Search |
| "textarea", "text area", "multiline", "description field" | Type=Text Area |
| "search with button" | Type=Search Button |

**Default for prototype generation:**
- Type=Text input, State=default-empty
- Label=true, AI+Emoji=false (cleaner default), Required=false
- Set `Label#4339:0` to true, everything else false

**Compliance:**
- Always include label above field (`Label#4339:0: true`)
- Error state must show red border
- Disabled fields use reduced opacity
- AI+Emoji only in content-editing contexts, not configuration forms

---

### Date Pickers

**Date picker - Calendar** (set: `91:6868`) — 2 variants

| Property | Options | Default |
|----------|---------|---------|
| `Type` | Date Picker - Calendar - single, Date Picker - Calendar - double | single |

**Date picker with input** (set: `91:7183`) — 4 variants

| Property | Options | Default |
|----------|---------|---------|
| `type` | specific date and time, time span | time span |
| `state` | open, closed | open |

**Variant Selection Logic:**
- "date picker", "select date" → Date picker with input, type=specific date and time
- "date range", "time span", "period" → Date picker with input, type=time span
- "calendar" → Date picker - Calendar - single

---

### Checkbox
- **Figma:** `Checkbox` (set: `91:8542`) — 5 variants
- **Vue:** `<FTCheckbox>`
- **Section:** Selection (`91:8524`)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | Checked, Unchecked | Checked |
| `Status` | VARIANT | Default, Disabled, Hover | Default |
| `Text#9:1` | TEXT | — | "Enter option text here" |

**Use when:** Multiple selections from a list, boolean opt-in/opt-out
**Don't use when:** Single on/off (use Toggle), mutually exclusive (use Radio)
**Default:** Type=Unchecked, Status=Default
**Compliance:** Always provide text label. Group related checkboxes vertically.

---

### Radio
- **Figma:** `Radio` (set: `91:8595`) — 5 variants
- **Vue:** `<FTRadio>`

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | Checked, Unchecked | Checked |
| `Status` | VARIANT | Default, Disabled, Hover | Default |
| `Text#9:9` | TEXT | — | "Enter option text here" |

**Use when:** Mutually exclusive single selection from 2-5 options
**Don't use when:** More than 5 options (use Dropdown), multiple selections (use Checkbox)
**Default:** Type=Unchecked, Status=Default
**Compliance:** Radio groups need ≥2 options. All options visible (never hidden in dropdown).

---

### Toggle
- **Figma:** `Toggle` (set: `91:8647`) — 10 variants
- **Vue:** `<FTToggle>`

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | Checked, Unchecked | Checked |
| `Status` | VARIANT | Default, Disabled, Hover | Default |
| `Alignment` | VARIANT | Default, Justified | Default |
| `Text#9:17` | TEXT | — | "Enter option text here" |

**Use when:** Binary on/off settings, feature flags, enable/disable
**Don't use when:** Form submissions needing explicit save (use Checkbox), choosing from options (use Radio)
**Default:** Type=Unchecked, Status=Default, Alignment=Default
**Critical rule:** `layoutSizingHorizontal = 'HUG'` — toggles NEVER fill width. Label hugs the text.
**Compliance:** Label describes the "on" state. Justified alignment only for full-width settings rows.

---

### Block Selector
- **Figma:** `Block Selector` (set: `91:8712`) — 6 variants
- **Vue:** `<FTOptionsSelector>`

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | Selected, Unselected | Unselected |
| `Status` | VARIANT | Default, Hover, Disabled | Default |
| `Image#4370:31` | BOOLEAN | — | true |
| `Icon#4370:37` | BOOLEAN | — | true |
| `xmark#4370:43` | BOOLEAN | — | true |
| `flag#4371:49` | BOOLEAN | — | true |
| `Toggle#4373:0` | BOOLEAN | — | false |
| `Number#4373:7` | BOOLEAN | — | true |

**Use when:** Visual option selection with large touch targets, card-style choices (markets, reward types)
**Don't use when:** Simple list (use Radio), compact forms (use Dropdown)

---

## Buttons

### button-btn
- **Figma:** `button-btn` (set: `91:8299`) — 40 variants
- **Vue:** `<FTButton>`
- **Section:** Buttons (`91:8294`)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | main, alt, sub, plus, icon | main |
| `Status` | VARIANT | default, hover, focused, disabled | default |
| `Size` | VARIANT | default, S, M, L | default |
| `Leading icon` | VARIANT | Yes, No | Yes |

**Variant Selection Logic:**

| User says... | Use variant |
|-------------|-------------|
| "primary button", "CTA", "save", "create", "submit" | Type=main |
| "secondary button", "cancel", "back" | Type=alt |
| "tertiary", "text button", "link-style" | Type=sub |
| "add", "plus", "new" | Type=plus |
| "icon button", "kebab", "menu", "more options" | Type=icon |

**Hierarchy rules:**
- Max **1 main** (primary) button per panel header
- Alt button always **LEFT** of main button in header
- Sub for destructive or low-priority actions
- Only 1 main CTA per active page when possible — use alt/sub for others

**Default:** Type=main, Status=default, Size=default, Leading icon=No
**Compliance:** White text on main always. Never change border-radius. Pink fill (`brand-pink-400`) for main.

---

## Tags & Status

### Tag
- **Figma:** `Tag` (set: `91:10023`) — 42 variants
- **Vue:** `<FTTag>`
- **Section:** Tags and statuses (`91:10021`)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | Icon - solid, Icon - light | Icon - solid |
| `Size` | VARIANT | Large, Medium, Small | Large |
| `Solid Colour` | VARIANT | Black, Neutral | Black |
| `Status` | VARIANT | Default, Hover, Focused, Disabled, Locked-default, Locked-focused, Locked-disabled | Default |
| `Leading Icon#26:0` | BOOLEAN | — | true |
| `Trailing icon#26:4` | BOOLEAN | — | true |
| `Tag text#26:8` | TEXT | — | "I am a tag" |

**Variant Selection Logic:**
- Status indicators → Type=Icon - solid, Size=Small
- Filter chips → Type=Icon - light, Size=Medium
- Category labels → Type=Icon - solid, Size=Large
- Selection chips → Neutral for unselected, Black for selected

**Status color mapping (applied via overrides):**
- Active/Live → green
- Draft/Pending → orange
- Disabled/Archived → grey (neutral)
- Error/Blocked → red

**Default:** Type=Icon - solid, Size=Small, Solid Colour=Black, Leading Icon=false, Trailing icon=false

---

### singularity widget
- **Figma:** `singularity widget` (set: `91:10277`) — 6 variants
- Domain-specific. Only use in Singularity Model contexts.

---

## Dropdowns

### dropdown list item base
- **Figma:** `dropdown list item base` (set: `91:10265`) — 4 variants
- **Vue:** `<FTSelect>` (internal)
- States: default, default-hover, selected, selected-hover

### Specific Dropdown list item
- **Figma:** `Specific Dropdown list item` (set: `91:11007`) — 48+ variants
- Domain-specific dropdown content with rich formatting

### dropdown - category - heading
- **Figma:** standalone (`91:10932`)
- Section dividers within dropdown menus

---

## Navigation

### tab
- **Figma:** `tab` (set: `91:19098`) — 20 variants
- **Vue:** `<FTTabs>`
- **Section:** Tabs (`91:19096`)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | tab-text, tab-switch, tab-box-index, tab-box-flow, tab-box-flow-end | tab-text |
| `Status` | VARIANT | Default, Default-Hover, Selected, Disabled, Hover | Default |
| `Alert circle#2148:0` | BOOLEAN | — | true |
| `Count#2148:4` | BOOLEAN | — | true |
| `Icon#2197:0` | BOOLEAN | — | true |

**Variant Selection Logic:**
- Standard section switching → Type=tab-text
- Binary/toggle-style tabs → Type=tab-switch
- Step indicators (numbered) → Type=tab-box-index
- Flow/pipeline steps → Type=tab-box-flow (+ tab-box-flow-end for last)

**Default:** Type=tab-text, Status=Selected (for active tab) or Default (for inactive)
**Composition:** Create tab groups by placing multiple tab instances in a horizontal auto-layout frame.

---

### Breadcrumb
- **Figma:** `Breadcrumb` (set: `92:46145`) — 19 variants
- **Vue:** `<FTBreadcrumb>`

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | Short, Truncated long, Ellipses, Level break, Origin, Name, Email, Phone, User ID, Consents | Short |
| `Select state` | VARIANT | Unselected, Selected | Unselected |
| `Action State` | VARIANT | Default, Hover | Default |
| `Tag#3054:0` | BOOLEAN | — | true |
| `Dropdown#3054:12` | BOOLEAN | — | true |

**Compliance:** Current page = last breadcrumb, always `Select state=Selected` (bold).

### Left - Breadcrumb Navigation
- **Figma:** `Left - Breadcrumb Navigation` (set: `92:46248`) — 5 variants

| Property | Options | Default |
|----------|---------|---------|
| `LVL no. and rename` | 5, 5 rename, 6+, 6+ rename, 2 | 6+ |

**Default for generation:** `LVL no. and rename = '5'`, then hide all children except the first breadcrumb. See SKILL.md for code.

### side menu
- **Figma:** `side menu` (set: `92:46352`) — 8 variants
- **Vue:** `<FTSideMenu>`

| Property | Options | Default |
|----------|---------|---------|
| `Level` | LVL 1, LVL 2 | LVL 1 |
| `Section` | Default, CRM, INSIGHTS & ANALYTICS, SINGULARITY MODEL, SETTINGS, TOOLS, SEARCH, REWARDS | Default |

**Compliance:** Always 56px wide. Always mono-black background. LVL 1 for main nav.
**Variant Selection Logic:** Match `Section` to the product area being prototyped.

---

## Data Display

### Row (Table)
- **Figma:** `Row` (set: `91:39179`) — 24 variants
- **Vue:** `<FTTable>`
- **Section:** Table (`91:39174`)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Type` | VARIANT | Text, Text+leading icon, Text+trailing icon, image, tag, number/version, ellipsis, checkbox, status circle, action icons, flags, Icon | Text |
| `Position` | VARIANT | EVEN, ODD | EVEN |

**Composition:** Alternate EVEN/ODD rows for zebra striping. Combine with standalone Header (`91:39176`) for column headings and pagination (`92:40394`) for footer.

### Table Header
- **Figma:** standalone `Header` (`91:39176`)
- Column headings with sort indicators

### pagination
- **Figma:** `pagination` (set: `92:40394`) — 6 variants
- **Vue:** `<FTPaging>`

| Property | Options | Default |
|----------|---------|---------|
| `Type` | Standard, Many pages+go to page, go to page, go to page active, Pages hidden, Many pages | Standard |

---

## Feedback

### alert
- **Figma:** `alert` (set: `92:40484`) — 7 variants
- **Vue:** `<FTAlert>`
- **Section:** Alert (`92:40482`)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Status` | VARIANT | success, error, info, warning | success |
| `Type` | VARIANT | Large - Left aligned, Centered | Large - Left aligned |
| `Description#2821:5` | BOOLEAN | — | true |
| `Show more#2821:10` | BOOLEAN | — | true |
| `Primary button#2821:15` | BOOLEAN | — | true |
| `Secondary Button#2821:20` | BOOLEAN | — | true |
| `Timer bar#2821:25` | BOOLEAN | — | true |
| `Show more text#2821:30` | BOOLEAN | — | true |
| `Buttons#2821:35` | BOOLEAN | — | true |
| `Close icon#2821:40` | BOOLEAN | — | true |

**Variant Selection Logic:**
- "success message", "confirmation" → Status=success
- "error", "failure", "problem" → Status=error
- "info", "note", "hint" → Status=info
- "warning", "caution" → Status=warning

**Default for generation (CRITICAL):**
```
Description#2821:5: true
Close icon#2821:40: true
Everything else: false
```
Only enable buttons, show more, timer when the brief explicitly calls for them.

**Composition rule:** Alerts always go at the TOP of the panel content area (first child), unless explicitly stated otherwise.

**Compliance:** success=green, warning=orange, info=blue, error=red. Never custom colors.

---

### tooltip
- **Figma:** `tooltip` (set: `92:45743`) — 12 variants
- **Vue:** `<FTTooltip>`
- 12 positions: Top/Bottom/Left/Right × Left/Center/Right

### data-balloon
- **Figma:** `data-balloon` (set: `92:45828`) — 10 variants
- Rich tooltips with status indicators

### tooltip-detailed
- **Figma:** `tooltip-detailed` (set: `92:45865`) — 12 variants
- Complex hover cards with structured content

### Modal
- **Figma:** `Modal` (set: `92:40595`) — 3 variants
- **Vue:** `<FTModal>`

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Size` | VARIANT | S [W-420px], M [W-640px], L [W-1200px] | S [W-420px] |
| `Alert box#2828:0` | BOOLEAN | — | true |
| `Toggles#2828:4` | BOOLEAN | — | true |
| `Input field#2828:8` | BOOLEAN | — | true |
| `Secondary Button#2828:12` | BOOLEAN | — | true |
| `Select all option#3089:0` | BOOLEAN | — | true |

**Size selection:**
- Confirmations, simple messages → S (420px)
- Forms, multi-field input → M (640px)
- Complex content, tables, previews → L (1200px)

### Placeholder (Empty State)
- **Figma:** `Placeholder` (set: `92:49611`) — 6 variants
- **Vue:** `<FTSpinner>` (partial)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Size` | VARIANT | XS, S, M, L, XL [GIF], XL [icon] | XL [icon] |
| `CTA#3691:0` | BOOLEAN | — | true |
| `Learn more link#3691:6` | BOOLEAN | — | true |
| `Description#3783:7` | BOOLEAN | — | true |
| `Extras#4325:0` | BOOLEAN | — | true |

**Use when:** Empty states, no-data, first-time use, loading
**Compliance:** Always include descriptive text below icon.

---

## Layout

### Standard Panel
- **Figma:** `Standard Panel` (set: `92:46583`) — 4 variants
- **Vue:** `<FTPanel>`
- **Section:** Panel (`92:46581`)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Side - Width` | VARIANT | Full, 2/3 [66%], 1/2 [50%], 1/3 [33%] | Full |
| `Panel header#4117:35` | INSTANCE_SWAP | — | `92:46641` |

**Width selection:**
- Single content area → Full
- Main + sidebar → 2/3 + 1/3
- Equal split → 1/2 + 1/2

**Compliance:** White background, 32px padding, content placeholder has NO padding and NO fill.

### Panel Header
- **Figma:** `Panel Header` (set: `92:46640`) — 4 variants
- **Vue:** `<FTPanel>` (sub-component)

| Property | Type | Options | Default |
|----------|------|---------|---------|
| `Property 1` | VARIANT | Default, All Activities, Lifecycle Projects, Add Actions | Default |
| `Action Icons#4635:12` | BOOLEAN | — | true |
| `Description#4635:13` | BOOLEAN | — | true |
| `Search#4635:14` | BOOLEAN | — | true |
| `Toggle#4635:15` | BOOLEAN | — | true |
| `Right side options#4635:16` | BOOLEAN | — | true |
| `Info icon#4635:17` | BOOLEAN | — | true |

**Default for generation:** Property 1=Default, then show only what's needed. Start minimal, add features.

### Action icons
- **Figma:** `Action icons` (set: `92:46630`) — 3 variants
- Items: 3 icons, 2 icons, 1 (ellipsis only)

### Panel Title
- **Figma:** `Panel Title` (set: `92:46688`) — 2 variants
- Types: Title, Description

---

## Page-Level Components

### Base Template
- **Figma:** standalone COMPONENT (`94:21370`) on Workbench
- No configurable properties — it's a fixed structure
- **Children:** side menu (local `92:46353`), Page Header (local `97:90645`), content frame with Standard Panel

### Page Header
- **Figma:** standalone COMPONENT (`97:90645`) on Workbench
- **Children:** Left - Breadcrumb Navigation (instance), Right - CTA and icons (frame)
- The header's boolean props are accessed via `setProperties()` on the instance AFTER creating Base Template instance. See SKILL.md for property keys.

---

## Cards

### Lifecycle card
- **Figma:** `Lifecycle card` (set: `92:46699`) — 8 variants
- Domain-specific: lifecycle project overview

### card - markets
- **Figma:** `card - markets` (set: `92:46824`) — 4 variants
- Domain-specific: market/region selection

### card - rewards
- **Figma:** `card - rewards` (set: `92:46874`) — 2 variants
- Domain-specific: rewards feature cards

---

## CRM-Specific (Quick Access / Recipes)

### Action block
- **Figma:** `Action block` (set: `92:55559`) — 14 variants
- 14 action types: Email, SMS, On-Site Notification, Push, Slack, Webhook, Bonus, etc.

### add action button
- **Figma:** `add action button` (set: `92:55930`) — 22 variants
- Types × Default/Hover states

### add actions
- **Figma:** `add actions` (set: `92:56041`) — 2 variants
- States: Default (collapsed), Expanded

### action icon
- **Figma:** `action icon` (set: `92:56062`) — 22 variants
- Types × 30x30/20x20 sizes

### Actions Panel
- **Figma:** `Actions Panel` (set: `92:56107`) — 4 variants
- Types: Empty, Empty-Locked, Fill, Fill-SMS and Email

---

## Icons

### v7-icon
- **Figma:** `v7-icon` (set: `109:144678`) — 272 variants, on FontAwesome page
- Font Awesome 6 Pro ligature-based icons

| Property | Options |
|----------|---------|
| `style` | solid, light, regular, thin, sharp-solid |
| `padding` | none, fixed-width, square, roomy |
| `scale` | 0.5, 1x, 2x (and more) |
| `icon-name#109:0` | TEXT — plain English name e.g. "chevron-right", "user", "gear" |

**Default:** style=solid, padding=none, scale=1x
**97% of usage** is style=solid. Use light/regular sparingly.

### Flag
- **Figma:** `Flag` (set: `97:71963`) — 261 variants, on Icons page
- Country flag icons

---

## Standalone Components

| Name | ID | Section | Use |
|------|----|---------|-----|
| dropdown - category - heading | `91:10932` | Dropdown | Section heading inside dropdown menus |
| tabs-switch-groupped | `91:19392` | Tabs | Assembled tab bar (switch style) |
| schedule action selector | `91:8991` | Selection | Schedule time selector |
| Table Header | `91:39176` | Table | Table column heading |
| Rename - breadcrumbs | `92:46140` | Nav bars | Inline rename field in breadcrumb |
| version number | `92:46534` | Nav bars | Side menu version display |
| Overlay blur-small | `92:55554` | Quick access | Slide-in panel backdrop |
| Base Template | `94:21370` | Workbench root | Page shell (side menu + header + panel) |
| Page Header | `97:90645` | Workbench root | Header with breadcrumbs + CTAs |

---

## Vue Components Without Figma Mapping (code-only)

| Vue Component | Purpose | Covered by |
|---------------|---------|------------|
| `<FTConfirm>` | Confirmation dialog | Modal + Alert |
| `<FTFloatingLabel>` | Floating label input | Input Fields |
| `<FTIcon>` | Icon wrapper | v7-icon |
| `<FTMarkdownText>` | Markdown renderer | No Figma needed |
| `<FTNavbar>` | Navigation bar | Header |
| `<FTPageLayout>` | Page layout wrapper | Base Template |
| `<FTRichText>` | Rich text editor | Text Area input |
| `<FTSlidingPanel>` | Slide-in panel | Overlay blur-small + panel frame |
| `<FTSplitView>` | Split view layout | Standard Panel width variants |

---

## Cross-Reference: Vue → Figma

| Vue Component | Figma Component | Set ID |
|---------------|----------------|--------|
| `<FTAlert>` | alert | `92:40484` |
| `<FTBreadcrumb>` | Breadcrumb | `92:46145` |
| `<FTButton>` | button-btn | `91:8299` |
| `<FTCheckbox>` | Checkbox | `91:8542` |
| `<FTDatePicker>` | Date picker with input | `91:7183` |
| `<FTHeader>` | Header (standalone) | `91:39176` |
| `<FTInput>` | Input Fields | `91:6537` |
| `<FTModal>` | Modal | `92:40595` |
| `<FTOptionsSelector>` | Block Selector | `91:8712` |
| `<FTPaging>` | pagination | `92:40394` |
| `<FTPanel>` | Standard Panel | `92:46583` |
| `<FTRadio>` | Radio | `91:8595` |
| `<FTSelect>` | Input Fields (Dropdown variants) | `91:6537` |
| `<FTSideMenu>` | side menu | `92:46352` |
| `<FTSpinner>` | Placeholder | `92:49611` |
| `<FTTable>` | Row | `91:39179` |
| `<FTTabs>` | tab | `91:19098` |
| `<FTTag>` | Tag | `91:10023` |
| `<FTToggle>` | Toggle | `91:8647` |
| `<FTTooltip>` | tooltip | `92:45743` |
| `<FTLogo>` | FT Logo | (Logo file) |

---

## Duplicate Component Sets (cleanup needed)

| Name | Primary ID | Duplicate ID |
|------|-----------|--------------|
| Checkbox | `91:8542` | `91:8776` |
| Radio | `91:8595` | `91:8829` |
| Toggle | `91:8647` | `91:8881` |
| Block Selector | `91:8712` | `91:8946` |

Always use the **Primary ID**.
