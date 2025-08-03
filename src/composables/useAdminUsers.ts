import { ref, computed } from 'vue'
import { adminUsersApi, rolesApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import type { User, Role } from '@/types'

export function useAdminUsers() {
  const { showToast } = useToast()

  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalPages = ref(0)
  const errors = ref<Record<string, string[]>>({})

  // Search and filters
  const searchQuery = ref('')
  const statusFilter = ref('')
  const roleFilter = ref('')
  const roles = ref<Role[]>([])

  // Form state
  const form = ref({
    id: 0,
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  })

  // Computed
  const filteredUsers = computed(() => {
    let filtered = users.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.toLowerCase().includes(query))
      )
    }

    if (statusFilter.value) {
      filtered = filtered.filter(user => user.status === statusFilter.value)
    }

    if (roleFilter.value) {
      filtered = filtered.filter(user =>
        user.roles?.some(role => role.name === roleFilter.value)
      )
    }

    return filtered
  })

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserRoles = (user: User): string => {
    if (!user.roles || user.roles.length === 0) {
      return 'User'
    }
    return user.roles.map(role => role.display_name || role.name).join(', ')
  }

  const getUserStatusBadge = (status: string) => {
    return status === 'active'
      ? { class: 'badge bg-success', text: 'Hoạt động' }
      : { class: 'badge bg-danger', text: 'Không hoạt động' }
  }

  const isUserAdmin = (user: User): boolean => {
    return user.roles?.some(role => role.name === 'admin') || false
  }

  const isUserContributor = (user: User): boolean => {
    return user.roles?.some(role => role.name === 'contributor') || false
  }

  // API functions
  const loadUsers = async (page = 1) => {
    loading.value = true
    errors.value = {}

    try {
      const params = {
        page,
        per_page: perPage.value,
        search: searchQuery.value || undefined,
        status: statusFilter.value || undefined,
        role: roleFilter.value || undefined
      }

      const response = await adminUsersApi.getUsers(params)

      // API trả về structure: { success: true, data: { current_page, data: [...], total, last_page } }
      users.value = response.data.data || []
      currentPage.value = response.data.current_page || 1
      totalUsers.value = response.data.total || 0
      totalPages.value = response.data.last_page || 1

    } catch (error: any) {
      console.error('Failed to load users:', error)
      showToast('Lỗi khi tải danh sách người dùng', 'error')
      errors.value = error.errors || {}
    } finally {
      loading.value = false
    }
  }

  const loadUserById = async (id: number): Promise<User | null> => {
    try {
      const response = await adminUsersApi.getUserById(id)
      return response.data
    } catch (error: any) {
      console.error('Failed to load user:', error)
      showToast('Lỗi khi tải thông tin người dùng', 'error')
      return null
    }
  }

  const updateUser = async (id: number, userData: {
    name?: string
    email?: string
    phone?: string
    status?: string
  }) => {
    submitting.value = true
    errors.value = {}

    try {
      const response = await adminUsersApi.updateUser(id, userData)

      // Update user in list
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...response.data }
      }

      showToast('Cập nhật người dùng thành công', 'success')
      return response.data

    } catch (error: any) {
      console.error('Failed to update user:', error)
      showToast(error.message || 'Lỗi khi cập nhật người dùng', 'error')
      errors.value = error.errors || {}
      throw error
    } finally {
      submitting.value = false
    }
  }

  const deleteUser = async (id: number) => {
    submitting.value = true

    try {
      await adminUsersApi.deleteUser(id)

      // Remove user from list
      users.value = users.value.filter(u => u.id !== id)
      totalUsers.value--

      showToast('Xóa người dùng thành công', 'success')

    } catch (error: any) {
      console.error('Failed to delete user:', error)
      showToast(error.message || 'Lỗi khi xóa người dùng', 'error')
      throw error
    } finally {
      submitting.value = false
    }
  }

  const loadRoles = async () => {
    try {
      const response = await rolesApi.getRoles()
      roles.value = response.data
    } catch (error: any) {
      console.error('Failed to load roles:', error)
      showToast('Lỗi khi tải danh sách vai trò', 'error')
    }
  }

  const assignRole = async (userId: number, roleName: string) => {
    submitting.value = true

    try {
      await adminUsersApi.assignRole(userId, roleName)

      // Reload user data to get updated roles
      await loadUsers(currentPage.value)

      showToast('Gán vai trò thành công', 'success')

    } catch (error: any) {
      console.error('Failed to assign role:', error)
      showToast(error.message || 'Lỗi khi gán vai trò', 'error')
      throw error
    } finally {
      submitting.value = false
    }
  }

  const removeRole = async (userId: number, roleName: string) => {
    submitting.value = true

    try {
      await adminUsersApi.removeRole(userId, roleName)

      // Reload user data to get updated roles
      await loadUsers(currentPage.value)

      showToast('Gỡ vai trò thành công', 'success')

    } catch (error: any) {
      console.error('Failed to remove role:', error)
      showToast(error.message || 'Lỗi khi gỡ vai trò', 'error')
      throw error
    } finally {
      submitting.value = false
    }
  }

  // Form helpers
  const resetForm = () => {
    form.value = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      status: 'active'
    }
    errors.value = {}
  }

  const setFormData = (user: User) => {
    form.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      status: user.status
    }
    errors.value = {}
  }

  // Pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      loadUsers(page)
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      goToPage(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      goToPage(currentPage.value - 1)
    }
  }

  // Search and filter functions
  const search = () => {
    currentPage.value = 1
    loadUsers(1)
  }

  const clearFilters = () => {
    searchQuery.value = ''
    statusFilter.value = ''
    roleFilter.value = ''
    currentPage.value = 1
    loadUsers(1)
  }

  return {
    // State
    users,
    loading,
    submitting,
    totalUsers,
    currentPage,
    perPage,
    totalPages,
    errors,
    filteredUsers,

    // Search and filters
    searchQuery,
    statusFilter,
    roleFilter,
    roles,

    // Form
    form,

    // Computed
    hasNextPage,
    hasPrevPage,

    // API functions
    loadUsers,
    loadUserById,
    updateUser,
    deleteUser,
    loadRoles,
    assignRole,
    removeRole,

    // Form helpers
    resetForm,
    setFormData,

    // Pagination
    goToPage,
    nextPage,
    prevPage,

    // Search and filter
    search,
    clearFilters,

    // Utility functions
    formatDate,
    getUserRoles,
    getUserStatusBadge,
    isUserAdmin,
    isUserContributor
  }
}
