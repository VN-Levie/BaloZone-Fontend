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
      },
      {
        "id": 96,
        "name": "Túi Laptop Herschel molestias",
        "total_sold": "5"
      },
      {
        "id": 139,
        "name": "Túi Adidas Classic facilis",
        "total_sold": "5"
      },
      {
        "id": 141,
        "name": "Túi Laptop Herschel id",
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
        "price": "1637840.00",
        "total_sold": "7",
        "total_revenue": "11464880.00"
      },
      {
        "id": 39,
        "name": "Balo Thể Thao Nike Air explicabo",
        "price": "1506844.00",
        "total_sold": "6",
        "total_revenue": "9041064.00"
      },
      {
        "id": 96,
        "name": "Túi Laptop Herschel molestias",
        "price": "1542403.00",
        "total_sold": "5",
        "total_revenue": "7712015.00"
      },
      {
        "id": 139,
        "name": "Túi Adidas Classic facilis",
        "price": "356408.00",
        "total_sold": "5",
        "total_revenue": "1782040.00"
      },
      {
        "id": 162,
        "name": "Balo Leo Núi The North Face molestias",
        "price": "701427.00",
        "total_sold": "5",
        "total_revenue": "3507135.00"
      },
      {
        "id": 141,
        "name": "Túi Laptop Herschel id",
        "price": "1653569.00",
        "total_sold": "5",
        "total_revenue": "8267845.00"
      },
      {
        "id": 159,
        "name": "Balo Mini Cute vel",
        "price": "1737141.00",
        "total_sold": "4",
        "total_revenue": "6948564.00"
      },
      {
        "id": 38,
        "name": "Balo Nike Sportswear sunt",
        "price": "381443.00",
        "total_sold": "3",
        "total_revenue": "1144329.00"
      },
      {
        "id": 59,
        "name": "Túi Xách Nữ Thời Trang ipsa",
        "price": "1691220.00",
        "total_sold": "3",
        "total_revenue": "5073660.00"
      },
      {
        "id": 45,
        "name": "Balo Du Lịch Samsonite quisquam",
        "price": "928337.00",
        "total_sold": "3",
        "total_revenue": "2785011.00"
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
      },
      {
        "id": 138,
        "name": "Balo Du Lịch Samsonite veritatis",
        "stock": 2,
        "price": "1717207.00"
      },
      {
        "id": 158,
        "name": "Balo Mini Cute libero",
        "stock": 2,
        "price": "317434.00"
      },
      {
        "id": 185,
        "name": "Balo Học Sinh JanSport quasi",
        "stock": 2,
        "price": "540286.00"
      },
      {
        "id": 121,
        "name": "Balo Nike Sportswear doloremque",
        "stock": 2,
        "price": "978781.00"
      },
      {
        "id": 9,
        "name": "Balo Gaming RGB aut",
        "stock": 3,
        "price": "1983284.00"
      },
      {
        "id": 182,
        "name": "Balo Leo Núi The North Face quas",
        "stock": 3,
        "price": "242368.00"
      },
      {
        "id": 129,
        "name": "Túi Xách Nữ Thời Trang quia",
        "stock": 4,
        "price": "1767003.00"
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
      },
      {
        "id": 173,
        "name": "Balo Nike Sportswear neque",
        "stock": 0,
        "price": "1497437.00"
      },
      {
        "id": 175,
        "name": "Balo Mini Cute velit",
        "stock": 0,
        "price": "473145.00"
      },
      {
        "id": 176,
        "name": "Balo Du Lịch Samsonite aspernatur",
        "stock": 0,
        "price": "969064.00"
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
      },
      {
        "category_name": "Balo Học Sinh",
        "product_count": 35
      },
      {
        "category_name": "Túi Xách",
        "product_count": 29
      },
      {
        "category_name": "Balo Mini",
        "product_count": 18
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
      },
      {
        "brand_name": "Abernathy-Rutherford",
        "product_count": 16
      },
      {
        "brand_name": "Torphy, Homenick and Walsh",
        "product_count": 14
      },
      {
        "brand_name": "Adidas",
        "product_count": 14
      },
      {
        "brand_name": "Lowe-O'Keefe",
        "product_count": 14
      },
      {
        "brand_name": "JanSport",
        "product_count": 13
      },
      {
        "brand_name": "Nike",
        "product_count": 11
      },
      {
        "brand_name": "Sanford, Harber and Kihn",
        "product_count": 11
      },
      {
        "brand_name": "Runolfsdottir Inc",
        "product_count": 11
      },
      {
        "brand_name": "Wolff-Walker",
        "product_count": 11
      },
      {
        "brand_name": "Doyle-Gutmann",
        "product_count": 11
      },
      {
        "brand_name": "Renner, Howell and Cremin",
        "product_count": 10
      },
      {
        "brand_name": "The North Face",
        "product_count": 9
      },
      {
        "brand_name": "Koch-Torp",
        "product_count": 9
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
- Biểu đồ revenue và order chart hiển thị dữ liệu 7 ngày gần nhất (từ 2025-06-28 đến 2025-07-04)
- Top selling products được sắp xếp theo số lượng bán ra, bao gồm cả thông tin price và total_revenue
- Low stock products là những sản phẩm có stock <= 10
- Out of stock products là những sản phẩm có stock <= 0
