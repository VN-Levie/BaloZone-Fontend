# 18. Tóm tắt API

## Thống kê tổng quan

### GET /api/summary

**Mô tả**: Lấy thống kê tổng quan của hệ thống

**Phương thức**: GET

**URL**: `/api/summary`

**Phân quyền**: Không yêu cầu authentication

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "products": {
      "total": 150,
      "featured": 10,
      "on_sale": 25,
      "categories": 8,
      "brands": 12
    },
    "orders": {
      "total": 95,
      "pending": 15,
      "processing": 25,
      "shipped": 20,
      "delivered": 30,
      "cancelled": 5
    },
    "users": {
      "total": 145,
      "active": 120,
      "new_this_month": 45
    },
    "revenue": {
      "total": 125000000,
      "this_month": 15000000,
      "this_week": 3500000,
      "today": 850000
    },
    "contacts": {
      "total": 45,
      "pending": 12,
      "resolved": 25
    },
    "sale_campaigns": {
      "active": 3,
      "total": 8,
      "products_on_sale": 25
    }
  },
  "message": "Lấy thống kê tổng quan thành công"
}
```

## Cấu trúc response chung

Tất cả các API response đều tuân theo cấu trúc chung:

```json
{
  "success": true,
  "data": {},
  "message": "Thông điệp mô tả kết quả"
}
```

**Với pagination**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [],
    "first_page_url": "string",
    "from": 1,
    "last_page": 10,
    "last_page_url": "string",
    "next_page_url": "string",
    "path": "string",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 100
  },
  "message": "string"
}
```

## Mã lỗi HTTP

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Thành công |
| 201 | Created | Tạo mới thành công |
| 400 | Bad Request | Yêu cầu không hợp lệ |
| 401 | Unauthorized | Chưa xác thực |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Không tìm thấy |
| 422 | Unprocessable Entity | Dữ liệu không hợp lệ |
| 500 | Internal Server Error | Lỗi server |

## Cấu trúc lỗi

```json
{
  "success": false,
  "message": "Thông điệp lỗi chính",
  "errors": {
    "field_name": [
      "Thông điệp lỗi chi tiết"
    ]
  }
}
```

## Headers yêu cầu

### Authentication
```
Authorization: Bearer {token}
```

### Content-Type
```
Content-Type: application/json
```

### Accept
```
Accept: application/json
```

## Quy tắc đặt tên endpoint

- Sử dụng danh từ số nhiều: `/api/products`, `/api/orders`
- Sử dụng kebab-case: `/api/sale-campaigns`, `/api/order-stats`
- Endpoint admin có prefix `/admin/`: `/api/admin/users`
- Endpoint nested: `/api/products/{id}/comments`

## Phân quyền

### Public endpoints (không cần auth)
- Authentication: login, register, forgot-password, reset-password
- Products: tất cả các endpoint products
- Brands, Categories: tất cả endpoints
- News: tất cả endpoints
- Contact: contact-info, gửi liên hệ
- Sale campaigns: tất cả endpoints public
- Payment methods: danh sách phương thức

### User endpoints (cần auth)
- User management: profile, change-password, upload-avatar
- Address book: tất cả endpoints
- Orders: tất cả endpoints của user
- Vouchers: tất cả endpoints
- Comments: thêm, sửa, xóa
- Payment: tạo thanh toán, check status

### Admin endpoints (cần auth + role admin)
- Admin dashboard: thống kê tổng quan, doanh thu, phân tích users/products
- Admin orders: quản lý đơn hàng
- Admin users: quản lý người dùng
- Admin contacts: quản lý liên hệ
- Admin roles: quản lý vai trò
- Sale campaigns: quản lý sản phẩm trong campaign

## Rate limiting

- 60 requests/minute cho user thông thường
- 100 requests/minute cho admin
- 5 requests/minute cho endpoints authentication (login, register)

## Versioning

API hiện tại sử dụng version 1.0, tất cả endpoints có prefix `/api/`

Trong tương lai có thể có versioning: `/api/v2/`

## Lưu ý quan trọng

1. **Timezone**: Tất cả datetime đều sử dụng UTC
2. **Currency**: Tất cả giá tiền đều tính bằng VND
3. **Language**: Tất cả message đều bằng tiếng Việt
4. **Image URLs**: Tất cả image URLs đều là absolute URLs
5. **Pagination**: Mặc định 10 items/page, tối đa 100 items/page
6. **Search**: Tất cả search đều không phân biệt hoa thường
7. **Soft Delete**: Hầu hết các entity đều sử dụng soft delete
