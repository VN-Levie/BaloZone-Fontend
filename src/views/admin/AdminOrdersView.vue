<template>
    <AdminLayout>
        <div class="admin-orders-container">
            <!-- Modern Header with Glassmorphism Effect -->
            <div class="header-card mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="h2 mb-2 fw-bold gradient-text">
                            <i class="bi bi-cart-check-fill me-3"></i>Quản lý đơn hàng
                        </h1>
                        <p class="text-muted mb-0 fs-6">
                            Quản lý và theo dõi tất cả đơn hàng trong hệ thống
                        </p>
                        <div class="keyboard-shortcuts mt-2">
                            <span class="shortcut-badge"><kbd>F</kbd> Bộ lọc</span>
                            <span class="shortcut-badge"><kbd>Ctrl+R</kbd> Làm mới</span>
                            <span class="shortcut-badge"><kbd>Esc</kbd> Bỏ chọn</span>
                        </div>
                    </div>
                    <div class="d-flex gap-3">
                        <button class="btn btn-modern btn-outline-primary" @click="refreshData" :disabled="loading">
                            <i class="bi bi-arrow-clockwise me-2" :class="{ 'spinning': loading }"></i>
                            Làm mới
                        </button>
                        <button class="btn btn-modern btn-success" @click="exportOrders" :disabled="loading || !orders?.length">
                            <i class="bi bi-download me-2"></i>
                            Xuất Excel
                        </button>
                        <button class="btn btn-modern btn-primary" @click="toggleFilters" :class="{ 'active': showFilters }">
                            <i class="bi bi-funnel me-2"></i>
                            Bộ lọc
                            <i class="bi bi-chevron-down ms-1 transition-transform" :class="{ 'rotate-180': showFilters }"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Advanced Filters with Modern Design -->
            <Transition name="filter-slide">
                <div v-show="showFilters" class="filters-card mb-4">
                    <div class="filters-header">
                        <h5 class="mb-0">
                            <i class="bi bi-sliders2 me-2"></i>
                            Bộ lọc nâng cao
                        </h5>
                        <button class="btn btn-sm btn-ghost" @click="toggleFilters">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div class="filters-body">
                        <!-- Row 1: Status filters -->
                        <div class="filter-row">
                            <div class="filter-group">
                                <label class="filter-label">Trạng thái đơn hàng</label>
                                <select class="form-control-modern" v-model="filters.status" @change="applyFilters">
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="pending">🟡 Chờ xử lý</option>
                                    <option value="processing">🔵 Đang xử lý</option>
                                    <option value="shipped">🚚 Đã giao hàng</option>
                                    <option value="delivered">✅ Đã hoàn thành</option>
                                    <option value="cancelled">❌ Đã hủy</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Trạng thái thanh toán</label>
                                <select class="form-control-modern" v-model="filters.payment_status" @change="applyFilters">
                                    <option value="">Tất cả thanh toán</option>
                                    <option value="pending">⏳ Chờ thanh toán</option>
                                    <option value="paid">💳 Đã thanh toán</option>
                                    <option value="failed">⚠️ Thất bại</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Từ ngày</label>
                                <input type="date" class="form-control-modern" v-model="filters.date_from" @change="applyFilters">
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Đến ngày</label>
                                <input type="date" class="form-control-modern" v-model="filters.date_to" @change="applyFilters">
                            </div>
                        </div>

                        <!-- Row 2: Search and range -->
                        <div class="filter-row">
                            <div class="filter-group flex-2">
                                <label class="filter-label">Tìm kiếm</label>
                                <div class="search-input-wrapper">
                                    <i class="bi bi-search search-icon"></i>
                                    <input type="text" class="form-control-modern search-input" placeholder="Tìm theo mã đơn hàng, tên khách hàng, email..." v-model="filters.search" @input="debounceSearch">
                                    <button v-if="filters.search" class="clear-search" @click="clearSearch">
                                        <i class="bi bi-x"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Khoảng giá trị (VNĐ)</label>
                                <div class="price-range">
                                    <input type="number" class="form-control-modern" placeholder="Từ" v-model="filters.min_amount" @change="applyFilters">
                                    <span class="range-separator">-</span>
                                    <input type="number" class="form-control-modern" placeholder="Đến" v-model="filters.max_amount" @change="applyFilters">
                                </div>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Hiển thị</label>
                                <select class="form-control-modern" v-model="filters.per_page" @change="applyFilters">
                                    <option value="15">15 đơn/trang</option>
                                    <option value="25">25 đơn/trang</option>
                                    <option value="50">50 đơn/trang</option>
                                    <option value="100">100 đơn/trang</option>
                                </select>
                            </div>
                        </div>

                        <!-- Row 3: Actions -->
                        <div class="filter-actions">
                            <div class="auto-refresh-toggle">
                                <input class="form-check-input" type="checkbox" id="autoRefresh" v-model="autoRefresh" @change="toggleAutoRefresh">
                                <label class="auto-refresh-label" for="autoRefresh">
                                    <i class="bi bi-arrow-clockwise me-2"></i>
                                    Tự động làm mới (30s)
                                    <span v-if="autoRefresh" class="refresh-indicator"></span>
                                </label>
                            </div>

                            <button class="btn btn-modern btn-outline-secondary" @click="clearFilters">
                                <i class="bi bi-arrow-counterclockwise me-2"></i>
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>

            <!-- Modern Stats Dashboard -->
            <div class="stats-container mb-4">
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card total">
                        <div class="stat-icon">
                            <i class="bi bi-archive-fill"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ stats.total || 0 }}</div>
                            <div class="stat-label">Tổng đơn hàng</div>
                        </div>
                    </div>

                    <div class="stat-card pending">
                        <div class="stat-icon">
                            <i class="bi bi-clock-fill"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ stats.pending || 0 }}</div>
                            <div class="stat-label">Chờ xử lý</div>
                        </div>
                    </div>

                    <div class="stat-card processing">
                        <div class="stat-icon">
                            <i class="bi bi-gear-fill"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ stats.processing || 0 }}</div>
                            <div class="stat-label">Đang xử lý</div>
                        </div>
                    </div>

                    <div class="stat-card shipped">
                        <div class="stat-icon">
                            <i class="bi bi-truck"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ stats.shipped || 0 }}</div>
                            <div class="stat-label">Đang giao</div>
                        </div>
                    </div>

                    <div class="stat-card delivered">
                        <div class="stat-icon">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ stats.delivered || 0 }}</div>
                            <div class="stat-label">Hoàn thành</div>
                        </div>
                    </div>

                    <div class="stat-card cancelled">
                        <div class="stat-icon">
                            <i class="bi bi-x-circle-fill"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">{{ stats.cancelled || 0 }}</div>
                            <div class="stat-label">Đã hủy</div>
                        </div>
                    </div>
                </div>

                <!-- Smart Bulk Actions Panel -->
                <Transition name="bulk-slide">
                    <div v-if="selectedOrders.length > 0" class="bulk-actions-panel">
                        <div class="bulk-header">
                            <div class="bulk-info">
                                <i class="bi bi-check-square-fill me-2"></i>
                                <span class="selected-count">{{ selectedOrders.length }}</span>
                                <span class="selected-text">đơn hàng được chọn</span>
                            </div>
                            <button class="btn btn-ghost btn-sm" @click="clearSelection">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div class="bulk-body">
                            <!-- Status Analysis -->
                            <div class="status-analysis mb-3">
                                <div class="analysis-title">Phân tích trạng thái:</div>
                                <div class="status-chips">
                                    <span v-for="(count, status) in selectedOrdersStatusAnalysis" :key="status" class="status-chip" :class="status">
                                        {{ getStatusText(status) }}: {{ count }}
                                    </span>
                                </div>
                            </div>

                            <!-- Bulk Actions -->
                            <div class="bulk-actions">
                                <div v-if="canBulkUpdate" class="bulk-update-section">
                                    <label class="bulk-label">Cập nhật trạng thái hàng loạt:</label>
                                    <div class="bulk-buttons">
                                        <button v-if="canBulkUpdateTo('processing')" class="bulk-btn processing" @click="bulkUpdateStatus('processing')" :disabled="bulkUpdating">
                                            <i class="bi bi-arrow-clockwise me-2"></i>
                                            Đang xử lý
                                        </button>

                                        <button v-if="canBulkUpdateTo('shipped')" class="bulk-btn shipped" @click="bulkUpdateStatus('shipped')" :disabled="bulkUpdating">
                                            <i class="bi bi-truck me-2"></i>
                                            Đã giao hàng
                                        </button>

                                        <button v-if="canBulkUpdateTo('delivered')" class="bulk-btn delivered" @click="bulkUpdateStatus('delivered')" :disabled="bulkUpdating">
                                            <i class="bi bi-check-circle me-2"></i>
                                            Hoàn thành
                                        </button>

                                        <button v-if="canBulkUpdateTo('cancelled')" class="bulk-btn cancelled" @click="bulkUpdateStatus('cancelled')" :disabled="bulkUpdating">
                                            <i class="bi bi-x-circle me-2"></i>
                                            Hủy đơn
                                        </button>
                                    </div>
                                </div>

                                <div v-else class="bulk-update-disabled">
                                    <i class="bi bi-info-circle me-2"></i>
                                    <span>Không thể cập nhật hàng loạt khi chọn đơn hàng có trạng thái khác nhau</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- Loading State with Skeleton -->
            <div v-if="loading" class="loading-container">
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 50px;">
                                            <div class="skeleton skeleton-checkbox"></div>
                                        </th>
                                        <th>
                                            <div class="skeleton skeleton-text"></div>
                                        </th>
                                        <th>
                                            <div class="skeleton skeleton-text"></div>
                                        </th>
                                        <th>
                                            <div class="skeleton skeleton-text"></div>
                                        </th>
                                        <th>
                                            <div class="skeleton skeleton-text"></div>
                                        </th>
                                        <th>
                                            <div class="skeleton skeleton-text"></div>
                                        </th>
                                        <th>
                                            <div class="skeleton skeleton-text"></div>
                                        </th>
                                        <th>
                                            <div class="skeleton skeleton-text"></div>
                                        </th>
                                        <th>
                                            <div class="skeleton skeleton-text"></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="i in 8" :key="i" class="skeleton-row">
                                        <td>
                                            <div class="skeleton skeleton-checkbox"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skeleton-text mb-1"></div>
                                            <div class="skeleton skeleton-text-sm"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skeleton-text mb-1"></div>
                                            <div class="skeleton skeleton-text-sm"></div>
                                            <div class="skeleton skeleton-text-xs"></div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="skeleton skeleton-avatar me-2"></div>
                                                <div class="flex-1">
                                                    <div class="skeleton skeleton-text mb-1"></div>
                                                    <div class="skeleton skeleton-text-sm"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="skeleton skeleton-text mb-1"></div>
                                            <div class="skeleton skeleton-text-sm"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skeleton-badge"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skeleton-badge mb-1"></div>
                                            <div class="skeleton skeleton-text-xs"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skeleton-text"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skeleton-button"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Loading overlay with spinner -->
                <div class="loading-overlay-modern">
                    <div class="loading-content">
                        <div class="loading-spinner">
                            <div class="spinner-modern"></div>
                        </div>
                        <p class="loading-text">Đang tải danh sách đơn hàng...</p>
                        <div class="loading-progress">
                            <div class="progress-bar"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger" role="alert">
                <h4 class="alert-heading">
                    <i class="bi bi-exclamation-triangle me-2"></i>Lỗi tải dữ liệu
                </h4>
                <p class="mb-0">{{ error }}</p>
                <hr>
                <button class="btn btn-outline-danger" @click="refreshData">
                    <i class="bi bi-arrow-clockwise me-1"></i>Thử lại
                </button>
            </div>

            <!-- Orders Table -->
            <div v-else class="orders-table-container">
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0 modern-table">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 50px;">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll">
                                            </div>
                                        </th>
                                        <th class="sortable" @click="sortBy('order_number')">
                                            <div class="d-flex align-items-center">
                                                Mã đơn hàng
                                                <i class="bi bi-arrow-down-up ms-1 sort-icon"></i>
                                            </div>
                                        </th>
                                        <th class="sortable" @click="sortBy('user.name')">
                                            <div class="d-flex align-items-center">
                                                Khách hàng
                                                <i class="bi bi-arrow-down-up ms-1 sort-icon"></i>
                                            </div>
                                        </th>
                                        <th>Sản phẩm</th>
                                        <th class="sortable" @click="sortBy('final_amount')">
                                            <div class="d-flex align-items-center">
                                                Tổng tiền
                                                <i class="bi bi-arrow-down-up ms-1 sort-icon"></i>
                                            </div>
                                        </th>
                                        <th>Trạng thái</th>
                                        <th>Thanh toán</th>
                                        <th class="sortable" @click="sortBy('created_at')">
                                            <div class="d-flex align-items-center">
                                                Ngày tạo
                                                <i class="bi bi-arrow-down-up ms-1 sort-icon"></i>
                                            </div>
                                        </th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="!orders?.length" class="empty-state">
                                        <td colspan="9" class="text-center py-5">
                                            <div class="empty-illustration">
                                                <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                                                <h5 class="text-muted mb-2">Không có đơn hàng nào</h5>
                                                <p class="text-muted mb-0">Hãy thử điều chỉnh bộ lọc hoặc tạo đơn hàng mới</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-for="order in orders" :key="order.id" class="order-row" :class="{
                                        'table-warning': selectedOrders.includes(order.id),
                                        'high-value': parseFloat(order.final_amount) > 10000000
                                    }">
                                        <td>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" :checked="selectedOrders.includes(order.id)" @change="toggleOrderSelection(order.id)">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="order-number-cell">
                                                <div class="fw-bold text-primary order-number">{{ order.order_number }}</div>
                                                <div class="small text-muted order-id">#{{ order.id }}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="customer-cell">
                                                <div class="customer-avatar">
                                                    <i class="bi bi-person-circle fs-4 text-muted"></i>
                                                </div>
                                                <div class="customer-info">
                                                    <div class="fw-semibold customer-name">{{ order.user.name }}</div>
                                                    <div class="small text-muted customer-email">{{ order.user.email }}</div>
                                                    <div class="small text-muted customer-phone" v-if="order.user.phone">
                                                        <i class="bi bi-telephone me-1"></i>{{ order.user.phone }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="product-cell">
                                                <div class="product-image-wrapper">
                                                    <img v-if="order.order_details?.[0]?.product?.image" :src="order.order_details[0].product.image" :alt="order.order_details[0].product.name" class="product-thumbnail" loading="lazy">
                                                    <div v-else class="product-placeholder">
                                                        <i class="bi bi-image"></i>
                                                    </div>
                                                </div>
                                                <div class="product-info">
                                                    <div class="fw-semibold small product-name">
                                                        {{ order.order_details?.[0]?.product?.name || 'N/A' }}
                                                    </div>
                                                    <div class="small text-muted product-count" v-if="order.order_details?.length > 1">
                                                        <i class="bi bi-plus-circle me-1"></i>{{ order.order_details.length - 1 }} sản phẩm khác
                                                    </div>
                                                    <div class="small text-primary fw-medium total-items">
                                                        Tổng: {{order.order_details?.reduce((sum, item) => sum + item.quantity, 0) || 0}} món
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="amount-cell">
                                                <div class="fw-bold amount-value">{{ formatCurrency(order.final_amount) }}</div>
                                                <div class="small text-success" v-if="order.voucher_discount !== '0.00'">
                                                    <i class="bi bi-tag me-1"></i>Giảm: {{ formatCurrency(order.voucher_discount) }}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="status-badge" :class="getStatusClass(order.status)">
                                                <i :class="getStatusIcon(order.status)" class="me-1"></i>
                                                {{ getStatusText(order.status) }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="payment-cell">
                                                <span class="payment-badge" :class="getPaymentStatusClass(order.payment_status)">
                                                    <i :class="getPaymentIcon(order.payment_status)" class="me-1"></i>
                                                    {{ getPaymentStatusText(order.payment_status) }}
                                                </span>
                                                <div class="small text-muted mt-1 payment-method">
                                                    <i class="bi bi-credit-card me-1"></i>{{ order.payment_method.display_name }}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="date-cell">
                                                <div class="small fw-medium">{{ formatDate(order.created_at) }}</div>
                                                <div class="small text-muted">{{ formatTime(order.created_at) }}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="actions-cell">
                                                <div class="dropdown">
                                                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle action-btn" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i class="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul class="dropdown-menu dropdown-menu-end shadow">
                                                        <li>
                                                            <a class="dropdown-item" href="#" @click.prevent="viewOrderDetails(order)">
                                                                <i class="bi bi-eye me-2 text-primary"></i>Xem chi tiết
                                                            </a>
                                                        </li>
                                                        <li v-if="canUpdateStatus(order.status)">
                                                            <a class="dropdown-item" href="#" @click.prevent="openStatusModal(order)">
                                                                <i class="bi bi-arrow-repeat me-2 text-info"></i>Cập nhật trạng thái
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <hr class="dropdown-divider">
                                                        </li>
                                                        <li v-if="order.status === 'pending'">
                                                            <a class="dropdown-item text-success" href="#" @click.prevent="quickUpdateStatus(order, 'processing')">
                                                                <i class="bi bi-check-circle me-2"></i>Xác nhận đơn hàng
                                                            </a>
                                                        </li>
                                                        <li v-if="order.status === 'processing'">
                                                            <a class="dropdown-item text-info" href="#" @click.prevent="quickUpdateStatus(order, 'shipped')">
                                                                <i class="bi bi-truck me-2"></i>Đánh dấu đã giao
                                                            </a>
                                                        </li>
                                                        <li v-if="order.status === 'shipped'">
                                                            <a class="dropdown-item text-success" href="#" @click.prevent="quickUpdateStatus(order, 'delivered')">
                                                                <i class="bi bi-check2-all me-2"></i>Hoàn thành
                                                            </a>
                                                        </li>
                                                        <li v-if="['pending', 'processing'].includes(order.status)">
                                                            <a class="dropdown-item text-danger" href="#" @click.prevent="quickUpdateStatus(order, 'cancelled')">
                                                                <i class="bi bi-x-circle me-2"></i>Hủy đơn hàng
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Enhanced Pagination -->
                    <div class="card-footer modern-pagination" v-if="pagination && pagination.total > 0">
                        <div class="pagination-container">
                            <!-- Pagination Info -->
                            <div class="pagination-info">
                                <div class="results-summary">
                                    <span class="results-text">
                                        Hiển thị <strong>{{ pagination.from }}</strong> - <strong>{{ pagination.to }}</strong>
                                        trong tổng số <strong>{{ pagination.total }}</strong> đơn hàng
                                    </span>
                                </div>
                                <div class="page-size-selector">
                                    <label class="page-size-label">Hiển thị:</label>
                                    <select class="form-select form-select-sm" v-model="filters.per_page" @change="applyFilters">
                                        <option value="15">15</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    <span class="page-size-text">/ trang</span>
                                </div>
                            </div>

                            <!-- Pagination Controls -->
                            <nav aria-label="Orders pagination" class="pagination-nav">
                                <ul class="pagination modern-pagination-list">
                                    <!-- First Page -->
                                    <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                        <a class="page-link page-link-first" href="#" @click.prevent="changePage(1)" :title="'Trang đầu'">
                                            <i class="bi bi-chevron-double-left"></i>
                                        </a>
                                    </li>

                                    <!-- Previous Page -->
                                    <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                        <a class="page-link page-link-prev" href="#" @click.prevent="changePage(pagination.current_page - 1)" :title="'Trang trước'">
                                            <i class="bi bi-chevron-left"></i>
                                        </a>
                                    </li>

                                    <!-- Page Numbers -->
                                    <li v-for="page in getVisiblePages()" :key="page" class="page-item" :class="{ active: page === pagination.current_page }">
                                        <a class="page-link page-link-number" href="#" @click.prevent="changePage(page)">
                                            {{ page }}
                                        </a>
                                    </li>

                                    <!-- Next Page -->
                                    <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                                        <a class="page-link page-link-next" href="#" @click.prevent="changePage(pagination.current_page + 1)" :title="'Trang sau'">
                                            <i class="bi bi-chevron-right"></i>
                                        </a>
                                    </li>

                                    <!-- Last Page -->
                                    <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                                        <a class="page-link page-link-last" href="#" @click.prevent="changePage(pagination.last_page)" :title="'Trang cuối'">
                                            <i class="bi bi-chevron-double-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </nav>

                            <!-- Quick Page Jump -->
                            <div class="page-jump" v-if="pagination.last_page > 10">
                                <span class="page-jump-label">Đến trang:</span>
                                <input type="number" class="form-control form-control-sm page-jump-input" :min="1" :max="pagination.last_page" :placeholder="pagination.current_page.toString()" @keyup.enter="jumpToPage($event)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Status Update Modal -->
            <div class="modal fade" id="statusModal" tabindex="-1" ref="statusModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content modern-modal">
                        <div class="modal-header border-0 pb-0">
                            <div class="modal-title-section">
                                <h4 class="modal-title fw-bold gradient-text">
                                    <i class="bi bi-arrow-repeat me-2"></i>Cập nhật trạng thái đơn hàng
                                </h4>
                                <p class="text-muted mb-0" v-if="selectedOrder">
                                    Đơn hàng: <span class="fw-semibold text-primary">{{ selectedOrder.order_number }}</span> -
                                    Khách hàng: <span class="fw-semibold">{{ selectedOrder.user.name }}</span>
                                </p>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div class="modal-body" v-if="selectedOrder">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group-modern">
                                        <label class="form-label-modern">
                                            <i class="bi bi-clipboard-check me-2"></i>Trạng thái đơn hàng
                                        </label>
                                        <select class="form-select-modern" v-model="statusForm.status">
                                            <option value="pending">🟡 Chờ xử lý</option>
                                            <option value="processing">🔵 Đang xử lý</option>
                                            <option value="shipped">🚚 Đã giao hàng</option>
                                            <option value="delivered">✅ Đã hoàn thành</option>
                                            <option value="cancelled">❌ Đã hủy</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group-modern">
                                        <label class="form-label-modern">
                                            <i class="bi bi-credit-card me-2"></i>Trạng thái thanh toán
                                        </label>
                                        <select class="form-select-modern" v-model="statusForm.payment_status">
                                            <option value="pending">⏳ Chờ thanh toán</option>
                                            <option value="paid">💳 Đã thanh toán</option>
                                            <option value="failed">⚠️ Thất bại</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group-modern" v-if="statusForm.status === 'shipped'">
                                <label class="form-label-modern">
                                    <i class="bi bi-truck me-2"></i>Mã vận đơn
                                </label>
                                <input type="text" class="form-control-modern" v-model="statusForm.tracking_number" placeholder="Nhập mã vận đơn...">
                                <div class="form-hint">
                                    Mã vận đơn sẽ được gửi cho khách hàng để theo dõi đơn hàng
                                </div>
                            </div>

                            <div class="form-group-modern">
                                <label class="form-label-modern">
                                    <i class="bi bi-chat-left-text me-2"></i>Ghi chú
                                </label>
                                <textarea class="form-control-modern" rows="4" v-model="statusForm.notes" placeholder="Thêm ghi chú về thay đổi trạng thái..."></textarea>
                                <div class="form-hint">
                                    Ghi chú này sẽ được lưu lại trong lịch sử đơn hàng
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer border-0 pt-0">
                            <div class="d-flex justify-content-between w-100">
                                <button type="button" class="btn btn-outline-secondary btn-modern" data-bs-dismiss="modal">
                                    <i class="bi bi-x-lg me-1"></i>Hủy
                                </button>
                                <button type="button" class="btn btn-primary btn-modern" @click="updateOrderStatus" :disabled="updating">
                                    <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-check-lg me-1"></i>
                                    {{ updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Details Modal -->
            <div class="modal fade" id="detailsModal" tabindex="-1" ref="detailsModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Chi tiết đơn hàng</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" v-if="selectedOrder">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Thông tin đơn hàng</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <th>Mã đơn hàng:</th>
                                            <td>{{ selectedOrder.order_number }}</td>
                                        </tr>
                                        <tr>
                                            <th>Trạng thái:</th>
                                            <td>
                                                <span class="badge" :class="getStatusClass(selectedOrder.status)">
                                                    {{ getStatusText(selectedOrder.status) }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Thanh toán:</th>
                                            <td>
                                                <span class="badge" :class="getPaymentStatusClass(selectedOrder.payment_status)">
                                                    {{ getPaymentStatusText(selectedOrder.payment_status) }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Phương thức:</th>
                                            <td>{{ selectedOrder.payment_method.display_name }}</td>
                                        </tr>
                                        <tr>
                                            <th>Ngày tạo:</th>
                                            <td>{{ formatDate(selectedOrder.created_at) }}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6>Thông tin khách hàng</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <th>Tên:</th>
                                            <td>{{ selectedOrder.user.name }}</td>
                                        </tr>
                                        <tr>
                                            <th>Email:</th>
                                            <td>{{ selectedOrder.user.email }}</td>
                                        </tr>
                                        <tr>
                                            <th>Điện thoại:</th>
                                            <td>{{ selectedOrder.user.phone || 'N/A' }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                            <h6 class="mt-4">Sản phẩm trong đơn hàng</h6>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Đơn giá</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in selectedOrder.order_details" :key="item.id">
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img v-if="item.product.image" :src="item.product.image" :alt="item.product.name" class="rounded me-2" style="width: 40px; height: 40px; object-fit: cover;">
                                                    <div>
                                                        <div class="fw-semibold">{{ item.product.name }}</div>
                                                        <div class="small text-muted" v-if="item.product.color">
                                                            Màu: {{ item.product.color }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{{ item.quantity }}</td>
                                            <td>{{ formatCurrency(item.price) }}</td>
                                            <td>{{ formatCurrency(parseFloat(item.price) * item.quantity) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-6 offset-md-6">
                                    <table class="table table-sm">
                                        <tr>
                                            <th>Tổng tiền hàng:</th>
                                            <td class="text-end">{{ formatCurrency(selectedOrder.total_amount) }}</td>
                                        </tr>
                                        <tr>
                                            <th>Phí vận chuyển:</th>
                                            <td class="text-end">{{ formatCurrency(selectedOrder.shipping_fee) }}</td>
                                        </tr>
                                        <tr v-if="selectedOrder.voucher_discount !== '0.00'">
                                            <th>Giảm giá:</th>
                                            <td class="text-end text-success">-{{ formatCurrency(selectedOrder.voucher_discount) }}</td>
                                        </tr>
                                        <tr class="table-active">
                                            <th>Tổng cộng:</th>
                                            <td class="text-end fw-bold">{{ formatCurrency(selectedOrder.final_amount) }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button v-if="selectedOrder" type="button" class="btn btn-primary" @click="openStatusModal(selectedOrder)">
                                Cập nhật trạng thái
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { ordersApi } from '@/services/api'
import { formatCurrency, formatDate } from '@/utils/adminHelpers'
import { useToast } from '@/composables/useToast'
import type { Order, PaginationMeta } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout.vue'

// Reactive data
const loading = ref(true)
const error = ref<string | null>(null)
const orders = ref<Order[]>([])
const pagination = ref<PaginationMeta | null>(null)
const showFilters = ref(false)
const selectedOrder = ref<Order | null>(null)
const updating = ref(false)
const selectedOrders = ref<number[]>([])
const bulkUpdating = ref(false)
const autoRefresh = ref(false)
let autoRefreshInterval: number | null = null

// Filters
const filters = ref({
    status: '',
    payment_status: '',
    user_id: '',
    date_from: '',
    date_to: '',
    search: '',
    min_amount: '',
    max_amount: '',
    page: 1,
    per_page: 15
})

// Status form
const statusForm = ref({
    status: '' as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | '',
    payment_status: '' as 'pending' | 'paid' | 'failed' | '',
    tracking_number: '',
    notes: ''
})

// Stats
const stats = ref({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
})

// Toast
const { showToast } = useToast()

// Modals
const statusModal = ref<HTMLElement | null>(null)
const detailsModal = ref<HTMLElement | null>(null)
let statusModalInstance: any = null
let detailsModalInstance: any = null

// Search debounce
let searchTimeout: number | null = null

// Computed
const isAllSelected = computed(() => {
    return orders.value.length > 0 && selectedOrders.value.length === orders.value.length
})

const isIndeterminate = computed(() => {
    return selectedOrders.value.length > 0 && selectedOrders.value.length < orders.value.length
})

// Smart bulk update logic
const selectedOrdersStatusAnalysis = computed(() => {
    const selectedOrdersData = orders.value.filter(order => selectedOrders.value.includes(order.id))
    const statusCounts: Record<string, number> = {}

    selectedOrdersData.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    return statusCounts
})

const canBulkUpdate = computed(() => {
    const statuses = Object.keys(selectedOrdersStatusAnalysis.value)
    // Chỉ cho phép bulk update khi tất cả đơn hàng có cùng trạng thái
    // hoặc chỉ có các trạng thái tương thích
    if (statuses.length === 1) return true

    // Cho phép bulk update một số trường hợp đặc biệt
    const compatibleStatuses = ['pending', 'processing']
    return statuses.every(status => compatibleStatuses.includes(status))
})

const canBulkUpdateTo = (targetStatus: string) => {
    if (!canBulkUpdate.value) return false

    const currentStatuses = Object.keys(selectedOrdersStatusAnalysis.value)

    // Logic transition rules
    const transitionRules: Record<string, string[]> = {
        'processing': ['pending'],
        'shipped': ['processing'],
        'delivered': ['shipped'],
        'cancelled': ['pending', 'processing']
    }

    return currentStatuses.every(status =>
        transitionRules[targetStatus]?.includes(status) || false
    )
}

const getStatusClass = (status: string) => {
    const classes = {
        pending: 'bg-warning text-dark',
        processing: 'bg-info',
        shipped: 'bg-primary',
        delivered: 'bg-success',
        cancelled: 'bg-danger'
    }
    return classes[status as keyof typeof classes] || 'bg-secondary'
}

const getStatusText = (status: string) => {
    const texts = {
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        shipped: 'Đã giao hàng',
        delivered: 'Đã hoàn thành',
        cancelled: 'Đã hủy'
    }
    return texts[status as keyof typeof texts] || status
}

const getPaymentStatusClass = (paymentStatus: string) => {
    const classes = {
        pending: 'bg-warning text-dark',
        paid: 'bg-success',
        failed: 'bg-danger'
    }
    return classes[paymentStatus as keyof typeof classes] || 'bg-secondary'
}

const getPaymentStatusText = (paymentStatus: string) => {
    const texts = {
        pending: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        failed: 'Thất bại'
    }
    return texts[paymentStatus as keyof typeof texts] || paymentStatus
}

const getStatusIcon = (status: string) => {
    const icons = {
        pending: 'bi-clock-fill',
        processing: 'bi-gear-fill',
        shipped: 'bi-truck',
        delivered: 'bi-check-circle-fill',
        cancelled: 'bi-x-circle-fill'
    }
    return icons[status as keyof typeof icons] || 'bi-circle'
}

const getPaymentIcon = (paymentStatus: string) => {
    const icons = {
        pending: 'bi-hourglass-split',
        paid: 'bi-check-circle-fill',
        failed: 'bi-x-circle-fill'
    }
    return icons[paymentStatus as keyof typeof icons] || 'bi-circle'
}

const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Sorting functionality
const sortBy = (field: string) => {
    // Simple implementation - in real app you'd handle this properly
    console.log('Sorting by:', field)
    // You can implement actual sorting logic here
}

// Page jump functionality
const jumpToPage = (event: Event) => {
    const target = event.target as HTMLInputElement
    const page = parseInt(target.value)
    if (pagination.value && page >= 1 && page <= pagination.value.last_page) {
        changePage(page)
        target.value = ''
    }
}

const canUpdateStatus = (status: string) => {
    return !['delivered', 'cancelled'].includes(status)
}

const getVisiblePages = () => {
    if (!pagination.value) return []

    const current = pagination.value.current_page
    const last = pagination.value.last_page
    const pages = []

    // Show 5 pages around current page
    const start = Math.max(1, current - 2)
    const end = Math.min(last, current + 2)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
}

// Methods
const loadOrders = async (showNotification = false) => {
    try {
        loading.value = true
        error.value = null

        const params = Object.fromEntries(
            Object.entries(filters.value).filter(([_, value]) => value !== '' && value !== null)
        )

        const response = await ordersApi.getAdminOrders(params)

        // Check for new orders (only if not initial load)
        if (showNotification && orders.value.length > 0) {
            const newOrdersCount = response.total - (pagination.value?.total || 0)
            if (newOrdersCount > 0) {
                showToast(`Có ${newOrdersCount} đơn hàng mới!`, 'info')
            }
        }

        orders.value = response.data
        pagination.value = {
            current_page: response.current_page,
            last_page: response.last_page,
            per_page: response.per_page,
            total: response.total,
            from: response.from,
            to: response.to
        }

        // Calculate stats
        calculateStats()

    } catch (err: any) {
        console.error('Orders load error:', err)
        error.value = err.message || 'Đã có lỗi xảy ra khi tải danh sách đơn hàng'
    } finally {
        loading.value = false
    }
}

const calculateStats = () => {
    if (!orders.value.length) {
        stats.value = { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
        return
    }

    const statusCounts = orders.value.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    stats.value = {
        total: pagination.value?.total || orders.value.length,
        pending: statusCounts.pending || 0,
        processing: statusCounts.processing || 0,
        shipped: statusCounts.shipped || 0,
        delivered: statusCounts.delivered || 0,
        cancelled: statusCounts.cancelled || 0
    }
}

const refreshData = () => {
    filters.value.page = 1
    loadOrders()
}

const toggleFilters = () => {
    showFilters.value = !showFilters.value
}

const clearSearch = () => {
    filters.value.search = ''
    filters.value.date_from = ''
    filters.value.date_to = ''
    filters.value.page = 1
    loadOrders()
}

const applyFilters = () => {
    filters.value.page = 1
    loadOrders()
}

const clearFilters = () => {
    filters.value = {
        status: '',
        payment_status: '',
        user_id: '',
        date_from: '',
        date_to: '',
        search: '',
        min_amount: '',
        max_amount: '',
        page: 1,
        per_page: 15
    }
    loadOrders()
}

const debounceSearch = () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
    searchTimeout = window.setTimeout(() => {
        applyFilters()
    }, 500)
}

const changePage = (page: number) => {
    if (page < 1 || (pagination.value && page > pagination.value.last_page)) return
    filters.value.page = page
    loadOrders()
}

const viewOrderDetails = (order: Order) => {
    selectedOrder.value = order
    if (detailsModalInstance) {
        detailsModalInstance.show()
    }
}

const openStatusModal = (order: Order) => {
    selectedOrder.value = order
    statusForm.value = {
        status: order.status,
        payment_status: order.payment_status,
        tracking_number: '',
        notes: ''
    }

    // Close details modal if open
    if (detailsModalInstance) {
        detailsModalInstance.hide()
    }

    if (statusModalInstance) {
        statusModalInstance.show()
    }
}

const updateOrderStatus = async () => {
    if (!selectedOrder.value) return

    try {
        updating.value = true

        const updateData: {
            status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
            payment_status?: 'pending' | 'paid' | 'failed'
            tracking_number?: string
            notes?: string
        } = {}

        if (statusForm.value.status) {
            updateData.status = statusForm.value.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
        }
        if (statusForm.value.payment_status) {
            updateData.payment_status = statusForm.value.payment_status as 'pending' | 'paid' | 'failed'
        }
        if (statusForm.value.tracking_number) {
            updateData.tracking_number = statusForm.value.tracking_number
        }
        if (statusForm.value.notes) {
            updateData.notes = statusForm.value.notes
        }

        await ordersApi.updateOrderStatus(selectedOrder.value.id, updateData)

        showToast('Cập nhật trạng thái đơn hàng thành công!', 'success')

        if (statusModalInstance) {
            statusModalInstance.hide()
        }

        // Refresh data
        loadOrders()

    } catch (err: any) {
        console.error('Update status error:', err)
        showToast(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái', 'error')
    } finally {
        updating.value = false
    }
}

const quickUpdateStatus = async (order: Order, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    if (!confirm(`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ${order.order_number} thành "${getStatusText(newStatus)}"?`)) {
        return
    }

    try {
        const updateData = { status: newStatus }
        await ordersApi.updateOrderStatus(order.id, updateData)

        showToast('Cập nhật trạng thái thành công!', 'success')
        loadOrders()

    } catch (err: any) {
        console.error('Quick update status error:', err)
        showToast(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái', 'error')
    }
}

const exportOrders = () => {
    if (!orders.value.length) {
        showToast('Không có dữ liệu để xuất', 'warning')
        return
    }

    try {
        // Chuẩn bị dữ liệu để xuất
        const exportData = orders.value.map(order => ({
            'Mã đơn hàng': order.order_number,
            'Khách hàng': order.user.name,
            'Email': order.user.email,
            'Điện thoại': order.user.phone || 'N/A',
            'Tổng tiền': parseFloat(order.final_amount).toLocaleString('vi-VN') + ' ₫',
            'Trạng thái': getStatusText(order.status),
            'Thanh toán': getPaymentStatusText(order.payment_status),
            'Phương thức TT': order.payment_method.display_name,
            'Ngày tạo': formatDate(order.created_at),
            'Ghi chú': order.note || ''
        }))

        // Tạo CSV content
        const headers = Object.keys(exportData[0])
        const csvContent = [
            headers.join(','),
            ...exportData.map(row =>
                headers.map(header => `"${(row as any)[header]}"`).join(',')
            )
        ].join('\n')

        // Tạo và download file
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `don-hang-${new Date().toISOString().split('T')[0]}.csv`
        link.click()

        showToast('Xuất danh sách đơn hàng thành công!', 'success')

    } catch (err: any) {
        console.error('Export error:', err)
        showToast('Có lỗi xảy ra khi xuất dữ liệu', 'error')
    }
}

const toggleOrderSelection = (orderId: number) => {
    const index = selectedOrders.value.indexOf(orderId)
    if (index > -1) {
        selectedOrders.value.splice(index, 1)
    } else {
        selectedOrders.value.push(orderId)
    }
}

const toggleSelectAll = () => {
    if (selectedOrders.value.length === orders.value.length) {
        selectedOrders.value = []
    } else {
        selectedOrders.value = orders.value.map(order => order.id)
    }
}

const clearSelection = () => {
    selectedOrders.value = []
}

const bulkUpdateStatus = async (newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    if (selectedOrders.value.length === 0) {
        showToast('Vui lòng chọn ít nhất một đơn hàng', 'warning')
        return
    }

    const statusText = getStatusText(newStatus)
    if (!confirm(`Bạn có chắc chắn muốn cập nhật ${selectedOrders.value.length} đơn hàng thành "${statusText}"?`)) {
        return
    }

    try {
        bulkUpdating.value = true
        const updatePromises = selectedOrders.value.map(orderId =>
            ordersApi.updateOrderStatus(orderId, { status: newStatus })
        )

        await Promise.all(updatePromises)

        showToast(`Cập nhật ${selectedOrders.value.length} đơn hàng thành công!`, 'success')
        clearSelection()
        loadOrders()

    } catch (err: any) {
        console.error('Bulk update error:', err)
        showToast(err.message || 'Có lỗi xảy ra khi cập nhật hàng loạt', 'error')
    } finally {
        bulkUpdating.value = false
    }
}

const toggleAutoRefresh = () => {
    if (autoRefresh.value) {
        // Start auto refresh
        autoRefreshInterval = window.setInterval(() => {
            loadOrders(true) // Show notification for new orders
        }, 30000) // 30 seconds
        showToast('Đã bật tự động làm mới mỗi 30 giây', 'info')
    } else {
        // Stop auto refresh
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval)
            autoRefreshInterval = null
        }
        showToast('Đã tắt tự động làm mới', 'info')
    }
}

// Initialize Bootstrap Modal manually
const initModals = () => {
    // Simple modal implementation without Bootstrap import
    const showModal = (element: HTMLElement) => {
        element.style.display = 'block'
        element.classList.add('show')
        document.body.classList.add('modal-open')

        // Add backdrop
        const backdrop = document.createElement('div')
        backdrop.className = 'modal-backdrop fade show'
        backdrop.onclick = () => hideModal(element)
        document.body.appendChild(backdrop)
    }

    const hideModal = (element: HTMLElement) => {
        element.style.display = 'none'
        element.classList.remove('show')
        document.body.classList.remove('modal-open')

        // Remove backdrop
        const backdrop = document.querySelector('.modal-backdrop')
        if (backdrop) {
            backdrop.remove()
        }
    }

    if (statusModal.value) {
        statusModalInstance = {
            show: () => showModal(statusModal.value!),
            hide: () => hideModal(statusModal.value!)
        }

        // Close on X button
        const closeBtn = statusModal.value.querySelector('.btn-close')
        if (closeBtn) {
            closeBtn.addEventListener('click', () => statusModalInstance.hide())
        }
    }

    if (detailsModal.value) {
        detailsModalInstance = {
            show: () => showModal(detailsModal.value!),
            hide: () => hideModal(detailsModal.value!)
        }

        // Close on X button
        const closeBtn = detailsModal.value.querySelector('.btn-close')
        if (closeBtn) {
            closeBtn.addEventListener('click', () => detailsModalInstance.hide())
        }
    }
}

// Lifecycle
onMounted(() => {
    loadOrders()
    initModals()

    // Add keyboard shortcuts
    const handleKeypress = (e: KeyboardEvent) => {
        // Ctrl/Cmd + R: Refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault()
            refreshData()
        }
        // F: Toggle filters
        if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const target = e.target as HTMLElement
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                e.preventDefault()
                toggleFilters()
            }
        }
        // Escape: Clear selection
        if (e.key === 'Escape') {
            clearSelection()
        }
    }

    document.addEventListener('keydown', handleKeypress)

    // Cleanup function
    return () => {
        document.removeEventListener('keydown', handleKeypress)
    }
})

onUnmounted(() => {
    // Clean up auto refresh interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval)
    }
})
</script>

<style scoped>
.admin-orders-container {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.table th {
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
}

.table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.badge {
    font-size: 0.75rem;
    padding: 0.35em 0.65em;
}

.dropdown-toggle::after {
    display: none;
}

.card {
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.spinner-border-sm {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Modal styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1055;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
}

.modal.show {
    display: block !important;
}

.modal-dialog {
    position: relative;
    width: auto;
    margin: 0.5rem;
    pointer-events: none;
}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    outline: 0;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.5;
}

.modal-backdrop.fade {
    opacity: 0;
}

.modal-backdrop.show {
    opacity: 0.5;
}

/* Modern Stats Dashboard */
.stats-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    color: white;
    position: relative;
    overflow: hidden;
}

.stats-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="4"/></g></svg>');
    pointer-events: none;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    position: relative;
    z-index: 1;
}

.stat-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s ease;
}

.stat-card:hover::before {
    left: 100%;
}

.stat-card:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.25);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
}

.stat-card.pending .stat-icon {
    background: rgba(255, 193, 7, 0.3);
    color: #ffc107;
}

.stat-card.processing .stat-icon {
    background: rgba(13, 202, 240, 0.3);
    color: #0dcaf0;
}

.stat-card.shipped .stat-icon {
    background: rgba(25, 135, 84, 0.3);
    color: #198754;
}

.stat-card.delivered .stat-icon {
    background: rgba(102, 16, 242, 0.3);
    color: #6610f2;
}

.stat-card.cancelled .stat-icon {
    background: rgba(220, 53, 69, 0.3);
    color: #dc3545;
}

.stat-content {
    flex: 1;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.875rem;
    opacity: 0.9;
    font-weight: 500;
}

/* Bulk Actions Panel */
.bulk-actions-panel {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid #dee2e6;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.bulk-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #dee2e6;
}

.bulk-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #495057;
    font-weight: 600;
}

.bulk-info i {
    color: #0d6efd;
    font-size: 1.25rem;
}

.selected-count {
    color: #0d6efd;
    font-size: 1.25rem;
    font-weight: 700;
}

.status-analysis {
    margin-bottom: 1.5rem;
}

.analysis-title {
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #495057;
}

.status-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.status-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
}

.status-chip.pending {
    background: rgba(255, 193, 7, 0.1);
    border-color: #ffc107;
    color: #b8860b;
}

.status-chip.processing {
    background: rgba(13, 202, 240, 0.1);
    border-color: #0dcaf0;
    color: #0aa2c0;
}

.status-chip.shipped {
    background: rgba(25, 135, 84, 0.1);
    border-color: #198754;
    color: #146c43;
}

.status-chip.delivered {
    background: rgba(102, 16, 242, 0.1);
    border-color: #6610f2;
    color: #520dc2;
}

.status-chip.cancelled {
    background: rgba(220, 53, 69, 0.1);
    border-color: #dc3545;
    color: #b02a37;
}

.bulk-update-section {
    margin-bottom: 1rem;
}

.bulk-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #495057;
}

.bulk-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.bulk-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    font-size: 0.875rem;
}

.bulk-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.bulk-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.bulk-btn.processing {
    background: linear-gradient(135deg, #0dcaf0, #0aa2c0);
    color: white;
}

.bulk-btn.shipped {
    background: linear-gradient(135deg, #198754, #146c43);
    color: white;
}

.bulk-btn.delivered {
    background: linear-gradient(135deg, #6610f2, #520dc2);
    color: white;
}

.bulk-btn.cancelled {
    background: linear-gradient(135deg, #dc3545, #b02a37);
    color: white;
}

.bulk-update-disabled {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid #ffc107;
    border-radius: 8px;
    color: #b8860b;
    font-weight: 500;
}

/* Animations */
.bulk-slide-enter-active,
.bulk-slide-leave-active {
    transition: all 0.3s ease;
}

.bulk-slide-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.bulk-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Responsive table */
@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }

    .stat-card {
        padding: 1rem;
    }

    .stat-number {
        font-size: 1.5rem;
    }

    .bulk-buttons {
        flex-direction: column;
    }

    .table-responsive {
        font-size: 0.875rem;
    }

    .table th,
    .table td {
        padding: 0.5rem;
    }
}

/* Enhanced Table Styles */
.orders-table-container {
    animation: slideInUp 0.5s ease-out;
}

.modern-table {
    border-collapse: separate;
    border-spacing: 0;
}

.modern-table thead th {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-bottom: 2px solid #e2e8f0;
    font-weight: 600;
    color: #2d3748;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
    padding: 1rem 0.75rem;
    position: sticky;
    top: 0;
    z-index: 10;
}

.modern-table thead th.sortable {
    cursor: pointer;
    transition: all 0.2s ease;
}

.modern-table thead th.sortable:hover {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
    color: #1a202c;
}

.sort-icon {
    font-size: 0.75rem;
    opacity: 0.6;
    transition: opacity 0.2s ease;
}

.sortable:hover .sort-icon {
    opacity: 1;
}

.order-row {
    transition: all 0.3s ease;
    border-bottom: 1px solid #f1f5f9;
}

.order-row:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.order-row.high-value {
    border-left: 4px solid #f6ad55;
}

.order-row.table-warning {
    background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%);
    border-left: 4px solid #f6ad55;
}

/* Cell Styles */
.order-number-cell .order-number {
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: color 0.2s ease;
}

.order-number-cell .order-number:hover {
    color: #5a67d8 !important;
}

.order-id {
    font-size: 0.75rem;
    opacity: 0.7;
}

.customer-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.customer-avatar {
    flex-shrink: 0;
}

.customer-info {
    min-width: 0;
}

.customer-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: #2d3748;
}

.customer-email {
    font-size: 0.8rem;
    color: #718096;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.customer-phone {
    font-size: 0.75rem;
    color: #a0aec0;
}

.product-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.product-image-wrapper {
    flex-shrink: 0;
    position: relative;
}

.product-thumbnail {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    transition: all 0.2s ease;
}

.product-thumbnail:hover {
    border-color: #cbd5e0;
    transform: scale(1.1);
}

.product-placeholder {
    width: 50px;
    height: 50px;
    background: #f7fafc;
    border: 2px dashed #e2e8f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a0aec0;
    font-size: 1.2rem;
}

.product-info {
    min-width: 0;
    flex: 1;
}

.product-name {
    font-weight: 600;
    color: #2d3748;
    line-height: 1.3;
    margin-bottom: 0.25rem;
}

.product-count {
    color: #718096;
    font-size: 0.75rem;
}

.total-items {
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.25rem;
}

.amount-cell {
    text-align: right;
}

.amount-value {
    font-size: 1rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.25rem;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 0.875rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    min-width: 120px;
    justify-content: center;
}

.status-badge:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.payment-cell {
    min-width: 140px;
}

.payment-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.75rem;
    border-radius: 16px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    min-width: 100px;
    justify-content: center;
}

.payment-method {
    font-size: 0.7rem;
    margin-top: 0.5rem;
    opacity: 0.8;
}

.date-cell {
    text-align: center;
    min-width: 100px;
}

.actions-cell {
    text-align: center;
}

.action-btn {
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    transition: all 0.2s ease;
    background: white;
}

.action-btn:hover {
    border-color: #cbd5e0;
    background: #f7fafc;
    transform: translateY(-1px);
}

/* Empty State */
.empty-state {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.empty-illustration {
    padding: 2rem;
}

/* Dropdown Menu Improvements */
.dropdown-menu {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    padding: 0.5rem 0;
    min-width: 200px;
}

.dropdown-item {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    border-radius: 0;
}

.dropdown-item:hover {
    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
    transform: translateX(4px);
}

.dropdown-item i {
    width: 20px;
    text-align: center;
}

/* Loading Animation */
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 1200px) {
    .customer-phone {
        display: none;
    }

    .product-count {
        display: none;
    }
}

@media (max-width: 992px) {
    .payment-method {
        display: none;
    }

    .total-items {
        display: none;
    }
}

@media (max-width: 768px) {
    .modern-table thead th {
        padding: 0.75rem 0.5rem;
        font-size: 0.7rem;
    }

    .order-row td {
        padding: 0.75rem 0.5rem;
    }

    .customer-cell {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .product-cell {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .status-badge,
    .payment-badge {
        min-width: auto;
        padding: 0.25rem 0.5rem;
        font-size: 0.7rem;
    }
}

/* Skeleton Loading Styles */
.loading-container {
    position: relative;
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.skeleton-text {
    height: 14px;
    width: 80%;
}

.skeleton-text-sm {
    height: 12px;
    width: 60%;
}

.skeleton-text-xs {
    height: 10px;
    width: 40%;
}

.skeleton-checkbox {
    height: 16px;
    width: 16px;
    border-radius: 3px;
}

.skeleton-avatar {
    height: 40px;
    width: 40px;
    border-radius: 8px;
}

.skeleton-badge {
    height: 24px;
    width: 80px;
    border-radius: 20px;
}

.skeleton-button {
    height: 32px;
    width: 40px;
    border-radius: 6px;
}

.skeleton-row {
    opacity: 0.7;
}

.skeleton-row:nth-child(even) {
    opacity: 0.5;
}

/* Modern Loading Overlay */
.loading-overlay-modern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 12px;
}

.loading-content {
    text-align: center;
    max-width: 300px;
}

.loading-spinner {
    margin-bottom: 1.5rem;
}

.spinner-modern {
    width: 60px;
    height: 60px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin-modern 1s linear infinite;
    position: relative;
}

.spinner-modern::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid transparent;
    border-top: 2px solid #764ba2;
    border-radius: 50%;
    animation: spin-modern 2s linear infinite reverse;
}

@keyframes spin-modern {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 1rem;
    font-size: 1rem;
}

.loading-progress {
    width: 100%;
    height: 4px;
    background: #f3f4f6;
    border-radius: 2px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 2px;
    animation: progress-animation 2s ease-in-out infinite;
}

@keyframes progress-animation {
    0% {
        width: 0%;
        transform: translateX(-100%);
    }

    50% {
        width: 70%;
        transform: translateX(0%);
    }

    100% {
        width: 100%;
        transform: translateX(100%);
    }
}

/* Enhanced Modal Styles */
.modern-modal {
    border: none;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.modern-modal .modal-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 1.5rem 2rem 1rem;
}

.modal-title-section {
    flex: 1;
}

.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.modern-modal .modal-body {
    padding: 2rem;
    max-height: 70vh;
    overflow-y: auto;
}

/* Info Cards */
.info-card {
    background: white;
    border: 2px solid #f1f5f9;
    border-radius: 16px;
    padding: 0;
    height: 100%;
    transition: all 0.3s ease;
    overflow: hidden;
}

.info-card:hover {
    border-color: #e2e8f0;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.info-card-header {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.info-card-header i {
    font-size: 1.25rem;
}

.info-card-header h6 {
    color: #374151;
    font-weight: 600;
}

.info-card-body {
    padding: 1.25rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    gap: 1rem;
}

.info-item:last-child {
    margin-bottom: 0;
}

.info-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    flex-shrink: 0;
}

.info-value {
    font-size: 0.875rem;
    color: #374151;
    text-align: right;
    word-break: break-word;
}

/* Customer Info Card Specific */
.customer-avatar-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f3f4f6;
}

.customer-avatar-large {
    font-size: 3rem;
    color: #9ca3af;
    flex-shrink: 0;
}

.customer-details {
    flex: 1;
    min-width: 0;
}

.customer-name-large {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.25rem;
}

.customer-email-large {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0;
    word-break: break-word;
}

/* Financial Info Card */
.financial-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.financial-item:last-child {
    margin-bottom: 0;
}

.financial-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
}

.financial-value {
    font-size: 0.875rem;
    color: #374151;
    font-weight: 600;
}

.financial-item.total {
    padding-top: 0.75rem;
    border-top: 2px solid #e5e7eb;
    margin-top: 0.5rem;
}

.financial-divider {
    margin: 0.75rem 0;
    border-color: #e5e7eb;
}

/* Products Section */
.products-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #f3f4f6;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.section-title {
    color: #374151;
    font-weight: 700;
    margin-bottom: 0;
    display: flex;
    align-items: center;
}

.product-count-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
}

.products-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
}

.product-item-card {
    background: white;
    border: 2px solid #f1f5f9;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    gap: 1.5rem;
    transition: all 0.3s ease;
}

.product-item-card:hover {
    border-color: #e2e8f0;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.product-image-section {
    position: relative;
    flex-shrink: 0;
}

.product-image-large {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid #e5e7eb;
}

.product-placeholder-large {
    width: 100px;
    height: 100px;
    background: #f9fafb;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 2rem;
}

.quantity-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 700;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.product-details-section {
    flex: 1;
    min-width: 0;
}

.product-name-large {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

.product-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.product-sku,
.product-color {
    font-size: 0.8rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-weight: 500;
}

.product-pricing {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.unit-price,
.total-price {
    text-align: center;
    padding: 0.75rem;
    border-radius: 8px;
    background: #f9fafb;
}

.total-price {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.price-label {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.price-value {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

/* Timeline Section */
.timeline-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #f3f4f6;
}

/* Modal Footer */
.modern-modal .modal-footer {
    background: #f8fafc;
    padding: 1.5rem 2rem;
}

.footer-info {
    flex: 1;
    display: flex;
    align-items: center;
}

.footer-actions {
    display: flex;
    gap: 0.75rem;
}

/* Responsive for Modal */
@media (max-width: 768px) {
    .modern-modal .modal-body {
        padding: 1rem;
    }

    .info-card-header,
    .info-card-body {
        padding: 1rem;
    }

    .product-item-card {
        flex-direction: column;
        text-align: center;
    }

    .product-pricing {
        grid-template-columns: 1fr;
    }

    .customer-avatar-section {
        flex-direction: column;
        text-align: center;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
}

/* Enhanced Pagination Styles */
.modern-pagination {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-top: 2px solid #e2e8f0;
    padding: 1.5rem 2rem;
}

.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.pagination-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.results-summary {
    font-size: 0.875rem;
    color: #6b7280;
}

.results-text strong {
    color: #374151;
    font-weight: 600;
}

.page-size-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.page-size-label,
.page-size-text {
    color: #6b7280;
    font-weight: 500;
}

.page-size-selector .form-select {
    width: auto;
    min-width: 70px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
}

.modern-pagination-list {
    margin-bottom: 0;
    gap: 0.25rem;
}

.modern-pagination-list .page-link {
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    color: #6b7280;
    font-weight: 500;
    padding: 0.75rem 1rem;
    transition: all 0.2s ease;
    background: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 44px;
}

.modern-pagination-list .page-link:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.modern-pagination-list .page-item.active .page-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.modern-pagination-list .page-item.disabled .page-link {
    color: #d1d5db;
    background: #f9fafb;
    border-color: #f3f4f6;
    cursor: not-allowed;
}

.modern-pagination-list .page-item.disabled .page-link:hover {
    transform: none;
    box-shadow: none;
    background: #f9fafb;
    border-color: #f3f4f6;
    color: #d1d5db;
}

.page-link-first,
.page-link-last {
    font-weight: 600;
}

.page-link-number {
    font-weight: 600;
    font-size: 0.875rem;
}

.page-jump {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.page-jump-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    white-space: nowrap;
}

.page-jump-input {
    width: 80px;
    text-align: center;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-weight: 600;
    padding: 0.5rem;
}

.page-jump-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Responsive Pagination */
@media (max-width: 992px) {
    .pagination-container {
        flex-direction: column;
        gap: 1rem;
    }

    .pagination-info {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .page-jump {
        order: -1;
    }
}

@media (max-width: 768px) {
    .modern-pagination {
        padding: 1rem;
    }

    .pagination-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .modern-pagination-list .page-link {
        padding: 0.5rem 0.75rem;
        min-width: 36px;
        height: 36px;
        font-size: 0.8rem;
    }

    .page-jump {
        width: 100%;
        justify-content: center;
    }

    /* Hide some pagination items on mobile */
    .modern-pagination-list .page-item:not(.active):not(:first-child):not(:last-child):not(:nth-child(2)):not(:nth-last-child(2)) {
        display: none;
    }
}

/* Modern Form Styles for Modals */
.form-group-modern {
    margin-bottom: 1.5rem;
}

.form-label-modern {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
}

.form-label-modern i {
    color: #667eea;
    font-size: 1rem;
}

.form-select-modern,
.form-control-modern {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    background: white;
}

.form-select-modern:focus,
.form-control-modern:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
    outline: none;
}

.form-select-modern option {
    padding: 0.5rem;
}

.form-hint {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 0.5rem;
    font-style: italic;
}

.btn-modern {
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

.btn-modern:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-modern.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
}

.btn-modern.btn-primary:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b4190 100%);
    border-color: #5a67d8;
}

.btn-modern.btn-outline-secondary {
    background: white;
    border-color: #e5e7eb;
    color: #6b7280;
}

.btn-modern.btn-outline-secondary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
}

/* Additional UI Improvements */
.table-warning {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%) !important;
    border-left: 4px solid #ffc107 !important;
}

.high-value {
    position: relative;
}

.high-value::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-radius: 0 4px 4px 0;
}

/* Enhanced animations for better UX */
@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.order-row {
    animation: fadeInScale 0.3s ease-out;
}

.stat-card {
    animation: fadeInScale 0.4s ease-out;
}

.stat-card:nth-child(2) {
    animation-delay: 0.1s;
}

.stat-card:nth-child(3) {
    animation-delay: 0.2s;
}

.stat-card:nth-child(4) {
    animation-delay: 0.3s;
}

.stat-card:nth-child(5) {
    animation-delay: 0.4s;
}

.stat-card:nth-child(6) {
    animation-delay: 0.5s;
}
</style>
