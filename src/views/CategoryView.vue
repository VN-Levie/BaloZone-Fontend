<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const categoryName = computed(() => route.params.category as string || 'balo')

// Sample products data
const allProducts = ref([
  {
    id: 1,
    name: 'Balo Laptop Dell Premier 15"',
    price: 1299000,
    originalPrice: 1800000,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['black', 'navy', 'gray'],
    rating: 4.8,
    category: 'balo',
    brand: 'Dell',
    reviews: 234,
    sold: 1250
  },
  {
    id: 2,
    name: 'Vali Samsonite Cosmolite 20"',
    price: 3500000,
    originalPrice: 4200000,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=300&h=300&fit=crop',
    colors: ['silver', 'blue', 'red'],
    rating: 4.9,
    category: 'vali',
    brand: 'Samsonite',
    reviews: 189,
    sold: 890
  },
  {
    id: 3,
    name: 'Balo Du Lịch Deuter Futura 32L',
    price: 2199000,
    originalPrice: 2800000,
    discount: 21,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=300&h=300&fit=crop',
    colors: ['green', 'blue', 'gray'],
    rating: 4.7,
    category: 'balo',
    brand: 'Deuter',
    reviews: 156,
    sold: 567
  },
  {
    id: 4,
    name: 'Vali American Tourister Soundbox 67cm',
    price: 2850000,
    originalPrice: 3400000,
    discount: 16,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=300&h=300&fit=crop',
    colors: ['white', 'pink', 'purple'],
    rating: 4.6,
    category: 'vali',
    brand: 'American Tourister',
    reviews: 298,
    sold: 743
  },
  {
    id: 5,
    name: 'Túi Xách Nữ Coach Madison',
    price: 4500000,
    originalPrice: 5200000,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop',
    colors: ['brown', 'black', 'beige'],
    rating: 4.9,
    category: 'tui-xach',
    brand: 'Coach',
    reviews: 87,
    sold: 234
  },
  {
    id: 6,
    name: 'Balo Gaming ASUS ROG Ranger BP2500',
    price: 1890000,
    originalPrice: 2300000,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['black', 'red'],
    rating: 4.8,
    category: 'balo',
    brand: 'ASUS',
    reviews: 145,
    sold: 432
  },
  {
    id: 7,
    name: 'Vali Delsey Helium Aero 55cm',
    price: 4200000,
    originalPrice: 4900000,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=300&h=300&fit=crop',
    colors: ['silver', 'black', 'navy'],
    rating: 4.7,
    category: 'vali',
    brand: 'Delsey',
    reviews: 167,
    sold: 298
  },
  {
    id: 8,
    name: 'Balo Học Sinh Adidas Classic',
    price: 899000,
    originalPrice: 1200000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['black', 'navy', 'gray', 'red'],
    rating: 4.5,
    category: 'balo',
    brand: 'Adidas',
    reviews: 389,
    sold: 1567
  }
])

// Filter and sort functionality
const selectedSort = ref('popular')
const selectedPriceRange = ref('all')
const selectedBrand = ref('all')

const categoryProducts = computed(() => {
  let filtered = allProducts.value.filter(product => 
    product.category === categoryName.value
  )

  // Apply brand filter
  if (selectedBrand.value !== 'all') {
    filtered = filtered.filter(product => 
      product.brand.toLowerCase() === selectedBrand.value.toLowerCase()
    )
  }

  // Apply price filter
  if (selectedPriceRange.value !== 'all') {
    const [min, max] = selectedPriceRange.value.split('-').map(Number)
    filtered = filtered.filter(product => 
      product.price >= min && (max ? product.price <= max : true)
    )
  }

  // Apply sorting
  switch (selectedSort.value) {
    case 'price-low':
      return filtered.sort((a, b) => a.price - b.price)
    case 'price-high':
      return filtered.sort((a, b) => b.price - a.price)
    case 'newest':
      return filtered.sort((a, b) => b.id - a.id)
    case 'popular':
    default:
      return filtered.sort((a, b) => b.sold - a.sold)
  }
})

const brands = computed(() => {
  const uniqueBrands = [...new Set(allProducts.value
    .filter(product => product.category === categoryName.value)
    .map(product => product.brand))]
  return uniqueBrands
})

const categoryTitle = computed(() => {
  const titles = {
    'balo': 'Balo',
    'vali': 'Vali',
    'tui-xach': 'Túi Xách',
    'phu-kien': 'Phụ Kiện'
  }
  return titles[categoryName.value] || 'Sản Phẩm'
})

const breadcrumbs = computed(() => [
  { name: 'Trang chủ', path: '/' },
  { name: categoryTitle.value, path: `/category/${categoryName.value}` }
])
</script>

<template>
  <div class="category-page">
    <!-- Breadcrumbs -->
    <section class="breadcrumb-section">
      <div class="container-fluid px-4">
        <nav class="breadcrumb-nav">
          <a 
            v-for="(item, index) in breadcrumbs" 
            :key="index"
            :href="item.path"
            class="breadcrumb-item"
            :class="{ active: index === breadcrumbs.length - 1 }"
          >
            {{ item.name }}
            <i v-if="index < breadcrumbs.length - 1" class="bi bi-chevron-right"></i>
          </a>
        </nav>
      </div>
    </section>

    <!-- Category Header -->
    <section class="category-header">
      <div class="container-fluid px-4">
        <div class="header-content">
          <h1 class="category-title">{{ categoryTitle }}</h1>
          <p class="category-description">
            Khám phá bộ sưu tập {{ categoryTitle.toLowerCase() }} chính hãng với giá tốt nhất
          </p>
          <div class="category-stats">
            <span class="stat-item">
              <i class="bi bi-box-seam"></i>
              {{ categoryProducts.length }} sản phẩm
            </span>
            <span class="stat-item">
              <i class="bi bi-star-fill"></i>
              Đánh giá 4.8/5
            </span>
            <span class="stat-item">
              <i class="bi bi-truck"></i>
              Miễn phí vận chuyển
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters and Products -->
    <section class="products-section">
      <div class="container-fluid px-4">
        <div class="row">
          <!-- Sidebar Filters -->
          <div class="col-lg-3 col-md-4 mb-4">
            <div class="filters-sidebar">
              <div class="filter-card">
                <h5 class="filter-title">Sắp xếp theo</h5>
                <div class="filter-options">
                  <label class="filter-option">
                    <input type="radio" v-model="selectedSort" value="popular">
                    <span class="checkmark"></span>
                    Phổ biến nhất
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedSort" value="newest">
                    <span class="checkmark"></span>
                    Mới nhất
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedSort" value="price-low">
                    <span class="checkmark"></span>
                    Giá thấp đến cao
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedSort" value="price-high">
                    <span class="checkmark"></span>
                    Giá cao đến thấp
                  </label>
                </div>
              </div>

              <div class="filter-card">
                <h5 class="filter-title">Khoảng giá</h5>
                <div class="filter-options">
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="all">
                    <span class="checkmark"></span>
                    Tất cả
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="0-1000000">
                    <span class="checkmark"></span>
                    Dưới 1 triệu
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="1000000-3000000">
                    <span class="checkmark"></span>
                    1 - 3 triệu
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="3000000-5000000">
                    <span class="checkmark"></span>
                    3 - 5 triệu
                  </label>
                  <label class="filter-option">
                    <input type="radio" v-model="selectedPriceRange" value="5000000">
                    <span class="checkmark"></span>
                    Trên 5 triệu
                  </label>
                </div>
              </div>

              <div class="filter-card">
                <h5 class="filter-title">Thương hiệu</h5>
                <div class="filter-options">
                  <label class="filter-option">
                    <input type="radio" v-model="selectedBrand" value="all">
                    <span class="checkmark"></span>
                    Tất cả
                  </label>
                  <label 
                    v-for="brand in brands" 
                    :key="brand"
                    class="filter-option"
                  >
                    <input type="radio" v-model="selectedBrand" :value="brand">
                    <span class="checkmark"></span>
                    {{ brand }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="col-lg-9 col-md-8">
            <div class="products-header">
              <div class="results-info">
                Hiển thị {{ categoryProducts.length }} sản phẩm
              </div>
              <div class="view-options">
                <button class="view-btn active">
                  <i class="bi bi-grid"></i>
                </button>
                <button class="view-btn">
                  <i class="bi bi-list"></i>
                </button>
              </div>
            </div>

            <div class="products-grid">
              <div class="row g-3">
                <div 
                  v-for="product in categoryProducts" 
                  :key="product.id"
                  class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
                >
                  <div class="product-card">
                    <div class="product-image-container">
                      <img :src="product.image" :alt="product.name" class="product-image" />
                      <div class="discount-badge">-{{ product.discount }}%</div>
                      <div class="product-actions">
                        <button class="action-btn" title="Yêu thích">
                          <i class="bi bi-heart"></i>
                        </button>
                        <button class="action-btn" title="Xem nhanh">
                          <i class="bi bi-eye"></i>
                        </button>
                        <button class="action-btn" title="So sánh">
                          <i class="bi bi-arrow-left-right"></i>
                        </button>
                      </div>
                      <div class="quick-add">
                        <button class="quick-add-btn">Thêm vào giỏ</button>
                      </div>
                    </div>
                    <div class="product-info">
                      <div class="product-brand">{{ product.brand }}</div>
                      <h6 class="product-name">{{ product.name }}</h6>
                      <div class="product-rating">
                        <div class="stars">
                          <i v-for="i in 5" :key="i" class="bi bi-star-fill" :class="{ active: i <= Math.floor(product.rating) }"></i>
                        </div>
                        <span class="rating-text">({{ product.reviews }})</span>
                      </div>
                      <div class="product-colors">
                        <span 
                          v-for="color in product.colors" 
                          :key="color"
                          class="color-dot"
                          :style="{ backgroundColor: color }"
                        ></span>
                      </div>
                      <div class="product-pricing">
                        <span class="current-price">{{ product.price.toLocaleString() }}đ</span>
                        <span class="original-price">{{ product.originalPrice.toLocaleString() }}đ</span>
                      </div>
                      <div class="product-meta">
                        <span class="sold-count">Đã bán {{ product.sold }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination-section">
              <nav class="pagination-nav">
                <button class="page-btn" disabled>
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button class="page-btn active">1</button>
                <button class="page-btn">2</button>
                <button class="page-btn">3</button>
                <span class="page-dots">...</span>
                <button class="page-btn">10</button>
                <button class="page-btn">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.category-page {
  background: #fafafa;
  min-height: 100vh;
}

/* Breadcrumbs */
.breadcrumb-section {
  background: white;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #ff6b35;
}

.breadcrumb-item.active {
  color: #ff6b35;
  font-weight: 600;
}

.breadcrumb-item i {
  font-size: 10px;
  color: #ccc;
}

/* Category Header */
.category-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 40px 0;
}

.header-content {
  text-align: center;
}

.category-title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 15px;
}

.category-description {
  font-size: 18px;
  margin-bottom: 30px;
  opacity: 0.9;
}

.category-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.stat-item i {
  font-size: 18px;
}

/* Products Section */
.products-section {
  padding: 40px 0;
}

/* Filters Sidebar */
.filters-sidebar {
  position: sticky;
  top: 20px;
}

.filter-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.filter-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff6b35;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  padding-left: 30px;
  transition: color 0.3s;
}

.filter-option:hover {
  color: #ff6b35;
}

.filter-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 2px;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 50%;
  transition: all 0.3s;
}

.filter-option input:checked ~ .checkmark {
  background-color: #ff6b35;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.filter-option input:checked ~ .checkmark:after {
  display: block;
}

.filter-option .checkmark:after {
  top: 5px;
  left: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

/* Products Header */
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.results-info {
  font-weight: 600;
  color: #333;
}

.view-options {
  display: flex;
  gap: 5px;
}

.view-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn:hover,
.view-btn.active {
  background: #ff6b35;
  color: white;
  border-color: #ff6b35;
}

/* Products Grid */
.products-grid {
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  transition: all 0.3s;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.product-image-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #e74c3c;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
}

.product-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 2;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.action-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.action-btn:hover {
  background: #ff6b35;
  color: white;
  transform: scale(1.1);
}

.quick-add {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.8);
  padding: 15px;
  transform: translateY(100%);
  transition: transform 0.3s;
}

.product-card:hover .quick-add {
  transform: translateY(0);
}

.quick-add-btn {
  width: 100%;
  background: #ff6b35;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.quick-add-btn:hover {
  background: #e55a2e;
}

.product-info {
  padding: 20px;
}

.product-brand {
  font-size: 12px;
  color: #ff6b35;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.product-name {
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  font-size: 14px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  font-size: 12px;
  color: #ddd;
}

.stars i.active {
  color: #ffd700;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.product-colors {
  display: flex;
  gap: 6px;
  margin-bottom: 15px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #eee;
  cursor: pointer;
  transition: transform 0.3s;
}

.color-dot:hover {
  transform: scale(1.2);
}

.product-pricing {
  margin-bottom: 12px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff6b35;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}

.product-meta {
  font-size: 12px;
  color: #666;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.pagination-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.page-btn:hover:not(:disabled),
.page-btn.active {
  background: #ff6b35;
  color: white;
  border-color: #ff6b35;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-dots {
  color: #666;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 992px) {
  .category-stats {
    gap: 20px;
  }
  
  .stat-item {
    font-size: 14px;
  }
  
  .filters-sidebar {
    position: static;
  }
  
  .products-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .category-title {
    font-size: 32px;
  }
  
  .category-description {
    font-size: 16px;
  }
  
  .category-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-card {
    padding: 20px;
  }
  
  .breadcrumb-nav {
    flex-wrap: wrap;
  }
}

@media (max-width: 576px) {
  .category-title {
    font-size: 28px;
  }
  
  .products-header {
    padding: 15px;
  }
  
  .pagination-nav {
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .page-btn {
    width: 35px;
    height: 35px;
  }
}
</style>
