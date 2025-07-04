# BaloZone-Backend API Documentation

Đây là tài liệu tổng hợp các API của hệ thống BaloZone.

This document provides a comprehensive overview of the BaloZone-Backend API endpoints.

## 📋 Mục lục (Table of Contents)

### 🔐 Authentication & User Management
- [1. Xác thực (Authentication)](./publicAndUser/01-auth.md)
- [7. Quản lý người dùng (User Management)](./admin/07-user-management.md)
- [8. Sổ địa chỉ (Address Book)](./publicAndUser/08-address-book.md)
- [13. Quản lý vai trò (Admin Roles)](./admin/13-admin-roles.md)
- [15. Quản lý người dùng (Admin Users)](./admin/15-admin-users.md)
- [19. Dashboard Admin (Admin Dashboard)](./admin/19-admin-dashboard.md)

### 🛍️ Product Catalog
- [2. Thương hiệu (Brands)](./publicAndUser/02-brands.md)
- [3. Danh mục (Categories)](./publicAndUser/03-categories.md)
- [4. Sản phẩm (Products)](./publicAndUser/04-products.md)
- [14. Quản lý sản phẩm (Admin Products)](./admin/14-admin-products.md)
- [20. Quản lý thương hiệu (Admin Brands)](./admin/20-admin-brands.md)
- [21. Quản lý danh mục (Admin Categories)](./admin/21-admin-categories.md)

### 🛒 E-commerce Features
- [5. Phiếu giảm giá (Vouchers)](./publicAndUser/05-vouchers.md)
- [9. Đơn hàng (Orders)](./publicAndUser/09-orders.md)
- [12. Chiến dịch khuyến mãi (Sale Campaigns)](./publicAndUser/12-sale-campaigns.md)
- [17. Phương thức thanh toán (Payment Methods)](./publicAndUser/17-payment-methods.md)
- [22. Quản lý voucher (Admin Vouchers)](./admin/22-admin-vouchers.md)
- [24. Quản lý chiến dịch khuyến mãi (Admin Sale Campaigns)](./admin/24-admin-sale-campaigns.md)
- [25. Quản lý phương thức thanh toán (Admin Payment Methods)](./admin/25-admin-payment-methods.md)
- [26. Quản lý đơn hàng (Admin Orders)](./admin/26-admin-orders.md)

### 💬 Content & Communication
- [6. Bình luận (Comments)](./publicAndUser/06-comments.md)
- [10. Tin tức (News)](./publicAndUser/10-news.md)
- [11. Liên hệ (Contact)](./publicAndUser/11-contact.md)
- [16. Quản lý liên hệ (Admin Contact)](./admin/16-admin-contact.md)
- [23. Quản lý tin tức (Admin News)](./admin/23-admin-news.md)

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

- **Tổng số modules:** 20 modules
- **Tổng số endpoints:** 135+ endpoints  
- **Public endpoints:** ~40 endpoints (không cần authentication)
- **Protected endpoints:** ~95 endpoints (cần authentication)
- **Admin-only endpoints:** ~35 endpoints (cần quyền admin)

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

## 🔑 Phân quyền Endpoint (Endpoint Authorization)

### Tất cả endpoints sử dụng prefix `/api/dashboard/*`

| Module | Admin-only | Contributor Access | Description |
|--------|------------|-------------------|-------------|
| **Users Management** | `/api/dashboard/users/*` | ❌ | Chỉ admin mới có quyền quản lý người dùng |
| **Dashboard Analytics** | `/api/dashboard/stats`, `/api/dashboard/revenue`, `/api/dashboard/user-analytics`, `/api/dashboard/product-analytics` | ❌ | Chỉ admin mới có quyền xem thống kê |
| **Roles Management** | `/api/dashboard/roles/*` | ❌ | Chỉ admin mới có quyền quản lý vai trò |
| **Products** | `/api/dashboard/products/*` | ✅ | Admin + Contributor có thể quản lý |
| **Brands** | `/api/dashboard/brands/*` | ✅ | Admin + Contributor có thể quản lý |
| **Categories** | `/api/dashboard/categories/*` | ✅ | Admin + Contributor có thể quản lý |
| **Contacts** | `/api/dashboard/contacts/*` | ✅ | Admin + Contributor có thể quản lý |
| **Orders** | `/api/dashboard/orders/*` | ✅ | Admin + Contributor có thể quản lý |
| **News** | `/api/dashboard/news/*` | ✅ | Admin + Contributor có thể quản lý |
| **Vouchers** | `/api/dashboard/vouchers/*` | ✅ | Admin + Contributor có thể quản lý |
| **Sale Campaigns** | `/api/dashboard/sale-campaigns/*` | ✅ | Admin + Contributor có thể quản lý |
| **Payment Methods** | `/api/dashboard/payment-methods/*` | ✅ | Admin + Contributor có thể quản lý |

### Authorization Headers

**Admin Role**: Có quyền truy cập tất cả endpoint `/api/dashboard/*` (bao gồm cả admin-only và contributor endpoints)

```bash
Authorization: Bearer {admin_jwt_token}
```

**Contributor Role**: Chỉ có quyền truy cập một số endpoint `/api/dashboard/*` (không bao gồm users, roles, analytics)

```bash
Authorization: Bearer {contributor_jwt_token}
```

---

**Last Updated:** July 4, 2025
**Version:** 1.0.0
