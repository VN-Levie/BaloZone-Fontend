# 20. Quản lý thương hiệu (Admin Brands)

> **Lưu ý**: Các endpoint quản lý thương hiệu sử dụng prefix `/api/dashboard/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý thương hiệu

## Tạo thương hiệu mới (Admin)

### POST /api/dashboard/brands

**Mô tả**: Tạo thương hiệu mới

**Phương thức**: POST

**URL**: `/api/dashboard/brands`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "name": "Nike Premium",
  "description": "Thương hiệu thể thao cao cấp từ Mỹ",
  "slug": "nike-premium",
  "logo": "https://example.com/nike-logo.png",
  "status": "active"
}
```

**Response thành công (201)**:

```json
{
  "message": "Brand created successfully",
  "data": {
    "id": 1,
    "name": "Nike Premium",
    "description": "Thương hiệu thể thao cao cấp từ Mỹ",
    "slug": "nike-premium",
    "logo": "https://example.com/nike-logo.png",
    "status": "active",
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

- `name` (string, required, max:255): Tên thương hiệu
- `description` (string, optional): Mô tả thương hiệu
- `slug` (string, required, max:255, unique): Slug URL-friendly
- `logo` (string, optional, max:255): URL logo thương hiệu
- `status` (string, required): Trạng thái (active, inactive)

---

## Cập nhật thương hiệu (Admin)

### PUT /api/dashboard/brands/{brand}

**Mô tả**: Cập nhật thông tin thương hiệu

**Phương thức**: PUT

**URL**: `/api/dashboard/brands/{brand}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `brand` (integer, required): ID thương hiệu

**Body**:

```json
{
  "name": "Nike Premium Updated",
  "description": "Thương hiệu thể thao cao cấp từ Mỹ - Đã cập nhật",
  "slug": "nike-premium-updated",
  "logo": "https://example.com/nike-logo-new.png",
  "status": "active"
}
```

**Response thành công (200)**:

```json
{
  "message": "Brand updated successfully",
  "data": {
    "id": 1,
    "name": "Nike Premium Updated",
    "description": "Thương hiệu thể thao cao cấp từ Mỹ - Đã cập nhật",
    "slug": "nike-premium-updated",
    "logo": "https://example.com/nike-logo-new.png",
    "status": "active",
    "created_at": "2025-07-04T12:00:00.000000Z",
    "updated_at": "2025-07-04T13:30:00.000000Z"
  }
}
```

**Response lỗi (404)**:

```json
{
  "message": "Brand not found"
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

## Xóa thương hiệu (Admin)

### DELETE /api/dashboard/brands/{brand}

**Mô tả**: Xóa thương hiệu (soft delete)

**Phương thức**: DELETE

**URL**: `/api/dashboard/brands/{brand}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số URL**:

- `brand` (integer, required): ID thương hiệu

**Response thành công (200)**:

```json
{
  "message": "Brand soft deleted successfully"
}
```

**Response lỗi (422) - Thương hiệu có sản phẩm**:

```json
{
  "message": "Cannot delete brand that has active products. Please remove or reassign products first."
}
```

**Response lỗi (404)**:

```json
{
  "message": "Brand not found"
}
```

---

## Lấy danh sách thương hiệu đã xóa (Admin)

### GET /api/dashboard/brands/trashed

**Mô tả**: Lấy danh sách thương hiệu đã bị xóa (soft deleted)

**Phương thức**: GET

**URL**: `/api/dashboard/brands/trashed`

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
        "id": 5,
        "name": "Brand đã xóa",
        "slug": "brand-da-xoa",
        "description": "Thương hiệu đã bị xóa",
        "logo": "https://example.com/deleted-brand.png",
        "status": "inactive",
        "deleted_at": "2025-07-04T10:30:00.000000Z",
        "products_count": 2
      }
    ],
    "first_page_url": "http://localhost:8000/api/dashboard/brands/trashed?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "http://localhost:8000/api/dashboard/brands/trashed?page=1",
    "links": [],
    "next_page_url": null,
    "path": "http://localhost:8000/api/dashboard/brands/trashed",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  }
}
```

---

## Khôi phục thương hiệu đã xóa (Admin)

### POST /api/dashboard/brands/{id}/restore

**Mô tả**: Khôi phục thương hiệu đã bị xóa

**Phương thức**: POST

**URL**: `/api/dashboard/brands/{id}/restore`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID thương hiệu đã bị xóa

**Response thành công (200)**:

```json
{
  "message": "Brand restored successfully",
  "data": {
    "id": 5,
    "name": "Brand đã khôi phục",
    "slug": "brand-da-khoi-phuc",
    "description": "Thương hiệu đã được khôi phục",
    "logo": "https://example.com/restored-brand.png",
    "status": "active",
    "created_at": "2025-07-03T12:00:00.000000Z",
    "updated_at": "2025-07-04T14:00:00.000000Z"
  }
}
```

**Response lỗi (404)**:

```json
{
  "message": "Brand not found in trash"
}
```

---

## Xóa vĩnh viễn thương hiệu (Admin)

### DELETE /api/dashboard/brands/{id}/force

**Mô tả**: Xóa vĩnh viễn thương hiệu (không thể khôi phục)

**Phương thức**: DELETE

**URL**: `/api/dashboard/brands/{id}/force`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID thương hiệu đã bị soft delete

**Response thành công (200)**:

```json
{
  "message": "Brand permanently deleted"
}
```

**Response lỗi (422) - Có sản phẩm liên quan**:

```json
{
  "message": "Cannot force delete brand that has products. Please force delete all products first."
}
```

**Response lỗi (404)**:

```json
{
  "message": "Brand not found in trash"
}
```

---

## Lấy danh sách thương hiệu cho quản trị (Admin)

### GET /api/dashboard/brands

**Mô tả**: Lấy danh sách thương hiệu với các bộ lọc và tìm kiếm dành cho admin

**Phương thức**: GET

**URL**: `/api/dashboard/brands`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin/Contributor

**Headers**:

```http
Authorization: Bearer {token}
```

**Tham số query**:

- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số thương hiệu mỗi trang (mặc định: 15)
- `search` (string, optional): Tìm kiếm theo tên thương hiệu
- `status` (string, optional): Lọc theo trạng thái (active, inactive)
- `sort_by` (string, optional): Sắp xếp theo (created_at, name)
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
        "name": "Nike",
        "slug": "nike",
        "description": "Thương hiệu thể thao hàng đầu thế giới",
        "logo": "https://example.com/nike-logo.png",
        "status": "active",
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z",
        "products_count": 25,
        "active_products_count": 23,
        "total_revenue": 125000000
      }
    ],
    "first_page_url": "http://localhost:8000/api/dashboard/brands?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://localhost:8000/api/dashboard/brands?page=5",
    "links": [],
    "next_page_url": "http://localhost:8000/api/dashboard/brands?page=2",
    "path": "http://localhost:8000/api/dashboard/brands",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 75
  }
}
```

---

## Thống kê nhanh thương hiệu (Admin)

### GET /api/dashboard/brands/quick-stats

**Mô tả**: Lấy thống kê nhanh về thương hiệu

**Phương thức**: GET

**URL**: `/api/dashboard/brands/quick-stats`

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
    "total_brands": 25,
    "active_brands": 22,
    "inactive_brands": 3,
    "trashed_brands": 2,
    "brands_with_products": 18,
    "brands_without_products": 7,
    "top_brands_by_products": [
      {
        "brand": "Nike",
        "products_count": 25
      },
      {
        "brand": "Adidas", 
        "products_count": 22
      },
      {
        "brand": "Samsonite",
        "products_count": 18
      }
    ],
    "top_brands_by_revenue": [
      {
        "brand": "Nike",
        "total_revenue": 125000000
      },
      {
        "brand": "Adidas",
        "total_revenue": 98000000
      },
      {
        "brand": "Samsonite",
        "total_revenue": 75000000
      }
    ]
  }
}
```

---

## Ghi chú

- Tất cả endpoints đều yêu cầu JWT token hợp lệ và vai trò Admin hoặc Contributor
- Thương hiệu sử dụng soft delete - có thể khôi phục sau khi xóa
- Không thể xóa thương hiệu đã có sản phẩm để đảm bảo tính toàn vẹn dữ liệu
- Force delete chỉ được phép khi thương hiệu không có sản phẩm liên quan
- Slug phải unique và theo format URL-friendly
- Status chỉ có 2 giá trị: "active", "inactive"
- Logo có thể null nếu thương hiệu chưa có logo

## Ví dụ Curl Commands

### 1. Tạo thương hiệu mới

```bash
curl -X POST http://localhost:8000/api/dashboard/brands \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Premium",
    "description": "Thương hiệu thể thao cao cấp",
    "slug": "nike-premium",
    "status": "active"
  }'
```

### 2. Cập nhật thương hiệu

```bash
curl -X PUT http://localhost:8000/api/dashboard/brands/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Premium Updated",
    "description": "Mô tả đã cập nhật",
    "status": "active"
  }'
```

### 3. Xóa thương hiệu

```bash
curl -X DELETE http://localhost:8000/api/dashboard/brands/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Lấy thương hiệu đã xóa

```bash
curl -X GET http://localhost:8000/api/dashboard/brands/trashed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Khôi phục thương hiệu

```bash
curl -X POST http://localhost:8000/api/dashboard/brands/1/restore \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Lấy thống kê thương hiệu

```bash
curl -X GET http://localhost:8000/api/dashboard/brands/quick-stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
