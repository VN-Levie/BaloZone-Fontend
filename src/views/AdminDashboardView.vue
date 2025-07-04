<template>
  <div class="admin-dashboard">
    <div class="container-fluid mt-4">
      <!-- Header -->
      <div class="dashboard-header mb-4">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="dashboard-title">
              <i class="bi bi-speedometer2"></i>
              Admin Dashboard
            </h1>
            <p class="dashboard-subtitle">Quản lý và theo dõi hoạt động của BaloZone</p>
          </div>
          <div class="col-md-4 text-end">
            <div class="last-updated">
              <small class="text-muted">
                <i class="bi bi-clock"></i>
                Cập nhật lần cuối: {{ formatDate(new Date()) }}
              </small>
            </div>
          </div>
        </div>
      </div>
      
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
      <div v-else>
        <!-- Quick Stats with Animation -->
        <QuickStats :stats="quickStats" />

        <!-- Quick Actions -->
        <div class="section-header">
          <h3><i class="bi bi-lightning-charge"></i> Thao tác nhanh</h3>
        </div>
        <AdminActionCard :actions="quickActions" @action-click="handleQuickAction" />

        <!-- Analytics Charts -->
        <div class="section-header">
          <h3><i class="bi bi-bar-chart"></i> Phân tích dữ liệu</h3>
        </div>
        <div class="row mb-4">
          <!-- Sales Chart -->
          <div class="col-xl-8 col-lg-7 mb-4">
            <div class="chart-card">
              <div class="chart-header">
                <h5><i class="bi bi-graph-up"></i> Doanh thu theo tháng</h5>
                <div class="chart-controls">
                  <button 
                    v-for="period in ['7d', '30d', '90d', '1y']" 
                    :key="period"
                    @click="selectedPeriod = period"
                    class="btn btn-sm"
                    :class="selectedPeriod === period ? 'btn-primary' : 'btn-outline-secondary'"
                  >
                    {{ period }}
                  </button>
                </div>
              </div>
              <SalesChart 
                :data="salesChartData" 
                type="line" 
                :height="300"
              />
            </div>
          </div>

          <!-- Orders Status Chart -->
          <div class="col-xl-4 col-lg-5 mb-4">
            <div class="chart-card">
              <div class="chart-header">
                <h5><i class="bi bi-pie-chart"></i> Trạng thái đơn hàng</h5>
              </div>
              <SalesChart 
                :data="ordersStatusChartData" 
                type="doughnut" 
                :height="300"
              />
            </div>
          </div>
        </div>

        <!-- Sale Campaigns Management -->
        <div class="section-header">
          <h3><i class="bi bi-tags"></i> Quản lý chiến dịch khuyến mãi</h3>
        </div>
        <div class="row mb-4">
          <div class="col-lg-8">
            <div class="management-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Chiến dịch đang hoạt động</h5>
                <button
                  v-if="canManageSaleCampaigns"
                  @click="createSaleCampaign"
                  class="btn btn-primary btn-sm"
                >
                  <i class="bi bi-plus-circle"></i> Tạo chiến dịch mới
                </button>
              </div>
              <div class="card-body">
                <div v-if="loading.saleCampaigns" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="activeSaleCampaigns.length === 0" class="empty-state">
                    <i class="bi bi-tags fs-1 text-muted"></i>
                    <p class="text-muted">Không có chiến dịch khuyến mãi nào đang hoạt động</p>
                  </div>
                  <div v-else class="campaigns-list">
                    <div
                      v-for="campaign in activeSaleCampaigns"
                      :key="campaign.id"
                      class="campaign-item"
                    >
                      <div class="campaign-info">
                        <div class="campaign-name">{{ campaign.name }}</div>
                        <div class="campaign-meta">
                          <span class="badge bg-success me-2">{{ campaign.status }}</span>
                          <small class="text-muted">
                            {{ campaign.sale_products?.length || 0 }} sản phẩm
                          </small>
                        </div>
                      </div>
                      <div class="campaign-actions">
                        <button
                          @click="editSaleCampaign(campaign)"
                          class="btn btn-outline-primary btn-sm me-1"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          @click="viewSaleCampaign(campaign)"
                          class="btn btn-outline-info btn-sm"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="management-card">
              <div class="card-header">
                <h5 class="mb-0">Thống kê khuyến mãi</h5>
              </div>
              <div class="card-body">
                <div class="campaign-stats">
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
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{ stats.totalOrders || 0 }}</h4>
                    <p class="mb-0">Total Orders</p>
                  </div> 
                  <div class="align-self-center">
                    <i class="fas fa-shopping-cart fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4>{{ stats.totalNews || 0 }}</h4>
                    <p class="mb-0">Total News</p>
                  </div>
                  <div class="align-self-center">
                    <i class="fas fa-newspaper fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Management Sections -->
        <div class="row">
          <!-- Products Management -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Products Management</h5>
                <button
                  v-if="canManageProducts"
                  @click="showCreateProduct = true"
                  class="btn btn-primary btn-sm"
                >
                  <i class="fas fa-plus"></i> Add Product
                </button>
              </div>
              <div class="card-body">
                <div v-if="loading.products" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="recentProducts.length === 0" class="text-muted text-center py-3">
                    No products found
                  </div>
                  <div v-else class="list-group list-group-flush">
                    <div
                      v-for="product in recentProducts"
                      :key="product.id"
                      class="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div class="me-auto">
                        <div class="fw-bold">{{ product.name }}</div>
                        <small class="text-muted">{{ formatPrice(product.price) }}</small>
                      </div>
                      <div>
                        <button
                          v-if="canManageProducts"
                          @click="editProduct(product)"
                          class="btn btn-outline-primary btn-sm me-1"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          v-if="canManageProducts"
                          @click="deleteProduct(product.id)"
                          class="btn btn-outline-danger btn-sm"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- News Management -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">News Management</h5>
                <button
                  v-if="canManageNews"
                  @click="showCreateNews = true"
                  class="btn btn-primary btn-sm"
                >
                  <i class="fas fa-plus"></i> Add News
                </button>
              </div>
              <div class="card-body">
                <div v-if="loading.news" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="recentNews.length === 0" class="text-muted text-center py-3">
                    No news found
                  </div>
                  <div v-else class="list-group list-group-flush">
                    <div
                      v-for="article in recentNews"
                      :key="article.id"
                      class="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div class="me-auto">
                        <div class="fw-bold">{{ article.title }}</div>
                        <small class="text-muted">{{ formatDate(article.created_at) }}</small>
                      </div>
                      <div>
                        <button
                          v-if="canManageNews"
                          @click="editNews(article)"
                          class="btn btn-outline-primary btn-sm me-1"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          v-if="canManageNews"
                          @click="deleteNews(article.id)"
                          class="btn btn-outline-danger btn-sm"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders and Users Management (Admin Only) -->
        <div v-if="isAdmin" class="row">
          <!-- Orders Management -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Recent Orders</h5>
              </div>
              <div class="card-body">
                <div v-if="loading.orders" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="recentOrders.length === 0" class="text-muted text-center py-3">
                    No recent orders
                  </div>
                  <div v-else class="list-group list-group-flush">
                    <div
                      v-for="order in recentOrders"
                      :key="order.id"
                      class="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div class="me-auto">
                        <div class="fw-bold">Order #{{ order.id }}</div>
                        <small class="text-muted">{{ formatPrice(order.total_price) }}</small>
                      </div>
                      <span :class="getOrderStatusBadgeClass(order.payment_status)">
                        {{ order.payment_status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Users Management -->
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Recent Users</h5>
              </div>
              <div class="card-body">
                <div v-if="loading.users" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div v-else>
                  <div v-if="recentUsers.length === 0" class="text-muted text-center py-3">
                    No recent users
                  </div>
                  <div v-else class="list-group list-group-flush">
                    <div
                      v-for="user in recentUsers"
                      :key="user.id"
                      class="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div class="me-auto">
                        <div class="fw-bold">{{ user.name }}</div>
                        <small class="text-muted">{{ user.email }}</small>
                      </div>
                      <div>
                        <RoleBadge
                          v-for="role in user.roles"
                          :key="role.id"
                          :role="role"
                          class="me-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3 mb-2" v-if="canManageProducts">
                    <router-link to="/admin/products" class="btn btn-outline-primary w-100">
                      <i class="fas fa-box"></i> Manage Products
                    </router-link>
                  </div>
                  <div class="col-md-3 mb-2" v-if="canManageNews">
                    <router-link to="/admin/news" class="btn btn-outline-info w-100">
                      <i class="fas fa-newspaper"></i> Manage News
                    </router-link>
                  </div>
                  <div class="col-md-3 mb-2" v-if="isAdmin">
                    <router-link to="/admin/orders" class="btn btn-outline-warning w-100">
                      <i class="fas fa-shopping-cart"></i> Manage Orders
                    </router-link>
                  </div>
                  <div class="col-md-3 mb-2" v-if="isAdmin">
                    <router-link to="/admin/users" class="btn btn-outline-success w-100">
                      <i class="fas fa-users"></i> Manage Users
                    </router-link>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useRoles } from '../composables/useRoles'
import { useAdminManagement } from '../composables/useAdminManagement'
import { useSaleCampaigns } from '../composables/useSaleCampaigns'
import { adminDashboardApi } from '../services/api'
import { formatPrice } from '../utils'
import type { SaleCampaign } from '../types'

// Import new components
import QuickStats from '../components/QuickStats.vue'
import AdminActionCard from '../components/AdminActionCard.vue'
import SalesChart from '../components/charts/SalesChart.vue'

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
  products: false,
  news: false,
  orders: false,
  users: false,
  saleCampaigns: false
})

const selectedPeriod = ref('30d')
const activeSaleCampaigns = ref<SaleCampaign[]>([])

// Quick Stats Data
const quickStats = computed(() => [
  {
    label: 'Tổng người dùng',
    value: stats.value.totalUsers,
    icon: 'bi-people-fill',
    color: 'primary' as const,
    change: 12,
    isAnimated: true
  },
  {
    label: 'Tổng sản phẩm',
    value: stats.value.totalProducts,
    icon: 'bi-box-seam-fill',
    color: 'success' as const,
    change: 8,
    isAnimated: true
  },
  {
    label: 'Đơn hàng',
    value: stats.value.totalOrders,
    icon: 'bi-cart-fill',
    color: 'warning' as const,
    change: 15,
    isAnimated: true
  },
  {
    label: 'Doanh thu',
    value: stats.value.totalRevenue,
    icon: 'bi-currency-dollar',
    color: 'info' as const,
    change: 22,
    isAnimated: true
  }
])

// Quick Actions Data
const quickActions = computed(() => [
  {
    id: 'create-product',
    title: 'Tạo sản phẩm mới',
    description: 'Thêm sản phẩm mới vào danh mục',
    icon: 'bi-plus-circle-fill',
    color: 'primary' as const
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
    color: 'warning' as const
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
    icon: 'bi bi-gear-fill',
    color: 'danger' as const,
    buttonText: 'Cài đặt',
    action: 'system-settings'
  }
])

// Chart Data
const salesChartData = computed(() => ({
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  datasets: [
    {
      label: 'Doanh thu (triệu đồng)',
      data: [120, 190, 300, 500, 200, 300, 450, 300, 250, 400, 380, 500],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      borderWidth: 3,
      fill: true
    },
    {
      label: 'Đơn hàng',
      data: [65, 85, 120, 180, 90, 150, 200, 130, 110, 170, 160, 220],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      borderWidth: 3,
      fill: true
    }
  ]
}))

const ordersStatusChartData = computed(() => ({
  labels: ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
  datasets: [
    {
      label: 'Trạng thái đơn hàng',
      data: [30, 25, 35, 10],
      backgroundColor: [
        '#ffc107',
        '#17a2b8',
        '#28a745',
        '#dc3545'
      ],
      borderWidth: 0
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
  const allDiscounts = activeSaleCampaigns.value.flatMap(campaign => 
    campaign.sale_products?.map(sp => sp.discount_percentage || 0) || []
  )
  if (allDiscounts.length === 0) return 0
  return Math.round(allDiscounts.reduce((sum, discount) => sum + discount, 0) / allDiscounts.length)
})

// Methods
const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleQuickAction = (action: any) => {
  switch (action.action) {
    case 'create-product':
      router.push('/admin/products/new')
      break
    case 'manage-orders':
      router.push('/admin/orders')
      break
    case 'create-sale-campaign':
      router.push('/admin/sale-campaigns/new')
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
  }
}

const createSaleCampaign = () => {
  router.push('/admin/sale-campaigns/new')
}

const editSaleCampaign = (campaign: SaleCampaign) => {
  router.push(`/admin/sale-campaigns/${campaign.id}/edit`)
}

const viewSaleCampaign = (campaign: SaleCampaign) => {
  router.push(`/sale-campaigns/${campaign.slug}`)
}

const loadDashboardData = async () => {
  if (!canAccess.value) return

  try {
    // Load dashboard stats
    const dashboardData = await adminDashboardApi.getDashboardStats()
    const data = dashboardData.data || {}
    stats.value = {
      totalUsers: data.total_users || 0,
      totalProducts: data.total_products || 0,
      totalOrders: data.total_orders || 0,
      totalNews: data.total_news || 0,
      totalRevenue: data.total_revenue || 0,
      monthlyGrowth: data.monthly_growth || 0
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
.admin-dashboard .card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.admin-dashboard .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.admin-dashboard .list-group-item {
  border-left: none;
  border-right: none;
}

.admin-dashboard .list-group-item:first-child {
  border-top: none;
}

.admin-dashboard .list-group-item:last-child {
  border-bottom: none;
}

/* Enhanced Dashboard Styles */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

.last-updated {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.section-header {
  margin: 40px 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 3px solid #f8f9fa;
}

.section-header h3 {
  color: #2c3e50;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f8f9fa;
}

.chart-header h5 {
  margin: 0;
  color: #2c3e50;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.management-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.management-card .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 2px solid #dee2e6;
  padding: 20px 25px;
}

.management-card .card-body {
  padding: 25px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-state i {
  margin-bottom: 15px;
}

.campaigns-list {
  max-height: 400px;
  overflow-y: auto;
}

.campaign-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.campaign-item:last-child {
  border-bottom: none;
}

.campaign-info {
  flex: 1;
}

.campaign-name {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.campaign-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.campaign-actions {
  display: flex;
  gap: 8px;
}

.campaign-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 2rem;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .campaign-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .campaign-actions {
    align-self: stretch;
    justify-content: flex-end;
  }
}
</style>
