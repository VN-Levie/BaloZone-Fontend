<template>
  <nav aria-label="breadcrumb" class="breadcrumb-nav">
    <div class="container-fluid px-4">
      <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li 
          v-for="(item, index) in items" 
          :key="index"
          class="breadcrumb-item"
          :class="{ active: index === items.length - 1 }"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <router-link 
            v-if="index < items.length - 1" 
            :to="item.path"
            class="breadcrumb-link"
            itemprop="item"
          >
            <span itemprop="name">{{ item.name }}</span>
          </router-link>
          <span v-else class="breadcrumb-current" itemprop="name">{{ item.name }}</span>
          <meta :content="(index + 1).toString()" itemprop="position">
          <i 
            v-if="index < items.length - 1" 
            class="bi bi-chevron-right breadcrumb-separator"
          ></i>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  name: string
  path: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<style scoped>
.breadcrumb-nav {
  background: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.breadcrumb {
  background: transparent;
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #007bff;
}

.breadcrumb-current {
  color: #495057;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #6c757d;
  font-size: 0.75rem;
}

.breadcrumb-item.active .breadcrumb-current {
  color: #007bff;
}
</style>
