<template>
  <div class="loading-spinner" :class="{ centered: centered }">
    <div class="spinner-border" :class="size" role="status">
      <span class="visually-hidden">{{ text }}</span>
    </div>
    <p v-if="text && showText" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  showText?: boolean
  centered?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  text: 'Loading...',
  showText: true,
  centered: true
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner.centered {
  justify-content: center;
  min-height: 200px;
}

.spinner-border.sm {
  width: 1.5rem;
  height: 1.5rem;
}

.spinner-border.md {
  width: 2rem;
  height: 2rem;
}

.spinner-border.lg {
  width: 3rem;
  height: 3rem;
}

.loading-text {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}
</style>
