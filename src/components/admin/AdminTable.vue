<template>
  <div class="admin-table-container">
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th v-for="column in columns" :key="column.key" :class="column.class">
              <div class="d-flex align-items-center justify-content-between">
                {{ column.title }}
                <i v-if="column.sortable"
                   class="bi"
                   :class="getSortIcon(column.key)"
                   @click="handleSort(column.key)"></i>
              </div>
            </th>
            <th v-if="hasActions" class="text-center" style="width: 100px;">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + (hasActions ? 1 : 0)" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary me-2"></div>
              Đang tải...
            </td>
          </tr>
          <tr v-else-if="!data.length">
            <td :colspan="columns.length + (hasActions ? 1 : 0)" class="text-center py-4 text-muted">
              <i class="bi bi-inbox fs-1 d-block mb-2"></i>
              {{ emptyMessage }}
            </td>
          </tr>
          <template v-else>
            <tr v-for="(item, index) in data" :key="getRowKey(item, index)" class="table-row">
              <td v-for="column in columns" :key="column.key" :class="column.class">
                <slot :name="`cell-${column.key}`" :item="item" :value="getNestedValue(item, column.key)" :index="index">
                  {{ formatValue(getNestedValue(item, column.key), column) }}
                </slot>
              </td>
              <td v-if="hasActions" class="text-center">
                <div class="btn-group btn-group-sm">
                  <slot name="actions" :item="item" :index="index">
                    <button class="btn btn-outline-primary btn-sm" @click="$emit('view', item)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning btn-sm" @click="$emit('edit', item)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="$emit('delete', item)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </slot>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && !loading" class="d-flex justify-content-between align-items-center mt-3">
      <div class="text-muted small">
        Hiển thị {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }} -
        {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}
        trong tổng số {{ pagination.total }} kết quả
      </div>
      <nav aria-label="Table pagination">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
            <button class="page-link" @click="$emit('page-change', pagination.current_page - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li v-for="page in visiblePages" :key="page"
              class="page-item"
              :class="{ active: page === pagination.current_page }">
            <button class="page-link" @click="$emit('page-change', page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
            <button class="page-link" @click="$emit('page-change', pagination.current_page + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  title: string
  sortable?: boolean
  format?: 'currency' | 'date' | 'datetime' | 'number' | 'text'
  class?: string
}

interface PaginationData {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  pagination?: PaginationData
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  emptyMessage?: string
  hasActions?: boolean
  rowKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  sortOrder: 'asc',
  emptyMessage: 'Không có dữ liệu',
  hasActions: true,
  rowKey: 'id'
})

const emit = defineEmits(['sort', 'page-change', 'view', 'edit', 'delete'])

// Computed
const visiblePages = computed(() => {
  if (!props.pagination) return []

  const current = props.pagination.current_page
  const last = props.pagination.last_page
  const pages = []

  // Always show first page
  if (current > 3) {
    pages.push(1)
    if (current > 4) pages.push('...')
  }

  // Show pages around current
  for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
    pages.push(i)
  }

  // Always show last page
  if (current < last - 2) {
    if (current < last - 3) pages.push('...')
    pages.push(last)
  }

  return pages.filter((page, index, arr) => arr.indexOf(page) === index)
})

// Methods
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((o, p) => o?.[p], obj)
}

const getRowKey = (item: any, index: number): string | number => {
  return getNestedValue(item, props.rowKey) || index
}

const formatValue = (value: any, column: Column): string => {
  if (value === null || value === undefined) return '-'

  switch (column.format) {
    case 'currency':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(Number(value))

    case 'number':
      return new Intl.NumberFormat('vi-VN').format(Number(value))

    case 'date':
      return new Date(value).toLocaleDateString('vi-VN')

    case 'datetime':
      return new Date(value).toLocaleString('vi-VN')

    default:
      return String(value)
  }
}

const getSortIcon = (columnKey: string): string => {
  if (props.sortBy !== columnKey) return 'bi-arrow-down-up'
  return props.sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'
}

const handleSort = (columnKey: string) => {
  const newOrder = props.sortBy === columnKey && props.sortOrder === 'asc' ? 'desc' : 'asc'
  emit('sort', { column: columnKey, order: newOrder })
}
</script>

<style scoped>
.admin-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

.table th {
  border-top: none;
  font-weight: 600;
  font-size: 0.875rem;
  color: #495057;
  background-color: #f8f9fa !important;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: rgba(13, 110, 253, 0.04);
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.page-link {
  color: #6c757d;
  font-size: 0.875rem;
}

.page-item.active .page-link {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.bi-arrow-down-up,
.bi-arrow-up,
.bi-arrow-down {
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.bi-arrow-down-up:hover,
.bi-arrow-up:hover,
.bi-arrow-down:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .btn-group-sm .btn {
    padding: 0.125rem 0.25rem;
  }
}
</style>
