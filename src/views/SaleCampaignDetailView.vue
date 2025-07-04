<template>
  <div class="sale-campaign-detail">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải thông tin chương trình...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="bi bi-exclamation-circle"></i>
      <h3>Có lỗi xảy ra</h3>
      <p>{{ error }}</p>
      <button @click="loadCampaign" class="retry-btn">Thử lại</button>
    </div>

    <div v-else-if="!currentCampaign" class="not-found-state">
      <i class="bi bi-search"></i>
      <h3>Không tìm thấy chương trình</h3>
      <p>Chương trình khuyến mãi này có thể đã bị xóa hoặc không tồn tại.</p>
      <router-link to="/sale-campaigns" class="back-btn">
        Xem tất cả chương trình
      </router-link>
    </div>

    <div v-else class="campaign-content">
      <!-- Campaign Header -->
      <section class="campaign-header">
        <div class="container">
          <div class="campaign-info">
            <div class="campaign-badges">
              <span v-if="currentCampaign.is_featured" class="badge featured">Nổi bật</span>
              <span :class="['badge', 'status', currentCampaign.status]">
                {{ getStatusText(currentCampaign.status) }}
              </span>
            </div>
            
            <h1 class="campaign-title">{{ currentCampaign.name }}</h1>
            <p class="campaign-description">{{ currentCampaign.description }}</p>
            
            <div class="campaign-meta">
              <div class="meta-item">
                <i class="bi bi-calendar-event"></i>
                <span>{{ formatDate(currentCampaign.start_date) }} - {{ formatDate(currentCampaign.end_date) }}</span>
              </div>
              
              <div v-if="isCampaignActive(currentCampaign)" class="meta-item countdown">
                <i class="bi bi-clock-history"></i>
                <span>{{ getTimeRemaining(currentCampaign) }}</span>
              </div>
              
              <div class="meta-item">
                <i class="bi bi-star-fill"></i>
                <span>Độ ưu tiên: {{ currentCampaign.priority }}/10</span>
              </div>
            </div>
          </div>
          
          <!-- Countdown Timer -->
          <div v-if="isCampaignActive(currentCampaign)" class="countdown-timer">
            <h3>Thời gian còn lại</h3>
            <div class="timer-display">
              <div class="time-unit">
                <span class="time-value">{{ timeRemaining.days }}</span>
                <span class="time-label">Ngày</span>
              </div>
              <div class="time-unit">
                <span class="time-value">{{ timeRemaining.hours }}</span>
                <span class="time-label">Giờ</span>
              </div>
              <div class="time-unit">
                <span class="time-value">{{ timeRemaining.minutes }}</span>
                <span class="time-label">Phút</span>
              </div>
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
            <h2>Sản phẩm trong chương trình</h2>
            <div class="products-filters">
              <select v-model="categoryFilter" @change="loadProducts" class="filter-select">
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              
              <select v-model="brandFilter" @change="loadProducts" class="filter-select">
                <option value="">Tất cả thương hiệu</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
              
              <select v-model="sortBy" @change="loadProducts" class="filter-select">
                <option value="name">Tên sản phẩm</option>
                <option value="discount">Giảm giá cao nhất</option>
                <option value="sale_price">Giá thấp nhất</option>
              </select>
              
              <input 
                v-model="searchQuery" 
                @input="debouncedSearch"
                type="text" 
                placeholder="Tìm sản phẩm..."
                class="search-input"
              >
            </div>
          </div>

          <div v-if="productsLoading" class="products-loading">
            <div class="spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>

          <div v-else-if="campaignProducts.length === 0" class="no-products">
            <i class="bi bi-box"></i>
            <h3>Chưa có sản phẩm nào</h3>
            <p>Chương trình này chưa có sản phẩm tham gia.</p>
          </div>

          <div v-else class="products-grid">
            <ProductCard 
              v-for="product in campaignProducts" 
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="page-btn"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            
            <span class="page-info">
              Trang {{ currentPage }} / {{ totalPages }}
            </span>
            
            <button 
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
              class="page-btn"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSaleCampaigns } from '@/composables/useSaleCampaigns'
import ProductCard from '@/components/ProductCard.vue'

// Simple debounce implementation
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

const route = useRoute()
const campaignId = computed(() => parseInt(route.params.id as string))

const {
  currentCampaign,
  campaignProducts,
  isLoading,
  error,
  fetchSaleCampaign,
  fetchCampaignProducts,
  isCampaignActive,
  getCampaignTimeRemaining
} = useSaleCampaigns()

// Filters and pagination
const categoryFilter = ref('')
const brandFilter = ref('')
const sortBy = ref('name')
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const productsLoading = ref(false)

// Mock data for filters (should be fetched from API)
const categories = ref([
  { id: 1, name: 'Balo laptop' },
  { id: 2, name: 'Balo du lịch' },
  { id: 3, name: 'Balo học sinh' }
])

const brands = ref([
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Samsonite' }
])

// Timer
const timeRemaining = ref({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })
let timerInterval: ReturnType<typeof setInterval> | null = null

// Methods
const loadCampaign = async () => {
  try {
    await fetchSaleCampaign(campaignId.value)
    await loadProducts()
    startTimer()
  } catch (err) {
    console.error('Error loading campaign:', err)
  }
}

const loadProducts = async () => {
  if (!currentCampaign.value) return
  
  productsLoading.value = true
  try {
    const filters: any = {
      page: currentPage.value
    }
    
    if (categoryFilter.value) filters.category_id = categoryFilter.value
    if (brandFilter.value) filters.brand_id = brandFilter.value
    if (searchQuery.value) filters.search = searchQuery.value
    if (sortBy.value) filters.sort_by = sortBy.value
    
    const response = await fetchCampaignProducts(currentCampaign.value.id, filters)
    
    // Handle pagination if API returns paginated response
    if (response && 'total' in response) {
      totalPages.value = response.last_page || 1
    }
  } catch (err) {
    console.error('Error loading products:', err)
  } finally {
    productsLoading.value = false
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  loadProducts()
}, 500)

const changePage = (page: number) => {
  currentPage.value = page
  loadProducts()
  
  // Scroll to top of products section
  const productsSection = document.querySelector('.campaign-products')
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const startTimer = () => {
  if (!currentCampaign.value || !isCampaignActive(currentCampaign.value)) return
  
  updateTimer()
  timerInterval = setInterval(updateTimer, 1000)
}

const updateTimer = () => {
  if (!currentCampaign.value) return
  
  const remaining = getCampaignTimeRemaining(currentCampaign.value)
  timeRemaining.value = remaining
  
  if (remaining.expired && timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Đang hoạt động',
    scheduled: 'Sắp diễn ra',
    inactive: 'Đã kết thúc'
  }
  return statusMap[status] || status
}

const getTimeRemaining = (campaign: any) => {
  const remaining = getCampaignTimeRemaining(campaign)
  if (remaining.expired) return 'Đã kết thúc'
  
  if (remaining.days > 0) return `Còn ${remaining.days} ngày ${remaining.hours} giờ`
  if (remaining.hours > 0) return `Còn ${remaining.hours} giờ ${remaining.minutes} phút`
  if (remaining.minutes > 0) return `Còn ${remaining.minutes} phút`
  return 'Sắp kết thúc'
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-state,
.error-state,
.not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-left: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn,
.back-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin-top: 1rem;
  transition: background 0.2s ease;
}

.retry-btn:hover,
.back-btn:hover {
  background: #ff5252;
}

.campaign-header {
  padding: 60px 0;
  color: white;
}

.campaign-info {
  max-width: 800px;
}

.campaign-badges {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.badge.featured {
  background: #ffd700;
  color: #333;
}

.badge.status.active {
  background: #22c55e;
  color: white;
}

.badge.status.scheduled {
  background: #3b82f6;
  color: white;
}

.badge.status.inactive {
  background: #ef4444;
  color: white;
}

.campaign-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.campaign-description {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.campaign-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.meta-item.countdown {
  color: #ffd700;
  font-weight: 600;
}

.countdown-timer {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  margin-top: 2rem;
}

.countdown-timer h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.timer-display {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.2);
  padding: 16px;
  border-radius: 12px;
  min-width: 80px;
}

.time-value {
  font-size: 2rem;
  font-weight: 800;
  color: #ffd700;
}

.time-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 4px;
}

.campaign-products {
  padding: 60px 0;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.products-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select,
.search-input {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 0.9rem;
}

.filter-select {
  min-width: 150px;
}

.search-input {
  min-width: 200px;
}

.products-loading,
.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.no-products i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 3rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  color: white;
}

.page-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
}

@media (max-width: 768px) {
  .campaign-title {
    font-size: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .products-filters {
    justify-content: center;
  }
  
  .timer-display {
    gap: 8px;
  }
  
  .time-unit {
    min-width: 60px;
    padding: 12px;
  }
  
  .time-value {
    font-size: 1.5rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
}
</style>
