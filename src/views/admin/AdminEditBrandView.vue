<template>
  <AdminLayout>
    <div class="admin-edit-brand">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <nav class="breadcrumb">
              <router-link to="/admin" class="breadcrumb-item">Dashboard</router-link>
              <router-link to="/admin/brands" class="breadcrumb-item">Thương hiệu</router-link>
              <span class="breadcrumb-item active">Chỉnh sửa thương hiệu</span>
            </nav>
            <h1 class="page-title">Chỉnh Sửa Thương Hiệu</h1>
            <p class="page-subtitle">Cập nhật thông tin thương hiệu</p>
          </div>
          <div class="header-actions">
            <button type="button" class="btn btn-outline" @click="router.push('/admin/brands')">
              <i class="bi bi-arrow-left"></i>
              Quay lại
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pageLoading" class="loading-section">
        <LoadingSpinner />
      </div>

      <!-- Form -->
      <div v-else class="form-section">
        <div class="form-container">
          <!-- Brand Stats -->
          <div v-if="brandStats" class="stats-section">
            <h3 class="section-title">
              <i class="bi bi-graph-up"></i>
              Thống kê thương hiệu
            </h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon products">
                  <i class="bi bi-box-seam"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ brandStats.products_count || 0 }}</div>
                  <div class="stat-label">Sản phẩm</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon revenue">
                  <i class="bi bi-currency-dollar"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ formatPrice(brandStats.total_revenue || 0) }}</div>
                  <div class="stat-label">Doanh thu</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon active">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ brandStats.active_products_count || 0 }}</div>
                  <div class="stat-label">SP hoạt động</div>
                </div>
              </div>
            </div>
          </div>

          <form @submit.prevent="submitForm" class="brand-form">
            <!-- Basic Information -->
            <div class="form-group">
              <h3 class="section-title">
                <i class="bi bi-info-circle"></i>
                Thông tin cơ bản
              </h3>

              <div class="row">
                <div class="col-md-8">
                  <div class="form-field">
                    <label for="name" class="form-label required">Tên thương hiệu</label>
                    <input id="name" v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" placeholder="Nhập tên thương hiệu..." @input="generateSlug">
                    <div v-if="errors.name" class="invalid-feedback">
                      {{ errors.name[0] }}
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="slug" class="form-label required">Slug URL</label>
                    <div class="slug-group">
                      <input id="slug" v-model="form.slug" type="text" class="form-control" :class="{ 'is-invalid': errors.slug }" placeholder="slug-url-thuan-hieu">
                      <button type="button" class="btn btn-outline-secondary" @click="generateSlug" title="Tạo lại slug">
                        <i class="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>
                    <div v-if="errors.slug" class="invalid-feedback">
                      {{ errors.slug[0] }}
                    </div>
                    <small class="form-text">URL thân thiện cho thương hiệu</small>
                  </div>

                  <div class="form-field">
                    <label for="description" class="form-label">Mô tả</label>
                    <textarea id="description" v-model="form.description" class="form-control" :class="{ 'is-invalid': errors.description }" rows="4" placeholder="Mô tả về thương hiệu..."></textarea>
                    <div v-if="errors.description" class="invalid-feedback">
                      {{ errors.description[0] }}
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="status" class="form-label required">Trạng thái</label>
                    <select id="status" v-model="form.status" class="form-control" :class="{ 'is-invalid': errors.status }">
                      <option value="">Chọn trạng thái</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                    <div v-if="errors.status" class="invalid-feedback">
                      {{ errors.status[0] }}
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <!-- Logo Upload -->
                  <div class="form-field">
                    <label class="form-label">Logo thương hiệu</label>
                    <div class="logo-upload">
                      <div class="upload-area" :class="{ 'has-image': imagePreview || currentImage }" @click="logoInput?.click()" @dragover.prevent @drop="handleDrop">
                        <div v-if="!imagePreview && !currentImage" class="upload-placeholder">
                          <i class="bi bi-cloud-upload upload-icon"></i>
                          <p class="upload-text">Nhấn để chọn hoặc kéo thả logo</p>
                          <small class="upload-hint">PNG, JPG, GIF, SVG (tối đa 2MB)</small>
                        </div>
                        <div v-else class="image-preview">
                          <img :src="imagePreview || currentImage" alt="Preview" class="preview-image">
                          <div class="image-overlay">
                            <button type="button" class="btn btn-danger btn-sm" @click.stop="removeImage" title="Xóa ảnh">
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <input ref="logoInput" type="file" accept="image/*" style="display: none" @change="handleFileChange">
                      <div v-if="errors.logo" class="invalid-feedback d-block">
                        {{ errors.logo[0] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="router.push('/admin/brands')" :disabled="loading">
                Hủy
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <i v-if="loading" class="bi bi-arrow-repeat spin-animation"></i>
                <i v-else class="bi bi-check"></i>
                {{ loading ? 'Đang cập nhật...' : 'Cập nhật thương hiệu' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminBrandsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { parseApiError } from '@/utils/errorHandler'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Brand } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const router = useRouter()
const route = useRoute()
const { showSuccess, showError } = useToast()

// Get brand ID from route
const brandId = parseInt(route.params.id as string)

// Form state
const form = reactive({
  name: '',
  slug: '',
  description: '',
  status: 'active',
  logo: null as File | null
})

const errors = ref<Record<string, string[]>>({})
const loading = ref(false)
const pageLoading = ref(true)
const imagePreview = ref('')
const currentImage = ref('')
const originalBrand = ref<Brand | null>(null)
const brandStats = ref<any>(null)

// File upload
const logoInput = ref<HTMLInputElement>()

// Methods
const loadBrand = async () => {
  try {
    pageLoading.value = true
    const response = await adminBrandsApi.getBrand(brandId)

    if (response.success && response.data) {
      const brand = response.data
      originalBrand.value = brand

      // Populate form
      form.name = brand.name
      form.slug = brand.slug
      form.description = brand.description || ''
      form.status = brand.status

      // Set current image
      if (brand.logo) {
        currentImage.value = brand.logo
      }

      // Set brand stats
      brandStats.value = {
        products_count: brand.products_count || 0,
        active_products_count: brand.active_products_count || 0,
        total_revenue: brand.total_revenue || 0
      }
    } else {
      throw new Error('Không tìm thấy thương hiệu')
    }
  } catch (error: any) {
    console.error('Failed to load brand:', error)
    const friendlyMessage = parseApiError(error)
    showError('Lỗi', friendlyMessage)
    router.push('/admin/brands')
  } finally {
    pageLoading.value = false
  }
}

const generateSlug = () => {
  if (form.name) {
    form.slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .trim()
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('Lỗi', 'Kích thước file không được vượt quá 2MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Lỗi', 'Chỉ chấp nhận file ảnh')
      return
    }

    form.logo = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
      currentImage.value = '' // Hide current image when new image is selected
    }
    reader.readAsDataURL(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      form.logo = file

      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string
        currentImage.value = ''
      }
      reader.readAsDataURL(file)
    }
  }
}

const removeImage = () => {
  form.logo = null
  imagePreview.value = ''
  currentImage.value = ''
  if (logoInput.value) {
    logoInput.value.value = ''
  }
}

const validateForm = () => {
  const newErrors: Record<string, string[]> = {}

  if (!form.name.trim()) {
    newErrors.name = ['Tên thương hiệu là bắt buộc']
  }

  if (!form.slug.trim()) {
    newErrors.slug = ['Slug là bắt buộc']
  }

  if (!form.status) {
    newErrors.status = ['Trạng thái là bắt buộc']
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true
  errors.value = {}

  try {
    let response

    if (form.logo) {
      // If there's a new file, use FormData
      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('slug', form.slug.trim())
      formData.append('status', form.status)
      formData.append('_method', 'PUT') // For Laravel to handle PUT with file

      if (form.description?.trim()) {
        formData.append('description', form.description.trim())
      }

      formData.append('logo', form.logo)

      response = await adminBrandsApi.updateBrandWithFile(brandId, formData)
    } else {
      // If no new file, use regular JSON update
      const updateData = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        status: form.status,
        description: form.description?.trim() || ''
      }

      response = await adminBrandsApi.updateBrand(brandId, updateData)
    }

    if (response.success) {
      showSuccess('Thành công', 'Cập nhật thương hiệu thành công')
      router.push('/admin/brands')
    } else {
      throw new Error(response.message || 'Có lỗi xảy ra')
    }
  } catch (error: any) {
    console.error('Failed to update brand:', error)

    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      const friendlyMessage = parseApiError(error)
      showError('Lỗi', friendlyMessage)
    }
  } finally {
    loading.value = false
  }
}

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

// Lifecycle
onMounted(() => {
  if (brandId) {
    loadBrand()
  } else {
    router.push('/admin/brands')
  }
})
</script>

<style scoped>
.admin-edit-brand {
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
  align-items: flex-start;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
}

.breadcrumb-item:hover {
  color: #007bff;
}

.breadcrumb-item.active {
  color: #333;
  font-weight: 500;
}

.breadcrumb-item+.breadcrumb-item::before {
  content: "/";
  margin: 0 8px;
  color: #ccc;
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
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Stats Section */
.stats-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #e9ecef;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-icon.products {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-icon.active {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-field {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-label.required::after {
  content: " *";
  color: #dc3545;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
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
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 12px;
  color: #dc3545;
}

.form-text {
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
}

.slug-group {
  display: flex;
  gap: 8px;
}

.slug-group .form-control {
  flex: 1;
}

.slug-group .btn {
  padding: 12px;
  border: 1px solid #ddd;
}

/* Logo Upload */
.logo-upload {
  margin-top: 8px;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #007bff;
  background: #f0f8ff;
}

.upload-area.has-image {
  padding: 0;
  border: 1px solid #ddd;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 10px;
}

.upload-text {
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.upload-hint {
  color: #666;
  font-size: 12px;
}

.image-preview {
  position: relative;
  display: inline-block;
  width: 100%;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
}

.image-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
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

.btn-outline-secondary {
  background: transparent;
  color: #6c757d;
  border: 1px solid #6c757d;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.spin-animation {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.row {
  display: flex;
  gap: 20px;
}

.col-md-8 {
  flex: 0 0 66.666667%;
}

.col-md-4 {
  flex: 0 0 33.333333%;
}

@media (max-width: 768px) {
  .admin-edit-brand {
    padding: 15px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .form-section {
    padding: 20px;
  }

  .row {
    flex-direction: column;
    gap: 20px;
  }

  .col-md-8,
  .col-md-4 {
    flex: 1 1 100%;
  }

  .form-actions {
    flex-direction: column;
  }

  .slug-group {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
