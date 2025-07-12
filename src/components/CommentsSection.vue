<template>
  <div class="comments-section">
    <!-- Comments Summary -->
    <div class="comments-summary mb-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h4 class="comments-title">
            <i class="bi bi-chat-dots"></i>
            Đánh giá & Bình luận
            <span class="comments-count">({{ totalComments }})</span>
          </h4>
        </div>
        <div class="col-md-6 text-end">
          <div v-if="hasComments" class="rating-summary">
            <div class="average-rating">
              <span class="rating-score">{{ averageRating }}</span>
              <div class="rating-stars">
                <i 
                  v-for="i in 5" 
                  :key="i"
                  class="bi bi-star-fill"
                  :class="{ 'active': i <= Math.floor(averageRating) }"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Rating Distribution -->
      <div v-if="hasComments" class="rating-distribution mt-3">
        <div class="row">
          <div 
            v-for="rating in [5, 4, 3, 2, 1]" 
            :key="rating"
            class="col"
          >
            <div class="rating-bar">
              <div class="rating-label">
                <span>{{ rating }}</span>
                <i class="bi bi-star-fill"></i>
              </div>
              <div class="progress">
                <div 
                  class="progress-bar"
                  :style="{ width: getRatingPercentage(rating) + '%' }"
                ></div>
              </div>
              <small class="rating-count">{{ ratingDistribution[rating as keyof typeof ratingDistribution] }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comment Form -->
    <div v-if="canComment" class="comment-form mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Viết đánh giá của bạn</h5>
          <form @submit.prevent="submitCommentForm">
            <!-- Rating Input -->
            <div class="mb-3">
              <label class="form-label">Đánh giá:</label>
              <div class="rating-input">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  class="star-btn"
                  :class="{ 'active': star <= newComment.rating }"
                  @click="newComment.rating = star"
                >
                  <i class="bi bi-star-fill"></i>
                </button>
              </div>
            </div>
            
            <!-- Comment Text -->
            <div class="mb-3">
              <label for="comment-content" class="form-label">Bình luận:</label>
              <textarea
                id="comment-content"
                v-model="newComment.content"
                class="form-control"
                rows="4"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                required
              ></textarea>
            </div>
            
            <div class="d-flex justify-content-end">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting || !newComment.content.trim() || newComment.rating === 0"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Login Prompt -->
    <div v-else class="login-prompt mb-4">
      <div class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        <router-link to="/login" class="alert-link">Đăng nhập</router-link> 
        để viết đánh giá và bình luận về sản phẩm này.
      </div>
    </div>

    <!-- Comments List -->
    <div class="comments-list">
      <!-- Loading State -->
      <div v-if="isLoading && !hasComments" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải bình luận...</span>
        </div>
      </div>
      
      <!-- No Comments -->
      <div v-else-if="!hasComments && !isLoading" class="no-comments text-center py-5">
        <i class="bi bi-chat-square-dots display-1 text-muted"></i>
        <h5 class="mt-3 text-muted">Chưa có bình luận nào</h5>
        <p class="text-muted">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
      </div>
      
      <!-- Comments -->
      <div v-else>
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="comment-item"
        >
          <div class="d-flex">
            <!-- Avatar -->
            <div class="comment-avatar me-3">
              <div class="avatar-circle">
                {{ getInitials(comment.user.name) }}
              </div>
            </div>
            
            <!-- Comment Content -->
            <div class="comment-content flex-grow-1">
              <div class="comment-header">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="comment-author">{{ comment.user.name }}</h6>
                    <div class="comment-rating">
                      <i 
                        v-for="i in 5" 
                        :key="i"
                        class="bi bi-star-fill"
                        :class="{ 'active': i <= comment.rating }"
                      ></i>
                    </div>
                    <small class="comment-date text-muted">
                      {{ formatCommentDate(comment.created_at) }}
                    </small>
                  </div>
                  
                  <!-- Actions -->
                  <div v-if="canEditComment(comment) || canDeleteComment(comment)" class="comment-actions">
                    <div class="dropdown">
                      <button 
                        class="btn btn-sm btn-ghost"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i class="bi bi-three-dots"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li v-if="canEditComment(comment)">
                          <button 
                            class="dropdown-item"
                            @click="startEditComment(comment)"
                          >
                            <i class="bi bi-pencil me-2"></i>Chỉnh sửa
                          </button>
                        </li>
                        <li v-if="canDeleteComment(comment)">
                          <button 
                            class="dropdown-item text-danger"
                            @click="confirmDeleteComment(comment.id)"
                          >
                            <i class="bi bi-trash me-2"></i>Xóa
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Edit Form -->
              <div v-if="editingComment && editingComment.id === comment.id" class="edit-form mt-2">
                <form @submit.prevent="saveEditComment">
                  <div class="mb-2">
                    <div class="rating-input">
                      <button
                        v-for="star in 5"
                        :key="star"
                        type="button"
                        class="star-btn"
                        :class="{ 'active': star <= editingComment.rating }"
                        @click="editingComment.rating = star"
                      >
                        <i class="bi bi-star-fill"></i>
                      </button>
                    </div>
                  </div>
                  <div class="mb-2">
                    <textarea
                      v-model="editingComment.content"
                      class="form-control"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-sm btn-primary">
                      Lưu
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-secondary"
                      @click="cancelEdit"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
              
              <!-- Comment Text -->
              <div v-else class="comment-text mt-2">
                <p>{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Load More -->
        <div v-if="pagination.currentPage < pagination.lastPage" class="text-center mt-4">
          <button 
            class="btn btn-outline-primary"
            @click="loadMoreComments"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? 'Đang tải...' : 'Xem thêm bình luận' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useComments } from '@/composables/useComments'
import type { Comment } from '@/types'

interface Props {
  productId: number
}

const props = defineProps<Props>()

const {
  comments,
  isLoading,
  isSubmitting,
  pagination,
  hasComments,
  totalComments,
  averageRating,
  ratingDistribution,
  canComment,
  fetchComments,
  submitComment,
  updateComment,
  deleteComment,
  loadMoreComments,
  canEditComment,
  canDeleteComment,
  formatCommentDate
} = useComments(props.productId)

// Form state
const newComment = ref({
  content: '',
  rating: 0
})

const editingComment = ref<{
  id: number
  content: string
  rating: number
} | null>(null)

// Methods
const submitCommentForm = async () => {
  const success = await submitComment({
    content: newComment.value.content,
    rating: newComment.value.rating
  })
  
  if (success) {
    newComment.value = { content: '', rating: 0 }
  }
}

const startEditComment = (comment: Comment) => {
  editingComment.value = {
    id: comment.id,
    content: comment.content,
    rating: comment.rating
  }
}

const saveEditComment = async () => {
  if (!editingComment.value) return
  
  const success = await updateComment(editingComment.value.id, {
    content: editingComment.value.content,
    rating: editingComment.value.rating
  })
  
  if (success) {
    editingComment.value = null
  }
}

const cancelEdit = () => {
  editingComment.value = null
}

const confirmDeleteComment = async (commentId: number) => {
  if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
    await deleteComment(commentId)
  }
}

const getRatingPercentage = (rating: number) => {
  if (totalComments.value === 0) return 0
  return (ratingDistribution.value[rating as keyof typeof ratingDistribution.value] / totalComments.value) * 100
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comments-section {
  margin-top: 2rem;
}

.comments-title {
  color: #333;
  margin: 0;
}

.comments-count {
  color: #666;
  font-weight: normal;
}

.rating-summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-score {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f39c12;
}

.rating-stars i {
  color: #ddd;
  font-size: 0.9rem;
}

.rating-stars i.active {
  color: #f39c12;
}

.rating-distribution {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.rating-bar:last-child {
  margin-bottom: 0;
}

.rating-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 30px;
  font-size: 0.9rem;
}

.rating-label i {
  color: #f39c12;
  font-size: 0.8rem;
}

.progress {
  flex: 1;
  height: 8px;
  background: #e9ecef;
}

.progress-bar {
  background: #f39c12;
  height: 100%;
  transition: width 0.3s ease;
}

.rating-count {
  min-width: 20px;
  text-align: right;
  color: #666;
}

.rating-input {
  display: flex;
  gap: 0.25rem;
}

.star-btn {
  background: none;
  border: none;
  color: #ddd;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-btn:hover,
.star-btn.active {
  color: #f39c12;
  transform: scale(1.1);
}

.comment-item {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 1rem;
}

.comment-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.comment-avatar .avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.comment-author {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.comment-rating {
  margin-bottom: 0.25rem;
}

.comment-rating i {
  color: #ddd;
  font-size: 0.8rem;
  margin-right: 0.1rem;
}

.comment-rating i.active {
  color: #f39c12;
}

.comment-date {
  font-size: 0.85rem;
}

.comment-actions .btn-ghost {
  border: none;
  background: none;
  color: #666;
}

.comment-actions .btn-ghost:hover {
  background: #f8f9fa;
  color: #333;
}

.comment-text p {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

.edit-form {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.no-comments i {
  opacity: 0.3;
}

/* Responsive */
@media (max-width: 768px) {
  .rating-summary {
    justify-content: flex-start;
    margin-top: 1rem;
  }
  
  .rating-distribution .col {
    margin-bottom: 0.5rem;
  }
  
  .comment-item {
    padding: 1rem;
  }
  
  .comment-avatar .avatar-circle {
    width: 40px;
    height: 40px;
    font-size: 0.8rem;
  }
}
</style>
