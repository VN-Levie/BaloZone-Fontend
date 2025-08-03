import type { News } from '@/types'

/**
 * Utilities for News management
 */

// Constants
export const NEWS_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

export const NEWS_SORT_OPTIONS = [
  { value: 'created_at_desc', text: 'Mới nhất' },
  { value: 'created_at_asc', text: 'Cũ nhất' },
  { value: 'title_asc', text: 'Tiêu đề A-Z' },
  { value: 'title_desc', text: 'Tiêu đề Z-A' },
  { value: 'view_count_desc', text: 'Lượt xem cao nhất' }
]

// Helper functions
export const formatDate = (dateString: string, format: 'short' | 'long' | 'time' = 'short'): string => {
  const date = new Date(dateString)

  if (format === 'long') {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (format === 'time') {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return date.toLocaleDateString('vi-VN')
}

export const formatRelativeTime = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`
  } else if (diffInDays < 30) {
    return `${diffInDays} ngày trước`
  } else {
    return formatDate(dateString)
  }
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const getStatusBadgeVariant = (status?: string): string => {
  switch (status) {
    case NEWS_STATUS.PUBLISHED:
      return 'success'
    case NEWS_STATUS.DRAFT:
      return 'warning'
    case NEWS_STATUS.ARCHIVED:
      return 'secondary'
    default:
      return 'primary'
  }
}

export const getStatusText = (status?: string): string => {
  switch (status) {
    case NEWS_STATUS.PUBLISHED:
      return 'Đã xuất bản'
    case NEWS_STATUS.DRAFT:
      return 'Bản nháp'
    case NEWS_STATUS.ARCHIVED:
      return 'Đã lưu trữ'
    default:
      return 'Không xác định'
  }
}

export const validateImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200 // Average reading speed
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export const sortNews = (news: News[], sortBy: string): News[] => {
  const [field, order] = sortBy.split('_')

  return [...news].sort((a, b) => {
    let aValue: any = a[field as keyof News]
    let bValue: any = b[field as keyof News]

    // Handle date fields
    if (field === 'created_at' || field === 'updated_at') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    // Handle numeric fields
    if (field === 'view_count') {
      aValue = Number(aValue) || 0
      bValue = Number(bValue) || 0
    }

    // Handle string fields
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (order === 'desc') {
      return bValue > aValue ? 1 : -1
    } else {
      return aValue > bValue ? 1 : -1
    }
  })
}

export const filterNews = (news: News[], filters: {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}): News[] => {
  return news.filter(item => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const matchesTitle = item.title.toLowerCase().includes(searchTerm)
      const matchesDescription = item.description.toLowerCase().includes(searchTerm)
      if (!matchesTitle && !matchesDescription) return false
    }

    // Status filter
    if (filters.status && item.status !== filters.status) {
      return false
    }

    // Date range filter
    if (filters.dateFrom) {
      const itemDate = new Date(item.created_at)
      const fromDate = new Date(filters.dateFrom)
      if (itemDate < fromDate) return false
    }

    if (filters.dateTo) {
      const itemDate = new Date(item.created_at)
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      if (itemDate > toDate) return false
    }

    return true
  })
}

// Export all utilities as a single object
export const newsUtils = {
  formatDate,
  formatRelativeTime,
  truncateText,
  getStatusBadgeVariant,
  getStatusText,
  validateImageUrl,
  generateSlug,
  calculateReadTime,
  sortNews,
  filterNews
}
