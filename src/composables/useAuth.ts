import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, onUnmounted } from 'vue'
import type { LoginCredentials, RegisterData } from '@/types'
import { authApi } from '@/services/api'

export const useAuth = () => {
  const authStore = useAuthStore()

  const login = async (email: string, password: string) => {
    return await authStore.login({ email, password } as LoginCredentials)
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    return await authStore.register({ 
      name, 
      email, 
      password, 
      password_confirmation: password,
      phone 
    } as RegisterData)
  }

  // Handle auth expiration events
  const handleAuthExpired = () => {
    console.log('Auth token expired, clearing auth state...')
    authStore.clearAuth()
  }

  // Setup auth event listeners
  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:expired', handleAuthExpired)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('auth:expired', handleAuthExpired)
    }
  })

  return {
    // State from store - wrapped in computed to ensure reactivity
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoggedIn: computed(() => authStore.isLoggedIn),
    isLoading: computed(() => authStore.isLoading),
    token: computed(() => authStore.token),
    
    // Role-based getters
    userRoles: computed(() => authStore.userRoles),
    isAdmin: computed(() => authStore.isAdmin),
    isUser: computed(() => authStore.isUser),
    isContributor: computed(() => authStore.isContributor),
    primaryRole: computed(() => authStore.primaryRole),
    
    // Actions from store
    login,
    register,
    logout: authStore.logout,
    initializeAuth: authStore.initializeAuth,
    refreshUser: authStore.refreshUser,
    updateUser: authStore.updateUser,
    clearAuth: authStore.clearAuth,
    
    // Role utilities
    hasRole: authStore.hasRole,
    checkPermission: authStore.checkPermission,
    getRoleDisplayName: authStore.getRoleDisplayName,

    // Token management utilities
    hasValidToken: authApi.hasValidToken,
    refreshToken: authApi.refreshToken
  }
}
