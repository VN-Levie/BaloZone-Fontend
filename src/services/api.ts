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
  CategoryWithProductsResponse,
  CreateOrderRequest,
  Address,
  PaymentMethod,
  Role,
  RolesResponse
} from '@/types'

const API_BASE_URL = 'http://localhost:8000/api'

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

  // Get single category by slug
  getCategoryBySlug: (slug: string): Promise<CategoryWithProductsResponse> =>
    makeRequest(`/categories/slug/${slug}`),

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
  getActiveBrands: (): Promise<ApiResponse<Brand[]>> => makeRequest('/brands-active'),

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
  getMe: (): Promise<User> => makeRequest('/auth/me'),
}

// Roles API
export const rolesApi = {
  // Get all roles (Admin only)
  getRoles: (): Promise<RolesResponse> => makeRequest('/admin/roles'),
  
  // Get single role (Admin only)
  getRole: (id: number): Promise<ApiResponse<Role>> => makeRequest(`/admin/roles/${id}`),

  // Admin only methods
  createRole: (roleData: any): Promise<ApiResponse<Role>> =>
    makeRequest('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    }),

  updateRole: (id: number, roleData: any): Promise<ApiResponse<Role>> =>
    makeRequest(`/admin/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    }),

  deleteRole: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/admin/roles/${id}`, {
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
  getUserStats: (): Promise<ApiResponse<any>> => makeRequest('/user-stats'),

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
    return makeRequest(`/admin/users${queryString}`)
  },

  // Update user (Admin only)
  updateUser: (id: number, userData: any): Promise<ApiResponse<User>> =>
    makeRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Delete user (Admin only)
  deleteUser: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  // Toggle user status (Admin only)
  toggleUserStatus: (id: number): Promise<ApiResponse<User>> =>
    makeRequest(`/admin/users/${id}/toggle-status`, {
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
  getLatestNews: (): Promise<ApiResponse<News[]>> => makeRequest('/news-latest'),

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
    makeRequest('/vouchers-active'),

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
  // Get all comments
  getComments: (): Promise<PaginatedResponse<Comment>> => makeRequest('/comments'),

  // Get single comment
  getComment: (id: number): Promise<ApiResponse<Comment>> => makeRequest(`/comments/${id}`),

  // Get comments for a product
  getProductComments: (productId: number): Promise<PaginatedResponse<Comment>> =>
    makeRequest(`/comments/product/${productId}`),

  // Create a new comment (authenticated users)
  createComment: (commentData: any): Promise<ApiResponse<Comment>> =>
    makeRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),

  // Update comment (own comments only)
  updateComment: (id: number, commentData: any): Promise<ApiResponse<Comment>> =>
    makeRequest(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    }),

  // Delete comment (own comments only)
  deleteComment: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/comments/${id}`, {
      method: 'DELETE',
    }),
  
  // Get comments by current user
  getMyComments: (): Promise<PaginatedResponse<Comment>> =>
    makeRequest('/my-comments'),
}

// Contact API
export const contactApi = {
  // Get all contacts (public)
  getContacts: (): Promise<PaginatedResponse<any>> => makeRequest('/contacts'),

  // Get single contact (public)
  getContact: (id: number): Promise<ApiResponse<any>> => makeRequest(`/contacts/${id}`),

  // Send a contact message
  submitContact: (contactData: any): Promise<ApiResponse<any>> =>
    makeRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),

  // Admin/Contributor only methods
  getAdminContacts: (): Promise<PaginatedResponse<any>> => makeRequest('/admin/contacts'),

  updateContact: (id: number, contactData: any): Promise<ApiResponse<any>> =>
    makeRequest(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    }),

  deleteContact: (id: number): Promise<ApiResponse<void>> =>
    makeRequest(`/contacts/${id}`, {
      method: 'DELETE',
    }),
}

// Sale Campaigns API
export const saleCampaignsApi = {
  // Get all sale campaigns
  getSaleCampaigns: (): Promise<PaginatedResponse<any>> => makeRequest('/sale-campaigns'),

  // Get single sale campaign
  getSaleCampaign: (id: number): Promise<ApiResponse<any>> => makeRequest(`/sale-campaigns/${id}`),

  // Get active sale campaigns
  getActiveSaleCampaigns: (): Promise<ApiResponse<any[]>> =>
    makeRequest('/sale-campaigns-active'),

  // Get featured sale campaigns
  getFeaturedSaleCampaigns: (): Promise<ApiResponse<any[]>> =>
    makeRequest('/sale-campaigns-featured'),

  // Get products in a sale campaign
  getSaleCampaignProducts: (id: number): Promise<PaginatedResponse<Product>> =>
    makeRequest(`/sale-campaigns/${id}/products`),

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
  getUserOrders: (page = 1): Promise<PaginatedResponse<Order>> =>
    makeRequest(`/orders?page=${page}`),

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
    makeRequest('/orders-stats'),

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
    return makeRequest(`/admin/orders${queryString}`)
  },

  // Update order status (Admin/Contributor only)
  updateOrderStatus: (id: number, status: string): Promise<ApiResponse<Order>> =>
    makeRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
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
    makeRequest('/payment-methods-active'),
  
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
  getDashboardStats: (): Promise<ApiResponse<any>> =>
    makeRequest('/admin/dashboard/stats'),

  // Get recent activities
  getRecentActivities: (): Promise<ApiResponse<any[]>> =>
    makeRequest('/admin/dashboard/activities'),

  // Get system overview
  getSystemOverview: (): Promise<ApiResponse<any>> =>
    makeRequest('/admin/dashboard/overview'),
}
