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
  CommentsResponse,
  CommentRequest,
  CategoryWithProductsResponse,
  CreateOrderRequest,
  Address,
  PaymentMethod,
  Role,
  RolesResponse,
  DashboardStats,
  DashboardRevenue,
  DashboardUsers,
  DashboardProducts,
  CreateProductRequest,
  UpdateProductRequest,
  AdminProduct,
  AdminProductResponse,
  AdminProductsListResponse,
  ContactAdmin,
  ContactAdminListResponse
} from '@/types'

const API_BASE_URL = 'http://localhost:8000/api'

// Token refresh state
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

// Utility function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

// Utility function to save tokens (chỉ cần lưu auth token theo API documentation)
const saveTokens = (authToken: string): void => {
  localStorage.setItem('auth_token', authToken)
  // Lưu thời gian hết hạn (1 giờ từ bây giờ)
  const expiryTime = Date.now() + (3600 * 1000) // 3600 seconds = 1 hour
  localStorage.setItem('token_expiry', expiryTime.toString())
}

// Utility function to clear tokens
const clearTokens = (): void => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('token_expiry')
}

// Check if token is expired or about to expire (within 5 minutes)
const isTokenExpiring = (): boolean => {
  const expiryTime = localStorage.getItem('token_expiry')
  if (!expiryTime) return true

  const expiry = parseInt(expiryTime)
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds

  return (expiry - now) <= fiveMinutes
}

// Utility function to refresh token
const refreshAuthToken = async (): Promise<string | null> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const currentToken = getAuthToken()
      if (!currentToken) {
        throw new Error('No auth token available')
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()

      // Theo API documentation, token mới nằm trong authorization.token
      if (data.success && data.authorization?.token) {
        const newToken = data.authorization.token
        saveTokens(newToken)
        return newToken
      }

      throw new Error('No token received from refresh')
    } catch (error) {
      console.error('Token refresh error:', error)
      clearTokens()

      // Dispatch custom event for auth failure
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:expired'))
      }

      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// Utility function to make authenticated requests with auto token refresh
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> => {
  const MAX_RETRIES = 2 // Tối đa 2 lần retry
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()

  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
  }

  // Only add Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json'
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

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401 && retryCount < MAX_RETRIES) {
      // Don't retry if it's the auth endpoints to avoid infinite loops
      const isAuthEndpoint = endpoint.includes('/auth/') || endpoint.includes('/login') || endpoint.includes('/register')

      if (!isAuthEndpoint) {
        console.log(`Token expired, attempting to refresh... (retry ${retryCount + 1}/${MAX_RETRIES})`)
        const newToken = await refreshAuthToken()

        if (newToken) {
          // Retry the request with new token
          return makeRequest<T>(endpoint, options, retryCount + 1)
        } else {
          // Token refresh failed, clear tokens and dispatch auth:expired event
          clearTokens()
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:expired'))
          }
        }
      }
    }

    if (!response.ok) {
      let errorData: any = {}
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: await response.text() }
      }

      // Create a structured error object
      const apiError = {
        status: response.status,
        message: errorData.message || `HTTP ${response.status}`,
        errors: errorData.errors || {},
        data: errorData
      }

      throw apiError
    }

    const data = await response.json()
    return data
  } catch (error) {
    // If we've exhausted retries or it's not a retry-able error, throw it
    if (retryCount >= MAX_RETRIES || (typeof error === 'object' && error !== null && 'status' in error)) {
      console.error(`API request failed for ${endpoint} after ${retryCount} retries:`, error)
    } else {
      console.error(`API request failed for ${endpoint}:`, error)
    }
    throw error
  }
}

// Products API
export const productsApi = {
  // Get all products with advanced filtering (NEW UNIFIED ENDPOINT)
  getProducts: (filters?: {
    search?: string
    category_id?: number
    brand_id?: number
    min_price?: number
    max_price?: number
    color?: string
    in_stock?: boolean
    sort_by?: 'name' | 'price' | 'created_at'
    sort_order?: 'asc' | 'desc'
    page?: number
    per_page?: number
  }): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const queryString = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryString.append(key, String(value))
        }
      })
    }

    const queryStr = queryString.toString()
    return makeRequest(`/products${queryStr ? '?' + queryStr : ''}`)
  },

  // Get featured products
  getFeaturedProducts: (): Promise<ApiResponse<Product[]>> =>
    makeRequest('/products/featured'),

  // Get latest products
  getLatestProducts: (limit?: number): Promise<ApiResponse<Product[]>> =>
    makeRequest(`/products/latest${limit ? '?limit=' + limit : ''}`),

  // Get single product
  getProduct: (id: number): Promise<ApiResponse<Product>> =>
    makeRequest(`/products/${id}`),

  // Get product by slug
  getProductBySlug: (slug: string): Promise<ApiResponse<Product>> =>
    makeRequest(`/products/slug/${slug}`),

  // Get related products
  getRelatedProducts: (id: number, limit?: number): Promise<ApiResponse<Product[]>> =>
    makeRequest(`/products/${id}/related${limit ? '?limit=' + limit : ''}`),

  // Get on-sale products
  getOnSaleProducts: (): Promise<ApiResponse<Product[]>> =>
    makeRequest('/products-on-sale'),

  // Get sale campaigns for a product
  getProductSaleCampaigns: (productId: number): Promise<ApiResponse<any[]>> =>
    makeRequest(`/products/${productId}/sale-campaigns`),

  // Admin/Contributor only methods
  createProduct: (productData: any): Promise<ApiResponse<Product>> =>
    makeRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id: number, productData: any): Promise<ApiResponse<Product>> =>
    makeRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/products/${id}`, {
      method: 'DELETE',
    }),
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

  // Get single category by slug (returns only category info - NEW API)
  getCategoryBySlug: (slug: string): Promise<ApiResponse<Category>> => {
    return makeRequest(`/categories/slug/${slug}`)
  },

  // Admin/Contributor only methods
  createCategory: (categoryData: any): Promise<ApiResponse<Category>> =>
    makeRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),

  updateCategory: (id: number, categoryData: any): Promise<ApiResponse<Category>> =>
    makeRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),

  deleteCategory: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/categories/${id}`, {
      method: 'DELETE',
    }),
}

// Brands API
export const brandsApi = {
  // Get all brands
  getBrands: (): Promise<PaginatedResponse<Brand>> => makeRequest('/brands'),

  // Get active brands
  getActiveBrands: (): Promise<ApiResponse<Brand[]>> => makeRequest('/brands/active'),

  // Get single brand
  getBrand: (id: number): Promise<ApiResponse<Brand>> => makeRequest(`/brands/${id}`),

  // Admin/Contributor only methods
  createBrand: (brandData: any): Promise<ApiResponse<Brand>> =>
    makeRequest('/brands', {
      method: 'POST',
      body: JSON.stringify(brandData),
    }),

  updateBrand: (id: number, brandData: any): Promise<ApiResponse<Brand>> =>
    makeRequest(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    }),

  deleteBrand: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/brands/${id}`, {
      method: 'DELETE',
    }),
}

// Admin Categories API
export const adminCategoriesApi = {
  // Get all categories for admin
  getCategories: (page = 1, limit = 15, params?: URLSearchParams): Promise<PaginatedResponse<Category>> => {
    let url = `/dashboard/categories?page=${page}&per_page=${limit}`
    if (params) {
      url += `&${params.toString()}`
    }
    return makeRequest(url)
  },

  // Get single category
  getCategory: (id: number): Promise<ApiResponse<Category>> =>
    makeRequest(`/dashboard/categories/${id}`),

  // Create category with file upload
  createCategory: (formData: FormData): Promise<ApiResponse<Category>> =>
    makeRequest('/dashboard/categories', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    }),

  // Update category
  updateCategory: (id: number, categoryData: any): Promise<ApiResponse<Category>> =>
    makeRequest(`/dashboard/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),

  // Update category with file upload
  updateCategoryWithFile: (id: number, formData: FormData): Promise<ApiResponse<Category>> =>
    makeRequest(`/dashboard/categories/${id}`, {
      method: 'POST', // Using POST with _method for file upload
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    }),

  // Delete category (soft delete)
  deleteCategory: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/categories/${id}`, {
      method: 'DELETE',
    }),

  // Get trashed categories
  getTrashedCategories: (page = 1, limit = 15): Promise<PaginatedResponse<Category>> =>
    makeRequest(`/dashboard/categories/trashed?page=${page}&per_page=${limit}`),

  // Get trashed categories with filters
  getTrashed: (params?: any): Promise<ApiResponse<PaginatedResponse<Category>>> => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
          queryParams.append(key, params[key].toString())
        }
      })
    }
    const url = `/dashboard/categories/trashed?${queryParams.toString()}`
    return makeRequest(url)
  },

  // Restore category
  restoreCategory: (id: number): Promise<ApiResponse<Category>> =>
    makeRequest(`/dashboard/categories/${id}/restore`, {
      method: 'POST',
    }),

  // Restore category (alias)
  restore: (id: number): Promise<ApiResponse<Category>> =>
    makeRequest(`/dashboard/categories/${id}/restore`, {
      method: 'POST',
    }),

  // Force delete category
  forceDeleteCategory: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/categories/${id}/force`, {
      method: 'DELETE',
    }),

  // Force delete category (alias)
  forceDelete: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/categories/${id}/force`, {
      method: 'DELETE',
    }),

  // Get category with products
  getCategoryWithProducts: (id: number, page = 1, limit = 15, includeTrashed = false): Promise<PaginatedResponse<any>> =>
    makeRequest(`/dashboard/categories/${id}/products?page=${page}&per_page=${limit}&include_trashed=${includeTrashed}`),
}

// Admin Brands API
export const adminBrandsApi = {
  // Get all brands for admin
  getBrands: (page = 1, limit = 15, params?: URLSearchParams): Promise<PaginatedResponse<Brand>> => {
    let url = `/dashboard/brands?page=${page}&per_page=${limit}`
    if (params) {
      url += `&${params.toString()}`
    }
    return makeRequest(url)
  },

  // Get single brand
  getBrand: (id: number): Promise<ApiResponse<Brand>> =>
    makeRequest(`/dashboard/brands/${id}`),

  // Create brand with file upload
  createBrand: (formData: FormData): Promise<ApiResponse<Brand>> =>
    makeRequest('/dashboard/brands', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    }),

  // Update brand
  updateBrand: (id: number, brandData: any): Promise<ApiResponse<Brand>> =>
    makeRequest(`/dashboard/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    }),

  // Update brand with file upload
  updateBrandWithFile: (id: number, formData: FormData): Promise<ApiResponse<Brand>> =>
    makeRequest(`/dashboard/brands/${id}`, {
      method: 'POST', // Using POST with _method for file upload
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    }),

  // Delete brand (soft delete)
  deleteBrand: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/brands/${id}`, {
      method: 'DELETE',
    }),

  // Get trashed brands
  getTrashedBrands: (page = 1, limit = 15): Promise<PaginatedResponse<Brand>> =>
    makeRequest(`/dashboard/brands/trashed?page=${page}&per_page=${limit}`),

  // Get trashed brands with filters
  getTrashed: (params?: any): Promise<ApiResponse<PaginatedResponse<Brand>>> => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
          queryParams.append(key, params[key].toString())
        }
      })
    }
    const url = `/dashboard/brands/trashed?${queryParams.toString()}`
    return makeRequest(url)
  },

  // Restore brand
  restoreBrand: (id: number): Promise<ApiResponse<Brand>> =>
    makeRequest(`/dashboard/brands/${id}/restore`, {
      method: 'POST',
    }),

  // Restore brand (alias)
  restore: (id: number): Promise<ApiResponse<Brand>> =>
    makeRequest(`/dashboard/brands/${id}/restore`, {
      method: 'POST',
    }),

  // Force delete brand
  forceDeleteBrand: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/brands/${id}/force`, {
      method: 'DELETE',
    }),

  // Force delete brand (alias)
  forceDelete: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/brands/${id}/force`, {
      method: 'DELETE',
    }),

  // Get quick stats
  getQuickStats: (): Promise<ApiResponse<any>> =>
    makeRequest('/dashboard/brands/quick/stats'),
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

  logout: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await makeRequest<ApiResponse<any>>('/auth/logout', { method: 'POST' })
      // Clear tokens after successful logout
      clearTokens()
      return response
    } catch (error) {
      // Clear tokens even if logout fails (network error, etc.)
      clearTokens()
      throw error
    }
  },

  refresh: (): Promise<AuthResponse> =>
    makeRequest('/auth/refresh', { method: 'POST' }),

  getMe: (): Promise<User> => makeRequest('/auth/me'),

  // Helper methods for token management
  saveTokens: (authToken: string) => {
    saveTokens(authToken)
  },

  clearTokens: () => {
    clearTokens()
  },

  hasValidToken: (): boolean => {
    const token = getAuthToken()
    if (!token) return false

    // Check if token is not expired
    return !isTokenExpiring()
  },

  // Manual token refresh
  refreshToken: async (): Promise<string | null> => {
    return refreshAuthToken()
  }
}

// Roles API
export const rolesApi = {
  // Get all roles (Admin only)
  getRoles: (): Promise<RolesResponse> => makeRequest('/dashboard/roles'),

  // Get single role (Admin only)
  getRole: (id: number): Promise<ApiResponse<Role>> => makeRequest(`/dashboard/roles/${id}`),

  // Admin only methods
  createRole: (roleData: any): Promise<ApiResponse<Role>> =>
    makeRequest('/dashboard/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    }),

  updateRole: (id: number, roleData: any): Promise<ApiResponse<Role>> =>
    makeRequest(`/dashboard/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    }),

  deleteRole: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/roles/${id}`, {
      method: 'DELETE',
    }),

  // Assign role to user
  assignRole: (userId: number, roleName: string): Promise<ApiResponse<any>> =>
    makeRequest('/roles/assign', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, role_name: roleName }),
    }),

  // Remove role from user
  removeRole: (userId: number, roleName: string): Promise<ApiResponse<any>> =>
    makeRequest('/roles/remove', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, role_name: roleName }),
    }),
}

// Order API
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
  getUserStats: (): Promise<ApiResponse<any>> => makeRequest('/dashboard/user/stats'),

  // Delete account
  deleteAccount: (): Promise<ApiResponse<any>> =>
    makeRequest('/delete-account', { method: 'DELETE' }),
}

// Admin User Management API
export const adminUserApi = {
  // Get all users (Admin only)
  getUsers: (params?: any): Promise<PaginatedResponse<User>> => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString() : ''
    return makeRequest(`/dashboard/users${queryString}`)
  },

  // Update user (Admin only)
  updateUser: (id: number, userData: any): Promise<ApiResponse<User>> =>
    makeRequest(`/dashboard/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Delete user (Admin only)
  deleteUser: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/users/${id}`, {
      method: 'DELETE',
    }),

  // Toggle user status (Admin only)
  toggleUserStatus: (id: number): Promise<ApiResponse<User>> =>
    makeRequest(`/dashboard/users/${id}/toggle-status`, {
      method: 'POST',
    }),
}

// Address Book API
export const addressBookApi = {
  // Get all addresses
  getAddresses: (): Promise<ApiResponse<Address[]>> => makeRequest('/address-books'),

  // Get single address
  getAddress: (id: number): Promise<ApiResponse<Address>> =>
    makeRequest(`/address-books/${id}`),

  // Create a new address
  createAddress: (addressData: any): Promise<ApiResponse<Address>> =>
    makeRequest('/address-books', {
      method: 'POST',
      body: JSON.stringify(addressData),
    }),

  // Update an address
  updateAddress: (id: number, addressData: any): Promise<ApiResponse<Address>> =>
    makeRequest(`/address-books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    }),

  // Delete an address
  deleteAddress: (id: number): Promise<ApiResponse<any>> =>
    makeRequest(`/address-books/${id}`, { method: 'DELETE' }),

  // Set default address
  setDefaultAddress: (id: number): Promise<ApiResponse<any>> =>
    makeRequest(`/address-books/${id}/set-default`, { method: 'POST' }),
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
  getLatestNews: (): Promise<ApiResponse<News[]>> => makeRequest('/news/latest'),

  // Get single news item by ID
  getNewsById: (id: number): Promise<ApiResponse<News>> => makeRequest(`/news/${id}`),

  // Get news categories
  getCategories: (): Promise<ApiResponse<Category[]>> => makeRequest('/categories'),

  // Admin/Contributor only methods
  createNews: (newsData: any): Promise<ApiResponse<News>> =>
    makeRequest('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    }),

  updateNews: (id: number, newsData: any): Promise<ApiResponse<News>> =>
    makeRequest(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    }),

  deleteNews: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/news/${id}`, {
      method: 'DELETE',
    }),
}

// Vouchers API
export const vouchersApi = {
  // Get all vouchers
  getVouchers: (): Promise<PaginatedResponse<Voucher>> => makeRequest('/vouchers'),

  // Get single voucher
  getVoucher: (id: number): Promise<ApiResponse<Voucher>> => makeRequest(`/vouchers/${id}`),

  // Get active vouchers
  getActiveVouchers: (): Promise<ApiResponse<Voucher[]>> =>
    makeRequest('/vouchers'),

  // Validate voucher code
  validateVoucher: (code: string): Promise<ApiResponse<Voucher>> =>
    makeRequest(`/vouchers/validate`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Admin/Contributor only methods
  createVoucher: (voucherData: any): Promise<ApiResponse<Voucher>> =>
    makeRequest('/vouchers', {
      method: 'POST',
      body: JSON.stringify(voucherData),
    }),

  updateVoucher: (id: number, voucherData: any): Promise<ApiResponse<Voucher>> =>
    makeRequest(`/vouchers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(voucherData),
    }),

  deleteVoucher: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/vouchers/${id}`, {
      method: 'DELETE',
    }),
}

// Comments API
export const commentsApi = {
  // Get all comments (public)
  getComments: (params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Comment>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

    const queryString = queryParams.toString()
    return makeRequest(`/comments${queryString ? '?' + queryString : ''}`)
  },

  // Get single comment (public)
  getComment: (id: number): Promise<ApiResponse<Comment>> =>
    makeRequest(`/comments/${id}`),

  // Get comments for a product (public) - using standard API endpoint
  getProductComments: (productId: number, params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Comment>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

    const queryString = queryParams.toString()
    return makeRequest(`/comments/product/${productId}${queryString ? '?' + queryString : ''}`)
  },

  // Get my comments (authenticated)
  getMyComments: (params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Comment>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

    const queryString = queryParams.toString()
    return makeRequest(`/my-comments${queryString ? '?' + queryString : ''}`)
  },

  // Create a new comment (authenticated users)
  createComment: (commentData: CommentRequest): Promise<ApiResponse<Comment>> =>
    makeRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),

  // Create a new comment for a product (authenticated users)
  createProductComment: (productId: number, commentData: Omit<CommentRequest, 'product_id'>): Promise<ApiResponse<Comment>> =>
    makeRequest(`/comments/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),

  // Update comment (own comments only)
  updateComment: (id: number, commentData: Partial<CommentRequest>): Promise<ApiResponse<Comment>> =>
    makeRequest(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    }),

  // Delete comment (own comments only)
  deleteComment: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/comments/${id}`, {
      method: 'DELETE',
    }),
}

// Contact API
export const contactApi = {
  // Get all contacts (public)
  getContacts: (): Promise<PaginatedResponse<any>> => makeRequest('/contacts'),

  // Get single contact (public)
  getContact: (id: number): Promise<ApiResponse<any>> => makeRequest(`/contacts/${id}`),

  // Get single contact detail (admin)
  getAdminContact: (id: number): Promise<ApiResponse<ContactAdmin>> => makeRequest(`/dashboard/contacts/${id}`),

  // Send a contact message
  submitContact: (contactData: any): Promise<ApiResponse<any>> =>
    makeRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),

  // Admin/Contributor only methods
  getAdminContacts: (params?: any): Promise<ContactAdminListResponse> => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString() : ''
    return makeRequest(`/dashboard/contacts${queryString}`)
  },

  updateContactStatus: (id: number, statusData: { status: 'pending' | 'resolved' }): Promise<ApiResponse<ContactAdmin>> =>
    makeRequest(`/dashboard/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),

  deleteContact: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/dashboard/contacts/${id}`, {
      method: 'DELETE',
    }),
}

// Sale Campaigns API
export const saleCampaignsApi = {
  // Get all sale campaigns
  getSaleCampaigns: (params?: any): Promise<PaginatedResponse<any>> => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString() : ''
    return makeRequest(`/sale-campaigns${queryString}`)
  },

  // Get single sale campaign by ID
  getSaleCampaign: (id: number | string): Promise<ApiResponse<any>> => makeRequest(`/sale-campaigns/${id}`),

  // Get single sale campaign by slug
  getSaleCampaignBySlug: (slug: string): Promise<ApiResponse<any>> => makeRequest(`/sale-campaigns/slug/${slug}`),

  // Get active sale campaigns (using query parameter)
  getActiveSaleCampaigns: (): Promise<PaginatedResponse<any>> =>
    makeRequest('/sale-campaigns?active_only=true'),

  // Get featured sale campaigns (using query parameter)
  getFeaturedSaleCampaigns: (): Promise<PaginatedResponse<any>> =>
    makeRequest('/sale-campaigns?featured_only=true'),

  // Get products in a sale campaign
  getSaleCampaignProducts: (id: number | string, params?: any): Promise<PaginatedResponse<Product>> => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString() : ''
    return makeRequest(`/sale-campaigns/${id}/products${queryString}`)
  },

  // Admin/Contributor only methods
  createSaleCampaign: (campaignData: any): Promise<ApiResponse<any>> =>
    makeRequest('/sale-campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    }),

  updateSaleCampaign: (id: number, campaignData: any): Promise<ApiResponse<any>> =>
    makeRequest(`/sale-campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    }),

  deleteSaleCampaign: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/sale-campaigns/${id}`, {
      method: 'DELETE',
    }),

  // Add products to sale campaign
  addProductsToSaleCampaign: (id: number, productIds: number[]): Promise<ApiResponse<any>> =>
    makeRequest(`/sale-campaigns/${id}/products`, {
      method: 'POST',
      body: JSON.stringify({ product_ids: productIds }),
    }),

  // Remove product from sale campaign
  removeProductFromSaleCampaign: (campaignId: number, productId: number): Promise<ApiResponse<void>> =>
    makeRequest(`/sale-campaigns/${campaignId}/products/${productId}`, {
      method: 'DELETE',
    }),
}

// Orders API
export const ordersApi = {
  // Get user orders
  getUserOrders: (page = 1, status?: string, days?: number): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const params = new URLSearchParams({ page: page.toString() })
    if (status) params.append('status', status)
    if (days) params.append('days', days.toString())
    return makeRequest(`/orders?${params.toString()}`)
  },

  // Get single order
  getOrder: (id: number): Promise<ApiResponse<Order>> =>
    makeRequest(`/orders/${id}`),

  // Create a new order
  createOrder: (orderData: CreateOrderRequest): Promise<ApiResponse<Order>> =>
    makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  // Cancel order
  cancelOrder: (id: number): Promise<ApiResponse<Order>> =>
    makeRequest(`/orders/${id}/cancel`, {
      method: 'POST',
    }),

  // Get order stats for current user
  getOrderStats: (): Promise<ApiResponse<any>> =>
    makeRequest('/dashboard/orders/stats'),

  // Admin/Contributor only methods
  getAdminOrders: (params?: any): Promise<PaginatedResponse<Order>> => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString() : ''
    return makeRequest(`/dashboard/orders${queryString}`)
  },

  // Update order status (Admin/Contributor only)
  updateOrderStatus: (id: number, data: {
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    payment_status?: 'pending' | 'paid' | 'failed'
    notes?: string
  }): Promise<ApiResponse<Order>> =>
    makeRequest(`/dashboard/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// Addresses API
export const addressesApi = {
  // Get user addresses
  getUserAddresses: (): Promise<ApiResponse<Address[]>> =>
    makeRequest('/user/addresses'),

  // Create new address
  createAddress: (addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Address>> =>
    makeRequest('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    }),

  // Update address
  updateAddress: (id: number, addressData: Partial<Address>): Promise<ApiResponse<Address>> =>
    makeRequest(`/user/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    }),

  // Delete address
  deleteAddress: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/user/addresses/${id}`, {
      method: 'DELETE',
    }),

  // Set default address
  setDefaultAddress: (id: number): Promise<ApiResponse<Address>> =>
    makeRequest(`/user/addresses/${id}/set-default`, {
      method: 'PATCH',
    }),
}

// Payment Methods API
export const paymentMethodsApi = {
  // Get all payment methods
  getPaymentMethods: (): Promise<ApiResponse<PaymentMethod[]>> =>
    makeRequest('/payment-methods'),

  // Get active payment methods only
  getActivePaymentMethods: (): Promise<ApiResponse<PaymentMethod[]>> =>
    makeRequest('/payment-methods/active'),

  // Get single payment method
  getPaymentMethod: (id: number): Promise<ApiResponse<PaymentMethod>> =>
    makeRequest(`/payment-methods/${id}`),

  // Admin/Contributor only methods
  createPaymentMethod: (data: any): Promise<ApiResponse<PaymentMethod>> =>
    makeRequest('/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePaymentMethod: (id: number, data: any): Promise<ApiResponse<PaymentMethod>> =>
    makeRequest(`/payment-methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePaymentMethod: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/payment-methods/${id}`, {
      method: 'DELETE',
    }),
}

// Admin Dashboard API
export const adminDashboardApi = {
  // Get dashboard statistics
  getDashboardStats: (): Promise<ApiResponse<DashboardStats>> =>
    makeRequest('/dashboard/stats'),

  // Get monthly revenue report
  getRevenueReport: (year?: number): Promise<ApiResponse<DashboardRevenue>> => {
    const params = year ? `?year=${year}` : ''
    return makeRequest(`/dashboard/revenue${params}`)
  },

  // Get user analytics
  getUserAnalytics: (year?: number): Promise<ApiResponse<DashboardUsers>> => {
    const params = year ? `?year=${year}` : ''
    return makeRequest(`/dashboard/users${params}`)
  },

  // Get product analytics
  getProductAnalytics: (): Promise<ApiResponse<DashboardProducts>> =>
    makeRequest('/dashboard/products'),
}

// Admin Products Management API
export const adminProductsApi = {
  // Get all products for admin
  getProducts: (page?: number, limit?: number, filters?: URLSearchParams): Promise<AdminProductsListResponse> => {
    const params = filters || new URLSearchParams()
    if (page && !params.has('page')) params.append('page', page.toString())
    if (limit && !params.has('limit')) params.append('limit', limit.toString())
    const queryString = params.toString()
    return makeRequest(`/dashboard/products${queryString ? '?' + queryString : ''}`)
  },

  // Get single product for admin
  getProduct: (id: number): Promise<AdminProductResponse> =>
    makeRequest(`/dashboard/products/${id}`),

  // Create new product with file upload
  createProduct: (productData: CreateProductRequest, files?: { image?: File, gallery?: File[] }): Promise<AdminProductResponse> => {
    const formData = new FormData()

    // Add product data
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'gallery') return // Handle gallery separately
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })

    // Add main image file
    if (files?.image) {
      formData.append('image', files.image)
    }

    // Add gallery files
    if (files?.gallery && files.gallery.length > 0) {
      files.gallery.forEach((file, index) => {
        formData.append(`gallery[${index}]`, file)
      })
    }

    return makeRequest('/dashboard/products', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type, let browser set it with boundary for FormData
      } as HeadersInit,
    })
  },

  // Update product with file upload
  updateProduct: (id: number, productData: UpdateProductRequest, files?: { image?: File, gallery?: File[] }): Promise<AdminProductResponse> => {
    const formData = new FormData()

    // Add _method for Laravel PUT request via POST
    formData.append('_method', 'PUT')

    // Add product data
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'gallery') return // Handle gallery separately
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })

    // Add main image file
    if (files?.image) {
      formData.append('image', files.image)
    }

    // Add gallery files
    if (files?.gallery && files.gallery.length > 0) {
      files.gallery.forEach((file, index) => {
        formData.append(`gallery[${index}]`, file)
      })
    }

    return makeRequest(`/dashboard/products/${id}`, {
      method: 'POST', // Laravel expects POST with _method=PUT for file uploads
      body: formData,
      headers: {
        'Accept': 'application/json',
      } as HeadersInit,
    })
  },

  // Delete product
  deleteProduct: (id: number): Promise<ApiResponse<null>> =>
    makeRequest(`/dashboard/products/${id}`, {
      method: 'DELETE',
    }),

  // Bulk delete products
  bulkDeleteProducts: (ids: number[]): Promise<ApiResponse<null>> =>
    makeRequest('/dashboard/products/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),
}
