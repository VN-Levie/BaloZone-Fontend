<template>
  <div class="checkout-page">
    <div class="container py-4">
      <!-- Loading state -->
      <LoadingSpinner v-if="isLoading" text="Đang tải thông tin..." size="lg" />
      
      <!-- Checkout content -->
      <div v-else>
        <!-- Header -->
        <div class="row mb-4">
          <div class="col-12">
            <h1 class="h3 mb-0">Thanh toán</h1>
            <nav aria-label="breadcrumb" class="mt-2">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/" class="text-decoration-none">Trang chủ</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link to="/cart" class="text-decoration-none">Giỏ hàng</router-link>
                </li>
                <li class="breadcrumb-item active">Thanh toán</li>
              </ol>
            </nav>
          </div>
        </div>

        <div class="row">
          <!-- Checkout form -->
          <div class="col-lg-8">
            <!-- Delivery Address -->
            <div class="checkout-section">
              <div class="section-header">
                <h4 class="section-title">
                  <i class="bi bi-geo-alt me-2"></i>
                  Địa chỉ giao hàng
                </h4>
              </div>
              
              <div class="section-content">
                <div v-if="addresses.length === 0" class="empty-state">
                  <p class="text-muted">Bạn chưa có địa chỉ giao hàng nào.</p>
                  <button class="btn btn-primary" @click="showAddAddressModal = true">
                    <i class="bi bi-plus me-2"></i>
                    Thêm địa chỉ mới
                  </button>
                </div>
                
                <div v-else>
                  <div class="address-list">
                    <div 
                      v-for="address in addresses" 
                      :key="address.id"
                      class="address-item"
                      :class="{ active: selectedAddress?.id === address.id }"
                      @click="selectedAddress = address"
                    >
                      <div class="address-radio">
                        <input 
                          type="radio" 
                          :id="`address-${address.id}`"
                          :value="address.id"
                          :checked="selectedAddress?.id === address.id"
                          @change="selectedAddress = address"
                        />
                      </div>
                      <div class="address-content">
                        <div class="address-header">
                          <strong>{{ address.name }}</strong>
                          <span class="text-muted ms-2">{{ address.phone }}</span>
                          <span v-if="address.is_default" class="badge bg-primary ms-2">Mặc định</span>
                        </div>
                        <div class="address-text text-muted">
                          {{ address.address }}, {{ address.ward }}, {{ address.district }}, {{ address.province }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button class="btn btn-outline-primary mt-3" @click="showAddAddressModal = true">
                    <i class="bi bi-plus me-2"></i>
                    Thêm địa chỉ mới
                  </button>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="checkout-section">
              <div class="section-header">
                <h4 class="section-title">
                  <i class="bi bi-credit-card me-2"></i>
                  Phương thức thanh toán
                </h4>
              </div>
              
              <div class="section-content">
                <div class="payment-methods">
                  <div 
                    v-for="method in paymentMethods" 
                    :key="method.id"
                    class="payment-item"
                    :class="{ active: selectedPaymentMethod?.id === method.id }"
                    @click="selectedPaymentMethod = method"
                  >
                    <div class="payment-radio">
                      <input 
                        type="radio" 
                        :id="`payment-${method.id}`"
                        :value="method.id"
                        :checked="selectedPaymentMethod?.id === method.id"
                        @change="selectedPaymentMethod = method"
                      />
                    </div>
                    <div class="payment-content">
                      <div class="payment-name">{{ method.display_name }}</div>
                      <div class="payment-description text-muted">
                        <span v-if="method.name === 'cod'">Thanh toán khi nhận hàng</span>
                        <span v-else-if="method.name === 'bank_transfer'">Chuyển khoản ngân hàng</span>
                        <span v-else-if="method.name === 'momo'">Ví điện tử MoMo</span>
                        <span v-else>{{ method.display_name }}</span>
                      </div>
                    </div>
                    <div class="payment-icon">
                      <i v-if="method.name === 'cod'" class="bi bi-cash-coin"></i>
                      <i v-else-if="method.name === 'bank_transfer'" class="bi bi-bank"></i>
                      <i v-else-if="method.name === 'momo'" class="bi bi-wallet2"></i>
                      <i v-else class="bi bi-credit-card"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Voucher -->
            <div class="checkout-section">
              <div class="section-header">
                <h4 class="section-title">
                  <i class="bi bi-ticket-perforated me-2"></i>
                  Mã giảm giá
                </h4>
              </div>
              
              <div class="section-content">
                <div v-if="selectedVoucher" class="voucher-applied">
                  <div class="voucher-info">
                    <div class="voucher-code">{{ selectedVoucher.code }}</div>
                    <div class="voucher-discount">-{{ selectedVoucher.price.toLocaleString() }}đ</div>
                  </div>
                  <button class="btn btn-sm btn-outline-danger" @click="removeVoucher">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
                
                <div v-else class="voucher-input">
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Nhập mã giảm giá"
                      v-model="voucherCode"
                      @keyup.enter="applyVoucher"
                    />
                    <button 
                      class="btn btn-outline-primary" 
                      type="button"
                      @click="applyVoucher"
                      :disabled="!voucherCode.trim()"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
                
                <!-- Available vouchers -->
                <div v-if="availableVouchers.length > 0" class="available-vouchers mt-3">
                  <small class="text-muted">Voucher có sẵn:</small>
                  <div class="voucher-list mt-2">
                    <button 
                      v-for="voucher in availableVouchers.slice(0, 3)" 
                      :key="voucher.id"
                      class="btn btn-sm btn-outline-secondary me-2 mb-2"
                      @click="applyAvailableVoucher(voucher)"
                    >
                      {{ voucher.code }} (-{{ voucher.price.toLocaleString() }}đ)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Notes -->
            <div class="checkout-section">
              <div class="section-header">
                <h4 class="section-title">
                  <i class="bi bi-chat-left-text me-2"></i>
                  Ghi chú đơn hàng
                </h4>
              </div>
              
              <div class="section-content">
                <textarea 
                  class="form-control" 
                  rows="3"
                  placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                  v-model="orderComment"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="col-lg-4">
            <div class="order-summary">
              <h4 class="summary-title">Tóm tắt đơn hàng</h4>
              
              <!-- Cart items -->
              <div class="summary-items">
                <div 
                  v-for="item in cartItems" 
                  :key="`${item.product.id}-${item.selectedSize || 'default'}`"
                  class="summary-item"
                >
                  <div class="item-image">
                    <img :src="item.product.image" :alt="item.product.name" />
                  </div>
                  <div class="item-details">
                    <div class="item-name">{{ item.product.name }}</div>
                    <div class="item-price">{{ formatPrice(item.product.price) }}</div>
                    <div class="item-quantity">Số lượng: {{ item.quantity }}</div>
                  </div>
                  <div class="item-total">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </div>
                </div>
              </div>

              <!-- Price breakdown -->
              <div class="summary-totals">
                <div class="total-row">
                  <span>Tạm tính:</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="total-row">
                  <span>Phí vận chuyển:</span>
                  <span class="text-success">Miễn phí</span>
                </div>
                <div v-if="selectedVoucher" class="total-row discount">
                  <span>Giảm giá:</span>
                  <span>-{{ formatPrice(discount) }}</span>
                </div>
                <hr>
                <div class="total-row final">
                  <strong>Tổng cộng:</strong>
                  <strong class="text-danger">{{ formatPrice(total) }}</strong>
                </div>
              </div>

              <!-- Place order button -->
              <button 
                class="btn btn-primary btn-lg w-100 mt-3"
                @click="handlePlaceOrder"
                :disabled="!canPlaceOrder || isPlacingOrder"
              >
                <span v-if="isPlacingOrder" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check-circle me-2"></i>
                {{ isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Address Modal -->
    <AddressFormModal 
      v-if="showAddAddressModal"
      :isEdit="false"
      @submit="handleAddressAdded"
      @cancel="showAddAddressModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckout } from '@/composables/useCheckout'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AddressFormModal from '@/components/AddressFormModal.vue'
import type { Address, Voucher } from '@/types'

const router = useRouter()
const { cartItems } = useCart()
const {
  // State
  addresses,
  paymentMethods,
  availableVouchers,
  selectedAddress,
  selectedPaymentMethod,
  selectedVoucher,
  orderComment,
  isLoading,
  isPlacingOrder,
  // Computed
  subtotal,
  discount,
  total,
  canPlaceOrder,
  // Methods
  validateVoucherCode,
  removeVoucher,
  createAddress,
  placeOrder,
  initializeCheckout
} = useCheckout()

// Local state
const showAddAddressModal = ref(false)
const voucherCode = ref('')

// Methods
const applyVoucher = async () => {
  if (!voucherCode.value.trim()) return
  
  const success = await validateVoucherCode(voucherCode.value.trim())
  if (success) {
    voucherCode.value = ''
  }
}

const applyAvailableVoucher = (voucher: Voucher) => {
  selectedVoucher.value = voucher
}

const handleAddressAdded = async (addressData: any) => {
  try {
    const newAddress = await createAddress(addressData)
    showAddAddressModal.value = false
  } catch (error) {
    console.error('Failed to add address:', error)
  }
}

const handlePlaceOrder = async () => {
  const order = await placeOrder()
  if (order) {
    // Navigate to order success page
    router.push(`/order-success/${order.id}`)
  }
}

// Check if cart is empty
const checkCartEmpty = () => {
  if (cartItems.value.length === 0) {
    router.push('/cart')
  }
}

onMounted(async () => {
  checkCartEmpty()
  await initializeCheckout()
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.checkout-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.section-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.section-content {
  padding: 0;
}

/* Address styles */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.address-item:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.address-item.active {
  border-color: #007bff;
  background: #f8f9ff;
}

.address-radio input {
  margin: 0;
}

.address-content {
  flex: 1;
}

.address-header {
  margin-bottom: 0.5rem;
}

.address-text {
  font-size: 0.9rem;
}

/* Payment methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-item:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.payment-item.active {
  border-color: #007bff;
  background: #f8f9ff;
}

.payment-content {
  flex: 1;
}

.payment-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.payment-description {
  font-size: 0.9rem;
}

.payment-icon {
  font-size: 1.5rem;
  color: #007bff;
}

/* Voucher styles */
.voucher-applied {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
}

.voucher-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.voucher-code {
  font-weight: 600;
  color: #155724;
}

.voucher-discount {
  color: #155724;
  font-weight: 600;
}

.voucher-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Order summary */
.order-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: sticky;
  top: 2rem;
}

.summary-title {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.summary-items {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.item-price {
  color: #007bff;
  font-weight: 600;
  font-size: 0.9rem;
}

.item-quantity {
  color: #6c757d;
  font-size: 0.8rem;
}

.item-total {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.summary-totals {
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.total-row.discount {
  color: #28a745;
}

.total-row.final {
  font-size: 1.1rem;
  margin-bottom: 0;
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .checkout-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .order-summary {
    margin-top: 2rem;
  }
  
  .address-item,
  .payment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
