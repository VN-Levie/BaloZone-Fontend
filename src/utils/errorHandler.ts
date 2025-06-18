/**
 * Utility functions for handling API errors and displaying user-friendly messages
 */

export interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
  status?: number
}

/**
 * Parse and format API error messages for user display
 */
export const parseApiError = (error: any): string => {
  console.error('API Error:', error)
  
  // Default error message
  let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
  
  if (!error?.message) {
    return errorMessage
  }
  
  try {
    // Try to parse JSON error response from the error message
    const errorText = error.message
    let errorData: ApiErrorResponse = {}
    
    // Check if error message contains JSON
    if (errorText.includes('{') && errorText.includes('}')) {
      const jsonStart = errorText.indexOf('{')
      const jsonString = errorText.substring(jsonStart)
      errorData = JSON.parse(jsonString)
    } else if (errorText.includes('HTTP')) {
      // Handle HTTP status codes
      const statusMatch = errorText.match(/HTTP (\d+)/)
      if (statusMatch) {
        const status = parseInt(statusMatch[1])
        switch (status) {
          case 400:
            return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin.'
          case 401:
            return 'Thông tin đăng nhập không chính xác.'
          case 403:
            return 'Bạn không có quyền thực hiện hành động này.'
          case 404:
            return 'Không tìm thấy tài nguyên yêu cầu.'
          case 422:
            return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
          case 429:
            return 'Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau.'
          case 500:
            return 'Lỗi server. Vui lòng thử lại sau.'
          case 503:
            return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.'
          default:
            return `Lỗi server (${status}). Vui lòng thử lại sau.`
        }
      }
    }
    
    // Handle specific error messages
    if (errorData.message) {
      switch (errorData.message.toLowerCase()) {
        case 'invalid credentials':
        case 'email hoặc mật khẩu không đúng':
          return 'Email hoặc mật khẩu không chính xác.'
        
        case 'user not found':
          return 'Không tìm thấy tài khoản với email này.'
        
        case 'email already exists':
        case 'the email has already been taken.':
          return 'Email này đã được sử dụng. Vui lòng chọn email khác.'
        
        case 'account is inactive':
          return 'Tài khoản của bạn đã bị vô hiệu hóa.'
        
        case 'email not verified':
          return 'Vui lòng xác thực email trước khi đăng nhập.'
        
        case 'password too weak':
          return 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.'
        
        case 'invalid email format':
          return 'Định dạng email không hợp lệ.'
        
        case 'validation failed':
          return 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.'
        
        default:
          return errorData.message
      }
    }
    
    // Handle validation errors
    if (errorData.errors) {
      const validationErrors: string[] = []
      
      Object.entries(errorData.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          const fieldName = translateFieldName(field)
          validationErrors.push(`${fieldName}: ${messages[0]}`)
        }
      })
      
      if (validationErrors.length > 0) {
        return validationErrors.join('. ')
      }
    }
    
  } catch (parseError) {
    console.error('Error parsing API error:', parseError)
    
    // Fallback to checking for common patterns in error message
    const errorText = error.message.toLowerCase()
    
    if (errorText.includes('network') || errorText.includes('fetch')) {
      return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
    }
    
    if (errorText.includes('timeout')) {
      return 'Kết nối bị timeout. Vui lòng thử lại.'
    }
    
    if (errorText.includes('cors')) {
      return 'Lỗi CORS. Vui lòng liên hệ quản trị viên.'
    }
  }
  
  return errorMessage
}

/**
 * Translate field names from English to Vietnamese
 */
const translateFieldName = (field: string): string => {
  const translations: Record<string, string> = {
    email: 'Email',
    password: 'Mật khẩu',
    name: 'Tên',
    phone: 'Số điện thoại',
    address: 'Địa chỉ',
    title: 'Tiêu đề',
    content: 'Nội dung',
    description: 'Mô tả',
    price: 'Giá',
    quantity: 'Số lượng',
    category: 'Danh mục',
    brand: 'Thương hiệu'
  }
  
  return translations[field.toLowerCase()] || field
}

/**
 * Get user-friendly error message for authentication errors
 */
export const parseAuthError = (error: any): string => {
  const message = parseApiError(error)
  
  // Add specific context for auth errors
  if (message.includes('không chính xác') || message.includes('invalid credentials')) {
    return 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.'
  }
  
  if (message.includes('email') && message.includes('đã được sử dụng')) {
    return 'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.'
  }
  
  return message
}

/**
 * Get user-friendly error message for product/cart errors
 */
export const parseProductError = (error: any): string => {
  const message = parseApiError(error)
  
  if (message.includes('not found') || message.includes('không tìm thấy')) {
    return 'Không tìm thấy sản phẩm. Sản phẩm có thể đã bị xóa.'
  }
  
  if (message.includes('out of stock') || message.includes('hết hàng')) {
    return 'Sản phẩm đã hết hàng. Vui lòng chọn sản phẩm khác.'
  }
  
  if (message.includes('quantity') || message.includes('số lượng')) {
    return 'Số lượng sản phẩm không hợp lệ hoặc vượt quá tồn kho.'
  }
  
  return message
}

/**
 * Get user-friendly error message for order errors
 */
export const parseOrderError = (error: any): string => {
  const message = parseApiError(error)
  
  if (message.includes('payment') || message.includes('thanh toán')) {
    return 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'
  }
  
  if (message.includes('address') || message.includes('địa chỉ')) {
    return 'Thông tin địa chỉ không hợp lệ. Vui lòng kiểm tra lại.'
  }
  
  return message
}
