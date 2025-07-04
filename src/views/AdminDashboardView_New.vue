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
        <DashboardHeader 
          :notifications="5" 
          :online-users="12" 
        />

        <!-- Enhanced Stats -->
        <EnhancedStats 
          :stats="enhancedStats" 
          @refresh="refreshStats"
        />

        <!-- Enhanced Actions -->
        <EnhancedActions 
          :actions="enhancedActions" 
          @action-click="handleQuickAction"
        />

        <!-- Charts Section -->
        <ChartsSection 
          :sales-data="salesChartData"
          :orders-data="ordersStatusChartData"
          :selected-period="selectedPeriod"
          @period-change="handlePeriodChange"
          @download-chart="handleDownloadChart"
          @refresh-chart="handleRefreshChart"
        />

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

const router = useRouter()
const { user, isAdmin, isContributor } = useAuth()
const { fetchActiveCampaigns, activeCampaigns } = useSaleCampaigns()

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

const loading = ref({
  saleCampaigns: false
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
const salesChartData = computed(() => ({
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  datasets: [
    {
      label: 'Doanh thu (triệu đồng)',
      data: [120, 190, 300, 500, 200, 300, 450, 300, 250, 400, 380, 500],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    },
    {
      label: 'Đơn hàng',
      data: [65, 85, 120, 180, 90, 150, 200, 130, 110, 170, 160, 220],
      borderColor: '#48bb78',
      backgroundColor: 'rgba(72, 187, 120, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }
  ]
}))

const ordersStatusChartData = computed(() => ({
  labels: ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
  datasets: [
    {
      data: [30, 25, 35, 10],
      backgroundColor: [
        '#ed8936',
        '#4299e1',
        '#48bb78',
        '#f56565'
      ],
      borderWidth: 0,
      hoverOffset: 10
    }
  ]
}))

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

  try {
    // Load dashboard stats
    const dashboardData = await adminDashboardApi.getDashboardStats()
    const data = dashboardData.data || {}
    stats.value = {
      totalUsers: data.total_users || 1250,
      totalProducts: data.total_products || 485,
      totalOrders: data.total_orders || 324,
      totalNews: data.total_news || 56,
      totalRevenue: data.total_revenue || 2540000,
      monthlyGrowth: data.monthly_growth || 18
    }

    // Load active sale campaigns
    loading.value.saleCampaigns = true
    await fetchActiveCampaigns()
    activeSaleCampaigns.value = activeCampaigns.value.slice(0, 5) // Show only 5 recent
    loading.value.saleCampaigns = false

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Use mock data if API fails
    stats.value = {
      totalUsers: 1250,
      totalProducts: 485,
      totalOrders: 324,
      totalNews: 56,
      totalRevenue: 2540000,
      monthlyGrowth: 18
    }
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
