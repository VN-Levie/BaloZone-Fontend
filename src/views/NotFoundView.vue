<template>
  <div class="not-found-page">
    <div class="container text-center py-5">
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Trang không tồn tại</h2>
        <p class="error-message">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div class="error-actions">
          <router-link to="/" class="btn btn-primary">
            <i class="bi bi-house"></i>
            Về trang chủ
          </router-link>
          <button class="btn btn-outline-primary" @click="goBack">
            <i class="bi bi-arrow-left"></i>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  color: #e9ecef;
  line-height: 1;
  margin: 0;
}

.error-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0;
  color: #495057;
}

.error-message {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

@media (max-width: 576px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
}
</style>
