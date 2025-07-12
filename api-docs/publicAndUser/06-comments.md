# API Comments - Bình luận

Tài liệu này mô tả các API endpoint liên quan đến quản lý bình luận trong hệ thống BaloZone.

## 1. Lấy tất cả bình luận

### GET /api/comments

**Mô tả**: Lấy danh sách tất cả bình luận

**Phương thức**: GET

**URL**: `/api/comments`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Query Parameters** (optional):
- `page` (integer): Số trang (mặc định: 1)
- `per_page` (integer): Số bình luận mỗi trang (mặc định: 10)

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/comments" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 100,
      "product_id": 69,
      "user_id": 1,
      "content": "Phù hợp cho cả nam và nữ.",
      "rating": 5,
      "created_at": "2025-07-12T17:24:39.000000Z",
      "updated_at": "2025-07-12T17:24:39.000000Z",
      "deleted_at": null,
      "has_purchased": true,
      "user": {
        "id": 1,
        "name": "Admin BaloZone"
      },
      "product": {
        "id": 69,
        "name": "Balo Mini Cute ipsam"
      }
    },
    {
      "id": 101,
      "product_id": 1,
      "user_id": 2,
      "content": "Bình luận từ người chưa mua hàng",
      "rating": -1,
      "created_at": "2025-07-12T22:15:44.000000Z",
      "updated_at": "2025-07-12T22:15:44.000000Z",
      "deleted_at": null,
      "has_purchased": false,
      "user": {
        "id": 2,
        "name": "Nguyễn Văn A"
      },
      "product": {
        "id": 1,
        "name": "Balo JanSport SuperBreak Classic"
      }
    }
  ],
  "first_page_url": "http://localhost:8000/api/comments?page=1",
  "from": 1,
  "last_page": 10,
  "last_page_url": "http://localhost:8000/api/comments?page=10",
  "links": [
    {
      "url": null,
      "label": "&laquo; Previous",
      "active": false
    },
    {
      "url": "http://localhost:8000/api/comments?page=1",
      "label": "1",
      "active": true
    }
  ],
  "next_page_url": "http://localhost:8000/api/comments?page=2",
  "path": "http://localhost:8000/api/comments",
  "per_page": 10,
  "prev_page_url": null,
  "to": 10,
  "total": 100
}
```

## 2. Lấy chi tiết bình luận

### GET /api/comments/{id}

**Mô tả**: Lấy chi tiết một bình luận

**Phương thức**: GET

**URL**: `/api/comments/{id}`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Path Parameters**:
- `id` (integer, required): ID bình luận

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/comments/100" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "data": {
    "id": 100,
    "product_id": 69,
    "user_id": 1,
    "content": "Phù hợp cho cả nam và nữ.",
    "rating": 5,
    "created_at": "2025-07-12T17:24:39.000000Z",
    "updated_at": "2025-07-12T17:24:39.000000Z",
    "deleted_at": null,
    "has_purchased": true,
    "user": {
      "id": 1,
      "name": "Admin BaloZone"
    },
    "product": {
      "id": 69,
      "name": "Balo Mini Cute ipsam",
      "slug": "balo-mini-cute-ipsam-1903"
    }
  }
}
```

## 3. Lấy bình luận của sản phẩm

### GET /api/comments/product/{product_id}

**Mô tả**: Lấy danh sách bình luận của sản phẩm

**Phương thức**: GET

**URL**: `/api/comments/product/{product_id}`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Path Parameters**:
- `product_id` (integer, required): ID sản phẩm

**Query Parameters** (optional):
- `page` (integer): Số trang (mặc định: 1)
- `per_page` (integer): Số bình luận mỗi trang (mặc định: 10)

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/comments/product/69" -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 100,
      "product_id": 69,
      "user_id": 1,
      "content": "Đã cập nhật: phù hợp cho cả nam và nữ, thiết kế đẹp!",
      "rating": 5,
      "created_at": "2025-07-12T17:24:39.000000Z",
      "updated_at": "2025-07-12T21:57:50.000000Z",
      "deleted_at": null,
      "user": {
        "id": 1,
        "name": "Admin BaloZone",
        "email": "admin@balozone.com"
      }
    },
    {
      "id": 40,
      "product_id": 69,
      "user_id": 11,
      "content": "Màu sắc đẹp, chất liệu cao cấp.",
      "rating": 5,
      "created_at": "2025-07-12T17:24:38.000000Z",
      "updated_at": "2025-07-12T17:24:38.000000Z",
      "deleted_at": null,
      "user": {
        "id": 11,
        "name": "Prof. Georgianna Braun IV",
        "email": "ischowalter@example.net"
      }
    }
  ],
  "first_page_url": "http://localhost:8000/api/comments/product/69?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/comments/product/69?page=1",
  "links": [
    {
      "url": null,
      "label": "&laquo; Previous",
      "active": false
    },
    {
      "url": "http://localhost:8000/api/comments/product/69?page=1",
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
  "path": "http://localhost:8000/api/comments/product/69",
  "per_page": 10,
  "prev_page_url": null,
  "to": 2,
  "total": 2
}
```

## 4. Lấy bình luận của người dùng hiện tại

### GET /api/my-comments

**Mô tả**: Lấy danh sách bình luận của người dùng hiện tại

**Phương thức**: GET

**URL**: `/api/my-comments`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:
```
Authorization: Bearer {token}
Accept: application/json
```

**Query Parameters** (optional):
- `page` (integer): Số trang (mặc định: 1)
- `per_page` (integer): Số bình luận mỗi trang (mặc định: 10)

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/my-comments" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 100,
      "product_id": 69,
      "user_id": 1,
      "content": "Phù hợp cho cả nam và nữ.",
      "rating": 5,
      "created_at": "2025-07-12T17:24:39.000000Z",
      "updated_at": "2025-07-12T17:24:39.000000Z",
      "deleted_at": null,
      "product": {
        "id": 69,
        "name": "Balo Mini Cute ipsam",
        "slug": "balo-mini-cute-ipsam-1903",
        "image": "https://placehold.co/600x400?text=products/balo-mini-cute-ipsam.jpg"
      }
    },
    {
      "id": 94,
      "product_id": 122,
      "user_id": 1,
      "content": "Mình rất hài lòng với sản phẩm này.",
      "rating": 4,
      "created_at": "2025-07-12T17:24:39.000000Z",
      "updated_at": "2025-07-12T17:24:39.000000Z",
      "deleted_at": null,
      "product": {
        "id": 122,
        "name": "Túi Xách Nữ Thời Trang tempora",
        "slug": "tui-xach-nu-thoi-trang-tempora-7716",
        "image": "https://placehold.co/600x400?text=products/tui-xach-nu-thoi-trang-tempora.jpg"
      }
    }
  ],
  "first_page_url": "http://localhost:8000/api/my-comments?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/my-comments?page=1",
  "links": [
    {
      "url": null,
      "label": "&laquo; Previous",
      "active": false
    },
    {
      "url": "http://localhost:8000/api/my-comments?page=1",
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
  "path": "http://localhost:8000/api/my-comments",
  "per_page": 10,
  "prev_page_url": null,
  "to": 8,
  "total": 8
}
```

## 5. Cập nhật bình luận

### PUT /api/comments/{id}

**Mô tả**: Cập nhật bình luận (chỉ người tạo mới có thể sửa)

**Phương thức**: PUT

**URL**: `/api/comments/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `id` (integer, required): ID bình luận

**Body**:
```json
{
  "product_id": 69,
  "content": "Đã cập nhật: phù hợp cho cả nam và nữ, thiết kế đẹp!",
  "rating": 5
}
```

**cURL**:
```bash
curl -X PUT "http://localhost:8000/api/comments/100" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 69, "content": "Đã cập nhật: phù hợp cho cả nam và nữ, thiết kế đẹp!", "rating": 5}'
```

**Response thành công (200)**:
```json
{
  "message": "Bình luận đã được cập nhật",
  "data": {
    "id": 100,
    "product_id": 69,
    "user_id": 1,
    "content": "Đã cập nhật: phù hợp cho cả nam và nữ, thiết kế đẹp!",
    "rating": 5,
    "created_at": "2025-07-12T17:24:39.000000Z",
    "updated_at": "2025-07-12T21:57:50.000000Z",
    "deleted_at": null,
    "user": {
      "id": 1,
      "name": "Admin BaloZone"
    },
    "product": {
      "id": 69,
      "name": "Balo Mini Cute ipsam"
    }
  }
}
```

**Validation rules**:
- `product_id` (integer, required): ID sản phẩm
- `content` (string, required): Nội dung bình luận
- `rating` (integer, required): Đánh giá từ 1-5 sao

## 6. Xóa bình luận

### DELETE /api/comments/{id}

**Mô tả**: Xóa bình luận (chỉ người tạo mới có thể xóa)

**Phương thức**: DELETE

**URL**: `/api/comments/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (integer, required): ID bình luận

**cURL**:
```bash
curl -X DELETE "http://localhost:8000/api/comments/93" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**Response thành công (200)**:
```json
{
  "message": "Bình luận đã được xóa mềm"
}
```

## 7. Lấy bình luận của sản phẩm (Legacy)

### GET /api/comments/product/{product_id}/legacy

**Mô tả**: Lấy danh sách bình luận của sản phẩm (route legacy để tương thích ngược)

**Phương thức**: GET

**URL**: `/api/comments/product/{product_id}/legacy`

**Phân quyền**: Không yêu cầu

**Headers**: 
```
Accept: application/json
```

**Path Parameters**:
- `product_id` (integer, required): ID sản phẩm

**cURL**:
```bash
curl -X GET "http://localhost:8000/api/comments/product/69/legacy" -H "Accept: application/json"
```

**Response**: Giống như endpoint `/api/comments/product/{product_id}`

**Response lỗi (404)**:
```json
{
  "message": "Comment not found"
}
```

**Response lỗi (403)**:
```json
{
  "message": "Bạn không có quyền truy cập bình luận này"
}
```

**Response lỗi (500)**:
```json
{
  "message": "Server Error"
}
```

---

## Lưu ý quan trọng

### Business Rules
1. **Bình luận tự do**: User có thể bình luận về bất kỳ sản phẩm nào mà không cần mua trước
2. **Rating có điều kiện**: 
   - Người đã mua hàng: có thể đánh giá 1-5 sao, rating này sẽ tính vào điểm trung bình của sản phẩm
   - Người chưa mua hàng: rating tự động đặt là -1 và không tính vào điểm trung bình của sản phẩm
3. **Badge "Đã mua hàng"**: Hiển thị trường `has_purchased` để phân biệt người đã mua và chưa mua
4. **Quyền sở hữu**: Chỉ người tạo bình luận mới có thể sửa/xóa
5. **Soft delete**: Bình luận bị xóa sẽ được soft delete (không xóa vĩnh viễn)
6. **Một bình luận mỗi sản phẩm**: Mỗi user chỉ được bình luận một lần cho mỗi sản phẩm

### Data Structure
- Bình luận hiển thị thông tin user (name, email trong một số endpoint)
- Bình luận hiển thị thông tin product (name, slug, image)
- **Trường `has_purchased`**: `true` nếu đã mua, `false` nếu chưa mua
- **Rating**: Số từ 1-5 cho người đã mua, -1 cho người chưa mua
- Support pagination cho tất cả list endpoints
- Có timestamp cho created_at, updated_at, deleted_at

### API Patterns  
- **Public endpoints**: Xem bình luận không cần authentication
- **Protected endpoints**: Thêm, sửa, xóa cần Bearer token
- **Legacy support**: Route `/legacy` được giữ lại để tương thích ngược
- **Consistent response**: Sử dụng format response chuẩn với message và data

## Thêm bình luận

### POST /api/comments

**Mô tả**: Thêm bình luận mới

**Phương thức**: POST

**URL**: `/api/comments`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "product_id": 1,
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
    "product_id": ["ID sản phẩm là bắt buộc"],
    "content": ["Nội dung bình luận là bắt buộc"],
    "rating": ["Đánh giá phải từ 1 đến 5 sao"]
  }
}
```

**Validation rules**:
- `product_id` (integer, required): ID sản phẩm
- `content` (string, required): Nội dung bình luận (10-1000 ký tự)
- `rating` (integer, required): Đánh giá từ 1-5 sao
  - **Lưu ý**: Hệ thống sẽ tự động đặt rating = -1 cho người chưa mua hàng
  - **Rating = -1**: Không tính vào điểm trung bình của sản phẩm
  - **Rating 1-5**: Chỉ áp dụng cho người đã mua hàng và tính vào điểm trung bình

**Response format**:
- Trường `has_purchased`: `true` nếu đã mua hàng, `false` nếu chưa mua
- Trường `rating`: Số từ 1-5 cho người đã mua, -1 cho người chưa mua

## Thêm bình luận cho sản phẩm

### POST /api/comments/product/{product_id}

**Mô tả**: Thêm bình luận cho sản phẩm cụ thể

**Phương thức**: POST

**URL**: `/api/comments/product/{product_id}`

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
- Có 2 cách để thêm bình luận: `/api/comments` (cần truyền product_id) và `/api/comments/product/{product_id}` (không cần truyền product_id)

