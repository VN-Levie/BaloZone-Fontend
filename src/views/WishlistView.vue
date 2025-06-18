<template>
  <div class="wishlist-page">
    <div class="container-fluid px-4 py-4">
      <h1 class="page-title">Danh sách yêu thích</h1>
      
      <!-- Empty wishlist -->
      <div v-if="wishlistItems.length === 0" class="empty-wishlist">
        <div class="text-center py-5">
          <i class="bi bi-heart fs-1 text-muted"></i>
          <h3 class="mt-3">Danh sách yêu thích trống</h3>
          <p class="text-muted">Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
          <router-link to="/" class="btn btn-primary">
            Khám phá sản phẩm
          </router-link>
        </div>
      </div>

      <!-- Wishlist items -->
      <div v-else class="wishlist-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <p class="text-muted">{{ wishlistCount }} sản phẩm</p>
          <button class="btn btn-outline-danger" @click="clearAllItems">
            <i class="bi bi-trash"></i>
            Xóa tất cả
          </button>
        </div>
        
        <div class="row g-3">
          <div 
            v-for="product in wishlistItems" 
            :key="product.id"
            class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
          >
            <div class="wishlist-item">
              <ProductCard :product="product" />
              <button 
                class="remove-btn"
                @click="removeItem(product.id)"
                title="Xóa khỏi danh sách yêu thích"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlist } from '@/composables/useWishlist'
import ProductCard from '@/components/ProductCard.vue'

const { 
  wishlistItems, 
  wishlistCount, 
  removeFromWishlist, 
  clearWishlist 
} = useWishlist()

const removeItem = (productId: number) => {
  removeFromWishlist(productId)
}

const clearAllItems = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
    clearWishlist()
  }
}
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.empty-wishlist i {
  opacity: 0.3;
}

.wishlist-item {
  position: relative;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.remove-btn:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
}
</style>
