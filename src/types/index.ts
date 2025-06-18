// Types definitions for BaloZone API

export interface Product {
  id: number
  category_id: number
  brand_id?: number
  name: string
  description?: string
  price: number
  originalPrice: number
  quantity: number
  image?: string
  slug: string
  created_at: string
  updated_at: string
  category?: Category
  brand?: Brand
  comments?: Comment[]
  discount?: number
  rating?: number
  reviews?: number
  sold?: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  products_count: number
  created_at: string
  updated_at: string
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
  description: string
  thumbnail: string
  content?: string
  slug?: string
  category?: string
  author?: string
  read_time?: number
  views?: number
  tags?: string[]
  excerpt?: string
  image_url?: string
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

export interface Order {
  id: number
  user_id: number
  total_price: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  user?: User
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}

export interface AddressBook {
  id: number
  user_id: number
  address: string
  city: string
  postal_code: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface SaleCampaign {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  discount_percentage: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Contact {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  updated_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

// Special response type for category with products endpoint
export interface CategoryWithProductsResponse {
  category: Category
  products: PaginatedResponse<Product>
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
  to: number
  total: number
}

export interface ProductFilters {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  brand?: string
  category?: string
  price_min?: number
  price_max?: number
  search?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user: User
  authorization: {
    token: string
    type: string
    expires_in: number
  }
  // Legacy support for older API format
  access_token?: string
  token_type?: string
  expires_in?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}
