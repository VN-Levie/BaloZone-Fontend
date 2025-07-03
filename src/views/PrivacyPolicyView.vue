<template>
  <div class="privacy-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb-section">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Trang chủ</router-link>
            </li>
            <li class="breadcrumb-item active">Chính sách bảo mật</li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="privacy-content">
            <h1 class="page-title text-center mb-5">Chính Sách Bảo Mật Thông Tin</h1>
            
            <div class="privacy-section">
              <h3 class="section-title">
                <i class="bi bi-shield-lock text-primary me-2"></i>
                Cam Kết Bảo Mật
              </h3>
              <p class="section-content">
                BaloZone.vn cam kết bảo vệ thông tin cá nhân của khách hàng theo các tiêu chuẩn bảo mật cao nhất. Chúng tôi hiểu rằng thông tin cá nhân là tài sản quý giá và sẽ thực hiện mọi biện pháp cần thiết để bảo vệ dữ liệu của bạn.
              </p>
            </div>

            <div class="privacy-section">
              <h3 class="section-title">
                <i class="bi bi-person-check text-success me-2"></i>
                Thông Tin Chúng Tôi Thu Thập
              </h3>
              <div class="info-categories">
                <div class="info-category">
                  <h5><i class="bi bi-check-circle text-success me-2"></i>Thông tin cá nhân cơ bản</h5>
                  <ul>
                    <li>Họ và tên</li>
                    <li>Số điện thoại</li>
                    <li>Địa chỉ email</li>
                    <li>Địa chỉ giao hàng</li>
                    <li>Ngày sinh (nếu có)</li>
                  </ul>
                </div>
                
                <div class="info-category">
                  <h5><i class="bi bi-check-circle text-success me-2"></i>Thông tin giao dịch</h5>
                  <ul>
                    <li>Lịch sử mua hàng</li>
                    <li>Phương thức thanh toán</li>
                    <li>Thông tin đơn hàng</li>
                    <li>Phản hồi và đánh giá</li>
                  </ul>
                </div>

                <div class="info-category">
                  <h5><i class="bi bi-check-circle text-success me-2"></i>Thông tin kỹ thuật</h5>
                  <ul>
                    <li>Địa chỉ IP</li>
                    <li>Loại trình duyệt</li>
                    <li>Hệ điều hành</li>
                    <li>Cookies và dữ liệu tương tác</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="privacy-section">
              <h3 class="section-title">
                <i class="bi bi-gear text-info me-2"></i>
                Mục Đích Sử Dụng Thông Tin
              </h3>
              <div class="purpose-list">
                <div class="purpose-item">
                  <div class="purpose-icon">
                    <i class="bi bi-cart-check"></i>
                  </div>
                  <div class="purpose-content">
                    <h6>Xử lý đơn hàng</h6>
                    <p>Xác nhận, xử lý và giao hàng đơn đặt hàng của bạn</p>
                  </div>
                </div>

                <div class="purpose-item">
                  <div class="purpose-icon">
                    <i class="bi bi-headset"></i>
                  </div>
                  <div class="purpose-content">
                    <h6>Chăm sóc khách hàng</h6>
                    <p>Hỗ trợ kỹ thuật, giải đáp thắc mắc và xử lý khiếu nại</p>
                  </div>
                </div>

                <div class="purpose-item">
                  <div class="purpose-icon">
                    <i class="bi bi-megaphone"></i>
                  </div>
                  <div class="purpose-content">
                    <h6>Marketing và khuyến mãi</h6>
                    <p>Gửi thông tin sản phẩm mới, ưu đãi và chương trình khuyến mãi</p>
                  </div>
                </div>

                <div class="purpose-item">
                  <div class="purpose-icon">
                    <i class="bi bi-graph-up"></i>
                  </div>
                  <div class="purpose-content">
                    <h6>Cải thiện dịch vụ</h6>
                    <p>Phân tích hành vi người dùng để nâng cao chất lượng website</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="privacy-section">
              <h3 class="section-title">
                <i class="bi bi-shield-check text-warning me-2"></i>
                Biện Pháp Bảo Mật
              </h3>
              <div class="security-measures">
                <div class="row">
                  <div class="col-md-6">
                    <div class="security-card">
                      <i class="bi bi-lock-fill security-icon"></i>
                      <h6>Mã hóa SSL</h6>
                      <p>Tất cả dữ liệu được mã hóa SSL 256-bit trong quá trình truyền tải</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="security-card">
                      <i class="bi bi-server security-icon"></i>
                      <h6>Máy chủ an toàn</h6>
                      <p>Hệ thống máy chủ được bảo vệ bởi tường lửa và giám sát 24/7</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="security-card">
                      <i class="bi bi-person-lock security-icon"></i>
                      <h6>Kiểm soát truy cập</h6>
                      <p>Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin khách hàng</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="security-card">
                      <i class="bi bi-arrow-clockwise security-icon"></i>
                      <h6>Sao lưu dữ liệu</h6>
                      <p>Dữ liệu được sao lưu định kỳ để đảm bảo tính toàn vẹn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="privacy-section">
              <h3 class="section-title">
                <i class="bi bi-share text-danger me-2"></i>
                Chia Sẻ Thông Tin
              </h3>
              <div class="alert alert-warning">
                <h6><i class="bi bi-exclamation-triangle me-2"></i>Cam kết không chia sẻ:</h6>
                <p class="mb-2">BaloZone.vn cam kết KHÔNG bán, cho thuê hoặc chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba vì mục đích thương mại.</p>
                <p class="mb-0"><strong>Ngoại lệ:</strong> Chúng tôi chỉ chia sẻ thông tin khi có yêu cầu từ cơ quan pháp luật có thẩm quyền hoặc để bảo vệ quyền lợi hợp pháp của công ty.</p>
              </div>

              <div class="sharing-partners mt-3">
                <h6>Đối tác được chia sẻ thông tin giới hạn:</h6>
                <ul>
                  <li><strong>Đơn vị vận chuyển:</strong> Thông tin địa chỉ và liên lạc để giao hàng</li>
                  <li><strong>Ngân hàng/Ví điện tử:</strong> Thông tin thanh toán được mã hóa</li>
                  <li><strong>Nhà cung cấp dịch vụ:</strong> Các dịch vụ hỗ trợ kỹ thuật và bảo trì hệ thống</li>
                </ul>
              </div>
            </div>

            <div class="privacy-section">
              <h3 class="section-title">
                <i class="bi bi-toggles text-primary me-2"></i>
                Quyền Của Khách Hàng
              </h3>
              <div class="rights-list">
                <div class="right-item">
                  <i class="bi bi-eye-fill right-icon"></i>
                  <div class="right-content">
                    <h6>Quyền truy cập</h6>
                    <p>Bạn có quyền yêu cầu xem thông tin cá nhân mà chúng tôi đang lưu trữ</p>
                  </div>
                </div>

                <div class="right-item">
                  <i class="bi bi-pencil-square right-icon"></i>
                  <div class="right-content">
                    <h6>Quyền chỉnh sửa</h6>
                    <p>Bạn có thể yêu cầu cập nhật hoặc sửa đổi thông tin cá nhân không chính xác</p>
                  </div>
                </div>

                <div class="right-item">
                  <i class="bi bi-trash right-icon"></i>
                  <div class="right-content">
                    <h6>Quyền xóa dữ liệu</h6>
                    <p>Bạn có quyền yêu cầu xóa thông tin cá nhân (trừ khi pháp luật yêu cầu lưu trữ)</p>
                  </div>
                </div>

                <div class="right-item">
                  <i class="bi bi-hand-thumbs-down right-icon"></i>
                  <div class="right-content">
                    <h6>Quyền từ chối</h6>
                    <p>Bạn có thể từ chối nhận email marketing bằng cách click "Unsubscribe"</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="privacy-section">
              <h3 class="section-title">
                <i class="bi bi-cookie text-warning me-2"></i>
                Chính Sách Cookie
              </h3>
              <div class="cookie-info">
                <p>BaloZone.vn sử dụng cookies để cải thiện trải nghiệm người dùng:</p>
                <div class="cookie-types">
                  <div class="cookie-type">
                    <h6><i class="bi bi-gear-fill text-primary me-2"></i>Cookies cần thiết</h6>
                    <p>Đảm bảo website hoạt động bình thường và lưu giỏ hàng</p>
                  </div>
                  <div class="cookie-type">
                    <h6><i class="bi bi-graph-up text-success me-2"></i>Cookies phân tích</h6>
                    <p>Thu thập dữ liệu về cách sử dụng website để cải thiện dịch vụ</p>
                  </div>
                  <div class="cookie-type">
                    <h6><i class="bi bi-bullseye text-info me-2"></i>Cookies marketing</h6>
                    <p>Hiển thị quảng cáo phù hợp với sở thích của bạn</p>
                  </div>
                </div>
                <div class="alert alert-info mt-3">
                  <p class="mb-0"><i class="bi bi-info-circle me-2"></i>Bạn có thể quản lý cookies thông qua cài đặt trình duyệt. Tuy nhiên, việc tắt cookies có thể ảnh hưởng đến một số chức năng của website.</p>
                </div>
              </div>
            </div>

            <div class="privacy-section">
              <h3 class="section-title">
                <i class="bi bi-telephone text-primary me-2"></i>
                Liên Hệ Về Bảo Mật
              </h3>
              <div class="contact-info">
                <div class="row">
                  <div class="col-md-6">
                    <div class="contact-card">
                      <h6><i class="bi bi-envelope me-2"></i>Email Bảo Mật</h6>
                      <p class="contact-detail">privacy@balozone.vn</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="contact-card">
                      <h6><i class="bi bi-phone me-2"></i>Hotline Hỗ Trợ</h6>
                      <p class="contact-detail">1900 6750</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cta-section text-center mt-5">
              <div class="alert alert-info">
                <h5><i class="bi bi-shield-check me-2"></i>Có thắc mắc về chính sách bảo mật?</h5>
                <p class="mb-3">Đội ngũ hỗ trợ của chúng tôi sẵn sàng giải đáp mọi câu hỏi của bạn</p>
                <router-link to="/contact" class="btn btn-primary me-3">
                  <i class="bi bi-envelope me-2"></i>Liên hệ ngay
                </router-link>
                <router-link to="/" class="btn btn-outline-primary">
                  <i class="bi bi-house me-2"></i>Về trang chủ
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta information for SEO
document.title = 'Chính Sách Bảo Mật - BaloZone.vn'
</script>

<style scoped>
.privacy-page {
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

.privacy-content {
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

.privacy-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.privacy-section:last-child {
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
}

.info-categories {
  margin-top: 1.5rem;
}

.info-category {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.info-category h5 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.info-category ul {
  margin-bottom: 0;
}

.info-category li {
  color: #666;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.purpose-list {
  margin-top: 1.5rem;
}

.purpose-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.purpose-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.purpose-icon {
  background: #d2491e;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.purpose-icon i {
  font-size: 1.2rem;
}

.purpose-content h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.purpose-content p {
  color: #666;
  margin-bottom: 0;
  line-height: 1.6;
}

.security-measures {
  margin-top: 1.5rem;
}

.security-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  margin-bottom: 1rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.security-card:hover {
  border-color: #d2491e;
  transform: translateY(-5px);
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

.sharing-partners ul {
  margin-top: 1rem;
}

.sharing-partners li {
  color: #666;
  margin-bottom: 0.8rem;
  padding-left: 0.5rem;
  line-height: 1.6;
}

.rights-list {
  margin-top: 1.5rem;
}

.right-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.right-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.right-icon {
  color: #d2491e;
  font-size: 1.5rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.right-content h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.right-content p {
  color: #666;
  margin-bottom: 0;
  line-height: 1.6;
}

.cookie-types {
  margin-top: 1rem;
}

.cookie-type {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.cookie-type h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.cookie-type p {
  color: #666;
  margin-bottom: 0;
  line-height: 1.6;
}

.contact-info {
  margin-top: 1.5rem;
}

.contact-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.contact-card:hover {
  border-color: #d2491e;
  transform: translateY(-5px);
}

.contact-card h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.contact-detail {
  color: #d2491e;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0;
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

.alert-warning {
  border: none;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 10px;
  padding: 1.5rem;
}

.alert-warning h6 {
  color: #856404;
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
  .privacy-content {
    padding: 2rem 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .purpose-item,
  .right-item {
    flex-direction: column;
    text-align: center;
  }
  
  .purpose-icon,
  .right-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>
