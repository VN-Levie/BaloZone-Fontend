<template>
    <AdminLayout>
        <div class="admin-news-form-view">
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-0">{{ isEditing ? 'Chỉnh sửa tin tức' : 'Tạo tin tức mới' }}</h1>
                    <p class="text-muted mb-0">{{ isEditing ? 'Cập nhật thông tin tin tức' : 'Thêm tin tức mới vào hệ thống' }}</p>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-outline-secondary" @click="goBack">
                        <i class="bi bi-arrow-left me-2"></i>
                        Quay lại
                    </button>
                </div>
            </div>

            <!-- Form -->
            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Thông tin tin tức</h5>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="handleSubmit">
                                <div class="mb-3">
                                    <label for="title" class="form-label">Tiêu đề *</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.title }"
                                        id="title"
                                        v-model="form.title"
                                        required
                                        placeholder="Nhập tiêu đề tin tức"
                                    />
                                    <div v-if="errors.title" class="invalid-feedback">
                                        {{ errors.title[0] }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="description" class="form-label">Mô tả *</label>
                                    <textarea
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.description }"
                                        id="description"
                                        v-model="form.description"
                                        rows="6"
                                        required
                                        placeholder="Nhập mô tả chi tiết tin tức"
                                    ></textarea>
                                    <div v-if="errors.description" class="invalid-feedback">
                                        {{ errors.description[0] }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="content" class="form-label">Nội dung</label>
                                    <textarea
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.content }"
                                        id="content"
                                        v-model="form.content"
                                        rows="10"
                                        placeholder="Nhập nội dung chi tiết tin tức (tùy chọn)"
                                    ></textarea>
                                    <div v-if="errors.content" class="invalid-feedback">
                                        {{ errors.content[0] }}
                                    </div>
                                </div>

                                <div class="d-flex gap-3 mt-4">
                                    <button type="button" class="btn btn-secondary" @click="goBack">
                                        Hủy
                                    </button>
                                    <button type="submit" class="btn btn-primary" :disabled="submitting">
                                        <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {{ isEditing ? 'Cập nhật' : 'Tạo mới' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <!-- Thumbnail Upload -->
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">Ảnh thumbnail</h6>
                        </div>
                        <div class="card-body">
                            <!-- Current thumbnail preview -->
                            <div v-if="currentThumbnail" class="mb-3">
                                <label class="form-label">Ảnh hiện tại:</label>
                                <div class="position-relative">
                                    <img
                                        :src="currentThumbnail"
                                        alt="Current thumbnail"
                                        class="img-fluid rounded border"
                                        style="max-height: 200px; width: 100%; object-fit: cover;"
                                    />
                                    <button
                                        type="button"
                                        class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                        @click="removeThumbnail"
                                        title="Xóa ảnh"
                                    >
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- File upload -->
                            <div class="mb-3">
                                <label for="thumbnail" class="form-label">
                                    {{ currentThumbnail ? 'Thay đổi ảnh thumbnail' : 'Chọn ảnh thumbnail' }}
                                </label>
                                <input
                                    type="file"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.thumbnail }"
                                    id="thumbnail"
                                    accept="image/*"
                                    @change="handleFileUpload"
                                    ref="fileInput"
                                />
                                <div v-if="errors.thumbnail" class="invalid-feedback">
                                    {{ errors.thumbnail[0] }}
                                </div>
                                <div class="form-text">
                                    Chấp nhận: JPG, PNG, GIF, WEBP. Tối đa 2MB.
                                </div>
                            </div>

                            <!-- URL input alternative -->
                            <div class="mb-3">
                                <label for="thumbnailUrl" class="form-label">Hoặc nhập URL ảnh:</label>
                                <input
                                    type="url"
                                    class="form-control"
                                    id="thumbnailUrl"
                                    v-model="thumbnailUrl"
                                    placeholder="https://example.com/image.jpg"
                                    @blur="handleUrlInput"
                                />
                                <div class="form-text">
                                    Có thể nhập URL ảnh thay vì upload file
                                </div>
                            </div>

                            <!-- Preview for URL -->
                            <div v-if="thumbnailUrl && !currentThumbnail" class="mb-3">
                                <label class="form-label">Xem trước:</label>
                                <img
                                    :src="thumbnailUrl"
                                    alt="Preview"
                                    class="img-fluid rounded border"
                                    style="max-height: 200px; width: 100%; object-fit: cover;"
                                    @error="thumbnailError = true"
                                    @load="thumbnailError = false"
                                />
                                <div v-if="thumbnailError" class="text-danger small mt-1">
                                    Không thể tải ảnh từ URL này
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status and Actions -->
                    <div class="card mt-3">
                        <div class="card-header">
                            <h6 class="mb-0">Trạng thái</h6>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <div class="form-check form-switch">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        id="isPublished"
                                        v-model="form.is_published"
                                    />
                                    <label class="form-check-label" for="isPublished">
                                        Xuất bản ngay
                                    </label>
                                </div>
                                <div class="form-text">
                                    Tin tức sẽ hiển thị công khai khi được xuất bản
                                </div>
                            </div>

                            <div v-if="isEditing" class="mb-3">
                                <small class="text-muted">
                                    <div><strong>Tạo:</strong> {{ newsData?.created_at ? formatDate(newsData.created_at) : 'N/A' }}</div>
                                    <div><strong>Cập nhật:</strong> {{ newsData?.updated_at ? formatDate(newsData.updated_at) : 'N/A' }}</div>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminNews } from '@/composables/useAdminNews'
import { useToast } from '@/composables/useToast'
import type { News } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

// Composable
const {
    form,
    errors,
    submitting,
    createNews,
    updateNews,
    resetForm,
    setFormData,
    formatDate,
    loadNewsById
} = useAdminNews()

// Local state
const newsData = ref<News | null>(null)
const currentThumbnail = ref<string>('')
const thumbnailUrl = ref<string>('')
const thumbnailError = ref(false)
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)

// Computed
const isEditing = computed(() => !!route.params.id)
const newsId = computed(() => route.params.id as string)

// Methods
const loadNewsData = async () => {
    if (isEditing.value) {
        try {
            const data = await loadNewsById(parseInt(newsId.value))
            if (data) {
                newsData.value = data
                setFormData(data)
                currentThumbnail.value = data.thumbnail || ''
            } else {
                showToast('Không thể tải thông tin tin tức', 'error')
                goBack()
            }
        } catch (error) {
            showToast('Lỗi khi tải thông tin tin tức', 'error')
            goBack()
        }
    } else {
        resetForm()
        // Set default values for new news
        form.is_published = false
    }
}

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    // Validate file type - according to API doc: jpeg,png,jpg,gif,webp
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        showToast('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)', 'error')
        return
    }

    // Validate file size (2MB according to API doc)
    if (file.size > 2 * 1024 * 1024) {
        showToast('File ảnh quá lớn. Tối đa 2MB', 'error')
        return
    }

    // Store the file for later upload when form is submitted
    selectedFile.value = file

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    currentThumbnail.value = previewUrl
    thumbnailUrl.value = ''

    showToast('Đã chọn file ảnh', 'success')
}

const handleUrlInput = () => {
    if (thumbnailUrl.value) {
        currentThumbnail.value = thumbnailUrl.value
        form.thumbnail = thumbnailUrl.value
    }
}

const removeThumbnail = () => {
    currentThumbnail.value = ''
    thumbnailUrl.value = ''
    selectedFile.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const handleSubmit = async () => {
    try {
        const newsData = {
            title: form.title,
            description: form.description,
            content: form.content || '',
            thumbnail: selectedFile.value || (thumbnailUrl.value ? thumbnailUrl.value : undefined),
            is_published: form.is_published || false
        }

        if (isEditing.value) {
            await updateNews(parseInt(newsId.value), newsData)
            showToast('Cập nhật tin tức thành công', 'success')
        } else {
            await createNews(newsData)
            showToast('Tạo tin tức thành công', 'success')
        }

        goBack()
    } catch (error) {
        // Error handling is done in the composable
    }
}

const goBack = () => {
    router.push('/admin/news')
}

// Lifecycle
onMounted(() => {
    loadNewsData()
})
</script>

<style scoped>
.admin-news-form-view {
    max-width: 1200px;
}

.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.progress {
    height: 0.5rem;
}

.btn-group-sm > .btn, .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.2rem;
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.img-fluid {
    transition: all 0.3s ease;
}

.img-fluid:hover {
    transform: scale(1.02);
}
</style>
