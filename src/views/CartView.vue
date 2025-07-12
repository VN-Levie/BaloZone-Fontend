<template>
  <div class="cart-page">
    <div class="container py-4">
      <!-- Header Section -->
      <div class="cart-header">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="page-title mb-2">
              <i class="bi bi-cart3 me-3"></i>
              Giỏ hàng của bạn
            </h1>
            <p class="text-muted mb-0" v-if="cartItems.length > 0">
              {{ cartItemsCount }} sản phẩm trong giỏ hàng
            </p>
          </div>
          <div v-if="cartItems.length > 0" class="cart-actions">
            <button 
              class="btn btn-outline-danger btn-clear-cart"
              @click="showClearCartModal = true"
              title="Xóa toàn bộ giỏ hàng"
            >
              <i class="bi bi-trash3 me-2"></i>
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty cart -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-content">
          <div class="empty-cart-icon">
            <i class="bi bi-cart-x"></i>
          </div>
          <h3 class="empty-cart-title">Giỏ hàng của bạn đang trống</h3>
          <p class="empty-cart-subtitle">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi</p>
          <router-link to="/" class="btn btn-primary btn-lg mt-3">
            <i class="bi bi-shop me-2"></i>
            Bắt đầu mua sắm
          </router-link>
        </div>
      </div>

      <!-- Cart items -->
      <div v-else class="cart-content">
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="cart-items-section">
              <div class="cart-items-header">
                <h5 class="mb-0">Sản phẩm trong giỏ</h5>
              </div>
              
              <div class="cart-items">
                <transition-group name="cart-item" tag="div">
                  <div 
                    v-for="item in cartItems" 
                    :key="`${item.product.id}-${item.selectedSize}`"
                    class="cart-item"
                  >
                    <div class="item-image">
                      <img :src="getImageUrl(item.product.image)" :alt="item.product.name" />
                      <div class="item-badge" v-if="(item.product.discount_price && Number(item.product.discount_price) < Number(item.product.price)) || (item.product.originalPrice && Number(item.product.originalPrice) < Number(item.product.price))">
                        <span class="badge bg-danger">Sale</span>
                      </div>
                    </div>
                    
                    <div class="item-details">
                      <div class="item-info">
                        <h6 class="item-name">{{ item.product.name }}</h6>
                        <p class="item-brand" v-if="item.product.brand">
                          <i class="bi bi-tags me-1"></i>
                          {{ item.product.brand.name }}
                        </p>
                        <div v-if="item.selectedSize" class="item-options">
                          <span class="size-badge">Size: {{ item.selectedSize }}</span>
                        </div>
                        <div class="item-price-section">
                          <span class="item-price">{{ formatPrice(item.product.discount_price || item.product.originalPrice || item.product.price) }}</span>
                          <span v-if="item.product.discount_price && Number(item.product.discount_price) < Number(item.product.price)" 
                                class="item-original-price">
                            {{ formatPrice(item.product.price) }}
                          </span>
                          <span v-else-if="item.product.originalPrice && Number(item.product.originalPrice) < Number(item.product.price)" 
                                class="item-original-price">
                            {{ formatPrice(item.product.price) }}
                          </span>
                        </div>
                      </div>
                      
                      <div class="item-controls">
                        <div class="quantity-section">
                          <label class="quantity-label">Số lượng:</label>
                          <div class="quantity-controls">
                            <button 
                              class="quantity-btn quantity-btn-decrease"
                              @click="decreaseQuantity(item.product.id, item.selectedSize)"
                              :disabled="item.quantity <= 1"
                            >
                              <i class="bi bi-dash"></i>
                            </button>
                            <input 
                              type="number" 
                              class="quantity-input"
                              :value="item.quantity"
                              @input="updateQuantityInput(item.product.id, item.selectedSize, $event)"
                              min="1"
                              max="99"
                            />
                            <button 
                              class="quantity-btn quantity-btn-increase"
                              @click="increaseQuantity(item.product.id, item.selectedSize)"
                            >
                              <i class="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div class="item-total-section">
                          <span class="item-total-label">Thành tiền:</span>
                          <span class="item-total">{{ formatPrice(Number(item.product.discount_price || item.product.originalPrice || item.product.price) * item.quantity) }}</span>
                        </div>
                        
                        <button 
                          class="btn-remove-item"
                          @click="confirmRemoveItem(item.product.id, item.selectedSize, item.product.name)"
                          title="Xóa sản phẩm"
                        >
                          <i class="bi bi-trash3"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="cart-summary">
              <div class="summary-header">
                <h5 class="mb-0">
                  <i class="bi bi-receipt me-2"></i>
                  Tóm tắt đơn hàng
                </h5>
              </div>
              
              <div class="summary-content">
                <div class="summary-row">
                  <span>Tạm tính ({{ cartItemsCount }} sản phẩm):</span>
                  <span class="summary-amount">{{ formatPrice(cartTotal) }}</span>
                </div>
                
                <div class="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span class="summary-amount text-success">
                    <i class="bi bi-check-circle me-1"></i>
                    Miễn phí
                  </span>
                </div>
                
                <div class="summary-row discount-row" v-if="false">
                  <span>Giảm giá:</span>
                  <span class="summary-amount text-success">-{{ formatPrice(0) }}</span>
                </div>
                
                <hr class="summary-divider">
                
                <div class="summary-row total-row">
                  <span class="total-label">Tổng thanh toán:</span>
                  <span class="total-amount">{{ formatPrice(totalAmount) }}</span>
                </div>
                
                <div class="summary-actions">
                  <button 
                    class="btn btn-primary btn-checkout w-100"
                    @click="proceedToCheckout"
                  >
                    <i class="bi bi-credit-card me-2"></i>
                    Tiến hành thanh toán
                  </button>
                  
                  <router-link to="/" class="btn btn-outline-secondary w-100 mt-3">
                    <i class="bi bi-arrow-left me-2"></i>
                    Tiếp tục mua sắm
                  </router-link>
                </div>
                
                <div class="payment-security">
                  <div class="security-info">
                    <i class="bi bi-shield-check text-success me-2"></i>
                    <span>Thanh toán an toàn & bảo mật</span>
                  </div>
                  <div class="security-info">
                    <i class="bi bi-truck text-primary me-2"></i>
                    <span>Giao hàng nhanh chóng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Cart Confirmation Modal -->
    <div v-if="showClearCartModal" class="modal-overlay" @click="showClearCartModal = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle text-warning me-2"></i>
              Xác nhận xóa giỏ hàng
            </h5>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?</p>
            <p class="text-muted mb-0">Hành động này không thể hoàn tác.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showClearCartModal = false">
              Hủy bỏ
            </button>
            <button class="btn btn-danger" @click="clearAllItems">
              <i class="bi bi-trash3 me-2"></i>
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Item Confirmation Modal -->
    <div v-if="showRemoveModal" class="modal-overlay" @click="showRemoveModal = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-trash3 text-danger me-2"></i>
              Xóa sản phẩm
            </h5>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>"{{ itemToRemove.name }}"</strong> khỏi giỏ hàng?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showRemoveModal = false">
              Hủy bỏ
            </button>
            <button class="btn btn-danger" @click="executeRemoveItem">
              <i class="bi bi-trash3 me-2"></i>
              Xóa sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCart } from '@/composables/useCart'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { formatPrice, getImageUrl } from '@/utils'

const router = useRouter()
const { addToast } = useToast()
const { 
  cartItems, 
  cartItemsCount, 
  totalAmount, 
  updateQuantity, 
  removeFromCart,
  clearCart,
  getCartItem
} = useCart()

// Modal states
const showClearCartModal = ref(false)
const showRemoveModal = ref(false)
const itemToRemove = ref<{ productId: number; size?: string; name: string }>({
  productId: 0,
  size: undefined,
  name: ''
})

const cartTotal = totalAmount

const increaseQuantity = (productId: number, size?: string) => {
  const item = getCartItem(productId, size)
  if (item) {
    updateQuantity(productId, item.quantity + 1, size)
    addToast({
      type: 'info',
      title: 'Đã cập nhật',
      message: 'Số lượng sản phẩm đã được tăng'
    })
  }
}

const decreaseQuantity = (productId: number, size?: string) => {
  const item = getCartItem(productId, size)
  if (item && item.quantity > 1) {
    updateQuantity(productId, item.quantity - 1, size)
    addToast({
      type: 'info',
      title: 'Đã cập nhật',
      message: 'Số lượng sản phẩm đã được giảm'
    })
  }
}

const updateQuantityInput = (productId: number, size: string | undefined, event: Event) => {
  const target = event.target as HTMLInputElement
  const newQuantity = parseInt(target.value)
  
  if (newQuantity && newQuantity > 0 && newQuantity <= 99) {
    updateQuantity(productId, newQuantity, size)
  } else {
    // Reset to current quantity if invalid
    const item = getCartItem(productId, size)
    if (item) {
      target.value = item.quantity.toString()
    }
  }
}

const confirmRemoveItem = (productId: number, size: string | undefined, productName: string) => {
  itemToRemove.value = {
    productId,
    size,
    name: productName
  }
  showRemoveModal.value = true
}

const executeRemoveItem = () => {
  removeFromCart(itemToRemove.value.productId, itemToRemove.value.size)
  showRemoveModal.value = false
  addToast({
    type: 'success',
    title: 'Đã xóa',
    message: `Đã xóa "${itemToRemove.value.name}" khỏi giỏ hàng`
  })
}

const clearAllItems = () => {
  clearCart()
  showClearCartModal.value = false
  addToast({
    type: 'success',
    title: 'Đã xóa tất cả',
    message: 'Giỏ hàng đã được làm trống'
  })
}

const proceedToCheckout = () => {
  if (cartItems.value.length === 0) {
    return
  }
  router.push('/checkout')
}
</script>

<style scoped>
/* Cart Page Styles */
.cart-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Header Styles */
.cart-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-clear-cart {
  border: 2px solid #dc3545;
  color: #dc3545;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-clear-cart:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Empty Cart Styles */
.empty-cart {
  background: white;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.empty-cart-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-cart-icon {
  font-size: 5rem;
  color: #ff6b35;
  opacity: 0.6;
  margin-bottom: 2rem;
}

.empty-cart-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.empty-cart-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

/* Cart Items Section */
.cart-items-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.cart-items-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 1.5rem 2rem;
  font-weight: 600;
}

.cart-items {
  padding: 1rem;
}

/* Cart Item Styles */
.cart-item {
  display: flex;
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
  border-color: rgba(255, 107, 53, 0.2);
}

.cart-item:last-child {
  margin-bottom: 0;
}

/* Item Image */
.item-image {
  position: relative;
  width: 120px;
  height: 120px;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-badge {
  position: absolute;
  top: -5px;
  right: -5px;
}

.item-badge .badge {
  font-size: 0.7rem;
  padding: 0.4rem 0.6rem;
}

/* Item Details */
.item-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.item-brand {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.size-badge {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.item-price-section {
  margin-top: 0.75rem;
}

.item-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff6b35;
  margin-right: 0.5rem;
}

.item-original-price {
  font-size: 1rem;
  color: #6c757d;
  text-decoration: line-through;
}

/* Item Controls */
.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  min-width: 200px;
}

.quantity-section {
  text-align: center;
}

.quantity-label {
  display: block;
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.quantity-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e55a2b 0%, #d6841a 100%);
  transform: scale(1.05);
}

.quantity-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: #2c3e50;
  background: white;
}

.quantity-input:focus {
  outline: none;
  background: #f8f9fa;
}

.item-total-section {
  text-align: center;
}

.item-total-label {
  display: block;
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.item-total {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ff6b35;
  text-shadow: 0 2px 4px rgba(255, 107, 53, 0.1);
}

.btn-remove-item {
  background: none;
  border: 2px solid #dc3545;
  color: #dc3545;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-remove-item:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Cart Summary */
.cart-summary {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 107, 53, 0.1);
  position: sticky;
  top: 2rem;
  overflow: hidden;
}

.summary-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 1.5rem 2rem;
  font-weight: 600;
}

.summary-content {
  padding: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.summary-amount {
  font-weight: 600;
  color: #2c3e50;
}

.discount-row {
  background: #d4edda;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.summary-divider {
  border: none;
  height: 2px;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  margin: 1.5rem 0;
  border-radius: 1px;
}

.total-row {
  background: rgba(255, 107, 53, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(255, 107, 53, 0.2);
}

.total-label {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ff6b35;
}

/* Summary Actions */
.summary-actions {
  margin-bottom: 2rem;
}

.btn-checkout {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  color: white;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.btn-checkout:hover {
  background: linear-gradient(135deg, #e55a2b 0%, #d6841a 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  color: white;
}

.payment-security {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.security-info {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: modalSlideUp 0.3s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 1.5rem 2rem;
}

.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.modal-body {
  padding: 2rem;
  line-height: 1.6;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-footer .btn {
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
}

/* Transitions */
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.cart-item-move {
  transition: transform 0.3s ease;
}

/* Button Styles */
.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #e55a2b 0%, #d6841a 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  color: white;
}

.btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
  background: white;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

/* Responsive Design */
@media (max-width: 992px) {
  .cart-header {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .cart-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .item-image {
    margin-right: 0;
    align-self: center;
  }
  
  .item-details {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  .item-controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: auto;
    width: 100%;
  }
  
  .quantity-section,
  .item-total-section {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .cart-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .btn-clear-cart {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .cart-items {
    padding: 0.5rem;
  }
  
  .cart-item {
    padding: 1rem;
  }
  
  .item-image {
    width: 100px;
    height: 100px;
  }
  
  .summary-content {
    padding: 1.5rem;
  }
  
  .modal-dialog {
    width: 95%;
  }
  
  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .cart-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .item-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .quantity-controls {
    width: 100%;
    max-width: 200px;
  }
  
  .quantity-input {
    width: 80px;
  }
}
</style>
