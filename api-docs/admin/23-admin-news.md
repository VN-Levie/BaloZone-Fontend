# 23. Quản lý tin tức (Admin News)

> **Lưu ý**: Các endpoint quản lý tin tức sử dụng `/api/dashboard/news/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý tin tức

## Danh sách tin tức (Admin)

### GET /api/dashboard/news

**Mô tả**: Lấy danh sách tất cả tin tức

**Phương thức**: GET

**URL**: `/api/dashboard/news`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters**:

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| search | string | Không | Tìm kiếm theo tiêu đề |
| page | integer | Không | Số trang (mặc định: 1) |
| per_page | integer | Không | Số item mỗi trang (mặc định: 10) |

**Response thành công (200)**:

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "title": "Top 10 Balo Học Sinh Được Yêu Thích Nhất 2025",
      "description": "Khám phá những mẫu balo học sinh hot nhất năm 2025 với thiết kế trẻ trung, chất lượng cao và giá cả phải chăng. Từ các thương hiệu nổi tiếng như Nike, Adidas đến JanSport.",
      "thumbnail": "https://placehold.co/600x400?text=news/top-10-balo-hoc-sinh-2025.jpg",
      "created_at": "2025-08-02T19:37:55.000000Z",
      "updated_at": "2025-08-02T19:37:55.000000Z",
      "deleted_at": null
    }
  ],
  "first_page_url": "http://localhost:8000/api/dashboard/news?page=1",
  "from": 1,
  "last_page": 2,
  "last_page_url": "http://localhost:8000/api/dashboard/news?page=2",
  "links": [...],
  "next_page_url": "http://localhost:8000/api/dashboard/news?page=2",
  "path": "http://localhost:8000/api/dashboard/news",
  "per_page": 10,
  "prev_page_url": null,
  "to": 10,
  "total": 20
}
```

## Chi tiết tin tức (Admin)

### GET /api/dashboard/news/{id}

**Mô tả**: Lấy thông tin chi tiết một tin tức

**Phương thức**: GET

**URL**: `/api/dashboard/news/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Accept: application/json
```

**Response thành công (200)**:

```json
{
  "data": {
    "id": 1,
    "title": "Top 10 Balo Học Sinh Được Yêu Thích Nhất 2025",
    "description": "Khám phá những mẫu balo học sinh hot nhất năm 2025 với thiết kế trẻ trung, chất lượng cao và giá cả phải chăng. Từ các thương hiệu nổi tiếng như Nike, Adidas đến JanSport.",
    "thumbnail": "https://placehold.co/600x400?text=news/top-10-balo-hoc-sinh-2025.jpg",
    "created_at": "2025-08-02T19:37:55.000000Z",
    "updated_at": "2025-08-02T19:37:55.000000Z",
    "deleted_at": null
  }
}
```

## Tạo tin tức mới (Admin)

### POST /api/dashboard/news

**Mô tả**: Tạo tin tức mới

**Phương thức**: POST

**URL**: `/api/dashboard/news`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "title": "Test News Article",
  "description": "This is a test news article description with detailed content",
  "thumbnail": "https://example.com/news-thumbnail.jpg"
}
```

**Validation Rules**:

| Field | Rules | Mô tả |
|-------|-------|-------|
| title | required, string, max:255 | Tiêu đề tin tức |
| description | required, string | Nội dung mô tả tin tức |
| thumbnail | nullable, string, max:255 | URL ảnh thumbnail |

**Response thành công (201)**:

```json
{
  "message": "Tin tức đã được tạo thành công",
  "data": {
    "title": "Test News Article",
    "description": "This is a test news article description with detailed content",
    "updated_at": "2025-08-03T07:07:58.000000Z",
    "created_at": "2025-08-03T07:07:58.000000Z",
    "id": 21
  }
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "The title field is required. (and 1 more error)",
  "data": null,
  "debug_info": {
    "exception": "Illuminate\\Validation\\ValidationException",
    "file": "/Users/fe-haiduong/BaloZone-Backend/vendor/laravel/framework/src/Illuminate/Support/helpers.php",
    "line": 423
  }
}
```

## Cập nhật tin tức (Admin)

### PUT /api/dashboard/news/{id}

**Mô tả**: Cập nhật thông tin tin tức

**Phương thức**: PUT

**URL**: `/api/dashboard/news/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "title": "Updated Test News Article",
  "description": "This is an updated test news article with new content",
  "thumbnail": "https://example.com/news-thumbnail.jpg"
}
```

**Validation Rules**:

| Field | Rules | Mô tả |
|-------|-------|-------|
| title | sometimes, required, string, max:255 | Tiêu đề tin tức |
| description | sometimes, required, string | Nội dung mô tả tin tức |
| thumbnail | nullable, string, max:255 | URL ảnh thumbnail |

**Response thành công (200)**:

```json
{
  "message": "Tin tức đã được cập nhật thành công",
  "data": {
    "id": 21,
    "title": "Updated Test News Article",
    "description": "This is an updated test news article with new content",
    "thumbnail": "https://example.com/news-thumbnail.jpg",
    "created_at": "2025-08-03T07:07:58.000000Z",
    "updated_at": "2025-08-03T07:08:11.000000Z",
    "deleted_at": null
  }
}
```

## Xóa tin tức (Admin)

### DELETE /api/dashboard/news/{id}

**Mô tả**: Xóa tin tức (soft delete)

**Phương thức**: DELETE

**URL**: `/api/dashboard/news/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Accept: application/json
```

**Response thành công (200)**:

```json
{
  "message": "Tin tức đã được xóa thành công"
}
```

**Response lỗi (404)**:

```json
{
  "message": "News not found"
}
```

## Ví dụ sử dụng

### 1. Lấy danh sách tin tức

```bash
curl -X GET "http://localhost:8000/api/dashboard/news?per_page=5" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

### 2. Tìm kiếm tin tức

```bash
curl -X GET "http://localhost:8000/api/dashboard/news?search=balo&per_page=3" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

### 3. Tạo tin tức mới

```bash
curl -X POST "http://localhost:8000/api/dashboard/news" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test News Article",
    "description": "This is a test news article description with detailed content"
  }'
```

### 4. Cập nhật tin tức

```bash
curl -X PUT "http://localhost:8000/api/dashboard/news/21" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test News Article",
    "description": "This is an updated test news article with new content",
    "thumbnail": "https://example.com/news-thumbnail.jpg"
  }'
```

### 5. Xóa tin tức

```bash
curl -X DELETE "http://localhost:8000/api/dashboard/news/21" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```


**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "News not found"
}
```

## Ví dụ sử dụng curl

### Tạo tin tức mới

```bash
curl -X POST http://localhost:8000/api/dashboard/news \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Xu hướng túi xách 2025",
    "slug": "xu-huong-tui-xach-2025",
    "excerpt": "Cập nhật những xu hướng túi xách hot nhất năm 2025",
    "content": "<p>Năm 2025 đánh dấu sự trở lại của phong cách minimalist...</p>",
    "featured_image": "https://example.com/images/trend-2025.jpg",
    "status": "published",
    "is_featured": true,
    "published_at": "2025-01-15 08:00:00"
  }'
```

### Cập nhật tin tức

```bash
curl -X PUT http://localhost:8000/api/dashboard/news/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Xu hướng túi xách 2025 - Phiên bản cập nhật",
    "status": "published",
    "is_featured": false
  }'
```

### Xóa tin tức

```bash
curl -X DELETE http://localhost:8000/api/dashboard/news/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin hoặc contributor
- Slug phải unique trong hệ thống
- Status có 3 giá trị: `draft`, `published`, `archived`
- Chỉ tin tức có status `published` mới hiển thị trên website
- `is_featured = true` để hiển thị tin tức ở vị trí nổi bật
- `view_count` được tự động tăng khi user xem tin tức
- `published_at` quyết định thời gian xuất bản tin tức
