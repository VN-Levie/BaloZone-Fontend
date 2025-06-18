<template>
  <teleport to="body">
    <div v-if="visible" class="toast-container">
      <div 
        class="toast-notification" 
        :class="[`toast-${type}`, { 'toast-entering': entering, 'toast-leaving': leaving }]"
      >
        <div class="toast-icon">
          <i class="bi" :class="iconClass"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ title }}</div>
          <div class="toast-message">{{ message }}</div>
        </div>
        <button class="toast-close" @click="close">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  visible?: boolean
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message?: string
  duration?: number
  autoClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  type: 'success',
  title: '',
  message: '',
  duration: 3000,
  autoClose: true
})

const emit = defineEmits<{
  close: []
}>()

const entering = ref(false)
const leaving = ref(false)

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bi-check-circle-fill'
    case 'error':
      return 'bi-x-circle-fill'
    case 'warning':
      return 'bi-exclamation-triangle-fill'
    case 'info':
      return 'bi-info-circle-fill'
    default:
      return 'bi-check-circle-fill'
  }
})

const close = () => {
  leaving.value = true
  setTimeout(() => {
    emit('close')
    leaving.value = false
  }, 300)
}

let autoCloseTimer: NodeJS.Timeout | null = null

watch(() => props.visible, (newVal) => {
  if (newVal) {
    entering.value = true
    setTimeout(() => {
      entering.value = false
    }, 300)

    if (props.autoClose && props.duration > 0) {
      autoCloseTimer = setTimeout(() => {
        close()
      }, props.duration)
    }
  } else {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      autoCloseTimer = null
    }
  }
})

onMounted(() => {
  if (props.visible) {
    entering.value = true
    setTimeout(() => {
      entering.value = false
    }, 300)
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toast-notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  min-width: 320px;
  max-width: 400px;
  transform: translateX(100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-notification.toast-entering {
  transform: translateX(0);
}

.toast-notification.toast-leaving {
  transform: translateX(100%);
  opacity: 0;
}

.toast-success {
  border-left-color: #28a745;
}

.toast-error {
  border-left-color: #dc3545;
}

.toast-warning {
  border-left-color: #ffc107;
}

.toast-info {
  border-left-color: #17a2b8;
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-success .toast-icon {
  color: #28a745;
}

.toast-error .toast-icon {
  color: #dc3545;
}

.toast-warning .toast-icon {
  color: #ffc107;
}

.toast-info .toast-icon {
  color: #17a2b8;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  font-size: 0.95rem;
}

.toast-message {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.toast-close:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.toast-close i {
  font-size: 1.1rem;
}

@media (max-width: 576px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .toast-notification {
    min-width: auto;
    max-width: none;
  }
}
</style>
