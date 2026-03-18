# Component IDs & Override Reference

> Quick-lookup for component set IDs, variant names, and text override node names.
> Last updated: 2026-03-18

## Component IDs (Workbench Page)

| Component | Set ID | Common Variants |
|-----------|--------|----------------|
| Base Template | `94:21370` | COMPONENT — always start here |
| Input Fields | `91:6537` | Text input / Dropdown - Regular / Search / Text Area × default-empty / default-filled |
| button-btn | `91:8299` | Type=main (pink) / alt (outline) / icon (kebab) |
| Toggle | `91:8647` | Checked/Unchecked × Default/Justified |
| Tag | `91:10023` | Icon-solid/light × Small/Medium × Black/Neutral |
| alert | `92:40484` | Status=info/success/warning/error × Large/Centered |
| Header (table) | `91:39176` | Column header with sort icon |
| Row (table cell) | `91:39179` | Text / Text+leading icon / ellipsis / image / checkbox × EVEN/ODD |
| tab | `91:19098` | tab-text / tab-switch × Default/Selected |
| Pagination | `92:40394` | Type=go to page |
| Block Selector | `91:8712` | Selected/Unselected × Default/Hover/Disabled |
| Checkbox | `91:8542` | Checked/Unchecked × Default/Disabled/Hover |
| Radio | `91:8595` | Checked/Unchecked × Default/Disabled/Hover |

## Row Type Selection (Tables)

| Column content | Row Type variant |
|---------------|-----------------|
| Plain text | `Type=Text` |
| Text with icon prefix | `Type=Text+leading icon` |
| Avatar/thumbnail | `Type=image` |
| Checkboxes (multi-select) | `Type=checkbox` |
| Action menu | `Type=ellipsis` (always last column) |

All row types have `Position=EVEN` and `Position=ODD` variants for zebra striping.

## Text Override Node Names

| Component | What to override | Node name to find | Font |
|-----------|-----------------|-------------------|------|
| Panel Header | Title | `"Title"` | Inter Bold |
| Panel Header | Subtitle | `"Sub-Title"` | Inter Regular |
| Page Header | Breadcrumb levels | `"Level 1"`, `"Level 2"` etc. (match by content) | Inter Regular/Bold |
| Page Header | CTA button | `"Button text"` (match by content) | Inter Bold |
| Page Header | Heading | `"Heading"` (match by content) | Inter Regular |
| Tab | Title | `"text goes here"` inside `"tab title and alert circle"` frame | Inter Bold |
| Input Fields | Label | `"Label text here"` | Inter Bold |
| Input Fields | Value/Placeholder | `"Placeholder"` | Inter Regular |
| Toggle | Label | `"Enter option text here"` | Inter Regular |
| Tag | Text | `"I am a tag"` | Inter Bold |
| Table Header cell | Column name | `"Heading"` | Inter Bold |
| Table Row cell | Cell value | `"Row"` | Inter Regular |

## Tab Override Gotchas

- Title text lives inside `"tab title and alert circle"` frame — the text node is named `"text goes here"`
- After overriding, ensure the frame's visibility is `true` (it can get hidden accidentally)
- Hide `"alert circle"` and `"Badge"` nodes to clean up the tab appearance
- Tab badges show red notification dots — hide them unless the brief requires them

## Figma API Gotchas

- `layoutSizingHorizontal = 'FILL'` only works AFTER appending to an auto-layout parent
- `findOne()` can return null in dynamic-page mode — prefer `getNodeByIdAsync()` with known IDs
- Always detach top-level instance first, then children — reverse order causes crashes
- Always `loadFontAsync(node.fontName)` before any text edit — use the node's actual font
- Instance `componentProperties` keys have `#nodeId` suffixes — check the actual keys before setting
