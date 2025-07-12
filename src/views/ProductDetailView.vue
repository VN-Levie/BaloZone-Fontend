<template>
  <div class="product-detail">
    <!-- Loading spinner -->
    <LoadingSpinner v-if="loading" text="Đang tải thông tin sản phẩm..." size="lg" />

    <!-- Product not found -->
    <div v-else-if="!product" class="container text-center py-5">
      <div class="alert alert-warning">
        <h4>Sản phẩm không tồn tại</h4>
        <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <router-link to="/" class="btn btn-primary">Về trang chủ</router-link>
      </div>
    </div>

    <!-- Product content -->
    <div v-else class="container">
      <!-- Navigation breadcrumb -->
      <nav aria-label="breadcrumb" class="py-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Trang chủ</router-link>
          </li>
          <li class="breadcrumb-item" v-if="product.category">
            <router-link :to="`/category/${product.category.slug}`" class="text-decoration-none">
              {{ product.category.name }}
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
        </ol>
      </nav>

      <!-- Product main content -->
      <div class="row">
        <!-- Product images -->
        <div class="col-lg-6">
          <div class="product-images">
            <ImageZoom 
              :images="productImages" 
              :alt="product.name"
              :initial-index="0"
            />
          </div>
        </div>

        <!-- Product info -->
        <div class="col-lg-6">
          <div class="product-info">
            <h1 class="product-title h2 mb-3">{{ product.name }}</h1>

            <!-- Rating -->
            <div class="product-rating mb-3">
              <div class="stars">
                <span class="ms-2 text-muted">({{ totalComments }} đánh giá)</span>
              </div>
            </div>

            <!-- Price -->
            <div class="product-price mb-4">
              <div class="current-price h3 text-danger fw-bold mb-1">
                {{ formatPrice(product.price) }}
              </div>
            </div>

            <!-- Product options -->
            <div class="product-options mb-4">
              <!-- Quantity -->
              <div class="option-group mb-3">
                <label class="option-label fw-semibold mb-2">Số lượng:</label>
                <div class="quantity-controls d-flex align-items-center">
                  <button class="btn btn-outline-secondary btn-sm" @click="decreaseQuantity" :disabled="quantity <= 1">
                    <i class="bi bi-dash"></i>
                  </button>
                  <input type="number" v-model="quantity" class="form-control quantity-input mx-2 text-center" min="1" :max="product.quantity" />
                  <button class="btn btn-outline-secondary btn-sm" @click="increaseQuantity" :disabled="quantity >= product.quantity">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Stock status -->
            <div class="stock-status mb-3">
              <span class="badge" :class="product.quantity > 0 ? 'bg-success' : 'bg-danger'">
                {{ product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : 'Hết hàng' }}
              </span>
            </div>

            <!-- Action buttons -->
            <div class="product-actions">
              <button 
                class="btn btn-primary btn-lg me-3 mb-2" 
                @click="addToCart" 
                :disabled="product.quantity === 0 || isAddingToCart"
              >
                <span v-if="isAddingToCart" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-cart-plus me-2"></i>
                {{ isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
              </button>
              
              <button 
                class="btn btn-lg me-2 mb-2 wishlist-btn" 
                @click="toggleWishlistHandler"
                :class="isInWishlistComputed ? 'btn-danger' : 'btn-outline-danger'"
              >
                <i class="bi me-2" :class="isInWishlistComputed ? 'bi-heart-fill' : 'bi-heart'"></i>
                {{ isInWishlistComputed ? 'Đã yêu thích' : 'Yêu thích' }}
              </button>
              
              <button 
                class="btn btn-outline-success btn-lg mb-2"
                @click="openShareModal"
              >
                <i class="bi bi-share me-2"></i>
                Chia sẻ
              </button>
            </div>

            <!-- Quick info -->
            <div class="quick-info mt-4">
              <div class="info-item d-flex align-items-center mb-2">
                <i class="bi bi-truck text-primary me-2"></i>
                <span>Miễn phí vận chuyển đơn hàng từ 500.000đ</span>
              </div>
              <div class="info-item d-flex align-items-center mb-2">
                <i class="bi bi-arrow-clockwise text-primary me-2"></i>
                <span>Đổi trả miễn phí trong 30 ngày</span>
              </div>
              <div class="info-item d-flex align-items-center mb-2">
                <i class="bi bi-shield-check text-primary me-2"></i>
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div class="info-item d-flex align-items-center mb-2">
                <i class="bi bi-award text-primary me-2"></i>
                <span>Cam kết 100% hàng chính hãng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product tabs -->
      <div class="product-tabs mt-5">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">
              Mô tả sản phẩm
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">
              Đánh giá ({{ totalComments }})
            </button>
          </li>
        </ul>

        <div class="tab-content mt-3">
          <!-- Description tab -->
          <div class="tab-pane fade show active" id="description" role="tabpanel">
            <div class="description-content" v-html="product.description"></div>
          </div>

          <!-- Reviews tab -->
          <div class="tab-pane fade" id="reviews" role="tabpanel">
            <CommentsSection :product-id="product.id" />
          </div>
        </div>
      </div>

      <!-- Related products -->
      <div class="related-products mt-5">
        <h3 class="mb-4">Sản phẩm liên quan</h3>
        <div class="row">
          <div v-for="relatedProd in relatedProducts" :key="relatedProd.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card product-card h-100">
              <router-link :to="relatedProd.slug ? `/product/slug/${relatedProd.slug}` : `/product/${relatedProd.id}`" class="text-decoration-none">
                <img :src="getImageUrl(relatedProd.image)" :alt="relatedProd.name" class="card-img-top" />
                <div class="card-body">
                  <h6 class="card-title">{{ relatedProd.name }}</h6>
                  <div class="price">
                    <span class="current-price text-danger fw-bold">{{ formatPrice(relatedProd.price) }}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Share Modal -->
  <ShareModal v-if="product" :product="product" modal-id="shareModal" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productsApi } from '@/services/api'
import type { Product, Comment } from '@/types'
import { formatPrice, formatDate, getImageUrl } from '@/utils'
import { useCart } from '@/composables/useCart'
import { useWishlist } from '@/composables/useWishlist'
import { useComments } from '@/composables/useComments'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ShareModal from '@/components/ShareModal.vue'
import ImageZoom from '@/components/ImageZoom.vue'
import CommentsSection from '@/components/CommentsSection.vue'

const route = useRoute()
const { addToCart: addToCartComposable, isInCart } = useCart()
const { toggleWishlist, isInWishlist } = useWishlist()

// Determine if we're using slug or ID route
const isSlugRoute = computed(() => route.name === 'product-detail-slug')
const productId = computed(() => route.params.id as string)
const productSlug = computed(() => route.params.slug as string)

// Reactive data
const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])
const loading = ref(true)
const quantity = ref(1)
const isAddingToCart = ref(false)

// For compatibility with existing template
const reviews = ref<Comment[]>([])

const totalComments = computed(() => reviews.value.length)
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + (review.rating || 0), 0)
  return Math.round((sum / reviews.value.length) * 10) / 10
})

const fetchProduct = async (id: number) => {
  loading.value = true
  product.value = null
  try {
    const response = await productsApi.getProduct(id)
    product.value = response.data

    if (product.value.category?.slug) {
      const relatedResponse = await productsApi.getProductsByCategory(product.value.category.slug)
      relatedProducts.value = relatedResponse.data
        .filter((p) => p.id !== product.value?.id)
        .slice(0, 4)
    }
  } catch (error) {
    console.error('Failed to load product details:', error)
  } finally {
    loading.value = false
  }
}

const fetchProductBySlug = async (slug: string) => {
  loading.value = true
  product.value = null
  try {
    const response = await productsApi.getProductBySlug(slug)
    product.value = response.data

    if (product.value.category?.slug) {
      const relatedResponse = await productsApi.getProductsByCategory(product.value.category.slug)
      relatedProducts.value = relatedResponse.data
        .filter((p) => p.id !== product.value?.id)
        .slice(0, 4)
    }
  } catch (error) {
    console.error('Failed to load product details by slug:', error)
  } finally {
    loading.value = false
  }
}

// Product images array for zoom component
const productImages = computed(() => {
  if (!product.value) return []
  
  // Main product image
  const images = [getImageUrl(product.value.image)]
  
  // Add some sample gallery images for demo purposes
  // In a real app, these would come from product.gallery or similar
  if (product.value.image) {
    // Generate some additional sample images (placeholder for demo)
    const baseImage = getImageUrl(product.value.image)
    images.push(
      'https://via.placeholder.com/600x600.png/00aa55?text=Gallery+Image+2',
      'https://via.placeholder.com/600x600.png/aa0055?text=Gallery+Image+3',
      'https://via.placeholder.com/600x600.png/5500aa?text=Gallery+Image+4'
    )
  }
  
  return images
})

// Wishlist computed property
const isInWishlistComputed = computed(() => {
  return product.value ? isInWishlist(product.value.id) : false
})

// Methods
const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.quantity) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  if (!product.value) return

  isAddingToCart.value = true
  try {
    // Add to cart using composable
    addToCartComposable(product.value, quantity.value)
    console.log(`Added ${quantity.value} of ${product.value.name} to cart`)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  } finally {
    isAddingToCart.value = false
  }
}

const toggleWishlistHandler = () => {
  if (product.value) {
    console.log('Toggling wishlist for product:', product.value.id, product.value.name)
    toggleWishlist(product.value)
    console.log('Product is now in wishlist:', isInWishlist(product.value.id))
  }
}

const openShareModal = () => {
  // Use Bootstrap's modal API if available
  if (typeof window !== 'undefined' && (window as any).bootstrap) {
    const modalElement = document.getElementById('shareModal')
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement)
      modal.show()
    }
  } else {
    // Fallback: manually trigger the modal
    const modalElement = document.getElementById('shareModal')
    if (modalElement) {
      modalElement.classList.add('show')
      modalElement.style.display = 'block'
      document.body.classList.add('modal-open')
      
      // Add backdrop
      const backdrop = document.createElement('div')
      backdrop.className = 'modal-backdrop fade show'
      backdrop.id = 'shareModalBackdrop'
      document.body.appendChild(backdrop)
    }
  }
}

const initializeProduct = () => {
  if (isSlugRoute.value) {
    const slug = productSlug.value
    if (slug) {
      fetchProductBySlug(slug)
      quantity.value = 1
    }
  } else {
    const productIdNum = parseInt(productId.value)
    if (!isNaN(productIdNum)) {
      fetchProduct(productIdNum)
      quantity.value = 1
    }
  }
}

onMounted(() => {
  initializeProduct()
})

watch(
  () => [route.params.id, route.params.slug],
  () => {
    initializeProduct()
  }
)
</script>

<style scoped>
/* Override conflicting CSS from main.css for product detail page */
.product-actions {
  position: static !important;
  opacity: 1 !important;
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap;
  gap: 0 !important;
  top: auto !important;
  right: auto !important;
  z-index: auto !important;
  align-items: center;
}

.product-actions .btn {
  width: auto !important;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  font-weight: 500;
  border-radius: 8px;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

/* Wishlist button styling */
.wishlist-btn {
  min-width: 140px;
}

.wishlist-btn.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.wishlist-btn.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-1px);
}

.wishlist-btn.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.wishlist-btn.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
  transform: translateY(-1px);
}

/* For mobile, keep the sticky behavior but override other conflicting styles */
@media (max-width: 768px) {
  .product-actions {
    position: sticky !important;
    bottom: 0 !important;
    background: white !important;
    padding: 15px !important;
    border-top: 1px solid #dee2e6 !important;
    margin: 0 -15px !important;
    flex-direction: column !important;
    gap: 0 !important;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  }

  .product-actions .btn {
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 10px !important;
  }
  
  .wishlist-btn {
    min-width: auto;
  }
}
</style>
