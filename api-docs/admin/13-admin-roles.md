# 13. Quản lý vai trò (Admin Roles)

> **Lưu ý**: Các endpoint quản lý vai trò sử dụng `/api/dashboard/roles/*` nhưng chỉ dành cho Admin (role: admin).  
> Contributor không có quyền truy cập vào các endpoint này.

## Lấy danh sách vai trò

### GET /api/dashboard/roles

**Mô tả**: Lấy danh sách tất cả vai trò trong hệ thống

**Phương thức**: GET

**URL**: `/api/dashboard/roles`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "display_name": "Quản trị viên",
      "description": "Có toàn quyền quản lý hệ thống",
      "permissions": [
        "users.view",
        "users.create",
        "users.update",
        "users.delete",
        "products.view",
        "products.create",
        "products.update",
        "products.delete",
        "orders.view",
        "orders.update"
      ],
      "users_count": 2,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "staff",
      "display_name": "Nhân viên",
      "description": "Quản lý sản phẩm và đơn hàng",
      "permissions": [
        "products.view",
        "products.create",
        "products.update",
        "orders.view",
        "orders.update"
      ],
      "users_count": 5,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 3,
      "name": "customer",
      "display_name": "Khách hàng",
      "description": "Người dùng thông thường",
      "permissions": [
        "orders.view",
        "profile.update"
      ],
      "users_count": 150,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "message": "Lấy danh sách vai trò thành công"
}
```

## Phân quyền vai trò cho người dùng

### POST /api/dashboard/roles/assign

**Mô tả**: Phân quyền vai trò cho người dùng

**Phương thức**: POST

**URL**: `/api/dashboard/roles/assign`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "user_id": 10,
  "role_id": 2
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 10,
      "name": "Nguyễn Văn B",
      "email": "staff@example.com"
    },
    "role": {
      "id": 2,
      "name": "staff",
      "display_name": "Nhân viên"
    },
    "assigned_at": "2024-01-01T12:00:00.000000Z"
  },
  "message": "Phân quyền vai trò thành công"
}
```

**Response lỗi (422)**:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "user_id": ["Người dùng không tồn tại"],
    "role_id": ["Vai trò không tồn tại"]
  }
}
```

**Response lỗi (409)**:

```json
{
  "success": false,
  "message": "Người dùng đã có vai trò này"
}
```

**Validation rules**:

- `user_id` (integer, required): ID người dùng
- `role_id` (integer, required): ID vai trò

## Xóa vai trò của người dùng

### POST /api/dashboard/roles/remove

**Mô tả**: Xóa vai trò của người dùng

**Phương thức**: POST

**URL**: `/api/dashboard/roles/remove`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "user_id": 10,
  "role_id": 2
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Xóa vai trò thành công"
}
```

**Response lỗi (404)**:

```json
{
  "success": false,
  "message": "Người dùng không có vai trò này"
}
```

## Lấy danh sách người dùng theo vai trò

### GET /api/dashboard/roles/{id}/users

**Mô tả**: Lấy danh sách người dùng có vai trò cụ thể

**Phương thức**: GET

**URL**: `/api/dashboard/roles/{id}/users`

**Phân quyền**: Yêu cầu authentication (Bearer Token) + Role Admin

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `id` (integer, required): ID vai trò

**Tham số query**:

- `page` (integer, optional): Số trang (mặc định: 1)
- `per_page` (integer, optional): Số người dùng mỗi trang (mặc định: 10)

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "role": {
      "id": 2,
      "name": "staff",
      "display_name": "Nhân viên"
    },
    "users": {
      "current_page": 1,
      "data": [
        {
          "id": 10,
          "name": "Nguyễn Văn B",
          "email": "staff1@example.com",
          "phone": "0123456789",
          "assigned_at": "2024-01-01T12:00:00.000000Z",
          "created_at": "2024-01-01T00:00:00.000000Z",
          "updated_at": "2024-01-01T00:00:00.000000Z"
        }
      ],
      "first_page_url": "http://example.com/api/dashboard/roles/2/users?page=1",
      "from": 1,
      "last_page": 1,
      "last_page_url": "http://example.com/api/dashboard/roles/2/users?page=1",
      "next_page_url": null,
      "path": "http://example.com/api/dashboard/roles/2/users",
      "per_page": 10,
      "prev_page_url": null,
      "to": 5,
      "total": 5
    }
  },
  "message": "Lấy danh sách người dùng theo vai trò thành công"
}
```

**Lưu ý**:

- Tất cả các endpoint đều yêu cầu authentication + role admin
- Hệ thống có 3 vai trò chính: admin, staff, customer
- Một người dùng có thể có nhiều vai trò
- Permissions được định nghĩa theo format `resource.action`
- Vai trò `customer` được gán tự động khi đăng ký
- Chỉ admin mới có thể phân quyền vai trò cho người khác
- Không thể xóa vai trò `customer` của người dùng thông thường
