# 16. Quản lý liên hệ (Admin Contact)

> **Lưu ý**: Các endpoint quản lý liên hệ sử dụng prefix `/api/dashboard/contacts/*` và có thể truy cập bởi:
>
> - Admin (role: admin) - toàn quyền
> - Contributor (role: contributor) - có quyền quản lý liên hệ

## Lấy danh sách liên hệ (Admin)

### GET /api/dashboard/contacts

**Mô tả**: Lấy danh sách tất cả liên hệ trong hệ thống

**Phương thức**: GET

**URL**: `/api/dashboard/contacts`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `status` (string, optional): Lọc theo trạng thái (pending, resolved)
- `search` (string, optional): Tìm kiếm theo tên hoặc email
- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số liên hệ mỗi trang (mặc định: 15)

**Response thành công (200)**:

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "fullname": "Nguyễn Văn Tài",
      "email": "tai.nguyen@gmail.com",
      "message": "Xin chào, tôi muốn hỏi về chính sách đổi trả của cửa hàng. Tôi vừa mua một chiếc balo nhưng kích thước không phù hợp.",
      "status": "resolved",
      "created_at": "2025-08-02T19:37:55.000000Z",
      "updated_at": "2025-08-02T19:37:55.000000Z",
      "deleted_at": null
    },
    {
      "id": 2,
      "fullname": "Trần Thị Lan",
      "email": "lan.tran@gmail.com",
      "message": "Balo tôi đặt hôm qua đã được giao chưa ạ? Tôi cần gấp để đi công tác.",
      "status": "pending",
      "created_at": "2025-08-02T19:37:55.000000Z",
      "updated_at": "2025-08-02T19:37:55.000000Z",
      "deleted_at": null
    }
  ],
  "first_page_url": "http://localhost:8000/api/dashboard/contacts?page=1",
  "from": 1,
  "last_page": 2,
  "last_page_url": "http://localhost:8000/api/dashboard/contacts?page=2",
  "next_page_url": "http://localhost:8000/api/dashboard/contacts?page=2",
  "path": "http://localhost:8000/api/dashboard/contacts",
  "per_page": 15,
  "prev_page_url": null,
  "to": 15,
  "total": 22
}
```

## Lấy chi tiết liên hệ (Admin)

### GET /api/dashboard/contacts/{id}

**Mô tả**: Lấy chi tiết một liên hệ

**Phương thức**: GET

**URL**: `/api/dashboard/contacts/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID liên hệ

**Response thành công (200)**:

```json
{
  "data": {
    "id": 1,
    "fullname": "Nguyễn Văn Tài",
    "email": "tai.nguyen@gmail.com",
    "message": "Xin chào, tôi muốn hỏi về chính sách đổi trả của cửa hàng. Tôi vừa mua một chiếc balo nhưng kích thước không phù hợp.",
    "status": "resolved",
    "created_at": "2025-08-02T19:37:55.000000Z",
    "updated_at": "2025-08-02T19:37:55.000000Z",
    "deleted_at": null
  }
}
```

## Cập nhật trạng thái liên hệ

### PUT /api/dashboard/contacts/{id}

**Mô tả**: Cập nhật trạng thái liên hệ

**Phương thức**: PUT

**URL**: `/api/dashboard/contacts/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `id` (integer, required): ID liên hệ

**Body**:

```json
{
  "status": "resolved"
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Contact status updated successfully",
  "data": {
    "id": 5,
    "fullname": "Hoàng Văn Đức",
    "email": "duc.hoang@gmail.com",
    "message": "Tôi muốn mua balo laptop, cửa hàng có những loại nào phù hợp với laptop 15.6 inch?",
    "status": "resolved",
    "created_at": "2025-08-02T19:37:55.000000Z",
    "updated_at": "2025-08-02T21:39:32.000000Z",
    "deleted_at": null
  }
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "status": ["The selected status is invalid."]
  }
}
```

**Validation rules**:

- `status` (string, required): Trạng thái mới (pending, resolved)

## Xóa liên hệ

### DELETE /api/dashboard/contacts/{id}

**Mô tả**: Xóa liên hệ khỏi hệ thống

**Phương thức**: DELETE

**URL**: `/api/dashboard/contacts/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin hoặc Contributor

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID liên hệ

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

## Ví dụ sử dụng curl

### Lấy danh sách liên hệ

```bash
curl -X GET "http://localhost:8000/api/dashboard/contacts?status=pending&page=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Lọc theo trạng thái

```bash
curl -X GET "http://localhost:8000/api/dashboard/contacts?status=resolved&per_page=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Tìm kiếm liên hệ

```bash
curl -X GET "http://localhost:8000/api/dashboard/contacts?search=gmail" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Lấy chi tiết liên hệ

```bash
curl -X GET "http://localhost:8000/api/dashboard/contacts/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Cập nhật trạng thái liên hệ

```bash
curl -X PUT "http://localhost:8000/api/dashboard/contacts/5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

### Xóa liên hệ

```bash
curl -X DELETE "http://localhost:8000/api/dashboard/contacts/10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin hoặc contributor
- Trạng thái liên hệ theo database: `pending`, `resolved`
- Response GET danh sách trả về trực tiếp pagination data, không có wrapper `success`
- Response GET chi tiết có wrapper `{data: {...}}`
- Response PUT và DELETE có wrapper `success`, `message`, `data`
- Hỗ trợ soft delete cho liên hệ
- Có thể lọc theo trạng thái và tìm kiếm theo tên/email
- Tìm kiếm tiếng Việt có thể gặp vấn đề, nên sử dụng từ khóa tiếng Anh
