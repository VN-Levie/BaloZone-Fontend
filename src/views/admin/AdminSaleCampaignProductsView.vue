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
                      <div class="product-image">
                        <img :src="getImageUrl(product.image)" :alt="product.name" />
                      </div>

                      <div class="product-info">
                        <h6 class="product-name">{{ product.name }}</h6>
                        <div class="product-category" v-if="product.category">
                          {{ product.category.name }}
                        </div>

                        <div class="price-info">
                          <div class="original-price">
                            Giá gốc: {{ formatPrice(product.pivot?.original_price || product.price) }}
                          </div>
                          <div class="sale-price">
                            Giá KM: {{ formatPrice(product.pivot?.sale_price) }}
                          </div>
                          <div class="discount">
                            Giảm: {{ product.pivot?.discount_percentage }}%
                          </div>
                        </div>
                      </div>

                      <div class="product-stats">
                        <div class="stat">
                          <span class="stat-label">Tối đa:</span>
                          <span class="stat-value">{{ product.pivot?.max_quantity || 'Không giới hạn' }}</span>
                        </div>
                        <div class="stat">
                          <span class="stat-label">Đã bán:</span>
                          <span class="stat-value">{{ product.pivot?.sold_quantity || 0 }}</span>
                        </div>
                      </div>

                      <div class="product-actions">
                        <button @click="editProductSale(product)" class="btn btn-sm btn-outline-primary" title="Chỉnh sửa">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button @click="removeProduct(product)" class="btn btn-sm btn-outline-danger" title="Xóa khỏi chiến dịch">
                          <i class="bi bi-trash"></i>
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
                      <input v-model="searchQuery" @input="debouncedSearch" type="text" class="form-control" placeholder="Tìm kiếm sản phẩm..." />
                    </div>

                    <div class="filters">
                      <select v-model="categoryFilter" @change="searchProducts" class="form-select form-select-sm">
                        <option value="">Tất cả danh mục</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Available Products -->
                  <div class="available-products">
                    <div v-if="isSearching" class="text-center py-3">
                      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </div>

                    <div v-else-if="!availableProducts.length" class="text-center py-3 text-muted">
                      <i class="bi bi-search"></i>
                      <p class="mb-0 mt-2">Không tìm thấy sản phẩm</p>
                    </div>

                    <div v-else class="products-grid">
                      <div v-for="product in availableProducts" :key="product.id" class="available-product" @click="selectProduct(product)">
                        <div class="product-thumb">
                          <img :src="getImageUrl(product.image)" :alt="product.name" />
                        </div>
                        <div class="product-details">
                          <div class="product-name">{{ product.name }}</div>
                          <div class="product-price">{{ formatPrice(product.price) }}</div>
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
import { getImageUrl } from '@/utils'
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
  isLoading,
  error,
  fetchAdminSaleCampaign,
  fetchCampaignProducts
} = useSaleCampaigns()
const { showToast } = useToast()

const campaignId = computed(() => route.params.id as string)

// Search state
const searchQuery = ref('')
const categoryFilter = ref('')
const availableProducts = ref<any[]>([])
const categories = ref<any[]>([])
const isSearching = ref(false)

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
  // This would be from a categories API
  // For now, mock data
  categories.value = [
    { id: 1, name: 'Balo Học Sinh' },
    { id: 2, name: 'Balo Du Lịch' },
    { id: 3, name: 'Balo Laptop' }
  ]
}

const searchProducts = async () => {
  isSearching.value = true

  try {
    // Mock API call - replace with actual products API
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

    // Mock products - replace with actual API call
    const allProducts = [
      {
        id: 1,
        name: 'Balo Nike Heritage 2.0',
        price: 1200000,
        image: 'https://placehold.co/600x400?text=balo-nike-heritage',
        category: { id: 1, name: 'Balo Học Sinh' }
      },
      {
        id: 2,
        name: 'Balo Adidas Classic',
        price: 800000,
        image: 'https://placehold.co/600x400?text=balo-adidas-classic',
        category: { id: 1, name: 'Balo Học Sinh' }
      }
    ]

    // Filter products
    let filtered = allProducts

    if (searchQuery.value) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }

    if (categoryFilter.value) {
      filtered = filtered.filter(product =>
        product.category.id === parseInt(categoryFilter.value)
      )
    }

    // Exclude products already in campaign
    const campaignProductIds = campaignProducts.value.map(p => p.id)
    filtered = filtered.filter(product =>
      !campaignProductIds.includes(product.id)
    )

    availableProducts.value = filtered
  } catch (err) {
    console.error('Search products error:', err)
    showToast('Có lỗi khi tìm kiếm sản phẩm!', 'error')
  } finally {
    isSearching.value = false
  }
}

const debouncedSearch = debounce(() => {
  searchProducts()
}, 500)

const selectProduct = async (product: any) => {
  try {
    // Add product to campaign with default values
    const productData = {
      original_price: product.price,
      sale_price: product.price * 0.8, // 20% discount default
      discount_percentage: 20,
      max_quantity: 100
    }

    // Mock API call to add product to campaign
    showToast('Đã thêm sản phẩm vào chiến dịch!', 'success')

    // Refresh data
    await Promise.all([
      fetchCampaignProducts(campaignId.value),
      searchProducts()
    ])
  } catch (err) {
    console.error('Add product error:', err)
    showToast('Có lỗi khi thêm sản phẩm!', 'error')
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
    // Mock API call to update product sale info
    showToast('Cập nhật thông tin sản phẩm thành công!', 'success')

    // Hide modal
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editProductModal'))
    modal.hide()

    // Refresh data
    await fetchCampaignProducts(campaignId.value)
  } catch (err) {
    console.error('Update product error:', err)
    showToast('Có lỗi khi cập nhật sản phẩm!', 'error')
  } finally {
    isUpdating.value = false
  }
}

const removeProduct = async (product: any) => {
  if (!confirm(`Bạn có chắc muốn xóa "${product.name}" khỏi chiến dịch?`)) {
    return
  }

  try {
    // Mock API call to remove product from campaign
    showToast('Đã xóa sản phẩm khỏi chiến dịch!', 'success')

    // Refresh data
    await Promise.all([
      fetchCampaignProducts(campaignId.value),
      searchProducts()
    ])
  } catch (err) {
    console.error('Remove product error:', err)
    showToast('Có lỗi khi xóa sản phẩm!', 'error')
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
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
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.product-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.product-category {
  color: #6c757d;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.price-info {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.original-price {
  color: #6c757d;
}

.sale-price {
  color: #dc3545;
  font-weight: 600;
}

.discount {
  color: #28a745;
  font-weight: 600;
}

.product-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: right;
  font-size: 0.875rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.stat-label {
  color: #6c757d;
}

.stat-value {
  font-weight: 600;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

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
