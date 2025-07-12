<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { productsApi, brandsApi, categoriesApi } from '@/services/api'
import type { Product, Brand, Category } from '@/types'
import { getCategoryName } from '@/utils'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ProductCard from '@/components/ProductCard.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const route = useRoute()
const categorySlug = computed(() => route.params.category as string)

const products = ref<Product[]>([])
const allBrands = ref<Brand[]>([])
const category = ref<Category | null>(null)
const loading = ref(false)
const categoryLoading = ref(false)
const productsLoading = ref(false)
const categoryError = ref<string | null>(null)

// SEO and Meta tags
const updateMetaTags = () => {
  if (typeof document !== 'undefined') {
    // Update page title
    document.title = `${categoryTitle.value} - BaloZone | Balo, Vali Chính Hãng`

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content',
        `${categoryDescription.value} Mua ngay với giá tốt nhất tại BaloZone!`
      )
    }
  }
}

// Separate function to fetch category data by slug
const fetchCategory = async (slug: string) => {
  categoryLoading.value = true
  categoryError.value = null
  
  try {
    console.log(`Fetching category info for slug: ${slug}`)
    const categoryResponse = await categoriesApi.getCategoryBySlug(slug)
    console.log('Category API Response:', categoryResponse);
    
    if (categoryResponse.data) {
      category.value = categoryResponse.data
      console.log('Category set successfully:', category.value)
    } else {
      console.warn('No category data received from API')
      categoryError.value = 'Danh mục không tồn tại'
      category.value = null
    }
  } catch (error) {
    console.error('Failed to load category:', error)
    categoryError.value = 'Danh mục không tồn tại hoặc đã bị xóa'
    category.value = null
  } finally {
    categoryLoading.value = false
  }
}

// Separate function to fetch products with filters
const fetchProducts = async (page: number = 1, perPage: number = 12) => {
  productsLoading.value = true
  
  try {
    console.log(`Fetching products for category: ${category.value?.id}, page: ${page}, per_page: ${perPage}`)
    
    const filters: any = {
      page: page,
      per_page: perPage,
      sort_by: getSortField(selectedSort.value),
      sort_order: getSortOrder(selectedSort.value)
    }
    
    // Add category filter - CRITICAL: Always add category_id when we have it
    if (category.value && category.value.id > 0) {
      filters.category_id = category.value.id
      console.log(`Adding category_id filter: ${filters.category_id}`)
    } else {
      console.warn('No valid category ID found, will fetch all products without category filter')
    }
    
    // Apply additional filters
    if (selectedBrand.value !== 'all') {
      const brandId = allBrands.value.find(b => b.slug === selectedBrand.value)?.id
      if (brandId) {
        filters.brand_id = brandId
      }
    }
    
    if (selectedPriceRange.value !== 'all') {
      const [min, max] = selectedPriceRange.value.split('-').map(Number)
      filters.min_price = min
      if (max) filters.max_price = max
    }
    
    const productsResponse = await productsApi.getProducts(filters)
    console.log('Products API Response:', productsResponse)
    console.log('Filters sent to API:', filters)
    
    // Build debug URL to see exactly what's being called
    const debugParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        debugParams.append(key, String(value))
      }
    })
    console.log('API URL would be:', `http://localhost:8000/api/products?${debugParams.toString()}`)
    
    if (productsResponse.data) {
      console.log('Products pagination data received:', productsResponse.data);
      
      // Extract products array from pagination data
      const productsArray = productsResponse.data.data || []
      console.log('Products array extracted:', productsArray);
      
      // Ensure products data is an array and filter out any null/undefined values
      products.value = Array.isArray(productsArray) ? productsArray.filter(product => product && product.id) : []
      
      // Update pagination info from products response (PaginatedResponse structure)
      currentPage.value = productsResponse.data.current_page || 1
      totalPages.value = productsResponse.data.last_page || 1
      totalProducts.value = productsResponse.data.total || 0
      itemsPerPage.value = productsResponse.data.per_page || perPage
      
      // Update category products count
      if (category.value) {
        category.value.products_count = productsResponse.data.total || 0
      }
      
      console.log('Products and pagination set successfully:', {
        productsCount: products.value.length,
        currentPage: currentPage.value,
        totalPages: totalPages.value,
        totalProducts: totalProducts.value,
        perPage: itemsPerPage.value
      })
    } else {
      console.warn('No products data received from API')
      products.value = []
      currentPage.value = 1
      totalPages.value = 1
      totalProducts.value = 0
    }
    
  } catch (error) {
    console.error('Failed to load products:', error)
    products.value = []
    currentPage.value = 1
    totalPages.value = 1
    totalProducts.value = 0
  } finally {
    productsLoading.value = false
  }
}

// Combined function to load both category and products
const loadCategoryPage = async (slug: string, page: number = 1, perPage: number = 12) => {
  loading.value = true
  
  try {
    // Step 1: Fetch category first
    await fetchCategory(slug)
    
    // Step 2: Only fetch products if category exists
    if (category.value && !categoryError.value) {
      await fetchProducts(page, perPage)
    }
    
  } catch (error) {
    console.error('Failed to load category page:', error)
  } finally {
    loading.value = false
  }
}

// Convenience function to refresh only products (useful for filtering/sorting)
const refreshProducts = async (page: number = currentPage.value, perPage: number = itemsPerPage.value) => {
  await fetchProducts(page, perPage)
}

// Convenience function to reload current page with new filters
const applyFiltersAndRefresh = async () => {
  if (category.value) {
    await fetchProducts(1, itemsPerPage.value) // Reset to page 1 when applying filters
  }
}

// Helper functions for sort mapping
const getSortField = (sort: string): string => {
  switch (sort) {
    case 'newest': return 'created_at'
    case 'price-asc': 
    case 'price-desc': return 'price'
    case 'name': return 'name'
    default: return 'created_at'
  }
}

const getSortOrder = (sort: string): 'asc' | 'desc' => {
  switch (sort) {
    case 'price-asc': return 'asc'
    case 'price-desc': return 'desc'
    case 'name': return 'asc'
    case 'newest': 
    default: return 'desc'
  }
}
const fetchBrands = async () => {
  try {
    const response = await brandsApi.getActiveBrands()
    // Ensure response.data is an array and filter out any null/undefined values
    allBrands.value = Array.isArray(response.data) ? response.data.filter(brand => brand && brand.id) : []
  } catch (error) {
    console.error('Failed to load brands:', error)
    allBrands.value = []
  }
}

onMounted(() => {
  if (categorySlug.value) {
    loadCategoryPage(categorySlug.value, 1, itemsPerPage.value)
  }
  fetchBrands()

  // Restore view mode preference
  if (typeof localStorage !== 'undefined') {
    const savedViewMode = localStorage.getItem('categoryViewMode')
    if (savedViewMode === 'list' || savedViewMode === 'grid') {
      viewMode.value = savedViewMode
    }
  }
})

watch(categorySlug, (newSlug) => {
  if (newSlug) {
    loadCategoryPage(newSlug, 1, itemsPerPage.value)
  }
})

// Filter and sort functionality
const selectedSort = ref('popular')
const selectedPriceRange = ref('all')
const selectedBrand = ref('all')

// View mode functionality
const viewMode = ref<'grid' | 'list'>('grid')

const toggleViewMode = (mode: 'grid' | 'list') => {
  viewMode.value = mode
}

// Pagination - now handled by backend
const currentPage = ref(1)
const itemsPerPage = ref(12)
const totalPages = ref(1)
const totalProducts = ref(0)

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    refreshProducts(page, itemsPerPage.value)
    // Smooth scroll to top of products section
    nextTick(() => {
      const productsSection = document.querySelector('.products-section')
      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  }
}

// Add scroll to top when category changes
watch(categorySlug, () => {
  // Router scrollBehavior sẽ tự động xử lý việc cuộn lên đầu trang
  // nextTick(() => {
  //   window.scrollTo({ top: 0, behavior: 'smooth' })
  // })
})

const getPaginationPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  // Don't show pagination if only one page or less
  if (total <= 1) {
    return []
  }

  // If total pages is 7 or less, show all pages
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current <= 4) {
      // Show first 5 pages, then ellipsis, then last page
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      if (total > 6) {
        pages.push('...')
        pages.push(total)
      }
    } else if (current >= total - 3) {
      // Show first page, ellipsis, then last 5 pages
      if (total > 6) {
        pages.push('...')
      }
      for (let i = Math.max(2, total - 4); i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// Reset pagination when filters change (with debounce)
watch([selectedSort, selectedPriceRange, selectedBrand], () => {
  debouncedApplyFilters()
})

// Reset pagination when items per page changes
watch(itemsPerPage, (newPerPage) => {
  if (category.value) {
    refreshProducts(1, newPerPage) // Reset to page 1 with new items per page
  }
})

// Reset pagination when category changes
watch(categorySlug, (newSlug) => {
  if (newSlug) {
    // Reset filters when changing category
    selectedSort.value = 'popular'
    selectedPriceRange.value = 'all'
    selectedBrand.value = 'all'
    loadCategoryPage(newSlug, 1, itemsPerPage.value)
  }
})


// For display - no additional client-side filtering needed
const displayedProducts = computed(() => {
  return categoryProducts.value.filter(product => product && product.id)
})

// Apply filters with backend call
const applyFilters = () => {
  if (category.value) {
    applyFiltersAndRefresh()
  }
}

// Debounced filter application
let filterTimeout: number | null = null
const debouncedApplyFilters = () => {
  if (filterTimeout) {
    clearTimeout(filterTimeout)
  }
  
  filterTimeout = setTimeout(() => {
    applyFilters()
  }, 300)
}

// Computed properties for filtered and sorted products (now applied locally on current page)
const categoryProducts = computed(() => {
  // Products are now filtered by backend, so we return them as-is but filter out null/undefined
  return products.value.filter(product => product && product.id)
})

const brands = computed(() => {
  return allBrands.value.filter(brand => brand && brand.id && brand.slug && brand.name)
})

const categoryTitle = computed(() => {
  if (categoryError.value) return 'Lỗi'
  return category.value?.name || getCategoryName(categorySlug.value)
})

const categoryDescription = computed(() => {
  if (categoryError.value) return categoryError.value
  
  console.log('Computing categoryDescription:', {
    categoryValue: category.value,
    hasDescription: !!category.value?.description,
    description: category.value?.description,
    slug: categorySlug.value
  })
  
  if (category.value?.description) {
    return category.value.description
  }
  
  console.log(`Using default description for category: ${categorySlug.value}`)
  return `Khám phá bộ sưu tập ${category.value?.name || getCategoryName(categorySlug.value).toLowerCase()} chính hãng với giá tốt nhất tại BaloZone`
})

const categoryImage = computed(() => {
  return category.value?.image || ''
})

const breadcrumbs = computed(() => [
  { name: 'Trang chủ', path: '/' },
  { name: categoryTitle.value, path: `/category/${categorySlug.value}` }
])

// Watch for category changes to update meta tags
watch([categoryTitle, categoryDescription], () => {
  updateMetaTags()
}, { immediate: true })

// Debug watcher for category changes
watch(category, (newCategory) => {
  console.log('Category watcher triggered:', {
    newCategory,
    hasDescription: !!newCategory?.description,
    description: newCategory?.description
  })
}, { deep: true, immediate: true })

// Watch for view mode changes to persist user preference
watch(viewMode, (newMode) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('categoryViewMode', newMode)
  }
})

// Watch for category products changes to log info (now mostly for debugging)
watch(categoryProducts, (newProducts) => {
  console.log('Filtered products changed:', {
    filteredCount: newProducts.length,
    totalProducts: totalProducts.value,
    currentPage: currentPage.value,
    itemsPerPage: itemsPerPage.value
  })
}, { immediate: true })
</script>
<template>
  <div class="category-page">
    <!-- Breadcrumbs -->
    <Breadcrumb :items="breadcrumbs" />

    <!-- Category Error Section -->
    <section v-if="categoryError" class="category-error">
      <div class="container-fluid px-4">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="error-card">
              <div class="error-icon">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <h2 class="error-title">Danh mục không tồn tại</h2>
              <p class="error-description">
                Xin lỗi, danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
              <div class="error-actions">
                <router-link to="/" class="btn btn-primary">
                  <i class="bi bi-house"></i>
                  Về trang chủ
                </router-link>
                <router-link to="/categories" class="btn btn-outline-secondary">
                  <i class="bi bi-grid"></i>
                  Xem tất cả danh mục
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Header -->
    <section v-else class="category-header">
      <div class="container-fluid px-4">
        <div class="row align-items-center">
          <!-- Category Info -->
          <div class="col-lg-8">
            <div class="header-content">
              <div class="category-meta">
                <LoadingSpinner v-if="categoryLoading" size="sm" text="" />
                <span v-else class="category-badge">
                  <i class="bi bi-tag-fill"></i>
                  Danh mục
                </span>
              </div>
              <h1 class="category-title">{{ categoryTitle }}</h1>
              <p class="category-description">
                {{ categoryDescription }}
              </p>
              <div class="category-stats">
                <span class="stat-item">
                  <i class="bi bi-box-seam"></i>
                  {{ totalProducts }} sản phẩm
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

          <!-- Category Image -->
          <div class="col-lg-4" v-if="categoryImage">
            <div class="category-image">
              <img :src="categoryImage" :alt="categoryTitle" class="img-fluid rounded">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters and Products -->
    <section v-if="!categoryError" class="products-section">
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
                  <template v-for="brand in brands" :key="brand.id">
                    <label v-if="brand && brand.id" class="filter-option">
                      <input type="radio" v-model="selectedBrand" :value="brand.slug">
                      <span class="checkmark"></span>
                      {{ brand.name }}
                    </label>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="col-lg-9 col-md-8">
            <div class="products-header">
              <div class="results-info">
                <LoadingSpinner v-if="productsLoading" size="sm" text="" />
                <span v-else>
                  Hiển thị {{ displayedProducts.length }} / {{ totalProducts }} sản phẩm
                </span>
              </div>
              <div class="header-controls">
                <div class="items-per-page">
                  <label for="itemsPerPage">Hiển thị:</label>
                  <select id="itemsPerPage" v-model="itemsPerPage" class="form-select">
                    <option :value="12">12</option>
                    <option :value="24">24</option>
                    <option :value="48">48</option>
                  </select>
                </div>
                <div class="view-options">
                  <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="toggleViewMode('grid')" title="Xem dạng lưới">
                    <i class="bi bi-grid"></i>
                  </button>
                  <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="toggleViewMode('list')" title="Xem dạng danh sách">
                    <i class="bi bi-list"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="products-grid">
              <LoadingSpinner v-if="loading || productsLoading" text="Đang tải sản phẩm..." size="lg" />
              <div v-else-if="displayedProducts.length === 0" class="empty-state">
                <div class="text-center py-5">
                  <i class="bi bi-box-seam" style="font-size: 4rem; color: #ddd;"></i>
                  <h4 class="mt-3 text-muted">Chưa có sản phẩm</h4>
                  <p class="text-muted">Danh mục này hiện chưa có sản phẩm nào.</p>
                </div>
              </div>

              <!-- Grid View -->
              <div v-else-if="viewMode === 'grid'" class="row g-3">
                <div v-for="product in displayedProducts" :key="product.id" class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
                  <ProductCard :product="product" />
                </div>
              </div>

              <!-- List View -->
              <div v-else class="products-list">
                <div v-for="product in displayedProducts" :key="product.id" class="product-list-item mb-3">
                  <ProductCard :product="product" :listView="true" />
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination-section">
              <nav class="pagination-nav">
                <button 
                  class="page-btn" 
                  @click="goToPage(currentPage - 1)" 
                  :disabled="currentPage === 1"
                  title="Trang trước"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
                
                <button 
                  v-for="page in getPaginationPages" 
                  :key="`page-${page}`" 
                  class="page-btn" 
                  @click="typeof page === 'number' ? goToPage(page) : null" 
                  :class="{ 
                    active: page === currentPage,
                    disabled: typeof page !== 'number'
                  }"
                  :disabled="typeof page !== 'number'"
                  :title="typeof page === 'number' ? `Trang ${page}` : ''"
                >
                  {{ page }}
                </button>
                
                <button 
                  class="page-btn" 
                  @click="goToPage(currentPage + 1)" 
                  :disabled="currentPage === totalPages"
                  title="Trang sau"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </nav>

              <div class="pagination-info">
                Trang {{ currentPage }} / {{ totalPages }} 
                <span class="text-muted">({{ totalProducts }} sản phẩm)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.category-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Category Error Section */
.category-error {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.error-card {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.error-icon {
  font-size: 4rem;
  color: #dc3545;
  margin-bottom: 24px;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
}

.error-description {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 32px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.error-actions .btn {
  padding: 12px 24px;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.error-actions .btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  color: white;
}

.error-actions .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
}

.error-actions .btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
  background: transparent;
}

.error-actions .btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-2px);
}

/* Category Header */
.category-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 60px 0;
  margin-bottom: 40px;
}

.category-meta {
  margin-bottom: 15px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.category-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.category-description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
  line-height: 1.6;
}

.category-stats {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.stat-item i {
  font-size: 1.1rem;
}

.category-image {
  text-align: center;
}

.category-image img {
  max-height: 300px;
  width: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Products Section */
.products-section {
  margin-bottom: 60px;
}

.filters-sidebar {
  position: sticky;
  top: 100px;
}

.filter-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.filter-title {
  font-weight: 600;
  margin-bottom: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #ff6b35;
  padding-bottom: 10px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  /* padding: 12px 0; */
  transition: all 0.3s ease;
}

.filter-option:hover {
  color: #ff6b35;
}

.filter-option input[type="radio"] {
  margin-right: 12px;
  accent-color: #ff6b35;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.results-info {
  font-weight: 500;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.items-per-page label {
  color: #6c757d;
  font-weight: 500;
}

.items-per-page .form-select {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

.view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: #e9ecef;
}

.view-btn.active {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border-color: #ff6b35;
}

.empty-state {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Products Grid and List Views */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-list-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.15);
}

/* Pagination */
.pagination-section {
  margin-top: 50px;
  text-align: center;
  display: block;
}

.pagination-nav {
  display: inline-flex;
  gap: 8px;
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  justify-content: center;
}

.page-btn {
  background: transparent;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #2c3e50;
}

.page-btn:hover:not(:disabled):not(.disabled) {
  background: rgba(255, 107, 53, 0.1);
  border-color: #ff6b35;
  color: #ff6b35;
  transform: translateY(-2px);
}

.page-btn.active {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border-color: #ff6b35;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.page-btn:disabled,
.page-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.page-btn.disabled {
  border: none;
  background: transparent;
  color: #6c757d;
  font-weight: normal;
}

.pagination-info {
  display: block;
  margin-top: 15px;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.pagination-info .text-muted {
  font-size: 0.85rem;
  margin-left: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .category-title {
    font-size: 2rem;
  }

  .category-description {
    font-size: 1rem;
  }

  .category-stats {
    gap: 15px;
  }

  .stat-item {
    font-size: 0.9rem;
    padding: 8px 15px;
  }

  .products-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .header-controls {
    flex-direction: column;
    gap: 15px;
  }

  .filters-sidebar {
    position: static;
  }

  .filter-card {
    margin-bottom: 20px;
  }

  .pagination-nav {
    padding: 10px 15px;
    gap: 6px;
  }

  .page-btn {
    min-width: 40px;
    height: 40px;
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .pagination-info {
    font-size: 0.85rem;
  }

  /* Error Section Mobile */
  .error-card {
    padding: 40px 20px;
    margin: 0 20px;
  }

  .error-icon {
    font-size: 3rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .error-actions .btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 576px) {
  .category-header {
    padding: 40px 0;
  }

  .category-title {
    font-size: 1.75rem;
  }

  .category-stats {
    flex-direction: column;
    gap: 10px;
  }

  .stat-item {
    justify-content: center;
  }

  .products-list {
    gap: 0.5rem;
  }

  .product-list-item {
    margin-bottom: 0.5rem;
  }

  .pagination-nav {
    padding: 8px 12px;
    gap: 4px;
    flex-wrap: wrap;
  }

  .page-btn {
    min-width: 36px;
    height: 36px;
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .pagination-info {
    font-size: 0.8rem;
    margin-top: 10px;
  }

  .pagination-info .text-muted {
    display: block;
    margin-left: 0;
    margin-top: 4px;
  }

  /* Error Section Extra Small Mobile */
  .category-error {
    padding: 40px 0;
  }

  .error-card {
    padding: 30px 15px;
    margin: 0 15px;
    border-radius: 12px;
  }

  .error-icon {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  .error-title {
    font-size: 1.25rem;
    margin-bottom: 12px;
  }

  .error-description {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  .error-actions .btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
</style>
