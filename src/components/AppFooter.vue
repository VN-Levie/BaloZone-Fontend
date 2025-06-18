<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="container-fluid px-4">
        <div class="row">
          <!-- Company Info -->
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="footer-section">
              <div class="footer-logo mb-3">
                <img src="/favicon.ico" alt="BaloZone" class="logo-img" />
                <span class="brand-text">BaloZone</span>
              </div>
              <p class="footer-description">
                Chuyên cung cấp các sản phẩm balo, vali, túi xách chất lượng cao 
                với giá cả hợp lý. Uy tín - Chất lượng - Dịch vụ tốt nhất.
              </p>
              <div class="social-links">
                <a href="#" class="social-link">
                  <i class="bi bi-facebook"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="bi bi-instagram"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="bi bi-youtube"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="bi bi-tiktok"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-2 col-md-6 mb-4">
            <div class="footer-section">
              <h5 class="footer-title">Liên kết nhanh</h5>
              <ul class="footer-links">
                <li><router-link to="/">Trang chủ</router-link></li>
                <li><router-link to="/category/balo">Balo</router-link></li>
                <li><router-link to="/category/vali">Vali</router-link></li>
                <li><router-link to="/category/tui-xach">Túi Xách</router-link></li>
                <li><router-link to="/news">Tin tức</router-link></li>
                <li><router-link to="/contact">Liên hệ</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Customer Service -->
          <div class="col-lg-2 col-md-6 mb-4">
            <div class="footer-section">
              <h5 class="footer-title">Hỗ trợ khách hàng</h5>
              <ul class="footer-links">
                <li><a href="#">Hướng dẫn mua hàng</a></li>
                <li><a href="#">Chính sách đổi trả</a></li>
                <li><a href="#">Chính sách bảo hành</a></li>
                <li><a href="#">Phương thức thanh toán</a></li>
                <li><a href="#">Vận chuyển giao hàng</a></li>
                <li><a href="#">Câu hỏi thường gặp</a></li>
              </ul>
            </div>
          </div>

          <!-- Account -->
          <div class="col-lg-2 col-md-6 mb-4">
            <div class="footer-section">
              <h5 class="footer-title">Tài khoản</h5>
              <ul class="footer-links">
                <li><router-link to="/login">Đăng nhập</router-link></li>
                <li><router-link to="/register">Đăng ký</router-link></li>
                <li><router-link to="/profile">Thông tin tài khoản</router-link></li>
                <li><router-link to="/orders">Lịch sử đơn hàng</router-link></li>
                <li><router-link to="/wishlist">Danh sách yêu thích</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="footer-section">
              <h5 class="footer-title">Thông tin liên hệ</h5>
              <div class="contact-info">
                <div class="contact-item">
                  <i class="bi bi-geo-alt"></i>
                  <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                </div>
                <div class="contact-item">
                  <i class="bi bi-telephone"></i>
                  <span>
                    <a href="tel:0123456789">0123 456 789</a>
                  </span>
                </div>
                <div class="contact-item">
                  <i class="bi bi-envelope"></i>
                  <span>
                    <a href="mailto:contact@balozone.com">contact@balozone.com</a>
                  </span>
                </div>
                <div class="contact-item">
                  <i class="bi bi-clock"></i>
                  <span>Thứ 2 - Chủ nhật: 8:00 - 22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="footer-bottom">
      <div class="container-fluid px-4">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="copyright">
              © {{ currentYear }} BaloZone. Tất cả quyền được bảo lưu.
            </p>
          </div>
          <div class="col-md-6">
            <div class="payment-methods">
              <span class="payment-text">Phương thức thanh toán:</span>
              <div class="payment-icons">
                <i class="bi bi-credit-card-2-front"></i>
                <i class="bi bi-paypal"></i>
                <i class="bi bi-bank"></i>
              </div>
            </div>
          </div>
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
  background: #343a40;
  color: #fff;
  margin-top: auto;
}

.footer-content {
  padding: 3rem 0 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007bff;
}

.footer-description {
  color: #adb5bd;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #495057;
  color: #fff;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #007bff;
  color: #fff;
  transform: translateY(-2px);
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #007bff;
}

.contact-info {
  space-y: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.contact-item i {
  color: #007bff;
  font-size: 1.1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.contact-item span {
  color: #adb5bd;
}

.contact-item a {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-item a:hover {
  color: #007bff;
}

.footer-bottom {
  background: #212529;
  padding: 1.5rem 0;
  border-top: 1px solid #495057;
}

.copyright {
  margin: 0;
  color: #adb5bd;
  font-size: 0.9rem;
}

.payment-methods {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.payment-text {
  color: #adb5bd;
  font-size: 0.9rem;
}

.payment-icons {
  display: flex;
  gap: 0.5rem;
}

.payment-icons i {
  font-size: 1.25rem;
  color: #adb5bd;
}

@media (max-width: 768px) {
  .footer-content {
    padding: 2rem 0 1rem;
  }
  
  .payment-methods {
    justify-content: flex-start;
    margin-top: 1rem;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>
