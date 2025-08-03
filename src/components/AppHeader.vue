<template>
  <header class="app-header">
    <!-- <nav class="navbar navbar-expand-lg navbar-light navbar-custom fixed-top"> -->
    <nav class="navbar navbar-expand-lg navbar-light navbar-custom fixed-top">
      <div class="container-fluid px-4">
        <router-link to="/" class="navbar-brand brand-logo">
          <img src="/favicon.ico" alt="BaloZone" class="logo-img" />
          <span class="brand-text">BaloZone</span>
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Search bar -->
          <div class="navbar-search mx-auto">
            <SimpleSearchBar
              v-model="headerSearchQuery"
              :is-loading="isLoadingSuggestions"
              placeholder="Tìm kiếm sản phẩm..."
              @search="handleHeaderSearch"
              @clear="handleClearSearch"
              class="header-search-bar"
            />
          </div>

          <!-- Right side navigation -->
          <ul class="navbar-nav ms-auto">
            <!-- Cart -->
            <li class="nav-item nav-icon-item">
              <router-link to="/cart" class="nav-link nav-icon-link">
                <i class="bi bi-bag"></i>
                <span v-if="cartItemsCount > 0" class="badge">{{ cartItemsCount }}</span>
              </router-link>
            </li>

            <!-- Wishlist -->
            <li class="nav-item nav-icon-item">
              <router-link to="/wishlist" class="nav-link nav-icon-link">
                <i class="bi bi-heart"></i>
                <span v-if="wishlistCount > 0" class="badge">{{ wishlistCount }}</span>
              </router-link>
            </li>

            <!-- User menu -->
            <li v-if="!isLoggedIn" class="nav-item">
              <router-link to="/login" class="nav-link">Đăng nhập</router-link>
            </li>

            <li v-else class="nav-item dropdown user-dropdown">
              <button
                class="btn dropdown-toggle user-btn"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle"></i>
                <span class="user-name">{{ user?.name || 'User' }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-header">
                  <div class="user-info-dropdown">
                    <strong>{{ user?.name || 'User' }}</strong>
                    <small class="text-muted d-block">{{ user?.email }}</small>
                    <div class="user-roles-dropdown" v-if="user?.roles && user.roles.length > 0">
                      <RoleBadge
                        v-for="role in user.roles"
                        :key="role.id"
                        :role="role"
                        size="small"
                      />
                    </div>
                  </div>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <router-link to="/profile" class="dropdown-item">
                    <i class="bi bi-person"></i>
                    Tài khoản
                  </router-link>
                </li>
                <li>
                  <router-link to="/orders" class="dropdown-item">
                    <i class="bi bi-box"></i>
                    Đơn hàng
                  </router-link>
                </li>
                <li v-if="isAdmin || isContributor">
                  <hr class="dropdown-divider">
                </li>
                <li v-if="isAdmin || isContributor">
                  <a href="#" class="dropdown-item" @click.prevent="goToAdmin">
                    <i class="bi bi-gear"></i>
                    Quản trị
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item" @click="handleLogout">
                    <i class="bi bi-box-arrow-right"></i>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Categories navigation -->
    <nav class="categories-nav">
      <div class="container-fluid px-4">
        <!-- Loading state -->
        <div v-if="loadingCategories" class="categories-loading">
          <div class="loading-placeholder">
            <div class="placeholder-item"></div>
            <div class="placeholder-item"></div>
            <div class="placeholder-item"></div>
            <div class="placeholder-item"></div>
          </div>
        </div>

        <!-- Categories list -->
        <ul v-else class="categories-list">
          <!-- Dynamic categories from API -->
          <li v-for="category in categories" :key="category.id">
            <router-link :to="`/category/${category.slug}`">
              {{ category.name }}
              <span v-if="category.products_count && category.products_count > 0" class="category-count">
                ({{ category.products_count }})
              </span>
            </router-link>
          </li>

          <!-- Static navigation items -->
          <li>
            <router-link to="/sale-campaigns" class="sale-link">
              🔥 Khuyến Mãi
            </router-link>
          </li>
          <li><router-link to="/news">Tin Tức</router-link></li>
          <li><router-link to="/contact">Liên Hệ</router-link></li>
          <li><router-link to="/about">Giới Thiệu</router-link></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCart } from '@/composables/useCart'
import { useWishlist } from '@/composables/useWishlist'
import { useToast } from '@/composables/useToast'
import { useAdvancedSearch } from '@/composables/useAdvancedSearch'
import { categoriesApi } from '@/services/api'
import RoleBadge from './RoleBadge.vue'
import SimpleSearchBar from '@/components/SimpleSearchBar.vue'
import type { Category } from '@/types'

const router = useRouter()
const auth = useAuth()
const { user, isLoggedIn, isAdmin, isContributor, logout } = toRefs(auth)
const { cartItemsCount } = useCart()
const { wishlistCount } = useWishlist()
const { showLogoutSuccess } = useToast()

// Use advanced search for header
const {
  searchQuery: headerSearchQuery,
  suggestions: headerSuggestions,
  searchHistory: headerSearchHistory,
  isLoadingSuggestions,
  loadSearchHistory,
  generateSuggestions,
  loadFilterData
} = useAdvancedSearch()

const categories = ref<Category[]>([])
const loadingCategories = ref(false)

// Header search function
const handleHeaderSearch = (query: string) => {
  if (query.trim()) {
    router.push({ name: 'search', query: { q: query.trim() } })
    headerSearchQuery.value = ''
  }
}

// Handle clear search
const handleClearSearch = () => {
  headerSearchQuery.value = ''
}

// Handle suggestion selection
const handleSuggestionSelect = (suggestion: any) => {
  switch (suggestion.type) {
    case 'category':
      const category = categories.value.find(c => c.name === suggestion.text)
      if (category) {
        router.push(`/category/${category.slug}`)
      }
      break
    case 'brand':
      router.push({ name: 'search', query: { q: suggestion.text, brand: suggestion.text } })
      break
    case 'product':
    default:
      router.push({ name: 'search', query: { q: suggestion.text } })
      break
  }
  headerSearchQuery.value = ''
}

const handleLogout = async () => {
  await logout.value()
  showLogoutSuccess()
  router.push('/')
}

const goToAdmin = () => {
  router.push('/admin')
}

const fetchCategories = async () => {
  try {
    loadingCategories.value = true
    console.log('🔄 Loading categories from API...')
    const response = await categoriesApi.getCategories()
    categories.value = response.data
    console.log('✅ Categories loaded successfully:', categories.value.length, 'categories')
    console.log('📋 Categories:', categories.value.map(c => `${c.name} (${c.products_count})`))
  } catch (error) {
    console.error('❌ Failed to load categories:', error)
    // Fallback to default categories if API fails
    categories.value = [

    ] as Category[]
    console.log('⚠️ Using fallback categories')
  } finally {
    loadingCategories.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await loadSearchHistory()
  // Load filter data for suggestions
  await loadFilterData()
})
</script>

<style scoped>
.navbar-custom {
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0;
}

.brand-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333 !important;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007bff;
}

.navbar-search {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-btn:hover {
  background: #0056b3;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.suggestions-header {
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-item i {
  color: #6c757d;
  font-size: 0.9rem;
}

.suggestion-item span {
  color: #2c3e50;
  font-size: 0.95rem;
}

.nav-icon-item {
  margin: 0 0.5rem;
}

.nav-icon-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-icon-link:hover {
  background: #f8f9fa;
  color: #007bff;
}

.nav-icon-link i {
  font-size: 1.25rem;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-dropdown .user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #333;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.user-btn:hover {
  background: #f8f9fa;
}

.user-btn i {
  font-size: 1.5rem;
}

.user-name {
  font-weight: 500;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.categories-nav {
  margin-top: 100px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 0.75rem 0;
}

.categories-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  justify-content: center;
}

.categories-list a {
  color: #6c757d;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  position: relative;
}

.categories-list a:hover,
.categories-list a.router-link-active {
  color: #007bff;
}

.categories-list a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #007bff;
}

.category-count {
  font-size: 0.8rem;
  color: #6c757d;
  margin-left: 0.25rem;
  font-weight: 400;
}

.categories-loading {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.loading-placeholder {
  display: flex;
  gap: 2rem;
}

.placeholder-item {
  width: 80px;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.user-info-dropdown {
  padding: 0.5rem 0;
  text-align: center;
}

.user-info-dropdown strong {
  font-size: 0.9rem;
  color: #333;
}

.user-info-dropdown small {
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.user-roles-dropdown {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
  margin-top: 0.5rem;
}

/* Sale link styling */
.sale-link {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24) !important;
  color: white !important;
  font-weight: 600 !important;
  border-radius: 20px !important;
  padding: 8px 16px !important;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3) !important;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3) !important;
  animation: pulse-sale 2s infinite !important;
}

.sale-link:hover {
  background: linear-gradient(45deg, #ff5252, #d84315) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4) !important;
}

@keyframes pulse-sale {
  0% { box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3); }
  50% { box-shadow: 0 4px 16px rgba(255, 107, 107, 0.5); }
  100% { box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3); }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 991px) {
  .navbar-search {
    margin: 1rem 0;
    max-width: none;
  }

  .categories-list {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .loading-placeholder {
    gap: 1rem;
  }
}

@media (max-width: 576px) {
  .categories-list {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.5rem;
  }

  .categories-list a {
    white-space: nowrap;
  }

  .brand-text {
    font-size: 1.25rem;
  }

  .navbar-search {
    margin: 0.5rem 0;
  }

  .search-input {
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  .search-btn {
    width: 35px;
    height: 35px;
  }

  .nav-icon-link {
    width: 35px;
    height: 35px;
  }

  .loading-placeholder {
    gap: 0.5rem;
  }

  .placeholder-item {
    width: 60px;
  }
}

/* Header search bar styles */
.header-search-bar {
  max-width: 400px;
  width: 100%;
}

.header-search-bar .enhanced-search-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-search-bar .search-input {
  background: transparent;
  border: none;
  color: #333;
  font-size: 0.95rem;
}

.header-search-bar .search-input::placeholder {
  color: #666;
}

.header-search-bar .search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.header-search-bar .search-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.header-search-bar .suggestions-dropdown {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
}

@media (max-width: 991px) {
  .header-search-bar {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .header-search-bar {
    max-width: 250px;
  }

  .header-search-bar .search-input {
    font-size: 0.9rem;
  }
}
</style>
