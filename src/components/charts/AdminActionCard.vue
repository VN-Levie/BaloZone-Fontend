<template>
  <div class="admin-actions">
    <div class="row g-4">
      <div v-for="(action, index) in actions" :key="index" class="col-lg-4 col-md-6">
        <div class="action-card" :class="`action-card-${action.color}`" @click="handleAction(action)">
          <div class="action-header">
            <div class="action-icon">
              <i :class="action.icon"></i>
            </div>
            <div class="action-badge" v-if="action.badge">
              {{ action.badge }}
            </div>
          </div>
          <div class="action-content">
            <h5 class="action-title">{{ action.title }}</h5>
            <p class="action-description">{{ action.description }}</p>
          </div>
          <div class="action-footer">
            <span class="action-button">
              {{ action.buttonText }}
              <i class="bi bi-arrow-right"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AdminAction {
  title: string
  description: string
  icon: string
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  buttonText: string
  action: string
  badge?: string | number
}

interface Props {
  actions: AdminAction[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  actionClick: [action: AdminAction]
}>()

const handleAction = (action: AdminAction) => {
  emit('actionClick', action)
}
</script>

<style scoped>
.admin-actions {
  margin-bottom: 2rem;
}

.action-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 180px;
  display: flex;
  flex-direction: column;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.action-card-primary:hover {
  border-color: #007bff;
  box-shadow: 0 20px 40px rgba(0, 123, 255, 0.2);
}

.action-card-success:hover {
  border-color: #28a745;
  box-shadow: 0 20px 40px rgba(40, 167, 69, 0.2);
}

.action-card-warning:hover {
  border-color: #ffc107;
  box-shadow: 0 20px 40px rgba(255, 193, 7, 0.2);
}

.action-card-info:hover {
  border-color: #17a2b8;
  box-shadow: 0 20px 40px rgba(23, 162, 184, 0.2);
}

.action-card-danger:hover {
  border-color: #dc3545;
  box-shadow: 0 20px 40px rgba(220, 53, 69, 0.2);
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.action-card-primary .action-icon {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.action-card-success .action-icon {
  background: linear-gradient(135deg, #28a745, #1e7e34);
}

.action-card-warning .action-icon {
  background: linear-gradient(135deg, #ffc107, #e0a800);
}

.action-card-info .action-icon {
  background: linear-gradient(135deg, #17a2b8, #138496);
}

.action-card-danger .action-icon {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

.action-badge {
  background: #ff4757;
  color: white;
  border-radius: 15px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.action-content {
  flex: 1;
  margin-bottom: 15px;
}

.action-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.3;
}

.action-description {
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.4;
  margin: 0;
}

.action-footer {
  margin-top: auto;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: #007bff;
  transition: all 0.3s ease;
}

.action-card-success .action-button {
  color: #28a745;
}

.action-card-warning .action-button {
  color: #ffc107;
}

.action-card-info .action-button {
  color: #17a2b8;
}

.action-card-danger .action-button {
  color: #dc3545;
}

.action-card:hover .action-button i {
  transform: translateX(5px);
}

/* Responsive */
@media (max-width: 768px) {
  .action-card {
    height: auto;
    min-height: 160px;
  }
  
  .action-title {
    font-size: 1rem;
  }
  
  .action-description {
    font-size: 0.85rem;
  }
}
</style>
