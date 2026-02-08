<template>
  <div class="ft-paging">
    <!-- LEFT SIDE: Info and dropdown -->
    <div class="ft-paging__info">
      <div class="ft-paging__tag">
        {{ currentPage }}/{{ totalPages }}
      </div>
      <div class="ft-paging__tag ft-paging__tag--dropdown">
        {{ itemsPerPage }} items per page
        <i class="fas fa-caret-down"></i>
        <select
          v-model.number="localItemsPerPage"
          @change="changePageSize"
          class="ft-paging__select"
          aria-label="Items per page"
        >
          <option
            v-for="size in pageSizeOptions"
            :key="size"
            :value="size"
          >
            {{ size }}
          </option>
        </select>
      </div>
    </div>

    <!-- RIGHT SIDE: Navigation -->
    <div class="ft-paging__nav">
      <button
        class="ft-paging__btn ft-paging__btn--prev"
        @click="prevPage"
        :disabled="currentPage === 1"
        aria-label="Previous page"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="ft-paging__pages">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'ft-paging__page',
            { 'ft-paging__page--active': page === currentPage }
          ]"
          :aria-label="`Go to page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </button>

        <span
          v-if="showEllipsis"
          class="ft-paging__ellipsis"
          aria-hidden="true"
        >
          ...
        </span>
      </div>

      <button
        class="ft-paging__btn ft-paging__btn--next"
        @click="nextPage"
        :disabled="currentPage === totalPages"
        aria-label="Next page"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  totalItems: number
  itemsPerPage?: number
  modelValue?: number
  totalPages?: number
  pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 6,
  modelValue: 1,
  pageSizeOptions: () => [6, 12, 24, 48]
})

const emit = defineEmits<{
  'update:modelValue': [page: number]
  'update:itemsPerPage': [size: number]
}>()

// Local state
const currentPage = ref(props.modelValue)
const localItemsPerPage = ref(props.itemsPerPage)

// Computed properties
const calculatedTotalPages = computed(() => {
  return Math.ceil(props.totalItems / localItemsPerPage.value)
})

const totalPages = computed(() => {
  return props.totalPages || calculatedTotalPages.value
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5

  if (totalPages.value <= maxVisible) {
    // Show all pages if 5 or fewer
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Show page 2 if not showing it elsewhere
    if (currentPage.value > 3) {
      pages.push(2)
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage.value - 1)
    const endPage = Math.min(totalPages.value - 1, currentPage.value + 1)

    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Always show last page
    pages.push(totalPages.value)
  }

  return pages.sort((a, b) => a - b)
})

const showEllipsis = computed(() => {
  return totalPages.value > 5 && !visiblePages.value.includes(totalPages.value - 1)
})

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emit('update:modelValue', page)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const changePageSize = () => {
  emit('update:itemsPerPage', localItemsPerPage.value)
  // Reset to page 1 when changing page size
  goToPage(1)
}
</script>

<style>
:root {
  --ft-color-mono-200: #f5f5f5;
  --ft-color-mono-500: #959595;
  --ft-color-mono-700: #2c2c2c;
  --ft-color-brand-pink-400: #E96092;
  --ft-color-white: #ffffff;
  --ft-paging-tag-height: 24px;
  --ft-paging-tag-padding: 0 8px;
  --ft-paging-tag-radius: 4px;
  --ft-paging-tag-font-size: 12px;
  --ft-paging-tag-font-weight: 700;
  --ft-paging-tag-font-family: 'Inter', sans-serif;
  --ft-paging-btn-size: 24px;
  --ft-paging-btn-radius: 4px;
  --ft-paging-page-font-size: 10px;
  --ft-paging-page-font-weight: 700;
  --ft-paging-page-font-family: 'Inter', sans-serif;
  --ft-paging-gap: 8px;
  --ft-paging-height: 42px;
}
</style>

<style scoped>
.ft-paging {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--ft-paging-height);
  gap: var(--ft-paging-gap);
}

.ft-paging__info {
  display: flex;
  align-items: center;
  gap: var(--ft-paging-gap);
}

.ft-paging__tag {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--ft-paging-tag-height);
  padding: var(--ft-paging-tag-padding);
  background-color: var(--ft-color-mono-200);
  border-radius: var(--ft-paging-tag-radius);
  font-family: var(--ft-paging-tag-font-family);
  font-size: var(--ft-paging-tag-font-size);
  font-weight: var(--ft-paging-tag-font-weight);
  color: var(--ft-color-mono-700);
}

.ft-paging__tag--dropdown {
  position: relative;
  cursor: pointer;
}

.ft-paging__select {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.ft-paging__nav {
  display: flex;
  align-items: center;
  gap: var(--ft-paging-gap);
}

.ft-paging__pages {
  display: flex;
  align-items: center;
  gap: var(--ft-paging-gap);
}

.ft-paging__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-paging-btn-size);
  height: var(--ft-paging-btn-size);
  border: none;
  background-color: transparent;
  color: var(--ft-color-mono-700);
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.2s ease;
}

.ft-paging__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ft-paging__btn:not(:disabled):hover {
  opacity: 0.7;
}

.ft-paging__page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ft-paging-btn-size);
  height: var(--ft-paging-btn-size);
  border: none;
  border-radius: var(--ft-paging-btn-radius);
  background-color: transparent;
  font-family: var(--ft-paging-page-font-family);
  font-size: var(--ft-paging-page-font-size);
  font-weight: var(--ft-paging-page-font-weight);
  color: var(--ft-color-mono-500);
  cursor: pointer;
  transition: all 0.2s ease;
}

.ft-paging__page:hover:not(.ft-paging__page--active) {
  background-color: var(--ft-color-mono-200);
}

.ft-paging__page--active {
  background-color: var(--ft-color-brand-pink-400);
  color: var(--ft-color-white);
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.ft-paging__ellipsis {
  padding: 0 4px;
  color: var(--ft-color-mono-500);
  font-family: var(--ft-paging-page-font-family);
  font-size: var(--ft-paging-page-font-size);
}
</style>
