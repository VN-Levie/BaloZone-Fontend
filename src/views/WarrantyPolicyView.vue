<template>
  <div class="policy-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb-section">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Trang chủ</router-link>
            </li>
            <li class="breadcrumb-item active">Chính sách bảo hành</li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="policy-content">
            <h1 class="page-title text-center mb-5">Chính Sách Bảo Hành</h1>
            
            <div class="policy-section">
              <h3 class="section-title">
                <i class="bi bi-shield-check text-primary me-2"></i>
                Cam Kết Bảo Hành Trọn Đời
              </h3>
              <p class="section-content">
                BaloZone.vn tự hào là thương hiệu đầu tiên tại Việt Nam cam kết bảo hành trọn đời cho tất cả sản phẩm vali, balo và túi xách. Chúng tôi tin rằng chất lượng sản phẩm chính là nền tảng để xây dựng niềm tin với khách hàng.
              </p>
            </div>

            <div class="policy-section">
              <h3 class="section-title">
                <i class="bi bi-gear text-success me-2"></i>
                Phạm Vi Bảo Hành
              </h3>
              <div class="warranty-list">
                <div class="warranty-item">
                  <h5><i class="bi bi-check-circle text-success me-2"></i>Bảo hành cấu trúc sản phẩm</h5>
                  <ul>
                    <li>Lỗi khóa kéo bị gãy, hỏng do lỗi sản xuất</li>
                    <li>Bánh xe bị gãy, tuột do lỗi kỹ thuật</li>
                    <li>Tay kéo bị gãy, lỏng do lỗi sản xuất</li>
                    <li>Vải bị rách do lỗi chất liệu</li>
                  </ul>
                </div>
                
                <div class="warranty-item">
                  <h5><i class="bi bi-check-circle text-success me-2"></i>Bảo hành phụ kiện</h5>
                  <ul>
                    <li>Thay thế khóa số TSA miễn phí</li>
                    <li>Sửa chữa dây đeo, quai xách</li>
                    <li>Thay thế nút bấm, móc khóa</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="policy-section">
              <h3 class="section-title">
                <i class="bi bi-x-circle text-danger me-2"></i>
                Trường Hợp Không Được Bảo Hành
              </h3>
              <div class="exclusion-list">
                <div class="alert alert-warning">
                  <h6><i class="bi bi-exclamation-triangle me-2"></i>Lưu ý quan trọng:</h6>
                  <ul class="mb-0">
                    <li>Hư hỏng do sử dụng sai mục đích (vượt quá trọng lượng cho phép)</li>
                    <li>Hư hỏng do tai nạn, va đập mạnh bất thường</li>
                    <li>Hư hỏng do tác động của động vật (cắn, cào)</li>
                    <li>Mài mòn tự nhiên sau thời gian sử dụng lâu dài</li>
                    <li>Sản phẩm đã qua sửa chữa bởi bên thứ ba</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="policy-section">
              <h3 class="section-title">
                <i class="bi bi-clipboard-check text-info me-2"></i>
                Quy Trình Bảo Hành
              </h3>
              <div class="process-steps">
                <div class="step-item">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h6>Liên hệ bảo hành</h6>
                    <p>Gọi hotline: <strong>1900 6750</strong> hoặc gửi email về <strong>baohanh@balozone.vn</strong></p>
                  </div>
                </div>
                
                <div class="step-item">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h6>Kiểm tra và xác nhận</h6>
                    <p>Đội ngũ kỹ thuật sẽ kiểm tra và xác nhận tình trạng sản phẩm</p>
                  </div>
                </div>
                
                <div class="step-item">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h6>Thực hiện bảo hành</h6>
                    <p>Sửa chữa hoặc thay thế sản phẩm trong vòng 3-7 ngày làm việc</p>
                  </div>
                </div>
                
                <div class="step-item">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h6>Giao hàng</h6>
                    <p>Giao sản phẩm đã được bảo hành về tận nơi miễn phí</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="policy-section">
              <h3 class="section-title">
                <i class="bi bi-telephone text-primary me-2"></i>
                Thông Tin Liên Hệ Bảo Hành
              </h3>
              <div class="contact-info">
                <div class="row">
                  <div class="col-md-6">
                    <div class="contact-card">
                      <h6><i class="bi bi-phone me-2"></i>Hotline Bảo Hành</h6>
                      <p class="contact-detail">1900 6750 (8:00 - 22:00)</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="contact-card">
                      <h6><i class="bi bi-envelope me-2"></i>Email Bảo Hành</h6>
                      <p class="contact-detail">baohanh@balozone.vn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cta-section text-center mt-5">
              <div class="alert alert-info">
                <h5><i class="bi bi-info-circle me-2"></i>Cần hỗ trợ bảo hành?</h5>
                <p class="mb-3">Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
                <router-link to="/contact" class="btn btn-primary me-3">
                  <i class="bi bi-telephone me-2"></i>Liên hệ ngay
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
document.title = 'Chính Sách Bảo Hành - BaloZone.vn'
</script>

<style scoped>
.policy-page {
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

.policy-content {
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

.policy-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.policy-section:last-child {
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

.warranty-list, .exclusion-list {
  margin-top: 1.5rem;
}

.warranty-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.warranty-item h5 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.warranty-item ul {
  margin-bottom: 0;
}

.warranty-item li {
  color: #666;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.process-steps {
  margin-top: 1.5rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #d2491e;
}

.step-number {
  background: #d2491e;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  margin-right: 1.5rem;
  flex-shrink: 0;
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

.cta-section {
  border-top: 2px solid #e9ecef;
  padding-top: 2rem;
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

@media (max-width: 768px) {
  .policy-content {
    padding: 2rem 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
  }
  
  .step-number {
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>
