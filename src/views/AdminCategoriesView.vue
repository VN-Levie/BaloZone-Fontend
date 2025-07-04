<template>
  <div class="admin-categories">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Quản Lý Danh Mục</h1>
          <p class="page-subtitle">Danh sách tất cả danh mục trong hệ thống</p>
        </div>
        <div class="header-actions">
          <button 
            type="button" 
            class="btn btn-outline"
            @click="router.push('/admin/categories/trashed')"
          >
            <i class="bi bi-trash"></i>
            Thùng rác
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="router.push('/admin/categories/create')"
          >
            <i class="bi bi-plus"></i>
            Thêm danh mục
          </button>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="filters-section">
      <div class="filters-grid">
        <div class="search-group">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Tìm kiếm danh mục..."
            @input="handleSearch"
          />
          <i class="bi bi-search search-icon"></i>
        </div>
        
        <select v-model="hasProducts" class="form-control" @change="() => loadCategories()">
          <option value="">Tất cả danh mục</option>
          <option value="true">Có sản phẩm</option>
          <option value="false">Không có sản phẩm</option>
        </select>

        <select v-model="sortBy" class="form-control" @change="() => loadCategories()">
          <option value="created_at">Mới nhất</option>
          <option value="name">Tên A-Z</option>
          <option value="products_count">Số sản phẩm</option>
        </select>

        <select v-model="sortOrder" class="form-control" @change="() => loadCategories()">
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
      </div>
    </div>

    <!-- Categories List -->
    <div class="categories-content">
      <div v-if="loading" class="loading-section">
        <LoadingSpinner />
      </div>

      <div v-else-if="categories.length === 0" class="empty-state">
        <i class="bi bi-box-seam empty-icon"></i>
        <h3>Không có danh mục nào</h3>
        <p>Hãy tạo danh mục đầu tiên của bạn</p>
        <button 
          type="button" 
          class="btn btn-primary"
          @click="router.push('/admin/categories/create')"
        >
          <i class="bi bi-plus"></i>
          Thêm danh mục đầu tiên
        </button>
      </div>

      <div v-else class="categories-table-container">
        <table class="categories-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên danh mục</th>
              <th>Slug</th>
              <th>Số sản phẩm</th>
              <th>Sản phẩm hoạt động</th>
              <th>Doanh thu</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td class="category-image-cell">
                <img 
                  :src="category.image || 'https://placehold.co/600x400?text=img'" 
                  :alt="category.name"
                  class="category-thumbnail"
                  @error="handleImageError"
                />
              </td>
              <td class="category-name-cell">
                <div class="category-name">{{ category.name }}</div>
                <div class="category-description">{{ category.description || 'Không có mô tả' }}</div>
              </td>
              <td class="slug-cell">
                <code class="slug-code">{{ category.slug }}</code>
              </td>
              <td class="number-cell">
                <span class="count-badge">{{ category.products_count || 0 }}</span>
              </td>
              <td class="number-cell">
                <span class="count-badge active">{{ category.active_products_count || 0 }}</span>
              </td>
              <td class="revenue-cell">
                {{ formatRevenue(category.total_revenue || 0) }}
              </td>
              <td class="date-cell">
                {{ formatDate(category.created_at) }}
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button 
                    type="button"
                    class="btn-icon btn-view"
                    @click="viewCategoryProducts(category.id)"
                    title="Xem sản phẩm"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    type="button"
                    class="btn-icon btn-edit"
                    @click="editCategory(category.id)"
                    title="Chỉnh sửa"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    type="button"
                    class="btn-icon btn-delete"
                    @click="confirmDelete(category)"
                    title="Xóa"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.total > pagination.per_page" class="pagination-section">
        <nav class="pagination-nav">
          <button
            type="button"
            class="btn btn-outline"
            :disabled="pagination.current_page <= 1"
            @click="changePage(pagination.current_page - 1)"
          >
            <i class="bi bi-chevron-left"></i>
            Trước
          </button>

          <div class="page-numbers">
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              type="button"
              class="btn"
              :class="page === pagination.current_page ? 'btn-primary' : 'btn-outline'"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            type="button"
            class="btn btn-outline"
            :disabled="pagination.current_page >= pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
          >
            Sau
            <i class="bi bi-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa danh mục</h3>
          <button type="button" class="close-btn" @click="closeDeleteModal">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa danh mục <strong>{{ categoryToDelete?.name }}</strong>?</p>
          <p v-if="categoryToDelete?.products_count && categoryToDelete.products_count > 0" class="text-warning">
            <i class="bi bi-exclamation-triangle"></i>
            Danh mục này có {{ categoryToDelete.products_count }} sản phẩm. Việc xóa có thể không thành công nếu có sản phẩm đang hoạt động.
          </p>
          <p class="text-danger">Hành động này có thể hoàn tác từ thùng rác.</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" @click="closeDeleteModal">
            Hủy
          </button>
          <button 
            type="button" 
            class="btn btn-danger"
            @click="deleteCategory"
            :disabled="deleting"
          >
            <i v-if="deleting" class="bi bi-arrow-repeat spin-animation"></i>
            <i v-else class="bi bi-trash"></i>
            {{ deleting ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminCategoriesApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Category } from '@/types'

const router = useRouter()
const { showSuccess, showError } = useToast()

// State
const categories = ref<Category[]>([])
const loading = ref(false)
const deleting = ref(false)

// Filters
const searchQuery = ref('')
const hasProducts = ref('')
const sortBy = ref('created_at')
const sortOrder = ref('desc')

// Pagination
const pagination = ref<{
  current_page: number
  last_page: number
  per_page: number
  total: number
} | null>(null)

// Delete modal
const showDeleteModal = ref(false)
const categoryToDelete = ref<Category | null>(null)

// Methods
const loadCategories = async (page = 1) => {
  loading.value = true
  try {
    // Build query parameters for filters
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', '15')
    
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }
    
    if (hasProducts.value) {
      params.append('has_products', hasProducts.value)
    }
    
    if (sortBy.value) {
      params.append('sort_by', sortBy.value)
    }
    
    if (sortOrder.value) {
      params.append('sort_order', sortOrder.value)
    }

    const response = await adminCategoriesApi.getCategories(page, 15, params)
    
    if (response && response.data) {
      // Handle Laravel pagination structure: response.data contains categories or { data, pagination }
      if (Array.isArray(response.data)) {
        // Direct array response
        categories.value = response.data.filter(category => category && category.id)
        pagination.value = null
      } else {
        // Paginated response - cast to any to handle dynamic structure
        const paginatedData = response.data as any
        const categoryData = paginatedData.data || paginatedData
        categories.value = Array.isArray(categoryData) ? categoryData.filter((category: any) => category && category.id) : []
        
        // Extract pagination info
        pagination.value = {
          current_page: paginatedData.current_page || 1,
          last_page: paginatedData.last_page || 1,
          per_page: paginatedData.per_page || 15,
          total: paginatedData.total || 0
        }
      }
    } else {
      categories.value = []
      pagination.value = null
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
    showError('Lỗi', 'Không thể tải danh sách danh mục')
    categories.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // Debounce search
  setTimeout(() => {
    loadCategories(1)
  }, 300)
}

const editCategory = (categoryId: number) => {
  router.push(`/admin/categories/${categoryId}/edit`)
}

const viewCategoryProducts = (categoryId: number) => {
  router.push(`/admin/categories/${categoryId}/products`)
}

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  categoryToDelete.value = null
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return

  deleting.value = true
  try {
    await adminCategoriesApi.deleteCategory(categoryToDelete.value.id)
    showSuccess('Thành công', 'Xóa danh mục thành công')
    closeDeleteModal()
    loadCategories() // Reload current page
  } catch (error: any) {
    console.error('Failed to delete category:', error)
    if (error.message.includes('has active products')) {
      showError('Không thể xóa', 'Danh mục này có sản phẩm đang hoạt động. Vui lòng xóa hoặc chuyển sản phẩm trước.')
    } else {
      showError('Lỗi', 'Không thể xóa danh mục')
    }
  } finally {
    deleting.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    loadCategories(page)
  }
}

const getPageNumbers = () => {
  if (!pagination.value) return []
  
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const delta = 2
  const range = []
  
  for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
    range.push(i)
  }
  
  return range
}

// Utility functions
const formatRevenue = (revenue: number) => {
  try {
    const validRevenue = typeof revenue === 'number' && !isNaN(revenue) ? revenue : 0
    if (validRevenue === 0) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(validRevenue)
  } catch (error) {
    return '0 ₫'
  }
}

const formatDate = (dateString: string) => {
  try {
    if (!dateString) return new Date().toLocaleDateString('vi-VN')
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch (error) {
    return new Date().toLocaleDateString('vi-VN')
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/600x400?text=img'
}

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.admin-categories {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #1a1a1a;
}

.page-subtitle {
  color: #666;
  margin: 0;
}

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 15px;
  align-items: center;
}

.search-group {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.categories-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.empty-state p {
  color: #999;
  margin-bottom: 20px;
}

/* Table Styles */
.categories-table-container {
  overflow-x: auto;
}

.categories-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.categories-table th {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  font-size: 14px;
}

.categories-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.categories-table tbody tr:hover {
  background: #f8f9fa;
}

.category-image-cell {
  width: 80px;
}

.category-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.category-name-cell {
  min-width: 200px;
}

.category-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  line-height: 1.3;
}

.category-description {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slug-cell {
  min-width: 150px;
}

.slug-code {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  border: 1px solid #e9ecef;
}

.number-cell {
  text-align: center;
  min-width: 80px;
}

.count-badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  min-width: 30px;
  display: inline-block;
}

.count-badge.active {
  background: #d4edda;
  color: #155724;
}

.revenue-cell {
  font-weight: 600;
  color: #28a745;
  text-align: right;
  min-width: 120px;
}

.date-cell {
  min-width: 100px;
  font-size: 13px;
  color: #6c757d;
}

.actions-cell {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
}

.btn-view {
  background: #e8f5e8;
  color: #28a745;
}

.btn-view:hover {
  background: #d4edda;
  color: #1e7e34;
}

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
  color: #0d47a1;
}

.btn-delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-delete:hover {
  background: #ffcdd2;
  color: #b71c1c;
}

.pagination-section {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.pagination-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

/* Button Styles */
.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-outline {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.btn-outline:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #aaa;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.text-danger {
  color: #dc3545;
}

.text-warning {
  color: #856404;
  background: #fff3cd;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ffeaa7;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spin-animation {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .admin-categories {
    padding: 15px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-table-container {
    overflow-x: scroll;
  }
  
  .categories-table {
    min-width: 900px;
  }
  
  .categories-table th,
  .categories-table td {
    padding: 8px 10px;
    font-size: 12px;
  }
  
  .category-thumbnail {
    width: 40px;
    height: 40px;
  }
  
  .pagination-nav {
    flex-wrap: wrap;
  }
}
</style>
