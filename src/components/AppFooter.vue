<template>
  <footer class="app-footer">
    <!-- Main Footer Content -->
    <div class="footer-content">
      <div class="container-fluid p-0">
        <div class="row g-0 footer-sections-row">
          <!-- Chính sách -->
          <div class="col-lg-2 col-md-6">
            <div class="footer-section dark-section">
              <h5 class="footer-title">CHÍNH SÁCH</h5>
              <ul class="footer-links">
                <li><router-link to="/warranty-policy">Chính sách bảo hành</router-link></li>
                <li><router-link to="/privacy-policy">Chính sách bảo mật</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Hỗ trợ khách hàng -->
          <div class="col-lg-3 col-md-6">
            <div class="footer-section orange-section">
              <h5 class="footer-title">HỖ TRỢ KHÁCH HÀNG</h5>
              <ul class="footer-links">
                <li><router-link to="/suitcase-lock-guide">Hướng dẫn sử dụng khóa Vali</router-link></li>
                <li><router-link to="/payment-methods">Phương thức thanh toán</router-link></li>
                <li><router-link to="/voucher-guide">Hướng dẫn sử dụng mã voucher</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Kiến thức hành lý -->
          <div class="col-lg-2 col-md-6">
            <div class="footer-section orange-section">
              <h5 class="footer-title">KIẾN THỨC HÀNH LÝ</h5>
              <ul class="footer-links">
                <li><router-link to="/luggage-tips">Bí kíp chọn hành lý</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Về BaloZone -->
          <div class="col-lg-2 col-md-6">
            <div class="footer-section dark-section">
              <h5 class="footer-title">VỀ BALOZONE.vn</h5>
              <ul class="footer-links">
                <li><router-link to="/about-balozone">Câu chuyện về BaloZone.vn</router-link></li>
                <li><a href="#">Quỹ bảo vệ môi trường "SAVE THE OCEAN"</a></li>
              </ul>
            </div>
          </div>

          <!-- Kết nối với BaloZone.vn -->
          <div class="col-lg-3 col-md-12">
            <div class="footer-section orange-section">
              <h5 class="footer-title">KẾT NỐI VỚI BALOZONE.VN</h5>
              <div class="social-links">
                <a href="#" class="social-link facebook">
                  <i class="bi bi-facebook"></i>
                </a>
                <a href="#" class="social-link tiktok">
                  <i class="bi bi-tiktok"></i>
                </a>
                <a href="#" class="social-link instagram">
                  <i class="bi bi-instagram"></i>
                </a>
                <a href="#" class="social-link zalo">
                  <span class="zalo-text">Zalo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Company Information -->
    <div class="company-info">
      <div class="container-fluid px-4">
        <div class="company-details">
          <p class="company-name">
            Copyright &copy; {{ currentYear }} BaloZone.vn. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #d2491e 0%, #c73e1d 100%);
  color: #fff;
  margin-top: auto;
}

.store-info-header {
  background: #fff;
  padding: 1rem 0;
  border-radius: 10px 10px 0 0;
  margin-bottom: 0;
}

/* 
.store-info-header .container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

.store-badge {
  background: #d2491e;
  color: #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.store-badge i {
  font-size: 1.1rem;
}

.hotline-info {
  display: flex;
  gap: 3rem;
}

.hotline-item {
  text-align: center;
}

.hotline-label {
  display: block;
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.hotline-number {
  display: block;
  color: #d2491e;
  font-size: 1.5rem;
  font-weight: 700;
}

.footer-content {
  padding: 0;
  background: transparent;
}

.footer-sections-row {
  display: flex;
  align-items: stretch;
}

.footer-sections-row>div {
  display: flex;
}

.footer-section {
  padding: 2.5rem 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.footer-section.dark-section {
  background: #2d3e50;
}

.footer-section.orange-section {
  background: #d2491e;
}

.footer-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  line-height: 1.4;
}

.footer-links a:hover {
  color: #fff;
  padding-left: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.social-link.facebook {
  background: #1877f2;
  color: #fff;
}

.social-link.tiktok {
  background: #000;
  color: #fff;
}

.social-link.instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #fff;
}

.social-link.zalo {
  background: #0068ff;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.social-link i {
  font-size: 1.2rem;
}

.zalo-text {
  font-size: 0.7rem;
  font-weight: 600;
}

.company-info {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* .company-info .container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
} */

.company-details {
  flex: 1;
}

.company-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.company-registration {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
}

.certifications {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cert-badge {
  height: 40px;
  border-radius: 5px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.cert-badge:hover {
  opacity: 1;
}

@media (max-width: 992px) {
  .hotline-info {
    gap: 1.5rem;
  }

  .hotline-number {
    font-size: 1.2rem;
  }

  .footer-sections-row {
    flex-direction: column;
  }

  .footer-section {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .store-info-header .container-fluid {
    flex-direction: column;
    gap: 1rem;
  }

  .hotline-info {
    justify-content: center;
  }

  .footer-sections-row {
    flex-direction: column;
  }

  .footer-section {
    padding: 1.5rem 1rem;
  }

  .company-info .container-fluid {
    flex-direction: column;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .hotline-info {
    flex-direction: column;
    gap: 1rem;
  }

  .footer-section {
    padding: 1.5rem 1rem;
  }

  .social-links {
    justify-content: flex-start;
  }
}
</style>
