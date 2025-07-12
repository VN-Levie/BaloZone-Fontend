<template>
  <div class="product-card" :class="{ 'product-card-list': props.listView }">
    <div class="product-image-container">
      <router-link :to="`/product/${product.id}`" class="product-image-link">
        <img :src="product.image" :alt="product.name" class="product-image" />
      </router-link>
      
      <!-- Sale Badge for discount_price -->
      <div 
        v-if="product.discount_price && Number(product.discount_price) < Number(product.price)" 
        class="discount-badge modern-sale-badge"
      >
        -{{ Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100) }}%
      </div>
      
      <!-- Sale Badge from campaign -->
      <SaleBadge 
        v-else-if="hasSale"
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
        <!-- Check for discount_price from new backend structure -->
        <template v-if="product.discount_price && Number(product.discount_price) < Number(product.price)">
          <span class="current-price sale-price">{{ formatPrice(Number(product.discount_price)) }}</span>
          <span class="original-price">{{ formatPrice(Number(product.price)) }}</span>
          <span class="save-amount">
            Tiết kiệm {{ formatPrice(Number(product.price) - Number(product.discount_price)) }}
          </span>
        </template>
        <!-- Sale pricing from sale campaign -->
        <template v-else-if="hasSale">
          <span class="current-price sale-price">{{ formatPrice(Number(salePrice)) }}</span>
          <span class="original-price">{{ formatPrice(Number(originalPrice)) }}</span>
          <span class="save-amount">Tiết kiệm {{ formatPrice(Number(originalPrice) - Number(salePrice)) }}</span>
        </template>
        <!-- Regular pricing -->
        <template v-else>
          <span class="current-price">{{ formatPrice(Number(product.price)) }}</span>
        </template>
      </div>
      
      <!-- Sale campaign info -->
      <div v-if="hasSale && saleEndTime" class="sale-info">
        <span class="sale-end">{{ saleEndTime }}</span>
      </div>
      
      <!-- Product metadata -->
      <div class="product-meta">
        <!-- Stock status -->
        <div v-if="product.stock !== undefined" class="stock-info">
          <span 
            :class="{
              'stock-available': product.stock > 10,
              'stock-low': product.stock > 0 && product.stock <= 10,
              'stock-out': product.stock === 0
            }"
          >
            <i class="bi bi-box-seam"></i>
            {{ product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng' }}
          </span>
        </div>
        
        <!-- Product color if available -->
        <div v-if="product.color" class="product-color">
          <i class="bi bi-palette"></i>
          <span>{{ product.color }}</span>
        </div>
        
        <!-- Sold count -->
        <div v-if="product.sold" class="sold-count">
          <i class="bi bi-fire"></i>
          <span>Đã bán {{ product.sold }}</span>
        </div>
      </div>
      
      <!-- List view specific content -->
      <div v-if="props.listView" class="list-view-actions">
        <button class="btn btn-outline-primary btn-sm me-2" @click="addToCartHandler">
          <i class="bi bi-cart-plus"></i>
          {{ isInCartComputed ? 'Đã trong giỏ' : 'Thêm vào giỏ!' }}
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
const formatPrice = (price: number | string): string => {
  if (typeof price === 'string') {
    price = parseFloat(price)
  }
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
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.175);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 107, 53, 0.08);
  position: relative;
  max-width: 100%;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.03), rgba(247, 147, 30, 0.03));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 16px;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 40px rgba(255, 107, 53, 0.15);
  border-color: rgba(255, 107, 53, 0.2);
}

.product-card:hover::before {
  opacity: 1;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  width: 100%;
  flex-shrink: 0;
}

.product-image-link {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  border-radius: 0;
}

.product-card:hover .product-image {
  transform: scale(1.05);
  filter: brightness(1.05) saturate(1.1);
}

/* Modern sale badge styling */
.modern-sale-badge {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 6px 10px;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 3px 10px rgba(255, 107, 53, 0.3);
  z-index: 10;
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.modern-sale-badge::before {
  content: '🏷️';
  font-size: 0.7rem;
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #ff4757, #ff3742);
  color: white;
  padding: 6px 10px;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 3px 10px rgba(255, 71, 87, 0.3);
  z-index: 10;
}

.product-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(15px);
  transition: all 0.3s ease;
  z-index: 10;
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 38px;
  height: 38px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  color: #495057;
  font-size: 1rem;
}

.action-btn:hover {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
}

.action-btn i.bi-heart-fill {
  color: #ff4757;
}

.action-btn:hover i.bi-heart-fill {
  color: white;
}

.quick-add {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.3s ease;
  z-index: 10;
}

.product-card:hover .quick-add {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn {
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(255, 107, 53, 0.25);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.quick-add-btn:hover {
  background: linear-gradient(135deg, #f7931e, #e67e22);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.35);
}

.quick-add-btn:active {
  transform: translateY(0);
}

.product-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 249, 250, 0.98));
  min-height: 0;
}

.product-brand {
  font-size: 0.7rem;
  color: #ff6b35;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.product-name-link {
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  color: #2c3e50;
  transition: all 0.3s ease;
  min-height: 2.7rem;
}

.product-name-link:hover .product-name {
  color: #ff6b35;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  font-size: 0.8rem;
  color: #e9ecef;
  transition: all 0.2s ease;
}

.stars i.active {
  color: #ffc107;
  text-shadow: 0 1px 3px rgba(255, 193, 7, 0.3);
}

.rating-text {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

.product-pricing {
  margin-bottom: 10px;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.original-price {
  font-size: 0.85rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-left: 8px;
  font-weight: 500;
}

/* Sale pricing styles */
.sale-price {
  background: linear-gradient(135deg, #ff4757, #ff3742) !important;
  background-clip: text !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  font-weight: 800;
}

.save-amount {
  color: #22c55e;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 8px;
  background: rgba(34, 197, 94, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
}

.sale-info {
  margin-top: 8px;
}

.sale-end {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  color: #856404;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid #ffeaa7;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.sale-end::before {
  content: '⏰';
  font-size: 0.7rem;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 107, 53, 0.1);
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
}

.stock-available {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1) !important;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.stock-low {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1) !important;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.stock-out {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1) !important;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.product-color {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  padding: 3px 8px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.product-color i {
  color: #ff6b35;
}

.sold-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  padding: 3px 8px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.sold-count i {
  color: #ffc107;
}

/* List View Styles */
.product-card-list {
  flex-direction: row;
  height: auto;
  min-height: 200px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  max-width: 100%;
}

.product-card-list .product-image-container {
  width: 200px;
  min-width: 200px;
  aspect-ratio: 1;
  flex-shrink: 0;
  border-radius: 16px 0 0 16px;
  overflow: hidden;
}

.product-card-list .product-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 249, 250, 0.98));
  border-radius: 0 16px 16px 0;
  min-width: 0;
}

.product-card-list .product-name {
  font-size: 1.1rem;
  margin-bottom: 12px;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  min-height: auto;
}

.product-card-list .product-pricing {
  margin-bottom: 15px;
}

.product-card-list .current-price {
  font-size: 1.3rem;
}

.product-card-list .product-meta {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
}

.product-card-list .product-actions {
  position: absolute;
  top: 15px;
  right: 15px;
  flex-direction: row;
  gap: 6px;
  opacity: 1;
  transform: none;
}

.product-card-list .quick-add {
  position: relative;
  bottom: auto;
  left: auto;
  right: auto;
  opacity: 1;
  transform: none;
  margin-top: 0;
}

.list-view-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.list-view-actions .btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.list-view-actions .btn-outline-primary {
  border: 2px solid #ff6b35;
  color: #ff6b35;
  background: transparent;
}

.list-view-actions .btn-outline-primary:hover {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.25);
}

.list-view-actions .btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
  background: transparent;
}

.list-view-actions .btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(108, 117, 125, 0.25);
}

/* Responsive adjustments for list view */
@media (max-width: 768px) {
  .product-card-list {
    flex-direction: column;
    min-height: auto;
    border-radius: 16px;
  }
  
  .product-card-list .product-image-container {
    width: 100%;
    min-width: auto;
    aspect-ratio: 16/9;
    border-radius: 16px 16px 0 0;
  }
  
  .product-card-list .product-info {
    padding: 16px;
    border-radius: 0 0 16px 16px;
  }
  
  .product-card-list .product-actions {
    position: absolute;
    top: 12px;
    right: 12px;
    flex-direction: column;
    gap: 6px;
  }
  
  .list-view-actions {
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
  }
  
  .list-view-actions .btn {
    justify-content: center;
    width: 100%;
    padding: 10px 16px;
  }
  
  .product-card {
    border-radius: 16px;
  }
  
  .product-actions {
    position: relative;
    top: auto;
    right: auto;
    flex-direction: row;
    justify-content: center;
    margin-top: 12px;
    opacity: 1;
    transform: none;
    gap: 10px;
  }
  
  .quick-add {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    margin-top: 12px;
    opacity: 1;
    transform: none;
  }
  
  .product-meta {
    flex-direction: column;
    gap: 6px;
  }
}

@media (max-width: 576px) {
  .product-card {
    border-radius: 12px;
  }
  
  .product-info {
    padding: 12px;
  }
  
  .product-name {
    font-size: 0.9rem;
    min-height: 2.4rem;
  }
  
  .current-price {
    font-size: 1rem;
  }
  
  .action-btn {
    width: 34px;
    height: 34px;
    font-size: 0.9rem;
  }
  
  .quick-add-btn {
    padding: 8px 14px;
    font-size: 0.8rem;
  }
  
  .product-card-list .product-image-container {
    width: 100%;
    aspect-ratio: 4/3;
  }
  
  .product-card-list .product-info {
    padding: 12px;
  }
  
  .product-card-list .product-name {
    font-size: 1rem;
  }
  
  .product-card-list .current-price {
    font-size: 1.1rem;
  }
}

/* Loading and skeleton states */
.product-card.loading {
  pointer-events: none;
}

.product-card.loading .product-image {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Enhanced accessibility */
.action-btn:focus,
.quick-add-btn:focus,
.product-name-link:focus {
  outline: 2px solid rgba(255, 107, 53, 0.5);
  outline-offset: 2px;
}

/* Grid layout optimization */
.product-card {
  width: 100%;
  box-sizing: border-box;
}

/* Ensure proper layout */
.product-card * {
  box-sizing: border-box;
}

.product-info {
  position: relative;
  z-index: 1;
}

/* Dark mode support */
/* @media (prefers-color-scheme: dark) {
  .product-card {
    background: rgba(45, 55, 72, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .product-info {
    background: linear-gradient(135deg, rgba(45, 55, 72, 0.95), rgba(55, 65, 81, 0.95));
  }
  
  .product-name {
    color: #f7fafc;
  }
  
  .action-btn {
    background: rgba(45, 55, 72, 0.9);
    color: #e2e8f0;
  }
} */
</style>
