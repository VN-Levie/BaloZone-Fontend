<template>
  <div class="admin-edit-category">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Chỉnh Sửa Danh Mục</h1>
          <p class="page-subtitle">Cập nhật thông tin danh mục</p>
        </div>
        <div class="header-actions">
          <button 
            type="button" 
            class="btn btn-outline"
            @click="router.back()"
          >
            <i class="bi bi-arrow-left"></i>
            Quay lại
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingCategory" class="loading-section">
      <LoadingSpinner />
      <p>Đang tải thông tin danh mục...</p>
    </div>

    <!-- Form Content -->
    <div v-else-if="category" class="form-container">
      <form @submit.prevent="handleSubmit" class="category-form">
        <!-- Error Alert -->
        <div v-if="Object.keys(errors).length > 0" class="alert alert-danger">
          <div class="alert-content">
            <i class="bi bi-exclamation-triangle"></i>
            <div>
              <h4>Có lỗi xảy ra:</h4>
              <ul>
                <li v-for="(errorList, field) in errors" :key="field">
                  {{ errorList[0] }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="form-grid">
          <!-- Basic Information -->
          <div class="form-section">
            <h3 class="section-title">Thông Tin Cơ Bản</h3>
            
            <div class="form-group">
              <label for="name" class="form-label required">Tên danh mục</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                placeholder="Nhập tên danh mục"
                required
                @input="generateSlug"
              />
              <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
            </div>

            <div class="form-group">
              <label for="slug" class="form-label required">Slug URL</label>
              <input
                id="slug"
                v-model="form.slug"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.slug }"
                placeholder="slug-url-friendly"
                required
              />
              <div class="form-help">URL thân thiện, chỉ chứa chữ cái thường, số và dấu gạch ngang</div>
              <div v-if="errors.slug" class="invalid-feedback">{{ errors.slug[0] }}</div>
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Mô tả</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-control"
                :class="{ 'is-invalid': errors.description }"
                placeholder="Nhập mô tả danh mục"
                rows="4"
              ></textarea>
              <div v-if="errors.description" class="invalid-feedback">{{ errors.description[0] }}</div>
            </div>

            <!-- Category Stats -->
            <div class="category-stats">
              <div class="stat-item">
                <span class="stat-label">Số sản phẩm:</span>
                <span class="stat-value">{{ category.products_count || 0 }}</span>
              </div>
              <div v-if="category.active_products_count !== undefined" class="stat-item">
                <span class="stat-label">Sản phẩm hoạt động:</span>
                <span class="stat-value active">{{ category.active_products_count }}</span>
              </div>
              <div v-if="category.total_revenue" class="stat-item">
                <span class="stat-label">Tổng doanh thu:</span>
                <span class="stat-value revenue">{{ formatRevenue(category.total_revenue) }}</span>
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="form-section">
            <h3 class="section-title">Hình Ảnh Danh Mục</h3>
            
            <!-- Current Image -->
            <div v-if="currentImage && !imagePreview" class="current-image">
              <label class="form-label">Hình ảnh hiện tại</label>
              <div class="image-container">
                <img :src="currentImage" alt="Current category image" class="current-img" />
                <button 
                  type="button" 
                  class="remove-current-btn"
                  @click="removeCurrentImage"
                  title="Xóa ảnh hiện tại"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">{{ currentImage && !imagePreview ? 'Thay đổi hình ảnh' : 'Hình ảnh đại diện' }}</label>
              <div class="image-upload-area">
                <input
                  type="file"
                  class="file-input"
                  accept="image/*"
                  @change="handleImageChange"
                />
                <div class="upload-placeholder">
                  <i class="bi bi-upload"></i>
                  <span>Kéo thả file hoặc click để chọn</span>
                  <small>JPEG, PNG, JPG, GIF, SVG (tối đa 2MB)</small>
                </div>
              </div>
              <div v-if="errors.image" class="invalid-feedback">{{ errors.image[0] }}</div>
            </div>

            <!-- Image Preview -->
            <div v-if="imagePreview" class="image-preview">
              <label class="form-label">Ảnh mới</label>
              <div class="preview-container">
                <img :src="imagePreview" alt="Preview" class="preview-img" />
                <button 
                  type="button" 
                  class="remove-image-btn"
                  @click="removeNewImage"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-outline" @click="router.back()">
            Hủy
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading || !isFormValid"
          >
            <i v-if="loading" class="bi bi-arrow-repeat spin-animation"></i>
            <i v-else class="bi bi-floppy"></i>
            {{ loading ? 'Đang cập nhật...' : 'Cập nhật danh mục' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <i class="bi bi-exclamation-triangle error-icon"></i>
      <h3>Không tìm thấy danh mục</h3>
      <p>Danh mục bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
      <button type="button" class="btn btn-primary" @click="router.push('/admin/categories')">
        <i class="bi bi-arrow-left"></i>
        Quay về danh sách
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminCategoriesApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { parseApiError } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Category } from '@/types'

const router = useRouter()
const route = useRoute()
const { showSuccess, showError } = useToast()

const categoryId = parseInt(route.params.id as string)

// Form data
const form = reactive({
  name: '',
  slug: '',
  description: '',
})

// State
const category = ref<Category | null>(null)
const loading = ref(false)
const loadingCategory = ref(false)
const errors = ref<Record<string, string[]>>({})
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const currentImage = ref<string | null>(null)
const removeCurrentImageFlag = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.name.trim() !== '' && 
         form.slug.trim() !== ''
})

// Methods
const loadCategory = async () => {
  loadingCategory.value = true
  try {
    const response = await adminCategoriesApi.getCategory(categoryId)
    
    if (response && response.data) {
      category.value = response.data
      console.log('Category data from backend:', response.data)
      
      // Populate form with category data
      form.name = response.data.name
      form.slug = response.data.slug
      form.description = response.data.description || ''
      
      // Set current image
      if (response.data.image) {
        currentImage.value = response.data.image
      }
      
      console.log('Form after population:', {
        name: form.name,
        slug: form.slug,
        description: form.description
      })
    }
  } catch (error) {
    console.error('Failed to load category:', error)
    const friendlyMessage = parseApiError(error)
    showError('Lỗi', friendlyMessage)
  } finally {
    loadingCategory.value = false
  }
}

const generateSlug = () => {
  if (form.name) {
    form.slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('Lỗi', 'Kích thước file không được vượt quá 2MB')
      return
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      showError('Lỗi', 'Chỉ hỗ trợ file ảnh: JPEG, PNG, JPG, GIF, SVG')
      return
    }
    
    imageFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeNewImage = () => {
  imageFile.value = null
  imagePreview.value = null
  
  // Reset file input
  const fileInput = document.querySelector('.file-input') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const removeCurrentImage = () => {
  removeCurrentImageFlag.value = true
  currentImage.value = null
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  errors.value = {}

  try {
    // If we have a new image file, use FormData for file upload
    if (imageFile.value) {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('slug', form.slug)
      if (form.description) {
        formData.append('description', form.description)
      }
      formData.append('image', imageFile.value)
      formData.append('_method', 'PUT') // Laravel method spoofing for file upload

      await adminCategoriesApi.updateCategoryWithFile(categoryId, formData)
    } else {
      // Regular JSON update
      const updateData = {
        name: form.name,
        slug: form.slug,
        description: form.description || '',
      }

      // If user removed current image, send empty image field
      if (removeCurrentImageFlag.value) {
        Object.assign(updateData, { image: '' })
      }

      await adminCategoriesApi.updateCategory(categoryId, updateData)
    }

    showSuccess('Thành công', 'Cập nhật danh mục thành công')
    router.push('/admin/categories')
  } catch (error: any) {
    console.error('Failed to update category:', error)
    
    // Handle validation errors
    if (error.errors && Object.keys(error.errors).length > 0) {
      errors.value = error.errors
    } else {
      const friendlyMessage = parseApiError(error)
      showError('Lỗi', friendlyMessage)
    }
  } finally {
    loading.value = false
  }
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

// Lifecycle
onMounted(() => {
  loadCategory()
})
</script>

<style scoped>
.admin-edit-category {
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

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-section p {
  margin-top: 16px;
  color: #666;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-form {
  max-width: 800px;
}

.alert {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.alert h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.alert ul {
  margin: 0;
  padding-left: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #1a1a1a;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
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

.form-help {
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* Category Stats */
.category-stats {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-weight: 500;
  color: #495057;
}

.stat-value {
  font-weight: 600;
  color: #6c757d;
}

.stat-value.active {
  color: #28a745;
}

.stat-value.revenue {
  color: #007bff;
}

/* Image Styles */
.current-image {
  margin-bottom: 20px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.current-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.remove-current-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.remove-current-btn:hover {
  background: #c82333;
}

.image-upload-area {
  position: relative;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.image-upload-area:hover {
  border-color: #007bff;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #666;
}

.upload-placeholder i {
  font-size: 32px;
  color: #007bff;
}

.upload-placeholder span {
  font-weight: 500;
}

.upload-placeholder small {
  color: #999;
}

.image-preview {
  margin-top: 16px;
}

.preview-container {
  position: relative;
  display: inline-block;
}

.preview-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.remove-image-btn:hover {
  background: #c82333;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.error-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 64px;
  color: #dc3545;
  margin-bottom: 20px;
}

.error-state h3 {
  margin: 0 0 10px 0;
  color: #dc3545;
}

.error-state p {
  color: #666;
  margin-bottom: 20px;
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

.spin-animation {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .admin-edit-category {
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
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
