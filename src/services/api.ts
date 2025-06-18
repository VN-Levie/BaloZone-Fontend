import type { 
  ApiResponse, 
  PaginatedResponse, 
  Product, 
  Category, 
  Brand, 
  News, 
  Voucher,
  ProductFilters,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Order,
  Comment,
  CategoryWithProductsResponse
} from '@/types'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Utility function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

// Utility function to make authenticated requests
const makeRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }
  
  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

// Products API
export const productsApi = {
  // Get all products with filters
  getProducts: (filters?: ProductFilters): Promise<PaginatedResponse<Product>> =>
    makeRequest('/products' + (filters ? '?' + new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString() : '')),
  
  // Get featured products
  getFeaturedProducts: (): Promise<ApiResponse<Product[]>> =>
    makeRequest('/products-featured'),
  
  // Get single product
  getProduct: (id: number): Promise<ApiResponse<Product>> =>
    makeRequest(`/products/${id}`),
  
  // Get products by category slug
  getProductsByCategory: (categorySlug: string): Promise<PaginatedResponse<Product>> =>
    makeRequest(`/products/category/${categorySlug}`),

  // Get products by brand slug
  getProductsByBrand: (brandSlug: string): Promise<PaginatedResponse<Product>> =>
    makeRequest(`/products/brand/${brandSlug}`),

  // Search products
  searchProducts: (query: string): Promise<PaginatedResponse<Product>> =>
    makeRequest(`/products-search?q=${query}`),

  // Get on-sale products
  getOnSaleProducts: (): Promise<ApiResponse<Product[]>> =>
    makeRequest('/products-on-sale'),
  
  // Get sale campaigns for a product
  getProductSaleCampaigns: (productId: number): Promise<ApiResponse<any[]>> =>
    makeRequest(`/products/${productId}/sale-campaigns`),
}

// Categories API
export const categoriesApi = {
  // Get all categories
  getCategories: (): Promise<PaginatedResponse<Category>> =>
    makeRequest('/categories'),
  
  // Get categories with products (for homepage)
  getCategoriesWithProducts: (): Promise<ApiResponse<Category[]>> =>
    makeRequest('/categories-with-products'),
  
  // Get single category
  getCategory: (id: number): Promise<ApiResponse<Category>> =>
    makeRequest(`/categories/${id}`),

  // Get single category by slug
  getCategoryBySlug: (slug: string): Promise<CategoryWithProductsResponse> =>
    makeRequest(`/categories/slug/${slug}`),
}

// Brands API
export const brandsApi = {
  // Get all brands
  getBrands: (): Promise<PaginatedResponse<Brand>> => makeRequest('/brands'),

  // Get active brands
  getActiveBrands: (): Promise<ApiResponse<Brand[]>> => makeRequest('/brands-active'),
}

// Auth API
export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (data: RegisterData): Promise<AuthResponse> =>
    makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: (): Promise<ApiResponse<any>> =>
    makeRequest('/auth/logout', { method: 'POST' }),
  refresh: (): Promise<AuthResponse> =>
    makeRequest('/auth/refresh', { method: 'POST' }),
  getMe: (): Promise<ApiResponse<User>> => makeRequest('/auth/me'),
}

// Order API
export const ordersApi = {
  // Get all orders for the current user with optional filters
  getOrders: (params?: {
    page?: number
    status?: string
    days?: number
  }): Promise<PaginatedResponse<Order>> => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString() : ''
    return makeRequest(`/orders${queryString}`)
  },

  // Get a single order
  getOrder: (id: number): Promise<ApiResponse<Order>> => makeRequest(`/orders/${id}`),

  // Create a new order
  createOrder: (orderData: any): Promise<ApiResponse<Order>> =>
    makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // Cancel an order
  cancelOrder: (id: number): Promise<ApiResponse<any>> =>
    makeRequest(`/orders/${id}/cancel`, { method: 'POST' }),
  
  // Get order stats
  getOrderStats: (): Promise<ApiResponse<any>> => makeRequest('/orders-stats'),
}

// User API
export const userApi = {
  // Get user profile
  getProfile: (): Promise<ApiResponse<User>> => makeRequest('/profile'),

  // Update user profile
  updateProfile: (profileData: Partial<User>): Promise<ApiResponse<User>> =>
    makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Change password
  changePassword: (passwordData: any): Promise<ApiResponse<any>> =>
    makeRequest('/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    }),
  
  // Get user stats
  getUserStats: (): Promise<ApiResponse<any>> => makeRequest('/user-stats'),

  // Delete account
  deleteAccount: (): Promise<ApiResponse<any>> =>
    makeRequest('/delete-account', { method: 'DELETE' }),
}

// Address Book API
export const addressBookApi = {
  // Get all addresses
  getAddresses: (): Promise<ApiResponse<any[]>> => makeRequest('/address-books'),

  // Create a new address
  createAddress: (addressData: any): Promise<ApiResponse<any>> =>
    makeRequest('/address-books', {
      method: 'POST',
      body: JSON.stringify(addressData),
    }),

  // Update an address
  updateAddress: (id: number, addressData: any): Promise<ApiResponse<any>> =>
    makeRequest(`/address-books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    }),

  // Delete an address
  deleteAddress: (id: number): Promise<ApiResponse<any>> =>
    makeRequest(`/address-books/${id}`, { method: 'DELETE' }),
}

// News API
export const newsApi = {
  // Get all news with optional filters
  getNews: (params?: {
    page?: number
    per_page?: number
    search?: string
    category?: string
    exclude?: number
  }): Promise<PaginatedResponse<News>> => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString() : ''
    return makeRequest(`/news${queryString}`)
  },

  // Get latest news
  getLatestNews: (): Promise<ApiResponse<News[]>> => makeRequest('/news-latest'),

  // Get single news item by ID
  getNewsById: (id: number): Promise<ApiResponse<News>> => makeRequest(`/news/${id}`),

  // Get news categories
  getCategories: (): Promise<string[]> => makeRequest('/news-categories'),

  // Subscribe to newsletter (if endpoint exists)
  subscribeNewsletter: (email: string): Promise<ApiResponse<any>> =>
    makeRequest('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
}

// Vouchers API
export const vouchersApi = {
  // Get active vouchers
  getActiveVouchers: (): Promise<ApiResponse<Voucher[]>> =>
    makeRequest('/vouchers-active'),

  // Validate a voucher code
  validateVoucher: (code: string): Promise<ApiResponse<any>> =>
    makeRequest('/vouchers/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
}

// Comments API
export const commentsApi = {
  // Get comments for a product
  getProductComments: (productId: number): Promise<PaginatedResponse<Comment>> =>
    makeRequest(`/comments/product/${productId}`),

  // Create a new comment
  createComment: (commentData: any): Promise<ApiResponse<Comment>> =>
    makeRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),
  
  // Get comments by current user
  getMyComments: (): Promise<PaginatedResponse<Comment>> =>
    makeRequest('/my-comments'),
}

// Contact API
export const contactApi = {
  // Send a contact message
  submitContact: (contactData: any): Promise<ApiResponse<any>> =>
    makeRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),
}

// Sale Campaigns API
export const saleCampaignsApi = {
  // Get active sale campaigns
  getActiveSaleCampaigns: (): Promise<ApiResponse<any[]>> =>
    makeRequest('/sale-campaigns-active'),

  // Get featured sale campaigns
  getFeaturedSaleCampaigns: (): Promise<ApiResponse<any[]>> =>
    makeRequest('/sale-campaigns-featured'),

  // Get products in a sale campaign
  getSaleCampaignProducts: (id: number): Promise<PaginatedResponse<Product>> =>
    makeRequest(`/sale-campaigns/${id}/products`),
}
