<template>
  <AdminLayout>
    <div class="admin-contacts-view">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">Quản lý liên hệ</h2>
          <p class="text-muted mb-0">Quản lý và phản hồi các liên hệ từ khách hàng</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <ContactStatsCard :contacts="contacts" />

      <!-- Quick Actions -->
      <ContactQuickActions
        :stats="contactStats"
        :active-status-filter="filters.status"
        :active-date-filter="dateFilter"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        :has-active-filters="hasActiveFilters"
        @filter-status="handleStatusFilter"
        @filter-date="handleDateFilter"
        @sort="handleSort"
        @clear-filters="handleClearFilters"
      />

      <!-- Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label">Tìm kiếm</label>
                            <input v-model="filters.search" type="text" class="form-control" placeholder="Tìm theo tên hoặc email..." @input="debouncedSearch" />
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Trạng thái</label>
                            <select v-model="filters.status" class="form-select" @change="loadContacts">
                                <option value="">Tất cả</option>
                                <option value="pending">Đang chờ</option>
                                <option value="resolved">Đã giải quyết</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Số lượng/trang</label>
                            <select v-model="filters.per_page" class="form-select" @change="loadContacts">
                                <option value="15">15</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">&nbsp;</label>
                            <div class="d-grid">
                                <button type="button" class="btn btn-outline-secondary" @click="handleResetFilters">
                                    <i class="bi bi-arrow-clockwise me-1"></i>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-5">
                <LoadingSpinner />
            </div>

            <!-- Contacts Table -->
            <div v-else class="card">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Người gửi</th>
                                    <th>Email</th>
                                    <th>Tin nhắn</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="contact in contacts" :key="contact.id">
                                    <td class="fw-bold">#{{ contact.id }}</td>
                                    <td>{{ contact.fullname }}</td>
                                    <td>
                                        <a :href="`mailto:${contact.email}`" class="text-decoration-none">
                                            {{ contact.email }}
                                        </a>
                                    </td>
                                    <td>
                                        <div class="text-truncate" style="max-width: 300px" :title="contact.message">
                                            {{ contact.message }}
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge" :class="{
                                            'bg-warning': contact.status === 'pending',
                                            'bg-success': contact.status === 'resolved'
                                        }">
                                            {{ getStatusText(contact.status) }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="small">
                                            <div>{{ formatDate(contact.created_at) }}</div>
                                            <div class="text-muted">{{ formatTime(contact.created_at) }}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-1">
                                            <button type="button" class="btn btn-sm btn-outline-primary" @click="viewContact(contact)">
                                                <i class="bi bi-eye"></i>
                                            </button>
                                            <button v-if="contact.status === 'pending'" type="button" class="btn btn-sm btn-outline-success" @click="handleMarkAsResolved(contact.id)" :disabled="updatingStatus === contact.id">
                                                <i class="bi bi-check-circle"></i>
                                            </button>
                                            <button v-else type="button" class="btn btn-sm btn-outline-warning" @click="handleMarkAsPending(contact.id)" :disabled="updatingStatus === contact.id">
                                                <i class="bi bi-clock"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-danger" @click="confirmDelete(contact)">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div v-if="pagination && pagination.total > 0" class="d-flex justify-content-between align-items-center p-3 border-top">
                        <div class="text-muted">
                            Hiển thị {{ pagination.from }} - {{ pagination.to }} của {{ pagination.total }} liên hệ
                        </div>
                        <nav>
                            <ul class="pagination pagination-sm mb-0">
                                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                    <button class="page-link" @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1">
                                        Trước
                                    </button>
                                </li>
                                <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === pagination.current_page }">
                                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                </li>
                                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                                    <button class="page-link" @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page">
                                        Sau
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <!-- Empty State -->
                    <div v-if="!loading && contacts.length === 0" class="text-center py-5">
                        <i class="bi bi-envelope-exclamation display-1 text-muted"></i>
                        <h5 class="mt-3 text-muted">Không có liên hệ nào</h5>
                        <p class="text-muted">{{ filters.search || filters.status ? 'Không tìm thấy liên hệ phù hợp với bộ lọc' : 'Chưa có liên hệ nào từ khách hàng' }}</p>
                    </div>
                </div>
            </div>

            <!-- Contact Detail Modal -->
            <BModal v-model="showDetailModal" size="lg" title="Chi tiết liên hệ" hide-footer>
                <div v-if="selectedContact">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Họ tên:</strong>
                            <p class="mb-0">{{ selectedContact.fullname }}</p>
                        </div>
                        <div class="col-md-6">
                            <strong>Email:</strong>
                            <p class="mb-0">
                                <a :href="`mailto:${selectedContact.email}`" class="text-decoration-none">
                                    {{ selectedContact.email }}
                                </a>
                            </p>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <strong>Trạng thái:</strong>
                            <p class="mb-0">
                                <span class="badge" :class="{
                                    'bg-warning': selectedContact.status === 'pending',
                                    'bg-success': selectedContact.status === 'resolved'
                                }">
                                    {{ getStatusText(selectedContact.status) }}
                                </span>
                            </p>
                        </div>
                        <div class="col-md-6">
                            <strong>Thời gian gửi:</strong>
                            <p class="mb-0">{{ formatDate(selectedContact.created_at) }} {{ formatTime(selectedContact.created_at) }}</p>
                        </div>
                    </div>

                    <div class="mb-3">
                        <strong>Nội dung tin nhắn:</strong>
                        <div class="p-3 bg-light rounded mt-2">
                            {{ selectedContact.message }}
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button v-if="selectedContact.status === 'pending'" type="button" class="btn btn-success" @click="handleMarkAsResolved(selectedContact.id)" :disabled="updatingStatus === selectedContact.id">
                            <i class="bi bi-check-circle me-1"></i>
                            Đánh dấu đã giải quyết
                        </button>
                        <button v-else type="button" class="btn btn-warning" @click="handleMarkAsPending(selectedContact.id)" :disabled="updatingStatus === selectedContact.id">
                            <i class="bi bi-clock me-1"></i>
                            Đánh dấu chờ xử lý
                        </button>
                        <button type="button" class="btn btn-outline-danger" @click="confirmDelete(selectedContact)">
                            <i class="bi bi-trash me-1"></i>
                            Xóa liên hệ
                        </button>
                    </div>
                </div>
            </BModal>

            <!-- Delete Confirmation Modal -->
            <BModal v-model="showDeleteModal" title="Xác nhận xóa" hide-footer>
                <div v-if="contactToDelete">
                    <p>Bạn có chắc chắn muốn xóa liên hệ từ <strong>{{ contactToDelete.fullname }}</strong>?</p>
                    <p class="text-muted small">Hành động này không thể hoàn tác.</p>

                    <div class="d-flex gap-2 justify-content-end">
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
                            Hủy
                        </button>
                        <button type="button" class="btn btn-danger" @click="handleDeleteContact" :disabled="deleting">
                            <span v-if="deleting" class="spinner-border spinner-border-sm me-1"></span>
                            Xóa
                        </button>
                    </div>
                </div>
            </BModal>

            <!-- Toast Container -->
            <ToastContainer />
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BModal } from 'bootstrap-vue-next'
import type { ContactAdmin } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ContactStatsCard from '@/components/admin/ContactStatsCard.vue'
import ContactQuickActions from '@/components/admin/ContactQuickActions.vue'
import { useContacts } from '@/composables/useContacts'
import { useContactFilters } from '@/composables/useContactFilters'

// Use composables
const {
  contacts,
  selectedContact,
  pagination,
  loading,
  updating,
  deleting,
  filters,
  hasContacts,
  loadContacts,
  markAsResolved,
  markAsPending,
  deleteContact: deleteContactById,
  resetFilters,
  changePage,
  getStatusText,
  formatDate,
  formatTime
} = useContacts()

const {
  searchQuery,
  statusFilter,
  dateFilter,
  sortBy,
  sortOrder,
  filterContacts,
  getFilteredStats,
  setStatusFilter,
  setDateFilter,
  clearFilters: clearContactFilters,
  setSorting
} = useContactFilters()// Simple debounce function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: number
    return ((...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait) as any
    }) as T
}

// Local state for modals
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const contactToDelete = ref<ContactAdmin | null>(null)
const updatingStatus = ref<number | null>(null)

// Computed
const contactStats = computed(() => getFilteredStats(contacts.value))

const hasActiveFilters = computed(() => {
  return !!(filters.value.search || filters.value.status || dateFilter.value)
})

const visiblePages = computed(() => {
  if (!pagination.value) return []

  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []

  // Show pages around current page
  const start = Math.max(1, current - 2)
  const end = Math.min(last, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})// Methods
const debouncedSearch = debounce(() => {
    filters.value.page = 1
    loadContacts()
}, 500)

const viewContact = (contact: ContactAdmin) => {
    selectedContact.value = contact
    showDetailModal.value = true
}

const handleMarkAsResolved = async (contactId: number) => {
    try {
        updatingStatus.value = contactId
        await markAsResolved(contactId)
    } finally {
        updatingStatus.value = null
    }
}

const handleMarkAsPending = async (contactId: number) => {
    try {
        updatingStatus.value = contactId
        await markAsPending(contactId)
    } finally {
        updatingStatus.value = null
    }
}

const confirmDelete = (contact: ContactAdmin) => {
    contactToDelete.value = contact
    showDeleteModal.value = true
}

const handleDeleteContact = async () => {
    if (!contactToDelete.value) return

    try {
        await deleteContactById(contactToDelete.value.id)

        // Close modals
        showDeleteModal.value = false
        showDetailModal.value = false

        // Reload if current page is empty and not first page
        if (!hasContacts.value && filters.value.page > 1) {
            filters.value.page = 1
            loadContacts()
        }
    } finally {
        contactToDelete.value = null
    }
}

const handleResetFilters = () => {
  resetFilters()
  loadContacts()
}

const handleStatusFilter = (status: string) => {
  filters.value.status = status
  filters.value.page = 1
  loadContacts()
}

const handleDateFilter = (period: string) => {
  setDateFilter(period)
  // This would need API support for date filtering
  // For now, we'll use client-side filtering
}

const handleSort = (field: string, order: 'asc' | 'desc') => {
  setSorting(field, order)
  // This would need API support for sorting
  // For now, we'll use client-side sorting
}

const handleClearFilters = () => {
  clearContactFilters()
  resetFilters()
  loadContacts()
}// Lifecycle
onMounted(() => {
    loadContacts()
})
</script>

<style scoped>
.admin-contacts-view {
    padding: 1.5rem;
}

.table th {
    border-top: none;
    font-weight: 600;
    color: #495057;
    background-color: #f8f9fa !important;
}

.table td {
    vertical-align: middle;
}

.badge {
    font-size: 0.75rem;
}

.pagination-sm .page-link {
    padding: 0.25rem 0.5rem;
}
</style>
