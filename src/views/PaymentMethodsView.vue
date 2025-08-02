<template>
  <UserLayout>
    <div class="payment-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb-section">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/">Trang chủ</router-link>
              </li>
              <li class="breadcrumb-item active">Phương thức thanh toán</li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="payment-content">
              <h1 class="page-title text-center mb-5">Phương Thức Thanh Toán</h1>

              <div class="payment-intro">
                <div class="alert alert-info">
                  <h5><i class="bi bi-credit-card me-2"></i>Đa dạng phương thức thanh toán</h5>
                  <p class="mb-0">BaloZone.vn hỗ trợ nhiều phương thức thanh toán khác nhau để mang lại sự tiện lợi tối đa cho khách hàng. Tất cả giao dịch đều được bảo mật với công nghệ SSL 256-bit.</p>
                </div>
              </div>

              <!-- Thanh toán Online -->
              <div class="payment-section">
                <h3 class="section-title">
                  <i class="bi bi-laptop text-primary me-2"></i>
                  Thanh Toán Online
                </h3>

                <div class="payment-methods">
                  <!-- Thẻ tín dụng/ghi nợ -->
                  <div class="payment-method">
                    <div class="method-header">
                      <div class="method-icon visa-icon">
                        <i class="bi bi-credit-card-2-front"></i>
                      </div>
                      <div class="method-info">
                        <h5>Thẻ Tín Dụng / Ghi Nợ</h5>
                        <p>Visa, MasterCard, JCB</p>
                      </div>
                      <div class="method-badge">
                        <span class="badge bg-success">Phổ biến</span>
                      </div>
                    </div>
                    <div class="method-details">
                      <div class="method-benefits">
                        <h6><i class="bi bi-check-circle text-success me-2"></i>Ưu điểm:</h6>
                        <ul>
                          <li>Thanh toán nhanh chóng, tiện lợi</li>
                          <li>Bảo mật cao với công nghệ 3D Secure</li>
                          <li>Hỗ trợ thanh toán trả góp</li>
                          <li>Tích lũy điểm thưởng ngân hàng</li>
                        </ul>
                      </div>
                      <div class="method-fees">
                        <p><strong>Phí giao dịch:</strong> <span class="text-success">Miễn phí</span></p>
                        <p><strong>Thời gian xử lý:</strong> Tức thì</p>
                      </div>
                    </div>
                  </div>

                  <!-- Ví điện tử -->
                  <div class="payment-method">
                    <div class="method-header">
                      <div class="method-icon wallet-icon">
                        <i class="bi bi-wallet2"></i>
                      </div>
                      <div class="method-info">
                        <h5>Ví Điện Tử</h5>
                        <p>MoMo, ZaloPay, ShopeePay, ViettelPay</p>
                      </div>
                      <div class="method-badge">
                        <span class="badge bg-info">Khuyến nghị</span>
                      </div>
                    </div>
                    <div class="method-details">
                      <div class="method-benefits">
                        <h6><i class="bi bi-check-circle text-success me-2"></i>Ưu điểm:</h6>
                        <ul>
                          <li>Thanh toán siêu nhanh bằng QR Code</li>
                          <li>Không cần nhập thông tin thẻ</li>
                          <li>Nhận cashback và ưu đãi từ ví</li>
                          <li>Bảo mật 2 lớp với sinh trắc học</li>
                        </ul>
                      </div>
                      <div class="wallet-logos">
                        <div class="row">
                          <div class="col-3">
                            <div class="wallet-logo momo">MoMo</div>
                          </div>
                          <div class="col-3">
                            <div class="wallet-logo zalopay">ZaloPay</div>
                          </div>
                          <div class="col-3">
                            <div class="wallet-logo shopeepay">ShopeePay</div>
                          </div>
                          <div class="col-3">
                            <div class="wallet-logo viettelpay">ViettelPay</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Internet Banking -->
                  <div class="payment-method">
                    <div class="method-header">
                      <div class="method-icon banking-icon">
                        <i class="bi bi-bank"></i>
                      </div>
                      <div class="method-info">
                        <h5>Internet Banking</h5>
                        <p>Tất cả ngân hàng tại Việt Nam</p>
                      </div>
                    </div>
                    <div class="method-details">
                      <div class="method-benefits">
                        <h6><i class="bi bi-check-circle text-success me-2"></i>Ưu điểm:</h6>
                        <ul>
                          <li>Hỗ trợ tất cả ngân hàng trong nước</li>
                          <li>Bảo mật cao với OTP</li>
                          <li>Có thể thanh toán số tiền lớn</li>
                          <li>Lịch sử giao dịch chi tiết</li>
                        </ul>
                      </div>
                      <div class="bank-list">
                        <p><strong>Ngân hàng hỗ trợ:</strong> Vietcombank, BIDV, VietinBank, Agribank, Techcombank, MB Bank, ACB, Sacombank và tất cả ngân hàng khác...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Thanh toán khi nhận hàng -->
              <div class="payment-section">
                <h3 class="section-title">
                  <i class="bi bi-cash-coin text-success me-2"></i>
                  Thanh Toán Khi Nhận Hàng (COD)
                </h3>

                <div class="cod-info">
                  <div class="cod-description">
                    <p class="section-content">
                      Phương thức thanh toán khi nhận hàng (COD - Cash on Delivery) cho phép bạn thanh toán bằng tiền mặt khi nhận được sản phẩm tại nhà.
                    </p>
                  </div>

                  <div class="cod-details">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="cod-card">
                          <i class="bi bi-check-circle-fill text-success cod-icon"></i>
                          <h6>Ưu điểm</h6>
                          <ul>
                            <li>Kiểm tra hàng trước khi thanh toán</li>
                            <li>Không cần thẻ tín dụng</li>
                            <li>An tâm về chất lượng sản phẩm</li>
                            <li>Phù hợp với mọi đối tượng</li>
                          </ul>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="cod-card">
                          <i class="bi bi-info-circle-fill text-info cod-icon"></i>
                          <h6>Lưu ý</h6>
                          <ul>
                            <li>Phí COD: 30.000đ (đơn hàng < 500.000đ)</li>
                            <li>Miễn phí COD (đơn hàng ≥ 500.000đ)</li>
                            <li>Chuẩn bị đủ tiền mặt</li>
                            <li>Có mặt khi shipper giao hàng</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Thanh toán trả góp -->
              <div class="payment-section">
                <h3 class="section-title">
                  <i class="bi bi-calendar-range text-warning me-2"></i>
                  Thanh Toán Trả Góp
                </h3>

                <div class="installment-info">
                  <p class="section-content">
                    BaloZone.vn hỗ trợ thanh toán trả góp 0% lãi suất qua các đối tác tài chính uy tín.
                  </p>

                  <div class="installment-options">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="installment-card">
                          <div class="installment-header">
                            <h6>Trả góp 3 tháng</h6>
                            <div class="installment-rate">0% lãi suất</div>
                          </div>
                          <div class="installment-details">
                            <p><strong>Áp dụng:</strong> Đơn hàng từ 1.000.000đ</p>
                            <p><strong>Điều kiện:</strong> Thẻ tín dụng</p>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="installment-card">
                          <div class="installment-header">
                            <h6>Trả góp 6 tháng</h6>
                            <div class="installment-rate">0% lãi suất</div>
                          </div>
                          <div class="installment-details">
                            <p><strong>Áp dụng:</strong> Đơn hàng từ 2.000.000đ</p>
                            <p><strong>Điều kiện:</strong> Thẻ tín dụng</p>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="installment-card">
                          <div class="installment-header">
                            <h6>Trả góp 12 tháng</h6>
                            <div class="installment-rate">0% lãi suất</div>
                          </div>
                          <div class="installment-details">
                            <p><strong>Áp dụng:</strong> Đơn hàng từ 5.000.000đ</p>
                            <p><strong>Điều kiện:</strong> Thẻ tín dụng</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="installment-partners">
                    <h6><i class="bi bi-building me-2"></i>Đối tác tài chính:</h6>
                    <div class="partner-list">
                      <span class="partner-badge">Home Credit</span>
                      <span class="partner-badge">FE Credit</span>
                      <span class="partner-badge">HD Saison</span>
                      <span class="partner-badge">Kredivo</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bảo mật thanh toán -->
              <div class="payment-section">
                <h3 class="section-title">
                  <i class="bi bi-shield-lock text-danger me-2"></i>
                  Bảo Mật Thanh Toán
                </h3>

                <div class="security-features">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="security-card">
                        <i class="bi bi-lock-fill security-icon"></i>
                        <h6>Mã hóa SSL 256-bit</h6>
                        <p>Tất cả thông tin thanh toán được mã hóa và bảo vệ tuyệt đối</p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="security-card">
                        <i class="bi bi-shield-check security-icon"></i>
                        <h6>Chuẩn PCI DSS</h6>
                        <p>Tuân thủ nghiêm ngặt tiêu chuẩn bảo mật thanh toán quốc tế</p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="security-card">
                        <i class="bi bi-eye-slash security-icon"></i>
                        <h6>Không lưu thông tin thẻ</h6>
                        <p>BaloZone không lưu trữ thông tin thẻ tín dụng của khách hàng</p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="security-card">
                        <i class="bi bi-telephone security-icon"></i>
                        <h6>Xác thực OTP</h6>
                        <p>Xác thực 2 lớp với OTP từ ngân hàng đảm bảo an toàn tối đa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Hướng dẫn thanh toán -->
              <div class="payment-section">
                <h3 class="section-title">
                  <i class="bi bi-list-check text-info me-2"></i>
                  Hướng Dẫn Thanh Toán
                </h3>

                <div class="payment-guide">
                  <div class="guide-steps">
                    <div class="guide-step">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <h6>Chọn sản phẩm</h6>
                        <p>Thêm sản phẩm vào giỏ hàng và kiểm tra thông tin</p>
                      </div>
                    </div>

                    <div class="guide-step">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <h6>Thanh toán</h6>
                        <p>Chọn phương thức thanh toán phù hợp</p>
                      </div>
                    </div>

                    <div class="guide-step">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <h6>Xác nhận</h6>
                        <p>Nhập thông tin và xác nhận giao dịch</p>
                      </div>
                    </div>

                    <div class="guide-step">
                      <div class="step-number">4</div>
                      <div class="step-content">
                        <h6>Hoàn tất</h6>
                        <p>Nhận xác nhận đơn hàng qua email/SMS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Hỗ trợ -->
              <div class="payment-section">
                <h3 class="section-title">
                  <i class="bi bi-headset text-primary me-2"></i>
                  Hỗ Trợ Thanh Toán
                </h3>
                <div class="support-info">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="support-card">
                        <i class="bi bi-telephone support-icon"></i>
                        <h6>Hotline 24/7</h6>
                        <p class="support-detail">1900 6750</p>
                        <small>Hỗ trợ thanh toán miễn phí</small>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="support-card">
                        <i class="bi bi-chat-dots support-icon"></i>
                        <h6>Live Chat</h6>
                        <p class="support-detail">Tư vấn trực tiếp</p>
                        <small>8:00 - 22:00 hàng ngày</small>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="support-card">
                        <i class="bi bi-envelope support-icon"></i>
                        <h6>Email</h6>
                        <p class="support-detail">payment@balozone.vn</p>
                        <small>Phản hồi trong 2 giờ</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="cta-section text-center mt-5">
                <div class="alert alert-primary">
                  <h5><i class="bi bi-credit-card me-2"></i>Sẵn sàng mua sắm?</h5>
                  <p class="mb-3">Khám phá bộ sưu tập vali, balo đẳng cấp tại BaloZone</p>
                  <router-link to="/" class="btn btn-primary me-3">
                    <i class="bi bi-shop me-2"></i>Mua sắm ngay
                  </router-link>
                  <router-link to="/contact" class="btn btn-outline-primary">
                    <i class="bi bi-telephone me-2"></i>Liên hệ hỗ trợ
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import UserLayout from '@/components/layouts/UserLayout.vue';

// Meta information for SEO
document.title = 'Phương Thức Thanh Toán - BaloZone.vn'
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.breadcrumb-section {
  background: linear-gradient(135deg, #d2491e 0%, #c73e1d 100%);
  padding: 1rem 0;
}

.breadcrumb {
  margin-bottom: 0;
}

.breadcrumb-item a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #fff;
}

.breadcrumb-item.active {
  color: #fff;
}

.payment-content {
  background: #fff;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.page-title {
  color: #2d3e50;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.payment-intro {
  margin-bottom: 3rem;
}

.payment-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.payment-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  color: #2d3e50;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-content {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 1.5rem;
}

.payment-methods {
  margin-top: 1.5rem;
}

.payment-method {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: #d2491e;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.method-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.method-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 1.5rem;
}

.visa-icon {
  background: linear-gradient(135deg, #1a1f71 0%, #0f4c81 100%);
  color: #fff;
}

.wallet-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: #fff;
}

.banking-icon {
  background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  color: #fff;
}

.method-info {
  flex: 1;
}

.method-info h5 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.method-info p {
  color: #666;
  margin-bottom: 0;
}

.method-badge {
  margin-left: auto;
}

.method-details {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.method-benefits h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.method-benefits ul {
  margin-bottom: 1.5rem;
}

.method-benefits li {
  color: #666;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.method-fees {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #28a745;
}

.method-fees p {
  margin-bottom: 0.5rem;
  color: #666;
}

.method-fees p:last-child {
  margin-bottom: 0;
}

.wallet-logos {
  margin-top: 1rem;
}

.wallet-logo {
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.8rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.wallet-logo:hover {
  transform: scale(1.05);
}

.wallet-logo.momo {
  color: #b0006d;
  border-color: #b0006d;
}

.wallet-logo.zalopay {
  color: #0068ff;
  border-color: #0068ff;
}

.wallet-logo.shopeepay {
  color: #ee4d2d;
  border-color: #ee4d2d;
}

.wallet-logo.viettelpay {
  color: #da020e;
  border-color: #da020e;
}

.bank-list {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #007bff;
}

.bank-list p {
  margin-bottom: 0;
  color: #666;
  line-height: 1.6;
}

.cod-info {
  margin-top: 1.5rem;
}

.cod-description {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.cod-details {
  margin-top: 2rem;
}

.cod-card {
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  height: 100%;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.cod-card:hover {
  border-color: #28a745;
  transform: translateY(-5px);
}

.cod-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cod-card h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.cod-card ul {
  margin-bottom: 0;
}

.cod-card li {
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.installment-info {
  margin-top: 1.5rem;
}

.installment-options {
  margin-top: 2rem;
}

.installment-card {
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  height: 100%;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.installment-card:hover {
  border-color: #ffc107;
  transform: translateY(-5px);
}

.installment-header {
  text-align: center;
  margin-bottom: 1rem;
}

.installment-header h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.installment-rate {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: #fff;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.installment-details p {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.installment-partners {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.installment-partners h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.partner-list {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.partner-badge {
  background: #f8f9fa;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
}

.security-features {
  margin-top: 1.5rem;
}

.security-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.security-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.security-icon {
  color: #d2491e;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.security-card h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.security-card p {
  color: #666;
  margin-bottom: 0;
  line-height: 1.6;
  font-size: 0.9rem;
}

.payment-guide {
  margin-top: 1.5rem;
}

.guide-steps {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.guide-steps::before {
  content: '';
  position: absolute;
  top: 25px;
  left: 25px;
  right: 25px;
  height: 2px;
  background: #e9ecef;
  z-index: 1;
}

.guide-step {
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 2;
  background: #fff;
  padding: 0 1rem;
}

.step-number {
  background: #d2491e;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0 auto 1rem auto;
}

.step-content h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #666;
  margin-bottom: 0;
  line-height: 1.6;
  font-size: 0.9rem;
}

.support-info {
  margin-top: 1.5rem;
}

.support-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.support-card:hover {
  border-color: #d2491e;
  transform: translateY(-5px);
}

.support-icon {
  color: #d2491e;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.support-card h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.support-detail {
  color: #d2491e;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.support-card small {
  color: #666;
  line-height: 1.4;
}

.alert-info {
  border: none;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 15px;
  padding: 2rem;
}

.alert-info h5 {
  color: #1976d2;
  font-weight: 600;
}

.alert-primary {
  border: none;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 15px;
  padding: 2rem;
}

.alert-primary h5 {
  color: #1976d2;
  font-weight: 600;
}

.btn {
  border-radius: 25px;
  padding: 0.7rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #d2491e 0%, #c73e1d 100%);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(210, 73, 30, 0.4);
}

.btn-outline-primary {
  color: #d2491e;
  border-color: #d2491e;
}

.btn-outline-primary:hover {
  background: #d2491e;
  border-color: #d2491e;
  transform: translateY(-2px);
}

.cta-section {
  border-top: 2px solid #e9ecef;
  padding-top: 2rem;
}

@media (max-width: 768px) {
  .payment-content {
    padding: 2rem 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .method-header {
    flex-direction: column;
    text-align: center;
  }

  .method-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .method-badge {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .guide-steps {
    flex-direction: column;
    gap: 2rem;
  }

  .guide-steps::before {
    display: none;
  }

  .guide-step {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 1.5rem;
  }
}
</style>
