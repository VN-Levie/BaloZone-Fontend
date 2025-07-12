import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/services/api'
import type { User, LoginCredentials, RegisterData, Role } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isLoggedIn = computed(() => isAuthenticated.value)
  
  // Role-based getters
  const userRoles = computed(() => user.value?.roles || [])
  const hasRole = (roleName: string) => {
    return userRoles.value.some(role => role.name === roleName)
  }
  const isAdmin = computed(() => hasRole('admin'))
  const isUser = computed(() => hasRole('user'))
  const isContributor = computed(() => hasRole('contributor'))
  
  // Get primary role (first role or legacy role)
  const primaryRole = computed(() => {
    if (user.value?.roles && user.value.roles.length > 0) {
      return user.value.roles[0].name
    }
    return user.value?.role || 'user'
  })

  // Actions
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')
    // Chỉ lấy token, không lấy type
    if (storedToken && userData) {
      try {
        token.value = storedToken
        user.value = JSON.parse(userData)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        clearAuth()
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)
      
      // Theo API documentation: authorization.token và user object
      const authToken = response.authorization?.token
      const userData = response.user
      
      if (!authToken || !userData) {
        throw new Error('Invalid response format from login API')
      }
      
      token.value = authToken
      user.value = userData
      
      // Sử dụng method mới chỉ cần 1 tham số
      authApi.saveTokens(authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    isLoading.value = true
    try {
      const response = await authApi.register(data)
      
      // Theo API documentation: authorization.token và user object
      const authToken = response.authorization?.token
      const userData = response.user
      
      if (!authToken || !userData) {
        throw new Error('Invalid response format from register API')
      }
      
      token.value = authToken
      user.value = userData
      
      // Sử dụng method mới chỉ cần 1 tham số
      authApi.saveTokens(authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      clearAuth()
    }
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    authApi.clearTokens()
    localStorage.removeItem('user')
  }

  const refreshUser = async () => {
    if (!token.value) return
    try {
      const response: any = await authApi.getMe()
      // response trả về user ở cả response.user và response.data
      const userObj = response.user || response.data
      user.value = userObj
      localStorage.setItem('user', JSON.stringify(userObj))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      clearAuth()
      throw error
    }
  }

  const updateUser = (updatedUser: User) => {
    user.value = updatedUser
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // Role checking utilities
  const checkPermission = (requiredRole: string): boolean => {
    if (!user.value) return false
    return hasRole(requiredRole) || hasRole('admin') // Admin has all permissions
  }

  const getRoleDisplayName = (roleName: string): string => {
    const role = userRoles.value.find(r => r.name === roleName)
    return role?.display_name || roleName
  }

  return {
    // State
    user: computed(() => user.value),
    token: computed(() => token.value),
    isLoading: computed(() => isLoading.value),
    // Getters
    isAuthenticated,
    isLoggedIn,
    userRoles,
    isAdmin,
    isUser,
    isContributor,
    primaryRole,
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    refreshUser,
    updateUser,
    clearAuth,
    // Utilities
    hasRole,
    checkPermission,
    getRoleDisplayName
  }
})
