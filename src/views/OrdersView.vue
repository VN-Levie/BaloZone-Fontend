<template>
  <div class="orders-view">
    <div class="container mt-4">
      <Breadcrumb :items="breadcrumbItems" />
      
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">My Orders</h1>
          
          <LoadingSpinner v-if="loading" />
          
          <div v-else-if="error" class="alert alert-danger">
            {{ error }}
          </div>
          
          <div v-else-if="orders.length === 0" class="text-center py-5">
            <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
            <h3>No orders found</h3>
            <p class="text-muted">You haven't placed any orders yet.</p>
            <router-link to="/" class="btn btn-primary">
              Start Shopping
            </router-link>
          </div>
          
          <div v-else>
            <div class="row">
              <div class="col-md-3 mb-4">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">Filter Orders</h6>
                    <div class="mb-3">
                      <label class="form-label">Status</label>
                      <select v-model="selectedStatus" @change="fetchOrders" class="form-select">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Date Range</label>
                      <select v-model="selectedDateRange" @change="fetchOrders" class="form-select">
                        <option value="">All Time</option>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 3 months</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-9">
                <div class="order-list">
                  <div v-for="order in orders" :key="order.id" class="card mb-3">
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="mb-0">Order #{{ order.order_number }}</h6>
                        <small class="text-muted">{{ formatDate(order.created_at) }}</small>
                      </div>
                      <span :class="getStatusBadgeClass(order.status)">
                        {{ getStatusText(order.status) }}
                      </span>
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
                                :src="item.product.image_url || '/placeholder-image.jpg'" 
                                :alt="item.product.name"
                                class="order-item-image me-3"
                              >
                              <div class="flex-grow-1">
                                <h6 class="mb-1">{{ item.product.name }}</h6>
                                <small class="text-muted">
                                  Quantity: {{ item.quantity }} × {{ formatPrice(item.price) }}
                                </small>
                              </div>
                              <div class="text-end">
                                <strong>{{ formatPrice(item.quantity * item.price) }}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="col-md-4">
                          <div class="order-summary">
                            <div class="d-flex justify-content-between mb-1">
                              <span>Subtotal:</span>
                              <span>{{ formatPrice(order.subtotal) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                              <span>Shipping:</span>
                              <span>{{ formatPrice(order.shipping_fee) }}</span>
                            </div>
                            <div v-if="order.discount_amount > 0" class="d-flex justify-content-between mb-1">
                              <span>Discount:</span>
                              <span class="text-success">-{{ formatPrice(order.discount_amount) }}</span>
                            </div>
                            <div class="d-flex justify-content-between border-top pt-2">
                              <strong>Total:</strong>
                              <strong>{{ formatPrice(order.total_amount) }}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="row mt-3">
                        <div class="col-md-6">
                          <h6>Shipping Address</h6>
                          <p class="mb-0">{{ order.shipping_address.full_name }}</p>
                          <p class="mb-0">{{ order.shipping_address.address_line_1 }}</p>
                          <p class="mb-0" v-if="order.shipping_address.address_line_2">
                            {{ order.shipping_address.address_line_2 }}
                          </p>
                          <p class="mb-0">
                            {{ order.shipping_address.city }}, {{ order.shipping_address.state }}
                          </p>
                          <p class="mb-0">{{ order.shipping_address.postal_code }}</p>
                          <p class="mb-0">{{ order.shipping_address.phone }}</p>
                        </div>
                        
                        <div class="col-md-6">
                          <h6>Order Actions</h6>
                          <div class="btn-group-vertical w-100">
                            <button 
                              v-if="order.status === 'pending'"
                              @click="cancelOrder(order.id)"
                              class="btn btn-outline-danger btn-sm"
                            >
                              Cancel Order
                            </button>
                            <button 
                              @click="viewOrderDetail(order.id)"
                              class="btn btn-outline-primary btn-sm"
                            >
                              View Details
                            </button>
                            <button 
                              v-if="order.status === 'delivered'"
                              @click="reorderItems(order.id)"
                              class="btn btn-outline-success btn-sm"
                            >
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        Previous
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
                        Next
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
import { ref, onMounted, computed } from 'vue'
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

const breadcrumbItems = [
  { text: 'Home', to: '/' },
  { text: 'My Orders', to: '/orders' }
]

const getStatusBadgeClass = (status: string) => {
  const classes = {
    pending: 'badge bg-warning',
    confirmed: 'badge bg-info',
    shipped: 'badge bg-primary',
    delivered: 'badge bg-success',
    cancelled: 'badge bg-danger'
  }
  return classes[status as keyof typeof classes] || 'badge bg-secondary'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return texts[status as keyof typeof texts] || status
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

const fetchOrders = async () => {
  try {
    loading.value = true
    error.value = null
    
    const params = {
      page: currentPage.value,
      status: selectedStatus.value || undefined,
      days: selectedDateRange.value ? parseInt(selectedDateRange.value) : undefined
    }
    
    const response = await ordersApi.getOrders(params)
    orders.value = response.data
    totalPages.value = response.last_page
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load orders'
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
    if (!order) return
    
    for (const item of order.items) {
      await addToCart(item.product, item.quantity)
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
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.order-summary {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.btn-group-vertical .btn {
  margin-bottom: 0.5rem;
}

.btn-group-vertical .btn:last-child {
  margin-bottom: 0;
}
</style>
