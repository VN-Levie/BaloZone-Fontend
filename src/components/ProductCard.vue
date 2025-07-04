<template>
  <div class="product-card" :class="{ 'product-card-list': props.listView }">
    <div class="product-image-container">
      <router-link :to="`/product/${product.id}`" class="product-image-link">
        <img :src="product.image" :alt="product.name" class="product-image" />
      </router-link>
      
      <!-- Sale Badge -->
      <SaleBadge 
        v-if="hasSale"
        variant="discount"
        :discount-percentage="saleDiscountPercentage"
        size="medium"
      />
      
      <!-- Legacy discount badge (fallback) -->
      <div v-else-if="product.discount" class="discount-badge">-{{ product.discount }}%</div>
      
      <div class="product-actions">
        <button class="action-btn" title="Yêu thích" @click="toggleWishlistHandler">
          <i class="bi bi-heart" :class="{ 'bi-heart-fill': isInWishlistComputed }"></i>
        </button>
        <button class="action-btn" title="Xem nhanh" @click="quickView">
          <i class="bi bi-eye"></i>
        </button>
        <button class="action-btn" title="So sánh" @click="toggleCompare">
          <i class="bi bi-arrow-left-right"></i>
        </button>
      </div>
      <div class="quick-add" v-if="!props.listView">
        <button class="quick-add-btn" @click="addToCartHandler">
          {{ isInCartComputed ? 'Đã trong giỏ' : 'Thêm vào giỏ' }}
        </button>
      </div>
    </div>
    <div class="product-info">
      <div v-if="product.brand" class="product-brand">{{ product.brand.name }}</div>
      <router-link :to="`/product/${product.id}`" class="product-name-link">
        <h6 class="product-name">{{ product.name }}</h6>
      </router-link>
      <div v-if="product.rating" class="product-rating">
        <div class="stars">
          <i 
            v-for="i in 5" 
            :key="i" 
            class="bi bi-star-fill" 
            :class="{ active: i <= Math.floor(product.rating) }"
          ></i>
        </div>
        <span class="rating-text">({{ product.reviews || 0 }})</span>
      </div>
      <div class="product-pricing">
        <!-- Sale pricing -->
        <template v-if="hasSale">
          <span class="current-price sale-price">{{ formatPrice(salePrice) }}</span>
          <span class="original-price">{{ formatPrice(originalPrice) }}</span>
          <span class="save-amount">Tiết kiệm {{ formatPrice(originalPrice - salePrice) }}</span>
        </template>
        <!-- Regular pricing -->
        <template v-else>
          <span class="current-price">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </template>
      </div>
      
      <!-- Sale campaign info -->
      <div v-if="hasSale && saleEndTime" class="sale-info">
        <span class="sale-end">{{ saleEndTime }}</span>
      </div>
      
      <div v-if="product.sold" class="product-meta">
        <span class="sold-count">Đã bán {{ product.sold }}</span>
      </div>
      
      <!-- List view specific content -->
      <div v-if="props.listView" class="list-view-actions">
        <button class="btn btn-outline-primary btn-sm me-2" @click="addToCartHandler">
          <i class="bi bi-cart-plus"></i>
          {{ isInCartComputed ? 'Đã trong giỏ' : 'Thêm vào giỏ' }}
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="quickView">
          <i class="bi bi-eye"></i>
          Xem chi tiết
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product, ProductWithSale } from '@/types'
import { useCart } from '@/composables/useCart'
import { useWishlist } from '@/composables/useWishlist'
import { useToast } from '@/composables/useToast'
import SaleBadge from './SaleBadge.vue'

interface Props {
  product: Product | ProductWithSale
  listView?: boolean
}

const props = defineProps<Props>()
const router = useRouter()
const { addToCart, isInCart } = useCart()
const { toggleWishlist, isInWishlist } = useWishlist()
const { showAddToCartSuccess, showAddToWishlistSuccess, showRemoveFromWishlistSuccess } = useToast()

// Sale-related computed properties
const hasSale = computed(() => {
  const productWithSale = props.product as ProductWithSale
  return !!(productWithSale.current_sale && 
           productWithSale.current_sale.sale_price < productWithSale.current_sale.original_price)
})

const salePrice = computed(() => {
  const productWithSale = props.product as ProductWithSale
  return productWithSale.current_sale?.sale_price || props.product.price
})

const originalPrice = computed(() => {
  const productWithSale = props.product as ProductWithSale
  return productWithSale.current_sale?.original_price || props.product.price
})

const saleDiscountPercentage = computed(() => {
  const productWithSale = props.product as ProductWithSale
  return productWithSale.current_sale?.discount_percentage || 0
})

const saleEndTime = computed(() => {
  const productWithSale = props.product as ProductWithSale
  if (!productWithSale.current_sale?.sale_campaign?.end_date) return null
  
  const endDate = new Date(productWithSale.current_sale.sale_campaign.end_date)
  const now = new Date()
  const timeDiff = endDate.getTime() - now.getTime()
  
  if (timeDiff <= 0) return 'Đã kết thúc'
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `Còn ${days} ngày`
  if (hours > 0) return `Còn ${hours} giờ`
  return 'Sắp kết thúc'
})

// Computed properties
const isInWishlistComputed = computed(() => isInWishlist(props.product.id))
const isInCartComputed = computed(() => isInCart(props.product.id))

// Utility function
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

// Event handlers
const toggleWishlistHandler = () => {
  const wasInWishlist = isInWishlist(props.product.id)
  toggleWishlist(props.product)
  
  if (wasInWishlist) {
    showRemoveFromWishlistSuccess(props.product.name)
  } else {
    showAddToWishlistSuccess(props.product.name)
  }
}

const quickView = () => {
  router.push(`/product/${props.product.id}`)
}

const toggleCompare = () => {
  // TODO: Implement compare functionality
  console.log('Toggle compare for product:', props.product.id)
}

const addToCartHandler = () => {
  if (!isInCart(props.product.id)) {
    addToCart(props.product, 1)
    showAddToCartSuccess(props.product.name)
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
}

.product-image-link {
  display: block;
  width: 100%;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.product-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  background: #007bff;
  color: white;
  transform: scale(1.1);
}

.quick-add {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.product-card:hover .quick-add {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn {
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.quick-add-btn:hover {
  background: #0056b3;
}

.product-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-brand {
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.product-name-link {
  text-decoration: none;
  color: inherit;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.product-name-link:hover .product-name {
  color: #007bff;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  font-size: 0.75rem;
  color: #e9ecef;
}

.stars i.active {
  color: #ffc107;
}

.rating-text {
  font-size: 0.75rem;
  color: #6c757d;
}

.product-pricing {
  margin-bottom: 8px;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #007bff;
}

.original-price {
  font-size: 0.9rem;
  color: #6c757d;
  text-decoration: line-through;
  margin-left: 8px;
}

/* Sale pricing styles */
.sale-price {
  color: #ff4757 !important;
  font-weight: 700;
}

.save-amount {
  color: #22c55e;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 8px;
}

.sale-info {
  margin-top: 8px;
}

.sale-end {
  background: #fff3cd;
  color: #856404;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid #ffeaa7;
}

.product-meta {
  margin-top: auto;
}

.sold-count {
  font-size: 0.75rem;
  color: #6c757d;
}

/* List View Styles */
.product-card-list {
  flex-direction: row;
  height: auto;
  min-height: 200px;
}

.product-card-list .product-image-container {
  width: 200px;
  min-width: 200px;
  aspect-ratio: 1;
  flex-shrink: 0;
}

.product-card-list .product-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card-list .product-name {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.product-card-list .product-pricing {
  margin-bottom: 15px;
}

.product-card-list .current-price {
  font-size: 1.2rem;
}

.list-view-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.list-view-actions .btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Responsive adjustments for list view */
@media (max-width: 768px) {
  .product-card-list {
    flex-direction: column;
  }
  
  .product-card-list .product-image-container {
    width: 100%;
  }
  
  .list-view-actions {
    flex-direction: column;
  }
  
  .list-view-actions .btn {
    justify-content: center;
  }
}
</style>
