<template>
  <div class="enhanced-stats">
    <div class="stats-header">
      <h3 class="stats-title">
        <i class="bi bi-graph-up-arrow"></i>
        Thống kê tổng quan
      </h3>
      <div class="refresh-btn" @click="refreshStats" :class="{ disabled: loading }">
        <i class="bi bi-arrow-clockwise" :class="{ 'spinning': isRefreshing || loading }"></i>
      </div>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="loading" class="row g-4">
      <div v-for="i in 4" :key="i" class="col-xl-3 col-lg-6 col-md-6">
        <div class="enhanced-stat-card skeleton-card">
          <div class="skeleton-content">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-number"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Actual stats -->
    <div v-else class="row g-4">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="col-xl-3 col-lg-6 col-md-6"
      >
        <div class="enhanced-stat-card" :class="`stat-card-${stat.color}`">
          <!-- Background decoration -->
          <div class="card-decoration">
            <i :class="`bi ${stat.icon}`"></i>
          </div>
          
          <!-- Main content -->
          <div class="stat-content">
            <div class="stat-header">
              <div class="stat-icon">
                <i :class="`bi ${stat.icon}`"></i>
              </div>
              <div class="stat-trend" v-if="stat.change">
                <i :class="stat.change > 0 ? 'bi bi-trending-up' : 'bi bi-trending-down'"></i>
                <span :class="stat.change > 0 ? 'text-success' : 'text-danger'">
                  {{ Math.abs(stat.change) }}%
                </span>
              </div>
            </div>
            
            <div class="stat-body">
              <h2 class="stat-number">
                <span v-if="stat.isAnimated" class="animated-number" :data-value="stat.value">0</span>
                <span v-else>{{ formatNumber(stat.value) }}</span>
                <span v-if="stat.suffix" class="stat-suffix">{{ stat.suffix }}</span>
              </h2>
              <p class="stat-label">{{ stat.label }}</p>
            </div>
            
            <div class="stat-footer" v-if="stat.description">
              <small class="text-muted">{{ stat.description }}</small>
            </div>
          </div>
          
          <!-- Progress bar for certain stats -->
          <div v-if="stat.progress" class="stat-progress">
            <div class="progress-bar" :style="{ width: stat.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

interface Stat {
  label: string
  value: number
  icon: string
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  change?: number
  isAnimated?: boolean
  suffix?: string
  description?: string
  progress?: number
}

interface Props {
  stats: Stat[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  refresh: []
}>()

const isRefreshing = ref(false)

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toLocaleString('vi-VN')
}

const animateNumbers = () => {
  const elements = document.querySelectorAll('.animated-number')
  
  elements.forEach((element, index) => {
    const target = parseInt(element.getAttribute('data-value') || '0')
    let current = 0
    const increment = target / 60
    
    const animate = () => {
      current += increment
      if (current >= target) {
        current = target
        element.textContent = formatNumber(current)
        return
      }
      element.textContent = formatNumber(Math.floor(current))
      requestAnimationFrame(animate)
    }
    
    // Stagger animation
    setTimeout(() => {
      animate()
    }, index * 100)
  })
}

const refreshStats = async () => {
  if (props.loading) return
  
  isRefreshing.value = true
  emit('refresh')
  
  setTimeout(() => {
    isRefreshing.value = false
    animateNumbers()
  }, 1000)
}

// Watch for stats changes to trigger animation
watch(() => props.stats, () => {
  nextTick(() => {
    setTimeout(animateNumbers, 100)
  })
}, { deep: true })

onMounted(async () => {
  await nextTick()
  setTimeout(animateNumbers, 300)
})
</script>

<style scoped>
.enhanced-stats {
  margin-bottom: 2rem;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.stats-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.refresh-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.refresh-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.refresh-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn i.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.enhanced-stat-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  height: 180px;
  display: flex;
  flex-direction: column;
}

.enhanced-stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.skeleton-card {
  background: #f8f9fa;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.skeleton-icon {
  width: 50px;
  height: 50px;
  background: #e9ecef;
  border-radius: 12px;
}

.skeleton-text {
  height: 20px;
  background: #e9ecef;
  border-radius: 4px;
  width: 60%;
}

.skeleton-number {
  height: 40px;
  background: #e9ecef;
  border-radius: 4px;
  width: 80%;
}

.card-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.stat-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--accent-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px var(--accent-shadow);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.05);
}

.stat-body {
  flex: 1;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stat-suffix {
  font-size: 1rem;
  color: #718096;
  margin-left: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-footer {
  margin-top: auto;
}

.stat-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0 0 20px 20px;
}

.progress-bar {
  height: 100%;
  background: var(--accent-color);
  border-radius: 0 0 20px 20px;
  transition: width 1s ease;
}

/* Color variants */
.stat-card-primary {
  --accent-color: #667eea;
  --accent-shadow: rgba(102, 126, 234, 0.3);
}

.stat-card-success {
  --accent-color: #48bb78;
  --accent-shadow: rgba(72, 187, 120, 0.3);
}

.stat-card-warning {
  --accent-color: #ed8936;
  --accent-shadow: rgba(237, 137, 54, 0.3);
}

.stat-card-info {
  --accent-color: #4299e1;
  --accent-shadow: rgba(66, 153, 225, 0.3);
}

.stat-card-danger {
  --accent-color: #f56565;
  --accent-shadow: rgba(245, 101, 101, 0.3);
}

/* Hover effects */
.stat-card-primary:hover {
  border-color: var(--accent-color);
  box-shadow: 0 15px 40px var(--accent-shadow);
}

.stat-card-success:hover {
  border-color: var(--accent-color);
  box-shadow: 0 15px 40px var(--accent-shadow);
}

.stat-card-warning:hover {
  border-color: var(--accent-color);
  box-shadow: 0 15px 40px var(--accent-shadow);
}

.stat-card-info:hover {
  border-color: var(--accent-color);
  box-shadow: 0 15px 40px var(--accent-shadow);
}

.stat-card-danger:hover {
  border-color: var(--accent-color);
  box-shadow: 0 15px 40px var(--accent-shadow);
}

/* Responsive */
@media (max-width: 768px) {
  .enhanced-stat-card {
    height: auto;
    min-height: 160px;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .stats-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
