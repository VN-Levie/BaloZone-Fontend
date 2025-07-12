<template>
  <div class="orders-page" style="background:linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); min-height:100vh; padding: 2rem 0;">
    <div class="container-fluid px-4">
      <Breadcrumb :items="breadcrumbItems" class="mb-4" />
      
      <div class="page-header mb-4">
        <h1 class="page-title">
          <i class="bi bi-box-seam me-3"></i>
          Đơn hàng của tôi
        </h1>
        <p class="page-subtitle">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
      </div>
      
      <div class="row">
        <!-- Filters Sidebar -->
        <div class="col-lg-3 col-md-4 mb-4">
          <div class="filters-card">
            <div class="filters-header">
              <h5 class="filters-title">
                <i class="bi bi-funnel me-2"></i>
                Bộ lọc
              </h5>
            </div>
            <div class="filters-body">
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-clipboard-check me-2"></i>
                  Trạng thái đơn hàng
                </label>
                <select v-model="selectedStatus" class="filter-select">
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipped">Đang vận chuyển</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-calendar-range me-2"></i>
                  Khoảng thời gian
                </label>
                <select v-model="selectedDateRange" class="filter-select">
                  <option value="">Tất cả thời gian</option>
                  <option value="7">7 ngày qua</option>
                  <option value="30">30 ngày qua</option>
                  <option value="90">3 tháng qua</option>
                </select>
              </div>
              
              <button 
                v-if="selectedStatus || selectedDateRange"
                @click="clearFilters"
                class="btn-clear-filters"
              >
                <i class="bi bi-x-circle me-2"></i>
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
        
        <!-- Orders Content -->
        <div class="col-lg-9 col-md-8">
          <div class="orders-content">
            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Đang tải đơn hàng...</p>
              </div>
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="error-state">
              <div class="error-content">
                <i class="bi bi-exclamation-triangle"></i>
                <h5>Có lỗi xảy ra</h5>
                <p>{{ error }}</p>
                <button @click="fetchOrders" class="btn-retry">
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Thử lại
                </button>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else-if="orders.length === 0" class="empty-state">
              <div class="empty-content">
                <div class="empty-icon">
                  <i class="bi bi-box-seam"></i>
                </div>
                <h4 class="empty-title">
                  <span v-if="selectedStatus || selectedDateRange">
                    Không tìm thấy đơn hàng
                  </span>
                  <span v-else>
                    Chưa có đơn hàng nào
                  </span>
                </h4>
                <p class="empty-message">
                  <span v-if="selectedStatus || selectedDateRange">
                    Không có đơn hàng nào phù hợp với điều kiện lọc của bạn.
                  </span>
                  <span v-else>
                    Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm ngay!
                  </span>
                </p>
                
                <div class="empty-actions">
                  <button 
                    v-if="selectedStatus || selectedDateRange"
                    @click="clearFilters"
                    class="btn btn-secondary me-3"
                  >
                    <i class="bi bi-x-circle me-2"></i>
                    Xóa bộ lọc
                  </button>
                  <router-link to="/" class="btn btn-primary">
                    <i class="bi bi-shop me-2"></i>
                    {{ (selectedStatus || selectedDateRange) ? 'Tiếp tục mua sắm' : 'Bắt đầu mua sắm' }}
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Orders List -->
            <div v-else class="orders-grid">
              <div v-for="order in validOrders" :key="order.id" class="order-card">
                <div class="order-header">
                  <div class="order-info">
                    <h6 class="order-number">
                      <i class="bi bi-receipt me-2"></i>
                      {{ order.order_number || `#${order.id}` }}
                    </h6>
                    <p class="order-date">
                      <i class="bi bi-calendar3 me-1"></i>
                      {{ formatDate(order.created_at) }}
                    </p>
                  </div>
                  <div class="order-status">
                    <span class="status-badge" :class="getStatusClass(order.status)">
                      <i :class="getStatusIcon(order.status)" class="me-1"></i>
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                </div>
                
                <div class="order-body">
                  <div class="order-items">
                    <div v-for="item in order.items?.slice(0, 2)" :key="item.id" class="order-item">
                      <div class="item-image">
                        <img :src="item.product_image || '/placeholder.jpg'" :alt="item.product_name" />
                      </div>
                      <div class="item-details">
                        <h6 class="item-name">{{ item.product_name }}</h6>
                        <p class="item-info">
                          SL: {{ item.quantity }} × {{ formatPrice(item.price) }}
                        </p>
                      </div>
                    </div>
                    
                    <div v-if="order.items && order.items.length > 2" class="more-items">
                      <span class="more-text">
                        +{{ order.items.length - 2 }} sản phẩm khác
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="order-footer">
                  <div class="order-total">
                    <span class="total-label">Tổng cộng:</span>
                    <span class="total-amount">{{ formatPrice(order.total_amount) }}</span>
                  </div>
                  <div class="order-actions">
                    <router-link 
                      :to="`/order/${order.id}`" 
                      class="btn btn-outline-primary btn-sm"
                    >
                      <i class="bi bi-eye me-1"></i>
                      Chi tiết
                    </router-link>
                    <button 
                      v-if="canCancelOrder(order.status)"
                      @click="showCancelModal(order)"
                      class="btn btn-outline-danger btn-sm"
                    >
                      <i class="bi bi-x-circle me-1"></i>
                      Hủy đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div v-if="orders.length > 0 && pagination.last_page > 1" class="pagination-wrapper">
              <nav class="pagination-nav">
                <ul class="pagination">
                  <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                    <button class="page-link" @click="changePage(pagination.current_page - 1)">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === pagination.current_page }">
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                  </li>
                  
                  <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                    <button class="page-link" @click="changePage(pagination.current_page + 1)">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Cancel Order Modal -->
    <div v-if="showCancelOrderModal" class="modal-overlay" @click="hideCancelModal">
      <div class="cancel-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <h4 class="modal-title">Xác nhận hủy đơn hàng</h4>
        </div>
        <div class="modal-body">
          <p class="modal-message">Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
          <div v-if="orderToCancel" class="order-preview">
            <div class="preview-header">
              <i class="bi bi-receipt me-2"></i>
              {{ orderToCancel.order_number || `#${orderToCancel.id}` }}
            </div>
            <div class="preview-info">
              Tổng giá trị: {{ formatPrice(orderToCancel.total_amount) }}
            </div>
          </div>
          <p class="warning-text">
            <i class="bi bi-info-circle me-2"></i>
            Hành động này không thể hoàn tác
          </p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="hideCancelModal">
            <i class="bi bi-x-circle me-2"></i>
            Giữ đơn hàng
          </button>
          <button class="btn btn-confirm-cancel" @click="confirmCancelOrder" :disabled="cancelling">
            <span v-if="cancelling" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-trash me-2"></i>
            {{ cancelling ? 'Đang hủy...' : 'Xác nhận hủy' }}
          </button>
        </div>
      </div>
    </div>
    
    <ToastContainer />
  </div>
</template>
                           
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ordersApi } from '../services/api'
import type { Order, PaginatedResponse } from '../types'
import { formatPrice, formatDate } from '../utils'
import { useToast } from '../composables/useToast'
import Breadcrumb from '../components/Breadcrumb.vue'
import ToastContainer from '../components/ToastContainer.vue'

const router = useRouter()
const { showToast } = useToast()

// State
const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedStatus = ref('')
const selectedDateRange = ref('')

// Pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0
})

// Cancel modal
const showCancelOrderModal = ref(false)
const orderToCancel = ref<Order | null>(null)
const cancelling = ref(false)

// Breadcrumb
const breadcrumbItems = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Đơn hàng của tôi', path: '/orders' }
]

// Computed
const validOrders = computed(() => {
  return orders.value.filter(order => order && order.id)
})

const visiblePages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const range = 2
  const start = Math.max(1, current - range)
  const end = Math.min(last, current + range)
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Watchers
watch([selectedStatus, selectedDateRange], () => {
  pagination.value.current_page = 1
  fetchOrders()
})

// Methods
const fetchOrders = async () => {
  try {
    loading.value = true
    error.value = null
    
    const params = {
      page: pagination.value.current_page,
      status: selectedStatus.value || undefined,
      days: selectedDateRange.value ? parseInt(selectedDateRange.value) : undefined
    }
    
    const response = await ordersApi.getUserOrders(params.page, params.status, params.days)
    const paginatedData = response.data as PaginatedResponse<Order>
    
    orders.value = Array.isArray(paginatedData.data) 
      ? paginatedData.data.filter(order => order && order.id)
      : []
    
    pagination.value = {
      current_page: paginatedData.current_page,
      last_page: paginatedData.last_page,
      per_page: paginatedData.per_page,
      total: paginatedData.total
    }
  } catch (err: any) {
    console.error('Failed to load orders:', err)
    error.value = err.response?.data?.message || 'Không thể tải danh sách đơn hàng'
    orders.value = []
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    fetchOrders()
  }
}

const clearFilters = () => {
  selectedStatus.value = ''
  selectedDateRange.value = ''
}

// Status helpers
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled'
  }
  return classes[status as keyof typeof classes] || 'status-default'
}

const getStatusIcon = (status: string) => {
  const icons = {
    pending: 'bi-clock',
    confirmed: 'bi-check-circle',
    shipped: 'bi-truck',
    delivered: 'bi-check-circle-fill',
    cancelled: 'bi-x-circle'
  }
  return icons[status as keyof typeof icons] || 'bi-circle'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipped: 'Đang vận chuyển',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy'
  }
  return texts[status as keyof typeof texts] || status
}

const canCancelOrder = (status: string) => {
  return ['pending', 'confirmed'].includes(status)
}

// Cancel order
const showCancelModal = (order: Order) => {
  orderToCancel.value = order
  showCancelOrderModal.value = true
}

const hideCancelModal = () => {
  orderToCancel.value = null
  showCancelOrderModal.value = false
}

const confirmCancelOrder = async () => {
  if (!orderToCancel.value) return
  
  try {
    cancelling.value = true
    await ordersApi.cancelOrder(orderToCancel.value.id)
    showToast('Đơn hàng đã được hủy thành công', 'success')
    hideCancelModal()
    await fetchOrders()
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Không thể hủy đơn hàng', 'error')
  } finally {
    cancelling.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
/* Page Layout */
.orders-page {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* Filters Card */
.filters-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.filters-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.filters-header {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  padding: 1.5rem;
  color: white;
}

.filters-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.filters-body {
  padding: 1.5rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.btn-clear-filters {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-clear-filters:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

/* Orders Content */
.orders-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  flex-direction: column;
}

.loading-spinner .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

/* Error State */
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-content {
  text-align: center;
  color: #dc3545;
}

.error-content i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-content h5 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.btn-retry {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon i {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.5rem;
  color: #495057;
  margin-bottom: 1rem;
}

.empty-message {
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.empty-actions .btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.empty-actions .btn-primary {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border: none;
}

.empty-actions .btn-secondary {
  background: #6c757d;
  border: none;
}

.empty-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Orders Grid */
.orders-grid {
  display: grid;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 107, 53, 0.3);
}

/* Order Header */
.order-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.order-info .order-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.order-info .order-date {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: linear-gradient(135deg, #ffc107, #ffb300);
  color: #000;
}

.status-confirmed {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
}

.status-shipped {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.status-delivered {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
}

.status-cancelled {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
}

/* Order Body */
.order-body {
  padding: 1.5rem;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.item-image {
  flex-shrink: 0;
}

.item-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.item-info {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.more-items {
  text-align: center;
  padding: 0.75rem;
  background: #e9ecef;
  border-radius: 8px;
  color: #6c757d;
  font-style: italic;
}

/* Order Footer */
.order-footer {
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.order-total {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.total-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.total-amount {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.order-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.order-actions .btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid;
}

.order-actions .btn-outline-primary {
  color: #ff6b35;
  border-color: #ff6b35;
  background: transparent;
}

.order-actions .btn-outline-primary:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.order-actions .btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
  background: transparent;
}

.order-actions .btn-outline-danger:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Pagination */
.pagination-wrapper {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}

.pagination-nav .pagination {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.page-item .page-link {
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e9ecef;
  color: #495057;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.page-item .page-link:hover:not(.disabled) {
  background: #ff6b35;
  border-color: #ff6b35;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-color: #ff6b35;
  color: white;
}

.page-item.disabled .page-link {
  background: #f8f9fa;
  border-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* Cancel Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cancel-modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 2rem;
  text-align: center;
}

.modal-icon i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.modal-body {
  padding: 2rem;
}

.modal-message {
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 1.5rem;
  text-align: center;
}

.order-preview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.preview-header {
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.preview-info {
  color: #6c757d;
  font-size: 0.95rem;
}

.warning-text {
  background: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ffeaa7;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

.modal-actions {
  padding: 2rem;
  background: #f8f9fa;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-actions .btn {
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #545b62;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
}

.btn-confirm-cancel {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
}

.btn-confirm-cancel:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

.btn-confirm-cancel:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .orders-page {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .filters-card,
  .orders-content {
    border-radius: 15px;
  }
  
  .order-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .order-footer {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .filters-body,
  .orders-content {
    padding: 1rem;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-image img {
    width: 80px;
    height: 80px;
  }
}
</style>
