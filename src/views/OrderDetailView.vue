<template>
  <div class="order-detail-view">
    <div class="container mt-4">
      <Breadcrumb :items="breadcrumbItems" />
      
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="error" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
        <div class="mt-3">
          <router-link to="/orders" class="btn btn-outline-primary">
            <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách đơn hàng
          </router-link>
        </div>
      </div>
      
      <div v-else-if="order" class="order-detail">
        <!-- Order Header -->
        <div class="card mb-4">
          <div class="card-header">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h4 class="mb-1">{{ order.order_number || `Đơn hàng #${order.id}` }}</h4>
                <p class="mb-0 text-muted">
                  <i class="far fa-calendar-alt me-2"></i>{{ formatDate(order.created_at) }}
                </p>
              </div>
              <div class="col-md-4 text-md-end">
                <div class="order-status-badges">
                  <span :class="getStatusBadgeClass(order.status)" class="me-2">
                    {{ getStatusText(order.status) }}
                  </span>
                  <span :class="getPaymentStatusBadgeClass(order.payment_status)">
                    {{ getPaymentStatusText(order.payment_status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-shopping-cart me-2"></i>Sản phẩm đã đặt
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th class="text-center">Số lượng</th>
                    <th class="text-end">Đơn giá</th>
                    <th class="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.id" class="order-item-row">
                    <td>
                      <div class="d-flex align-items-center">
                        <img 
                          :src="item.product_image || '/placeholder-image.jpg'"
                          :alt="item.product_name"
                          class="product-image me-3"
                        >
                        <div>
                          <h6 class="mb-1">
                            <router-link 
                              :to="`/product/${item.product_id}`" 
                              class="text-decoration-none product-link"
                            >
                              {{ item.product_name }}
                            </router-link>
                          </h6>
                          <small class="text-muted">ID: {{ item.product_id }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">
                      <span class="badge bg-light text-dark">{{ item.quantity }}</span>
                    </td>
                    <td class="text-end">{{ formatPrice(Number(item.price)) }}</td>
                    <td class="text-end">
                      <strong>{{ formatPrice(item.total) }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Order Summary & Address -->
        <div class="row">
          <div class="col-md-8">
            <!-- Shipping Address -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-map-marker-alt me-2"></i>Địa chỉ giao hàng
                </h5>
              </div>
              <div class="card-body">
                <div class="address-info">
                  <div v-if="order.shipping_address?.recipient_name || order.shipping_address?.recipient_phone">
                    <p class="mb-2" v-if="order.shipping_address?.recipient_name">
                      <i class="fas fa-user text-muted me-2"></i>
                      <strong>{{ order.shipping_address.recipient_name }}</strong>
                    </p>
                    <p class="mb-2" v-if="order.shipping_address?.recipient_phone">
                      <i class="fas fa-phone text-muted me-2"></i>{{ order.shipping_address.recipient_phone }}
                    </p>
                  </div>
                  <p class="mb-1">
                    <i class="fas fa-map-marker-alt text-muted me-2"></i>
                    {{ order.shipping_address?.address }}
                  </p>
                  <p class="mb-0 text-muted">
                    {{ order.shipping_address?.ward }}, {{ order.shipping_address?.district }}
                  </p>
                  <p class="mb-0 text-muted">{{ order.shipping_address?.province }}</p>
                </div>
              </div>
            </div>

            <!-- Order History -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-history me-2"></i>Lịch sử đơn hàng
                </h5>
              </div>
              <div class="card-body">
                <div v-if="order.order_history && order.order_history.length > 0" class="order-timeline">
                  <div 
                    v-for="(history, index) in order.order_history" 
                    :key="index"
                    class="timeline-item"
                  >
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <span class="timeline-status">{{ getStatusText(history.status) }}</span>
                        <small class="timeline-date">{{ formatDate(history.created_at) }}</small>
                      </div>
                      <p class="timeline-note mb-0" v-if="history.note">{{ history.note }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-muted py-3">
                  <i class="fas fa-clock fa-2x mb-2"></i>
                  <p class="mb-0">Chưa có lịch sử cập nhật cho đơn hàng này</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <!-- Order Summary -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-calculator me-2"></i>Tóm tắt đơn hàng
                </h5>
              </div>
              <div class="card-body">
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
                  <hr>
                  <div class="d-flex justify-content-between">
                    <strong>Tổng cộng:</strong>
                    <strong class="text-primary fs-5">{{ formatPrice(Number(order.final_amount)) }}</strong>
                  </div>
                </div>

                <div class="payment-info mt-3 pt-3 border-top">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Phương thức thanh toán:</span>
                    <span class="badge bg-info">{{ getPaymentMethodText(order.payment_method) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-tools me-2"></i>Thao tác
                </h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button 
                    v-if="order.status === 'pending'"
                    @click="cancelOrder"
                    class="btn btn-outline-danger"
                  >
                    <i class="fas fa-times me-2"></i>Hủy đơn hàng
                  </button>
                  <button 
                    v-if="order.payment_status === 'paid'"
                    @click="reorderItems"
                    class="btn btn-outline-success"
                  >
                    <i class="fas fa-redo me-2"></i>Đặt lại
                  </button>
                  <router-link to="/orders" class="btn btn-outline-primary">
                    <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersApi } from '../services/api'
import type { Order } from '../types'
import { formatPrice, formatDate } from '../utils'
import { useCart } from '../composables/useCart'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import Breadcrumb from '../components/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()

const order = ref<Order | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const orderId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string)
})

const breadcrumbItems = computed(() => [
  { name: 'Trang chủ', path: '/' },
  { name: 'Đơn hàng của tôi', path: '/orders' },
  { name: order.value?.order_number || `Đơn hàng #${orderId.value}`, path: '' }
])

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge bg-warning text-dark',
    processing: 'badge bg-info text-dark',
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
    processing: 'Đang xử lý',
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

const getPaymentMethodText = (method: string) => {
  const methods = {
    cod: 'Thanh toán khi nhận hàng',
    vnpay: 'VNPay',
    momo: 'MoMo'
  }
  return methods[method as keyof typeof methods] || method
}

const fetchOrderDetail = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await ordersApi.getOrder(orderId.value)
    order.value = response.data
    
    console.log('Order detail loaded:', order.value)
  } catch (err: any) {
    console.error('Failed to load order detail:', err)
    error.value = err.response?.data?.message || 'Không thể tải chi tiết đơn hàng'
  } finally {
    loading.value = false
  }
}

const cancelOrder = async () => {
  if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    return
  }
  
  try {
    await ordersApi.cancelOrder(orderId.value)
    // Refresh order detail
    await fetchOrderDetail()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Không thể hủy đơn hàng')
  }
}

const reorderItems = async () => {
  try {
    if (!order.value || !order.value.items) return
    
    for (const item of order.value.items) {
      if (item.product_name && item.product_image) {
        const product = {
          id: item.product_id || 0,
          name: item.product_name,
          price: item.price,
          originalPrice: item.price,
          quantity: 1,
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
    alert('Không thể thêm sản phẩm vào giỏ hàng')
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.order-status-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.order-item-row:hover {
  background-color: #f8f9fa;
}

.order-summary {
  font-size: 0.95rem;
}

.order-summary hr {
  margin: 1rem 0;
  border-color: #e9ecef;
}

.address-info {
  background-color: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
  border-left: 4px solid #0d6efd;
}

.address-info p {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.address-info i {
  width: 16px;
  text-align: center;
}

.order-timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  background-color: #0d6efd;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #0d6efd;
}

.timeline-item:before {
  content: '';
  position: absolute;
  left: -1.75rem;
  top: 1rem;
  bottom: -1.5rem;
  width: 2px;
  background-color: #e9ecef;
}

.timeline-item:last-child:before {
  display: none;
}

.timeline-content {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-status {
  font-weight: 600;
  color: #0d6efd;
}

.timeline-date {
  color: #6c757d;
  font-size: 0.875rem;
}

.timeline-note {
  color: #495057;
  line-height: 1.5;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.card-header {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem;
}

.card-body {
  padding: 1.5rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
  background-color: #f8f9fa;
}

.payment-info {
  font-size: 0.9rem;
}

.product-link {
  color: #495057;
  transition: color 0.2s ease;
}

.product-link:hover {
  color: #0d6efd;
  text-decoration: underline !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .order-status-badges {
    justify-content: flex-start;
    margin-top: 1rem;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
  
  .timeline-item {
    padding-left: 0;
  }
  
  .timeline-marker {
    left: -1.5rem;
  }
  
  .timeline-item:before {
    left: -1.25rem;
  }
}

@media (max-width: 576px) {
  .card-header,
  .card-body {
    padding: 1rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
}
</style>
