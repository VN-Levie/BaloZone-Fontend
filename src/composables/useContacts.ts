import { ref, computed } from 'vue'
import { contactApi } from '@/services/api'
import { useToast } from './useToast'
import type { ContactAdmin, ContactAdminListResponse } from '@/types'

export function useContacts() {
  const { showToast } = useToast()

  // State
  const contacts = ref<ContactAdmin[]>([])
  const selectedContact = ref<ContactAdmin | null>(null)
  const pagination = ref<any>(null)
  const loading = ref(false)
  const updating = ref(false)
  const deleting = ref(false)

  // Filters
  const filters = ref({
    search: '',
    status: '',
    per_page: 15,
    page: 1
  })

  // Computed
  const totalContacts = computed(() => pagination.value?.total || 0)
  const hasContacts = computed(() => contacts.value.length > 0)
  const isFirstPage = computed(() => pagination.value?.current_page === 1)
  const isLastPage = computed(() => pagination.value?.current_page === pagination.value?.last_page)

  // Methods
  const loadContacts = async () => {
    try {
      loading.value = true

      const params: any = {
        page: filters.value.page,
        per_page: filters.value.per_page
      }

      if (filters.value.search.trim()) {
        params.search = filters.value.search.trim()
      }

      if (filters.value.status) {
        params.status = filters.value.status
      }

      const response: ContactAdminListResponse = await contactApi.getAdminContacts(params)

      contacts.value = response.data
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
        per_page: response.per_page,
        from: response.from,
        to: response.to
      }

      return response
    } catch (error: any) {
      console.error('Error loading contacts:', error)
      showToast('Có lỗi xảy ra khi tải danh sách liên hệ', 'error')
      throw error
    } finally {
      loading.value = false
    }
  }

  const getContact = async (id: number) => {
    try {
      const response = await contactApi.getAdminContact(id)
      return response.data
    } catch (error: any) {
      console.error('Error getting contact:', error)
      showToast('Có lỗi xảy ra khi tải chi tiết liên hệ', 'error')
      throw error
    }
  }

  const updateContactStatus = async (contactId: number, status: 'pending' | 'resolved') => {
    try {
      updating.value = true

      const response = await contactApi.updateContactStatus(contactId, { status })

      if (response.success) {
        const statusText = status === 'resolved' ? 'đã giải quyết' : 'chờ xử lý'
        showToast(`Đã đánh dấu liên hệ là ${statusText}`, 'success')

        // Update local data
        const index = contacts.value.findIndex(c => c.id === contactId)
        if (index !== -1) {
          contacts.value[index].status = status
          contacts.value[index].updated_at = response.data.updated_at
        }

        // Update selected contact if viewing detail
        if (selectedContact.value && selectedContact.value.id === contactId) {
          selectedContact.value.status = status
          selectedContact.value.updated_at = response.data.updated_at
        }

        return response.data
      }
    } catch (error: any) {
      console.error('Error updating contact status:', error)
      showToast('Có lỗi xảy ra khi cập nhật trạng thái', 'error')
      throw error
    } finally {
      updating.value = false
    }
  }

  const markAsResolved = (contactId: number) => {
    return updateContactStatus(contactId, 'resolved')
  }

  const markAsPending = (contactId: number) => {
    return updateContactStatus(contactId, 'pending')
  }

  const deleteContact = async (contactId: number) => {
    try {
      deleting.value = true

      const response = await contactApi.deleteContact(contactId)

      if (response.success) {
        showToast('Đã xóa liên hệ thành công', 'success')

        // Remove from local data
        contacts.value = contacts.value.filter(c => c.id !== contactId)

        // Update pagination total
        if (pagination.value) {
          pagination.value.total = Math.max(0, pagination.value.total - 1)
        }

        // Reset selected contact if it was deleted
        if (selectedContact.value && selectedContact.value.id === contactId) {
          selectedContact.value = null
        }

        return true
      }
    } catch (error: any) {
      console.error('Error deleting contact:', error)
      showToast('Có lỗi xảy ra khi xóa liên hệ', 'error')
      throw error
    } finally {
      deleting.value = false
    }
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      status: '',
      per_page: 15,
      page: 1
    }
  }

  const changePage = (page: number) => {
    if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
      filters.value.page = page
      return loadContacts()
    }
  }

  const searchContacts = (searchTerm: string) => {
    filters.value.search = searchTerm
    filters.value.page = 1
    return loadContacts()
  }

  const filterByStatus = (status: string) => {
    filters.value.status = status
    filters.value.page = 1
    return loadContacts()
  }

  // Status helpers
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Đang chờ',
      resolved: 'Đã giải quyết'
    }
    return statusMap[status] || status
  }

  const getStatusBadgeClass = (status: string) => {
    const classMap: Record<string, string> = {
      pending: 'bg-warning',
      resolved: 'bg-success'
    }
    return classMap[status] || 'bg-secondary'
  }

  // Format helpers
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`
  }

  return {
    // State
    contacts,
    selectedContact,
    pagination,
    loading,
    updating,
    deleting,
    filters,

    // Computed
    totalContacts,
    hasContacts,
    isFirstPage,
    isLastPage,

    // Methods
    loadContacts,
    getContact,
    updateContactStatus,
    markAsResolved,
    markAsPending,
    deleteContact,
    resetFilters,
    changePage,
    searchContacts,
    filterByStatus,

    // Helpers
    getStatusText,
    getStatusBadgeClass,
    formatDate,
    formatTime,
    formatDateTime
  }
}
