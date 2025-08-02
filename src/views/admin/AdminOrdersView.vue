<template>
  <AdminLayout>
    <div class="admin-orders-container">
      <!-- Modern Header with Glassmorphism Effect -->
      <div class="header-card mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h2 mb-2 fw-bold gradient-text">
              <i class="bi bi-cart-check-fill me-3"></i>Quản lý đơn hàng
            </h1>
            <p class="text-muted mb-0 fs-6">
              Quản lý và theo dõi tất cả đơn hàng trong hệ thống
            </p>
            <div class="keyboard-shortcuts mt-2">
              <span class="shortcut-badge"><kbd>F</kbd> Bộ lọc</span>
              <span class="shortcut-badge"><kbd>Ctrl+R</kbd> Làm mới</span>
              <span class="shortcut-badge"><kbd>Esc</kbd> Bỏ chọn</span>
            </div>
          </div>
          <div class="d-flex gap-3">
            <button class="btn btn-modern btn-outline-primary" @click="refreshData" :disabled="loading">
              <i class="bi bi-arrow-clockwise me-2" :class="{ 'spinning': loading }"></i>
              Làm mới
            </button>
            <button class="btn btn-modern btn-success" @click="exportOrders" :disabled="loading || !orders?.length">
              <i class="bi bi-download me-2"></i>
              Xuất Excel
            </button>
            <button class="btn btn-modern btn-primary" @click="toggleFilters" :class="{ 'active': showFilters }">
              <i class="bi bi-funnel me-2"></i>
              Bộ lọc
              <i class="bi bi-chevron-down ms-1 transition-transform" :class="{ 'rotate-180': showFilters }"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div v-show="showFilters" class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Trạng thái đơn hàng</label>
              <select class="form-select" v-model="filters.status" @change="applyFilters">
                <option value="">Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã giao hàng</option>
                <option value="delivered">Đã hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Trạng thái thanh toán</label>
              <select class="form-select" v-model="filters.payment_status" @change="applyFilters">
                <option value="">Tất cả</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Từ ngày</label>
              <input type="date" class="form-control" v-model="filters.date_from" @change="applyFilters">
            </div>
            <div class="col-md-3">
              <label class="form-label">Đến ngày</label>
              <input type="date" class="form-control" v-model="filters.date_to" @change="applyFilters">
            </div>
          </div>
          <div class="row g-3 mt-2">
            <div class="col-md-6">
              <label class="form-label">Khoảng giá trị</label>
              <div class="row g-2">
                <div class="col-6">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Từ (VNĐ)"
                    v-model="filters.min_amount"
                    @change="applyFilters"
                  >
                </div>
                <div class="col-6">
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Đến (VNĐ)"
                    v-model="filters.max_amount"
                    @change="applyFilters"
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row g-3 mt-2">
            <div class="col-md-6">
              <label class="form-label">Tìm kiếm</label>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm theo mã đơn hàng hoặc tên khách hàng..."
                v-model="filters.search"
                @input="debounceSearch"
              >
            </div>
            <div class="col-md-3">
              <label class="form-label">Số đơn mỗi trang</label>
              <select class="form-select" v-model="filters.per_page" @change="applyFilters">
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-outline-secondary w-100" @click="clearFilters">
                <i class="bi bi-x-circle me-1"></i>
                Xóa bộ lọc
              </button>
            </div>
          </div>
          <div class="row g-3 mt-1">
            <div class="col-md-6">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="autoRefresh"
                  v-model="autoRefresh"
                  @change="toggleAutoRefresh"
                >
                <label class="form-check-label" for="autoRefresh">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Tự động làm mới (30s)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards với Bulk Actions -->
      <div class="row g-3 mb-4">
        <div class="col-md-12">
          <div class="row g-3" v-if="stats">
            <div class="col-md-3">
              <div class="card border-0 bg-primary bg-opacity-10">
                <div class="card-body text-center">
                  <div class="h4 fw-bold text-primary mb-1">{{ stats.total || 0 }}</div>
                  <div class="small text-muted">Tổng đơn hàng</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card border-0 bg-warning bg-opacity-10">
                <div class="card-body text-center">
                  <div class="h4 fw-bold text-warning mb-1">{{ stats.pending || 0 }}</div>
                  <div class="small text-muted">Chờ xử lý</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card border-0 bg-success bg-opacity-10">
                <div class="card-body text-center">
                  <div class="h4 fw-bold text-success mb-1">{{ stats.delivered || 0 }}</div>
                  <div class="small text-muted">Đã hoàn thành</div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card border-0 bg-danger bg-opacity-10">
                <div class="card-body text-center">
                  <div class="h4 fw-bold text-danger mb-1">{{ stats.cancelled || 0 }}</div>
                  <div class="small text-muted">Đã hủy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải danh sách đơn hàng...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        <h4 class="alert-heading">
          <i class="bi bi-exclamation-triangle me-2"></i>Lỗi tải dữ liệu
        </h4>
        <p class="mb-0">{{ error }}</p>
        <hr>
        <button class="btn btn-outline-danger" @click="refreshData">
          <i class="bi bi-arrow-clockwise me-1"></i>Thử lại
        </button>
      </div>

      <!-- Orders Table -->
      <div v-else class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width: 50px;"></th>
                  <th>Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!orders?.length">
                  <td colspan="8" class="text-center py-4">
                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                    <p class="text-muted mb-0">Không có đơn hàng nào</p>
                  </td>
                </tr>
                <tr v-for="order in orders" :key="order.id" class="position-relative">
                  <td></td>
                  <td>
                    <div class="fw-semibold text-primary">{{ order.order_number }}</div>
                    <div class="small text-muted">#{{ order.id }}</div>
                  </td>
                  <td>
                    <div class="fw-semibold">{{ order.user.name }}</div>
                    <div class="small text-muted">{{ order.user.email }}</div>
                    <div class="small text-muted" v-if="order.user.phone">{{ order.user.phone }}</div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        v-if="order.order_details?.[0]?.product?.image"
                        :src="order.order_details[0].product.image"
                        :alt="order.order_details[0].product.name"
                        class="rounded me-2"
                        style="width: 40px; height: 40px; object-fit: cover;"
                      >
                      <div>
                        <div class="fw-semibold small">
                          {{ order.order_details?.[0]?.product?.name || 'N/A' }}
                        </div>
                        <div class="small text-muted" v-if="order.order_details?.length > 1">
                          +{{ order.order_details.length - 1 }} sản phẩm khác
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="fw-semibold">{{ formatCurrency(order.final_amount) }}</div>
                    <div class="small text-muted" v-if="order.voucher_discount !== '0.00'">
                      Giảm: {{ formatCurrency(order.voucher_discount) }}
                    </div>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(order.status)">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="small">{{ formatDate(order.created_at) }}</div>
                  </td>
                  <td>
                    <div class="d-flex flex-wrap gap-2">
                      <button class="btn btn-sm btn-outline-primary" @click="viewOrderDetails(order)">
                        <i class="bi bi-eye"></i> Xem chi tiết
                      </button>
                      <button v-if="canUpdateStatus(order.status)" class="btn btn-sm btn-outline-success" @click="openStatusModal(order)">
                        <i class="bi bi-arrow-repeat"></i> Cập nhật trạng thái
                      </button>
                      <button v-if="order.status === 'pending'" class="btn btn-sm btn-outline-success" @click="quickUpdateStatus(order, 'processing')">
                        <i class="bi bi-check-circle"></i> Xác nhận
                      </button>
                      <button v-if="order.status === 'processing'" class="btn btn-sm btn-outline-info" @click="quickUpdateStatus(order, 'shipped')">
                        <i class="bi bi-truck"></i> Đánh dấu đã giao
                      </button>
                      <button v-if="order.status === 'shipped'" class="btn btn-sm btn-outline-success" @click="quickUpdateStatus(order, 'delivered')">
                        <i class="bi bi-check2-all"></i> Hoàn thành
                      </button>
                      <button v-if="['pending', 'processing'].includes(order.status)" class="btn btn-sm btn-outline-danger" @click="quickUpdateStatus(order, 'cancelled')">
                        <i class="bi bi-x-circle"></i> Hủy đơn
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="card-footer bg-light" v-if="pagination && pagination.total > 0">
          <nav aria-label="Orders pagination">
            <ul class="pagination justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                  <i class="bi bi-chevron-left"></i>
                </a>
              </li>

              <li v-for="page in getVisiblePages()" :key="page"
                  class="page-item" :class="{ active: page === pagination.current_page }">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>

              <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>

          <div class="text-center text-muted mt-2 small">
            Hiển thị {{ pagination.from }}-{{ pagination.to }} trong tổng số {{ pagination.total }} đơn hàng
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div class="modal fade" id="detailsModal" tabindex="-1" ref="detailsModal">
      <div class="modal-dialog modal-lg custom-modal-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-info-circle me-2"></i> Chi tiết đơn hàng
            </h5>
            <button type="button" class="btn-close" @click="detailsModalInstance && detailsModalInstance.hide()" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedOrder">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-primary">Thông tin đơn hàng</h6>
                <table class="table table-sm">
                  <tr>
                    <th><i class="bi bi-hash"></i> Mã đơn hàng:</th>
                    <td>{{ selectedOrder.order_number }}</td>
                  </tr>
                  <tr>
                    <th><i class="bi bi-flag"></i> Trạng thái:</th>
                    <td>
                      <span class="badge" :class="getStatusClass(selectedOrder.status)">
                        {{ getStatusText(selectedOrder.status) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th><i class="bi bi-credit-card"></i> Thanh toán:</th>
                    <td>
                      <span class="badge" :class="getPaymentStatusClass(selectedOrder.payment_status)">
                        {{ getPaymentStatusText(selectedOrder.payment_status) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th><i class="bi bi-wallet2"></i> Phương thức:</th>
                    <td>{{ selectedOrder.payment_method.display_name }}</td>
                  </tr>
                  <tr>
                    <th><i class="bi bi-calendar-event"></i> Ngày tạo:</th>
                    <td>{{ formatDate(selectedOrder.created_at) }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6 class="text-primary">Thông tin khách hàng</h6>
                <table class="table table-sm">
                  <tr>
                    <th><i class="bi bi-person"></i> Tên:</th>
                    <td>{{ selectedOrder.user.name }}</td>
                  </tr>
                  <tr>
                    <th><i class="bi bi-envelope"></i> Email:</th>
                    <td>{{ selectedOrder.user.email }}</td>
                  </tr>
                  <tr>
                    <th><i class="bi bi-telephone"></i> Điện thoại:</th>
                    <td>{{ selectedOrder.user.phone || 'N/A' }}</td>
                  </tr>
                </table>
              </div>
            </div>

            <h6 class="mt-4 text-primary">Sản phẩm trong đơn hàng</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.order_details" :key="item.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <img v-if="item.product.image" :src="item.product.image"
                             :alt="item.product.name" class="rounded me-2"
                             style="width: 40px; height: 40px; object-fit: cover;">
                        <div>
                          <div class="fw-semibold">{{ item.product.name }}</div>
                          <div class="small text-muted" v-if="item.product.color">
                            Màu: {{ item.product.color }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatCurrency(item.price) }}</td>
                    <td>{{ formatCurrency(parseFloat(item.price) * item.quantity) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row mt-3">
              <div class="col-md-6 offset-md-6">
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <th>Tổng tiền hàng:</th>
                      <td class="text-end">{{ formatCurrency(selectedOrder.total_amount) }}</td>
                    </tr>
                    <tr>
                      <th>Phí vận chuyển:</th>
                      <td class="text-end">{{ formatCurrency(selectedOrder.shipping_fee) }}</td>
                    </tr>
                    <tr v-if="selectedOrder.voucher_discount !== '0.00'">
                      <th>Giảm giá:</th>
                      <td class="text-end text-success">-{{ formatCurrency(selectedOrder.voucher_discount) }}</td>
                    </tr>
                    <tr class="table-active">
                      <th>Tổng cộng:</th>
                      <td class="text-end fw-bold">{{ formatCurrency(selectedOrder.final_amount) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="detailsModalInstance && detailsModalInstance.hide()">Đóng</button>
            <button v-if="selectedOrder" type="button" class="btn btn-primary" @click="openStatusModal(selectedOrder)">
              <i class="bi bi-pencil-square me-1"></i> Cập nhật trạng thái
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div class="modal fade" id="statusModal" tabindex="-1" ref="statusModal">
      <div class="modal-dialog custom-modal-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square me-2"></i> Cập nhật trạng thái đơn hàng
            </h5>
            <button type="button" class="btn-close" @click="statusModalInstance && statusModalInstance.hide()" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedOrder">
            <div class="mb-3">
              <strong>Đơn hàng:</strong> {{ selectedOrder.order_number }}
            </div>
            <div class="mb-3">
              <strong>Khách hàng:</strong> {{ selectedOrder.user.name }}
            </div>

            <div class="mb-3">
              <label class="form-label"><i class="bi bi-flag"></i> Trạng thái đơn hàng</label>
              <select class="form-select" v-model="statusForm.status">
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã giao hàng</option>
                <option value="delivered">Đã hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label"><i class="bi bi-credit-card"></i> Trạng thái thanh toán</label>
              <select class="form-select" v-model="statusForm.payment_status">
                <option value="pending">Chờ thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            <div class="mb-3" v-if="statusForm.status === 'shipped'">
              <label class="form-label"><i class="bi bi-truck"></i> Mã vận đơn</label>
              <input type="text" class="form-control" v-model="statusForm.tracking_number"
                     placeholder="Nhập mã vận đơn...">
            </div>

            <div class="mb-3">
              <label class="form-label"><i class="bi bi-chat-left-text"></i> Ghi chú</label>
              <textarea class="form-control" rows="3" v-model="statusForm.notes"
                        placeholder="Thêm ghi chú về thay đổi trạng thái..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="statusModalInstance && statusModalInstance.hide()">Hủy</button>
            <button type="button" class="btn btn-success" @click="updateOrderStatus" :disabled="updating">
              <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-check-circle me-1"></i> Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { ordersApi } from '@/services/api'
import { formatCurrency, formatDate } from '@/utils/adminHelpers'
import { useToast } from '@/composables/useToast'
import Swal from 'sweetalert2'
import type { Order, PaginationMeta } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)
const orders = ref<Order[]>([])
const pagination = ref<PaginationMeta | null>(null)
const showFilters = ref(false)
const selectedOrder = ref<Order | null>(null)
const updating = ref(false)
const autoRefresh = ref(false)
let autoRefreshInterval: number | null = null

// Filters
const filters = ref({
  status: '',
  payment_status: '',
  user_id: '',
  date_from: '',
  date_to: '',
  search: '',
  min_amount: '',
  max_amount: '',
  page: 1,
  per_page: 15
})

// Status form
const statusForm = ref({
  status: '' as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | '',
  payment_status: '' as 'pending' | 'paid' | 'failed' | '',
  tracking_number: '',
  notes: ''
})

// Stats
const stats = ref({
  total: 0,
  pending: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0
})

// Toast
const { showToast } = useToast()

// Modals
const statusModal = ref<HTMLElement | null>(null)
const detailsModal = ref<HTMLElement | null>(null)
let statusModalInstance: any = null
let detailsModalInstance: any = null

// Search debounce
let searchTimeout: number | null = null

// Computed
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-warning text-dark',
    processing: 'bg-info',
    shipped: 'bg-primary',
    delivered: 'bg-success',
    cancelled: 'bg-danger'
  }
  return classes[status as keyof typeof classes] || 'bg-secondary'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đã giao hàng',
    delivered: 'Đã hoàn thành',
    cancelled: 'Đã hủy'
  }
  return texts[status as keyof typeof texts] || status
}

const getPaymentStatusClass = (paymentStatus: string) => {
  const classes = {
    pending: 'bg-warning text-dark',
    paid: 'bg-success',
    failed: 'bg-danger'
  }
  return classes[paymentStatus as keyof typeof classes] || 'bg-secondary'
}

const getPaymentStatusText = (paymentStatus: string) => {
  const texts = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thất bại'
  }
  return texts[paymentStatus as keyof typeof texts] || paymentStatus
}

const canUpdateStatus = (status: string) => {
  return !['delivered', 'cancelled'].includes(status)
}

const getVisiblePages = () => {
  if (!pagination.value) return []

  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []

  // Show 5 pages around current page
  const start = Math.max(1, current - 2)
  const end = Math.min(last, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}

// Methods
const loadOrders = async (showNotification = false) => {
  try {
    loading.value = true
    error.value = null

    const params = Object.fromEntries(
      Object.entries(filters.value).filter(([_, value]) => value !== '' && value !== null)
    )

    const response = await ordersApi.getAdminOrders(params)

    // Check for new orders (only if not initial load)
    if (showNotification && orders.value.length > 0) {
      const newOrdersCount = response.total - (pagination.value?.total || 0)
      if (newOrdersCount > 0) {
        showToast(`Có ${newOrdersCount} đơn hàng mới!`, 'info')
      }
    }

    orders.value = response.data
    pagination.value = {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total,
      from: response.from,
      to: response.to
    }

    // Calculate stats
    calculateStats()

  } catch (err: any) {
    console.error('Orders load error:', err)
    error.value = err.message || 'Đã có lỗi xảy ra khi tải danh sách đơn hàng'
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  if (!orders.value.length) {
    stats.value = { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
    return
  }

  const statusCounts = orders.value.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  stats.value = {
    total: pagination.value?.total || orders.value.length,
    pending: statusCounts.pending || 0,
    processing: statusCounts.processing || 0,
    shipped: statusCounts.shipped || 0,
    delivered: statusCounts.delivered || 0,
    cancelled: statusCounts.cancelled || 0
  }
}

const refreshData = () => {
  filters.value.page = 1
  loadOrders()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const applyFilters = () => {
  filters.value.page = 1
  loadOrders()
}

const clearFilters = () => {
  filters.value = {
    status: '',
    payment_status: '',
    user_id: '',
    date_from: '',
    date_to: '',
    search: '',
    min_amount: '',
    max_amount: '',
    page: 1,
    per_page: 15
  }
  loadOrders()
}

const debounceSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = window.setTimeout(() => {
    applyFilters()
  }, 500)
}

const changePage = (page: number) => {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
  filters.value.page = page
  loadOrders()
}

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
  if (detailsModalInstance) {
    detailsModalInstance.show()
  }
}

const openStatusModal = (order: Order) => {
  selectedOrder.value = order
  statusForm.value = {
    status: order.status,
    payment_status: order.payment_status,
    tracking_number: '',
    notes: ''
  }

  // Close details modal if open
  if (detailsModalInstance) {
    detailsModalInstance.hide()
  }

  if (statusModalInstance) {
    statusModalInstance.show()
  }
}

const updateOrderStatus = async () => {
  if (!selectedOrder.value) return

  try {
    updating.value = true

    const updateData: {
      status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status?: 'pending' | 'paid' | 'failed'
      tracking_number?: string
      notes?: string
    } = {}

    if (statusForm.value.status) {
      updateData.status = statusForm.value.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    }
    if (statusForm.value.payment_status) {
      updateData.payment_status = statusForm.value.payment_status as 'pending' | 'paid' | 'failed'
    }
    if (statusForm.value.tracking_number) {
      updateData.tracking_number = statusForm.value.tracking_number
    }
    if (statusForm.value.notes) {
      updateData.notes = statusForm.value.notes
    }

    await ordersApi.updateOrderStatus(selectedOrder.value.id, updateData)

    showToast('Cập nhật trạng thái đơn hàng thành công!', 'success')

    if (statusModalInstance) {
      statusModalInstance.hide()
    }

    // Refresh data
    loadOrders()

  } catch (err: any) {
    console.error('Update status error:', err)
    showToast(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái', 'error')
  } finally {
    updating.value = false
  }
}

const quickUpdateStatus = async (order: Order, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
  const result = await Swal.fire({
    title: 'Xác nhận thay đổi trạng thái',
    text: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ${order.order_number} thành "${getStatusText(newStatus)}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    reverseButtons: true
  })

  if (!result.isConfirmed) {
    return
  }

  try {
    const updateData = { status: newStatus }
    await ordersApi.updateOrderStatus(order.id, updateData)

    showToast('Cập nhật trạng thái thành công!', 'success')
    loadOrders()

  } catch (err: any) {
    console.error('Quick update status error:', err)
    showToast(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái', 'error')
  }
}

const exportOrders = () => {
  if (!orders.value.length) {
    showToast('Không có dữ liệu để xuất', 'warning')
    return
  }

  try {
    // Chuẩn bị dữ liệu để xuất
    const exportData = orders.value.map(order => ({
      'Mã đơn hàng': order.order_number,
      'Khách hàng': order.user.name,
      'Email': order.user.email,
      'Điện thoại': order.user.phone || 'N/A',
      'Tổng tiền': parseFloat(order.final_amount).toLocaleString('vi-VN') + ' ₫',
      'Trạng thái': getStatusText(order.status),
      'Thanh toán': getPaymentStatusText(order.payment_status),
      'Phương thức TT': order.payment_method.display_name,
      'Ngày tạo': formatDate(order.created_at),
      'Ghi chú': order.note || ''
    }))

    // Tạo CSV content
    const headers = Object.keys(exportData[0])
    const csvContent = [
      headers.join(','),
      ...exportData.map(row =>
        headers.map(header => `"${(row as any)[header]}"`).join(',')
      )
    ].join('\n')

    // Tạo và download file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `don-hang-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    showToast('Xuất danh sách đơn hàng thành công!', 'success')

  } catch (err: any) {
    console.error('Export error:', err)
    showToast('Có lỗi xảy ra khi xuất dữ liệu', 'error')
  }
}

const toggleAutoRefresh = () => {
  if (autoRefresh.value) {
    // Start auto refresh
    autoRefreshInterval = window.setInterval(() => {
      loadOrders(true) // Show notification for new orders
    }, 30000) // 30 seconds
    showToast('Đã bật tự động làm mới mỗi 30 giây', 'info')
  } else {
    // Stop auto refresh
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval)
      autoRefreshInterval = null
    }
    showToast('Đã tắt tự động làm mới', 'info')
  }
}

// Initialize Bootstrap Modal manually
const initModals = () => {
  // Simple modal implementation without Bootstrap import
  const showModal = (element: HTMLElement) => {
    element.style.display = 'block'
    element.classList.add('show')
    document.body.classList.add('modal-open')

    // Add backdrop
    const backdrop = document.createElement('div')
    backdrop.className = 'modal-backdrop fade show'
    backdrop.onclick = () => hideModal(element)
    document.body.appendChild(backdrop)
  }

  const hideModal = (element: HTMLElement) => {
    element.style.display = 'none'
    element.classList.remove('show')
    document.body.classList.remove('modal-open')

    // Remove backdrop
    const backdrop = document.querySelector('.modal-backdrop')
    if (backdrop) {
      backdrop.remove()
    }
  }

  if (statusModal.value) {
    statusModalInstance = {
      show: () => showModal(statusModal.value!),
      hide: () => hideModal(statusModal.value!)
    }

    // Close on X button
    const closeBtn = statusModal.value.querySelector('.btn-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => statusModalInstance.hide())
    }
  }

  if (detailsModal.value) {
    detailsModalInstance = {
      show: () => showModal(detailsModal.value!),
      hide: () => hideModal(detailsModal.value!)
    }

    // Close on X button
    const closeBtn = detailsModal.value.querySelector('.btn-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => detailsModalInstance.hide())
    }
  }
}

// Lifecycle
onMounted(() => {
  loadOrders()
  initModals()

  // Add keyboard shortcuts
  const handleKeypress = (e: KeyboardEvent) => {
    // Ctrl/Cmd + R: Refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault()
      refreshData()
    }
    // F: Toggle filters
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const target = e.target as HTMLElement
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        toggleFilters()
      }
    }
    // Escape: Clear selection
    if (e.key === 'Escape') {
      // Xóa clearSelection khỏi mã
    }
  }

  document.addEventListener('keydown', handleKeypress)

  // Cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeypress)
  }
})

onUnmounted(() => {
  // Clean up auto refresh interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
  }
})
</script>

<style scoped>
.admin-orders-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table th {
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa !important;
}

.table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.dropdown-toggle::after {
  display: none;
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.spinner-border-sm {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1055;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}

.modal.show {
  display: block !important;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 0.5rem;
  pointer-events: none;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}

.modal-backdrop.fade {
  opacity: 0;
}

.modal-backdrop.show {
  opacity: 0.5;
}

.custom-modal-centered {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: auto;
  max-width: 600px;
}

.modal-dialog.custom-modal-centered {
  margin: auto;
}

/* Responsive table */
@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .table th,
  .table td {
    padding: 0.5rem;
  }
}
</style>
