# 19. Dashboard Statistics (Admin Dashboard)

> **Lưu ý**: Các endpoint dashboard analytics sử dụng `/api/dashboard/*` nhưng chỉ dành cho Admin (role: admin).  
> Contributor không có quyền truy cập vào các endpoint thống kê này.

## Lấy thống kê tổng quan dashboard

### GET /api/dashboard/stats

**Mô tả**: Lấy thống kê tổng quan cho admin dashboard

**Phương thức**: GET

**URL**: `/api/dashboard/stats`

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
      },
      {
        "id": 54,
        "name": "Balo Nike Sportswear voluptas",
        "total_sold": "6"
      },
      {
        "id": 146,
        "name": "Túi Xách Nữ Thời Trang nisi",
        "total_sold": "6"
      },
      {
        "id": 139,
        "name": "Túi Adidas Classic facilis",
        "total_sold": "5"
      }
    ],
    "revenue_chart": [
      {
        "date": "2025-06-28",
        "revenue": 0
      },
      {
        "date": "2025-06-29",
        "revenue": 0
      },
      {
        "date": "2025-06-30",
        "revenue": 0
      },
      {
        "date": "2025-07-01",
        "revenue": 0
      },
      {
        "date": "2025-07-02",
        "revenue": 0
      },
      {
        "date": "2025-07-03",
        "revenue": "168791109.80"
      },
      {
        "date": "2025-07-04",
        "revenue": 0
      }
    ],
    "order_chart": [
      {
        "date": "2025-06-28",
        "orders": 0
      },
      {
        "date": "2025-06-29",
        "orders": 0
      },
      {
        "date": "2025-06-30",
        "orders": 0
      },
      {
        "date": "2025-07-01",
        "orders": 0
      },
      {
        "date": "2025-07-02",
        "orders": 0
      },
      {
        "date": "2025-07-03",
        "orders": 32
      },
      {
        "date": "2025-07-04",
        "orders": 0
      }
    ]
  }
}
```

**Response lỗi (401)**:

```json
{
  "success": false,
  "message": "Token không được cung cấp",
  "data": null
}
```

**Response lỗi (401) - Token không hợp lệ**:

```json
{
  "success": false,
  "message": "Token không hợp lệ",
  "data": null
}
```

**Response lỗi (403)**:

```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions",
  "data": null
}
```

## Lấy báo cáo doanh thu theo tháng

### GET /api/dashboard/revenue

**Mô tả**: Lấy báo cáo doanh thu theo từng tháng trong năm

**Phương thức**: GET

**URL**: `/api/dashboard/revenue`

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
    "year": "2025",
    "monthly_data": [
      {
        "month": 1,
        "month_name": "Jan 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 2,
        "month_name": "Feb 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 3,
        "month_name": "Mar 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 4,
        "month_name": "Apr 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 5,
        "month_name": "May 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 6,
        "month_name": "Jun 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 7,
        "month_name": "Jul 2025",
        "revenue": "168791109.80",
        "order_count": 32
      },
      {
        "month": 8,
        "month_name": "Aug 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 9,
        "month_name": "Sep 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 10,
        "month_name": "Oct 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 11,
        "month_name": "Nov 2025",
        "revenue": 0,
        "order_count": 0
      },
      {
        "month": 12,
        "month_name": "Dec 2025",
        "revenue": 0,
        "order_count": 0
      }
    ]
  }
}
```

## Lấy phân tích người dùng

### GET /api/dashboard/users

**Mô tả**: Lấy phân tích chi tiết về người dùng

**Phương thức**: GET

**URL**: `/api/dashboard/users`

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
    "year": "2025",
    "users_by_month": [
      {
        "month": 1,
        "month_name": "Jan 2025",
        "new_users": 0
      },
      {
        "month": 2,
        "month_name": "Feb 2025",
        "new_users": 0
      },
      {
        "month": 3,
        "month_name": "Mar 2025",
        "new_users": 0
      },
      {
        "month": 4,
        "month_name": "Apr 2025",
        "new_users": 0
      },
      {
        "month": 5,
        "month_name": "May 2025",
        "new_users": 0
      },
      {
        "month": 6,
        "month_name": "Jun 2025",
        "new_users": 0
      },
      {
        "month": 7,
        "month_name": "Jul 2025",
        "new_users": 23
      },
      {
        "month": 8,
        "month_name": "Aug 2025",
        "new_users": 0
      },
      {
        "month": 9,
        "month_name": "Sep 2025",
        "new_users": 0
      },
      {
        "month": 10,
        "month_name": "Oct 2025",
        "new_users": 0
      },
      {
        "month": 11,
        "month_name": "Nov 2025",
        "new_users": 0
      },
      {
        "month": 12,
        "month_name": "Dec 2025",
        "new_users": 0
      }
    ],
    "users_by_role": {
      "admin": 1,
      "user": 21,
      "contributor": 1
    },
    "users_by_status": {
      "active": 23
    }
  }
}
```

## Lấy phân tích sản phẩm

### GET /api/dashboard/products

**Mô tả**: Lấy phân tích chi tiết về sản phẩm và inventory

**Phương thức**: GET

**URL**: `/api/dashboard/products`

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
        "price": "1637840.00",
        "total_sold": "7",
        "total_revenue": "11464880.00"
      },
      {
        "id": 146,
        "name": "Túi Xách Nữ Thời Trang nisi",
        "price": "595355.00",
        "total_sold": "6",
        "total_revenue": "3572130.00"
      },
      {
        "id": 54,
        "name": "Balo Nike Sportswear voluptas",
        "price": "405163.00",
        "total_sold": "6",
        "total_revenue": "2430978.00"
      }
    ],
    "low_stock_products": [
      {
        "id": 54,
        "name": "Balo Nike Sportswear voluptas",
        "stock": 1,
        "price": "405163.00"
      },
      {
        "id": 192,
        "name": "Balo Học Sinh JanSport qui",
        "stock": 1,
        "price": "485611.00"
      },
      {
        "id": 104,
        "name": "Balo Thể Thao Nike Air incidunt",
        "stock": 1,
        "price": "740609.00"
      }
    ],
    "out_of_stock_products": [
      {
        "id": 6,
        "name": "Balo Thể Thao Nike Air in",
        "stock": 0,
        "price": "1450935.00"
      },
      {
        "id": 68,
        "name": "Balo Leo Núi The North Face non",
        "stock": 0,
        "price": "383061.00"
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
      },
      {
        "category_name": "Balo Thể Thao",
        "product_count": 40
      }
    ],
    "products_by_brand": [
      {
        "brand_name": "Swaniawski and Sons",
        "product_count": 18
      },
      {
        "brand_name": "Samsonite",
        "product_count": 17
      },
      {
        "brand_name": "Herschel",
        "product_count": 16
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

## Ví dụ Curl Commands

### 1. Đăng nhập để lấy token admin

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@balozone.com",
    "password": "admin123"
  }'
```

### 2. Lấy thống kê dashboard

```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 3. Lấy báo cáo doanh thu theo tháng

```bash
curl -X GET "http://localhost:8000/api/dashboard/revenue?year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 4. Lấy phân tích người dùng

```bash
curl -X GET "http://localhost:8000/api/dashboard/users?year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 5. Lấy phân tích sản phẩm

```bash
curl -X GET "http://localhost:8000/api/dashboard/products" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```
