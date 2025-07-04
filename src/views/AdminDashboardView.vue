<template>
  <div class="admin-dashboard">
    <div class="container-fluid py-4">
      <!-- Dashboard Header -->
      <DashboardHeader 
        :user="user" 
        title="Dashboard Admin"
        subtitle="Tổng quan và quản lý hệ thống"
      />

      <!-- Access denied for non-admins -->
      <div v-if="!canAccess" class="access-denied">
        <div class="alert alert-danger">
          <i class="bi bi-shield-exclamation"></i>
          Bạn không có quyền truy cập vào trang này.
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content">
        <!-- Enhanced Stats Section -->
        <EnhancedStats 
          :stats="enhancedStats" 
          :loading="loading.dashboard"
          @refresh="refreshStats"
        />

        <!-- Enhanced Actions Section -->
        <EnhancedActions 
          :actions="enhancedActions"
          @action-click="handleQuickAction"
        />

        <!-- Quick Management Section -->
        <div class="row g-4 mt-4">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i class="bi bi-lightning-charge-fill text-warning me-2"></i>
                  Quản lý nhanh
                </h5>
                <small class="text-muted">Truy cập nhanh các chức năng chính</small>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <!-- Product Management -->
                  <div class="col-md-6 col-lg-3">
                    <div class="quick-management-card product-card" @click="router.push('/admin/products')">
                      <div class="card-icon">
                        <i class="bi bi-box-seam-fill"></i>
                      </div>
                      <div class="card-content">
                        <h6 class="card-title">Sản phẩm</h6>
                        <p class="card-subtitle">{{ stats.totalProducts }} sản phẩm</p>
                        <div class="card-actions">
                          <button 
                            class="btn btn-sm btn-primary"
                            @click.stop="router.push('/admin/products')"
                          >
                            <i class="bi bi-grid-3x2-gap me-1"></i>Danh sách
                          </button>
                          <button 
                            class="btn btn-sm btn-success"
                            @click.stop="router.push('/admin/products/create')"
                          >
                            <i class="bi bi-plus-lg me-1"></i>Thêm mới
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Category Management -->
                  <div class="col-md-6 col-lg-3">
                    <div class="quick-management-card category-card" @click="router.push('/admin/categories')">
                      <div class="card-icon">
                        <i class="bi bi-grid-3x3-gap-fill"></i>
                      </div>
                      <div class="card-content">
                        <h6 class="card-title">Danh mục</h6>
                        <p class="card-subtitle">Quản lý phân loại</p>
                        <div class="card-actions">
                          <button 
                            class="btn btn-sm btn-info"
                            @click.stop="router.push('/admin/categories')"
                          >
                            <i class="bi bi-list-ul me-1"></i>Danh sách
                          </button>
                          <button 
                            class="btn btn-sm btn-warning"
                            @click.stop="router.push('/admin/categories/create')"
                          >
                            <i class="bi bi-folder-plus me-1"></i>Tạo mới
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Brand Management -->
                  <div class="col-md-6 col-lg-3">
                    <div class="quick-management-card brand-card" @click="router.push('/admin/brands')">
                      <div class="card-icon">
                        <i class="bi bi-award-fill"></i>
                      </div>
                      <div class="card-content">
                        <h6 class="card-title">Thương hiệu</h6>
                        <p class="card-subtitle">Quản lý nhãn hàng</p>
                        <div class="card-actions">
                          <button 
                            class="btn btn-sm btn-success"
                            @click.stop="router.push('/admin/brands')"
                          >
                            <i class="bi bi-star me-1"></i>Danh sách
                          </button>
                          <button 
                            class="btn btn-sm btn-primary"
                            @click.stop="router.push('/admin/brands/create')"
                          >
                            <i class="bi bi-plus-circle me-1"></i>Tạo mới
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Orders Management -->
                  <div class="col-md-6 col-lg-3">
                    <div class="quick-management-card order-card" @click="router.push('/admin/orders')">
                      <div class="card-icon">
                        <i class="bi bi-cart-check-fill"></i>
                      </div>
                      <div class="card-content">
                        <h6 class="card-title">Đơn hàng</h6>
                        <p class="card-subtitle">{{ stats.totalOrders }} đơn hàng</p>
                        <div class="card-actions">
                          <button 
                            class="btn btn-sm btn-danger"
                            @click.stop="router.push('/admin/orders')"
                          >
                            <i class="bi bi-clipboard-check me-1"></i>Xử lý
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-secondary"
                            @click.stop="router.push('/admin/reports/orders')"
                          >
                            <i class="bi bi-graph-up me-1"></i>Báo cáo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Users Management -->
                  <div class="col-md-6 col-lg-3">
                    <div class="quick-management-card user-card" @click="router.push('/admin/users')">
                      <div class="card-icon">
                        <i class="bi bi-people-fill"></i>
                      </div>
                      <div class="card-content">
                        <h6 class="card-title">Người dùng</h6>
                        <p class="card-subtitle">{{ stats.totalUsers }} tài khoản</p>
                        <div class="card-actions">
                          <button 
                            class="btn btn-sm btn-secondary"
                            @click.stop="router.push('/admin/users')"
                          >
                            <i class="bi bi-person-lines-fill me-1"></i>Quản lý
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-info"
                            @click.stop="router.push('/admin/roles')"
                          >
                            <i class="bi bi-shield-check me-1"></i>Phân quyền
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Category Trash Access -->
                <div class="row g-3 mt-3">
                  <div class="col-12">
                    <div class="alert alert-light border d-flex justify-content-between align-items-center">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-trash3-fill text-warning me-2"></i>
                        <span><strong>Thùng rác:</strong> Quản lý các mục đã xóa tạm thời</span>
                      </div>
                      <div class="btn-group">
                        <button 
                          class="btn btn-sm btn-outline-warning"
                          @click="router.push('/admin/categories/trashed')"
                        >
                          <i class="bi bi-folder-x me-1"></i>Danh mục đã xóa
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-info"
                          @click="router.push('/admin/brands/trashed')"
                        >
                          <i class="bi bi-award me-1"></i>Thương hiệu đã xóa
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-secondary"
                          @click="router.push('/admin/products/trashed')"
                          disabled
                          title="Chức năng sắp có"
                        >
                          <i class="bi bi-box me-1"></i>Sản phẩm đã xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <ChartsSection 
          :sales-data="salesChartData"
          :orders-data="ordersStatusChartData"
          :loading="loading.dashboard"
          :selected-period="selectedPeriod"
          @period-change="handlePeriodChange"
          @download-chart="handleDownloadChart"
          @refresh-chart="handleRefreshChart"
        />

        <!-- Additional Information Sections -->
        <div class="row g-4 mt-2">
          <!-- Top Products -->
          <div class="col-lg-6">
            <div class="info-card">
              <div class="card-header">
                <h5 class="card-title">
                  <i class="bi bi-trophy-fill"></i>
                  Sản phẩm bán chạy
                </h5>
              </div>
              <div class="card-body">
                <div v-if="loading.dashboard" class="loading-skeleton">
                  <div v-for="i in 5" :key="i" class="skeleton-item"></div>
                </div>
                <div v-else-if="dashboardData.topProducts?.length" class="top-products-list">
                  <div 
                    v-for="(product, index) in dashboardData.topProducts.slice(0, 5)" 
                    :key="product.id"
                    class="product-item"
                  >
                    <div class="product-rank">{{ index + 1 }}</div>
                    <div class="product-info">
                      <h6 class="product-name">{{ product.name }}</h6>
                      <div class="product-meta">
                        <span class="badge bg-success">{{ product.total_sold }} đã bán</span>
                        <span class="text-muted">{{ formatCurrency(product.price || 0) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <i class="bi bi-box"></i>
                  <p>Chưa có dữ liệu sản phẩm</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Low Stock Alerts -->
          <div class="col-lg-6">
            <div class="info-card">
              <div class="card-header">
                <h5 class="card-title">
                  <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                  Cảnh báo tồn kho
                </h5>
              </div>
              <div class="card-body">
                <div v-if="loading.dashboard" class="loading-skeleton">
                  <div v-for="i in 3" :key="i" class="skeleton-item"></div>
                </div>
                <div v-else-if="lowStockProducts?.length" class="stock-alerts">
                  <div 
                    v-for="product in lowStockProducts.slice(0, 5)" 
                    :key="product.id"
                    class="stock-item"
                  >
                    <div class="stock-info">
                      <h6 class="product-name">{{ product.name }}</h6>
                      <div class="stock-level">
                        <span class="stock-status text-danger">⚠️</span>
                        <span class="badge bg-danger">{{ product.stock }} còn lại</span>
                        <span class="text-muted">{{ formatCurrency(product.price) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <i class="bi bi-check-circle text-success"></i>
                  <p>Tất cả sản phẩm đều có đủ tồn kho</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useSaleCampaigns } from '@/composables/useSaleCampaigns'
import { formatDate } from '@/utils'
import { adminDashboardApi } from '@/services/api'
import type { SaleCampaign } from '@/types'

// Import new components
import DashboardHeader from '@/components/admin/DashboardHeader.vue'
import EnhancedStats from '@/components/admin/EnhancedStats.vue'
import EnhancedActions from '@/components/admin/EnhancedActions.vue'
import ChartsSection from '@/components/admin/ChartsSection.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { user, isAdmin, isContributor, token } = useAuth()
const { fetchActiveCampaigns, activeCampaigns } = useSaleCampaigns()
const { showLoginSuccess, showError } = useToast()

// Permission checks
const canAccess = computed(() => isAdmin.value || isContributor.value)
const canManageSaleCampaigns = computed(() => isAdmin.value || isContributor.value)

// Data
const stats = ref({
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalNews: 0,
  totalRevenue: 0,
  monthlyGrowth: 0
})

const dashboardData = ref<any>({
  overview: {},
  orderStats: {},
  contactStats: {},
  topProducts: [],
  revenueChart: [],
  orderChart: [],
  monthlyRevenue: [],
  userAnalytics: {},
  productAnalytics: {}
})

const loading = ref({
  saleCampaigns: false,
  dashboard: false
})

const selectedPeriod = ref('30d')
const activeSaleCampaigns = ref<SaleCampaign[]>([])

// Enhanced Stats Data
const enhancedStats = computed(() => [
  {
    label: 'Tổng người dùng',
    value: stats.value.totalUsers,
    icon: 'bi-people-fill',
    color: 'primary' as const,
    change: 12,
    isAnimated: true,
    description: 'Số lượng tài khoản đã đăng ký',
    progress: 75
  },
  {
    label: 'Tổng sản phẩm',
    value: stats.value.totalProducts,
    icon: 'bi-box-seam-fill',
    color: 'success' as const,
    change: 8,
    isAnimated: true,
    description: 'Sản phẩm trong kho',
    progress: 65
  },
  {
    label: 'Đơn hàng',
    value: stats.value.totalOrders,
    icon: 'bi-cart-fill',
    color: 'warning' as const,
    change: 15,
    isAnimated: true,
    description: 'Đơn hàng trong tháng',
    progress: 85
  },
  {
    label: 'Doanh thu',
    value: stats.value.totalRevenue,
    icon: 'bi-currency-dollar',
    color: 'info' as const,
    change: 22,
    isAnimated: true,
    suffix: 'VNĐ',
    description: 'Doanh thu tháng này',
    progress: 90
  }
])

// Enhanced Actions Data
const enhancedActions = computed(() => [
  {
    id: 'manage-products',
    title: 'Quản lý sản phẩm',
    description: 'Xem, thêm, sửa, xóa sản phẩm',
    icon: 'bi-box-seam-fill',
    color: 'primary' as const,
    badge: stats.value.totalProducts ? `${stats.value.totalProducts}` : undefined,
    shortcut: 'Ctrl+P'
  },
  {
    id: 'create-product',
    title: 'Tạo sản phẩm mới',
    description: 'Thêm sản phẩm mới vào kho',
    icon: 'bi-plus-circle-fill',
    color: 'success' as const,
    shortcut: 'Ctrl+N'
  },
  {
    id: 'manage-categories',
    title: 'Quản lý danh mục',
    description: 'Quản lý danh mục sản phẩm',
    icon: 'bi-grid-3x3-gap-fill',
    color: 'info' as const,
    badge: 'Mới'
  },
  {
    id: 'create-category',
    title: 'Tạo danh mục mới',
    description: 'Thêm danh mục sản phẩm mới',
    icon: 'bi-folder-plus',
    color: 'warning' as const
  },
  {
    id: 'manage-orders',
    title: 'Quản lý đơn hàng',
    description: 'Xem và xử lý đơn hàng',
    icon: 'bi-clipboard-check-fill',
    color: 'danger' as const,
    badge: stats.value.totalOrders > 0 ? 'Mới' : undefined
  },
  {
    id: 'create-sale-campaign',
    title: 'Tạo khuyến mãi',
    description: 'Tạo chiến dịch khuyến mãi mới',
    icon: 'bi-tags-fill',
    color: 'warning' as const,
    shortcut: 'Ctrl+S'
  },
  {
    id: 'manage-users',
    title: 'Quản lý người dùng',
    description: 'Xem và quản lý tài khoản',
    icon: 'bi-person-gear',
    color: 'info' as const
  },
  {
    id: 'revenue-report',
    title: 'Báo cáo doanh thu',
    description: 'Xem báo cáo chi tiết',
    icon: 'bi-graph-up-arrow',
    color: 'success' as const
  }
])

// Chart Data
interface ChartData {
  labels: string[]
  datasets: any[]
}
const salesChartData = ref<ChartData>({
  labels: [],
  datasets: []
})

const ordersStatusChartData = ref<ChartData>({
  labels: [],
  datasets: []
})

// Sale Campaigns Computed
const totalSaleProducts = computed(() => {
  return activeSaleCampaigns.value.reduce((total, campaign) => {
    return total + (campaign.sale_products?.length || 0)
  }, 0)
})

const averageDiscount = computed(() => {
  if (activeSaleCampaigns.value.length === 0) return 0
  const totalDiscount = activeSaleCampaigns.value.reduce((sum, campaign) => {
    // Get discount from sale_products if available
    const discount = campaign.sale_products?.[0]?.discount_percentage || 10
    return sum + discount
  }, 0)
  return Math.round(totalDiscount / activeSaleCampaigns.value.length)
})

// Product Analytics computed
const lowStockProducts = computed(() => {
  return dashboardData.value.productAnalytics?.low_stock_products || []
})

// Methods
const formatCurrency = (amount: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(numAmount)
}

const handleQuickAction = (actionId: string) => {
  switch (actionId) {
    case 'manage-products':
      router.push('/admin/products')
      break
    case 'create-product':
      router.push('/admin/products/create')
      break
    case 'manage-categories':
      router.push('/admin/categories')
      break
    case 'create-category':
      router.push('/admin/categories/create')
      break
    case 'manage-orders':
      router.push('/admin/orders')
      break
    case 'create-sale-campaign':
      createSaleCampaign()
      break
    case 'manage-users':
      router.push('/admin/users')
      break
    case 'revenue-report':
      router.push('/admin/reports/revenue')
      break
    case 'system-settings':
      router.push('/admin/settings')
      break
    default:
      console.log('Unknown action:', actionId)
  }
}

const createSaleCampaign = () => {
  router.push('/admin/sale-campaigns/create')
}

const editSaleCampaign = (campaign: SaleCampaign) => {
  router.push(`/admin/sale-campaigns/${campaign.id}/edit`)
}

const viewSaleCampaign = (campaign: SaleCampaign) => {
  router.push(`/sale-campaigns/${campaign.id}`)
}

const refreshStats = async () => {
  await loadDashboardData()
}

const handlePeriodChange = (period: string) => {
  selectedPeriod.value = period
  // Reload chart data based on period
}

const handleDownloadChart = (chartType: string) => {
  console.log('Download chart:', chartType)
  // Implement chart download logic
}

const handleRefreshChart = (chartType: string) => {
  console.log('Refresh chart:', chartType)
  // Implement chart refresh logic
}

// Load dashboard data
const loadDashboardData = async () => {
  if (!canAccess.value) return

  loading.value.dashboard = true

  try {
    console.log('🚀 Starting to fetch dashboard data...')
    
    // Fetch all dashboard data in parallel
    const [
      dashboardStatsResponse,
      revenueReportResponse,
      userAnalyticsResponse,
      productAnalyticsResponse
    ] = await Promise.all([
      adminDashboardApi.getDashboardStats(),
      adminDashboardApi.getRevenueReport(2025),
      adminDashboardApi.getUserAnalytics(),
      adminDashboardApi.getProductAnalytics()
    ])

    console.log('✅ All API calls completed successfully!')
    console.log('📊 Dashboard Stats Response:', dashboardStatsResponse)

    // Extract data from responses
    const dashboardApiData = dashboardStatsResponse.data || {}
    const revenueData = revenueReportResponse.data || {}
    const userData = userAnalyticsResponse.data || {}
    const productApiData = productAnalyticsResponse.data || {}

    console.log('Dashboard API Data:', {
      dashboardApiData,
      revenueData,
      userData,
      productApiData
    })

    // Debug: Log the specific overview data
    console.log('Overview data from API:', dashboardApiData.overview)
    console.log('Total users from API:', dashboardApiData.overview?.total_users)

    // Validate that we have real data
    if (!dashboardApiData.overview) {
      throw new Error('No overview data received from API')
    }

    // Store all dashboard data
    dashboardData.value = {
      overview: dashboardApiData.overview || {},
      orderStats: dashboardApiData.order_stats || {},
      contactStats: dashboardApiData.contact_stats || {},
      topProducts: dashboardApiData.top_products || [],
      revenueChart: dashboardApiData.revenue_chart || [],
      orderChart: dashboardApiData.order_chart || [],
      monthlyRevenue: revenueData.monthly_data || [],
      userAnalytics: userData || {},
      productAnalytics: productApiData || {}
    }

    // Map API overview fields - should be 23 users, 205 products, 32 orders, etc.
    stats.value = {
      totalUsers: dashboardApiData.overview?.total_users || 0,
      totalProducts: dashboardApiData.overview?.total_products || 0,
      totalOrders: dashboardApiData.overview?.total_orders || 0,
      totalNews: dashboardApiData.overview?.total_contacts || 0,
      totalRevenue: Number(dashboardApiData.overview?.total_revenue) || 0,
      monthlyGrowth: dashboardApiData.overview?.new_users_this_month || 0
    }

    console.log('Stats after mapping:', stats.value)
    console.log('✅ Expected: 23 users, 205 products, 32 orders')
    console.log('✅ Actual:', `${stats.value.totalUsers} users, ${stats.value.totalProducts} products, ${stats.value.totalOrders} orders`)

    // Update sales chart data - combine revenue and orders
    const chartLabels = (dashboardApiData.revenue_chart || []).map((item: any) => {
      // Format date to be more readable
      const date = new Date(item.date)
      return date.toLocaleDateString('vi-VN', { 
        month: 'short', 
        day: 'numeric' 
      })
    })

    salesChartData.value = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Doanh thu (VNĐ)',
          data: (dashboardApiData.revenue_chart || []).map((item: any) => Number(item.revenue)),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Đơn hàng',
          data: (dashboardApiData.order_chart || []).map((item: any) => Number(item.orders)),
          borderColor: '#48bb78',
          backgroundColor: 'rgba(72, 187, 120, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    }

    // Update orders status chart with Vietnamese labels
    const orderLabels = ['Đã giao', 'Hoàn thành', 'Chờ xử lý', 'Đang xử lý', 'Đã hủy']
    ordersStatusChartData.value = {
      labels: orderLabels,
      datasets: [
        {
          data: [
            dashboardApiData.order_stats?.shipped || 0,
            dashboardApiData.order_stats?.delivered || 0,
            dashboardApiData.order_stats?.pending || 0,
            dashboardApiData.order_stats?.processing || 0,
            dashboardApiData.order_stats?.cancelled || 0
          ],
          backgroundColor: [
            '#4299e1', // Shipped - Blue
            '#48bb78', // Delivered - Green  
            '#ed8936', // Pending - Orange
            '#f6e05e', // Processing - Yellow
            '#f56565'  // Cancelled - Red
          ],
          borderWidth: 0,
          hoverOffset: 10
        }
      ]
    }

    // Load active sale campaigns
    loading.value.saleCampaigns = true
    await fetchActiveCampaigns()
    activeSaleCampaigns.value = activeCampaigns.value.slice(0, 5) // Show only 5 recent
    loading.value.saleCampaigns = false

  } catch (error) {
    console.error('❌ Error loading dashboard data:', error)
    // alert('Không thể tải dữ liệu từ API. Vui lòng kiểm tra:\n1. Server có chạy không?\n2. Port có đúng không?\n3. Auth token có hợp lệ không?')
    showError(
      'Không thể tải dữ liệu',
      'Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.'
    )
    // Reset to empty state instead of mock data
    stats.value = {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalNews: 0,
      totalRevenue: 0,
      monthlyGrowth: 0
    }

    // Empty chart data
    salesChartData.value = {
      labels: [],
      datasets: []
    }

    ordersStatusChartData.value = {
      labels: [],
      datasets: []
    }

    // Empty dashboard data
    dashboardData.value = {
      overview: {},
      orderStats: {},
      contactStats: {},
      topProducts: [],
      revenueChart: [],
      orderChart: [],
      monthlyRevenue: [],
      userAnalytics: {},
      productAnalytics: {}
    }
  } finally {
    loading.value.dashboard = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.dashboard-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.access-denied {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.access-denied .alert {
  max-width: 500px;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* Info Cards */
.info-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.info-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Quick Management Cards */
.quick-management-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.quick-management-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.quick-management-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.quick-management-card:hover::before {
  transform: scaleX(1);
}

.quick-management-card .card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  transition: all 0.3s ease;
}

.quick-management-card.product-card .card-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.quick-management-card.category-card .card-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.quick-management-card.brand-card .card-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.quick-management-card.order-card .card-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.quick-management-card.user-card .card-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.quick-management-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.quick-management-card .card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.quick-management-card .card-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.quick-management-card .card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-management-card .btn {
  border-radius: 8px;
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.quick-management-card .btn:hover {
  transform: translateY(-1px);
}

/* Loading States */
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-item {
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Product Lists */
.top-products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.product-item:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateX(4px);
}

.product-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Stock Alerts */
.stock-alerts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stock-item {
  padding: 1rem;
  background: #fff5f5;
  border-radius: 12px;
  border: 1px solid #fed7d7;
  transition: all 0.3s ease;
}

.stock-item:hover {
  background: #fef5e7;
  border-color: #fbd38d;
}

.stock-info {
  width: 100%;
}

.stock-level {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem 0;
  }
  
  .product-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .product-rank {
    margin-right: 0;
  }
  
  .info-card .card-header,
  .info-card .card-body {
    padding: 1rem;
  }
}
</style>
