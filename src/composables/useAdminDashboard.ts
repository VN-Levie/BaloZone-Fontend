import { ref, computed, onMounted } from 'vue'
import { adminDashboardApi, saleCampaignsApi, adminUserApi, contactApi } from '@/services/api'
import type { 
  DashboardStats, 
  DashboardRevenue, 
  DashboardUsers, 
  DashboardProducts,
  SaleCampaign 
} from '@/types'

export function useAdminDashboard() {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Dashboard data
  const dashboardStats = ref<DashboardStats | null>(null)
  const revenueData = ref<DashboardRevenue | null>(null)
  const usersData = ref<DashboardUsers | null>(null)
  const productsData = ref<DashboardProducts | null>(null)
  const saleCampaigns = ref<SaleCampaign[]>([])

  // Computed values
  const totalRevenue = computed(() => {
    return dashboardStats.value?.overview.total_revenue 
      ? parseFloat(dashboardStats.value.overview.total_revenue).toLocaleString('vi-VN')
      : '0'
  })

  const monthlyRevenue = computed(() => {
    return dashboardStats.value?.overview.monthly_revenue 
      ? parseFloat(dashboardStats.value.overview.monthly_revenue).toLocaleString('vi-VN')
      : '0'
  })

  const chartData = computed(() => {
    if (!dashboardStats.value) return { revenue: [], orders: [] }
    
    return {
      revenue: dashboardStats.value.revenue_chart.map(item => ({
        date: item.date,
        value: typeof item.revenue === 'string' ? parseFloat(item.revenue) : item.revenue
      })),
      orders: dashboardStats.value.order_chart.map(item => ({
        date: item.date,
        value: item.orders || 0
      }))
    }
  })

  const orderStatusData = computed(() => {
    if (!dashboardStats.value) return []
    
    const stats = dashboardStats.value.order_stats
    return [
      { label: 'Đã giao', value: stats.delivered, color: '#4ade80' },
      { label: 'Đang giao', value: stats.shipped, color: '#3b82f6' },
      { label: 'Đang xử lý', value: stats.processing, color: '#f59e0b' },
      { label: 'Chờ xử lý', value: stats.pending, color: '#6b7280' },
      { label: 'Đã hủy', value: stats.cancelled, color: '#ef4444' }
    ]
  })

  const contactStatusData = computed(() => {
    if (!dashboardStats.value) return []
    
    const stats = dashboardStats.value.contact_stats
    return [
      { label: 'Đã giải quyết', value: stats.resolved, color: '#4ade80' },
      { label: 'Chờ xử lý', value: stats.pending, color: '#f59e0b' }
    ]
  })

  // Actions
  const fetchDashboardStats = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await adminDashboardApi.getDashboardStats()
      if (response.success) {
        dashboardStats.value = response.data
      } else {
        error.value = response.message || 'Không thể tải thống kê dashboard'
      }
    } catch (err: any) {
      error.value = err.message || 'Có lỗi xảy ra khi tải thống kê dashboard'
      console.error('Error fetching dashboard stats:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchRevenueData = async (year?: number) => {
    try {
      const response = await adminDashboardApi.getRevenueReport(year)
      if (response.success) {
        revenueData.value = response.data
      }
    } catch (err: any) {
      console.error('Error fetching revenue data:', err)
    }
  }

  const fetchUsersData = async () => {
    try {
      const response = await adminDashboardApi.getUserAnalytics()
      if (response.success) {
        usersData.value = response.data
      }
    } catch (err: any) {
      console.error('Error fetching users data:', err)
    }
  }

  const fetchProductsData = async () => {
    try {
      const response = await adminDashboardApi.getProductAnalytics()
      if (response.success) {
        productsData.value = response.data
      }
    } catch (err: any) {
      console.error('Error fetching products data:', err)
    }
  }

  const fetchSaleCampaigns = async () => {
    try {
      const response = await saleCampaignsApi.getSaleCampaigns()
      if (response.data) {
        saleCampaigns.value = response.data.slice(0, 5)
      }
    } catch (err: any) {
      console.error('Error fetching sale campaigns:', err)
    }
  }

  const refreshAllData = async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchRevenueData(),
      fetchUsersData(),
      fetchProductsData(),
      fetchSaleCampaigns()
    ])
  }

  // Format helpers
  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return num.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })
  }

  const formatPercentage = (current: number, total: number) => {
    if (total === 0) return '0%'
    return `${Math.round((current / total) * 100)}%`
  }

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  return {
    // State
    loading,
    error,
    
    // Data
    dashboardStats,
    revenueData,
    usersData,
    productsData,
    saleCampaigns,
    
    // Computed
    totalRevenue,
    monthlyRevenue,
    chartData,
    orderStatusData,
    contactStatusData,
    
    // Actions
    fetchDashboardStats,
    fetchRevenueData,
    fetchUsersData,
    fetchProductsData,
    fetchSaleCampaigns,
    refreshAllData,
    
    // Helpers
    formatCurrency,
    formatPercentage,
    getGrowthPercentage
  }
}
