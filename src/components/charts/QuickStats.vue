<template>
  <div class="quick-stats">
    <div class="row g-4">
      <div v-for="(stat, index) in stats" :key="index" class="col-lg-3 col-md-6">
        <div class="stat-card" :class="`stat-card-${stat.color}`">
          <div class="stat-icon">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">
              <span ref="numberRefs" :data-target="stat.value">0</span>
              <span v-if="stat.suffix" class="stat-suffix">{{ stat.suffix }}</span>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
            <div v-if="stat.change" class="stat-change" :class="stat.change.type">
              <i :class="stat.change.type === 'increase' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              {{ stat.change.value }}% so với tháng trước
            </div>
          </div>
          <div class="stat-bg-icon">
            <i :class="stat.icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface StatChange {
  type: 'increase' | 'decrease'
  value: number
}

interface Stat {
  label: string
  value: number
  icon: string
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  suffix?: string
  change?: StatChange
}

interface Props {
  stats: Stat[]
}

const props = defineProps<Props>()
const numberRefs = ref<HTMLElement[]>([])

const animateNumbers = () => {
  numberRefs.value.forEach((el, index) => {
    if (!el) return
    
    const target = parseInt(el.getAttribute('data-target') || '0')
    const increment = target / 100
    let current = 0
    
    const updateNumber = () => {
      if (current < target) {
        current += increment
        el.textContent = Math.floor(current).toLocaleString('vi-VN')
        requestAnimationFrame(updateNumber)
      } else {
        el.textContent = target.toLocaleString('vi-VN')
      }
    }
    
    // Delay animation based on index
    setTimeout(updateNumber, index * 100)
  })
}

onMounted(async () => {
  await nextTick()
  animateNumbers()
})
</script>

<style scoped>
.quick-stats {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 140px;
  display: flex;
  align-items: center;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.stat-card-primary {
  border-left: 4px solid #007bff;
}

.stat-card-success {
  border-left: 4px solid #28a745;
}

.stat-card-warning {
  border-left: 4px solid #ffc107;
}

.stat-card-info {
  border-left: 4px solid #17a2b8;
}

.stat-card-danger {
  border-left: 4px solid #dc3545;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-right: 20px;
  z-index: 2;
  position: relative;
}

.stat-card-primary .stat-icon {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.stat-card-success .stat-icon {
  background: linear-gradient(135deg, #28a745, #1e7e34);
}

.stat-card-warning .stat-icon {
  background: linear-gradient(135deg, #ffc107, #e0a800);
}

.stat-card-info .stat-icon {
  background: linear-gradient(135deg, #17a2b8, #138496);
}

.stat-card-danger .stat-icon {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

.stat-content {
  flex: 1;
  z-index: 2;
  position: relative;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-suffix {
  font-size: 1rem;
  color: #6c757d;
  margin-left: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.increase {
  color: #28a745;
}

.stat-change.decrease {
  color: #dc3545;
}

.stat-bg-icon {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 80px;
  color: rgba(0, 0, 0, 0.05);
  z-index: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-card {
    height: auto;
    padding: 20px;
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .stat-bg-icon {
    display: none;
  }
}
</style>
