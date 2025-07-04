# 23. Quản lý tin tức (Admin News)

> **Lưu ý**: Các endpoint quản lý tin tức sử dụng `/api/dashboard/news/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý tin tức

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
  "title": "Ra mắt bộ sưu tập túi xách mùa hè 2025",
  "slug": "ra-mat-bo-suu-tap-tui-xach-mua-he-2025",
  "excerpt": "Khám phá bộ sưu tập túi xách mới nhất với thiết kế hiện đại và chất liệu cao cấp",
  "content": "<p>Chúng tôi hân hạnh giới thiệu bộ sưu tập túi xách mùa hè 2025...</p>",
  "featured_image": "https://example.com/images/news/summer-collection-2025.jpg",
  "meta_title": "Ra mắt bộ sưu tập túi xách mùa hè 2025 | BaloZone",
  "meta_description": "Khám phá bộ sưu tập túi xách mới nhất với thiết kế hiện đại",
  "status": "published",
  "is_featured": true,
  "published_at": "2025-01-01 09:00:00"
}
```

**Response thành công (201)**:

```json
{
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 1,
    "title": "Ra mắt bộ sưu tập túi xách mùa hè 2025",
    "slug": "ra-mat-bo-suu-tap-tui-xach-mua-he-2025",
    "excerpt": "Khám phá bộ sưu tập túi xách mới nhất với thiết kế hiện đại và chất liệu cao cấp",
    "content": "<p>Chúng tôi hân hạnh giới thiệu bộ sưu tập túi xách mùa hè 2025...</p>",
    "featured_image": "https://example.com/images/news/summer-collection-2025.jpg",
    "meta_title": "Ra mắt bộ sưu tập túi xách mùa hè 2025 | BaloZone",
    "meta_description": "Khám phá bộ sưu tập túi xách mới nhất với thiết kế hiện đại",
    "status": "published",
    "is_featured": true,
    "view_count": 0,
    "published_at": "2025-01-01T09:00:00.000000Z",
    "created_at": "2025-01-01T12:00:00.000000Z",
    "updated_at": "2025-01-01T12:00:00.000000Z"
  }
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "title": ["The title field is required."],
    "slug": ["The slug has already been taken."],
    "content": ["The content field is required."],
    "status": ["The selected status is invalid."]
  }
}
```

**Validation rules**:

- `title` (string, required, max:255): Tiêu đề tin tức
- `slug` (string, required, max:255, unique): Đường dẫn thân thiện
- `excerpt` (string, optional): Tóm tắt ngắn
- `content` (text, required): Nội dung tin tức
- `featured_image` (string, optional): Ảnh đại diện
- `meta_title` (string, optional, max:255): Tiêu đề SEO
- `meta_description` (string, optional, max:500): Mô tả SEO
- `status` (string, required): Trạng thái (draft, published, archived)
- `is_featured` (boolean, optional): Tin tức nổi bật
- `published_at` (datetime, optional): Thời gian xuất bản

## Cập nhật tin tức (Admin)

### PUT /api/dashboard/news/{news}

**Mô tả**: Cập nhật thông tin tin tức

**Phương thức**: PUT

**URL**: `/api/dashboard/news/{news}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `news` (integer, required): ID tin tức

**Body**:

```json
{
  "title": "Ra mắt bộ sưu tập túi xách mùa hè 2025 - Cập nhật",
  "excerpt": "Khám phá bộ sưu tập túi xách mới nhất với thiết kế siêu hiện đại",
  "status": "published",
  "is_featured": false
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "News updated successfully",
  "data": {
    "id": 1,
    "title": "Ra mắt bộ sưu tập túi xách mùa hè 2025 - Cập nhật",
    "slug": "ra-mat-bo-suu-tap-tui-xach-mua-he-2025",
    "excerpt": "Khám phá bộ sưu tập túi xách mới nhất với thiết kế siêu hiện đại",
    "content": "<p>Chúng tôi hân hạnh giới thiệu bộ sưu tập túi xách mùa hè 2025...</p>",
    "featured_image": "https://example.com/images/news/summer-collection-2025.jpg",
    "meta_title": "Ra mắt bộ sưu tập túi xách mùa hè 2025 | BaloZone",
    "meta_description": "Khám phá bộ sưu tập túi xách mới nhất với thiết kế hiện đại",
    "status": "published",
    "is_featured": false,
    "view_count": 150,
    "published_at": "2025-01-01T09:00:00.000000Z",
    "created_at": "2025-01-01T12:00:00.000000Z",
    "updated_at": "2025-01-01T15:30:00.000000Z"
  }
}
```

## Xóa tin tức (Admin)

### DELETE /api/dashboard/news/{news}

**Mô tả**: Xóa tin tức

**Phương thức**: DELETE

**URL**: `/api/dashboard/news/{news}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `news` (integer, required): ID tin tức

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "News deleted successfully"
}
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
