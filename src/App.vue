<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Header -->
  <header class="header-section">
    <!-- Top banner -->
    <div class="top-banner">
      <div class="container text-center">
        <span class="text-white fw-bold">🎯 ƯU ĐÃI X3 - SIÊU SALE BALO & VALI 🎯</span>
      </div>
    </div>
    
    <!-- Main header -->
    <div class="main-header">
      <div class="container-fluid px-4">
        <div class="d-flex align-items-center justify-content-between py-3">
          <!-- Logo -->
          <div class="logo-brand">
            <h2 class="brand-name">BaloZone</h2>
          </div>
          
          <!-- Search bar -->
          <div class="search-container flex-grow-1 mx-5">
            <input 
              type="text" 
              class="search-input" 
              placeholder="Tìm kiếm balo, vali, túi xách..."
            />
            <button class="search-btn">
              <i class="bi bi-search"></i>
            </button>
          </div>
          
          <!-- User actions -->
          <div class="user-actions d-flex gap-4">
            <a href="#" class="action-link">
              <i class="bi bi-heart"></i>
              <span>Yêu thích</span>
            </a>
            <a href="#" class="action-link">
              <i class="bi bi-cart3"></i>
              <span>Giỏ hàng</span>
            </a>
            <a href="#" class="action-link">
              <i class="bi bi-person"></i>
              <span>Tài khoản</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="main-nav">
      <div class="container-fluid px-4">
        <ul class="nav-list d-flex align-items-center justify-content-start">
          <li><router-link to="/" class="nav-link-active">Trang chủ</router-link></li>
          <li><router-link to="/category/balo">Balo</router-link></li>
          <li><router-link to="/category/vali">Vali</router-link></li>
          <li><router-link to="/category/tui-xach">Túi xách</router-link></li>
          <li><router-link to="/category/phu-kien">Phụ kiện</router-link></li>
          <li><a href="#" class="nav-link-sale">Sale</a></li>
          <li><a href="#">Thương hiệu</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <!-- Main content -->
  <main class="main-content">
    <RouterView />
  </main>
  
  <!-- Footer -->
  <footer class="footer-section">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h5>BaloZone</h5>
          <p>Website bán balo, vali uy tín #1 Việt Nam</p>
          <div class="social-links">
            <a href="#"><i class="bi bi-facebook"></i></a>
            <a href="#"><i class="bi bi-instagram"></i></a>
            <a href="#"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
        <div class="col-md-2">
          <h6>Danh mục</h6>
          <ul class="footer-links">
            <li><a href="#">Balo</a></li>
            <li><a href="#">Vali</a></li>
            <li><a href="#">Túi xách</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h6>Hỗ trợ khách hàng</h6>
          <ul class="footer-links">
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Bảo hành</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h6>Liên hệ</h6>
          <p><i class="bi bi-telephone"></i> 1900 6198</p>
          <p><i class="bi bi-envelope"></i> support@balozone.vn</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fafafa;
}

/* Header styles */
.top-banner {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  padding: 8px 0;
  font-size: 14px;
}

.main-header {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.brand-name {
  color: #ff6b35;
  font-weight: 800;
  font-size: 28px;
  margin: 0;
}

.search-container {
  position: relative;
  max-width: 600px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 14px 60px 14px 20px;
  border: 2px solid #ff6b35;
  border-radius: 30px;
  outline: none;
  font-size: 16px;
  background: #fff;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.search-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: #ff6b35;
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
}

.search-btn:hover {
  background: #e55a2e;
}

.user-actions .action-link {
  text-decoration: none;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 70px;
}

.user-actions .action-link:hover {
  color: #ff6b35;
  background: rgba(255, 107, 53, 0.05);
}

.user-actions .action-link i {
  font-size: 22px;
  margin-bottom: 4px;
}

.main-nav {
  background: #ff6b35;
  padding: 8px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.main-content {
  min-height: calc(100vh - 200px);
}

.nav-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.nav-list li a,
.nav-list li router-link {
  display: block;
  padding: 16px 24px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s;
  border-radius: 6px;
  margin: 0 2px;
}

.nav-list li a:hover,
.nav-list li a.nav-link-active,
.nav-list li a.router-link-active {
  background: rgba(255,255,255,0.15);
  transform: translateY(-1px);
}

.nav-list li a.nav-link-sale {
  background: #ffd700;
  color: #333;
  font-weight: 700;
}

.nav-list li a.nav-link-sale:hover {
  background: #ffed4a;
  transform: translateY(-1px);
}

/* Footer styles */
.footer-section {
  background: #2c3e50;
  color: white;
  padding: 40px 0 20px;
  margin-top: 50px;
}

.footer-section h5,
.footer-section h6 {
  color: #ff6b35;
  margin-bottom: 15px;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #ff6b35;
}

.social-links a {
  color: white;
  font-size: 24px;
  margin-right: 15px;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #ff6b35;
}

/* Responsive */
@media (max-width: 1200px) {
  .search-container {
    max-width: 400px;
  }
  
  .user-actions {
    gap: 15px !important;
  }
  
  .user-actions .action-link {
    min-width: 60px;
    font-size: 12px;
  }
}

@media (max-width: 992px) {
  .main-header .d-flex {
    flex-wrap: wrap;
  }
  
  .search-container {
    order: 3;
    flex-basis: 100%;
    margin: 15px 0 0 0 !important;
    max-width: 100%;
  }
  
  .user-actions {
    order: 2;
  }
}

@media (max-width: 768px) {
  .user-actions {
    justify-content: center !important;
    margin-top: 15px;
    gap: 10px !important;
  }
  
  .user-actions .action-link {
    min-width: 50px;
    font-size: 11px;
    padding: 6px 8px;
  }
  
  .user-actions .action-link i {
    font-size: 18px;
  }
  
  .nav-list {
    flex-wrap: wrap;
  }
  
  .nav-list li a {
    padding: 12px 16px;
    font-size: 14px;
    margin: 1px;
  }
  
  .search-input {
    padding: 12px 50px 12px 16px;
    font-size: 14px;
  }
  
  .search-btn {
    width: 38px;
    height: 38px;
  }
}
</style>
