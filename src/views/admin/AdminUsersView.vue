<template>
    <AdminLayout>
        <div class="admin-users-view">
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-0">Quản lý người dùng</h1>
                    <p class="text-muted mb-0">Quản lý tài khoản và phân quyền người dùng</p>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-secondary" @click="loadUsers(currentPage)">
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Làm mới
                    </button>
                </div>
            </div>

            <!-- Search and Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                                    v-model="searchQuery"
                                    @keydown.enter="search()"
                                />
                                <button class="btn btn-outline-secondary" type="button" @click="search()">
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="statusFilter" @change="search()">
                                <option value="">Tất cả trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="roleFilter" @change="search()">
                                <option value="">Tất cả vai trò</option>
                                <option v-for="role in roles" :key="role.id" :value="role.name">
                                    {{ role.display_name || role.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row mt-2" v-if="searchQuery || statusFilter || roleFilter">
                        <div class="col-12">
                            <button class="btn btn-sm btn-outline-secondary" @click="clearFilters()">
                                <i class="bi bi-x-circle me-1"></i>
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Users Table -->
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-people-fill me-2"></i>
                        Danh sách người dùng
                    </h5>
                    <span class="badge bg-primary">{{ totalUsers }} người dùng</span>
                </div>
                <div class="card-body">
                    <!-- Loading State -->
                    <div v-if="loading" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Đang tải...</span>
                        </div>
                        <p class="mt-2 mb-0">Đang tải danh sách người dùng...</p>
                    </div>

                    <!-- Users Table -->
                    <div v-else-if="users.length > 0" class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Người dùng</th>
                                    <th scope="col">Liên hệ</th>
                                    <th scope="col">Vai trò</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Đơn hàng</th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td>{{ user.id }}</td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-sm me-3">
                                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                                    {{ user.name.charAt(0).toUpperCase() }}
                                                </div>
                                            </div>
                                            <div>
                                                <div class="fw-medium">{{ user.name }}</div>
                                                <small class="text-muted">ID: {{ user.id }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div class="text-truncate" style="max-width: 200px;">
                                                <i class="bi bi-envelope me-1"></i>
                                                {{ user.email }}
                                            </div>
                                            <div v-if="user.phone" class="text-muted small">
                                                <i class="bi bi-telephone me-1"></i>
                                                {{ user.phone }}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex flex-wrap gap-1">
                                            <span
                                                v-if="isUserAdmin(user)"
                                                class="badge bg-danger"
                                            >
                                                Admin
                                            </span>
                                            <span
                                                v-else-if="isUserContributor(user)"
                                                class="badge bg-warning"
                                            >
                                                Contributor
                                            </span>
                                            <span
                                                v-else
                                                class="badge bg-secondary"
                                            >
                                                User
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span :class="getUserStatusBadge(user.status).class">
                                            {{ getUserStatusBadge(user.status).text }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge bg-info">
                                            {{ user.orders_count || 0 }} đơn
                                        </span>
                                    </td>
                                    <td>
                                        <span class="text-nowrap">{{ formatDate(user.created_at) }}</span>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-1">
                                            <button
                                                class="btn btn-sm btn-outline-primary"
                                                @click="editUser(user)"
                                                title="Chỉnh sửa"
                                            >
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                class="btn btn-sm btn-outline-warning"
                                                @click="manageRoles(user)"
                                                title="Phân quyền"
                                            >
                                                <i class="bi bi-shield-check"></i>
                                            </button>
                                            <button
                                                class="btn btn-sm btn-outline-danger"
                                                @click="confirmDelete(user)"
                                                title="Xóa"
                                            >
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-5">
                        <i class="bi bi-people display-4 text-muted"></i>
                        <h5 class="mt-3">Không có người dùng nào</h5>
                        <p class="text-muted">Chưa có người dùng nào trong hệ thống hoặc không tìm thấy kết quả phù hợp.</p>
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
                        <div class="text-muted">
                            Hiển thị {{ users.length }} trong tổng số {{ totalUsers }} người dùng
                        </div>
                        <nav>
                            <ul class="pagination pagination-sm mb-0">
                                <li class="page-item" :class="{ disabled: !hasPrevPage }">
                                    <button class="page-link" @click="prevPage()" :disabled="!hasPrevPage">
                                        Trước
                                    </button>
                                </li>
                                <li
                                    v-for="page in Math.min(5, totalPages)"
                                    :key="page"
                                    class="page-item"
                                    :class="{ active: page === currentPage }"
                                >
                                    <button class="page-link" @click="goToPage(page)">
                                        {{ page }}
                                    </button>
                                </li>
                                <li class="page-item" :class="{ disabled: !hasNextPage }">
                                    <button class="page-link" @click="nextPage()" :disabled="!hasNextPage">
                                        Sau
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <!-- Edit User Modal -->
            <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editUserModalLabel">Chỉnh sửa người dùng</h5>
                            <button type="button" class="btn-close" @click="closeModal('editUserModal')" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="handleUpdateUser">
                                <div class="mb-3">
                                    <label for="editName" class="form-label">Tên *</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.name }"
                                        id="editName"
                                        v-model="form.name"
                                        required
                                    />
                                    <div v-if="errors.name" class="invalid-feedback">
                                        {{ errors.name[0] }}
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="editEmail" class="form-label">Email *</label>
                                    <input
                                        type="email"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.email }"
                                        id="editEmail"
                                        v-model="form.email"
                                        required
                                    />
                                    <div v-if="errors.email" class="invalid-feedback">
                                        {{ errors.email[0] }}
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="editPhone" class="form-label">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.phone }"
                                        id="editPhone"
                                        v-model="form.phone"
                                    />
                                    <div v-if="errors.phone" class="invalid-feedback">
                                        {{ errors.phone[0] }}
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="editStatus" class="form-label">Trạng thái *</label>
                                    <select
                                        class="form-select"
                                        :class="{ 'is-invalid': errors.status }"
                                        id="editStatus"
                                        v-model="form.status"
                                        required
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                    </select>
                                    <div v-if="errors.status" class="invalid-feedback">
                                        {{ errors.status[0] }}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal('editUserModal')">Hủy</button>
                            <button type="button" class="btn btn-primary" @click="handleUpdateUser" :disabled="submitting">
                                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Role Management Modal -->
            <div class="modal fade" id="roleModal" tabindex="-1" aria-labelledby="roleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="roleModalLabel">Quản lý vai trò</h5>
                            <button type="button" class="btn-close" @click="closeModal('roleModal')" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="selectedUser">
                                <div class="mb-3">
                                    <strong>Người dùng:</strong> {{ selectedUser.name }} ({{ selectedUser.email }})
                                </div>
                                <div class="mb-3">
                                    <strong>Vai trò hiện tại:</strong>
                                    <div class="mt-2">
                                        <span
                                            v-for="role in selectedUser.roles"
                                            :key="role.id"
                                            class="badge bg-primary me-1 mb-1"
                                        >
                                            {{ role.display_name || role.name }}
                                            <button
                                                type="button"
                                                class="btn-close btn-close-white ms-1"
                                                @click="handleRemoveRole(selectedUser.id, role.id)"
                                                :disabled="submitting"
                                            ></button>
                                        </span>
                                        <span v-if="!selectedUser.roles || selectedUser.roles.length === 0" class="text-muted">
                                            Chưa có vai trò nào
                                        </span>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label"><strong>Thêm vai trò:</strong></label>
                                    <div class="d-flex gap-2">
                                        <select class="form-select" v-model="selectedRoleId">
                                            <option value="">Chọn vai trò</option>
                                            <option
                                                v-for="role in availableRoles"
                                                :key="role.id"
                                                :value="role.id"
                                            >
                                                {{ role.display_name || role.name }}
                                            </option>
                                        </select>
                                        <button
                                            type="button"
                                            class="btn btn-primary"
                                            @click="handleAssignRole(selectedUser.id, selectedRoleId)"
                                            :disabled="!selectedRoleId || submitting"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal('roleModal')">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteModalLabel">Xác nhận xóa</h5>
                            <button type="button" class="btn-close" @click="closeModal('deleteModal')" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="selectedUser">
                                <p>Bạn có chắc chắn muốn xóa người dùng <strong>{{ selectedUser.name }}</strong>?</p>
                                <div class="alert alert-warning">
                                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                    Hành động này không thể hoàn tác!
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal('deleteModal')">Hủy</button>
                            <button type="button" class="btn btn-danger" @click="handleDeleteUser" :disabled="submitting">
                                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Xóa người dùng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAdminUsers } from '@/composables/useAdminUsers'
import type { User } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Composables
const {
    users,
    loading,
    submitting,
    totalUsers,
    currentPage,
    totalPages,
    errors,
    searchQuery,
    statusFilter,
    roleFilter,
    roles,
    form,
    hasNextPage,
    hasPrevPage,
    loadUsers,
    updateUser,
    deleteUser,
    loadRoles,
    assignRole,
    removeRole,
    resetForm,
    setFormData,
    goToPage,
    nextPage,
    prevPage,
    search,
    clearFilters,
    formatDate,
    getUserRoles,
    getUserStatusBadge,
    isUserAdmin,
    isUserContributor
} = useAdminUsers()

// Local state
const selectedUser = ref<User | null>(null)
const selectedRoleId = ref<number | string>('')

// Computed
const availableRoles = computed(() => {
    if (!selectedUser.value || !roles.value) return []

    const userRoleIds = selectedUser.value.roles?.map(role => role.id) || []
    return roles.value.filter(role => !userRoleIds.includes(role.id))
})

// Methods
const editUser = (user: User) => {
    selectedUser.value = user
    setFormData(user)

    // Open modal using DOM method
    const modalElement = document.getElementById('editUserModal')
    if (modalElement) {
        modalElement.style.display = 'block'
        modalElement.classList.add('show')
        document.body.classList.add('modal-open')

        // Add backdrop
        const backdrop = document.createElement('div')
        backdrop.className = 'modal-backdrop fade show'
        backdrop.id = 'editUserModalBackdrop'
        document.body.appendChild(backdrop)
    }
}

const manageRoles = (user: User) => {
    selectedUser.value = user
    selectedRoleId.value = ''

    // Open modal using DOM method
    const modalElement = document.getElementById('roleModal')
    if (modalElement) {
        modalElement.style.display = 'block'
        modalElement.classList.add('show')
        document.body.classList.add('modal-open')

        // Add backdrop
        const backdrop = document.createElement('div')
        backdrop.className = 'modal-backdrop fade show'
        backdrop.id = 'roleModalBackdrop'
        document.body.appendChild(backdrop)
    }
}

const confirmDelete = (user: User) => {
    selectedUser.value = user

    // Open modal using DOM method
    const modalElement = document.getElementById('deleteModal')
    if (modalElement) {
        modalElement.style.display = 'block'
        modalElement.classList.add('show')
        document.body.classList.add('modal-open')

        // Add backdrop
        const backdrop = document.createElement('div')
        backdrop.className = 'modal-backdrop fade show'
        backdrop.id = 'deleteModalBackdrop'
        document.body.appendChild(backdrop)
    }
}

const closeModal = (modalId: string) => {
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
        modalElement.style.display = 'none'
        modalElement.classList.remove('show')
        document.body.classList.remove('modal-open')

        // Remove backdrop
        const backdrop = document.getElementById(modalId + 'Backdrop')
        if (backdrop) {
            backdrop.remove()
        }
    }
}

const handleUpdateUser = async () => {
    if (!selectedUser.value) return

    try {
        await updateUser(selectedUser.value.id, {
            name: form.value.name,
            email: form.value.email,
            phone: form.value.phone,
            status: form.value.status
        })

        // Close modal
        closeModal('editUserModal')
        resetForm()
        selectedUser.value = null

    } catch (error) {
        // Error handled in composable
    }
}

const handleAssignRole = async (userId: number, roleId: number | string) => {
    if (!roleId) return

    // Find the role by ID to get its name
    const role = roles.value.find(r => r.id === Number(roleId))
    if (!role) return

    try {
        await assignRole(userId, role.name)
        selectedRoleId.value = ''

        // Update selected user
        if (selectedUser.value && selectedUser.value.id === userId) {
            const updatedUser = users.value.find(u => u.id === userId)
            if (updatedUser) {
                selectedUser.value = updatedUser
            }
        }

    } catch (error) {
        // Error handled in composable
    }
}

const handleRemoveRole = async (userId: number, roleId: number) => {
    // Find the role by ID to get its name
    const user = users.value.find(u => u.id === userId)
    const role = user?.roles?.find(r => r.id === roleId)
    if (!role) return

    try {
        await removeRole(userId, role.name)

        // Update selected user
        if (selectedUser.value && selectedUser.value.id === userId) {
            const updatedUser = users.value.find(u => u.id === userId)
            if (updatedUser) {
                selectedUser.value = updatedUser
            }
        }

    } catch (error) {
        // Error handled in composable
    }
}

const handleDeleteUser = async () => {
    if (!selectedUser.value) return

    try {
        await deleteUser(selectedUser.value.id)

        // Close modal
        closeModal('deleteModal')
        selectedUser.value = null

    } catch (error) {
        // Error handled in composable
    }
}

// Lifecycle
onMounted(async () => {
    await loadRoles()
    await loadUsers(1)
})
</script>

<style scoped>
.admin-users-view {
    max-width: 1400px;
}

.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.table th {
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
}

.avatar-sm {
    flex-shrink: 0;
}

.btn-sm {
    font-size: 0.875rem;
}

.badge {
    font-size: 0.75rem;
}

.modal-content {
    border: none;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
    border-bottom: 1px solid #dee2e6;
}

.modal-footer {
    border-top: 1px solid #dee2e6;
}

.dropdown-menu {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.15);
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width: 768px) {
    .table-responsive {
        font-size: 0.875rem;
    }

    .btn-sm {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
    }
}
</style>
