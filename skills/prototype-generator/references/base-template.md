# Base Template — Full Page Layout

> Reverse-engineered from FT DNA node `64:934` ("Full page template")
> Source file: `7J3dSTuOSRlsHBqQ4ohtxI`
> Last synced: 2026-03-16

## Overview

The standard FT back-office page is a 1920×1080 frame with three zones: side menu, header, and content area containing a standard panel. All components are **local instances** on the FT DNA Workbench page.

```
┌──────┬──────────────────────────────────────────────┐
│ Side │ Header (50px)                                │
│ Menu │  [Breadcrumbs]              [Btns] [Icons]   │
│(56px)├──────────────────────────────────────────────│
│      │ Content Area (mono-200 bg, 32px padding)     │
│      │  ┌─────────────────────────────────────────┐ │
│      │  │ Standard Panel (white, 32px padding)    │ │
│      │  │  Panel Header: Title + Actions          │ │
│      │  │  ────────────────────────────────────── │ │
│      │  │  Content placeholder (mono-100 bg)      │ │
│      │  └─────────────────────────────────────────┘ │
└──────┴──────────────────────────────────────────────┘
```

---

## Node Structure

### Root: Full page template
- **Type:** FRAME
- **Size:** 1920 × 1080 (fixed)
- **Fill:** `Monochrome/color-mono-200` (#F5F5F5)
- **Layout:** None (absolute children? No — actually HORIZONTAL implied by child order: side menu left, content right)

Wait — re-checking: root has no layoutMode set in the data, but children are side menu (56px) + header (1864px) + content frame. The root frame itself is NOT auto-layout; the header and content frame are positioned alongside the side menu.

Actually from inspection: the root FRAME has children ordered as:
1. `side menu` (INSTANCE, 56×1080)
2. `Header` (INSTANCE, 1864×50)
3. `Frame 1317` (FRAME, 1864×1030) — content area

The root frame uses no auto-layout. Children are positioned absolutely or via constraints. But for prototype generation, we replicate with auto-layout for cleaner code.

---

## Component Registry

All components are local on the FT DNA Workbench page. Use `getNodeByIdAsync()` to get the component set, then `createInstance()` to instantiate.

### Side Menu
| Property | Value |
|----------|-------|
| Component set | `side menu` |
| Variant | `Level=LVL 1, Section=Default` |
| Key | `01382add33f8d62b5acc7947d842c58bed8a5d47` |
| Size | 56 × 1080 |
| Fill | `Monochrome/color-mono-black` (#000000) |
| Layout | VERTICAL, gap 30, SPACE_BETWEEN + CENTER |
| Props | `Level` (VARIANT): LVL 1 / LVL 2 / etc. `Section` (VARIANT): Default |

### Header
| Property | Value |
|----------|-------|
| Component | `Header` (standalone, no set) |
| Key | `8e10ed2138a0234d6ee56b58f3979e1721d00cab` |
| Size | 1864 × 50 |
| Fill | `Surfaces/Base/surface-white` |
| Layout | HORIZONTAL, pad 0 32 0 32, SPACE_BETWEEN + CENTER |
| Boolean props | `Info`, `Change log`, `Lock`, `Secondary Button`, `Primary Button`, `Action Icons`, `Ellipses menu` — all true by default |

**Header children:**
1. **Left - Breadcrumb Navigation** (INSTANCE)
   - Set: `Left - Breadcrumb Navigation`
   - Variant: `LVL no. and rename=6+`
   - Key: `ed629a602194559162a29a6e68e88d6c2cb71b25`
   - Contains: alternating Breadcrumb items + Level break separators
   - Breadcrumb keys:
     - Short (unselected): `bfd3453444344faa84e4d42ede8f48ab6a6d6262`
     - Short (selected/active): `34d53a175a8b560f6fc2cee1e81f122a235828dc`
     - Level break (separator): `f79d188b92159f381c075103e91e5e864cb19f84`
     - Ellipses: `cb5eaf6457292893e4c2db1307cd7cbd2e9e13ef`

2. **Right - CTA and icons** (FRAME, gap 8, HUG)
   Contains 3 button instances + 1 icon wrapper:
   - `button-btn` Type=alt (secondary): key `e2fb234f1d160ba6003fd038e41c353c1d6f1747`
   - `button-btn` Type=main (primary/pink): key `2e8d3dd7c848a34638be9b5f4ff09fc65c3c6748`
   - `button-btn` Type=icon (kebab): key `df2b2911e0d77392d1aab55f556b432693fd3d78`
   - Frame 1505: icon cluster (info, changelog, lock) — 96×32

### Standard Panel
| Property | Value |
|----------|-------|
| Component set | `Standard Panel` |
| Variant | `Side - Width=Full` |
| Key | `11f304c450106b9ad6988e4c6f0449de70ebc1e2` |
| Size | 1700 × 966 (FIXED width, FILL height) |
| Fill | `Monochrome/color-mono-white` (#FFFFFF) |
| Layout | VERTICAL, gap 16, pad 32 all sides |
| Props | `Panel header` (INSTANCE_SWAP): default component ID `3:5004`, `Side - Width` (VARIANT): Full |

### Panel Header
| Property | Value |
|----------|-------|
| Component set | `Panel Header` |
| Variant | `Property 1=Default` |
| Key | `9a80786ea3b4fd80b53905c7f1c101acb8231521` |
| Size | 1636 × 45 (FILL width, HUG height) |
| Layout | VERTICAL, gap 16 |
| Boolean props | `Info icon`, `Right side options`, `Toggle`, `Search`, `Description`, `Action Icons` — all true by default |

**Panel Header children:**
- **Title and description** (FRAME, VERTICAL, gap 4)
  - Title row: "Title" text (20px/700) + info icon
  - Sub-Title: "Sub-Title" text (14px/400), fill `mono-700`
- **Search + Action Icons** (FRAME, HORIZONTAL, gap 8)
  - Input Fields (search button): key `11c6f59d5814c59f3d58ae62cfecf39a0a18b25a`
  - Toggle: key `8cdfc399b4791580c6bf13fc5fa56f77e95b24e4`
  - Action icons: key `d9eb1fd901ef07852b49d189676eee5fd7f40ea0`

### Content Placeholder
| Property | Value |
|----------|-------|
| Type | FRAME (inside Standard Panel) |
| Fill | `Monochrome/color-mono-100` (#FAFAFA) |
| Layout | VERTICAL, CENTER + CENTER |
| Sizing | FILL × FILL |
| Contains | Placeholder text "To delete and add content" (20px/700, mono-700) |

---

## Variable Bindings Summary

| Element | Variable | Hex (Light) |
|---------|----------|-------------|
| Root frame bg | `Monochrome/color-mono-200` | #F5F5F5 |
| Side menu bg | `Monochrome/color-mono-black` | #000000 |
| Header bg | `Surfaces/Base/surface-white` | #FFFFFF |
| Panel bg | `Monochrome/color-mono-white` | #FFFFFF |
| Content area bg | `Monochrome/color-mono-100` | #FAFAFA |
| Text (primary) | `Monochrome/color-mono-700` | #2C2C2C |

Note: The header uses a **Tokens collection** variable (`Surfaces/Base/surface-white`) rather than a raw colour variable. This is a semantic alias. Other surfaces may use similar semantic tokens.

---

## Variable Collection IDs

Two collections discovered from the template bindings:

| Collection | ID | Purpose |
|------------|----|---------|
| Colours | `VariableCollectionId:ad7dbdbd61b74d4307fe470d0fc185064d9c6aec/113:452` | Raw color palette (mono, brand families) |
| Tokens | `VariableCollectionId:4bedabd90aef2ae9b800a6138e3d13af66317d93/124:185` | Semantic aliases (surfaces, text, borders) |

---

## Instantiation Pattern — Create Instance from Base Template

### Base Template Component
- **File:** FT DNA (`7J3dSTuOSRlsHBqQ4ohtxI`)
- **Page:** 🧫 Workbench
- **Node:** `94:21370` ("Base Template") — this is a COMPONENT, never delete it
- **Type:** Local COMPONENT with all local children
- **Children:** side menu (local `92:46353`), Page Header (local `97:90645`), Frame 1317 > Standard Panel (local `92:46584`)

> **Legacy seed:** The old seed instance `3:5535` on Sandbox still exists but is deprecated. Use the Base Template component instead.

### Instance Workflow

```javascript
// Create instance from Base Template
const baseTemplate = await figma.getNodeByIdAsync('94:21370');
const sandbox = figma.root.children.find(p => p.name.includes('Sandbox'));
await figma.setCurrentPageAsync(sandbox);
const screen = baseTemplate.createInstance();
screen.name = 'My New Screen';
```

### Child Navigation (after clone)

| Index | Path | Node Type | Name |
|-------|------|-----------|------|
| `screen.children[0]` | Side menu | INSTANCE | `side menu` |
| `screen.children[1]` | Header | INSTANCE | `Header` |
| `screen.children[2]` | Content frame | FRAME | `Frame 1317` |
| `screen.children[2].children[0]` | Standard Panel | INSTANCE | `Standard Panel` |

### Detach for Custom Content

To modify the content area inside Standard Panel, you may need to detach nested instances:

```javascript
// Access the content placeholder inside the panel
const panel = screen.children[2].children[0]; // Standard Panel instance
// Detach to modify internal structure
const detached = panel.detachInstance();
// Now detached is a regular FRAME — children are editable
const contentPlaceholder = detached.children[1]; // "content placeholder" frame
// Remove placeholder content and add your own
contentPlaceholder.children.forEach(c => c.remove());
```

**Important:** For INSTANCE nodes, use `setProperties()` or `figma_set_instance_properties` to modify text and boolean props — direct text editing FAILS SILENTLY on instances.

---

## Button Component Keys (button-btn set)

| Variant | Key | Use |
|---------|-----|-----|
| Type=main | `2e8d3dd7c848a34638be9b5f4ff09fc65c3c6748` | Primary CTA (pink) |
| Type=alt | `e2fb234f1d160ba6003fd038e41c353c1d6f1747` | Secondary CTA (outline) |
| Type=icon | `df2b2911e0d77392d1aab55f556b432693fd3d78` | Icon-only button (kebab, etc.) |

## Input / Form Component Keys

| Component | Variant | Key |
|-----------|---------|-----|
| Input Fields | Type=Search Button | `11c6f59d5814c59f3d58ae62cfecf39a0a18b25a` |
| Toggle | Type=On, Default | `8cdfc399b4791580c6bf13fc5fa56f77e95b24e4` |
| Action icons | item no.=3 | `d9eb1fd901ef07852b49d189676eee5fd7f40ea0` |
