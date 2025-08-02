<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <div id="app">
    <RouterView />

    <!-- Toast notifications -->
    <ToastContainer />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}

/* Admin layouts take full viewport */
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

.btn {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-outline-primary {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn-outline-primary:hover {
  background: #007bff;
  color: white;
}

/* Utility classes */
.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.py-5 {
  padding: 3rem 0;
}

/* Animation utilities */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
