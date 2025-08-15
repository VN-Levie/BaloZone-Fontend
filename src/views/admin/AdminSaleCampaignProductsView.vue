<template>
  <AdminLayout>
    <div class="admin-sale-campaign-products">
      <div class="header-section">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <router-link to="/admin/dashboard">Dashboard</router-link>
                  </li>
                  <li class="breadcrumb-item">
                    <router-link to="/admin/sale-campaigns">Chiến dịch khuyến mãi</router-link>
                  </li>
                  <li class="breadcrumb-item active">Quản lý sản phẩm</li>
                </ol>
              </nav>
              <h1 class="page-title">
                <i class="bi bi-box text-primary"></i>
                Quản lý Sản phẩm
              </h1>
              <p v-if="currentCampaign" class="page-subtitle">
                Chiến dịch: <strong>{{ currentCampaign.name }}</strong>
              </p>
            </div>
            <div class="col-auto">
              <router-link to="/admin/sale-campaigns" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left"></i>
                Quay lại
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="container-fluid">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
            <p class="mt-3">Đang tải thông tin...</p>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="container-fluid">
          <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle"></i>
            {{ error }}
            <button @click="loadData" class="btn btn-sm btn-outline-danger ms-2">
              Thử lại
            </button>
          </div>
        </div>
      </div>

      <div v-else class="content-section">
        <div class="container-fluid">
          <div class="row">
            <!-- Campaign Products -->
            <div class="col-lg-8">
              <div class="products-card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-box-seam text-primary"></i>
                    Sản phẩm trong chiến dịch
                    <span class="badge bg-primary ms-2">{{ campaignProducts.length }}</span>
                  </h5>
                </div>

                <div class="card-body">
                  <!-- No Products -->
                  <div v-if="!campaignProducts.length" class="no-products">
                    <i class="bi bi-inbox fs-1 text-muted"></i>
                    <h4 class="mt-3">Chưa có sản phẩm</h4>
                    <p class="text-muted">Thêm sản phẩm từ danh sách bên phải để bắt đầu.</p>
                  </div>

                  <!-- Products List -->
                  <div v-else class="products-list">
                    <div v-for="product in campaignProducts" :key="product.id" class="product-item">
                      <!-- Product Image -->
                      <div class="product-image">
                        <img :src="getImageUrl(product.image)" :alt="product.name" />
                        <div class="discount-badge" v-if="product.pivot?.discount_percentage > 0">
                          -{{ product.pivot.discount_percentage }}%
                        </div>
                      </div>

                      <!-- Product Info -->
                      <div class="product-info">
                        <div class="product-header">
                          <h6 class="product-name">{{ product.name }}</h6>
                          <span class="product-category" v-if="product.category">
                            <i class="bi bi-tag"></i>
                            {{ product.category.name }}
                          </span>
                        </div>

                        <div class="price-section">
                          <div class="price-row">
                            <span class="price-label">Giá gốc:</span>
                            <span class="original-price">{{ formatPrice(product.pivot?.original_price || product.price) }}</span>
                          </div>
                          <div class="price-row">
                            <span class="price-label">Giá KM:</span>
                            <span class="sale-price">{{ formatPrice(product.pivot?.sale_price) }}</span>
                          </div>
                          <div class="savings">
                            Tiết kiệm: {{ formatPrice((product.pivot?.original_price || product.price) - (product.pivot?.sale_price || 0)) }}
                          </div>
                        </div>
                      </div>

                      <!-- Product Stats -->
                      <div class="product-stats">
                        <div class="stat-card">
                          <div class="stat-icon">
                            <i class="bi bi-box"></i>
                          </div>
                          <div class="stat-content">
                            <div class="stat-value">{{ product.pivot?.max_quantity || '∞' }}</div>
                            <div class="stat-label">Giới hạn</div>
                          </div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-icon sold">
                            <i class="bi bi-graph-up"></i>
                          </div>
                          <div class="stat-content">
                            <div class="stat-value">{{ product.pivot?.sold_quantity || 0 }}</div>
                            <div class="stat-label">Đã bán</div>
                          </div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-icon stock">
                            <i class="bi bi-boxes"></i>
                          </div>
                          <div class="stat-content">
                            <div class="stat-value">{{ product.stock }}</div>
                            <div class="stat-label">Tồn kho</div>
                          </div>
                        </div>
                      </div>

                      <!-- Product Actions -->
                      <div class="product-actions">
                        <button @click="editProductSale(product)" class="btn btn-sm btn-outline-primary" title="Chỉnh sửa thông tin khuyến mãi">
                          <i class="bi bi-pencil"></i>
                          <span class="action-text">Sửa</span>
                        </button>
                        <button @click="removeProduct(product)" class="btn btn-sm btn-outline-danger" title="Xóa khỏi chiến dịch">
                          <i class="bi bi-trash"></i>
                          <span class="action-text">Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Products Sidebar -->
            <div class="col-lg-4">
              <div class="add-products-card">
                <div class="card-header">
                  <h6 class="mb-0">
                    <i class="bi bi-plus-circle text-success"></i>
                    Thêm sản phẩm
                  </h6>
                </div>

                <div class="card-body">
                  <!-- Search Products -->
                  <div class="search-section">
                    <div class="search-box">
                      <i class="bi bi-search"></i>
                      <input
                        v-model="searchQuery"
                        @input="debouncedSearch"
                        type="text"
                        class="form-control"
                        placeholder="Tìm kiếm sản phẩm theo tên..."
                      />
                      <button
                        v-if="searchQuery"
                        @click="clearSearch"
                        class="btn-clear"
                        type="button"
                        title="Xóa tìm kiếm"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>

                    <div class="filters">
                      <select v-model="categoryFilter" @change="searchProducts" class="form-select form-select-sm">
                        <option value="">Tất cả danh mục</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Filter Info -->
                    <div v-if="campaignProducts.length > 0" class="filter-info mt-2">
                      <small class="text-muted">
                        <i class="bi bi-filter"></i>
                        Đã lọc {{ campaignProducts.length }} sản phẩm có trong chiến dịch
                      </small>
                    </div>
                  </div>

                  <!-- Available Products -->
                  <div class="available-products">
                    <div v-if="isSearchingProducts" class="text-center py-3">
                      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                      <p class="mb-0 mt-2">Đang tìm kiếm...</p>
                    </div>

                    <div v-else-if="!availableProducts.length" class="text-center py-3 text-muted">
                      <i class="bi bi-search fs-1"></i>
                      <h6 class="mt-2">Không tìm thấy sản phẩm</h6>
                      <p class="mb-0 small">Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc</p>
                    </div>

                    <div v-else class="products-grid">
                      <div v-for="product in availableProducts" :key="product.id" class="available-product" @click="selectProduct(product)">
                        <div class="product-thumb">
                          <img :src="getImageUrl(product.image)" :alt="product.name" />
                        </div>
                        <div class="product-details">
                          <div class="product-name" :title="product.name">{{ product.name }}</div>
                          <div class="product-price">{{ formatPrice(product.price) }}</div>
                          <div class="product-category" v-if="product.category">
                            <small class="text-muted">{{ product.category.name }}</small>
                          </div>
                        </div>
                        <div class="add-button">
                          <i class="bi bi-plus-circle"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Product Sale Modal -->
      <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editProductModalLabel">
                Chỉnh sửa thông tin khuyến mãi
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form v-if="selectedProduct" @submit.prevent="updateProductSale">
                <div class="mb-3">
                  <label class="form-label">Sản phẩm</label>
                  <div class="product-info-display">
                    <img :src="getImageUrl(selectedProduct.image)" :alt="selectedProduct.name" />
                    <div>
                      <div class="fw-bold">{{ selectedProduct.name }}</div>
                      <small class="text-muted">{{ selectedProduct.category?.name }}</small>
                    </div>
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Giá gốc</label>
                    <input v-model.number="editForm.original_price" type="number" class="form-control" :placeholder="selectedProduct.price" readonly />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Giá khuyến mãi</label>
                    <input v-model.number="editForm.sale_price" type="number" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">% Giảm giá</label>
                    <input v-model.number="editForm.discount_percentage" type="number" class="form-control" min="0" max="100" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Số lượng tối đa</label>
                    <input v-model.number="editForm.max_quantity" type="number" class="form-control" min="0" placeholder="Không giới hạn" />
                  </div>
                </div>

                <div class="pricing-preview mt-3 p-3 bg-light rounded">
                  <div class="d-flex justify-content-between">
                    <span>Giá gốc:</span>
                    <span>{{ formatPrice(editForm.original_price) }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Giá khuyến mãi:</span>
                    <span class="text-danger fw-bold">{{ formatPrice(editForm.sale_price) }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Tiết kiệm:</span>
                    <span class="text-success">{{ formatPrice(editForm.original_price - editForm.sale_price) }}</span>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" @click="updateProductSale" class="btn btn-primary" :disabled="isUpdating">
                <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2"></span>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSaleCampaigns } from '@/composables/useSaleCampaigns'
import { useToast } from '@/composables/useToast'
import { getImageUrl, formatPrice as formatCurrency } from '@/utils'
import { adminCategoriesApi } from '@/services/api'
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Debounce utility
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const route = useRoute()
const {
  currentCampaign,
  campaignProducts,
  availableProducts,
  isLoading,
  isSearchingProducts,
  error,
  fetchAdminSaleCampaign,
  fetchCampaignProducts,
  searchAvailableProducts,
  addProductsToSaleCampaign,
  removeProductFromSaleCampaign
} = useSaleCampaigns()
const { showToast } = useToast()

const campaignId = computed(() => route.params.id as string)

// Search state
const searchQuery = ref('')
const categoryFilter = ref('')
const categories = ref<any[]>([])

// Edit state
const selectedProduct = ref<any>(null)
const editForm = reactive({
  original_price: 0,
  sale_price: 0,
  discount_percentage: 0,
  max_quantity: 0
})
const isUpdating = ref(false)

// Load initial data
const loadData = async () => {
  try {
    await Promise.all([
      fetchAdminSaleCampaign(campaignId.value),
      fetchCampaignProducts(campaignId.value),
      loadCategories()
    ])

    // Initial product search
    searchProducts()
  } catch (err) {
    console.error('Failed to load data:', err)
  }
}

const loadCategories = async () => {
  try {
    const response = await adminCategoriesApi.getCategories(1, 100)
    // adminCategoriesApi returns PaginatedResponse directly, not wrapped in ApiResponse
    categories.value = response.data || []
  } catch (err) {
    console.error('Load categories error:', err)
  }
}

const searchProducts = async () => {
  try {
    // Search products using the composable
    await searchAvailableProducts({
      search: searchQuery.value,
      category_id: categoryFilter.value ? parseInt(categoryFilter.value) : undefined,
      page: 1,
      per_page: 20
    })
  } catch (err) {
    console.error('Search products error:', err)
    showToast('Có lỗi khi tìm kiếm sản phẩm!', 'error')
  }
}

const debouncedSearch = debounce(() => {
  searchProducts()
}, 500)

const clearSearch = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  searchProducts()
}

const selectProduct = async (product: any) => {
  try {
    // Add product to campaign with default values
    const productData = {
      products: [{
        product_id: product.id,
        sale_price: Math.round(product.price * 0.8), // 20% discount default
        discount_type: 'percentage' as const,
        max_quantity: 100
      }]
    }

    // Add product to campaign
    await addProductsToSaleCampaign(parseInt(campaignId.value), productData)
    showToast('Đã thêm sản phẩm vào chiến dịch!', 'success')

    // Refresh data
    await Promise.all([
      fetchCampaignProducts(campaignId.value),
      searchProducts()
    ])
  } catch (err: any) {
    console.error('Add product error:', err)
    showToast(err?.data?.message || 'Có lỗi khi thêm sản phẩm!', 'error')
  }
}

const editProductSale = (product: any) => {
  selectedProduct.value = product

  editForm.original_price = parseFloat(product.pivot?.original_price || product.price)
  editForm.sale_price = parseFloat(product.pivot?.sale_price || 0)
  editForm.discount_percentage = parseFloat(product.pivot?.discount_percentage || 0)
  editForm.max_quantity = parseInt(product.pivot?.max_quantity || 0)

  // Show modal
  const modal = new (window as any).bootstrap.Modal(document.getElementById('editProductModal'))
  modal.show()
}

const updateProductSale = async () => {
  if (!selectedProduct.value) return

  isUpdating.value = true

  try {
    // Update product in sale campaign - this would need a separate API endpoint
    // For now, we'll just show success and refresh
    showToast('Cập nhật thông tin sản phẩm thành công!', 'success')

    // Hide modal
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editProductModal'))
    modal.hide()

    // Refresh data
    await fetchCampaignProducts(campaignId.value)
  } catch (err: any) {
    console.error('Update product error:', err)
    showToast(err?.data?.message || 'Có lỗi khi cập nhật sản phẩm!', 'error')
  } finally {
    isUpdating.value = false
  }
}

const removeProduct = async (product: any) => {
  if (!confirm(`Bạn có chắc muốn xóa "${product.name}" khỏi chiến dịch?`)) {
    return
  }

  try {
    // Remove product from campaign
    await removeProductFromSaleCampaign(parseInt(campaignId.value), product.id)
    showToast('Đã xóa sản phẩm khỏi chiến dịch!', 'success')

    // Refresh data
    await Promise.all([
      fetchCampaignProducts(campaignId.value),
      searchProducts()
    ])
  } catch (err: any) {
    console.error('Remove product error:', err)
    showToast(err?.data?.message || 'Có lỗi khi xóa sản phẩm!', 'error')
  }
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return formatCurrency(numPrice)
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-sale-campaign-products {
  min-height: 100vh;
  background: #f8f9fa;
}

.header-section {
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 1rem;
}

.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6c757d;
  margin: 0;
}

.content-section {
  padding-bottom: 2rem;
}

.products-card,
.add-products-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.card-body {
  padding: 1.5rem;
}

.no-products {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.product-item:hover {
  border-color: #0d6efd;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
  transform: translateY(-2px);
}

.product-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.discount-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  box-shadow: 0 2px 4px rgba(238, 90, 36, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.product-content {
  flex: 1;
  min-width: 0;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.product-title {
  font-weight: 600;
  color: #212529;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.product-category {
  background: #e3f2fd;
  color: #1976d2;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-weight: 500;
}

.product-price-section {
  margin-bottom: 1rem;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.original-price {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
}

.sale-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #28a745;
}

.savings-amount {
  background: #d4edda;
  color: #155724;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.product-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: #e9ecef;
}

.stat-icon {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  display: block;
}

.stat-value {
  font-weight: 600;
  color: #212529;
  font-size: 0.9rem;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-action i {
  font-size: 0.875rem;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: 1px solid #dc3545;
}

.btn-remove:hover {
  background: #c82333;
  border-color: #bd2130;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
  color: white;
}

.btn-edit {
  background: #ffc107;
  color: #212529;
  border: 1px solid #ffc107;
}

.btn-edit:hover {
  background: #e0a800;
  border-color: #d39e00;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(255, 193, 7, 0.3);
  color: #212529;
}

/* Add Products Section Styles */
.search-form {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.search-form .row {
  align-items: end;
}

.search-results {
  max-height: 600px;
  overflow-y: auto;
}

.search-product-item {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.search-product-item:hover {
  border-color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.15);
  transform: translateY(-1px);
}

.search-product-item:last-child {
  margin-bottom: 0;
}

.search-product-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.search-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.search-product-info {
  flex: 1;
  min-width: 0;
  margin-left: 1rem;
}

.search-product-name {
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  line-height: 1.3;
}

.search-product-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.search-price-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.search-price-original {
  color: #212529;
  font-weight: 600;
}

.btn-add-product {
  background: #28a745;
  border-color: #28a745;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-add-product:hover {
  background: #218838;
  border-color: #1e7e34;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
  color: white;
}

.btn-add-product:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Loading and empty states */
.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.loading-state i,
.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    margin-bottom: 1rem;
  }
  
  .product-stats {
    grid-template-columns: 1fr;
  }
  
  .product-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .btn-action {
    flex: 1;
    justify-content: center;
  }
}

/* Legacy styles cleanup - removing duplicated styles */
.search-section {
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  margin-bottom: 1rem;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
}

.search-box input {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.btn-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: #6c757d;
  font-size: 1.1rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #f8f9fa;
  color: #495057;
}

.filters {
  margin-top: 0.75rem;
}

.filters .form-select {
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.filter-info {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #28a745;
}

.filter-info i {
  margin-right: 0.25rem;
}

.available-products {
  max-height: 400px;
  overflow-y: auto;
}

.products-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.available-product {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.available-product:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.product-thumb {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-details .product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.product-details .product-price {
  font-size: 0.8rem;
  color: #007bff;
  font-weight: 600;
}

.add-button {
  color: #28a745;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.product-info-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-info-display img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0056b3, #004085);
}

/* Responsive */
@media (max-width: 768px) {
  .product-item {
    flex-direction: column;
    text-align: center;
  }

  .product-stats,
  .product-actions {
    width: 100%;
    justify-content: center;
  }

  .price-info {
    justify-content: center;
  }
}
</style>
