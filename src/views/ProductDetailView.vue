<template>
  <div class="product-detail">
    <!-- Product not found -->
    <div v-if="!product" class="container text-center py-5">
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
          <li class="breadcrumb-item">
            <router-link :to="`/category/${product.category}`" class="text-decoration-none">
              {{ getCategoryName(product.category) }}
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
                :src="selectedImage" 
                :alt="product.name" 
                class="main-image img-fluid rounded"
                @click="openImageModal"
              />
              <div class="image-overlay" v-if="product.discount">
                <span class="badge bg-danger position-absolute top-0 start-0 m-2">
                  -{{ product.discount }}%
                </span>
              </div>
            </div>
            
            <!-- Thumbnail images -->
            <div class="thumbnail-images">
              <div class="row g-2">
                <div class="col-3" v-for="(image, index) in product.images" :key="index">
                  <img 
                    :src="image" 
                    :alt="`${product.name} ${index + 1}`"
                    class="thumbnail-image img-fluid rounded"
                    :class="{ 'active': selectedImage === image }"
                    @click="selectedImage = image"
                  />
                </div>
              </div>
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
                <i 
                  v-for="star in 5" 
                  :key="star"
                  class="bi"
                  :class="star <= product.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
                ></i>
                <span class="ms-2 text-muted">({{ product.reviewCount || 0 }} đánh giá)</span>
              </div>
            </div>

            <!-- Price -->
            <div class="product-price mb-4">
              <div class="current-price h3 text-danger fw-bold mb-1">
                {{ formatPrice(product.price) }}
              </div>
              <div class="original-price" v-if="product.originalPrice">
                <span class="text-muted text-decoration-line-through me-2">
                  {{ formatPrice(product.originalPrice) }}
                </span>
                <span class="badge bg-success">Tiết kiệm {{ formatPrice(product.originalPrice - product.price) }}</span>
              </div>
            </div>

            <!-- Product options -->
            <div class="product-options mb-4">
              <!-- Color selection -->
              <div class="option-group mb-3" v-if="product.colors && product.colors.length">
                <label class="option-label fw-semibold mb-2">Màu sắc:</label>
                <div class="color-options">
                  <button
                    v-for="color in product.colors"
                    :key="color"
                    class="color-option"
                    :class="{ 'active': selectedColor === color }"
                    :style="{ backgroundColor: getColorCode(color) }"
                    @click="selectedColor = color"
                    :title="color"
                  ></button>
                </div>
              </div>

              <!-- Size selection -->
              <div class="option-group mb-3" v-if="product.sizes && product.sizes.length">
                <label class="option-label fw-semibold mb-2">Kích thước:</label>
                <div class="size-options">
                  <button
                    v-for="size in product.sizes"
                    :key="size"
                    class="btn btn-outline-secondary size-option me-2 mb-2"
                    :class="{ 'active': selectedSize === size }"
                    @click="selectedSize = size"
                  >
                    {{ size }}
                  </button>
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
                    :max="product.stock || 999"
                  />
                  <button 
                    class="btn btn-outline-secondary btn-sm"
                    @click="increaseQuantity"
                    :disabled="quantity >= (product.stock || 999)"
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
                :class="product.stock > 0 ? 'bg-success' : 'bg-danger'"
              >
                {{ product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng' }}
              </span>
            </div>

            <!-- Action buttons -->
            <div class="product-actions">
              <button 
                class="btn btn-primary btn-lg me-3 mb-2"
                @click="addToCart"
                :disabled="product.stock === 0 || isAddingToCart"
              >
                <span v-if="isAddingToCart" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi bi-cart-plus me-2"></i>
                {{ isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
              </button>
              <button 
                class="btn btn-outline-danger btn-lg me-2 mb-2"
                @click="addToWishlist"
              >
                <i class="bi bi-heart me-2"></i>
                Yêu thích
              </button>
              <button 
                class="btn btn-outline-success btn-lg mb-2"
                @click="shareProduct"
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
                <span>Bảo hành chính hãng {{ product.specifications?.['Bảo hành'] || '12 tháng' }}</span>
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
              data-bs-target="#specifications"
              type="button" 
              role="tab"
            >
              Thông số kỹ thuật
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
              Đánh giá ({{ product.reviewCount || 0 }})
            </button>
          </li>
        </ul>

        <div class="tab-content mt-3">
          <!-- Description tab -->
          <div class="tab-pane fade show active" id="description" role="tabpanel">
            <div class="description-content">
              <p>{{ product.description }}</p>
              <div v-if="product.features && product.features.length">
                <h5>Tính năng nổi bật:</h5>
                <ul>
                  <li v-for="feature in product.features" :key="feature">{{ feature }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Specifications tab -->
          <div class="tab-pane fade" id="specifications" role="tabpanel">
            <div class="specifications-content">
              <div class="row" v-if="product.specifications">
                <div class="col-md-6" v-for="(value, key) in product.specifications" :key="key">
                  <div class="spec-item d-flex justify-content-between border-bottom py-2">
                    <span class="spec-label fw-semibold">{{ key }}:</span>
                    <span class="spec-value">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews tab -->
          <div class="tab-pane fade" id="reviews" role="tabpanel">
            <div class="reviews-content">
              <!-- Review summary -->
              <div class="review-summary mb-4">
                <div class="row align-items-center">
                  <div class="col-md-4 text-center">
                    <div class="average-rating">
                      <div class="rating-number h1 text-warning">{{ product.rating }}</div>
                      <div class="stars mb-2">
                        <i 
                          v-for="star in 5" 
                          :key="star"
                          class="bi"
                          :class="star <= product.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
                        ></i>
                      </div>
                      <div class="review-count text-muted">{{ product.reviewCount || 0 }} đánh giá</div>
                    </div>
                  </div>
                  <div class="col-md-8">
                    <div class="rating-breakdown">
                      <div v-for="i in 5" :key="i" class="rating-bar d-flex align-items-center mb-1">
                        <span class="rating-label me-2">{{ 6 - i }} sao</span>
                        <div class="progress flex-grow-1 me-2">
                          <div 
                            class="progress-bar bg-warning" 
                            :style="{ width: getRatingPercentage(6 - i) + '%' }"
                          ></div>
                        </div>
                        <span class="rating-count text-muted">{{ getRatingCount(6 - i) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reviews list -->
              <div class="reviews-list">
                <div v-if="reviews.length === 0" class="text-center text-muted py-4">
                  Chưa có đánh giá nào cho sản phẩm này.
                </div>
                <div v-else>
                  <div v-for="review in reviews" :key="review.id" class="review-item border-bottom py-3">
                    <div class="review-header d-flex justify-content-between mb-2">
                      <div class="reviewer-info">
                        <span class="reviewer-name fw-semibold">{{ review.userName }}</span>
                        <div class="review-stars">
                          <i 
                            v-for="star in 5" 
                            :key="star"
                            class="bi"
                            :class="star <= review.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
                          ></i>
                        </div>
                      </div>
                      <div class="review-date text-muted">{{ formatDate(review.date) }}</div>
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
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id"
            class="col-lg-3 col-md-4 col-sm-6 mb-4"
          >
            <div class="card product-card h-100">
              <router-link :to="`/product/${relatedProduct.id}`" class="text-decoration-none">
                <img :src="relatedProduct.image" :alt="relatedProduct.name" class="card-img-top" />
                <div class="card-body">
                  <h6 class="card-title">{{ relatedProduct.name }}</h6>
                  <div class="price">
                    <span class="current-price text-danger fw-bold">{{ formatPrice(relatedProduct.price) }}</span>
                    <span v-if="relatedProduct.originalPrice" class="original-price text-muted text-decoration-line-through ms-2">
                      {{ formatPrice(relatedProduct.originalPrice) }}
                    </span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Image modal -->
      <div class="modal fade" id="imageModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ product.name }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <img :src="selectedImage" :alt="product.name" class="img-fluid" />
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

const route = useRoute()

// Reactive data
const selectedImage = ref('')
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const isAddingToCart = ref(false)

// Sample product data
const allProducts = ref([
  {
    id: 1,
    name: 'Vali Du Lịch Cao Cấp Premium',
    price: 799000,
    originalPrice: 1200000,
    discount: 33,
    stock: 15,
    category: 'vali',
    rating: 4.8,
    reviewCount: 127,
    description: 'Vali du lịch cao cấp với thiết kế hiện đại, chất liệu bền bỉ và khóa bảo mật TSA. Phù hợp cho các chuyến công tác và du lịch dài ngày.',
    features: [
      'Chất liệu ABS + PC cao cấp',
      'Khóa bảo mật TSA chuẩn quốc tế',
      'Bánh xe xoay 360 độ êm ái',
      'Tay kéo nhôm chắc chắn',
      'Ngăn chứa rộng rãi với dây đai cố định',
      'Thiết kế chống thấm nước'
    ],
    specifications: {
      'Kích thước': '55 x 37 x 24 cm',
      'Trọng lượng': '3.2 kg',
      'Dung tích': '35 lít',
      'Chất liệu': 'ABS + PC',
      'Màu sắc': 'Đen, Xanh Navy, Xám',
      'Bảo hành': '12 tháng'
    },
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1586450961054-cd1d6b230238?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop'
    ],
    colors: ['black', 'navy', 'gray'],
    sizes: ['Small (55cm)', 'Medium (65cm)', 'Large (75cm)']
  },
  {
    id: 2,
    name: 'Balo Laptop Business Pro',
    price: 1399000,
    originalPrice: 1800000,
    discount: 22,
    stock: 25,
    category: 'balo',
    rating: 4.9,
    reviewCount: 89,
    description: 'Balo laptop business chuyên nghiệp với nhiều ngăn chứa tiện ích, chất liệu chống nước và thiết kế sang trọng.',
    features: [
      'Chất liệu vải canvas cao cấp',
      'Ngăn laptop riêng biệt đến 17 inch',
      'Chống nước IPX4',
      'Dây đeo ergonomic',
      'Cổng USB tích hợp',
      'Khóa chống trộm'
    ],
    specifications: {
      'Kích thước': '45 x 32 x 18 cm',
      'Trọng lượng': '1.8 kg',
      'Dung tích': '25 lít',
      'Chất liệu': 'Canvas + Polyester',
      'Màu sắc': 'Đen, Xanh Navy, Xám',
      'Bảo hành': '24 tháng'
    },
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1586450961054-cd1d6b230238?w=500&h=500&fit=crop'
    ],
    colors: ['black', 'navy', 'gray'],
    sizes: ['Medium', 'Large']
  },
  {
    id: 3,
    name: 'Vali Kéo Size Cabin Premium',
    price: 899000,
    originalPrice: 1300000,
    discount: 31,
    stock: 18,
    category: 'vali',
    rating: 4.7,
    reviewCount: 156,
    description: 'Vali kéo size cabin tiêu chuẩn quốc tế, phù hợp cho các chuyến bay ngắn và trung hạn.',
    features: [
      'Size cabin chuẩn IATA',
      'Chất liệu polycarbonate',
      'Bánh xe đôi 360 độ',
      'Khóa TSA tích hợp',
      'Tay kéo telescopic',
      'Nội thất có dây đai cố định'
    ],
    specifications: {
      'Kích thước': '56 x 36 x 23 cm',
      'Trọng lượng': '2.8 kg',
      'Dung tích': '32 lít',
      'Chất liệu': 'Polycarbonate',
      'Màu sắc': 'Mint, Hồng, Trắng',
      'Bảo hành': '12 tháng'
    },
    images: [
      'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1586450961054-cd1d6b230238?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop'
    ],
    colors: ['mint', 'pink', 'white'],
    sizes: ['Cabin (55cm)']
  }
])

const product = computed(() => {
  const productId = parseInt(route.params.id as string)
  return allProducts.value.find(p => p.id === productId) || null
})

const reviews = ref([
  {
    id: 1,
    userName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Sản phẩm rất tốt, chất lượng vượt mong đợi. Vali rất bền và thiết kế đẹp.',
    date: '2024-12-15'
  },
  {
    id: 2,
    userName: 'Trần Thị B',
    rating: 4,
    comment: 'Vali đẹp, bánh xe trơn tru. Giá cả hợp lý.',
    date: '2024-12-10'
  }
])

const relatedProducts = computed(() => {
  if (!product.value) return []
  
  return allProducts.value
    .filter(p => p.id !== product.value!.id && p.category === product.value!.category)
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.images[0]
    }))
})

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    'vali': 'Vali',
    'balo': 'Balo',
    'tui-du-lich': 'Túi Du Lịch',
    'tui-xach': 'Túi Xách',
    'phu-kien': 'Phụ Kiện'
  }
  return categoryNames[category] || category
}

const getColorCode = (color: string): string => {
  const colorCodes: { [key: string]: string } = {
    'red': '#dc3545',
    'blue': '#0d6efd',
    'gray': '#6c757d',
    'black': '#000000',
    'navy': '#001f3f',
    'mint': '#20c997',
    'pink': '#e83e8c',
    'white': '#ffffff',
    'green': '#198754',
    'orange': '#fd7e14',
    'silver': '#c0c0c0'
  }
  return colorCodes[color] || color
}

const increaseQuantity = () => {
  if (!product.value) return
  if (quantity.value < (product.value.stock || 999)) {
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert(`Đã thêm ${quantity.value} sản phẩm "${product.value.name}" vào giỏ hàng!`)
  } catch (error) {
    alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!')
  } finally {
    isAddingToCart.value = false
  }
}

const addToWishlist = () => {
  alert('Đã thêm vào danh sách yêu thích!')
}

const shareProduct = () => {
  if (navigator.share) {
    navigator.share({
      title: product.value?.name,
      text: product.value?.description,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Đã sao chép link sản phẩm!')
  }
}

const openImageModal = () => {
  const modal = new (window as any).bootstrap.Modal(document.getElementById('imageModal'))
  modal.show()
}

const getRatingPercentage = (stars: number): number => {
  const ratings = [40, 30, 20, 8, 2]
  return ratings[5 - stars] || 0
}

const getRatingCount = (stars: number): number => {
  const counts = [51, 38, 25, 10, 3]
  return counts[5 - stars] || 0
}

const initializeProduct = () => {
  if (!product.value) return
  
  selectedImage.value = product.value.images[0]
  selectedColor.value = product.value.colors[0]
  if (product.value.sizes && product.value.sizes.length) {
    selectedSize.value = product.value.sizes[0]
  }
  quantity.value = 1
}

onMounted(() => {
  initializeProduct()
})

watch(() => route.params.id, () => {
  initializeProduct()
})
</script>

<style scoped>
.product-detail {
  padding: 20px 0;
}

.main-image-container {
  position: relative;
  cursor: zoom-in;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.05);
}

.thumbnail-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  opacity: 1;
  border-color: #ff6b35;
  transform: scale(1.05);
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #dee2e6;
  margin-right: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.color-option:hover,
.color-option.active {
  border-color: #0d6efd;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.3);
}

.color-option.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.size-option.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.quantity-input {
  width: 80px;
}

.product-card {
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.review-item {
  padding: 1rem 0;
}

.rating-bar {
  font-size: 0.9rem;
}

.progress {
  height: 8px;
}

.stars i {
  font-size: 1.1rem;
}

.quick-info .info-item {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .main-image {
    height: 300px;
  }
  
  .product-actions .btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .product-actions {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 15px;
    border-top: 1px solid #dee2e6;
    z-index: 10;
    margin: 0 -15px;
  }
  
  .thumbnail-images {
    overflow-x: auto;
  }
  
  .thumbnail-images .row {
    flex-wrap: nowrap;
    min-width: max-content;
  }
}
</style>
