<template>
  <div class="sale-campaigns-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">🔥 Khuyến Mãi Hot</h1>
          <p class="hero-subtitle">Cơ hội vàng săn balo với giá cực ưu đãi!</p>
        </div>
      </div>
    </section>

    <!-- Featured Campaigns -->
    <section v-if="hasFeaturedCampaigns" class="featured-campaigns">
      <div class="container">
        <h2 class="section-title">Chương Trình Nổi Bật</h2>
        <div class="campaigns-grid">
          <div 
            v-for="campaign in featuredCampaigns" 
            :key="campaign.id"
            class="campaign-card featured"
            @click="goToCampaign(campaign.id)"
          >
            <div class="campaign-header">
              <h3 class="campaign-name">{{ campaign.name }}</h3>
              <div class="campaign-priority">
                <span class="priority-badge">Nổi bật</span>
              </div>
            </div>
            <p class="campaign-description">{{ campaign.description }}</p>
            <div class="campaign-meta">
              <div class="campaign-dates">
                <i class="bi bi-calendar"></i>
                {{ formatDate(campaign.start_date) }} - {{ formatDate(campaign.end_date) }}
              </div>
              <div class="campaign-countdown" v-if="isCampaignActive(campaign)">
                <i class="bi bi-clock"></i>
                {{ getTimeRemaining(campaign) }}
              </div>
            </div>
            <div class="campaign-status">
              <span :class="['status-badge', campaign.status]">
                {{ getStatusText(campaign.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Campaigns -->
    <section class="all-campaigns">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Tất Cả Chương Trình</h2>
          <div class="campaign-filters">
            <select v-model="statusFilter" @change="fetchCampaigns" class="filter-select">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="scheduled">Sắp diễn ra</option>
              <option value="inactive">Đã kết thúc</option>
            </select>
            <input 
              v-model="searchQuery" 
              @input="debouncedSearch"
              type="text" 
              placeholder="Tìm kiếm chương trình..."
              class="search-input"
            >
          </div>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải chương trình khuyến mãi...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="fetchCampaigns" class="retry-btn">Thử lại</button>
        </div>

        <div v-else-if="saleCampaigns.length === 0" class="empty-state">
          <i class="bi bi-gift"></i>
          <h3>Chưa có chương trình khuyến mãi</h3>
          <p>Hãy quay lại sau để không bỏ lỡ những ưu đãi hấp dẫn!</p>
        </div>

        <div v-else class="campaigns-list">
          <div 
            v-for="campaign in saleCampaigns" 
            :key="campaign.id"
            class="campaign-card"
            @click="goToCampaign(campaign.id)"
          >
            <div class="campaign-header">
              <div>
                <h3 class="campaign-name">{{ campaign.name }}</h3>
                <p class="campaign-description">{{ campaign.description }}</p>
              </div>
              <div class="campaign-priority">
                <span v-if="campaign.is_featured" class="priority-badge featured">Nổi bật</span>
                <span class="priority-value">{{ campaign.priority }}/10</span>
              </div>
            </div>
            
            <div class="campaign-meta">
              <div class="campaign-dates">
                <i class="bi bi-calendar"></i>
                {{ formatDate(campaign.start_date) }} - {{ formatDate(campaign.end_date) }}
              </div>
              <div class="campaign-countdown" v-if="isCampaignActive(campaign)">
                <i class="bi bi-clock"></i>
                {{ getTimeRemaining(campaign) }}
              </div>
              <div class="products-count" v-if="campaign.sale_products">
                <i class="bi bi-box"></i>
                {{ campaign.sale_products.length }} sản phẩm
              </div>
            </div>

            <div class="campaign-footer">
              <span :class="['status-badge', campaign.status]">
                {{ getStatusText(campaign.status) }}
              </span>
              <button class="view-btn">
                Xem chi tiết
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSaleCampaigns } from '@/composables/useSaleCampaigns'

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

const router = useRouter()
const {
  saleCampaigns,
  featuredCampaigns,
  isLoading,
  error,
  hasFeaturedCampaigns,
  fetchSaleCampaigns,
  fetchFeaturedCampaigns,
  isCampaignActive,
  getCampaignTimeRemaining
} = useSaleCampaigns()

// Filters
const statusFilter = ref('')
const searchQuery = ref('')

// Methods
const fetchCampaigns = async () => {
  const filters: any = {}
  if (statusFilter.value) filters.status = statusFilter.value
  if (searchQuery.value) filters.search = searchQuery.value
  
  await fetchSaleCampaigns(filters)
}

const debouncedSearch = debounce(() => {
  fetchCampaigns()
}, 500)

const goToCampaign = (campaignId: number) => {
  router.push(`/sale-campaigns/${campaignId}`)
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
    active: 'Đang hoạt động',
    scheduled: 'Sắp diễn ra',
    inactive: 'Đã kết thúc'
  }
  return statusMap[status] || status
}

const getTimeRemaining = (campaign: any) => {
  const remaining = getCampaignTimeRemaining(campaign)
  if (remaining.expired) return 'Đã kết thúc'
  
  if (remaining.days > 0) return `Còn ${remaining.days} ngày`
  if (remaining.hours > 0) return `Còn ${remaining.hours} giờ`
  if (remaining.minutes > 0) return `Còn ${remaining.minutes} phút`
  return 'Sắp kết thúc'
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchSaleCampaigns(),
    fetchFeaturedCampaigns()
  ])
})
</script>

<style scoped>
.sale-campaigns-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: white;
}

.featured-campaigns {
  padding: 60px 0;
}

.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.campaign-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.campaign-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.15);
  border-color: #667eea;
}

.campaign-card.featured {
  border: 2px solid #ffd700;
  position: relative;
  overflow: hidden;
}

.campaign-card.featured::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffd700, #ff6b6b, #ffd700);
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.campaign-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
}

.campaign-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 16px;
}

.priority-badge {
  background: #ffd700;
  color: #333;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.priority-badge.featured {
  background: #ff6b6b;
  color: white;
}

.priority-value {
  background: #e2e8f0;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
}

.campaign-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.campaign-dates,
.campaign-countdown,
.products-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-size: 0.9rem;
}

.campaign-countdown {
  color: #e53e3e;
  font-weight: 600;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.active {
  background: #c6f6d5;
  color: #2f855a;
}

.status-badge.scheduled {
  background: #bee3f8;
  color: #2b6cb0;
}

.status-badge.inactive {
  background: #fed7d7;
  color: #c53030;
}

.all-campaigns {
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

.campaign-filters {
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
}

.filter-select {
  min-width: 150px;
}

.search-input {
  min-width: 250px;
}

.campaigns-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.campaign-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn:hover {
  background: #5a6fd8;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-left: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .campaign-filters {
    justify-content: center;
  }
  
  .campaigns-grid {
    grid-template-columns: 1fr;
  }
}
</style>
