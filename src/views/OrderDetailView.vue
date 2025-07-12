<template>
  <div class="order-detail-page" style="background:linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); min-height:100vh; padding: 2rem 0;">
    <div class="container-fluid px-4">
      <Breadcrumb :items="breadcrumbItems" class="mb-4" />
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-content">
          <i class="bi bi-exclamation-triangle"></i>
          <h5>Có lỗi xảy ra</h5>
          <p>{{ error }}</p>
          <div class="error-actions">
            <button @click="fetchOrderDetail" class="btn-retry">
              <i class="bi bi-arrow-clockwise me-2"></i>
              Thử lại
            </button>
            <router-link to="/orders" class="btn-back">
              <i class="bi bi-arrow-left me-2"></i>
              Quay lại danh sách
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Order Detail Content -->
      <div v-else-if="order" class="order-detail-content">
        <!-- Order Header Card -->
        <div class="order-header-card mb-4">
          <div class="order-header-content">
            <div class="order-info">
              <div class="order-number">
                <i class="bi bi-receipt-cutoff me-3"></i>
                {{ order.order_number || `Đơn hàng #${order.id}` }}
              </div>
              <div class="order-meta">
                <span class="order-date">
                  <i class="bi bi-calendar3 me-2"></i>
                  {{ formatDate(order.created_at) }}
                </span>
              </div>
            </div>
            <div class="order-badges">
              <span class="status-badge" :class="getStatusClass(order.status)">
                <i :class="getStatusIcon(order.status)" class="me-2"></i>
                {{ getStatusText(order.status) }}
              </span>
              <span class="payment-badge" :class="getPaymentStatusClass(order.payment_status)">
                <i :class="getPaymentStatusIcon(order.payment_status)" class="me-2"></i>
                {{ getPaymentStatusText(order.payment_status) }}
              </span>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Left Column -->
          <div class="col-lg-8 mb-4">
            <!-- Order Items Card -->
            <div class="detail-card mb-4">
              <div class="card-header">
                <h5 class="card-title">
                  <i class="bi bi-bag-check me-2"></i>
                  Sản phẩm đã đặt
                </h5>
              </div>
              <div class="card-body">
                <div class="order-items">
                  <div v-for="item in order.items" :key="item.id" class="order-item">
                    <div class="item-image">
                      <img 
                        :src="item.product_image || '/placeholder.jpg'"
                        :alt="item.product_name"
                      />
                    </div>
                    <div class="item-details">
                      <h6 class="item-name">
                        <router-link 
                          :to="`/product/${item.product_id}`" 
                          class="product-link"
                        >
                          {{ item.product_name }}
                        </router-link>
                      </h6>
                      <p class="item-id">ID: {{ item.product_id }}</p>
                    </div>
                    <div class="item-quantity">
                      <span class="quantity-badge">{{ item.quantity }}</span>
                    </div>
                    <div class="item-price">
                      <div class="unit-price">{{ formatPrice(Number(item.price)) }}</div>
                      <div class="total-price">{{ formatPrice(item.total) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipping Address Card -->
            <div class="detail-card mb-4">
              <div class="card-header">
                <h5 class="card-title">
                  <i class="bi bi-geo-alt me-2"></i>
                  Địa chỉ giao hàng
                </h5>
              </div>
              <div class="card-body">
                <div class="address-card">
                  <div class="address-header">
                    <div v-if="order.shipping_address?.recipient_name" class="recipient-name">
                      <i class="bi bi-person-fill me-2"></i>
                      {{ order.shipping_address.recipient_name }}
                    </div>
                    <div v-if="order.shipping_address?.recipient_phone" class="recipient-phone">
                      <i class="bi bi-telephone-fill me-2"></i>
                      {{ order.shipping_address.recipient_phone }}
                    </div>
                  </div>
                  <div class="address-details">
                    <i class="bi bi-geo-alt-fill me-2"></i>
                    <div class="address-text">
                      <div>{{ order.shipping_address?.address }}</div>
                      <div class="address-location">
                        {{ order.shipping_address?.ward }}, {{ order.shipping_address?.district }}, {{ order.shipping_address?.province }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Timeline Card -->
            <div class="detail-card">
              <div class="card-header">
                <h5 class="card-title">
                  <i class="bi bi-clock-history me-2"></i>
                  Lịch sử đơn hàng
                </h5>
              </div>
              <div class="card-body">
                <div v-if="order.order_history && order.order_history.length > 0" class="timeline">
                  <div 
                    v-for="(history, index) in order.order_history" 
                    :key="index"
                    class="timeline-item"
                  >
                    <div class="timeline-marker">
                      <i :class="getStatusIcon(history.status)"></i>
                    </div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <span class="timeline-status">{{ getStatusText(history.status) }}</span>
                        <span class="timeline-date">{{ formatDate(history.created_at) }}</span>
                      </div>
                      <p v-if="history.note" class="timeline-note">{{ history.note }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-timeline">
                  <div class="empty-icon">
                    <i class="bi bi-clock"></i>
                  </div>
                  <p>Chưa có lịch sử cập nhật cho đơn hàng này</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">
            <!-- Order Summary Card -->
            <div class="detail-card mb-4">
              <div class="card-header">
                <h5 class="card-title">
                  <i class="bi bi-calculator me-2"></i>
                  Tóm tắt đơn hàng
                </h5>
              </div>
              <div class="card-body">
                <div class="summary-section">
                  <div class="summary-row">
                    <span class="summary-label">Tạm tính:</span>
                    <span class="summary-value">{{ formatPrice(Number(order.total_amount)) }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Phí vận chuyển:</span>
                    <span class="summary-value">{{ formatPrice(Number(order.shipping_fee)) }}</span>
                  </div>
                  <div v-if="Number(order.voucher_discount) > 0" class="summary-row discount">
                    <span class="summary-label">
                      <i class="bi bi-tag me-1"></i>Giảm giá:
                    </span>
                    <span class="summary-value">-{{ formatPrice(Number(order.voucher_discount)) }}</span>
                  </div>
                  <div class="summary-divider"></div>
                  <div class="summary-total">
                    <span class="total-label">Tổng cộng:</span>
                    <span class="total-value">{{ formatPrice(Number(order.final_amount)) }}</span>
                  </div>
                </div>

                <div class="payment-section">
                  <div class="payment-method">
                    <span class="payment-label">Phương thức thanh toán:</span>
                    <span class="payment-value">
                      <i :class="getPaymentMethodIcon(order.payment_method)" class="me-2"></i>
                      {{ getPaymentMethodText(order.payment_method) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions Card -->
            <div class="detail-card">
              <div class="card-header">
                <h5 class="card-title">
                  <i class="bi bi-gear me-2"></i>
                  Thao tác
                </h5>
              </div>
              <div class="card-body">
                <div class="action-buttons">
                  <button 
                    v-if="canCancelOrder(order.status)"
                    @click="showCancelModal"
                    class="action-btn cancel-btn"
                  >
                    <i class="bi bi-x-circle me-2"></i>
                    Hủy đơn hàng
                  </button>
                  <button 
                    v-if="canReorder(order.status, order.payment_status)"
                    @click="showReorderConfirmModal"
                    class="action-btn reorder-btn"
                  >
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Đặt lại lần nữa
                  </button>
                  <router-link to="/orders" class="action-btn back-btn">
                    <i class="bi bi-arrow-left me-2"></i>
                    Quay lại danh sách
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reorder Confirmation Modal -->
    <div v-if="showReorderModal" class="modal-overlay" @click="hideReorderModal">
      <div class="reorder-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon">
            <i class="bi bi-arrow-clockwise"></i>
          </div>
          <h4 class="modal-title">Đặt lại đơn hàng</h4>
        </div>
        <div class="modal-body">
          <p class="modal-message">Bạn có muốn thêm tất cả sản phẩm từ đơn hàng này vào giỏ hàng?</p>
          <div class="order-preview">
            <div class="preview-header">
              <i class="bi bi-bag-check me-2"></i>
              {{ order?.items?.length || 0 }} sản phẩm
            </div>
            <div class="reorder-items">
              <div v-for="item in order?.items?.slice(0, 3)" :key="item.id" class="reorder-item">
                <img :src="item.product_image || '/placeholder.jpg'" :alt="item.product_name" />
                <div class="item-info">
                  <span class="item-name">{{ item.product_name }}</span>
                  <span class="item-quantity">x{{ item.quantity }}</span>
                </div>
              </div>
              <div v-if="order?.items && order.items.length > 3" class="more-items">
                +{{ order.items.length - 3 }} sản phẩm khác
              </div>
            </div>
          </div>
          <p class="info-text">
            <i class="bi bi-info-circle me-2"></i>
            Sản phẩm sẽ được thêm vào giỏ hàng với giá hiện tại
          </p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="hideReorderModal">
            <i class="bi bi-x-circle me-2"></i>
            Hủy bỏ
          </button>
          <button class="btn btn-confirm-reorder" @click="confirmReorder" :disabled="reordering">
            <span v-if="reordering" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-cart-plus me-2"></i>
            {{ reordering ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
          </button>
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
          <div class="order-preview">
            <div class="preview-header">
              <i class="bi bi-receipt me-2"></i>
              {{ order?.order_number || `#${order?.id}` }}
            </div>
            <div class="preview-info">
              Tổng giá trị: {{ formatPrice(Number(order?.final_amount)) }}
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersApi } from '../services/api'
import type { Order } from '../types'
import { formatPrice, formatDate } from '../utils'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'
import Breadcrumb from '../components/Breadcrumb.vue'
import ToastContainer from '../components/ToastContainer.vue'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()
const { showToast } = useToast()

// State
const order = ref<Order | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showCancelOrderModal = ref(false)
const showReorderModal = ref(false)
const cancelling = ref(false)
const reordering = ref(false)

const orderId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string)
})

const breadcrumbItems = computed(() => [
  { name: 'Trang chủ', path: '/' },
  { name: 'Đơn hàng của tôi', path: '/orders' },
  { name: order.value?.order_number || `Đơn hàng #${orderId.value}`, path: '' }
])

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

const getPaymentStatusClass = (paymentStatus: string) => {
  const classes = {
    pending: 'payment-pending',
    paid: 'payment-paid',
    failed: 'payment-failed',
    refunded: 'payment-refunded'
  }
  return classes[paymentStatus as keyof typeof classes] || 'payment-default'
}

const getPaymentStatusIcon = (paymentStatus: string) => {
  const icons = {
    pending: 'bi-clock',
    paid: 'bi-check-circle-fill',
    failed: 'bi-x-circle',
    refunded: 'bi-arrow-clockwise'
  }
  return icons[paymentStatus as keyof typeof icons] || 'bi-circle'
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

const getPaymentMethodIcon = (method: string) => {
  const icons = {
    cod: 'bi-cash',
    vnpay: 'bi-credit-card',
    momo: 'bi-phone'
  }
  return icons[method as keyof typeof icons] || 'bi-credit-card'
}

const getPaymentMethodText = (method: string) => {
  const methods = {
    cod: 'Thanh toán khi nhận hàng',
    vnpay: 'VNPay',
    momo: 'MoMo'
  }
  return methods[method as keyof typeof methods] || method
}

const canCancelOrder = (status: string) => {
  return ['pending', 'confirmed'].includes(status)
}

const canReorder = (status: string, paymentStatus: string) => {
  // Cho phép đặt lại khi đơn hàng đã được giao, đã hủy, hoặc đã thanh toán
  return ['delivered', 'cancelled'].includes(status) || paymentStatus === 'paid'
}

// Methods
const fetchOrderDetail = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await ordersApi.getOrder(orderId.value)
    order.value = response.data
  } catch (err: any) {
    console.error('Failed to load order detail:', err)
    error.value = err.response?.data?.message || 'Không thể tải chi tiết đơn hàng'
  } finally {
    loading.value = false
  }
}

const showCancelModal = () => {
  showCancelOrderModal.value = true
}

const hideCancelModal = () => {
  showCancelOrderModal.value = false
}

const showReorderConfirmModal = () => {
  showReorderModal.value = true
}

const hideReorderModal = () => {
  showReorderModal.value = false
}

const confirmCancelOrder = async () => {
  if (!order.value) return
  
  try {
    cancelling.value = true
    await ordersApi.cancelOrder(order.value.id)
    showToast('Đơn hàng đã được hủy thành công', 'success')
    hideCancelModal()
    await fetchOrderDetail()
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Không thể hủy đơn hàng', 'error')
  } finally {
    cancelling.value = false
  }
}

const confirmReorder = async () => {
  try {
    reordering.value = true
    await reorderItems()
    hideReorderModal()
  } catch (err: any) {
    console.error('Confirm reorder failed:', err)
  } finally {
    reordering.value = false
  }
}

const reorderItems = async () => {
  if (!order.value || !order.value.items || order.value.items.length === 0) {
    showToast('Không có sản phẩm nào để đặt lại', 'warning')
    return
  }
  
  let addedCount = 0
  
  for (const item of order.value.items) {
    if (item.product_name && item.product_id) {
      try {
        const product = {
          id: item.product_id || 0,
          name: item.product_name,
          price: item.price,
          originalPrice: item.price,
          quantity: 1,
          image: item.product_image || '/placeholder.jpg',
          slug: `product-${item.product_id}`,
          description: '',
          brand_id: 0,
          category_id: 0,
          created_at: '',
          updated_at: ''
        }
        await addToCart(product, item.quantity)
        addedCount++
      } catch (itemError) {
        console.error(`Failed to add item ${item.product_name}:`, itemError)
      }
    }
  }
  
  if (addedCount > 0) {
    showToast(`Đã thêm ${addedCount} sản phẩm vào giỏ hàng`, 'success')
    
    // Navigate to cart after a short delay
    setTimeout(() => {
      router.push('/cart')
    }, 1500)
  } else {
    showToast('Không thể thêm sản phẩm nào vào giỏ hàng', 'error')
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
/* Page Layout */
.order-detail-page {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.loading-spinner {
  text-align: center;
  color: white;
}

.loading-spinner .spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  font-size: 1.2rem;
  margin: 0;
}

.error-content {
  text-align: center;
  color: white;
  max-width: 400px;
}

.error-content i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-content h5 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.error-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-retry,
.btn-back {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-retry {
  background: rgba(255, 255, 255, 0.9);
  color: #ff6b35;
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-retry:hover,
.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Order Header Card */
.order-header-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.order-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.order-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.order-date {
  color: #6c757d;
  font-size: 1rem;
}

.order-badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-badge,
.payment-badge {
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending { background: linear-gradient(135deg, #ffc107, #ffb300); color: #000; }
.status-confirmed { background: linear-gradient(135deg, #17a2b8, #138496); color: white; }
.status-shipped { background: linear-gradient(135deg, #007bff, #0056b3); color: white; }
.status-delivered { background: linear-gradient(135deg, #28a745, #1e7e34); color: white; }
.status-cancelled { background: linear-gradient(135deg, #dc3545, #c82333); color: white; }

.payment-pending { background: linear-gradient(135deg, #ffc107, #ffb300); color: #000; }
.payment-paid { background: linear-gradient(135deg, #28a745, #1e7e34); color: white; }
.payment-failed { background: linear-gradient(135deg, #dc3545, #c82333); color: white; }
.payment-refunded { background: linear-gradient(135deg, #6c757d, #495057); color: white; }

/* Detail Cards */
.detail-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.card-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.card-body {
  padding: 1.5rem;
}

/* Order Items */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.order-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.item-image {
  flex-shrink: 0;
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.product-link {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.product-link:hover {
  color: #ff6b35;
}

.item-id {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.item-quantity {
  flex-shrink: 0;
  margin: 0 1rem;
}

.quantity-badge {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.item-price {
  flex-shrink: 0;
  text-align: right;
}

.unit-price {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.total-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

/* Address Card */
.address-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #ff6b35;
}

.address-header {
  margin-bottom: 1rem;
}

.recipient-name,
.recipient-phone {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.address-details {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.address-text {
  flex: 1;
}

.address-location {
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -2.25rem;
  top: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: -2.05rem;
  top: 40px;
  bottom: -2rem;
  width: 3px;
  background: linear-gradient(to bottom, #ff6b35, #f7931e);
  border-radius: 2px;
}

.timeline-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-status {
  font-weight: 700;
  color: #ff6b35;
  font-size: 1rem;
}

.timeline-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.timeline-note {
  color: #495057;
  margin: 0;
  line-height: 1.6;
}

.empty-timeline {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-icon i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Summary Section */
.summary-section {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
}

.summary-row.discount {
  color: #28a745;
}

.summary-label,
.summary-value {
  font-size: 1rem;
}

.summary-divider {
  height: 2px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 1px;
  margin: 1rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
  padding: 1rem 1.5rem;
}

.total-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.payment-section {
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.payment-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-label {
  font-weight: 600;
  color: #495057;
}

.payment-value {
  color: #333;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  min-height: 50px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.action-btn i {
  flex-shrink: 0;
}

.action-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.3);
}

.cancel-btn {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white !important;
  border: 2px solid transparent;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #c82333, #a71e2a);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
  color: white !important;
  text-decoration: none !important;
}

.reorder-btn {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white !important;
  border: 2px solid transparent;
}

.reorder-btn:hover {
  background: linear-gradient(135deg, #1e7e34, #155724);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
  color: white !important;
  text-decoration: none !important;
}

.back-btn {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white !important;
  border: 2px solid transparent;
}

.back-btn:hover {
  background: linear-gradient(135deg, #f7931e, #e67e22);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
  color: white !important;
  text-decoration: none !important;
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Fix for router-link specific styles */
.action-btn.back-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.action-btn:visited,
.action-btn:link {
  color: white !important;
  text-decoration: none !important;
}

/* Modal */
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

.cancel-modal,
.reorder-modal {
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
  margin-bottom: 1rem;
}

.preview-info {
  color: #6c757d;
  font-size: 0.95rem;
}

/* Reorder Modal Specific Styles */
.reorder-items {
  margin-top: 1rem;
}

.reorder-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.reorder-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.item-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.item-quantity {
  color: #6c757d;
  font-size: 0.85rem;
  font-weight: 500;
}

.more-items {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 6px;
}

.info-text {
  background: #e7f3ff;
  color: #0066cc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #b3d9ff;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
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

.btn-confirm-reorder {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
}

.btn-confirm-reorder:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.btn-confirm-reorder:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 992px) {
  .order-header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .order-badges {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .order-detail-page {
    padding: 1rem 0;
  }
  
  .order-header-card,
  .detail-card {
    border-radius: 12px;
  }
  
  .order-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .item-image img {
    width: 100px;
    height: 100px;
  }
  
  .timeline {
    padding-left: 1.5rem;
  }
  
  .timeline-marker {
    left: -1.75rem;
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .timeline-item:not(:last-child)::before {
    left: -1.6rem;
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
  
  .order-header-card,
  .card-body {
    padding: 1rem;
  }
  
  .order-number {
    font-size: 1.4rem;
  }
  
  .status-badge,
  .payment-badge {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .action-btn {
    padding: 1rem;
    font-size: 0.95rem;
    min-height: 45px;
  }
  
  .action-btn i {
    margin-right: 0.5rem !important;
  }
}
</style>
