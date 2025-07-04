# 6. Bình luận (Comments)

## Lấy bình luận của sản phẩm

### GET /api/products/{product_id}/comments

**Mô tả**: Lấy danh sách bình luận của sản phẩm

**Phương thức**: GET

**URL**: `/api/products/{product_id}/comments`

**Phân quyền**: Không yêu cầu authentication

**Tham số URL**:

- `product_id` (integer, required): ID sản phẩm

**Tham số query**:
- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số bình luận mỗi trang (mặc định: 10)

**Response thành công (200)**:

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "product_id": 1,
      "content": "Sản phẩm rất tốt, đáng mua!",
      "rating": 5,
      "user": {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "user@example.com"
      },
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "first_page_url": "http://localhost:8000/api/products/1/comments?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/products/1/comments?page=1",
  "links": [
    {
      "url": null,
      "label": "&laquo; Previous",
      "active": false
    },
    {
      "url": "http://localhost:8000/api/products/1/comments?page=1",
      "label": "1",
      "active": true
    },
    {
      "url": null,
      "label": "Next &raquo;",
      "active": false
    }
  ],
  "next_page_url": null,
  "path": "http://localhost:8000/api/products/1/comments",
  "per_page": 10,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

## Thêm bình luận

### POST /api/products/{product_id}/comments

**Mô tả**: Thêm bình luận cho sản phẩm

**Phương thức**: POST

**URL**: `/api/products/{product_id}/comments`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `product_id` (integer, required): ID sản phẩm

**Body**:

```json
{
  "content": "Sản phẩm rất tốt, đáng mua!",
  "rating": 5
}
```

**Response thành công (201)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "content": "Sản phẩm rất tốt, đáng mua!",
    "rating": 5,
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "user@example.com"
    },
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Thêm bình luận thành công"
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "content": ["Nội dung bình luận là bắt buộc"],
    "rating": ["Đánh giá phải từ 1 đến 5 sao"]
  }
}
```

**Validation rules**:

- `content` (string, required): Nội dung bình luận
- `rating` (integer, required): Đánh giá từ 1-5 sao

## Sửa bình luận

### PUT /api/comments/{id}

**Mô tả**: Sửa bình luận (chỉ người tạo mới có thể sửa)

**Phương thức**: PUT

**URL**: `/api/comments/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `id` (integer, required): ID bình luận

**Body**:

```json
{
  "content": "Nội dung bình luận đã được cập nhật",
  "rating": 4
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "content": "Nội dung bình luận đã được cập nhật",
    "rating": 4,
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "user@example.com"
    },
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z"
  },
  "message": "Cập nhật bình luận thành công"
}
```

**Response lỗi (403)**:

```json
{
  "success": false,
  "message": "Bạn không có quyền sửa bình luận này"
}
```

## Xóa bình luận

### DELETE /api/comments/{id}

**Mô tả**: Xóa bình luận (chỉ người tạo mới có thể xóa)

**Phương thức**: DELETE

**URL**: `/api/comments/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID bình luận

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Xóa bình luận thành công"
}
```

**Response lỗi (403)**:

```json
{
  "success": false,
  "message": "Bạn không có quyền xóa bình luận này"
}
```

**Lưu ý**:

- Chỉ có thể xem bình luận mà không cần authentication
- Thêm, sửa, xóa bình luận yêu cầu authentication
- Chỉ người tạo bình luận mới có thể sửa/xóa
- Rating từ 1-5 sao (1 = rất tệ, 5 = rất tốt)
- Bình luận sẽ hiển thị thông tin người dùng (name, email)
