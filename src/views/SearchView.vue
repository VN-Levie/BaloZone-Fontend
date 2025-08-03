<template>
    <UserLayout>
        <div class="search-page">
            <!-- Header với search bar -->
            <div class="search-header bg-light py-4">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <h1 class="text-center mb-4">Tìm kiếm sản phẩm</h1>
                            <div class="search-bar">
                                <div class="input-group input-group-lg">
                                    <input v-model="searchQuery" type="text" class="form-control" placeholder="Nhập tên sản phẩm để tìm kiếm..." @keydown.enter="handleSearch" @input="handleSearchInput" />
                                    <button class="btn btn-primary" type="button" @click="handleSearch" :disabled="!searchQuery.trim() || isLoading">
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="bi bi-search me-2"></i>
                                        {{ isLoading ? 'Đang tìm...' : 'Tìm kiếm' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Kết quả tìm kiếm -->
            <div class="search-results py-4">
                <div class="container">
                    <!-- Thông tin kết quả -->
                    <div v-if="hasSearched" class="search-info mb-4">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <h4 class="mb-0">
                                    Kết quả cho: "<span class="text-primary">{{ currentSearchQuery }}</span>"
                                </h4>
                                <p class="text-muted mb-0">Tìm thấy {{ totalResults }} sản phẩm</p>
                            </div>
                            <div class="col-md-6 text-md-end">
                                <div class="d-flex align-items-center justify-content-md-end gap-3">
                                    <!-- Sắp xếp -->
                                    <div class="dropdown">
                                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-sort-down me-2"></i>
                                            {{ getSortLabel() }}
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="sortDropdown">
                                            <li>
                                                <button class="dropdown-item" @click="updateSort('name', 'asc')" :class="{ active: sortBy === 'name' && sortOrder === 'asc' }">
                                                    Tên A-Z
                                                </button>
                                            </li>
                                            <li>
                                                <button class="dropdown-item" @click="updateSort('name', 'desc')" :class="{ active: sortBy === 'name' && sortOrder === 'desc' }">
                                                    Tên Z-A
                                                </button>
                                            </li>
                                            <li>
                                                <button class="dropdown-item" @click="updateSort('price', 'asc')" :class="{ active: sortBy === 'price' && sortOrder === 'asc' }">
                                                    Giá thấp đến cao
                                                </button>
                                            </li>
                                            <li>
                                                <button class="dropdown-item" @click="updateSort('price', 'desc')" :class="{ active: sortBy === 'price' && sortOrder === 'desc' }">
                                                    Giá cao đến thấp
                                                </button>
                                            </li>
                                            <li>
                                                <button class="dropdown-item" @click="updateSort('created_at', 'desc')" :class="{ active: sortBy === 'created_at' && sortOrder === 'desc' }">
                                                    Mới nhất
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Loading state -->
                    <div v-if="isLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                            <span class="visually-hidden">Đang tải...</span>
                        </div>
                        <p class="mt-3 text-muted">Đang tìm kiếm sản phẩm...</p>
                    </div>

                    <!-- No results -->
                    <div v-else-if="hasSearched && products.length === 0" class="text-center py-5">
                        <i class="bi bi-search display-1 text-muted"></i>
                        <h4 class="mt-3">Không tìm thấy sản phẩm nào</h4>
                        <p class="text-muted">Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả</p>
                        <button class="btn btn-primary" @click="clearSearch">
                            <i class="bi bi-arrow-clockwise me-2"></i>
                            Tìm kiếm lại
                        </button>
                    </div>

                    <!-- Products grid -->
                    <div v-else-if="products.length > 0" class="products-grid">
                        <div class="row">
                            <div v-for="product in products" :key="product.id" class="col-6 col-md-4 col-lg-3 mb-4">
                                <ProductCard :product="product" />
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
                            <nav aria-label="Search pagination">
                                <ul class="pagination">
                                    <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                                        <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1">
                                            <i class="bi bi-chevron-left"></i>
                                        </button>
                                    </li>

                                    <li v-for="page in paginationPages" :key="page" class="page-item" :class="{ active: page === currentPage, disabled: page === '...' }">
                                        <button v-if="page !== '...'" class="page-link" @click="goToPage(page as number)">
                                            {{ page }}
                                        </button>
                                        <span v-else class="page-link">{{ page }}</span>
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

                    <!-- Default state (no search performed) -->
                    <div v-else class="text-center py-5">
                        <i class="bi bi-search display-1 text-muted"></i>
                        <h4 class="mt-3">Tìm kiếm sản phẩm</h4>
                        <p class="text-muted">Nhập từ khóa vào ô tìm kiếm để bắt đầu</p>
                    </div>
                </div>
            </div>
        </div>
    </UserLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/types'
import UserLayout from '@/components/layouts/UserLayout.vue'

const route = useRoute()
const router = useRouter()
const { showError } = useToast()

// Reactive state
const searchQuery = ref('')
const currentSearchQuery = ref('')
const products = ref<Product[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalResults = ref(0)
const perPage = ref(12)

// Sorting
const sortBy = ref<'name' | 'price' | 'created_at'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Computed
const paginationPages = computed(() => {
    const pages: (number | string)[] = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
        // Show all pages if total <= 7
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
    } else {
        // Always show first page
        pages.push(1)

        if (current > 4) {
            pages.push('...')
        }

        // Show pages around current page
        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (current < total - 3) {
            pages.push('...')
        }

        // Always show last page
        if (total > 1) {
            pages.push(total)
        }
    }

    return pages
})

// Methods
const getSortLabel = () => {
    const sortMap: Record<string, Record<string, string>> = {
        name: { asc: 'Tên A-Z', desc: 'Tên Z-A' },
        price: { asc: 'Giá thấp đến cao', desc: 'Giá cao đến thấp' },
        created_at: { desc: 'Mới nhất', asc: 'Cũ nhất' }
    }
    return sortMap[sortBy.value]?.[sortOrder.value] || 'Sắp xếp'
}

const updateSort = (newSortBy: string, newSortOrder: string) => {
    sortBy.value = newSortBy as 'name' | 'price' | 'created_at'
    sortOrder.value = newSortOrder as 'asc' | 'desc'

    // Update URL
    const query = { ...route.query }
    query.sort_by = newSortBy
    query.sort_order = newSortOrder
    router.replace({ query })

    // Re-search with new sort
    if (hasSearched.value) {
        performSearch(currentSearchQuery.value, 1)
    }
}

const handleSearch = () => {
    const query = searchQuery.value.trim()
    if (!query) return

    performSearch(query, 1)
}

const handleSearchInput = () => {
    // Optional: implement real-time search or suggestions here
    // For now, just debounce search if needed
}

const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return

    try {
        isLoading.value = true
        currentSearchQuery.value = query
        currentPage.value = page
        hasSearched.value = true

        const response = await productsApi.getProducts({
            search: query,
            page: page,
            per_page: perPage.value,
            sort_by: sortBy.value,
            sort_order: sortOrder.value
        })

        if (response.success && response.data) {
            products.value = response.data.data || []
            totalResults.value = response.data.total || 0
            totalPages.value = response.data.last_page || 1
            currentPage.value = response.data.current_page || 1
        } else {
            products.value = []
            totalResults.value = 0
            totalPages.value = 1
        }

        // Update URL
        const query_params = {
            q: query,
            page: page.toString(),
            sort_by: sortBy.value,
            sort_order: sortOrder.value
        }
        router.replace({ query: query_params })

    } catch (error) {
        console.error('Search error:', error)
        showError('Lỗi tìm kiếm', 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.')
        products.value = []
        totalResults.value = 0
    } finally {
        isLoading.value = false
    }
}

const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value || page === currentPage.value) return

    if (hasSearched.value && currentSearchQuery.value) {
        performSearch(currentSearchQuery.value, page)
    }
}

const clearSearch = () => {
    searchQuery.value = ''
    currentSearchQuery.value = ''
    products.value = []
    hasSearched.value = false
    totalResults.value = 0
    currentPage.value = 1
    totalPages.value = 1

    // Clear URL params
    router.replace({ query: {} })
}

// Initialize from route params
const initializeFromRoute = () => {
    const q = route.query.q as string
    const page = parseInt(route.query.page as string) || 1
    const sort_by = route.query.sort_by as string || 'name'
    const sort_order = route.query.sort_order as string || 'asc'

    if (q) {
        searchQuery.value = q
        sortBy.value = sort_by as 'name' | 'price' | 'created_at'
        sortOrder.value = sort_order as 'asc' | 'desc'
        performSearch(q, page)
    }
}

// Watch route changes
watch(() => route.query, (newQuery) => {
    if (route.name === 'search') {
        const q = newQuery.q as string
        if (q && q !== currentSearchQuery.value) {
            searchQuery.value = q
            const page = parseInt(newQuery.page as string) || 1
            const sort_by = newQuery.sort_by as string || 'name'
            const sort_order = newQuery.sort_order as string || 'asc'

            sortBy.value = sort_by as 'name' | 'price' | 'created_at'
            sortOrder.value = sort_order as 'asc' | 'desc'
            performSearch(q, page)
        }
    }
}, { immediate: false })

onMounted(() => {
    initializeFromRoute()
})
</script>

<style scoped>
.search-page {
    min-height: 100vh;
    padding-top: 80px;
    /* Adjust for fixed header */
}

.search-header {
    border-bottom: 1px solid #e9ecef;
}

.search-bar .input-group-lg .form-control {
    border-radius: 0.5rem 0 0 0.5rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.search-bar .input-group-lg .form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.search-bar .input-group-lg .btn {
    border-radius: 0 0.5rem 0.5rem 0;
    padding: 0.75rem 1.5rem;
    transition: all 0.15s ease-in-out;
}

.search-bar .input-group-lg .btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}

.search-info h4 {
    color: #212529;
}

.search-info .text-primary {
    font-weight: 600;
}

.products-grid .row {
    margin: 0 -12px;
}

.products-grid .col-6,
.products-grid .col-md-4,
.products-grid .col-lg-3 {
    padding: 0 12px;
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
}

.products-grid .col-6:nth-child(1),
.products-grid .col-md-4:nth-child(1),
.products-grid .col-lg-3:nth-child(1) {
    animation-delay: 0.1s;
}

.products-grid .col-6:nth-child(2),
.products-grid .col-md-4:nth-child(2),
.products-grid .col-lg-3:nth-child(2) {
    animation-delay: 0.2s;
}

.products-grid .col-6:nth-child(3),
.products-grid .col-md-4:nth-child(3),
.products-grid .col-lg-3:nth-child(3) {
    animation-delay: 0.3s;
}

.products-grid .col-6:nth-child(4),
.products-grid .col-md-4:nth-child(4),
.products-grid .col-lg-3:nth-child(4) {
    animation-delay: 0.4s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.pagination .page-link {
    color: #6c757d;
    border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.pagination .page-link:hover {
    color: #0d6efd;
    background-color: #e9ecef;
    border-color: #dee2e6;
}

.dropdown-item.active {
    background-color: #0d6efd;
    color: white;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.dropdown-item.active:hover {
    background-color: #0b5ed7;
}

.text-center i.display-1 {
    font-size: 4rem;
    opacity: 0.5;
}

@media (max-width: 768px) {
    .search-page {
        padding-top: 70px;
    }

    .search-header .container {
        padding: 0 1rem;
    }

    .search-info .row {
        text-align: center;
    }

    .search-info .col-md-6:last-child {
        margin-top: 1rem;
    }
}
</style>
