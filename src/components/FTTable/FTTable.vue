<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Column definition for the table.
 */
export interface TableColumn {
  /** Unique key matching the data property */
  key: string
  /** Display header text */
  label: string
  /** Whether this column is sortable */
  sortable?: boolean
  /** Column width (CSS value) */
  width?: string
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
}

type SortDirection = 'asc' | 'desc' | null

interface FTTableProps {
  /** Column definitions */
  columns: TableColumn[]
  /** Row data — array of objects keyed by column.key */
  data?: Record<string, unknown>[]
  /** Enable striped rows */
  striped?: boolean
  /** Enable row hover highlight */
  hoverable?: boolean
  /** Compact row height */
  compact?: boolean
  /** Show loading state */
  loading?: boolean
  /** Sticky header on scroll */
  stickyHeader?: boolean
  /** Enable row selection via checkboxes */
  selectable?: boolean
  /** Currently selected row keys (v-model:selected) */
  selected?: (string | number)[]
  /** Row key property for selection tracking */
  rowKey?: string
  /** Text shown when data is empty */
  emptyText?: string
  /** Accessible label for the table */
  ariaLabel?: string
}

const props = withDefaults(defineProps<FTTableProps>(), {
  data: () => [],
  striped: false,
  hoverable: true,
  compact: false,
  loading: false,
  stickyHeader: false,
  selectable: false,
  selected: () => [],
  rowKey: 'id',
  emptyText: 'No data available',
  ariaLabel: 'Data table',
})

const emit = defineEmits<{
  'sort': [key: string, direction: SortDirection]
  'row-click': [row: Record<string, unknown>, index: number]
  'update:selected': [keys: (string | number)[]]
}>()

const sortKey = ref<string | null>(null)
const sortDirection = ref<SortDirection>(null)

const tableClasses = computed(() => ({
  'ft-table': true,
  'ft-table--striped': props.striped,
  'ft-table--hoverable': props.hoverable,
  'ft-table--compact': props.compact,
  'ft-table--sticky-header': props.stickyHeader,
  'ft-table--loading': props.loading,
}))

const sortedData = computed(() => {
  if (!sortKey.value || !sortDirection.value) return props.data

  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value!]
    const bVal = b[sortKey.value!]

    if (aVal === bVal) return 0
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
    return sortDirection.value === 'desc' ? -comparison : comparison
  })
})

const allSelected = computed(() =>
  props.data.length > 0 && props.selected.length === props.data.length
)

const someSelected = computed(() =>
  props.selected.length > 0 && props.selected.length < props.data.length
)

const handleSort = (column: TableColumn) => {
  if (!column.sortable) return

  if (sortKey.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : sortDirection.value === 'desc' ? null : 'asc'
    if (!sortDirection.value) sortKey.value = null
  } else {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  }

  emit('sort', column.key, sortDirection.value)
}

const handleRowClick = (row: Record<string, unknown>, index: number) => {
  emit('row-click', row, index)
}

const getRowKey = (row: Record<string, unknown>): string | number => {
  return (row[props.rowKey] as string | number) ?? ''
}

const isRowSelected = (row: Record<string, unknown>): boolean => {
  return props.selected.includes(getRowKey(row))
}

const toggleRow = (row: Record<string, unknown>) => {
  const key = getRowKey(row)
  const updated = isRowSelected(row)
    ? props.selected.filter(k => k !== key)
    : [...props.selected, key]
  emit('update:selected', updated)
}

const toggleAll = () => {
  if (allSelected.value) {
    emit('update:selected', [])
  } else {
    emit('update:selected', props.data.map(getRowKey))
  }
}

const headerClasses = (column: TableColumn) => ({
  'ft-table__th': true,
  'ft-table__th--sortable': column.sortable,
  'ft-table__th--sorted': sortKey.value === column.key,
  [`ft-table__th--${column.align || 'left'}`]: true,
})

const cellClasses = (column: TableColumn) => ({
  'ft-table__td': true,
  [`ft-table__td--${column.align || 'left'}`]: true,
})

const sortIcon = (column: TableColumn) => {
  if (sortKey.value !== column.key || !sortDirection.value) return 'fa-sort'
  return sortDirection.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}
</script>

<template>
  <div class="ft-table__wrapper">
    <!-- Loading overlay -->
    <div v-if="loading" class="ft-table__loading" role="status" aria-label="Loading">
      <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
    </div>

    <table :class="tableClasses" :aria-label="ariaLabel">
      <!-- Header -->
      <thead class="ft-table__head">
        <tr>
          <th v-if="selectable" class="ft-table__th ft-table__th--checkbox">
            <input
              type="checkbox"
              class="ft-table__checkbox"
              :checked="allSelected"
              :indeterminate="someSelected"
              aria-label="Select all rows"
              @change="toggleAll"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="headerClasses(col)"
            :style="col.width ? { width: col.width } : undefined"
            :aria-sort="sortKey === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined"
            @click="handleSort(col)"
          >
            <span class="ft-table__th-content">
              {{ col.label }}
              <i
                v-if="col.sortable"
                :class="['fas', sortIcon(col), 'ft-table__sort-icon']"
                aria-hidden="true"
              ></i>
            </span>
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody class="ft-table__body">
        <tr
          v-for="(row, index) in sortedData"
          :key="getRowKey(row)"
          class="ft-table__row"
          :class="{ 'ft-table__row--selected': selectable && isRowSelected(row) }"
          @click="handleRowClick(row, index)"
        >
          <td v-if="selectable" class="ft-table__td ft-table__td--checkbox">
            <input
              type="checkbox"
              class="ft-table__checkbox"
              :checked="isRowSelected(row)"
              :aria-label="`Select row ${index + 1}`"
              @click.stop
              @change="toggleRow(row)"
            />
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            :class="cellClasses(col)"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="index">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-if="sortedData.length === 0 && !loading">
          <td :colspan="columns.length + (selectable ? 1 : 0)" class="ft-table__empty">
            <slot name="empty">
              {{ emptyText }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Footer slot (e.g., for paging) -->
    <div v-if="$slots.footer" class="ft-table__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<!-- Unscoped: CSS custom property definitions -->
<style>
:root {
  /* FTTable — component-level variables */

  /* General */
  --ft-table-font-family: var(--ft-font-family-text, 'Inter', sans-serif);
  --ft-table-font-size: 14px;
  --ft-table-line-height: 20px;
  --ft-table-border-color: var(--ft-color-border-base);
  --ft-table-border-radius: 4px;
  --ft-table-bg: var(--ft-color-neutral-white-50, #ffffff);

  /* Header */
  --ft-table-head-bg: transparent;
  --ft-table-head-fg: var(--ft-color-on-surface-base);
  --ft-table-head-font-size: 14px;
  --ft-table-head-font-weight: var(--ft-font-weight-bold, 700);
  --ft-table-head-line-height: 20px;
  --ft-table-head-height: 40px;
  --ft-table-head-padding: 0 16px;
  --ft-table-head-border-color: var(--ft-color-border-subtle);
  --ft-table-head-sort-gap: 4px;

  /* Body */
  --ft-table-cell-padding: 8px 16px;
  --ft-table-cell-padding-compact: 4px 16px;
  --ft-table-cell-fg: var(--ft-color-on-surface-base);
  --ft-table-row-border-color: var(--ft-color-border-subtle);

  /* Striped */
  --ft-table-stripe-bg: var(--ft-color-surface-secondary);

  /* Hover */
  --ft-table-hover-bg: var(--ft-color-neutral-lightest);

  /* Selected */
  --ft-table-selected-bg: var(--ft-color-primary-lightest);

  /* Sort */
  --ft-table-sort-icon-size: 16px;
  --ft-table-sort-icon-container: 20px;
  --ft-table-sort-icon-color: var(--ft-color-on-surface-tertiary);
  --ft-table-sort-icon-color-active: var(--ft-color-primary-base);

  /* Loading */
  --ft-table-loading-overlay: rgba(255, 255, 255, 0.7);
  --ft-table-loading-icon-size: 24px;
  --ft-table-loading-icon-color: var(--ft-color-primary-base);

  /* Empty state */
  --ft-table-empty-padding: 40px 16px;
  --ft-table-empty-color: var(--ft-color-on-surface-tertiary);

  /* Checkbox */
  --ft-table-checkbox-size: 16px;

  /* Footer */
  --ft-table-footer-padding: 12px 16px;
  --ft-table-footer-border-color: var(--ft-color-border-base);
}
</style>

<!-- Scoped: component styles -->
<style scoped>
.ft-table__wrapper {
  position: relative;
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--ft-table-border-color);
  border-radius: var(--ft-table-border-radius);
  background: var(--ft-table-bg);
}

/* ── Table ── */
.ft-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ft-table-font-family);
  font-size: var(--ft-table-font-size);
  line-height: var(--ft-table-line-height);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
  table-layout: auto;
}

/* ── Header ── */
.ft-table__head {
  background: var(--ft-table-head-bg);
}

.ft-table__th {
  height: var(--ft-table-head-height);
  padding: var(--ft-table-head-padding);
  font-size: var(--ft-table-head-font-size);
  font-weight: var(--ft-table-head-font-weight);
  line-height: var(--ft-table-head-line-height);
  color: var(--ft-table-head-fg);
  white-space: nowrap;
  border-bottom: 1px solid var(--ft-table-head-border-color);
  user-select: none;
}

.ft-table__th--left { text-align: left; }
.ft-table__th--center { text-align: center; }
.ft-table__th--right { text-align: right; }

.ft-table__th--sortable {
  cursor: pointer;
  transition: color 150ms ease;
}

.ft-table__th--sortable:hover {
  color: var(--ft-table-sort-icon-color-active);
}

.ft-table__th-content {
  display: inline-flex;
  align-items: center;
  gap: var(--ft-table-head-sort-gap);
}

.ft-table__sort-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-table-sort-icon-container);
  height: var(--ft-table-sort-icon-container);
  font-size: var(--ft-table-sort-icon-size);
  color: var(--ft-table-sort-icon-color);
  transition: color 150ms ease;
}

.ft-table__th--sorted .ft-table__sort-icon {
  color: var(--ft-table-sort-icon-color-active);
}

/* ── Body ── */
.ft-table__td {
  padding: var(--ft-table-cell-padding);
  color: var(--ft-table-cell-fg);
  border-bottom: 1px solid var(--ft-table-row-border-color);
  vertical-align: middle;
}

.ft-table--compact .ft-table__td {
  padding: var(--ft-table-cell-padding-compact);
}

.ft-table__td--left { text-align: left; }
.ft-table__td--center { text-align: center; }
.ft-table__td--right { text-align: right; }

.ft-table__row:last-child .ft-table__td {
  border-bottom: none;
}

/* ── Striped ── */
.ft-table--striped .ft-table__row:nth-child(even) {
  background: var(--ft-table-stripe-bg);
}

/* ── Hover ── */
.ft-table--hoverable .ft-table__row:hover {
  background: var(--ft-table-hover-bg);
}

/* ── Selected ── */
.ft-table__row--selected {
  background: var(--ft-table-selected-bg);
}

.ft-table--hoverable .ft-table__row--selected:hover {
  background: var(--ft-table-selected-bg);
}

/* ── Sticky header ── */
.ft-table--sticky-header .ft-table__head .ft-table__th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--ft-table-head-bg);
}

/* ── Checkbox ── */
.ft-table__th--checkbox,
.ft-table__td--checkbox {
  width: 48px;
  text-align: center;
}

.ft-table__checkbox {
  width: var(--ft-table-checkbox-size);
  height: var(--ft-table-checkbox-size);
  cursor: pointer;
  accent-color: var(--ft-color-primary-base);
}

/* ── Loading overlay ── */
.ft-table__loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ft-table-loading-overlay);
  font-size: var(--ft-table-loading-icon-size);
  color: var(--ft-table-loading-icon-color);
}

.ft-table--loading {
  min-height: 120px;
}

/* ── Empty ── */
.ft-table__empty {
  padding: var(--ft-table-empty-padding);
  text-align: center;
  color: var(--ft-table-empty-color);
  font-size: var(--ft-table-font-size);
}

/* ── Footer ── */
.ft-table__footer {
  padding: var(--ft-table-footer-padding);
  border-top: 1px solid var(--ft-table-footer-border-color);
}
</style>
