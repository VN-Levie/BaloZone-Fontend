<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="shareModalLabel" aria-hidden="true" @click="onBackdropClick">
    <div class="modal-dialog modal-dialog-centered" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="shareModalLabel">
            <i class="bi bi-share me-2"></i>
            Chia sẻ sản phẩm
          </h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="share-preview mb-4">
            <div class="row">
              <div class="col-4">
                <img :src="product.image" :alt="product.name" class="img-fluid rounded">
              </div>
              <div class="col-8">
                <h6 class="mb-2">{{ product.name }}</h6>
                <p class="text-primary fw-bold mb-0">{{ formatPrice(product.price) }}</p>
              </div>
            </div>
          </div>
          
          <div class="share-options">
            <h6 class="mb-3">Chọn cách chia sẻ:</h6>
            
            <!-- Copy Link -->
            <div class="share-option mb-3">
              <button 
                class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-start"
                @click="copyToClipboard"
                :disabled="isCopying"
              >
                <i class="bi bi-link-45deg me-3" style="font-size: 1.2rem;"></i>
                <div class="flex-grow-1 text-start">
                  <div class="fw-medium">
                    {{ isCopying ? 'Đã sao chép!' : 'Sao chép liên kết' }}
                  </div>
                  <small class="text-muted">
                    {{ isCopying ? 'Liên kết đã được sao chép' : 'Sao chép URL để chia sẻ' }}
                  </small>
                </div>
                <i v-if="isCopying" class="bi bi-check-circle-fill text-success"></i>
              </button>
            </div>
            
            <!-- Facebook -->
            <div class="share-option mb-3">
              <button 
                class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-start"
                @click="shareToFacebook"
              >
                <i class="bi bi-facebook me-3 text-primary" style="font-size: 1.2rem;"></i>
                <div class="flex-grow-1 text-start">
                  <div class="fw-medium">Facebook</div>
                  <small class="text-muted">Chia sẻ lên Facebook</small>
                </div>
                <i class="bi bi-arrow-up-right"></i>
              </button>
            </div>
            
            <!-- Twitter/X -->
            <div class="share-option mb-3">
              <button 
                class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-start"
                @click="shareToTwitter"
              >
                <i class="bi bi-twitter-x me-3" style="font-size: 1.2rem;"></i>
                <div class="flex-grow-1 text-start">
                  <div class="fw-medium">X (Twitter)</div>
                  <small class="text-muted">Chia sẻ lên X</small>
                </div>
                <i class="bi bi-arrow-up-right"></i>
              </button>
            </div>
            
            <!-- WhatsApp (bonus) -->
            <div class="share-option mb-3">
              <button 
                class="btn btn-outline-success w-100 d-flex align-items-center justify-content-start"
                @click="shareToWhatsApp"
              >
                <i class="bi bi-whatsapp me-3 text-success" style="font-size: 1.2rem;"></i>
                <div class="flex-grow-1 text-start">
                  <div class="fw-medium">WhatsApp</div>
                  <small class="text-muted">Chia sẻ qua WhatsApp</small>
                </div>
                <i class="bi bi-arrow-up-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '@/types'
import { formatPrice } from '@/utils'

interface Props {
  product: Product
  modalId?: string
}

const props = withDefaults(defineProps<Props>(), {
  modalId: 'shareModal'
})

const isCopying = ref(false)

// Generate URLs
const currentUrl = computed(() => {
  return window.location.href
})

const shareText = computed(() => {
  return `Xem sản phẩm ${props.product.name} với giá ${formatPrice(props.product.price)} tại BaloZone!`
})

// Methods
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    isCopying.value = true
    
    // Reset after 2 seconds
    setTimeout(() => {
      isCopying.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = currentUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    isCopying.value = true
    setTimeout(() => {
      isCopying.value = false
    }, 2000)
  }
}

const shareToFacebook = () => {
  const url = encodeURIComponent(currentUrl.value)
  const text = encodeURIComponent(shareText.value)
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
  window.open(facebookUrl, '_blank', 'width=600,height=400')
}

const shareToTwitter = () => {
  const url = encodeURIComponent(currentUrl.value)
  const text = encodeURIComponent(shareText.value)
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
  window.open(twitterUrl, '_blank', 'width=600,height=400')
}

const shareToWhatsApp = () => {
  const text = encodeURIComponent(`${shareText.value} ${currentUrl.value}`)
  const whatsappUrl = `https://wa.me/?text=${text}`
  window.open(whatsappUrl, '_blank')
}

const closeModal = () => {
  const modalElement = document.getElementById(props.modalId)
  if (modalElement) {
    modalElement.classList.remove('show')
    modalElement.style.display = 'none'
    document.body.classList.remove('modal-open')
    
    // Remove backdrop
    const backdrop = document.getElementById('shareModalBackdrop')
    if (backdrop) {
      backdrop.remove()
    }
  }
}

const onBackdropClick = () => {
  closeModal()
}
</script>

<style scoped>
.share-preview {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.share-option {
  transition: all 0.2s ease;
}

.share-option:hover {
  transform: translateY(-1px);
}

.share-option .btn {
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.share-option .btn:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-title {
  font-weight: 600;
  color: #495057;
}

/* Add smooth transitions */
.modal.fade .modal-dialog {
  transition: transform 0.3s ease-out;
  transform: translate(0, -50px);
}

.modal.show .modal-dialog {
  transform: none;
}

/* Custom backdrop */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Success animation for copy */
@keyframes successPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.bi-check-circle-fill {
  animation: successPulse 0.6s ease-in-out;
}
</style>
