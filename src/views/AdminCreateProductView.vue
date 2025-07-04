<template>
  <div class="admin-create-product">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Thêm Sản Phẩm Mới</h1>
          <p class="page-subtitle">Tạo sản phẩm mới cho cửa hàng</p>
        </div>
        <div class="header-actions">
          <button 
            type="button" 
            class="btn btn-outline"
            @click="router.back()"
          >
            <i class="fas fa-arrow-left"></i>
            Quay lại
          </button>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="product-form">
        <div class="form-grid">
          <!-- Basic Information -->
          <div class="form-section">
            <h3 class="section-title">Thông Tin Cơ Bản</h3>
            
            <div class="form-group">
              <label for="name" class="form-label required">Tên sản phẩm</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                placeholder="Nhập tên sản phẩm"
                required
              />
              <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Mô tả</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-control"
                :class="{ 'is-invalid': errors.description }"
                rows="4"
                placeholder="Mô tả chi tiết về sản phẩm"
              ></textarea>
              <div v-if="errors.description" class="invalid-feedback">{{ errors.description[0] }}</div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category_id" class="form-label required">Danh mục</label>
                <select
                  id="category_id"
                  v-model="form.category_id"
                  class="form-control"
                  :class="{ 'is-invalid': errors.category_id }"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
                <div v-if="errors.category_id" class="invalid-feedback">{{ errors.category_id[0] }}</div>
              </div>

              <div class="form-group">
                <label for="brand_id" class="form-label">Thương hiệu</label>
                <select
                  id="brand_id"
                  v-model="form.brand_id"
                  class="form-control"
                  :class="{ 'is-invalid': errors.brand_id }"
                >
                  <option value="">Chọn thương hiệu</option>
                  <option
                    v-for="brand in brands"
                    :key="brand.id"
                    :value="brand.id"
                  >
                    {{ brand.name }}
                  </option>
                </select>
                <div v-if="errors.brand_id" class="invalid-feedback">{{ errors.brand_id[0] }}</div>
              </div>
            </div>
          </div>

          <!-- Pricing & Inventory -->
          <div class="form-section">
            <h3 class="section-title">Giá & Kho Hàng</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="price" class="form-label required">Giá gốc (VNĐ)</label>
                <input
                  id="price"
                  v-model.number="form.price"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.price }"
                  min="0"
                  step="1000"
                  placeholder="0"
                  required
                />
                <div v-if="errors.price" class="invalid-feedback">{{ errors.price[0] }}</div>
              </div>

              <div class="form-group">
                <label for="discount_price" class="form-label">Giá khuyến mãi (VNĐ)</label>
                <input
                  id="discount_price"
                  v-model.number="form.discount_price"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.discount_price }"
                  min="0"
                  step="1000"
                  :max="form.price || undefined"
                  placeholder="0 (tùy chọn)"
                />
                <div v-if="errors.discount_price" class="invalid-feedback">{{ errors.discount_price[0] }}</div>
                <small v-if="form.discount_price && form.price && form.discount_price >= form.price" class="text-danger">
                  Giá khuyến mãi phải nhỏ hơn giá gốc
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="stock" class="form-label required">Số lượng tồn kho</label>
                <input
                  id="stock"
                  v-model.number="form.stock"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.stock }"
                  min="0"
                  placeholder="0"
                  required
                />
                <div v-if="errors.stock" class="invalid-feedback">{{ errors.stock[0] }}</div>
              </div>

              <div class="form-group">
                <label for="color" class="form-label">Màu sắc</label>
                <input
                  id="color"
                  v-model="form.color"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.color }"
                  placeholder="Ví dụ: Đen, Xanh Navy"
                />
                <div v-if="errors.color" class="invalid-feedback">{{ errors.color[0] }}</div>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div class="form-section">
            <h3 class="section-title">Hình Ảnh</h3>
            
            <div class="form-group">
              <label for="image" class="form-label">Ảnh chính</label>
              <input
                id="image"
                v-model="form.image"
                type="url"
                class="form-control"
                :class="{ 'is-invalid': errors.image }"
                placeholder="https://example.com/image.jpg"
              />
              <div v-if="errors.image" class="invalid-feedback">{{ errors.image[0] }}</div>
              <div v-if="form.image" class="image-preview mt-2">
                <img :src="form.image" alt="Preview" class="preview-img" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Thư viện ảnh</label>
              <div class="gallery-input">
                <div
                  v-for="(url, index) in (form.gallery || [''])"
                  :key="index"
                  class="gallery-item"
                >
                  <input
                    v-model="form.gallery![index]"
                    type="url"
                    class="form-control"
                    :placeholder="`URL ảnh ${index + 1}`"
                  />
                  <button
                    type="button"
                    class="btn btn-sm btn-danger"
                    @click="removeGalleryImage(index)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <div v-if="url" class="image-preview mt-1">
                    <img :src="url" alt="Gallery preview" class="preview-img-small" />
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-outline btn-sm"
                  @click="addGalleryImage"
                >
                  <i class="fas fa-plus"></i>
                  Thêm ảnh
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="button" 
            class="btn btn-outline"
            @click="router.back()"
            :disabled="loading"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading || !isFormValid"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ loading ? 'Đang tạo...' : 'Tạo sản phẩm' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Toast notifications will be handled by ToastContainer -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminProductsApi, categoriesApi, brandsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import type { CreateProductRequest, Category, Brand } from '@/types'

const router = useRouter()
const { showSuccess, showError } = useToast()

// Form data
const form = reactive<CreateProductRequest>({
  category_id: 0,
  brand_id: undefined,
  name: '',
  description: '',
  price: 0,
  discount_price: undefined,
  stock: 0,
  image: '',
  gallery: [''],
  color: ''
})

// Form state
const loading = ref(false)
const errors = ref<Record<string, string[]>>({})

// Data
const categories = ref<Category[]>([])
const brands = ref<Brand[]>([])

// Computed
const isFormValid = computed(() => {
  return form.name.trim() !== '' && 
         form.category_id > 0 && 
         form.price > 0 && 
         form.stock >= 0 &&
         (!form.discount_price || form.discount_price < form.price)
})

// Methods
const loadCategories = async () => {
  try {
    const response = await categoriesApi.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
    showError('Lỗi', 'Không thể tải danh sách danh mục')
  }
}

const loadBrands = async () => {
  try {
    const response = await brandsApi.getBrands()
    brands.value = response.data
  } catch (error) {
    console.error('Failed to load brands:', error)
    showError('Lỗi', 'Không thể tải danh sách thương hiệu')
  }
}

const addGalleryImage = () => {
  if (form.gallery) {
    form.gallery.push('')
  }
}

const removeGalleryImage = (index: number) => {
  if (form.gallery) {
    form.gallery.splice(index, 1)
    if (form.gallery.length === 0) {
      form.gallery.push('')
    }
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    showError('Lỗi', 'Vui lòng kiểm tra lại thông tin form')
    return
  }

  loading.value = true
  errors.value = {}

  try {
    // Filter out empty gallery URLs
    const productData = {
      ...form,
      gallery: form.gallery ? form.gallery.filter(url => url.trim() !== '') : [],
      brand_id: form.brand_id || undefined,
      discount_price: form.discount_price || undefined
    }

    const response = await adminProductsApi.createProduct(productData)
    
    if (response.success) {
      showSuccess('Thành công', 'Tạo sản phẩm thành công!')
      router.push('/admin/products') // Will create this route
    } else {
      showError('Lỗi', 'Có lỗi xảy ra khi tạo sản phẩm')
    }
  } catch (error: any) {
    console.error('Failed to create product:', error)
    
    // Handle validation errors
    if (error.message.includes('422')) {
      try {
        const errorData = JSON.parse(error.message.split(': ')[1])
        if (errorData.errors) {
          errors.value = errorData.errors
        }
      } catch (parseError) {
        showError('Lỗi', 'Có lỗi xảy ra khi tạo sản phẩm')
      }
    } else {
      showError('Lỗi', 'Có lỗi xảy ra khi tạo sản phẩm')
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadCategories()
  loadBrands()
})
</script>

<style scoped>
.admin-create-product {
  padding: 20px;
  max-width: 1200px;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-form {
  max-width: 100%;
}

.form-grid {
  display: grid;
  gap: 30px;
}

.form-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.form-label.required::after {
  content: ' *';
  color: #dc3545;
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

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.text-danger {
  color: #dc3545;
}

.gallery-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gallery-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.gallery-item .form-control {
  flex: 1;
}

.image-preview {
  display: flex;
  justify-content: center;
}

.preview-img {
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.preview-img-small {
  max-width: 80px;
  max-height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

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

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .admin-create-product {
    padding: 15px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .gallery-item {
    flex-direction: column;
  }
}
</style>
