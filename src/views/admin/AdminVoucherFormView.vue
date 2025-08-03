<template>
    <AdminLayout>
        <div class="admin-voucher-form-view">
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-0">{{ isEditing ? 'Chỉnh sửa voucher' : 'Tạo voucher mới' }}</h1>
                    <p class="text-muted mb-0">{{ isEditing ? 'Cập nhật thông tin voucher' : 'Thêm voucher mới vào hệ thống' }}</p>
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
                            <h5 class="mb-0">Thông tin voucher</h5>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="handleSubmit">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="code" class="form-label">Mã voucher *</label>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                :class="{ 'is-invalid': errors.code }" 
                                                id="code" 
                                                v-model="form.code" 
                                                required 
                                                placeholder="VD: WELCOME10"
                                                style="text-transform: uppercase"
                                            />
                                            <div v-if="errors.code" class="invalid-feedback">
                                                {{ errors.code[0] }}
                                            </div>
                                            <div class="form-text">
                                                Mã voucher sẽ được chuyển thành chữ hoa
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="name" class="form-label">Tên voucher *</label>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                :class="{ 'is-invalid': errors.name }" 
                                                id="name" 
                                                v-model="form.name" 
                                                required 
                                                placeholder="VD: Voucher chào mừng"
                                            />
                                            <div v-if="errors.name" class="invalid-feedback">
                                                {{ errors.name[0] }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="description" class="form-label">Mô tả</label>
                                    <textarea 
                                        class="form-control" 
                                        :class="{ 'is-invalid': errors.description }" 
                                        id="description" 
                                        v-model="form.description" 
                                        rows="3" 
                                        placeholder="Mô tả chi tiết về voucher"
                                    ></textarea>
                                    <div v-if="errors.description" class="invalid-feedback">
                                        {{ errors.description[0] }}
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="discount_type" class="form-label">Loại giảm giá *</label>
                                            <select 
                                                class="form-select" 
                                                :class="{ 'is-invalid': errors.discount_type }" 
                                                id="discount_type" 
                                                v-model="form.discount_type" 
                                                required
                                            >
                                                <option value="percentage">Phần trăm (%)</option>
                                                <option value="fixed">Số tiền cố định (VNĐ)</option>
                                            </select>
                                            <div v-if="errors.discount_type" class="invalid-feedback">
                                                {{ errors.discount_type[0] }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="discount_value" class="form-label">
                                                Giá trị giảm *
                                                <span v-if="form.discount_type === 'percentage'">(%)</span>
                                                <span v-else>(VNĐ)</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                class="form-control" 
                                                :class="{ 'is-invalid': errors.discount_value }" 
                                                id="discount_value" 
                                                v-model.number="form.discount_value" 
                                                required 
                                                min="0"
                                                :max="form.discount_type === 'percentage' ? 100 : undefined"
                                                step="0.01"
                                                :placeholder="form.discount_type === 'percentage' ? 'VD: 10' : 'VD: 50000'"
                                            />
                                            <div v-if="errors.discount_value" class="invalid-feedback">
                                                {{ errors.discount_value[0] }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="min_order_value" class="form-label">Giá trị đơn hàng tối thiểu (VNĐ)</label>
                                            <input 
                                                type="number" 
                                                class="form-control" 
                                                :class="{ 'is-invalid': errors.min_order_value }" 
                                                id="min_order_value" 
                                                v-model.number="form.min_order_value" 
                                                min="0"
                                                step="1000"
                                                placeholder="VD: 200000"
                                            />
                                            <div v-if="errors.min_order_value" class="invalid-feedback">
                                                {{ errors.min_order_value[0] }}
                                            </div>
                                            <div class="form-text">
                                                Để trống nếu không có yêu cầu tối thiểu
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6" v-if="form.discount_type === 'percentage'">
                                        <div class="mb-3">
                                            <label for="max_discount_amount" class="form-label">Giảm tối đa (VNĐ)</label>
                                            <input 
                                                type="number" 
                                                class="form-control" 
                                                :class="{ 'is-invalid': errors.max_discount_amount }" 
                                                id="max_discount_amount" 
                                                v-model.number="form.max_discount_amount" 
                                                min="0"
                                                step="1000"
                                                placeholder="VD: 100000"
                                            />
                                            <div v-if="errors.max_discount_amount" class="invalid-feedback">
                                                {{ errors.max_discount_amount[0] }}
                                            </div>
                                            <div class="form-text">
                                                Áp dụng cho voucher phần trăm
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="usage_limit" class="form-label">Giới hạn sử dụng</label>
                                            <input 
                                                type="number" 
                                                class="form-control" 
                                                :class="{ 'is-invalid': errors.usage_limit }" 
                                                id="usage_limit" 
                                                v-model.number="form.usage_limit" 
                                                min="0"
                                                placeholder="VD: 100"
                                            />
                                            <div v-if="errors.usage_limit" class="invalid-feedback">
                                                {{ errors.usage_limit[0] }}
                                            </div>
                                            <div class="form-text">
                                                Để trống để không giới hạn
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="start_date" class="form-label">Ngày bắt đầu *</label>
                                            <input 
                                                type="datetime-local" 
                                                class="form-control" 
                                                :class="{ 'is-invalid': errors.start_date }" 
                                                id="start_date" 
                                                v-model="form.start_date" 
                                                required
                                            />
                                            <div v-if="errors.start_date" class="invalid-feedback">
                                                {{ errors.start_date[0] }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="end_date" class="form-label">Ngày kết thúc *</label>
                                            <input 
                                                type="datetime-local" 
                                                class="form-control" 
                                                :class="{ 'is-invalid': errors.end_date }" 
                                                id="end_date" 
                                                v-model="form.end_date" 
                                                required
                                            />
                                            <div v-if="errors.end_date" class="invalid-feedback">
                                                {{ errors.end_date[0] }}
                                            </div>
                                        </div>
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
                    <!-- Preview Card -->
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">Xem trước voucher</h6>
                        </div>
                        <div class="card-body">
                            <div class="voucher-preview">
                                <div class="voucher-code">
                                    <i class="bi bi-ticket-perforated me-2"></i>
                                    {{ form.code || 'VOUCHER_CODE' }}
                                </div>
                                <div class="voucher-name">
                                    {{ form.name || 'Tên voucher' }}
                                </div>
                                <div class="voucher-discount">
                                    <span v-if="form.discount_type === 'percentage'">
                                        Giảm {{ form.discount_value || 0 }}%
                                    </span>
                                    <span v-else>
                                        Giảm {{ formatCurrency(form.discount_value || 0) }}
                                    </span>
                                </div>
                                <div class="voucher-details">
                                    <small v-if="form.min_order_value">
                                        Đơn tối thiểu: {{ formatCurrency(form.min_order_value) }}
                                    </small>
                                    <small v-if="form.max_discount_amount && form.discount_type === 'percentage'">
                                        Giảm tối đa: {{ formatCurrency(form.max_discount_amount) }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Status Card -->
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
                                        id="is_active" 
                                        v-model="form.is_active"
                                    />
                                    <label class="form-check-label" for="is_active">
                                        Kích hoạt voucher
                                    </label>
                                </div>
                                <div class="form-text">
                                    Voucher chỉ có thể sử dụng khi được kích hoạt
                                </div>
                            </div>

                            <div v-if="isEditing && voucherData" class="mb-3">
                                <small class="text-muted">
                                    <div><strong>Tạo:</strong> {{ formatDate(voucherData.created_at) }}</div>
                                    <div><strong>Cập nhật:</strong> {{ formatDate(voucherData.updated_at) }}</div>
                                    <div v-if="voucherData.used_count !== undefined">
                                        <strong>Đã sử dụng:</strong> {{ voucherData.used_count }} lần
                                    </div>
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
import { useAdminVouchers } from '@/composables/useAdminVouchers'
import { useToast } from '@/composables/useToast'
import type { Voucher } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

// Composable
const {
    form,
    errors,
    submitting,
    createVoucher,
    updateVoucher,
    resetForm,
    setFormData,
    formatDate,
    formatCurrency,
    loadVoucherById
} = useAdminVouchers()

// Local state
const voucherData = ref<Voucher | null>(null)

// Computed
const isEditing = computed(() => !!route.params.id)
const voucherId = computed(() => route.params.id as string)

// Methods
const loadVoucherData = async () => {
    if (isEditing.value) {
        try {
            const data = await loadVoucherById(parseInt(voucherId.value))
            if (data) {
                voucherData.value = data
                setFormData(data)
            } else {
                showToast('Không thể tải thông tin voucher', 'error')
                goBack()
            }
        } catch (error) {
            showToast('Lỗi khi tải thông tin voucher', 'error')
            goBack()
        }
    } else {
        resetForm()
        // Set default dates
        const now = new Date()
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        form.start_date = now.toISOString().slice(0, 16)
        form.end_date = nextMonth.toISOString().slice(0, 16)
    }
}

const handleSubmit = async () => {
    try {
        // Uppercase the code
        form.code = form.code.toUpperCase()

        const voucherData = {
            code: form.code,
            name: form.name,
            description: form.description || undefined,
            discount_type: form.discount_type,
            discount_value: form.discount_value,
            min_order_value: form.min_order_value || undefined,
            max_discount_amount: form.max_discount_amount || undefined,
            usage_limit: form.usage_limit || undefined,
            start_date: form.start_date,
            end_date: form.end_date,
            is_active: form.is_active
        }

        if (isEditing.value) {
            await updateVoucher(parseInt(voucherId.value), voucherData)
            showToast('Cập nhật voucher thành công', 'success')
        } else {
            await createVoucher(voucherData)
            showToast('Tạo voucher thành công', 'success')
        }

        goBack()
    } catch (error) {
        // Error handling is done in the composable
    }
}

const goBack = () => {
    router.push('/admin/vouchers')
}

// Lifecycle
onMounted(() => {
    loadVoucherData()
})
</script>

<style scoped>
.admin-voucher-form-view {
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

.voucher-preview {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    text-align: center;
}

.voucher-code {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.voucher-name {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    opacity: 0.9;
}

.voucher-discount {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
}

.voucher-details small {
    display: block;
    opacity: 0.8;
    margin-bottom: 0.25rem;
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

input[type="number"] {
    -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
