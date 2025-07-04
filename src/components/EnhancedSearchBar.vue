<template>
  <div class="enhanced-search-bar">
    <div class="search-input-container" ref="searchContainer">
      <div class="input-group">
        <span class="input-group-text">
          <i class="bi bi-search"></i>
        </span>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="form-control"
          :placeholder="placeholder"
          autocomplete="off"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
          @input="handleInput"
        />
        <button
          v-if="searchQuery"
          class="btn btn-outline-secondary clear-btn"
          type="button"
          @click="clearSearch"
        >
          <i class="bi bi-x"></i>
        </button>
        <button
          class="btn btn-primary search-btn"
          type="button"
          @click="performSearch"
          :disabled="!searchQuery.trim()"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Đang tìm...' : 'Tìm kiếm' }}
        </button>
      </div>

      <!-- Suggestions Dropdown -->
      <div
        v-if="showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)"
        class="suggestions-dropdown"
      >
        <!-- Current suggestions -->
        <div v-if="suggestions.length > 0" class="suggestions-section">
          <div class="suggestions-header">
            <small class="text-muted">Gợi ý tìm kiếm</small>
          </div>
          <div
            v-for="(suggestion, index) in suggestions"
            :key="suggestion.id"
            class="suggestion-item"
            :class="{ active: selectedIndex === index }"
            @click="selectSuggestion(suggestion)"
            @mouseenter="selectedIndex = index"
          >
            <i :class="`${suggestion.icon} me-2`"></i>
            <span class="suggestion-text">{{ suggestion.text }}</span>
            <small class="suggestion-type">{{ getSuggestionTypeLabel(suggestion.type) }}</small>
          </div>
        </div>

        <!-- Search history -->
        <div v-if="searchHistory.length > 0 && !searchQuery" class="suggestions-section">
          <div class="suggestions-header">
            <small class="text-muted">Tìm kiếm gần đây</small>
            <button
              class="btn btn-link btn-sm p-0"
              @click="clearHistory"
            >
              <small>Xóa lịch sử</small>
            </button>
          </div>
          <div
            v-for="(historyItem, index) in searchHistory.slice(0, 5)"
            :key="`history-${index}`"
            class="suggestion-item"
            :class="{ active: selectedIndex === suggestions.length + index }"
            @click="selectHistoryItem(historyItem)"
            @mouseenter="selectedIndex = suggestions.length + index"
          >
            <i class="bi bi-clock-history me-2"></i>
            <span class="suggestion-text">{{ historyItem }}</span>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingSuggestions" class="suggestions-loading">
          <div class="d-flex align-items-center justify-content-center py-2">
            <div class="spinner-border spinner-border-sm me-2"></div>
            <small class="text-muted">Đang tìm gợi ý...</small>
          </div>
        </div>

        <!-- No suggestions -->
        <div v-if="searchQuery && suggestions.length === 0 && !isLoadingSuggestions" class="no-suggestions">
          <div class="text-center py-2">
            <small class="text-muted">Không tìm thấy gợi ý</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Filters Toggle -->
    <div v-if="showFiltersToggle" class="filters-toggle mt-2">
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="$emit('toggle-filters')"
      >
        <i class="bi bi-funnel me-1"></i>
        Bộ lọc
        <span v-if="activeFiltersCount > 0" class="badge bg-primary ms-1">
          {{ activeFiltersCount }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import type { SearchSuggestion } from '@/composables/useAdvancedSearch'

interface Props {
  modelValue: string
  suggestions: SearchSuggestion[]
  searchHistory: string[]
  isLoading?: boolean
  isLoadingSuggestions?: boolean
  showSuggestions?: boolean
  activeFiltersCount?: number
  showFiltersToggle?: boolean
  placeholder?: string
}

interface Emits {
  'update:modelValue': [value: string]
  'search': [query: string]
  'clear': []
  'focus': []
  'blur': []
  'select-suggestion': [suggestion: SearchSuggestion]
  'select-history': [historyItem: string]
  'clear-history': []
  'toggle-filters': []
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isLoadingSuggestions: false,
  showSuggestions: false,
  activeFiltersCount: 0,
  showFiltersToggle: true,
  placeholder: 'Tìm kiếm sản phẩm, danh mục, thương hiệu...'
})

const emit = defineEmits<Emits>()

// Refs
const searchInput = ref<HTMLInputElement>()
const searchContainer = ref<HTMLElement>()

// Local state
const selectedIndex = ref(-1)
const isFocused = ref(false)

// Computed
const searchQuery = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const totalSuggestions = computed(() => {
  return props.suggestions.length + (props.searchHistory.length > 0 && !searchQuery.value ? 5 : 0)
})

// Methods
const performSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    hideSuggestions()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('clear')
  searchInput.value?.focus()
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  // Delay to allow clicking on suggestions
  setTimeout(() => {
    isFocused.value = false
    selectedIndex.value = -1
    emit('blur')
  }, 200)
}

const handleInput = () => {
  selectedIndex.value = -1
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (selectedIndex.value < totalSuggestions.value - 1) {
        selectedIndex.value++
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (selectedIndex.value > -1) {
        selectedIndex.value--
      }
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0) {
        selectSuggestionByIndex(selectedIndex.value)
      } else {
        performSearch()
      }
      break
    case 'Escape':
      hideSuggestions()
      searchInput.value?.blur()
      break
  }
}

const selectSuggestionByIndex = (index: number) => {
  if (index < props.suggestions.length) {
    selectSuggestion(props.suggestions[index])
  } else {
    const historyIndex = index - props.suggestions.length
    if (historyIndex < props.searchHistory.length) {
      selectHistoryItem(props.searchHistory[historyIndex])
    }
  }
}

const selectSuggestion = (suggestion: SearchSuggestion) => {
  searchQuery.value = suggestion.text
  emit('select-suggestion', suggestion)
  hideSuggestions()
}

const selectHistoryItem = (historyItem: string) => {
  searchQuery.value = historyItem
  emit('select-history', historyItem)
  hideSuggestions()
}

const clearHistory = () => {
  emit('clear-history')
}

const hideSuggestions = () => {
  selectedIndex.value = -1
}

const getSuggestionTypeLabel = (type: string) => {
  switch (type) {
    case 'category':
      return 'Danh mục'
    case 'brand':
      return 'Thương hiệu'
    case 'product':
      return 'Sản phẩm'
    default:
      return ''
  }
}

// Click outside handler
const handleClickOutside = (event: Event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    hideSuggestions()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose focus method
defineExpose({
  focus: () => searchInput.value?.focus()
})
</script>

<style scoped>
.enhanced-search-bar {
  position: relative;
}

.search-input-container {
  position: relative;
}

.input-group {
  position: relative;
}

.input-group-text {
  background: white;
  border-right: none;
  color: #6c757d;
}

.form-control {
  border-left: none;
  border-right: none;
  padding-left: 0;
}

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.clear-btn {
  border-left: none;
  border-right: none;
  padding: 0.375rem 0.5rem;
}

.search-btn {
  border-left: none;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dee2e6;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.suggestions-section {
  border-bottom: 1px solid #f8f9fa;
}

.suggestions-section:last-child {
  border-bottom: none;
}

.suggestions-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.5rem 1rem 0.25rem;
  background: #f8f9fa;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.active {
  background-color: #f8f9fa;
}

.suggestion-text {
  flex: 1;
  font-size: 0.9rem;
}

.suggestion-type {
  color: #6c757d;
  font-size: 0.75rem;
  margin-left: auto;
}

.suggestions-loading,
.no-suggestions {
  padding: 1rem;
}

.filters-toggle {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .input-group {
    flex-wrap: wrap;
  }
  
  .search-btn {
    flex: 1;
    margin-top: 0.5rem;
  }
  
  .clear-btn {
    order: -1;
  }
}
</style>
