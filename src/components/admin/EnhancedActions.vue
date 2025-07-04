<template>
  <div class="enhanced-actions">
    <div class="section-header">
      <h3 class="section-title">
        <i class="bi bi-lightning-charge-fill"></i>
        Thao tác nhanh
      </h3>
      <div class="view-toggle">
        <button 
          @click="viewMode = 'grid'" 
          :class="{ active: viewMode === 'grid' }"
          class="toggle-btn"
        >
          <i class="bi bi-grid-3x3-gap"></i>
        </button>
        <button 
          @click="viewMode = 'list'" 
          :class="{ active: viewMode === 'list' }"
          class="toggle-btn"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="actions-grid">
      <div 
        v-for="(action, index) in actions" 
        :key="action.id"
        class="action-card"
        :class="`action-card-${action.color}`"
        @click="handleAction(action)"
        :style="{ animationDelay: index * 100 + 'ms' }"
      >
        <!-- Card Background Effect -->
        <div class="card-background">
          <div class="bg-pattern"></div>
          <div class="bg-icon">
            <i :class="`bi ${action.icon}`"></i>
          </div>
        </div>

        <!-- Card Content -->
        <div class="card-content">
          <div class="card-header">
            <div class="action-icon">
              <i :class="`bi ${action.icon}`"></i>
            </div>
            <div v-if="action.badge" class="action-badge">
              {{ action.badge }}
            </div>
          </div>

          <div class="card-body">
            <h5 class="action-title">{{ action.title }}</h5>
            <p class="action-description">{{ action.description }}</p>
          </div>

          <div class="card-footer">
            <div class="action-button">
              <span>Thực hiện</span>
              <i class="bi bi-arrow-right"></i>
            </div>
            <div v-if="action.shortcut" class="shortcut">
              {{ action.shortcut }}
            </div>
          </div>
        </div>

        <!-- Hover Effect -->
        <div class="hover-overlay"></div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="actions-list">
      <div 
        v-for="action in actions" 
        :key="action.id"
        class="list-item"
        @click="handleAction(action)"
      >
        <div class="list-icon">
          <i :class="`bi ${action.icon}`"></i>
        </div>
        <div class="list-content">
          <h6 class="list-title">{{ action.title }}</h6>
          <p class="list-description">{{ action.description }}</p>
        </div>
        <div class="list-meta">
          <div v-if="action.badge" class="list-badge">{{ action.badge }}</div>
          <div class="list-arrow">
            <i class="bi bi-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Action {
  id: string
  title: string
  description: string
  icon: string
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'secondary'
  badge?: string | number
  shortcut?: string
}

interface Props {
  actions: Action[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  actionClick: [actionId: string]
}>()

const viewMode = ref<'grid' | 'list'>('grid')

const handleAction = (action: Action) => {
  emit('actionClick', action.id)
}
</script>

<style scoped>
.enhanced-actions {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

.view-toggle {
  display: flex;
  background: #f7fafc;
  border-radius: 8px;
  padding: 2px;
}

.toggle-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  color: #4a5568;
}

.toggle-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Grid View Styles */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  height: 200px;
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-color);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.05;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 25% 25%, var(--accent-color) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, var(--accent-color) 1px, transparent 1px);
  background-size: 30px 30px, 20px 20px;
}

.bg-icon {
  position: absolute;
  bottom: -20px;
  right: -20px;
  font-size: 120px;
  color: var(--accent-color);
  opacity: 0.1;
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px var(--accent-shadow);
}

.action-badge {
  background: #ff4757;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.card-body {
  flex: 1;
  margin-bottom: 1rem;
}

.action-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.action-description {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent-color);
  transition: all 0.2s ease;
}

.shortcut {
  font-size: 0.75rem;
  color: #a0aec0;
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: monospace;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card:hover .hover-overlay {
  opacity: 0.03;
}

.action-card:hover .action-button {
  transform: translateX(3px);
}

/* List View Styles */
.actions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-item {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.list-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateX(4px);
}

.list-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.list-content {
  flex: 1;
}

.list-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
}

.list-description {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.list-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.list-badge {
  background: #667eea;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.list-arrow {
  color: #a0aec0;
  transition: all 0.2s ease;
}

.list-item:hover .list-arrow {
  color: #667eea;
  transform: translateX(2px);
}

/* Color variants */
.action-card-primary {
  --accent-color: #667eea;
  --accent-light: #764ba2;
  --accent-shadow: rgba(102, 126, 234, 0.3);
}

.action-card-success {
  --accent-color: #48bb78;
  --accent-light: #38a169;
  --accent-shadow: rgba(72, 187, 120, 0.3);
}

.action-card-warning {
  --accent-color: #ed8936;
  --accent-light: #dd6b20;
  --accent-shadow: rgba(237, 137, 54, 0.3);
}

.action-card-info {
  --accent-color: #4299e1;
  --accent-light: #3182ce;
  --accent-shadow: rgba(66, 153, 225, 0.3);
}

.action-card-danger {
  --accent-color: #f56565;
  --accent-light: #e53e3e;
  --accent-shadow: rgba(245, 101, 101, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    height: auto;
    min-height: 160px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
