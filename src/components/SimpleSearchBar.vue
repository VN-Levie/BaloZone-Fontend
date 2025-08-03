<template>
  <div class="simple-search-bar">
    <div class="input-group">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        autocomplete="off"
        @keydown.enter="handleSearch"
        @input="handleInput"
      />
      <button
        v-if="searchQuery"
        class="btn btn-outline-secondary clear-btn"
        type="button"
        @click="clearSearch"
        title="Xóa tìm kiếm"
      >
        <i class="bi bi-x"></i>
      </button>
      <button
        class="btn btn-primary search-btn"
        type="button"
        @click="handleSearch"
        :disabled="!searchQuery.trim() || isLoading"
        title="Tìm kiếm"
      >
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-search"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  isLoading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', query: string): void
  (e: 'input', query: string): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Tìm kiếm sản phẩm...',
  isLoading: false
})

const emit = defineEmits<Emits>()

// Refs
const searchInput = ref<HTMLInputElement>()

// Computed
const searchQuery = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

// Methods
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (query) {
    emit('search', query)
  }
}

const handleInput = () => {
  emit('input', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('clear')
  searchInput.value?.focus()
}

const focus = () => {
  searchInput.value?.focus()
}

// Expose focus method
defineExpose({
  focus
})
</script>

<style scoped>
.simple-search-bar {
  width: 100%;
  max-width: 500px;
}

.input-group {
  position: relative;
}

.input-group .form-control {
  border-radius: 25px 0 0 25px;
  border-right: none;
  padding: 0.5rem 1rem;
}

.input-group .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  border-right: none;
}

.clear-btn {
  border-radius: 0;
  border-left: none;
  border-right: none;
  padding: 0.5rem 0.7rem;
  background: white;
  border-color: #ced4da;
  color: #6c757d;
}

.clear-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.search-btn {
  border-radius: 0 25px 25px 0;
  /* border-left: none; */
  padding: 0.5rem 1rem;
}

.search-btn:disabled {
  opacity: 0.6;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .simple-search-bar {
    max-width: 100%;
  }

  .input-group .form-control,
  .clear-btn,
  .search-btn {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
