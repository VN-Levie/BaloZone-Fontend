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

**Mô tả**: Tạo tin tức mới với hỗ trợ upload ảnh thumbnail

**Phương thức**: POST

**URL**: `/api/dashboard/news`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (Form Data)**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Tiêu đề tin tức (max: 255 ký tự) |
| description | text | Yes | Nội dung mô tả tin tức |
| thumbnail | file | No | File ảnh (jpeg,png,jpg,gif,webp, max: 2MB) |

**Validation Rules**:

| Field | Rules | Mô tả |
|-------|-------|-------|
| title | required, string, max:255 | Tiêu đề tin tức |
| description | required, string | Nội dung mô tả tin tức |
| thumbnail | nullable, image, mimes:jpeg,png,jpg,gif,webp, max:2048 | File ảnh thumbnail |

**Response thành công (201)**:

```json
{
  "message": "Tin tức đã được tạo thành công",
  "data": {
    "title": "Test News with Image Upload",
    "description": "This is a test news with image upload feature",
    "thumbnail": "/storage/news/thumbnails/1754208173_test.png",
    "updated_at": "2025-08-03T08:02:53.000000Z",
    "created_at": "2025-08-03T08:02:53.000000Z",
    "id": 22
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

**Mô tả**: Cập nhật thông tin tin tức (JSON format - không upload file)

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
  "description": "This is an updated test news article with new content"
}
```

### POST /api/dashboard/news/{id}/update

**Mô tả**: Cập nhật tin tức với hỗ trợ upload ảnh mới

**Phương thức**: POST

**URL**: `/api/dashboard/news/{id}/update`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```bash
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (Form Data)**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | No | Tiêu đề tin tức (max: 255 ký tự) |
| description | text | No | Nội dung mô tả tin tức |
| thumbnail | file | No | File ảnh mới (jpeg,png,jpg,gif,webp, max: 2MB) |

**Validation Rules**:

| Field | Rules | Mô tả |
|-------|-------|-------|
| title | sometimes, required, string, max:255 | Tiêu đề tin tức |
| description | sometimes, required, string | Nội dung mô tả tin tức |
| thumbnail | nullable, image, mimes:jpeg,png,jpg,gif,webp, max:2048 | File ảnh thumbnail mới |

**Response thành công (200)**:

```json
{
  "message": "Tin tức đã được cập nhật thành công",
  "data": {
    "id": 22,
    "title": "Updated News with New Image",
    "description": "Updated description with new thumbnail",
    "thumbnail": "/storage/news/thumbnails/1754208285_test2.png",
    "created_at": "2025-08-03T08:02:53.000000Z",
    "updated_at": "2025-08-03T08:04:45.000000Z",
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

### 3. Tạo tin tức mới với upload ảnh

```bash
curl -X POST "http://localhost:8000/api/dashboard/news" \
  -H "Authorization: Bearer {token}" \
  -F "title=Test News with Image Upload" \
  -F "description=This is a test news with image upload feature" \
  -F "thumbnail=@/path/to/image.png"
```

### 4. Tạo tin tức chỉ với text

```bash
curl -X POST "http://localhost:8000/api/dashboard/news" \
  -H "Authorization: Bearer {token}" \
  -F "title=Text Only News" \
  -F "description=This news has no thumbnail image"
```

### 5. Cập nhật tin tức (JSON - không upload file)

```bash
curl -X PUT "http://localhost:8000/api/dashboard/news/21" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated News Title",
    "description": "Updated news description"
  }'
```

### 6. Cập nhật tin tức với ảnh mới

```bash
curl -X POST "http://localhost:8000/api/dashboard/news/21/update" \
  -H "Authorization: Bearer {token}" \
  -F "title=Updated News with New Image" \
  -F "description=Updated description with new thumbnail" \
  -F "thumbnail=@/path/to/new_image.png"
```

### 7. Xóa tin tức

```bash
curl -X DELETE "http://localhost:8000/api/dashboard/news/21" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

## Lưu ý quan trọng

- **File Upload**: Sử dụng Content-Type: multipart/form-data
- **File Types**: Chỉ chấp nhận jpeg, png, jpg, gif, webp
- **File Size**: Tối đa 2MB
- **Auto Cleanup**: File cũ sẽ tự động bị xóa khi update hoặc delete
- **Storage Path**: Files được lưu trong `/storage/news/thumbnails/`
- **URL Format**: Thumbnail trả về dạng `/storage/news/thumbnails/filename.ext`
- **Update Methods**:
  - PUT: JSON format, không upload file
  - POST {id}/update: Form data, có thể upload file mới


**Response lỗi (404)**:
