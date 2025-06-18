// Types definitions for BaloZone API

export interface Product {
  id: number
  category_id: number
  brand_id?: number
  name: string
  description?: string
  price: number
  quantity: number
  image?: string
  slug: string
  color?: string
  created_at: string
  updated_at: string
  category?: Category
  brand?: Brand
  comments?: Comment[]
}

export interface Category {
  id: number
  name: string
  slug: string
  image?: string
  products_count?: number
  products?: Product[]
}

export interface Brand {
  id: number
  name: string
  slug: string
  logo?: string
  description?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Comment {
  id: number
  product_id: number
  user_id: number
  comment: string
  created_at: string
  updated_at: string
  user?: User
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'user'
}

export interface News {
  id: number
  title: string
  content: string
  image?: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Voucher {
  id: number
  code: string
  discount: number
  min_order_value?: number
  max_discount?: number
  start_date: string
  end_date: string
  usage_limit?: number
  used_count: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export interface AuthResponse {
  message: string
  user: User
  access_token: string
  token_type: string
}

// Filter types
export interface ProductFilters {
  search?: string
  category_id?: number
  brand_id?: number
  min_price?: number
  max_price?: number
  sort_by?: 'name' | 'price' | 'created_at'
  sort_order?: 'asc' | 'desc'
  per_page?: number
}
