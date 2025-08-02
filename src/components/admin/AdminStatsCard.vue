<template>
  <div class="card border-0 shadow-sm h-100 stats-card" :class="cardClass">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
          <div class="stat-icon" :class="iconBgClass">
            <i :class="iconClass"></i>
          </div>
        </div>
        <div class="flex-grow-1 ms-3">
          <div class="stat-label">{{ label }}</div>
          <div class="stat-value">{{ formattedValue }}</div>
          <div v-if="trend" class="stat-trend" :class="trendClass">
            <i :class="trendIcon"></i>
            {{ trend }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: number | string
  icon: string
  color?: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  trend?: string
  trendType?: 'up' | 'down' | 'neutral'
  format?: 'number' | 'currency' | 'percent'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  trendType: 'neutral',
  format: 'number'
})

const formattedValue = computed(() => {
  const numValue = Number(props.value)

  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      }).format(numValue)

    case 'percent':
      return `${numValue}%`

    case 'number':
    default:
      return new Intl.NumberFormat('vi-VN').format(numValue)
  }
})

const cardClass = computed(() => {
  return `stats-card-${props.color}`
})

const iconBgClass = computed(() => {
  return `bg-${props.color} bg-opacity-10`
})

const iconClass = computed(() => {
  return `${props.icon} text-${props.color} fs-4`
})

const trendClass = computed(() => {
  switch (props.trendType) {
    case 'up':
      return 'text-success'
    case 'down':
      return 'text-danger'
    default:
      return 'text-muted'
  }
})

const trendIcon = computed(() => {
  switch (props.trendType) {
    case 'up':
      return 'bi bi-arrow-up'
    case 'down':
      return 'bi bi-arrow-down'
    default:
      return 'bi bi-dash'
  }
})
</script>

<style scoped>
.stats-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.stats-card-primary {
  border-left-color: var(--bs-primary);
}

.stats-card-success {
  border-left-color: var(--bs-success);
}

.stats-card-warning {
  border-left-color: var(--bs-warning);
}

.stats-card-info {
  border-left-color: var(--bs-info);
}

.stats-card-danger {
  border-left-color: var(--bs-danger);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 1.5rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-icon i {
    font-size: 1.25rem !important;
  }
}
</style>
