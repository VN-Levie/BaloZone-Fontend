<template>
  <div class="revenue-chart">
    <canvas ref="chartCanvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import type { ChartDataPoint } from '@/types'

interface Props {
  data: ChartDataPoint[]
  height?: number
  width?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  width: 800
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)

const formatCurrency = (amount: number | string): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(Number(amount))
}

const formatShortCurrency = (amount: number | string): string => {
  const num = Number(amount)
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const drawChart = () => {
  if (!chartCanvas.value || !props.data.length) return

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size
  canvas.width = props.width
  canvas.height = props.height

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Chart dimensions
  const padding = 60
  const chartWidth = canvas.width - 2 * padding
  const chartHeight = canvas.height - 2 * padding

  // Prepare data
  const revenues = props.data.map(d => Number(d.revenue || 0))
  const dates = props.data.map(d => {
    const date = new Date(d.date)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  })

  const maxRevenue = Math.max(...revenues)
  const minRevenue = Math.min(...revenues)
  const revenueRange = maxRevenue - minRevenue || 1

  // Draw grid lines and labels
  ctx.strokeStyle = '#e9ecef'
  ctx.lineWidth = 1
  ctx.font = '12px Arial'
  ctx.fillStyle = '#6c757d'

  // Horizontal grid lines (Y-axis)
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i
    const value = maxRevenue - (revenueRange / 5) * i

    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(padding + chartWidth, y)
    ctx.stroke()

    // Y-axis labels
    ctx.textAlign = 'right'
    ctx.fillText(formatShortCurrency(value), padding - 10, y + 4)
  }

  // Vertical grid lines (X-axis)
  const stepX = chartWidth / (dates.length - 1)
  for (let i = 0; i < dates.length; i++) {
    const x = padding + stepX * i

    ctx.beginPath()
    ctx.moveTo(x, padding)
    ctx.lineTo(x, padding + chartHeight)
    ctx.stroke()

    // X-axis labels
    ctx.textAlign = 'center'
    ctx.fillText(dates[i], x, padding + chartHeight + 20)
  }

  // Draw revenue line
  ctx.strokeStyle = '#0d6efd'
  ctx.lineWidth = 3
  ctx.beginPath()

  for (let i = 0; i < revenues.length; i++) {
    const x = padding + stepX * i
    const y = padding + chartHeight - ((revenues[i] - minRevenue) / revenueRange) * chartHeight

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  // Draw data points
  ctx.fillStyle = '#0d6efd'
  for (let i = 0; i < revenues.length; i++) {
    const x = padding + stepX * i
    const y = padding + chartHeight - ((revenues[i] - minRevenue) / revenueRange) * chartHeight

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  }

  // Fill area under curve
  const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
  gradient.addColorStop(0, 'rgba(13, 110, 253, 0.1)')
  gradient.addColorStop(1, 'rgba(13, 110, 253, 0.01)')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(padding, padding + chartHeight)

  for (let i = 0; i < revenues.length; i++) {
    const x = padding + stepX * i
    const y = padding + chartHeight - ((revenues[i] - minRevenue) / revenueRange) * chartHeight
    ctx.lineTo(x, y)
  }

  ctx.lineTo(padding + chartWidth, padding + chartHeight)
  ctx.closePath()
  ctx.fill()
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
.revenue-chart {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
