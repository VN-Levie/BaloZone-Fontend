<template>
    <AdminLayout>
        <div class="admin-news-view">
            <!-- Hea                                            <button type="button" class="btn btn-outline-primary btn-sm" @click="$router.push(`/admin/news/edit/${item.id}`)" title="Chỉnh sửa">
                                                <i class="bi bi-pencil"></i>
                                            </button> -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-0">Quản lý Tin tức</h1>
                    <p class="text-muted mb-0">Quản lý danh sách tin tức của website</p>
                </div>
                <button type="button" class="btn btn-primary" @click="$router.push('/admin/news/create')">
                    <i class="bi bi-plus-lg me-2"></i>
                    Tạo tin tức mới
                </button>
            </div>
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="form-label">Tìm kiếm</label>
                                <input type="text" class="form-control" v-model="searchTerm" placeholder="Tìm theo tiêu đề..." @input="debouncedSearch" />
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="form-label">Số lượng hiển thị</label>
                                <select class="form-select" v-model="perPage" @change="() => loadNews()">
                                    <option v-for="option in perPageOptions" :key="option.value" :value="option.value">
                                        {{ option.text }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3 d-flex align-items-end">
                            <button type="button" class="btn btn-outline-secondary w-100" @click="resetFiltersAndLoad">
                                <i class="bi bi-arrow-clockwise me-2"></i>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div> <!-- News List -->
            <div class="card">
                <div class="card-body">
                    <LoadingSpinner v-if="loading" />

                    <div v-else-if="news.length === 0" class="text-center py-5">
                        <i class="bi bi-newspaper display-1 text-muted"></i>
                        <h5 class="mt-3">Không có tin tức nào</h5>
                        <p class="text-muted">Hãy tạo tin tức đầu tiên của bạn</p>
                    </div>

                    <div v-else>
                        <!-- Table Header -->
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Tiêu đề</th>
                                        <th>Mô tả</th>
                                        <th>Ngày tạo</th>
                                        <th>Cập nhật lần cuối</th>
                                        <th width="120">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in news" :key="item.id">
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img v-if="item.thumbnail" :src="item.thumbnail" alt="Thumbnail" class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
                                                <div class="placeholder-thumbnail me-3" v-else>
                                                    <i class="bi bi-image"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-0">{{ item.title }}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="text-truncate" style="max-width: 200px; display: inline-block;" :title="item.description">
                                                {{ item.description }}
                                            </span>
                                        </td>
                                        <td>{{ formatDate(item.created_at) }}</td>
                                        <td>{{ formatDate(item.updated_at) }}</td>
                                        <td>
                                            <div class="btn-group btn-group-sm">
                                                <button type="button" class="btn btn-outline-primary btn-sm" @click="$router.push(`/admin/news/edit/${item.id}`)" title="Chỉnh sửa">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button type="button" class="btn btn-outline-danger btn-sm" @click="confirmDelete(item)" title="Xóa">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="d-flex justify-content-between align-items-center mt-4" v-if="pagination.total > 0">
                            <div class="text-muted">
                                Hiển thị {{ pagination.from }} - {{ pagination.to }} của {{ pagination.total }} tin tức
                            </div>
                            <nav aria-label="Pagination">
                                <ul class="pagination pagination-sm">
                                    <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                                        <button class="page-link" @click="currentPage > 1 && (currentPage--, loadNews())" :disabled="currentPage <= 1">
                                            <i class="bi bi-chevron-left"></i>
                                        </button>
                                    </li>
                                    <li class="page-item" v-for="page in getPaginationPages()" :key="page" :class="{ active: currentPage === page }">
                                        <button class="page-link" @click="currentPage = page, loadNews()">
                                            {{ page }}
                                        </button>
                                    </li>
                                    <li class="page-item" :class="{ disabled: currentPage >= pagination.last_page }">
                                        <button class="page-link" @click="currentPage < pagination.last_page && (currentPage++, loadNews())" :disabled="currentPage >= pagination.last_page">
                                            <i class="bi bi-chevron-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" :class="{ show: showDeleteModal, 'd-block': showDeleteModal }" tabindex="-1" role="dialog" aria-hidden="true" v-if="showDeleteModal" @click.self="showDeleteModal = false, deleteNewsItem = null">
            <div class="modal-dialog" role="document" @click.stop>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Xác nhận xóa</h5>
                        <button type="button" class="btn-close" @click="showDeleteModal = false, deleteNewsItem = null"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa tin tức <strong>{{ deleteNewsItem?.title }}</strong>?</p>
                        <p class="text-danger mb-0">Hành động này không thể hoàn tác!</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false, deleteNewsItem = null">Hủy</button>
                        <button type="button" class="btn btn-danger" @click="handleDelete" :disabled="deleting">
                            <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminNews } from '@/composables/useAdminNews'
import type { News } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Composable
const {
    news,
    loading,
    deleting,
    searchTerm,
    currentPage,
    perPage,
    pagination,
    errors,
    loadNews,
    deleteNews,
    resetFilters,
    formatDate
} = useAdminNews()

// Additional state for UI
const showDeleteModal = ref(false)
const deleteNewsItem = ref<News | null>(null)

// Debounce function
const debounce = (func: Function, wait: number) => {
    let timeout: number
    return (...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(null, args), wait)
    }
}

// Options
const perPageOptions = [
    { value: 5, text: '5 tin tức' },
    { value: 10, text: '10 tin tức' },
    { value: 25, text: '25 tin tức' },
    { value: 50, text: '50 tin tức' }
]

// Computed
const debouncedSearch = debounce(() => {
    currentPage.value = 1
    loadNews()
}, 500)

// Methods
const confirmDelete = (newsItem: News) => {
    deleteNewsItem.value = newsItem
    showDeleteModal.value = true
}

const handleDelete = async () => {
    if (!deleteNewsItem.value) return

    try {
        await deleteNews(deleteNewsItem.value.id)
        showDeleteModal.value = false
    } catch (error) {
        // Error handling is done in the composable
    }
}

const resetFiltersAndLoad = () => {
    resetFilters()
    loadNews()
}

const getPaginationPages = () => {
    const pages = []
    const maxPagesToShow = 5
    const half = Math.floor(maxPagesToShow / 2)

    let start = Math.max(1, currentPage.value - half)
    let end = Math.min(pagination.value.last_page, start + maxPagesToShow - 1)

    if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
}// Lifecycle
onMounted(() => {
    loadNews()
})
</script>

<style scoped>
.placeholder-thumbnail {
    width: 50px;
    height: 50px;
    background: #f8f9fa;
    border: 1px dashed #dee2e6;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
}

.text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Custom modal styles */
.modal {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1050;
}

.modal.show {
    display: flex !important;
    align-items: center;
    justify-content: center;
}

.modal-dialog {
    z-index: 1055;
    margin: 0;
    position: relative;
}

.modal-content {
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>
