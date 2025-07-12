# 3. Danh mục (Categories)

## Lấy danh sách danh mục

### GET /api/categories

**Mô tả**: Lấy danh sách tất cả danh mục sản phẩm

**Phương thức**: GET

**URL**: `/api/categories`

**Phân quyền**: Không yêu cầu authentication

**Tham số**: Không có

**Response thành công (200)**:

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

**Response lỗi (500)**:

```json
{
  "success": false,
  "message": "Lỗi hệ thống khi lấy danh sách danh mục"
}
```

**Lưu ý**:

- Endpoint này public, không cần authentication
- Trả về tất cả danh mục có trong hệ thống
- Slug được sử dụng để tạo URL thân thiện
- Image có thể null nếu danh mục chưa có hình ảnh

**Test với cURL**:

```bash
# Lấy danh sách tất cả danh mục
curl -X GET "http://localhost:8000/api/categories" \
  -H "Accept: application/json" | jq .
```

## Lấy danh mục theo slug

### GET /api/categories/slug/{slug}

**Mô tả**: Lấy thông tin chi tiết của một danh mục dựa trên slug

**Phương thức**: GET

**URL**: `/api/categories/slug/{slug}`

**Phân quyền**: Không yêu cầu authentication

**Tham số URL**:

- `slug` (string, required): Slug của danh mục cần lấy thông tin

**Response thành công (200)**:

```json
{
  "category": {
    "id": 1,
    "name": "Balo Học Sinh",
    "slug": "balo-hoc-sinh",
    "description": "Các loại balo dành cho học sinh, sinh viên với thiết kế trẻ trung và tiện dụng",
    "image": "https://placehold.co/600x400?text=categories/balo-hoc-sinh.jpg",
    "created_at": "2025-07-12T17:24:34.000000Z",
    "updated_at": "2025-07-12T17:24:34.000000Z"
  },
  "products": {
    "current_page": 1,
    "data": [
      {
        "id": 58,
        "category_id": 1,
        "brand_id": 6,
        "name": "Balo Du Lịch Samsonite eos",
        "description": "Sint est amet laborum. Dolores nihil dolor nesciunt quas itaque amet.",
        "price": "1640641.00",
        "discount_price": null,
        "stock": 49,
        "image": "https://placehold.co/600x400?text=products/balo-du-lich-samsonite-eos.jpg",
        "gallery": [
          "https://placehold.co/600x400?text=balo-du-lich-samsonite-eos-1.jpg",
          "https://placehold.co/600x400?text=balo-du-lich-samsonite-eos-2.jpg"
        ],
        "slug": "balo-du-lich-samsonite-eos-8388",
        "color": "Nâu",
        "created_at": "2025-07-12T17:24:37.000000Z",
        "updated_at": "2025-07-12T17:47:55.000000Z",
        "deleted_at": null,
        "brand": {
          "id": 6,
          "name": "Herschel",
          "description": "Herschel Supply Co. nổi tiếng với thiết kế vintage và hiện đại, phù hợp cho mọi lứa tuổi.",
          "slug": "herschel",
          "logo": "https://placehold.co/600x400?text=brands/herschel-logo.png",
          "status": "active",
          "created_at": "2025-07-12T17:24:34.000000Z",
          "updated_at": "2025-07-12T17:24:34.000000Z",
          "deleted_at": null
        }
      }
    ],
    "first_page_url": "http://localhost:8000/api/categories/slug/balo-hoc-sinh?page=1",
    "from": 1,
    "last_page": 4,
    "last_page_url": "http://localhost:8000/api/categories/slug/balo-hoc-sinh?page=4",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "http://localhost:8000/api/categories/slug/balo-hoc-sinh?page=1",
        "label": "1",
        "active": true
      },
      {
        "url": "http://localhost:8000/api/categories/slug/balo-hoc-sinh?page=2",
        "label": "Next &raquo;",
        "active": false
      }
    ],
    "next_page_url": "http://localhost:8000/api/categories/slug/balo-hoc-sinh?page=2",
    "path": "http://localhost:8000/api/categories/slug/balo-hoc-sinh",
    "per_page": 12,
    "prev_page_url": null,
    "to": 12,
    "total": 39
  }
}
```

**Response lỗi (404)**:

```json
{
  "message": "Category not found"
}
```

**Response lỗi (500)**:

```json
{
  "success": false,
  "message": "Lỗi hệ thống khi lấy thông tin danh mục"
}
```

**Lưu ý**:

- Endpoint này public, không cần authentication
- Slug phải khớp chính xác (case-sensitive)
- Kèm theo danh sách sản phẩm thuộc danh mục với pagination (12 sản phẩm/trang)
- Sử dụng để hiển thị trang danh mục sản phẩm
- Response structure khác với endpoint /api/categories (không có success field)

**Test với cURL**:

```bash
# Lấy danh mục theo slug (thành công)
curl -X GET "http://localhost:8000/api/categories/slug/balo-hoc-sinh" \
  -H "Accept: application/json" | jq .

# Test slug không tồn tại (lỗi 404)
curl -X GET "http://localhost:8000/api/categories/slug/khong-ton-tai" \
  -H "Accept: application/json" | jq .
```
