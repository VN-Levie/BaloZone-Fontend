<template>
  <div class="admin-brands">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Quản Lý Thương Hiệu</h1>
          <p class="page-subtitle">Danh sách tất cả thương hiệu trong hệ thống</p>
        </div>
        <div class="header-actions">
          <button 
            type="button" 
            class="btn btn-outline"
            @click="router.push('/admin/brands/trashed')"
          >
            <i class="bi bi-trash"></i>
            Thùng rác
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="router.push('/admin/brands/create')"
          >
            <i class="bi bi-plus"></i>
            Thêm thương hiệu
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
            placeholder="Tìm kiếm thương hiệu..."
            @input="handleSearch"
          />
          <i class="bi bi-search search-icon"></i>
        </div>
        
        <select v-model="selectedStatus" class="form-control" @change="() => loadBrands()">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        <select v-model="hasProducts" class="form-control" @change="() => loadBrands()">
          <option value="">Tất cả thương hiệu</option>
          <option value="true">Có sản phẩm</option>
          <option value="false">Không có sản phẩm</option>
        </select>

        <select v-model="sortBy" class="form-control" @change="() => loadBrands()">
          <option value="created_at">Mới nhất</option>
          <option value="name">Tên A-Z</option>
          <option value="products_count">Số sản phẩm</option>
          <option value="total_revenue">Doanh thu</option>
        </select>
      </div>
    </div>

    <!-- Brands List -->
    <div class="brands-content">
      <div v-if="loading" class="loading-section">
        <LoadingSpinner />
      </div>

      <div v-else-if="brands.length === 0" class="empty-state">
        <i class="bi bi-award empty-icon"></i>
        <h3>Không có thương hiệu nào</h3>
        <p>Hãy tạo thương hiệu đầu tiên của bạn</p>
        <button 
          type="button" 
          class="btn btn-primary"
          @click="router.push('/admin/brands/create')"
        >
          <i class="bi bi-plus"></i>
          Thêm thương hiệu đầu tiên
        </button>
      </div>

      <div v-else class="brands-table-container">
        <table class="brands-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Tên thương hiệu</th>
              <th>Trạng thái</th>
              <th>Sản phẩm</th>
              <th>Doanh thu</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brand in brands" :key="brand.id">
              <td class="brand-logo-cell">
                <img 
                  :src="brand.logo || 'https://placehold.co/600x400?text=img'" 
                  :alt="brand.name"
                  class="brand-thumbnail"
                  @error="handleImageError"
                />
              </td>
              <td class="brand-name-cell">
                <div class="brand-name">{{ brand.name }}</div>
                <div class="brand-slug">{{ brand.slug }}</div>
                <div v-if="brand.description" class="brand-description">
                  {{ truncateText(brand.description, 50) }}
                </div>
              </td>
              <td>
                <span 
                  class="status-badge"
                  :class="{
                    'status-active': brand.status === 'active',
                    'status-inactive': brand.status === 'inactive'
                  }"
                >
                  <i class="bi" :class="brand.status === 'active' ? 'bi-check-circle' : 'bi-x-circle'"></i>
                  {{ brand.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                </span>
              </td>
              <td class="products-cell">
                <div class="products-stats">
                  <span class="total-products">{{ brand.products_count || 0 }} sản phẩm</span>
                  <span v-if="brand.active_products_count !== undefined" class="active-products">
                    ({{ brand.active_products_count }} hoạt động)
                  </span>
                </div>
              </td>
              <td class="revenue-cell">
                <span v-if="brand.total_revenue" class="revenue-amount">
                  {{ formatPrice(brand.total_revenue) }}
                </span>
                <span v-else class="no-revenue">-</span>
              </td>
              <td class="date-cell">
                {{ formatDate(brand.created_at) }}
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button 
                    type="button"
                    class="btn-icon btn-edit"
                    @click="editBrand(brand.id)"
                    title="Chỉnh sửa"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    type="button"
                    class="btn-icon btn-delete"
                    @click="confirmDelete(brand)"
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
          <h3>Xác nhận xóa thương hiệu</h3>
          <button type="button" class="close-btn" @click="closeDeleteModal">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa thương hiệu <strong>{{ brandToDelete?.name }}</strong>?</p>
          <p v-if="brandToDelete?.products_count && brandToDelete.products_count > 0" class="text-warning">
            <i class="bi bi-exclamation-triangle"></i>
            Thương hiệu này có {{ brandToDelete.products_count }} sản phẩm. Bạn có thể cần xem xét lại.
          </p>
          <p class="text-danger">Hành động này sẽ chuyển thương hiệu vào thùng rác.</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" @click="closeDeleteModal">
            Hủy
          </button>
          <button 
            type="button" 
            class="btn btn-danger"
            @click="deleteBrand"
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
import { adminBrandsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { formatDate, truncateText } from '@/utils'
import { parseApiError } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Brand } from '@/types'

const router = useRouter()
const { showSuccess, showError } = useToast()

// State
const brands = ref<Brand[]>([])
const loading = ref(false)
const deleting = ref(false)

// Filters
const searchQuery = ref('')
const selectedStatus = ref('')
const hasProducts = ref('')
const sortBy = ref('created_at')

// Pagination
const pagination = ref<{
  current_page: number
  last_page: number
  per_page: number
  total: number
} | null>(null)

// Delete modal
const showDeleteModal = ref(false)
const brandToDelete = ref<Brand | null>(null)

// Methods
const loadBrands = async (page = 1) => {
  loading.value = true
  try {
    // Build query parameters for filters
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', '12')
    
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }
    
    if (selectedStatus.value) {
      params.append('status', selectedStatus.value)
    }
    
    if (hasProducts.value) {
      params.append('has_products', hasProducts.value)
    }
    
    if (sortBy.value) {
      params.append('sort_by', sortBy.value)
      params.append('sort_order', 'desc')
    }

    const response = await adminBrandsApi.getBrands(page, 12, params)
    
    if (response && response.data) {
      // Handle Laravel pagination structure
      const brandData = response.data || []
      brands.value = Array.isArray(brandData) ? brandData.filter(brand => brand && brand.id) : []
      
      // Extract pagination info
      pagination.value = {
        current_page: response.current_page || 1,
        last_page: response.last_page || 1,
        per_page: response.per_page || 10,
        total: response.total || 0
      }
    } else {
      brands.value = []
      pagination.value = null
    }
  } catch (error) {
    console.error('Failed to load brands:', error)
    const friendlyMessage = parseApiError(error)
    showError('Lỗi', friendlyMessage)
    brands.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // Debounce search
  setTimeout(() => {
    loadBrands(1)
  }, 300)
}

const editBrand = (brandId: number) => {
  router.push(`/admin/brands/${brandId}/edit`)
}

const confirmDelete = (brand: Brand) => {
  brandToDelete.value = brand
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  brandToDelete.value = null
}

const deleteBrand = async () => {
  if (!brandToDelete.value) return

  deleting.value = true
  try {
    await adminBrandsApi.deleteBrand(brandToDelete.value.id)
    showSuccess('Thành công', 'Xóa thương hiệu thành công')
    closeDeleteModal()
    loadBrands() // Reload current page
  } catch (error) {
    console.error('Failed to delete brand:', error)
    const friendlyMessage = parseApiError(error)
    showError('Lỗi', friendlyMessage)
  } finally {
    deleting.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    loadBrands(page)
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
const formatPrice = (price: number | string) => {
  try {
    if (typeof price === 'string') {
      price = parseFloat(price)
    }
    const validPrice = typeof price === 'number' && !isNaN(price) ? price : 0
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(validPrice)
  } catch (error) {
    return '0 ₫'
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/600x400?text=img'
}

// Lifecycle
onMounted(() => {
  loadBrands()
})
</script>

<style scoped>
.admin-brands {
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

.brands-content {
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
.brands-table-container {
  overflow-x: auto;
}

.brands-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.brands-table th {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  font-size: 14px;
}

.brands-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.brands-table tbody tr:hover {
  background: #f8f9fa;
}

.brand-logo-cell {
  width: 80px;
}

.brand-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.brand-name-cell {
  min-width: 200px;
}

.brand-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  line-height: 1.3;
}

.brand-slug {
  font-size: 12px;
  color: #6c757d;
  font-family: monospace;
  margin-bottom: 4px;
}

.brand-description {
  font-size: 13px;
  color: #6c757d;
  line-height: 1.3;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.status-badge.status-active {
  background: #d4edda;
  color: #155724;
}

.status-badge.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.products-cell {
  min-width: 120px;
}

.products-stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.total-products {
  font-weight: 600;
  color: #2c3e50;
  font-size: 13px;
}

.active-products {
  font-size: 11px;
  color: #6c757d;
}

.revenue-cell {
  font-weight: 600;
  color: #2c3e50;
  text-align: right;
  min-width: 120px;
}

.revenue-amount {
  color: #28a745;
}

.no-revenue {
  color: #6c757d;
}

.date-cell {
  min-width: 100px;
  font-size: 13px;
  color: #6c757d;
}

.actions-cell {
  width: 100px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
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
}

.spin-animation {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .admin-brands {
    padding: 15px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .brands-table-container {
    overflow-x: scroll;
  }
  
  .brands-table {
    min-width: 800px;
  }
  
  .brands-table th,
  .brands-table td {
    padding: 8px 10px;
    font-size: 12px;
  }
  
  .brand-thumbnail {
    width: 40px;
    height: 40px;
  }
  
  .pagination-nav {
    flex-wrap: wrap;
  }
}
</style>
