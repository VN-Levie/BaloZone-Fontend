<template>
  <div v-if="visible" class="form-overlay">
    <div class="loading-content">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
      <p class="loading-text">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
  message?: string
}

withDefaults(defineProps<Props>(), {
  visible: false,
  message: 'Đang xử lý...'
})
</script>

<style scoped>
.form-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.loading-content {
  text-align: center;
}

.spinner {
  display: inline-block;
  position: relative;
  width: 70px;
  margin-bottom: 1rem;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #007bff;
  border-radius: 100%;
  display: inline-block;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  animation-delay: -0.16s;
}

.loading-text {
  color: #6c757d;
  font-weight: 500;
  margin: 0;
  font-size: 0.95rem;
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}
</style>
