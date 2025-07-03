// Utility functions for formatting and common operations

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('vi-VN')
}

export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Assume it's a relative path from the API server
  return `http://127.0.0.1:8000/${imagePath}`
}

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export const getCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    'vali': 'Vali',
    'balo': 'Balo',
    'tui-du-lich': 'Túi Du Lịch',
    'tui-xach': 'Túi Xách',
    'phu-kien': 'Phụ Kiện',
    'travel-backpacks': 'Balo Du Lịch',
    'business-bags': 'Túi Công Sở',
    'suitcases': 'Vali Kéo',
    'accessories': 'Phụ Kiện'
  }
  return categoryNames[category] || category
}

export const getColorCode = (color: string): string => {
  const colorCodes: { [key: string]: string } = {
    'red': '#dc3545',
    'blue': '#0d6efd',
    'gray': '#6c757d',
    'grey': '#6c757d',
    'black': '#000000',
    'navy': '#001f3f',
    'mint': '#20c997',
    'pink': '#e83e8c',
    'white': '#ffffff',
    'green': '#198754',
    'orange': '#fd7e14',
    'silver': '#c0c0c0',
    'yellow': '#ffc107',
    'purple': '#6f42c1',
    'brown': '#795548'
  }
  return colorCodes[color.toLowerCase()] || color
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + '...'
}

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Storage utilities
export const storage = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },
  
  get: <T>(key: string, defaultValue: T = null as T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// Validation utilities
export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/
    return phoneRegex.test(phone.replace(/[^\d]/g, ''))
  },
  
  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== ''
  },
  
  minLength: (value: string, length: number): boolean => {
    return (value && value.length >= length) || value === ''
  },
  
  maxLength: (value: string, length: number): boolean => {
    return !value || value.length <= length
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  // Vietnamese phone number regex
  const phoneRegex = /^(\+84|84|0)?([3|5|7|8|9])+([0-9]{8})$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Date utilities
export const dateHelpers = {
  isToday: (date: string | Date): boolean => {
    const today = new Date()
    const checkDate = typeof date === 'string' ? new Date(date) : date
    return checkDate.toDateString() === today.toDateString()
  },
  
  isThisWeek: (date: string | Date): boolean => {
    const today = new Date()
    const checkDate = typeof date === 'string' ? new Date(date) : date
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return checkDate >= weekAgo && checkDate <= today
  },
  
  timeAgo: (date: string | Date): string => {
    const now = new Date()
    const checkDate = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - checkDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Vừa xong'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`
    return `${Math.floor(diffInSeconds / 31536000)} năm trước`
  }
}

// URL utilities
export const urlHelpers = {
  getQueryParam: (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  },
  
  setQueryParam: (param: string, value: string): void => {
    const url = new URL(window.location.href)
    url.searchParams.set(param, value)
    window.history.replaceState({}, '', url.toString())
  },
  
  removeQueryParam: (param: string): void => {
    const url = new URL(window.location.href)
    url.searchParams.delete(param)
    window.history.replaceState({}, '', url.toString())
  }
}

// Re-export error handler utilities
export * from './errorHandler'
