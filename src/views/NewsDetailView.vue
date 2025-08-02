<template>
  <UserLayout>
    <div class="news-detail-view">
      <div class="container mt-4">
        <Breadcrumb :items="breadcrumbItems" />

        <LoadingSpinner v-if="loading" />

        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div v-else-if="article" class="row">
          <div class="col-lg-8">
            <!-- Article Header -->
            <div class="article-header mb-4">
              <span v-if="article.category" class="badge bg-primary mb-2">
                {{ article.category }}
              </span>
              <h1 class="display-4 mb-3">{{ article.title }}</h1>

              <div class="article-meta d-flex flex-wrap align-items-center mb-4">
                <div class="me-4">
                  <i class="fas fa-calendar-alt me-1"></i>
                  {{ formatDate(article.created_at) }}
                </div>
                <div v-if="article.read_time" class="me-4">
                  <i class="fas fa-clock me-1"></i>
                  {{ article.read_time }} phút đọc
                </div>
                <div v-if="article.views" class="me-4">
                  <i class="fas fa-eye me-1"></i>
                  {{ article.views }} lượt xem
                </div>
                <div v-if="article.author" class="me-4">
                  <i class="fas fa-user me-1"></i>
                  {{ article.author }}
                </div>
              </div>

              <!-- Social Share -->
              <div class="social-share mb-4">
                <span class="me-3">Chia sẻ:</span>
                <button @click="shareOnFacebook" class="btn btn-primary btn-sm me-2">
                  <i class="fab fa-facebook-f me-1"></i>
                  Facebook
                </button>
                <button @click="shareOnTwitter" class="btn btn-info btn-sm me-2">
                  <i class="fab fa-twitter me-1"></i>
                  Twitter
                </button>
                <button @click="copyLink" class="btn btn-secondary btn-sm">
                  <i class="fas fa-link me-1"></i>
                  Sao chép
                </button>
              </div>
            </div>

            <!-- Featured Image -->
            <div v-if="article.thumbnail" class="featured-image mb-4 rounded-3 overflow-hidden">
              <img :src="article.thumbnail" :alt="article.title" class="img-fluid">
            </div>

            <!-- Article Content -->
            <div class="article-content mb-5">
              <!-- If content is available, use it, otherwise use description -->
              <div v-if="article.content" v-html="article.content"></div>
              <div v-else>
                <p>{{ article.description }}</p>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="article.tags && article.tags.length" class="article-tags mb-4">
              <h6>Tags:</h6>
              <span v-for="tag in article.tags" :key="tag" class="badge bg-light text-dark me-2">
                {{ tag }}
              </span>
            </div>

            <!-- Related Articles -->
            <div v-if="relatedArticles.length" class="related-articles mt-5">
              <h4 class="mb-4">Bài viết liên quan</h4>
              <div class="row">
                <div v-for="related in relatedArticles" :key="related.id" class="col-md-6 mb-3">
                  <div class="card h-100 shadow-sm">
                    <img :src="related.thumbnail || related.image_url || '/placeholder-news.jpg'" :alt="related.title" class="card-img-top">
                    <div class="card-body">
                      <h6 class="card-title">{{ related.title }}</h6>
                      <p class="card-text">{{ related.description || related.excerpt }}</p>
                      <router-link :to="`/news/${related.id}`" class="btn btn-outline-primary btn-sm">
                        Đọc thêm
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="sidebar">
              <!-- Recent Articles -->
              <div class="card mb-4 shadow-sm">
                <div class="card-header bg-white">
                  <h5 class="mb-0">Đọc nhiều nhất</h5>
                </div>
                <div class="card-body">
                  <div v-for="recent in recentArticles" :key="recent.id" class="d-flex mb-3">
                    <img :src="recent.thumbnail || recent.image_url || '/placeholder-news.jpg'" :alt="recent.title" class="recent-thumb me-3">
                    <div>
                      <h6 class="mb-1">
                        <router-link :to="`/news/${recent.id}`" class="text-decoration-none text-dark">
                          {{ recent.title }}
                        </router-link>
                      </h6>
                      <small class="text-muted">
                        {{ formatDate(recent.created_at) }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>





            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
          <h3>Không tìm thấy bài viết</h3>
          <p class="text-muted">Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <router-link to="/news" class="btn btn-primary">
            Quay lại trang tin tức
          </router-link>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { newsApi } from '../services/api'
import type { News } from '../types'
import { formatDate } from '../utils'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import UserLayout from '@/components/layouts/UserLayout.vue'

const route = useRoute()

const article = ref<News | null>(null)
const relatedArticles = ref<News[]>([])
const recentArticles = ref<News[]>([])
const categories = ref<Array<{ name: string; count: number }>>([])
const loading = ref(false)
const error = ref<string | null>(null)
const newsletterEmail = ref('')

const breadcrumbItems = computed(() => [
  { name: 'Trang chủ', path: '/' },
  { name: 'Tin tức', path: '/news' },
  { name: article.value?.title || 'Bài viết', path: `/news/${route.params.id}` }
])

const fetchArticle = async () => {
  try {
    loading.value = true
    error.value = null

    const articleId = parseInt(route.params.id as string)
    console.log('🔄 Đang tải bài viết:', articleId)
    const response = await newsApi.getNewsById(articleId)
    console.log('📰 API Response:', response)
    article.value = response.data // Extract data from API response wrapper
    console.log('✅ Bài viết đã tải:', article.value.title)

    // Fetch related articles
    if (article.value.category) {
      try {
        const relatedResponse = await newsApi.getNews({
          category: article.value.category,
          per_page: 4,
          exclude: articleId
        })
        relatedArticles.value = relatedResponse.data.slice(0, 2)
      } catch (err) {
        console.error('Không thể tải bài viết liên quan:', err)
      }
    }
  } catch (err: any) {
    console.error('❌ Không thể tải bài viết:', err)
    error.value = err.response?.data?.message || 'Không thể tải bài viết'
  } finally {
    loading.value = false
  }
}

const fetchSidebarData = async () => {
  try {
    // Fetch recent articles
    const recentResponse = await newsApi.getNews({ per_page: 5 })
    recentArticles.value = recentResponse.data

    // Fetch categories
    const categoriesResponse = await newsApi.getCategories()
    categories.value = categoriesResponse.data.map((cat: any) => ({
      name: cat.name || cat,
      count: cat.count || 0
    }))
  } catch (err) {
    console.error('Không thể tải dữ liệu sidebar:', err)
  }
}

const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(article.value?.title || '')
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank')
}

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(article.value?.title || '')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('Đã sao chép liên kết vào clipboard!')
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = window.location.href
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Đã sao chép liên kết vào clipboard!')
  }
}

const subscribeNewsletter = async () => {
  try {
    // Here you would typically call an API to subscribe the user
    // await newsApi.subscribeNewsletter(newsletterEmail.value)
    alert('Cảm ơn bạn đã đăng ký nhận tin!');
    newsletterEmail.value = ''
  } catch (err) {
    alert('Đăng ký không thành công. Vui lòng thử lại sau.');
  }
}

onMounted(() => {
  fetchArticle()
  fetchSidebarData()
})
</script>

<style scoped>
.news-detail-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.article-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.article-meta {
  color: #6c757d;
  font-size: 0.9rem;
}

.social-share {
  padding-bottom: 1rem;
}

.featured-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-image:hover img {
  transform: scale(1.05);
}

.article-content {
  line-height: 1.8;
  font-size: 1.1rem;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5,
.article-content h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #343a40;
}

.article-content p {
  margin-bottom: 1.5rem;
  color: #495057;
}

.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 1rem 0;
}

.article-tags .badge {
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
}

.sidebar .card {
  border: none;
}

.recent-thumb {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.related-articles .card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-articles .card:hover .card-img-top {
  transform: scale(1.05);
}

.card {
  border: none;
}

.card-header {
  background-color: #fff;
  border-bottom: none;
}

/* Darker text for better readability */
h5.mb-0,
.card-title,
.card-text {
  color: #343a40;
}

/* Button styles for consistency */
.btn-primary,
.btn-info,
.btn-secondary {
  color: #fff;
}

/* Adjustments for smaller screens */
@media (max-width: 768px) {
  .display-4 {
    font-size: 2rem;
  }

  .article-content {
    font-size: 1rem;
  }

  .social-share {
    text-align: left;
  }

  .social-share .btn {
    margin-bottom: 0.5rem;
  }
}
</style>
