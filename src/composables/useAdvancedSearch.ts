import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productsApi, categoriesApi, brandsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import type { Product, Category, Brand } from '@/types'

export interface SearchFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: 'name' | 'price' | 'rating' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchSuggestion {
  id: string
  text: string
  type: 'product' | 'category' | 'brand'
  icon: string
}

export function useAdvancedSearch() {
  const router = useRouter()
  const route = useRoute()
  const { showError } = useToast()

  // Reactive state
  const searchQuery = ref('')
  const searchResults = ref<Product[]>([])
  const suggestions = ref<SearchSuggestion[]>([])
  const searchHistory = ref<string[]>([])
  const isLoading = ref(false)
  const isLoadingSuggestions = ref(false)
  const showSuggestions = ref(false)
  
  // Filters
  const filters = ref<SearchFilters>({
    sortBy: 'name',
    sortOrder: 'asc'
  })
  
  const categories = ref<Category[]>([])
  const brands = ref<Brand[]>([])
  
  // Pagination
  const currentPage = ref(1)
  const totalPages = ref(1)
  const itemsPerPage = ref(12)
  const totalItems = ref(0)

  // Computed properties
  const hasResults = computed(() => searchResults.value.length > 0)
  const hasFilters = computed(() => {
    return !!(filters.value.category || 
             filters.value.brand || 
             filters.value.minPrice || 
             filters.value.maxPrice ||
             filters.value.minRating)
  })

  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.value.category) count++
    if (filters.value.brand) count++
    if (filters.value.minPrice) count++
    if (filters.value.maxPrice) count++
    if (filters.value.minRating) count++
    return count
  })

  const priceRange = computed(() => {
    if (searchResults.value.length === 0) return { min: 0, max: 0 }
    const prices = searchResults.value.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  })

  // Load search history from localStorage
  const loadSearchHistory = () => {
    try {
      const history = localStorage.getItem('search_history')
      if (history) {
        searchHistory.value = JSON.parse(history).slice(0, 10) // Keep only 10 recent searches
      }
    } catch (error) {
      console.error('Error loading search history:', error)
    }
  }

  // Save search to history
  const saveToHistory = (query: string) => {
    if (!query.trim()) return
    
    // Remove existing entry if exists
    const index = searchHistory.value.indexOf(query)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
    }
    
    // Add to beginning
    searchHistory.value.unshift(query)
    
    // Keep only 10 items
    searchHistory.value = searchHistory.value.slice(0, 10)
    
    // Save to localStorage
    try {
      localStorage.setItem('search_history', JSON.stringify(searchHistory.value))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }

  // Generate search suggestions
  const generateSuggestions = async (query: string) => {
    if (!query.trim()) {
      suggestions.value = []
      return
    }

    isLoadingSuggestions.value = true
    const lowercaseQuery = query.toLowerCase()
    const suggestionsList: SearchSuggestion[] = []

    try {
      // Add matching categories
      categories.value
        .filter(cat => cat.name.toLowerCase().includes(lowercaseQuery))
        .slice(0, 3)
        .forEach(cat => {
          suggestionsList.push({
            id: `category-${cat.id}`,
            text: cat.name,
            type: 'category',
            icon: 'bi-tag'
          })
        })

      // Add matching brands
      brands.value
        .filter(brand => brand.name.toLowerCase().includes(lowercaseQuery))
        .slice(0, 3)
        .forEach(brand => {
          suggestionsList.push({
            id: `brand-${brand.id}`,
            text: brand.name,
            type: 'brand',
            icon: 'bi-award'
          })
        })

      // Add search history matches
      searchHistory.value
        .filter(hist => hist.toLowerCase().includes(lowercaseQuery))
        .slice(0, 5)
        .forEach(hist => {
          suggestionsList.push({
            id: `history-${hist}`,
            text: hist,
            type: 'product',
            icon: 'bi-clock-history'
          })
        })

      suggestions.value = suggestionsList.slice(0, 10)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      isLoadingSuggestions.value = false
    }
  }

  // Perform search
  const performSearch = async (query?: string, page = 1) => {
    const searchTerm = query || searchQuery.value
    if (!searchTerm.trim()) return

    isLoading.value = true
    currentPage.value = page

    try {
      // Build search params
      const searchParams = {
        search: searchTerm,
        page,
        per_page: itemsPerPage.value,
        category: filters.value.category,
        brand: filters.value.brand,
        min_price: filters.value.minPrice,
        max_price: filters.value.maxPrice,
        min_rating: filters.value.minRating,
        sort_by: filters.value.sortBy,
        sort_order: filters.value.sortOrder
      }

      // Remove undefined values
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key as keyof typeof searchParams] === undefined) {
          delete searchParams[key as keyof typeof searchParams]
        }
      })

      const response = await productsApi.searchProducts(searchParams)
      searchResults.value = response.data
      totalItems.value = response.total || response.data.length
      totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value)

      // Save to search history
      saveToHistory(searchTerm)

      // Update URL
      const queryParams: Record<string, any> = { q: searchTerm }
      if (page > 1) queryParams.page = page
      if (hasFilters.value) {
        Object.assign(queryParams, filters.value)
      }
      
      router.push({ 
        path: '/search', 
        query: queryParams
      })

    } catch (error: any) {
      showError('Lỗi', 'Không thể thực hiện tìm kiếm. Vui lòng thử lại.')
      console.error('Search error:', error)
    } finally {
      isLoading.value = false
      showSuggestions.value = false
    }
  }

  // Apply filters
  const applyFilters = (newFilters: Partial<SearchFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    if (searchQuery.value) {
      performSearch(searchQuery.value, 1)
    }
  }

  // Clear filters
  const clearFilters = () => {
    filters.value = {
      sortBy: 'name',
      sortOrder: 'asc'
    }
    if (searchQuery.value) {
      performSearch(searchQuery.value, 1)
    }
  }

  // Clear search
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    suggestions.value = []
    showSuggestions.value = false
    router.push('/search')
  }

  // Load data for filters
  const loadFilterData = async () => {
    try {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        categoriesApi.getCategories(),
        brandsApi.getBrands()
      ])
      
      categories.value = categoriesResponse.data
      brands.value = brandsResponse.data
    } catch (error) {
      console.error('Error loading filter data:', error)
    }
  }

  // Initialize from URL params
  const initializeFromRoute = () => {
    const query = route.query.q as string
    const page = parseInt(route.query.page as string) || 1
    
    if (query) {
      searchQuery.value = query
      
      // Apply filters from URL
      if (route.query.category) filters.value.category = route.query.category as string
      if (route.query.brand) filters.value.brand = route.query.brand as string
      if (route.query.min_price) filters.value.minPrice = parseFloat(route.query.min_price as string)
      if (route.query.max_price) filters.value.maxPrice = parseFloat(route.query.max_price as string)
      if (route.query.min_rating) filters.value.minRating = parseFloat(route.query.min_rating as string)
      if (route.query.sort_by) filters.value.sortBy = route.query.sort_by as any
      if (route.query.sort_order) filters.value.sortOrder = route.query.sort_order as any
      
      performSearch(query, page)
    }
  }

  // Watch for search query changes for suggestions
  watch(searchQuery, (newQuery) => {
    if (newQuery.length > 2) {
      generateSuggestions(newQuery)
      showSuggestions.value = true
    } else {
      suggestions.value = []
      showSuggestions.value = false
    }
  })

  return {
    // State
    searchQuery,
    searchResults,
    suggestions,
    searchHistory,
    isLoading,
    isLoadingSuggestions,
    showSuggestions,
    filters,
    categories,
    brands,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,

    // Computed
    hasResults,
    hasFilters,
    activeFiltersCount,
    priceRange,

    // Actions
    performSearch,
    generateSuggestions,
    applyFilters,
    clearFilters,
    clearSearch,
    loadFilterData,
    loadSearchHistory,
    initializeFromRoute,
    saveToHistory
  }
}
