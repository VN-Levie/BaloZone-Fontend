/**
 * Utility functions for handling API errors and displaying user-friendly messages
 */

export interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
  status?: number
}

/**
 * Translate field names from English to Vietnamese
 */
const translateFieldName = (field: string): string => {
  const translations: Record<string, string> = {
    email: 'Email',
    password: 'Mật khẩu',
    password_confirmation: 'Xác nhận mật khẩu',
    name: 'Tên',
    phone: 'Số điện thoại',
    address: 'Địa chỉ',
    title: 'Tiêu đề',
    content: 'Nội dung',
    description: 'Mô tả',
    price: 'Giá',
    quantity: 'Số lượng',
    category: 'Danh mục',
    brand: 'Thương hiệu',
    slug: 'Đường dẫn',
    image: 'Hình ảnh',
    logo: 'Logo',
    stock: 'Tồn kho',
    color: 'Màu sắc',
    status: 'Trạng thái',
    category_id: 'Danh mục',
    brand_id: 'Thương hiệu',
    discount_price: 'Giá khuyến mãi'
  }
  
  return translations[field.toLowerCase()] || field
}

/**
 * Parse specific error messages and return user-friendly Vietnamese messages
 */
const parseSpecificErrorMessage = (message: string): string | null => {
  if (!message) return null
  
  const lowerMessage = message.toLowerCase()
  
  // Authentication errors
  if (lowerMessage.includes('invalid credentials') || 
      lowerMessage.includes('email hoặc mật khẩu không đúng')) {
    return 'Email hoặc mật khẩu không chính xác.'
  }
  
  if (lowerMessage.includes('user not found')) {
    return 'Không tìm thấy tài khoản với email này.'
  }
  
  if (lowerMessage.includes('email already exists') || 
      lowerMessage.includes('the email has already been taken')) {
    return 'Email này đã được sử dụng. Vui lòng chọn email khác.'
  }

  // Registration validation errors
  if (lowerMessage.includes('password confirmation') ||
      lowerMessage.includes('password field confirmation does not match')) {
    return 'Mật khẩu xác nhận không khớp.'
  }

  if (lowerMessage.includes('password') && lowerMessage.includes('min:6')) {
    return 'Mật khẩu phải có ít nhất 6 ký tự.'
  }

  if (lowerMessage.includes('email') && lowerMessage.includes('valid')) {
    return 'Email không hợp lệ.'
  }

  if (lowerMessage.includes('name') && lowerMessage.includes('required')) {
    return 'Họ và tên là bắt buộc.'
  }
  
  // Brand/Category/Product specific errors
  if (lowerMessage.includes('too few arguments') || 
      lowerMessage.includes('argumentcounterror') ||
      lowerMessage.includes('missing required parameter')) {
    return 'Thiếu thông tin bắt buộc. Vui lòng điền đầy đủ các trường.'
  }
  
  if (lowerMessage.includes('slug already exists') || 
      lowerMessage.includes('name already exists') ||
      lowerMessage.includes('the name has already been taken') ||
      lowerMessage.includes('the slug has already been taken')) {
    return 'Tên hoặc đường dẫn đã tồn tại. Vui lòng chọn tên khác.'
  }
  
  if (lowerMessage.includes('not found') || 
      lowerMessage.includes('no query results')) {
    return 'Không tìm thấy dữ liệu yêu cầu.'
  }
  
  if (lowerMessage.includes('permission denied') || 
      lowerMessage.includes('unauthorized') ||
      lowerMessage.includes('access denied')) {
    return 'Bạn không có quyền thực hiện hành động này.'
  }
  
  // Database constraint errors
  if (lowerMessage.includes('foreign key constraint') ||
      lowerMessage.includes('integrity constraint violation')) {
    return 'Không thể thực hiện thao tác do ràng buộc dữ liệu.'
  }
  
  if (lowerMessage.includes('duplicate entry') ||
      lowerMessage.includes('unique constraint')) {
    return 'Dữ liệu đã tồn tại. Vui lòng kiểm tra lại.'
  }
  
  // File upload errors
  if (lowerMessage.includes('file too large') || 
      lowerMessage.includes('max file size') ||
      lowerMessage.includes('413')) {
    return 'File quá lớn. Vui lòng chọn file nhỏ hơn.'
  }
  
  if (lowerMessage.includes('invalid file type') || 
      lowerMessage.includes('unsupported file') ||
      lowerMessage.includes('file format not supported')) {
    return 'Định dạng file không được hỗ trợ.'
  }
  
  // Server errors
  if (lowerMessage.includes('internal server error') ||
      lowerMessage.includes('500')) {
    return 'Lỗi server nội bộ. Vui lòng thử lại sau.'
  }
  
  if (lowerMessage.includes('service unavailable') ||
      lowerMessage.includes('503')) {
    return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.'
  }
  
  // Network errors
  if (lowerMessage.includes('network') || 
      lowerMessage.includes('fetch') ||
      lowerMessage.includes('connection')) {
    return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
  }
  
  if (lowerMessage.includes('timeout')) {
    return 'Kết nối bị timeout. Vui lòng thử lại.'
  }
  
  // Laravel specific errors
  if (lowerMessage.includes('the given data was invalid') ||
      lowerMessage.includes('validation failed')) {
    return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
  }
  
  // Try to extract JSON from error message and parse it
  try {
    if (message.includes('{') && message.includes('}')) {
      const jsonStart = message.indexOf('{')
      const jsonString = message.substring(jsonStart)
      const errorData = JSON.parse(jsonString)
      
      if (errorData.message) {
        return parseSpecificErrorMessage(errorData.message)
      }
    }
  } catch (parseError) {
    // Ignore JSON parse errors
  }
  
  return null
}

/**
 * Parse and format API error messages for user display
 */
export const parseApiError = (error: any): string => {
  console.error('API Error:', error)
  
  // Default error message
  let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
  
  if (!error) {
    return errorMessage
  }

  // Handle structured API error objects
  if (error.status && error.message) {
    // Handle HTTP status codes
    switch (error.status) {
      case 400:
        return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin.'
      case 401:
        return 'Thông tin đăng nhập không chính xác.'
      case 403:
        return 'Bạn không có quyền thực hiện hành động này.'
      case 404:
        return 'Không tìm thấy tài nguyên yêu cầu.'
      case 422:
        // Handle validation errors
        if (error.errors && Object.keys(error.errors).length > 0) {
          const validationErrors: string[] = []
          Object.entries(error.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              const fieldName = translateFieldName(field)
              validationErrors.push(`${fieldName}: ${messages[0]}`)
            }
          })
          if (validationErrors.length > 0) {
            return validationErrors.join('. ')
          }
        }
        return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
      case 429:
        return 'Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau.'
      case 500:
        return 'Lỗi server. Vui lòng thử lại sau.'
      case 503:
        return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.'
      default:
        // Try to parse specific error messages
        return parseSpecificErrorMessage(error.message) || `Lỗi server (${error.status}). Vui lòng thử lại sau.`
    }
  }

  // Handle legacy Error objects
  if (error?.message) {
    return parseSpecificErrorMessage(error.message) || errorMessage
  }
  
  return errorMessage
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
