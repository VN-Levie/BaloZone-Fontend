# Categories (Danh mục)

Các endpoint để quản lý thông tin danh mục sản phẩm.

## Base URL

```
/api/categories/
```

## Endpoints

### 1. Lấy danh sách danh mục

- **Endpoint:** `GET /api/categories`
- **Mô tả:** Lấy danh sách tất cả danh mục sản phẩm
- **Phân quyền:** Public
- **Tham số:** Không có

- **Response thành công (200):**

```json
{
    "success": true,
    "data": [
        {
            "id": 2,
            "name": "Balo Du Lịch",
            "slug": "balo-du-lich",
            "description": "Balo dành cho các chuyến du lịch, trekking với dung tích lớn và nhiều ngăn tiện ích",
            "image": "https://placehold.co/600x400?text=categories/balo-du-lich.jpg",
            "created_at": "2025-07-12T17:24:34.000000Z",
            "updated_at": "2025-07-12T17:24:34.000000Z"
        },
        {
            "id": 1,
            "name": "Balo Học Sinh",
            "slug": "balo-hoc-sinh",
            "description": "Các loại balo dành cho học sinh, sinh viên với thiết kế trẻ trung và tiện dụng",
            "image": "https://placehold.co/600x400?text=categories/balo-hoc-sinh.jpg",
            "created_at": "2025-07-12T17:24:34.000000Z",
            "updated_at": "2025-07-12T17:24:34.000000Z"
        },
        {
            "id": 6,
            "name": "Balo Mini",
            "slug": "balo-mini",
            "description": "Balo nhỏ gọn dành cho việc đi chơi, dạo phố",
            "image": "http://localhost:8000/storage/categories/balo-mini.jpg",
            "created_at": "2025-07-12T17:24:34.000000Z",
            "updated_at": "2025-07-12T17:24:34.000000Z"
        }
    ],
    "message": "Lấy danh sách danh mục thành công"
}
```

### 2. Lấy chi tiết danh mục

- **Endpoint:** `GET /api/categories/{id}`
- **Mô tả:** Lấy thông tin chi tiết của một danh mục theo ID
- **Phân quyền:** Public
- **Tham số:**
  - `id` (integer, required): ID của danh mục

- **Response thành công (200):**

```json
{
    "data": {
        "id": 1,
        "name": "Balo Học Sinh",
        "slug": "balo-hoc-sinh",
        "description": "Các loại balo dành cho học sinh, sinh viên với thiết kế trẻ trung và tiện dụng",
        "image": "https://placehold.co/600x400?text=categories/balo-hoc-sinh.jpg",
        "created_at": "2025-07-12T17:24:34.000000Z",
        "updated_at": "2025-07-12T17:24:34.000000Z",
        "products_count": 39
    }
}
```

### 3. Lấy danh mục theo slug

- **Endpoint:** `GET /api/categories/slug/{slug}`
- **Mô tả:** Lấy thông tin danh mục và danh sách sản phẩm theo slug (có phân trang)
- **Phân quyền:** Public
- **Tham số:**
  - `slug` (string, required): Slug của danh mục
  - `page` (integer, optional): Số trang (mặc định: 1)
  - `per_page` (integer, optional): Số sản phẩm mỗi trang (mặc định: 12)

- **Response thành công (200):**

```json
{
    "data": {
        "id": 1,
        "name": "Balo Học Sinh",
        "slug": "balo-hoc-sinh",
        "description": "Các loại balo dành cho học sinh, sinh viên với thiết kế trẻ trung và tiện dụng",
        "image": "https://placehold.co/600x400?text=categories/balo-hoc-sinh.jpg",
        "created_at": "2025-07-12T17:24:34.000000Z",
        "updated_at": "2025-07-12T17:24:34.000000Z"
    }    
}
```

## Error Responses

### 404 Not Found

```json
{
    "success": false,
    "message": "Endpoint không tồn tại",
    "data": null
}
```

### 500 Internal Server Error

```json
{
    "success": false,
    "message": "Lỗi hệ thống khi lấy danh sách danh mục"
}
```

## cURL Examples

### Lấy tất cả danh mục

```bash
curl -X GET "http://localhost:8000/api/categories" \
  -H "Accept: application/json"
```

### Lấy chi tiết danh mục

```bash
curl -X GET "http://localhost:8000/api/categories/1" \
  -H "Accept: application/json"
```

### Lấy danh mục kèm sản phẩm

```bash
curl -X GET "http://localhost:8000/api/categories/with-products" \
  -H "Accept: application/json"
```

### Lấy danh mục theo slug

```bash
curl -X GET "http://localhost:8000/api/categories/slug/balo-hoc-sinh" \
  -H "Accept: application/json"
```

### Lấy danh mục theo slug với phân trang

```bash
curl -X GET "http://localhost:8000/api/categories/slug/balo-hoc-sinh?page=2" \
  -H "Accept: application/json"
```

## Notes

- Tất cả endpoints categories đều public, không cần authentication
- Endpoint `/api/categories` trả về danh sách cơ bản của tất cả categories
- Endpoint `/api/categories/with-products` trả về categories kèm một số sản phẩm mẫu của mỗi category
- Endpoint `/api/categories/slug/{slug}` hỗ trợ phân trang với `per_page=12` sản phẩm mỗi trang
- Response `/api/categories/{id}` bao gồm `products_count` - tổng số sản phẩm trong category
- Slug được sử dụng để tạo URL thân thiện SEO
- Images sử dụng placeholder trong môi trường development

---

**Related Files:**
- Controller: `app/Http/Controllers/CategoryController.php`
- Model: `app/Models/Category.php`
- Routes: `routes/api.php` (lines 46-50)
