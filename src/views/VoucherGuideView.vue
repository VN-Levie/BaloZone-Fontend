<template>
    <UserLayout>
        <div class="voucher-guide-page">
            <!-- Breadcrumb -->
            <div class="breadcrumb-section">
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/">Trang chủ</router-link>
                            </li>
                            <li class="breadcrumb-item active">Hướng dẫn sử dụng mã voucher</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <div class="container py-5">
                <div class="row">
                    <div class="col-lg-8 mx-auto">
                        <div class="voucher-content">
                            <h1 class="page-title text-center mb-5">Hướng Dẫn Sử Dụng Mã Voucher</h1>

                            <div class="voucher-intro">
                                <div class="alert alert-info">
                                    <h5><i class="bi bi-gift me-2"></i>Tiết kiệm thông minh</h5>
                                    <p class="mb-0">Voucher là cách tuyệt vời để tiết kiệm chi phí khi mua sắm tại BaloZone. Hãy tham khảo hướng dẫn chi tiết để sử dụng voucher hiệu quả nhất!</p>
                                </div>
                            </div>

                            <!-- Loại voucher -->
                            <div class="guide-section">
                                <h3 class="section-title">
                                    <i class="bi bi-tags text-primary me-2"></i>
                                    Các Loại Voucher Tại BaloZone
                                </h3>

                                <div class="voucher-types">
                                    <div class="voucher-type-card">
                                        <div class="voucher-icon discount-voucher">
                                            <i class="bi bi-percent"></i>
                                        </div>
                                        <div class="voucher-info">
                                            <h5>Voucher Giảm Giá (%)</h5>
                                            <p>Giảm một phần trăm nhất định trên tổng giá trị đơn hàng</p>
                                            <div class="voucher-example">
                                                <strong>Ví dụ:</strong> Giảm 20% tối đa 200.000đ cho đơn hàng từ 1.000.000đ
                                            </div>
                                        </div>
                                    </div>

                                    <div class="voucher-type-card">
                                        <div class="voucher-icon amount-voucher">
                                            <i class="bi bi-cash"></i>
                                        </div>
                                        <div class="voucher-info">
                                            <h5>Voucher Giảm Tiền Cố Định</h5>
                                            <p>Giảm một số tiền cố định cho đơn hàng</p>
                                            <div class="voucher-example">
                                                <strong>Ví dụ:</strong> Giảm 100.000đ cho đơn hàng từ 500.000đ
                                            </div>
                                        </div>
                                    </div>

                                    <div class="voucher-type-card">
                                        <div class="voucher-icon shipping-voucher">
                                            <i class="bi bi-truck"></i>
                                        </div>
                                        <div class="voucher-info">
                                            <h5>Voucher Miễn Phí Vận Chuyển</h5>
                                            <p>Miễn phí phí vận chuyển cho đơn hàng</p>
                                            <div class="voucher-example">
                                                <strong>Ví dụ:</strong> Miễn phí ship cho đơn hàng từ 300.000đ
                                            </div>
                                        </div>
                                    </div>

                                    <div class="voucher-type-card">
                                        <div class="voucher-icon newbie-voucher">
                                            <i class="bi bi-person-plus"></i>
                                        </div>
                                        <div class="voucher-info">
                                            <h5>Voucher Khách Hàng Mới</h5>
                                            <p>Ưu đãi đặc biệt dành cho khách hàng đăng ký lần đầu</p>
                                            <div class="voucher-example">
                                                <strong>Ví dụ:</strong> Giảm 15% cho đơn hàng đầu tiên
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Cách sử dụng -->
                            <div class="guide-section">
                                <h3 class="section-title">
                                    <i class="bi bi-list-check text-success me-2"></i>
                                    Cách Sử Dụng Voucher
                                </h3>

                                <div class="usage-steps">
                                    <div class="step-item">
                                        <div class="step-number">1</div>
                                        <div class="step-content">
                                            <h6>Thêm sản phẩm vào giỏ hàng</h6>
                                            <p>Chọn sản phẩm yêu thích và thêm vào giỏ hàng như bình thường</p>
                                        </div>
                                    </div>

                                    <div class="step-item">
                                        <div class="step-number">2</div>
                                        <div class="step-content">
                                            <h6>Vào trang thanh toán</h6>
                                            <p>Click "Thanh toán" từ giỏ hàng để chuyển đến trang xử lý đơn hàng</p>
                                        </div>
                                    </div>

                                    <div class="step-item">
                                        <div class="step-number">3</div>
                                        <div class="step-content">
                                            <h6>Nhập mã voucher</h6>
                                            <p>Tìm ô "Mã giảm giá" và nhập chính xác mã voucher của bạn</p>
                                            <div class="input-example">
                                                <div class="example-input">
                                                    <input type="text" placeholder="VD: BALOZONE20" readonly>
                                                    <button class="apply-btn">Áp dụng</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="step-item">
                                        <div class="step-number">4</div>
                                        <div class="step-content">
                                            <h6>Kiểm tra giảm giá</h6>
                                            <p>Hệ thống sẽ tự động tính toán và hiển thị số tiền được giảm</p>
                                        </div>
                                    </div>

                                    <div class="step-item">
                                        <div class="step-number">5</div>
                                        <div class="step-content">
                                            <h6>Hoàn tất thanh toán</h6>
                                            <p>Xác nhận thông tin và hoàn tất việc thanh toán với giá đã giảm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Lưu ý khi sử dụng -->
                            <div class="guide-section">
                                <h3 class="section-title">
                                    <i class="bi bi-exclamation-triangle text-warning me-2"></i>
                                    Lưu Ý Quan Trọng
                                </h3>

                                <div class="important-notes">
                                    <div class="note-item">
                                        <div class="note-icon">
                                            <i class="bi bi-calendar-x"></i>
                                        </div>
                                        <div class="note-content">
                                            <h6>Kiểm tra hạn sử dụng</h6>
                                            <p>Mỗi voucher có thời hạn sử dụng cụ thể. Voucher hết hạn sẽ không thể áp dụng được.</p>
                                        </div>
                                    </div>

                                    <div class="note-item">
                                        <div class="note-icon">
                                            <i class="bi bi-cash-stack"></i>
                                        </div>
                                        <div class="note-content">
                                            <h6>Giá trị đơn hàng tối thiểu</h6>
                                            <p>Nhiều voucher yêu cầu đơn hàng phải đạt giá trị tối thiểu để có thể sử dụng.</p>
                                        </div>
                                    </div>

                                    <div class="note-item">
                                        <div class="note-icon">
                                            <i class="bi bi-person"></i>
                                        </div>
                                        <div class="note-content">
                                            <h6>Số lần sử dụng</h6>
                                            <p>Mỗi voucher chỉ có thể sử dụng một lần cho mỗi tài khoản khách hàng.</p>
                                        </div>
                                    </div>

                                    <div class="note-item">
                                        <div class="note-icon">
                                            <i class="bi bi-stack"></i>
                                        </div>
                                        <div class="note-content">
                                            <h6>Không kết hợp voucher</h6>
                                            <p>Không thể sử dụng nhiều voucher cùng lúc cho một đơn hàng.</p>
                                        </div>
                                    </div>

                                    <div class="note-item">
                                        <div class="note-icon">
                                            <i class="bi bi-bag-x"></i>
                                        </div>
                                        <div class="note-content">
                                            <h6>Sản phẩm áp dụng</h6>
                                            <p>Một số voucher chỉ áp dụng cho nhóm sản phẩm hoặc thương hiệu cụ thể.</p>
                                        </div>
                                    </div>

                                    <div class="note-item">
                                        <div class="note-icon">
                                            <i class="bi bi-arrow-return-left"></i>
                                        </div>
                                        <div class="note-content">
                                            <h6>Chính sách hoàn trả</h6>
                                            <p>Khi hoàn trả sản phẩm, voucher sẽ không được hoàn lại cho khách hàng.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Cách nhận voucher -->
                            <div class="guide-section">
                                <h3 class="section-title">
                                    <i class="bi bi-gift text-info me-2"></i>
                                    Cách Nhận Voucher Miễn Phí
                                </h3>

                                <div class="voucher-sources">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="source-card">
                                                <i class="bi bi-newspaper source-icon"></i>
                                                <h6>Đăng ký nhận tin</h6>
                                                <p>Đăng ký email để nhận voucher và thông báo khuyến mãi mới nhất</p>
                                                <div class="source-action">
                                                    <a href="#" class="btn btn-outline-primary btn-sm">Đăng ký ngay</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <div class="source-card">
                                                <i class="bi bi-facebook source-icon"></i>
                                                <h6>Follow mạng xã hội</h6>
                                                <p>Theo dõi fanpage Facebook để nhận voucher độc quyền</p>
                                                <div class="source-action">
                                                    <a href="#" class="btn btn-outline-primary btn-sm">Follow ngay</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <div class="source-card">
                                                <i class="bi bi-person-plus source-icon"></i>
                                                <h6>Đăng ký tài khoản</h6>
                                                <p>Khách hàng mới sẽ nhận voucher chào mừng 15% ngay khi đăng ký</p>
                                                <div class="source-action">
                                                    <a href="#" class="btn btn-outline-primary btn-sm">Đăng ký</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <div class="source-card">
                                                <i class="bi bi-calendar-event source-icon"></i>
                                                <h6>Sự kiện đặc biệt</h6>
                                                <p>Nhận voucher trong các dịp lễ, tết và sinh nhật BaloZone</p>
                                                <div class="source-action">
                                                    <a href="#" class="btn btn-outline-primary btn-sm">Xem sự kiện</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Voucher hiện có -->
                            <div class="guide-section">
                                <h3 class="section-title">
                                    <i class="bi bi-lightning text-warning me-2"></i>
                                    Voucher Đang Có Hiệu Lực
                                </h3>

                                <div class="current-vouchers">
                                    <!-- Loading state -->
                                    <div v-if="isLoading" class="text-center py-4">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Đang tải...</span>
                                        </div>
                                        <p class="mt-2 text-muted">Đang tải danh sách voucher...</p>
                                    </div>

                                    <!-- Error state -->
                                    <div v-else-if="error" class="alert alert-warning text-center">
                                        <i class="bi bi-exclamation-triangle me-2"></i>
                                        {{ error }}
                                        <button @click="fetchVouchers" class="btn btn-outline-warning btn-sm ms-2">
                                            Thử lại
                                        </button>
                                    </div>

                                    <!-- Vouchers list -->
                                    <template v-else-if="vouchers.length > 0">
                                        <div v-for="(voucher, index) in vouchers" :key="voucher.id" class="voucher-card" :class="{ 'featured': shouldShowHotBadge(voucher, index) }">
                                            <div class="voucher-header">
                                                <div v-if="shouldShowHotBadge(voucher, index)" class="voucher-badge">
                                                    {{ index === 0 ? 'HOT' : 'SALE' }}
                                                </div>
                                                <div class="voucher-title">
                                                    <i :class="getVoucherIcon(voucher)" class="me-2"></i>
                                                    {{ voucher.code }}
                                                </div>
                                            </div>
                                            <div class="voucher-details">
                                                <h6>{{ getVoucherTitle(voucher) }}</h6>
                                                <!-- <p>{{ getVoucherDescription() }}</p> -->
                                                <p>{{ voucher.description }}</p>
                                                <div class="voucher-meta">
                                                    <div class="voucher-expiry">
                                                        <i class="bi bi-clock me-1"></i>
                                                        <span>Hết hạn: {{ formatDate(voucher.end_date) }}</span>
                                                    </div>
                                                    <div class="voucher-quantity">
                                                        <i class="bi bi-box me-1"></i>
                                                        <span>Còn {{ voucher.quantity }} mã</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="voucher-action">
                                                <button @click="copyVoucherCode(voucher.code)" class="btn" :class="shouldShowHotBadge(voucher, index) ? 'btn-primary' : 'btn-outline-primary'" :disabled="isCopying">
                                                    <i v-if="isCopying && copiedCode === voucher.code" class="bi bi-check-lg me-1"></i>
                                                    <i v-else class="bi bi-clipboard me-1"></i>
                                                    {{ isCopying && copiedCode === voucher.code ? 'Đã copy!' : 'Copy mã' }}
                                                </button>
                                            </div>
                                        </div>
                                    </template>

                                    <!-- Empty state -->
                                    <div v-else class="alert alert-info text-center">
                                        <i class="bi bi-gift me-2"></i>
                                        Hiện tại chưa có voucher nào. Vui lòng quay lại sau!
                                    </div>
                                </div>
                            </div>

                            <!-- Xử lý lỗi -->
                            <div class="guide-section">
                                <h3 class="section-title">
                                    <i class="bi bi-bug text-danger me-2"></i>
                                    Xử Lý Lỗi Thường Gặp
                                </h3>

                                <div class="error-solutions">
                                    <div class="error-item">
                                        <div class="error-title">
                                            <i class="bi bi-x-circle text-danger me-2"></i>
                                            <span>"Mã voucher không hợp lệ"</span>
                                        </div>
                                        <div class="error-solutions-list">
                                            <ul>
                                                <li>Kiểm tra lại chính tả của mã voucher</li>
                                                <li>Đảm bảo không có khoảng trắng thừa</li>
                                                <li>Xác nhận mã voucher chưa hết hạn</li>
                                                <li>Liên hệ hotline để được hỗ trợ</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="error-item">
                                        <div class="error-title">
                                            <i class="bi bi-x-circle text-danger me-2"></i>
                                            <span>"Đơn hàng không đủ điều kiện"</span>
                                        </div>
                                        <div class="error-solutions-list">
                                            <ul>
                                                <li>Kiểm tra giá trị đơn hàng tối thiểu</li>
                                                <li>Xem xét sản phẩm có được áp dụng voucher không</li>
                                                <li>Thêm sản phẩm để đạt giá trị yêu cầu</li>
                                                <li>Chọn voucher phù hợp với đơn hàng hiện tại</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="error-item">
                                        <div class="error-title">
                                            <i class="bi bi-x-circle text-danger me-2"></i>
                                            <span>"Voucher đã được sử dụng"</span>
                                        </div>
                                        <div class="error-solutions-list">
                                            <ul>
                                                <li>Mỗi voucher chỉ sử dụng được một lần</li>
                                                <li>Kiểm tra lịch sử đơn hàng đã dùng voucher này chưa</li>
                                                <li>Sử dụng voucher khác hoặc tìm voucher mới</li>
                                                <li>Đăng ký nhận thông báo voucher mới</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Hỗ trợ -->
                            <div class="guide-section">
                                <h3 class="section-title">
                                    <i class="bi bi-headset text-primary me-2"></i>
                                    Hỗ Trợ Voucher
                                </h3>
                                <div class="support-info">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="support-card">
                                                <i class="bi bi-telephone support-icon"></i>
                                                <h6>Hotline 24/7</h6>
                                                <p class="support-detail">1900 6750</p>
                                                <small>Hỗ trợ voucher miễn phí</small>
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
                                                <p class="support-detail">voucher@balozone.vn</p>
                                                <small>Phản hồi trong 2 giờ</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="cta-section text-center mt-5">
                                <div class="alert alert-success">
                                    <h5><i class="bi bi-bag-check me-2"></i>Sẵn sàng mua sắm với voucher?</h5>
                                    <p class="mb-3">Khám phá bộ sưu tập vali, balo đẳng cấp với giá ưu đãi</p>
                                    <router-link to="/" class="btn btn-success me-3">
                                        <i class="bi bi-shop me-2"></i>Mua sắm ngay
                                    </router-link>
                                    <router-link to="/contact" class="btn btn-outline-success">
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
import { ref, onMounted } from 'vue'
import { vouchersApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import type { Voucher } from '@/types'
import UserLayout from '@/components/layouts/UserLayout.vue'

// Meta information for SEO
document.title = 'Hướng Dẫn Sử Dụng Mã Voucher - BaloZone.vn'

// Composables
const { showSuccess, showError } = useToast()

// Reactive data
const vouchers = ref<Voucher[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isCopying = ref(false)
const copiedCode = ref<string | null>(null)

// Fetch vouchers from API
const fetchVouchers = async () => {
    isLoading.value = true
    error.value = null

    try {
        const response = await vouchersApi.getActiveVouchers()
        vouchers.value = response.data || []
    } catch (err) {
        console.error('Error fetching vouchers:', err)
        error.value = 'Không thể tải danh sách voucher. Vui lòng thử lại sau.'
    } finally {
        isLoading.value = false
    }
}

// Copy voucher code to clipboard
const copyVoucherCode = async (code: string) => {
    try {
        isCopying.value = true
        copiedCode.value = code

        if (navigator.clipboard && window.isSecureContext) {
            // Use modern clipboard API
            await navigator.clipboard.writeText(code)
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = code
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            document.execCommand('copy')
            textArea.remove()
        }

        // Show success toast
        showSuccess('Copy thành công!', 'Đã copy mã voucher vào clipboard!')

        // Reset copied state after 2 seconds
        setTimeout(() => {
            copiedCode.value = null
        }, 2000)

    } catch (err) {
        console.error('Error copying to clipboard:', err)
        showError('Lỗi copy mã', 'Không thể copy mã voucher. Vui lòng copy thủ công.')
    } finally {
        setTimeout(() => {
            isCopying.value = false
        }, 1000)
    }
}

// Format voucher title based on price and code
const getVoucherTitle = (voucher: Voucher): string => {
    const price = parseFloat(voucher.price?.toString() || '0')
    const code = voucher.code.toLowerCase()

    // Special handling for specific voucher types based on code
    if (code.includes('freeship') || code.includes('ship')) {
        return 'Miễn phí vận chuyển'
    }

    // Check if it's a percentage discount based on code pattern
    if (code.includes('10') || code.includes('15') || code.includes('20') || code.includes('25')) {
        const percentMatch = code.match(/(\d+)/)
        if (percentMatch) {
            const percent = percentMatch[1]
            return `Giảm ${percent}% tối đa ${price.toLocaleString('vi-VN')}đ`
        }
    }

    // Default to fixed amount discount
    return `Giảm ${price.toLocaleString('vi-VN')}đ`
}

// Format voucher description based on price and type
const getVoucherDescription = (voucher: Voucher): string => {
    const price = parseFloat(voucher.price?.toString() || '0')
    const code = voucher.code.toLowerCase()

    // Special handling for specific voucher types
    if (code.includes('freeship') || code.includes('ship')) {
        return 'Áp dụng cho đơn hàng từ 300.000đ'
    }

    if (code.includes('welcome') || code.includes('new')) {
        return 'Dành cho khách hàng mới đăng ký'
    }

    if (code.includes('student')) {
        return 'Dành cho sinh viên với đơn hàng từ 400.000đ'
    }

    if (code.includes('loyal')) {
        return 'Dành cho khách hàng thân thiết'
    }

    if (code.includes('summer') || code.includes('flash')) {
        return 'Khuyến mãi có thời hạn - Nhanh tay!'
    }

    // Default description based on price range
    if (price >= 150000) {
        return 'Áp dụng cho đơn hàng từ 1.000.000đ'
    } else if (price >= 75000) {
        return 'Áp dụng cho đơn hàng từ 500.000đ'
    } else {
        return 'Áp dụng cho đơn hàng từ 300.000đ'
    }
}

// Get voucher type for styling and icon
const getVoucherType = (voucher: Voucher): string => {
    const code = voucher.code.toLowerCase()

    if (code.includes('freeship') || code.includes('ship')) {
        return 'shipping'
    }

    if (code.includes('welcome') || code.includes('new')) {
        return 'newbie'
    }

    if (code.includes('flash') || code.includes('summer')) {
        return 'hot'
    }

    // Check if it's likely a percentage discount
    if (code.includes('10') || code.includes('15') || code.includes('20') || code.includes('25')) {
        return 'percentage'
    }

    return 'amount'
}

// Get voucher icon based on type
const getVoucherIcon = (voucher: Voucher): string => {
    const type = getVoucherType(voucher)

    switch (type) {
        case 'shipping':
            return 'bi-truck'
        case 'newbie':
            return 'bi-person-plus'
        case 'percentage':
            return 'bi-percent'
        case 'hot':
            return 'bi-fire'
        default:
            return 'bi-cash'
    }
}

// Check if voucher should have special badge
const shouldShowHotBadge = (voucher: Voucher, index: number): boolean => {
    if (index === 0) return true // First voucher is always hot

    const code = voucher.code.toLowerCase()
    const price = parseFloat(voucher.price?.toString() || '0')

    // Show hot badge for flash sales or high value vouchers
    return code.includes('flash') || price >= 150000
}

// Format date for display
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    } catch (err) {
        return 'Không xác định'
    }
}

// Load vouchers on component mount
onMounted(() => {
    fetchVouchers()
})
</script>

<style scoped>
.voucher-guide-page {
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

.voucher-content {
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

.voucher-intro {
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

.voucher-types {
    margin-top: 1.5rem;
}

.voucher-type-card {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.voucher-type-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.voucher-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 2rem;
    font-size: 2rem;
    color: #fff;
    flex-shrink: 0;
}

.voucher-icon.discount-voucher {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.voucher-icon.amount-voucher {
    background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
}

.voucher-icon.shipping-voucher {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.voucher-icon.newbie-voucher {
    background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
}

.voucher-info h5 {
    color: #2d3e50;
    font-weight: 600;
    margin-bottom: 1rem;
}

.voucher-info p {
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.6;
}

.voucher-example {
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    border-left: 4px solid #d2491e;
    font-size: 0.9rem;
    color: #666;
}

.usage-steps {
    margin-top: 1.5rem;
}

.step-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid #28a745;
    transition: all 0.3s ease;
}

.step-item:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.step-number {
    background: #28a745;
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
    margin-bottom: 1rem;
    line-height: 1.6;
}

.input-example {
    margin-top: 1rem;
}

.example-input {
    display: flex;
    max-width: 300px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
}

.example-input input {
    flex: 1;
    padding: 0.75rem;
    border: none;
    background: #fff;
    color: #666;
}

.example-input input:focus {
    outline: none;
}

.apply-btn {
    background: #d2491e;
    color: #fff;
    border: none;
    padding: 0.75rem 1rem;
    font-weight: 600;
    cursor: pointer;
}

.important-notes {
    margin-top: 1.5rem;
}

.note-item {
    display: flex;
    align-items: center;
    background: #fff3cd;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid #ffc107;
}

.note-icon {
    background: #ffc107;
    color: #fff;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    flex-shrink: 0;
    font-size: 1.2rem;
}

.note-content h6 {
    color: #856404;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.note-content p {
    color: #856404;
    margin-bottom: 0;
    line-height: 1.6;
}

.voucher-sources {
    margin-top: 1.5rem;
}

.source-card {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 1.5rem;
    text-align: center;
    height: 100%;
    margin-bottom: 1rem;
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.source-card:hover {
    border-color: #d2491e;
    transform: translateY(-5px);
}

.source-icon {
    color: #d2491e;
    font-size: 2rem;
    margin-bottom: 1rem;
}

.source-card h6 {
    color: #2d3e50;
    font-weight: 600;
    margin-bottom: 1rem;
}

.source-card p {
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.source-action {
    margin-top: auto;
}

.current-vouchers {
    margin-top: 1.5rem;
}

.voucher-card {
    background: #f8f9fa;
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.voucher-card:hover {
    border-color: #d2491e;
    transform: translateY(-5px);
}

.voucher-card.featured {
    background: linear-gradient(135deg, #fff5f0 0%, #ffe8d6 100%);
    border-color: #d2491e;
}

.voucher-header {
    flex-shrink: 0;
    position: relative;
}

.voucher-badge {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #e74c3c;
    color: #fff;
    padding: 0.25rem 0.5rem;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 600;
}

.voucher-title {
    background: #d2491e;
    color: #fff;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 1.2rem;
    text-align: center;
    letter-spacing: 1px;
}

.voucher-details {
    flex: 1;
}

.voucher-details h6 {
    color: #2d3e50;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.voucher-details p {
    color: #666;
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

.voucher-expiry {
    color: #999;
    font-size: 0.9rem;
}

.voucher-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
}

.voucher-quantity {
    color: #28a745;
    font-size: 0.9rem;
    font-weight: 500;
}

.voucher-title i {
    opacity: 0.8;
}

.error-solutions {
    margin-top: 1.5rem;
}

.error-item {
    background: #f8d7da;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid #dc3545;
}

.error-title {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.error-title span {
    color: #721c24;
    font-weight: 600;
}

.error-solutions-list ul {
    margin-bottom: 0;
}

.error-solutions-list li {
    color: #721c24;
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
    color: #fff5f0;
    background: #d2491e;
    border-color: #d2491e;
    transform: translateY(-2px);
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

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

.cta-section {
    border-top: 2px solid #e9ecef;
    padding-top: 2rem;
}

@media (max-width: 768px) {
    .voucher-content {
        padding: 2rem 1.5rem;
    }

    .page-title {
        font-size: 2rem;
    }

    .voucher-type-card {
        flex-direction: column;
        text-align: center;
    }

    .voucher-icon {
        margin-right: 0;
        margin-bottom: 1rem;
    }

    .step-item {
        flex-direction: column;
        text-align: center;
    }

    .step-number {
        margin-right: 0;
        margin-bottom: 1rem;
    }

    .note-item {
        flex-direction: column;
        text-align: center;
    }

    .note-icon {
        margin-right: 0;
        margin-bottom: 1rem;
    }

    .voucher-card {
        flex-direction: column;
        text-align: center;
    }

    .example-input {
        max-width: 100%;
    }
}
</style>
