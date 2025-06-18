<template>
  <div class="search-page">
    <!-- Search Header -->
    <section class="search-header">
      <div class="container-fluid px-4">
        <div class="search-content">
          <h1 class="search-title">Tìm kiếm sản phẩm</h1>
          <div class="search-form">
            <div class="input-group">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Nhập từ khóa tìm kiếm..."
                @keypress.enter="performSearch"
              />
              <button class="btn btn-primary" type="button" @click="performSearch">
                <i class="bi bi-search"></i>
                Tìm kiếm
              </button>
            </div>
          </div>
          <div v-if="currentQuery" class="search-info mt-3">
            <p>Kết quả tìm kiếm cho: <strong>"{{ currentQuery }}"</strong></p>
            <p class="text-muted">Tìm thấy {{ searchResults.length }} sản phẩm</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Results -->
    <section class="search-results">
      <div class="container-fluid px-4">
        <LoadingSpinner v-if="loading" text="Đang tìm kiếm..." />
        
        <div v-else-if="currentQuery && searchResults.length === 0" class="no-results">
          <div class="text-center py-5">
            <i class="bi bi-search fs-1 text-muted"></i>
            <h3 class="mt-3">Không tìm thấy sản phẩm nào</h3>
            <p class="text-muted">Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả</p>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsApi } from '@/services/api'
import type { Product } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const currentQuery = ref('')
const searchResults = ref<Product[]>([])
const loading = ref(false)

const popularKeywords = [
  'Balo du lịch',
  'Vali kéo',
  'Túi xách',
  'Balo laptop',
  'Túi đeo chéo',
  'Vali size 20',
  'Balo thể thao'
]

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  currentQuery.value = searchQuery.value
  
  try {
    const response = await productsApi.searchProducts(searchQuery.value)
    searchResults.value = response.data || []
    
    // Update URL with search query
    router.push({ 
      name: 'search', 
      query: { q: searchQuery.value } 
    })
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const searchByKeyword = (keyword: string) => {
  searchQuery.value = keyword
  performSearch()
}

// Initialize search from URL query
onMounted(() => {
  const query = route.query.q as string
  if (query) {
    searchQuery.value = query
    performSearch()
  }
})

// Watch for route changes
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && newQuery !== currentQuery.value) {
      searchQuery.value = newQuery as string
      performSearch()
    }
  }
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
</style>
