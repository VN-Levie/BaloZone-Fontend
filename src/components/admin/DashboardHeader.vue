<template>
  <div class="dashboard-header">
    <div class="header-background">
      <div class="header-pattern"></div>
    </div>
    <div class="header-content">
      <div class="row align-items-center">
        <div class="col-lg-8">
          <div class="welcome-section">
            <div class="greeting">
              <span class="greeting-text">Xin chào,</span>
              <span class="user-name">{{ userName }}</span>
            </div>
            <h1 class="dashboard-title">
              <i class="bi bi-speedometer2 title-icon"></i>
              Admin Dashboard
            </h1>
            <p class="dashboard-subtitle">
              <i class="bi bi-activity me-2"></i>
              Quản lý và theo dõi hoạt động của BaloZone
            </p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="header-stats">
            <div class="time-widget">
              <div class="current-time">{{ currentTime }}</div>
              <div class="current-date">{{ currentDate }}</div>
            </div>
            <div class="quick-info">
              <div class="info-item">
                <i class="bi bi-bell-fill"></i>
                <span class="badge bg-danger">{{ notifications }}</span>
              </div>
              <div class="info-item">
                <i class="bi bi-people-fill"></i>
                <span class="online-users">{{ onlineUsers }} online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

interface Props {
  notifications?: number
  onlineUsers?: number
}

const props = withDefaults(defineProps<Props>(), {
  notifications: 0,
  onlineUsers: 1
})

const { user } = useAuth()

const currentTime = ref('')
const currentDate = ref('')

const userName = computed(() => user.value?.name || 'Admin')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  currentDate.value = now.toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<style scoped>
.dashboard-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-bottom: 2rem;
  overflow: hidden;
  min-height: 200px;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 2px, transparent 2px);
  background-size: 50px 50px, 30px 30px, 70px 70px;
}

.header-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  color: white;
}

.welcome-section {
  margin-bottom: 1rem;
}

.greeting {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.greeting-text {
  opacity: 0.9;
  margin-right: 0.5rem;
}

.user-name {
  font-weight: 700;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.title-icon {
  font-size: 2rem;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.dashboard-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  display: flex;
  align-items: center;
}

.header-stats {
  text-align: center;
}

.time-widget {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.current-time {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
}

.current-date {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: capitalize;
}

.quick-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 25px;
  backdrop-filter: blur(5px);
}

.info-item i {
  font-size: 1.2rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

.online-users {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 1.5rem;
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .quick-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .time-widget {
    padding: 1rem;
  }
  
  .current-time {
    font-size: 1.5rem;
  }
}
</style>
