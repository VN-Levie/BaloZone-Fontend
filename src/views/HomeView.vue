<script setup lang="ts">
import { ref } from 'vue'

// Sample data
const featuredProducts = ref([
  {
    id: 1,
    name: 'Vali Du Lịch Cao Cấp',
    price: 799000,
    originalPrice: 1200000,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['red', 'blue', 'gray'],
    rating: 4.8
  },
  {
    id: 2,
    name: 'Balo Laptop Business',
    price: 1399000,
    originalPrice: 1800000,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['black', 'navy', 'gray'],
    rating: 4.9
  },
  {
    id: 3,
    name: 'Vali Kéo Size Cabin',
    price: 899000,
    originalPrice: 1300000,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['mint', 'pink', 'white'],
    rating: 4.7
  },
  {
    id: 4,
    name: 'Balo Du Lịch Thể Thao',
    price: 599000,
    originalPrice: 850000,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['green', 'orange', 'black'],
    rating: 4.6
  },
  {
    id: 5,
    name: 'Vali Cứng Chống Va Đập',
    price: 1299000,
    originalPrice: 1700000,
    discount: 24,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    colors: ['silver', 'black', 'blue'],
    rating: 4.8
  }
])

const brands = ref([
  'Samsonite', 'American Tourister', 'Delsey', 'VIP', 'Kamiliant', 'Polo'
])
</script>

<template>
  <div class="homepage">
    <!-- Hero Banner Section -->
    <section class="hero-section">
      <div class="container-fluid px-4">
        <div class="hero-banner">
          <div class="banner-content">
            <div class="discount-badge">
              <span class="discount-text">ƯU ĐÃI X3</span>
            </div>
            <h1 class="hero-title">Sale Giữa Tháng</h1>
            <div class="promotion-tags">
              <span class="tag">Giảm giá 3 SIZE</span>
              <span class="tag">Mua được 3</span>
              <span class="tag">Miễn phí vận chuyển</span>
            </div>
            <div class="time-countdown">
              <span class="countdown-text">13.06 - 16.06</span>
              <button class="cta-button">⚡ MUA NGAY</button>
            </div>
          </div>
          <div class="hero-products">
            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=280&h=350&fit=crop" alt="Vali xanh" class="hero-product-1" />
            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=280&h=350&fit=crop" alt="Vali đỏ" class="hero-product-2" />
          </div>
        </div>
      </div>
    </section>

    <!-- Service Features -->
    <section class="service-features">
      <div class="container-fluid px-4">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="feature-card">
              <div class="feature-icon">#1</div>
              <div class="feature-content">
                <h6>Website bán VALI TẠI VIỆT NAM</h6>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <div class="feature-icon">🛡️</div>
              <div class="feature-content">
                <h6>BẢO HÀNH TRỌN ĐỜI</h6>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <div class="feature-content">
                <h6>GIAO HÀNG 2H</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Flash Sale Section -->
    <section class="flash-sale-section">
      <div class="container-fluid px-4">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="flash-sale-card">
              <div class="sale-badge">DEAL ĐỘC QUYỀN ONLINE</div>
              <div class="sale-content">
                <div class="sale-price">799K</div>
                <div class="sale-original">2.300K</div>
                <button class="sale-btn">⚡ MUA NGAY</button>
              </div>
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop" alt="Balo đen" class="sale-image" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="flash-sale-card flash-sale-card-blue">
              <div class="sale-badge">MIA SIZE LỚN</div>
              <div class="sale-content">
                <div class="sale-price">1.399K</div>
                <div class="sale-original">3.000K</div>
                <button class="sale-btn">⚡ MUA NGAY</button>
              </div>
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop" alt="Set vali" class="sale-image" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid Section -->
    <section class="product-grid-section">
      <div class="container-fluid px-4">
        <div class="section-header">
          <h2 class="section-title">🔥 ƯU ĐÃI X3</h2>
          <div class="filter-tabs">
            <button class="filter-tab active">TẤT CẢ</button>
            <button class="filter-tab">BALO</button>
            <button class="filter-tab">VALI</button>
            <button class="filter-tab">TÚI XÁCH</button>
            <button class="filter-tab">PHỤ KIỆN</button>
          </div>
        </div>
        
        <div class="product-grid">
          <div class="row g-3">
            <div 
              v-for="product in featuredProducts" 
              :key="product.id" 
              class="col-xl-2-4 col-lg-3 col-md-4 col-sm-6 mb-4"
            >
              <div class="product-card">
                <div class="product-image-container">
                  <img :src="product.image" :alt="product.name" class="product-image" />
                  <div class="discount-badge-product">-{{ product.discount }}%</div>
                  <div class="product-actions">
                    <button class="action-btn">❤️</button>
                    <button class="action-btn">👁️</button>
                  </div>
                </div>
                <div class="product-info">
                  <h6 class="product-name">{{ product.name }}</h6>
                  <div class="product-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-score">({{ product.rating }})</span>
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
                  <button class="add-to-cart-btn">THÊM VÀO GIỎ</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Section -->
    <section class="brand-section">
      <div class="container">
        <h3 class="text-center mb-4">Các thương hiệu nổi tiếng</h3>
        <div class="brand-grid">
          <div v-for="brand in brands" :key="brand" class="brand-item">
            <span>{{ brand }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section">
      <div class="container">
        <div class="newsletter-card">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h4 class="newsletter-title">#1 Website bán VALI TẠI VIỆT NAM</h4>
              <p class="newsletter-subtitle">Ngọc Châu - Đại sứ thương hiệu</p>
              <p class="newsletter-description">3 năm - 5 quốc gia - 1 chiếc vali vẫn được bảo hành</p>
              <button class="newsletter-btn">KHÁM PHÁ NGAY</button>
            </div>
            <div class="col-md-4">
              <img src="https://images.unsplash.com/photo-1494790108755-2616c6eb1ca1?w=300&h=400&fit=crop" alt="Ngọc Châu" class="ambassador-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Homepage Styles */
.homepage {
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  padding: 40px 0;
  color: white;
}

.hero-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.banner-content {
  flex: 1;
  max-width: 50%;
}

.discount-badge {
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 20px;
}

.discount-text {
  font-weight: bold;
  font-size: 14px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
}

.promotion-tags {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.tag {
  background: rgba(0,0,0,0.3);
  padding: 8px 16px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 600;
}

.time-countdown {
  display: flex;
  align-items: center;
  gap: 20px;
}

.countdown-text {
  font-size: 24px;
  font-weight: bold;
}

.cta-button {
  background: #ffd700;
  color: #333;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.hero-products {
  display: flex;
  gap: 25px;
  position: relative;
  align-items: center;
}

.hero-product-1, .hero-product-2 {
  width: 200px;
  height: 260px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  transition: transform 0.3s;
}

.hero-product-1:hover, .hero-product-2:hover {
  transform: translateY(-10px);
}

.hero-product-2 {
  margin-top: 40px;
}

/* Service Features */
.service-features {
  padding: 30px 0;
  background: #f8f9fa;
}

.feature-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  transition: all 0.3s;
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}

.feature-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  margin-right: 20px;
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
}

.feature-content h6 {
  margin: 0;
  font-weight: 700;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
}

/* Flash Sale */
.flash-sale-section {
  padding: 40px 0;
}

.flash-sale-card {
  background: linear-gradient(135deg, #333 0%, #555 100%);
  color: white;
  padding: 35px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 180px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.flash-sale-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.flash-sale-card-blue {
  background: linear-gradient(135deg, #2c5aa0 0%, #4472ca 100%);
}

.sale-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #ff6b35;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.sale-content {
  flex: 1;
}

.sale-price {
  font-size: 36px;
  font-weight: bold;
  color: #ffd700;
}

.sale-original {
  text-decoration: line-through;
  color: #ccc;
  margin-left: 10px;
}

.sale-btn {
  background: #ffd700;
  color: #333;
  border: none;
  padding: 12px 25px;
  border-radius: 20px;
  font-weight: bold;
  margin-top: 15px;
  cursor: pointer;
}

.sale-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

/* Product Grid */
.product-grid-section {
  padding: 50px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  color: #ff6b35;
  margin-bottom: 20px;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.filter-tab {
  background: transparent;
  border: 2px solid #ff6b35;
  color: #ff6b35;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab.active,
.filter-tab:hover {
  background: #ff6b35;
  color: white;
}

.col-lg-20 {
  flex: 0 0 20%;
  max-width: 20%;
}

/* Custom column for 5 products per row */
.col-xl-2-4 {
  flex: 0 0 20%;
  max-width: 20%;
}

.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.discount-badge-product {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff6b35;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.product-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.action-btn {
  width: 35px;
  height: 35px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.product-info {
  padding: 20px;
}

.product-name {
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.stars {
  color: #ffd700;
  font-size: 12px;
}

.rating-score {
  font-size: 12px;
  color: #666;
}

.product-colors {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #eee;
}

.product-pricing {
  margin-bottom: 15px;
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

.add-to-cart-btn {
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

.add-to-cart-btn:hover {
  background: #e55a2e;
}

/* Brand Section */
.brand-section {
  padding: 40px 0;
  background: #f8f9fa;
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.brand-item {
  background: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-weight: 600;
  color: #333;
}

/* Newsletter Section */
.newsletter-section {
  padding: 50px 0;
}

.newsletter-card {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  padding: 40px;
  border-radius: 20px;
}

.newsletter-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.newsletter-subtitle {
  font-size: 18px;
  margin-bottom: 15px;
  color: rgba(255,255,255,0.9);
}

.newsletter-description {
  margin-bottom: 25px;
  color: rgba(255,255,255,0.8);
}

.newsletter-btn {
  background: white;
  color: #ff6b35;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s;
}

.newsletter-btn:hover {
  transform: translateY(-2px);
}

.ambassador-image {
  width: 100%;
  max-width: 250px;
  border-radius: 15px;
}

/* Responsive */
@media (max-width: 1400px) {
  .col-xl-2-4 {
    flex: 0 0 25%;
    max-width: 25%;
  }
}

@media (max-width: 1200px) {
  .col-xl-2-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  
  .hero-products {
    gap: 15px;
  }
  
  .hero-product-1, .hero-product-2 {
    width: 160px;
    height: 220px;
  }
}

@media (max-width: 992px) {
  .col-xl-2-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  .hero-banner {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-content {
    max-width: 100%;
    margin-bottom: 30px;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .promotion-tags {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-content {
    max-width: 100%;
    margin-bottom: 30px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .promotion-tags {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .brand-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .col-xl-2-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
  }
  
  .flash-sale-card {
    flex-direction: column;
    text-align: center;
    padding: 25px;
  }
  
  .sale-image {
    margin-top: 20px;
  }
}

@media (max-width: 576px) {
  .col-xl-2-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .brand-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-products {
    flex-direction: column;
    gap: 15px;
  }
  
  .hero-product-2 {
    margin-top: 0;
  }
  
  .flash-sale-card {
    padding: 20px;
  }
  
  .sale-price {
    font-size: 28px;
  }
}
</style>
