# Table

The `FTTable` component displays data in a structured tabular format with sorting, row selection, striped/hoverable rows, sticky headers, and custom cell rendering via scoped slots. Maps to the **Table** section in DSP-Master (25 variants).

## Usage

### Composition API (script setup)

```vue
<script setup lang="ts">
import { FTTable } from '@fasttrack-solutions/vue-components-lib'
import type { TableColumn } from '@fasttrack-solutions/vue-components-lib'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]

const data = [
  { id: 1, name: 'Alice', email: 'alice@ft.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@ft.com', role: 'Editor' },
]
</script>

<template>
  <FTTable :columns="columns" :data="data" />
</template>
```

## Default

<script setup>
import { ref } from 'vue'

const cols = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 1, name: 'Alice Johnson', email: 'alice@fasttrack.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@fasttrack.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol Davis', email: 'carol@fasttrack.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Wilson', email: 'david@fasttrack.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eve Brown', email: 'eve@fasttrack.com', role: 'Admin', status: 'Active' },
]

const selectedRows = ref([])

const colsAlign = [
  { key: 'name', label: 'Player', sortable: true },
  { key: 'score', label: 'Score', align: 'right', sortable: true },
  { key: 'games', label: 'Games', align: 'right' },
  { key: 'winRate', label: 'Win Rate', align: 'right' },
]

const rowsAlign = [
  { id: 1, name: 'Player A', score: 2450, games: 128, winRate: '67%' },
  { id: 2, name: 'Player B', score: 2380, games: 95, winRate: '72%' },
  { id: 3, name: 'Player C', score: 2210, games: 156, winRate: '58%' },
  { id: 4, name: 'Player D', score: 2150, games: 74, winRate: '81%' },
]
</script>

A basic table with sortable columns. Click a column header to sort.

<div class="demo" style="padding: 0; border: none; background: transparent;">
  <FTTable :columns="cols" :data="rows" />
</div>

```vue
<FTTable :columns="columns" :data="data" />
```

## Striped

Alternating row backgrounds for better readability.

<div class="demo" style="padding: 0; border: none; background: transparent;">
  <FTTable :columns="cols" :data="rows" striped />
</div>

```vue
<FTTable :columns="columns" :data="data" striped />
```

## Compact

Tighter row padding for dense data.

<div class="demo" style="padding: 0; border: none; background: transparent;">
  <FTTable :columns="cols" :data="rows" compact striped />
</div>

```vue
<FTTable :columns="columns" :data="data" compact />
```

## Selectable Rows

Checkboxes for row selection with header "select all".

<div class="demo" style="padding: 0; border: none; background: transparent;">
  <FTTable :columns="cols" :data="rows" selectable v-model:selected="selectedRows" />
  <p style="padding: 12px 16px; font-size: 12px; color: var(--ft-color-on-surface-secondary);">
    Selected: {{ selectedRows.length }} row(s)
  </p>
</div>

```vue
<FTTable
  :columns="columns"
  :data="data"
  selectable
  v-model:selected="selectedRows"
/>
```

## Column Alignment

Columns support `left` (default), `center`, and `right` alignment.

<div class="demo" style="padding: 0; border: none; background: transparent;">
  <FTTable :columns="colsAlign" :data="rowsAlign" striped />
</div>

```vue
const columns = [
  { key: 'name', label: 'Player', sortable: true },
  { key: 'score', label: 'Score', align: 'right', sortable: true },
  { key: 'games', label: 'Games', align: 'right' },
  { key: 'winRate', label: 'Win Rate', align: 'right' },
]
```

## Custom Cell Rendering

Use scoped slots to render custom content in cells.

<div class="demo" style="padding: 0; border: none; background: transparent;">
  <FTTable :columns="cols" :data="rows">
    <template #cell-status="{ value }">
      <FTTag :success="value === 'Active'" :secondary="value === 'Inactive'">
        {{ value }}
      </FTTag>
    </template>
  </FTTable>
</div>

```vue
<FTTable :columns="columns" :data="data">
  <template #cell-status="{ value }">
    <FTTag :success="value === 'Active'">{{ value }}</FTTag>
  </template>
</FTTable>
```

## Empty State

Shows a message when there's no data.

<div class="demo" style="padding: 0; border: none; background: transparent;">
  <FTTable :columns="cols" :data="[]" empty-text="No players found" />
</div>

## Loading

An overlay spinner while data is being fetched.

<div class="demo" style="padding: 0; border: none; background: transparent;">
  <FTTable :columns="cols" :data="rows" loading />
</div>

```vue
<FTTable :columns="columns" :data="data" loading />
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | — | Column definitions (required) |
| `data` | `Record<string, unknown>[]` | `[]` | Row data |
| `striped` | `boolean` | `false` | Alternating row backgrounds |
| `hoverable` | `boolean` | `true` | Highlight rows on hover |
| `compact` | `boolean` | `false` | Compact row padding |
| `loading` | `boolean` | `false` | Show loading overlay |
| `stickyHeader` | `boolean` | `false` | Sticky header on scroll |
| `selectable` | `boolean` | `false` | Show row selection checkboxes |
| `selected` | `(string \| number)[]` | `[]` | Selected row keys (v-model:selected) |
| `rowKey` | `string` | `'id'` | Property name used as unique row identifier |
| `emptyText` | `string` | `'No data available'` | Text shown when data is empty |
| `ariaLabel` | `string` | `'Data table'` | Accessible label |

### TableColumn

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | yes | Data property key |
| `label` | `string` | yes | Header display text |
| `sortable` | `boolean` | no | Enable sorting on this column |
| `width` | `string` | no | Column width (CSS value) |
| `align` | `'left' \| 'center' \| 'right'` | no | Text alignment (default: left) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `sort` | `(key: string, direction: 'asc' \| 'desc' \| null)` | Column sort changed |
| `row-click` | `(row: object, index: number)` | Row clicked |
| `update:selected` | `(string \| number)[]` | Selection changed (v-model:selected) |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `cell-{key}` | `{ row, value, index }` | Custom cell rendering per column |
| `empty` | — | Custom empty state |
| `footer` | — | Footer area (e.g., for pagination) |

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--ft-table-font-size` | `14px` | Body text size |
| `--ft-table-border-color` | `var(--ft-color-border-base)` | Outer border |
| `--ft-table-border-radius` | `4px` | Wrapper corner radius |
| `--ft-table-bg` | `var(--ft-color-neutral-white-50)` | Table background |
| `--ft-table-head-bg` | `var(--ft-color-surface-tertiary)` | Header background |
| `--ft-table-head-fg` | `var(--ft-color-on-surface-base)` | Header text color |
| `--ft-table-head-font-size` | `12px` | Header text size |
| `--ft-table-cell-padding` | `12px 16px` | Cell padding |
| `--ft-table-cell-padding-compact` | `8px 16px` | Compact cell padding |
| `--ft-table-stripe-bg` | `var(--ft-color-surface-secondary)` | Striped row background |
| `--ft-table-hover-bg` | `var(--ft-color-neutral-lightest)` | Hover row background |
| `--ft-table-selected-bg` | `var(--ft-color-primary-lightest)` | Selected row background |
| `--ft-table-sort-icon-color-active` | `var(--ft-color-primary-base)` | Active sort icon |
| `--ft-table-empty-color` | `var(--ft-color-on-surface-tertiary)` | Empty state text |

## Accessibility

- Uses semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` elements
- Sortable headers include `aria-sort` attribute
- "Select all" checkbox has `aria-label`
- Row checkboxes have `aria-label` with row number
- Loading state uses `role="status"`
- Focus visible on interactive elements

## Figma Reference

- **DSP-Master:** Table (25 variants)
- **Variants:** Type=Default/Striped/Compact, Status=Default/Hover/Selected
