<template>
  <div class="search-filters">
    <div class="filters-header">
      <h6 class="filters-title">
        <i class="bi bi-funnel me-2"></i>
        Bộ lọc tìm kiếm
      </h6>
      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="btn btn-link btn-sm text-danger p-0"
      >
        <i class="bi bi-x-circle me-1"></i>
        Xóa tất cả
      </button>
    </div>

    <div class="filters-content">
      <!-- Price Range Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <i class="bi bi-currency-dollar me-2"></i>
          Khoảng giá
        </label>
        <div class="price-inputs">
          <div class="row g-2">
            <div class="col-6">
              <input
                v-model.number="localFilters.minPrice"
                @input="emitFilterChange"
                type="number"
                class="form-control form-control-sm"
                placeholder="Từ"
                min="0"
                step="1000"
              />
            </div>
            <div class="col-6">
              <input
                v-model.number="localFilters.maxPrice"
                @input="emitFilterChange"
                type="number"
                class="form-control form-control-sm"
                placeholder="Đến"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>
        <!-- Quick Price Ranges -->
        <div class="quick-prices mt-2">
          <small class="text-muted d-block mb-1">Khoảng giá phổ biến:</small>
          <div class="d-flex flex-wrap gap-1">
            <button
              v-for="range in priceRanges"
              :key="`${range.min}-${range.max}`"
              class="btn btn-outline-secondary btn-sm quick-price-btn"
              @click="setPriceRange(range)"
            >
              {{ formatPriceRange(range.min, range.max) }}
            </button>
          </div>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <i class="bi bi-tag me-2"></i>
          Danh mục
        </label>
        <div class="filter-options">
          <div class="form-check">
            <input
              v-model="localFilters.category"
              @change="emitFilterChange"
              class="form-check-input"
              type="radio"
              name="category"
              id="category-all"
              value=""
            />
            <label class="form-check-label" for="category-all">
              Tất cả danh mục
            </label>
          </div>
          <div
            v-for="category in categories"
            :key="category.id"
            class="form-check"
          >
            <input
              v-model="localFilters.category"
              @change="emitFilterChange"
              class="form-check-input"
              type="radio"
              name="category"
              :id="`category-${category.id}`"
              :value="category.slug"
            />
            <label class="form-check-label" :for="`category-${category.id}`">
              {{ category.name }}
              <span v-if="category.products_count" class="text-muted">
                ({{ category.products_count }})
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Brand Filter -->
      <div class="filter-group">
        <label class="filter-label">
          <i class="bi bi-award me-2"></i>
          Thương hiệu
        </label>
        <div class="filter-options">
          <div class="form-check">
            <input
              v-model="localFilters.brand"
              @change="emitFilterChange"
              class="form-check-input"
              type="radio"
              name="brand"
              id="brand-all"
              value=""
            />
            <label class="form-check-label" for="brand-all">
              Tất cả thương hiệu
            </label>
          </div>
          <div
            v-for="brand in brands"
            :key="brand.id"
            class="form-check"
          >
            <input
              v-model="localFilters.brand"
              @change="emitFilterChange"
              class="form-check-input"
              type="radio"
              name="brand"
              :id="`brand-${brand.id}`"
              :value="brand.slug"
            />
            <label class="form-check-label" :for="`brand-${brand.id}`">
              {{ brand.name }}
              <span v-if="brand.products_count" class="text-muted">
                ({{ brand.products_count }})
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Apply Button -->
      <div class="filter-actions mt-3">
        <button
          class="btn btn-primary w-100"
          @click="emitFilterChange"
        >
          <i class="bi bi-funnel me-2"></i>
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { formatPrice } from '@/utils'
import type { Category, Brand } from '@/types'

interface SearchFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'price' | 'created_at' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

interface Props {
  modelValue: SearchFilters
  categories: Category[]
  brands: Brand[]
  priceRange?: { min: number; max: number }
}

interface Emits {
  'update:modelValue': [filters: SearchFilters]
  'apply': [filters: SearchFilters]
  'clear': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state for filters
const localFilters = ref<SearchFilters>({
  ...props.modelValue
})

// Predefined price ranges
const priceRanges = [
  { min: 0, max: 500000 },
  { min: 500000, max: 1000000 },
  { min: 1000000, max: 2000000 },
  { min: 2000000, max: 5000000 },
  { min: 5000000, max: 0 }
]

// Computed
const hasActiveFilters = computed(() => {
  return !!(localFilters.value.category ||
           localFilters.value.brand ||
           localFilters.value.minPrice ||
           localFilters.value.maxPrice)
})

// Methods
const formatPriceRange = (min: number, max: number) => {
  if (max === 0) {
    return `Trên ${formatPrice(min)}`
  }
  return `${formatPrice(min)} - ${formatPrice(max)}`
}

const setPriceRange = (range: { min: number; max: number }) => {
  localFilters.value.minPrice = range.min
  localFilters.value.maxPrice = range.max === 0 ? undefined : range.max
  emitFilterChange()
}

const emitFilterChange = () => {
  // Clean up empty values
  const cleanFilters: SearchFilters = {}

  if (localFilters.value.category) cleanFilters.category = localFilters.value.category
  if (localFilters.value.brand) cleanFilters.brand = localFilters.value.brand
  if (localFilters.value.minPrice) cleanFilters.minPrice = localFilters.value.minPrice
  if (localFilters.value.maxPrice) cleanFilters.maxPrice = localFilters.value.maxPrice
  if (localFilters.value.sortBy) cleanFilters.sortBy = localFilters.value.sortBy
  if (localFilters.value.sortOrder) cleanFilters.sortOrder = localFilters.value.sortOrder

  emit('update:modelValue', cleanFilters)
  emit('apply', cleanFilters)
}

const clearAllFilters = () => {
  localFilters.value = {
    sortBy: 'name',
    sortOrder: 'asc'
  }
  emit('clear')
}

// Watch for prop changes
watch(
  () => props.modelValue,
  (newFilters) => {
    localFilters.value = { ...newFilters }
  },
  { deep: true }
)
</script>

<style scoped>
.search-filters {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 1rem;
}

.filters-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-of-type {
  margin-bottom: 0;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.filter-label i {
  color: #6c757d;
}

.price-inputs .form-control {
  font-size: 0.875rem;
}

.quick-prices .quick-price-btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.filter-options {
  max-height: 200px;
  overflow-y: auto;
}

.form-check {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
}

.form-check-label {
  font-size: 0.85rem;
  color: #495057;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.form-check-input:checked + .form-check-label {
  color: #007bff;
  font-weight: 500;
}

.form-check .text-muted {
  font-size: 0.75rem;
}

.filter-actions {
  padding-top: 1rem;
  border-top: 1px solid #f8f9fa;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 500;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Custom scrollbar for filter lists */
.filter-options::-webkit-scrollbar {
  width: 4px;
}

.filter-options::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 2px;
}

.filter-options::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 2px;
}

.filter-options::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

@media (max-width: 768px) {
  .filter-group {
    margin-bottom: 1rem;
  }

  .filters-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .quick-prices .quick-price-btn {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>
