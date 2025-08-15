<template>
  <AdminLayout>
  <div class="admin-sale-campaigns">
    <div class="header-section">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="page-title">
              <i class="bi bi-percent text-danger"></i>
              Quản lý Chiến dịch Khuyến mãi
            </h1>
            <p class="page-subtitle">Quản lý tất cả các chương trình khuyến mãi</p>
          </div>
          <div class="col-auto">
            <router-link to="/admin/sale-campaigns/create" class="btn btn-primary">
              <i class="bi bi-plus-circle"></i>
              Tạo chiến dịch mới
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="container-fluid">
        <!-- Filters -->
        <div class="filters-card">
          <div class="row g-3 align-items-end">
            <div class="col-md-4">
              <label class="form-label">Tìm kiếm</label>
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input
                  v-model="searchQuery"
                  @input="debouncedSearch"
                  type="text"
                  class="form-control"
                  placeholder="Tìm theo tên chiến dịch..."
                />
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Trạng thái</label>
              <select v-model="statusFilter" @change="fetchCampaigns" class="form-select">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="scheduled">Sắp diễn ra</option>
                <option value="ended">Đã kết thúc</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Sắp xếp</label>
              <select v-model="sortBy" @change="fetchCampaigns" class="form-select">
                <option value="created_at">Mới nhất</option>
                <option value="name">Tên A-Z</option>
                <option value="priority">Độ ưu tiên</option>
                <option value="start_date">Ngày bắt đầu</option>
                <option value="end_date">Ngày kết thúc</option>
              </select>
            </div>
            <div class="col-md-2">
              <button @click="resetFilters" class="btn btn-outline-secondary w-100">
                <i class="bi bi-arrow-clockwise"></i>
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-3">Đang tải danh sách chiến dịch...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle"></i>
            {{ error }}
            <button @click="fetchCampaigns" class="btn btn-sm btn-outline-danger ms-2">
              Thử lại
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div v-else class="table-card">
          <div class="table-header">
            <h5 class="mb-0">
              Tổng cộng: {{ pagination?.total || 0 }} chiến dịch
            </h5>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th width="50">#</th>
                  <th>Tên chiến dịch</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Độ ưu tiên</th>
                  <th>Sản phẩm</th>
                  <th width="200">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!saleCampaigns.length">
                  <td colspan="7" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    Không có chiến dịch khuyến mãi nào
                  </td>
                </tr>
                <tr v-for="(campaign, index) in saleCampaigns" :key="campaign.id">
                  <td>
                    <span class="text-muted">{{ getRowNumber(index) }}</span>
                  </td>
                  <td>
                    <div class="campaign-info">
                      <div class="campaign-name">
                        {{ campaign.name }}
                        <span v-if="campaign.is_featured" class="badge bg-warning ms-2">
                          <i class="bi bi-star-fill"></i>
                          Nổi bật
                        </span>
                      </div>
                      <small class="text-muted">{{ campaign.description }}</small>
                    </div>
                  </td>
                  <td>
                    <div class="campaign-dates">
                      <div>
                        <i class="bi bi-calendar-check text-success"></i>
                        {{ formatDate(campaign.start_date) }}
                      </div>
                      <div>
                        <i class="bi bi-calendar-x text-danger"></i>
                        {{ formatDate(campaign.end_date) }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span :class="['badge', getStatusClass(campaign.status)]">
                      {{ getStatusText(campaign.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="priority-display">
                      <div class="priority-bar">
                        <div
                          class="priority-fill"
                          :style="{ width: (campaign.priority || 0) + '%' }"
                        ></div>
                      </div>
                      <span class="priority-text">{{ campaign.priority || 0 }}/100</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-info">
                      <i class="bi bi-box"></i>
                      {{ campaign.sale_products?.length || 0 }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <router-link
                        :to="`/admin/sale-campaigns/${campaign.id}/edit`"
                        class="btn btn-sm btn-outline-primary"
                        title="Chỉnh sửa"
                      >
                        <i class="bi bi-pencil"></i>
                      </router-link>
                      <router-link
                        :to="`/admin/sale-campaigns/${campaign.id}/products`"
                        class="btn btn-sm btn-outline-info"
                        title="Quản lý sản phẩm"
                      >
                        <i class="bi bi-box"></i>
                      </router-link>
                      <button
                        @click="deleteCampaign(campaign)"
                        class="btn btn-sm btn-outline-danger"
                        title="Xóa"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination && pagination.last_page > 1" class="pagination-wrapper">
            <nav aria-label="Pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                  <button
                    class="page-link"
                    @click="changePage(pagination.current_page - 1)"
                    :disabled="pagination.current_page === 1"
                  >
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>

                <li
                  v-for="page in getPageNumbers()"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === pagination.current_page }"
                >
                  <button
                    class="page-link"
                    @click="changePage(Number(page))"
                    v-if="page !== '...'"
                  >
                    {{ page }}
                  </button>
                  <span class="page-link" v-else>...</span>
                </li>

                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                  <button
                    class="page-link"
                    @click="changePage(pagination.current_page + 1)"
                    :disabled="pagination.current_page === pagination.last_page"
                  >
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Xác nhận xóa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa chiến dịch <strong>{{ campaignToDelete?.name }}</strong>?</p>
            <p class="text-danger">
              <i class="bi bi-exclamation-triangle"></i>
              Hành động này không thể hoàn tác!
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmDelete"
              :disabled="isDeleting"
            >
              <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div></AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSaleCampaigns } from '@/composables/useSaleCampaigns'
import { useToast } from '@/composables/useToast'
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Debounce utility
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const {
  saleCampaigns,
  pagination,
  isLoading,
  error,
  fetchAdminSaleCampaigns,
  deleteSaleCampaign
} = useSaleCampaigns()

const { showToast } = useToast()

// Filter state
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)

// Delete state
const campaignToDelete = ref<any>(null)
const isDeleting = ref(false)

// Methods
const fetchCampaigns = async () => {
  const filters: any = {
    page: currentPage.value,
    per_page: 15
  }

  if (searchQuery.value) filters.search = searchQuery.value
  if (statusFilter.value) filters.status = statusFilter.value
  if (sortBy.value) filters.sort_by = sortBy.value

  await fetchAdminSaleCampaigns(filters)
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchCampaigns()
}, 500)

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  sortBy.value = 'created_at'
  currentPage.value = 1
  fetchCampaigns()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    currentPage.value = page
    fetchCampaigns()
  }
}

const getPageNumbers = () => {
  if (!pagination.value) return []

  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages: (number | string)[] = []

  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(last)
    } else if (current >= last - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = last - 4; i <= last; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(last)
    }
  }

  return pages
}

const getRowNumber = (index: number) => {
  if (!pagination.value) return index + 1
  return (pagination.value.current_page - 1) * pagination.value.per_page + index + 1
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Hoạt động',
    inactive: 'Tạm dừng',
    scheduled: 'Sắp diễn ra',
    ended: 'Đã kết thúc'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    active: 'bg-success',
    inactive: 'bg-secondary',
    scheduled: 'bg-primary',
    ended: 'bg-danger'
  }
  return classMap[status] || 'bg-secondary'
}

const deleteCampaign = (campaign: any) => {
  campaignToDelete.value = campaign
  // Show modal (assuming Bootstrap modal is available)
  const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteModal'))
  modal.show()
}

const confirmDelete = async () => {
  if (!campaignToDelete.value) return

  isDeleting.value = true
  try {
    await deleteSaleCampaign(campaignToDelete.value.id)
    showToast('Xóa chiến dịch thành công!', 'success')

    // Hide modal
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteModal'))
    modal.hide()

    // Refresh data
    await fetchCampaigns()
  } catch (err) {
    showToast('Có lỗi xảy ra khi xóa chiến dịch!', 'error')
  } finally {
    isDeleting.value = false
    campaignToDelete.value = null
  }
}

// Load data on mount
onMounted(() => {
  fetchCampaigns()
})
</script>

<style scoped>
.admin-sale-campaigns {
  min-height: 100vh;
  background: #f8f9fa;
}

.header-section {
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6c757d;
  margin: 0;
}

.content-section {
  padding-bottom: 2rem;
}

.filters-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
}

.search-box input {
  padding-left: 2.5rem;
}

.table-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
}

.table {
  margin: 0;
}

.table th {
  background: #f8f9fa;
  border-top: none;
  color: #495057;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.campaign-info {
  max-width: 300px;
}

.campaign-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.campaign-dates {
  font-size: 0.875rem;
}

.campaign-dates div {
  margin-bottom: 0.25rem;
}

.campaign-dates i {
  width: 16px;
  margin-right: 0.5rem;
}

.priority-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.priority-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.priority-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.priority-text {
  font-size: 0.875rem;
  color: #6c757d;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0056b3, #004085);
  transform: translateY(-1px);
}

.pagination-wrapper {
  padding: 1.5rem;
  border-top: 1px solid #dee2e6;
  background: #f8f9fa;
}

.pagination .page-link {
  border-radius: 8px;
  margin: 0 2px;
  border: 1px solid #dee2e6;
  color: #495057;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border-color: #007bff;
}

.loading-state,
.error-state {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-section .row {
    text-align: center;
  }

  .header-section .col-auto {
    margin-top: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .campaign-info {
    max-width: 200px;
  }

  .table-responsive {
    font-size: 0.875rem;
  }
}
</style>
