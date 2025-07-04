<template>
  <div class="search-page">
    <!-- Search Header -->
    <section class="search-header">
      <div class="container-fluid px-4">
        <div class="search-content">
          <h1 class="search-title">Tìm kiếm sản phẩm</h1>
          <div class="search-form">
            <EnhancedSearchBar
              v-model="searchQuery"
              :suggestions="suggestions"
              :search-history="searchHistory"
              :is-loading="isLoading"
              :show-filters="true"
              @search="handleEnhancedSearch"
              @filter-change="handleFilterChange"
              class="enhanced-search-bar"
            />
          </div>
          <div v-if="searchQuery || hasActiveFilters" class="search-info mt-3">
            <div class="search-summary">
              <p v-if="searchQuery">
                Kết quả tìm kiếm cho: <strong>"{{ searchQuery }}"</strong>
              </p>
              <p class="text-muted">
                Tìm thấy {{ totalResults }} sản phẩm
                <span v-if="hasActiveFilters"> (đã lọc)</span>
              </p>
            </div>
            <!-- Active Filters -->
            <div v-if="hasActiveFilters" class="active-filters mt-2">
              <div class="filter-chips">
                <span v-if="filters.category" class="filter-chip">
                  Danh mục: {{ getCategoryName(Number(filters.category)) }}
                  <button @click="clearFilter('category_id')" class="btn-close-filter">×</button>
                </span>
                <span v-if="filters.brand" class="filter-chip">
                  Thương hiệu: {{ getBrandName(Number(filters.brand)) }}
                  <button @click="clearFilter('brand_id')" class="btn-close-filter">×</button>
                </span>
                <span v-if="filters.minPrice" class="filter-chip">
                  Từ: {{ formatPrice(filters.minPrice) }}
                  <button @click="clearFilter('min_price')" class="btn-close-filter">×</button>
                </span>
                <span v-if="filters.maxPrice" class="filter-chip">
                  Đến: {{ formatPrice(filters.maxPrice) }}
                  <button @click="clearFilter('max_price')" class="btn-close-filter">×</button>
                </span>
                <span v-if="filters.minRating" class="filter-chip">
                  Đánh giá: {{ filters.minRating }}+ sao
                  <button @click="clearFilter('min_rating')" class="btn-close-filter">×</button>
                </span>
                <button v-if="hasActiveFilters" @click="clearAllFilters" class="btn btn-outline-secondary btn-sm ms-2">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Results -->
    <section class="search-results">
      <div class="container-fluid px-4">
        <!-- Sort Options -->
        <div v-if="searchResults.length > 0" class="sort-options mb-3">
          <div class="d-flex align-items-center justify-content-between">
            <div class="sort-controls">
              <label for="sort-select" class="form-label me-2">Sắp xếp theo:</label>
              <select 
                id="sort-select" 
                v-model="sortByModel" 
                @change="handleSortChange"
                class="form-select d-inline-block w-auto"
              >
                <option value="">Mặc định</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="name_asc">Tên: A-Z</option>
                <option value="name_desc">Tên: Z-A</option>
                <option value="rating_desc">Đánh giá cao nhất</option>
                <option value="created_at_desc">Mới nhất</option>
              </select>
            </div>
            <div class="view-options">
              <button 
                @click="showFiltersPanel = !showFiltersPanel"
                class="btn btn-outline-secondary btn-sm me-2"
                :class="{ active: showFiltersPanel }"
              >
                <i class="bi bi-funnel"></i>
                {{ showFiltersPanel ? 'Ẩn bộ lọc' : 'Hiện bộ lọc' }}
              </button>
              <span class="text-muted">{{ searchResults.length }} / {{ totalResults }} sản phẩm</span>
            </div>
          </div>
        </div>

        <!-- Advanced Filters Panel -->
        <div v-if="showFiltersPanel" class="filters-panel mb-4">
          <SearchFilters
            v-model="filters"
            :categories="categories"
            :brands="brands"
            @change="handleAdvancedFilterChange"
          />
        </div>

        <LoadingSpinner v-if="loading" text="Đang tìm kiếm..." />
        
        <div v-else-if="(searchQuery || hasActiveFilters) && searchResults.length === 0" class="no-results">
          <div class="text-center py-5">
            <i class="bi bi-search fs-1 text-muted"></i>
            <h3 class="mt-3">Không tìm thấy sản phẩm nào</h3>
            <p class="text-muted">Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
            <button v-if="hasActiveFilters" @click="clearAllFilters" class="btn btn-outline-primary">
              Xóa tất cả bộ lọc
            </button>
          </div>
        </div>

        <div v-else-if="searchResults.length > 0" class="results-grid">
          <div class="row g-3">
            <div 
              v-for="product in searchResults" 
              :key="product.id"
              class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
            >
              <ProductCard :product="product" />
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalResults > searchResults.length" class="pagination-container mt-4">
            <nav aria-label="Search results pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                  <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li 
                  v-for="page in visiblePages" 
                  :key="page"
                  class="page-item" 
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
                  <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div v-else class="search-suggestions">
          <div class="text-center py-5">
            <h3>Tìm kiếm sản phẩm yêu thích</h3>
            <p class="text-muted">Nhập từ khóa để tìm kiếm sản phẩm bạn muốn</p>
            <div class="popular-searches mt-4">
              <h5>Từ khóa phổ biến:</h5>
              <div class="d-flex flex-wrap gap-2 justify-content-center">
                <button 
                  v-for="keyword in popularKeywords" 
                  :key="keyword"
                  class="btn btn-outline-primary btn-sm"
                  @click="searchByKeyword(keyword)"
                >
                  {{ keyword }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdvancedSearch, type SearchFilters as ISearchFilters } from '@/composables/useAdvancedSearch'
import { categoriesApi, brandsApi } from '@/services/api'
import type { Product, Category, Brand } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ProductCard from '@/components/ProductCard.vue'
import EnhancedSearchBar from '@/components/EnhancedSearchBar.vue'
import SearchFilters from '@/components/SearchFilters.vue'

const route = useRoute()
const router = useRouter()

// Advanced search composable
const {
  searchQuery,
  searchResults,
  suggestions,
  searchHistory,
  isLoading,
  filters,
  categories: searchCategories,
  brands: searchBrands,
  currentPage,
  totalPages,
  totalItems,
  hasResults,
  hasFilters,
  performSearch,
  applyFilters,
  clearFilters,
  loadFilterData,
  initializeFromRoute
} = useAdvancedSearch()

// Additional data
const categories = ref<Category[]>([])
const brands = ref<Brand[]>([])
const showFiltersPanel = ref(false)

const popularKeywords = [
  'Balo du lịch',
  'Vali kéo',
  'Túi xách',
  'Balo laptop',
  'Túi đeo chéo',
  'Vali size 20',
  'Balo thể thao'
]

// Computed
const hasActiveFilters = computed(() => hasFilters.value)

const totalResults = computed(() => totalItems.value)

const loading = computed(() => isLoading.value)

const searchParams = computed(() => ({
  query: searchQuery.value,
  category_id: filters.value.category ? Number(filters.value.category) : undefined,
  brand_id: filters.value.brand ? Number(filters.value.brand) : undefined,
  min_price: filters.value.minPrice,
  max_price: filters.value.maxPrice,
  min_rating: filters.value.minRating,
  sort_by: filters.value.sortBy && filters.value.sortOrder 
    ? `${filters.value.sortBy}_${filters.value.sortOrder}`
    : undefined,
  page: currentPage.value
}))

const sortByModel = computed({
  get: () => {
    if (filters.value.sortBy && filters.value.sortOrder) {
      return `${filters.value.sortBy}_${filters.value.sortOrder}`
    }
    return ''
  },
  set: (value: string) => {
    if (value) {
      const [sortBy, sortOrder] = value.split('_')
      filters.value.sortBy = sortBy as any
      filters.value.sortOrder = sortOrder as any
    } else {
      filters.value.sortBy = undefined
      filters.value.sortOrder = undefined
    }
  }
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const handleEnhancedSearch = async (query: string) => {
  searchQuery.value = query
  await performSearch()
  updateUrlParams()
}

const handleFilterChange = async (newFilters: any) => {
  // Convert the filters format
  const convertedFilters: ISearchFilters = {
    category: newFilters.category_id?.toString(),
    brand: newFilters.brand_id?.toString(),
    minPrice: newFilters.min_price,
    maxPrice: newFilters.max_price,
    minRating: newFilters.min_rating,
    sortBy: newFilters.sort_by?.split('_')[0] as any,
    sortOrder: newFilters.sort_by?.split('_')[1] as any
  }
  
  await applyFilters(convertedFilters)
  updateUrlParams()
}

const handleAdvancedFilterChange = async (newFilters: ISearchFilters) => {
  await applyFilters(newFilters)
  updateUrlParams()
}

const handleSortChange = async () => {
  await performSearch()
  updateUrlParams()
}

const clearFilter = async (filterKey: string) => {
  const newFilters = { ...filters.value }
  
  switch (filterKey) {
    case 'category_id':
      newFilters.category = undefined
      break
    case 'brand_id':
      newFilters.brand = undefined
      break
    case 'min_price':
      newFilters.minPrice = undefined
      break
    case 'max_price':
      newFilters.maxPrice = undefined
      break
    case 'min_rating':
      newFilters.minRating = undefined
      break
  }
  
  await applyFilters(newFilters)
  updateUrlParams()
}

const clearAllFilters = async () => {
  await clearFilters()
  updateUrlParams()
}

const goToPage = async (page: number) => {
  currentPage.value = page
  await performSearch()
  updateUrlParams()
}

const searchByKeyword = async (keyword: string) => {
  await handleEnhancedSearch(keyword)
}

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Không xác định'
}

const getBrandName = (brandId: number) => {
  const brand = brands.value.find(b => b.id === brandId)
  return brand?.name || 'Không xác định'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const updateUrlParams = () => {
  const query: any = {}
  
  if (searchQuery.value) query.q = searchQuery.value
  if (filters.value.category) query.category = filters.value.category
  if (filters.value.brand) query.brand = filters.value.brand
  if (filters.value.minPrice) query.min_price = filters.value.minPrice
  if (filters.value.maxPrice) query.max_price = filters.value.maxPrice
  if (filters.value.minRating) query.min_rating = filters.value.minRating
  if (filters.value.sortBy && filters.value.sortOrder) {
    query.sort = `${filters.value.sortBy}_${filters.value.sortOrder}`
  }
  if (currentPage.value > 1) query.page = currentPage.value

  router.push({ name: 'search', query })
}

const loadInitialData = async () => {
  try {
    // Load categories and brands for filters
    const [categoriesResponse, brandsResponse] = await Promise.all([
      categoriesApi.getCategories(),
      brandsApi.getBrands()
    ])
    
    categories.value = categoriesResponse.data
    brands.value = brandsResponse.data
    
    // Also load into the composable
    await loadFilterData()
  } catch (error) {
    console.error('Failed to load initial data:', error)
  }
}

const initializeFromUrl = async () => {
  await initializeFromRoute()
  
  // Sync local state with composable
  const urlQuery = route.query.q as string
  if (urlQuery) {
    searchQuery.value = urlQuery
  }
}

// Initialize
onMounted(async () => {
  await loadInitialData()
  await initializeFromUrl()
})

// Watch for route changes
watch(
  () => route.query,
  () => {
    if (route.name === 'search') {
      initializeFromUrl()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.search-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
}

.search-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.search-form {
  max-width: 600px;
  margin: 0 auto;
}

.input-group {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-control {
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
}

.btn-primary {
  padding: 1rem 2rem;
  font-weight: 600;
}

.search-info {
  text-align: center;
  font-size: 1.1rem;
}

.search-results {
  padding: 3rem 0;
}

.no-results i {
  opacity: 0.3;
}

.popular-searches .btn {
  margin: 0.25rem;
}

.results-grid {
  margin-top: 2rem;
}

.search-suggestions {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
}

.enhanced-search-bar {
  max-width: 800px;
  margin: 0 auto;
}

.active-filters {
  max-width: 800px;
  margin: 0 auto;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  gap: 0.5rem;
}

.btn-close-filter {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.25rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.btn-close-filter:hover {
  opacity: 1;
}

.sort-options {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.sort-options .btn.active {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
}

.filters-panel {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pagination-container {
  margin-top: 3rem;
}

.pagination .page-link {
  color: #667eea;
  border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: #667eea;
  border-color: #667eea;
}

.pagination .page-link:hover {
  color: #5a67d8;
  background-color: #e2e8f0;
  border-color: #cbd5e0;
}
</style>
