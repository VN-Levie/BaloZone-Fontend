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
            <!-- Main image -->
            <div class="main-image-container mb-3">
              <img
                :src="getImageUrl(product.image)"
                :alt="product.name"
                class="main-image img-fluid rounded"
              />
            </div>
          </div>
        </div>

        <!-- Product info -->
        <div class="col-lg-6">
          <div class="product-info">
            <h1 class="product-title h2 mb-3">{{ product.name }}</h1>

            <!-- Rating -->
            <div class="product-rating mb-3">
              <div class="stars">
                <span class="ms-2 text-muted">({{ reviews.length }} đánh giá)</span>
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
              <!-- Color selection -->
              <div class="option-group mb-3" v-if="product.color">
                <label class="option-label fw-semibold mb-2">Màu sắc:</label>
                <div class="color-options">
                  <button
                    class="color-option active"
                    :style="{ backgroundColor: getColorCode(product.color) }"
                    :title="product.color"
                  ></button>
                </div>
              </div>

              <!-- Quantity -->
              <div class="option-group mb-3">
                <label class="option-label fw-semibold mb-2">Số lượng:</label>
                <div class="quantity-controls d-flex align-items-center">
                  <button
                    class="btn btn-outline-secondary btn-sm"
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    v-model="quantity"
                    class="form-control quantity-input mx-2 text-center"
                    min="1"
                    :max="product.quantity"
                  />
                  <button
                    class="btn btn-outline-secondary btn-sm"
                    @click="increaseQuantity"
                    :disabled="quantity >= product.quantity"
                  >
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Stock status -->
            <div class="stock-status mb-3">
              <span
                class="badge"
                :class="product.quantity > 0 ? 'bg-success' : 'bg-danger'"
              >
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
                class="btn btn-outline-danger btn-lg me-2 mb-2"
              >
                <i class="bi bi-heart me-2"></i>
                Yêu thích
              </button>
              <button
                class="btn btn-outline-success btn-lg mb-2"
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
            <button
              class="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#description"
              type="button"
              role="tab"
            >
              Mô tả sản phẩm
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#reviews"
              type="button"
              role="tab"
            >
              Đánh giá ({{ reviews.length }})
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
            <div class="reviews-content">
              <!-- Reviews list -->
              <div class="reviews-list">
                <div v-if="reviews.length === 0" class="text-center text-muted py-4">
                  Chưa có đánh giá nào cho sản phẩm này.
                </div>
                <div v-else>
                  <div v-for="review in reviews" :key="review.id" class="review-item border-bottom py-3">
                    <div class="review-header d-flex justify-content-between mb-2">
                      <div class="reviewer-info">
                        <span class="reviewer-name fw-semibold">{{ review.user?.name }}</span>
                      </div>
                      <div class="review-date text-muted">{{ formatDate(review.created_at) }}</div>
                    </div>
                    <div class="review-content">
                      <p>{{ review.comment }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related products -->
      <div class="related-products mt-5">
        <h3 class="mb-4">Sản phẩm liên quan</h3>
        <div class="row">
          <div
            v-for="relatedProd in relatedProducts"
            :key="relatedProd.id"
            class="col-lg-3 col-md-4 col-sm-6 mb-4"
          >
            <div class="card product-card h-100">
              <router-link :to="`/product/${relatedProd.id}`" class="text-decoration-none">
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productsApi } from '@/services/api'
import type { Product, Comment } from '@/types'
import { formatPrice, formatDate, getColorCode, getImageUrl } from '@/utils'
import { useCart } from '@/composables/useCart'
import { useWishlist } from '@/composables/useWishlist'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const { addToCart: addToCartComposable, isInCart } = useCart()
const { toggleWishlist, isInWishlist } = useWishlist()

// Reactive data
const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])
const loading = ref(true)
const quantity = ref(1)
const isAddingToCart = ref(false)

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

const reviews = computed((): Comment[] => {
  return product.value?.comments || []
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
    toggleWishlist(product.value)
  }
}

const initializeProduct = () => {
  const productId = parseInt(route.params.id as string)
  if (!isNaN(productId)) {
    fetchProduct(productId)
    quantity.value = 1
  }
}

onMounted(() => {
  initializeProduct()
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      initializeProduct()
    }
  }
)
</script>

<style scoped>
</style>

