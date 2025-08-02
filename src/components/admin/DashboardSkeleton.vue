<template>
  <div class="dashboard-skeleton">
    <!-- Header Skeleton -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <div class="skeleton skeleton-title mb-2"></div>
        <div class="skeleton skeleton-subtitle"></div>
      </div>
      <div class="d-flex gap-2">
        <div class="skeleton skeleton-button"></div>
        <div class="skeleton skeleton-button"></div>
      </div>
    </div>

    <!-- Stats Cards Skeleton -->
    <div class="row g-4 mb-4">
      <div v-for="i in 4" :key="i" class="col-xl-3 col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="skeleton skeleton-icon"></div>
              </div>
              <div class="flex-grow-1 ms-3">
                <div class="skeleton skeleton-text mb-2"></div>
                <div class="skeleton skeleton-value mb-2"></div>
                <div class="skeleton skeleton-trend"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Skeleton -->
    <div class="row g-4 mb-4">
      <div class="col-xl-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent border-0 pb-0">
            <div class="skeleton skeleton-chart-title mb-3"></div>
          </div>
          <div class="card-body">
            <div class="skeleton skeleton-chart"></div>
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent border-0 pb-0">
            <div class="skeleton skeleton-chart-title mb-3"></div>
          </div>
          <div class="card-body">
            <div class="skeleton skeleton-pie-chart"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lists Skeleton -->
    <div class="row g-4">
      <div class="col-xl-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-transparent border-0 pb-0">
            <div class="skeleton skeleton-chart-title mb-3"></div>
          </div>
          <div class="card-body">
            <div v-for="i in 5" :key="i" class="d-flex align-items-center py-3">
              <div class="skeleton skeleton-list-icon me-3"></div>
              <div class="flex-grow-1">
                <div class="skeleton skeleton-list-title mb-1"></div>
                <div class="skeleton skeleton-list-subtitle"></div>
              </div>
              <div class="skeleton skeleton-list-value"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="row g-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-transparent border-0 pb-0">
                <div class="skeleton skeleton-chart-title mb-3"></div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-6">
                    <div class="skeleton skeleton-stat-big mb-2"></div>
                    <div class="skeleton skeleton-stat-label"></div>
                  </div>
                  <div class="col-6">
                    <div class="skeleton skeleton-stat-big mb-2"></div>
                    <div class="skeleton skeleton-stat-label"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for skeleton
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-title {
  height: 32px;
  width: 200px;
}

.skeleton-subtitle {
  height: 16px;
  width: 300px;
}

.skeleton-button {
  height: 36px;
  width: 100px;
  border-radius: 8px;
}

.skeleton-icon {
  height: 50px;
  width: 50px;
  border-radius: 12px;
}

.skeleton-text {
  height: 14px;
  width: 80px;
}

.skeleton-value {
  height: 28px;
  width: 120px;
}

.skeleton-trend {
  height: 12px;
  width: 100px;
}

.skeleton-chart-title {
  height: 20px;
  width: 150px;
}

.skeleton-chart {
  height: 300px;
  width: 100%;
  border-radius: 8px;
}

.skeleton-pie-chart {
  height: 250px;
  width: 100%;
  border-radius: 8px;
}

.skeleton-list-icon {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.skeleton-list-title {
  height: 16px;
  width: 180px;
}

.skeleton-list-subtitle {
  height: 12px;
  width: 120px;
}

.skeleton-list-value {
  height: 16px;
  width: 80px;
}

.skeleton-stat-big {
  height: 32px;
  width: 60px;
}

.skeleton-stat-label {
  height: 12px;
  width: 80px;
}
</style>
