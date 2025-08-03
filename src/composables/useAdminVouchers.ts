import { ref, reactive } from 'vue'
import { adminVouchersApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import type { Voucher } from '@/types'

export function useAdminVouchers() {
  const { showToast } = useToast()

  // State
  const vouchers = ref<Voucher[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const deleting = ref(false)

  // Form state
  const form = reactive({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_order_value: 0,
    max_discount_amount: 0,
    usage_limit: 0,
    start_date: '',
    end_date: '',
    is_active: true
  })

  const errors = ref<Record<string, string[]>>({})

  // Methods
  const loadVouchers = async () => {
    try {
      loading.value = true
      const response = await adminVouchersApi.getVouchers()
      vouchers.value = response.data || []
    } catch (error: any) {
      console.error('Failed to load vouchers:', error)
      showToast('Không thể tải danh sách voucher', 'error')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createVoucher = async (voucherData: {
    code: string
    name: string
    description?: string
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    min_order_value?: number
    max_discount_amount?: number
    usage_limit?: number
    start_date: string
    end_date: string
    is_active?: boolean
  }) => {
    try {
      submitting.value = true
      errors.value = {}

      await adminVouchersApi.createVoucher(voucherData)
      showToast('Tạo voucher thành công', 'success')

      // Reload vouchers list
      await loadVouchers()
    } catch (error: any) {
      console.error('Failed to create voucher:', error)

      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else {
        showToast('Không thể tạo voucher', 'error')
      }
      throw error
    } finally {
      submitting.value = false
    }
  }

  const updateVoucher = async (id: number, voucherData: {
    code?: string
    name?: string
    description?: string
    discount_type?: 'percentage' | 'fixed'
    discount_value?: number
    min_order_value?: number
    max_discount_amount?: number
    usage_limit?: number
    start_date?: string
    end_date?: string
    is_active?: boolean
  }) => {
    try {
      submitting.value = true
      errors.value = {}

      await adminVouchersApi.updateVoucher(id, voucherData)
      showToast('Cập nhật voucher thành công', 'success')

      // Reload vouchers list
      await loadVouchers()
    } catch (error: any) {
      console.error('Failed to update voucher:', error)

      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else {
        showToast('Không thể cập nhật voucher', 'error')
      }
      throw error
    } finally {
      submitting.value = false
    }
  }

  const deleteVoucher = async (id: number) => {
    try {
      deleting.value = true
      await adminVouchersApi.deleteVoucher(id)
      showToast('Xóa voucher thành công', 'success')

      // Reload vouchers list
      await loadVouchers()
    } catch (error: any) {
      console.error('Failed to delete voucher:', error)
      showToast('Không thể xóa voucher', 'error')
      throw error
    } finally {
      deleting.value = false
    }
  }

  // Load single voucher for editing
  const loadVoucherById = async (id: number): Promise<Voucher | null> => {
    try {
      loading.value = true
      const response = await adminVouchersApi.getVoucherById(id)
      return response.data
    } catch (error: any) {
      console.error('Failed to load voucher:', error)
      showToast('Không thể tải thông tin voucher', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  const resetForm = () => {
    form.code = ''
    form.name = ''
    form.description = ''
    form.discount_type = 'percentage'
    form.discount_value = 0
    form.min_order_value = 0
    form.max_discount_amount = 0
    form.usage_limit = 0
    form.start_date = ''
    form.end_date = ''
    form.is_active = true
    errors.value = {}
  }

  const setFormData = (voucher: Voucher) => {
    form.code = voucher.code
    form.name = voucher.name
    form.description = voucher.description || ''
    form.discount_type = voucher.discount_type
    form.discount_value = parseFloat(voucher.discount_value.toString())
    form.min_order_value = voucher.min_order_value ? parseFloat(voucher.min_order_value.toString()) : 0
    form.max_discount_amount = voucher.max_discount_amount ? parseFloat(voucher.max_discount_amount.toString()) : 0
    form.usage_limit = voucher.usage_limit || 0
    form.start_date = voucher.start_date ? new Date(voucher.start_date).toISOString().slice(0, 16) : ''
    form.end_date = voucher.end_date ? new Date(voucher.end_date).toISOString().slice(0, 16) : ''
    form.is_active = voucher.is_active
  }

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num)
  }

  const getDiscountText = (voucher: Voucher) => {
    if (voucher.discount_type === 'percentage') {
      return `${voucher.discount_value}%`
    } else {
      return formatCurrency(voucher.discount_value)
    }
  }

  const getStatusText = (voucher: Voucher) => {
    const now = new Date()
    const startDate = new Date(voucher.start_date)
    const endDate = new Date(voucher.end_date)

    if (!voucher.is_active) {
      return { text: 'Tạm dừng', class: 'badge bg-secondary' }
    }

    if (now < startDate) {
      return { text: 'Chưa bắt đầu', class: 'badge bg-warning' }
    }

    if (now > endDate) {
      return { text: 'Đã hết hạn', class: 'badge bg-danger' }
    }

    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      return { text: 'Đã hết lượt', class: 'badge bg-danger' }
    }

    return { text: 'Đang hoạt động', class: 'badge bg-success' }
  }

  return {
    // State
    vouchers,
    loading,
    submitting,
    deleting,
    form,
    errors,

    // Methods
    loadVouchers,
    loadVoucherById,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    resetForm,
    setFormData,
    formatDate,
    formatCurrency,
    getDiscountText,
    getStatusText
  }
}
