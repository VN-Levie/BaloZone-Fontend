# 10. Tin tức (News)

## Lấy danh sách tin tức

### GET /api/news

**Mô tả**: Lấy danh sách tin tức với phân trang

**Phương thức**: GET

**URL**: `/api/news`

**Phân quyền**: Không yêu cầu authentication

**Tham số query**:

- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số tin tức mỗi trang (mặc định: 10)
- `category` (string, optional): Lọc theo danh mục tin tức

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Khuyến mãi lớn cuối năm 2024",
        "slug": "khuyen-mai-lon-cuoi-nam-2024",
        "excerpt": "Cơ hội mua sắm với giá ưu đãi nhất trong năm...",
        "content": "Nội dung đầy đủ của tin tức...",
        "featured_image": "https://example.com/news-1.jpg",
        "category": "promotion",
        "author": {
          "id": 1,
          "name": "Admin",
          "email": "admin@example.com"
        },
        "view_count": 1250,
        "is_published": true,
        "published_at": "2024-01-01T00:00:00.000000Z",
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "first_page_url": "http://example.com/api/news?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://example.com/api/news?page=5",
    "next_page_url": "http://example.com/api/news?page=2",
    "path": "http://example.com/api/news",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 45
  },
  "message": "Lấy danh sách tin tức thành công"
}
```

## Lấy chi tiết tin tức

### GET /api/news/{id}

**Mô tả**: Lấy chi tiết một tin tức

**Phương thức**: GET

**URL**: `/api/news/{id}`

**Phân quyền**: Không yêu cầu authentication

**Tham số URL**:

- `id` (integer, required): ID tin tức

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Khuyến mãi lớn cuối năm 2024",
    "slug": "khuyen-mai-lon-cuoi-nam-2024",
    "excerpt": "Cơ hội mua sắm với giá ưu đãi nhất trong năm...",
    "content": "Nội dung đầy đủ của tin tức với HTML formatting...",
    "featured_image": "https://example.com/news-1.jpg",
    "gallery": [
      "https://example.com/news-1-1.jpg",
      "https://example.com/news-1-2.jpg"
    ],
    "category": "promotion",
    "author": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com"
    },
    "tags": ["khuyến mãi", "giảm giá", "sale"],
    "view_count": 1251,
    "is_published": true,
    "published_at": "2024-01-01T00:00:00.000000Z",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Lấy chi tiết tin tức thành công"
}
```

**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "Tin tức không tồn tại"
}
```

## Lấy tin tức nổi bật

### GET /api/news-featured

**Mô tả**: Lấy danh sách tin tức nổi bật

**Phương thức**: GET

**URL**: `/api/news-featured`

**Phân quyền**: Không yêu cầu authentication

**Tham số query**:

- `limit` (integer, optional): Số lượng tin tức trả về (mặc định: 5)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Khuyến mãi lớn cuối năm 2024",
      "slug": "khuyen-mai-lon-cuoi-nam-2024",
      "excerpt": "Cơ hội mua sắm với giá ưu đãi nhất trong năm...",
      "featured_image": "https://example.com/news-1.jpg",
      "category": "promotion",
      "view_count": 1251,
      "published_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "message": "Lấy tin tức nổi bật thành công"
}
```

## Tìm kiếm tin tức

### GET /api/news-search

**Mô tả**: Tìm kiếm tin tức theo từ khóa

**Phương thức**: GET

**URL**: `/api/news-search`

**Phân quyền**: Không yêu cầu authentication

**Tham số query**:

- `q` (string, required): Từ khóa tìm kiếm
- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số tin tức mỗi trang (mặc định: 10)

**Response**: Giống như `/api/news` nhưng chỉ trả về tin tức khớp với từ khóa

**Lưu ý**:

- Tất cả các endpoint news đều public, không cần authentication
- Chỉ trả về tin tức đã được publish (`is_published = true`)
- Khi xem chi tiết tin tức, `view_count` sẽ được tăng lên 1
- Category có thể là: "promotion", "news", "guide", "review"
- Tags là array các từ khóa liên quan
- Content có thể chứa HTML formatting
- Gallery có thể là array rỗng nếu tin tức không có ảnh phụ
