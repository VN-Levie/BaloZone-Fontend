import { ref, reactive } from 'vue'
import { adminNewsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import type { News, PaginatedResponse } from '@/types'

export function useAdminNews() {
  const { showToast } = useToast()

  // State
  const news = ref<News[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const deleting = ref(false)
  const searchTerm = ref('')
  const currentPage = ref(1)
  const perPage = ref(10)

  // Pagination
  const pagination = ref({
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 10,
    last_page: 1
  })

  // Form state
  const form = reactive({
    title: '',
    description: '',
    thumbnail: '',
    content: '',
    is_published: false
  })

  const errors = ref<Record<string, string[]>>({})

  // Methods
  const loadNews = async (params?: {
    search?: string
    page?: number
    per_page?: number
  }) => {
    try {
      loading.value = true
      const response = await adminNewsApi.getNews({
        search: params?.search || searchTerm.value || undefined,
        page: params?.page || currentPage.value,
        per_page: params?.per_page || perPage.value
      })

      news.value = response.data || []
      pagination.value = {
        current_page: response.current_page,
        from: response.from,
        to: response.to,
        total: response.total,
        per_page: response.per_page,
        last_page: response.last_page
      }
    } catch (error: any) {
      console.error('Failed to load news:', error)
      showToast('Không thể tải danh sách tin tức', 'error')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createNews = async (newsData: {
    title: string
    description: string
    thumbnail?: File | string
    content?: string
    is_published?: boolean
  }) => {
    try {
      submitting.value = true
      errors.value = {}

      // Convert data for API call
      const apiData = {
        title: newsData.title,
        description: newsData.description,
        content: newsData.content,
        is_published: newsData.is_published,
        thumbnail: newsData.thumbnail instanceof File ? newsData.thumbnail : undefined
      }

      await adminNewsApi.createNews(apiData)
      showToast('Tạo tin tức thành công', 'success')

      // Reload news list
      await loadNews()
    } catch (error: any) {
      console.error('Failed to create news:', error)

      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else {
        showToast('Không thể tạo tin tức', 'error')
      }
      throw error
    } finally {
      submitting.value = false
    }
  }

  const updateNews = async (id: number, newsData: {
    title?: string
    description?: string
    thumbnail?: File | string
    content?: string
    is_published?: boolean
  }) => {
    try {
      submitting.value = true
      errors.value = {}

      // Check if we need to upload a file
      if (newsData.thumbnail instanceof File) {
        // Use the file upload endpoint
        const apiData = {
          title: newsData.title,
          description: newsData.description,
          content: newsData.content,
          is_published: newsData.is_published,
          thumbnail: newsData.thumbnail
        }
        await adminNewsApi.updateNewsWithFile(id, apiData)
      } else {
        // Use the JSON endpoint (no file upload)
        const apiData = {
          title: newsData.title,
          description: newsData.description,
          content: newsData.content,
          is_published: newsData.is_published
        }
        await adminNewsApi.updateNews(id, apiData)
      }

      showToast('Cập nhật tin tức thành công', 'success')

      // Reload news list
      await loadNews()
    } catch (error: any) {
      console.error('Failed to update news:', error)

      if (error.response?.data?.errors) {
        errors.value = error.response.data.errors
      } else {
        showToast('Không thể cập nhật tin tức', 'error')
      }
      throw error
    } finally {
      submitting.value = false
    }
  }

  const deleteNews = async (id: number) => {
    try {
      deleting.value = true
      await adminNewsApi.deleteNews(id)
      showToast('Xóa tin tức thành công', 'success')

      // Reload news list
      await loadNews()
    } catch (error: any) {
      console.error('Failed to delete news:', error)
      showToast('Không thể xóa tin tức', 'error')
      throw error
    } finally {
      deleting.value = false
    }
  }

  const resetForm = () => {
    form.title = ''
    form.description = ''
    form.thumbnail = ''
    form.content = ''
    form.is_published = false
    errors.value = {}
  }

  const setFormData = (newsItem: News) => {
    form.title = newsItem.title
    form.description = newsItem.description
    form.thumbnail = newsItem.thumbnail || ''
    form.content = newsItem.content || ''
    form.is_published = newsItem.is_published || false
  }

  const resetFilters = () => {
    searchTerm.value = ''
    currentPage.value = 1
    perPage.value = 10
  }

  // Load single news for editing
  const loadNewsById = async (id: number): Promise<News | null> => {
    try {
      loading.value = true
      const response = await adminNewsApi.getNewsById(id)
      return response.data
    } catch (error: any) {
      console.error('Failed to load news:', error)
      showToast('Không thể tải thông tin tin tức', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    // State
    news,
    loading,
    submitting,
    deleting,
    searchTerm,
    currentPage,
    perPage,
    pagination,
    form,
    errors,

    // Methods
    loadNews,
    loadNewsById,
    createNews,
    updateNews,
    deleteNews,
    resetForm,
    setFormData,
    resetFilters,
    formatDate
  }
}
