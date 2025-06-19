<template>
  <div class="cart-page">
    <div class="container-fluid px-4 py-4">
      <h1 class="page-title">Giỏ hàng của bạn</h1>
      
      <!-- Empty cart -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="text-center py-5">
          <i class="bi bi-cart-x fs-1 text-muted"></i>
          <h3 class="mt-3">Giỏ hàng trống</h3>
          <p class="text-muted">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <router-link to="/" class="btn btn-primary">
            Tiếp tục mua sắm
          </router-link>
        </div>
      </div>

      <!-- Cart items -->
      <div v-else class="cart-content">
        <div class="row">
          <div class="col-lg-8">
            <div class="cart-items">
              <div 
                v-for="item in cartItems" 
                :key="`${item.product.id}-${item.selectedSize}`"
                class="cart-item"
              >
                <div class="item-image">
                  <img :src="getImageUrl(item.product.image)" :alt="item.product.name" />
                </div>
                <div class="item-info">
                  <h5 class="item-name">{{ item.product.name }}</h5>
                  <p class="item-brand" v-if="item.product.brand">{{ item.product.brand.name }}</p>
                  <div v-if="item.selectedSize" class="item-options">
                    <span v-if="item.selectedSize" class="badge bg-light text-dark me-1">Size: {{ item.selectedSize }}</span>
                  </div>
                  <p class="item-price">{{ formatPrice(item.product.originalPrice || item.product.price) }}</p>
                </div>
                <div class="item-controls">
                  <div class="quantity-controls">
                    <button 
                      class="btn btn-sm btn-outline-secondary"
                      @click="decreaseQuantity(item.product.id, item.selectedSize)"
                    >
                      -
                    </button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button 
                      class="btn btn-sm btn-outline-secondary"
                      @click="increaseQuantity(item.product.id, item.selectedSize)"
                    >
                      +
                    </button>
                  </div>
                  <p class="item-total">{{ formatPrice((item.product.originalPrice || item.product.price) * item.quantity) }}</p>
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    @click="removeItem(item.product.id, item.selectedSize)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="cart-summary">
              <h4>Tóm tắt đơn hàng</h4>
              <div class="summary-row">
                <span>Tổng sản phẩm ({{ cartItemsCount }}):</span>
                <span>{{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="summary-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <hr>
              <div class="summary-row total">
                <strong>
                  <span>Tổng cộng:</span>
                  <span>{{ formatPrice(totalAmount) }}</span>
                </strong>
              </div>
              <button class="btn btn-primary w-100 mt-3" @click="proceedToCheckout">
                Tiến hành thanh toán
              </button>
              <router-link to="/" class="btn btn-outline-primary w-100 mt-2">
                Tiếp tục mua sắm
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart'
import { useRouter } from 'vue-router'
import { formatPrice, getImageUrl } from '@/utils'

const router = useRouter()
const { 
  cartItems, 
  cartItemsCount, 
  totalAmount, 
  updateQuantity, 
  removeFromCart,
  getCartItem
} = useCart()

const cartTotal = totalAmount

const increaseQuantity = (productId: number, size?: string) => {
  const item = getCartItem(productId, size)
  if (item) {
    updateQuantity(productId, item.quantity + 1, size)
  }
}

const decreaseQuantity = (productId: number, size?: string) => {
  const item = getCartItem(productId, size)
  if (item && item.quantity > 1) {
    updateQuantity(productId, item.quantity - 1, size)
  }
}

const removeItem = (productId: number, size?: string) => {
  removeFromCart(productId, size)
}

const proceedToCheckout = () => {
  if (cartItems.value.length === 0) {
    return
  }
  router.push('/checkout')
}


</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.empty-cart i {
  opacity: 0.3;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: white;
}

.item-image {
  width: 80px;
  height: 80px;
  margin-right: 1rem;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.item-brand {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
}

.item-price {
  font-size: 1rem;
  font-weight: 600;
  color: #007bff;
  margin: 0;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: 700;
  color: #007bff;
  margin: 0;
}

.cart-summary {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-row.total {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-image {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .item-controls {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
