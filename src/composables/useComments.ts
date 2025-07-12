import { ref, computed } from 'vue'
import { commentsApi } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import type { Comment, CommentRequest, CommentsResponse } from '@/types'

export function useComments(productId?: number) {
  const { user, isAuthenticated } = useAuth()
  const { showSuccess, showError } = useToast()

  // Reactive state
  const comments = ref<Comment[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
  })
  const error = ref<string | null>(null)

  // Computed properties
  const hasComments = computed(() => comments.value.length > 0)
  const totalComments = computed(() => pagination.value.total)
  const averageRating = computed(() => {
    if (comments.value.length === 0) return 0
    const sum = comments.value.reduce((acc, comment) => acc + comment.rating, 0)
    return Math.round((sum / comments.value.length) * 10) / 10
  })
  
  const ratingDistribution = computed(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    comments.value.forEach(comment => {
      distribution[comment.rating as keyof typeof distribution]++
    })
    return distribution
  })

  const canComment = computed(() => isAuthenticated.value)

  // Actions
  const fetchComments = async (page = 1) => {
    if (!productId) {
      error.value = 'Product ID is required'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await commentsApi.getProductComments(productId, {
        page,
        per_page: pagination.value.perPage
      })
      
      comments.value = response.data
      pagination.value = {
        currentPage: response.current_page,
        lastPage: response.last_page,
        total: response.total,
        perPage: response.per_page
      }
    } catch (err: any) {
      error.value = 'Không thể tải bình luận. Vui lòng thử lại sau.'
      console.error('Error fetching comments:', err)
    } finally {
      isLoading.value = false
    }
  }

  const submitComment = async (commentData: CommentRequest) => {
    if (!productId) {
      showError('Lỗi', 'Product ID is required')
      return false
    }

    if (!canComment.value) {
      showError('Lỗi', 'Bạn cần đăng nhập để bình luận')
      return false
    }

    isSubmitting.value = true
    error.value = null

    try {
      const response = await commentsApi.createProductComment(productId, commentData)
      
      // Add new comment to the beginning of the list
      comments.value.unshift(response.data)
      pagination.value.total++
      
      showSuccess('Thành công', 'Bình luận của bạn đã được gửi!')
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể gửi bình luận. Vui lòng thử lại sau.'
      showError('Lỗi', errorMessage)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateComment = async (commentId: number, commentData: CommentRequest) => {
    if (!canComment.value) {
      showError('Lỗi', 'Bạn cần đăng nhập để chỉnh sửa bình luận')
      return false
    }

    try {
      const response = await commentsApi.updateComment(commentId, commentData)
      
      // Update comment in the list
      const index = comments.value.findIndex(c => c.id === commentId)
      if (index !== -1) {
        comments.value[index] = response.data
      }
      
      showSuccess('Thành công', 'Bình luận đã được cập nhật!')
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể cập nhật bình luận. Vui lòng thử lại sau.'
      showError('Lỗi', errorMessage)
      return false
    }
  }

  const deleteComment = async (commentId: number) => {
    if (!canComment.value) {
      showError('Lỗi', 'Bạn cần đăng nhập để xóa bình luận')
      return false
    }

    try {
      await commentsApi.deleteComment(commentId)
      
      // Remove comment from the list
      comments.value = comments.value.filter(c => c.id !== commentId)
      pagination.value.total--
      
      showSuccess('Thành công', 'Bình luận đã được xóa!')
      return true
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể xóa bình luận. Vui lòng thử lại sau.'
      showError('Lỗi', errorMessage)
      return false
    }
  }

  const loadMoreComments = async () => {
    if (pagination.value.currentPage < pagination.value.lastPage) {
      await fetchComments(pagination.value.currentPage + 1)
    }
  }

  const canEditComment = (comment: Comment) => {
    return user.value && user.value.id === comment.user_id
  }

  const canDeleteComment = (comment: Comment) => {
    return user.value && (user.value.id === comment.user_id || user.value.roles?.some(role => role.name === 'admin'))
  }

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    
    return date.toLocaleDateString('vi-VN')
  }

  return {
    // State
    comments,
    isLoading,
    isSubmitting,
    pagination,
    error,

    // Computed
    hasComments,
    totalComments,
    averageRating,
    ratingDistribution,
    canComment,

    // Actions
    fetchComments,
    submitComment,
    updateComment,
    deleteComment,
    loadMoreComments,

    // Helpers
    canEditComment,
    canDeleteComment,
    formatCommentDate
  }
}
