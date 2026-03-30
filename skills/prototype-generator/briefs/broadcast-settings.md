# Page Brief: Broadcast Settings

> Layout: FORM
> Tier: Cold test

## Shell

| Element | Value |
|---|---|
| Side Menu section | SETTINGS |
| Breadcrumb L1 | Settings |
| Breadcrumb L2 | Broadcast Settings |
| Page title | Broadcast Settings |
| Main CTA | Save Changes |

## Content

**Panels:** Single panel

**Panel title:** Broadcast Settings
**Panel subtitle:** Configure your broadcast messaging preferences
**Search:** No

### Section 1: General

| Field Label | Field Type | Width | Default Value | Notes |
|---|---|---|---|---|
| Sender Name | Text input (filled) | FILL | "FastTrack CRM" | — |
| Reply-To Email | Text input (filled) | FILL | "noreply@fasttrack.net" | — |

### Section 2: Delivery

| Field Label | Field Type | Width | Default Value | Notes |
|---|---|---|---|---|
| Default Channel | Dropdown (filled) | FILL | "Email" | — |
| Send Limit per Day | Text input (filled) | FILL | "5000" | — |
| Enable Throttling | Toggle | HUG | Checked | Single row, not in 2-col layout |

### Section 3: Notifications

| Field Label | Field Type | Width | Default Value | Notes |
|---|---|---|---|---|
| Notify on Failure | Toggle | HUG | Checked | — |
| Failure Email | Text input (filled) | FILL | "ops@fasttrack.net" | Only visible when toggle is on |

## Construction Notes

- 3 sections with section titles (16px, Inter Bold)
- Sections 1 and 2 use 2-column form rows
- Section 3: toggle first, then single-column input below
- No alert banner needed
- Save button is the main CTA in Page Header
