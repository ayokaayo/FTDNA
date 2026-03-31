# Vue Pattern Reference

> Maps Figma brief vocabulary to Vue production components + props + slot patterns.
> The Vue equivalent of `component-ids.md` — used by coded prototypes and the prototype-generator skill.
> Last synced: 2026-03-31

## How to Use

When a brief or Figma design says **"panel with search"**, look up **panel** below → use `<FTPanel>` with `#actions` slot containing `<FTInput>`.

Components marked 🔜 are planned for vue-components-lib v3.11.0+ (currently local in backoffice-v2).

---

## Shell & Layout

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Side Menu | `<FTSideMenu>` | Global (library) | Section prop determines nav items |
| Breadcrumb (any level) | `<FTBreadcrumbs>` | Global (library) | `:breadcrumbs="[{ type: 'text'\|'link', text, link }]"` |
| Page Header / title bar | `<FTBreadcrumbs>` | Global (library) | Use `#custom-action` slot for CTA buttons |
| Main CTA button | `<FTButton primary>` | Global (library) | Inside `<FTBreadcrumbs #custom-action>` |

## Panels

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Panel (basic) | `<FTPanel>` | Global (library) | `title`, `subTitle`, `#actions` slot for right-side controls |
| Panel with search | `<FTPanel>` | Global (library) | `#actions` slot → `<FTInput v-model="search" placeholder="Search" />` |
| Panel (backoffice, 40px padding) | `<Board>` → 🔜 `<FTPanel>` | `@/components/UI/Board.vue` | Same API. Board's `#right` = FTPanel's `#actions` |
| Collapsible panel | `<Board collapsible>` → 🔜 `<FTPanel collapsible>` | `@/components/UI/Board.vue` | `collapsible` + `isOpen` props |
| Invisible wrapper | `<Board isInvisible>` → 🔜 `<FTPanel transparent>` | `@/components/UI/Board.vue` | Removes background/padding |

## Tabs

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Index tabs (top-level) | `<FTTabs tabStyle="index">` | Global (library) | `:tabs="[{ text, key, type: 'button', active }]"` `@tab-click="handler"`. Wrap in `<div class="tabs-container">` (padding: 20px 0) |
| Text tabs (inside panel) | `<FTTabs tabStyle="text">` | Global (library) | Same tab shape. Used for sub-tabs inside panels |
| Switch tabs | `<FTTabs tabStyle="switch">` | Global (library) | Toggle-style tabs |

## Tables

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Data table | `<FTTable>` | Global (library) | `:heads="[{ label, sortable, sortKey }]"` `:items="data"` `default-sort-key` `default-sort-order` |
| Table with pagination | `<FTTable :with-paging="true">` | Global (library) | Add `:default-page-size="10"` |
| Table row template | `<template #row="item">` | — | Custom `<tr>` inside. Add class `clickable` for hover |
| Display count (no paging) | Plain `<div>` | — | `<div class="display-count">Displaying 1-N of N</div>` — 12px, mono-600 |

## Table Cell Patterns

| Brief says | Vue pattern | Notes |
|---|---|---|
| Plain text | `<td>{{ item.field }}</td>` | Default |
| Status dot | 🔜 `<FTStatusDot :color="item.status" />` | Currently CSS `.status-dot` circle. Colors: green `#3aa935`, orange `#f4a321`, red `#e94f35` |
| Tag / badge | `<FTTag>{{ item.type }}</FTTag>` | Global component |
| Icon | `<FTIcon icon="fas icon-name" />` | Global component |
| Ellipsis menu | `<FTIcon icon="fas ellipsis-vertical" />` | Last column, 56px width, centered |
| Origins / avatars | 🔜 `<FTAvatar>` in `.player-origins` flex | Currently `PlayerAvatar` — 28px circles, -5px overlap margin |
| Checkbox | `<FTCheckbox>` | Global component |
| Toggle | `<FTToggle>` | Global component |

## Cards & Grids

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Card grid | 🔜 `<FTCard>` in flex-wrap container | `@/components/UI/CardListItem.vue` | 3 per row: `width: calc((100% - 32px) / 3)`, `gap: 16px`, `flex-wrap: wrap` |
| Card content | 🔜 `<FTCard>` | — | `title`, `description`, `logoSrc`, `isActive`, `isClickable`. `#footer-left` slot for tags |
| Card (current) | `<CardListItem :item="obj">` | `@/components/UI/CardListItem.vue` | `item: { id, name, logo_url, isEnabled, description, flags, slug }` |

## Empty States

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Placeholder / empty state | 🔜 `<FTPlaceholder>` | `@/components/UI/PlaceholderBox.vue` | `title`, `description`, `size="l"`. `#icon` slot for `<FTIcon icon="fad icon-name" />` |
| Empty state with action | 🔜 `<FTPlaceholder>` | — | Add `#action` slot with `<FTButton>` |

## Form Controls

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Text input | `<FTInput>` | Global | `v-model`, `placeholder`, `preIcon` for search icon |
| Select / dropdown | `<FTSelect>` | Global | `v-model`, `:options`, `placeholder` |
| Checkbox | `<FTCheckbox>` | Global | `v-model`, `label` |
| Radio | `<FTRadio>` | Global | `v-model`, `label`, `value` |
| Toggle | `<FTToggle>` | Global | `v-model`, `label` |
| Date picker | `<FTDatePicker>` | Global | Various modes: time span, specific date |
| Floating label input | `<FTFloatingLabel>` | Global | `v-model`, `label` |

## Feedback & Status

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Alert banner | `<FTAlert>` | Global | `title`, `warning`/`success`/`error`/`info`, `closable` |
| Tooltip | `<FTTooltip>` | Global | Wrap content, `text` prop |
| Spinner / loading | `<FTSpinner>` | Global | Loading indicator |
| Status dot | 🔜 `<FTStatusDot>` | — | `color` ('green'\|'orange'\|'red'\|'default'), `size` (default 12) |
| Avatar | 🔜 `<FTAvatar>` | `@/components/UI/PlayerAvatar.vue` | `src`, `name` (initials fallback), `size` (default 28) |
| Country flag | `<FTFlag>` | Global | `country` prop |

## Buttons

| Brief says | Vue component | Props |
|---|---|---|
| Primary CTA | `<FTButton primary>` | Pink filled |
| Secondary CTA | `<FTButton alt>` | Outline |
| Icon button | `<FTButton icon>` | Icon-only |
| Danger action | `<FTButton danger>` | Red |

## Modals & Overlays

| Brief says | Vue component | Import | Props / Pattern |
|---|---|---|---|
| Modal dialog | `<FTModal>` | Global | `v-model:visible`, `title`, `#default` slot for content |
| Confirm dialog | `<FTConfirm>` | Global | `title`, `message`, `@confirm`, `@cancel` |
| Sliding panel | `<FTSlidingPanel>` | Global | Side drawer overlay |

---

## Common Layout Patterns

### Stats bar (above panel)
```vue
<div class="stats-bar">
  <div v-for="stat in stats" :key="stat.label" class="stat-card">
    <div class="stat-value">{{ stat.value }}</div>
    <div class="stat-label">{{ stat.label }}</div>
  </div>
</div>
```
CSS: flex, gap: 16px, white background, 20px 24px padding.

### Origins column (overlapping avatars)
```vue
<div class="player-origins">
  <FTAvatar v-for="origin in item.origins" :key="origin.id"
    :src="origin.logoImageUrl" :name="origin.name" :size="28"
    class="player-origin" />
</div>
```
CSS: flex-wrap, `.player-origin { margin-right: -5px }`.

### Clickable table row
```vue
<tr class="clickable" @click="$router.push(item.route)">
```
CSS: `cursor: pointer; &:hover td { background: var(--color-mono-100); }`.

---

## Migration Status

| Figma name | Current Vue | Target Vue (library) | Status |
|---|---|---|---|
| panel | Board | FTPanel (enhanced) | 🔜 Phase 2 |
| card-markets | CardListItem | FTCard | 🔜 Phase 1 |
| placeholder | PlaceholderBox | FTPlaceholder | 🔜 Phase 1 |
| avatar/origins | PlayerAvatar | FTAvatar | 🔜 Phase 1 |
| status circle | CSS pattern | FTStatusDot | 🔜 Phase 1 |
| button-btn | FTButton | FTButton | ✅ Aligned |
| table | FTTable | FTTable | ✅ Aligned |
| tab | FTTabs | FTTabs | ✅ Aligned |
| input fields | FTInput | FTInput | ✅ Aligned |
| alert | FTAlert | FTAlert | ✅ Aligned |
| checkbox | FTCheckbox | FTCheckbox | ✅ Aligned |
| radio | FTRadio | FTRadio | ✅ Aligned |
| toggle | FTToggle | FTToggle | ✅ Aligned |
| tag | FTTag | FTTag | ✅ Aligned |
| pagination | FTPaging | FTPaging | ✅ Aligned |
| tooltip | FTTooltip | FTTooltip | ✅ Aligned |
| flag | FTFlag | FTFlag | ✅ Aligned |
