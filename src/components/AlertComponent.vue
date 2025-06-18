<template>
  <div
    v-if="visible"
    class="alert-component"
    :class="[`alert-${type}`, { 'alert-dismissible': dismissible }]"
    role="alert"
  >
    <div class="alert-icon">
      <i class="bi" :class="iconClass"></i>
    </div>
    <div class="alert-content">
      <div v-if="title" class="alert-title">{{ title }}</div>
      <div class="alert-message">{{ message }}</div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="alert-close"
      @click="$emit('close')"
    >
      <i class="bi bi-x"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  visible?: boolean
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  visible: true,
  dismissible: true
})

const emit = defineEmits<{
  close: []
}>()

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bi-check-circle-fill'
    case 'error':
      return 'bi-exclamation-triangle-fill'
    case 'warning':
      return 'bi-exclamation-triangle-fill'
    case 'info':
      return 'bi-info-circle-fill'
    default:
      return 'bi-info-circle-fill'
  }
})
</script>

<style scoped>
.alert-component {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease-out;
}

.alert-success {
  background-color: #d1edff;
  border-left-color: #28a745;
  color: #155724;
}

.alert-error {
  background-color: #f8d7da;
  border-left-color: #dc3545;
  color: #721c24;
}

.alert-warning {
  background-color: #fff3cd;
  border-left-color: #ffc107;
  color: #856404;
}

.alert-info {
  background-color: #d1ecf1;
  border-left-color: #17a2b8;
  color: #0c5460;
}

.alert-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
}

.alert-success .alert-icon {
  color: #28a745;
}

.alert-error .alert-icon {
  color: #dc3545;
}

.alert-warning .alert-icon {
  color: #ffc107;
}

.alert-info .alert-icon {
  color: #17a2b8;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 1rem;
}

.alert-message {
  font-size: 0.95rem;
  line-height: 1.4;
}

.alert-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.alert-close:hover {
  opacity: 1;
}

.alert-close i {
  font-size: 1.2rem;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
