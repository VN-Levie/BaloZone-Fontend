<template>
  <div class="guide-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb-section">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Trang chủ</router-link>
            </li>
            <li class="breadcrumb-item active">Hướng dẫn sử dụng khóa Vali</li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="guide-content">
            <h1 class="page-title text-center mb-5">Hướng Dẫn Sử Dụng Khóa Vali</h1>
            
            <div class="guide-intro">
              <div class="alert alert-info">
                <h5><i class="bi bi-lightbulb me-2"></i>Mẹo quan trọng</h5>
                <p class="mb-0">Việc sử dụng đúng cách khóa vali không chỉ bảo vệ hành lý mà còn giúp bạn đi lại an tâm hơn. Hãy tham khảo hướng dẫn chi tiết dưới đây!</p>
              </div>
            </div>

            <!-- Khóa số TSA -->
            <div class="guide-section">
              <h3 class="section-title">
                <i class="bi bi-key text-primary me-2"></i>
                Khóa Số TSA (Transportation Security Administration)
              </h3>
              
              <div class="tsa-info">
                <div class="row align-items-center">
                  <div class="col-md-8">
                    <p class="section-content">
                      Khóa TSA là loại khóa được chấp nhận bởi cơ quan an ninh hàng không quốc tế. Khóa này có thể được mở bởi nhân viên an ninh sân bay mà không làm hỏng vali của bạn.
                    </p>
                  </div>
                  <div class="col-md-4">
                    <div class="tsa-badge">
                      <i class="bi bi-shield-check"></i>
                      <span>TSA Approved</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="steps-container">
                <h5 class="steps-title">
                  <i class="bi bi-list-ol text-success me-2"></i>
                  Cách cài đặt mật khẩu khóa TSA:
                </h5>
                
                <div class="step-item">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h6>Đặt khóa ở vị trí mở</h6>
                    <p>Đảm bảo khóa đang ở trạng thái mở, mật khẩu mặc định thường là <strong>000</strong></p>
                  </div>
                </div>

                <div class="step-item">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h6>Tìm nút Reset</h6>
                    <p>Tìm nút nhỏ (thường có ký hiệu RESET hoặc SET) ở mặt sau hoặc bên cạnh khóa</p>
                  </div>
                </div>

                <div class="step-item">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h6>Nhấn và giữ nút Reset</h6>
                    <p>Sử dụng bút bi hoặc vật nhọn để nhấn và giữ nút Reset</p>
                  </div>
                </div>

                <div class="step-item">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h6>Đặt mật khẩu mới</h6>
                    <p>Vẫn giữ nút Reset, xoay các số thành mật khẩu mong muốn (gợi ý: chọn số dễ nhớ)</p>
                  </div>
                </div>

                <div class="step-item">
                  <div class="step-number">5</div>
                  <div class="step-content">
                    <h6>Thả nút Reset</h6>
                    <p>Thả nút Reset để hoàn tất việc cài đặt mật khẩu mới</p>
                  </div>
                </div>

                <div class="step-item">
                  <div class="step-number">6</div>
                  <div class="step-content">
                    <h6>Kiểm tra</h6>
                    <p>Đóng khóa và thử mở lại với mật khẩu vừa đặt để đảm bảo đã cài đặt thành công</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Khóa dây cáp -->
            <div class="guide-section">
              <h3 class="section-title">
                <i class="bi bi-link text-info me-2"></i>
                Khóa Dây Cáp
              </h3>
              
              <div class="cable-lock-info">
                <p class="section-content">
                  Khóa dây cáp thường được sử dụng để khóa khóa kéo của vali với nhau, tạo thành một hệ thống bảo mật kép.
                </p>
                
                <div class="cable-advantages">
                  <h6><i class="bi bi-check-circle text-success me-2"></i>Ưu điểm của khóa dây cáp:</h6>
                  <ul>
                    <li>Linh hoạt, có thể khóa nhiều ngăn cùng lúc</li>
                    <li>Dây cáp bọc nhựa không làm trầy xước vali</li>
                    <li>Dễ sử dụng và điều chỉnh độ dài</li>
                    <li>Có thể khóa vali với đồ vật cố định</li>
                  </ul>
                </div>
              </div>

              <div class="usage-tips">
                <h6><i class="bi bi-lightbulb text-warning me-2"></i>Mẹo sử dụng khóa dây cáp:</h6>
                <div class="row">
                  <div class="col-md-6">
                    <div class="tip-card">
                      <i class="bi bi-arrow-repeat tip-icon"></i>
                      <h6>Khóa kéo kép</h6>
                      <p>Luồn dây qua cả hai khóa kéo để bảo mật tối đa</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="tip-card">
                      <i class="bi bi-geo-alt tip-icon"></i>
                      <h6>Cố định vị trí</h6>
                      <p>Khóa vali với ghế hoặc đồ vật cố định khi nghỉ ngơi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Khóa có chìa -->
            <div class="guide-section">
              <h3 class="section-title">
                <i class="bi bi-key-fill text-warning me-2"></i>
                Khóa Có Chìa
              </h3>
              
              <div class="key-lock-info">
                <p class="section-content">
                  Khóa có chìa truyền thống vẫn được nhiều người ưa chuộng nhờ độ bảo mật cao và không lo quên mật khẩu.
                </p>
                
                <div class="key-precautions">
                  <div class="alert alert-warning">
                    <h6><i class="bi bi-exclamation-triangle me-2"></i>Lưu ý quan trọng với khóa chìa:</h6>
                    <ul class="mb-0">
                      <li><strong>Luôn mang chìa dự phòng:</strong> Chuẩn bị ít nhất 2 chìa, giữ ở 2 nơi khác nhau</li>
                      <li><strong>Không để chìa trong hành lý:</strong> Mang chìa bên người hoặc trong túi xách tay</li>
                      <li><strong>Chụp ảnh chìa:</strong> Lưu hình ảnh chìa để tiện sao chép khi cần</li>
                      <li><strong>Ghi nhận số serial:</strong> Lưu số serial của khóa để đặt làm chìa mới</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cách khóa vali đúng cách -->
            <div class="guide-section">
              <h3 class="section-title">
                <i class="bi bi-lock text-success me-2"></i>
                Cách Khóa Vali Đúng Cách
              </h3>
              
              <div class="locking-techniques">
                <div class="technique-item">
                  <div class="technique-header">
                    <i class="bi bi-1-circle technique-icon"></i>
                    <h6>Kéo khóa về một đầu</h6>
                  </div>
                  <p>Luôn kéo cả hai khóa kéo về cùng một phía trước khi khóa để tránh tình trạng khóa không vào</p>
                </div>

                <div class="technique-item">
                  <div class="technique-header">
                    <i class="bi bi-2-circle technique-icon"></i>
                    <h6>Kiểm tra độ căng của khóa kéo</h6>
                  </div>
                  <p>Đảm bảo khóa kéo không bị căng quá mức, có thể gây hỏng khóa hoặc vải vali</p>
                </div>

                <div class="technique-item">
                  <div class="technique-header">
                    <i class="bi bi-3-circle technique-icon"></i>
                    <h6>Sử dụng nhiều loại khóa</h6>
                  </div>
                  <p>Kết hợp khóa TSA với khóa dây cáp để tăng cường bảo mật</p>
                </div>

                <div class="technique-item">
                  <div class="technique-header">
                    <i class="bi bi-4-circle technique-icon"></i>
                    <h6>Kiểm tra trước khi di chuyển</h6>
                  </div>
                  <p>Luôn thử kéo nhẹ để đảm bảo vali đã được khóa chắc chắn</p>
                </div>
              </div>
            </div>

            <!-- Xử lý tình huống khẩn cấp -->
            <div class="guide-section">
              <h3 class="section-title">
                <i class="bi bi-exclamation-triangle text-danger me-2"></i>
                Xử Lý Tình Huống Khẩn Cấp
              </h3>
              
              <div class="emergency-situations">
                <div class="emergency-item">
                  <div class="emergency-header">
                    <i class="bi bi-question-circle text-danger"></i>
                    <h6>Quên mật khẩu khóa TSA</h6>
                  </div>
                  <div class="emergency-solutions">
                    <p><strong>Giải pháp:</strong></p>
                    <ul>
                      <li>Thử các mật khẩu phổ biến: 000, 123, 111, ngày sinh</li>
                      <li>Đưa đến cửa hàng BaloZone để được hỗ trợ mở khóa</li>
                      <li>Liên hệ hotline: 1900 6750 để được hướng dẫn</li>
                    </ul>
                  </div>
                </div>

                <div class="emergency-item">
                  <div class="emergency-header">
                    <i class="bi bi-key text-warning"></i>
                    <h6>Mất chìa khóa</h6>
                  </div>
                  <div class="emergency-solutions">
                    <p><strong>Giải pháp:</strong></p>
                    <ul>
                      <li>Sử dụng chìa dự phòng nếu có</li>
                      <li>Đưa đến tiệm làm chìa để sao chép (nếu có hình ảnh)</li>
                      <li>Liên hệ BaloZone để được hỗ trợ cắt khóa an toàn</li>
                    </ul>
                  </div>
                </div>

                <div class="emergency-item">
                  <div class="emergency-header">
                    <i class="bi bi-wrench text-info"></i>
                    <h6>Khóa bị kẹt</h6>
                  </div>
                  <div class="emergency-solutions">
                    <p><strong>Giải pháp:</strong></p>
                    <ul>
                      <li>Không dùng lực mạnh để tránh làm hỏng khóa</li>
                      <li>Thử xịt dầu bôi trơn vào ổ khóa</li>
                      <li>Nhẹ nhàng gõ xung quanh khóa để làm lỏng cơ cấu</li>
                      <li>Đưa đến cửa hàng để được hỗ trợ chuyên nghiệp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bảo dưỡng khóa -->
            <div class="guide-section">
              <h3 class="section-title">
                <i class="bi bi-tools text-primary me-2"></i>
                Bảo Dưỡng Khóa Vali
              </h3>
              
              <div class="maintenance-tips">
                <div class="row">
                  <div class="col-md-6">
                    <div class="maintenance-card">
                      <i class="bi bi-droplet maintenance-icon"></i>
                      <h6>Vệ sinh định kỳ</h6>
                      <ul>
                        <li>Lau sạch bụi bẩn sau mỗi chuyến đi</li>
                        <li>Sử dụng khăn ẩm để lau khóa</li>
                        <li>Tránh để khóa tiếp xúc với nước quá nhiều</li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="maintenance-card">
                      <i class="bi bi-gear maintenance-icon"></i>
                      <h6>Bôi trơn định kỳ</h6>
                      <ul>
                        <li>Sử dụng dầu bôi trơn 3-6 tháng/lần</li>
                        <li>Chọn dầu không gây ăn mòn kim loại</li>
                        <li>Bôi trơn cả khóa kéo và ổ khóa</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Liên hệ hỗ trợ -->
            <div class="guide-section">
              <h3 class="section-title">
                <i class="bi bi-headset text-primary me-2"></i>
                Hỗ Trợ Kỹ Thuật
              </h3>
              <div class="support-info">
                <div class="row">
                  <div class="col-md-4">
                    <div class="support-card">
                      <i class="bi bi-telephone support-icon"></i>
                      <h6>Hotline 24/7</h6>
                      <p class="support-detail">1900 6750</p>
                      <small>Hỗ trợ mở khóa miễn phí</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="support-card">
                      <i class="bi bi-shop support-icon"></i>
                      <h6>Tại cửa hàng</h6>
                      <p class="support-detail">Miễn phí kiểm tra</p>
                      <small>Mang vali đến cửa hàng gần nhất</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="support-card">
                      <i class="bi bi-tools support-icon"></i>
                      <h6>Sửa chữa tận nơi</h6>
                      <p class="support-detail">Dịch vụ tại nhà</p>
                      <small>Áp dụng với đơn hàng > 500k</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cta-section text-center mt-5">
              <div class="alert alert-success">
                <h5><i class="bi bi-check-circle me-2"></i>Cần hỗ trợ thêm?</h5>
                <p class="mb-3">Đội ngũ kỹ thuật BaloZone luôn sẵn sàng hỗ trợ bạn</p>
                <router-link to="/contact" class="btn btn-success me-3">
                  <i class="bi bi-telephone me-2"></i>Liên hệ hỗ trợ
                </router-link>
                <router-link to="/" class="btn btn-outline-success">
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
document.title = 'Hướng Dẫn Sử Dụng Khóa Vali - BaloZone.vn'
</script>

<style scoped>
.guide-page {
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

.guide-content {
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

.guide-intro {
  margin-bottom: 3rem;
}

.guide-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.guide-section:last-child {
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

.tsa-info {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.tsa-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: #fff;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
}

.tsa-badge i {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.steps-container {
  margin-top: 2rem;
}

.steps-title {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 2rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #d2491e;
  transition: all 0.3s ease;
}

.step-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

.cable-lock-info {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.cable-advantages {
  margin-top: 1.5rem;
}

.cable-advantages h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.cable-advantages ul {
  margin-bottom: 0;
}

.cable-advantages li {
  color: #666;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.usage-tips {
  margin-top: 2rem;
}

.usage-tips h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.tip-card {
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.tip-card:hover {
  border-color: #d2491e;
  transform: translateY(-5px);
}

.tip-icon {
  color: #d2491e;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.tip-card h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tip-card p {
  color: #666;
  margin-bottom: 0;
  line-height: 1.6;
}

.key-lock-info {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.key-precautions {
  margin-top: 1.5rem;
}

.locking-techniques {
  margin-top: 1.5rem;
}

.technique-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.technique-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.technique-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.technique-icon {
  color: #d2491e;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.technique-header h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0;
}

.technique-item p {
  color: #666;
  margin-bottom: 0;
  line-height: 1.6;
}

.emergency-situations {
  margin-top: 1.5rem;
}

.emergency-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #dc3545;
}

.emergency-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.emergency-header i {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.emergency-header h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0;
}

.emergency-solutions ul {
  margin-bottom: 0;
}

.emergency-solutions li {
  color: #666;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  line-height: 1.6;
}

.maintenance-tips {
  margin-top: 1.5rem;
}

.maintenance-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  height: 100%;
  margin-bottom: 1rem;
}

.maintenance-icon {
  color: #d2491e;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.maintenance-card h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.maintenance-card ul {
  text-align: left;
  margin-bottom: 0;
}

.maintenance-card li {
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.6;
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

.alert-success {
  border: none;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: 15px;
  padding: 2rem;
}

.alert-success h5 {
  color: #155724;
  font-weight: 600;
}

.btn {
  border-radius: 25px;
  padding: 0.7rem 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

.btn-outline-success {
  color: #28a745;
  border-color: #28a745;
}

.btn-outline-success:hover {
  background: #28a745;
  border-color: #28a745;
  transform: translateY(-2px);
}

.cta-section {
  border-top: 2px solid #e9ecef;
  padding-top: 2rem;
}

@media (max-width: 768px) {
  .guide-content {
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
  
  .technique-header {
    flex-direction: column;
    text-align: center;
  }
  
  .technique-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .emergency-header {
    flex-direction: column;
    text-align: center;
  }
  
  .emergency-header i {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
