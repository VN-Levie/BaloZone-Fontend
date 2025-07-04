<template>
  <div class="search-filters">
    <div class="filters-header">
      <h6 class="filters-title">
        <i class="bi bi-funnel"></i>
        Bộ lọc tìm kiếm
      </h6>
      <button 
        v-if="hasActiveFilters" 
        @click="clearAllFilters" 
        class="btn btn-link btn-sm text-danger p-0"
      >
        Xóa tất cả
      </button>
    </div>

    <div class="filters-content">
      <!-- Category Filter -->
      <div class="filter-group">
        <label class="filter-label">Danh mục</label>
        <select 
          v-model="localFilters.category" 
          @change="emitFilterChange"
          class="form-select form-select-sm"
        >
          <option value="">Tất cả danh mục</option>
          <option 
            v-for="category in categories" 
            :key="category.id" 
            :value="category.id.toString()"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Brand Filter -->
      <div class="filter-group">
        <label class="filter-label">Thương hiệu</label>
        <select 
          v-model="localFilters.brand" 
          @change="emitFilterChange"
          class="form-select form-select-sm"
        >
          <option value="">Tất cả thương hiệu</option>
          <option 
            v-for="brand in brands" 
            :key="brand.id" 
            :value="brand.id.toString()"
          >
            {{ brand.name }}
          </option>
        </select>
      </div>

      <!-- Price Range Filter -->
      <div class="filter-group">
        <label class="filter-label">Khoảng giá</label>
        <div class="price-inputs">
          <div class="input-group input-group-sm">
            <span class="input-group-text">Từ</span>
            <input
              v-model.number="localFilters.minPrice"
              @input="debouncedEmitFilterChange"
              type="number"
              class="form-control"
              placeholder="0"
              min="0"
            />
            <span class="input-group-text">₫</span>
          </div>
          <div class="input-group input-group-sm mt-2">
            <span class="input-group-text">Đến</span>
            <input
              v-model.number="localFilters.maxPrice"
              @input="debouncedEmitFilterChange"
              type="number"
              class="form-control"
              placeholder="∞"
              min="0"
            />
            <span class="input-group-text">₫</span>
          </div>
        </div>
        
        <!-- Quick price ranges -->
        <div class="price-ranges mt-2">
          <button 
            v-for="range in priceRanges"
            :key="range.label"
            @click="setPriceRange(range)"
            class="btn btn-outline-secondary btn-sm me-1 mb-1"
            :class="{ active: isPriceRangeActive(range) }"
          >
            {{ range.label }}
          </button>
        </div>
      </div>

      <!-- Rating Filter -->
      <div class="filter-group">
        <label class="filter-label">Đánh giá</label>
        <div class="rating-filters">
          <button
            v-for="rating in [5, 4, 3, 2, 1]"
            :key="rating"
            @click="setMinRating(rating)"
            class="btn btn-outline-warning btn-sm rating-btn"
            :class="{ active: localFilters.minRating === rating }"
          >
            <span class="stars">
              <i 
                v-for="star in 5" 
                :key="star"
                class="bi"
                :class="star <= rating ? 'bi-star-fill' : 'bi-star'"
              ></i>
            </span>
            <span class="rating-text">{{ rating }}+ sao</span>
          </button>
        </div>
      </div>

      <!-- Sort Filter -->
      <div class="filter-group">
        <label class="filter-label">Sắp xếp theo</label>
        <select 
          v-model="sortBy" 
          @change="emitFilterChange"
          class="form-select form-select-sm"
        >
          <option value="">Mặc định</option>
          <option value="name_asc">Tên: A-Z</option>
          <option value="name_desc">Tên: Z-A</option>
          <option value="price_asc">Giá: Thấp đến cao</option>
          <option value="price_desc">Giá: Cao đến thấp</option>
          <option value="rating_desc">Đánh giá cao nhất</option>
          <option value="created_at_desc">Mới nhất</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Category, Brand } from '@/types'
import type { SearchFilters } from '@/composables/useAdvancedSearch'

interface Props {
  modelValue: SearchFilters
  categories?: Category[]
  brands?: Brand[]
}

interface Emits {
  (e: 'update:modelValue', filters: SearchFilters): void
  (e: 'change', filters: SearchFilters): void
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  brands: () => []
})

const emit = defineEmits<Emits>()

// Local reactive filters
const localFilters = reactive<SearchFilters>({ ...props.modelValue })

// Price ranges
const priceRanges = [
  { label: 'Dưới 500K', min: 0, max: 500000 },
  { label: '500K - 1M', min: 500000, max: 1000000 },
  { label: '1M - 2M', min: 1000000, max: 2000000 },
  { label: '2M - 5M', min: 2000000, max: 5000000 },
  { label: 'Trên 5M', min: 5000000, max: undefined }
]

// Computed
const hasActiveFilters = computed(() => {
  return !!(
    localFilters.category ||
    localFilters.brand ||
    localFilters.minPrice ||
    localFilters.maxPrice ||
    localFilters.minRating ||
    localFilters.sortBy
  )
})

const sortBy = computed({
  get: () => {
    if (localFilters.sortBy && localFilters.sortOrder) {
      return `${localFilters.sortBy}_${localFilters.sortOrder}`
    }
    return ''
  },
  set: (value: string) => {
    if (value) {
      const [sortBy, sortOrder] = value.split('_')
      localFilters.sortBy = sortBy as any
      localFilters.sortOrder = sortOrder as any
    } else {
      localFilters.sortBy = undefined
      localFilters.sortOrder = undefined
    }
  }
})

// Debounced emit for price inputs
let debounceTimeout: number | null = null
const debouncedEmitFilterChange = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emitFilterChange()
  }, 300)
}

// Methods
const emitFilterChange = () => {
  emit('update:modelValue', { ...localFilters })
  emit('change', { ...localFilters })
}

const clearAllFilters = () => {
  Object.keys(localFilters).forEach(key => {
    localFilters[key as keyof SearchFilters] = undefined
  })
  emitFilterChange()
}

const setPriceRange = (range: typeof priceRanges[0]) => {
  localFilters.minPrice = range.min || undefined
  localFilters.maxPrice = range.max || undefined
  emitFilterChange()
}

const isPriceRangeActive = (range: typeof priceRanges[0]) => {
  return localFilters.minPrice === (range.min || undefined) && 
         localFilters.maxPrice === (range.max || undefined)
}

const setMinRating = (rating: number) => {
  localFilters.minRating = localFilters.minRating === rating ? undefined : rating
  emitFilterChange()
}

// Watch for external changes
watch(() => props.modelValue, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })
</script>

<style scoped>
.search-filters {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.filters-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.filters-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filters-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-select,
.form-control {
  border-radius: 6px;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-select:focus,
.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.price-inputs .input-group + .input-group {
  margin-top: 0.5rem;
}

.price-ranges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.price-ranges .btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.price-ranges .btn.active {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
}

.rating-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  text-align: left;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.rating-btn:hover {
  background-color: #fff3cd;
  border-color: #ffc107;
}

.rating-btn.active {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.stars {
  color: #ffc107;
  font-size: 0.875rem;
}

.rating-btn:not(.active) .stars {
  color: #6c757d;
}

.rating-text {
  font-size: 0.875rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .filters-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .search-filters {
    padding: 1rem;
  }
  
  .rating-filters {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .rating-btn {
    flex: 1;
    min-width: 120px;
  }
}
</style>
