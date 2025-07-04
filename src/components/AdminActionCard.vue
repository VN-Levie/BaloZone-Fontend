<template>
  <div class="admin-actions mb-4">
    <div class="row g-3">
      <div 
        v-for="(action, index) in actions" 
        :key="index"
        class="col-xl-2-4 col-lg-3 col-md-4 col-sm-6"
      >
        <div 
          class="action-card"
          :class="`action-card-${action.color}`"
          @click="$emit('action-click', action.id)"
        >
          <div class="action-icon">
            <i :class="`bi ${action.icon}`"></i>
          </div>
          <div class="action-content">
            <h5 class="action-title">{{ action.title }}</h5>
            <p class="action-description">{{ action.description }}</p>
            <div v-if="action.badge" class="action-badge">
              {{ action.badge }}
            </div>
          </div>
          <div class="action-arrow">
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ActionItem {
  id: string
  icon: string
  title: string
  description: string
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'
  badge?: string
}

interface Props {
  actions: ActionItem[]
}

defineProps<Props>()
defineEmits<{
  'action-click': [actionId: string]
}>()
</script>

<style scoped>
.admin-actions {
  margin-bottom: 2rem;
}

.action-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  border: 2px solid transparent;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-color);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-color);
}

.action-card:hover::before {
  transform: scaleX(1);
}

.action-card:hover .action-arrow {
  transform: translateX(5px);
  opacity: 1;
}

.action-card:hover .action-icon {
  transform: scale(1.1);
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--accent-color);
  background: var(--accent-bg);
  transition: all 0.3s ease;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.action-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.action-badge {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.action-arrow {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.2rem;
  color: var(--accent-color);
  opacity: 0;
  transition: all 0.3s ease;
}

/* Color variants */
.action-card-primary {
  --accent-color: #3b82f6;
  --accent-bg: rgba(59, 130, 246, 0.1);
}

.action-card-success {
  --accent-color: #22c55e;
  --accent-bg: rgba(34, 197, 94, 0.1);
}

.action-card-warning {
  --accent-color: #f59e0b;
  --accent-bg: rgba(245, 158, 11, 0.1);
}

.action-card-danger {
  --accent-color: #ef4444;
  --accent-bg: rgba(239, 68, 68, 0.1);
}

.action-card-info {
  --accent-color: #06b6d4;
  --accent-bg: rgba(6, 182, 212, 0.1);
}

.action-card-secondary {
  --accent-color: #6b7280;
  --accent-bg: rgba(107, 114, 128, 0.1);
}

/* Custom grid for 5 columns */
@media (min-width: 1200px) {
  .col-xl-2-4 {
    flex: 0 0 auto;
    width: 20%;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .action-card {
    padding: 1.25rem;
  }
  
  .action-icon {
    width: 45px;
    height: 45px;
    font-size: 1.25rem;
  }
  
  .action-title {
    font-size: 1rem;
  }
  
  .action-description {
    font-size: 0.85rem;
  }
}
</style>
