import { ref, computed } from 'vue'
import { saleCampaignsApi } from '@/services/api'
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

  // Admin functions
  const createSaleCampaign = async (campaignData: any) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await saleCampaignsApi.createSaleCampaign(campaignData)
      await fetchSaleCampaigns() // Refresh list
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
      const response = await saleCampaignsApi.updateSaleCampaign(id, campaignData)
      await fetchSaleCampaigns() // Refresh list
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
      await saleCampaignsApi.deleteSaleCampaign(id)
      await fetchSaleCampaigns() // Refresh list
    } catch (err) {
      error.value = 'Failed to delete sale campaign'
      console.error('Error deleting sale campaign:', err)
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

    // Actions
    fetchSaleCampaigns,
    fetchActiveCampaigns,
    fetchFeaturedCampaigns,
    fetchSaleCampaign,
    fetchSaleCampaignBySlug,
    fetchCampaignProducts,
    createSaleCampaign,
    updateSaleCampaign,
    deleteSaleCampaign,

    // Utilities
    formatSalePrice,
    isCampaignActive,
    getCampaignTimeRemaining
  }
}
