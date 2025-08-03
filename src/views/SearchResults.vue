<template>
  <UserLayout>
    <div class="search-results-page">
      <!-- Breadcrumb -->
      <Breadcrumb
        :items="breadcrumbItems"
        current="Kết quả tìm kiếm"
      />

      <div class="container-fluid px-4">
        <div class="row">
          <!-- Sidebar Filters (Desktop) -->
          <div class="col-lg-3 d-none d-lg-block">
            <div class="filters-sidebar">
              <SearchFilters
                v-model="filters"
                :categories="categories"
                :brands="brands"
                :price-range="priceRange"
                :is-loading="isLoading"
                @apply="applyFilters"
                @clear="clearFilters"
              />
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-lg-9">
            <!-- Search Header -->
            <div class="search-header mb-4">
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div class="search-info">
                  <h1 class="search-title">
                    <template v-if="searchQuery">
                      Kết quả cho "<span class="text-primary">{{ searchQuery }}</span>"
                    </template>
                    <template v-else>
                      Tất cả sản phẩm
                    </template>
                  </h1>
                  <p class="search-subtitle text-muted">
                    {{ totalItems }} sản phẩm được tìm thấy
                    <span v-if="hasActiveFilters"> (đã lọc)</span>
                  </p>
                </div>

                <div class="search-actions d-flex gap-2">
                  <!-- Mobile Filter Toggle -->
                  <button
                    class="btn btn-outline-primary d-lg-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#filtersOffcanvas"
                  >
                    <i class="bi bi-funnel me-1"></i>
                    Lọc
                    <span v-if="activeFiltersCount > 0" class="badge bg-primary ms-1">
                      {{ activeFiltersCount }}
                    </span>
                  </button>

                  <!-- Sort Dropdown -->
                  <div class="dropdown">
                    <button
                      class="btn btn-outline-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i class="bi bi-sort-down me-1"></i>
                      {{ getSortLabel(filters.sortBy, filters.sortOrder) }}
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <button
                          class="dropdown-item"
                          @click="updateSort('name', 'asc')"
                          :class="{ active: filters.sortBy === 'name' && filters.sortOrder === 'asc' }"
                        >
                          Tên A-Z
                        </button>
                      </li>
                      <li>
                        <button
                          class="dropdown-item"
                          @click="updateSort('name', 'desc')"
                          :class="{ active: filters.sortBy === 'name' && filters.sortOrder === 'desc' }"
                        >
                          Tên Z-A
                        </button>
                      </li>
                      <li>
                        <button
                          class="dropdown-item"
                          @click="updateSort('price', 'asc')"
                          :class="{ active: filters.sortBy === 'price' && filters.sortOrder === 'asc' }"
                        >
                          Giá thấp đến cao
                        </button>
                      </li>
                      <li>
                        <button
                          class="dropdown-item"
                          @click="updateSort('price', 'desc')"
                          :class="{ active: filters.sortBy === 'price' && filters.sortOrder === 'desc' }"
                        >
                          Giá cao đến thấp
                        </button>
                      </li>
                      <li>
                        <button
                          class="dropdown-item"
                          @click="updateSort('created_at', 'desc')"
                          :class="{ active: filters.sortBy === 'created_at' && filters.sortOrder === 'desc' }"
                        >
                          Mới nhất
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Active Filters Display -->
              <div v-if="hasActiveFilters" class="active-filters mt-3">
                <div class="d-flex flex-wrap gap-2 align-items-center">
                  <span class="text-muted fw-medium">Bộ lọc:</span>

                  <span v-if="filters.category" class="filter-chip">
                    <i class="bi bi-tag me-1"></i>
                    {{ getCategoryName(filters.category) }}
                    <button @click="clearFilter('category')" class="btn-close-filter">
                      <i class="bi bi-x"></i>
                    </button>
                  </span>

                  <span v-if="filters.brand" class="filter-chip">
                    <i class="bi bi-award me-1"></i>
                    {{ getBrandName(filters.brand) }}
                    <button @click="clearFilter('brand')" class="btn-close-filter">
                      <i class="bi bi-x"></i>
                    </button>
                  </span>

                  <span v-if="filters.minPrice || filters.maxPrice" class="filter-chip">
                    <i class="bi bi-currency-dollar me-1"></i>
                    {{ formatPriceRange(filters.minPrice, filters.maxPrice) }}
                    <button @click="clearPriceFilter" class="btn-close-filter">
                      <i class="bi bi-x"></i>
                    </button>
                  </span>

                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="clearAllFilters"
                  >
                    <i class="bi bi-x-circle me-1"></i>
                    Xóa tất cả
                  </button>
                </div>
              </div>
            </div>

            <!-- Search Results -->
            <div class="search-results">
              <!-- Loading State -->
              <div v-if="isLoading" class="loading-container">
                <div class="row">
                  <div v-for="n in 8" :key="n" class="col-6 col-md-4 col-xl-3 mb-4">
                    <div class="product-skeleton">
                      <div class="skeleton-image"></div>
                      <div class="skeleton-content">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Products Grid -->
              <div v-else-if="searchResults.length > 0" class="products-grid">
                <div class="row">
                  <div
                    v-for="product in searchResults"
                    :key="product.id"
                    class="col-6 col-md-4 col-xl-3 mb-4"
                  >
                    <ProductCard
                      :product="product"
                      :show-compare="true"
                      :show-quick-view="true"
                    />
                  </div>
                </div>

                <!-- Pagination -->
                <nav v-if="totalPages > 1" class="pagination-nav mt-5" aria-label="Search results pagination">
                  <div class="d-flex justify-content-center">
                    <nav>
                      <ul class="pagination pagination-lg">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                          <button
                            class="page-link"
                            @click="goToPage(currentPage - 1)"
                            :disabled="currentPage === 1"
                          >
                            <i class="bi bi-chevron-left"></i>
                            Trước
                          </button>
                        </li>

                        <li
                          v-for="page in getVisiblePages()"
                          :key="page"
                          class="page-item"
                          :class="{ active: page === currentPage }"
                        >
                          <button
                            v-if="typeof page === 'number'"
                            class="page-link"
                            @click="goToPage(page)"
                          >
                            {{ page }}
                          </button>
                          <span v-else class="page-link">...</span>
                        </li>

                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                          <button
                            class="page-link"
                            @click="goToPage(currentPage + 1)"
                            :disabled="currentPage === totalPages"
                          >
                            Sau
                            <i class="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>

                  <!-- Results Info -->
                  <div class="text-center mt-3">
                    <small class="text-muted">
                      Hiển thị {{ ((currentPage - 1) * itemsPerPage) + 1 }} -
                      {{ Math.min(currentPage * itemsPerPage, totalItems) }}
                      trong số {{ totalItems }} sản phẩm
                    </small>
                  </div>
                </nav>
              </div>

              <!-- No Results -->
              <div v-else class="no-results text-center py-5">
                <div class="no-results-icon mb-3">
                  <i class="bi bi-search text-muted" style="font-size: 4rem;"></i>
                </div>
                <h3 class="no-results-title">Không tìm thấy sản phẩm</h3>
                <p class="no-results-message text-muted mb-4">
                  <template v-if="searchQuery">
                    Không có sản phẩm nào khớp với từ khóa "<strong>{{ searchQuery }}</strong>"
                  </template>
                  <template v-else>
                    Không có sản phẩm nào phù hợp với bộ lọc hiện tại
                  </template>
                </p>
                <div class="no-results-actions">
                  <button v-if="hasActiveFilters" class="btn btn-outline-primary me-2" @click="clearAllFilters">
                    <i class="bi bi-funnel me-1"></i>
                    Xóa bộ lọc
                  </button>
                  <router-link to="/" class="btn btn-primary">
                    <i class="bi bi-house me-1"></i>
                    Về trang chủ
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Filters Offcanvas -->
      <div class="offcanvas offcanvas-start" tabindex="-1" id="filtersOffcanvas">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Bộ lọc tìm kiếm</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <SearchFilters
            v-model="filters"
            :categories="categories"
            :brands="brands"
            :price-range="priceRange"
            :is-loading="isLoading"
            @apply="applyFiltersAndClose"
            @clear="clearFilters"
          />
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdvancedSearch } from '@/composables/useAdvancedSearch'
import { useAppData } from '@/composables/useAppData'
import { formatPrice } from '@/utils'
import UserLayout from '@/components/layouts/UserLayout.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import ProductCard from '@/components/ProductCard.vue'
import SearchFilters from '@/components/SearchFiltersNew.vue'
import type { SearchFilters as FilterType } from '@/composables/useAdvancedSearch'

const route = useRoute()
const router = useRouter()

// Use advanced search composable
const {
  searchQuery,
  searchResults,
  isLoading,
  filters,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  categories,
  brands,
  priceRange,
  hasFilters,
  activeFiltersCount,
  performSearch,
  applyFilters,
  clearFilters,
  loadFilterData,
  initializeFromRoute
} = useAdvancedSearch()

// Don't use useAppData since it doesn't have formatPrice

// Computed properties
const hasActiveFilters = computed(() => hasFilters.value)

const breadcrumbItems = computed(() => [
  { name: 'Trang chủ', path: '/' },
  { name: 'Sản phẩm', path: '/products' }
])

// Methods
const updateSort = (sortBy: string, sortOrder: string) => {
  applyFilters({ sortBy, sortOrder } as FilterType)
}

const getSortLabel = (sortBy?: string, sortOrder?: string) => {
  if (!sortBy) return 'Sắp xếp'

  const sortMap: Record<string, Record<string, string>> = {
    name: { asc: 'Tên A-Z', desc: 'Tên Z-A' },
    price: { asc: 'Giá thấp đến cao', desc: 'Giá cao đến thấp' },
    created_at: { desc: 'Mới nhất', asc: 'Cũ nhất' }
  }

  return sortMap[sortBy]?.[sortOrder || 'asc'] || 'Sắp xếp'
}

const getCategoryName = (categorySlug?: string) => {
  if (!categorySlug) return ''
  const category = categories.value.find(c => c.slug === categorySlug)
  return category?.name || categorySlug
}

const getBrandName = (brandSlug?: string) => {
  if (!brandSlug) return ''
  const brand = brands.value.find(b => b.slug === brandSlug)
  return brand?.name || brandSlug
}

const formatPriceRange = (min?: number, max?: number) => {
  if (min && max) {
    return `${formatPrice(min)} - ${formatPrice(max)}`
  } else if (min) {
    return `Từ ${formatPrice(min)}`
  } else if (max) {
    return `Đến ${formatPrice(max)}`
  }
  return ''
}

const clearFilter = (filterKey: string) => {
  const newFilters = { ...filters.value }
  delete newFilters[filterKey as keyof FilterType]
  applyFilters(newFilters)
}

const clearPriceFilter = () => {
  const newFilters = { ...filters.value }
  delete newFilters.minPrice
  delete newFilters.maxPrice
  applyFilters(newFilters)
}

const clearAllFilters = () => {
  clearFilters()
}

const applyFiltersAndClose = (newFilters: FilterType) => {
  applyFilters(newFilters)
  // Close offcanvas
  const offcanvas = document.getElementById('filtersOffcanvas')
  if (offcanvas) {
    const bsOffcanvas = new (window as any).bootstrap.Offcanvas(offcanvas)
    bsOffcanvas.hide()
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    const query = { ...route.query }
    if (page === 1) {
      const { page: _, ...rest } = query
      router.push({ query: rest })
    } else {
      query.page = page.toString()
      router.push({ query })
    }
  }
}

const getVisiblePages = () => {
  const current = currentPage.value
  const total = totalPages.value
  const delta = 2
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= delta + 1) {
      for (let i = 1; i <= delta + 3; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - delta) {
      pages.push(1)
      pages.push('...')
      for (let i = total - delta - 2; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - delta; i <= current + delta; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

// Watch for route changes
watch(() => route.query, (newQuery) => {
  initializeFromRoute()
}, { immediate: true })

// Initialize on mount
onMounted(async () => {
  await loadFilterData()
  initializeFromRoute()
})
</script>

<style scoped>
.search-results-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.filters-sidebar {
  position: sticky;
  top: 120px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.search-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.search-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.search-subtitle {
  font-size: 1rem;
  margin-bottom: 0;
}

.active-filters {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  gap: 0.25rem;
}

.btn-close-filter {
  background: none;
  border: none;
  color: #1565c0;
  padding: 0;
  margin-left: 0.25rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-close-filter:hover {
  color: #0d47a1;
}

.products-grid {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.loading-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.product-skeleton {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.skeleton-image {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 1rem;
}

.skeleton-line {
  height: 16px;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.no-results {
  background: white;
  border-radius: 12px;
  padding: 4rem 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.no-results-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.no-results-message {
  font-size: 1.1rem;
  line-height: 1.6;
}

.pagination-nav {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.pagination-lg .page-link {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.offcanvas-body {
  padding: 0;
}

@media (max-width: 768px) {
  .search-header {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .search-title {
    font-size: 1.5rem;
  }

  .products-grid,
  .loading-container,
  .no-results,
  .pagination-nav {
    padding: 1rem;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    border-radius: 8px;
  }

  .filter-chip {
    font-size: 0.8rem;
    padding: 0.375rem 0.625rem;
  }

  .no-results {
    padding: 2rem 1rem;
  }
}
</style>
