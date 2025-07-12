<template>
  <div class="sale-campaign-detail">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="container text-center py-5">
        <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="mt-3">Đang tải thông tin chương trình...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="container text-center py-5">
        <i class="bi bi-exclamation-triangle text-danger fs-1"></i>
        <h3 class="mt-3">Có lỗi xảy ra</h3>
        <p class="text-muted">{{ error }}</p>
        <div class="d-flex gap-3 justify-content-center">
          <button @click="loadCampaign" class="btn btn-primary">
            <i class="bi bi-arrow-clockwise"></i>
            Thử lại
          </button>
          <router-link to="/sale-campaigns" class="btn btn-outline-secondary">
            Quay lại danh sách
          </router-link>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!currentCampaign" class="not-found-state">
      <div class="container text-center py-5">
        <i class="bi bi-search text-muted fs-1"></i>
        <h3 class="mt-3">Không tìm thấy chương trình</h3>
        <p class="text-muted">Chương trình khuyến mãi này có thể đã bị xóa hoặc không tồn tại.</p>
        <router-link to="/sale-campaigns" class="btn btn-primary">
          Xem tất cả chương trình
        </router-link>
      </div>
    </div>

    <!-- Campaign Content -->
    <div v-else class="campaign-content">
      <!-- Campaign Header -->
      <section class="campaign-header">
        <div class="container">
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/">Trang chủ</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link to="/sale-campaigns">Khuyến mãi</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ currentCampaign.name }}
              </li>
            </ol>
          </nav>

          <div class="campaign-info">
            <div class="campaign-badges">
              <span v-if="currentCampaign.is_featured" class="badge featured">
                <i class="bi bi-star-fill"></i>
                Nổi bật
              </span>
              <span :class="['badge', 'status', currentCampaign.status]">
                {{ getStatusText(currentCampaign.status) }}
              </span>
              <span v-if="currentCampaign.priority" class="badge priority">
                Độ ưu tiên: {{ currentCampaign.priority }}/100
              </span>
            </div>
            
            <h1 class="campaign-title">{{ currentCampaign.name }}</h1>
            <p class="campaign-description">{{ currentCampaign.description }}</p>
            
            <div class="campaign-meta">
              <div class="meta-item">
                <i class="bi bi-calendar-event"></i>
                <span>{{ formatDate(currentCampaign.start_date) }} - {{ formatDate(currentCampaign.end_date) }}</span>
              </div>
              
              <div v-if="currentCampaign.sale_products" class="meta-item">
                <i class="bi bi-box"></i>
                <span>{{ currentCampaign.sale_products.length }} sản phẩm</span>
              </div>
            </div>
          </div>
          
          <!-- Countdown Timer -->
          <div v-if="isCampaignActive(currentCampaign)" class="countdown-timer">
            <h3>⏰ Thời gian còn lại</h3>
            <div class="timer-display">
              <div class="time-unit">
                <span class="time-value">{{ timeRemaining.days }}</span>
                <span class="time-label">Ngày</span>
              </div>
              <div class="time-separator">:</div>
              <div class="time-unit">
                <span class="time-value">{{ timeRemaining.hours }}</span>
                <span class="time-label">Giờ</span>
              </div>
              <div class="time-separator">:</div>
              <div class="time-unit">
                <span class="time-value">{{ timeRemaining.minutes }}</span>
                <span class="time-label">Phút</span>
              </div>
              <div class="time-separator">:</div>
              <div class="time-unit">
                <span class="time-value">{{ timeRemaining.seconds }}</span>
                <span class="time-label">Giây</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Section -->
      <section class="campaign-products">
        <div class="container">
          <div class="section-header">
            <h2>🛍️ Sản phẩm khuyến mãi</h2>
            <div class="products-summary" v-if="currentCampaign.sale_products">
              <span class="products-count">{{ currentCampaign.sale_products.length }} sản phẩm</span>
              <span class="discount-info">Giảm giá lên đến {{ getMaxDiscount() }}%</span>
            </div>
          </div>
          
          <!-- Products Grid -->
          <div v-if="currentCampaign.sale_products && currentCampaign.sale_products.length > 0" class="products-grid">
            <div class="row g-4">
              <div 
                v-for="saleProduct in currentCampaign.sale_products" 
                :key="saleProduct.id"
                class="col-lg-3 col-md-4 col-sm-6"
              >
                <div class="product-card" @click="goToProduct(saleProduct.product?.slug || saleProduct.product?.id || '')">
                  <div class="product-image">
                    <img 
                      :src="getImageUrl(saleProduct.product?.image || '')" 
                      :alt="saleProduct.product?.name || ''"
                      loading="lazy"
                    />
                    <div class="discount-badge">
                      -{{ Math.round(saleProduct.discount_percentage) }}%
                    </div>
                  </div>
                  
                  <div class="product-info">
                    <h5 class="product-name">{{ saleProduct.product?.name }}</h5>
                    <div class="product-category" v-if="saleProduct.product?.category">
                      {{ saleProduct.product.category.name }}
                    </div>
                    
                    <div class="price-info">
                      <span class="original-price">{{ formatPrice(saleProduct.original_price) }}</span>
                      <span class="sale-price">{{ formatPrice(saleProduct.sale_price) }}</span>
                      <div class="savings">
                        Tiết kiệm: {{ formatPrice(calculateDiscount(saleProduct)) }}
                      </div>
                    </div>
                    
                    <div class="quantity-info" v-if="saleProduct.max_quantity">
                      <div class="stock-bar">
                        <div 
                          class="stock-fill" 
                          :style="{ width: getStockPercentage(saleProduct) + '%' }"
                        ></div>
                      </div>
                      <span class="stock-text">
                        Còn {{ (saleProduct.max_quantity || 0) - ((saleProduct as any).sold_quantity || 0) }} sản phẩm
                      </span>
                    </div>
                    
                    <button class="btn-add-cart">
                      <i class="bi bi-cart-plus"></i>
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Products -->
          <div v-else class="no-products">
            <i class="bi bi-box text-muted fs-1"></i>
            <h4 class="mt-3">Chưa có sản phẩm</h4>
            <p class="text-muted">Chương trình này hiện chưa có sản phẩm nào được áp dụng.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaleCampaigns } from '@/composables/useSaleCampaigns'
import { getImageUrl } from '@/utils'

const route = useRoute()
const router = useRouter()

// Determine if we're using slug or ID route
const isSlugRoute = computed(() => route.name === 'sale-campaign-detail-slug')
const campaignId = computed(() => route.params.id as string)
const campaignSlug = computed(() => route.params.slug as string)

const {
  currentCampaign,
  isLoading,
  error,
  fetchSaleCampaign,
  fetchSaleCampaignBySlug,
  isCampaignActive,
  getCampaignTimeRemaining
} = useSaleCampaigns()

// Timer state
const timeRemaining = ref({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })
let timerInterval: ReturnType<typeof setInterval> | null = null

// Methods
const loadCampaign = async () => {
  try {
    if (isSlugRoute.value) {
      await fetchSaleCampaignBySlug(campaignSlug.value)
    } else {
      await fetchSaleCampaign(campaignId.value)
    }
    if (currentCampaign.value && isCampaignActive(currentCampaign.value)) {
      startTimer()
    }
  } catch (err) {
    console.error('Failed to load campaign:', err)
  }
}

const startTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  
  timerInterval = setInterval(() => {
    if (currentCampaign.value) {
      timeRemaining.value = getCampaignTimeRemaining(currentCampaign.value)
      if (timeRemaining.value.expired) {
        clearInterval(timerInterval!)
      }
    }
  }, 1000)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(numPrice)
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Đang hoạt động',
    inactive: 'Tạm dừng',
    scheduled: 'Sắp diễn ra',
    ended: 'Đã kết thúc'
  }
  return statusMap[status] || status
}

const getMaxDiscount = () => {
  if (!currentCampaign.value?.sale_products) return 0
  
  const discounts = currentCampaign.value.sale_products.map(sp => 
    parseFloat(String(sp.discount_percentage || 0))
  )
  return Math.max(...discounts)
}

const calculateDiscount = (saleProduct: any) => {
  return saleProduct.original_price - saleProduct.sale_price
}

const getStockPercentage = (saleProduct: any) => {
  if (!saleProduct.max_quantity) return 0
  const sold = (saleProduct as any).sold_quantity || 0
  const remaining = saleProduct.max_quantity - sold
  return (remaining / saleProduct.max_quantity) * 100
}

const goToProduct = (productId?: number | string) => {
  if (productId) {
    // If it looks like a slug (contains non-numeric characters), use slug route
    if (typeof productId === 'string' && !/^\d+$/.test(productId)) {
      router.push(`/product/slug/${productId}`)
    } else {
      router.push(`/product/${productId}`)
    }
  }
}

// Lifecycle
onMounted(() => {
  loadCampaign()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.sale-campaign-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* States */
.loading-state,
.error-state,
.not-found-state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff5252, #ff7979);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

.btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
}

/* Breadcrumb */
.breadcrumb {
  background: transparent;
  padding: 0;
}

.breadcrumb-item a {
  color: #ff6b6b;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

/* Campaign Header */
.campaign-header {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  padding: 40px 0;
  margin-bottom: 40px;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.campaign-badges {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.badge.featured {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
}

.badge.status.active {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
}

.badge.status.inactive {
  background: #6c757d;
  color: white;
}

.badge.status.scheduled {
  background: linear-gradient(45deg, #007bff, #17a2b8);
  color: white;
}

.badge.priority {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #dee2e6;
}

.campaign-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.3;
}

.campaign-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.campaign-meta {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 1rem;
}

.meta-item i {
  color: #ff6b6b;
  font-size: 1.1rem;
}

/* Countdown Timer */
.countdown-timer {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.countdown-timer h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.timer-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.time-unit {
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 20px;
  border-radius: 15px;
  text-align: center;
  min-width: 80px;
}

.time-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.time-label {
  display: block;
  font-size: 0.9rem;
  margin-top: 5px;
  opacity: 0.9;
}

.time-separator {
  font-size: 2rem;
  font-weight: bold;
  opacity: 0.7;
}

/* Products Section */
.campaign-products {
  padding: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.products-summary {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.products-count {
  background: #f8f9fa;
  color: #495057;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

.discount-info {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

/* Product Cards */
.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #dc3545, #e74c3c);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.price-info {
  margin-bottom: 15px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 0.9rem;
  display: block;
}

.sale-price {
  color: #dc3545;
  font-size: 1.3rem;
  font-weight: bold;
  display: block;
}

.savings {
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 5px;
}

.quantity-info {
  margin-bottom: 15px;
}

.stock-bar {
  background: #e9ecef;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.stock-fill {
  background: linear-gradient(90deg, #dc3545, #ff6b6b);
  height: 100%;
  transition: width 0.3s ease;
}

.stock-text {
  color: #666;
  font-size: 0.85rem;
}

.btn-add-cart {
  width: 100%;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-add-cart:hover {
  background: linear-gradient(135deg, #ff5252, #ff7979);
  transform: translateY(-2px);
}

/* No Products */
.no-products {
  text-align: center;
  padding: 60px 20px;
}

.no-products h4 {
  color: #666;
}

/* Responsive Design */
@media (max-width: 768px) {
  .campaign-title {
    font-size: 2rem;
  }
  
  .campaign-meta {
    flex-direction: column;
    gap: 15px;
  }
  
  .timer-display {
    gap: 10px;
  }
  
  .time-unit {
    min-width: 60px;
    padding: 10px 15px;
  }
  
  .time-value {
    font-size: 1.5rem;
  }
  
  .time-separator {
    font-size: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
  }
  
  .products-summary {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .campaign-header {
    padding: 20px 0;
  }
  
  .campaign-title {
    font-size: 1.5rem;
  }
  
  .campaign-description {
    font-size: 1rem;
  }
  
  .countdown-timer {
    padding: 20px;
  }
  
  .countdown-timer h3 {
    font-size: 1.2rem;
  }
  
  .timer-display {
    flex-direction: column;
    gap: 10px;
  }
  
  .time-separator {
    display: none;
  }
  
  .product-image {
    height: 150px;
  }
  
  .product-info {
    padding: 15px;
  }
}
</style>
