<template>
  <div class="admin-products">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Quản Lý Sản Phẩm</h1>
          <p class="page-subtitle">Danh sách tất cả sản phẩm trong hệ thống</p>
        </div>
        <div class="header-actions">
          <button 
            type="button" 
            class="btn btn-primary"
            @click="router.push('/admin/products/create')"
          >
            <i class="fas fa-plus"></i>
            Thêm sản phẩm
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
            placeholder="Tìm kiếm sản phẩm..."
            @input="handleSearch"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <select v-model="selectedCategory" class="form-control" @change="() => loadProducts()">
          <option value="">Tất cả danh mục</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <select v-model="selectedBrand" class="form-control" @change="() => loadProducts()">
          <option value="">Tất cả thương hiệu</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>

        <select v-model="sortBy" class="form-control" @change="() => loadProducts()">
          <option value="created_at">Mới nhất</option>
          <option value="name">Tên A-Z</option>
          <option value="price">Giá thấp đến cao</option>
          <option value="price_desc">Giá cao đến thấp</option>
          <option value="stock">Tồn kho</option>
        </select>
      </div>
    </div>

    <!-- Products List -->
    <div class="products-content">
      <div v-if="loading" class="loading-section">
        <LoadingSpinner />
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <i class="fas fa-box-open empty-icon"></i>
        <h3>Không có sản phẩm nào</h3>
        <p>Hãy tạo sản phẩm đầu tiên của bạn</p>
        <button 
          type="button" 
          class="btn btn-primary"
          @click="router.push('/admin/products/create')"
        >
          <i class="fas fa-plus"></i>
          Thêm sản phẩm đầu tiên
        </button>
      </div>

      <div v-else class="products-grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img 
              :src="product.image || '/placeholder-product.jpg'" 
              :alt="product.name"
              @error="handleImageError"
            />
            <div class="product-actions">
              <button 
                type="button"
                class="action-btn edit"
                @click="editProduct(product.id)"
                title="Chỉnh sửa"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                type="button"
                class="action-btn delete"
                @click="confirmDelete(product)"
                title="Xóa"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <div class="product-meta">
              <span v-if="product.category" class="category-badge">
                {{ product.category.name }}
              </span>
              <span v-if="product.brand" class="brand-badge">
                {{ product.brand.name }}
              </span>
            </div>
            
            <div class="product-pricing">
              <span v-if="product.discount_price" class="current-price">
                {{ formatPrice(product.discount_price) }}
              </span>
              <span 
                class="original-price"
                :class="{ 'discounted': product.discount_price }"
              >
                {{ formatPrice(product.price) }}
              </span>
            </div>

            <div class="product-stock">
              <span 
                class="stock-badge"
                :class="getStockClass(product.stock)"
              >
                <i class="fas fa-box"></i>
                {{ product.stock }} trong kho
              </span>
            </div>

            <div class="product-dates">
              <small class="text-muted">
                Tạo: {{ formatDate(product.created_at) }}
              </small>
            </div>
          </div>
        </div>
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
            <i class="fas fa-chevron-left"></i>
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
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa sản phẩm</h3>
          <button type="button" class="close-btn" @click="closeDeleteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{{ productToDelete?.name }}</strong>?</p>
          <p class="text-danger">Hành động này không thể hoàn tác.</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" @click="closeDeleteModal">
            Hủy
          </button>
          <button 
            type="button" 
            class="btn btn-danger"
            @click="deleteProduct"
            :disabled="deleting"
          >
            <i v-if="deleting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-trash"></i>
            {{ deleting ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { adminProductsApi, categoriesApi, brandsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { AdminProduct, Category, Brand } from '@/types'

const router = useRouter()
const { showSuccess, showError } = useToast()

// State
const products = ref<AdminProduct[]>([])
const categories = ref<Category[]>([])
const brands = ref<Brand[]>([])
const loading = ref(false)
const deleting = ref(false)

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
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
const productToDelete = ref<AdminProduct | null>(null)

// Methods
const loadProducts = async (page = 1) => {
  loading.value = true
  try {
    const response = await adminProductsApi.getProducts(page, 12)
    
    if (response.success) {
      products.value = response.data
      pagination.value = response.meta || null
    }
  } catch (error) {
    console.error('Failed to load products:', error)
    showError('Lỗi', 'Không thể tải danh sách sản phẩm')
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await categoriesApi.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadBrands = async () => {
  try {
    const response = await brandsApi.getBrands()
    brands.value = response.data
  } catch (error) {
    console.error('Failed to load brands:', error)
  }
}

const handleSearch = () => {
  // Debounce search
  setTimeout(() => {
    loadProducts(1)
  }, 300)
}

const editProduct = (productId: number) => {
  router.push(`/admin/products/${productId}/edit`)
}

const confirmDelete = (product: AdminProduct) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  deleting.value = true
  try {
    await adminProductsApi.deleteProduct(productToDelete.value.id)
    showSuccess('Thành công', 'Xóa sản phẩm thành công')
    closeDeleteModal()
    loadProducts() // Reload current page
  } catch (error) {
    console.error('Failed to delete product:', error)
    showError('Lỗi', 'Không thể xóa sản phẩm')
  } finally {
    deleting.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    loadProducts(page)
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
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getStockClass = (stock: number) => {
  if (stock === 0) return 'out-of-stock'
  if (stock < 10) return 'low-stock'
  return 'in-stock'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-product.jpg'
}

// Lifecycle
onMounted(() => {
  loadProducts()
  loadCategories()
  loadBrands()
})
</script>

<style scoped>
.admin-products {
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

.products-content {
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.edit {
  background: #007bff;
  color: white;
}

.action-btn.edit:hover {
  background: #0056b3;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.action-btn.delete:hover {
  background: #c82333;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #1a1a1a;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.category-badge,
.brand-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.category-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.brand-badge {
  background: #f3e5f5;
  color: #7b1fa2;
}

.product-pricing {
  margin-bottom: 10px;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #dc3545;
  margin-right: 8px;
}

.original-price {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.original-price.discounted {
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
}

.product-stock {
  margin-bottom: 10px;
}

.stock-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.stock-badge.in-stock {
  background: #d4edda;
  color: #155724;
}

.stock-badge.low-stock {
  background: #fff3cd;
  color: #856404;
}

.stock-badge.out-of-stock {
  background: #f8d7da;
  color: #721c24;
}

.product-dates {
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}

.text-muted {
  color: #666;
  font-size: 12px;
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

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .admin-products {
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
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination-nav {
    flex-wrap: wrap;
  }
}
</style>
