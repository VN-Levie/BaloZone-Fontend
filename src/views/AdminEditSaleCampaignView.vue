<template>
  <div class="admin-edit-sale-campaign">
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
                <li class="breadcrumb-item active">Chỉnh sửa</li>
              </ol>
            </nav>
            <h1 class="page-title">
              <i class="bi bi-pencil-square text-primary"></i>
              Chỉnh sửa Chiến dịch
            </h1>
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
          <p class="mt-3">Đang tải thông tin chiến dịch...</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="container-fluid">
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
          <button @click="loadCampaign" class="btn btn-sm btn-outline-danger ms-2">
            Thử lại
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="currentCampaign" class="content-section">
      <div class="container-fluid">
        <form @submit.prevent="handleSubmit" class="campaign-form">
          <div class="row">
            <!-- Main Form -->
            <div class="col-lg-8">
              <div class="form-card">
                <h5 class="card-title">Thông tin chính</h5>
                
                <div class="row g-3">
                  <div class="col-12">
                    <label for="name" class="form-label required">Tên chiến dịch</label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.name }"
                      placeholder="Nhập tên chiến dịch khuyến mãi..."
                      required
                    />
                    <div v-if="errors.name" class="invalid-feedback">
                      {{ errors.name }}
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="slug" class="form-label">Slug (URL thân thiện)</label>
                    <input
                      id="slug"
                      v-model="form.slug"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.slug }"
                      placeholder="Tự động tạo từ tên chiến dịch"
                    />
                    <div v-if="errors.slug" class="invalid-feedback">
                      {{ errors.slug }}
                    </div>
                    <div class="form-text">
                      URL: {{ baseUrl }}/sale-campaigns/{{ form.slug || 'slug-example' }}
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="description" class="form-label required">Mô tả</label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      class="form-control"
                      :class="{ 'is-invalid': errors.description }"
                      rows="4"
                      placeholder="Mô tả chi tiết về chiến dịch khuyến mãi..."
                      required
                    ></textarea>
                    <div v-if="errors.description" class="invalid-feedback">
                      {{ errors.description }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="start_date" class="form-label required">Ngày bắt đầu</label>
                    <input
                      id="start_date"
                      v-model="form.start_date"
                      type="datetime-local"
                      class="form-control"
                      :class="{ 'is-invalid': errors.start_date }"
                      required
                    />
                    <div v-if="errors.start_date" class="invalid-feedback">
                      {{ errors.start_date }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="end_date" class="form-label required">Ngày kết thúc</label>
                    <input
                      id="end_date"
                      v-model="form.end_date"
                      type="datetime-local"
                      class="form-control"
                      :class="{ 'is-invalid': errors.end_date }"
                      required
                    />
                    <div v-if="errors.end_date" class="invalid-feedback">
                      {{ errors.end_date }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Banner Image -->
              <div class="form-card">
                <h5 class="card-title">Hình ảnh banner</h5>
                
                <div class="current-image" v-if="currentBannerUrl">
                  <label class="form-label">Ảnh hiện tại:</label>
                  <div class="current-banner">
                    <img :src="currentBannerUrl" alt="Current banner" />
                  </div>
                </div>
                
                <div class="upload-area" @click="triggerFileInput" @drop="handleFileDrop" @dragover.prevent>
                  <div v-if="!bannerPreview" class="upload-placeholder">
                    <i class="bi bi-cloud-upload fs-1 text-muted"></i>
                    <p class="mb-2">Click để chọn ảnh mới hoặc kéo thả vào đây</p>
                    <small class="text-muted">Hỗ trợ JPG, PNG, GIF. Kích thước tối đa 5MB</small>
                  </div>
                  
                  <div v-else class="image-preview">
                    <img :src="bannerPreview" alt="Banner preview" />
                    <div class="image-overlay">
                      <button type="button" @click.stop="removeBanner" class="btn btn-sm btn-danger">
                        <i class="bi bi-trash"></i>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
                
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileSelect"
                  class="d-none"
                />
                
                <div v-if="errors.banner_image" class="text-danger mt-2">
                  {{ errors.banner_image }}
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="col-lg-4">
              <!-- Status & Settings -->
              <div class="form-card">
                <h5 class="card-title">Cài đặt</h5>
                
                <div class="mb-3">
                  <label for="status" class="form-label">Trạng thái</label>
                  <select
                    id="status"
                    v-model="form.status"
                    class="form-select"
                    :class="{ 'is-invalid': errors.status }"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                    <option value="scheduled">Lên lịch</option>
                  </select>
                  <div v-if="errors.status" class="invalid-feedback">
                    {{ errors.status }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="priority" class="form-label">Độ ưu tiên (0-100)</label>
                  <input
                    id="priority"
                    v-model.number="form.priority"
                    type="number"
                    min="0"
                    max="100"
                    class="form-control"
                    :class="{ 'is-invalid': errors.priority }"
                    placeholder="0"
                  />
                  <div v-if="errors.priority" class="invalid-feedback">
                    {{ errors.priority }}
                  </div>
                  <div class="form-text">
                    Chiến dịch có độ ưu tiên cao sẽ hiển thị trước
                  </div>
                </div>

                <div class="mb-3">
                  <div class="form-check">
                    <input
                      id="is_featured"
                      v-model="form.is_featured"
                      type="checkbox"
                      class="form-check-input"
                    />
                    <label for="is_featured" class="form-check-label">
                      Đánh dấu nổi bật
                    </label>
                  </div>
                  <div class="form-text">
                    Chiến dịch nổi bật sẽ hiển thị ở vị trí đặc biệt
                  </div>
                </div>
              </div>

              <!-- Campaign Stats -->
              <div class="form-card">
                <h5 class="card-title">Thống kê</h5>
                
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value">{{ currentCampaign.sale_products?.length || 0 }}</div>
                    <div class="stat-label">Sản phẩm</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ getTotalSold() }}</div>
                    <div class="stat-label">Đã bán</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ getMaxDiscount() }}%</div>
                    <div class="stat-label">Giảm tối đa</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ formatDate(currentCampaign.created_at) }}</div>
                    <div class="stat-label">Ngày tạo</div>
                  </div>
                </div>
              </div>

              <!-- Metadata -->
              <div class="form-card">
                <h5 class="card-title">Thông tin bổ sung</h5>
                
                <div class="mb-3">
                  <label for="color" class="form-label">Màu chủ đạo</label>
                  <div class="color-input-group">
                    <input
                      id="color"
                      v-model="form.metadata.color"
                      type="color"
                      class="form-control form-control-color"
                    />
                    <input
                      v-model="form.metadata.color"
                      type="text"
                      class="form-control"
                      placeholder="#ff6b6b"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description_short" class="form-label">Mô tả ngắn</label>
                  <input
                    id="description_short"
                    v-model="form.metadata.description_short"
                    type="text"
                    class="form-control"
                    placeholder="VD: Giảm giá lên đến 70%"
                  />
                </div>

                <div class="mb-3">
                  <label for="tags" class="form-label">Tags</label>
                  <input
                    id="tags"
                    v-model="tagsInput"
                    type="text"
                    class="form-control"
                    placeholder="black-friday, sale, limited-time"
                  />
                  <div class="form-text">
                    Phân cách bằng dấu phẩy
                  </div>
                  
                  <div v-if="form.metadata.tags && form.metadata.tags.length" class="tags-display mt-2">
                    <span 
                      v-for="(tag, index) in form.metadata.tags" 
                      :key="index"
                      class="badge bg-secondary me-1 mb-1"
                    >
                      {{ tag }}
                      <button 
                        type="button" 
                        @click="removeTag(index)"
                        class="btn-close btn-close-white ms-1"
                        aria-label="Remove tag"
                        style="font-size: 0.7em;"
                      ></button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="form-card">
                <h5 class="card-title">Thao tác nhanh</h5>
                
                <div class="d-grid gap-2">
                  <router-link 
                    :to="`/admin/sale-campaigns/${campaignId}/products`"
                    class="btn btn-outline-info"
                  >
                    <i class="bi bi-box"></i>
                    Quản lý sản phẩm
                  </router-link>
                  
                  <router-link 
                    :to="`/sale-campaigns/${currentCampaign.slug || currentCampaign.id}`"
                    class="btn btn-outline-success"
                    target="_blank"
                  >
                    <i class="bi bi-eye"></i>
                    Xem trang công khai
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <div class="d-flex justify-content-between">
              <router-link to="/admin/sale-campaigns" class="btn btn-outline-secondary">
                <i class="bi bi-x-circle"></i>
                Hủy
              </router-link>
              
              <button 
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check-circle"></i>
                Cập nhật chiến dịch
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaleCampaigns } from '@/composables/useSaleCampaigns'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { currentCampaign, isLoading, error, fetchSaleCampaign, updateSaleCampaign } = useSaleCampaigns()
const { showToast } = useToast()

const campaignId = computed(() => route.params.id as string)
const baseUrl = computed(() => window.location.origin)

// Form state
const form = reactive({
  name: '',
  slug: '',
  description: '',
  banner_image: null as File | null,
  start_date: '',
  end_date: '',
  status: 'active',
  is_featured: false,
  priority: 0,
  metadata: {
    tags: [] as string[],
    color: '#ff6b6b',
    description_short: ''
  }
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement>()
const bannerPreview = ref('')
const currentBannerUrl = ref('')
const tagsInput = ref('')

// Load campaign data
const loadCampaign = async () => {
  try {
    await fetchSaleCampaign(campaignId.value)
    if (currentCampaign.value) {
      populateForm()
    }
  } catch (err) {
    console.error('Failed to load campaign:', err)
  }
}

const populateForm = () => {
  if (!currentCampaign.value) return

  const campaign = currentCampaign.value
  
  form.name = campaign.name
  form.slug = campaign.slug
  form.description = campaign.description
  form.start_date = formatDateForInput(campaign.start_date)
  form.end_date = formatDateForInput(campaign.end_date)
  form.status = campaign.status
  form.is_featured = campaign.is_featured
  form.priority = campaign.priority || 0
  
  // Metadata
  if (campaign.metadata) {
    form.metadata.tags = campaign.metadata.tags || []
    form.metadata.color = campaign.metadata.color || '#ff6b6b'
    form.metadata.description_short = campaign.metadata.description_short || ''
    
    tagsInput.value = form.metadata.tags.join(', ')
  }
  
  // Banner image
  if (campaign.banner_image) {
    currentBannerUrl.value = campaign.banner_image
  }
}

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Auto-generate slug from name if not manually edited
watch(() => form.name, (newName) => {
  if (!form.slug || form.slug === generateSlug(newName)) {
    form.slug = generateSlug(newName)
  }
})

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Watch tags input
watch(() => tagsInput.value, (newValue) => {
  if (newValue) {
    form.metadata.tags = newValue.split(',').map(tag => tag.trim()).filter(tag => tag)
  } else {
    form.metadata.tags = []
  }
})

// File handling methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    handleFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleFile = (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('Vui lòng chọn file hình ảnh!', 'error')
    return
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('Kích thước file không được vượt quá 5MB!', 'error')
    return
  }

  form.banner_image = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    bannerPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeBanner = () => {
  form.banner_image = null
  bannerPreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeTag = (index: number) => {
  form.metadata.tags.splice(index, 1)
  tagsInput.value = form.metadata.tags.join(', ')
}

// Statistics
const getTotalSold = () => {
  if (!currentCampaign.value?.sale_products) return 0
  return currentCampaign.value.sale_products.reduce((total, product) => {
    return total + (product.sold_quantity || 0)
  }, 0)
}

const getMaxDiscount = () => {
  if (!currentCampaign.value?.sale_products) return 0
  const discounts = currentCampaign.value.sale_products.map(sp => 
    parseFloat(sp.discount_percentage || '0')
  )
  return Math.max(...discounts, 0)
}

// Validation
const validateForm = () => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Tên chiến dịch là bắt buộc'
  }

  if (!form.description.trim()) {
    errors.value.description = 'Mô tả là bắt buộc'
  }

  if (!form.start_date) {
    errors.value.start_date = 'Ngày bắt đầu là bắt buộc'
  }

  if (!form.end_date) {
    errors.value.end_date = 'Ngày kết thúc là bắt buộc'
  }

  if (form.start_date && form.end_date && new Date(form.start_date) >= new Date(form.end_date)) {
    errors.value.end_date = 'Ngày kết thúc phải sau ngày bắt đầu'
  }

  if (form.priority < 0 || form.priority > 100) {
    errors.value.priority = 'Độ ưu tiên phải từ 0 đến 100'
  }

  return Object.keys(errors.value).length === 0
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    showToast('Vui lòng kiểm tra lại thông tin!', 'error')
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    
    // Basic fields
    formData.append('name', form.name)
    formData.append('slug', form.slug || '')
    formData.append('description', form.description)
    formData.append('start_date', form.start_date)
    formData.append('end_date', form.end_date)
    formData.append('status', form.status)
    formData.append('is_featured', form.is_featured ? '1' : '0')
    formData.append('priority', form.priority.toString())
    
    // Metadata
    formData.append('metadata', JSON.stringify(form.metadata))
    
    // Banner image (only if new file selected)
    if (form.banner_image) {
      formData.append('banner_image', form.banner_image)
    }

    await updateSaleCampaign(campaignId.value, formData)
    
    showToast('Cập nhật chiến dịch khuyến mãi thành công!', 'success')
    
    router.push('/admin/sale-campaigns')
  } catch (error: any) {
    console.error('Update campaign error:', error)
    
    if (error.errors) {
      errors.value = error.errors
    } else {
      showToast(
        error.message || 'Có lỗi xảy ra khi cập nhật chiến dịch!', 
        'error'
      )
    }
  } finally {
    isSubmitting.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadCampaign()
})
</script>

<style scoped>
.admin-edit-sale-campaign {
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

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.content-section {
  padding-bottom: 2rem;
}

.loading-state,
.error-state {
  padding: 2rem 0;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f8f9fa;
}

.required::after {
  content: ' *';
  color: #dc3545;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.1);
}

.current-banner {
  margin-bottom: 1rem;
}

.current-banner img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.upload-area {
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.upload-placeholder p {
  font-size: 1.1rem;
  color: #6c757d;
}

.image-preview {
  position: relative;
  max-width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
}

.form-control-color {
  width: 60px;
  height: 45px;
  border-radius: 8px;
}

.tags-display {
  max-height: 100px;
  overflow-y: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-actions {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0056b3, #004085);
  transform: translateY(-1px);
}

.btn-outline-secondary {
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
}

.btn-outline-info {
  border: 1px solid #17a2b8;
  color: #17a2b8;
}

.btn-outline-info:hover {
  background: #17a2b8;
  color: white;
}

.btn-outline-success {
  border: 1px solid #28a745;
  color: #28a745;
}

.btn-outline-success:hover {
  background: #28a745;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .header-section .row {
    text-align: center;
  }
  
  .header-section .col-auto {
    margin-top: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions .d-flex {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
