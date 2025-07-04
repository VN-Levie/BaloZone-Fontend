<template>
  <div class="quick-stats mb-4">
    <div class="row g-3">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="col-xl-3 col-lg-6 col-md-6"
      >
        <div class="stat-card" :class="`stat-card-${stat.color}`">
          <div class="stat-card-inner">
            <div class="stat-icon">
              <i :class="`bi ${stat.icon}`"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">
                <span v-if="stat.isAnimated" class="animated-number" :data-value="stat.value">0</span>
                <span v-else>{{ formatStatValue(stat.value) }}</span>
              </h3>
              <p class="stat-label">{{ stat.label }}</p>
              <div v-if="stat.change" class="stat-change">
                <span 
                  class="change-indicator"
                  :class="stat.change > 0 ? 'positive' : 'negative'"
                >
                  <i :class="`bi ${stat.change > 0 ? 'bi-arrow-up' : 'bi-arrow-down'}`"></i>
                  {{ Math.abs(stat.change) }}%
                </span>
                <small class="text-muted ms-1">so với tháng trước</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

interface StatItem {
  icon: string
  label: string
  value: number
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  change?: number
  isAnimated?: boolean
}

interface Props {
  stats: StatItem[]
}

defineProps<Props>()

const formatStatValue = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toString()
}

const animateNumbers = () => {
  const animatedElements = document.querySelectorAll('.animated-number')
  
  animatedElements.forEach((element) => {
    const target = parseInt(element.getAttribute('data-value') || '0')
    let current = 0
    const increment = target / 50
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      element.textContent = formatStatValue(Math.floor(current))
    }, 20)
  })
}

onMounted(() => {
  setTimeout(() => {
    animateNumbers()
  }, 100)
})
</script>

<style scoped>
.quick-stats {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), var(--accent-color-light));
  transition: height 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card:hover::before {
  height: 6px;
}

.stat-card-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: var(--accent-color);
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #333;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.change-indicator.positive {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.change-indicator.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* Color variants */
.stat-card-primary {
  --accent-color: #3b82f6;
  --accent-color-light: #60a5fa;
}

.stat-card-success {
  --accent-color: #22c55e;
  --accent-color-light: #4ade80;
}

.stat-card-warning {
  --accent-color: #f59e0b;
  --accent-color-light: #fbbf24;
}

.stat-card-danger {
  --accent-color: #ef4444;
  --accent-color-light: #f87171;
}

.stat-card-info {
  --accent-color: #06b6d4;
  --accent-color-light: #22d3ee;
}

/* Animation */
.animated-number {
  display: inline-block;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-card-inner {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .stat-value {
    font-size: 1.75rem;
  }
}
</style>
