<template>
  <div class="admin-dashboard">
    <div class="container-fluid">
      <!-- Permission Check -->
      <div v-if="!canAccess" class="alert alert-danger">
        <div class="d-flex align-items-center">
          <i class="bi bi-shield-exclamation fs-3 me-3"></i>
          <div>
            <h4>Truy cập bị từ chối</h4>
            <p class="mb-0">Bạn không có quyền truy cập trang này. Cần có vai trò Admin hoặc Contributor.</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content">
        <!-- Enhanced Header -->
        <DashboardHeader :notifications="5" :online-users="12" />

        <!-- Enhanced Stats -->
        <EnhancedStats :stats="enhancedStats" @refresh="refreshStats" />

        <!-- Enhanced Actions -->
        <EnhancedActions :actions="enhancedActions" @action-click="handleQuickAction" />

        <!-- Charts Section -->
        <ChartsSection :sales-data="salesChartData" :orders-data="ordersStatusChartData" :selected-period="selectedPeriod" @period-change="handlePeriodChange" @download-chart="handleDownloadChart" @refresh-chart="handleRefreshChart" />

        <!-- Top Products & Analytics -->
        <div class="analytics-section mb-4">
          <div class="row g-4">
            <!-- Top Selling Products -->
            <div class="col-lg-6">
              <div class="management-card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-trophy me-2"></i>
                    Sản phẩm bán chạy
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="loading.dashboard" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                  </div>
                  <div v-else-if="dashboardData.topProducts?.length === 0" class="empty-state">
                    <i class="bi bi-box fs-1 text-muted"></i>
                    <h6>Chưa có dữ liệu</h6>
                  </div>
                  <div v-else class="top-products-list">
                    <div v-for="(product, index) in dashboardData.topProducts.slice(0, 5)" :key="product.id" class="product-item">
                      <div class="product-rank">{{ index + 1 }}</div>
                      <div class="product-info">
                        <h6 class="product-name">{{ product.name }}</h6>
                        <div class="product-meta">
                          <span class="badge bg-success">{{ product.total_sold }} đã bán</span>
                          <small class="text-muted ms-2">{{ formatCurrency(product.price) }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Low Stock Alert -->
            <div class="col-lg-6">
              <div class="management-card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Cảnh báo tồn kho
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="loading.dashboard" class="text-center py-4">
                    <div class="spinner-border text-warning" role="status"></div>
                  </div>
                  <div v-else-if="!dashboardData.productAnalytics?.low_stock_products?.length" class="empty-state">
                    <i class="bi bi-check-circle fs-1 text-success"></i>
                    <h6>Tất cả sản phẩm đều có đủ tồn kho</h6>
                  </div>
                  <div v-else class="stock-alerts">
                    <div v-for="product in dashboardData.productAnalytics.low_stock_products.slice(0, 5)" :key="product.id" class="stock-item">
                      <div class="stock-info">
                        <h6 class="product-name">{{ product.name }}</h6>
                        <div class="stock-level">
                          <span class="badge bg-warning">{{ product.stock }} còn lại</span>
                          <small class="text-muted ms-2">{{ formatCurrency(product.price) }}</small>
                        </div>
                      </div>
                      <div class="stock-status">
                        <i class="bi bi-exclamation-triangle text-warning"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Management Cards -->
        <div class="management-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="bi bi-kanban"></i>
              Quản lý nội dung
            </h3>
          </div>

          <div class="row g-4">
            <!-- Sale Campaigns -->
            <div class="col-lg-8">
              <div class="management-card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-tags me-2"></i>
                    Chiến dịch khuyến mãi
                  </h5>
                  <button v-if="canManageSaleCampaigns" @click="createSaleCampaign" class="btn btn-primary btn-sm">
                    <i class="bi bi-plus-circle me-1"></i> Tạo mới
                  </button>
                </div>
                <div class="card-body">
                  <div v-if="loading.saleCampaigns" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                  </div>
                  <div v-else-if="activeSaleCampaigns.length === 0" class="empty-state">
                    <i class="bi bi-tags fs-1 text-muted"></i>
                    <h6>Chưa có chiến dịch nào</h6>
                    <p class="text-muted">Tạo chiến dịch khuyến mãi đầu tiên</p>
                  </div>
                  <div v-else class="campaigns-list">
                    <div v-for="campaign in activeSaleCampaigns" :key="campaign.id" class="campaign-item">
                      <div class="campaign-info">
                        <h6 class="campaign-name">{{ campaign.name }}</h6>
                        <div class="campaign-meta">
                          <span class="badge bg-success">{{ campaign.sale_products?.[0]?.discount_percentage || 10 }}% OFF</span>
                          <small class="text-muted ms-2">{{ formatDate(campaign.start_date) }} - {{ formatDate(campaign.end_date) }}</small>
                        </div>
                      </div>
                      <div class="campaign-actions">
                        <button @click="editSaleCampaign(campaign)" class="btn btn-outline-primary btn-sm me-1">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button @click="viewSaleCampaign(campaign)" class="btn btn-outline-info btn-sm">
                          <i class="bi bi-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Campaign Stats -->
            <div class="col-lg-4">
              <div class="management-card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-graph-up me-2"></i>
                    Thống kê khuyến mãi
                  </h5>
                </div>
                <div class="card-body">
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-value">{{ activeSaleCampaigns.length }}</div>
                      <div class="stat-label">Chiến dịch đang hoạt động</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ totalSaleProducts }}</div>
                      <div class="stat-label">Sản phẩm đang giảm giá</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ averageDiscount }}%</div>
                      <div class="stat-label">Giảm giá trung bình</div>
                    </div>
                  </div>
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
    id: 'create-product',
    title: 'Tạo sản phẩm mới',
    description: 'Thêm sản phẩm mới vào danh mục',
    icon: 'bi-plus-circle-fill',
    color: 'primary' as const,
    shortcut: 'Ctrl+N'
  },
  {
    id: 'manage-orders',
    title: 'Quản lý đơn hàng',
    description: 'Xem và xử lý đơn hàng mới',
    icon: 'bi-clipboard-check-fill',
    color: 'success' as const,
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
    description: 'Xem và quản lý tài khoản người dùng',
    icon: 'bi-person-gear',
    color: 'info' as const
  },
  {
    id: 'revenue-report',
    title: 'Báo cáo doanh thu',
    description: 'Xem báo cáo chi tiết về doanh thu',
    icon: 'bi-graph-up-arrow',
    color: 'success' as const
  },
  {
    id: 'system-settings',
    title: 'Cài đặt hệ thống',
    description: 'Cấu hình và cài đặt hệ thống',
    icon: 'bi-gear-fill',
    color: 'danger' as const
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
    case 'create-product':
      router.push('/admin/products/create')
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
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

.management-section {
  margin-top: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.management-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.management-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.management-card .card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.management-card .card-body {
  padding: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.campaigns-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.campaign-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.campaign-item:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.campaign-info {
  flex: 1;
}

.campaign-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.campaign-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.campaign-actions {
  display: flex;
  gap: 0.5rem;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* Top Products & Stock Alerts */
.analytics-section {
  margin-bottom: 2rem;
}

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
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
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
  gap: 0.5rem;
}

.stock-alerts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  transition: all 0.2s ease;
}

.stock-item:hover {
  background: #fef5e7;
  border-color: #fbd38d;
}

.stock-info {
  flex: 1;
}

.stock-level {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.stock-status {
  font-size: 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem 0;
  }

  .stats-grid {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1;
    min-width: 150px;
  }
}
</style>
