import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import type { LoginCredentials, RegisterData } from '@/types'

export const useAuth = () => {
  const authStore = useAuthStore()

  const login = async (email: string, password: string) => {
    return await authStore.login({ email, password } as LoginCredentials)
  }

  const register = async (name: string, email: string, password: string) => {
    return await authStore.register({ name, email, password } as RegisterData)
  }

  return {
    // State from store - wrapped in computed to ensure reactivity
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoggedIn: computed(() => authStore.isLoggedIn),
    isLoading: computed(() => authStore.isLoading),
    token: computed(() => authStore.token),
    
    // Actions from store
    login,
    register,
    logout: authStore.logout,
    initializeAuth: authStore.initializeAuth,
    refreshUser: authStore.refreshUser,
    updateUser: authStore.updateUser,
    clearAuth: authStore.clearAuth
  }
}
