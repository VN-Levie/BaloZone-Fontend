# BaloZone-Backend API Documentation

Đây là tài liệu tổng hợp các API của hệ thống BaloZone.

This document provides a comprehensive overview of the BaloZone-Backend API endpoints.

## 📋 Mục lục (Table of Contents)

### 🔐 Authentication & User Management
- [1. Xác thực (Authentication)](./01-auth.md)
- [7. Quản lý người dùng (User Management)](./07-user-management.md)
- [8. Sổ địa chỉ (Address Book)](./08-address-book.md)
- [13. Quản lý vai trò (Admin Roles)](./13-admin-roles.md)
- [15. Quản lý người dùng (Admin Users)](./15-admin-users.md)
- [19. Dashboard Admin (Admin Dashboard)](./19-admin-dashboard.md)

### 🛍️ Product Catalog
- [2. Thương hiệu (Brands)](./02-brands.md)
- [3. Danh mục (Categories)](./03-categories.md)
- [4. Sản phẩm (Products)](./04-products.md)

### 🛒 E-commerce Features
- [5. Phiếu giảm giá (Vouchers)](./05-vouchers.md)
- [9. Đơn hàng (Orders)](./09-orders.md)
- [12. Chiến dịch khuyến mãi (Sale Campaigns)](./12-sale-campaigns.md)
- [14. Quản lý đơn hàng (Admin Orders)](./14-admin-orders.md)
- [17. Phương thức thanh toán (Payment Methods)](./17-payment-methods.md)

### 💬 Content & Communication
- [6. Bình luận (Comments)](./06-comments.md)
- [10. Tin tức (News)](./10-news.md)
- [11. Liên hệ (Contact)](./11-contact.md)
- [16. Quản lý liên hệ (Admin Contact)](./16-admin-contact.md)

### 📖 Documentation
- [18. Tóm tắt API (Summary)](./18-summary.md)

## 🚀 Quick Start

### Base URL
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

### Authentication
Hầu hết các endpoint yêu cầu JWT token trong header:
```
Authorization: Bearer your_jwt_token
```

### Content-Type
Tất cả requests sử dụng JSON:
```
Content-Type: application/json
```

## 📊 API Statistics

- **Tổng số modules:** 17 modules
- **Tổng số endpoints:** 105+ endpoints
- **Public endpoints:** ~40 endpoints (không cần authentication)
- **Protected endpoints:** ~65 endpoints (cần authentication)
- **Admin-only endpoints:** ~20 endpoints (cần quyền admin)

## 🔗 Related Files

- **Route Definitions:** `/routes/api.php`
- **Controllers:** `/app/Http/Controllers/`
- **Models:** `/app/Models/`
- **Requests:** `/app/Http/Requests/`

## 📝 Documentation Standards

Mỗi endpoint được documented với:
- **Endpoint URL** và HTTP method
- **Mô tả** chức năng
- **Phân quyền** (nếu có)
- **Parameters** (URL params, Query params, Body)
- **Request example** (nếu có body)
- **Response examples** (success và error cases)
- **Validation rules** (nếu có)

## 🔧 Maintenance

Khi thêm/sửa endpoint:
1. Cập nhật file markdown tương ứng
2. Đảm bảo examples phản ánh đúng implementation
3. Cập nhật mục lục này nếu cần

---

**Last Updated:** July 4, 2025
**Version:** 1.0.0
