import { ref, computed } from 'vue'
import type { Address, PaymentMethod, Voucher, CreateOrderRequest, Order } from '@/types'
import { ordersApi, addressBookApi, paymentMethodsApi, vouchersApi } from '@/services/api'
import { useCart } from './useCart'
import { useToast } from './useToast'

export const useCheckout = () => {
  const { cartItems, totalAmount, clearCart } = useCart()
  const { addToast } = useToast()

  // State
  const addresses = ref<Address[]>([])
  const paymentMethods = ref<PaymentMethod[]>([])
  const availableVouchers = ref<Voucher[]>([])
  const selectedAddress = ref<Address | null>(null)
  const selectedPaymentMethod = ref<PaymentMethod | null>(null)
  const selectedVoucher = ref<Voucher | null>(null)
  const orderComment = ref('')
  const isLoading = ref(false)
  const isPlacingOrder = ref(false)

  // Computed
  const subtotal = computed(() => totalAmount.value)

  const discount = computed(() => {
    if (!selectedVoucher.value) return 0
    
    // Handle legacy price field
    if (selectedVoucher.value.price !== undefined && selectedVoucher.value.price !== null) {
      const voucherPrice = selectedVoucher.value.price
      return typeof voucherPrice === 'string' ? parseFloat(voucherPrice) || 0 : voucherPrice || 0
    }
    
    // Handle new discount structure
    if (selectedVoucher.value.discount_type && selectedVoucher.value.discount_value) {
      const discountValue = parseFloat(selectedVoucher.value.discount_value) || 0
      
      if (selectedVoucher.value.discount_type === 'percentage') {
        // Calculate percentage discount
        const percentageDiscount = (subtotal.value * discountValue) / 100
        
        // Apply max discount limit if exists
        if (selectedVoucher.value.max_discount_amount) {
          const maxDiscount = parseFloat(selectedVoucher.value.max_discount_amount) || 0
          return Math.min(percentageDiscount, maxDiscount)
        }
        
        return percentageDiscount
      } else if (selectedVoucher.value.discount_type === 'fixed') {
        return discountValue
      }
    }
    
    return 0
  })

  const total = computed(() => {
    return Math.max(0, subtotal.value - discount.value)
  })

  const canPlaceOrder = computed(() => {
    return (
      selectedAddress.value &&
      selectedPaymentMethod.value &&
      cartItems.value.length > 0 &&
      !isPlacingOrder.value
    )
  })

  // Methods
  const loadAddresses = async () => {
    try {
      const response = await addressBookApi.getAddresses()
      addresses.value = response.data

      // Auto-select default address
      const defaultAddress = addresses.value.find(addr => addr.is_default)
      if (defaultAddress) {
        selectedAddress.value = defaultAddress
      } else if (addresses.value.length > 0) {
        selectedAddress.value = addresses.value[0]
      }
    } catch (error) {
      console.error('Failed to load addresses:', error)
      addToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể tải danh sách địa chỉ'
      })
    }
  }

  const loadPaymentMethods = async () => {
    try {
      const response = await paymentMethodsApi.getPaymentMethods()
      paymentMethods.value = response.data.filter(pm => pm.status === 'active')

      // Auto-select first payment method
      if (paymentMethods.value.length > 0) {
        selectedPaymentMethod.value = paymentMethods.value[0]
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error)
      addToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể tải phương thức thanh toán'
      })
    }
  }

  const loadAvailableVouchers = async () => {
    try {
      const response = await vouchersApi.getActiveVouchers()
      availableVouchers.value = response.data
    } catch (error) {
      console.error('Failed to load vouchers:', error)
    }
  }

  const validateVoucherCode = async (code: string): Promise<boolean> => {
    try {
      const response = await vouchersApi.validateVoucher(code)
      selectedVoucher.value = response.data
      
      // Handle discount amount safely
      let discountMessage = ''
      const voucher = response.data
      
      if (voucher.price !== undefined && voucher.price !== null) {
        // Legacy price field
        const discountAmount = typeof voucher.price === 'string' 
          ? parseFloat(voucher.price) || 0
          : voucher.price || 0
        discountMessage = `Giảm ${discountAmount.toLocaleString()}đ`
      } else if (voucher.discount_type && voucher.discount_value) {
        // New discount structure
        const discountValue = parseFloat(voucher.discount_value) || 0
        
        if (voucher.discount_type === 'percentage') {
          discountMessage = `Giảm ${discountValue}%`
          if (voucher.max_discount_amount) {
            const maxDiscount = parseFloat(voucher.max_discount_amount) || 0
            discountMessage += ` (tối đa ${maxDiscount.toLocaleString()}đ)`
          }
        } else if (voucher.discount_type === 'fixed') {
          discountMessage = `Giảm ${discountValue.toLocaleString()}đ`
        }
      }
      
      addToast({
        type: 'success',
        title: 'Thành công',
        message: `Áp dụng voucher thành công! ${discountMessage}`
      })
      return true
    } catch (error) {
      console.error('Failed to validate voucher:', error)
      addToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Mã voucher không hợp lệ hoặc đã hết hạn'
      })
      return false
    }
  }

  const removeVoucher = () => {
    selectedVoucher.value = null
    addToast({
      type: 'info',
      title: 'Thông báo',
      message: 'Đã hủy voucher'
    })
  }

  const createAddress = async (addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await addressBookApi.createAddress(addressData)
      addresses.value.push(response.data)
      selectedAddress.value = response.data
      addToast({
        type: 'success',
        title: 'Thành công',
        message: 'Thêm địa chỉ thành công'
      })
      return response.data
    } catch (error) {
      console.error('Failed to create address:', error)
      addToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Không thể thêm địa chỉ'
      })
      throw error
    }
  }

  const placeOrder = async (): Promise<Order | null> => {
    if (!canPlaceOrder.value) {
      addToast({
        type: 'error',
        title: 'Lỗi',
        message: 'Vui lòng điền đầy đủ thông tin đặt hàng'
      })
      return null
    }

    isPlacingOrder.value = true

    try {
      const orderData: CreateOrderRequest = {
        items: cartItems.value.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        shipping_address_id: selectedAddress.value!.id,
        payment_method: selectedPaymentMethod.value!.code || selectedPaymentMethod.value!.name.toLowerCase(),
        voucher_code: selectedVoucher.value?.code,
        note: orderComment.value.trim() || undefined
      }

      const response = await ordersApi.createOrder(orderData)

      // Clear cart after successful order
      clearCart()

      // Reset form
      selectedVoucher.value = null
      orderComment.value = ''

      addToast({
        type: 'success',
        title: 'Thành công',
        message: 'Đặt hàng thành công!'
      })
      return response.data
    } catch (error: any) {
      console.error('Failed to place order:', error)

      let errorMessage = 'Không thể đặt hàng. Vui lòng thử lại'

      // Handle different error formats from API
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.errors && typeof errorData.errors === 'object') {
          // Handle validation errors (422)
          const errorList = Object.values(errorData.errors).flat()
          errorMessage = errorList.length > 0 ? errorList[0] as string : errorMessage
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      addToast({
        type: 'error',
        title: 'Lỗi',
        message: errorMessage
      })
      return null
    } finally {
      isPlacingOrder.value = false
    }
  }

  const initializeCheckout = async () => {
    isLoading.value = true
    try {
      await Promise.all([
        loadAddresses(),
        loadPaymentMethods(),
        loadAvailableVouchers()
      ])
    } catch (error) {
      console.error('Failed to initialize checkout:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    addresses,
    paymentMethods,
    availableVouchers,
    selectedAddress,
    selectedPaymentMethod,
    selectedVoucher,
    orderComment,
    isLoading,
    isPlacingOrder,

    // Computed
    subtotal,
    discount,
    total,
    canPlaceOrder,

    // Methods
    loadAddresses,
    loadPaymentMethods,
    loadAvailableVouchers,
    validateVoucherCode,
    removeVoucher,
    createAddress,
    placeOrder,
    initializeCheckout
  }
}
