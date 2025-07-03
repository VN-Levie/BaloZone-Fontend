<template>
  <div class="luggage-tips-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb-section">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Trang chủ</router-link>
            </li>
            <li class="breadcrumb-item active">Bí kíp chọn hành lý</li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="tips-content">
            <h1 class="page-title text-center mb-5">Bí Kíp Chọn Hành Lý Hoàn Hảo</h1>
            
            <div class="tips-intro">
              <div class="alert alert-info">
                <h5><i class="bi bi-compass me-2"></i>Hành trình hoàn hảo bắt đầu từ việc chọn hành lý phù hợp</h5>
                <p class="mb-0">Việc lựa chọn vali, balo phù hợp sẽ giúp chuyến đi của bạn trở nên thuận lợi và thoải mái hơn. Cùng BaloZone khám phá những bí kíp chọn hành lý từ chuyên gia!</p>
              </div>
            </div>

            <!-- Theo mục đích sử dụng -->
            <div class="tips-section">
              <h3 class="section-title">
                <i class="bi bi-map text-primary me-2"></i>
                Chọn Theo Mục Đích Sử Dụng
              </h3>
              
              <div class="purpose-categories">
                <div class="purpose-card">
                  <div class="purpose-header">
                    <div class="purpose-icon business">
                      <i class="bi bi-briefcase"></i>
                    </div>
                    <h5>Du Lịch Công Tác</h5>
                  </div>
                  <div class="purpose-content">
                    <h6>Đặc điểm:</h6>
                    <ul>
                      <li>Thời gian ngắn (1-3 ngày)</li>
                      <li>Cần mang laptop, tài liệu</li>
                      <li>Yêu cầu chuyên nghiệp</li>
                    </ul>
                    <h6>Gợi ý:</h6>
                    <div class="suggestion-item">
                      <strong>Vali cabin 20 inch:</strong> Gọn nhẹ, đáp ứng quy định hàng không
                    </div>
                    <div class="suggestion-item">
                      <strong>Balo laptop:</strong> Có ngăn riêng bảo vệ laptop, thiết kế lịch sự
                    </div>
                  </div>
                </div>

                <div class="purpose-card">
                  <div class="purpose-header">
                    <div class="purpose-icon vacation">
                      <i class="bi bi-sun"></i>
                    </div>
                    <h5>Du Lịch Nghỉ Dưỡng</h5>
                  </div>
                  <div class="purpose-content">
                    <h6>Đặc điểm:</h6>
                    <ul>
                      <li>Thời gian dài (7-14 ngày)</li>
                      <li>Nhiều quần áo, đồ dùng cá nhân</li>
                      <li>Có thể mua sắm, mang về nhiều đồ</li>
                    </ul>
                    <h6>Gợi ý:</h6>
                    <div class="suggestion-item">
                      <strong>Vali 24-28 inch:</strong> Dung tích lớn, có thể mở rộng
                    </div>
                    <div class="suggestion-item">
                      <strong>Vali cứng:</strong> Bảo vệ tốt, chống nước, dễ vệ sinh
                    </div>
                  </div>
                </div>

                <div class="purpose-card">
                  <div class="purpose-header">
                    <div class="purpose-icon backpacking">
                      <i class="bi bi-mountain"></i>
                    </div>
                    <h5>Du Lịch Bụi - Phượt</h5>
                  </div>
                  <div class="purpose-content">
                    <h6>Đặc điểm:</h6>
                    <ul>
                      <li>Di chuyển nhiều, địa hình phức tạp</li>
                      <li>Cần nhẹ, bền, tiện lợi</li>
                      <li>Chống thấm nước</li>
                    </ul>
                    <h6>Gợi ý:</h6>
                    <div class="suggestion-item">
                      <strong>Balo trekking 40-60L:</strong> Nhiều ngăn, có khung chống, chống nước
                    </div>
                    <div class="suggestion-item">
                      <strong>Túi du lịch vải:</strong> Nhẹ, linh hoạt, có thể gấp gọn
                    </div>
                  </div>
                </div>

                <div class="purpose-card">
                  <div class="purpose-header">
                    <div class="purpose-icon student">
                      <i class="bi bi-book"></i>
                    </div>
                    <h5>Học Tập - Sinh Viên</h5>
                  </div>
                  <div class="purpose-content">
                    <h6>Đặc điểm:</h6>
                    <ul>
                      <li>Sử dụng hàng ngày</li>
                      <li>Cần đựng sách vở, laptop</li>
                      <li>Thiết kế trẻ trung, năng động</li>
                    </ul>
                    <h6>Gợi ý:</h6>
                    <div class="suggestion-item">
                      <strong>Balo học sinh 20-30L:</strong> Nhiều ngăn, có ngăn laptop, thiết kế thời trang
                    </div>
                    <div class="suggestion-item">
                      <strong>Túi xách tote:</strong> Đơn giản, thời trang, phù hợp nữ sinh
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Theo kích thước -->
            <div class="tips-section">
              <h3 class="section-title">
                <i class="bi bi-rulers text-success me-2"></i>
                Chọn Theo Kích Thước
              </h3>
              
              <div class="size-guide">
                <div class="size-comparison">
                  <div class="size-item carry-on">
                    <div class="size-visual">
                      <div class="suitcase-icon small"></div>
                      <span class="size-label">20 inch</span>
                    </div>
                    <div class="size-info">
                      <h6>Vali Cabin (20 inch)</h6>
                      <p><strong>Kích thước:</strong> 35×55×20 cm</p>
                      <p><strong>Thời gian:</strong> 1-3 ngày</p>
                      <p><strong>Ưu điểm:</strong> Mang lên máy bay, tiết kiệm thời gian</p>
                      <p><strong>Nhược điểm:</strong> Dung tích hạn chế</p>
                    </div>
                  </div>

                  <div class="size-item medium">
                    <div class="size-visual">
                      <div class="suitcase-icon medium"></div>
                      <span class="size-label">24 inch</span>
                    </div>
                    <div class="size-info">
                      <h6>Vali Trung (24 inch)</h6>
                      <p><strong>Kích thước:</strong> 42×65×25 cm</p>
                      <p><strong>Thời gian:</strong> 3-7 ngày</p>
                      <p><strong>Ưu điểm:</strong> Cân bằng kích thước và dung tích</p>
                      <p><strong>Nhược điểm:</strong> Phải ký gửi hành lý</p>
                    </div>
                  </div>

                  <div class="size-item large">
                    <div class="size-visual">
                      <div class="suitcase-icon large"></div>
                      <span class="size-label">28 inch</span>
                    </div>
                    <div class="size-info">
                      <h6>Vali Lớn (28 inch)</h6>
                      <p><strong>Kích thước:</strong> 48×75×30 cm</p>
                      <p><strong>Thời gian:</strong> 7-14 ngày</p>
                      <p><strong>Ưu điểm:</strong> Dung tích lớn, phù hợp gia đình</p>
                      <p><strong>Nhược điểm:</strong> Nặng, khó di chuyển</p>
                    </div>
                  </div>
                </div>

                <div class="size-tips">
                  <h6><i class="bi bi-lightbulb text-warning me-2"></i>Mẹo chọn kích thước:</h6>
                  <div class="tip-list">
                    <div class="tip-item">
                      <i class="bi bi-check-circle text-success"></i>
                      <span>Chọn size nhỏ hơn dự kiến 1 cấp để tránh pack quá nhiều đồ</span>
                    </div>
                    <div class="tip-item">
                      <i class="bi bi-check-circle text-success"></i>
                      <span>Với chuyến đi dài, ưu tiên 2 vali nhỏ thay vì 1 vali lớn</span>
                    </div>
                    <div class="tip-item">
                      <i class="bi bi-check-circle text-success"></i>
                      <span>Kiểm tra quy định hàng không về kích thước và trọng lượng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Vali cứng vs vali mềm -->
            <div class="tips-section">
              <h3 class="section-title">
                <i class="bi bi-shield text-info me-2"></i>
                Vali Cứng vs Vali Mềm
              </h3>
              
              <div class="material-comparison">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="material-card hard-case">
                      <div class="material-header">
                        <i class="bi bi-shield-fill material-icon"></i>
                        <h5>Vali Cứng (Hard Case)</h5>
                      </div>
                      
                      <div class="pros-cons">
                        <div class="pros">
                          <h6><i class="bi bi-plus-circle text-success me-2"></i>Ưu điểm:</h6>
                          <ul>
                            <li>Bảo vệ đồ đạc tốt hơn</li>
                            <li>Chống nước hoàn toàn</li>
                            <li>Dễ vệ sinh, lau chùi</li>
                            <li>Chống trầy xước</li>
                            <li>Thiết kế hiện đại, sang trọng</li>
                          </ul>
                        </div>
                        
                        <div class="cons">
                          <h6><i class="bi bi-dash-circle text-danger me-2"></i>Nhược điểm:</h6>
                          <ul>
                            <li>Nặng hơn vali mềm</li>
                            <li>Không linh hoạt về kích thước</li>
                            <li>Giá thành cao hơn</li>
                            <li>Dễ bị nứt khi va đập mạnh</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="material-best-for">
                        <h6>Phù hợp với:</h6>
                        <div class="best-for-tags">
                          <span class="tag">Du lịch cao cấp</span>
                          <span class="tag">Công tác</span>
                          <span class="tag">Đồ điện tử</span>
                          <span class="tag">Quần áo đắt tiền</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-lg-6">
                    <div class="material-card soft-case">
                      <div class="material-header">
                        <i class="bi bi-bag material-icon"></i>
                        <h5>Vali Mềm (Soft Case)</h5>
                      </div>
                      
                      <div class="pros-cons">
                        <div class="pros">
                          <h6><i class="bi bi-plus-circle text-success me-2"></i>Ưu điểm:</h6>
                          <ul>
                            <li>Nhẹ hơn vali cứng</li>
                            <li>Linh hoạt, có thể nén</li>
                            <li>Giá thành phải chăng</li>
                            <li>Nhiều ngăn phụ</li>
                            <li>Chống sốc tốt hơn</li>
                          </ul>
                        </div>
                        
                        <div class="cons">
                          <h6><i class="bi bi-dash-circle text-danger me-2"></i>Nhược điểm:</h6>
                          <ul>
                            <li>Bảo vệ đồ đạc hạn chế</li>
                            <li>Không chống nước hoàn toàn</li>
                            <li>Dễ bị bẩn, khó vệ sinh</li>
                            <li>Có thể bị rách, mòn</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="material-best-for">
                        <h6>Phù hợp với:</h6>
                        <div class="best-for-tags">
                          <span class="tag">Du lịch bụi</span>
                          <span class="tag">Sinh viên</span>
                          <span class="tag">Gia đình</span>
                          <span class="tag">Ngân sách hạn chế</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Đặc điểm cần lưu ý -->
            <div class="tips-section">
              <h3 class="section-title">
                <i class="bi bi-star text-warning me-2"></i>
                Đặc Điểm Quan Trọng Cần Lưu Ý
              </h3>
              
              <div class="features-grid">
                <div class="feature-card">
                  <div class="feature-icon wheels">
                    <i class="bi bi-circle"></i>
                  </div>
                  <h6>Bánh Xe</h6>
                  <div class="feature-details">
                    <p><strong>4 bánh 360°:</strong> Di chuyển linh hoạt, đẩy thẳng được</p>
                    <p><strong>2 bánh:</strong> Chỉ kéo được, ổn định hơn trên địa hình xấu</p>
                    <p><strong>Chất liệu:</strong> Ưu tiên bánh xe cao su, chống ồn</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-icon handle">
                    <i class="bi bi-grip-vertical"></i>
                  </div>
                  <h6>Tay Kéo</h6>
                  <div class="feature-details">
                    <p><strong>Nhiều cấp độ:</strong> Điều chỉnh theo chiều cao</p>
                    <p><strong>Chất liệu:</strong> Nhôm hoặc hợp kim, chống gỉ</p>
                    <p><strong>Thiết kế:</strong> Có đệm tay, chống trượt</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-icon lock">
                    <i class="bi bi-lock"></i>
                  </div>
                  <h6>Khóa Bảo Mật</h6>
                  <div class="feature-details">
                    <p><strong>Khóa TSA:</strong> Được chấp nhận bởi sân bay quốc tế</p>
                    <p><strong>Khóa số:</strong> Không lo mất chìa, dễ nhớ</p>
                    <p><strong>Vị trí:</strong> Nhiều khóa tăng cường bảo mật</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-icon zipper">
                    <i class="bi bi-bezier"></i>
                  </div>
                  <h6>Khóa Kéo</h6>
                  <div class="feature-details">
                    <p><strong>Thương hiệu:</strong> YKK, RiRi - uy tín, bền bỉ</p>
                    <p><strong>Kích thước:</strong> Size lớn, dễ cầm nắm</p>
                    <p><strong>Chống nước:</strong> Có lớp phủ chống thấm</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-icon interior">
                    <i class="bi bi-layout-three-columns"></i>
                  </div>
                  <h6>Bố Cục Bên Trong</h6>
                  <div class="feature-details">
                    <p><strong>Ngăn chính:</strong> Rộng rãi, có dây cố định</p>
                    <p><strong>Ngăn phụ:</strong> Nhiều túi nhỏ, có khóa kéo</p>
                    <p><strong>Lót trong:</strong> Chống thấm, dễ vệ sinh</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-icon weight">
                    <i class="bi bi-speedometer2"></i>
                  </div>
                  <h6>Trọng Lượng</h6>
                  <div class="feature-details">
                    <p><strong>Vali 20":</strong> Dưới 2.5kg</p>
                    <p><strong>Vali 24":</strong> Dưới 3.5kg</p>
                    <p><strong>Vali 28":</strong> Dưới 4.5kg</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thương hiệu -->
            <div class="tips-section">
              <h3 class="section-title">
                <i class="bi bi-award text-danger me-2"></i>
                Thương Hiệu Uy Tín
              </h3>
              
              <div class="brands-info">
                <p class="brand-intro">BaloZone.vn hợp tác với các thương hiệu hàng đầu thế giới để mang đến cho khách hàng những sản phẩm chất lượng cao:</p>
                
                <div class="brand-categories">
                  <div class="brand-category">
                    <h6><i class="bi bi-gem text-primary me-2"></i>Thương hiệu cao cấp:</h6>
                    <div class="brand-list">
                      <span class="brand-tag premium">Samsonite</span>
                      <span class="brand-tag premium">American Tourister</span>
                      <span class="brand-tag premium">Delsey</span>
                      <span class="brand-tag premium">Travelpro</span>
                    </div>
                  </div>
                  
                  <div class="brand-category">
                    <h6><i class="bi bi-star text-warning me-2"></i>Thương hiệu tầm trung:</h6>
                    <div class="brand-list">
                      <span class="brand-tag mid-range">VIP</span>
                      <span class="brand-tag mid-range">Lock&Lock</span>
                      <span class="brand-tag mid-range">Skyway</span>
                      <span class="brand-tag mid-range">Ricardo</span>
                    </div>
                  </div>
                  
                  <div class="brand-category">
                    <h6><i class="bi bi-heart text-success me-2"></i>Thương hiệu phổ thông:</h6>
                    <div class="brand-list">
                      <span class="brand-tag budget">Kamiliant</span>
                      <span class="brand-tag budget">Diplomat</span>
                      <span class="brand-tag budget">Sakos</span>
                      <span class="brand-tag budget">BaloZone</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Checklist -->
            <div class="tips-section">
              <h3 class="section-title">
                <i class="bi bi-clipboard-check text-success me-2"></i>
                Checklist Chọn Mua Hành Lý
              </h3>
              
              <div class="checklist">
                <div class="checklist-category">
                  <h6>Trước khi mua:</h6>
                  <div class="checklist-items">
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Xác định mục đích sử dụng chính</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Đo lường không gian cần thiết</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Đặt ngân sách cụ thể</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Nghiên cứu thương hiệu uy tín</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Đọc review từ khách hàng thật</span>
                    </label>
                  </div>
                </div>

                <div class="checklist-category">
                  <h6>Khi kiểm tra sản phẩm:</h6>
                  <div class="checklist-items">
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Thử nghiệm bánh xe, tay kéo</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Kiểm tra khóa kéo, khóa bảo mật</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Xem chất liệu vỏ và lót trong</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Đo kích thước thực tế</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Cân trọng lượng vali rỗng</span>
                    </label>
                  </div>
                </div>

                <div class="checklist-category">
                  <h6>Chính sách và bảo hành:</h6>
                  <div class="checklist-items">
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Xác nhận chính sách bảo hành</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Kiểm tra chính sách đổi trả</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Lưu hóa đơn và thông tin bảo hành</span>
                    </label>
                    <label class="checklist-item">
                      <input type="checkbox" disabled>
                      <span>Đăng ký thông tin khách hàng</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Section -->
            <div class="cta-section text-center mt-5">
              <div class="alert alert-primary">
                <h5><i class="bi bi-bag-heart me-2"></i>Đã tìm được hành lý phù hợp?</h5>
                <p class="mb-3">Khám phá bộ sưu tập vali, balo đa dạng tại BaloZone với chất lượng đảm bảo</p>
                <router-link to="/" class="btn btn-primary me-3">
                  <i class="bi bi-shop me-2"></i>Xem bộ sưu tập
                </router-link>
                <router-link to="/contact" class="btn btn-outline-primary">
                  <i class="bi bi-chat-dots me-2"></i>Tư vấn miễn phí
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
document.title = 'Bí Kíp Chọn Hành Lý Hoàn Hảo - BaloZone.vn'
</script>

<style scoped>
.luggage-tips-page {
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

.tips-content {
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

.tips-intro {
  margin-bottom: 3rem;
}

.tips-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.tips-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  color: #2d3e50;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Purpose Categories */
.purpose-categories {
  margin-top: 1.5rem;
}

.purpose-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.purpose-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.purpose-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.purpose-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 2rem;
  color: #fff;
}

.purpose-icon.business {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.purpose-icon.vacation {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
}

.purpose-icon.backpacking {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
}

.purpose-icon.student {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
}

.purpose-header h5 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0;
}

.purpose-content h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
}

.purpose-content ul {
  margin-bottom: 1rem;
}

.purpose-content li {
  color: #666;
  margin-bottom: 0.5rem;
}

.suggestion-item {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid #d2491e;
  font-size: 0.9rem;
  color: #666;
}

/* Size Guide */
.size-guide {
  margin-top: 1.5rem;
}

.size-comparison {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.size-item {
  flex: 1;
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
}

.size-visual {
  margin-bottom: 1.5rem;
}

.suitcase-icon {
  width: 60px;
  height: 80px;
  background: #d2491e;
  border-radius: 8px;
  margin: 0 auto 1rem auto;
  position: relative;
}

.suitcase-icon.small {
  width: 50px;
  height: 65px;
}

.suitcase-icon.medium {
  width: 60px;
  height: 80px;
}

.suitcase-icon.large {
  width: 70px;
  height: 95px;
}

.suitcase-icon::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 8px;
  background: #fff;
  border-radius: 4px;
}

.size-label {
  display: block;
  color: #d2491e;
  font-weight: 600;
  font-size: 1.1rem;
}

.size-info h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.size-info p {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-align: left;
}

.size-tips {
  background: #fff3cd;
  border-radius: 10px;
  padding: 1.5rem;
  border-left: 4px solid #ffc107;
}

.size-tips h6 {
  color: #856404;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tip-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #856404;
  font-size: 0.95rem;
}

/* Material Comparison */
.material-comparison {
  margin-top: 1.5rem;
}

.material-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
}

.material-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.material-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.material-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.hard-case .material-icon {
  color: #3498db;
}

.soft-case .material-icon {
  color: #27ae60;
}

.material-header h5 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 0;
}

.pros-cons {
  margin-bottom: 1.5rem;
}

.pros,
.cons {
  margin-bottom: 1.5rem;
}

.pros h6 {
  color: #27ae60;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.cons h6 {
  color: #e74c3c;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.pros ul,
.cons ul {
  margin-bottom: 0;
}

.pros li,
.cons li {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.material-best-for h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.best-for-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #d2491e;
  color: #fff;
  padding: 0.3rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.feature-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  background: #d2491e;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.feature-card h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.feature-details p {
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Brands */
.brands-info {
  margin-top: 1.5rem;
}

.brand-intro {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.brand-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brand-category h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.brand-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.brand-tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.brand-tag.premium {
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  color: #fff;
}

.brand-tag.mid-range {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: #fff;
}

.brand-tag.budget {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: #fff;
}

/* Checklist */
.checklist {
  margin-top: 1.5rem;
}

.checklist-category {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.checklist-category h6 {
  color: #2d3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.checklist-item:hover {
  background: rgba(210, 73, 30, 0.1);
}

.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #d2491e;
}

/* Alerts */
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

/* Buttons */
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

/* Responsive */
@media (max-width: 768px) {
  .tips-content {
    padding: 2rem 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .purpose-header {
    flex-direction: column;
    text-align: center;
  }
  
  .purpose-icon {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .size-comparison {
    flex-direction: column;
    gap: 1rem;
  }
  
  .material-header {
    flex-direction: column;
    text-align: center;
  }
  
  .material-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .brand-categories {
    gap: 1rem;
  }
  
  .brand-list {
    justify-content: center;
  }
}
</style>
