import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import type { User } from '@/types'

const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    localStorage.setItem('auth_token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.user))
    user.value = response.user
    return response
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password })
    localStorage.setItem('auth_token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.user))
    user.value = response.user
    return response
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      user.value = null
    }
  }

  const initializeAuth = () => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        user.value = JSON.parse(userData)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    }
  }

  const refreshUser = async () => {
    try {
      const response = await authApi.getMe()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const isLoggedIn = computed(() => {
    return !!localStorage.getItem('auth_token') && !!user.value
  })

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoggedIn,
    login,
    register,
    logout,
    initializeAuth,
    refreshUser
  }
}
