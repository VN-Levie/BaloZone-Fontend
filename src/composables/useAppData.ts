import { ref, computed } from 'vue'
import type { Product, Category, Brand, News } from '@/types'
import { productsApi, categoriesApi, brandsApi, newsApi } from '@/services/api'

// Global state
const featuredProducts = ref<Product[]>([])
const categories = ref<Category[]>([])
const brands = ref<Brand[]>([])
const latestNews = ref<News[]>([])
const loading = ref({
  products: false,
  categories: false,
  brands: false,
  news: false
})

export const useAppData = () => {
  // Load featured products
  const loadFeaturedProducts = async () => {
    try {
      loading.value.products = true
      const response = await productsApi.getFeaturedProducts()
      featuredProducts.value = response.data
    } catch (error) {
      console.error('Failed to load featured products:', error)
      // Keep using mock data as fallback
    } finally {
      loading.value.products = false
    }
  }

  // Load categories
  const loadCategories = async () => {
    try {
      loading.value.categories = true
      const response = await categoriesApi.getCategories()
      categories.value = response.data
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      loading.value.categories = false
    }
  }

  // Load brands
  const loadBrands = async () => {
    try {
      loading.value.brands = true
      const response = await brandsApi.getActiveBrands()
      brands.value = response.data
    } catch (error) {
      console.error('Failed to load brands:', error)
    } finally {
      loading.value.brands = false
    }
  }

  // Load latest news
  const loadLatestNews = async () => {
    try {
      loading.value.news = true
      const response = await newsApi.getLatestNews()
      latestNews.value = response.data
    } catch (error) {
      console.error('Failed to load news:', error)
    } finally {
      loading.value.news = false
    }
  }

  // Load all homepage data
  const loadHomepageData = async () => {
    await Promise.all([
      loadFeaturedProducts(),
      loadCategories(),
      loadBrands(),
      loadLatestNews()
    ])
  }

  // Computed properties
  const isLoading = computed(() => 
    Object.values(loading.value).some(isLoading => isLoading)
  )

  return {
    // State
    featuredProducts: computed(() => featuredProducts.value),
    categories: computed(() => categories.value),
    brands: computed(() => brands.value),
    latestNews: computed(() => latestNews.value),
    loading: computed(() => loading.value),
    isLoading,

    // Actions
    loadFeaturedProducts,
    loadCategories,
    loadBrands,
    loadLatestNews,
    loadHomepageData
  }
}
