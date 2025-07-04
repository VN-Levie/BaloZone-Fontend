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

export interface Role {
  id: number
  name: string
  display_name: string
  description: string
  created_at: string
  updated_at: string
  pivot?: {
    user_id: number
    role_id: number
  }
  users_count?: number
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string | null
  phone?: string
  address?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  roles?: Role[]
  // Legacy support
  role?: 'admin' | 'user'
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
  price: number | string
  end_at: string
  quantity: number
  created_at: string
  updated_at: string
}

export interface Address {
  id: number
  user_id: number
  name: string // recipient_name in API
  phone: string
  address: string // street_address in API  
  ward: string
  district: string
  province: string // state_province in API
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: number
  name: string
  display_name: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface OrderDetail {
  id: number
  order_id: number
  product_id: number
  price: number
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Order {
  id: number
  user_id: number
  address_id: number
  payment_method_id: number
  voucher_id?: number
  comment?: string
  total_price: number
  payment_status: 'pending' | 'paid' | 'failed' // Updated to match API
  created_at: string
  updated_at: string
  user?: User
  address?: Address
  payment_method?: PaymentMethod
  voucher?: Voucher
  order_details?: OrderDetail[]
}

export interface CreateOrderRequest {
  address_id: number
  payment_method_id: number
  voucher_id?: number
  comment?: string
  items: {
    product_id: number
    quantity: number
  }[]
}

// Legacy types - keep for backward compatibility
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
  slug: string
  description: string
  discount_percentage: number
  start_date: string
  end_date: string
  banner_image?: string
  status: 'active' | 'inactive' | 'scheduled'
  is_featured: boolean
  priority: number
  products_count?: number
  created_at: string
  updated_at: string
  sale_products?: SaleProduct[]
}

export interface SaleProduct {
  id: number
  product_id: number
  sale_campaign_id: number
  original_price: number
  sale_price: number
  discount_percentage: number
  max_quantity?: number
  created_at: string
  updated_at: string
  product?: Product
  sale_campaign?: SaleCampaign
}

export interface ProductWithSale extends Product {
  current_sale?: SaleProduct & {
    sale_campaign: Pick<SaleCampaign, 'id' | 'name' | 'end_date'>
  }
}

export interface Contact {
  id: number
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status?: 'pending' | 'read' | 'replied'
  created_at: string
  updated_at: string
}

export interface UserStats {
  total_orders: number
  total_spent: number
  pending_orders: number
  completed_orders: number
  cancelled_orders: number
  favourite_products: number
  recent_activity: any[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
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
  data: {
    access_token: string
    token_type: string
    expires_in: number
    user: User
  }
  // Legacy support for older API format
  authorization?: {
    token: string
    type: string
    expires_in: number
  }
}

export interface RolesResponse {
  success: boolean
  data: Role[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}

// Comments interfaces
export interface Comment {
  id: number
  user_id: number
  product_id: number
  content: string
  rating: number
  author: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  created_at: string
  updated_at: string
}

export interface CommentRequest {
  content: string
  rating: number
}

export interface CommentsResponse {
  current_page: number
  data: Comment[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// Dashboard Types
export interface DashboardOverview {
  total_users: number
  total_orders: number
  total_products: number
  total_contacts: number
  total_revenue: string
  monthly_revenue: string
  new_users_this_month: number
  orders_this_month: number
}

export interface OrderStats {
  shipped: number
  delivered: number
  pending: number
  processing: number
  cancelled: number
}

export interface ContactStats {
  resolved: number
  pending: number
}

export interface TopProduct {
  id: number
  name: string
  total_sold: string
  price?: string
  total_revenue?: string
}

export interface ChartDataPoint {
  date: string
  revenue: number | string
  orders?: number
}

export interface DashboardStats {
  overview: DashboardOverview
  order_stats: OrderStats
  contact_stats: ContactStats
  top_products: TopProduct[]
  revenue_chart: ChartDataPoint[]
  order_chart: ChartDataPoint[]
}

export interface MonthlyRevenueData {
  month: number
  month_name: string
  revenue: number | string
  order_count: number
}

export interface DashboardRevenue {
  year: number
  monthly_data: MonthlyRevenueData[]
}

export interface UsersByStatus {
  active: number
  inactive: number
}

export interface DashboardUsers {
  total_users: number
  new_users_this_week: number
  new_users_this_month: number
  users_by_status: UsersByStatus
}

export interface LowStockProduct {
  id: number
  name: string
  stock: number
  price: string
}

export interface ProductsByCategory {
  category_name: string
  product_count: number
}

export interface ProductsByBrand {
  brand_name: string
  product_count: number
}

export interface DashboardProducts {
  top_selling_products: TopProduct[]
  low_stock_products: LowStockProduct[]
  out_of_stock_products: LowStockProduct[]
  products_by_category: ProductsByCategory[]
  products_by_brand: ProductsByBrand[]
}

// Admin Product Management Types
export interface CreateProductRequest {
  category_id: number
  brand_id?: number
  name: string
  slug: string
  description?: string
  price: number
  discount_price?: number
  stock: number
  color?: string
  // Note: image and gallery are now handled as files in the API call
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number
}

export interface AdminProduct extends Product {
  gallery: string[]
  color?: string
  stock: number
  discount_price?: number
}

export interface AdminProductResponse {
  success: boolean
  message: string
  data: AdminProduct
}

export interface AdminProductsListResponse {
  success: boolean
  data: {
    data: AdminProduct[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    first_page_url: string
    from: number
    last_page_url: string
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    next_page_url: string | null
    path: string
    prev_page_url: string | null
    to: number
  }
}
