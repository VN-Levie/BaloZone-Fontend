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
  let timeout: NodeJS.Timeout | null = null
  
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
