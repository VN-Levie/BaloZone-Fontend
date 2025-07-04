# 14. Quản lý sản phẩm (Admin Products)

> **Lưu ý**: Các endpoint quản lý sản phẩm sử dụng prefix `/api/dashboard/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý sản phẩm

## Tạo sản phẩm mới (Admin)

### POST /api/dashboard/products

**Mô tả**: Tạo sản phẩm mới

**Phương thức**: POST

**URL**: `/api/dashboard/products`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body** (Form Data):

- `category_id` (integer, required): ID danh mục sản phẩm
- `brand_id` (integer, optional): ID thương hiệu
- `name` (string, required): Tên sản phẩm
- `description` (string, optional): Mô tả sản phẩm
- `price` (number, required): Giá gốc
- `discount_price` (number, optional): Giá khuyến mại (nhỏ hơn giá gốc)
- `stock` (integer, required): Số lượng trong kho
- `image` (file, optional): File ảnh chính sản phẩm (jpeg, png, jpg, gif, svg, max: 2MB)
- `gallery[]` (files, optional): Mảng files ảnh gallery (jpeg, png, jpg, gif, svg, max: 2MB/file)
- `color` (string, optional): Màu sắc sản phẩm
- `slug` (string, required): Slug URL-friendly

**Ví dụ Form Data**:

```
category_id: 1
brand_id: 2
name: Balo Nike Air Max Premium
description: Balo thể thao cao cấp với thiết kế hiện đại, chất liệu bền bỉ
price: 1200000
discount_price: 1000000
stock: 50
image: [FILE] product-main.jpg
gallery[]: [FILE] gallery1.jpg
gallery[]: [FILE] gallery2.jpg
color: Đen
slug: balo-nike-air-max-premium
```

**Response thành công (201)**:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Balo Nike Air Max Premium",
    "slug": "balo-nike-air-max-premium",
    "description": "Balo thể thao cao cấp với thiết kế hiện đại, chất liệu bền bỉ",
    "price": 1200000,
    "discount_price": 1000000,
    "image": "products/images/product-main-12345.jpg",
    "gallery": [
      "products/gallery/gallery1-67890.jpg",
      "products/gallery/gallery2-54321.jpg"
    ],
    "stock": 50,
    "color": "Đen",
    "brand": {
      "id": 2,
      "name": "Nike",
      "slug": "nike"
    },
    "category": {
      "id": 1,
      "name": "Balo Thể Thao",
      "slug": "balo-the-thao"
    },
    "created_at": "2025-07-04T12:00:00.000000Z",
    "updated_at": "2025-07-04T12:00:00.000000Z"
  }
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "name": ["The name field is required."],
    "price": ["The price must be a number."],
    "category_id": ["The selected category id is invalid."]
  }
}
```

**Validation rules**:

- `category_id` (integer, required): ID danh mục sản phẩm, phải tồn tại trong bảng categories
- `brand_id` (integer, optional): ID thương hiệu, phải tồn tại trong bảng brands
- `name` (string, required, max:255): Tên sản phẩm
- `description` (string, optional): Mô tả sản phẩm
- `price` (number, required, min:0): Giá gốc sản phẩm
- `discount_price` (number, optional, min:0): Giá khuyến mại, phải nhỏ hơn giá gốc
- `stock` (integer, required, min:0): Số lượng trong kho
- `image` (file, optional): File ảnh chính (jpeg, png, jpg, gif, svg, max: 2MB)
- `gallery` (files array, optional): Mảng files ảnh gallery (jpeg, png, jpg, gif, svg, max: 2MB/file)
- `color` (string, optional, max:100): Màu sắc sản phẩm
- `slug` (string, required, max:255, unique): Slug URL-friendly, chỉ chứa chữ cái thường, số và dấu gạch ngang
- `brand_id` (integer, optional): ID thương hiệu
- `name` (string, required, max:255): Tên sản phẩm
- `description` (string, optional): Mô tả sản phẩm
- `price` (numeric, required, min:0): Giá sản phẩm
- `discount_price` (numeric, optional, min:0): Giá khuyến mãi (phải nhỏ hơn giá gốc)
- `stock` (integer, required, min:0): Số lượng tồn kho
- `image` (string, optional, max:255): Ảnh chính sản phẩm
- `gallery` (array, optional): Mảng ảnh phụ
- `color` (string, optional, max:50): Màu sắc sản phẩm

---

## Cập nhật sản phẩm (Admin)

### PUT /api/dashboard/products/{product}

**Mô tả**: Cập nhật thông tin sản phẩm

**Phương thức**: PUT

**URL**: `/api/dashboard/products/{product}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `product` (integer, required): ID sản phẩm

**Body**:

```json
{
  "category_id": 1,
  "brand_id": 2,
  "name": "Balo Nike Air Max Premium Updated",
  "description": "Mô tả đã được cập nhật",
  "price": 1300000,
  "discount_price": 1100000,
  "stock": 45,
  "image": "https://example.com/product-updated.jpg",
  "gallery": [
    "https://example.com/gallery1-updated.jpg",
    "https://example.com/gallery2-updated.jpg",
    "https://example.com/gallery3-new.jpg"
  ],
  "color": "Xanh Navy"
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Balo Nike Air Max Premium Updated",
    "slug": "balo-nike-air-max-premium-updated",
    "description": "Mô tả đã được cập nhật",
    "price": 1300000,
    "discount_price": 1100000,
    "image": "https://example.com/product-updated.jpg",
    "gallery": [
      "https://example.com/gallery1-updated.jpg",
      "https://example.com/gallery2-updated.jpg",
      "https://example.com/gallery3-new.jpg"
    ],
    "stock": 45,
    "color": "Xanh Navy",
    "brand": {
      "id": 2,
      "name": "Nike",
      "slug": "nike"
    },
    "category": {
      "id": 1,
      "name": "Balo Thể Thao",
      "slug": "balo-the-thao"
    },
    "created_at": "2025-07-04T12:00:00.000000Z",
    "updated_at": "2025-07-04T13:30:00.000000Z"
  }
}
```

**Response lỗi (404)**:

```json
{
  "message": "Product not found"
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "price": ["The price must be greater than 0."],
    "discount_price": ["The discount price must be less than price."]
  }
}
```

---

## Xóa sản phẩm (Admin)

### DELETE /api/dashboard/products/{product}

**Mô tả**: Xóa sản phẩm (soft delete)

**Phương thức**: DELETE

**URL**: `/api/dashboard/products/{product}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `product` (integer, required): ID sản phẩm

**Response thành công (200)**:

```json
{
  "message": "Product soft deleted successfully"
}
```

**Response lỗi (422) - Sản phẩm đã có trong đơn hàng**:

```json
{
  "message": "Cannot delete product that has been ordered in active orders."
}
```

**Response lỗi (404)**:

```json
{
  "message": "Product not found"
}
```

---

## Lấy danh sách sản phẩm đã xóa (Admin)

### GET /api/dashboard/products/trashed

**Mô tả**: Lấy danh sách sản phẩm đã bị xóa (soft deleted)

**Phương thức**: GET

**URL**: `/api/dashboard/products/trashed`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 10,
        "name": "Balo đã xóa",
        "slug": "balo-da-xoa",
        "price": 500000,
        "stock": 20,
        "brand": {
          "id": 1,
          "name": "Nike",
          "slug": "nike"
        },
        "category": {
          "id": 2,
          "name": "Balo Học Sinh",
          "slug": "balo-hoc-sinh"
        },
        "deleted_at": "2025-07-04T10:30:00.000000Z",
        "order_details_count": 3
      }
    ],
    "first_page_url": "http://localhost:8000/api/dashboard/products/trashed?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost:8000/api/dashboard/products/trashed?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost:8000/api/dashboard/products/trashed",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

---

## Khôi phục sản phẩm đã xóa (Admin)

### POST /api/dashboard/products/{id}/restore

**Mô tả**: Khôi phục sản phẩm đã bị xóa

**Phương thức**: POST

**URL**: `/api/dashboard/products/{id}/restore`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID sản phẩm đã bị xóa

**Response thành công (200)**:

```json
{
  "message": "Product restored successfully",
  "data": {
    "id": 10,
    "name": "Balo đã khôi phục",
    "slug": "balo-da-khoi-phuc",
    "description": "Sản phẩm đã được khôi phục",
    "price": 500000,
    "discount_price": null,
    "image": "https://example.com/restored-product.jpg",
    "gallery": [],
    "stock": 20,
    "color": "Đỏ",
    "brand": {
      "id": 1,
      "name": "Nike",
      "slug": "nike"
    },
    "category": {
      "id": 2,
      "name": "Balo Học Sinh",
      "slug": "balo-hoc-sinh"
    },
    "created_at": "2025-07-03T12:00:00.000000Z",
    "updated_at": "2025-07-04T14:00:00.000000Z"
  }
}
```

**Response lỗi (404)**:

```json
{
  "message": "Product not found in trash"
}
```

---

## Xóa vĩnh viễn sản phẩm (Admin)

### DELETE /api/dashboard/products/{id}/force

**Mô tả**: Xóa vĩnh viễn sản phẩm (không thể khôi phục)

**Phương thức**: DELETE

**URL**: `/api/dashboard/products/{id}/force`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID sản phẩm đã bị soft delete

**Response thành công (200)**:

```json
{
  "message": "Product permanently deleted"
}
```

**Response lỗi (422) - Có lịch sử đơn hàng**:

```json
{
  "message": "Cannot force delete product that has order history. Data integrity must be maintained."
}
```

**Response lỗi (404)**:

```json
{
  "message": "Product not found in trash"
}
```

---

## Lấy danh sách sản phẩm cho quản trị (Admin)

### GET /api/dashboard/products

**Mô tả**: Lấy danh sách sản phẩm với các bộ lọc và tìm kiếm dành cho admin

**Phương thức**: GET

**URL**: `/api/dashboard/products`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số sản phẩm mỗi trang (mặc định: 15)
- `search` (string, optional): Tìm kiếm theo tên sản phẩm
- `category_id` (integer, optional): Lọc theo ID danh mục
- `brand_id` (integer, optional): Lọc theo ID thương hiệu
- `min_price` (numeric, optional): Giá tối thiểu
- `max_price` (numeric, optional): Giá tối đa
- `color` (string, optional): Lọc theo màu sắc
- `in_stock` (boolean, optional): Chỉ lấy sản phẩm còn hàng (stock > 0)
- `out_of_stock` (boolean, optional): Chỉ lấy sản phẩm hết hàng (stock = 0)
- `low_stock` (integer, optional): Lấy sản phẩm có tồn kho thấp (stock <= giá trị này)
- `sort_by` (string, optional): Sắp xếp theo (created_at, name, price, stock)
- `sort_order` (string, optional): Thứ tự sắp xếp (asc, desc)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Balo Nike Air Max",
        "slug": "balo-nike-air-max",
        "description": "Balo thể thao Nike Air Max với thiết kế hiện đại",
        "price": 1200000,
        "discount_price": 1000000,
        "image": "https://example.com/nike-backpack.jpg",
        "gallery": [
          "https://example.com/nike-1.jpg",
          "https://example.com/nike-2.jpg"
        ],
        "stock": 50,
        "color": "Đen",
        "brand": {
          "id": 1,
          "name": "Nike",
          "slug": "nike"
        },
        "category": {
          "id": 1,
          "name": "Balo Thể Thao",
          "slug": "balo-the-thao"
        },
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z",
        "order_count": 15,
        "total_sold": 45,
        "revenue": 45000000
      }
    ],
    "first_page_url": "http://localhost:8000/api/dashboard/products?page=1",
    "from": 1,
    "last_page": 10,
    "last_page_url": "http://localhost:8000/api/dashboard/products?page=10",
    "links": [],
    "next_page_url": "http://localhost:8000/api/dashboard/products?page=2",
    "path": "http://localhost:8000/api/dashboard/products",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 150
  }
}
```

---

## Cập nhật số lượng tồn kho hàng loạt (Admin)

### PUT /api/dashboard/products/bulk-update-stock

**Mô tả**: Cập nhật số lượng tồn kho cho nhiều sản phẩm cùng lúc

**Phương thức**: PUT

**URL**: `/api/dashboard/products/bulk-update-stock`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "products": [
    {
      "id": 1,
      "stock": 100
    },
    {
      "id": 2,
      "stock": 50
    },
    {
      "id": 3,
      "stock": 0
    }
  ]
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Stock updated successfully for 3 products",
  "data": {
    "updated_count": 3,
    "failed_count": 0,
    "failed_products": []
  }
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "products.0.stock": ["The stock must be at least 0."],
    "products.1.id": ["The selected id is invalid."]
  }
}
```

---

## Thống kê nhanh sản phẩm (Admin)

### GET /api/dashboard/products/quick-stats

**Mô tả**: Lấy thống kê nhanh về sản phẩm

**Phương thức**: GET

**URL**: `/api/dashboard/products/quick-stats`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "total_products": 205,
    "active_products": 195,
    "trashed_products": 10,
    "out_of_stock_products": 8,
    "low_stock_products": 15,
    "products_with_discount": 45,
    "total_inventory_value": 125000000,
    "average_product_price": 850000,
    "top_categories": [
      {
        "category": "Balo Du Lịch",
        "count": 43
      },
      {
        "category": "Balo Laptop",
        "count": 40
      },
      {
        "category": "Balo Thể Thao",
        "count": 35
      }
    ],
    "top_brands": [
      {
        "brand": "Nike",
        "count": 25
      },
      {
        "brand": "Adidas",
        "count": 22
      },
      {
        "brand": "Samsonite",
        "count": 18
      }
    ]
  }
}
```

---

## Ghi chú

- Tất cả endpoints đều yêu cầu JWT token hợp lệ và vai trò Admin hoặc Contributor
- Sản phẩm sử dụng soft delete - có thể khôi phục sau khi xóa
- Không thể xóa sản phẩm đã có trong đơn hàng để đảm bảo tính toàn vẹn dữ liệu
- Force delete chỉ được phép khi sản phẩm không có lịch sử đơn hàng
- Gallery là array có thể rỗng
- Slug được tự động tạo từ tên sản phẩm
- Discount price phải nhỏ hơn price gốc
- Stock được quản lý chặt chẽ, cập nhật khi có đơn hàng

## Ví dụ Curl Commands

### 1. Tạo sản phẩm mới

```bash
curl -X POST http://localhost:8000/api/dashboard/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "brand_id": 2,
    "name": "Balo Nike Air Max Premium",
    "description": "Balo thể thao cao cấp",
    "price": 1200000,
    "discount_price": 1000000,
    "stock": 50,
    "color": "Đen"
  }'
```

### 2. Cập nhật sản phẩm

```bash
curl -X PUT http://localhost:8000/api/dashboard/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Balo Nike Air Max Premium Updated",
    "price": 1300000,
    "stock": 45
  }'
```

### 3. Xóa sản phẩm

```bash
curl -X DELETE http://localhost:8000/api/dashboard/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Lấy sản phẩm đã xóa

```bash
curl -X GET http://localhost:8000/api/dashboard/products/trashed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Khôi phục sản phẩm

```bash
curl -X POST http://localhost:8000/api/dashboard/products/1/restore \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Cập nhật stock hàng loạt

```bash
curl -X PUT http://localhost:8000/api/dashboard/products/bulk-update-stock \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {"id": 1, "stock": 100},
      {"id": 2, "stock": 50}
    ]
  }'
```
