# 19. Dashboard Statistics (Admin Dashboard)

## Lấy thống kê tổng quan dashboard

### GET /api/admin/dashboard/stats

**Mô tả**: Lấy thống kê tổng quan cho admin dashboard

**Phương thức**: GET

**URL**: `/api/admin/dashboard/stats`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Lấy thống kê dashboard thành công",
  "data": {
    "overview": {
      "total_users": 23,
      "total_orders": 32,
      "total_products": 205,
      "total_contacts": 24,
      "total_revenue": "168791109.80",
      "monthly_revenue": "168791109.80",
      "new_users_this_month": 23,
      "orders_this_month": 32
    },
    "order_stats": {
      "shipped": 8,
      "delivered": 2,
      "pending": 9,
      "processing": 9,
      "cancelled": 4
    },
    "contact_stats": {
      "resolved": 13,
      "pending": 11
    },
    "top_products": [
      {
        "id": 52,
        "name": "Balo Mini Cute vel",
        "total_sold": "7"
      },
      {
        "id": 39,
        "name": "Balo Thể Thao Nike Air explicabo",
        "total_sold": "6"
      }
    ],
    "revenue_chart": [
      {
        "date": "2025-06-27",
        "revenue": 0
      },
      {
        "date": "2025-07-03",
        "revenue": "168791109.80"
      }
    ],
    "order_chart": [
      {
        "date": "2025-06-27",
        "orders": 0
      },
      {
        "date": "2025-07-03",
        "orders": 32
      }
    ]
  }
}
```

**Response lỗi (401)**:

```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn",
  "data": null
}
```

**Response lỗi (403)**:

```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập",
  "data": null
}
```

## Lấy báo cáo doanh thu theo tháng

### GET /api/admin/dashboard/revenue

**Mô tả**: Lấy báo cáo doanh thu theo từng tháng trong năm

**Phương thức**: GET

**URL**: `/api/admin/dashboard/revenue`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `year` (integer, optional): Năm cần báo cáo (mặc định: năm hiện tại)

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Lấy báo cáo doanh thu theo tháng thành công",
  "data": {
    "year": 2025,
    "monthly_data": [
      {
        "month": 1,
        "month_name": "Jan 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 7,
        "month_name": "Jul 2025",
        "revenue": "168791109.80",
        "order_count": 32
      }
    ]
  }
}
```

## Lấy phân tích người dùng

### GET /api/admin/dashboard/users

**Mô tả**: Lấy phân tích chi tiết về người dùng

**Phương thức**: GET

**URL**: `/api/admin/dashboard/users`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `year` (integer, optional): Năm cần phân tích (mặc định: năm hiện tại)

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Lấy phân tích người dùng thành công",
  "data": {
    "year": 2025,
    "users_by_month": [
      {
        "month": 1,
        "month_name": "Jan 2025",
        "new_users": 0
      },
      {
        "month": 7,
        "month_name": "Jul 2025",
        "new_users": 23
      }
    ],
    "users_by_role": {
      "admin": 1,
      "user": 21,
      "contributor": 1
    },
    "users_by_status": {
      "active": 22,
      "inactive": 1
    }
  }
}
```

## Lấy phân tích sản phẩm

### GET /api/admin/dashboard/products

**Mô tả**: Lấy phân tích chi tiết về sản phẩm và inventory

**Phương thức**: GET

**URL**: `/api/admin/dashboard/products`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Lấy phân tích sản phẩm thành công",
  "data": {
    "top_selling_products": [
      {
        "id": 52,
        "name": "Balo Mini Cute vel",
        "price": "500000.00",
        "total_sold": "7",
        "total_revenue": "3500000.00"
      }
    ],
    "low_stock_products": [
      {
        "id": 10,
        "name": "Balo hết hàng",
        "stock": 5,
        "price": "300000.00"
      }
    ],
    "out_of_stock_products": [
      {
        "id": 15,
        "name": "Sản phẩm hết hàng",
        "stock": 0,
        "price": "250000.00"
      }
    ],
    "products_by_category": [
      {
        "category_name": "Balo Du Lịch",
        "product_count": 43
      },
      {
        "category_name": "Balo Laptop",
        "product_count": 40
      }
    ],
    "products_by_brand": [
      {
        "brand_name": "Nike",
        "product_count": 35
      },
      {
        "brand_name": "Adidas",
        "product_count": 30
      }
    ]
  }
}
```

**Response lỗi (500)**:

```json
{
  "success": false,
  "message": "Có lỗi xảy ra khi lấy phân tích sản phẩm: [error details]",
  "data": null
}
```

## Ghi chú

- Tất cả endpoints đều yêu cầu JWT token hợp lệ và vai trò Admin
- Dữ liệu thống kê được tính toán real-time từ database
- Biểu đồ revenue và order chart hiển thị dữ liệu 7 ngày gần nhất
- Top selling products được sắp xếp theo số lượng bán ra
- Low stock products là những sản phẩm có stock <= 10
- Out of stock products là những sản phẩm có stock <= 0
