<template>
  <div class="card border-0 shadow-sm h-100">
    <div class="card-header bg-transparent border-0 pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          <i :class="titleIcon" class="me-2"></i>
          {{ title }}
        </h5>
        <div class="d-flex align-items-center gap-2">
          <slot name="header-actions" />
          <router-link v-if="viewAllLink" :to="viewAllLink" class="btn btn-sm btn-outline-primary">
            Xem tất cả
          </router-link>
        </div>
      </div>
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  titleIcon?: string
  viewAllLink?: string
}

withDefaults(defineProps<Props>(), {
  titleIcon: 'bi bi-grid-3x3-gap'
})
</script>

<style scoped>
.card-title {
  color: #495057;
  font-weight: 600;
}
</style>
