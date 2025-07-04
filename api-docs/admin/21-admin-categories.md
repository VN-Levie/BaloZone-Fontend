# 21. Quản lý danh mục (Admin Categories)

> **Lưu ý**: Các endpoint quản lý danh mục sử dụng prefix `/api/dashboard/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý danh mục

## Tạo danh mục mới (Admin)

### POST /api/dashboard/categories

**Mô tả**: Tạo danh mục mới

**Phương thức**: POST

**URL**: `/api/dashboard/categories`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body** (Form Data):

- `name` (string, required): Tên danh mục
- `description` (string, optional): Mô tả danh mục
- `slug` (string, required): Slug URL-friendly
- `image` (file, optional): File hình ảnh danh mục (jpeg, png, jpg, gif, svg, max: 2MB)

**Ví dụ Form Data**:

```
name: Balo Du Lịch Premium
description: Các loại balo chuyên dụng cho việc du lịch xa
slug: balo-du-lich-premium
image: [FILE] category-travel.jpg
```

**Response thành công (201)**:

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 1,
    "name": "Balo Du Lịch Premium",
    "description": "Các loại balo chuyên dụng cho việc du lịch xa",
    "slug": "balo-du-lich-premium",
    "image": "categories/images/category-travel-12345.jpg",
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
    "slug": ["The slug has already been taken."]
  }
}
```

**Validation rules**:

- `name` (string, required, max:255): Tên danh mục
- `description` (string, optional): Mô tả danh mục
- `slug` (string, required, max:255, unique): Slug URL-friendly, chỉ chứa chữ cái thường, số và dấu gạch ngang
- `image` (file, optional): File hình ảnh danh mục (jpeg, png, jpg, gif, svg, max: 2MB)

---

## Cập nhật danh mục (Admin)

### PUT /api/dashboard/categories/{category}

**Mô tả**: Cập nhật thông tin danh mục

**Phương thức**: PUT

**URL**: `/api/dashboard/categories/{category}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `category` (integer, required): ID danh mục

**Body**:

```json
{
  "name": "Balo Du Lịch Premium Updated",
  "description": "Các loại balo chuyên dụng cho việc du lịch xa - Đã cập nhật",
  "slug": "balo-du-lich-premium-updated",
  "image": "https://example.com/category-travel-new.jpg"
}
```

**Response thành công (200)**:

```json
{
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Balo Du Lịch Premium Updated",
    "description": "Các loại balo chuyên dụng cho việc du lịch xa - Đã cập nhật",
    "slug": "balo-du-lich-premium-updated",
    "image": "https://example.com/category-travel-new.jpg",
    "created_at": "2025-07-04T12:00:00.000000Z",
    "updated_at": "2025-07-04T13:30:00.000000Z"
  }
}
```

**Response lỗi (404)**:

```json
{
  "message": "Category not found"
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "slug": ["The slug has already been taken."]
  }
}
```

---

## Xóa danh mục (Admin)

### DELETE /api/dashboard/categories/{category}

**Mô tả**: Xóa danh mục (soft delete)

**Phương thức**: DELETE

**URL**: `/api/dashboard/categories/{category}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số URL**:

- `category` (integer, required): ID danh mục

**Response thành công (200)**:

```json
{
  "message": "Category soft deleted successfully"
}
```

**Response lỗi (422) - Danh mục có sản phẩm**:

```json
{
  "message": "Cannot delete category that has active products. Please remove or reassign products first."
}
```

**Response lỗi (404)**:

```json
{
  "message": "Category not found"
}
```

---

## Lấy danh sách danh mục đã xóa (Admin)

### GET /api/dashboard/categories/trashed

**Mô tả**: Lấy danh sách danh mục đã bị xóa (soft deleted)

**Phương thức**: GET

**URL**: `/api/dashboard/categories/trashed`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
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
        "id": 8,
        "name": "Danh mục đã xóa",
        "slug": "danh-muc-da-xoa",
        "description": "Danh mục đã bị xóa",
        "image": "https://example.com/deleted-category.jpg",
        "deleted_at": "2025-07-04T10:30:00.000000Z",
        "products_count": 3
      }
    ],
    "first_page_url": "http://localhost:8000/api/dashboard/categories/trashed?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost:8000/api/dashboard/categories/trashed?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost:8000/api/dashboard/categories/trashed",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

---

## Khôi phục danh mục đã xóa (Admin)

### POST /api/dashboard/categories/{id}/restore

**Mô tả**: Khôi phục danh mục đã bị xóa

**Phương thức**: POST

**URL**: `/api/dashboard/categories/{id}/restore`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID danh mục đã bị xóa

**Response thành công (200)**:

```json
{
  "message": "Category restored successfully",
  "data": {
    "id": 8,
    "name": "Danh mục đã khôi phục",
    "slug": "danh-muc-da-khoi-phuc",
    "description": "Danh mục đã được khôi phục",
    "image": "https://example.com/restored-category.jpg",
    "created_at": "2025-07-03T12:00:00.000000Z",
    "updated_at": "2025-07-04T14:00:00.000000Z"
  }
}
```

**Response lỗi (404)**:

```json
{
  "message": "Category not found in trash"
}
```

---

## Xóa vĩnh viễn danh mục (Admin)

### DELETE /api/dashboard/categories/{id}/force

**Mô tả**: Xóa vĩnh viễn danh mục (không thể khôi phục)

**Phương thức**: DELETE

**URL**: `/api/dashboard/categories/{id}/force`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID danh mục đã bị soft delete

**Response thành công (200)**:

```json
{
  "message": "Category permanently deleted"
}
```

**Response lỗi (422) - Có sản phẩm liên quan**:

```json
{
  "message": "Cannot force delete category that has products. Please force delete all products first."
}
```

**Response lỗi (404)**:

```json
{
  "message": "Category not found in trash"
}
```

---

## Lấy danh sách danh mục cho quản trị (Admin)

### GET /api/dashboard/categories

**Mô tả**: Lấy danh sách danh mục với các bộ lọc và tìm kiếm dành cho admin

**Phương thức**: GET

**URL**: `/api/dashboard/categories`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số query**:

- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số danh mục mỗi trang (mặc định: 15)
- `search` (string, optional): Tìm kiếm theo tên danh mục
- `has_products` (boolean, optional): Lọc danh mục có sản phẩm
- `sort_by` (string, optional): Sắp xếp theo (created_at, name, products_count)
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
        "name": "Balo Du Lịch",
        "slug": "balo-du-lich",
        "description": "Các loại balo chuyên dụng cho việc du lịch",
        "image": "https://example.com/category-travel.jpg",
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z",
        "products_count": 43,
        "active_products_count": 40,
        "total_revenue": 250000000
      }
    ],
    "first_page_url": "http://localhost:8000/api/dashboard/categories?page=1",
    "from": 1,
    "last_page": 3,
    "last_page_url": "http://localhost:8000/api/dashboard/categories?page=3",
    "links": [],
    "next_page_url": "http://localhost:8000/api/dashboard/categories?page=2",
    "path": "http://localhost:8000/api/dashboard/categories",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 45
  }
}
```

---

## Lấy danh mục với sản phẩm (Admin)

### GET /api/dashboard/categories/{category}/products

**Mô tả**: Lấy danh mục kèm danh sách sản phẩm thuộc danh mục đó

**Phương thức**: GET

**URL**: `/api/dashboard/categories/{category}/products`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số URL**:

- `category` (integer, required): ID danh mục

**Tham số query**:

- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số sản phẩm mỗi trang (mặc định: 15)
- `include_trashed` (boolean, optional): Bao gồm sản phẩm đã xóa

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Balo Du Lịch",
      "slug": "balo-du-lich",
      "description": "Các loại balo chuyên dụng cho việc du lịch",
      "image": "https://example.com/category-travel.jpg",
      "products_count": 43
    },
    "products": {
      "current_page": 1,
      "data": [
        {
          "id": 1,
          "name": "Balo Du Lịch Nike",
          "slug": "balo-du-lich-nike",
          "price": 1200000,
          "stock": 25,
          "brand": {
            "id": 1,
            "name": "Nike",
            "slug": "nike"
          }
        }
      ],
      "total": 43,
      "per_page": 15
    }
  }
}
```

---

## Thống kê nhanh danh mục (Admin)

### GET /api/dashboard/categories/quick-stats

**Mô tả**: Lấy thống kê nhanh về danh mục

**Phương thức**: GET

**URL**: `/api/dashboard/categories/quick-stats`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "total_categories": 12,
    "active_categories": 11,
    "trashed_categories": 1,
    "categories_with_products": 8,
    "categories_without_products": 4,
    "top_categories_by_products": [
      {
        "category": "Balo Du Lịch",
        "products_count": 43
      },
      {
        "category": "Balo Laptop",
        "products_count": 40
      },
      {
        "category": "Balo Thể Thao",
        "products_count": 35
      }
    ],
    "top_categories_by_revenue": [
      {
        "category": "Balo Du Lịch",
        "total_revenue": 250000000
      },
      {
        "category": "Balo Laptop",
        "total_revenue": 180000000
      },
      {
        "category": "Balo Thể Thao",
        "total_revenue": 150000000
      }
    ],
    "categories_with_low_products": [
      {
        "category": "Balo Mini",
        "products_count": 2
      }
    ]
  }
}
```

---

## Ghi chú

- Tất cả endpoints đều yêu cầu JWT token hợp lệ và vai trò Admin hoặc Contributor
- Danh mục sử dụng soft delete - có thể khôi phục sau khi xóa
- Không thể xóa danh mục đã có sản phẩm để đảm bảo tính toàn vẹn dữ liệu
- Force delete chỉ được phép khi danh mục không có sản phẩm liên quan
- Slug phải unique và theo format URL-friendly
- Image có thể null nếu danh mục chưa có hình ảnh
- Description có thể null nếu không có mô tả

## Ví dụ Curl Commands

### 1. Tạo danh mục mới

```bash
curl -X POST http://localhost:8000/api/dashboard/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Balo Du Lịch Premium",
    "description": "Các loại balo chuyên dụng cho việc du lịch xa",
    "slug": "balo-du-lich-premium"
  }'
```

### 2. Cập nhật danh mục

```bash
curl -X PUT http://localhost:8000/api/dashboard/categories/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Balo Du Lịch Premium Updated",
    "description": "Mô tả đã cập nhật"
  }'
```

### 3. Xóa danh mục

```bash
curl -X DELETE http://localhost:8000/api/dashboard/categories/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Lấy danh mục đã xóa

```bash
curl -X GET http://localhost:8000/api/dashboard/categories/trashed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Khôi phục danh mục

```bash
curl -X POST http://localhost:8000/api/dashboard/categories/1/restore \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Lấy danh mục với sản phẩm

```bash
curl -X GET http://localhost:8000/api/dashboard/categories/1/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Lấy thống kê danh mục

```bash
curl -X GET http://localhost:8000/api/dashboard/categories/quick-stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
