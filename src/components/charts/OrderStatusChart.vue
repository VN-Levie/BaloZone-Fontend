<template>
  <div class="order-status-chart">
    <canvas ref="chartCanvas" width="300" height="250"></canvas>

    <!-- Legend -->
    <div class="legend mt-3">
      <div class="row g-2">
        <div v-for="(item, index) in chartData" :key="item.label" class="col-6">
          <div class="d-flex align-items-center">
            <div
              class="legend-color me-2"
              :style="{ backgroundColor: item.color }"
            ></div>
            <div class="flex-grow-1">
              <div class="small fw-semibold">{{ item.label }}</div>
              <div class="small text-muted">{{ item.value }} đơn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import type { OrderStats } from '@/types'

interface Props {
  data: OrderStats
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)

const chartData = computed(() => [
  { label: 'Chờ xử lý', value: props.data.pending, color: '#ffc107' },
  { label: 'Đang xử lý', value: props.data.processing, color: '#0dcaf0' },
  { label: 'Đã gửi', value: props.data.shipped, color: '#0d6efd' },
  { label: 'Đã giao', value: props.data.delivered, color: '#198754' },
  { label: 'Đã hủy', value: props.data.cancelled, color: '#dc3545' }
])

const drawChart = () => {
  if (!chartCanvas.value) return

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Chart settings
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 20

  // Calculate total and angles
  const total = chartData.value.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) {
    // Draw empty state
    ctx.strokeStyle = '#dee2e6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.fillStyle = '#6c757d'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Không có dữ liệu', centerX, centerY)
    return
  }

  let currentAngle = -Math.PI / 2 // Start from top

  // Draw pie slices
  chartData.value.forEach((item) => {
    if (item.value > 0) {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      ctx.fillStyle = item.color
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      // Draw border
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      currentAngle += sliceAngle
    }
  })

  // Draw center circle (donut effect)
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI)
  ctx.fill()

  // Draw total in center
  ctx.fillStyle = '#495057'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(total.toString(), centerX, centerY - 5)

  ctx.font = '12px Arial'
  ctx.fillStyle = '#6c757d'
  ctx.fillText('Tổng đơn hàng', centerX, centerY + 15)
}

onMounted(() => {
  nextTick(() => {
    drawChart()
  })
})

watch(() => props.data, () => {
  nextTick(() => {
    drawChart()
  })
}, { deep: true })
</script>

<style scoped>
.order-status-chart {
  text-align: center;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
