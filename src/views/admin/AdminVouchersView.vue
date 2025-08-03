<template>
    <AdminLayout>
        <div class="admin-vouchers-view">
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-0">Quản lý Voucher</h1>
                    <p class="text-muted mb-0">Quản lý danh sách voucher giảm giá</p>
                </div>
                <button type="button" class="btn btn-primary" @click="$router.push('/admin/vouchers/create')">
                    <i class="bi bi-plus-lg me-2"></i>
                    Tạo voucher mới
                </button>
            </div>

            <!-- Vouchers List -->
            <div class="card">
                <div class="card-body">
                    <LoadingSpinner v-if="loading" />

                    <div v-else-if="vouchers.length === 0" class="text-center py-5">
                        <i class="bi bi-ticket-perforated display-1 text-muted"></i>
                        <h5 class="mt-3">Không có voucher nào</h5>
                        <p class="text-muted">Hãy tạo voucher đầu tiên của bạn</p>
                    </div>

                    <div v-else>
                        <!-- Table -->
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Mã voucher</th>
                                        <th>Tên voucher</th>
                                        <th>Loại giảm giá</th>
                                        <th>Giá trị</th>
                                        <th>Sử dụng</th>
                                        <th>Trạng thái</th>
                                        <th>Thời hạn</th>
                                        <th width="120">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="voucher in vouchers" :key="voucher.id">
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="voucher-code-badge me-2">
                                                    <i class="bi bi-ticket-perforated"></i>
                                                </div>
                                                <div>
                                                    <strong class="text-primary">{{ voucher.code }}</strong>
                                                    <div class="small text-muted">ID: {{ voucher.id }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <h6 class="mb-1">{{ voucher.name }}</h6>
                                                <small class="text-muted" v-if="voucher.description">
                                                    {{ voucher.description }}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge" :class="voucher.discount_type === 'percentage' ? 'bg-info' : 'bg-warning'">
                                                {{ voucher.discount_type === 'percentage' ? 'Phần trăm' : 'Cố định' }}
                                            </span>
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{{ getDiscountText(voucher) }}</strong>
                                                <div class="small text-muted" v-if="voucher.min_order_value">
                                                    Đơn tối thiểu: {{ formatCurrency(voucher.min_order_value) }}
                                                </div>
                                                <div class="small text-muted" v-if="voucher.max_discount_amount && voucher.discount_type === 'percentage'">
                                                    Giảm tối đa: {{ formatCurrency(voucher.max_discount_amount) }}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <span class="fw-bold">{{ voucher.used_count || 0 }}</span>
                                                <span v-if="voucher.usage_limit"> / {{ voucher.usage_limit }}</span>
                                                <span v-else> / ∞</span>
                                            </div>
                                            <div class="small text-muted">lượt sử dụng</div>
                                        </td>
                                        <td>
                                            <span :class="getStatusText(voucher).class">
                                                {{ getStatusText(voucher).text }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="small">
                                                <div>Từ: {{ formatDate(voucher.start_date) }}</div>
                                                <div>Đến: {{ formatDate(voucher.end_date) }}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="btn-group btn-group-sm">
                                                <button
                                                    type="button"
                                                    class="btn btn-outline-primary btn-sm"
                                                    @click="$router.push(`/admin/vouchers/edit/${voucher.id}`)"
                                                    title="Chỉnh sửa"
                                                >
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    class="btn btn-outline-danger btn-sm"
                                                    @click="confirmDelete(voucher)"
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
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" :class="{ show: showDeleteModal, 'd-block': showDeleteModal }" tabindex="-1" role="dialog" aria-hidden="true" v-if="showDeleteModal" @click.self="showDeleteModal = false, deleteVoucherItem = null">
            <div class="modal-dialog" role="document" @click.stop>
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Xác nhận xóa voucher</h5>
                        <button type="button" class="btn-close" @click="showDeleteModal = false, deleteVoucherItem = null"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bạn có chắc chắn muốn xóa voucher <strong class="text-primary">{{ deleteVoucherItem?.code }}</strong> - {{ deleteVoucherItem?.name }}?</p>
                        <p class="text-danger mb-0">Hành động này không thể hoàn tác!</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false, deleteVoucherItem = null">Hủy</button>
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
import { useAdminVouchers } from '@/composables/useAdminVouchers'
import type { Voucher } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Composable
const {
    vouchers,
    loading,
    deleting,
    loadVouchers,
    deleteVoucher,
    formatDate,
    formatCurrency,
    getDiscountText,
    getStatusText
} = useAdminVouchers()

// Additional state for UI
const showDeleteModal = ref(false)
const deleteVoucherItem = ref<Voucher | null>(null)

// Methods
const confirmDelete = (voucher: Voucher) => {
    deleteVoucherItem.value = voucher
    showDeleteModal.value = true
}

const handleDelete = async () => {
    if (!deleteVoucherItem.value) return

    try {
        await deleteVoucher(deleteVoucherItem.value.id)
        showDeleteModal.value = false
    } catch (error) {
        // Error handling is done in the composable
    }
}

// Lifecycle
onMounted(() => {
    loadVouchers()
})
</script>

<style scoped>
.voucher-code-badge {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
}

.table th {
    background-color: #f8f9fa;
    border-top: none;
    font-weight: 600;
    color: #495057;
}

.table td {
    vertical-align: middle;
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

.badge {
    font-size: 0.75rem;
}

.btn-group-sm > .btn, .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.2rem;
}
</style>
