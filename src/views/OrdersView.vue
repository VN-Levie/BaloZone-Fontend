<template>
  <div class="orders-view">
    <div class="container mt-4">
      <Breadcrumb :items="breadcrumbItems" />
      
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">Đơn hàng của tôi</h1>
          
          <LoadingSpinner v-if="loading" />
          
          <div v-else-if="error" class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
          </div>
          
          <div v-else>
            <!-- Always show filters -->
            <div class="row">
              <div class="col-md-3 mb-4">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">
                      <i class="fas fa-filter me-2"></i>Lọc đơn hàng
                    </h6>
                    <div class="mb-3">
                      <label class="form-label">Trạng thái</label>
                      <select v-model="selectedStatus" class="form-select">
                        <option value="">Tất cả</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipped">Đang vận chuyển</option>
                        <option value="delivered">Đã giao hàng</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Thời gian</label>
                      <select v-model="selectedDateRange" class="form-select">
                        <option value="">Tất cả thời gian</option>
                        <option value="7">7 ngày qua</option>
                        <option value="30">30 ngày qua</option>
                        <option value="90">3 tháng qua</option>
                      </select>
                    </div>
                    
                    <!-- Clear filters button -->
                    <button 
                      v-if="selectedStatus || selectedDateRange"
                      @click="clearFilters"
                      class="btn btn-outline-secondary btn-sm w-100"
                    >
                      <i class="fas fa-times me-2"></i>Xóa bộ lọc
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="col-md-9">
                <!-- Empty state when no orders found -->
                <div v-if="orders.length === 0" class="text-center py-5">
                  <div class="empty-state">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>Không tìm thấy đơn hàng nào</h4>
                    <p class="text-muted mb-3">
                      <span v-if="selectedStatus || selectedDateRange">
                        Không có đơn hàng nào phù hợp với điều kiện lọc của bạn.
                      </span>
                      <span v-else>
                        Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm ngay!
                      </span>
                    </p>
                    
                    <!-- Show different actions based on filter state -->
                    <div v-if="selectedStatus || selectedDateRange">
                      <button 
                        @click="clearFilters"
                        class="btn btn-outline-primary me-2"
                      >
                        <i class="fas fa-times me-2"></i>Xóa bộ lọc
                      </button>
                      <router-link to="/" class="btn btn-primary">
                        <i class="fas fa-shopping-cart me-2"></i>Tiếp tục mua sắm
                      </router-link>
                    </div>
                    <div v-else>
                      <router-link to="/" class="btn btn-primary">
                        <i class="fas fa-shopping-cart me-2"></i>Bắt đầu mua sắm
                      </router-link>
                    </div>
                  </div>
                </div>
                
                <!-- Orders list when data exists -->
                <div v-else class="order-list">
                  <template v-for="order in validOrders" :key="order.id">
                    <div class="card mb-3">
                      <div class="card-header d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="mb-0">{{ order.order_number || `Đơn hàng #${order.id}` }}</h6>
                          <small class="text-muted">
                            <i class="far fa-calendar-alt me-1"></i>{{ formatDate(order.created_at) }}
                          </small>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <span :class="getStatusBadgeClass(order.status)">
                            {{ getStatusText(order.status) }}
                          </span>
                          <span :class="getPaymentStatusBadgeClass(order.payment_status)" class="ms-2">
                            {{ getPaymentStatusText(order.payment_status) }}
                          </span>
                        </div>
                    </div>
                    
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-8">
                          <div class="order-items">
                            <div 
                              v-for="item in order.items" 
                              :key="item.id"
                              class="d-flex align-items-center mb-2"
                            >
                              <img 
                                :src="item.product_image || '/placeholder-image.jpg'"
                                :alt="item.product_name"
                                class="order-item-image me-3"
                              >
                              <div class="flex-grow-1">
                                <h6 class="mb-1">{{ item.product_name }}</h6>
                                <small class="text-muted">
                                  Số lượng: {{ item.quantity }} × {{ formatPrice(Number(item.price)) }}
                                </small>
                              </div>
                              <div class="text-end">
                                <strong>{{ formatPrice(item.total) }}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="col-md-4">
                          <div class="order-summary">
                            <div class="d-flex justify-content-between mb-2">
                              <span>Tạm tính:</span>
                              <span>{{ formatPrice(Number(order.total_amount)) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                              <span>Phí vận chuyển:</span>
                              <span>{{ formatPrice(Number(order.shipping_fee)) }}</span>
                            </div>
                            <div v-if="Number(order.voucher_discount) > 0" class="d-flex justify-content-between mb-2 text-success">
                              <span>Giảm giá:</span>
                              <span>-{{ formatPrice(Number(order.voucher_discount)) }}</span>
                            </div>
                            <div class="d-flex justify-content-between border-top pt-2">
                              <strong>Tổng cộng:</strong>
                              <strong class="text-primary">{{ formatPrice(Number(order.final_amount)) }}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="row mt-3">
                        <div class="col-md-6">
                          <h6>Địa chỉ giao hàng</h6>
                          <div class="address-info">
                            <p class="mb-1" v-if="order.shipping_address?.recipient_name">
                              <strong>{{ order.shipping_address.recipient_name }}</strong>
                            </p>
                            <p class="mb-1" v-if="order.shipping_address?.recipient_phone">
                              <i class="fas fa-phone text-muted me-2"></i>{{ order.shipping_address.recipient_phone }}
                            </p>
                            <p class="mb-0">
                              <i class="fas fa-map-marker-alt text-muted me-2"></i>
                              {{ order.shipping_address?.address }}
                            </p>
                            <p class="mb-0 text-muted">
                              {{ order.shipping_address?.ward }}, {{ order.shipping_address?.district }}
                            </p>
                            <p class="mb-0 text-muted">{{ order.shipping_address?.province }}</p>
                          </div>
                        </div>
                        
                        <div class="col-md-6">
                          <h6>Thao tác</h6>
                          <div class="btn-group-vertical w-100">
                            <button 
                              v-if="order.payment_status === 'pending'"
                              @click="cancelOrder(order.id)"
                              class="btn btn-outline-danger btn-sm"
                            >
                              <i class="fas fa-times me-2"></i>Hủy đơn hàng
                            </button>
                            <button 
                              @click="viewOrderDetail(order.id)"
                              class="btn btn-outline-primary btn-sm"
                            >
                              <i class="fas fa-eye me-2"></i>Xem chi tiết
                            </button>
                            <button 
                              v-if="order.payment_status === 'paid'"
                              @click="reorderItems(order.id)"
                              class="btn btn-outline-success btn-sm"
                            >
                              <i class="fas fa-redo me-2"></i>Đặt lại
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  </template>
                </div>
                
                <!-- Pagination -->
                <nav v-if="totalPages > 1" aria-label="Orders pagination">
                  <ul class="pagination justify-content-center">
                    <li :class="['page-item', { disabled: currentPage <= 1 }]">
                      <button 
                        @click="changePage(currentPage - 1)"
                        class="page-link"
                        :disabled="currentPage <= 1"
                      >
                        Trước
                      </button>
                    </li>
                    
                    <li 
                      v-for="page in visiblePages" 
                      :key="page"
                      :class="['page-item', { active: page === currentPage }]"
                    >
                      <button @click="changePage(page)" class="page-link">
                        {{ page }}
                      </button>
                    </li>
                    
                    <li :class="['page-item', { disabled: currentPage >= totalPages }]">
                      <button 
                        @click="changePage(currentPage + 1)"
                        class="page-link"
                        :disabled="currentPage >= totalPages"
                      >
                        Sau
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ordersApi } from '../services/api'
import type { Order } from '../types'
import { formatPrice, formatDate } from '../utils'
import { useCart } from '../composables/useCart'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import Breadcrumb from '../components/Breadcrumb.vue'

const router = useRouter()
const { addToCart } = useCart()

const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const selectedStatus = ref('')
const selectedDateRange = ref('')

// Reset pagination when filters change
watch([selectedStatus, selectedDateRange], () => {
  currentPage.value = 1
  fetchOrders()
})

// Filter out null/undefined orders
const validOrders = computed(() => {
  return orders.value.filter(order => order && order.id)
})

const breadcrumbItems = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Đơn hàng của tôi', path: '/orders' }
]

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge bg-warning text-dark',
    confirmed: 'badge bg-info text-dark', 
    shipped: 'badge bg-primary',
    delivered: 'badge bg-success',
    cancelled: 'badge bg-danger'
  }
  return classes[status as keyof typeof classes] || 'badge bg-secondary'
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

const getPaymentStatusBadgeClass = (paymentStatus: string) => {
  const classes = {
    pending: 'badge bg-warning text-dark',
    paid: 'badge bg-success',
    failed: 'badge bg-danger',
    refunded: 'badge bg-secondary'
  }
  return classes[paymentStatus as keyof typeof classes] || 'badge bg-secondary'
}

const getPaymentStatusText = (paymentStatus: string) => {
  const texts = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền'
  }
  return texts[paymentStatus as keyof typeof texts] || paymentStatus
}

const visiblePages = computed(() => {
  const range = 2
  const start = Math.max(1, currentPage.value - range)
  const end = Math.min(totalPages.value, currentPage.value + range)
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const clearFilters = () => {
  selectedStatus.value = ''
  selectedDateRange.value = ''
  // fetchOrders will be called automatically by watchers
}

const fetchOrders = async () => {
  try {
    loading.value = true
    error.value = null
    
    const params = {
      page: currentPage.value,
      status: selectedStatus.value || undefined,
      days: selectedDateRange.value ? parseInt(selectedDateRange.value) : undefined
    }
    
    // Pass all filter parameters to the API
    const response = await ordersApi.getUserOrders(params.page, params.status, params.days)
    
    // response.data is PaginatedResponse<Order>, response.data.data is Order[]
    const paginatedData = response.data
    const ordersData = paginatedData?.data || []
    
    // Ensure we have a valid array and filter out null/undefined items
    orders.value = Array.isArray(ordersData) 
      ? ordersData.filter(order => order && order.id) 
      : []
    
    // Get pagination info
    totalPages.value = paginatedData?.last_page || 1
    
    console.log('Orders loaded:', orders.value)
    console.log('Total pages:', totalPages.value)
  } catch (err: any) {
    console.error('Failed to load orders:', err)
    error.value = err.response?.data?.message || 'Failed to load orders'
    orders.value = [] // Reset to empty array on error
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchOrders()
  }
}

const cancelOrder = async (orderId: number) => {
  if (!confirm('Are you sure you want to cancel this order?')) {
    return
  }
  
  try {
    await ordersApi.cancelOrder(orderId)
    await fetchOrders() // Refresh the list
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to cancel order')
  }
}

const viewOrderDetail = (orderId: number) => {
  router.push(`/order/${orderId}`)
}

const reorderItems = async (orderId: number) => {
  try {
    const order = orders.value.find(o => o.id === orderId)
    if (!order || !order.items) return
    
    for (const item of order.items) {
      if (item.product_name && item.product_image) {
        // Create a product-like object from order item data
        const product = {
          id: item.product_id || 0,
          name: item.product_name,
          price: item.price,
          originalPrice: item.price,
          quantity: 1, // Product quantity field (different from order item quantity)
          image: item.product_image,
          slug: `product-${item.product_id}`,
          description: '',
          brand_id: 0,
          category_id: 0,
          created_at: '',
          updated_at: ''
        }
        await addToCart(product, item.quantity)
      }
    }
    
    router.push('/cart')
  } catch (err: any) {
    alert('Failed to add items to cart')
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.order-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.order-summary {
  background-color: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem;
}

.card-body {
  padding: 1.5rem;
}

.order-items {
  max-height: 200px;
  overflow-y: auto;
}

.order-items::-webkit-scrollbar {
  width: 4px;
}

.order-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.order-items::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.order-items::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.btn-group-vertical .btn {
  margin-bottom: 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-group-vertical .btn:last-child {
  margin-bottom: 0;
}

.btn-outline-primary:hover {
  transform: translateY(-1px);
}

.badge {
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
}

.form-select {
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.pagination .page-link {
  border-radius: 8px;
  margin: 0 2px;
  border: 1px solid #e9ecef;
  color: #6c757d;
  transition: all 0.2s ease;
}

.pagination .page-link:hover {
  background-color: #f8f9fa;
  border-color: #0d6efd;
  color: #0d6efd;
  transform: translateY(-1px);
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.address-info {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #0d6efd;
}

.address-info p {
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.address-info i {
  width: 16px;
  text-align: center;
}

/* Empty state styling */
.empty-state {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin: 2rem 0;
  border: 1px solid #e9ecef;
}

.empty-state i {
  opacity: 0.6;
}

.empty-state h4 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1rem;
  line-height: 1.6;
}

/* Filter card improvements */
.card-title i {
  color: #0d6efd;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .order-item-image {
    width: 50px;
    height: 50px;
  }
  
  .card-body .row > div {
    margin-bottom: 1rem;
  }
  
  .order-summary {
    padding: 1rem;
  }
  
  .btn-group-vertical .btn {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 576px) {
  .card-header {
    padding: 1rem;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .order-summary {
    margin-top: 1rem;
  }
}
</style>
