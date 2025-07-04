<template>
  <div class="charts-section">
    <div class="section-header">
      <h3 class="section-title">
        <i class="bi bi-bar-chart-line"></i>
        Phân tích dữ liệu
      </h3>
      <div class="chart-controls">
        <div class="period-selector">
          <button 
            v-for="period in periods" 
            :key="period.value"
            @click="selectedPeriod = period.value" 
            class="period-btn"
            :class="{ active: selectedPeriod === period.value }"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- Sales Chart -->
      <div class="col-xl-8 col-lg-12">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-info">
              <h5 class="chart-title">
                <i class="bi bi-graph-up"></i>
                Doanh thu & Đơn hàng
              </h5>
              <p class="chart-subtitle">Theo dõi xu hướng kinh doanh</p>
            </div>
            <div class="chart-actions">
              <button class="action-btn" @click="downloadChart('sales')">
                <i class="bi bi-download"></i>
              </button>
              <button class="action-btn" @click="refreshChart('sales')">
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
          <div class="chart-body">
            <SalesChart 
              :data="salesChartData" 
              type="line" 
              :height="350"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>

      <!-- Status Chart -->
      <div class="col-xl-4 col-lg-12">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-info">
              <h5 class="chart-title">
                <i class="bi bi-pie-chart"></i>
                Trạng thái đơn hàng
              </h5>
              <p class="chart-subtitle">Phân bổ theo trạng thái</p>
            </div>
          </div>
          <div class="chart-body">
            <SalesChart 
              :data="ordersStatusChartData" 
              type="doughnut" 
              :height="350"
            />
            <div class="chart-legend">
              <div 
                v-for="(item, index) in (ordersStatusChartData.datasets[0]?.data || [])" 
                :key="index"
                class="legend-item"
              >
                <div 
                  class="legend-color" 
                  :style="{ backgroundColor: ordersStatusChartData.datasets[0]?.backgroundColor?.[index] || '#ccc' }"
                ></div>
                <span class="legend-label">{{ ordersStatusChartData.labels[index] }}</span>
                <span class="legend-value">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Charts Row -->
    <div class="row g-4 mt-2">
      <!-- Revenue by Category -->
      <div class="col-lg-6">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-info">
              <h5 class="chart-title">
                <i class="bi bi-tags"></i>
                Doanh thu theo danh mục
              </h5>
              <p class="chart-subtitle">Top 5 danh mục bán chạy</p>
            </div>
          </div>
          <div class="chart-body">
            <SalesChart 
              :data="categoryRevenueData" 
              type="bar" 
              :height="300"
            />
          </div>
        </div>
      </div>

      <!-- User Growth -->
      <div class="col-lg-6">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-info">
              <h5 class="chart-title">
                <i class="bi bi-people"></i>
                Tăng trưởng người dùng
              </h5>
              <p class="chart-subtitle">Số lượng đăng ký mới</p>
            </div>
          </div>
          <div class="chart-body">
            <SalesChart 
              :data="userGrowthData" 
              type="line" 
              :height="300"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SalesChart from '@/components/charts/SalesChart.vue'

interface Props {
  salesData: any
  ordersData: any
  contactsData?: any
  loading?: boolean
  selectedPeriod?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedPeriod: '30d',
  loading: false
})

const emit = defineEmits<{
  periodChange: [period: string]
  downloadChart: [chartType: string]
  refreshChart: [chartType: string]
}>()

const selectedPeriod = ref(props.selectedPeriod)

const periods = [
  { label: '7 ngày', value: '7d' },
  { label: '30 ngày', value: '30d' },
  { label: '3 tháng', value: '90d' },
  { label: '1 năm', value: '1y' }
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  }
}

const salesChartData = computed(() => props.salesData || {
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
})

const ordersStatusChartData = computed(() => props.ordersData || {
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
})

const categoryRevenueData = computed(() => ({
  labels: ['Balo du lịch', 'Balo laptop', 'Túi xách', 'Balo học sinh', 'Phụ kiện'],
  datasets: [
    {
      label: 'Doanh thu (triệu đồng)',
      data: [450, 380, 290, 350, 180],
      backgroundColor: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(72, 187, 120, 0.8)',
        'rgba(237, 137, 54, 0.8)',
        'rgba(66, 153, 225, 0.8)',
        'rgba(245, 101, 101, 0.8)'
      ],
      borderRadius: 8,
      borderSkipped: false,
    }
  ]
}))

const userGrowthData = computed(() => ({
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
  datasets: [
    {
      label: 'Người dùng mới',
      data: [120, 150, 180, 220, 190, 250],
      borderColor: '#9f7aea',
      backgroundColor: 'rgba(159, 122, 234, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }
  ]
}))

const downloadChart = (chartType: string) => {
  emit('downloadChart', chartType)
}

const refreshChart = (chartType: string) => {
  emit('refreshChart', chartType)
}

watch(selectedPeriod, (newPeriod) => {
  emit('periodChange', newPeriod)
})
</script>

<style scoped>
.charts-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #f7fafc;
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

.chart-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.period-selector {
  display: flex;
  background: #f7fafc;
  border-radius: 12px;
  padding: 4px;
  gap: 2px;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn:hover {
  color: #4a5568;
  background: rgba(102, 126, 234, 0.1);
}

.period-btn.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.chart-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.chart-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.chart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.chart-info {
  flex: 1;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

.chart-body {
  padding: 1.5rem;
  position: relative;
}

.chart-legend {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: #f8fafc;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;
}

.legend-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #2d3748;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .period-selector {
    width: 100%;
    justify-content: space-between;
  }
  
  .period-btn {
    flex: 1;
    text-align: center;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .chart-actions {
    align-self: flex-end;
  }
}
</style>
