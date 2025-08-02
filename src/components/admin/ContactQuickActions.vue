<template>
  <div class="contact-quick-actions">
    <div class="d-flex gap-2 flex-wrap">
      <!-- Status Quick Filters -->
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          :class="{ active: !activeStatusFilter }"
          @click="$emit('filter-status', '')"
        >
          <i class="bi bi-list-ul me-1"></i>
          Tất cả
          <span class="badge bg-primary ms-1">{{ stats.total }}</span>
        </button>
        <button
          type="button"
          class="btn btn-outline-warning btn-sm"
          :class="{ active: activeStatusFilter === 'pending' }"
          @click="$emit('filter-status', 'pending')"
        >
          <i class="bi bi-clock me-1"></i>
          Chờ xử lý
          <span class="badge bg-warning ms-1">{{ stats.pending }}</span>
        </button>
        <button
          type="button"
          class="btn btn-outline-success btn-sm"
          :class="{ active: activeStatusFilter === 'resolved' }"
          @click="$emit('filter-status', 'resolved')"
        >
          <i class="bi bi-check-circle me-1"></i>
          Đã giải quyết
          <span class="badge bg-success ms-1">{{ stats.resolved }}</span>
        </button>
      </div>

      <!-- Date Quick Filters -->
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn btn-outline-info btn-sm"
          :class="{ active: activeDateFilter === 'today' }"
          @click="$emit('filter-date', 'today')"
        >
          <i class="bi bi-calendar-day me-1"></i>
          Hôm nay
          <span class="badge bg-info ms-1">{{ stats.today }}</span>
        </button>
        <button
          type="button"
          class="btn btn-outline-info btn-sm"
          :class="{ active: activeDateFilter === 'week' }"
          @click="$emit('filter-date', 'week')"
        >
          <i class="bi bi-calendar-week me-1"></i>
          Tuần này
        </button>
        <button
          type="button"
          class="btn btn-outline-info btn-sm"
          :class="{ active: activeDateFilter === 'month' }"
          @click="$emit('filter-date', 'month')"
        >
          <i class="bi bi-calendar-month me-1"></i>
          Tháng này
        </button>
      </div>

      <!-- Bulk Actions -->
      <div class="btn-group" role="group" v-if="hasSelected">
        <button
          type="button"
          class="btn btn-success btn-sm"
          @click="$emit('bulk-resolve')"
          :disabled="bulkActionsDisabled"
        >
          <i class="bi bi-check-circle me-1"></i>
          Đánh dấu đã giải quyết ({{ selectedCount }})
        </button>
        <button
          type="button"
          class="btn btn-danger btn-sm"
          @click="$emit('bulk-delete')"
          :disabled="bulkActionsDisabled"
        >
          <i class="bi bi-trash me-1"></i>
          Xóa ({{ selectedCount }})
        </button>
      </div>

      <!-- Sort Options -->
      <div class="dropdown">
        <button
          class="btn btn-outline-secondary btn-sm dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-sort-down me-1"></i>
          Sắp xếp
        </button>
        <ul class="dropdown-menu">
          <li>
            <button
              class="dropdown-item"
              @click="$emit('sort', 'created_at', 'desc')"
              :class="{ active: sortBy === 'created_at' && sortOrder === 'desc' }"
            >
              <i class="bi bi-calendar me-2"></i>
              Mới nhất
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              @click="$emit('sort', 'created_at', 'asc')"
              :class="{ active: sortBy === 'created_at' && sortOrder === 'asc' }"
            >
              <i class="bi bi-calendar me-2"></i>
              Cũ nhất
            </button>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button
              class="dropdown-item"
              @click="$emit('sort', 'fullname', 'asc')"
              :class="{ active: sortBy === 'fullname' && sortOrder === 'asc' }"
            >
              <i class="bi bi-person me-2"></i>
              Tên A-Z
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              @click="$emit('sort', 'fullname', 'desc')"
              :class="{ active: sortBy === 'fullname' && sortOrder === 'desc' }"
            >
              <i class="bi bi-person me-2"></i>
              Tên Z-A
            </button>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button
              class="dropdown-item"
              @click="$emit('sort', 'status', 'asc')"
              :class="{ active: sortBy === 'status' && sortOrder === 'asc' }"
            >
              <i class="bi bi-flag me-2"></i>
              Theo trạng thái
            </button>
          </li>
        </ul>
      </div>

      <!-- Clear Filters -->
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        @click="$emit('clear-filters')"
        v-if="hasActiveFilters"
      >
        <i class="bi bi-x-circle me-1"></i>
        Xóa bộ lọc
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stats: {
    total: number
    pending: number
    resolved: number
    today: number
  }
  activeStatusFilter?: string
  activeDateFilter?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  hasSelected?: boolean
  selectedCount?: number
  bulkActionsDisabled?: boolean
  hasActiveFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  activeStatusFilter: '',
  activeDateFilter: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
  hasSelected: false,
  selectedCount: 0,
  bulkActionsDisabled: false,
  hasActiveFilters: false
})

defineEmits<{
  'filter-status': [status: string]
  'filter-date': [period: string]
  'bulk-resolve': []
  'bulk-delete': []
  'sort': [field: string, order: 'asc' | 'desc']
  'clear-filters': []
}>()
</script>

<style scoped>
.contact-quick-actions {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
}

.btn-group .btn {
  position: relative;
}

.btn .badge {
  font-size: 0.65rem;
}

.dropdown-item.active {
  background-color: #e9ecef;
  color: #495057;
}

.dropdown-item.active i {
  color: #0d6efd;
}

@media (max-width: 768px) {
  .contact-quick-actions .d-flex {
    flex-direction: column;
    gap: 0.5rem !important;
  }

  .btn-group {
    width: 100%;
  }

  .btn-group .btn {
    flex: 1;
  }
}
</style>
