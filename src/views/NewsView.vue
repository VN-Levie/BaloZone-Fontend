<template>
  <UserLayout>
    <div class="news-view">
      <div class="container mt-4">
        <Breadcrumb :items="breadcrumbItems" />

        <div class="row">
          <div class="col-12">
            <h1 class="mb-4">News & Updates</h1>

            <LoadingSpinner v-if="loading" />

            <div v-else-if="error" class="alert alert-danger">
              {{ error }}
            </div>

            <div v-else>
              <!-- Featured Article -->
              <div v-if="featuredArticle" class="featured-article mb-5">
                <div class="card">
                  <div class="row g-0">
                    <div class="col-md-6">
                      <img :src="featuredArticle.thumbnail || featuredArticle.image_url || '/placeholder-news.jpg'" :alt="featuredArticle.title" class="img-fluid h-100 object-cover">
                    </div>
                    <div class="col-md-6">
                      <div class="card-body h-100 d-flex flex-column">
                        <span class="badge bg-primary mb-2 align-self-start">Nổi bật</span>
                        <h3 class="card-title">{{ featuredArticle.title }}</h3>
                        <p class="card-text flex-grow-1">{{ featuredArticle.description || featuredArticle.excerpt }}</p>
                        <div class="mt-auto">
                          <small class="text-muted">
                            {{ formatDate(featuredArticle.created_at) }}<span v-if="featuredArticle.read_time"> • {{ featuredArticle.read_time }} min read</span>
                          </small>
                          <div class="mt-2">
                            <router-link :to="`/news/${featuredArticle.id}`" class="btn btn-primary">
                              <i class="fas fa-arrow-right"></i> Xem chi tiết
                            </router-link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Articles Grid -->
              <div class="row">
                <div v-for="article in articles" :key="article.id" class="col-lg-4 col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="position-relative">
                      <img :src="getImageUrl(article.thumbnail) || getImageUrl(article.image_url) || '/placeholder-news.jpg'" :alt="article.title" class="card-img-top">
                      <span v-if="article.category" class="badge bg-secondary position-absolute top-0 start-0 m-2">
                        {{ article.category }}
                      </span>
                    </div>

                    <div class="card-body d-flex flex-column">
                      <h5 class="card-title">{{ article.title }}</h5>
                      <p class="card-text flex-grow-1">{{ article.description || article.excerpt }}</p>

                      <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <small class="text-muted">
                            {{ formatDate(article.created_at) }}
                          </small>
                          <small v-if="article.read_time" class="text-muted">
                            {{ article.read_time }} phút đọc
                          </small>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                          <small class="text-muted">
                            <i class="fas fa-eye me-1"></i>
                            {{ article.views || 0 }} lượt xem
                          </small>

                          <router-link :to="`/news/${article.id}`" class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-arrow-right"></i> Xem chi tiết
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="articles.length === 0" class="text-center py-5">
                <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                <h3>No articles found</h3>
                <p class="text-muted">
                  <span v-if="searchQuery">No articles match your search criteria.</span>
                  <span v-else>No articles available at the moment.</span>
                </p>
              </div>

              <!-- Pagination -->
              <nav v-if="totalPages > 1" aria-label="News pagination">
                <ul class="pagination justify-content-center">
                  <li :class="['page-item', { disabled: currentPage <= 1 }]">
                    <button @click="changePage(currentPage - 1)" class="page-link" :disabled="currentPage <= 1">
                      Previous
                    </button>
                  </li>

                  <li v-for="page in visiblePages" :key="page" :class="['page-item', { active: page === currentPage }]">
                    <button @click="changePage(page)" class="page-link">
                      {{ page }}
                    </button>
                  </li>

                  <li :class="['page-item', { disabled: currentPage >= totalPages }]">
                    <button @click="changePage(currentPage + 1)" class="page-link" :disabled="currentPage >= totalPages">
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { newsApi } from '../services/api'
import type { News } from '../types'
import { formatDate } from '../utils'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import UserLayout from '@/components/layouts/UserLayout.vue'
import { getImageUrl, formatPrice as formatCurrency } from '@/utils'
const articles = ref<News[]>([])
const featuredArticle = ref<News | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const selectedCategory = ref('')
const categories = ref<string[]>([])

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'News', path: '/news' }
]

const visiblePages = computed(() => {
  const range = 2
  const start = Math.max(1, currentPage.value - range)
  const end = Math.min(totalPages.value, currentPage.value + range)

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const fetchArticles = async () => {
  try {
    loading.value = true
    error.value = null

    const params = {
      page: currentPage.value,
      search: searchQuery.value || undefined,
      category: selectedCategory.value || undefined,
      per_page: 9
    }

    const response = await newsApi.getNews(params)
    articles.value = response.data
    totalPages.value = response.last_page

    // Set featured article (first article if on first page and no filters)
    if (currentPage.value === 1 && !searchQuery.value && !selectedCategory.value && articles.value.length > 0) {
      featuredArticle.value = articles.value[0]
      articles.value = articles.value.slice(1) // Remove featured article from list
    } else {
      featuredArticle.value = null
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load articles'
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await newsApi.getCategories()
    categories.value = response.data.map((cat: any) => cat.name || cat)
  } catch (err) {
    console.error('Failed to load categories:', err)
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchArticles()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchArticles()
  }, 300)
}

// Watch category changes
watch(selectedCategory, () => {
  currentPage.value = 1
  fetchArticles()
})

onMounted(() => {
  fetchArticles()
  fetchCategories()
})
</script>

<style scoped>
.news-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.featured-article .card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.featured-article .object-cover {
  object-fit: cover;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.featured-article .card-img-top {
  height: 300px;
}

.badge {
  font-size: 0.75rem;
}

.btn {
  transition: all 0.2s ease-in-out;
}

.pagination {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .featured-article .row {
    flex-direction: column-reverse;
  }

  .featured-article .card-img-top {
    height: 200px;
  }
}
</style>
