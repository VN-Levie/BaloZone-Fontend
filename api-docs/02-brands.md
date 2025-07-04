# 2. Thương hiệu (Brands)

## Lấy danh sách thương hiệu

### GET /api/brands
**Mô tả**: Lấy danh sách tất cả thương hiệu

**Phương thức**: GET

**URL**: `/api/brands`

**Phân quyền**: Không yêu cầu authentication

**Tham số**: Không có

**Response thành công (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nike",
      "slug": "nike",
      "logo": "https://example.com/nike-logo.png",
      "description": "Thương hiệu thể thao hàng đầu thế giới",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Adidas",
      "slug": "adidas",
      "logo": "https://example.com/adidas-logo.png",
      "description": "Thương hiệu thể thao Đức",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "message": "Lấy danh sách thương hiệu thành công"
}
```

**Response lỗi (500)**:
```json
{
  "success": false,
  "message": "Lỗi hệ thống khi lấy danh sách thương hiệu"
}
```

**Lưu ý**:
- Endpoint này public, không cần authentication
- Trả về tất cả thương hiệu có trong hệ thống
- Slug được sử dụng để tạo URL thân thiện
