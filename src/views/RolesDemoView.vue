<template>
  <div class="roles-demo-view">
    <div class="container">
      <div class="demo-header">
        <h1>Demo Hệ thống Roles & Permissions</h1>
        <p class="lead">
          Trang này demo việc sử dụng hệ thống roles và permissions mới được cập nhật
        </p>
      </div>
      
      <RolesDemo />
    </div>
  </div>
</template>

<script setup lang="ts">
import RolesDemo from '@/components/RolesDemo.vue'
import { useAuth } from '@/composables/useAuth'
import { onMounted } from 'vue'

const { initializeAuth } = useAuth()

onMounted(() => {
  initializeAuth()
})
</script>

<style scoped>
.roles-demo-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.demo-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.demo-header .lead {
  font-size: 1.25rem;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
