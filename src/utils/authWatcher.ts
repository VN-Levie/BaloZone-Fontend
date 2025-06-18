import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Auto-refresh user data when token changes
export const setupAuthWatcher = () => {
  const authStore = useAuthStore()
  
  // Watch for token changes and update UI accordingly
  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated, wasAuthenticated) => {
      // If user just logged in, refresh user data
      if (isAuthenticated && !wasAuthenticated) {
        console.log('✅ User authenticated, refreshing data...')
        authStore.refreshUser().catch(() => {
          console.error('Failed to refresh user data after login')
        })
      }
      
      // If user just logged out, redirect to home if on protected page
      if (!isAuthenticated && wasAuthenticated) {
        console.log('🔄 User logged out, checking current route...')
        const currentRoute = router.currentRoute.value
        if (currentRoute.meta.requiresAuth) {
          router.push('/')
        }
      }
    },
    { immediate: false }
  )
  
  // Listen for storage changes (useful for multi-tab logout)
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth_token') {
      if (!e.newValue && authStore.isAuthenticated) {
        // Token removed in another tab, logout here too
        authStore.clearAuth()
      } else if (e.newValue && !authStore.isAuthenticated) {
        // Token added in another tab, initialize auth here
        authStore.initializeAuth()
      }
    }
  })
}
