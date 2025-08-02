import { ref, computed } from 'vue'
import type { ContactAdmin } from '@/types'

export function useContactFilters() {
  // Filter state
  const searchQuery = ref('')
  const statusFilter = ref('')
  const dateFilter = ref('')
  const sortBy = ref('created_at')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  // Filter functions
  const filterContacts = (contacts: ContactAdmin[]) => {
    let filtered = [...contacts]

    // Search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(contact =>
        contact.fullname.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.message.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter.value) {
      filtered = filtered.filter(contact => contact.status === statusFilter.value)
    }

    // Date filter
    if (dateFilter.value) {
      const today = new Date()
      const filterDate = new Date(today)

      switch (dateFilter.value) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(contact => {
            const contactDate = new Date(contact.created_at)
            contactDate.setHours(0, 0, 0, 0)
            return contactDate.getTime() === filterDate.getTime()
          })
          break
        case 'week':
          filterDate.setDate(today.getDate() - 7)
          filtered = filtered.filter(contact =>
            new Date(contact.created_at) >= filterDate
          )
          break
        case 'month':
          filterDate.setMonth(today.getMonth() - 1)
          filtered = filtered.filter(contact =>
            new Date(contact.created_at) >= filterDate
          )
          break
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy.value as keyof ContactAdmin]
      let bValue: any = b[sortBy.value as keyof ContactAdmin]

      // Handle date sorting
      if (sortBy.value === 'created_at' || sortBy.value === 'updated_at') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  // Stats computed
  const getFilteredStats = (contacts: ContactAdmin[]) => {
    const filtered = filterContacts(contacts)

    return {
      total: filtered.length,
      pending: filtered.filter(c => c.status === 'pending').length,
      resolved: filtered.filter(c => c.status === 'resolved').length,
      today: filtered.filter(c => {
        const today = new Date().toDateString()
        const contactDate = new Date(c.created_at).toDateString()
        return contactDate === today
      }).length
    }
  }

  // Quick filter actions
  const setStatusFilter = (status: string) => {
    statusFilter.value = status
  }

  const setDateFilter = (period: string) => {
    dateFilter.value = period
  }

  const clearFilters = () => {
    searchQuery.value = ''
    statusFilter.value = ''
    dateFilter.value = ''
    sortBy.value = 'created_at'
    sortOrder.value = 'desc'
  }

  const setSorting = (field: string, order: 'asc' | 'desc' = 'desc') => {
    sortBy.value = field
    sortOrder.value = order
  }

  return {
    // State
    searchQuery,
    statusFilter,
    dateFilter,
    sortBy,
    sortOrder,

    // Methods
    filterContacts,
    getFilteredStats,
    setStatusFilter,
    setDateFilter,
    clearFilters,
    setSorting
  }
}
