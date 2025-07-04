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
      "id": 1,
      "name": "Balo",
      "slug": "balo",
      "description": "Các loại balo, túi xách",
      "image": "https://example.com/balo-category.jpg",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Giày dép",
      "slug": "giay-dep",
      "description": "Các loại giày, dép thể thao",
      "image": "https://example.com/shoes-category.jpg",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
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
