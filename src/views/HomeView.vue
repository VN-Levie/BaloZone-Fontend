<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppData } from '@/composables/useAppData'
import { useSaleCampaigns } from '@/composables/useSaleCampaigns'
import { getImageUrl } from '@/utils'
import UserLayout from '@/components/layouts/UserLayout.vue'
import SaleBadge from '@/components/SaleBadge.vue'
import ProductCard from '@/components/ProductCard.vue'
import type { Category, Product } from '@/types'

// Use the app data composable
const { featuredProducts, categories, brands, latestNews, loadHomepageData, isLoading } = useAppData()

// Use sale campaigns composable
const { activeCampaigns, isLoading: saleCampaignsLoading, fetchActiveCampaigns } = useSaleCampaigns()

// Local state
const selectedCategory = ref<string>('all')

// Computed properties
const displayProducts = computed(() => {
  const products = featuredProducts.value

  if (selectedCategory.value === 'all') {
    return products
  }

  // Filter by category if API data is available
  if (products.length > 0) {
    return products.filter(
      (product: Product) => product.category && product.category.slug === selectedCategory.value
    )
  }

  return products
})

const displayBrands = computed(() => {
  return brands.value.map(brand => brand.name)
})

const categoryTabs = computed(() => {
  const tabs: { id: string; name: string }[] = [{ id: 'all', name: 'Tất cả' }]
  categories.value.forEach((category) => {
    if (category.slug && category.name) {
      tabs.push({ id: category.slug, name: category.name })
    }
  })
  return tabs
})

// Methods
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const getMaxDiscount = (campaign: any) => {
  if (!campaign.sale_products || campaign.sale_products.length === 0) return 0

  const discounts = campaign.sale_products.map((sp: any) => sp.discount_percentage || 0)
  return Math.max(...discounts)
}

// Load data on component mount
onMounted(() => {
  loadHomepageData()
  fetchActiveCampaigns()
})
</script>

<template>
  <UserLayout>
    <div class="container homepage mt-5">
      <!-- Hero Banner Section -->
      <section class="hero-section">
        <div class="container-fluid px-4">
          <div class="hero-banner">
            <div class="banner-content">
              <div class="discount-badge">
                <span class="discount-text">ƯU ĐÃI X3</span>
              </div>
              <h1 class="hero-title">Sale Giữa Tháng</h1>
            <div class="promotion-tags">
              <span class="tag">Giảm giá 3 SIZE</span>
              <span class="tag">Mua được 3</span>
              <span class="tag">Miễn phí vận chuyển</span>
            </div>
            <div class="time-countdown">
              <span class="countdown-text">13.06 - 16.06</span>
              <button class="cta-button">⚡ MUA NGAY</button>
            </div>
          </div>
          <div class="hero-products">
            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=280&h=350&fit=crop" alt="Vali xanh" class="hero-product-1" />
            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=280&h=350&fit=crop" alt="Vali đỏ" class="hero-product-2" />
          </div>
        </div>
      </div>
    </section>

    <!-- Service Features -->
    <section class="service-features">
      <div class="container-fluid px-4">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="feature-card">
              <div class="feature-icon">#1</div>
              <div class="feature-content">
                <h6>Website bán VALI TẠI VIỆT NAM</h6>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <div class="feature-icon">🛡️</div>
              <div class="feature-content">
                <h6>BẢO HÀNH TRỌN ĐỜI</h6>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <div class="feature-content">
                <h6>GIAO HÀNG 2H</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Sale Campaigns Section -->
    <section class="featured-campaigns-section" v-if="activeCampaigns.length > 0">
      <div class="container-fluid px-4">
        <div class="section-header mb-4">
          <h2 class="section-title">
            <span class="sale-icon">🔥</span>
            KHUYẾN MÃI HOT
            <span class="sale-icon">🔥</span>
          </h2>
          <router-link to="/sale-campaigns" class="view-all-link">
            Xem tất cả →
          </router-link>
        </div>

        <!-- Loading state -->
        <div v-if="saleCampaignsLoading" class="text-center py-4">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Đang tải khuyến mãi...</span>
          </div>
        </div>

        <!-- Campaign cards -->
        <div v-else class="campaigns-grid">
          <div class="row g-4">
            <div
              v-for="campaign in activeCampaigns.slice(0, 3)"
              :key="campaign.id"
              class="col-lg-4 col-md-6"
            >
              <router-link
                :to="`/sale-campaigns/slug/${campaign.slug}`"
                class="campaign-card-link"
              >
                <div class="campaign-card">
                  <div class="campaign-header">
                    <!-- <SaleBadge :campaign="campaign" /> -->
                    <div class="campaign-priority" v-if="campaign.priority > 0">
                      <span class="priority-badge">SALE</span>
                    </div>
                  </div>

                  <div class="campaign-content">
                    <h4 class="campaign-title">{{ campaign.name }}</h4>
                    <p class="campaign-description">{{ campaign.description }}</p>

                    <div class="campaign-stats" v-if="campaign.sale_products && campaign.sale_products.length > 0">
                      <span class="product-count">
                        {{ campaign.sale_products.length }} sản phẩm
                      </span>
                      <span class="discount-range" v-if="getMaxDiscount(campaign) > 0">
                        Giảm đến {{ getMaxDiscount(campaign) }}%
                      </span>
                    </div>

                    <div class="campaign-cta">
                      <span class="cta-text">Mua ngay</span>
                      <span class="cta-arrow">→</span>
                    </div>
                  </div>

                  <!-- Preview products -->
                  <div class="campaign-preview" v-if="campaign.sale_products && campaign.sale_products.length > 0">
                    <div class="preview-products">
                      <template v-for="(saleProduct, index) in campaign.sale_products.slice(0, 3)" :key="index">
                        <img
                          v-if="saleProduct.product"
                          :src="saleProduct.product ? getImageUrl(saleProduct.product.image) : ''"
                          :alt="saleProduct.product ? saleProduct.product.name : ''"
                          class="preview-image"
                        />
                      </template>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Flash Sale Section -->
    <section class="flash-sale-section">
      <div class="container-fluid px-4">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="flash-sale-card">
              <div class="sale-badge">DEAL ĐỘC QUYỀN ONLINE</div>
              <div class="sale-content">
                <div class="sale-price">799K</div>
                <div class="sale-original">2.300K</div>
                <button class="sale-btn">⚡ MUA NGAY</button>
              </div>
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop" alt="Balo đen" class="sale-image" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="flash-sale-card flash-sale-card-blue">
              <div class="sale-badge">MIA SIZE LỚN</div>
              <div class="sale-content">
                <div class="sale-price">1.399K</div>
                <div class="sale-original">3.000K</div>
                <button class="sale-btn">⚡ MUA NGAY</button>
              </div>
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop" alt="Set vali" class="sale-image" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid Section -->
    <section class="product-grid-section">
      <div class="container-fluid px-4">
        <div class="section-header">
          <h2 class="section-title">🔥 ƯU ĐÃI X3</h2>
          <div class="filter-tabs">
            <button
              v-for="tab in categoryTabs"
              :key="tab.id"
              class="filter-tab"
              :class="{ 'active': selectedCategory === tab.id }"
              @click="selectCategory(tab.id)"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2">Đang tải sản phẩm...</p>
        </div>

        <!-- Products grid -->
        <div v-else class="product-grid">
          <div class="row g-3">
            <div
              v-for="product in displayProducts"
              :key="product.id"
              class="col-xl-2-4 col-lg-3 col-md-4 col-sm-6 mb-4"
            >
              <ProductCard :product="product" />
            </div>
          </div>

          <!-- No products found -->
          <div v-if="displayProducts.length === 0" class="text-center py-5">
            <p class="text-muted">Không tìm thấy sản phẩm nào.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Section -->
    <section class="brand-section">
      <div class="container">
        <h3 class="text-center mb-4">Các thương hiệu nổi tiếng</h3>
        <div class="brand-grid">
          <div v-for="brand in displayBrands" :key="brand" class="brand-item">
            <span>{{ brand }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-card">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h4 class="newsletter-title">#1 Website bán VALI TẠI VIỆT NAM</h4>
              <p class="newsletter-subtitle">Ngọc Châu - Đại sứ thương hiệu</p>
              <p class="newsletter-description">3 năm - 5 quốc gia - 1 chiếc vali vẫn được bảo hành</p>
              <button class="newsletter-btn">KHÁM PHÁ NGAY</button>
            </div>
            <div class="col-md-4">
              <img src="https://images.unsplash.com/photo-1494790108755-2616c6eb1ca1?w=300&h=400&fit=crop" alt="Ngọc Châu" class="ambassador-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  </UserLayout>
</template>

<style scoped>
/* Grid layout for ProductCard components */
.product-grid-section {
  padding: 40px 0;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  margin: 30px 0;
  border-radius: 20px;
}

.product-grid-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.product-grid-section .section-title {
  color: #ff6b35;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(255, 107, 53, 0.2);
}

.filter-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-tab {
  background: white;
  border: 2px solid #ff6b35;
  color: #ff6b35;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
}

.filter-tab:hover,
.filter-tab.active {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
}

.product-grid {
  margin-top: 20px;
}


/* Featured Sale Campaigns Section */
.featured-campaigns-section {
  padding: 40px 0;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  margin: 30px 0;
  border-radius: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.sale-icon {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.view-all-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid white;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  background: white;
  color: #ff6b6b;
  text-decoration: none;
}

.campaigns-grid {
  margin-top: 20px;
}

.campaign-card-link {
  text-decoration: none;
  color: inherit;
}

.campaign-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.campaign-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.priority-badge {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.campaign-content {
  margin-bottom: 20px;
}

.campaign-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.3;
}

.campaign-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.campaign-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.product-count {
  background: #f8f9fa;
  color: #495057;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.discount-range {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.campaign-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ff6b6b;
  font-weight: 600;
}

.cta-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.campaign-card:hover .cta-arrow {
  transform: translateX(5px);
}

.campaign-preview {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.preview-products {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.preview-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  transition: transform 0.3s ease;
}

.preview-image:hover {
  transform: scale(1.1);
  border-color: #ff6b6b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .campaign-stats {
    flex-direction: column;
    gap: 8px;
  }

  .preview-products {
    gap: 5px;
  }

  .preview-image {
    width: 50px;
    height: 50px;
  }

  .filter-tabs {
    justify-content: center;
  }

  .filter-tab {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .product-grid-section .section-title {
    font-size: 1.5rem;
  }
}
</style>
