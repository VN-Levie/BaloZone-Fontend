/**
 * Demo và test các hàm xử lý lỗi
 */

import { parseApiError } from '@/utils/errorHandler'

// Test cases for error handling
export const errorTestCases = [
  {
    name: 'Too few arguments error',
    error: {
      status: 500,
      message: 'Too few arguments provided to function',
      data: {}
    },
    expected: 'Thiếu thông tin bắt buộc. Vui lòng điền đầy đủ các trường.'
  },
  {
    name: 'Validation error with fields',
    error: {
      status: 422,
      message: 'Validation failed',
      errors: {
        name: ['Tên thương hiệu là bắt buộc'],
        slug: ['Đường dẫn đã tồn tại']
      }
    },
    expected: 'Tên: Tên thương hiệu là bắt buộc. Đường dẫn: Đường dẫn đã tồn tại'
  },
  {
    name: 'Network error',
    error: {
      message: 'Network error occurred'
    },
    expected: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
  },
  {
    name: 'File too large',
    error: {
      status: 413,
      message: 'File too large'
    },
    expected: 'File quá lớn. Vui lòng chọn file nhỏ hơn.'
  },
  {
    name: 'Unauthorized access',
    error: {
      status: 403,
      message: 'Unauthorized'
    },
    expected: 'Bạn không có quyền thực hiện hành động này.'
  }
]

export const runErrorTests = () => {
  console.log('🧪 Running Error Handler Tests...\n')
  
  errorTestCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`)
    console.log('Input:', testCase.error)
    
    const result = parseApiError(testCase.error)
    console.log('Output:', result)
    console.log('Expected:', testCase.expected)
    console.log('✅ Pass:', result.includes(testCase.expected.split('.')[0]))
    console.log('---')
  })
  
  console.log('🎉 Error Handler Tests Completed!')
}

// Usage example in a Vue component:
/*
// In a component script:
import { parseApiError } from '@/utils/errorHandler'
import { useToast } from '@/composables/useToast'

const { showError } = useToast()

try {
  // API call that might fail
  await adminBrandsApi.createBrand(data)
} catch (error) {
  const friendlyMessage = parseApiError(error)
  showError('Lỗi', friendlyMessage)
}
*/
