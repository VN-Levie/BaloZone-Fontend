import { ref, computed } from 'vue'
import { saleCampaignsApi, adminSaleCampaignsApi } from '@/services/api'
import type { SaleCampaign, ProductWithSale, PaginatedResponse } from '@/types'

export function useSaleCampaigns() {
  const saleCampaigns = ref<SaleCampaign[]>([])
  const activeCampaigns = ref<SaleCampaign[]>([])
  const featuredCampaigns = ref<SaleCampaign[]>([])
  const currentCampaign = ref<SaleCampaign | null>(null)
  const campaignProducts = ref<any[]>([])
  const pagination = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasActiveCampaigns = computed(() => activeCampaigns.value.length > 0)
  const hasFeaturedCampaigns = computed(() => featuredCampaigns.value.length > 0)

  // Actions
  const fetchSaleCampaigns = async (filters?: any) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await saleCampaignsApi.getSaleCampaigns(filters)
      saleCampaigns.value = response.data
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
        per_page: response.per_page
      }
    } catch (err) {
      error.value = 'Failed to fetch sale campaigns'
      console.error('Error fetching sale campaigns:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchActiveCampaigns = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await saleCampaignsApi.getActiveSaleCampaigns()
      activeCampaigns.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch active campaigns'
      console.error('Error fetching active campaigns:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchFeaturedCampaigns = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await saleCampaignsApi.getFeaturedSaleCampaigns()
      featuredCampaigns.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch featured campaigns'
      console.error('Error fetching featured campaigns:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSaleCampaign = async (id: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await saleCampaignsApi.getSaleCampaign(id)
      currentCampaign.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch sale campaign'
      console.error('Error fetching sale campaign:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchSaleCampaignBySlug = async (slug: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await saleCampaignsApi.getSaleCampaignBySlug(slug)
      currentCampaign.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch sale campaign by slug'
      console.error('Error fetching sale campaign by slug:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchCampaignProducts = async (campaignId: number | string, filters?: any) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await saleCampaignsApi.getSaleCampaignProducts(campaignId, filters)
      campaignProducts.value = response.data
      return response
    } catch (err) {
      error.value = 'Failed to fetch campaign products'
      console.error('Error fetching campaign products:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Admin functions - using admin API endpoints
  const fetchAdminSaleCampaigns = async (filters?: any) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await adminSaleCampaignsApi.getSaleCampaigns(filters)
      saleCampaigns.value = response.data
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
        per_page: response.per_page
      }
    } catch (err) {
      error.value = 'Failed to fetch admin sale campaigns'
      console.error('Error fetching admin sale campaigns:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchAdminSaleCampaign = async (id: number | string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await adminSaleCampaignsApi.getSaleCampaign(id)
      currentCampaign.value = response.data
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch admin sale campaign'
      console.error('Error fetching admin sale campaign:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createSaleCampaign = async (campaignData: any) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await adminSaleCampaignsApi.createSaleCampaign(campaignData)
      await fetchAdminSaleCampaigns() // Refresh admin list
      return response.data
    } catch (err) {
      error.value = 'Failed to create sale campaign'
      console.error('Error creating sale campaign:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateSaleCampaign = async (id: number, campaignData: any) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await adminSaleCampaignsApi.updateSaleCampaign(id, campaignData)
      await fetchAdminSaleCampaigns() // Refresh admin list
      return response.data
    } catch (err) {
      error.value = 'Failed to update sale campaign'
      console.error('Error updating sale campaign:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteSaleCampaign = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      await adminSaleCampaignsApi.deleteSaleCampaign(id)
      await fetchAdminSaleCampaigns() // Refresh admin list
    } catch (err) {
      error.value = 'Failed to delete sale campaign'
      console.error('Error deleting sale campaign:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addProductsToSaleCampaign = async (campaignId: number, productsData: any) => {
    isLoading.value = true
    error.value = null
    try {
      await adminSaleCampaignsApi.addProductsToSaleCampaign(campaignId, productsData)
      await fetchCampaignProducts(campaignId) // Refresh campaign products
    } catch (err) {
      error.value = 'Failed to add products to sale campaign'
      console.error('Error adding products to sale campaign:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeProductFromSaleCampaign = async (campaignId: number, productId: number) => {
    isLoading.value = true
    error.value = null
    try {
      await adminSaleCampaignsApi.removeProductFromSaleCampaign(campaignId, productId)
      await fetchCampaignProducts(campaignId) // Refresh campaign products
    } catch (err) {
      error.value = 'Failed to remove product from sale campaign'
      console.error('Error removing product from sale campaign:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Utility functions
  const formatSalePrice = (originalPrice: number, salePrice: number) => {
    return {
      original: originalPrice.toLocaleString('vi-VN'),
      sale: salePrice.toLocaleString('vi-VN'),
      saved: (originalPrice - salePrice).toLocaleString('vi-VN'),
      discount: Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    }
  }

  const isCampaignActive = (campaign: SaleCampaign) => {
    const now = new Date()
    const startDate = new Date(campaign.start_date)
    const endDate = new Date(campaign.end_date)
    return campaign.status === 'active' && now >= startDate && now <= endDate
  }

  const getCampaignTimeRemaining = (campaign: SaleCampaign) => {
    const now = new Date().getTime()
    const endDate = new Date(campaign.end_date).getTime()
    const timeLeft = endDate - now

    if (timeLeft <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    return { expired: false, days, hours, minutes, seconds }
  }

  // Helper function to create FormData for campaign creation/update
  const createCampaignFormData = (data: {
    name: string
    slug: string
    description?: string
    banner_image?: File | string
    start_date: string
    end_date: string
    status: 'draft' | 'active' | 'expired' | 'cancelled'
    is_featured?: boolean
    priority?: number
    metadata?: object
  }) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('slug', data.slug)

    if (data.description) {
      formData.append('description', data.description)
    }

    // Only append banner_image if it's a File (for upload)
    // Skip string URLs as backend only accepts file uploads now
    if (data.banner_image && data.banner_image instanceof File) {
      formData.append('banner_image', data.banner_image)
    }

    formData.append('start_date', data.start_date)
    formData.append('end_date', data.end_date)
    formData.append('status', data.status)

    if (data.is_featured !== undefined) {
      formData.append('is_featured', data.is_featured ? '1' : '0')
    }

    if (data.priority !== undefined) {
      formData.append('priority', data.priority.toString())
    }

    if (data.metadata) {
      // Handle metadata properly for FormData
      const metadata = data.metadata as any
      if (metadata.color) {
        formData.append('metadata[color]', metadata.color)
      }
      if (metadata.tags && Array.isArray(metadata.tags)) {
        metadata.tags.forEach((tag: string, index: number) => {
          formData.append(`metadata[tags][${index}]`, tag)
        })
      }
    }

    return formData
  }

  return {
    // State
    saleCampaigns: computed(() => saleCampaigns.value),
    activeCampaigns: computed(() => activeCampaigns.value),
    featuredCampaigns: computed(() => featuredCampaigns.value),
    currentCampaign: computed(() => currentCampaign.value),
    campaignProducts: computed(() => campaignProducts.value),
    pagination: computed(() => pagination.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Getters
    hasActiveCampaigns,
    hasFeaturedCampaigns,

    // Actions - Public endpoints
    fetchSaleCampaigns,
    fetchActiveCampaigns,
    fetchFeaturedCampaigns,
    fetchSaleCampaign,
    fetchSaleCampaignBySlug,
    fetchCampaignProducts,

    // Admin Actions - Admin endpoints
    fetchAdminSaleCampaigns,
    fetchAdminSaleCampaign,
    createSaleCampaign,
    updateSaleCampaign,
    deleteSaleCampaign,
    addProductsToSaleCampaign,
    removeProductFromSaleCampaign,

    // Utilities
    formatSalePrice,
    isCampaignActive,
    getCampaignTimeRemaining,
    createCampaignFormData
  }
}
