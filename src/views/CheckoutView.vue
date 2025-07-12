<template>
  <div class="checkout-page">
    <div class="container py-4">
      <!-- Loading state -->
      <LoadingSpinner v-if="isLoading" text="Đang tải thông tin..." size="lg" />

      <!-- Checkout content -->
      <div v-else>
        <!-- Header -->
        <div class="checkout-header">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="page-title mb-2">
                <i class="bi bi-credit-card me-3"></i>
                Thanh toán đơn hàng
              </h1>
              <nav aria-label="breadcrumb" class="mt-2">
                <ol class="breadcrumb custom-breadcrumb">
                  <li class="breadcrumb-item">
                    <router-link to="/" class="text-decoration-none">
                      <i class="bi bi-house me-1"></i>
                      Trang chủ
                    </router-link>
                  </li>
                  <li class="breadcrumb-item">
                    <router-link to="/cart" class="text-decoration-none">
                      <i class="bi bi-cart me-1"></i>
                      Giỏ hàng
                    </router-link>
                  </li>
                  <li class="breadcrumb-item active">
                    <i class="bi bi-credit-card me-1"></i>
                    Thanh toán
                  </li>
                </ol>
              </nav>
            </div>
            <div class="checkout-actions">
              <router-link to="/cart" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left me-2"></i>
                Quay lại giỏ hàng
              </router-link>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Checkout form -->
          <div class="col-lg-8">
            <!-- Delivery Address -->
            <div class="checkout-section">
              <div class="section-header">
                <h4 class="section-title">
                  <i class="bi bi-geo-alt"></i>
                  Địa chỉ giao hàng
                </h4>
                <div class="section-badge">
                  <i class="bi bi-1-circle-fill"></i>
                </div>
              </div>

              <div class="section-content">
                <div v-if="addresses.length === 0" class="empty-state">
                  <div class="empty-icon">
                    <i class="bi bi-geo-alt"></i>
                  </div>
                  <h5 class="empty-title">Chưa có địa chỉ giao hàng</h5>
                  <p class="empty-subtitle">Vui lòng thêm địa chỉ để tiếp tục đặt hàng</p>
                  <button class="btn btn-primary btn-add-address" @click="showAddAddressModal = true">
                    <i class="bi bi-plus-circle me-2"></i>
                    Thêm địa chỉ mới
                  </button>
                </div>

                <div v-else>
                  <div class="address-list">
                    <div v-for="address in addresses" :key="address.id" class="address-item" :class="{ active: selectedAddress?.id === address.id }" @click="selectedAddress = address">
                      <div class="address-radio">
                        <input type="radio" :id="`address-${address.id}`" :value="address.id" :checked="selectedAddress?.id === address.id" @change="selectedAddress = address" />
                        <label :for="`address-${address.id}`" class="radio-label"></label>
                      </div>
                      <div class="address-content">
                        <div class="address-header">
                          <div class="address-name">
                            <strong>{{ address.recipient_name }}</strong>
                            <span class="phone-number">{{ address.recipient_phone }}</span>
                          </div>
                          <div class="address-badges">
                            <span v-if="address.is_default" class="badge badge-default">
                              <i class="bi bi-star-fill me-1"></i>
                              Mặc định
                            </span>
                          </div>
                        </div>
                        <div class="address-text">
                          <i class="bi bi-geo-alt me-2"></i>
                          {{ address.address }}, {{ address.ward }}, {{ address.district }}, {{ address.province }}
                        </div>
                      </div>
                      <div class="address-actions">
                        <button class="btn-icon" title="Chọn địa chỉ này">
                          <i class="bi bi-check-circle"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button class="btn btn-outline-primary btn-add-more" @click="showAddAddressModal = true">
                    <i class="bi bi-plus-circle me-2"></i>
                    Thêm địa chỉ mới
                  </button>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="checkout-section">
              <div class="section-header">
                <h4 class="section-title">
                  <i class="bi bi-credit-card"></i>
                  Phương thức thanh toán
                </h4>
                <div class="section-badge">
                  <i class="bi bi-2-circle-fill"></i>
                </div>
              </div>

              <div class="section-content">
                <div class="payment-methods">
                  <div v-for="method in paymentMethods" :key="method.id" class="payment-item" :class="{ active: selectedPaymentMethod?.id === method.id }" @click="selectedPaymentMethod = method">
                    <div class="payment-radio">
                      <input type="radio" :id="`payment-${method.id}`" :value="method.id" :checked="selectedPaymentMethod?.id === method.id" @change="selectedPaymentMethod = method" />
                      <label :for="`payment-${method.id}`" class="radio-label"></label>
                    </div>
                    <div class="payment-icon">
                      <i v-if="method.name === 'cod'" class="bi bi-cash-coin"></i>
                      <i v-else-if="method.name === 'bank_transfer'" class="bi bi-bank"></i>
                      <i v-else-if="method.name === 'momo'" class="bi bi-wallet2"></i>
                      <i v-else class="bi bi-credit-card"></i>
                    </div>
                    <div class="payment-content">
                      <div class="payment-name">{{ method.display_name }}</div>
                      <div class="payment-description">
                        <span v-if="method.name === 'cod'">Thanh toán khi nhận hàng - An toàn, tiện lợi</span>
                        <span v-else-if="method.name === 'bank_transfer'">Chuyển khoản ngân hàng - Nhanh chóng</span>
                        <span v-else-if="method.name === 'momo'">Ví điện tử MoMo - Thanh toán online</span>
                        <span v-else>{{ method.display_name }}</span>
                      </div>
                    </div>
                    <div class="payment-check">
                      <i class="bi bi-check-circle-fill"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Voucher -->
            <div class="checkout-section">
              <div class="section-header">
                <h4 class="section-title">
                  <i class="bi bi-ticket-perforated"></i>
                  Mã giảm giá
                </h4>
                <div class="section-badge">
                  <i class="bi bi-3-circle-fill"></i>
                </div>
              </div>

              <div class="section-content">
                <div v-if="selectedVoucher" class="voucher-applied">
                  <div class="voucher-icon">
                    <i class="bi bi-ticket-perforated-fill"></i>
                  </div>
                  <div class="voucher-info">
                    <div class="voucher-code">{{ selectedVoucher.code }}</div>
                    <div class="voucher-discount">
                      Giảm {{ formatVoucherPrice(selectedVoucher) }}{{ selectedVoucher.discount_type === 'percentage' ? '' : 'đ' }}
                    </div>
                  </div>
                  <button class="btn-remove-voucher" @click="removeVoucher" title="Xóa voucher">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>

                <div v-else class="voucher-input">
                  <div class="input-group custom-input-group">
                    <span class="input-group-text">
                      <i class="bi bi-ticket-perforated"></i>
                    </span>
                    <input type="text" class="form-control" placeholder="Nhập mã giảm giá của bạn" v-model="voucherCode" @keyup.enter="applyVoucher" />
                    <button class="btn btn-primary" type="button" @click="applyVoucher" :disabled="!voucherCode.trim()">
                      <i class="bi bi-check me-1"></i>
                      Áp dụng
                    </button>
                  </div>
                </div>

                <!-- Available vouchers -->
                <div v-if="availableVouchers.length > 0" class="available-vouchers">
                  <div class="vouchers-header">
                    <i class="bi bi-gift me-2"></i>
                    <small class="vouchers-title">Voucher có sẵn:</small>
                  </div>
                  <div class="voucher-list">
                    <button v-for="voucher in availableVouchers.slice(0, 3)" :key="voucher.id" class="voucher-chip" @click="applyAvailableVoucher(voucher)">
                      <span class="voucher-chip-code">{{ voucher.code }}</span>
                      <span class="voucher-chip-discount">
                        -{{ formatVoucherPrice(voucher) }}{{ voucher.discount_type === 'percentage' ? '' : 'đ' }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Notes -->
            <div class="checkout-section">
              <div class="section-header">
                <h4 class="section-title">
                  <i class="bi bi-chat-left-text"></i>
                  Ghi chú đơn hàng
                </h4>
                <div class="section-badge optional">
                  <i class="bi bi-4-circle"></i>
                </div>
              </div>

              <div class="section-content">
                <div class="notes-input">
                  <textarea class="form-control custom-textarea" rows="4" placeholder="Thêm ghi chú cho đơn hàng (không bắt buộc)..." v-model="orderComment"></textarea>
                  <div class="notes-hint">
                    <i class="bi bi-info-circle me-1"></i>
                    Ví dụ: Giao hàng vào buổi sáng, gọi trước khi giao...
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="col-lg-4">
            <div class="order-summary">
              <div class="summary-header">
                <h4 class="summary-title">
                  <i class="bi bi-receipt me-2"></i>
                  Tóm tắt đơn hàng
                </h4>
                <div class="summary-count">{{ cartItems.length }} sản phẩm</div>
              </div>

              <!-- Cart items -->
              <div class="summary-items">
                <div v-for="item in cartItems" :key="`${item.product.id}-${item.selectedSize || 'default'}`" class="summary-item">
                  <div class="item-image">
                    <img :src="item.product.image" :alt="item.product.name" />
                    <div class="item-quantity-badge">{{ item.quantity }}</div>
                  </div>
                  <div class="item-details">
                    <div class="item-name">{{ item.product.name }}</div>
                    <div class="item-meta">
                      <span class="item-price">{{ formatProductPrice(item.product.price) }}</span>
                      <span v-if="item.selectedSize" class="item-size">Size: {{ item.selectedSize }}</span>
                    </div>
                  </div>
                  <div class="item-total">
                    {{ calculateProductTotal(item.product.price, item.quantity) }}
                  </div>
                </div>
              </div>

              <!-- Price breakdown -->
              <div class="summary-totals">
                <div class="total-row">
                  <span class="total-label">
                    <i class="bi bi-calculator me-1"></i>
                    Tạm tính:
                  </span>
                  <span class="total-value">{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="total-row">
                  <span class="total-label">
                    <i class="bi bi-truck me-1"></i>
                    Phí vận chuyển:
                  </span>
                  <span class="total-value shipping-free">
                    <i class="bi bi-check-circle me-1"></i>
                    Miễn phí
                  </span>
                </div>
                <div v-if="selectedVoucher" class="total-row discount-row">
                  <span class="total-label">
                    <i class="bi bi-ticket-perforated me-1"></i>
                    Giảm giá:
                  </span>
                  <span class="total-value discount-value">-{{ formatPrice(Number(discount)) }}</span>
                </div>

                <div class="summary-divider"></div>

                <div class="total-row final-total">
                  <span class="total-label final-label">Tổng thanh toán:</span>
                  <span class="total-value final-value">{{ formatPrice(total) }}</span>
                </div>
              </div>

              <!-- Security info -->
              <div class="security-info">
                <div class="security-item">
                  <i class="bi bi-shield-check"></i>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
                <div class="security-item">
                  <i class="bi bi-truck"></i>
                  <span>Giao hàng nhanh chóng</span>
                </div>
                <div class="security-item">
                  <i class="bi bi-arrow-clockwise"></i>
                  <span>Đổi trả trong 7 ngày</span>
                </div>
              </div>
              <div class="place-order-section">
                <!-- Place order button -->
                <button class="btn btn-primary btn-place-order w-90" @click="handlePlaceOrder" :disabled="!canPlaceOrder || isPlacingOrder">
                  <span v-if="isPlacingOrder" class="button-loading">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Đang xử lý...
                  </span>
                  <span v-else class="button-content">
                    <i class="bi bi-check-circle me-2"></i>
                    Đặt hàng ngay
                  </span>
                </button>
              </div>


              <div class="order-note">
                <i class="bi bi-info-circle me-1"></i>
                Bạn sẽ không bị tính phí cho đến khi xem lại đơn hàng
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Address Modal -->
    <AddressFormModal v-if="showAddAddressModal" :isEdit="false" @submit="handleAddressAdded" @cancel="showAddAddressModal = false" />
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

// Format voucher price safely
const formatVoucherPrice = (voucher: Voucher): string => {
  console.log('formatVoucherPrice called with voucher:', voucher);

  if (!voucher) return '0'

  // Handle legacy price field first
  if (voucher.price !== undefined && voucher.price !== null) {
    const numPrice = typeof voucher.price === 'string' ? parseFloat(voucher.price) || 0 : voucher.price || 0
    return numPrice.toLocaleString()
  }

  // Handle new discount structure
  if (voucher.discount_type && voucher.discount_value) {
    const discountValue = parseFloat(voucher.discount_value) || 0

    if (voucher.discount_type === 'percentage') {
      return `${discountValue}%`
    } else if (voucher.discount_type === 'fixed') {
      return discountValue.toLocaleString()
    }
  }

  return '0'
}

// Format product price safely
const formatProductPrice = (price: string | number | undefined): string => {
  if (price === undefined || price === null) return '0'
  const numPrice = typeof price === 'string' ? parseFloat(price) || 0 : price || 0
  return formatPrice(numPrice)
}

// Calculate safe product total
const calculateProductTotal = (price: string | number | undefined, quantity: number): string => {
  if (price === undefined || price === null) return '0'
  const numPrice = typeof price === 'string' ? parseFloat(price) || 0 : price || 0
  return formatPrice(numPrice * quantity)
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
    // Navigate to orders page after successful order
    router.push('/orders')
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
/* Checkout Page Styles */
.checkout-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Header Styles */
.checkout-header {
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

.custom-breadcrumb {
  background: transparent;
  padding: 0;
  margin: 0;
}

.custom-breadcrumb .breadcrumb-item {
  font-size: 0.95rem;
}

.custom-breadcrumb .breadcrumb-item a {
  color: #ff6b35;
  font-weight: 500;
  transition: all 0.3s ease;
}

.custom-breadcrumb .breadcrumb-item a:hover {
  color: #e55a2b;
  text-decoration: underline !important;
}

.custom-breadcrumb .breadcrumb-item.active {
  color: #6c757d;
  font-weight: 600;
}

.checkout-actions .btn {
  border-radius: 12px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
}

/* Section Styles */
.checkout-section {
  background: white;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 107, 53, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.checkout-section:hover {
  box-shadow: 0 6px 25px rgba(255, 107, 53, 0.12);
}

.section-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.section-badge {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.section-badge.optional {
  background: rgba(255, 255, 255, 0.1);
}

.section-content {
  padding: 2rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #ff6b35;
  opacity: 0.6;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.empty-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.btn-add-address {
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

.btn-add-address:hover {
  background: linear-gradient(135deg, #e55a2b 0%, #d6841a 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  color: white;
}

/* Address Styles */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  position: relative;
}

.address-item:hover {
  border-color: rgba(255, 107, 53, 0.5);
  background: rgba(255, 107, 53, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.1);
}

.address-item.active {
  border-color: #ff6b35;
  background: rgba(255, 107, 53, 0.1);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
}

.address-radio {
  position: relative;
  flex-shrink: 0;
}

.address-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-label {
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.address-radio input:checked+.radio-label {
  border-color: #ff6b35;
  background: #ff6b35;
}

.address-radio input:checked+.radio-label::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.address-content {
  flex: 1;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.address-name {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.address-name strong {
  font-size: 1.1rem;
  color: #2c3e50;
}

.phone-number {
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 500;
}

.badge-default {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.address-text {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.address-actions {
  flex-shrink: 0;
}

.btn-icon {
  background: none;
  border: none;
  color: #ff6b35;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.btn-icon:hover {
  background: rgba(255, 107, 53, 0.1);
  transform: scale(1.1);
}

.address-item.active .btn-icon {
  color: #ff6b35;
}

.btn-add-more {
  border: 2px solid #ff6b35;
  color: #ff6b35;
  background: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-add-more:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  position: relative;
}

.payment-item:hover {
  border-color: rgba(255, 107, 53, 0.5);
  background: rgba(255, 107, 53, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.1);
}

.payment-item.active {
  border-color: #ff6b35;
  background: rgba(255, 107, 53, 0.1);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
}

.payment-radio {
  position: relative;
  flex-shrink: 0;
}

.payment-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.payment-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.payment-content {
  flex: 1;
}

.payment-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.payment-description {
  color: #6c757d;
  font-size: 0.95rem;
}

.payment-check {
  color: #ff6b35;
  font-size: 1.5rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.payment-item.active .payment-check {
  opacity: 1;
}

/* Voucher Styles */
.voucher-applied {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 2px solid #28a745;
  border-radius: 12px;
  position: relative;
}

.voucher-icon {
  width: 48px;
  height: 48px;
  background: #28a745;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.voucher-info {
  flex: 1;
}

.voucher-code {
  font-weight: 700;
  font-size: 1.2rem;
  color: #155724;
  margin-bottom: 0.25rem;
}

.voucher-discount {
  color: #155724;
  font-weight: 600;
  font-size: 1rem;
}

.btn-remove-voucher {
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

.btn-remove-voucher:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
}

.voucher-input {
  margin-bottom: 1.5rem;
}

.custom-input-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-input-group .input-group-text {
  background: #ff6b35;
  color: white;
  border: none;
  padding: 1rem;
}

.custom-input-group .form-control {
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
}

.custom-input-group .form-control:focus {
  box-shadow: none;
  border-color: transparent;
}

.custom-input-group .btn {
  border: none;
  padding: 1rem 1.5rem;
  font-weight: 600;
}

.available-vouchers {
  background: rgba(255, 107, 53, 0.05);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.vouchers-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #ff6b35;
  font-weight: 600;
}

.voucher-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.voucher-chip {
  background: white;
  border: 2px solid #ff6b35;
  color: #ff6b35;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.voucher-chip:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.voucher-chip-code {
  font-weight: 700;
}

.voucher-chip-discount {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* Notes Styles */
.notes-input {
  position: relative;
}

.custom-textarea {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  resize: vertical;
}

.custom-textarea:focus {
  border-color: #ff6b35;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25);
}

.notes-hint {
  margin-top: 0.75rem;
  color: #6c757d;
  font-size: 0.9rem;
  font-style: italic;
}

/* Order Summary */
.order-summary {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.summary-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.summary-items {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f0f0f0;
  max-height: 400px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.summary-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.summary-item:first-child {
  padding-top: 0;
}

.item-image {
  position: relative;
  width: 70px;
  height: 70px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-quantity-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff6b35;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-price {
  color: #ff6b35;
  font-weight: 700;
  font-size: 0.9rem;
}

.item-size {
  color: #6c757d;
  font-size: 0.8rem;
  background: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.item-total {
  font-weight: 800;
  color: #2c3e50;
  font-size: 1rem;
  text-align: right;
  align-self: flex-start;
}

/* Summary Totals */
.summary-totals {
  padding: 1.5rem 2rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.total-label {
  color: #6c757d;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-value {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.shipping-free {
  color: #28a745 !important;
  font-weight: 700;
}

.discount-row {
  background: rgba(40, 167, 69, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  margin: 0.5rem -0.75rem;
}

.discount-value {
  color: #28a745 !important;
  font-weight: 700;
}

.summary-divider {
  height: 2px;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  margin: 1.5rem 0;
  border-radius: 1px;
}

.final-total {
  background: rgba(255, 107, 53, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin: 1rem -1rem 1.5rem -1rem;
  border: 2px solid rgba(255, 107, 53, 0.2);
}

.final-label {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
}

.final-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ff6b35;
}

/* Security Info */
.security-info {
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.security-item:last-child {
  margin-bottom: 0;
}

.security-item i {
  color: #ff6b35;
  font-size: 1.1rem;
}

/* Place Order Button */
.btn-place-order {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  color: white;
  font-weight: 700;
  padding: 1.25rem;
  border-radius: 12px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  margin: 1rem 0;
  max-width: 100%;
  display: block;
}

.place-order-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.btn-place-order:hover:not(:disabled) {
  background: linear-gradient(135deg, #e55a2b 0%, #d6841a 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  color: white;
}

.btn-place-order:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-note {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  padding: 1rem 2rem 2rem;
  font-style: italic;
}

/* Button Styles */
.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
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
  padding: 0.75rem 1.5rem;
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
  .checkout-header {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .checkout-actions {
    margin-top: 1rem;
  }

  .section-content {
    padding: 1.5rem;
  }

  .address-item,
  .payment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .address-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .payment-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .checkout-header {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .checkout-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .section-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .section-content {
    padding: 1rem;
  }

  .summary-items {
    padding: 1rem;
  }

  .summary-totals {
    padding: 1rem;
  }



  .order-note {
    padding: 1rem;
  }

  .voucher-list {
    flex-direction: column;
  }

  .voucher-chip {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .checkout-header {
    padding: 0.75rem;
  }

  .page-title {
    font-size: 1.6rem;
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .address-item,
  .payment-item {
    padding: 1rem;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .summary-item {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .item-total {
    text-align: left;
    font-size: 1.1rem;
  }

  .final-total {
    margin: 0.5rem -0.5rem 1rem -0.5rem;
    padding: 0.75rem;
  }

  .final-label {
    font-size: 1.1rem;
  }

  .final-value {
    font-size: 1.3rem;
  }
}
</style>
