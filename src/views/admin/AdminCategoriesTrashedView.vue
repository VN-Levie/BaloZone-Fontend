<template>
  <AdminLayout>
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-0 text-gray-800">
            <i class="bi bi-trash3 me-2"></i>Thùng Rác Danh Mục
          </h1>
          <p class="mb-0 text-muted">Quản lý các danh mục đã xóa</p>
        </div>
        <div class="d-flex gap-2">
          <router-link to="/admin/categories" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left me-2"></i>Quay lại danh sách
          </router-link>
        </div>
      </div>

      <!-- Stats -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card border-left-warning">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Đã xóa tạm
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ stats.trashedCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-trash3-fill fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-left-info">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Có thể khôi phục
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ stats.canRestoreCount }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-arrow-clockwise fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">
            <i class="bi bi-funnel me-2"></i>Tìm kiếm và Lọc
          </h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="search" class="form-label">Tìm kiếm</label>
                <div class="input-group">
                  <input id="search" type="text" class="form-control" placeholder="Tên danh mục..." v-model="searchTerm" @input="debounceSearch">
                  <button class="btn btn-outline-secondary" type="button" @click="clearSearch">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="sortBy" class="form-label">Sắp xếp theo</label>
                <select id="sortBy" class="form-select" v-model="sortBy" @change="fetchCategories">
                  <option value="deleted_at">Ngày xóa</option>
                  <option value="name">Tên danh mục</option>
                  <option value="created_at">Ngày tạo</option>
                </select>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="sortOrder" class="form-label">Thứ tự</label>
                <select id="sortOrder" class="form-select" v-model="sortOrder" @change="fetchCategories">
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="perPage" class="form-label">Hiển thị</label>
                <select id="perPage" class="form-select" v-model="perPage" @change="changePerPage">
                  <option value="10">10 mục</option>
                  <option value="25">25 mục</option>
                  <option value="50">50 mục</option>
                  <option value="100">100 mục</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Table -->
      <div class="card shadow">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 class="m-0 font-weight-bold text-primary">
            <i class="bi bi-table me-2"></i>Danh Sách Danh Mục Đã Xóa
          </h6>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-success" @click="restoreAllCategories" :disabled="loading || selectedCategories.length === 0" v-if="selectedCategories.length > 0">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Khôi phục đã chọn ({{ selectedCategories.length }})
            </button>
            <button class="btn btn-sm btn-danger" @click="forceDeleteAllCategories" :disabled="loading || selectedCategories.length === 0" v-if="selectedCategories.length > 0">
              <i class="bi bi-trash3-fill me-1"></i>
              Xóa vĩnh viễn đã chọn ({{ selectedCategories.length }})
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-4">
            <LoadingSpinner />
          </div>

          <!-- Error -->
          <div v-else-if="error" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
            <button class="btn btn-sm btn-outline-danger ms-2" @click="fetchCategories">
              Thử lại
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="!categories.length" class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <h5 class="mt-3 text-muted">Không có danh mục nào trong thùng rác</h5>
            <p class="text-muted">Thùng rác đang trống.</p>
          </div>

          <!-- Categories Table -->
          <div v-else class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="table-light">
                <tr>
                  <th style="width: 40px;">
                    <input type="checkbox" class="form-check-input" v-model="selectAll" @change="toggleSelectAll">
                  </th>
                  <th>Hình ảnh</th>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Ngày tạo</th>
                  <th>Ngày xóa</th>
                  <th style="width: 200px;">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categories" :key="category.id">
                  <td>
                    <input type="checkbox" class="form-check-input" :value="category.id" v-model="selectedCategories">
                  </td>
                  <td>
                    <img :src="category.image || 'https://placehold.co/600x400?text=img'" :alt="category.name" class="img-thumbnail category-image" style="width: 50px; height: 50px; object-fit: cover;">
                  </td>
                  <td>
                    <strong>{{ category.name }}</strong>
                    <div class="text-muted small" v-if="category.description">
                      {{ truncateText(category.description, 50) }}
                    </div>
                  </td>
                  <td>
                    <code class="text-muted">{{ category.slug }}</code>
                  </td>
                  <td>
                    <small class="text-muted">
                      {{ formatDate(category.created_at) }}
                    </small>
                  </td>
                  <td>
                    <small class="text-warning">
                      {{ formatDate(category.deleted_at || '') }}
                    </small>
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <button class="btn btn-sm btn-success" @click="restoreCategory(category)" :disabled="loading" title="Khôi phục">
                        <i class="bi bi-arrow-clockwise"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" @click="confirmForceDelete(category)" :disabled="loading" title="Xóa vĩnh viễn">
                        <i class="bi bi-trash3-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav v-if="pagination.last_page > 1" aria-label="Categories pagination">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: pagination.current_page <= 1 }">
                <button class="page-link" @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>

              <template v-for="page in getVisiblePages()" :key="page">
                <li v-if="page === '...'" class="page-item disabled">
                  <span class="page-link">...</span>
                </li>
                <li v-else class="page-item" :class="{ active: page === pagination.current_page }">
                  <button class="page-link" @click="changePage(typeof page === 'number' ? page : pagination.current_page)" :disabled="page === pagination.current_page">
                    {{ page }}
                  </button>
                </li>
              </template>

              <li class="page-item" :class="{ disabled: pagination.current_page >= pagination.last_page }">
                <button class="page-link" @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Force Delete Confirmation Modal -->
      <div v-if="showForceDeleteModal" class="modal-overlay" @click="showForceDeleteModal = false">
        <div class="modal-dialog" @click.stop>
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Xác nhận xóa vĩnh viễn
              </h5>
              <button type="button" class="btn-close btn-close-white" @click="showForceDeleteModal = false" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
              </div>
              <p v-if="categoryToForceDelete">
                Bạn có chắc chắn muốn xóa vĩnh viễn danh mục
                <strong>"{{ categoryToForceDelete.name }}"</strong>?
              </p>
              <p v-else-if="selectedCategories.length > 0">
                Bạn có chắc chắn muốn xóa vĩnh viễn
                <strong>{{ selectedCategories.length }}</strong> danh mục đã chọn?
              </p>
              <p class="text-muted">Danh mục sẽ bị xóa hoàn toàn khỏi hệ thống.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showForceDeleteModal = false" :disabled="loading">
                Hủy
              </button>
              <button type="button" class="btn btn-danger" @click="executeForceDelete" :disabled="loading">
                <LoadingSpinner v-if="loading" size="sm" />
                <i v-else class="bi bi-trash3-fill me-2"></i>
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Category, ApiResponse, PaginationMeta } from '@/types'
import { adminCategoriesApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { formatDate, truncateText } from '@/utils'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Router and toast
const router = useRouter()
const { showToast } = useToast()

// Data
const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref('')

// Search and filters
const searchTerm = ref('')
const sortBy = ref('deleted_at')
const sortOrder = ref('desc')
const perPage = ref(25)

// Pagination
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 25,
  total: 0,
  from: 0,
  to: 0
})

// Selection
const selectedCategories = ref<number[]>([])
const selectAll = ref(false)

// Modal
const showForceDeleteModal = ref(false)
const categoryToForceDelete = ref<Category | null>(null)

// Search debounce timer
let searchTimer: number | null = null

// Stats
const stats = computed(() => ({
  trashedCount: pagination.value.total,
  canRestoreCount: categories.value.length
}))

// Methods
const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page: pagination.value.current_page,
      per_page: perPage.value,
      search: searchTerm.value || undefined,
      sort_by: sortBy.value,
      sort_order: sortOrder.value
    }

    const response = await adminCategoriesApi.getTrashed(params)

    if (response.success && response.data) {
      categories.value = response.data.data || []
      // Extract pagination from response.data
      pagination.value = {
        current_page: response.data.current_page || 1,
        last_page: response.data.last_page || 1,
        per_page: response.data.per_page || 25,
        total: response.data.total || 0,
        from: response.data.from || 0,
        to: response.data.to || 0
      }
    } else {
      throw new Error(response.message || 'Không thể tải danh sách danh mục')
    }
  } catch (err: any) {
    error.value = err.message || 'Có lỗi xảy ra khi tải danh mục'
    showToast('Có lỗi xảy ra khi tải danh mục', 'error')
  } finally {
    loading.value = false
  }
}

const debounceSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = window.setTimeout(() => {
    pagination.value.current_page = 1
    fetchCategories()
  }, 500)
}

const clearSearch = () => {
  searchTerm.value = ''
  pagination.value.current_page = 1
  fetchCategories()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    fetchCategories()
  }
}

const changePerPage = () => {
  pagination.value.current_page = 1
  fetchCategories()
}

const getVisiblePages = () => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < last - 1) {
    rangeWithDots.push('...', last)
  } else if (last > 1) {
    rangeWithDots.push(last)
  }

  return rangeWithDots
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedCategories.value = categories.value.map(c => c.id)
  } else {
    selectedCategories.value = []
  }
}

const restoreCategory = async (category: Category) => {
  try {
    loading.value = true

    const response = await adminCategoriesApi.restore(category.id)

    if (response.success) {
      showToast('Danh mục đã được khôi phục thành công', 'success')
      await fetchCategories()
      // Remove from selection if it was selected
      selectedCategories.value = selectedCategories.value.filter(id => id !== category.id)
    } else {
      throw new Error(response.message || 'Không thể khôi phục danh mục')
    }
  } catch (err: any) {
    showToast(err.message || 'Có lỗi xảy ra khi khôi phục danh mục', 'error')
  } finally {
    loading.value = false
  }
}

const restoreAllCategories = async () => {
  if (selectedCategories.value.length === 0) return

  try {
    loading.value = true

    // Restore categories one by one
    const promises = selectedCategories.value.map(id =>
      adminCategoriesApi.restore(id)
    )

    const results = await Promise.allSettled(promises)
    const successful = results.filter(r => r.status === 'fulfilled').length

    if (successful > 0) {
      showToast(`Đã khôi phục thành công ${successful} danh mục`, 'success')
      selectedCategories.value = []
      selectAll.value = false
      await fetchCategories()
    }

    const failed = results.length - successful
    if (failed > 0) {
      showToast(`Không thể khôi phục ${failed} danh mục`, 'warning')
    }
  } catch (err: any) {
    showToast('Có lỗi xảy ra khi khôi phục danh mục', 'error')
  } finally {
    loading.value = false
  }
}

const confirmForceDelete = (category: Category) => {
  categoryToForceDelete.value = category
  showForceDeleteModal.value = true
}

const forceDeleteAllCategories = () => {
  if (selectedCategories.value.length === 0) return

  categoryToForceDelete.value = null
  showForceDeleteModal.value = true
}

const executeForceDelete = async () => {
  try {
    loading.value = true

    if (categoryToForceDelete.value) {
      // Force delete single category
      const response = await adminCategoriesApi.forceDelete(categoryToForceDelete.value.id)

      if (response.success) {
        showToast('Danh mục đã được xóa vĩnh viễn', 'success')
      } else {
        throw new Error(response.message || 'Không thể xóa danh mục')
      }
    } else if (selectedCategories.value.length > 0) {
      // Force delete multiple categories
      const promises = selectedCategories.value.map(id =>
        adminCategoriesApi.forceDelete(id)
      )

      const results = await Promise.allSettled(promises)
      const successful = results.filter(r => r.status === 'fulfilled').length

      if (successful > 0) {
        showToast(`Đã xóa vĩnh viễn ${successful} danh mục`, 'success')
      }

      const failed = results.length - successful
      if (failed > 0) {
        showToast(`Không thể xóa ${failed} danh mục`, 'warning')
      }

      selectedCategories.value = []
      selectAll.value = false
    }

    // Close modal and refresh
    showForceDeleteModal.value = false
    categoryToForceDelete.value = null
    await fetchCategories()

  } catch (err: any) {
    showToast(err.message || 'Có lỗi xảy ra khi xóa danh mục', 'error')
  } finally {
    loading.value = false
  }
}

// Watch for selection changes
watch(selectedCategories, () => {
  selectAll.value = selectedCategories.value.length === categories.value.length && categories.value.length > 0
}, { deep: true })

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.border-left-warning {
  border-left: 0.25rem solid #f6c23e !important;
}

.border-left-info {
  border-left: 0.25rem solid #36b9cc !important;
}

.category-image {
  border-radius: 0.375rem;
}

.btn-group .btn {
  border-radius: 0.375rem !important;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.table th {
  background-color: #f8f9fc;
  border-color: #e3e6f0;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.table td {
  border-color: #e3e6f0;
  vertical-align: middle;
}

.form-check-input {
  border-radius: 0.25rem;
}

.pagination .page-link {
  border-color: #e3e6f0;
  color: #5a5c69;
}

.pagination .page-item.active .page-link {
  background-color: #4e73df;
  border-color: #4e73df;
}

.modal-header.bg-danger {
  background-color: #e74a3b !important;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .btn-group .btn {
    padding: 0.25rem 0.5rem;
  }

  .category-image {
    width: 40px !important;
    height: 40px !important;
  }
}

/* Modal Overlay Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1055;
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-content {
  border: none;
  border-radius: 0.375rem;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-radius: 0.375rem 0.375rem 0 0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.8;
}

.btn-close:hover {
  opacity: 1;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
