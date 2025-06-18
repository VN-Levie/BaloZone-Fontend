<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productsApi, brandsApi } from '@/services/api'
import type { Product, Brand } from '@/types'
import { getCategoryName } from '@/utils'

const route = useRoute()
const categorySlug = computed(() => route.params.category as string)

const products = ref<Product[]>([])
const allBrands = ref<Brand[]>([])
const loading = ref(false)

const fetchProducts = async (slug: string) => {
  loading.value = true
  try {
    const response = await productsApi.getProductsByCategory(slug)
    products.value = response.data
  } catch (error) {
    console.error('Failed to load category products:', error)
  } finally {
    loading.value = false
  }
}

const fetchBrands = async () => {
  try {
    const response = await brandsApi.getActiveBrands()
    allBrands.value = response.data
  } catch (error) {
    console.error('Failed to load brands:', error)
  }
}

onMounted(() => {
  if (categorySlug.value) {
    fetchProducts(categorySlug.value)
  }
  fetchBrands()
})

watch(categorySlug, (newSlug) => {
  if (newSlug) {
    fetchProducts(newSlug)
  }
})

// Filter and sort functionality
const selectedSort = ref('popular')
const selectedPriceRange = ref('all')
const selectedBrand = ref('all')

const categoryProducts = computed(() => {
  let filtered = [...products.value]

  // Apply brand filter
  if (selectedBrand.value !== 'all') {
    filtered = filtered.filter((product) => product.brand?.slug === selectedBrand.value)
  }

  // Apply price filter
  if (selectedPriceRange.value !== 'all') {
    const [min, max] = selectedPriceRange.value.split('-').map(Number)
    filtered = filtered.filter((product) => {
      if (max) {
        return product.price >= min && product.price <= max
      }
      return product.price >= min
    })
  }

  // Apply sorting
  switch (selectedSort.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    // Add default case or handle 'popular' if you have data for it
  }

  return filtered
})

const brands = computed(() => {
  return allBrands.value
})

const categoryTitle = computed(() => {
  return getCategoryName(categorySlug.value)
})

const breadcrumbs = computed(() => [
  { name: 'Trang chủ', path: '/' },
  { name: categoryTitle.value, path: `/category/${categorySlug.value}` }
])
</script>

<template>
  <div class="category-page">
    <!-- Breadcrumbs -->
    <section class="breadcrumb-section">
      <div class="container-fluid px-4">
        <nav class="breadcrumb-nav">
          <a 
            v-for="(item, index) in breadcrumbs" 
            :key="index"
            :href="item.path"
            class="breadcrumb-item"
            :class="{ active: index === breadcrumbs.length - 1 }"
          >
            {{ item.name }}
            <i v-if="index < breadcrumbs.length - 1" class="bi bi-chevron-right"></i>
          </a>
        </nav>
      </div>
    </section>

    <!-- Category Header -->
    <section class="category-header">
      <div class="container-fluid px-4">
        <div class="header-content">
          <h1 class="category-title">{{ categoryTitle }}</h1>
          <p class="category-description">
            Khám phá bộ sưu tập {{ categoryTitle.toLowerCase() }} chính hãng với giá tốt nhất
          </p>
          <div class="category-stats">
            <span class="stat-item">
              <i class="bi bi-box-seam"></i>
              {{ categoryProducts.length }} sản phẩm
            </span>
            <span class="stat-item">
              <i class="bi bi-star-fill"></i>
              Đánh giá 4.8/5
            </span>
            <span class="stat-item">
              <i class="bi bi-truck"></i>
              Miễn phí vận chuyển
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters and Products -->
    <section class="products-section">
      <div class="container-fluid px-4">
        <div class="row">
          <!-- Sidebar Filters -->
          <div class="col-lg-3 col-md-4 mb-4">
            <div class="filters-sidebar">
              <div class="filter-card">
                <h5 class="filter-title">Sắp xếp theo</h5>
                <div class="filter-options">
                  <label class="filter-option">
                    <input type="radio" v-model="selectedSort" value="popular">
                    <span class="checkmark"></span>
                    Phổ biến nhất
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedSort" value="newest">
                    <span class="checkmark"></span>
                    Mới nhất
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedSort" value="price-asc">
                    <span class="checkmark"></span>
                    Giá thấp đến cao
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedSort" value="price-desc">
                    <span class="checkmark"></span>
                    Giá cao đến thấp
                  </label>
                </div>
              </div>

              <div class="filter-card">
                <h5 class="filter-title">Khoảng giá</h5>
                <div class="filter-options">
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="all">
                    <span class="checkmark"></span>
                    Tất cả
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="0-1000000">
                    <span class="checkmark"></span>
                    Dưới 1 triệu
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="1000000-3000000">
                    <span class="checkmark"></span>
                    1 - 3 triệu
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="3000000-5000000">
                    <span class="checkmark"></span>
                    3 - 5 triệu
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="5000000">
                    <span class="checkmark"></span>
                    Trên 5 triệu
                  </label>
                </div>
              </div>

              <div class="filter-card">
                <h5 class="filter-title">Thương hiệu</h5>
                <div class="filter-options">
                  <label class="filter-option">
                    <input type="radio" v-model="selectedBrand" value="all">
                    <span class="checkmark"></span>
                    Tất cả
                  </label>
                  <label 
                    v-for="brand in brands" 
                    :key="brand"
                    class="filter-option"
                  >
                    <input type="radio" v-model="selectedBrand" :value="brand">
                    <span class="checkmark"></span>
                    {{ brand }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="col-lg-9 col-md-8">
            <div class="products-header">
              <div class="results-info">
                Hiển thị {{ categoryProducts.length }} sản phẩm
              </div>
              <div class="view-options">
                <button class="view-btn active">
                  <i class="bi bi-grid"></i>
                </button>
                <button class="view-btn">
                  <i class="bi bi-list"></i>
                </button>
              </div>
            </div>

            <div class="products-grid">
              <div class="row g-3">
                <div 
                  v-for="product in categoryProducts" 
                  :key="product.id"
                  class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
                >
                  <div class="product-card">
                    <div class="product-image-container">
                      <router-link :to="`/product/${product.id}`" class="product-image-link">
                        <img :src="product.image" :alt="product.name" class="product-image" />
                      </router-link>
                      <div class="discount-badge">-{{ product.discount }}%</div>
                      <div class="product-actions">
                        <button class="action-btn" title="Yêu thích">
                          <i class="bi bi-heart"></i>
                        </button>
                        <button class="action-btn" title="Xem nhanh" @click="$router.push(`/product/${product.id}`)">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button class="action-btn" title="So sánh">
                          <i class="bi bi-arrow-left-right"></i>
                        </button>
                      </div>
                      <div class="quick-add">
                        <button class="quick-add-btn">Thêm vào giỏ</button>
                      </div>
                    </div>
                    <div class="product-info">
                      <div class="product-brand">{{ product.brand }}</div>
                      <router-link :to="`/product/${product.id}`" class="product-name-link">
                        <h6 class="product-name">{{ product.name }}</h6>
                      </router-link>
                      <div class="product-rating">
                        <div class="stars">
                          <i v-for="i in 5" :key="i" class="bi bi-star-fill" :class="{ active: i <= Math.floor(product.rating) }"></i>
                        </div>
                        <span class="rating-text">({{ product.reviews }})</span>
                      </div>
                      <div class="product-colors">
                        <span 
                          v-for="color in product.colors" 
                          :key="color"
                          class="color-dot"
                          :style="{ backgroundColor: color }"
                        ></span>
                      </div>
                      <div class="product-pricing">
                        <span class="current-price">{{ product.price.toLocaleString() }}đ</span>
                        <span class="original-price">{{ product.originalPrice.toLocaleString() }}đ</span>
                      </div>
                      <div class="product-meta">
                        <span class="sold-count">Đã bán {{ product.sold }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination-section">
              <nav class="pagination-nav">
                <button class="page-btn" disabled>
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button class="page-btn active">1</button>
                <button class="page-btn">2</button>
                <button class="page-btn">3</button>
                <span class="page-dots">...</span>
                <button class="page-btn">10</button>
                <button class="page-btn">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
