<template>
  <UserLayout>
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
      <div v-else class="container py-4">
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
        <div class="product-detail-card">
          <div class="row g-4">
            <!-- Product images -->
            <div class="col-lg-6">
              <div class="product-images-section">
                <ImageZoom :images="productImages" :alt="product.name" :initial-index="0" />
              </div>
            </div>

            <!-- Product info -->
            <div class="col-lg-6">
              <div class="product-info-section">
                <!-- Product title -->
                <div class="product-header mb-4">
                  <h1 class="product-title">{{ product.name }}</h1>

                  <!-- Brand -->
                  <div v-if="product.brand" class="product-brand mb-3">
                    <span class="brand-badge">{{ product.brand.name }}</span>
                  </div>

                  <!-- Rating -->
                  <div class="product-rating-display mb-3">
                    <template v-if="totalComments > 0">
                      <div class="rating-content">
                        <div class="rating-stars">
                          <i v-for="i in 5" :key="i" class="bi bi-star-fill" :class="{ 'filled': i <= Math.floor(averageRating) }"></i>
                        </div>
                        <span class="rating-score">{{ averageRating.toFixed(1) }}</span>
                        <span class="rating-count">({{ totalComments }} đánh giá)</span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="no-rating">
                        <span class="text-muted">Chưa có đánh giá</span>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Price -->
                <div class="product-pricing mb-4">
                  <!-- Check for discount_price from new backend structure -->
                  <template v-if="product.discount_price && Number(product.discount_price) < Number(product.price)">
                    <div class="price-container">
                      <div class="current-price">
                        {{ formatPrice(Number(product.discount_price)) }}
                      </div>
                      <div class="original-price">
                        {{ formatPrice(Number(product.price)) }}
                      </div>
                      <div class="discount-badge">
                        -{{ Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100) }}%
                      </div>
                    </div>
                    <div class="save-amount">
                      Tiết kiệm {{ formatPrice(Number(product.price) - Number(product.discount_price)) }}
                    </div>
                  </template>
                  <!-- Regular pricing -->
                  <template v-else>
                    <div class="price-container">
                      <div class="current-price">
                        {{ formatPrice(Number(product.price)) }}
                      </div>
                    </div>
                  </template>
                </div>

                <!-- Stock status -->
                <div class="stock-status mb-4">
                  <div class="stock-info" :class="{ 'in-stock': product.stock > 0, 'out-of-stock': product.stock === 0 }">
                    <i class="bi bi-box-seam"></i>
                    <span>{{ product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng' }}</span>
                  </div>
                </div>

                <!-- Product options -->
                <div class="product-options mb-4">
                  <!-- Quantity -->
                  <div class="option-group">
                    <label class="option-label">Số lượng:</label>
                    <div class="quantity-selector">
                      <button class="quantity-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
                        <i class="bi bi-dash"></i>
                      </button>
                      <input type="number" v-model="quantity" class="quantity-input" min="1" :max="product.stock" />
                      <button class="quantity-btn" @click="increaseQuantity" :disabled="quantity >= product.stock">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="product-actions-detail mb-4"> <button class="btn-primary-action" @click="addToCartHandler" :disabled="product.stock === 0 || isAddingToCart">
                    <span v-if="isAddingToCart" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="bi bi-cart-plus me-2"></i>
                    {{ isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
                  </button>

                  <div class="secondary-actions">
                    <button class="btn-secondary-action wishlist-btn" @click="toggleWishlistHandler" :class="{ 'active': isInWishlistComputed }">
                      <i class="bi me-2" :class="isInWishlistComputed ? 'bi-heart-fill' : 'bi-heart'"></i>
                      {{ isInWishlistComputed ? 'Đã yêu thích' : 'Yêu thích' }}
                    </button>

                    <button class="btn-secondary-action share-btn" @click="openShareModal">
                      <i class="bi bi-share me-2"></i>
                      Chia sẻ
                    </button>
                  </div>
                </div>

                <!-- Product features -->
                <div class="product-features">
                  <div class="feature-item">
                    <i class="bi bi-truck"></i>
                    <span>Miễn phí vận chuyển đơn hàng từ 500.000đ</span>
                  </div>
                  <div class="feature-item">
                    <i class="bi bi-arrow-clockwise"></i>
                    <span>Đổi trả miễn phí trong 30 ngày</span>
                  </div>
                  <div class="feature-item">
                    <i class="bi bi-shield-check"></i>
                    <span>Bảo hành chính hãng 12 tháng</span>
                  </div>
                  <div class="feature-item">
                    <i class="bi bi-award"></i>
                    <span>Cam kết 100% hàng chính hãng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product tabs -->
        <div class="product-tabs-section mt-5">
          <div class="tabs-container">
            <ul class="nav nav-tabs modern-tabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">
                  <i class="bi bi-file-text me-2"></i>
                  Mô tả sản phẩm
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">
                  <i class="bi bi-star me-2"></i>
                  Đánh giá ({{ totalComments }})
                </button>
              </li>
            </ul>

            <div class="tab-content modern-tab-content">
              <!-- Description tab -->
              <div class="tab-pane fade show active" id="description" role="tabpanel">
                <div class="description-content">
                  <div class="content-card">
                    <div v-html="product.description"></div>
                  </div>
                </div>
              </div>

              <!-- Reviews tab -->
              <div class="tab-pane fade" id="reviews" role="tabpanel">
                <div class="reviews-content">
                  <CommentsSection :product-id="product.id" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related products -->
        <div class="related-products-section mt-5">
          <div class="section-header mb-4">
            <h3 class="section-title">
              <i class="bi bi-grid me-2"></i>
              Sản phẩm liên quan
            </h3>
            <div class="section-subtitle">Khám phá thêm các sản phẩm tương tự</div>
          </div>

          <div class="related-products-grid">
            <div v-for="relatedProd in relatedProducts" :key="relatedProd.id" class="related-product-item">
              <div class="product-card modern-card">
                <router-link :to="relatedProd.slug ? `/product/slug/${relatedProd.slug}` : `/product/${relatedProd.id}`" class="text-decoration-none">
                  <div class="card-image-container">
                    <img :src="getImageUrl(relatedProd.image)" :alt="relatedProd.name" class="card-image" />
                    <!-- Discount badge -->
                    <div v-if="relatedProd.discount_price && Number(relatedProd.discount_price) < Number(relatedProd.price)" class="card-discount-badge">
                      -{{ Math.round(((Number(relatedProd.price) - Number(relatedProd.discount_price)) / Number(relatedProd.price)) * 100) }}%
                    </div>
                  </div>
                  <div class="card-content">
                    <h6 class="card-title">{{ relatedProd.name }}</h6>
                    <div class="card-pricing">
                      <!-- Handle discount pricing -->
                      <template v-if="relatedProd.discount_price && Number(relatedProd.discount_price) < Number(relatedProd.price)">
                        <span class="current-price">{{ formatPrice(Number(relatedProd.discount_price)) }}</span>
                        <span class="original-price">{{ formatPrice(Number(relatedProd.price)) }}</span>
                      </template>
                      <template v-else>
                        <span class="current-price">{{ formatPrice(Number(relatedProd.price)) }}</span>
                      </template>
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
  </UserLayout>
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
import { useToast } from '@/composables/useToast'
import UserLayout from '@/components/layouts/UserLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ShareModal from '@/components/ShareModal.vue'
import ImageZoom from '@/components/ImageZoom.vue'
import CommentsSection from '@/components/CommentsSection.vue'

const route = useRoute()
const { addToCart, isInCart } = useCart()
const { toggleWishlist, isInWishlist } = useWishlist()
const { showAddToCartSuccess } = useToast()

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

// Use comments composable - will be initialized when product is loaded
const commentsComposable = ref<ReturnType<typeof useComments> | null>(null)

// Computed properties for comments
const totalComments = computed(() => commentsComposable.value?.totalComments || 0)
const averageRating = computed(() => commentsComposable.value?.averageRating || 0)

const fetchProduct = async (id: number) => {
  loading.value = true
  product.value = null
  commentsComposable.value = null
  try {
    const response = await productsApi.getProduct(id)
    product.value = response.data

    // Initialize comments composable with product ID
    if (product.value?.id) {
      commentsComposable.value = useComments(product.value.id)
      // Fetch comments
      if (commentsComposable.value) {
        await commentsComposable.value.fetchComments()
      }

      // Fetch related products using new API
      const relatedResponse = await productsApi.getRelatedProducts(product.value.id, 4)
      relatedProducts.value = relatedResponse.data
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
  commentsComposable.value = null
  try {
    const response = await productsApi.getProductBySlug(slug)
    product.value = response.data

    // Initialize comments composable with product ID
    if (product.value?.id) {
      commentsComposable.value = useComments(product.value.id)
      // Fetch comments
      if (commentsComposable.value) {
        await commentsComposable.value.fetchComments()
      }

      // Fetch related products using new API
      const relatedResponse = await productsApi.getRelatedProducts(product.value.id, 4)
      relatedProducts.value = relatedResponse.data
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

  const images: string[] = []

  // Main product image
  if (product.value.image) {
    images.push(getImageUrl(product.value.image))
  }

  // Gallery images from API
  if (product.value.gallery && Array.isArray(product.value.gallery)) {
    product.value.gallery.forEach(galleryImage => {
      images.push(getImageUrl(galleryImage))
    })
  }

  // If no gallery images, add some placeholder images for demo
  if (images.length === 1 && product.value.image) {
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
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCartHandler = async () => {
  if (!product.value) return

  isAddingToCart.value = true
  try {
    // Add to cart using composable
    addToCart(product.value, quantity.value)
    showAddToCartSuccess(product.value.name)
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
/* Product Detail Modern Styles */
.product-detail {
  background: #f8f9fa;
  min-height: 100vh;
}

.product-detail-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.product-images-section {
  position: relative;
}

.product-info-section {
  padding-left: 1rem;
}

/* Product Header */
.product-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1.5rem;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.brand-badge {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

/* Rating Display */
.product-rating-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rating-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  display: flex;
  gap: 0.2rem;
}

.rating-stars i {
  color: #e4e5e9;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.rating-stars i.filled {
  color: #ffd700;
}

.rating-score {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffd700;
}

.rating-count {
  color: #666;
  font-size: 0.95rem;
}

/* Pricing */
.product-pricing {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #ff6b35;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #ff6b35;
}

.original-price {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background: #dc3545;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
}

.save-amount {
  color: #28a745;
  font-weight: 600;
  font-size: 1rem;
}

/* Stock Status */
.stock-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
}

.stock-info.in-stock {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.stock-info.out-of-stock {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Product Options */
.option-group {
  margin-bottom: 1.5rem;
}

.option-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
}

.quantity-btn {
  background: #f8f9fa;
  border: none;
  padding: 0.75rem 1rem;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #ff6b35;
  color: white;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  border: none;
  padding: 0.75rem;
  text-align: center;
  width: 80px;
  font-weight: 600;
  background: white;
}

.quantity-input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px #ff6b35;
}

/* Action Buttons */
.product-actions-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary-action {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary-action:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
}

.btn-primary-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.secondary-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary-action {
  flex: 1;
  background: white;
  border: 2px solid #e9ecef;
  color: #666;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary-action:hover {
  border-color: #ff6b35;
  color: #ff6b35;
  transform: translateY(-1px);
}

.wishlist-btn.active {
  background: #ff6b35;
  border-color: #ff6b35;
  color: white;
}

/* Product Features */
.product-features {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-item i {
  color: #ff6b35;
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

/* Tabs Section */
.product-tabs-section {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.tabs-container {
  width: 100%;
}

.modern-tabs {
  background: #f8f9fa;
  border: none;
  margin: 0;
  padding: 0;
}

.modern-tabs .nav-item {
  flex: 1;
}

.modern-tabs .nav-link {
  background: transparent;
  border: none;
  color: #666;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border-radius: 0;
}

.modern-tabs .nav-link:hover,
.modern-tabs .nav-link.active {
  background: #ff6b35;
  color: white;
}

.modern-tab-content {
  padding: 2rem;
}

.content-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #ff6b35;
}

/* Related Products */
.related-products-section {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.section-title i {
  color: #ff6b35;
}

.section-subtitle {
  color: #666;
  font-size: 1rem;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-product-item {
  height: 100%;
}

.modern-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  border: none;
}

.modern-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image-container {
  position: relative;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.modern-card:hover .card-image {
  transform: scale(1.05);
}

.card-discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #dc3545;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-content {
  padding: 1.25rem;
}

.card-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-pricing .current-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ff6b35;
}

.card-pricing .original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-detail-card {
    padding: 1rem;
    border-radius: 8px;
  }

  .product-info-section {
    padding-left: 0;
    margin-top: 1.5rem;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 1.5rem;
  }

  .secondary-actions {
    flex-direction: column;
  }

  .related-products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .modern-tabs .nav-link {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .modern-tab-content {
    padding: 1.5rem;
  }

  .content-card {
    padding: 1.5rem;
  }

  /* Mobile sticky actions */
  .product-actions-detail {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 1rem;
    border-top: 1px solid #e9ecef;
    margin: 0 -1rem -1rem -1rem;
    border-radius: 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
}

/* Animation for loading states */
@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

.spinner-border-sm {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
