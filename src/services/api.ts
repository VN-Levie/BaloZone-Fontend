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
  User
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
}

// Brands API
export const brandsApi = {
  // Get all brands
  getBrands: (): Promise<PaginatedResponse<Brand>> =>
    makeRequest('/brands'),
  
  // Get active brands
  getActiveBrands: (): Promise<ApiResponse<Brand[]>> =>
    makeRequest('/brands-active'),
}

// News API
export const newsApi = {
  // Get all news
  getNews: (): Promise<PaginatedResponse<News>> =>
    makeRequest('/news'),
  
  // Get latest news
  getLatestNews: (): Promise<ApiResponse<News[]>> =>
    makeRequest('/news-latest'),
  
  // Get single news
  getNewsItem: (id: number): Promise<ApiResponse<News>> =>
    makeRequest(`/news/${id}`),
}

// Vouchers API
export const vouchersApi = {
  // Get active vouchers
  getActiveVouchers: (): Promise<ApiResponse<Voucher[]>> =>
    makeRequest('/vouchers-active'),
  
  // Validate voucher
  validateVoucher: (code: string): Promise<ApiResponse<{ valid: boolean; message: string; data?: Voucher }>> =>
    makeRequest('/vouchers/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
}

// Auth API
export const authApi = {
  // Login
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  // Register
  register: (userData: RegisterData): Promise<AuthResponse> =>
    makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  // Logout
  logout: (): Promise<ApiResponse<{ message: string }>> =>
    makeRequest('/auth/logout', {
      method: 'POST',
    }),
  
  // Get current user
  getCurrentUser: (): Promise<ApiResponse<User>> =>
    makeRequest('/auth/me'),
}

// Contact API
export const contactApi = {
  // Send contact message
  sendMessage: (data: { fullname: string; email: string; message: string }): Promise<ApiResponse<any>> =>
    makeRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
