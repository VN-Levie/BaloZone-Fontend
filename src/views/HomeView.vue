<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppData } from '@/composables/useAppData'
import { formatPrice, getImageUrl, calculateDiscount, getColorCode } from '@/utils'
import type { Category } from '@/types'

// Use the app data composable
const { featuredProducts, categories, brands, loadHomepageData, isLoading } = useAppData()

// Local state
const selectedCategory = ref<string>('all')
const isAddingToCart = ref<{ [key: number]: boolean }>({})

// Mock fallback data in case API fails
const mockFeaturedProducts = ref([
  {
    id: 1,
    name: 'Vali Du Lịch Cao Cấp',
    price: 799000,
    originalPrice: 1200000,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['red', 'blue', 'gray'],
    rating: 4.8
  },
  {
    id: 2,
    name: 'Balo Laptop Business',
    price: 1399000,
    originalPrice: 1800000,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['black', 'navy', 'gray'],
    rating: 4.9
  },
  {
    id: 3,
    name: 'Vali Kéo Size Cabin',
    price: 899000,
    originalPrice: 1300000,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['mint', 'pink', 'white'],
    rating: 4.7
  },
  {
    id: 4,
    name: 'Balo Du Lịch Thể Thao',
    price: 599000,
    originalPrice: 850000,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['green', 'orange', 'black'],
    rating: 4.6
  },
  {
    id: 5,
    name: 'Vali Cứng Chống Va Đập',
    price: 1299000,
    originalPrice: 1700000,
    discount: 24,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['silver', 'black', 'blue'],
    rating: 4.8
  }
])

const mockBrands = ref([
  'Samsonite', 'American Tourister', 'Delsey', 'VIP', 'Kamiliant', 'Polo'
])

// Computed properties
const displayProducts = computed(() => {
  const apiProducts = featuredProducts.value
  const fallbackProducts = mockFeaturedProducts.value
  
  const products = apiProducts.length > 0 ? apiProducts : fallbackProducts
  
  if (selectedCategory.value === 'all') {
    return products
  }
  
  // Filter by category if API data is available
  if (apiProducts.length > 0) {
    return products.filter(product => 
      product.category?.slug === selectedCategory.value || 
      product.category?.name.toLowerCase().includes(selectedCategory.value.toLowerCase())
    )
  }
  
  // Simple fallback filtering for mock data
  return products
})

const displayBrands = computed(() => {
  if (brands.value.length > 0) {
    return brands.value.map(brand => brand.name)
  }
  return mockBrands.value
})

const categoryTabs = computed(() => {
  const tabs = [{ id: 'all', name: 'TẤT CẢ' }]
  
  if (categories.value.length > 0) {
    categories.value.forEach(category => {
      tabs.push({
        id: category.slug,
        name: category.name.toUpperCase()
      })
    })
  } else {
    // Fallback tabs
    tabs.push(
      { id: 'balo', name: 'BALO' },
      { id: 'vali', name: 'VALI' },
      { id: 'tui-xach', name: 'TÚI XÁCH' },
      { id: 'phu-kien', name: 'PHỤ KIỆN' }
    )
  }
  
  return tabs
})

// Methods
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const addToCart = async (productId: number) => {
  isAddingToCart.value[productId] = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    alert('Đã thêm sản phẩm vào giỏ hàng!')
  } catch (error) {
    alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!')
  } finally {
    isAddingToCart.value[productId] = false
  }
}

const getProductImage = (product: any) => {
  if (product.image) {
    return getImageUrl(product.image)
  }
  return product.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
}

const getProductDiscount = (product: any) => {
  if (product.discount) {
    return product.discount
  }
  if (product.originalPrice && product.price) {
    return calculateDiscount(product.originalPrice, product.price)
  }
  return 0
}

const getProductColors = (product: any) => {
  if (product.colors) {
    return product.colors
  }
  if (product.color) {
    return [product.color]
  }
  return ['black', 'gray', 'blue']
}

const getRating = (product: any) => {
  if (product.rating) {
    return product.rating
  }
  if (product.comments && product.comments.length > 0) {
    // Calculate average rating from comments if available
    return 4.5 // Default fallback
  }
  return 4.5
}

// Load data on component mount
onMounted(() => {
  loadHomepageData()
})
</script>

<template>
  <div class="homepage">
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
              <div class="product-card">
                <div class="product-image-container">
                  <router-link :to="`/product/${product.id}`" class="product-link">
                    <img :src="getProductImage(product)" :alt="product.name" class="product-image" />
                  </router-link>
                  <div v-if="getProductDiscount(product) > 0" class="discount-badge-product">
                    -{{ getProductDiscount(product) }}%
                  </div>
                  <div class="product-actions">
                    <button class="action-btn" title="Thêm vào yêu thích">❤️</button>
                    <button class="action-btn" @click="$router.push(`/product/${product.id}`)" title="Xem chi tiết">👁️</button>
                  </div>
                </div>
                <div class="product-info">
                  <router-link :to="`/product/${product.id}`" class="product-name-link">
                    <h6 class="product-name">{{ product.name }}</h6>
                  </router-link>
                  <div class="product-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-score">({{ getRating(product) }})</span>
                  </div>
                  <div class="product-colors">
                    <span 
                      v-for="color in getProductColors(product)" 
                      :key="color"
                      class="color-dot"
                      :style="{ backgroundColor: getColorCode(color) }"
                      :title="color"
                    ></span>
                  </div>
                  <div class="product-pricing">
                    <span class="current-price">{{ formatPrice(product.price) }}</span>
                    <span v-if="product.originalPrice" class="original-price">
                      {{ formatPrice(product.originalPrice) }}
                    </span>
                  </div>
                  <button 
                    class="add-to-cart-btn"
                    @click="addToCart(product.id)"
                    :disabled="isAddingToCart[product.id]"
                  >
                    <span v-if="isAddingToCart[product.id]" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    {{ isAddingToCart[product.id] ? 'ĐANG THÊM...' : 'THÊM VÀO GIỎ' }}
                  </button>
                </div>
              </div>
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
</template>

<style scoped></style>
