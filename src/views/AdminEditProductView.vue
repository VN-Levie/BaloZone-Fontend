<template>
  <div class="admin-edit-product">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Chỉnh Sửa Sản Phẩm</h1>
          <p class="page-subtitle">Cập nhật thông tin sản phẩm</p>
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

    <!-- Loading State -->
    <div v-if="loadingProduct" class="loading-section">
      <LoadingSpinner />
      <p>Đang tải thông tin sản phẩm...</p>
    </div>

    <!-- Form Content -->
    <div v-else-if="product" class="form-container">
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
                @input="generateSlug"
              />
              <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
            </div>

            <div class="form-group">
              <label for="slug" class="form-label required">Slug (URL)</label>
              <input
                id="slug"
                v-model="form.slug"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.slug }"
                placeholder="ten-san-pham-url"
                required
                @blur="validateSlug"
              />
              <div v-if="errors.slug" class="invalid-feedback">{{ errors.slug[0] }}</div>
              <div v-else-if="!form.slug.trim() && form.name.trim()" class="form-text text-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Slug không được để trống. Nhấn vào đây để tự động tạo.
                <button type="button" class="btn-link ml-2" @click="generateSlug">Tạo slug</button>
              </div>
              <small class="form-text text-muted">
                Slug sẽ được tự động tạo từ tên sản phẩm. Bạn có thể chỉnh sửa nếu cần.
              </small>
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
              <div class="file-upload-container">
                <input
                  id="image"
                  type="file"
                  class="file-input"
                  accept="image/*"
                  @change="handleImageChange"
                />
                <label for="image" class="file-upload-btn">
                  <i class="fas fa-upload"></i>
                  {{ imagePreview ? 'Thay đổi ảnh chính' : 'Chọn ảnh chính' }}
                </label>
                <div v-if="errors.image" class="invalid-feedback">{{ errors.image[0] }}</div>
              </div>
              <div v-if="imagePreview" class="image-preview mt-2">
                <img :src="imagePreview" alt="Preview" class="preview-img" />
                <button 
                  type="button" 
                  class="remove-image-btn"
                  @click="removeMainImage"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Thư viện ảnh</label>
              <div class="gallery-upload">
                <div class="gallery-grid">
                  <div
                    v-for="(preview, index) in galleryPreviews"
                    :key="index"
                    class="gallery-item"
                  >
                    <div class="gallery-image-container">
                      <img :src="preview" alt="Gallery preview" class="gallery-preview-img" />
                      <button
                        type="button"
                        class="remove-gallery-btn"
                        @click="removeGalleryImage(index)"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div class="add-gallery-item">
                    <input
                      type="file"
                      class="file-input"
                      accept="image/*"
                      multiple
                      @change="handleGalleryChange"
                      :id="`gallery-${galleryPreviews.length}`"
                    />
                    <label :for="`gallery-${galleryPreviews.length}`" class="add-gallery-btn">
                      <i class="fas fa-plus"></i>
                      <span>Thêm ảnh</span>
                    </label>
                  </div>
                </div>
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
            {{ loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <i class="fas fa-exclamation-triangle error-icon"></i>
      <h3>Không tìm thấy sản phẩm</h3>
      <p>Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
      <button type="button" class="btn btn-primary" @click="router.push('/admin/products')">
        <i class="fas fa-arrow-left"></i>
        Quay về danh sách
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminProductsApi, categoriesApi, brandsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { UpdateProductRequest, AdminProduct, Category, Brand } from '@/types'

const router = useRouter()
const route = useRoute()
const { showSuccess, showError } = useToast()

// Get product ID from route
const productId = parseInt(route.params.id as string)

// Form data
const form = reactive<UpdateProductRequest>({
  id: productId,
  category_id: 0,
  brand_id: undefined,
  name: '',
  slug: '',
  description: '',
  price: 0,
  discount_price: undefined,
  stock: 0,
  color: ''
})

// File handling
const mainImageFile = ref<File | null>(null)
const galleryFiles = ref<File[]>([])
const imagePreview = ref<string>('')
const galleryPreviews = ref<string[]>([])

// State
const product = ref<AdminProduct | null>(null)
const loading = ref(false)
const loadingProduct = ref(false)
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
const loadProduct = async () => {
  loadingProduct.value = true
  try {
    const response = await adminProductsApi.getProduct(productId)
    
    if (response.success) {
      product.value = response.data
      
      // Populate form with product data
      form.id = response.data.id
      form.category_id = response.data.category_id
      form.brand_id = response.data.brand_id || undefined
      form.name = response.data.name
      form.slug = response.data.slug || '' // Make sure slug is populated
      form.description = response.data.description || ''
      form.price = response.data.price
      form.discount_price = response.data.discount_price || undefined
      form.stock = response.data.stock
      form.color = response.data.color || ''
      
      // Load existing image preview
      if (response.data.image) {
        imagePreview.value = response.data.image
      }
      
      // Load existing gallery previews
      if (response.data.gallery && response.data.gallery.length > 0) {
        galleryPreviews.value = [...response.data.gallery]
      }
    }
  } catch (error) {
    console.error('Failed to load product:', error)
    showError('Lỗi', 'Không thể tải thông tin sản phẩm')
  } finally {
    loadingProduct.value = false
  }
}

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
  // This method is no longer needed as we use file input
}

const removeGalleryImage = (index: number) => {
  // Check if it's an existing image (URL) or new file
  if (index < (product.value?.gallery.length || 0)) {
    // Remove from existing gallery previews
    galleryPreviews.value.splice(index, 1)
  } else {
    // Remove from new files
    const fileIndex = index - (product.value?.gallery.length || 0)
    galleryFiles.value.splice(fileIndex, 1)
    galleryPreviews.value.splice(index, 1)
  }
}

const generateSlug = () => {
  if (form.name) {
    // Convert Vietnamese characters to ASCII
    let slug = form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    
    form.slug = slug
    console.log('Generated slug:', slug) // Debug log
  }
}

const validateSlug = () => {
  if (!form.slug.trim() && form.name.trim()) {
    generateSlug()
  }
}

// File handling methods
const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    mainImageFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeMainImage = () => {
  mainImageFile.value = null
  // Reset to original image or empty
  imagePreview.value = product.value?.image || ''
  // Clear the file input
  const fileInput = document.getElementById('image') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const handleGalleryChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  files.forEach(file => {
    galleryFiles.value.push(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      galleryPreviews.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
  
  // Clear the input for next selection
  target.value = ''
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    showError('Lỗi', 'Vui lòng kiểm tra lại thông tin form')
    return
  }

  // Ensure slug is generated if empty
  if (!form.slug.trim()) {
    generateSlug()
  }

  loading.value = true
  errors.value = {}

  try {
    // Prepare product data
    const productData = {
      ...form,
      brand_id: form.brand_id || undefined,
      discount_price: form.discount_price || undefined,
      slug: form.slug.trim() // Ensure slug is trimmed
    }

    // Debug: Log the product data to check what's being sent
    console.log('Updating product data:', productData)

    // Prepare files
    const files: { image?: File, gallery?: File[] } = {}
    if (mainImageFile.value) {
      files.image = mainImageFile.value
    }
    if (galleryFiles.value.length > 0) {
      files.gallery = galleryFiles.value
    }

    const response = await adminProductsApi.updateProduct(productId, productData, files)
    
    if (response.success) {
      showSuccess('Thành công', 'Cập nhật sản phẩm thành công!')
      router.push('/admin/products')
    } else {
      showError('Lỗi', 'Có lỗi xảy ra khi cập nhật sản phẩm')
    }
  } catch (error: any) {
    console.error('Failed to update product:', error)
    
    // Handle validation errors
    if (error.message.includes('422')) {
      try {
        const errorData = JSON.parse(error.message.split(': ')[1])
        console.log('Validation errors received:', errorData)
        if (errorData.errors) {
          errors.value = errorData.errors
          
          // Show specific error message for slug if present
          if (errorData.errors.slug) {
            showError('Lỗi Slug', errorData.errors.slug[0])
          } else {
            showError('Lỗi Validation', 'Có lỗi validation trong form. Vui lòng kiểm tra lại.')
          }
        }
      } catch (parseError) {
        showError('Lỗi', 'Có lỗi xảy ra khi cập nhật sản phẩm')
      }
    } else {
      showError('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm')
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProduct()
  loadCategories()
  loadBrands()
})
</script>

<style scoped>
.admin-edit-product {
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

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.loading-section p {
  margin-top: 20px;
  color: #666;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.error-icon {
  font-size: 64px;
  color: #dc3545;
  margin-bottom: 20px;
}

.error-state h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.error-state p {
  color: #999;
  margin-bottom: 20px;
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

.text-warning {
  color: #856404;
  background: #fff3cd;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ffeaa7;
}

.btn-link {
  background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
}

.btn-link:hover {
  color: #0056b3;
}

.ml-2 {
  margin-left: 8px;
}

.file-upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-input {
  display: none;
}

.file-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 500;
}

.file-upload-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  color: #495057;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s ease;
}

.remove-image-btn:hover {
  background: #dc3545;
}

.gallery-upload {
  width: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.gallery-item {
  position: relative;
}

.gallery-image-container {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
}

.gallery-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-gallery-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  transition: background 0.3s ease;
}

.remove-gallery-btn:hover {
  background: #dc3545;
}

.add-gallery-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}

.add-gallery-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
}

.add-gallery-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  color: #495057;
}

.add-gallery-btn i {
  font-size: 20px;
}

.image-preview {
  position: relative;
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
  .admin-edit-product {
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
