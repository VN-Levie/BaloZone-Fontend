<template>
  <AdminLayout>
    <div class="dashboard-container">
      <!-- Dashboard Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1 fw-bold">Dashboard</h1>
          <p class="text-muted mb-0">Chào mừng trở lại, {{ authStore.user?.name }}!</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="refreshData" :disabled="loading">
            <i class="bi bi-arrow-clockwise me-1" :class="{ 'spinner-border spinner-border-sm': loading }"></i>
            Làm mới
          </button>
          <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
              <i class="bi bi-calendar-event me-1"></i>
              {{ selectedPeriod }}
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" @click.prevent="changePeriod('Hôm nay')">Hôm nay</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="changePeriod('7 ngày qua')">7 ngày qua</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="changePeriod('Tháng này')">Tháng này</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="changePeriod('Năm nay')">Năm nay</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <DashboardSkeleton v-if="loading" />

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        <h4 class="alert-heading">
          <i class="bi bi-exclamation-triangle me-2"></i>Lỗi tải dữ liệu
        </h4>
        <p class="mb-0">{{ error }}</p>
        <hr>
        <div class="mb-0">
          <button class="btn btn-outline-danger" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i>Thử lại
          </button>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Overview Cards -->
        <div class="row g-4 mb-4" v-if="dashboardData">
          <div class="col-xl-3 col-md-6">
            <AdminStatsCard
              label="Tổng người dùng"
              :value="dashboardData.overview.total_users"
              icon="bi bi-people-fill"
              color="primary"
              :trend="`+${dashboardData.overview.new_users_this_month} tháng này`"
              trend-type="up"
              format="number"
            />
          </div>

          <div class="col-xl-3 col-md-6">
            <AdminStatsCard
              label="Tổng đơn hàng"
              :value="dashboardData.overview.total_orders"
              icon="bi bi-cart3"
              color="success"
              :trend="`+${dashboardData.overview.orders_this_month} tháng này`"
              trend-type="up"
              format="number"
            />
          </div>

          <div class="col-xl-3 col-md-6">
            <AdminStatsCard
              label="Tổng sản phẩm"
              :value="dashboardData.overview.total_products"
              icon="bi bi-box"
              color="warning"
              trend="Hoạt động"
              trend-type="neutral"
              format="number"
            />
          </div>

          <div class="col-xl-3 col-md-6">
            <AdminStatsCard
              label="Doanh thu tháng"
              :value="dashboardData.overview.monthly_revenue"
              icon="bi bi-currency-dollar"
              color="info"
              :trend="`Tổng: ${formatCurrency(dashboardData.overview.total_revenue)}`"
              trend-type="up"
              format="currency"
            />
          </div>
        </div>

        <!-- Charts Row -->
        <div class="row g-4 mb-4">
          <!-- Revenue Chart -->
          <div class="col-xl-8">
            <AdminCard title="Biểu đồ doanh thu" title-icon="bi bi-graph-up">
              <template #header-actions>
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" :disabled="chartLoading">
                    <i v-if="chartLoading" class="bi bi-arrow-clockwise spinner-border spinner-border-sm me-1"></i>
                    {{ selectedChartPeriod }}
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" @click.prevent="changeChartPeriod('7 ngày qua')">7 ngày qua</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="changeChartPeriod('30 ngày qua')">30 ngày qua</a></li>
                    <li><a class="dropdown-item" href="#" @click.prevent="changeChartPeriod('3 tháng qua')">3 tháng qua</a></li>
                  </ul>
                </div>
              </template>

              <RevenueChart
                v-if="dashboardData?.revenue_chart && !chartLoading"
                :data="dashboardData.revenue_chart"
                :height="300"
              />
              <div v-else-if="chartLoading" class="d-flex align-items-center justify-content-center" style="height: 300px;">
                <div class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                  </div>
                  <p class="mt-2 mb-0 text-muted">Đang tải dữ liệu biểu đồ...</p>
                </div>
              </div>
              <div v-else class="d-flex align-items-center justify-content-center" style="height: 300px;">
                <div class="text-muted text-center">
                  <i class="bi bi-graph-up fs-1 d-block text-center mb-2"></i>
                  <p class="mb-0">Không có dữ liệu biểu đồ</p>
                </div>
              </div>
            </AdminCard>
          </div>

          <!-- Order Status Chart -->
          <div class="col-xl-4">
            <AdminCard title="Trạng thái đơn hàng" title-icon="bi bi-pie-chart">
              <OrderStatusChart
                v-if="dashboardData?.order_stats"
                :data="dashboardData.order_stats"
              />
              <div v-else class="d-flex align-items-center justify-content-center" style="height: 250px;">
                <div class="text-muted text-center">
                  <i class="bi bi-pie-chart fs-1 d-block text-center mb-2"></i>
                  <p class="mb-0">Không có dữ liệu</p>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>

        <!-- Content Row -->
        <div class="row g-4 mb-4">
          <!-- Top Products -->
          <div class="col-xl-6">
            <AdminCard title="Sản phẩm bán chạy" title-icon="bi bi-trophy" view-all-link="/admin/products">
              <div v-if="dashboardData?.top_products?.length" class="list-group list-group-flush">
                <div
                  v-for="(product, index) in dashboardData.top_products.slice(0, 5)"
                  :key="product.id"
                  class="list-group-item border-0 px-0 py-3"
                >
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                           style="width: 40px; height: 40px;">
                        <span class="fw-bold text-primary">{{ index + 1 }}</span>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <div class="fw-semibold">{{ product.name }}</div>
                      <div class="small text-muted">Đã bán: {{ product.total_sold }} sản phẩm</div>
                    </div>
                    <div class="text-end">
                      <div class="fw-semibold">{{ formatCurrency(product.total_revenue || 0) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <i class="bi bi-box fs-1 text-muted"></i>
                <p class="text-muted mt-2 mb-0">Chưa có dữ liệu sản phẩm</p>
              </div>
            </AdminCard>
          </div>

          <!-- Recent Activities & Quick Stats -->
          <div class="col-xl-6">
            <div class="row g-4">
              <!-- Contact Messages -->
              <div class="col-12">
                <AdminCard title="Tin nhắn liên hệ" title-icon="bi bi-envelope" view-all-link="/admin/contacts">
                  <div class="row text-center">
                    <div class="col-6">
                      <div class="border-end">
                        <div class="fs-4 fw-bold text-warning">{{ dashboardData?.contact_stats?.pending || 0 }}</div>
                        <div class="small text-muted">Chờ xử lý</div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="fs-4 fw-bold text-success">{{ dashboardData?.contact_stats?.resolved || 0 }}</div>
                      <div class="small text-muted">Đã xử lý</div>
                    </div>
                  </div>
                </AdminCard>
              </div>

              <!-- Quick Actions -->
              <div class="col-12">
                <AdminCard title="Thao tác nhanh" title-icon="bi bi-lightning">
                  <div class="row g-2">
                    <div class="col-6">
                      <router-link to="/admin/products/create" class="btn btn-outline-primary w-100">
                        <i class="bi bi-plus-circle me-1"></i>
                        Thêm sản phẩm
                      </router-link>
                    </div>
                    <div class="col-6">
                      <router-link to="/admin/orders" class="btn btn-outline-success w-100">
                        <i class="bi bi-cart3 me-1"></i>
                        Quản lý đơn hàng
                      </router-link>
                    </div>
                    <div class="col-6">
                      <router-link to="/admin/sale-campaigns/create" class="btn btn-outline-warning w-100">
                        <i class="bi bi-percent me-1"></i>
                        Tạo khuyến mãi
                      </router-link>
                    </div>
                    <div class="col-6">
                      <router-link to="/admin/contacts" class="btn btn-outline-info w-100">
                        <i class="bi bi-envelope me-1"></i>
                        Xem liên hệ
                      </router-link>
                    </div>
                  </div>
                </AdminCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { adminDashboardApi } from '@/services/api'
import { formatNumber, formatCurrency } from '@/utils/adminHelpers'
import type { DashboardStats } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminStatsCard from '@/components/admin/AdminStatsCard.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import DashboardSkeleton from '@/components/admin/DashboardSkeleton.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'
import OrderStatusChart from '@/components/charts/OrderStatusChart.vue'

// Stores
const authStore = useAuthStore()

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)
const dashboardData = ref<DashboardStats | null>(null)
const selectedPeriod = ref('Tháng này')
const selectedChartPeriod = ref('7 ngày qua')
const chartLoading = ref(false)

// Methods
const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await adminDashboardApi.getDashboardStats()
    if (response.success) {
      dashboardData.value = response.data
    } else {
      throw new Error(response.message || 'Không thể tải dữ liệu dashboard')
    }
  } catch (err: any) {
    console.error('Dashboard load error:', err)
    error.value = err.message || 'Đã có lỗi xảy ra khi tải dữ liệu'
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadDashboardData()
}

const changePeriod = (period: string) => {
  selectedPeriod.value = period
  // TODO: Implement period-based data loading
  console.log('Changed period to:', period)
}

const changeChartPeriod = async (period: string) => {
  selectedChartPeriod.value = period
  await loadChartData(period)
}

const loadChartData = async (period: string) => {
  try {
    chartLoading.value = true

    if (period === '3 tháng qua') {
      // Sử dụng API revenue cho dữ liệu theo tháng
      const response = await adminDashboardApi.getRevenueReport()
      if (response.success && dashboardData.value) {
        // Chuyển đổi dữ liệu từ monthly_data thành ChartDataPoint
        const last3Months = response.data.monthly_data.slice(-3)
        dashboardData.value.revenue_chart = last3Months.map(item => ({
          date: item.month_name,
          revenue: item.revenue
        }))
      }
    } else {
      // Với 7 ngày và 30 ngày, vẫn sử dụng dữ liệu từ dashboard stats
      // (API hiện tại chỉ hỗ trợ dữ liệu 7 ngày)
      const response = await adminDashboardApi.getDashboardStats()
      if (response.success && dashboardData.value) {
        dashboardData.value.revenue_chart = response.data.revenue_chart
      }
    }
  } catch (err: any) {
    console.error('Chart load error:', err)
  } finally {
    chartLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.list-group-item {
  transition: background-color 0.2s ease;
}

.list-group-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.spinner-border-sm {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
