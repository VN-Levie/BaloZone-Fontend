# 15. Quản lý người dùng (Admin Users)

## Lấy danh sách người dùng (Admin)

### GET /api/admin/users

**Mô tả**: Lấy danh sách tất cả người dùng trong hệ thống

**Phương thức**: GET

**URL**: `/api/admin/users`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số query**:

- `role` (string, optional): Lọc theo vai trò
- `status` (string, optional): Lọc theo trạng thái (active, inactive, banned)
- `search` (string, optional): Tìm kiếm theo tên hoặc email
- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số người dùng mỗi trang (mặc định: 10)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "phone": "0123456789",
        "status": "active",
        "email_verified_at": "2024-01-01T00:00:00.000000Z",
        "roles": [
          {
            "id": 3,
            "name": "customer",
            "display_name": "Khách hàng"
          }
        ],
        "orders_count": 5,
        "total_spent": 6500000,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "first_page_url": "http://example.com/api/admin/users?page=1",
    "from": 1,
    "last_page": 15,
    "last_page_url": "http://example.com/api/admin/users?page=15",
    "next_page_url": "http://example.com/api/admin/users?page=2",
    "path": "http://example.com/api/admin/users",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 145
  },
  "message": "Lấy danh sách người dùng thành công"
}
```

## Lấy chi tiết người dùng (Admin)

### GET /api/admin/users/{id}

**Mô tả**: Lấy chi tiết một người dùng

**Phương thức**: GET

**URL**: `/api/admin/users/{id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID người dùng

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "status": "active",
    "email_verified_at": "2024-01-01T00:00:00.000000Z",
    "roles": [
      {
        "id": 3,
        "name": "customer",
        "display_name": "Khách hàng",
        "assigned_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "addresses": [
      {
        "id": 1,
        "name": "Địa chỉ nhà riêng",
        "address": "123 Đường ABC, Phường XYZ",
        "ward": "Phường 1",
        "district": "Quận 1",
        "province": "TP. Hồ Chí Minh",
        "is_default": true
      }
    ],
    "order_summary": {
      "total_orders": 5,
      "total_spent": 6500000,
      "average_order_value": 1300000,
      "last_order_at": "2024-01-01T10:00:00.000000Z"
    },
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Lấy chi tiết người dùng thành công"
}
```

## Cập nhật thông tin người dùng (Admin)

### PUT /api/admin/users/{user}

**Mô tả**: Cập nhật thông tin người dùng

**Phương thức**: PUT

**URL**: `/api/admin/users/{user}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Tham số URL**:

- `user` (integer, required): ID người dùng

**Body**:

```json
{
  "name": "Nguyễn Văn A Updated",
  "email": "user-updated@example.com",
  "phone": "0987654321",
  "status": "inactive"
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A Updated",
    "email": "user-updated@example.com",
    "phone": "0987654321",
    "status": "inactive",
    "email_verified_at": "2024-01-01T00:00:00.000000Z",
    "roles": [
      {
        "id": 3,
        "name": "customer",
        "display_name": "Khách hàng"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z"
  }
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Validation errors",
  "errors": {
    "name": ["The name field is required."],
    "email": ["The email has already been taken."],
    "status": ["The selected status is invalid."]
  }
}
```

**Validation rules**:

- `name` (string, required, max:255): Tên người dùng
- `email` (string, required, email, max:255, unique): Email người dùng
- `phone` (string, optional, max:20): Số điện thoại
- `status` (string, required): Trạng thái (active, inactive)

## Xóa người dùng (Admin)

### DELETE /api/admin/users/{user}

**Mô tả**: Xóa người dùng

**Phương thức**: DELETE

**URL**: `/api/admin/users/{user}`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `user` (integer, required): ID người dùng

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Response lỗi (400) - Không thể xóa admin**:

```json
{
  "success": false,
  "message": "Cannot delete admin user"
}
```

**Response lỗi (400) - Có đơn hàng pending**:

```json
{
  "success": false,
  "message": "Cannot delete user with pending orders"
}
```

## Chuyển đổi trạng thái người dùng (Admin)

### POST /api/admin/users/{user}/toggle-status

**Mô tả**: Chuyển đổi trạng thái người dùng (active ↔ inactive)

**Phương thức**: POST

**URL**: `/api/admin/users/{user}/toggle-status`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `user` (integer, required): ID người dùng

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "status": "inactive",
    "email_verified_at": "2024-01-01T00:00:00.000000Z",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z"
  }
}
```

**Response lỗi (400)**:

```json
{
  "success": false,
  "message": "Cannot change admin status"
}
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin
- Admin có thể xem tất cả thông tin chi tiết của người dùng
- Có thể lọc và tìm kiếm người dùng theo nhiều tiêu chí (trong endpoint index)
- Trạng thái chỉ có 2 giá trị: "active", "inactive" (không có "banned")
- Không có avatar, date_of_birth, gender trong hệ thống
- Không thể xóa hoặc thay đổi trạng thái admin user
- Không thể xóa user có đơn hàng đang pending
- Toggle status sẽ chuyển đổi giữa active ↔ inactive
