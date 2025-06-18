import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/services/api'
import type { User, LoginCredentials, RegisterData } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isLoggedIn = computed(() => isAuthenticated.value)

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
      // Lấy token từ response.authorization.token
      const authToken = response.authorization?.token
      const userData = response.user
      token.value = authToken ?? null
      user.value = userData
      localStorage.setItem('auth_token', authToken || '')
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
      // Lấy token từ response.authorization.token
      const authToken = response.authorization?.token
      const userData = response.user
      token.value = authToken ?? null
      user.value = userData
      localStorage.setItem('auth_token', authToken || '')
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
    localStorage.removeItem('auth_token')
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

  return {
    // State
    user: computed(() => user.value),
    token: computed(() => token.value),
    isLoading: computed(() => isLoading.value),
    // Getters
    isAuthenticated,
    isLoggedIn,
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    refreshUser,
    updateUser,
    clearAuth
  }
})
