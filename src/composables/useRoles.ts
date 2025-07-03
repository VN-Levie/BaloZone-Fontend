import { ref, computed } from 'vue'
import { rolesApi } from '@/services/api'
import type { Role } from '@/types'
import { useToast } from './useToast'

export function useRoles() {
  const roles = ref<Role[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const { showError } = useToast()

  // Computed properties
  const roleOptions = computed(() => 
    roles.value.map(role => ({
      value: role.name,
      label: role.display_name,
      description: role.description
    }))
  )

  const adminRoles = computed(() => 
    roles.value.filter(role => role.name === 'admin')
  )

  const userRoles = computed(() => 
    roles.value.filter(role => role.name === 'user')
  )

  const contributorRoles = computed(() => 
    roles.value.filter(role => role.name === 'contributor')
  )

  // Actions
  const fetchRoles = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await rolesApi.getRoles()
      if (response.success) {
        roles.value = response.data
      } else {
        throw new Error('Failed to fetch roles')
      }
    } catch (err: any) {
      error.value = err.message || 'Lỗi khi tải danh sách vai trò'
      showError('Lỗi', error.value || 'Lỗi không xác định')
      console.error('Error fetching roles:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getRoleByName = (name: string): Role | undefined => {
    return roles.value.find(role => role.name === name)
  }

  const getRoleDisplayName = (name: string): string => {
    const role = getRoleByName(name)
    return role?.display_name || name
  }

  const getRoleDescription = (name: string): string => {
    const role = getRoleByName(name)
    return role?.description || ''
  }

  // Permission checking utilities
  const canAccessAdmin = (userRoles: Role[]): boolean => {
    return userRoles.some(role => role.name === 'admin')
  }

  const canManageProducts = (userRoles: Role[]): boolean => {
    return userRoles.some(role => 
      role.name === 'admin' || role.name === 'contributor'
    )
  }

  const canManageOrders = (userRoles: Role[]): boolean => {
    return userRoles.some(role => 
      role.name === 'admin' || role.name === 'contributor'
    )
  }

  const hasPermission = (userRoles: Role[], permission: string): boolean => {
    // Admin has all permissions
    if (userRoles.some(role => role.name === 'admin')) {
      return true
    }

    // Check specific permissions
    switch (permission) {
      case 'manage_products':
      case 'manage_orders':
        return userRoles.some(role => role.name === 'contributor')
      case 'manage_users':
      case 'manage_roles':
      case 'system_admin':
        return false // Only admin
      default:
        return userRoles.some(role => role.name === 'user') // Basic user permissions
    }
  }

  return {
    // State
    roles: computed(() => roles.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Computed
    roleOptions,
    adminRoles,
    userRoles,
    contributorRoles,
    
    // Actions
    fetchRoles,
    getRoleByName,
    getRoleDisplayName,
    getRoleDescription,
    
    // Permissions
    canAccessAdmin,
    canManageProducts,
    canManageOrders,
    hasPermission
  }
}
