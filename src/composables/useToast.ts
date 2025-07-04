import { ref, reactive } from 'vue'

interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  autoClose?: boolean
}

const toasts = ref<ToastNotification[]>([])

export const useToast = () => {
  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast: ToastNotification = {
      id,
      duration: 3000,
      autoClose: true,
      ...toast
    }
    
    toasts.value.push(newToast)
    
    // Auto remove after duration
    if (newToast.autoClose && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
    
    return id
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clearAllToasts = () => {
    toasts.value = []
  }
  
  // Convenience methods
  const showSuccess = (title: string, message: string, options?: Partial<ToastNotification>) => {
    return addToast({ type: 'success', title, message, ...options })
  }
  
  const showError = (title: string, message: string, options?: Partial<ToastNotification>) => {
    return addToast({ type: 'error', title, message, ...options })
  }
  
  const showWarning = (title: string, message: string, options?: Partial<ToastNotification>) => {
    return addToast({ type: 'warning', title, message, ...options })
  }
  
  const showInfo = (title: string, message: string, options?: Partial<ToastNotification>) => {
    return addToast({ type: 'info', title, message, ...options })
  }
  
  // Specific cart/wishlist notifications
  const showAddToCartSuccess = (productName: string) => {
    return showSuccess(
      'Thêm vào giỏ hàng thành công!',
      `Đã thêm "${productName}" vào giỏ hàng của bạn.`
    )
  }
  
  const showAddToWishlistSuccess = (productName: string) => {
    return showSuccess(
      'Đã thêm vào yêu thích!',
      `Đã thêm "${productName}" vào danh sách yêu thích.`
    )
  }
  
  const showRemoveFromWishlistSuccess = (productName: string) => {
    return showInfo(
      'Đã xóa khỏi yêu thích',
      `Đã xóa "${productName}" khỏi danh sách yêu thích.`
    )
  }
  
  const showLoginSuccess = (userName: string) => {
    return showSuccess(
      'Đăng nhập thành công!',
      `Chào mừng ${userName} quay lại BaloZone.`
    )
  }
  
  const showLogoutSuccess = () => {
    return showInfo(
      'Đăng xuất thành công',
      'Cảm ơn bạn đã sử dụng BaloZone. Hẹn gặp lại!'
    )
  }

  // Generic showToast method
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', title?: string) => {
    return addToast({
      type,
      title: title || (type === 'error' ? 'Lỗi' : type === 'success' ? 'Thành công' : type === 'warning' ? 'Cảnh báo' : 'Thông báo'),
      message
    })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast,
    showAddToCartSuccess,
    showAddToWishlistSuccess,
    showRemoveFromWishlistSuccess,
    showLoginSuccess,
    showLogoutSuccess
  }
}
